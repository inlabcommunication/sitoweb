import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion as useFmReducedMotion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Channel = {
  label: string;
  short: string;
  color: string;
  x: number;
  y: number;
};

const CHANNELS: Channel[] = [
  { label: 'Google',    short: 'G',   color: '#4285F4', x: 8,  y: 18 },
  { label: 'Instagram', short: 'IG',  color: '#E4405F', x: 92, y: 18 },
  { label: 'Facebook',  short: 'f',   color: '#1877F2', x: 4,  y: 50 },
  { label: 'TikTok',    short: 'TT',  color: '#ff0050', x: 96, y: 50 },
  { label: 'Meta Ads',  short: '◈',   color: '#0668E1', x: 8,  y: 82 },
  { label: 'WhatsApp',  short: 'W',   color: '#25D366', x: 92, y: 82 },
  { label: 'Sito web',  short: '</>',  color: '#cdb2ff', x: 30, y: 6  },
  { label: 'Landing',   short: 'L',   color: '#cdb2ff', x: 70, y: 6  },
  { label: 'Email',     short: '@',   color: '#F0EDE6', x: 30, y: 94 },
  { label: 'Analytics', short: '↗',   color: '#F0EDE6', x: 70, y: 94 },
];

const KEYWORDS = ['Visibilità', 'Strategia', 'Contenuti', 'Lead', 'Fiducia', 'Vendite', 'Brand'];

const FlowDiagram: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const cx = 50;
  const cy = 50;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '1 / 1',
      maxWidth: 520,
      margin: '0 auto',
    }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(205,178,255,0.45)" />
            <stop offset="60%" stopColor="rgba(205,178,255,0.08)" />
            <stop offset="100%" stopColor="rgba(205,178,255,0)" />
          </radialGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(205,178,255,0.05)" />
            <stop offset="50%" stopColor="rgba(205,178,255,0.55)" />
            <stop offset="100%" stopColor="rgba(205,178,255,0.05)" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r="22" fill="url(#centerGlow)" />
        {CHANNELS.map((ch, i) => {
          const mx = (ch.x + cx) / 2;
          const my = (ch.y + cy) / 2;
          const dx = cx - ch.x;
          const dy = cy - ch.y;
          const len = Math.hypot(dx, dy) || 1;
          const px = -dy / len;
          const py = dx / len;
          const curveAmt = 6;
          const qx = mx + px * curveAmt;
          const qy = my + py * curveAmt;
          const d = `M ${ch.x} ${ch.y} Q ${qx} ${qy} ${cx} ${cy}`;
          return (
            <g key={ch.label}>
              <motion.path
                d={d} fill="none" stroke="url(#lineGrad)" strokeWidth="0.35" strokeLinecap="round"
                filter="url(#softGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reduced ? 0 : 1.4, delay: reduced ? 0 : 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
              {!reduced && (
                <motion.circle r="0.7" fill="#cdb2ff" filter="url(#softGlow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.4, delay: 2 + i * 0.25, repeat: Infinity, repeatDelay: 3 + (i % 3), ease: 'linear' }}
                >
                  <animateMotion dur="2.4s" begin={`${2 + i * 0.25}s`} repeatCount="indefinite" path={d} />
                </motion.circle>
              )}
            </g>
          );
        })}
      </svg>

      {CHANNELS.map((ch, i) => (
        <motion.div key={ch.label}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', left: `${ch.x}%`, top: `${ch.y}%`,
            transform: 'translate(-50%, -50%)', width: 42, height: 42,
            borderRadius: 12, background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)', border: '.5px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--fb)', fontWeight: 600, fontSize: 13, color: ch.color,
            zIndex: 2, boxShadow: `0 0 20px ${ch.color}22`,
          }}
          title={ch.label}
        >
          {ch.short}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)', width: 168,
          padding: '1.25rem 1rem',
          background: 'linear-gradient(135deg, rgba(205,178,255,0.18) 0%, rgba(205,178,255,0.05) 100%)',
          backdropFilter: 'blur(12px)', border: '.5px solid rgba(205,178,255,0.4)',
          borderRadius: 18, textAlign: 'center', zIndex: 3,
        }}
      >
        {!reduced && (
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -1, borderRadius: 18,
              boxShadow: '0 0 40px rgba(205,178,255,0.35), inset 0 0 20px rgba(205,178,255,0.1)',
              pointerEvents: 'none',
            }}
          />
        )}
        <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 6 }}>
          Il tuo
        </div>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 28, lineHeight: 1, letterSpacing: '.02em', color: 'var(--t)' }}>
          BRAND
        </div>
        <div style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', fontSize: 13, color: 'var(--a)', marginTop: 6 }}>
          al centro.
        </div>
      </motion.div>

      {KEYWORDS.map((kw, i) => {
        const angle = (i / KEYWORDS.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 48;
        const kx = 50 + Math.cos(angle) * radius;
        const ky = 50 + Math.sin(angle) * radius;
        return (
          <motion.span key={kw}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 2.2 + i * 0.1 }}
            style={{
              position: 'absolute', left: `${kx}%`, top: `${ky}%`,
              transform: 'translate(-50%, -50%)', fontSize: 10,
              letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)',
              pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 1,
            }}
          >
            {kw}
          </motion.span>
        );
      })}
    </div>
  );
};

// Parole che ruotano nella headline
const ROTATING_WORDS = ['scelto.', 'ricordato.', 'desiderato.', 'trovato.', 'riconosciuto.'];

const RotatingWord: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, [reduced]);

  return (
    <span style={{
      display: 'inline-block',
      color: 'var(--a)',
      fontFamily: 'var(--fs)',
      fontStyle: 'italic',
      fontWeight: 400,
      transition: 'opacity .35s, transform .35s',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-8px)',
    }}>
      {ROTATING_WORDS[idx]}
    </span>
  );
};

interface HeroFlowProps {
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
  tag?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export const HeroFlow: React.FC<HeroFlowProps> = ({
  onPrimaryCta,
  onSecondaryCta,
  tag = 'Laboratorio creativo — Taranto, Puglia',
  ctaPrimary = 'Raccontaci il tuo progetto',
  ctaSecondary = 'Guarda i nostri lavori',
}) => {
  const reducedSystem = useReducedMotion();
  const reducedFm = useFmReducedMotion();
  const reduced = reducedSystem || !!reducedFm;

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reduced) return;
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setTilt({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [reduced]);

  return (
    <section style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      padding: '8rem 2rem 5rem', display: 'flex', alignItems: 'center',
      borderBottom: '.5px solid var(--b)',
    }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)',
        }} />
        <motion.div
          animate={reduced ? {} : { x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '10%', right: '5%', width: 500, height: 500,
            background: 'rgba(205,178,255,0.07)', borderRadius: '50%', filter: 'blur(120px)',
            transform: `translate(${tilt.x * 18}px, ${tilt.y * 18}px)`,
          }}
        />
        <motion.div
          animate={reduced ? {} : { x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: '5%', left: '5%', width: 350, height: 350,
            background: 'rgba(255,255,255,0.025)', borderRadius: '50%', filter: 'blur(90px)',
            transform: `translate(${tilt.x * -12}px, ${tilt.y * -12}px)`,
          }}
        />
      </div>

      <div style={{
        maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center',
      }} className="grid-1-mob">

        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.05 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '.5px solid var(--b)', borderRadius: 100,
              padding: '5px 14px 5px 5px', marginBottom: '2rem',
            }}
          >
            <span style={{
              width: 20, height: 20, background: 'var(--a)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={10} color="#000" />
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)' }}>
              {tag}
            </span>
          </motion.div>

          {/* H1 con parola rotante */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.15, duration: reduced ? 0 : 0.7 }}
            style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.6rem, 5vw, 4.8rem)',
              lineHeight: 1.0,
              letterSpacing: '0.01em',
              marginBottom: '1.5rem',
              fontWeight: 400,
              color: 'var(--t)',
              textTransform: 'uppercase',
            }}
          >
            Non ti servono<br />
            solo contenuti.<br />
            <span style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 400, fontSize: '0.72em', textTransform: 'none', color: 'var(--t)' }}>
              Ti serve essere{' '}
              <RotatingWord reduced={reduced} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.3 }}
            style={{
              maxWidth: 500, fontSize: 16, lineHeight: 1.8,
              color: 'var(--m)', fontWeight: 300, marginBottom: '2.5rem',
            }}
          >
            InLab Communication crea strategie, foto, video, reel e campagne digitali
            per aziende, professionisti e attività locali che vogliono distinguersi davvero.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.45 }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
          >
            <button className="btn btn-p" onClick={onPrimaryCta}>
              {ctaPrimary} <ArrowRight size={14} />
            </button>
            <button className="btn btn-g" onClick={onSecondaryCta}>
              {ctaSecondary}
            </button>
          </motion.div>

          {/* Social proof mini sotto i CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.9 }}
            style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}
          >
            {[
              { n: '100k+', l: 'visualizzazioni' },
              { n: '47', l: 'brand seguiti' },
              { n: '9', l: 'città in Puglia' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--fd)', fontSize: 20, color: 'var(--a)', letterSpacing: '.04em' }}>{s.n}</span>
                <span style={{ fontSize: 11, color: 'var(--m)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Flow diagram — nascosto su mobile piccolo */}
        <div style={{ position: 'relative' }} className="hide-mob">
          <FlowDiagram reduced={reduced} />
        </div>
      </div>
    </section>
  );
};
