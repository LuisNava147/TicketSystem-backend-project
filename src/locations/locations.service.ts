import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ){}

  async create(createLocationDto: CreateLocationDto) {
    try{
      const location = this.locationRepository.create(createLocationDto)
      await this.locationRepository.save(location)
      return location;
    }catch(error){
      if(error.code == '23505'){
        throw new BadRequestException(`El estado ${createLocationDto.locationName} ya existe`);
      }
      throw new InternalServerErrorException('Error al crear location');
    }
  }

  findAll() {
    return this.locationRepository.find();
  }

  async findOne(id: number) {
      const location = await this.locationRepository.findOneBy({
        locationId: id,
      })
      if(!location)throw new NotFoundException('Locación no encontrada');
      return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    const location = await this.locationRepository.preload({
      locationId: id,
      ...updateLocationDto,
    })
    if(!location)throw new NotFoundException ('La locación no se puede actualizar')
    try{
      await this.locationRepository.save(location)
      return location;
  }catch(error){
    if(error.code == '23505'){
      throw new BadRequestException(`Ya existe la locación '${updateLocationDto.locationName}'`)
    }
    throw new InternalServerErrorException('Error al actualizar la locación')
  }
  }

  remove(id: number) {
    return this.locationRepository.delete({
      locationId: id
    });
  }
}
