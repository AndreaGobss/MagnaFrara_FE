import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
    Recensione, 
    RecensioneCreateRequest 
} from '../modelli/recensione.model';
import { 
    RecensioniRistoranteResponse,
    RecensioniListResponse,
    RecensioniUtenteResponse 
} from '../modelli/response-types.model';

@Injectable({ providedIn: 'root' })
export class MockRecensioneService {
    private mockRecensioni: Recensione[] = [
        {
            id_rec: 1,
            id_utente: 1,
            utente: { nome: 'Marco', cognome: 'Rossi' },
            id_ristorante: 1,
            ristorante: { id_ristorante: 1, nome: 'La Tavola della Nonna' },
            titolo: 'Esperienza fantastica!',
            testo: 'Sono stato in questo ristorante per il compleanno di mia moglie e devo dire che è stata un\'esperienza indimenticabile. Il cibo era delizioso, il servizio impeccabile e l\'atmosfera molto romantica.',
            valutazione: 5,
            data_pubb: '2024-01-15T19:30:00Z'
        },
        {
            id_rec: 2,
            id_utente: 2,
            utente: { nome: 'Giulia', cognome: 'Bianchi' },
            id_ristorante: 1,
            ristorante: { id_ristorante: 1, nome: 'La Tavola della Nonna' },
            titolo: 'Buona cucina ma servizio lento',
            testo: 'La qualità del cibo è indiscutibile, piatti ben preparati e ingredienti freschi. Tuttavia, abbiamo dovuto aspettare molto tra una portata e l\'altra. Il personale è gentile ma poco organizzato.',
            valutazione: 3,
            data_pubb: '2024-01-12T20:15:00Z'
        },
        {
            id_rec: 3,
            id_utente: 3,
            utente: { nome: 'Andrea', cognome: 'Verdi' },
            id_ristorante: 1,
            ristorante: { id_ristorante: 1, nome: 'La Tavola della Nonna' },
            titolo: 'Ottimo rapporto qualità-prezzo',
            testo: 'Ristorante che consiglio vivamente! Piatti abbondanti e saporiti ad un prezzo onesto. L\'ambiente è accogliente e il personale molto disponibile. Tornerò sicuramente!',
            valutazione: 4,
            data_pubb: '2024-01-10T18:45:00Z'
        },
        {
            id_rec: 4,
            id_utente: 4,
            utente: { nome: 'Francesca', cognome: 'Neri' },
            id_ristorante: 2,
            ristorante: { id_ristorante: 2, nome: 'Osteria del Borgo' },
            titolo: 'Cucina tradizionale eccellente',
            testo: 'Finalmente un posto dove mangiare cucina tradizionale fatta bene! I tortellini in brodo erano perfetti, come li faceva la nonna. Personale cordiale e prezzi giusti.',
            valutazione: 5,
            data_pubb: '2024-01-08T19:00:00Z'
        },
        {
            id_rec: 5,
            id_utente: 5,
            utente: { nome: 'Roberto', cognome: 'Blu' },
            id_ristorante: 2,
            ristorante: { id_ristorante: 2, nome: 'Osteria del Borgo' },
            titolo: 'Delusione totale',
            testo: 'Purtroppo non posso dire nulla di positivo. Piatti freddi, ingredienti scadenti e conto salato. Il servizio è stato pessimo, camerieri scortesi. Sconsiglio vivamente.',
            valutazione: 1,
            data_pubb: '2024-01-05T20:30:00Z'
        },
        {
            id_rec: 6,
            id_utente: 1,
            utente: { nome: 'Marco', cognome: 'Rossi' },
            id_ristorante: 3,
            ristorante: { id_ristorante: 3, nome: 'Pizzeria Bella Napoli' },
            titolo: 'Pizza buonissima!',
            testo: 'La migliore pizza della zona! Impasto perfetto, ingredienti freschi e cottura al punto giusto. Il locale è un po\' rumoroso ma ne vale la pena per la qualità del cibo.',
            valutazione: 4,
            data_pubb: '2024-01-02T21:00:00Z'
        },
        {
            id_rec: 7,
            id_utente: 1,
            utente: { nome: 'Marco', cognome: 'Rossi' },
            id_ristorante: 4,
            ristorante: { id_ristorante: 4, nome: 'Ristorante Mare e Monti' },
            titolo: 'Ottimi piatti di pesce',
            testo: 'Esperienza molto positiva! Il pesce era freschissimo e cucinato alla perfezione. Il risotto ai frutti di mare era eccezionale. Prezzi un po\' alti ma giustificati dalla qualità.',
            valutazione: 4,
            data_pubb: '2023-12-28T19:15:00Z'
        },
        {
            id_rec: 8,
            id_utente: 1,
            utente: { nome: 'Marco', cognome: 'Rossi' },
            id_ristorante: 5,
            ristorante: { id_ristorante: 5, nome: 'Trattoria del Ponte' },
            titolo: 'Ambiente familiare',
            testo: 'Piccola trattoria a gestione familiare con piatti della tradizione locale. Porzioni abbondanti e prezzi onesti. Consiglio i tagliatelle ai funghi porcini.',
            valutazione: 5,
            data_pubb: '2023-12-20T18:30:00Z'
        },
        {
            id_rec: 9,
            id_utente: 2,
            utente: { nome: 'Giulia', cognome: 'Bianchi' },
            id_ristorante: 6,
            ristorante: { id_ristorante: 6, nome: 'Ristorante Il Girasole' },
            titolo: 'Cena romantica perfetta',
            testo: 'Locale elegante con una vista mozzafiato. Il menu degustazione è stato una scoperta continua di sapori. Servizio attento e professionale. Perfetto per occasioni speciali.',
            valutazione: 5,
            data_pubb: '2023-12-15T20:00:00Z'
        },
        {
            id_rec: 10,
            id_utente: 3,
            utente: { nome: 'Andrea', cognome: 'Verdi' },
            id_ristorante: 7,
            ristorante: { id_ristorante: 7, nome: 'Osteria La Cantina' },
            titolo: 'Vini eccellenti',
            testo: 'La carta dei vini è davvero impressionante! Abbiamo accompagnato la cena con un Barolo del 2018 semplicemente perfetto. I salumi e formaggi erano di ottima qualità.',
            valutazione: 4,
            data_pubb: '2023-12-10T19:45:00Z'
        }
    ];

    constructor() {}

    // Ottieni recensioni per un ristorante specifico
    getRecensioniByRistorante(idRistorante: number, params?: any): Observable<RecensioniRistoranteResponse> {
        const recensioniRistorante = this.mockRecensioni.filter(r => r.id_ristorante === idRistorante);
        
        // Ordinamento
        if (params?.sortBy) {
            recensioniRistorante.sort((a, b) => {
                let aValue, bValue;
                
                if (params.sortBy === 'data_pubb') {
                    aValue = new Date(a.data_pubb).getTime();
                    bValue = new Date(b.data_pubb).getTime();
                } else if (params.sortBy === 'valutazione') {
                    aValue = a.valutazione;
                    bValue = b.valutazione;
                } else {
                    return 0;
                }
                
                if (params.sort === 'desc') {
                    return bValue - aValue;
                } else {
                    return aValue - bValue;
                }
            });
        }

        // Paginazione
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRecensioni = recensioniRistorante.slice(startIndex, endIndex);

        const response: RecensioniRistoranteResponse = {
            ristorante: {
                id_ristorante: idRistorante,
                nome: 'Ristorante Test'
            },
            recensioni: paginatedRecensioni,
            pagination: {
                current_page: page,
                per_page: limit,
                total: recensioniRistorante.length,
                total_pages: Math.ceil(recensioniRistorante.length / limit),
                has_next: page < Math.ceil(recensioniRistorante.length / limit),
                has_prev: page > 1
            },
            stats: {
                avg_valutazione: recensioniRistorante.reduce((sum, r) => sum + r.valutazione, 0) / recensioniRistorante.length || 0,
                distribuzione_voti: {
                    '5': recensioniRistorante.filter(r => r.valutazione === 5).length,
                    '4': recensioniRistorante.filter(r => r.valutazione === 4).length,
                    '3': recensioniRistorante.filter(r => r.valutazione === 3).length,
                    '2': recensioniRistorante.filter(r => r.valutazione === 2).length,
                    '1': recensioniRistorante.filter(r => r.valutazione === 1).length
                }
            }
        };

        return of(response).pipe(delay(800));
    }

    // Crea una nuova recensione
    createRecensione(idRistorante: number, recensioneData: RecensioneCreateRequest): Observable<Recensione> {
        const newId = Math.max(...this.mockRecensioni.map(r => r.id_rec)) + 1;
        
        const newRecensione: Recensione = {
            id_rec: newId,
            id_utente: recensioneData.id_utente,
            utente: { 
                nome: 'Nuovo', 
                cognome: 'Utente' 
            },
            id_ristorante: idRistorante,
            titolo: recensioneData.titolo,
            testo: recensioneData.testo,
            valutazione: recensioneData.valutazione,
            data_pubb: new Date().toISOString()
        };

        this.mockRecensioni.push(newRecensione);
        
        return of(newRecensione).pipe(delay(1000));
    }

    // Ottieni tutte le recensioni (per completezza)
    getRecensioni(params?: any): Observable<RecensioniListResponse> {
        // Ordinamento
        let recensioni = [...this.mockRecensioni];
        
        if (params?.sortBy) {
            recensioni.sort((a, b) => {
                let aValue, bValue;
                
                if (params.sortBy === 'data_pubb') {
                    aValue = new Date(a.data_pubb).getTime();
                    bValue = new Date(b.data_pubb).getTime();
                } else if (params.sortBy === 'valutazione') {
                    aValue = a.valutazione;
                    bValue = b.valutazione;
                } else {
                    return 0;
                }
                
                if (params.sort === 'desc') {
                    return bValue - aValue;
                } else {
                    return aValue - bValue;
                }
            });
        }

        // Paginazione
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRecensioni = recensioni.slice(startIndex, endIndex);

        const response: RecensioniListResponse = {
            recensioni: paginatedRecensioni,
            pagination: {
                current_page: page,
                per_page: limit,
                total: recensioni.length,
                total_pages: Math.ceil(recensioni.length / limit),
                has_next: page < Math.ceil(recensioni.length / limit),
                has_prev: page > 1
            }
        };

        return of(response).pipe(delay(800));
    }

    // Ottieni recensioni di un utente (per completezza)
    getRecensioniByUtente(idUtente: number, params?: any): Observable<RecensioniUtenteResponse> {
        const recensioniUtente = this.mockRecensioni.filter(r => r.id_utente === idUtente);
        
        // Ordinamento e paginazione simili agli altri metodi...
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRecensioni = recensioniUtente.slice(startIndex, endIndex);

        const response: RecensioniUtenteResponse = {
            utente: {
                id_utente: idUtente,
                nome: 'Utente',
                cognome: 'Test'
            },
            recensioni: paginatedRecensioni,
            pagination: {
                current_page: page,
                per_page: limit,
                total: recensioniUtente.length,
                total_pages: Math.ceil(recensioniUtente.length / limit),
                has_next: page < Math.ceil(recensioniUtente.length / limit),
                has_prev: page > 1
            },
            stats: {
                media_valutazioni: recensioniUtente.reduce((sum, r) => sum + r.valutazione, 0) / recensioniUtente.length || 0,
                totale_recensioni: recensioniUtente.length
            }
        };

        return of(response).pipe(delay(800));
    }
}
