import { BookOpen, Home as HomeIcon, KeyRound, Mic, Newspaper } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { Loading } from './components/Ui';
import { DEMO } from './lib/config';
import { useRoute } from './lib/router';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import NewsPage from './pages/News';
import ParolaPage from './pages/Parola';
import PodcastPage from './pages/Podcast';
import Privacy from './pages/Privacy';

const AdminApp = lazy(() => import('./admin/AdminApp'));

const tabs = [
  { id: '', label: 'Home', icon: HomeIcon },
  { id: 'menu', label: 'Menu', icon: BookOpen },
  { id: 'parola', label: 'Parola', icon: KeyRound, key: true },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'podcast', label: 'Podcast', icon: Mic },
];

export default function App() {
  const [sezione = '', sub] = useRoute();
  const admin = sezione === 'gestione';

  let pagina;
  switch (sezione) {
    case 'menu': pagina = <MenuPage />; break;
    case 'parola': pagina = <ParolaPage />; break;
    case 'news': pagina = <NewsPage id={sub} />; break;
    case 'podcast': pagina = <PodcastPage />; break;
    case 'privacy': pagina = <Privacy />; break;
    case 'gestione': pagina = <AdminApp sezione={sub ?? ''} />; break;
    default: pagina = <Home />;
  }

  return (
    <>
      {DEMO && <div className="demo-banner">Modalità demo · i dati restano solo in questo browser</div>}
      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="#/">Drinkave</a>
          {!admin && (
            <a className="icon-btn" href="#/parola" aria-label="Parola segreta">
              <KeyRound size={18} />
            </a>
          )}
        </div>
      </header>

      <main>
        <Suspense fallback={<div className="wrap page"><Loading /></div>}>{pagina}</Suspense>
      </main>

      {!admin && (
        <nav className="bottomnav" aria-label="Navigazione principale">
          <ul>
            {tabs.map((t) => (
              <li key={t.id}>
                <a href={`#/${t.id}`} className={t.key ? 'key' : undefined} aria-current={sezione === t.id ? 'page' : undefined}>
                  <t.icon size={21} strokeWidth={sezione === t.id ? 2.2 : 1.6} />
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
