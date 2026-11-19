import { Send } from 'lucide-react';
import { useState } from 'react';
import type { Backend } from '../lib/backend';

const destinazioni = [
  { v: '/#/', l: 'Home' },
  { v: '/#/parola', l: 'Parola segreta' },
  { v: '/#/menu', l: 'Menu' },
  { v: '/#/news', l: 'News' },
  { v: '/#/podcast', l: 'Podcast' },
];

export default function NotificheAdmin({ b }: { b: Backend }) {
  const [titolo, setTitolo] = useState('');
  const [testo, setTesto] = useState('');
  const [link, setLink] = useState('/#/');
  const [busy, setBusy] = useState(false);
  const [stato, setStato] = useState<{ ok: boolean; testo: string } | null>(null);

  async function invia() {
    if (!titolo.trim()) return setStato({ ok: false, testo: 'Scrivi almeno il titolo.' });
    if (!confirm('Inviare la notifica a tutti i dispositivi iscritti?')) return;
    setBusy(true);
    setStato(null);
    try {
      const r = await b.inviaNotifica(titolo.trim(), testo.trim(), link);
      setStato({ ok: true, testo: `Notifica inviata a ${r.inviate} dispositivi${r.errori ? ` (${r.errori} non raggiungibili)` : ''}.` });
      setTitolo('');
      setTesto('');
    } catch (e) {
      setStato({ ok: false, testo: e instanceof Error ? e.message : 'Invio non riuscito.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack" style={{ maxWidth: 560 }}>
      <h2>Invia notifica</h2>
      <p className="muted small">Arriva a tutti quelli che hanno attivato le notifiche nell’app.</p>
      <div className="card stack">
        <label className="field">
          <span>Titolo</span>
          <input value={titolo} onChange={(e) => setTitolo(e.target.value)} maxLength={80} placeholder="Stasera jazz dal vivo" />
        </label>
        <label className="field">
          <span>Messaggio</span>
          <textarea value={testo} onChange={(e) => setTesto(e.target.value)} maxLength={240} rows={3} placeholder="Dalle 22, posti limitati." />
        </label>
        <label className="field">
          <span>Apre la sezione</span>
          <select value={link} onChange={(e) => setLink(e.target.value)}>
            {destinazioni.map((d) => <option key={d.v} value={d.v}>{d.l}</option>)}
          </select>
        </label>
        {b.demo && <div className="msg info">Modalità demo: la notifica viene mostrata solo su questo dispositivo.</div>}
        {stato && <div className={`msg ${stato.ok ? 'ok' : 'err'}`}>{stato.testo}</div>}
        <button className="btn" onClick={invia} disabled={busy}><Send size={16} /> {busy ? 'Invio…' : 'Invia a tutti'}</button>
      </div>
    </div>
  );
}
