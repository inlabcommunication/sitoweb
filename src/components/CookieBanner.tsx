// Banner cookie: compare solo se Google Analytics è configurato e il visitatore
// non ha ancora scelto. "Accetta" e "Rifiuta" hanno lo stesso peso, come
// richiesto dalle linee guida del Garante; la X equivale a rifiutare.
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { GA_ID, getConsent, setConsent, onReopenConsent } from '../lib/ga';
import { linkClick, navigate } from '../lib/router';

export const CookieBanner: React.FC = () => {
  const [open, setOpen] = useState(() => !!GA_ID && getConsent() === null);
  useEffect(() => onReopenConsent(() => setOpen(true)), []);
  if (!GA_ID || !open) return null;

  const choose = (c: 'granted' | 'denied') => { setConsent(c); setOpen(false); };
  const btn: React.CSSProperties = { flex: 1, padding: '11px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' };

  return (
    <div role="dialog" aria-live="polite" aria-label="Preferenze cookie"
      style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 10000, width: 'min(420px, calc(100vw - 32px))', background: 'rgba(24,23,23,0.97)', backdropFilter: 'blur(14px)', border: '.5px solid rgba(205,178,255,0.3)', borderRadius: 20, padding: '1.3rem 1.3rem 1.1rem', boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
      <button onClick={() => choose('denied')} aria-label="Chiudi e rifiuta" style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--m)', cursor: 'pointer', padding: 4 }}><X size={16} /></button>
      <p style={{ fontFamily: 'var(--fd)', fontSize: 20, letterSpacing: '.04em', marginBottom: 8 }}>COOKIE</p>
      <p style={{ fontSize: 13, color: 'var(--m)', lineHeight: 1.6, marginBottom: '1rem', paddingRight: 8 }}>
        Usiamo cookie tecnici, necessari al funzionamento del sito, e — solo con il tuo consenso — cookie statistici di Google Analytics per capire come viene usato il sito. Puoi cambiare idea in qualsiasi momento da «Preferenze cookie» in fondo alla pagina.{' '}
        <a href="/privacy" onClick={linkClick(() => navigate('/privacy'))} style={{ color: 'var(--a)', textDecoration: 'underline' }}>Privacy e cookie</a>
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => choose('denied')} style={{ ...btn, background: 'transparent', color: 'var(--t)', border: '.5px solid rgba(255,255,255,0.3)' }}>Rifiuta</button>
        <button onClick={() => choose('granted')} style={{ ...btn, background: 'var(--a)', color: '#000', border: '.5px solid var(--a)' }}>Accetta</button>
      </div>
    </div>
  );
};
