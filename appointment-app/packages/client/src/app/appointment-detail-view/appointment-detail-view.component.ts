import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from "../appointment.service";
import { Appointment } from "interfaces";
import { NgbInputDatepicker, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import 'bootstrap';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-appointment-detail-view',
  standalone: true,
  imports: [CommonModule, NgbInputDatepicker, FormsModule],
  templateUrl: './appointment-detail-view.component.html',
  styleUrls: ['./appointment-detail-view.component.scss'],
})
export class AppointmentDetailViewComponent implements OnInit {

  public appointmentList: Appointment[] = [];
  public newAppointment: Appointment = {
    assignment: '',
    branch: '',
    vehicleOwner: '',
    vehicleRegNo: '',
    status: '',
    date: '',
    time: ''
  };

  public selectedAppointment: Appointment | null = null;  // To hold the selected appointment for editing
  public toastMessage: string | null = null;

  constructor(
      private readonly appointmentService: AppointmentService,
      private readonly modalService: NgbModal) {}

  public ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.appointmentList = appointments;
    });
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  public openEditModal(modal: any, appointment: Appointment): void {
    this.selectedAppointment = { ...appointment };  // Clone the selected appointment for editing
    this.modalService.open(modal);
  }

  public deleteAppointment(appointmentId: number | undefined): void {
    if (appointmentId !== undefined) {
      this.appointmentList = this.appointmentList.filter(app => app.id !== appointmentId);
      this.appointmentService.deleteAppointment(appointmentId).subscribe(() => {
        this.showToast('Appointment deleted successfully');
      });
    }
  }

  public saveAppointment(modal: any): void {
    if (this.newAppointment.assignment && this.newAppointment.branch &&
        this.newAppointment.vehicleOwner && this.newAppointment.vehicleRegNo &&
        this.newAppointment.status && this.newAppointment.date && this.newAppointment.time) {

      this.appointmentService.createAppointment(this.newAppointment).subscribe(savedAppointment => {
        this.appointmentList.push(savedAppointment);

        this.newAppointment = {
          assignment: '',
          branch: '',
          vehicleOwner: '',
          vehicleRegNo: '',
          status: '',
          date: '',
          time: ''
        };

        this.showToast('Appointment created successfully');
        modal.close();
      });
    }
  }

  public updateAppointment(modal: any): void {
    if (this.selectedAppointment && this.selectedAppointment.id) {
      this.appointmentService.updateAppointment(this.selectedAppointment.id, this.selectedAppointment).subscribe(updatedAppointment => {
        const index = this.appointmentList.findIndex(app => app.id === updatedAppointment.id);
        if (index !== -1) {
          this.appointmentList[index] = updatedAppointment; // Update the appointment in the list
        }

        this.showToast('Appointment updated successfully');
        modal.close();
        this.selectedAppointment = null; // Clear the selection
      });
    }
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => this.closeToast(), 5000);
  }

  public closeToast(): void {
    this.toastMessage = null;
  }
}
