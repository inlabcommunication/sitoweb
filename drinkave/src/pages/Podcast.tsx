import { Play } from 'lucide-react';
import { useState } from 'react';
import { Deco, Errore, Loading } from '../components/Ui';
import { backend } from '../lib/backend';
import { useAsync } from '../lib/useAsync';
import { formatData } from '../lib/util';
import { youtubeEmbed, youtubeId, youtubeThumb } from '../lib/youtube';

export default function PodcastPage() {
  const { data, errore, caricamento, ricarica } = useAsync(async () =>
    (await (await backend()).listPodcast()).filter((p) => youtubeId(p.youtubeUrl)),
  );
  const [scelto, setScelto] = useState<string | null>(null);
  const [avviato, setAvviato] = useState(false);

  const corrente = data?.find((p) => p.id === scelto) ?? data?.[0];
  const vid = corrente ? youtubeId(corrente.youtubeUrl) : null;

  return (
    <div className="wrap page">
      <header className="center">
        <div className="eyebrow">Voci dal retrobottega</div>
        <h1>Podcast</h1>
        <Deco />
      </header>

      {caricamento && <Loading />}
      {errore && <Errore testo="Non riusciamo a caricare gli episodi." onRiprova={ricarica} />}
      {data && data.length === 0 && <div className="empty">Il primo episodio arriva presto.</div>}

      {corrente && vid && (
        <section style={{ marginTop: 20 }}>
          <div className="player">
            {avviato ? (
              <iframe
                key={vid}
                src={youtubeEmbed(vid, true)}
                title={corrente.titolo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <button
                onClick={() => setAvviato(true)}
                aria-label={`Riproduci ${corrente.titolo}`}
                style={{ position: 'absolute', inset: 0, border: 0, padding: 0, cursor: 'pointer', background: '#000' }}
              >
                <img src={youtubeThumb(vid)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                  <span style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gold)', display: 'grid', placeItems: 'center', color: '#1a140c' }}>
                    <Play size={32} fill="currentColor" />
                  </span>
                </span>
              </button>
            )}
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="meta">{formatData(corrente.data)}</div>
            <h2 style={{ marginTop: 6 }}>{corrente.titolo}</h2>
            {corrente.descrizione && <p className="muted" style={{ whiteSpace: 'pre-line' }}>{corrente.descrizione}</p>}
          </div>
        </section>
      )}

      {data && data.length > 1 && (
        <>
          <div className="ornament" aria-hidden="true"><span>EPISODI</span></div>
          <div className="stack">
            {data.map((p) => {
              const id = youtubeId(p.youtubeUrl)!;
              const attivo = p.id === corrente?.id;
              return (
                <button
                  key={p.id}
                  className="card ep"
                  aria-current={attivo}
                  onClick={() => {
                    setScelto(p.id);
                    setAvviato(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span className="thumb">
                    <img src={youtubeThumb(id)} alt="" loading="lazy" />
                    <span className="play"><Play size={22} fill="currentColor" /></span>
                  </span>
                  <span>
                    <span className="meta">{formatData(p.data)}</span>
                    <h3>{p.titolo}</h3>
                    <p>{p.descrizione}</p>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
