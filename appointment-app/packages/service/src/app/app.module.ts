import {Module, OnModuleInit} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentController } from './appointment/appointment.controller';
import { AppointmentService } from './appointment/appointment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppointmentEntity} from "./appointment/appointment.entity";
import {AppointmentSeeder} from "./appointment/appointment.seeder";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'veryhard123',
      database: 'dev',
      entities: [AppointmentEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AppointmentEntity]),
  ],
  controllers: [AppController, AppointmentController],
  providers: [AppService, AppointmentService, AppointmentSeeder],
})
export class AppModule implements OnModuleInit{
  constructor(private readonly appointmentSeeder: AppointmentSeeder) {}

  async onModuleInit() {
    await this.appointmentSeeder.seed();
  }
}
