import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRegistrationRequest, LoginRequest } from '../modelli/user.model';
import { ApiResponse } from '../modelli/api-response.model';
import { EnvironmentService } from './environment.service';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/auth';

    constructor(
        private http: HttpClient,
        private env: EnvironmentService
    ) {}

    // Registrazione utente
    register(userData: UserRegistrationRequest): Observable<User> {
        
        return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, userData)
            .pipe(map(response => response.data!));
    }

    // Login utente
    login(loginData: LoginRequest): Observable<User> {
        return this.http.post<ApiResponse<User>>(`${this.apiUrl}/login`, loginData)
            .pipe(map(response => response.data!));
    }
}