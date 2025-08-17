import { Injectable } from "@angular/core";
import { User } from '../modelli/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class SessionService {
    
    // soggetto RxJS che mantiene lo stato corrente dell'utente
    private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());

    // observable che permette ai componenti di "ascoltare" i cambiamenti di login e logout
    public userChanged = this.userSubject.asObservable();

    private getStoredUser(): User | null {
        const raw = localStorage.getItem('utente')
        return raw ? JSON.parse(raw) as User : null;
    }

    getLoggedUser(): User | null {
        return this.userSubject.value;
    }

    // salva sia utente in localstorage
    // che aggiorna lo stato reattivo userSubject, notificando tutti i componenti che ascoltano userChanged
    setLoggedUser(user:User): void {
        localStorage.setItem('utente', JSON.stringify(user));
        this.userSubject.next(user);
    }

    clearLoggedUser(): void {
        localStorage.removeItem("utente");
        this.userSubject.next(null);
    }
}