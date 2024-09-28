import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from './appointment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(AppointmentEntity)
        private readonly appointmentsRepo: Repository<AppointmentEntity>
    ) {}

    /**
     * Retrieves all appointments from the database.
     * @returns A promise that resolves to an array of AppointmentEntity objects.
     */
    public async getData(): Promise<AppointmentEntity[]> {
        return await this.appointmentsRepo.find();
    }

    /**
     * Creates a new appointment in the database.
     * @param appointmentData - Partial appointment data to create a new appointment.
     * @returns A promise that resolves to the created AppointmentEntity object.
     */
    public async createAppointment(appointmentData: Partial<AppointmentEntity>): Promise<AppointmentEntity> {
        const newAppointment = this.appointmentsRepo.create(appointmentData);
        return await this.appointmentsRepo.save(newAppointment);
    }

    /**
     * Updates an existing appointment in the database.
     * @param id - The ID of the appointment to update.
     * @param appointmentData - Partial appointment data to update the existing appointment.
     * @returns A promise that resolves to the updated AppointmentEntity object.
     */
    public async updateAppointment(id: number, appointmentData: Partial<AppointmentEntity>): Promise<AppointmentEntity> {
        await this.appointmentsRepo.update(id, appointmentData);
        return await this.appointmentsRepo.findOneBy({ id });
    }

    /**
     * Deletes an appointment from the database.
     * @param id - The ID of the appointment to delete.
     * @returns A promise that resolves to void.
     */
    public async deleteAppointment(id: number): Promise<void> {
        await this.appointmentsRepo.delete(id);
    }
}
