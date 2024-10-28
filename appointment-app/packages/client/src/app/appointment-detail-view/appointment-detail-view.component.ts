import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from "../appointment.service";
import {Appointment, Dealer} from "interfaces";
import { NgbInputDatepicker, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import 'bootstrap';
import { FormsModule } from "@angular/forms";
import {DealerService} from "../dealer.service";

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

  public dealerList: Dealer[] = [];
  public newDealer: Dealer = {
    postalCode: 0,
    street: '',
    houseNumber: 0,
    city: '',
    openingTime: '',
    closingTime: ''
  };

  public selectedAppointment: Appointment | null = null;
  public selectedDealer: Dealer | null = null;
  public toastMessage: string | null = null;

  constructor(
      private readonly appointmentService: AppointmentService,
      private readonly dealerService : DealerService,
      private readonly modalService: NgbModal) {}

  public ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.appointmentList = appointments;
    });

    this.dealerService.getDealers().subscribe(dealers => {
      this.dealerList = dealers;
    })
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  public openEditModalAppointment(modal: any, appointment: Appointment): void {
    this.selectedAppointment = { ...appointment };  // Clone the selected appointment for editing
    this.modalService.open(modal);
  }

  public openEditModalDealer(modal: any, dealer: Dealer): void {
    this.selectedDealer = { ...dealer };  // Clone the selected dealer for editing
    this.modalService.open(modal);
  }

  public deleteAppointment(appointmentId: number | undefined): void {
    if (appointmentId !== undefined) {
      this.appointmentList = this.appointmentList.filter(x => x.id !== appointmentId);
      this.appointmentService.deleteAppointment(appointmentId).subscribe(() => {
        this.showToast('Appointment deleted successfully');
      });
    }
  }

  public deleteDealer(dealerId: number | undefined): void {
    if (dealerId !== undefined) {
      this.dealerList = this.dealerList.filter(x => x.id !== dealerId);
      this.dealerService.deleteDealer(dealerId).subscribe(() => {
        this.showToast('Dealer deleted successfully');
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

  public saveDealer(modal: any): void {
    if (this.newDealer.postalCode && this.newDealer.street &&
        this.newDealer.houseNumber && this.newDealer.city &&
        this.newDealer.openingTime && this.newDealer.closingTime) {

      this.dealerService.createDealer(this.newDealer).subscribe(savedDealer => {
        this.dealerList.push(savedDealer);

        this.newDealer = {
          postalCode: 0,
          street: '',
          houseNumber: 0,
          city: '',
          openingTime: '',
          closingTime: '',
        };

        this.showToast('Dealer created successfully');
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

  public updateDealer(modal: any): void {
    if (this.selectedDealer && this.selectedDealer.id) {
      this.dealerService.updateDealer(this.selectedDealer.id, this.selectedDealer).subscribe(updatedDealer => {
        const index = this.dealerList.findIndex(x => x.id === updatedDealer.id);
        if (index !== -1) {
          this.dealerList[index] = updatedDealer;
        }

        this.showToast('Dealer updated successfully');
        modal.close();
        this.selectedDealer = null; // Clear the selection
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
