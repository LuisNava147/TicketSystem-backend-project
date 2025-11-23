import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Bus {
@PrimaryGeneratedColumn('uuid')
busId: string
@Column('text',{unique:true})
busPlateNumber: string
@Column('int')
busCapacity: number


}
