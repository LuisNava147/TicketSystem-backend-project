import { IsString,MaxLength,MinLength, IsEmail,IsOptional, IsArray, ArrayNotEmpty,IsObject, IsUUID, IsDateString} from "class-validator";

export class CreateTripDto {
@IsUUID()
routeId: string
@IsUUID()
busId: string
@IsDateString()
tripDepartureDate: Date

}
