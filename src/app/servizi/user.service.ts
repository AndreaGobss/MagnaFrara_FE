import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRegistrationRequest } from '../modelli/user.model';
import { ApiResponse } from '../modelli/api-response.model';
import { MockUserService } from './mock-user.service';
import { EnvironmentService } from './environment.service';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserService {
    private apiUrl = 'http://localhost:3000/api/auth';

    constructor(
        private http: HttpClient,
        private mockService: MockUserService,
        private env: EnvironmentService
    ) {}

    // Registrazione utente
    register(userData: UserRegistrationRequest): Observable<User> {
        if (this.env.useMockServices) {
            return this.mockService.register(userData);
        }
        
        return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, userData)
            .pipe(map(response => response.data!));
    }

    // Login utente (ottenere dati utente per nome utente)
    login(nomeUtente: string): Observable<User> {
        if (this.env.useMockServices) {
            return this.mockService.login(nomeUtente);
        }
        
        return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${nomeUtente}`)
            .pipe(map(response => response.data!));
    }
}