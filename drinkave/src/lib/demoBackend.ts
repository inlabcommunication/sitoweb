import type { Backend } from './backend';
import { ErroreUtente } from './backend';
import { menuIniziale, newsIniziali, parolaIniziale, podcastIniziali } from './demoData';
import type { Cliente, Menu, NewsItem, Parola, PodcastEpisode } from './types';
import { normalizzaTelefono, uid } from './util';

const K = 'drinkave.demo.';

function leggi<T>(chiave: string, iniziale: T): T {
  try {
    const raw = localStorage.getItem(K + chiave);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* storage non disponibile */
  }
  return iniziale;
}

function scrivi(chiave: string, valore: unknown) {
  try {
    localStorage.setItem(K + chiave, JSON.stringify(valore));
  } catch {
    /* storage non disponibile */
  }
}

const attesa = () => new Promise((r) => setTimeout(r, 150));

export function creaDemoBackend(): Backend {
  const ascoltatori = new Set<(a: { email: string } | null) => void>();
  const adminCorrente = () => leggi<{ email: string } | null>('admin', null);
  const notifica = () => ascoltatori.forEach((cb) => cb(adminCorrente()));
  const richiediAdmin = () => {
    if (!adminCorrente()) throw new ErroreUtente('Accesso non autorizzato.');
  };

  return {
    demo: true,

    async getMenu() {
      await attesa();
      return leggi<Menu>('menu', menuIniziale);
    },
    async listNews(tutte = false) {
      await attesa();
      const n = leggi<NewsItem[]>('news', newsIniziali);
      return n.filter((x) => tutte || x.pubblicata).sort((a, b) => b.data - a.data);
    },
    async listPodcast(tutti = false) {
      await attesa();
      const p = leggi<PodcastEpisode[]>('podcast', podcastIniziali);
      return p.filter((x) => tutti || x.pubblicato).sort((a, b) => b.data - a.data);
    },

    async registra(r) {
      await attesa();
      const telefono = normalizzaTelefono(r.telefono);
      const clienti = leggi<Cliente[]>('clienti', []);
      const giaIscritto = clienti.some((c) => c.telefono === telefono);
      if (!giaIscritto) {
        clienti.push({
          id: uid(),
          nome: r.nome.trim(),
          cognome: r.cognome.trim(),
          telefono,
          email: r.email?.trim() || undefined,
          consensoMarketing: r.consensoMarketing,
          creato: Date.now(),
        });
        scrivi('clienti', clienti);
      }
      return { parola: leggi<Parola>('parola', parolaIniziale), giaIscritto };
    },
    async accedi(tel) {
      await attesa();
      const telefono = normalizzaTelefono(tel);
      if (!leggi<Cliente[]>('clienti', []).some((c) => c.telefono === telefono)) {
        throw new ErroreUtente('Numero non trovato. Iscriviti per scoprire la parola.');
      }
      return leggi<Parola>('parola', parolaIniziale);
    },

    async attivaNotifiche() {
      if (!('Notification' in window)) return 'non-supportate';
      const p = await Notification.requestPermission();
      if (p !== 'granted') return 'negate';
      const reg = await navigator.serviceWorker?.getRegistration();
      const opzioni = { body: 'Notifiche attive (modalità demo).', icon: '/icon-192.png' };
      if (reg) await reg.showNotification('Drinkave', opzioni);
      else new Notification('Drinkave', opzioni);
      return 'attivate';
    },

    async adminLogin(email, password) {
      await attesa();
      if (!email || !password) throw new ErroreUtente('Inserisci email e password.');
      scrivi('admin', { email });
      notifica();
    },
    async adminLogout() {
      try {
        localStorage.removeItem(K + 'admin');
      } catch {
        /* */
      }
      notifica();
    },
    onAdmin(cb) {
      ascoltatori.add(cb);
      cb(adminCorrente());
      return () => ascoltatori.delete(cb);
    },
    async saveMenu(m) {
      richiediAdmin();
      scrivi('menu', { ...m, aggiornato: Date.now() });
    },
    async saveNews(n) {
      richiediAdmin();
      const lista = leggi<NewsItem[]>('news', newsIniziali).filter((x) => x.id !== n.id);
      scrivi('news', [...lista, n]);
    },
    async deleteNews(id) {
      richiediAdmin();
      scrivi('news', leggi<NewsItem[]>('news', newsIniziali).filter((x) => x.id !== id));
    },
    async savePodcast(p) {
      richiediAdmin();
      const lista = leggi<PodcastEpisode[]>('podcast', podcastIniziali).filter((x) => x.id !== p.id);
      scrivi('podcast', [...lista, p]);
    },
    async deletePodcast(id) {
      richiediAdmin();
      scrivi('podcast', leggi<PodcastEpisode[]>('podcast', podcastIniziali).filter((x) => x.id !== id));
    },
    async getParolaAdmin() {
      richiediAdmin();
      return leggi<Parola>('parola', parolaIniziale);
    },
    async saveParola(p) {
      richiediAdmin();
      scrivi('parola', p);
    },
    async listClienti() {
      richiediAdmin();
      return leggi<Cliente[]>('clienti', []).sort((a, b) => b.creato - a.creato);
    },
    async deleteCliente(c) {
      richiediAdmin();
      scrivi('clienti', leggi<Cliente[]>('clienti', []).filter((x) => x.id !== c.id));
    },
    async inviaNotifica(titolo, testo) {
      richiediAdmin();
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg && Notification.permission === 'granted') {
        await reg.showNotification(titolo, { body: testo, icon: '/icon-192.png' });
        return { inviate: 1, errori: 0 };
      }
      return { inviate: 0, errori: 0 };
    },
  };
}
