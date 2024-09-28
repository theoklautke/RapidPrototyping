import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from './appointment.entity';

@Injectable()
export class AppointmentSeeder {
    constructor(
        @InjectRepository(AppointmentEntity)
        private appointmentRepository: Repository<AppointmentEntity>,
    ) {}

    /**
     * Seeds the appointment data into the database if it is empty.
     * This method checks the current count of appointments in the database.
     * If no appointments exist, it creates a set of initial appointments
     * and saves them to the database.
     * If appointments already exist, it skips the seeding process.
     */
    async seed() {
        const count = await this.appointmentRepository.count();
        if (count === 0) {
            const appointments: AppointmentEntity[] = [
                {
                    assignment: 'Oil Change',
                    branch: 'Berlin',
                    date: '2024-10-01',
                    time: '10:30',
                    status: 'Repair',
                    vehicleOwner: 'Max Mustermann',
                    vehicleRegNo: 'B-AB 1234',
                    id: 0
                },
                {
                    assignment: 'Tire Change',
                    branch: 'Dortmund',
                    date: '2024-10-05',
                    time: '14:00',
                    status: 'Repair',
                    vehicleOwner: 'Laura Schmidt',
                    vehicleRegNo: 'M-XY 5678',
                    id: 0
                },
                {
                    assignment: 'Inspection',
                    branch: 'Berlin',
                    date: '2024-09-30',
                    time: '09:00',
                    status: 'Repair',
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
