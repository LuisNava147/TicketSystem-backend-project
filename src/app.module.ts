import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';
import { BusesModule } from './buses/buses.module';
import { RoutesModule } from './routes/routes.module';
import { TripsModule } from './trips/trips.module';
import { TicketsModule } from './tickets/tickets.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: "postgres",
      host: process.env.host,
      port: 5438,
      username: "postgres",
      password: process.env.pass,
      database: process.env.name,
      entities:[],
      autoLoadEntities: true,
      synchronize: true,
  }),
    UsersModule,
    LocationsModule,
    BusesModule,
    RoutesModule,
    TripsModule,  
    TicketsModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
