import { DEMO } from './config';
import type { Cliente, Menu, NewsItem, Parola, PodcastEpisode, PushResult, Registrazione } from './types';

/** Tutto ciò che l'app sa fare con i dati. Due implementazioni: Firebase (produzione) e demo (browser). */
export interface Backend {
  readonly demo: boolean;
  // Contenuti pubblici
  getMenu(): Promise<Menu>;
  listNews(tutte?: boolean): Promise<NewsItem[]>;
  listPodcast(tutti?: boolean): Promise<PodcastEpisode[]>;
  // Parola segreta (clienti)
  registra(r: Registrazione): Promise<{ parola: Parola; giaIscritto: boolean }>;
  accedi(telefono: string): Promise<Parola>;
  // Notifiche
  attivaNotifiche(): Promise<PushResult>;
  // Gestione (solo admin)
  adminLogin(email: string, password: string): Promise<void>;
  adminLogout(): Promise<void>;
  onAdmin(cb: (admin: { email: string } | null) => void): () => void;
  saveMenu(m: Menu): Promise<void>;
  saveNews(n: NewsItem): Promise<void>;
  deleteNews(id: string): Promise<void>;
  savePodcast(p: PodcastEpisode): Promise<void>;
  deletePodcast(id: string): Promise<void>;
  getParolaAdmin(): Promise<Parola | null>;
  saveParola(p: Parola): Promise<void>;
  listClienti(): Promise<Cliente[]>;
  deleteCliente(c: Cliente): Promise<void>;
  inviaNotifica(titolo: string, testo: string, link: string): Promise<{ inviate: number; errori: number }>;
}

let promessa: Promise<Backend> | null = null;

export function backend(): Promise<Backend> {
  if (!promessa) {
    promessa = DEMO
      ? import('./demoBackend').then((m) => m.creaDemoBackend())
      : import('./firebaseBackend').then((m) => m.creaFirebaseBackend());
  }
  return promessa;
}

/** Errore con messaggio già pronto da mostrare all'utente. */
export class ErroreUtente extends Error {}
