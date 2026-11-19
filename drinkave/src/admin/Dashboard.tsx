import { Loading } from '../components/Ui';
import type { Backend } from '../lib/backend';
import { useAsync } from '../lib/useAsync';
import { formatDataOra } from '../lib/util';

export default function Dashboard({ b }: { b: Backend }) {
  const { data } = useAsync(async () => {
    const [clienti, news, podcast, parola, menu] = await Promise.all([
      b.listClienti(),
      b.listNews(true),
      b.listPodcast(true),
      b.getParolaAdmin(),
      b.getMenu(),
    ]);
    const settimana = Date.now() - 7 * 86_400_000;
    return {
      clienti: clienti.length,
      nuovi: clienti.filter((c) => c.creato > settimana).length,
      marketing: clienti.filter((c) => c.consensoMarketing).length,
      news: news.length,
      podcast: podcast.length,
      voci: menu.categorie.reduce((n, c) => n + c.voci.length, 0),
      parola,
    };
  });

  if (!data) return <Loading />;

  const box = (n: number | string, label: string, href: string) => (
    <a className="card link" href={href}>
      <div className="stat">{n}</div>
      <div className="muted small" style={{ marginTop: 6 }}>{label}</div>
    </a>
  );

  return (
    <div className="stack">
      <h2>Panoramica</h2>
      <div className="grid2">
        {box(data.clienti, 'clienti iscritti', '#/gestione/clienti')}
        {box(data.nuovi, 'nuovi negli ultimi 7 giorni', '#/gestione/clienti')}
        {box(data.marketing, 'con consenso marketing', '#/gestione/clienti')}
        {box(data.voci, 'voci nel menu', '#/gestione/menu')}
        {box(data.news, 'news', '#/gestione/news')}
        {box(data.podcast, 'episodi podcast', '#/gestione/podcast')}
      </div>
      <a className="card link" href="#/gestione/parola">
        <div className="eyebrow">Parola attuale</div>
        <div className="stat" style={{ marginTop: 8 }}>{data.parola?.parola ?? '— non impostata —'}</div>
        {data.parola && <div className="muted small" style={{ marginTop: 6 }}>Aggiornata il {formatDataOra(data.parola.aggiornata)}</div>}
      </a>
    </div>
  );
}
