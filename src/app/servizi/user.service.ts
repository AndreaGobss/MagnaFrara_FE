import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from './session.service';
import { User, UserRegistrationRequest } from '../modelli/user.model';
import { ApiResponse } from '../modelli/api-response.model';
import { Observable, map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
    private apiUrl = 'http://localhost:3000/api/auth';

    constructor(
        private http: HttpClient, 
        private session: SessionService
    ) {}

    // Registrazione utente
    register(userData: UserRegistrationRequest): Observable<User> {
        return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, userData)
            .pipe(map(response => response.data!));
    }

    // Login utente (ottenere dati utente per nome utente)
    login(nomeUtente: string): Observable<User> {
        return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${nomeUtente}`)
            .pipe(map(response => response.data!));
    }

    // Metodo di convenienza per fare login e salvare in sessione
    loginAndSetSession(nomeUtente: string): Observable<User> {
        return this.login(nomeUtente).pipe(
            map(user => {
                this.session.setLoggedUser(user);
                return user;
            })
        );
    }

    // Logout
    logout(): void {
        this.session.clearLoggedUser();
    }

    // Verifica se l'utente è loggato
    isLoggedIn(): boolean {
        return this.session.getLoggedUser() !== null;
    }

    // Verifica se l'utente è un gestore
    isGestore(): boolean {
        const user = this.session.getLoggedUser();
        return user ? user.gestore : false;
    }
}