import { useEffect, useState } from 'react';
import { Loading } from '../components/Ui';
import type { Backend } from '../lib/backend';
import { useAsync } from '../lib/useAsync';
import { formatDataOra } from '../lib/util';

export default function ParolaAdmin({ b }: { b: Backend }) {
  const { data, caricamento, ricarica } = useAsync(() => b.getParolaAdmin());
  const [parola, setParola] = useState('');
  const [nota, setNota] = useState('');
  const [avvisa, setAvvisa] = useState(true);
  const [stato, setStato] = useState<{ ok: boolean; testo: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) {
      setParola(data.parola);
      setNota(data.nota ?? '');
    }
  }, [data]);

  async function salva() {
    if (!parola.trim()) return setStato({ ok: false, testo: 'La parola non può essere vuota.' });
    setBusy(true);
    setStato(null);
    try {
      await b.saveParola({ parola: parola.trim(), nota: nota.trim(), aggiornata: Date.now() });
      let testo = 'Parola aggiornata.';
      if (avvisa) {
        try {
          const r = await b.inviaNotifica('Nuova parola d’ordine', 'La parola è cambiata: aprila nell’app.', '/#/parola');
          testo += ` Notifica inviata a ${r.inviate} dispositivi.`;
        } catch (e) {
          testo += ` Notifica non inviata: ${e instanceof Error ? e.message : ''}`;
        }
      }
      setStato({ ok: true, testo });
      ricarica();
    } catch {
      setStato({ ok: false, testo: 'Salvataggio non riuscito.' });
    } finally {
      setBusy(false);
    }
  }

  if (caricamento && !data) return <Loading />;

  return (
    <div className="stack" style={{ maxWidth: 520 }}>
      <h2>Parola segreta</h2>
      <p className="muted small">La vedono solo i clienti iscritti, nella sezione “Parola”.</p>
      <div className="card stack">
        <label className="field">
          <span>Parola d’ordine</span>
          <input value={parola} onChange={(e) => setParola(e.target.value)} maxLength={60} style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem' }} />
        </label>
        <label className="field">
          <span>Nota (facoltativa)</span>
          <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Es. valida fino a domenica" maxLength={140} />
        </label>
        <label className="check">
          <input type="checkbox" checked={avvisa} onChange={(e) => setAvvisa(e.target.checked)} />
          <span>Avvisa con una notifica chi ha attivato le notifiche</span>
        </label>
        {data && <div className="muted small">Ultima modifica: {formatDataOra(data.aggiornata)}</div>}
        {stato && <div className={`msg ${stato.ok ? 'ok' : 'err'}`}>{stato.testo}</div>}
        <button className="btn" onClick={salva} disabled={busy}>{busy ? 'Salvataggio…' : 'Salva parola'}</button>
      </div>
    </div>
  );
}
