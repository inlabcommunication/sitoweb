import { useEffect, useState } from 'react';
import type React from 'react';
import { Bot, Key, Save, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Le chiavi API NON si salvano qui: stanno solo nelle variabili d'ambiente di
// Vercel (GEMINI_API_KEY, ANTHROPIC_API_KEY), mai nel database.
type Settings = {
  aiProvider: 'gemini' | 'anthropic';
  geminiModel: string;
  anthropicModel: string;
  /** Informazioni extra per il chatbot (FAQ, orari, offerte…), aggiunte alle sue istruzioni */
  chatKnowledge: string;
};

const DEFAULTS: Settings = {
  aiProvider: 'gemini',
  geminiModel: 'gemini-flash-latest',
  anthropicModel: 'claude-haiku-4-5-20251001',
  chatKnowledge: '',
};

const KNOWLEDGE_MAX = 8000;
const KNOWLEDGE_EXAMPLE = `Esempi di cosa scrivere (una informazione per riga):
- Orari: lun-ven 9:00-18:00, sabato su appuntamento.
- Prima consulenza gratuita di 30 minuti, anche in videochiamata.
- Tempi medi: sito vetrina 3-4 settimane; avvio gestione social in 1 settimana.
- Pacchetti social da 8, 12 o 16 contenuti al mese (non dire i prezzi).
- Clienti di riferimento: Studio Dentistico Ricciardi (sito Lumina), Villa Natia, Sottoscala…
- FAQ: "Lavorate fuori Puglia?" → Sì, anche da remoto.`;

export const Settings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [hadStoredKeys, setHadStoredKeys] = useState(false);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    getDoc(doc(db, 'app', 'settings')).then((snap) => {
      if (snap.exists()) {
        const d = snap.data() as any;
        setSettings({ aiProvider: d.aiProvider === 'anthropic' ? 'anthropic' : 'gemini', geminiModel: d.geminiModel || DEFAULTS.geminiModel, anthropicModel: d.anthropicModel || DEFAULTS.anthropicModel, chatKnowledge: typeof d.chatKnowledge === 'string' ? d.chatKnowledge : '' });
        setHadStoredKeys(!!(d.geminiApiKey || d.anthropicApiKey));
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!db) return;
    setSaving(true); setStatus('idle');
    try {
      // setDoc senza merge: sovrascrive il documento e cancella eventuali chiavi salvate in passato
      await setDoc(doc(db, 'app', 'settings'), { aiProvider: settings.aiProvider, geminiModel: settings.geminiModel, anthropicModel: settings.anthropicModel, chatKnowledge: settings.chatKnowledge.slice(0, KNOWLEDGE_MAX) });
      setHadStoredKeys(false);
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
        <p style={{ fontSize: 13, color: 'var(--m)' }}>Configura il chatbot: provider AI, modello e informazioni da conoscere.</p>
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
            <Field label="Modello" value={settings.geminiModel} onChange={(v) => set('geminiModel', v)} placeholder="gemini-flash-latest" />
          </div>
        )}
        {settings.aiProvider === 'anthropic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Modello" value={settings.anthropicModel} onChange={(v) => set('anthropicModel', v)} placeholder="claude-haiku-4-5-20251001" />
          </div>
        )}
      </Section>

      <Section icon={<Bot size={15} />} title="Informazioni per il chatbot">
        <p style={{ fontSize: 12, color: 'var(--m)', lineHeight: 1.7, marginBottom: 12 }}>
          Scrivi qui tutto quello che il chatbot deve sapere oltre a servizi, sede e contatti (che conosce già): orari, tempi di lavoro, come funziona la prima consulenza, pacchetti, risposte alle domande frequenti, clienti da citare. Viene aggiunto alle sue istruzioni appena salvi. <b>Non inserire password, chiavi o dati personali dei clienti.</b>
        </p>
        <textarea
          value={settings.chatKnowledge}
          onChange={(e) => set('chatKnowledge', e.target.value.slice(0, KNOWLEDGE_MAX))}
          placeholder={KNOWLEDGE_EXAMPLE}
          rows={12}
          style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '.5px solid var(--b)', borderRadius: 10, color: 'var(--t)', fontSize: 13, lineHeight: 1.6, fontFamily: 'var(--fb)', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
        />
        <div style={{ fontSize: 11, color: 'var(--m)', textAlign: 'right', marginTop: 6 }}>{settings.chatKnowledge.length} / {KNOWLEDGE_MAX}</div>
      </Section>

      <div style={{ padding: '14px 16px', background: 'rgba(205,178,255,0.05)', border: '.5px solid rgba(205,178,255,0.15)', borderRadius: 12, fontSize: 12, color: 'var(--m)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        <Zap size={12} style={{ display: 'inline', marginRight: 6, color: 'var(--a)' }} />
        Per sicurezza le <b>chiavi API</b> non si inseriscono più qui: vanno impostate solo su <b>Vercel → Settings → Environment Variables</b> (<code>GEMINI_API_KEY</code>, <code>ANTHROPIC_API_KEY</code>). Da qui scegli solo provider e modello.
      </div>
      {hadStoredKeys && (
        <div style={{ padding: '14px 16px', background: 'rgba(255,120,120,0.08)', border: '.5px solid rgba(255,120,120,0.35)', borderRadius: 12, fontSize: 12, color: '#ffb4b4', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          <AlertCircle size={12} style={{ display: 'inline', marginRight: 6 }} />
          Nel database ci sono ancora chiavi API salvate in passato. Premi <b>Salva impostazioni</b> per cancellarle, poi <b>rigenera le chiavi</b> su Google AI Studio / Anthropic Console: potrebbero essere state esposte.
        </div>
      )}

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
