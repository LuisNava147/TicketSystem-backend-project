import { Location } from "src/locations/entities/location.entity";
import { Trip } from "src/trips/entities/trip.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Route {
    @PrimaryGeneratedColumn('uuid')
    routeId: string
    @Column('decimal',{precision:10,scale:2})
    routeBasePrice: number;
    @Column('int')
    routeEstimateDuration: number

    @ManyToOne(()=> Location, (location)=> location.departingRoutes, {eager:true})
    @JoinColumn({
        name:"originLocation"
    })
    origin: Location
    @ManyToOne(()=> Location,(location)=> location.arrivingRoutes, {eager:true})
    @JoinColumn({
        name:"destinationLocation"
    })
    destination: Location
    @OneToMany(()=>Trip,(trip)=> trip.route)
    trip: Trip[]
}
