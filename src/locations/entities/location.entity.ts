import { Route } from "src/routes/entities/route.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Location {
    @PrimaryGeneratedColumn('increment')
    locationId: number
    @Column('text',{unique:true})
    locationName: string

    @OneToMany(()=> Route,(route)=>route.origin)
    departingRoutes: Route[]
    @OneToMany(()=> Route,(route)=> route.destination)
    arrivingRoutes: Route[]
}
