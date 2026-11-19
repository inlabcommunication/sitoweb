import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore/lite';
import type { Backend } from './backend';
import { ErroreUtente } from './backend';
import { firebaseConfig, vapidKey } from './config';
import type { Cliente, Menu, NewsItem, Parola, PodcastEpisode } from './types';
import { normalizzaTelefono } from './util';

const ms = (v: unknown): number =>
  v instanceof Timestamp ? v.toMillis() : typeof v === 'number' ? v : Date.now();

export function creaFirebaseBackend(): Backend {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  /** Ogni visitatore ha una sessione anonima: serve alle regole Firestore per riconoscere gli iscritti. */
  async function utente(): Promise<User> {
    await auth.authStateReady();
    if (auth.currentUser) return auth.currentUser;
    return (await signInAnonymously(auth)).user;
  }

  async function utenteAdmin(): Promise<User> {
    await auth.authStateReady();
    const u = auth.currentUser;
    if (!u || u.isAnonymous) throw new ErroreUtente('Accedi come amministratore.');
    return u;
  }

  async function leggiParola(): Promise<Parola> {
    const s = await getDoc(doc(db, 'segreto', 'parola'));
    if (!s.exists()) return { parola: '—', nota: 'La parola non è ancora stata impostata.', aggiornata: Date.now() };
    const d = s.data();
    return { parola: d.parola, nota: d.nota, aggiornata: ms(d.aggiornata) };
  }

  async function accedi(tel: string): Promise<Parola> {
    const u = await utente();
    const telefono = normalizzaTelefono(tel);
    try {
      await setDoc(doc(db, 'accessi', u.uid), { telefono, quando: serverTimestamp() });
    } catch {
      throw new ErroreUtente('Numero non trovato. Iscriviti per scoprire la parola.');
    }
    return leggiParola();
  }

  return {
    demo: false,

    async getMenu() {
      const s = await getDoc(doc(db, 'contenuti', 'menu'));
      return s.exists() ? (s.data() as Menu) : { categorie: [] };
    },
    async listNews(tutte = false) {
      const q = tutte ? collection(db, 'news') : query(collection(db, 'news'), where('pubblicata', '==', true));
      const s = await getDocs(q);
      return s.docs.map((d) => ({ ...(d.data() as NewsItem), id: d.id })).sort((a, b) => b.data - a.data);
    },
    async listPodcast(tutti = false) {
      const q = tutti ? collection(db, 'podcast') : query(collection(db, 'podcast'), where('pubblicato', '==', true));
      const s = await getDocs(q);
      return s.docs.map((d) => ({ ...(d.data() as PodcastEpisode), id: d.id })).sort((a, b) => b.data - a.data);
    },

    async registra(r) {
      const u = await utente();
      const telefono = normalizzaTelefono(r.telefono);
      const batch = writeBatch(db);
      batch.set(doc(db, 'clienti', u.uid), {
        nome: r.nome.trim(),
        cognome: r.cognome.trim(),
        telefono,
        email: r.email?.trim() || '',
        consensoMarketing: r.consensoMarketing,
        creato: serverTimestamp(),
      });
      batch.set(doc(db, 'telefoni', telefono), { uid: u.uid });
      try {
        await batch.commit();
        return { parola: await leggiParola(), giaIscritto: false };
      } catch {
        // Numero già registrato (o questo dispositivo è già iscritto): si entra con il telefono.
        return { parola: await accedi(telefono), giaIscritto: true };
      }
    },
    accedi,

    async attivaNotifiche() {
      const { getMessaging, getToken, isSupported } = await import('firebase/messaging');
      if (!('Notification' in window) || !('serviceWorker' in navigator) || !(await isSupported())) {
        return 'non-supportate';
      }
      const permesso = await Notification.requestPermission();
      if (permesso !== 'granted') return 'negate';
      try {
        const reg = (await navigator.serviceWorker.getRegistration('/')) ?? (await navigator.serviceWorker.register('/sw.js'));
        await navigator.serviceWorker.ready;
        const token = await getToken(getMessaging(app), { vapidKey, serviceWorkerRegistration: reg });
        if (!token) return 'errore';
        await utente();
        await setDoc(doc(db, 'pushTokens', token), { token, creato: serverTimestamp() });
        return 'attivate';
      } catch (e) {
        console.error(e);
        return 'errore';
      }
    },

    async adminLogin(email, password) {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
        const a = await getDoc(doc(db, 'admins', user.uid));
        if (!a.exists()) {
          await signOut(auth);
          throw new ErroreUtente('Questo account non è abilitato alla gestione.');
        }
      } catch (e) {
        if (e instanceof ErroreUtente) throw e;
        throw new ErroreUtente('Email o password non corrette.');
      }
    },
    async adminLogout() {
      await signOut(auth);
    },
    onAdmin(cb) {
      return onAuthStateChanged(auth, async (u) => {
        if (!u || u.isAnonymous) return cb(null);
        try {
          const a = await getDoc(doc(db, 'admins', u.uid));
          cb(a.exists() ? { email: u.email ?? '' } : null);
        } catch {
          cb(null);
        }
      });
    },
    async saveMenu(m) {
      await utenteAdmin();
      await setDoc(doc(db, 'contenuti', 'menu'), { ...m, aggiornato: Date.now() });
    },
    async saveNews(n) {
      await utenteAdmin();
      const { id, ...dati } = n;
      await setDoc(doc(db, 'news', id), { ...dati, immagine: dati.immagine ?? '', categoria: dati.categoria ?? '' });
    },
    async deleteNews(id) {
      await utenteAdmin();
      await deleteDoc(doc(db, 'news', id));
    },
    async savePodcast(p) {
      await utenteAdmin();
      const { id, ...dati } = p;
      await setDoc(doc(db, 'podcast', id), dati);
    },
    async deletePodcast(id) {
      await utenteAdmin();
      await deleteDoc(doc(db, 'podcast', id));
    },
    async getParolaAdmin() {
      await utenteAdmin();
      const s = await getDoc(doc(db, 'segreto', 'parola'));
      if (!s.exists()) return null;
      const d = s.data();
      return { parola: d.parola, nota: d.nota, aggiornata: ms(d.aggiornata) };
    },
    async saveParola(p) {
      await utenteAdmin();
      await setDoc(doc(db, 'segreto', 'parola'), { parola: p.parola, nota: p.nota ?? '', aggiornata: Date.now() });
    },
    async listClienti() {
      await utenteAdmin();
      const s = await getDocs(collection(db, 'clienti'));
      return s.docs
        .map((d) => {
          const x = d.data();
          return {
            id: d.id,
            nome: x.nome,
            cognome: x.cognome,
            telefono: x.telefono,
            email: x.email || undefined,
            consensoMarketing: !!x.consensoMarketing,
            creato: ms(x.creato),
          } satisfies Cliente;
        })
        .sort((a, b) => b.creato - a.creato);
    },
    async deleteCliente(c) {
      await utenteAdmin();
      const batch = writeBatch(db);
      batch.delete(doc(db, 'clienti', c.id));
      batch.delete(doc(db, 'telefoni', c.telefono));
      await batch.commit();
    },
    async inviaNotifica(titolo, testo, link) {
      const u = await utenteAdmin();
      const r = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await u.getIdToken()}` },
        body: JSON.stringify({ titolo, testo, link }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new ErroreUtente(j.errore || 'Invio non riuscito.');
      return { inviate: j.inviate ?? 0, errori: j.errori ?? 0 };
    },
  };
}
