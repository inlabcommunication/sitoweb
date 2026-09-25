import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';

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
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setVal(to * eased);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, to, duration]);

  const formatted = (() => {
    if (to >= 1000000) {
      const m = val / 1000000;
      return m.toFixed(1) + 'M';
    }
    if (to >= 1000) {
      const k = val / 1000;
      return k.toFixed(k < 10 ? 1 : 0) + 'k';
    }
    return Math.round(val).toString();
  })();

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
};

const STATS = [
  { value: 3200000, suffix: '+', label: 'Visualizzazioni generate' },
  { value: 47,      suffix: '+', label: 'Brand e attività seguiti' },
  { value: 9,       suffix: '',  label: 'Città servite in Puglia' },
  { value: 100,     suffix: '%', label: 'Progetti consegnati in tempo' },
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
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
            lineHeight: 0.9, marginBottom: '1rem',
          }}>
            CREATIVITÀ<br />
            <span style={{
              fontFamily: 'var(--fs)', fontStyle: 'italic',
              fontWeight: 400, fontSize: '0.85em', color: 'var(--a)',
            }}>misurabile.</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {STATS.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ padding: '2.5rem 2rem', borderLeft: '.5px solid rgba(205,178,255,0.2)', position: 'relative' }}
            >
              <div style={{
                fontFamily: 'var(--fd)', fontSize: 'clamp(3rem, 6vw, 5rem)',
                lineHeight: 1, color: i === 0 ? 'var(--a)' : 'var(--t)',
                marginBottom: '0.6rem', letterSpacing: '-0.02em',
              }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--m)', lineHeight: 1.4 }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface FinalCTAProps {
  onClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onClick }) => {
  return (
    <section style={{ padding: '8rem 2rem', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, var(--bg) 0%, #241e30 40%, #3a2d56 100%)' }}>
      {/* Glow animato */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600,
          background: 'rgba(205,178,255,0.08)', borderRadius: '50%', filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500,
          background: 'rgba(205,178,255,0.18)', borderRadius: '50%', filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto' }}
        >
          <p className="section-label" style={{ marginBottom: '1.5rem', color: 'rgba(240,237,230,0.5)' }}>Iniziamo</p>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            lineHeight: 0.92, marginBottom: '1.5rem', color: '#F0EDE6',
          }}>
            HAI UN'ATTIVITÀ,<br />UN BRAND O UN PROGETTO<br />
            <span style={{
              fontFamily: 'var(--fs)', fontStyle: 'italic',
              fontWeight: 400, fontSize: '0.7em', color: 'var(--a)',
            }}>da raccontare meglio?</span>
          </h2>
          <p style={{
            fontSize: 16, color: 'rgba(240,237,230,0.6)', lineHeight: 1.75,
            marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem',
          }}>
            Partiamo da una chiacchierata. Ti aiutiamo a capire quali contenuti, canali e strategie
            possono valorizzare davvero la tua comunicazione.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-p"
              onClick={onClick}
              style={{ fontSize: 13, padding: '18px 38px', background: 'var(--a)', color: '#000' }}
            >
              Parla con InLab <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
