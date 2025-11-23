import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BusesService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>
  ){}
  
  async create(createBusDto: CreateBusDto) {
    try{
      const bus = this.busRepository.create(createBusDto)
      await this.busRepository.save(bus);
      return bus;
    }catch(error){
      if(error.code == '23505'){
        throw new BadRequestException(`El autobus con placas '${createBusDto.busPlateNumber}' ya existe`)
      }
      throw new InternalServerErrorException('Error creando el autobus');
    }
    
  }

  findAll() {
    return this.busRepository.find();
  }

  findOneBy(id:string){
    const bus =this.busRepository.findOneBy({
      busId: id
    })
    if(!bus)throw new NotFoundException('Autobus no encontrado')
    return bus;
  }

  findOneByPlate(plateNumber: string) {
    const bus = this.busRepository.findOneBy({
      busPlateNumber: plateNumber
    })
    if(!bus)throw new NotFoundException('Autobus no encontrado')
    return bus;
  }

 async update(id: string, updateBusDto: UpdateBusDto) {
    const bus = await this.busRepository.preload({
      busId: id,
    ...updateBusDto,
    })
    if(!bus)throw new NotFoundException('El autobus no se pudo actualizar')
    try{
      await this.busRepository.save(bus)
      return bus;
    }catch(error){
      if(error.code == '23505'){
        throw new BadRequestException(`Ya existe un autobus con las placas '${bus.busPlateNumber}'`)
      }
      throw new InternalServerErrorException('Error al actualizar el autobus')
    }
    
  }

  remove(id: string) {
    this.busRepository.delete({
      busId: id
    })
    return(
      "Autobus eliminado"
    );
  }
}
