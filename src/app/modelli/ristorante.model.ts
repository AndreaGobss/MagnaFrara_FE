import { UserBasicInfo } from './user.model';

export interface Ristorante {
  id_ristorante: number;
  nome: string;
  rist_img: string;
  menu_img: string;
  tipo_cucina: string;
  descrizione: string;
  avg_valutazione: number;
  numero_recensioni: number;
  id_gestore: number;
  gestore: UserBasicInfo;
  created_at: string;
  updated_at?: string;
}

export interface RistoranteListItem {
  id_ristorante: number;
  nome: string;
  rist_img: string;
  tipo_cucina: string;
  descrizione: string;
  avg_valutazione: number;
  numero_recensioni: number;
}

export interface RistoranteUpdateRequest {
  nome: string;
  tipo_cucina: string;
  descrizione: string;
  rist_img?: string; // base64 encoded
  menu_img?: string; // base64 encoded
}

export interface RistoranteBasicInfo {
  id_ristorante: number;
  nome: string;
  tipo_cucina?: string;
  rist_img?: string;
}
