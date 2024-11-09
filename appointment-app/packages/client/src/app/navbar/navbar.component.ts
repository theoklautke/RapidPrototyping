import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, NgbInputDatepicker, RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  {
    constructor(protected readonly authService: AuthService) {}
}