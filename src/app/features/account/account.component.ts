import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'
import { SessionService } from '../../servizi/session.service';
import { UserService } from '../../servizi/user.service';
import { User, UserRegistrationRequest } from '../../modelli/user.model';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
    loggedUser: User | null = null;
    isRegistering = false;
    isLoading = false;
    errorMessage = '';
    successMessage = '';
    
    // Dati del form
    formData = {
        nome: '',
        cognome: '',
        email: '',
        password: '',
        gestore: false
    };

    constructor(
        private sessionService: SessionService,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Ascoltiamo i cambiamenti di login/logout
        this.sessionService.userChanged.subscribe(user => {
            this.loggedUser = user;
        });
    }

    toggleMode(): void {
        this.isRegistering = !this.isRegistering;
        this.clearMessages();
        this.resetForm();
    }

    onSubmit(): void {
        this.clearMessages();
        this.isLoading = true;

        if (this.isRegistering) {
            this.register();
        } else {
            this.login();
        }
    }

    private register(): void {
        const userData: UserRegistrationRequest = {
            nome: this.formData.nome,
            cognome: this.formData.cognome,
            email: this.formData.email,
            password: this.formData.password,
            gestore: this.formData.gestore
        };

        this.userService.register(userData).subscribe({
            next: (user) => {
                this.successMessage = 'Registrazione completata con successo!';
                this.isLoading = false;
                // Dopo la registrazione, facciamo login automatico
                setTimeout(() => {
                    this.loginUser(this.formData.email);
                }, 1000);
            },
            error: (error) => {
                this.errorMessage = error.message || 'Errore durante la registrazione';
                this.isLoading = false;
            }
        });
    }

    private login(): void {
        // Per il login usiamo l'email come nome utente
        this.loginUser(this.formData.email);
    }

    private loginUser(identifier: string): void {
        const loginData = { email: identifier, password: this.formData.password };
        this.userService.login(loginData).subscribe({
            next: (user) => {
                this.sessionService.setLoggedUser(user);
                this.successMessage = `Benvenuto, ${user.nome}!`;
                this.isLoading = false;
                // Redirect alla home o ai ristoranti dopo il login
                setTimeout(() => {
                    this.router.navigate(['/ristoranti']);
                }, 1000);
            },
            error: (error) => {
                this.errorMessage = error.message || 'Errore durante il login';
                this.isLoading = false;
            }
        });
    }

    logout(): void {
        this.sessionService.clearLoggedUser();
        this.successMessage = 'Logout effettuato con successo!';
        setTimeout(() => {
            this.clearMessages();
            this.router.navigate(['/ristoranti']);
        }, 1000);
    }

    private clearMessages(): void {
        this.errorMessage = '';
        this.successMessage = '';
    }

    private resetForm(): void {
        this.formData = {
            nome: '',
            cognome: '',
            email: '',
            password: '',
            gestore: false
        };
    }
}
