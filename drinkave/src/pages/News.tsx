import { ArrowLeft } from 'lucide-react';
import { Deco, Errore, Loading } from '../components/Ui';
import { backend } from '../lib/backend';
import { useAsync } from '../lib/useAsync';
import { formatData } from '../lib/util';

export default function NewsPage({ id }: { id?: string }) {
  const { data, errore, caricamento, ricarica } = useAsync(async () => (await backend()).listNews());

  if (id) {
    const n = data?.find((x) => x.id === id);
    return (
      <div className="wrap page article">
        <a className="back" href="#/news"><ArrowLeft size={14} /> Tutte le news</a>
        {caricamento && <Loading />}
        {!caricamento && !n && <div className="empty">Articolo non trovato.</div>}
        {n && (
          <article style={{ marginTop: 18 }}>
            <div className="meta">
              {n.categoria ? `${n.categoria} · ` : ''}
              {formatData(n.data)}
            </div>
            <h1 style={{ marginTop: 8 }}>{n.titolo}</h1>
            {n.immagine && <img className="cover" src={n.immagine} alt="" />}
            {!n.immagine && <Deco />}
            <p className="testo">{n.testo}</p>
          </article>
        )}
      </div>
    );
  }

  return (
    <div className="wrap page">
      <header className="center">
        <div className="eyebrow">Dal bancone</div>
        <h1>News</h1>
        <Deco />
      </header>
      {caricamento && <Loading />}
      {errore && <Errore testo="Non riusciamo a caricare le news." onRiprova={ricarica} />}
      {data && data.length === 0 && <div className="empty">Nessuna novità per ora.</div>}
      <div className="stack" style={{ marginTop: 20 }}>
        {data?.map((n) => (
          <a key={n.id} className="card link news-card" href={`#/news/${n.id}`}>
            {n.immagine && <img className="cover" src={n.immagine} alt="" loading="lazy" />}
            <div className="body">
              <div className="meta">
                {n.categoria ? `${n.categoria} · ` : ''}
                {formatData(n.data)}
              </div>
              <h3>{n.titolo}</h3>
              <p>{n.sommario}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
