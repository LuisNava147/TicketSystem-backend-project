import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { Trip } from 'src/trips/entities/trip.entity';
import { ILike } from 'typeorm';

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


  // MÉTODO PARA CLIENTE (Mis Boletos)
  async findMyTickets(id: string) {
    return this.ticketRepository.find({
      // Usamos 'userId' porque así se llama en tu Entidad User personalizada
      where: { user: { userId: id } } as any, 
      
      relations: [
        'trip', 
        'trip.bus', 
        'trip.route', 
        'trip.route.origin', 
        'trip.route.destination',
        'user'
      ],
      order: { ticketSeatNumber: 'ASC' } 
    });
  }

  // MÉTODO PARA ADMIN (Todos los boletos + Búsqueda)
  async findAll(term?: string) {
    let whereOption: any = {};

    if (term) {
      whereOption = [
        // Búsqueda por nombre (userFullName)
        { user: { userFullName: ILike(`%${term}%`) } },
        // Búsqueda por email (userEmail)
        { user: { userEmail: ILike(`%${term}%`) } }
      ];

      // Si es UUID, buscamos por ID del ticket
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(term);
      if (isUUID) {
        whereOption.push({ ticketId: term }); // Tu nombre ticketId
      }
    }

    return this.ticketRepository.find({
      where: whereOption,
      relations: [
        'trip', 'trip.bus', 'trip.route', 'trip.route.origin', 'trip.route.destination', 'user'
      ],
      order: { ticketSeatNumber: 'ASC' }
    });
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
  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { ticketId: id } as any, // Usamos tu nombre de variable
      relations: [
        'trip', 
        'trip.bus', 
        'trip.route', 
        'trip.route.origin', 
        'trip.route.destination', 
        'user'
      ]
    });

    if (!ticket) throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    return ticket;
  }
 
}
