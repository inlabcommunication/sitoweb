export interface MenuItem {
  id: string;
  nome: string;
  descrizione: string;
  prezzo: string;
  tag?: string;
}

export interface MenuCategory {
  id: string;
  nome: string;
  nota?: string;
  voci: MenuItem[];
}

export interface Menu {
  categorie: MenuCategory[];
  aggiornato?: number;
}

export interface NewsItem {
  id: string;
  titolo: string;
  sommario: string;
  testo: string;
  immagine?: string;
  categoria?: string;
  data: number;
  pubblicata: boolean;
}

export interface PodcastEpisode {
  id: string;
  titolo: string;
  descrizione: string;
  youtubeUrl: string;
  data: number;
  pubblicato: boolean;
}

export interface Parola {
  parola: string;
  nota?: string;
  aggiornata: number;
}

export interface Cliente {
  id: string;
  nome: string;
  cognome: string;
  telefono: string;
  email?: string;
  consensoMarketing: boolean;
  creato: number;
}

export interface Registrazione {
  nome: string;
  cognome: string;
  telefono: string;
  email?: string;
  consensoMarketing: boolean;
}

export interface Membro {
  nome: string;
  telefono: string;
}

export type PushResult = 'attivate' | 'negate' | 'non-supportate' | 'errore';
