import React from 'react';
import { motion } from 'motion/react';
import { useContent } from '../lib/content';
import { normalizeClients } from '../lib/clientUtils';

type ClientsWallProps = {
  onClientClick?: (id: string) => void;
};

export const ClientsWall: React.FC<ClientsWallProps> = ({ onClientClick }) => {
  const content = useContent();
  const clients = normalizeClients((content as any).clients?.items || []);
  const openClient = (id: string) => {
    if (onClientClick) onClientClick(id);
    else window.location.hash = `/cliente/${id}`;
  };

  return (
    <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
            <p className="section-label">I clienti</p>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
              lineHeight: 0.9,
              marginBottom: '1.2rem',
            }}>
              BRAND CHE<br />
              <span className="stroke">HANNO SCELTO INLAB</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.7, maxWidth: 520 }}>
              Collaboriamo con attività locali, professionisti e aziende che vogliono comunicare meglio, distinguersi e costruire una presenza più forte.
            </p>
          </div>
          <span style={{
            fontSize: 11, color: 'var(--m)',
            letterSpacing: '.1em', textTransform: 'uppercase',
          }}>{clients.length}+ clienti</span>
        </motion.div>

        {/* Grid loghi: 4 colonne (2 su mobile). Le linee sono sulle celle, così
            un'ultima riga incompleta non lascia riquadri vuoti colorati. */}
        <div className="grid-2-mob" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          borderRadius: 24,
          overflow: 'hidden',
          border: '.5px solid var(--b)',
        }}>
          {clients.map((client, i) => (
            <motion.button
              key={client.id}
              type="button"
              aria-label={`Apri scheda cliente ${client.name}`}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ backgroundColor: 'rgba(205,178,255,0.06)' }}
              onClick={() => openClient(client.id)}
              style={{
                background: 'var(--bg)',
                border: 0,
                boxShadow: '0 0 0 .5px var(--b)',
                color: 'inherit',
                font: 'inherit',
                padding: '2.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 120,
                cursor: 'pointer',
                transition: 'background .25s',
                textAlign: 'center',
              }}
            >
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  style={{ maxWidth: 140, maxHeight: 54, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.55 }}
                />
              ) : (
                <span style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '.05em',
                  lineHeight: 1.15,
                  transition: 'color .25s',
                }}>
                  {client.name}
                </span>
              )}
              {(client.sector || client.location) && (
                <span style={{ fontSize: 10, letterSpacing: '.13em', textTransform: 'uppercase', color: 'var(--m)' }}>
                  {[client.sector, client.location].filter(Boolean).join(' / ')}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Frase finale */}
        <motion.p
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
        </motion.p>
      </div>
    </section>
  );
};
