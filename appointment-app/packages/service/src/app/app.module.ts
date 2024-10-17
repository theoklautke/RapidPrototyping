import {Module, OnModuleInit} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentController } from './appointment/appointment.controller';
import { AppointmentService } from './appointment/appointment.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppointmentEntity} from "./appointment/appointment.entity";
import {AppointmentSeeder} from "./appointment/appointment.seeder";
import {DealerEntity} from "./dealer/dealer.entity";
import {DealerSeeder} from "./dealer/dealer.seeder";
import {DealerController} from "./dealer/dealer.controller";
import {DealerService} from "./dealer/dealer.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'veryhard123',
      database: 'dev',
      entities: [AppointmentEntity, DealerEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AppointmentEntity, DealerEntity]),
  ],
  controllers: [AppController, AppointmentController, DealerController],
  providers: [AppService, AppointmentService, AppointmentSeeder, DealerSeeder, DealerService],
})
export class AppModule implements OnModuleInit{
  constructor(private readonly appointmentSeeder: AppointmentSeeder, private readonly dealerSeeder: DealerSeeder) {}

  async onModuleInit() {
    await this.appointmentSeeder.seed();
    await this.dealerSeeder.seed();
  }
}
