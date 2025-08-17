import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { 
    Recensione, 
    RecensioneCreateRequest 
} from '../modelli/recensione.model';
import { 
    RecensioniRistoranteResponse,
    RecensioniListResponse,
    RecensioniUtenteResponse 
} from '../modelli/response-types.model';
import { ApiResponse } from '../modelli/api-response.model';
import { QueryParams } from '../modelli/pagination.model';

@Injectable({ providedIn: 'root' })
export class RecensioneService {
    private apiUrl = 'http://localhost:3000/api/recensioni';

    constructor(private http: HttpClient) {}

    // Ottieni tutte le recensioni con paginazione e filtri
    getRecensioni(params?: QueryParams): Observable<RecensioniListResponse> {
        let httpParams = new HttpParams();
        
        if (params) {
            if (params.page) httpParams = httpParams.set('page', params.page.toString());
            if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
            if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
            if (params.sort) httpParams = httpParams.set('sort', params.sort);
        }

        return this.http.get<ApiResponse<RecensioniListResponse>>(this.apiUrl, { params: httpParams })
            .pipe(map(response => response.data!));
    }

    // Ottieni recensioni per un ristorante specifico
    getRecensioniByRistorante(idRistorante: number, params?: QueryParams): Observable<RecensioniRistoranteResponse> {
        let httpParams = new HttpParams();
        
        if (params) {
            if (params.page) httpParams = httpParams.set('page', params.page.toString());
            if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
            if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
            if (params.sort) httpParams = httpParams.set('sort', params.sort);
        }

        return this.http.get<ApiResponse<RecensioniRistoranteResponse>>(`${this.apiUrl}/${idRistorante}`, { params: httpParams })
            .pipe(map(response => response.data!));
    }

    // Ottieni recensioni di un utente specifico
    getRecensioniByUtente(idUtente: number, params?: QueryParams): Observable<RecensioniUtenteResponse> {
        let httpParams = new HttpParams();
        
        if (params) {
            if (params.page) httpParams = httpParams.set('page', params.page.toString());
            if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
            if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
            if (params.sort) httpParams = httpParams.set('sort', params.sort);
        }

        return this.http.get<ApiResponse<RecensioniUtenteResponse>>(`${this.apiUrl}/utente/${idUtente}`, { params: httpParams })
            .pipe(map(response => response.data!));
    }

    // Crea una nuova recensione
    createRecensione(idRistorante: number, recensioneData: RecensioneCreateRequest): Observable<Recensione> {
        return this.http.post<ApiResponse<Recensione>>(`${this.apiUrl}/${idRistorante}`, recensioneData)
            .pipe(map(response => response.data!));
    }

    // Metodi di utilità per ordinamenti comuni
    getRecensioniByRating(params?: QueryParams): Observable<RecensioniListResponse> {
        return this.getRecensioni({
            ...params,
            sortBy: 'valutazione',
            sort: 'desc'
        });
    }

    getRecensioniByDate(params?: QueryParams): Observable<RecensioniListResponse> {
        return this.getRecensioni({
            ...params,
            sortBy: 'data_pubb',
            sort: 'desc'
        });
    }

    getRecensioniRistoranteByDate(idRistorante: number, params?: QueryParams): Observable<RecensioniRistoranteResponse> {
        return this.getRecensioniByRistorante(idRistorante, {
            ...params,
            sortBy: 'data_pubb',
            sort: 'desc'
        });
    }
}
