import { useEffect, useState } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Users, Edit3, LogOut, ExternalLink, Settings2, FolderOpen } from 'lucide-react';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Analytics } from './Analytics';
import { Leads } from './Leads';
import { ContentEditor } from './ContentEditor';
import { Settings } from './Settings';
import { MediaLibraryPage } from './MediaLibrary';

const DashboardStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
    :root {
      --a: #cdb2ff;
      --bg: #1e1d1d;
      --s: #262525;
      --b: rgba(255,255,255,0.07);
      --t: #F0EDE6;
      --m: rgba(240,237,230,0.5);
      --fd: 'Bebas Neue', sans-serif;
      --fs: 'DM Serif Display', serif;
      --fb: 'DM Sans', sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg) !important; color: var(--t) !important; font-family: var(--fb); }
    input, textarea, select, button { font-family: var(--fb); }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border-radius: 100px; font-size: 11px; font-weight: 500; letter-spacing: .13em; text-transform: uppercase; transition: all .2s; border: none; cursor: pointer; }
    .btn-p { background: var(--a); color: #000; }
    .btn-p:hover { box-shadow: 0 0 28px rgba(205,178,255,.28); transform: scale(1.03); }
    .btn-g { background: transparent; color: var(--t); border: .5px solid var(--b); }
    .btn-g:hover { border-color: rgba(255,255,255,.3); }
    .section-label { font-size: 10px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--m); }
    .tag-a { background: rgba(205,178,255,.12); color: var(--a); border: .5px solid rgba(205,178,255,.25); display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; }
  `}</style>
);

type Tab = 'analytics' | 'leads' | 'editor' | 'archivio' | 'settings';

export const AdminApp = () => {
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>('analytics');

  useEffect(() => {
    // La dashboard non deve finire su Google
    const robots = document.createElement('meta');
    robots.name = 'robots'; robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    if (!auth) { setChecking(false); return; }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      // Accesso consentito solo agli utenti presenti in admins/{uid} (vedi firestore.rules)
      let admin = false;
      if (u && db) {
        try { admin = (await getDoc(doc(db, 'admins', u.uid))).exists(); } catch { admin = false; }
      }
      setIsAdmin(admin);
      setChecking(false);
    });
    return unsub;
  }, []);

  if (!isFirebaseConfigured()) return <SetupRequired />;
  if (checking) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--m)' }}>Caricamento...</div>;
  if (!user) return <Login />;
  if (!isAdmin) return <NotAuthorized uid={user.uid} email={user.email} />;

  const NAV_TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'analytics', label: 'Analytics',    icon: <BarChart3 size={14} /> },
    { id: 'leads',     label: 'Lead',          icon: <Users size={14} /> },
    { id: 'editor',    label: 'Editor',         icon: <Edit3 size={14} /> },
    { id: 'archivio',  label: 'Archivio Media', icon: <FolderOpen size={14} /> },
    { id: 'settings',  label: 'Impostazioni',   icon: <Settings2 size={14} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <DashboardStyles />

      {/* ── Navbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(30,29,29,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '.5px solid var(--b)', padding: '0 2rem',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'var(--a)', borderRadius: 8, transform: 'rotate(-4deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: 14, color: '#000', transform: 'rotate(4deg)' }}>IL</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: 16, letterSpacing: '.15em', color: 'var(--t)' }}>INLAB</span>
              <span style={{ fontSize: 9, color: 'var(--m)', letterSpacing: '.2em', textTransform: 'uppercase' }}>Dashboard</span>
            </div>
          </a>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: 2 }}>
            {NAV_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: '7px 13px',
                  background: tab === t.id ? 'rgba(205,178,255,0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  color: tab === t.id ? 'var(--a)' : 'var(--m)',
                  fontSize: 11, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all .2s',
                  position: 'relative',
                }}>
                {t.icon} {t.label}
                {/* Indicatore attivo */}
                {tab === t.id && (
                  <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: 'var(--a)', borderRadius: 2 }} />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" target="_blank" rel="noreferrer"
            style={{ fontSize: 11, color: 'var(--m)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--t)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--m)'}>
            Vai al sito <ExternalLink size={11} />
          </a>
          <button onClick={() => auth && signOut(auth)}
            style={{ background: 'none', border: '.5px solid var(--b)', borderRadius: 100, color: 'var(--m)', padding: '6px 14px', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,100,100,0.4)'; e.currentTarget.style.color = '#ff8888'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.color = 'var(--m)'; }}>
            <LogOut size={11} /> Esci
          </button>
        </div>
      </header>

      {/* ── Contenuto ── */}
      <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
        {tab === 'analytics' && <Analytics />}
        {tab === 'leads'     && <Leads />}
        {tab === 'editor'    && <ContentEditor />}
        {tab === 'archivio'  && <MediaLibraryPage />}
        {tab === 'settings'  && <Settings />}
      </motion.div>
    </div>
  );
};

// ── Accesso negato ────────────────────────────────────────────

const NotAuthorized = ({ uid, email }: { uid: string; email?: string | null }) => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg)', color: 'var(--t)' }}>
    <DashboardStyles />
    <div style={{ maxWidth: 480, textAlign: 'center' }}>
      <p style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 12 }}>Accesso negato</p>
      <h1 style={{ fontFamily: 'var(--fd)', fontSize: '2.6rem', lineHeight: .95, marginBottom: '1rem' }}>ACCOUNT NON AUTORIZZATO</h1>
      <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        {email ? <><b>{email}</b> non è tra gli amministratori.</> : 'Questo account non è tra gli amministratori.'} Per abilitarlo, in Firebase Console → Firestore crea il documento <code>admins/{uid}</code>.
      </p>
      <button className="btn btn-p" onClick={() => auth && signOut(auth)}>Esci</button>
    </div>
  </div>
);

// ── Login ──────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.04)', border: '.5px solid var(--b)',
  borderRadius: 10, color: 'var(--t)', fontSize: 14, fontFamily: 'var(--fb)', outline: 'none',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth!, email, password);
    } catch {
      setError('Email o password errati.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <DashboardStyles />
      <div style={{ position: 'absolute', top: '30%', left: '50%', width: 600, height: 600, background: 'rgba(205,178,255,0.04)', borderRadius: '50%', filter: 'blur(120px)', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit}
        style={{ width: '100%', maxWidth: 380, background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 24, padding: '2.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
          <div style={{ width: 36, height: 36, background: 'var(--a)', borderRadius: 10, transform: 'rotate(-4deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--fd)', fontSize: 16, color: '#000', transform: 'rotate(4deg)' }}>IL</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 18, letterSpacing: '.15em' }}>INLAB</div>
            <div style={{ fontSize: 9, color: 'var(--m)', letterSpacing: '.2em', textTransform: 'uppercase' }}>Dashboard</div>
          </div>
        </div>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', letterSpacing: '.02em', marginBottom: '0.5rem' }}>ACCEDI</h1>
        <p style={{ fontSize: 13, color: 'var(--m)', marginBottom: '2rem', lineHeight: 1.5 }}>Inserisci le credenziali admin per gestire il sito.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 6 }}>Email</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 6 }}>Password</div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          </div>
        </div>
        {error && <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'rgba(255,100,100,0.08)', border: '.5px solid rgba(255,100,100,0.2)', borderRadius: 10, color: '#ff8888', fontSize: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} className="btn btn-p" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Accesso...' : 'Entra'}
        </button>
        <div style={{ fontSize: 11, color: 'var(--m)', marginTop: '1.5rem', textAlign: 'center', lineHeight: 1.6 }}>
          Primo accesso? Crea l'utente dalla Firebase Console:<br />
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Authentication → Users → Add user</span>
        </div>
      </motion.form>
    </div>
  );
};

const SetupRequired = () => (
  <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
    <DashboardStyles />
    <div style={{ maxWidth: 520, background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 24, padding: '2.5rem' }}>
      <div className="tag-a" style={{ marginBottom: '1rem' }}>Setup richiesto</div>
      <h1 style={{ fontFamily: 'var(--fd)', fontSize: '2rem', letterSpacing: '.02em', marginBottom: '1rem' }}>DASHBOARD NON CONFIGURATA</h1>
      <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.6 }}>
        Configura le variabili d'ambiente Firebase nel file <code style={{ color: 'var(--a)' }}>.env</code> per attivare la dashboard.
      </p>
    </div>
  </div>
);
