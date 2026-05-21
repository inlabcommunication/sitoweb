import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// Counter animato (numero + suffisso)
// ──────────────────────────────────────────────────────────────

interface CounterProps {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ to, suffix = '', prefix = '', duration = 1.8 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setVal(to * eased);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, to, duration]);

  // formattazione: se il numero è alto usa abbreviazione k
  const formatted = (() => {
    if (to >= 1000) {
      const k = val / 1000;
      return k.toFixed(k < 10 ? 1 : 0) + 'k';
    }
    return Math.round(val).toString();
  })();

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
};

// ──────────────────────────────────────────────────────────────
// Sezione "Creatività misurabile"
// ──────────────────────────────────────────────────────────────

const STATS = [
  { value: 100000, suffix: '+', label: 'Visualizzazioni generate' },
  { value: 200,    suffix: '+', label: 'Lead raccolti in un lancio' },
  { value: 10,     suffix: '+', label: 'Brand seguiti' },
  { value: 8,      suffix: '+', label: 'Settori comunicati' },
];

export const AnimatedStats: React.FC = () => {
  return (
    <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 700, height: 700,
        background: 'rgba(205,178,255,0.025)', borderRadius: '50%', filter: 'blur(120px)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p className="section-label" style={{ display: 'inline-block' }}>I numeri</p>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
            lineHeight: 0.9,
            marginBottom: '1rem',
          }}>
            CREATIVITÀ<br />
            <span style={{
              fontFamily: 'var(--fs)', fontStyle: 'italic',
              fontWeight: 400, fontSize: '0.85em', color: 'var(--a)',
            }}>misurabile.</span>
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: '2.5rem 2rem',
                borderLeft: '.5px solid rgba(205,178,255,0.2)',
                position: 'relative',
              }}
            >
              <div style={{
                fontFamily: 'var(--fd)',
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                lineHeight: 1,
                color: i === 0 ? 'var(--a)' : 'var(--t)',
                marginBottom: '0.6rem',
                letterSpacing: '-0.02em',
              }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p style={{
                fontSize: 12,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: 'var(--m)',
                lineHeight: 1.4,
              }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Nota interna (visibile in pagina come placeholder, da aggiornare prima della pubblicazione) */}
        <p style={{
          marginTop: '2.5rem',
          fontSize: 11,
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          {/* TODO: numeri da confermare prima della pubblicazione */}
          Numeri indicativi — aggiornati periodicamente.
        </p>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────
// CTA finale
// ──────────────────────────────────────────────────────────────

interface FinalCTAProps {
  onClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onClick }) => {
  return (
    <section style={{ padding: '8rem 2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(205,178,255,0.08), rgba(255,255,255,0.02))',
            backdropFilter: 'blur(12px)',
            border: '.5px solid rgba(205,178,255,0.2)',
            borderRadius: 40,
            padding: 'clamp(3rem, 6vw, 6rem)',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Glow animato */}
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '-30%', right: '-15%',
              width: 500, height: 500,
              background: 'rgba(205,178,255,0.1)',
              borderRadius: '50%', filter: 'blur(100px)',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              position: 'absolute', bottom: '-30%', left: '-15%',
              width: 400, height: 400,
              background: 'rgba(205,178,255,0.08)',
              borderRadius: '50%', filter: 'blur(100px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
            <p className="section-label" style={{ marginBottom: '1.5rem' }}>
              Iniziamo
            </p>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              lineHeight: 0.92,
              marginBottom: '1.5rem',
            }}>
              HAI UN BRAND.<br />
              <span style={{
                fontFamily: 'var(--fs)', fontStyle: 'italic',
                fontWeight: 400, fontSize: '0.7em', color: 'var(--a)',
              }}>Ora facciamolo percepire nel modo giusto.</span>
            </h2>
            <p style={{
              fontSize: 16,
              color: 'var(--m)',
              lineHeight: 1.75,
              marginBottom: '2.5rem',
              maxWidth: 600,
              margin: '0 auto 2.5rem',
            }}>
              Raccontaci il tuo progetto: ti aiutiamo a trasformare idee, contenuti e canali digitali in una comunicazione più chiara, riconoscibile e strategica.
            </p>
            <button
              className="btn btn-p"
              onClick={onClick}
              style={{ fontSize: 13, padding: '18px 38px' }}
            >
              Parliamo del tuo progetto <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
