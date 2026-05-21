import React from 'react';
import { motion } from 'motion/react';

const CLIENTS = [
  'IMH', 'Paresteta', 'Studio Dentistico Ricciardi', 'Inox Racing Puglia',
  'VisionOttica Capone', 'Aleph Caffè', 'Sottoscala', 'Bmax',
  'Merolla Divani', 'Marmi Romanelli', 'Prosperini Lab',
];

export const ClientsWall: React.FC = () => {
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
          }}>{CLIENTS.length}+ progetti</span>
        </motion.div>

        {/* Grid loghi */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 1,
          background: 'var(--b)',
          borderRadius: 24,
          overflow: 'hidden',
          border: '.5px solid var(--b)',
        }}>
          {CLIENTS.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ backgroundColor: 'rgba(205,178,255,0.06)' }}
              style={{
                background: 'var(--bg)',
                padding: '2.5rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 120,
                cursor: 'default',
                transition: 'background .25s',
              }}
            >
              <span style={{
                fontFamily: 'var(--fd)',
                fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '.05em',
                textAlign: 'center',
                lineHeight: 1.15,
                transition: 'color .25s',
              }}>
                {name}
              </span>
            </motion.div>
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
