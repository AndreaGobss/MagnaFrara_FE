import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse, isApiErrorResponse } from '../modelli/api-response.model';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

    constructor() {}

    // Gestisce gli errori HTTP e li converte in messaggi user-friendly
    handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Si è verificato un errore imprevisto';

        if (error.error && isApiErrorResponse(error.error)) {
            // Errore dall'API con formato standard
            const apiError = error.error as ApiErrorResponse;
            errorMessage = this.getErrorMessage(apiError.error.code, apiError.error.message);
        } else if (error.status === 0) {
            // Errore di rete
            errorMessage = 'Impossibile raggiungere il server. Controlla la connessione.';
        } else if (error.status >= 500) {
            // Errore del server
            errorMessage = 'Errore del server. Riprova più tardi.';
        } else if (error.status === 404) {
            errorMessage = 'Risorsa non trovata.';
        } else if (error.status === 401) {
            errorMessage = 'Accesso non autorizzato.';
        } else if (error.status === 403) {
            errorMessage = 'Non hai i permessi per questa operazione.';
        }

        console.error('Errore HTTP:', error);
        return throwError(() => new Error(errorMessage));
    }

    // Converte i codici di errore dell'API in messaggi user-friendly
    private getErrorMessage(errorCode: string, defaultMessage: string): string {
        const errorMessages: { [key: string]: string } = {
            'VALIDATION_ERROR': 'I dati inseriti non sono validi.',
            'NOT_FOUND': 'Elemento non trovato.',
            'ALREADY_EXISTS': 'L\'elemento esiste già.',
            'INTERNAL_ERROR': 'Errore interno del server.',
            'UNAUTHORIZED': 'Devi effettuare il login.',
            'FORBIDDEN': 'Non hai i permessi per questa operazione.'
        };

        return errorMessages[errorCode] || defaultMessage;
    }

    // Operator da usare nei servizi per gestire automaticamente gli errori
    handleApiError<T>() {
        return catchError((error: HttpErrorResponse) => this.handleError(error));
    }
}
