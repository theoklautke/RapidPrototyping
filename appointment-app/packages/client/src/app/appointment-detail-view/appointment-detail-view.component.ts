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

    public ngOnInit(): void {
        this.appointmentService.getAppointments().subscribe(appointments => {
            this.appointmentList = appointments;
            this.filterAppointments();
        });

        this.userService.getUsers().subscribe(users => {
            this.usersList = users;
        });

    }

    public open(modal: any): void {
        this.modalService.open(modal);
    }

    public openEditModalAppointment(modal: any, appointment: Appointment): void {
        this.selectedAppointment = {...appointment};
        this.modalService.open(modal);
    }

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



    private filterAppointments(): void {
        const userEmail = this.authService.getMailFromJWT();
        this.filteredAppointments = this.appointmentList.filter(appointment => {
            return appointment.vehicleOwner.email === userEmail;
        });
    }

    public closeToast(): void {
        this.toastMessage = null;
    }

    private showToast(message: string): void {
        this.toastMessage = message;
        setTimeout(() => this.closeToast(), 5000);
    }

    public  getStatusDisplay(status: string): string {
        const statusMap: { [key: string]: string } = {
            OPEN: 'Offen',
            IN_PROGRESS: 'In Bearbeitung',
            COMPLETED: 'Beendet'
        };
        return (statusMap)[status] || status;
    }


}
