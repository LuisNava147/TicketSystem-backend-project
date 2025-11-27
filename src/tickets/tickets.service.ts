import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { Trip } from 'src/trips/entities/trip.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository : Repository<Ticket>,
    @InjectRepository(Trip)
    private readonly tripRepository : Repository<Trip>,

  ){}
  
  async create(createTicketDto: CreateTicketDto) {
    const {tripId, userId, ticketSeatNumber} = createTicketDto;

    const trip = await this.tripRepository.findOne({
      where: {tripId:tripId},
      relations:['bus'],
    })
    if(!trip)throw new NotFoundException('El viaje no existe');
    if(ticketSeatNumber > trip.bus.busCapacity){
      throw new BadRequestException(`El asiento ${ticketSeatNumber} no existe. El autobus solo tiene ${trip.bus.busCapacity} lugares`)
    }
    const newTicket = this.ticketRepository.create({
      
      ticketSeatNumber: ticketSeatNumber,
      ticketStatus: 'RESERVED',
      trip: {tripId: tripId},
      user: {userId: userId} ,
    });
    try{
      return await this.ticketRepository.save(newTicket);
    }catch(error){
      if(error.code == '23505'){
        throw new ConflictException('Lo sentimos, este asiento acaba de ser ocupado por otra persona');
      }
      throw new BadRequestException('Error al procesar la compra');
    }
  }


  findAll() {
    return this.ticketRepository.find({
      relations:[
        'trip',
        'trip.bus',
        'trip.route',
        'trip.route.origin',
        'trip.route.destination',
        'user'
    ]
    });
  }

  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOne({
      where:{ticketId: id},
      relations: [
        'trip',
        'trip.bus',
        'trip.route',
        'trip.route.origin',
        'trip.route.destination',
        'user'
      ]
    })
    if(!ticket)throw new NotFoundException('Ticket no encontrado')
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const {ticketSeatNumber, tripId} = updateTicketDto
    if(ticketSeatNumber){

    }
    const ticket = await this.ticketRepository.preload({
      ticketId: id,
      ...updateTicketDto,
      trip: tripId ? {tripId: tripId} : undefined,
    user: updateTicketDto.userId ? {userId: updateTicketDto.userId} : undefined,
    })
    if(!ticket)throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    try{
      return await this.ticketRepository.save(ticket);
    }catch(error){
      if(error.code == '23505'){
        throw new ConflictException('Este asiento ya está ocupado en este viaje');
      }
      throw new BadRequestException('Error al actualizar el ticket');
    }
  }

  async remove(id: string) {
    const ticket = await this.ticketRepository.findOne({
      where: {
        ticketId: id
      } as any,
    })
    if(!ticket){
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`)
    }
    await this.ticketRepository.remove(ticket);
    return {
      message: `Ticket ${id} eliminado y asiento liberado`
    }
  }
}
