import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import {AppointmentDetailViewComponent} from "./appointment-detail-view/appointment-detail-view.component";

@Component({
  standalone: true,
    imports: [NxWelcomeComponent, RouterModule, AppointmentDetailViewComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
