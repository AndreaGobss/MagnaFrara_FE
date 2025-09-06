import { UserBasicInfo } from './user.model';
import { RistoranteBasicInfo } from './ristorante.model';

export interface Recensione {
    id_rec: number;
    id_utente: number;
    utente?: {
        nome: string;
        cognome: string;
    };
    id_ristorante: number;
    ristorante?: {
        nome: string;
        tipo_cucina: string;
        rist_img: string;
    };
    titolo: string;
    testo: string;
    valutazione: number;
    data_pubb: string;
}

export interface RecensioneCreateRequest {
  id_utente: number;
  titolo: string;
  testo: string;
  valutazione: number; // da 1 a 5 (intero)
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
  avg_valutazione: number;
  distribuzione_voti: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}
