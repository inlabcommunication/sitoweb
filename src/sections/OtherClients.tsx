// Sezione "Altri clienti" della pagina /clienti, sotto "Non solo contenuti":
// brand seguiti per un servizio specifico. Ogni cliente ha un riquadro uguale
// per tutti: immagine (logo o foto di un lavoro), nome, settore · città e il
// riassunto. Con la scheda pubblicata il riquadro apre la pagina /cliente/…
// (come i clienti di "Progetti raccontati"). Senza immagine il riquadro mostra
// il nome su fondo colorato, così nessuno resta vuoto. Statica (nessuna animazione):
// leggera e uguale tra HTML pre-generato e browser. Solo su /clienti, non in home.
import React from 'react';
import { useContent } from '../lib/content';
import { cld } from '../lib/media';
import { getClientId, normalizeClients } from '../lib/clientUtils';
import { linkClick, navigate } from '../lib/router';
import { OTHER_CLIENTS_DEFAULT, publishedOtherClients, type OtherClient } from '../data/otherClients';

// Fondi della scheda senza immagine: toni lilla del sito, alternati
const FALLBACKS = [
  'linear-gradient(135deg, rgba(205,178,255,0.28), rgba(205,178,255,0.06))',
  'linear-gradient(135deg, rgba(205,178,255,0.12), rgba(255,255,255,0.03))',
  'linear-gradient(160deg, rgba(240,237,230,0.14), rgba(205,178,255,0.10))',
];

export const OtherClients: React.FC = () => {
  const content = useContent() as any;
  const data = { ...OTHER_CLIENTS_DEFAULT, ...(content.otherClients || {}) };
  const items = ((data.items || []) as OtherClient[]).filter((c) => String(c?.name || '').trim());
  // schede pubblicate: il riquadro porta alla pagina /cliente/… (le altre restano solo riquadro)
  const mainIds = new Set(normalizeClients(content.clients?.items || []).map((x: any) => x.id));
  const pages = new Set(publishedOtherClients(items, mainIds).map((x) => x.id));
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
            const services = (Array.isArray(c.services) ? c.services : String(c.services || '').split(',')).map((x) => String(x).trim()).filter(Boolean).join(', ');
            // nel riquadro: il logo (centrato su fondo chiaro); senza logo l'immagine della scheda (a pieno riquadro)
            const isLogo = !!c.logo;
            const img = cld(c.logo || c.image, 600);
            const href = pages.has(getClientId(c)) ? `/cliente/${getClientId(c)}` : '';
            const body = (
              <>
                {/* Riquadro immagine a proporzione fissa: nessuno spostamento del layout al caricamento */}
                <div style={{ aspectRatio: '4 / 3', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: img ? (isLogo ? '#f0ede6' : '#1a1a1a') : FALLBACKS[i % FALLBACKS.length], padding: img && isLogo ? '12%' : 0 }}>
                  {img ? (
                    <img src={img} alt={isLogo ? `Logo ${c.name}` : `Lavoro per ${c.name}`} width={600} height={450} loading="lazy" decoding="async"
                      style={isLogo ? { maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' } : { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <span style={{ padding: '0 .9rem', textAlign: 'center', overflowWrap: 'anywhere', fontFamily: 'var(--fd)', fontSize: 'clamp(18px, 2.4vw, 30px)', letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--t)', lineHeight: 1 }}>{c.name}</span>
                  )}
                </div>
                {/* senza immagine il nome è già nel riquadro colorato: sotto restano solo i dettagli */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '.9rem 1rem 1.05rem', minHeight: 56, flex: 1 }}>
                  {img && <span style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(16px, 1.6vw, 20px)', letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--t)', lineHeight: 1.05 }}>{c.name}</span>}
                  {meta && <span style={{ fontSize: 12, color: 'var(--m)', letterSpacing: '.06em' }}>{meta}</span>}
                  {c.summary && <span style={{ fontSize: 13, color: 'var(--m)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.summary}</span>}
                  {services && <span style={{ fontSize: 12, color: 'var(--a)' }}>{services}</span>}
                  {href && <span style={{ marginTop: 'auto', paddingTop: 6, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--a)' }}>Scheda cliente →</span>}
                </div>
              </>
            );
            return (
              <li key={c.name + i} style={{ display: 'flex', flexDirection: 'column', borderRadius: 18, border: '.5px solid var(--b)', overflow: 'hidden', background: 'rgba(255,255,255,0.015)' }}>
                {href
                  ? <a href={href} onClick={linkClick(() => navigate(href))} style={{ display: 'flex', flexDirection: 'column', flex: 1, color: 'inherit', textDecoration: 'none' }}>{body}</a>
                  : body}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
