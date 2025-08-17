import { RistoranteListItem } from './ristorante.model';
import { Recensione, RecensioniStats, RecensioniUtenteStats } from './recensione.model';
import { User } from './user.model';
import { Pagination } from './pagination.model';

// Response per GET /api/ristoranti (lista)
export interface RistorantiListResponse {
  ristoranti: RistoranteListItem[];
  pagination: Pagination;
}

// Response per GET /api/recensioni/{id_rist}
export interface RecensioniRistoranteResponse {
  ristorante: {
    id_ristorante: number;
    nome: string;
  };
  recensioni: Recensione[];
  pagination: Pagination;
  stats: RecensioniStats;
}

// Response per GET /api/recensioni (tutte le recensioni)
export interface RecensioniListResponse {
  recensioni: Recensione[];
  pagination: Pagination;
}

// Response per GET /api/recensioni/utente/{id_utente}
export interface RecensioniUtenteResponse {
  utente: {
    id_utente: number;
    nome: string;
    cognome: string;
  };
  recensioni: Recensione[];
  pagination: Pagination;
  stats: RecensioniUtenteStats;
}
