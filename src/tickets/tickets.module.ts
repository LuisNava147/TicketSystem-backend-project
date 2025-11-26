import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Trip } from 'src/trips/entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket,Trip])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
