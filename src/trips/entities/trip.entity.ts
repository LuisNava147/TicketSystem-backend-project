import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Trip {
    @PrimaryGeneratedColumn('uuid')
    tripId: string
    @Column('timestamp')
    tripDepartureDate: Date
    @Column('text',{default:'SCHEDULED'})
    tripStatus: string
}
