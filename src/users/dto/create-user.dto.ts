import { User } from "../entities/user.entity"
import { IsString,MaxLength,IsEmail,IsOptional,MinLength,IsIn, IsArray } from "class-validator";
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class CreateUserDto extends User {
    @IsString()
    @MinLength(3)
    userFullName: string;
    @ApiProperty({
        default:"user@email.com"
    })
    @IsEmail()
    userEmail:string

    @ApiProperty({
        default:"1234AFKJSLS@"
    })
    @IsString()
    @MinLength(8, {message: "La contraseña debe contener al menos 8 caracteres"})
    userPassword: string
    
    @IsArray()
    @IsOptional()
    roles?: string[]

    isActive:boolean
    indetifyDocumentUrl: string
    createdAt: Date
    updateAt: Date
}
