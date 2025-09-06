import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class EnvironmentService {
    // Flag per controllare se usare i mock o i servizi reali
    readonly useMockServices = false; // Cambia a false quando hai il backend
    
    // URL del backend quando sarà disponibile
    readonly apiBaseUrl = 'http://localhost:8080';
    
    // Altre configurazioni
    readonly enableLogging = true;
    readonly mockDelay = 1000; // millisecondi di delay per simulare la rete
}
