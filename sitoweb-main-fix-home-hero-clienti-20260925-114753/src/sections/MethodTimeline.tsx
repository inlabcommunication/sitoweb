import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, Compass, Wand2, Send, BarChart3 } from 'lucide-react';

const STEPS = [
  { icon: Search,   title: 'Analisi',                desc: 'Studiamo brand, pubblico, mercato e obiettivi. Niente parte se non capiamo dove stai andando.' },
  { icon: Compass,  title: 'Strategia',              desc: 'Definiamo direzione, tono di voce, canali e messaggi. Un piano chiaro, non un calendario riempitivo.' },
  { icon: Wand2,    title: 'Produzione contenuti',   desc: 'Foto, video, grafiche, copy. Ogni contenuto è costruito con un perché preciso.' },
  { icon: Send,     title: 'Pubblicazione e campagne', desc: 'Gestiamo canali e attiviamo campagne ads per amplificare ciò che funziona.' },
  { icon: BarChart3,title: 'Report e ottimizzazione', desc: 'Misuriamo, leggiamo i dati, miglioriamo. La strategia evolve con i risultati reali.' },
];

export const MethodTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 30%'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section style={{ padding: '8rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: '5rem', maxWidth: 720 }}
        >
          <p className="section-label">Il nostro metodo</p>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(2.5rem, 5vw, 4.8rem)',
            lineHeight: 0.9,
            marginBottom: '1.2rem',
          }}>
            DAL CAOS DEI CONTENUTI<br />
            <span style={{
              fontFamily: 'var(--fs)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '0.85em',
              color: 'var(--a)',
            }}>a una strategia chiara.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.7 }}>
            Cinque passaggi. Nessuno saltato. Così trasformiamo idee sparse in comunicazione che produce risultati.
          </p>
        </motion.div>

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

          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'relative',
                  paddingLeft: 56,
                  paddingBottom: i === STEPS.length - 1 ? 0 : '3.5rem',
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
                  <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.75, maxWidth: 580 }}>
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
