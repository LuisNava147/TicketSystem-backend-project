import { Trip } from "src/trips/entities/trip.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['trip','ticketSeatNumber'])
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    ticketId: string
    @Column('int')
    ticketSeatNumber: number
    @Column('text',{default:'RESERVED'})
    ticketStatus: string

    @ManyToOne(()=> Trip)
    @JoinColumn({
        name:"tripId"
    })
    trip: Trip
    @ManyToOne(()=> User)
    @JoinColumn({
        name:"userId"
    })
    user: User;
}
