import { Deco, Errore, Loading } from '../components/Ui';
import { backend } from '../lib/backend';
import { useAsync } from '../lib/useAsync';

export default function MenuPage() {
  const { data, errore, caricamento, ricarica } = useAsync(async () => (await backend()).getMenu());

  return (
    <div className="wrap page">
      <header className="center">
        <div className="eyebrow">La carta</div>
        <h1>Menu</h1>
        <Deco />
      </header>

      {caricamento && <Loading />}
      {errore && <Errore testo="Non riusciamo a caricare il menu." onRiprova={ricarica} />}

      {data && data.categorie.length === 0 && <div className="empty">Il menu sarà disponibile a breve.</div>}

      {data && data.categorie.length > 1 && (
        <nav className="cat-nav" aria-label="Categorie" style={{ marginTop: 18 }}>
          {data.categorie.map((c) => (
            <a
              key={c.id}
              href={`#/menu`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('cat-' + c.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {c.nome}
            </a>
          ))}
        </nav>
      )}

      {data?.categorie.map((c) => (
        <section key={c.id} id={'cat-' + c.id} className="menu-cat">
          <h2>{c.nome}</h2>
          {c.nota && <p className="nota">{c.nota}</p>}
          <div className="card" style={{ marginTop: 14, paddingTop: 4, paddingBottom: 4 }}>
            {c.voci.map((v) => (
              <article key={v.id} className="voce">
                <div className="voce-head">
                  <h3>{v.nome}</h3>
                  <span className="dots" />
                  {v.prezzo && <span className="prezzo">€ {v.prezzo}</span>}
                </div>
                {v.descrizione && <p>{v.descrizione}</p>}
                {v.tag && <span className="tag">{v.tag}</span>}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
