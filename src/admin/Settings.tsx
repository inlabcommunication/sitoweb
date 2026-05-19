import { useEffect, useState } from 'react';
import type React from 'react';
import { Bot, Key, Save, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type Settings = {
  aiProvider: 'gemini' | 'anthropic';
  geminiApiKey: string;
  geminiModel: string;
  anthropicApiKey: string;
  anthropicModel: string;
};

const DEFAULTS: Settings = {
  aiProvider: 'gemini',
  geminiApiKey: '',
  geminiModel: 'gemini-2.5-flash',
  anthropicApiKey: '',
  anthropicModel: 'claude-haiku-4-5-20251001',
};

export const Settings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    getDoc(doc(db, 'app', 'settings')).then((snap) => {
      if (snap.exists()) setSettings({ ...DEFAULTS, ...snap.data() });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!db) return;
    setSaving(true); setStatus('idle');
    try {
      await setDoc(doc(db, 'app', 'settings'), settings);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
    setSaving(false);
  };

  const set = (key: keyof Settings, val: string) => setSettings((s) => ({ ...s, [key]: val }));

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--m)' }}>Caricamento...</div>;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem 2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', letterSpacing: '.05em', marginBottom: 6 }}>IMPOSTAZIONI</h2>
        <p style={{ fontSize: 13, color: 'var(--m)' }}>Configura il provider AI del chatbot. Gemini è gratuito con limiti generosi.</p>
      </div>

      <Section icon={<Bot size={15} />} title="Provider AI">
        <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
          {(['gemini', 'anthropic'] as const).map((p) => (
            <button key={p} onClick={() => set('aiProvider', p)} style={{ flex: 1, padding: '14px', background: settings.aiProvider === p ? 'rgba(205,178,255,0.12)' : 'rgba(255,255,255,0.03)', border: settings.aiProvider === p ? '.5px solid var(--a)' : '.5px solid var(--b)', borderRadius: 12, color: settings.aiProvider === p ? 'var(--a)' : 'var(--m)', cursor: 'pointer', fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', transition: 'all .2s' }}>
              {p === 'gemini' ? '⚡ Google Gemini' : '🤖 Anthropic Claude'}
              <div style={{ fontSize: 10, fontWeight: 400, marginTop: 4, opacity: 0.7 }}>{p === 'gemini' ? 'gratis' : 'a pagamento'}</div>
            </button>
          ))}
        </div>
        {settings.aiProvider === 'gemini' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Gemini API Key" hint="Da aistudio.google.com → Get API key (gratuita)" value={settings.geminiApiKey} onChange={(v) => set('geminiApiKey', v)} type="password" placeholder="AIzaSy..." />
            <Field label="Modello" value={settings.geminiModel} onChange={(v) => set('geminiModel', v)} placeholder="gemini-2.5-flash" />
          </div>
        )}
        {settings.aiProvider === 'anthropic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Anthropic API Key" hint="Da console.anthropic.com (richiede credito)" value={settings.anthropicApiKey} onChange={(v) => set('anthropicApiKey', v)} type="password" placeholder="sk-ant-..." />
            <Field label="Modello" value={settings.anthropicModel} onChange={(v) => set('anthropicModel', v)} placeholder="claude-haiku-4-5-20251001" />
          </div>
        )}
      </Section>

      <div style={{ padding: '14px 16px', background: 'rgba(205,178,255,0.05)', border: '.5px solid rgba(205,178,255,0.15)', borderRadius: 12, fontSize: 12, color: 'var(--m)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        <Zap size={12} style={{ display: 'inline', marginRight: 6, color: 'var(--a)' }} />
        Le chiavi salvate qui vengono usate dalla funzione serverless <code>/api/chat</code> e non sono mai esposte al browser.
      </div>

      <button onClick={save} disabled={saving} className="btn btn-p" style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.6 : 1 }}>
        {status === 'saved' ? <><CheckCircle size={14} /> Salvato</> : status === 'error' ? <><AlertCircle size={14} /> Errore</> : <><Save size={14} /> {saving ? 'Salvataggio...' : 'Salva impostazioni'}</>}
      </button>
    </div>
  );
};

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem', fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)' }}>{icon} {title}</div>
    {children}
  </div>
);

const Field = ({ label, hint, value, onChange, type = 'text', placeholder }: { label: string; hint?: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
  <div>
    <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 4 }}>{label}</div>
    {hint && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>{hint}</div>}
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '.5px solid var(--b)', borderRadius: 10, color: 'var(--t)', fontSize: 13, fontFamily: 'var(--fb)', outline: 'none', boxSizing: 'border-box' }} />
  </div>
);
