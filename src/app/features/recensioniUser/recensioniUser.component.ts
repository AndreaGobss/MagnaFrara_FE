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
    
    // Statistiche utente (dal backend)
    mediaValutazioni: number = 0;
    distribuzioneVoti: { [key: string]: number } = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
    
    // Filtri e ordinamento
    sortBy: 'data_pubb' | 'valutazione' = 'data_pubb';
    sortDirection: 'asc' | 'desc' = 'desc';
    
    // Stati di caricamento
    isLoading: boolean = false;
    errorMessage: string = '';
    private savedScrollPosition: number = 0;

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
                
                // Statistiche dal backend
                if (response.stats) {
                    this.mediaValutazioni = response.stats.avg_valutazione;
                    this.distribuzioneVoti = response.stats.distribuzione_voti;
                }
                
                this.isLoading = false;
                
                // Ripristina la posizione di scroll salvata
                if (this.savedScrollPosition > 0) {
                    this.restoreScrollPosition();
                }
            },
            error: (error) => {
                this.errorMessage = 'Errore nel caricamento delle tue recensioni';
                this.isLoading = false;
                console.error('Errore caricamento recensioni utente:', error);
            }
        });
    }

    private scrollToFilters(): void {
        setTimeout(() => {
            const filtersElement = document.getElementById('filters-section');
            if (filtersElement) {
                filtersElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100); // Piccolo delay per assicurarsi che il DOM sia aggiornato
    }

    private scrollToReviews(): void {
        setTimeout(() => {
            const reviewsElement = document.getElementById('reviews-list');
            if (reviewsElement) {
                reviewsElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
    }

    private saveScrollPosition(): void {
        this.savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    }

    private restoreScrollPosition(): void {
        setTimeout(() => {
            window.scrollTo(0, this.savedScrollPosition);
            this.savedScrollPosition = 0; // Reset dopo l'uso
        }, 50); // Delay minimo per assicurarsi che il DOM sia renderizzato
    }

    // Filtri e ordinamento
    onSortChange(): void {
        this.saveScrollPosition(); // Salva la posizione corrente
        this.currentPage = 1;
        this.loadUserRecensioni();
    }

    toggleSortDirection(): void {
        this.saveScrollPosition(); // Salva la posizione corrente
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.currentPage = 1;
        this.loadUserRecensioni();
    }

    // Paginazione
    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.saveScrollPosition(); // Salva la posizione corrente
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

    // Ottieni distribuzione stelle dal backend (non dai dati paginati)
    getStarsDistribution(): { [key: string]: number } {
        return this.distribuzioneVoti;
    }

    // Sistema di gamification - Calcola livello e titolo in base al numero di recensioni
    getUserLevel(): { level: number; title: string; description: string; nextLevelAt: number; progress: number } {
        const numRecensioni = this.totalRecensioni;
        
        // Definizione dei livelli e titoli
        const levels = [
            { threshold: 0, title: "Neofita Cappellaccio", description: "Hai appena iniziato il tuo viaggio culinario!" },
            { threshold: 3, title: "Assaggiatore Curioso", description: "Stai iniziando a esplorare nuovi sapori" },
            { threshold: 7, title: "Buongustaio Promettente", description: "Il tuo palato si sta raffinando" },
            { threshold: 12, title: "Critico Gastronomico", description: "Le tue recensioni sono sempre attendibili" },
            { threshold: 20, title: "Esperto Cappelletto", description: "Conosci i segreti della buona cucina" },
            { threshold: 30, title: "Maestro Estensi", description: "Il tuo giudizio è rispettato da tutti" },
            { threshold: 45, title: "Sommo Tagliatelliere", description: "Sei una leggenda del food reviewing" },
            { threshold: 65, title: "Imperatore del Gusto", description: "Il tuo palato è infallibile" },
            { threshold: 90, title: "Divinità Culinaria", description: "Hai raggiunto l'illuminazione gastronomica" },
            { threshold: 120, title: "Leggenda Immortale", description: "Il tuo nome sarà ricordato nei secoli" }
        ];

        // Trova il livello attuale
        let currentLevel = levels[0];
        let currentLevelIndex = 0;
        
        for (let i = levels.length - 1; i >= 0; i--) {
            if (numRecensioni >= levels[i].threshold) {
                currentLevel = levels[i];
                currentLevelIndex = i;
                break;
            }
        }

        // Calcola il progresso verso il prossimo livello
        const nextLevel = levels[currentLevelIndex + 1];
        const nextLevelAt = nextLevel ? nextLevel.threshold : currentLevel.threshold;
        const prevLevelAt = currentLevel.threshold;
        const progress = nextLevel ? 
            Math.floor(((numRecensioni - prevLevelAt) / (nextLevelAt - prevLevelAt)) * 100) : 100;

        return {
            level: currentLevelIndex + 1,
            title: currentLevel.title,
            description: currentLevel.description,
            nextLevelAt: nextLevelAt,
            progress: Math.min(progress, 100)
        };
    }
}