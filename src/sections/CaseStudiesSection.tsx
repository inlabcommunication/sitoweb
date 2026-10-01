import React from 'react';
import { linkClick } from '../lib/router';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '../lib/content';
import { DEFAULT_CASES, type CaseStudy } from '../data/caseStudies';

// I casi studio arrivano dalla dashboard (content.cases.items); i valori
// predefiniti sono in src/data/caseStudies.ts.
const useCases = (): CaseStudy[] => ((useContent() as any).cases?.items || DEFAULT_CASES) as CaseStudy[];

interface CaseStudiesSectionProps {
  onCaseClick: (id: string) => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({ onCaseClick }) => {
  const cases = useCases();
  if (!cases.length) return null;
  return (
    <section style={{ padding: '8rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: '4rem', maxWidth: 720 }}
        >
          <p className="section-label">Casi studio</p>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
            lineHeight: 0.9,
            marginBottom: '1.2rem',
          }}>
            NON SOLO<br />
            <span className="stroke">CONTENUTI.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.7 }}>
            Progetti costruiti con strategia, direzione creativa e obiettivi concreti.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cases.map((cs, i) => {
            const isReverse = i % 2 === 1;
            return (
              <motion.a
                href={"/casi-studio/" + cs.id}
                key={cs.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.005 }}
                onClick={linkClick(() => onCaseClick(cs.id))}
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, rgba(205,178,255,0.06), rgba(255,255,255,0.02))',
                  border: '.5px solid var(--b)',
                  borderRadius: 28,
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'border-color .3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(205,178,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--b)';
                }}
              >
                {/* Numerone di sfondo */}
                <div style={{
                  position: 'absolute',
                  [isReverse ? 'left' : 'right']: '2rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(10rem, 22vw, 22rem)',
                  lineHeight: 0.85,
                  color: 'rgba(205,178,255,0.05)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  letterSpacing: '-0.04em',
                }}>
                  {cs.number || String(i + 1).padStart(2, '0')}
                </div>

                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '3rem',
                  alignItems: 'center',
                  direction: isReverse ? 'rtl' : 'ltr',
                }} className="grid-1-mob">
                  <div style={{ direction: 'ltr' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: '1.5rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--fd)',
                        fontSize: 14,
                        color: 'var(--a)',
                        letterSpacing: '.1em',
                      }}>CASO {cs.number || String(i + 1).padStart(2, '0')}</span>
                      <span style={{
                        height: 1,
                        flex: 1,
                        background: 'var(--b)',
                      }} />
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--fd)',
                      fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                      lineHeight: 0.95,
                      textTransform: 'uppercase',
                      marginBottom: '0.8rem',
                    }}>
                      {cs.client}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--fs)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
                      color: 'var(--a)',
                      marginBottom: '1rem',
                      lineHeight: 1.3,
                    }}>
                      {cs.title}
                    </p>
                    <p style={{
                      fontSize: 12,
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      color: 'var(--m)',
                    }}>
                      {cs.category}
                    </p>
                  </div>

                  <div style={{ direction: 'ltr' }}>
                    {cs.problem && (<div style={{ marginBottom: '1.5rem' }}>
                      <p style={{
                        fontSize: 9,
                        letterSpacing: '.2em',
                        textTransform: 'uppercase',
                        color: 'var(--a)',
                        marginBottom: 8,
                      }}>Il problema</p>
                      <p style={{ fontSize: 14, color: 'var(--t)', lineHeight: 1.7, fontWeight: 300 }}>
                        {cs.problem}
                      </p>
                    </div>)}
                    {cs.result && (<div style={{ marginBottom: '1.8rem' }}>
                      <p style={{
                        fontSize: 9,
                        letterSpacing: '.2em',
                        textTransform: 'uppercase',
                        color: 'var(--a)',
                        marginBottom: 8,
                      }}>Il risultato</p>
                      <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.7 }}>
                        {cs.result}
                      </p>
                    </div>)}
                    <span style={{
                      fontSize: 12,
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: 'var(--a)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      Leggi il caso studio <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
