import { IsInt, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateRouteDto {
    @IsUUID("4")
    @IsOptional()
    routeId:string
    @IsInt()
    @IsPositive()
    origin: number 
    @IsInt()
    @IsPositive()
    destination: number 
    @IsNumber()
    @IsPositive()
    routeBasePrice: number
    @IsInt()
    @IsPositive()
    routeEstimateDuration: number

    
}
