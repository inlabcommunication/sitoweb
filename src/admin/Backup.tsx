import { useState } from 'react';
import { DownloadCloud, AlertCircle, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { firebaseConfig } from '../lib/firebaseConfig';
import { collection, doc, documentId, getCountFromServer, getDoc, getDocs, limit, orderBy, query, startAfter, Timestamp, type QueryDocumentSnapshot } from 'firebase/firestore';

// «Scarica copia» (Direttore 25/11): copia di sicurezza in JSON di contenuti del sito, lead e articoli.
// Tutto avviene nel browser dell'admin: nessun invio a servizi esterni, niente scritto nel database
// o nel repository. Lettura a pagine da 500 documenti, per non esaurire le letture del piano Spark.
// Costo: 1 lettura per documento (minimo 1 per pagina) + 3 documenti di app/ + 2 conteggi di controllo.

const PAGE = 500;
const COLLECTIONS = ['leads', 'blog_posts'] as const;
const SINGLE_DOCS = ['site_content', 'media_library', 'settings'] as const;

/** Le date di Firestore diventano testo ISO, così il file è leggibile e si reimporta facilmente */
const plain = (v: any): any => {
  if (v instanceof Timestamp) return v.toDate().toISOString();
  if (Array.isArray(v)) return v.map(plain);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plain(x)]));
  return v;
};

async function readAll(name: string, onPage: (n: number) => void) {
  const out: Record<string, any>[] = [];
  let last: QueryDocumentSnapshot | null = null;
  let pages = 0;
  for (;;) {
    const q = last
      ? query(collection(db!, name), orderBy(documentId()), startAfter(last), limit(PAGE))
      : query(collection(db!, name), orderBy(documentId()), limit(PAGE));
    const snap = await getDocs(q);
    pages += 1;
    snap.docs.forEach((d) => out.push({ id: d.id, ...plain(d.data()) }));
    onPage(out.length);
    if (snap.size < PAGE) break;
    last = snap.docs[snap.docs.length - 1];
  }
  return { docs: out, pages };
}

export const Backup = () => {
  const [state, setState] = useState<{ busy?: boolean; progress?: string; done?: string; error?: string }>({});

  const run = async () => {
    if (!db) return;
    setState({ busy: true, progress: 'Lettura dei contenuti del sito…' });
    try {
      const data: Record<string, any> = {};
      const counts: Record<string, number> = {};
      // Documenti singoli: contenuti del sito, indice della libreria media (file su Cloudinary) e
      // impostazioni del chatbot (provider, modello, informazioni; le chiavi API non sono qui)
      for (const id of SINGLE_DOCS) {
        const snap = await getDoc(doc(db, 'app', id));
        // Le chiavi API non devono mai finire in un file: se ne è rimasta qualcuna in app/settings
        // (salvata in passato, vedi Impostazioni) si toglie dalla copia
        const raw = snap.exists() ? { ...snap.data() } : null;
        if (raw && id === 'settings') for (const k of Object.keys(raw)) if (/key|secret|token|password/i.test(k)) delete raw[k];
        data[id] = raw ? plain(raw) : null;
        counts[id] = snap.exists() ? 1 : 0;
      }
      const expected: Record<string, number> = {};
      let reads = SINGLE_DOCS.length;
      for (const name of COLLECTIONS) {
        const r = await readAll(name, (n) => setState({ busy: true, progress: `Lettura ${name}: ${n} documenti…` }));
        data[name] = r.docs;
        counts[name] = r.docs.length;
        reads += Math.max(r.docs.length, r.pages);
        // Controllo di completezza: il numero di documenti che Firestore dichiara per la collezione
        expected[name] = (await getCountFromServer(collection(db, name))).data().count;
        reads += 1;
      }
      const complete = COLLECTIONS.every((n) => counts[n] === expected[n]);
      const now = new Date();
      const file = {
        meta: { creato_il: now.toISOString(), progetto: firebaseConfig.projectId || '', versione: 1, documenti: counts, documenti_in_firestore: expected, completo: complete, letture_usate_circa: reads },
        ...data,
      };
      const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inlab-copia-${now.toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      const summary = `${counts.leads} lead, ${counts.blog_posts} articoli, contenuti del sito ${counts.site_content ? 'sì' : 'mancanti'} · circa ${reads} letture`;
      setState(complete ? { done: `Copia scaricata e completa: ${summary}.` } : { error: `Copia scaricata ma NON completa (in Firestore: ${expected.leads} lead, ${expected.blog_posts} articoli). Riprova; se si ripete, avvisa Sito Inlab.` });
    } catch (e: any) {
      setState({ error: `Copia non riuscita (${e?.code || e?.message || 'errore sconosciuto'}). Riprova tra qualche minuto.` });
    }
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--m)', lineHeight: 1.7, marginBottom: 12 }}>
        Scarica in un file JSON i contenuti del sito, tutti i lead, gli articoli del blog, l'elenco della libreria media e le impostazioni del chatbot. Consigliato una volta a settimana. Istruzioni e ripristino: <code>docs/sviluppo/backup.md</code>.
      </p>
      <div role="note" style={{ padding: '12px 14px', background: 'rgba(255,200,120,0.08)', border: '.5px solid rgba(255,200,120,0.35)', borderRadius: 12, fontSize: 12, color: '#ffd9a0', lineHeight: 1.7, marginBottom: 12 }}>
        <AlertCircle size={12} style={{ display: 'inline', marginRight: 6 }} />
        <b>Il file contiene dati personali</b> (nomi, email e telefoni dei lead): conservalo in un posto privato e non condividerlo.
      </div>
      <button onClick={run} disabled={state.busy} className="btn btn-g" style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: state.busy ? 0.6 : 1 }}>
        <DownloadCloud size={14} /> {state.busy ? 'Preparazione…' : 'Scarica copia'}
      </button>
      {state.progress && state.busy && <div style={{ fontSize: 12, color: 'var(--m)', marginTop: 10 }}>{state.progress}</div>}
      {state.done && <div role="status" style={{ fontSize: 12, color: '#a3e4a3', marginTop: 10 }}><CheckCircle size={12} style={{ display: 'inline', marginRight: 6 }} />{state.done}</div>}
      {state.error && <div role="alert" style={{ fontSize: 12, color: '#ffb4b4', marginTop: 10 }}>{state.error}</div>}
    </div>
  );
};
