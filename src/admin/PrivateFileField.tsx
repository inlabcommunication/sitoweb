// File privato da far scaricare dopo il modulo (blocco «Presentazione» dei casi studio, Paresteta 23/11).
// Si carica su Cloudinary come "authenticated": l'indirizzo pubblico non funziona; il sito lo consegna
// solo con un link firmato che scade dopo 10 minuti (/api/lead). In Firestore resta solo l'id del file.
import { useState } from 'react';
import type React from 'react';
import { auth } from '../lib/firebase';
import type { PresentationFile } from '../data/caseStudies';

const CLOUD_NAME = 'dp2l14rly';
const API_KEY = '189381191389964';
const MAX_BYTES = 10 * 1024 * 1024; // limite per file del piano Cloudinary gratuito
const mb = (n: number) => (n / 1024 / 1024).toFixed(1).replace('.', ',');
const box: React.CSSProperties = { marginBottom: 12, padding: 12, border: '.5px solid #2a2a2a', borderRadius: 10, background: 'rgba(255,255,255,0.02)' };
const small: React.CSSProperties = { padding: '7px 12px', background: 'rgba(205,178,255,0.08)', border: '.5px solid #cdb2ff44', borderRadius: 8, color: '#cdb2ff', fontSize: 11, cursor: 'pointer' };

export const PrivateFileField = ({ value, onChange, caseId }: { value?: PresentationFile | null; onChange: (v: PresentationFile | null) => void; caseId: string }) => {
  const [busy, setBusy] = useState(0);
  const [msg, setMsg] = useState('');
  // link della prova: sempre a schermo (window.open dopo una chiamata al server viene bloccato, soprattutto sul telefono)
  const [testUrl, setTestUrl] = useState('');
  const token = async () => (await auth?.currentUser?.getIdToken()) || '';

  const upload = async (file?: File) => {
    if (!file) return;
    setMsg('');
    if (!/\.pdf$/i.test(file.name)) return setMsg('Carica un file PDF.');
    if (file.size > MAX_BYTES) return setMsg(`Il PDF pesa ${mb(file.size)} MB: il massimo è 10 MB. Esportalo più leggero e riprova.`);
    try {
      const r = await fetch('/api/cloudinary-sign', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}` }, body: JSON.stringify({ privateFile: true }) });
      if (!r.ok) throw new Error(r.status === 501 ? 'Upload non configurato su Vercel' : 'Upload non autorizzato');
      const s = await r.json();
      const fd = new FormData();
      fd.append('file', file); fd.append('api_key', API_KEY);
      for (const k of ['folder', 'timestamp', 'type', 'signature']) fd.append(k, s[k]);
      const d: any = await new Promise((resolve, reject) => {
        const x = new XMLHttpRequest();
        x.upload.onprogress = (e) => { if (e.lengthComputable) setBusy(Math.max(1, Math.round((e.loaded / e.total) * 100))); };
        x.onload = () => { try { const j = JSON.parse(x.responseText); x.status === 200 ? resolve(j) : reject(new Error(j?.error?.message || 'Caricamento non riuscito')); } catch { reject(new Error('Caricamento non riuscito')); } };
        x.onerror = () => reject(new Error('Errore di rete'));
        x.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`);
        x.send(fd);
      });
      if (d.type !== 'authenticated') setMsg('Attenzione: Cloudinary non ha salvato il file come privato. Non pubblicare e avvisa Sito Inlab.');
      else setMsg('PDF caricato. Salva le modifiche, poi usa «Prova il download».');
      onChange({ publicId: d.public_id, name: file.name, bytes: d.bytes });
    } catch (e: any) {
      setMsg(/File size too large/i.test(e?.message) ? 'Il file supera il limite del piano Cloudinary (10 MB).' : e?.message || 'Caricamento non riuscito');
    } finally { setBusy(0); }
  };

  // Prova del download dalla dashboard (anche con il caso in bozza): usa i dati già salvati
  const test = async () => {
    setMsg('Preparo il link e lo provo…'); setTestUrl('');
    try {
      const r = await fetch(`/api/lead?download=${encodeURIComponent(caseId)}`, { headers: { Authorization: `Bearer ${await token()}` } });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.url) return setMsg(`Link non disponibile (HTTP ${r.status}): ${d.error || 'hai salvato le modifiche?'}`);
      if (/^https:\/\//.test(d.url)) setTestUrl(d.url);
      const p = d.probe || {};
      if (p.status === 200 || p.status === 206) setMsg('Cloudinary consegna il file correttamente. Tocca «Apri il download» qui sotto (il link vale 10 minuti).');
      else if (p.status === 401 || p.status === 403) setMsg(`Cloudinary rifiuta il download (HTTP ${p.status}${p.error ? `: ${p.error}` : ''}). Se parla di PDF o di accesso negato: Cloudinary → Settings → Security → «Allow delivery of PDF and ZIP files» → Save, poi riprova. Copia questo messaggio a Sito Inlab.`);
      else setMsg(`Esito della prova: ${p.status ? `HTTP ${p.status}` : 'nessuna risposta'}${p.error ? ` — ${p.error}` : ''}. Copia questo messaggio a Sito Inlab. Puoi comunque provare il link qui sotto.`);
    } catch { setMsg('Prova non riuscita: controlla la connessione e riprova.'); }
  };

  return (
    <div style={box}>
      <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>File da scaricare (PDF privato, max 10 MB)</div>
      {value?.publicId
        ? <div style={{ fontSize: 12, color: '#ccc', marginBottom: 8 }}>📄 {value.name || value.publicId}{value.bytes ? ` · ${mb(value.bytes)} MB` : ''}</div>
        : <div style={{ fontSize: 11, color: '#777', marginBottom: 8 }}>Nessun file: il pulsante di download non compare.</div>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={small}>{busy ? `Caricamento ${busy}%` : value?.publicId ? 'Sostituisci PDF' : 'Carica PDF'}
          <input type="file" accept="application/pdf,.pdf" disabled={!!busy} style={{ display: 'none' }} onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ''; }} />
        </label>
        {value?.publicId && <button type="button" style={small} onClick={test}>Prova il download</button>}
        {value?.publicId && <button type="button" style={{ ...small, color: '#ff8888', borderColor: '#3a2a2a' }} onClick={() => { onChange(null); setMsg('File tolto dal blocco (resta su Cloudinary).'); }}>Togli</button>}
      </div>
      {msg && <div role="status" style={{ fontSize: 11, color: '#aaa', marginTop: 8, userSelect: 'text' }}>{msg}</div>}
      {testUrl && <a href={testUrl} target="_blank" rel="noopener noreferrer" style={{ ...small, display: 'inline-block', marginTop: 8, textDecoration: 'none' }}>Apri il download</a>}
    </div>
  );
};
