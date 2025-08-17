import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Ristorante, RistoranteListItem } from '../modelli/ristorante.model';
import { RistorantiListResponse } from '../modelli/response-types.model';
import { QueryParams } from '../modelli/pagination.model';

@Injectable({providedIn: 'root'})
export class MockRistoranteService {
    
    private ristoranti: Ristorante[] = [
        {
            id_ristorante: 1,
            nome: 'Trattoria del Borgo',
            rist_img: '/assets/images/ristorante1.jpg',
            menu_img: '/assets/images/menu1.jpg',
            tipo_cucina: 'Italiana',
            descrizione: 'Autentica cucina italiana nel centro storico di Ferrara...',
            avg_valutazione: 4.3,
            numero_recensioni: 87,
            id_gestore: 2,
            gestore: { nome: 'Giuseppe', cognome: 'Bianchi' },
            created_at: '2024-01-10T14:20:00.000Z'
        },
        {
            id_ristorante: 2,
            nome: 'Osteria Moderna',
            rist_img: '/assets/images/ristorante2.jpg',
            menu_img: '/assets/images/menu2.jpg',
            tipo_cucina: 'Fusion',
            descrizione: 'Cucina moderna con ingredienti del territorio...',
            avg_valutazione: 4.7,
            numero_recensioni: 142,
            id_gestore: 3,
            gestore: { nome: 'Marco', cognome: 'Verdi' },
            created_at: '2024-02-15T16:45:00.000Z'
        },
        {
            id_ristorante: 3,
            nome: 'Pizzeria La Margherita',
            rist_img: '/assets/images/ristorante3.jpg',
            menu_img: '/assets/images/menu3.jpg',
            tipo_cucina: 'Pizzeria',
            descrizione: 'Le migliori pizze della città con forno a legna...',
            avg_valutazione: 4.1,
            numero_recensioni: 203,
            id_gestore: 4,
            gestore: { nome: 'Antonio', cognome: 'Nero' },
            created_at: '2024-01-05T10:30:00.000Z'
        }
    ];

    getRistoranti(params?: QueryParams): Observable<RistorantiListResponse> {
        return of(null).pipe(
            delay(800),
            switchMap(() => {
                let sortedRistoranti = [...this.ristoranti];
                
                // Ordinamento
                if (params?.sortBy) {
                    sortedRistoranti.sort((a, b) => {
                        let valueA: any, valueB: any;
                        
                        switch (params.sortBy) {
                            case 'nome':
                                valueA = a.nome.toLowerCase();
                                valueB = b.nome.toLowerCase();
                                break;
                            case 'valutazione':
                                valueA = a.avg_valutazione;
                                valueB = b.avg_valutazione;
                                break;
                            default:
                                return 0;
                        }
                        
                        if (params.sort === 'desc') {
                            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
                        } else {
                            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
                        }
                    });
                }

                // Paginazione
                const page = params?.page || 1;
                const limit = params?.limit || 10;
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedRistoranti = sortedRistoranti.slice(startIndex, endIndex);

                // Converti in RistoranteListItem
                const ristorantiList: RistoranteListItem[] = paginatedRistoranti.map(r => ({
                    id_ristorante: r.id_ristorante,
                    nome: r.nome,
                    rist_img: r.rist_img,
                    tipo_cucina: r.tipo_cucina,
                    descrizione: r.descrizione,
                    avg_valutazione: r.avg_valutazione,
                    numero_recensioni: r.numero_recensioni
                }));

                const response: RistorantiListResponse = {
                    ristoranti: ristorantiList,
                    pagination: {
                        current_page: page,
                        per_page: limit,
                        total: this.ristoranti.length,
                        total_pages: Math.ceil(this.ristoranti.length / limit),
                        has_next: endIndex < this.ristoranti.length,
                        has_prev: page > 1
                    }
                };

                return of(response);
            })
        );
    }

    getRistoranteById(id: number): Observable<Ristorante> {
        return of(null).pipe(
            delay(600),
            switchMap(() => {
                const ristorante = this.ristoranti.find(r => r.id_ristorante === id);
                if (!ristorante) {
                    throw new Error('Ristorante non trovato');
                }
                return of(ristorante);
            })
        );
    }
}
