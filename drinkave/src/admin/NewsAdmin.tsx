import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Loading } from '../components/Ui';
import type { Backend } from '../lib/backend';
import type { NewsItem } from '../lib/types';
import { useAsync } from '../lib/useAsync';
import { formatData, uid } from '../lib/util';

const toInput = (ms: number) => new Date(ms - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export default function NewsAdmin({ b }: { b: Backend }) {
  const { data, caricamento, ricarica } = useAsync(() => b.listNews(true));
  const [edit, setEdit] = useState<NewsItem | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notifica, setNotifica] = useState(false);

  const nuova = () => {
    setNotifica(false);
    setEdit({ id: uid(), titolo: '', sommario: '', testo: '', immagine: '', categoria: '', data: Date.now(), pubblicata: true });
  };

  async function salva() {
    if (!edit) return;
    if (!edit.titolo.trim()) return setErrore('Il titolo è obbligatorio.');
    setBusy(true);
    setErrore(null);
    try {
      await b.saveNews({ ...edit, titolo: edit.titolo.trim() });
      if (notifica && edit.pubblicata) {
        await b.inviaNotifica(edit.titolo.trim(), edit.sommario.trim(), `/#/news/${edit.id}`).catch(() => undefined);
      }
      setEdit(null);
      ricarica();
    } catch {
      setErrore('Salvataggio non riuscito.');
    } finally {
      setBusy(false);
    }
  }

  async function elimina(n: NewsItem) {
    if (!confirm(`Eliminare “${n.titolo}”?`)) return;
    await b.deleteNews(n.id);
    ricarica();
  }

  if (edit) {
    const set = (patch: Partial<NewsItem>) => setEdit({ ...edit, ...patch });
    return (
      <div className="stack" style={{ maxWidth: 680 }}>
        <h2>{data?.some((x) => x.id === edit.id) ? 'Modifica news' : 'Nuova news'}</h2>
        <div className="card stack">
          <label className="field">
            <span>Titolo *</span>
            <input value={edit.titolo} onChange={(e) => set({ titolo: e.target.value })} maxLength={120} />
          </label>
          <div className="grid2">
            <label className="field">
              <span>Categoria</span>
              <input value={edit.categoria ?? ''} onChange={(e) => set({ categoria: e.target.value })} placeholder="Eventi, Novità…" />
            </label>
            <label className="field">
              <span>Data</span>
              <input
                type="date"
                value={toInput(edit.data)}
                onChange={(e) => e.target.value && set({ data: new Date(e.target.value + 'T12:00:00').getTime() })}
              />
            </label>
          </div>
          <label className="field">
            <span>Sommario (anteprima)</span>
            <input value={edit.sommario} onChange={(e) => set({ sommario: e.target.value })} maxLength={200} />
          </label>
          <label className="field">
            <span>Testo</span>
            <textarea value={edit.testo} onChange={(e) => set({ testo: e.target.value })} rows={8} />
          </label>
          <label className="field">
            <span>Immagine (link, facoltativo)</span>
            <input value={edit.immagine ?? ''} onChange={(e) => set({ immagine: e.target.value })} placeholder="https://…" />
          </label>
          {edit.immagine && <img src={edit.immagine} alt="Anteprima" style={{ borderRadius: 10, maxHeight: 200, objectFit: 'cover' }} />}
          <label className="check">
            <input type="checkbox" checked={edit.pubblicata} onChange={(e) => set({ pubblicata: e.target.checked })} />
            <span>Pubblicata (visibile nell’app)</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={notifica} onChange={(e) => setNotifica(e.target.checked)} />
            <span>Invia una notifica con questa news</span>
          </label>
          {errore && <div className="msg err">{errore}</div>}
          <div className="row">
            <button className="btn" onClick={salva} disabled={busy}>{busy ? 'Salvataggio…' : 'Salva'}</button>
            <button className="btn ghost" onClick={() => setEdit(null)}>Annulla</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="row">
        <h2>News</h2>
        <span className="spacer" />
        <button className="btn" onClick={nuova}><Plus size={16} /> Nuova</button>
      </div>
      {caricamento && <Loading />}
      {data?.length === 0 && <div className="empty">Nessuna news. Creane una.</div>}
      {data?.map((n) => (
        <div key={n.id} className="card row">
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="row">
              <span className={`badge ${n.pubblicata ? 'on' : ''}`}>{n.pubblicata ? 'Pubblicata' : 'Bozza'}</span>
              <span className="meta">{formatData(n.data)}</span>
            </div>
            <h3 style={{ marginTop: 6 }}>{n.titolo}</h3>
          </div>
          <button className="icon-btn" title="Modifica" onClick={() => { setNotifica(false); setEdit(n); }}><Pencil size={16} /></button>
          <button className="icon-btn" title="Elimina" onClick={() => elimina(n)}><Trash2 size={16} /></button>
        </div>
      ))}
    </div>
  );
}
