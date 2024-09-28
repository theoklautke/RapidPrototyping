import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from "../appointment.service";
import { Appointment } from "interfaces";
import {NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-appointment-detail-view',
  standalone: true,
  imports: [CommonModule, NgbInputDatepicker],
  templateUrl: './appointment-detail-view.component.html',
  styles: ``,
})
export class AppointmentDetailViewComponent implements OnInit {

  public appointmentList: Appointment[] = [];

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
}
