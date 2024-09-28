import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Appointment} from "interfaces";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) {}

  private baseURL = 'http://localhost:3000/api/appointment';

  public getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseURL);
  }

}
