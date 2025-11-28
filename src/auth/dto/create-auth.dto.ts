import { IsEmail, IsOptional, IsString, IsIn, MinLength, IsArray } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class CreateAuthDto extends User {
@IsEmail()
userEmail: string;
@IsString()
@MinLength(8)
userPassword: string;
@IsOptional()
@IsArray()
roles?: string[];
}
