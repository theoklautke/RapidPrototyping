import { Injectable } from '@nestjs/common';
import {Appointment} from "interfaces";

const APPOINTMENTS: Appointment[] = [
    {
        id: 1,
        assignment: 'Ölwechsel',
        branch: 'Berlin',
        vehicleOwner: 'Max Mustermann',
        vehicleRegNo: 'B-AB 1234',
        status: 'Reperatur',
        date: '2024-10-01',
        time: '10:30',
    },
    {
        id: 2,
        assignment: 'Reifenwechsel',
        branch: 'Dortmund',
        vehicleOwner: 'Laura Schmidt',
        vehicleRegNo: 'M-XY 5678',
        status: 'Reperatur',
        date: '2024-10-05',
        time: '14:00',
    },
    {
        id: 3,
        assignment: 'Inspektion',
        branch: 'Berlin',
        vehicleOwner: 'Peter Meyer',
        vehicleRegNo: 'C-DK 9101',
        status: 'Reperatur',
        date: '2024-09-30',
        time: '09:00',
    },
];


@Injectable()
export class AppointmentService {
    public getData(): Appointment[] {
        return APPOINTMENTS;
    }
}
