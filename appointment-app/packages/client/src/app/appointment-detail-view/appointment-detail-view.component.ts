import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from "../appointment.service";
import { Appointment } from "interfaces";
import { NgbInputDatepicker, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";

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

  public deleteAppointment(appointmentId: number | undefined): void {
    this.appointmentList = this.appointmentList.filter(app => app.id !== appointmentId);
    this.appointmentService.deleteAppointment(appointmentId).subscribe();
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

        modal.close();
      });
    }
  }
}
