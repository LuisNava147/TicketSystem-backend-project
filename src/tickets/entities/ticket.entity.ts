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
    @Column('text')
    ticketStatus: string

    @ManyToOne(()=> Trip)
    @JoinColumn({
        name:"tripId"
    })
    trip: Trip
    @ManyToOne(()=> User, (user)=> user.ticket)
    @JoinColumn({
        name:"userId"
    })
    user: User;
}
