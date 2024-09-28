import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from './appointment.entity'; // Achte darauf, den Pfad anzupassen

@Injectable()
export class AppointmentSeeder {
    constructor(
        @InjectRepository(AppointmentEntity)
        private appointmentRepository: Repository<AppointmentEntity>,
    ) {}

    async seed() {
        const count = await this.appointmentRepository.count();
        if (count === 0) {
            const appointments: AppointmentEntity[] = [
                {
                    assignment: 'Ölwechsel',
                    branch: 'Berlin',
                    date: '2024-10-01',
                    time: '10:30',
                    status: 'Reparatur',
                    vehicleOwner: 'Max Mustermann',
                    vehicleRegNo: 'B-AB 1234',
                    id: 0
                },
                {
                    assignment: 'Reifenwechsel',
                    branch: 'Dortmund',
                    date: '2024-10-05',
                    time: '14:00',
                    status: 'Reparatur',
                    vehicleOwner: 'Laura Schmidt',
                    vehicleRegNo: 'M-XY 5678',
                    id: 0
                },
                {
                    assignment: 'Inspektion',
                    branch: 'Berlin',
                    date: '2024-09-30',
                    time: '09:00',
                    status: 'Reparatur',
                    vehicleOwner: 'Peter Meyer',
                    vehicleRegNo: 'C-DK 9101',
                    id: 0
                },
            ];

            await this.appointmentRepository.save(appointments);
            console.log('Initial data seeded');
        } else {
            console.log('Data already exists, skipping seeding');
        }
    }
}
