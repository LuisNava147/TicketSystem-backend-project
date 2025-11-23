import { IsString,MaxLength,MinLength, IsEmail,IsOptional, IsArray, ArrayNotEmpty,IsObject, IsUUID} from "class-validator";

export class CreateLocationDto {
@IsString()
@MinLength(4)
locationName: string

}
