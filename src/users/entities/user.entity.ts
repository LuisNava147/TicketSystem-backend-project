import { Ticket } from "src/tickets/entities/ticket.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string
    @Column('text')
    userFullName:string
   @Column('text',{unique:true})
    userEmail:string
    @Column('text',{select:false})
    userPassword: string
    @Column('text',{array:true,default:['client']})
    roles: string[]
    @Column('bool',{default:true})
    isActive:boolean
    @Column('text',{nullable:true})
    indetifyDocumentUrl: string
    @CreateDateColumn()
    createdAt: Date
    @CreateDateColumn()
    updatedAt: Date

    @OneToMany(()=> Ticket, (ticket)=> ticket.user)
    ticket: Ticket[]
}
