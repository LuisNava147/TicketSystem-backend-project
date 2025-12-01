import { IsInt, IsOptional, IsPositive, IsUUID,IsIn, IsString } from "class-validator";

export class CreateTicketDto {
    @IsUUID()
    tripId:string
    @IsUUID()
    @IsOptional()
    userId: string
    @IsInt()
    @IsPositive()
    ticketSeatNumber: number
    @IsOptional()
    @IsString()
    @IsIn(['RESERVED', 'PAID', 'CANCELLED']) 
  ticketStatus?: string;
}
