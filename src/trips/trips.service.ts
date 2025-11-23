import { Injectable } from '@nestjs/common';
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
      route:{routeId: createTripDto.routeId},
      bus:{busId: createTripDto.busId},
      tripStatus: 'SCHEDULED'
    })
    return await this.tripRepository.save(trip);
  }

  findAll() {
    return this.tripRepository.find({
      relations: ['route', 'route.origin','route.destination','bus'],
      order: {tripDepartureDate:'ASC'}
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} trip`;
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
  }

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }
}
