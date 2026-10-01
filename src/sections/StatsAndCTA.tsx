import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAgencyStats } from '../data/stats';
import { useContent } from '../lib/content';

interface CounterProps {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ to, suffix = '', prefix = '', duration = 1.8 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  // Valore finale già nell'HTML statico (Google, crawler AI, chi non usa JS).
  // Nel browser, prima del primo disegno, si riparte da 0 per l'animazione,
  // ma solo se la sezione non è ancora visibile e senza "Riduci movimento".
  const [val, setVal] = useState(to);
  const fromZero = useRef(false);
  useLayoutEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce || el.getBoundingClientRect().top < window.innerHeight) return;
    fromZero.current = true;
    setVal(0);
  }, []);

  useEffect(() => {
    if (!inView || !fromZero.current) return;
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
      return k.toFixed(k < 10 ? 1 : 0) + 'K';
    }
    return Math.round(val).toString();
  })();

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
};


export const AnimatedStats: React.FC = () => {
  const STATS = useAgencyStats();
  return (
    <section style={{ padding: '6rem 2rem', position: 'relative', overflow: 'hidden', background: 'var(--a)', color: '#000' }}>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p className="section-label" style={{ display: 'inline-block', color: 'rgba(0,0,0,0.6)' }}>I numeri</p>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
            lineHeight: 0.9, marginBottom: '1rem',
          }}>
            CREATIVITÀ<br />
            <span style={{
              fontFamily: 'var(--fs)', fontStyle: 'italic',
              fontWeight: 400, fontSize: '0.85em', color: '#000', opacity: 0.7,
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
              style={{ padding: '2rem', borderLeft: '1px solid rgba(0,0,0,0.18)', position: 'relative' }}
            >
              <div style={{
                fontFamily: 'var(--fd)', fontSize: 'clamp(3rem, 6vw, 5rem)',
                lineHeight: 1, color: '#000',
                marginBottom: '0.6rem', letterSpacing: '-0.02em',
              }}>
                <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.68)', lineHeight: 1.4 }}>
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
  const cta = ((useContent() as any).cta?.home) || {};
  return (
    <section style={{ padding: '8rem 2rem', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, var(--bg) 0%, #241e30 40%, #3a2d56 100%)' }}>
      {/* Glow animato */}
      <div className="anim-glowA"
        style={{
          position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600,
          background: 'rgba(205,178,255,0.08)', borderRadius: '50%', filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
      />
      <div className="anim-glowB"
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
          <p className="section-label" style={{ marginBottom: '1.5rem', color: 'rgba(240,237,230,0.5)' }}>{cta.tag || 'Iniziamo'}</p>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            lineHeight: 0.92, marginBottom: '1.5rem', color: '#F0EDE6',
          }}>
            {cta.title || "HAI UN'ATTIVITÀ,"}<br />{cta.title2 || 'UN BRAND O UN PROGETTO'}<br />
            <span style={{
              fontFamily: 'var(--fs)', fontStyle: 'italic',
              fontWeight: 400, fontSize: '0.7em', color: 'var(--a)',
            }}>{cta.accent || 'da raccontare meglio?'}</span>
          </h2>
          <p style={{
            fontSize: 16, color: 'rgba(240,237,230,0.6)', lineHeight: 1.75,
            marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem',
          }}>
            {cta.subtitle || 'Partiamo da una chiacchierata. Ti aiutiamo a capire quali contenuti, canali e strategie possono valorizzare davvero la tua comunicazione.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-p"
              onClick={onClick}
              style={{ fontSize: 13, padding: '18px 38px', background: 'var(--a)', color: '#000' }}
            >
              {cta.btn1 || 'Parla con InLab'} <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
