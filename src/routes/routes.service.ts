import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>
  ){}
  async create(createRouteDto: CreateRouteDto) {
    if(createRouteDto.origin==createRouteDto.destination){
      throw new BadRequestException('El origen y el destino no pueden ser el mismo lugar')
    }
    const route = this.routeRepository.create({
      routeBasePrice:createRouteDto.routeBasePrice,
      routeEstimateDuration: createRouteDto.routeEstimateDuration,
      origin: {locationId: createRouteDto.origin},
      destination: {locationId: createRouteDto.destination}

    });
    return await this.routeRepository.save(route);
  }

  findAll() {
    return this.routeRepository.find({
      relations:['origin','destination']
    });
  }

  findOne(id: string) {
    const route = this.routeRepository.findOne({
      where: {routeId:id},
      relations:['origin','destination']
    })
    if(!route)throw new NotFoundException('Ruta no encontrada')
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    const route = await this.routeRepository.preload({
      routeId:id,
      ...updateRouteDto, 
      origin: updateRouteDto.origin ? {locationId: updateRouteDto.origin} : undefined ,
      destination: updateRouteDto.destination ? {locationId: updateRouteDto.destination} : undefined,
    })
    if(!route)throw new NotFoundException('Ruta no encontrada ')
    return this.routeRepository.save(route);
  }

  async remove(id: string) {
    this.findOne(id);
    await this.routeRepository.delete({
      routeId:id
    })
    return(
      "Ruta eliminada"
    );

  }
}
