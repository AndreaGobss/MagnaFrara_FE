import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { 
    Ristorante, 
    RistoranteUpdateRequest
} from '../modelli/ristorante.model';
import { RistorantiListResponse } from '../modelli/response-types.model';
import { ApiResponse } from '../modelli/api-response.model';
import { QueryParams } from '../modelli/pagination.model';
import { MockRistoranteService } from './mock-ristorante.service';
import { EnvironmentService } from './environment.service';

@Injectable({ providedIn: 'root' })
export class RistoranteService {
    private apiUrl = 'http://localhost:3000/api/ristoranti';

    constructor(
        private http: HttpClient,
        private mockService: MockRistoranteService,
        private env: EnvironmentService
    ) {}

    // Ottieni tutti i ristoranti con paginazione e filtri
    getRistoranti(params?: QueryParams): Observable<RistorantiListResponse> {
        if (this.env.useMockServices) {
            return this.mockService.getRistoranti(params);
        }

        let httpParams = new HttpParams();
        
        if (params) {
            if (params.page) httpParams = httpParams.set('page', params.page.toString());
            if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
            if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
            if (params.sort) httpParams = httpParams.set('sort', params.sort);
        }

        return this.http.get<ApiResponse<RistorantiListResponse>>(this.apiUrl, { params: httpParams })
            .pipe(map(response => response.data!));
    }

    // Ottieni un ristorante specifico per ID
    getRistoranteById(id: number): Observable<Ristorante> {
        if (this.env.useMockServices) {
            return this.mockService.getRistoranteById(id);
        }

        return this.http.get<ApiResponse<Ristorante>>(`${this.apiUrl}/${id}`)
            .pipe(map(response => response.data!));
    }

    // Aggiorna i dati di un ristorante (solo per gestori)
    updateRistorante(id: number, updateData: RistoranteUpdateRequest): Observable<Ristorante> {
        return this.http.post<ApiResponse<Ristorante>>(`${this.apiUrl}/${id}`, updateData)
            .pipe(map(response => response.data!));
    }

    // Metodi di utilità per filtri comuni
    getRistorantiByRating(minRating: number = 1.0, params?: QueryParams): Observable<RistorantiListResponse> {
        // Implementazione per filtrare per valutazione
        // Il backend dovrebbe supportare questo filtro
        return this.getRistoranti({
            ...params,
            sortBy: 'valutazione',
            sort: 'desc'
        });
    }

    getRistorantiByName(params?: QueryParams): Observable<RistorantiListResponse> {
        return this.getRistoranti({
            ...params,
            sortBy: 'nome',
            sort: params?.sort || 'asc'
        });
    }
}
