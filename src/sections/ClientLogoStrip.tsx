// Home: solo i loghi dei clienti, uno accanto all'altro. Se sono tanti
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
      style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 76, minWidth: 130, padding: '12px 24px', borderRadius: 18, background: '#f0ede6' }}>
      <img src={cld(c.logo, 400)} alt={copy ? '' : `Logo ${c.name}`} loading="lazy" decoding="async"
        style={{ maxHeight: 48, maxWidth: 150, objectFit: 'contain', display: 'block' }} />
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
