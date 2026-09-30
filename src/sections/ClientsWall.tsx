import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useContent } from '../lib/content';
import { normalizeClients } from '../lib/clientUtils';
import { linkClick, navigate } from '../lib/router';
import { cld } from '../lib/media';

type ClientsWallProps = {
  onClientClick?: (id: string) => void;
  /** false = solo la griglia, senza titolo di sezione (es. pagina Casi studio) */
  showHeader?: boolean;
  /** scheda da escludere (es. nella pagina del cliente stesso) */
  excludeId?: string;
  /** testi del titolo di sezione, se diversi da quelli della home */
  heading?: { label: string; title: string; accent: string; text?: string };
  /** nasconde la frase finale */
  compact?: boolean;
  /** mostra solo i `limit` clienti più simili a questo (stesso settore, poi stessa città) */
  relatedTo?: any;
  limit?: number;
};

const words = (v?: string) =>
  String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/).filter((w) => w.length >= 4);

// Settori affini, per avvicinare per esempio un bar a una gelateria anche se
// il nome del settore è diverso.
const GROUPS: string[][] = [
  ['bar', 'food', 'caffe', 'caffetteria', 'gelateria', 'pasticceria', 'ristorante', 'pizzeria', 'pub', 'panificio', 'forno', 'enoteca', 'cibo'],
  ['ricevimenti', 'hotel', 'masseria', 'eventi', 'villa', 'sala', 'matrimoni', 'agriturismo', 'resort'],
  ['auto', 'moto', 'autofficina', 'officina', 'ricambi', 'carrozzeria', 'gommista', 'concessionaria'],
  ['dentistico', 'dentista', 'ottica', 'medico', 'farmacia', 'fisioterapia', 'estetica', 'salute', 'studio'],
  ['immobiliare', 'fotovoltaico', 'edilizia', 'impianti', 'arredamento', 'casa', 'energia', 'servizi'],
];
const groupsOf = (sector?: string) => {
  const ws = String(sector || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/);
  return GROUPS.map((g, i) => (ws.some((w) => g.includes(w)) ? i : -1)).filter((i) => i >= 0);
};

/** Somiglianza con il cliente di riferimento: settore, poi città, poi servizi in comune. */
const similarity = (ref: any, c: any) => {
  let score = 0;
  const rs = words(ref.sector), cs = words(c.sector);
  if (rs.length && rs.join(' ') === cs.join(' ')) score += 4;
  else if (rs.some((w) => cs.includes(w))) score += 3;
  else if (groupsOf(ref.sector).some((g) => groupsOf(c.sector).includes(g))) score += 3;
  if (ref.location && c.location && words(ref.location).join(' ') === words(c.location).join(' ')) score += 2;
  const rsv = (ref.services || []).map((x: string) => x.toLowerCase());
  score += Math.min(1, (c.services || []).filter((x: string) => rsv.includes(x.toLowerCase())).length * 0.5);
  return score;
};

export const ClientsWall: React.FC<ClientsWallProps> = ({ onClientClick, showHeader = true, excludeId, heading, compact = false, relatedTo, limit }) => {
  const content = useContent();
  const all = normalizeClients((content as any).clients?.items || []).filter((c) => c.id !== excludeId);
  // Sempre lo stesso risultato per la stessa scheda (niente casualità): a parità
  // di somiglianza vale l'ordine scelto in dashboard.
  const clients = relatedTo
    ? all.map((c, i) => ({ c, i, s: similarity(relatedTo, c) }))
        .sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.c).slice(0, limit ?? 4)
    : limit ? all.slice(0, limit) : all;
  const hasMore = clients.length < all.length;
  const openClient = (id: string) => {
    if (onClientClick) onClientClick(id);
    else navigate(`/cliente/${id}`);
  };

  return (
    <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <p className="section-label">{heading?.label ?? 'I clienti'}</p>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
              lineHeight: 0.9,
              marginBottom: '1.2rem',
            }}>
              {heading?.title ?? 'BRAND CHE'}<br />
              <span className="stroke">{heading?.accent ?? 'HANNO SCELTO INLAB'}</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.7, maxWidth: 520 }}>
              {heading ? heading.text : 'Collaboriamo con attività locali, professionisti e aziende che vogliono comunicare meglio, distinguersi e costruire una presenza più forte.'}
            </p>
          </div>
          <span style={{
            fontSize: 11, color: 'var(--m)',
            letterSpacing: '.1em', textTransform: 'uppercase',
          }}>{relatedTo ? '' : heading ? `${clients.length} schede` : `${clients.length}+ clienti`}</span>
        </motion.div>
        )}

        {/* Griglia schede clienti */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: 14,
        }}>
          {clients.map((client, i) => (
            <motion.a
              href={`/cliente/${client.id}`}
              key={client.id}
              aria-label={`Apri scheda cliente ${client.name}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              onClick={linkClick(() => openClient(client.id))}
              className="client-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, width: '100%' }}>
                {client.logo ? (
                  // logo con i suoi colori in un riquadro chiaro: funziona con e senza sfondo
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 40, minWidth: 40, maxWidth: 110, padding: 5, borderRadius: 10, background: '#f0ede6', overflow: 'hidden' }}>
                    <img src={cld(client.logo, 400)} alt="" loading="lazy" style={{ maxWidth: '100%', maxHeight: 30, objectFit: 'contain', display: 'block' }} />
                  </span>
                ) : (
                  <span style={{ fontFamily: 'var(--fd)', fontSize: 20, color: 'var(--a)', letterSpacing: '.04em', lineHeight: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
                {client.sector && (
                  <span style={{
                    fontSize: 9.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase',
                    color: 'var(--a)', background: 'rgba(205,178,255,0.09)', border: '.5px solid rgba(205,178,255,0.25)',
                    borderRadius: 100, padding: '5px 10px', textAlign: 'right', lineHeight: 1.3, maxWidth: '70%',
                  }}>
                    {client.sector}
                  </span>
                )}
              </div>

              <span style={{
                fontFamily: 'var(--fd)', fontSize: 'clamp(1.7rem, 2.2vw, 2.1rem)', lineHeight: 0.95,
                letterSpacing: '.02em', color: 'var(--t)', textTransform: 'uppercase', marginTop: 22,
              }}>
                {client.name}
              </span>

              {client.summary && (
                <span className="client-card-summary">{client.summary}</span>
              )}

              <span style={{
                marginTop: 'auto', paddingTop: 18, width: '100%', borderTop: '.5px solid var(--b)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: '.06em', color: 'rgba(240,237,230,0.55)' }}>
                  {client.location && <><MapPin size={12} color="var(--a)" /> {client.location}</>}
                </span>
                <span className="client-card-cta">
                  Scheda <ArrowUpRight size={13} />
                </span>
              </span>
            </motion.a>
          ))}
        </div>

        {hasMore && relatedTo && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href="/casi-studio" onClick={linkClick(() => navigate('/casi-studio'))} className="btn btn-g">
              Vedi tutti i clienti <ArrowUpRight size={13} />
            </a>
          </div>
        )}

        {/* Frase finale */}
        {!compact && <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--fs)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
            color: 'var(--a)',
            textAlign: 'center',
            marginTop: '3.5rem',
            maxWidth: 720,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.4,
          }}
        >
          "Ogni brand ha una voce. Il nostro lavoro è renderla riconoscibile."
        </motion.p>}
      </div>
    </section>
  );
};
