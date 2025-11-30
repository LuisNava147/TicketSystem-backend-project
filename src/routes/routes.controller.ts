import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/decorators/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('Admin')
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('Admin')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles('Admin')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.routesService.remove(id);
  }
}
