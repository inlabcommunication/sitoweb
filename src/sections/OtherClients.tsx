// Sezione "Altri clienti" della pagina /clienti, sotto "Non solo contenuti":
// brand seguiti per un servizio specifico, senza pagina dedicata. Ogni cliente
// ha una piccola scheda uguale per tutte: immagine (logo o foto di un lavoro),
// nome, settore · città e una riga. Senza immagine la scheda mostra il nome su
// fondo colorato, così nessuna resta vuota. Statica (nessuna animazione):
// leggera e uguale tra HTML pre-generato e browser. Solo su /clienti, non in home.
import React from 'react';
import { useContent } from '../lib/content';
import { cld } from '../lib/media';
import { OTHER_CLIENTS_DEFAULT, type OtherClient } from '../data/otherClients';

// Fondi della scheda senza immagine: toni lilla del sito, alternati
const FALLBACKS = [
  'linear-gradient(135deg, rgba(205,178,255,0.28), rgba(205,178,255,0.06))',
  'linear-gradient(135deg, rgba(205,178,255,0.12), rgba(255,255,255,0.03))',
  'linear-gradient(160deg, rgba(240,237,230,0.14), rgba(205,178,255,0.10))',
];

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
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 20vw, 220px), 1fr))', gap: '1rem' }}>
          {items.map((c, i) => {
            const meta = [c.sector, c.location].filter(Boolean).join(' · ');
            const img = cld(c.logo, 600);
            return (
              <li key={c.name + i} style={{ display: 'flex', flexDirection: 'column', borderRadius: 18, border: '.5px solid var(--b)', overflow: 'hidden', background: 'rgba(255,255,255,0.015)' }}>
                {/* Riquadro immagine a proporzione fissa: nessuno spostamento del layout al caricamento */}
                <div style={{ aspectRatio: '4 / 3', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: img ? (c.photo ? '#1a1a1a' : '#f0ede6') : FALLBACKS[i % FALLBACKS.length], padding: img && !c.photo ? '12%' : 0 }}>
                  {img ? (
                    <img src={img} alt={c.photo ? `Lavoro per ${c.name}` : `Logo ${c.name}`} width={600} height={450} loading="lazy" decoding="async"
                      style={c.photo ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' } : { maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }} />
                  ) : (
                    <span style={{ padding: '0 .9rem', textAlign: 'center', overflowWrap: 'anywhere', fontFamily: 'var(--fd)', fontSize: 'clamp(18px, 2.4vw, 30px)', letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--t)', lineHeight: 1 }}>{c.name}</span>
                  )}
                </div>
                {/* senza immagine il nome è già nel riquadro colorato: sotto restano solo i dettagli */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '.9rem 1rem 1.05rem', minHeight: 56 }}>
                  {img && <span style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(16px, 1.6vw, 20px)', letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--t)', lineHeight: 1.05 }}>{c.name}</span>}
                  {meta && <span style={{ fontSize: 12, color: 'var(--m)', letterSpacing: '.06em' }}>{meta}</span>}
                  {c.line && <span style={{ fontSize: 13, color: 'var(--m)', lineHeight: 1.5 }}>{c.line}</span>}
                  {c.services && <span style={{ fontSize: 12, color: 'var(--a)' }}>{c.services}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
