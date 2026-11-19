import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Loading } from '../components/Ui';
import type { Backend } from '../lib/backend';
import type { PodcastEpisode } from '../lib/types';
import { useAsync } from '../lib/useAsync';
import { formatData, uid } from '../lib/util';
import { youtubeEmbed, youtubeId, youtubeThumb } from '../lib/youtube';

export default function PodcastAdmin({ b }: { b: Backend }) {
  const { data, caricamento, ricarica } = useAsync(() => b.listPodcast(true));
  const [edit, setEdit] = useState<PodcastEpisode | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notifica, setNotifica] = useState(false);

  async function salva() {
    if (!edit) return;
    if (!edit.titolo.trim()) return setErrore('Il titolo è obbligatorio.');
    if (!youtubeId(edit.youtubeUrl)) return setErrore('Il link YouTube non è valido.');
    setBusy(true);
    setErrore(null);
    try {
      await b.savePodcast({ ...edit, titolo: edit.titolo.trim(), youtubeUrl: edit.youtubeUrl.trim() });
      if (notifica && edit.pubblicato) {
        await b.inviaNotifica('Nuovo episodio del podcast', edit.titolo.trim(), '/#/podcast').catch(() => undefined);
      }
      setEdit(null);
      ricarica();
    } catch {
      setErrore('Salvataggio non riuscito.');
    } finally {
      setBusy(false);
    }
  }

  if (edit) {
    const set = (patch: Partial<PodcastEpisode>) => setEdit({ ...edit, ...patch });
    const vid = youtubeId(edit.youtubeUrl);
    return (
      <div className="stack" style={{ maxWidth: 680 }}>
        <h2>{data?.some((x) => x.id === edit.id) ? 'Modifica episodio' : 'Nuovo episodio'}</h2>
        <div className="card stack">
          <label className="field">
            <span>Link YouTube *</span>
            <input value={edit.youtubeUrl} onChange={(e) => set({ youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=… oppure https://youtu.be/…" />
          </label>
          {edit.youtubeUrl && !vid && <div className="msg err">Link non riconosciuto.</div>}
          {vid && (
            <div className="player">
              <iframe src={youtubeEmbed(vid)} title="Anteprima" allowFullScreen />
            </div>
          )}
          <label className="field">
            <span>Titolo *</span>
            <input value={edit.titolo} onChange={(e) => set({ titolo: e.target.value })} maxLength={120} />
          </label>
          <label className="field">
            <span>Descrizione</span>
            <textarea value={edit.descrizione} onChange={(e) => set({ descrizione: e.target.value })} rows={4} />
          </label>
          <label className="field">
            <span>Data</span>
            <input
              type="date"
              value={new Date(edit.data - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
              onChange={(e) => e.target.value && set({ data: new Date(e.target.value + 'T12:00:00').getTime() })}
            />
          </label>
          <label className="check">
            <input type="checkbox" checked={edit.pubblicato} onChange={(e) => set({ pubblicato: e.target.checked })} />
            <span>Pubblicato (visibile nell’app)</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={notifica} onChange={(e) => setNotifica(e.target.checked)} />
            <span>Invia una notifica per questo episodio</span>
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
        <h2>Podcast</h2>
        <span className="spacer" />
        <button
          className="btn"
          onClick={() => {
            setNotifica(false);
            setEdit({ id: uid(), titolo: '', descrizione: '', youtubeUrl: '', data: Date.now(), pubblicato: true });
          }}
        >
          <Plus size={16} /> Nuovo episodio
        </button>
      </div>
      <p className="muted small">Incolla il link YouTube: nell’app il video si guarda direttamente, senza uscire.</p>
      {caricamento && <Loading />}
      {data?.length === 0 && <div className="empty">Nessun episodio.</div>}
      {data?.map((p) => {
        const id = youtubeId(p.youtubeUrl);
        return (
          <div key={p.id} className="card row">
            {id && <img src={youtubeThumb(id)} alt="" style={{ width: 112, aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8 }} />}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div className="row">
                <span className={`badge ${p.pubblicato ? 'on' : ''}`}>{p.pubblicato ? 'Pubblicato' : 'Bozza'}</span>
                <span className="meta">{formatData(p.data)}</span>
              </div>
              <h3 style={{ marginTop: 6 }}>{p.titolo}</h3>
            </div>
            <button className="icon-btn" title="Modifica" onClick={() => { setNotifica(false); setEdit(p); }}><Pencil size={16} /></button>
            <button
              className="icon-btn"
              title="Elimina"
              onClick={async () => {
                if (confirm(`Eliminare “${p.titolo}”?`)) {
                  await b.deletePodcast(p.id);
                  ricarica();
                }
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
