import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../servizi/session.service';
import { RecensioneService } from '../../servizi/recensione.service';
import { Recensione } from '../../modelli/recensione.model';
import { User } from '../../modelli/user.model';
import { RecensioniUtenteResponse } from '../../modelli/response-types.model';

@Component({
    selector: 'app-recensioni-user',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './recensioniUser.component.html',
    styleUrls: ['./recensioniUser.component.css']
})
export class RecensioniUserComponent implements OnInit {
    // Dati utente
    loggedUser: User | null = null;
    
    // Dati recensioni
    recensioni: Recensione[] = [];
    totalRecensioni: number = 0;
    currentPage: number = 1;
    totalPages: number = 1;
    
    // Statistiche utente
    mediaValutazioni: number = 0;
    
    // Filtri e ordinamento
    sortBy: 'data_pubb' | 'valutazione' = 'data_pubb';
    sortDirection: 'asc' | 'desc' = 'desc';
    
    // Stati di caricamento
    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        private router: Router,
        private sessionService: SessionService,
        private recensioneService: RecensioneService
    ) {}

    ngOnInit(): void {
        // Verifica se l'utente è loggato
        this.sessionService.userChanged.subscribe((user: User | null) => {
            this.loggedUser = user;
            if (this.loggedUser) {
                this.loadUserRecensioni();
            } else {
                // Se non loggato, reindirizza al login
                this.router.navigate(['/account']);
            }
        });

        // Carica utente corrente se già loggato
        const currentUser = this.sessionService.getLoggedUser();
        if (currentUser) {
            this.loggedUser = currentUser;
            this.loadUserRecensioni();
        } else {
            this.router.navigate(['/account']);
        }
    }

    loadUserRecensioni(): void {
        if (!this.loggedUser) return;

        this.isLoading = true;
        this.errorMessage = '';
        
        const params = {
            page: this.currentPage,
            limit: 10,
            sortBy: this.sortBy,
            sort: this.sortDirection
        };

        this.recensioneService.getRecensioniByUtente(this.loggedUser.id_utente, params).subscribe({
            next: (response: RecensioniUtenteResponse) => {
                this.recensioni = response.recensioni;
                this.totalRecensioni = response.pagination.total;
                this.totalPages = response.pagination.total_pages;
                this.mediaValutazioni = response.stats.media_valutazioni;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Errore nel caricamento delle tue recensioni';
                this.isLoading = false;
                console.error('Errore caricamento recensioni utente:', error);
            }
        });
    }

    // Filtri e ordinamento
    onSortChange(): void {
        this.currentPage = 1;
        this.loadUserRecensioni();
    }

    toggleSortDirection(): void {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.currentPage = 1;
        this.loadUserRecensioni();
    }

    // Paginazione
    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadUserRecensioni();
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

    // Navigazione al ristorante
    viewRestaurant(idRistorante: number): void {
        this.router.navigate(['/ristorante', idRistorante]);
    }

    // Navigazione ai ristoranti
    goToRestaurants(): void {
        this.router.navigate(['/ristoranti']);
    }

    // Utility
    getStars(rating: number): number[] {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? 1 : 0);
        }
        return stars;
    }

    formatRating(rating: number): string {
        return rating.toFixed(1);
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Calcola distribuzione stelle per l'utente
    getStarsDistribution(): { [key: string]: number } {
        const distribution: { [key: string]: number } = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
        
        this.recensioni.forEach(recensione => {
            const rating = Math.floor(recensione.valutazione).toString();
            if (rating in distribution) {
                distribution[rating]++;
            }
        });

        return distribution;
    }
}