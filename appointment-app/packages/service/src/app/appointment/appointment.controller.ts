import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Appointment } from "interfaces";

@ApiTags('appointments')
@Controller('appointment')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) {}

    /**
     * Retrieves all appointments from the service.
     * @returns A promise that resolves to an array of Appointment objects.
     */
    @Get()
    @ApiOperation({ summary: 'Get all appointments' })
    @ApiResponse({ status: 200, description: 'Return all appointments.' })
    public async getData(): Promise<Appointment[]> {
        return this.appointmentService.getData();
    }

    /**
     * Creates a new appointment using the provided appointment data.
     * @param appointmentData - The appointment data to be created.
     * @returns A promise that resolves to the created Appointment object.
     */
    @Post()
    @ApiOperation({ summary: 'Create a new appointment' })
    @ApiResponse({ status: 201, description: 'The appointment has been successfully created.', type: Appointment })
    public async createAppointment(
        @Body() appointmentData: Appointment
    ): Promise<Appointment> {
        return this.appointmentService.createAppointment(appointmentData);
    }

    /**
     * Updates an existing appointment with the specified ID using the provided data.
     * @param id - The ID of the appointment to be updated.
     * @param appointmentData - The updated appointment data.
     * @returns A promise that resolves to the updated Appointment object.
     */
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing appointment' })
    @ApiResponse({ status: 200, description: 'The appointment has been successfully updated.', type: Appointment })
    public async updateAppointment(
        @Param('id') id: number,
        @Body() appointmentData: Appointment
    ): Promise<Appointment> {
        return this.appointmentService.updateAppointment(id, appointmentData);
    }

    /**
     * Deletes an appointment with the specified ID.
     * @param id - The ID of the appointment to be deleted.
     * @returns A promise that resolves to void.
     */
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an appointment' })
    @ApiResponse({ status: 204, description: 'The appointment has been successfully deleted.' })
    public async deleteAppointment(@Param('id') id: number): Promise<void> {
        return this.appointmentService.deleteAppointment(id);
    }
}
