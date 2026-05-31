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

// 5 nodi a stella perfetta — centro 50,50 — raggio 36 — passo 72°
const CHANNELS: Channel[] = [
  { label: 'Brand Identity',      short: '◈',  color: '#cdb2ff', x: 50.0, y: 14.0 },
  { label: 'Social Media',        short: 'SM', color: '#E4405F', x: 84.2, y: 38.9 },
  { label: 'Sito Web',            short: 'SW', color: '#60a5fa', x: 71.2, y: 79.1 },
  { label: 'Google My Profile',   short: 'G',  color: '#4285F4', x: 28.8, y: 79.1 },
  { label: 'Contenuti Originali', short: 'CO', color: '#a78bfa', x: 15.8, y: 38.9 },
];

const ROTATING_WORDS = ['scelto.', 'ricordato.', 'desiderato.', 'trovato.', 'riconosciuto.'];

const RotatingWord: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % ROTATING_WORDS.length); setVisible(true); }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, [reduced]);

  return (
    <span style={{
      display: 'inline-block', color: 'var(--a)',
      fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 400,
      transition: 'opacity .35s, transform .35s',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-8px)',
    }}>
      {ROTATING_WORDS[idx]}
    </span>
  );
};

const FlowDiagram: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const cx = 50;
  const cy = 50;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '1 / 1',
      maxWidth: 460,
      margin: '0 auto',
    }}>
      {/* SVG linee */}
      <svg
        viewBox="0 0 100 100"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(205,178,255,0.5)" />
            <stop offset="55%"  stopColor="rgba(205,178,255,0.1)" />
            <stop offset="100%" stopColor="rgba(205,178,255,0)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.7" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Alone centrale */}
        <circle cx={cx} cy={cy} r="20" fill="url(#centerGlow)" />

        {/* Linee dai nodi al centro */}
        {CHANNELS.map((ch, i) => {
          const d = `M ${ch.x} ${ch.y} L ${cx} ${cy}`;
          return (
            <motion.line key={ch.label}
              x1={ch.x} y1={ch.y} x2={cx} y2={cy}
              stroke={ch.color}
              strokeWidth="0.3"
              strokeOpacity="0.4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: reduced ? 0 : 1.2, delay: reduced ? 0 : 0.4 + i * 0.12 }}
            />
          );
        })}

        {/* Pallino animato che scorre verso il centro */}
        {!reduced && CHANNELS.map((ch, i) => (
          <motion.circle key={`dot-${ch.label}`} r="0.8" fill={ch.color} opacity="0.9"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: 2 + i * 0.4, repeat: Infinity, repeatDelay: 2.5 }}
          >
            <animateMotion
              dur="2s"
              begin={`${2 + i * 0.4}s`}
              repeatCount="indefinite"
              path={`M ${ch.x} ${ch.y} L ${cx} ${cy}`}
            />
          </motion.circle>
        ))}
      </svg>

      {/* Nodi canale */}
      {CHANNELS.map((ch, i) => (
        <motion.div key={ch.label}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.1 + i * 0.1 }}
          style={{
            position: 'absolute',
            left: `${ch.x}%`,
            top: `${ch.y}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            zIndex: 2,
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(20,20,28,0.7)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${ch.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--fb)', fontWeight: 700, fontSize: 12,
            color: ch.color,
            boxShadow: `0 0 18px ${ch.color}22`,
          }}>
            {ch.short}
          </div>
          <div style={{
            fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'rgba(240,237,230,0.5)', whiteSpace: 'nowrap',
          }}>
            {ch.label}
          </div>
        </motion.div>
      ))}

      {/* Box centrale BRAND — esattamente a 50%/50% */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.2 }}
        style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 148,
          padding: '1.1rem 1rem',
          background: 'linear-gradient(135deg, rgba(205,178,255,0.15) 0%, rgba(205,178,255,0.04) 100%)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(205,178,255,0.35)',
          borderRadius: 18,
          textAlign: 'center',
          zIndex: 3,
        }}
      >
        {!reduced && (
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(205,178,255,0.2)', '0 0 40px rgba(205,178,255,0.4)', '0 0 20px rgba(205,178,255,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ position: 'absolute', inset: 0, borderRadius: 18, pointerEvents: 'none' }}
          />
        )}
        <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 5 }}>
          Il tuo
        </div>
        <div style={{ fontFamily: 'var(--fd)', fontSize: 30, lineHeight: 1, color: 'var(--t)', letterSpacing: '.03em' }}>
          BRAND
        </div>
        <div style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', fontSize: 13, color: 'var(--a)', marginTop: 5 }}>
          al centro.
        </div>
      </motion.div>
    </div>
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

  return (
    <section style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      padding: '8rem 2rem 5rem', display: 'flex', alignItems: 'center',
      borderBottom: '.5px solid var(--b)',
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)',
        }} />
        <motion.div
          animate={reduced ? {} : { x: [0, 25, 0], y: [0, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '10%', right: '5%', width: 500, height: 500, background: 'rgba(205,178,255,0.06)', borderRadius: '50%', filter: 'blur(120px)' }}
        />
        <motion.div
          animate={reduced ? {} : { x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '5%', left: '5%', width: 350, height: 350, background: 'rgba(255,255,255,0.02)', borderRadius: '50%', filter: 'blur(90px)' }}
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
            <span style={{ width: 20, height: 20, background: 'var(--a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={10} color="#000" />
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)' }}>
              {tag}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.15, duration: reduced ? 0 : 0.7 }}
            style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.6rem, 5vw, 4.8rem)',
              lineHeight: 1.0, letterSpacing: '0.01em',
              marginBottom: '1.5rem', fontWeight: 400,
              color: 'var(--t)', textTransform: 'uppercase',
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
            style={{ maxWidth: 500, fontSize: 16, lineHeight: 1.8, color: 'var(--m)', fontWeight: 300, marginBottom: '2.5rem' }}
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

        {/* Diagramma — nascosto su mobile piccolo */}
        <div className="hide-mob">
          <FlowDiagram reduced={reduced} />
        </div>
      </div>
    </section>
  );
};
