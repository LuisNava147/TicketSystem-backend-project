import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    updateAt: Date


}
