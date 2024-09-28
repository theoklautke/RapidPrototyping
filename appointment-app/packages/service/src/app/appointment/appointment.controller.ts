import {Controller, Get} from '@nestjs/common';
import {AppointmentService} from "./appointment.service";
import {Appointment} from "interfaces";

@Controller('appointment')
export class AppointmentController {

    constructor(private appointmentService: AppointmentService) {}

    @Get()
    public async getData(): Promise<Appointment[]> {
        return this.appointmentService.getData();
    }
}
