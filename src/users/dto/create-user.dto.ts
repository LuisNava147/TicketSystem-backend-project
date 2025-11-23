import { User } from "../entities/user.entity"
import { IsString,MaxLength,IsEmail,IsOptional,MinLength,IsIn } from "class-validator";
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class CreateUserDto extends User {
    @ApiProperty({
        default:"user@email.com"
    })
    @IsEmail()
    userEmail:string

    @ApiProperty({
        default:"1234AFKJSLS@"
    })
    @IsString()
    @MinLength(8)
    userPassword: string
    
    roles: string[]
    isActive:boolean
    indetifyDocumentUrl: string
    createdAt: Date
    updateAt: Date
}
