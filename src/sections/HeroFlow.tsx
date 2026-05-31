import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion as useFmReducedMotion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ── 5 nodi a stella perfetta ─────────────────────────────────────
// SVG viewBox 200x200, centro (100,100), raggio 70
// angoli: -90°, -18°, 54°, 126°, 198° (passo 72°)
type Node = { label: string; short: string; x: number; y: number };

const NODES: Node[] = [
  { label: 'Brand Identity',      short: '◈',  x: 100.0, y: 30.0 },
  { label: 'Social Media',        short: 'IG', x: 166.6, y: 78.4 },
  { label: 'Sito Web',            short: '</>', x: 141.1, y: 156.6 },
  { label: 'Google My Profile',   short: 'G',  x: 58.9, y: 156.6 },
  { label: 'Contenuti Originali', short: 'CO', x: 33.4, y: 78.4 },
];

const ROTATING_WORDS = ['scelto.', 'ricordato.', 'desiderato.', 'trovato.', 'riconosciuto.'];

const RotatingWord: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % ROTATING_WORDS.length); setVisible(true); }, 350);
    }, 2200);
    return () => clearInterval(t);
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

// ── Diagramma tutto in SVG — zero div assoluti ───────────────────
const FlowDiagram: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const cx = 100, cy = 100; // centro esatto del viewBox 200x200

  return (
    <svg
      viewBox="0 0 200 200"
      width="100%"
      style={{ maxWidth: 480, display: 'block', margin: '0 auto', overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hfGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(205,178,255,0.5)" />
          <stop offset="60%"  stopColor="rgba(205,178,255,0.08)" />
          <stop offset="100%" stopColor="rgba(205,178,255,0)" />
        </radialGradient>
        <filter id="hfBlur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        {/* Maschera che esclude il box centrale dalle linee */}
        <mask id="lineMask">
          <rect x="0" y="0" width="200" height="200" fill="white" />
          <rect x="62" y="72" width="76" height="56" rx="12" fill="black" />
        </mask>
      </defs>

      {/* Alone centrale */}
      <circle cx={cx} cy={cy} r="28" fill="url(#hfGlow)" />
      <circle cx={cx} cy={cy} r="18" fill="url(#hfGlow)" />

      {/* Linee dai nodi al centro — mascherate dal box centrale */}
      <g mask="url(#lineMask)">
      {NODES.map((n, i) => {
        // punto di controllo leggermente spostato perpendicolarmente
        const mx = (n.x + cx) / 2;
        const my = (n.y + cy) / 2;
        const dx = cx - n.x, dy = cy - n.y;
        const len = Math.hypot(dx, dy) || 1;
        const qx = mx + (-dy / len) * 10;
        const qy = my + (dx / len) * 10;
        return (
          <motion.path
            key={n.label}
            d={`M ${n.x} ${n.y} Q ${qx} ${qy} ${cx} ${cy}`}
            fill="none"
            stroke="rgba(205,178,255,0.45)"
            strokeWidth="0.6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduced ? 0 : 1.4, delay: reduced ? 0 : 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}

      </g>

      {/* Pallini che scorrono verso il centro */}
      {!reduced && NODES.map((n, i) => {
        const mx = (n.x + cx) / 2;
        const my = (n.y + cy) / 2;
        const dx = cx - n.x, dy = cy - n.y;
        const len = Math.hypot(dx, dy) || 1;
        const qx = mx + (-dy / len) * 10;
        const qy = my + (dx / len) * 10;
        const path = `M ${n.x} ${n.y} Q ${qx} ${qy} ${cx} ${cy}`;
        return (
          <motion.circle key={`dot-${i}`} r="1" fill="rgba(205,178,255,0.9)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: 2.2 + i * 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <animateMotion dur="2s" begin={`${2.2 + i * 0.5}s`} repeatCount="indefinite" path={path} />
          </motion.circle>
        );
      })}

      {/* Icone dei nodi */}
      {NODES.map((n, i) => (
        <motion.g key={n.label}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.1 + i * 0.08 }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        >
          {/* Card icona */}
          <rect
            x={n.x - 13} y={n.y - 13} width="26" height="26" rx="7"
            fill="rgba(20,18,28,0.75)"
            stroke="rgba(205,178,255,0.25)"
            strokeWidth="0.6"
          />
          {/* Simbolo */}
          <text
            x={n.x} y={n.y + 4}
            textAnchor="middle"
            fontSize="8"
            fontFamily="var(--fb)"
            fontWeight="700"
            fill="rgba(205,178,255,0.9)"
          >
            {n.short}
          </text>
          {/* Label sotto */}
          <text
            x={n.x} y={n.y + 22}
            textAnchor="middle"
            fontSize="4.8"
            fontFamily="var(--fb)"
            fontWeight="500"
            letterSpacing="0.8"
            fill="rgba(240,237,230,0.45)"
            style={{ textTransform: 'uppercase' }}
          >
            {n.label}
          </text>
        </motion.g>
      ))}

      {/* Box centrale BRAND — rettangolo SVG centrato esattamente su (100,100) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.2 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {/* Alone pulsante */}
        {!reduced && (
          <motion.rect
            x="62" y="72" width="76" height="56" rx="12"
            fill="none"
            stroke="rgba(205,178,255,0.3)"
            strokeWidth="0.8"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
        {/* Box sfondo */}
        <rect
          x="64" y="74" width="72" height="52" rx="11"
          fill="rgba(205,178,255,0.08)"
          stroke="rgba(205,178,255,0.4)"
          strokeWidth="0.7"
        />
        {/* "Il tuo" */}
        <text x={cx} y="92" textAnchor="middle" fontSize="6" fontFamily="var(--fb)"
          letterSpacing="1.5" fill="rgba(240,237,230,0.45)">
          IL TUO
        </text>
        {/* BRAND */}
        <text x={cx} y="107" textAnchor="middle" fontSize="18" fontFamily="var(--fd)"
          letterSpacing="1" fill="#F0EDE6">
          BRAND
        </text>
        {/* "al centro." */}
        <text x={cx} y="120" textAnchor="middle" fontSize="7.5" fontFamily="var(--fs)"
          fontStyle="italic" fill="rgba(205,178,255,0.85)">
          al centro.
        </text>
      </motion.g>
    </svg>
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
  onPrimaryCta, onSecondaryCta,
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
      {/* Background */}
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
      </div>

      <div style={{
        maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center',
      }} className="grid-1-mob">

        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.05 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '.5px solid var(--b)', borderRadius: 100, padding: '5px 14px 5px 5px', marginBottom: '2rem' }}
          >
            <span style={{ width: 20, height: 20, background: 'var(--a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={10} color="#000" />
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)' }}>
              {tag}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.15, duration: reduced ? 0 : 0.7 }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.6rem, 5vw, 4.8rem)', lineHeight: 1.0, letterSpacing: '0.01em', marginBottom: '1.5rem', fontWeight: 400, color: 'var(--t)', textTransform: 'uppercase' }}
          >
            Non ti servono<br />
            solo contenuti.<br />
            <span style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 400, fontSize: '0.72em', textTransform: 'none', color: 'var(--t)' }}>
              Ti serve essere <RotatingWord reduced={reduced} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.3 }}
            style={{ maxWidth: 500, fontSize: 16, lineHeight: 1.8, color: 'var(--m)', fontWeight: 300, marginBottom: '2.5rem' }}
          >
            InLab Communication crea strategie, foto, video, reel e campagne digitali
            per aziende, professionisti e attività locali che vogliono distinguersi davvero.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.45 }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
          >
            <button className="btn btn-p" onClick={onPrimaryCta}>{ctaPrimary} <ArrowRight size={14} /></button>
            <button className="btn btn-g" onClick={onSecondaryCta}>{ctaSecondary}</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.9 }}
            style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}
          >
            {[{ n: '100k+', l: 'visualizzazioni' }, { n: '47', l: 'brand seguiti' }, { n: '9', l: 'città in Puglia' }].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--fd)', fontSize: 20, color: 'var(--a)', letterSpacing: '.04em' }}>{s.n}</span>
                <span style={{ fontSize: 11, color: 'var(--m)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Diagramma SVG */}
        <div className="hide-mob">
          <FlowDiagram reduced={reduced} />
        </div>
      </div>
    </section>
  );
};
