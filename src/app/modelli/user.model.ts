export interface User {
  id_utente: number;
  nome: string;
  cognome: string;
  email: string;
  gestore: boolean;
}

export interface UserRegistrationRequest {
  nome: string;
  cognome: string;
  email: string;
  password: string;
  gestore: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserBasicInfo {
  nome: string;
  cognome: string;
}