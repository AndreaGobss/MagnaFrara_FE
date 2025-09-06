import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../servizi/session.service';
import { RistoranteService } from '../../servizi/ristorante.service';
import { ImageService } from '../../servizi/image.service';
import { User } from '../../modelli/user.model';
import { RistoranteListItem } from '../../modelli/ristorante.model';
import { RistorantiListResponse } from '../../modelli/response-types.model';
import { QueryParams } from '../../modelli/pagination.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-miei-ristoranti',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './miei-ristoranti.component.html',
    styleUrls: ['./miei-ristoranti.component.css']
})
export class MieiRistorantiComponent implements OnInit, OnDestroy {
    loggedUser: User | null = null;
    ristoranti: RistoranteListItem[] = [];
    isLoading = false;
    isSearching = false; // Loading specifico per la ricerca
    isSorting = false; // Loading specifico per ordinamento
    errorMessage = '';
    
    // Filtri e ordinamento
    sortBy: 'nome' | 'valutazione' = 'nome';
    sortDirection: 'asc' | 'desc' = 'asc';
    searchTerm: string = '';
    
    // Paginazione
    currentPage = 1;
    totalPages = 1;
    totalRistoranti = 0;
    ristorantiPerPagina = 9; // 3x3 griglia

    // Subjects per debouncing
    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    constructor(
        private sessionService: SessionService,
        private ristoranteService: RistoranteService,
        private imageService: ImageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Ascoltiamo i cambiamenti di login/logout
        this.sessionService.userChanged.subscribe(user => {
            this.loggedUser = user;
            if (user && user.gestore) {
                this.loadRistoranti();
            }
        });
        
        // Setup debouncing per la ricerca
        this.searchSubject.pipe(
            debounceTime(300), // Aspetta 300ms dopo l'ultimo carattere
            distinctUntilChanged(), // Solo se il valore è diverso
            takeUntil(this.destroy$) // Cleanup automatico
        ).subscribe(searchTerm => {
            this.searchTerm = searchTerm;
            this.currentPage = 1;
            this.performSearch();
        });
        
        // Carica i ristoranti iniziali se è un gestore
        if (this.sessionService.getLoggedUser()?.gestore) {
            this.loadRistoranti();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadRistoranti(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.performApiCall();
    }

    performSearch(): void {
        this.isSearching = true;
        this.errorMessage = '';
        this.performApiCall();
    }

    performSort(): void {
        this.isSorting = true;
        this.errorMessage = '';
        this.performApiCall();
    }

    private performApiCall(): void {
        // Aggiungiamo il filtro per gestore_id ai parametri
        const currentUser = this.sessionService.getLoggedUser();
        if (!currentUser || !currentUser.gestore) {
            this.errorMessage = 'Accesso non autorizzato. Solo i gestori possono vedere i propri ristoranti.';
            this.isLoading = false;
            this.isSearching = false;
            this.isSorting = false;
            return;
        }

        const params: QueryParams = {
            page: this.currentPage,
            limit: this.ristorantiPerPagina,
            sortBy: this.sortBy,
            sort: this.sortDirection,
            search: this.searchTerm,
            gestore_id: currentUser.id_utente // Filtro per i ristoranti del gestore
        };

        this.ristoranteService.getRistoranti(params).subscribe({
            next: (response: RistorantiListResponse) => {
                this.ristoranti = response.ristoranti;
                this.currentPage = response.pagination.current_page;
                this.totalPages = response.pagination.total_pages;
                this.totalRistoranti = response.pagination.total;
                this.isLoading = false;
                this.isSearching = false;
                this.isSorting = false;
            },
            error: (error) => {
                this.errorMessage = error.message || 'Errore nel caricamento dei tuoi ristoranti';
                this.isLoading = false;
                this.isSearching = false;
                this.isSorting = false;
            }
        });
    }

    // Gestione ordinamento
    onSortChange(): void {
        this.currentPage = 1; // Reset alla prima pagina quando cambia l'ordinamento
        this.performSort();
    }

    toggleSortDirection(): void {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.currentPage = 1;
        this.performSort();
    }

    // Gestione paginazione
    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadRistoranti();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    // Navigazione al dettaglio ristorante
    viewRistorante(ristorante: RistoranteListItem): void {
        this.router.navigate(['/ristorante', ristorante.id_ristorante]);
    }

    // Navigazione alla modifica ristorante (funzionalità extra per gestori)
    editRistorante(ristorante: RistoranteListItem): void {
        // Qui potresti implementare una pagina di modifica
        console.log('Modifica ristorante:', ristorante);
        // this.router.navigate(['/modifica-ristorante', ristorante.id_ristorante]);
    }

    // Genera array per stelle valutazione
    getStars(rating: number): number[] {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? 1 : 0);
        }
        return stars;
    }

    // Formatta valutazione
    formatRating(rating: number): string {
        return rating.toFixed(1);
    }

    // Gestione immagini
    getRistoranteImageUrl(filename: string | null | undefined): string {
        return this.imageService.getRistoranteImageUrl(filename);
    }

    onImageError(event: any): void {
        this.imageService.onImageError(event);
    }

    // Gestione ricerca con debouncing
    onSearchInput(searchTerm: string): void {
        this.searchSubject.next(searchTerm);
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.searchSubject.next('');
    }
}
