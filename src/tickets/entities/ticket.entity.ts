import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    ticketId: string
    @Column('int')
    ticketSeatNumber: number
    @Column('text',{default:'RESERVED'})
    ticketStatus: string
}
