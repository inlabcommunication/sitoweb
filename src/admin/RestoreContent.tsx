import { useState } from 'react';
import { History, AlertCircle, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Ripristino una tantum di app/site_content da un file JSON (recupero dati del
// 27/10: un salvataggio fatto mentre Firestore non rispondeva ha sovrascritto
// clienti, reel e immagini). Prima di scrivere legge il documento attuale, ne
// salva una copia in app/site_content_backup_<data> e la scarica sul computer:
// se la lettura o la copia non riescono, non scrive niente.

type Summary = { clients: number; otherClients: number; reels: number; images: number; schemaVersion: unknown };

const summarize = (d: any): Summary => {
  const s = JSON.stringify(d ?? {});
  const items = (k: string) => (Array.isArray(d?.[k]?.items) ? d[k].items : []);
  return {
    clients: items('clients').length,
    otherClients: items('otherClients').length,
    reels: items('clients').reduce((n: number, c: any) => n + (Array.isArray(c?.reels) ? c.reels.filter((r: any) => r?.embed).length : 0), 0),
    images: (s.match(/res\.cloudinary\.com/g) || []).length,
    schemaVersion: d?.schemaVersion,
  };
};

const download = (name: string, data: unknown) => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const Row = ({ label, s }: { label: string; s: Summary }) => (
  <div style={{ fontSize: 12, color: 'var(--m)', lineHeight: 1.7 }}>
    <b style={{ color: 'var(--t)' }}>{label}</b>: {s.clients} clienti, {s.otherClients} altri clienti, {s.reels} reel, {s.images} immagini Cloudinary (schema {String(s.schemaVersion ?? '–')})
  </div>
);

export const RestoreContent = () => {
  const [file, setFile] = useState<{ name: string; data: any } | null>(null);
  const [current, setCurrent] = useState<Summary | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [done, setDone] = useState(false);

  const pick = async (f?: File) => {
    setMsg(null); setFile(null); setCurrent(null);
    if (!f) return;
    if (!db) { setMsg({ ok: false, text: 'Database non configurato.' }); return; }
    try {
      const data = JSON.parse(await f.text());
      if (!data || typeof data !== 'object' || Array.isArray(data) || !Array.isArray(data.clients?.items) || data.schemaVersion == null) {
        setMsg({ ok: false, text: 'Il file non sembra una copia dei contenuti del sito (mancano clienti o versione).' });
        return;
      }
      setFile({ name: f.name, data });
      const snap = await getDoc(doc(db, 'app', 'site_content'));
      setCurrent(summarize(snap.exists() ? snap.data() : null));
    } catch (e) {
      setMsg({ ok: false, text: `Lettura non riuscita (${(e as Error).message}). Riprova più tardi: non è stato scritto niente.` });
    }
  };

  const restore = async () => {
    if (!file || !db || done) return;
    if (!window.confirm(`Sostituire i contenuti del sito con "${file.name}"?\nPrima viene salvata una copia di quelli attuali.`)) return;
    setBusy(true); setMsg(null);
    try {
      const snap = await getDoc(doc(db, 'app', 'site_content'));
      const before = snap.exists() ? snap.data() : null;
      const stamp = new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
      await setDoc(doc(db, 'app', `site_content_backup_${stamp}`), { savedAt: new Date().toISOString(), data: before });
      download(`site_content-prima-del-ripristino-${stamp}.json`, before);
      await setDoc(doc(db, 'app', 'site_content'), file.data);
      setDone(true);
      setMsg({ ok: true, text: `Ripristino fatto. Copia dei dati precedenti: app/site_content_backup_${stamp} (e file scaricato).` });
    } catch (e) {
      setMsg({ ok: false, text: `Ripristino non riuscito (${(e as Error).message}): i contenuti del sito non sono stati cambiati. Avvisa lo sviluppo prima di riprovare.` });
    }
    setBusy(false);
  };

  return (
    <div style={{ background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem', fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)' }}><History size={15} /> Ripristino contenuti</div>
      <p style={{ fontSize: 12, color: 'var(--m)', lineHeight: 1.7, marginBottom: 12 }}>
        Da usare solo su indicazione dello sviluppo. Sostituisce tutti i contenuti del sito con quelli del file; prima ne salva una copia.
      </p>
      <input type="file" accept="application/json,.json" disabled={busy || done} onChange={(e) => pick(e.target.files?.[0])} style={{ fontSize: 12, marginBottom: 12 }} />
      {file && <Row label="File" s={summarize(file.data)} />}
      {current && <Row label="Attuali" s={current} />}
      {file && current && (
        <button onClick={restore} disabled={busy || done} className="btn btn-p" style={{ marginTop: 12, opacity: busy || done ? 0.6 : 1 }}>
          {busy ? 'Ripristino…' : 'Ripristina dal file'}
        </button>
      )}
      {msg && (
        <div role={msg.ok ? 'status' : 'alert'} style={{ marginTop: 12, fontSize: 12, lineHeight: 1.7, color: msg.ok ? '#8fe3a8' : '#ffb4b4' }}>
          {msg.ok ? <CheckCircle size={12} style={{ display: 'inline', marginRight: 6 }} /> : <AlertCircle size={12} style={{ display: 'inline', marginRight: 6 }} />}
          {msg.text}
        </div>
      )}
    </div>
  );
};
