import { BellRing, BookOpen, KeyRound, LayoutDashboard, LogOut, Mic, Newspaper, Users } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Loading } from '../components/Ui';
import { backend, ErroreUtente, type Backend } from '../lib/backend';
import ClientiAdmin from './ClientiAdmin';
import Dashboard from './Dashboard';
import MenuAdmin from './MenuAdmin';
import NewsAdmin from './NewsAdmin';
import NotificheAdmin from './NotificheAdmin';
import ParolaAdmin from './ParolaAdmin';
import PodcastAdmin from './PodcastAdmin';

const sezioni = [
  { id: '', label: 'Panoramica', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu', icon: BookOpen },
  { id: 'parola', label: 'Parola', icon: KeyRound },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'podcast', label: 'Podcast', icon: Mic },
  { id: 'clienti', label: 'Clienti', icon: Users },
  { id: 'notifiche', label: 'Notifiche', icon: BellRing },
];

export default function AdminApp({ sezione }: { sezione: string }) {
  const [b, setB] = useState<Backend | null>(null);
  const [admin, setAdmin] = useState<{ email: string } | null | undefined>(undefined);

  useEffect(() => {
    let stop = () => {};
    backend().then((x) => {
      setB(x);
      stop = x.onAdmin(setAdmin);
    });
    return () => stop();
  }, []);

  if (!b || admin === undefined) return <div className="wrap page"><Loading /></div>;
  if (!admin) return <Login b={b} />;

  const Corpo = {
    '': Dashboard,
    menu: MenuAdmin,
    parola: ParolaAdmin,
    news: NewsAdmin,
    podcast: PodcastAdmin,
    clienti: ClientiAdmin,
    notifiche: NotificheAdmin,
  }[sezione] ?? Dashboard;

  return (
    <div className="admin">
      <div className="wrap">
        <div className="row" style={{ paddingTop: 16 }}>
          <div>
            <div className="eyebrow">Gestione</div>
            <div className="muted small">{admin.email}</div>
          </div>
          <span className="spacer" />
          <a className="btn ghost sm" href="#/">Vedi app</a>
          <button className="icon-btn" title="Esci" aria-label="Esci" onClick={() => b.adminLogout()}>
            <LogOut size={16} />
          </button>
        </div>
        <nav className="admin-nav" aria-label="Sezioni gestione">
          {sezioni.map((s) => (
            <a key={s.id} href={`#/gestione/${s.id}`} aria-current={sezione === s.id ? 'page' : undefined}>
              <s.icon size={14} /> {s.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="wrap page">
        <Corpo b={b} />
      </div>
    </div>
  );
}

function Login({ b }: { b: Backend }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function invia(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrore(null);
    try {
      await b.adminLogin(email, password);
    } catch (err) {
      setErrore(err instanceof ErroreUtente ? err.message : 'Accesso non riuscito.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap page" style={{ maxWidth: 420 }}>
      <form className="card stack" onSubmit={invia}>
        <div className="eyebrow">Drinkave</div>
        <h2>Area gestione</h2>
        {b.demo && <div className="msg info">Modalità demo: inserisci un’email e una password qualsiasi.</div>}
        <label className="field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {errore && <div className="msg err">{errore}</div>}
        <button className="btn block" disabled={busy}>{busy ? 'Accesso…' : 'Entra'}</button>
      </form>
    </div>
  );
}
