// Home: solo i loghi dei clienti, in riquadri quadrati uno accanto all'altro. Se sono tanti
// scorrono (si fermano al passaggio del mouse e con "Riduci movimento").
// Quali clienti mostrare si sceglie in dashboard (clients.homeIds); se non è
// mai stato scelto, compaiono tutti i clienti che hanno un logo.
import React from 'react';
import { useContent } from '../lib/content';
import { normalizeClients } from '../lib/clientUtils';
import { linkClick, navigate } from '../lib/router';
import { cld } from '../lib/media';

const SCROLL_FROM = 6; // da quanti loghi in su la striscia scorre

type Props = {
  /** cliente da non mostrare (es. nella sua stessa scheda) */
  excludeId?: string;
  /** true = tutti i clienti con logo, ignorando la scelta "Loghi in home" */
  allClients?: boolean;
  /** testo sopra la striscia */
  label?: string;
};

export const ClientLogoStrip: React.FC<Props> = ({ excludeId, allClients = false, label }) => {
  const content = useContent() as any;
  const all = normalizeClients(content.clients?.items || []).filter((c) => c.id !== excludeId);
  const ids: string[] | undefined = !allClients && Array.isArray(content.clients?.homeIds) ? content.clients.homeIds : undefined;
  const clients = all.filter((c) => c.logo && (!ids || ids.includes(c.id)));
  if (!clients.length) return null;
  const scroll = clients.length >= SCROLL_FROM;

  const logo = (c: any, copy = false) => (
    <a key={(copy ? 'b-' : '') + c.id} className={copy ? 'logo-copy' : undefined} href={`/cliente/${c.id}`} onClick={linkClick(() => navigate(`/cliente/${c.id}`))}
      aria-label={copy ? undefined : c.name} aria-hidden={copy || undefined} tabIndex={copy ? -1 : undefined}
      // riquadro quadrato, con il logo a pieno riquadro (Nicola, 07/10: "più grandi e quadrati")
      style={{ flex: '0 0 auto', position: 'relative', display: 'block', width: 'clamp(110px, 12vw, 150px)', aspectRatio: '1 / 1', borderRadius: 18, overflow: 'hidden', background: '#f0ede6', border: '.5px solid var(--b)' }}>
      <img src={cld(c.logo, 400)} alt={copy ? '' : `Logo ${c.name}`} width={300} height={300} loading="lazy" decoding="async"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </a>
  );

  return (
    <section style={{ padding: '4.5rem 0', borderBottom: '.5px solid var(--b)' }} aria-label="Clienti">
      <p className="section-label" style={{ textAlign: 'center', marginBottom: '2rem', padding: '0 2rem' }}>
        {label || content.clients?.tag || 'Brand che hanno scelto InLab'}
      </p>
      {scroll ? (
        <div className="logo-strip-wrap" style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)' }}>
          <div className="logo-strip" style={{ paddingRight: '1.2rem' }}>
            {clients.map((c) => logo(c))}
            {clients.map((c) => logo(c, true))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.2rem', padding: '0 2rem' }}>
          {clients.map((c) => logo(c))}
        </div>
      )}
    </section>
  );
};
