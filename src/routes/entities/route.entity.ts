import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Route {
    @PrimaryGeneratedColumn('uuid')
    routeId: string
    @Column('decimal',{precision:10,scale:2})
    routeBasePrice: number;
    @Column('int')
    routeEstimateDuration: number
}
