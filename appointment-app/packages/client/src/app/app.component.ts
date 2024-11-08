import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import {AppointmentDetailViewComponent} from "./appointment-detail-view/appointment-detail-view.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {DealerDetailViewComponent} from "./dealer-detail-view/dealer-detail-view.component";

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, AppointmentDetailViewComponent, NavbarComponent, DealerDetailViewComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
