import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {AppointmentEntity} from "./appointment.entity";
import {Repository} from "typeorm";

@Injectable()
export class AppointmentService {
    constructor(@InjectRepository(AppointmentEntity) private readonly appointmentsRepo: Repository<AppointmentEntity>) {
    }

    public async getData(): Promise<AppointmentEntity[]> {
        return await this.appointmentsRepo.find();
    }

}
