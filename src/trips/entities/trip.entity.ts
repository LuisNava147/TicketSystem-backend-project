import { Bus } from "src/buses/entities/bus.entity";
import { Route } from "src/routes/entities/route.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Trip {
    @PrimaryGeneratedColumn('uuid')
    tripId: string
    @Column('timestamp')
    tripDepartureDate: Date
    @Column('text',{default:'SCHEDULED'})
    tripStatus: string

    @ManyToOne(()=> Route, {eager:true})
    @JoinColumn({
        name:"routeId"
    })
    route: Route
    @ManyToOne(()=> Bus, (bus)=> bus.trips, {eager:true})
    @JoinColumn({
        name: "busId"
    })
    bus: Bus
}
