import { IsString,MaxLength,MinLength, IsEmail,IsOptional, IsArray, ArrayNotEmpty,IsObject, IsUUID, IsDateString, IsInt, Min} from "class-validator";

export class CreateBusDto {
    @IsString()
    @MinLength(4)
    busPlateNumber: string 
    @IsInt()
    @Min(10)
    busCapacity: number

}
