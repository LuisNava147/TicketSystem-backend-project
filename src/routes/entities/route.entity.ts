import { Location } from "src/locations/entities/location.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Route {
    @PrimaryGeneratedColumn('uuid')
    routeId: string
    @Column('decimal',{precision:10,scale:2})
    routeBasePrice: number;
    @Column('int')
    routeEstimateDuration: number

    @ManyToOne(()=> Location, {eager:true})
    @JoinColumn({
        name:"originLocation"
    })
    origin: Location
    @ManyToOne(()=> Location, {eager:true})
    @JoinColumn({
        name:"destinationLocation"
    })
    destination: Location
}
