// Riquadro nello stile dei casi studio ("Non solo contenuti"): sfondo sfumato
// lilla, bordo sottile, numero grande in filigrana, etichetta con linea, nome
// in maiuscolo, sottotitolo corsivo lilla. È l'unico stile usato per le schede
// di clienti ed esempi in tutto il sito.
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { linkClick, navigate } from '../lib/router';
import { cld } from '../lib/media';

type Props = {
  href: string;
  number: number;
  kicker: string;          // es. "Cliente", "Caso studio"
  title: string;
  italic?: string;         // es. settore o titolo del caso
  meta?: string;           // es. località
  desc?: string;
  cta: string;
  logo?: string;
  onOpen?: () => void;
  /** titolo come <h3> (dove la pagina lo richiede per la struttura dei titoli) */
  heading?: boolean;
  /** riga in più sotto la descrizione (es. il lavoro fatto per il cliente) */
  note?: string;
  /** secondo link, sotto la card e fuori dal link principale (es. il caso studio) */
  secondary?: { href: string; label: string };
};

export const CaseCard: React.FC<Props> = ({ href, number, kicker, title, italic, meta, desc, cta, logo, onOpen, heading = false, note, secondary }) => {
  const n = String(number).padStart(2, '0');
  const Title = heading ? 'h3' : 'span';
  const card = (
    <a href={href} className="case-card" onClick={linkClick(onOpen || (() => navigate(href)))}>
      <span className="case-card-num" aria-hidden="true">{n}</span>
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.4rem' }}>
          <span style={{ fontFamily: 'var(--fd)', fontSize: 14, color: 'var(--a)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{kicker} {n}</span>
          <span style={{ height: 1, flex: 1, background: 'var(--b)' }} />
          {logo && (
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 36, maxWidth: 96, padding: 5, borderRadius: 9, background: '#f0ede6' }}>
              <img src={cld(logo, 400)} alt={`Logo ${title}`} loading="lazy" style={{ maxWidth: '100%', maxHeight: 26, objectFit: 'contain', display: 'block' }} />
            </span>
          )}
        </span>
        <Title style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', lineHeight: 0.95, textTransform: 'uppercase', color: 'var(--t)', marginBottom: '0.7rem', fontWeight: 400, display: 'block' }}>{title}</Title>
        {italic && <span style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)', color: 'var(--a)', lineHeight: 1.3, marginBottom: '0.8rem' }}>{italic}</span>}
        {meta && <span style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: '1rem' }}>{meta}</span>}
        {desc && <span className="case-card-desc">{desc}</span>}
        {note && <span style={{ display: 'block', fontSize: 14, color: 'var(--t)', lineHeight: 1.5, margin: '0.4rem 0 1rem' }}>{note}</span>}
        <span className="case-card-cta">{cta} <ArrowUpRight size={13} /></span>
      </span>
    </a>
  );
  if (!secondary) return card;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {card}
      <a href={secondary.href} onClick={linkClick(() => navigate(secondary.href))} className="foot-link"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '0 0.4rem', fontSize: 13, color: 'var(--a)' }}>
        {secondary.label} <ArrowUpRight size={12} />
      </a>
    </div>
  );
};

/** Griglia dei riquadri. */
export const CaseCardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '1.5rem' }}>{children}</div>
);
