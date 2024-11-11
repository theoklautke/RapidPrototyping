import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppointmentService} from "../appointment.service";
import {Appointment, User} from "interfaces";
import {NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import 'bootstrap';
import {FormsModule} from "@angular/forms";
import {UserService} from "../user.service";
import {AuthService} from "../auth.service";
import {isNotEmpty, isValidVehicleRegNo} from "shared";

@Component({
    selector: 'app-appointment-detail-view',
    standalone: true,
    imports: [CommonModule, NgbInputDatepicker, FormsModule],
    templateUrl: './appointment-detail-view.component.html',
    styleUrls: ['./appointment-detail-view.component.scss'],
})
export class AppointmentDetailViewComponent implements OnInit {

    public appointmentList: Appointment[] = [];
    public newAppointment: {
        date: string;
        vehicleOwner: User | undefined;
        assignment: string;
        time: string;
        branch: string;
        vehicleRegNo: string;
        status: string
    } = {
        assignment: '',
        branch: '',
        vehicleOwner: {} as User,
        vehicleRegNo: '',
        status: 'OPEN',
        date: '',
        time: ''
    };

    public selectedAppointment: Appointment | null = null;
    public filteredAppointments: Appointment[] = [];
    public toastMessage: string | null = null;
    public usersList: User[] = [];
    public user: any = null;
    public errorMessageAssignment = '';
    public errorMessageVehicleRegNo = '';

    constructor(
        private readonly appointmentService: AppointmentService,
        private readonly userService: UserService,
        private readonly modalService: NgbModal,
        protected readonly authService: AuthService) {
    }

    /**
     * Initializes the component by loading the appointment and user lists.
     * Filters appointments based on the current user's email.
     */
    public ngOnInit(): void {
        this.appointmentService.getAppointments().subscribe(appointments => {
            this.appointmentList = appointments;
            this.filterAppointments();
        });

        this.userService.getUsers().subscribe(users => {
            this.usersList = users;
        });

        // Set the current date and time as default values for the new appointment
        const now = new Date();
        this.newAppointment.date = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        this.newAppointment.time = this.formatTime(now); // Format as HH:mm
    }

    /**
     * Opens a given modal window.
     * @param modal - The modal to be opened.
     */
    public open(modal: any): void {
        this.modalService.open(modal);
    }

    /**
     * Opens the edit modal for a specific appointment, pre-filling it with the appointment's details.
     * @param modal - The modal to be opened.
     * @param appointment - The appointment to be edited.
     */
    public openEditModalAppointment(modal: any, appointment: Appointment): void {
        this.selectedAppointment = {...appointment};
        this.modalService.open(modal);
    }

    /**
     * Deletes an appointment by its ID and removes it from the appointment list.
     * Displays a toast message upon success or failure.
     * @param appointmentId - The ID of the appointment to be deleted.
     */
    public deleteAppointment(appointmentId: number): void {
        if (appointmentId) {
            this.appointmentList = this.appointmentList.filter(x => x.id !== appointmentId);
            this.filteredAppointments = this.filteredAppointments.filter(x => x.id !== appointmentId);

            this.appointmentService.deleteAppointment(appointmentId).subscribe({
                next: () => {
                    this.showToast('Appointment deleted successfully');
                },
                error: (err) => {
                    this.showToast('Error deleting appointment');
                    console.error('Delete appointment failed', err);
                }
            });
        } else {
            this.showToast('Invalid appointment ID');
        }
    }

    /**
     * Saves a new appointment after validating the input fields.
     * If the validation is successful, the appointment is created and added to the list.
     * @param modal - The modal to be closed upon success.
     */
    public saveAppointment(modal: any): void {
        if (!isNotEmpty(this.newAppointment.assignment)) {
            this.errorMessageAssignment = "Nachname darf nicht leer sein";
        } else {
            this.errorMessageAssignment = "";
        }

        if (!isValidVehicleRegNo(this.newAppointment.vehicleRegNo)) {
            this.errorMessageVehicleRegNo = "Kennzeichen ist nicht valide (Bsp.: \"M-XY 5678\", \"B-A 123\", \"HH-AB 1234\")";
        } else {
            this.errorMessageVehicleRegNo = "";
        }

        if (this.newAppointment.assignment && this.newAppointment.branch &&
            this.newAppointment.vehicleRegNo && this.newAppointment.status && this.newAppointment.date && this.newAppointment.time) {

            const mailOfUser = this.authService.getMailFromJWT();
            this.userService.getUsers().subscribe(users => {
                this.newAppointment.vehicleOwner = users.find(user => user.email === mailOfUser);
                this.appointmentService.createAppointment(this.newAppointment).subscribe(savedAppointment => {
                    this.appointmentList.push(savedAppointment);

                    this.newAppointment = {
                        assignment: '',
                        branch: '',
                        vehicleOwner: {} as User,
                        vehicleRegNo: '',
                        status: 'OPEN',
                        date: '',
                        time: ''
                    };
                    this.showToast('Appointment created successfully');
                    modal.close();
                    this.filteredAppointments.push(savedAppointment);
                });
            });
        }
    }

    /**
     * Updates an existing appointment after validating the input fields.
     * If the validation is successful, the appointment is updated in the list.
     * @param modal - The modal to be closed upon success.
     */
    public updateAppointment(modal: any): void {
        if (!isNotEmpty(this.newAppointment.assignment)) {
            this.errorMessageAssignment = "Nachname darf nicht leer sein";
        } else {
            this.errorMessageAssignment = "";
        }

        if (!isValidVehicleRegNo(this.newAppointment.vehicleRegNo)) {
            this.errorMessageVehicleRegNo = "Kennzeichen ist nicht valide (Bsp.: \"M-XY 5678\", \"B-A 123\", \"HH-AB 1234\")";
        } else {
            this.errorMessageVehicleRegNo = "";
        }

        if (this.selectedAppointment && this.selectedAppointment.id) {
            this.appointmentService.updateAppointment(this.selectedAppointment.id, this.selectedAppointment).subscribe(updatedAppointment => {

                this.selectedAppointment = updatedAppointment;

                const index = this.appointmentList.findIndex(app => app.id === updatedAppointment.id);
                if (index !== -1) {
                    this.appointmentList[index] = { ...updatedAppointment };
                }

                const filteredIndex = this.filteredAppointments.findIndex(app => app.id === updatedAppointment.id);
                if (filteredIndex !== -1) {
                    this.filteredAppointments[filteredIndex] = { ...updatedAppointment };
                }

                this.showToast('Appointment updated successfully');
                modal.close();
                this.selectedAppointment = null;
                window.location.reload();
            }, error => {
                this.showToast('Error updating appointment');
                console.error('Update appointment failed', error);
            });
        } else {
            this.showToast('Appointment not selected');
        }
    }

    /**
     * Filters appointments to show only those related to the current user based on their email.
     */
    private filterAppointments(): void {
        const userEmail = this.authService.getMailFromJWT();
        this.filteredAppointments = this.appointmentList.filter(appointment => {
            return appointment.vehicleOwner.email === userEmail;
        });
    }

    /**
     * Closes the toast message.
     */
    public closeToast(): void {
        this.toastMessage = null;
    }

    /**
     * Displays a toast message for a specified duration.
     * @param message - The message to be displayed in the toast.
     */
    private showToast(message: string): void {
        this.toastMessage = message;
        setTimeout(() => this.closeToast(), 5000);
    }

    /**
     * Converts a status string to its display representation in German.
     * @param status - The status string to be displayed.
     * @returns The status in German.
     */
    public getStatusDisplay(status: string): string {
        const statusMap: { [key: string]: string } = {
            OPEN: 'Offen',
            IN_PROGRESS: 'In Bearbeitung',
            COMPLETED: 'Beendet'
        };
        return (statusMap)[status] || status;
    }

    formatTime(date: Date): string {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}
