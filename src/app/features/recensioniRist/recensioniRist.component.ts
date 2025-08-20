import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../servizi/session.service';
import { RistoranteService } from '../../servizi/ristorante.service';
import { RecensioneService } from '../../servizi/recensione.service';
import { Ristorante, RistoranteUpdateRequest } from '../../modelli/ristorante.model';
import { Recensione, RecensioneCreateRequest } from '../../modelli/recensione.model';
import { User } from '../../modelli/user.model';
import { RecensioniRistoranteResponse } from '../../modelli/response-types.model';

@Component({
    selector: 'app-recensioniRist',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './recensioniRist.component.html',
    styleUrls: ['./recensioniRist.component.css']
})
export class RecensioniRistComponent implements OnInit {
    // Dati del ristorante
    ristorante: Ristorante | null = null;
    ristoranteId: number = 0;
    
    // Dati recensioni
    recensioni: Recensione[] = [];
    totalRecensioni: number = 0;
    currentPage: number = 1;
    totalPages: number = 1;
    
    // Filtri e ordinamento
    sortBy: 'data_pubb' | 'valutazione' = 'data_pubb';
    sortDirection: 'asc' | 'desc' = 'desc';
    
    // Stato dell'utente
    loggedUser: User | null = null;
    isGestore: boolean = false;
    
    // Stati di caricamento
    isLoading: boolean = false;
    isLoadingRecensioni: boolean = false;
    errorMessage: string = '';
    
    // Form per nuova recensione
    showAddReview: boolean = false;
    newReview: RecensioneCreateRequest = {
        id_utente: 0,
        titolo: '',
        testo: '',
        valutazione: 5
    };
    isSubmittingReview: boolean = false;
    
    // Form per modifica ristorante (solo gestori)
    showEditRestaurant: boolean = false;
    editingRestaurant: boolean = false;
    restaurantUpdateData: RistoranteUpdateRequest = {
        nome: '',
        tipo_cucina: '',
        descrizione: '',
        rist_img: '',
        menu_img: ''
    };
    isUpdatingRestaurant: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sessionService: SessionService,
        private ristoranteService: RistoranteService,
        private recensioneService: RecensioneService
    ) {}

    ngOnInit(): void {
        // Ottieni l'ID del ristorante dalla route
        this.route.params.subscribe(params => {
            this.ristoranteId = +params['id'];
            if (this.ristoranteId) {
                this.loadRistoranteData();
            }
        });

        // Verifica stato utente
        this.sessionService.userChanged.subscribe((user: User | null) => {
            this.loggedUser = user;
            this.isGestore = user?.gestore || false;
        });
    }

    loadRistoranteData(): void {
        this.isLoading = true;
        this.errorMessage = '';

        // Carica dati ristorante
        this.ristoranteService.getRistoranteById(this.ristoranteId).subscribe({
            next: (ristorante) => {
                this.ristorante = ristorante;
                this.loadRecensioni();
            },
            error: (error) => {
                this.errorMessage = 'Errore nel caricamento del ristorante';
                this.isLoading = false;
                console.error('Errore caricamento ristorante:', error);
            }
        });
    }

    loadRecensioni(): void {
        this.isLoadingRecensioni = true;
        
        const params = {
            page: this.currentPage,
            limit: 10,
            sortBy: this.sortBy,
            sort: this.sortDirection
        };

        this.recensioneService.getRecensioniByRistorante(this.ristoranteId, params).subscribe({
            next: (response: RecensioniRistoranteResponse) => {
                this.recensioni = response.recensioni;
                this.totalRecensioni = response.pagination.total;
                this.totalPages = response.pagination.total_pages;
                this.isLoading = false;
                this.isLoadingRecensioni = false;
            },
            error: (error) => {
                this.errorMessage = 'Errore nel caricamento delle recensioni';
                this.isLoading = false;
                this.isLoadingRecensioni = false;
                console.error('Errore caricamento recensioni:', error);
            }
        });
    }

    // Filtri e ordinamento
    onSortChange(): void {
        this.currentPage = 1;
        this.loadRecensioni();
    }

    toggleSortDirection(): void {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.currentPage = 1;
        this.loadRecensioni();
    }

    // Paginazione
    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadRecensioni();
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

    // Gestione recensioni
    toggleAddReview(): void {
        if (!this.loggedUser) {
            this.router.navigate(['/account']);
            return;
        }
        this.showAddReview = !this.showAddReview;
        if (this.showAddReview) {
            this.resetReviewForm();
        }
    }

    resetReviewForm(): void {
        this.newReview = {
            id_utente: this.loggedUser?.id_utente || 0,
            titolo: '',
            testo: '',
            valutazione: 5
        };
    }

    submitReview(): void {
        if (!this.loggedUser || this.isSubmittingReview) return;

        this.isSubmittingReview = true;
        
        this.recensioneService.createRecensione(this.ristoranteId, this.newReview).subscribe({
            next: (recensione) => {
                this.showAddReview = false;
                this.resetReviewForm();
                this.isSubmittingReview = false;
                // Ricarica recensioni per mostrare la nuova
                this.loadRecensioni();
                // Ricarica dati ristorante per aggiornare la valutazione media
                this.loadRistoranteData();
            },
            error: (error) => {
                this.isSubmittingReview = false;
                this.errorMessage = 'Errore nell\'invio della recensione';
                console.error('Errore invio recensione:', error);
            }
        });
    }

    // Gestione modifica ristorante (solo gestori)
    toggleEditRestaurant(): void {
        if (!this.isGestore) return;
        this.showEditRestaurant = !this.showEditRestaurant;
        if (this.showEditRestaurant && this.ristorante) {
            this.initRestaurantForm();
        }
    }

    initRestaurantForm(): void {
        if (!this.ristorante) return;
        
        this.restaurantUpdateData = {
            nome: this.ristorante.nome,
            tipo_cucina: this.ristorante.tipo_cucina,
            descrizione: this.ristorante.descrizione,
            rist_img: this.ristorante.rist_img || '',
            menu_img: this.ristorante.menu_img || ''
        };
    }

    submitRestaurantUpdate(): void {
        if (!this.isGestore || this.isUpdatingRestaurant || !this.ristorante) return;

        this.isUpdatingRestaurant = true;
        
        this.ristoranteService.updateRistorante(this.ristoranteId, this.restaurantUpdateData).subscribe({
            next: (updatedRistorante) => {
                this.ristorante = updatedRistorante;
                this.showEditRestaurant = false;
                this.isUpdatingRestaurant = false;
                // Opzionalmente mostra un messaggio di successo
                alert('Ristorante aggiornato con successo!');
            },
            error: (error) => {
                this.isUpdatingRestaurant = false;
                this.errorMessage = 'Errore nell\'aggiornamento del ristorante';
                console.error('Errore aggiornamento ristorante:', error);
            }
        });
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

    goBack(): void {
        this.router.navigate(['/ristoranti']);
    }
}