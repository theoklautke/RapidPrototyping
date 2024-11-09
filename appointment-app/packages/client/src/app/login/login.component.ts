import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: true,
    imports: [FormsModule, CommonModule]
})
export class LoginComponent {
    email = '';
    password = '';
    errorMessage = '';

    constructor(private authService: AuthService, private router: Router) {}

    onLogin() {
        this.authService.login(this.email, this.password).subscribe({
            next: () => {
                this.router.navigate(['/appointment']);
            },
            error: (err) => {
                this.errorMessage = 'Anmeldung fehlgeschlagen';
            }
        });
    }

    onRegister() {
        this.router.navigate(['/register']);
    }
}
