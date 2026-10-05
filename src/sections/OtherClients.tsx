// Sezione "Altri clienti" della pagina /clienti, sotto "Non solo contenuti":
// brand seguiti per un servizio specifico, senza pagina dedicata. Statica
// (nessuna animazione): leggera e uguale tra HTML pre-generato e browser.
import React from 'react';
import { useContent } from '../lib/content';
import { cld } from '../lib/media';
import { OTHER_CLIENTS_DEFAULT, type OtherClient } from '../data/otherClients';

export const OtherClients: React.FC = () => {
  const data = { ...OTHER_CLIENTS_DEFAULT, ...((useContent() as any).otherClients || {}) };
  const items = ((data.items || []) as OtherClient[]).filter((c) => String(c?.name || '').trim());
  if (!items.length) return null;
  return (
    <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem', maxWidth: 720 }}>
          {data.label && <p className="section-label">{data.label}</p>}
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.6rem, 5.5vw, 5rem)', lineHeight: 0.9, marginBottom: '1.2rem', textTransform: 'uppercase', fontWeight: 400 }}>
            {data.title}{data.accent && <><br /><span className="stroke">{data.accent}</span></>}
          </h2>
          {data.text && <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.7 }}>{data.text}</p>}
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))', gap: '0.8rem' }}>
          {items.map((c, i) => {
            const meta = [c.sector, c.location].filter(Boolean).join(' · ');
            return (
              <li key={c.name + i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 1.1rem', borderRadius: 18, border: '.5px solid var(--b)', background: 'linear-gradient(135deg, rgba(205,178,255,0.05), rgba(255,255,255,0.015))', minHeight: 84 }}>
                {c.logo && (
                  <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, padding: 6, borderRadius: 12, background: '#f0ede6' }}>
                    <img src={cld(c.logo, 200)} alt={`Logo ${c.name}`} loading="lazy" decoding="async" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
                  </span>
                )}
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(16px, 1.6vw, 20px)', letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--t)', lineHeight: 1.05 }}>{c.name}</span>
                  {meta && <span style={{ fontSize: 12, color: 'var(--m)', letterSpacing: '.06em' }}>{meta}</span>}
                  {c.services && <span style={{ fontSize: 12, color: 'var(--a)' }}>{c.services}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
