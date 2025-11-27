import { IsInt, IsOptional, IsPositive, IsUUID } from "class-validator";

export class CreateTicketDto {
    @IsUUID()
    tripId:string
    @IsUUID()
    @IsOptional()
    userId: string
    @IsInt()
    @IsPositive()
    ticketSeatNumber: number
}
