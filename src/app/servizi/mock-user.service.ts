import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User, UserRegistrationRequest } from '../modelli/user.model';

@Injectable({providedIn: 'root'})
export class MockUserService {
    // Simuliamo un database in memoria
    private users: User[] = [
        {
            id_utente: 1,
            nome: 'Mario',
            cognome: 'Rossi',
            email: 'mario.rossi@email.com',
            gestore: false
        },
        {
            id_utente: 2,
            nome: 'Giuseppe',
            cognome: 'Bianchi',
            email: 'giuseppe.bianchi@email.com',
            gestore: true
        }
    ];

    private nextId = 3;

    // Simula la registrazione
    register(userData: UserRegistrationRequest): Observable<User> {
        // Simula delay di rete
        return of(null).pipe(
            delay(1000), // 1 secondo di delay
            switchMap(() => {
                // Controlla se l'email esiste già
                const existingUser = this.users.find(u => u.email === userData.email);
                if (existingUser) {
                    return throwError(() => new Error('Un utente con questa email è già registrato'));
                }

                // Crea nuovo utente
                const newUser: User = {
                    id_utente: this.nextId++,
                    nome: userData.nome,
                    cognome: userData.cognome,
                    email: userData.email,
                    gestore: userData.gestore
                };

                this.users.push(newUser);
                return of(newUser);
            })
        );
    }

    // Simula il login
    login(email: string): Observable<User> {
        return of(null).pipe(
            delay(800), // Simula delay di rete
            switchMap(() => {
                const user = this.users.find(u => u.email === email);
                if (!user) {
                    return throwError(() => new Error('Utente non trovato'));
                }
                return of(user);
            })
        );
    }
}
