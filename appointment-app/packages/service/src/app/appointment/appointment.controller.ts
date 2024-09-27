import {Controller, Get} from '@nestjs/common';
import {AppointmentService} from "./appointment.service";

@Controller('appointment')
export class AppointmentController {

    constructor(private appointmentService: AppointmentService) {}

    @Get()
    getData() {
        return this.appointmentService.getData();
    }
}
