import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: "postgres",
      host: process.env.host,
      port: 5438,
      username: "postgres",
      password: "BD2023",
      database: process.env.name,
      entities:[],
      autoLoadEntities: true,
      synchronize: true,
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
