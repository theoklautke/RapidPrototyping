import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentController } from './appointment/appointment.controller';
import { AppointmentService } from './appointment/appointment.service';

@Module({
  imports: [],
  controllers: [AppController, AppointmentController],
  providers: [AppService, AppointmentService],
})
export class AppModule {}
