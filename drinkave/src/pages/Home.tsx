import { BookOpen, KeyRound, Mic, Newspaper } from 'lucide-react';
import { NotificheCard } from '../components/NotificheButton';
import { Deco, Ornament } from '../components/Ui';
import { backend } from '../lib/backend';
import { useAsync } from '../lib/useAsync';
import { formatData } from '../lib/util';

export default function Home() {
  const news = useAsync(async () => (await (await backend()).listNews()).slice(0, 2));

  return (
    <div className="wrap page">
      <section className="hero">
        <div className="eyebrow">Speakeasy · dal tramonto</div>
        <h1>Drinkave</h1>
        <Deco />
        <p>Dietro la porta giusta, con la parola giusta.</p>
      </section>

      <div className="grid2" style={{ marginTop: 26 }}>
        <a className="card link tile feature" href="#/parola">
          <KeyRound size={28} />
          <h3>Scopri la parola d’ordine</h3>
          <p>Iscriviti o accedi: senza la parola la porta resta chiusa.</p>
        </a>
        <a className="card link tile" href="#/menu">
          <BookOpen size={26} />
          <h3>Menu</h3>
          <p>Signature e grandi classici.</p>
        </a>
        <a className="card link tile" href="#/news">
          <Newspaper size={26} />
          <h3>News</h3>
          <p>Eventi e novità.</p>
        </a>
        <a className="card link tile" href="#/podcast" style={{ gridColumn: '1 / -1' }}>
          <Mic size={26} />
          <h3>Podcast</h3>
          <p>Guarda gli episodi senza uscire dall’app.</p>
        </a>
      </div>

      {news.data && news.data.length > 0 && (
        <>
          <Ornament label="ULTIME NOTIZIE" />
          <div className="stack">
            {news.data.map((n) => (
              <a key={n.id} className="card link" href={`#/news/${n.id}`}>
                <div className="meta">
                  {n.categoria ? `${n.categoria} · ` : ''}
                  {formatData(n.data)}
                </div>
                <h3 style={{ marginTop: 6 }}>{n.titolo}</h3>
                <p className="muted small" style={{ margin: '4px 0 0' }}>{n.sommario}</p>
              </a>
            ))}
          </div>
        </>
      )}

      <Ornament />
      <NotificheCard />
    </div>
  );
}
