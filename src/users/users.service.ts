import { Injectable, NotFoundException, BadRequestException,InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userReposity: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto) {
    try{
      const {userPassword, ...userData} = createUserDto;

      const user = this.userReposity.create({
        ...userData,
        userPassword: bcrypt.hashSync(userPassword, 10),
      })
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
}
