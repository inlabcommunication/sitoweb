import { useEffect, useState } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Users, Edit3, LogOut, ExternalLink, Settings2 } from 'lucide-react';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Analytics } from './Analytics';
import { Leads } from './Leads';
import { ContentEditor } from './ContentEditor';
import { Settings } from './Settings';

type Tab = 'analytics' | 'leads' | 'editor' | 'settings';

export const AdminApp = () => {
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>('analytics');

  useEffect(() => {
    if (!auth) { setChecking(false); return; }
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setChecking(false); });
    return unsub;
  }, []);

  if (!isFirebaseConfigured()) return <SetupRequired />;
  if (checking) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--m)' }}>Caricamento...</div>;
  if (!user) return <Login />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(30,29,29,0.95)', backdropFilter: 'blur(12px)', borderBottom: '.5px solid var(--b)', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'var(--a)', borderRadius: 8, transform: 'rotate(-4deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: 14, color: '#000', transform: 'rotate(4deg)' }}>IL</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: 16, letterSpacing: '.15em' }}>INLAB</span>
              <span style={{ fontSize: 9, color: 'var(--m)', letterSpacing: '.2em', textTransform: 'uppercase' }}>Dashboard</span>
            </div>
          </a>
          <nav style={{ display: 'flex', gap: 4 }}>
            {([
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={14} /> },
              { id: 'leads', label: 'Lead', icon: <Users size={14} /> },
              { id: 'editor', label: 'Editor', icon: <Edit3 size={14} /> },
              { id: 'settings', label: 'Impostazioni', icon: <Settings2 size={14} /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 14px', background: tab === t.id ? 'rgba(205,178,255,0.1)' : 'transparent', border: 'none', borderRadius: 10, color: tab === t.id ? 'var(--a)' : 'var(--m)', fontSize: 12, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="#/" style={{ fontSize: 11, color: 'var(--m)', letterSpacing: '.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
            Vai al sito <ExternalLink size={11} />
          </a>
          <button onClick={() => auth && signOut(auth)} style={{ background: 'none', border: '.5px solid var(--b)', borderRadius: 100, color: 'var(--m)', padding: '6px 12px', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <LogOut size={11} /> Esci
          </button>
        </div>
      </header>
      <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        {tab === 'analytics' && <Analytics />}
        {tab === 'leads' && <Leads />}
        {tab === 'editor' && <ContentEditor />}
        {tab === 'settings' && <Settings />}
      </motion.div>
    </div>
  );
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
    } catch (err: any) {
      setError('Email o password errati');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', width: 600, height: 600, background: 'rgba(205,178,255,0.04)', borderRadius: '50%', filter: 'blur(120px)', transform: 'translateX(-50%)' }} />
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} style={{ width: '100%', maxWidth: 380, background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 24, padding: '2.5rem', position: 'relative' }}>
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 6 }}>Password</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          </div>
        </div>
        {error && <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'rgba(255,100,100,0.08)', border: '.5px solid rgba(255,100,100,0.2)', borderRadius: 10, color: '#ff8888', fontSize: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} className="btn btn-p" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Accesso...' : 'Entra'}
        </button>
        <div style={{ fontSize: 11, color: 'var(--m)', marginTop: '1.5rem', textAlign: 'center', lineHeight: 1.6 }}>
          Primo accesso? Crea l'utente dalla Firebase Console:<br />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Authentication → Users → Add user</span>
        </div>
      </motion.form>
    </div>
  );
};

const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '.5px solid var(--b)', borderRadius: 10, color: 'var(--t)', fontSize: 14, fontFamily: 'var(--fb)', outline: 'none' };

const SetupRequired = () => (
  <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
    <div style={{ maxWidth: 520, background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 24, padding: '2.5rem' }}>
      <div className="tag tag-a" style={{ marginBottom: '1rem' }}>Setup richiesto</div>
      <h1 style={{ fontFamily: 'var(--fd)', fontSize: '2rem', letterSpacing: '.02em', marginBottom: '1rem' }}>DASHBOARD NON CONFIGURATA</h1>
      <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.6 }}>Configura le variabili d'ambiente Firebase nel file <code style={{ color: 'var(--a)' }}>.env</code>.</p>
    </div>
  </div>
);
