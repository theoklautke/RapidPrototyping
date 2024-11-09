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
    firstname = '';
    lastname = '';
    isDealer = false;
    errorMessage = '';
    isRegister = false;

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
        const user = {
            email: this.email,
            password: this.password,
            firstname: this.firstname,
            lastname: this.lastname,
            isDealer: this.isDealer,
        };

        this.authService.register(user).subscribe(
            (response) => {
                console.log('Benutzer erfolgreich registriert', response);
                this.toggleForm();
            },
            (error) => {
                this.errorMessage = 'Fehler bei der Registrierung. Bitte versuchen Sie es erneut.';
            }
        );
    }

    toggleForm() {
        this.isRegister = !this.isRegister;
    }
}
