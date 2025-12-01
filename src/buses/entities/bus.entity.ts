import { Trip } from "src/trips/entities/trip.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Bus {
@PrimaryGeneratedColumn('uuid')
    busId: string
    @Column('text',{unique:true})
    busPlateNumber: string
    @Column('int')
    busCapacity: number

    @OneToMany(()=> Trip, (trip)=> trip.bus)
    @JoinColumn({
        name:"tripId"
    })
    trip:Trip[]


}
