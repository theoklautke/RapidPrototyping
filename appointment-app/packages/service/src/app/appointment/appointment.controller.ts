import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Appointment } from "interfaces";
import {AppointmentEntity} from "./appointment.entity";

@ApiTags('appointments')
@Controller('appointment')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) {}

    @Get()
    @ApiOperation({ summary: 'Get all appointments' })
    @ApiResponse({ status: 200, description: 'Return all appointments.' })
    public async getData(): Promise<Appointment[]> {
        return this.appointmentService.getData();
    }

    @Post()
    @ApiOperation({ summary: 'Create a new appointment' })
    @ApiResponse({ status: 201, description: 'The appointment has been successfully created.', type: Appointment })
    public async createAppointment(
        @Body() appointmentData: Appointment
    ): Promise<Appointment> {
        return this.appointmentService.createAppointment(appointmentData as Partial<AppointmentEntity>);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing appointment' })
    @ApiResponse({ status: 200, description: 'The appointment has been successfully updated.', type: Appointment })
    public async updateAppointment(
        @Param('id', ParseIntPipe) id: number,
        @Body() appointmentData: Appointment
    ): Promise<Appointment> {
        return this.appointmentService.updateAppointment(id, appointmentData as Partial<AppointmentEntity>);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an appointment' })
    @ApiResponse({ status: 204, description: 'The appointment has been successfully deleted.' })
    public async deleteAppointment(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.appointmentService.deleteAppointment(id);
    }
}
