import { Route } from '@angular/router';
import {AppointmentDetailViewComponent} from "./appointment-detail-view/appointment-detail-view.component";
import {DealerDetailViewComponent} from "./dealer-detail-view/dealer-detail-view.component";

export const appRoutes: Route[] = [
    { path: 'appointment', component: AppointmentDetailViewComponent },
    { path: 'dealer', component: DealerDetailViewComponent },
    { path: '', redirectTo: '/appointment', pathMatch: 'full' },
    { path: '**', redirectTo: '/appointment' },
];