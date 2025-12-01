import { Injectable, NotFoundException, BadRequestException,InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class UsersService {
  private readonly s3Client = new S3Client({
    region: process.env.bucket_region!,
    credentials:{
      accessKeyId: process.env.accesskey_bucket!,
      secretAccessKey: process.env.secretkey_bucket!,
    }
  });
  constructor(
    @InjectRepository(User)
    private readonly userReposity: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto) {
    try{
      const {userPassword, ...userData} = createUserDto;

      const user = this.userReposity.create(createUserDto)
      return await this.userReposity.save(user);
    }catch(error){
      this.handleDBErrors(error); 
    }
  }

  findAll() {
    return this.userReposity.find();
  }

  async findOne(id: string) {
    const user = await this.userReposity.findOneBy({
      userId:id
    })
    if(!user)throw new NotFoundException(`Usuario con ID ${id} no encontrado`)
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const {userPassword, ...rest} = updateUserDto;
    const updateData : any = {...rest};
    if(userPassword){
      updateData.userPassword = bcrypt.hashSync(userPassword, 10);
    }
    const user = await this.userReposity.preload({
      userId: id,
      ...updateData,
    })
    if(!user)throw new NotFoundException(`Usuario con ID ${id} no encontrado`)

    try{
      return await this.userReposity.save(user);
    }catch(error){
      this.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id)
    await this.userReposity.remove(user)
    return {
      message: 'Usuario eliminado'
    }
  }

  private handleDBErrors(error: any):never{
      if(error.code == '23505'){
        throw new BadRequestException('El correo electronico ya está registrado');
      }
      throw new InternalServerErrorException('Error al eliminar el usuario')
  }

  async findOneByEmail(email:string){
    
    return this.userReposity.findOne({
      where:{userEmail: email},
      select: ['userId','userEmail','userPassword','userFullName','roles','indetifyDocumentUrl']
    })
  }

  async uploadIdentityDocument(id:string, file: Express.Multer.File){
    const user = await this.findOne(id);
    if(user.indetifyDocumentUrl){
      const oldFileName = user.indetifyDocumentUrl.split('/').pop();
      try{
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.bucket_name,
            Key: oldFileName
          }),
        );
        //console.log(`Archivo anterior eliminado: ${oldFileName}`);
      }catch(error){
        console.warn('No se puede borrar el archivo anterior, ',error);
      }
    }
    
    const fileExtension = file.originalname.split('.').pop();
    const fileName= `${uuidv4()}.${fileExtension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.bucket_name,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
    );
    const url = `https://${process.env.bucket_name}.s3.amazonaws.com/${fileName}`;
    user.indetifyDocumentUrl = url
    return await this.userReposity.save(user);
  }
}
