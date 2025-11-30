import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { RolesGuard } from 'src/auth/decorators/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('Admin')
  create(@Body() createBusDto: CreateBusDto) {
    return this.busesService.create(createBusDto);
  }

  @Get()
  findAll() {
    return this.busesService.findAll();
  }

  @Get(':id')
  findOneBy(@Param('id',ParseUUIDPipe)id:string, @Body()createBusDto:CreateBusDto){
    return this.busesService.findOneBy(id);
  }

  @Get('plate/:plateNumber')
  findOneByPlate(@Param('plateNumber',) plateNumber: string) {
    return this.busesService.findOneByPlate(plateNumber);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('Admin')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateBusDto: UpdateBusDto) {
    return this.busesService.update(id, updateBusDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('Admin')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.busesService.remove(id);
  }
}
