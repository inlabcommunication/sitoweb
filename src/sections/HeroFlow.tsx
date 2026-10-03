import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useAgencyStats } from '../data/stats';

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

// Parola che ruota, tutta in CSS (classi .rot-w in App.tsx): le parole sono già
// nell'HTML, una sopra l'altra nella stessa cella, e il primo cambio arriva a ~1 s
// anche prima che parta il JavaScript (prima: 2,2 s dopo l'avvio di React, ~4 s su
// iPhone; richiesta Performance 03/10). La larghezza è quella della parola più lunga.
const RotatingWord: React.FC<{ reduced: boolean }> = ({ reduced }) => (
  <span className="rot-word" style={{ display: 'inline-grid', justifyItems: 'start', color: 'var(--a)', fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 400 }}>
    {(reduced ? ROTATING_WORDS.slice(0, 1) : ROTATING_WORDS).map((w, i) => (
      <span key={w} className={reduced ? undefined : 'rot-w'} aria-hidden={i > 0 ? true : undefined}
        style={{ gridArea: '1 / 1', ...(reduced ? {} : { animationDelay: i === 0 ? '-1.2s' : `${(1 + (i - 1) * 2.2).toFixed(1)}s` }) }}>
        {w}
      </span>
    ))}
  </span>
);

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
          <path
            key={n.label}
            d={`M ${n.x} ${n.y} Q ${qx} ${qy} ${cx} ${cy}`}
            pathLength={1}
            className="hf-line"
            fill="none"
            stroke="rgba(205,178,255,0.45)"
            strokeWidth="0.6"
            strokeLinecap="round"
            style={reduced ? { animation: 'none' } : { animationDelay: `${0.5 + i * 0.1}s` }}
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
          // SVG nativo (niente JavaScript a ogni fotogramma): visibile nei primi 2 s di ogni ciclo di 4 s
          <circle key={`dot-${i}`} r="1" fill="rgba(205,178,255,0.9)" opacity="0">
            <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.1;0.4;0.5;1" dur="4s" begin={`${2.2 + i * 0.5}s`} repeatCount="indefinite" />
            <animateMotion dur="2s" begin={`${2.2 + i * 0.5}s`} repeatCount="indefinite" path={path} />
          </circle>
        );
      })}

      {/* Icone dei nodi */}
      {NODES.map((n, i) => (
        <g key={n.label} className="hf-pop"
          style={{ transformOrigin: `${n.x}px ${n.y}px`, ...(reduced ? { animation: 'none' } : { animationDelay: `${0.1 + i * 0.08}s` }) }}
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
        </g>
      ))}

      {/* Box centrale BRAND — rettangolo SVG centrato esattamente su (100,100) */}
      <g className="hf-pop"
        style={{ transformOrigin: `${cx}px ${cy}px`, ...(reduced ? { animation: 'none' } : { animationDuration: '.7s', animationDelay: '.2s' }) }}
      >
        {/* Alone pulsante */}
        {!reduced && (
          <rect
            x="62" y="72" width="76" height="56" rx="12"
            fill="none"
            stroke="rgba(205,178,255,0.3)"
            strokeWidth="0.8"
            opacity="0.3"
          >
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
          </rect>
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
      </g>
    </svg>
  );
};

// Entrata del telefono: sale dal basso sdraiato in prospettiva (rotateX),
// si raddrizza e si assesta con una leggera inclinazione 3D, poi fluttua.

const PhoneMockup: React.FC<{ reduced: boolean; topStat: string }> = ({ reduced, topStat }) => (
  <div style={{ display: 'flex', justifyContent: 'center', perspective: 1400 }}>
  {/* entrata in CSS (.hero-phone in App.tsx): parte con l'HTML, senza JavaScript */}
  <div className="hero-phone" style={reduced ? { animation: 'none' } : undefined}>
  {/* fluttuazione continua in CSS (.anim-float), non in JavaScript */}
  <div className="anim-float">
    <div style={{
      width: 'min(300px, 68vw)',
      aspectRatio: '9 / 18.5',
      borderRadius: 38,
      padding: 10,
      background: 'linear-gradient(145deg,#0d0c10 0%,#26222d 52%,#0b0b0d 100%)',
      border: '1px solid rgba(255,255,255,.16)',
      boxShadow: '0 34px 90px rgba(0,0,0,.5), 0 0 0 8px rgba(205,178,255,.04)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 92,
        height: 22,
        borderRadius: '0 0 18px 18px',
        background: '#0b0b0d',
        zIndex: 3,
      }} />

      <div style={{
        height: '100%',
        borderRadius: 29,
        overflow: 'hidden',
        background: 'linear-gradient(180deg,#17151b 0%,#24202b 46%,#101013 100%)',
        border: '1px solid rgba(255,255,255,.08)',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.55 }} />

        <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: '2.7rem 1.05rem 1rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(240,237,230,.58)' }}>
            <span>InLab</span>
            <span style={{ color: 'var(--a)' }}>Live</span>
          </div>

          <div style={{
            minHeight: 176,
            borderRadius: 24,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(145deg,rgba(205,178,255,.95),rgba(120,94,170,.24) 42%,rgba(10,10,12,.95))',
            border: '1px solid rgba(255,255,255,.12)',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 25%,rgba(255,255,255,.34),transparent 18%), linear-gradient(to top,rgba(10,10,12,.9),transparent 55%)' }} />
            <div style={{ position: 'absolute', left: 18, bottom: 18 }}>
              <div style={{ fontFamily: 'var(--fd)', fontSize: 46, lineHeight: .85, letterSpacing: '.02em' }}>{topStat}</div>
              <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(240,237,230,.68)' }}>visualizzazioni</div>
            </div>
            <div style={{ position: 'absolute', right: 14, top: 14, display: 'grid', gap: 8 }}>
              {['IG', 'ADS', 'SEO'].map((item) => (
                <span key={item} style={{ width: 34, height: 34, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'rgba(10,10,12,.58)', border: '1px solid rgba(255,255,255,.12)', color: 'var(--a)', fontSize: 10, fontWeight: 700 }}>{item}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['Strategia', 'Social media'],
              ['Reels', 'Video verticali'],
              ['Lead', 'Campagne Meta'],
              ['Report', 'Dati chiari'],
            ].map(([title, sub]) => (
              <div key={title} style={{ minHeight: 60, borderRadius: 16, padding: 10, background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 18, letterSpacing: '.04em', lineHeight: 1 }}>{title}</div>
                <div style={{ marginTop: 5, color: 'rgba(240,237,230,.45)', fontSize: 10, lineHeight: 1.35 }}>{sub}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', borderRadius: 18, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(205,178,255,.12)', border: '1px solid rgba(205,178,255,.22)' }}>
            <span style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(240,237,230,.65)' }}>Piano mensile</span>
            <span style={{ fontFamily: 'var(--fd)', fontSize: 22, color: 'var(--a)' }}>+47%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
);

interface HeroFlowProps {
  onPrimaryCta: () => void;
  onSecondaryCta?: () => void; // senza handler il secondo bottone non viene mostrato
  tag?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  description?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export const HeroFlow: React.FC<HeroFlowProps> = ({
  onPrimaryCta, onSecondaryCta,
  tag = 'Agenzia di comunicazione a Castellaneta (TA): social, video, siti e Meta Ads',
  headlineLine1 = 'Non ti servono',
  headlineLine2 = 'solo contenuti.',
  description = 'InLab Communication crea strategie, foto, video, reel e campagne digitali per aziende, professionisti e attività locali che vogliono distinguersi davvero.',
  ctaPrimary = 'Raccontaci il tuo progetto',
  ctaSecondary = 'Guarda i nostri lavori',
}) => {
  // Solo l'hook del sito: vale false nel primo render (come l'HTML statico) e si
  // aggiorna dopo il mount. useReducedMotion di motion legge subito la preferenza
  // e con "Riduci movimento" rompeva l'aggancio della home (errore 418, 03/10).
  const reduced = useReducedMotion();
  const agencyStats = useAgencyStats();

  return (
    <section style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      padding: '8rem 2rem 5rem', display: 'flex', alignItems: 'center',
      borderBottom: '.5px solid var(--b)',
    }}>
      {/* Background */}
      {/* sfondo: overflow/contain così il cerchio che si muove non sposta il layout (CLS) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', contain: 'layout paint' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)',
        }} />
        <div className="anim-drift"
          style={{ position: 'absolute', top: '10%', right: '5%', width: 500, height: 500, background: 'radial-gradient(closest-side, rgba(205,178,255,0.06) 0%, rgba(205,178,255,0.03) 45%, rgba(205,178,255,0) 100%)', borderRadius: '50%' }}
        />
      </div>

      <div style={{
        maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center',
      }} className="grid-1-mob">

        {/* Copy: visibile subito, senza dissolvenza (è l'elemento principale della pagina) */}
        <div>
          {/* H1 della pagina (per Google): l'etichetta con servizio e città, stesso aspetto di prima */}
          <motion.h1
            initial={false}
            transition={{ delay: reduced ? 0 : 0.05 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '.5px solid var(--b)', borderRadius: 100, padding: '5px 14px 5px 5px', marginBottom: '2rem', fontSize: 12, fontWeight: 500, lineHeight: 'normal' }}
          >
            <span style={{ width: 20, height: 20, background: 'var(--a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={10} color="#000" />
            </span>
            <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)' }}>
              {tag}
            </span>
          </motion.h1>

          {/* Slogan: stesso stile, ma non è un'intestazione (un solo H1 per pagina) */}
          <motion.p
            initial={false}
            transition={{ delay: reduced ? 0 : 0.15, duration: reduced ? 0 : 0.7 }}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.6rem, 5vw, 4.8rem)', lineHeight: 1.0, letterSpacing: '0.01em', marginBottom: '1.5rem', fontWeight: 400, color: 'var(--t)', textTransform: 'uppercase' }}
          >
            {headlineLine1}<br />
            {headlineLine2}<br />
            <span style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 400, fontSize: '0.72em', textTransform: 'none', color: 'var(--t)' }}>
              Ti serve essere <RotatingWord reduced={reduced} />
            </span>
          </motion.p>

          <motion.p
            initial={false}
            transition={{ delay: reduced ? 0 : 0.3 }}
            style={{ maxWidth: 500, fontSize: 16, lineHeight: 1.8, color: 'var(--m)', fontWeight: 300, marginBottom: '2.5rem' }}
          >
            {description}
          </motion.p>

          <motion.div
            initial={false}
            transition={{ delay: reduced ? 0 : 0.45 }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
          >
            <button className="btn btn-p" onClick={onPrimaryCta}>{ctaPrimary} <ArrowRight size={14} /></button>
            {onSecondaryCta && <button className="btn btn-g" onClick={onSecondaryCta}>{ctaSecondary}</button>}
          </motion.div>

          <motion.div
            initial={false}
            transition={{ delay: reduced ? 0 : 0.9 }}
            style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}
          >
            {agencyStats.slice(0, 3).map(s => ({ n: s.display, l: s.short })).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--fd)', fontSize: 20, color: 'var(--a)', letterSpacing: '.04em' }}>{s.n}</span>
                <span style={{ fontSize: 12, color: 'var(--m)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Phone mockup: solo su computer (sul telefono ripeteva quello della sezione dopo) */}
        <div className="hide-mob">
          <PhoneMockup reduced={reduced} topStat={agencyStats[0]?.display || ''} />
        </div>
      </div>
    </section>
  );
};
