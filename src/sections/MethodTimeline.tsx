import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MethodDevices, deviceFor } from './MethodDevices';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Search, Compass, Wand2, Send, BarChart3 } from 'lucide-react';
import { useContent } from '../lib/content';

const ICONS = [Search, Compass, Wand2, Send, BarChart3];

const STEPS = [
  { icon: Search,   title: 'Analisi',                desc: 'Studiamo brand, pubblico, mercato e obiettivi. Niente parte se non capiamo dove stai andando.' },
  { icon: Compass,  title: 'Strategia',              desc: 'Definiamo direzione, tono di voce, canali e messaggi. Un piano chiaro, non un calendario riempitivo.' },
  { icon: Wand2,    title: 'Produzione contenuti',   desc: 'Foto, video, grafiche, copy. Ogni contenuto è costruito con un perché preciso.' },
  { icon: Send,     title: 'Pubblicazione e campagne', desc: 'Gestiamo canali e attiviamo campagne ads per amplificare ciò che funziona.' },
  { icon: BarChart3,title: 'Report e ottimizzazione', desc: 'Misuriamo, leggiamo i dati, miglioriamo. La strategia evolve con i risultati reali.' },
];

export const MethodTimeline: React.FC = () => {
  // Testi modificabili da dashboard → Home → Metodo (valori predefiniti in constants.ts)
  const metodo = ((useContent() as any).metodo) || {};
  const steps = (Array.isArray(metodo.steps) && metodo.steps.length ? metodo.steps : STEPS)
    .map((st: any, i: number) => ({ icon: ICONS[i % ICONS.length], title: st.title, desc: st.desc }));
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 30%'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const reduced = useReducedMotion();

  // Fase attiva: lo step che passa al centro dello schermo
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [steps.length]);
  const focus = deviceFor(steps[active]?.title, active);

  return (
    <section className="mt-sec" style={{ padding: '8rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative' }}>
      <style>{`
        .mt-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:4rem;align-items:start}
        .mt-visual{position:sticky;top:calc(50vh - 250px);height:500px}
        .mt-step{min-height:34vh}
        @media(max-width:900px){
          .mt-grid{grid-template-columns:1fr;gap:0}
          .mt-visual{order:-1;top:64px;height:290px;z-index:3;margin:0 -2rem 1.5rem;background:linear-gradient(180deg,var(--bg) 82%,transparent)}
          .mt-step{min-height:46vh}
        }
      `}</style>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: '5rem', maxWidth: 720 }}
        >
          <p className="section-label">{metodo.tag || 'Il nostro metodo'}</p>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
            lineHeight: 0.9,
            marginBottom: '1.2rem',
          }}>
            {metodo.title || 'DAL CAOS DEI CONTENUTI'}<br />
            <span style={{
              fontFamily: 'var(--fs)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '0.85em',
              color: 'var(--a)',
            }}>{metodo.accent || 'a una strategia chiara.'}</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.7 }}>
            {metodo.subtitle || 'Cinque passaggi. Nessuno saltato. Così trasformiamo idee sparse in comunicazione che produce risultati.'}
          </p>
        </motion.div>

        <div className="mt-grid">
        {/* Timeline */}
        <div ref={containerRef} style={{ position: 'relative', paddingLeft: 24 }}>
          {/* Track verticale */}
          <div style={{
            position: 'absolute',
            left: 23,
            top: 0,
            bottom: 0,
            width: 1,
            background: 'var(--b)',
          }} />

          {/* Progress line animata */}
          <motion.div
            style={{
              position: 'absolute',
              left: 23,
              top: 0,
              width: 1,
              height: lineHeight,
              background: 'linear-gradient(180deg, var(--a), rgba(205,178,255,0.2))',
              boxShadow: '0 0 12px rgba(205,178,255,0.4)',
            }}
          />

          {steps.map((s: any, i: number) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                ref={(el: HTMLDivElement | null) => { stepRefs.current[i] = el; }}
                data-step={i}
                className="mt-step"
                animate={{ opacity: active === i ? 1 : 0.35 }}
                transition={{ duration: reduced ? 0 : 0.4 }}
                style={{
                  position: 'relative',
                  paddingLeft: 56,
                  paddingBottom: i === steps.length - 1 ? 0 : '3.5rem',
                }}
              >
                {/* Nodo */}
                <div style={{
                  position: 'absolute',
                  left: -1,
                  top: 0,
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--bg)',
                  border: '.5px solid rgba(205,178,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--a)',
                  boxShadow: '0 0 18px rgba(205,178,255,0.15)',
                  zIndex: 1,
                }}>
                  <Icon size={18} />
                </div>

                <div style={{ paddingTop: 4 }}>
                  <div style={{
                    fontSize: 10,
                    letterSpacing: '.2em',
                    textTransform: 'uppercase',
                    color: 'var(--m)',
                    marginBottom: 6,
                  }}>
                    Step {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--fd)',
                    fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                    lineHeight: 1,
                    marginBottom: 12,
                    color: 'var(--t)',
                    textTransform: 'uppercase',
                  }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 15.5, color: 'var(--m)', lineHeight: 1.75, maxWidth: 580 }}>
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dispositivi: quello della fase attiva passa davanti */}
        <div className="mt-visual" aria-hidden="true">
          <MethodDevices focus={focus} stepLabel={`Step ${String(active + 1).padStart(2, '0')} · ${steps[active]?.title || ''}`} reduced={reduced} />
        </div>
        </div>
      </div>
    </section>
  );
};
