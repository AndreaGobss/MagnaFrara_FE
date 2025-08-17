import { UserBasicInfo } from './user.model';
import { RistoranteBasicInfo } from './ristorante.model';

export interface Recensione {
  id_rec: number;
  id_utente: number;
  utente: UserBasicInfo;
  id_ristorante: number;
  ristorante?: RistoranteBasicInfo;
  titolo: string;
  testo: string;
  valutazione: number; // da 1.0 a 5.0
  data_pubb: string; // ISO 8601 format
}

export interface RecensioneCreateRequest {
  id_utente: number;
  titolo: string;
  testo: string;
  valutazione: number; // da 1.0 a 5.0
}

export interface RecensioniStats {
  avg_valutazione: number;
  distribuzione_voti: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

export interface RecensioniUtenteStats {
  media_valutazioni: number;
  totale_recensioni: number;
}
