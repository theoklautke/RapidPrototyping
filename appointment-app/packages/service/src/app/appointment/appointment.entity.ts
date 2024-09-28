import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "interfaces";

@Entity({
    name: 'appointments',
    schema: 'public'
})export class AppointmentEntity implements Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'assignment'})
    assignment: string;

    @Column({ name: 'branch'})
    branch: string;

    @Column({ name: 'date'})
    date: string;

    @Column({ name: 'status'})
    status: string;

    @Column({ name: 'time'})
    time: string;

    @Column({ name: 'vehicleowner'})
    vehicleOwner: string;

    @Column({ name: 'vehicleregno'})
    vehicleRegNo: string;
}
