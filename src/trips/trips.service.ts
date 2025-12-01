import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Repository } from 'typeorm';


@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository : Repository<Trip>,
  ){}

  async create(createTripDto: CreateTripDto) {
    const trip = this.tripRepository.create({
      tripDepartureDate: createTripDto.tripDepartureDate,
      tripStatus: 'SCHEDULED',
      route:{routeId: createTripDto.routeId},
      bus:{busId: createTripDto.busId},
    })
    return await this.tripRepository.save(trip);
  }

  async findAll(origin?:number, destination?:number) {
    const whereClause: any = {};
    if(origin){
      whereClause.route= {
        ...whereClause.route,
        origin: {
          id: origin
        }
      };
    }
    if(destination){
      whereClause.route= {
        ...whereClause.route,
        destination: {
          id: destination
        }
      }
    }
    return this.tripRepository.find({
      where: whereClause,
      relations: ['route', 'route.origin','route.destination','bus'],
      order: {tripDepartureDate:'ASC'}
    });
  }

  async findOne(id: string) {
    const trip = await this.tripRepository.findOne({
      where: {
        tripId: id
      },
      relations: ['route','route.origin','route.destination','bus']
    });
    if(!trip)throw new NotFoundException(`Viaje con ID ${id} no encontrado`)
    return trip;
  }

  async update(id: string, updateTripDto: UpdateTripDto) {
    const tripToUpdate = await this.tripRepository.preload({
      tripId:id,
      ...updateTripDto,
      route: updateTripDto.routeId ? {routeId: updateTripDto.routeId} : undefined,
      bus: updateTripDto.busId ? {busId : updateTripDto.busId} : undefined
    })
    if(!tripToUpdate)throw new NotFoundException()
    this.tripRepository.save(tripToUpdate)
  return tripToUpdate;
  }

  async remove(id: string) {
    const trip = await this.findOne(id)
    await this.tripRepository.remove(trip)
    return{
          mesagge: `El viaje con ID ${id} ha sido eliminado` 
      }
    }
}
