import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "interfaces";

/**
 * Represents an appointment entity in the database.
 * This entity is mapped to the 'appointments' table in the 'public' schema.
 */
@Entity({
    name: 'appointments',
    schema: 'public'
})
export class AppointmentEntity implements Appointment {
    /**
     * The unique identifier for the appointment.
     * This column is auto-generated and serves as the primary key for the entity.
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The assignment or service type associated with the appointment.
     * For example, this could include types like 'Oil Change', 'Tire Rotation', etc.
     */
    @Column({ name: 'assignment' })
    assignment: string;

    /**
     * The branch location where the appointment will take place.
     * This could refer to a physical location, such as 'Berlin' or 'Dortmund'.
     */
    @Column({ name: 'branch' })
    branch: string;

    /**
     * The date when the appointment is scheduled.
     * This should be in a standard date format (e.g., YYYY-MM-DD).
     */
    @Column({ name: 'date' })
    date: string;

    /**
     * The current status of the appointment.
     * This could represent various states such as 'Scheduled', 'Completed', or 'Canceled'.
     */
    @Column({ name: 'status' })
    status: string;

    /**
     * The time at which the appointment is scheduled to take place.
     * This should be in a 24-hour time format (e.g., HH:mm).
     */
    @Column({ name: 'time' })
    time: string;

    /**
     * The name of the vehicle owner who booked the appointment.
     * This field stores the owner's name for identification purposes.
     */
    @Column({ name: 'vehicleowner' })
    vehicleOwner: string;

    /**
     * The registration number of the vehicle associated with the appointment.
     * This could include formats specific to the region or country (e.g., 'B-AB 1234').
     */
    @Column({ name: 'vehicleregno' })
    vehicleRegNo: string;
}
