import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../servizi/session.service';
import { RistoranteService } from '../../servizi/ristorante.service';
import { User } from '../../modelli/user.model';
import { RistoranteListItem } from '../../modelli/ristorante.model';
import { RistorantiListResponse } from '../../modelli/response-types.model';
import { QueryParams } from '../../modelli/pagination.model';

@Component({
    selector: 'app-restaurant',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './restaurant.component.html',
    styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
    loggedUser: User | null = null;
    ristoranti: RistoranteListItem[] = [];
    isLoading = false;
    errorMessage = '';
    
    // Filtri e ordinamento
    sortBy: 'nome' | 'valutazione' = 'nome';
    sortDirection: 'asc' | 'desc' = 'asc';
    
    // Paginazione
    currentPage = 1;
    totalPages = 1;
    totalRistoranti = 0;
    ristorantiPerPagina = 9; // 3x3 griglia

    constructor(
        private sessionService: SessionService,
        private ristoranteService: RistoranteService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Ascoltiamo i cambiamenti di login/logout
        this.sessionService.userChanged.subscribe(user => {
            this.loggedUser = user;
        });
        
        // Carica i ristoranti
        this.loadRistoranti();
    }

    loadRistoranti(): void {
        this.isLoading = true;
        this.errorMessage = '';

        const params: QueryParams = {
            page: this.currentPage,
            limit: this.ristorantiPerPagina,
            sortBy: this.sortBy,
            sort: this.sortDirection
        };

        this.ristoranteService.getRistoranti(params).subscribe({
            next: (response: RistorantiListResponse) => {
                this.ristoranti = response.ristoranti;
                this.currentPage = response.pagination.current_page;
                this.totalPages = response.pagination.total_pages;
                this.totalRistoranti = response.pagination.total;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = error.message || 'Errore nel caricamento dei ristoranti';
                this.isLoading = false;
            }
        });
    }

    // Gestione ordinamento
    onSortChange(): void {
        this.currentPage = 1; // Reset alla prima pagina quando cambia l'ordinamento
        this.loadRistoranti();
    }

    toggleSortDirection(): void {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.currentPage = 1;
        this.loadRistoranti();
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
        this.router.navigate(['/ristoranti', ristorante.id_ristorante]);
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
}