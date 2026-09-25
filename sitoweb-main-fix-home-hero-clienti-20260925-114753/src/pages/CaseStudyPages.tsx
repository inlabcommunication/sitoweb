import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

// ──────────────────────────────────────────────────────────────
// Componenti helper riutilizzabili tra le pagine caso studio
// ──────────────────────────────────────────────────────────────

const CaseHeroBack: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <button
    onClick={onBack}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(255,255,255,0.05)',
      border: '.5px solid var(--b)', borderRadius: 100,
      color: 'var(--m)', fontSize: 10, letterSpacing: '.15em',
      textTransform: 'uppercase', padding: '8px 16px',
      cursor: 'pointer', fontFamily: 'inherit',
    }}
  >
    <ArrowLeft size={11} /> Casi studio
  </button>
);

const SectionTitle: React.FC<{ tag: string; title: React.ReactNode }> = ({ tag, title }) => (
  <div style={{ marginBottom: '2rem' }}>
    <p className="section-label">{tag}</p>
    <h2 style={{
      fontFamily: 'var(--fd)',
      fontSize: 'clamp(2rem, 4vw, 3.5rem)',
      lineHeight: 0.92,
      textTransform: 'uppercase',
    }}>{title}</h2>
  </div>
);

const Counter: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, to]);
  const formatted = to >= 1000
    ? (val / 1000).toFixed(val / 1000 < 10 ? 1 : 0) + 'k'
    : Math.round(val).toString();
  return <span ref={ref}>{formatted}{suffix}</span>;
};

// ──────────────────────────────────────────────────────────────
// Caso 1 — PARESTETA
// ──────────────────────────────────────────────────────────────

interface CasePageProps {
  onBack: () => void;
  onContact: () => void;
}

export const CaseParesteta: React.FC<CasePageProps> = ({ onBack, onContact }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const phases = [
    { n: '01', title: 'Prima — Il cambio insegna',     desc: 'Il rebranding da H28 a Paresteta richiedeva di non disperdere il pubblico esistente, ma di trasformarlo in attesa per qualcosa di nuovo.' },
    { n: '02', title: 'Curiosità — Teaser e offline',  desc: 'Comunicazione divisa in fasi: teaser visivi sui social e attività di comunicazione locale per generare attenzione prima dell\'apertura.' },
    { n: '03', title: 'Raccolta lead — QR code',       desc: 'QR code dedicati per intercettare contatti e costruire una base di pubblico interessata fin dal lancio.' },
    { n: '04', title: 'Lancio — Contenuti social e video', desc: 'Video lancio e contenuti progressivi per portare il pubblico digitale verso il momento fisico dell\'inaugurazione.' },
    { n: '05', title: 'Evento — Inaugurazione',         desc: 'Comunicazione integrata online e offline il giorno dell\'apertura: presenza in città e amplificazione digitale.' },
    { n: '06', title: 'Risultato — Attenzione e brand', desc: 'Curiosità, partecipazione fisica e percezione del brand cresciuti in modo coordinato.' },
  ];

  return (
    <>
      {/* HERO scenografico */}
      <section ref={heroRef} style={{
        minHeight: '90vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '8rem 2rem 4rem',
        overflow: 'hidden',
        borderBottom: '.5px solid var(--b)',
      }}>
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 30%, rgba(205,178,255,0.18) 0%, transparent 50%), linear-gradient(135deg, #1e1d1d 0%, #2a1f3d 100%)',
          y: heroY,
          opacity: heroOpacity,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <CaseHeroBack onBack={onBack} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-label"
            style={{ marginBottom: '1rem' }}
          >Caso 01 — Eventi · Branding · Lead generation</motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(3rem, 9vw, 9rem)',
              lineHeight: 0.85,
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
            }}
          >PARESTETA</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'var(--fs)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
              color: 'var(--a)',
              maxWidth: 720,
              lineHeight: 1.3,
              marginBottom: '1.5rem',
            }}
          >Dal rebranding all'inaugurazione.</motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              fontSize: 16,
              color: 'var(--m)',
              maxWidth: 640,
              lineHeight: 1.7,
            }}
          >
            Una strategia integrata online e offline per trasformare un cambio insegna in un evento locale.
          </motion.p>
        </div>
      </section>

      {/* OBIETTIVO + STRATEGIA */}
      <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem' }} className="grid-1-mob">
          <SectionTitle tag="Obiettivo" title={<>L'INSEGNA<br /><span className="stroke">DIVENTA EVENTO.</span></>} />
          <div>
            <p style={{ fontSize: 17, color: 'var(--t)', lineHeight: 1.85, marginBottom: '2rem' }}>
              Accompagnare il passaggio da H28 a Paresteta, generando attenzione prima dell'apertura e portando persone fisicamente in negozio nel giorno dell'inaugurazione.
            </p>
            <div style={{
              padding: '1.5rem',
              background: 'rgba(205,178,255,0.05)',
              border: '.5px solid rgba(205,178,255,0.2)',
              borderRadius: 18,
            }}>
              <p className="section-label" style={{ marginBottom: 8, color: 'var(--a)' }}>Strategia</p>
              <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.75 }}>
                Una campagna divisa in più fasi: teaser iniziale, QR code per la raccolta lead, contenuti social progressivi, video di lancio, attività offline e comunicazione locale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE NARRATIVA */}
      <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <SectionTitle tag="Il racconto" title={<>SEI FASI,<br /><span className="stroke">UNA STORIA.</span></>} />

          <div style={{ position: 'relative', paddingLeft: 30, marginTop: '3rem' }}>
            <div style={{
              position: 'absolute', left: 29, top: 0, bottom: 0, width: 1,
              background: 'linear-gradient(180deg, var(--a) 0%, rgba(205,178,255,0.1) 100%)',
            }} />
            {phases.map((ph, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'relative', paddingLeft: 50, paddingBottom: '2.5rem' }}
              >
                <div style={{
                  position: 'absolute', left: -1, top: 0,
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'var(--bg)',
                  border: '.5px solid rgba(205,178,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--fd)', fontSize: 18, color: 'var(--a)',
                }}>{ph.n}</div>

                <h3 style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  marginTop: 14,
                }}>{ph.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.75, maxWidth: 580 }}>{ph.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COSA ABBIAMO REALIZZATO */}
      <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <SectionTitle tag="Cosa abbiamo realizzato" title={<>OGNI ELEMENTO<br /><span className="stroke">DI UN LANCIO.</span></>} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
            marginTop: '2rem',
          }}>
            {[
              'Concept creativo del lancio',
              'Comunicazione social',
              'Contenuti teaser',
              'Video di lancio',
              'Strategia QR code',
              'Raccolta contatti',
              'Attività offline in città',
              'Supporto comunicazione inaugurazione',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                style={{
                  padding: '1.2rem 1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '.5px solid var(--b)',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'rgba(205,178,255,0.12)',
                  border: '.5px solid rgba(205,178,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--a)',
                }}>
                  <Check size={12} />
                </span>
                <span style={{ fontSize: 14, color: 'var(--t)' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RISULTATI con counter */}
      <section style={{ padding: '8rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 600, height: 600, transform: 'translate(-50%, -50%)',
          background: 'rgba(205,178,255,0.04)', borderRadius: '50%', filter: 'blur(120px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionTitle tag="Risultato" title={<>UN CAMBIO INSEGNA<br /><span style={{
            fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 400, color: 'var(--a)',
          }}>diventato esperienza.</span></>} />

          <p style={{ fontSize: 17, color: 'var(--t)', lineHeight: 1.85, maxWidth: 720, marginBottom: '3.5rem' }}>
            Una campagna capace di trasformare un semplice cambio insegna in un vero evento locale, aumentando curiosità, partecipazione e percezione del brand.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {[
              { num: 200, suffix: '+',  label: 'Contatti raccolti' },
              { num: 100000, suffix: '+', label: 'Visualizzazioni' },
              { num: null, custom: 'Crescita', label: 'Social del brand' },
              { num: null, custom: 'Evento', label: 'Locale trasformato in esperienza' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  padding: '2rem 1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '.5px solid var(--b)',
                  borderRadius: 18,
                }}
              >
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                  lineHeight: 1,
                  color: i === 0 || i === 1 ? 'var(--a)' : 'var(--t)',
                  marginBottom: 8,
                }}>
                  {s.num !== null ? <Counter to={s.num} suffix={s.suffix} /> : s.custom}
                </div>
                <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--m)', lineHeight: 1.4 }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>

          <p style={{
            marginTop: '2rem',
            fontSize: 11,
            color: 'rgba(255,255,255,0.2)',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            {/* TODO: metriche placeholder, da confermare prima della pubblicazione */}
            Metriche indicative — da confermare prima della pubblicazione.
          </p>
        </div>
      </section>

      <CTABottom onClick={onContact} />
    </>
  );
};

// ──────────────────────────────────────────────────────────────
// Caso 2 — IMH
// ──────────────────────────────────────────────────────────────

export const CaseImh: React.FC<CasePageProps> = ({ onBack, onContact }) => {
  const actions = [
    'Strategia contenuti',
    'Reel informativi',
    'Copy persuasivi',
    'Grafiche coordinate',
    'Comunicazione per campagne lead',
    'Landing page orientate alla conversione',
  ];

  return (
    <>
      <section style={{
        minHeight: '85vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '8rem 2rem 4rem',
        overflow: 'hidden',
        borderBottom: '.5px solid var(--b)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(135,206,250,0.12) 0%, transparent 50%), linear-gradient(135deg, #1e1d1d 0%, #1a2638 100%)',
        }} />
        {/* Linee energia animate */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }} aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <motion.line
              key={i}
              x1="0" y1={`${15 + i * 15}%`} x2="100%" y2={`${10 + i * 15}%`}
              stroke="#cdb2ff" strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 0.6, ease: 'linear' }}
            />
          ))}
        </svg>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}><CaseHeroBack onBack={onBack} /></div>
          <p className="section-label" style={{ marginBottom: '1rem' }}>Caso 02 — Contenuti · Campagne · Landing</p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(3rem, 9vw, 9rem)',
              lineHeight: 0.85,
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >IMH</motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'var(--fs)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
              color: 'var(--a)',
              maxWidth: 720,
              marginBottom: '1.5rem',
            }}
          >Comunicare fiducia nel settore energia.</motion.p>
          <p style={{ fontSize: 16, color: 'var(--m)', maxWidth: 640, lineHeight: 1.7 }}>
            Per IMH abbiamo lavorato su una comunicazione capace di rendere più semplice, chiaro e credibile un settore complesso come luce, gas, telefonia e fotovoltaico.
          </p>
        </div>
      </section>

      {/* Obiettivo */}
      <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem' }} className="grid-1-mob">
          <SectionTitle tag="Obiettivo" title={<>FIDUCIA<br /><span className="stroke">E RICHIESTE.</span></>} />
          <div>
            <p style={{ fontSize: 17, color: 'var(--t)', lineHeight: 1.85 }}>
              Generare fiducia, spiegare i servizi e aumentare le richieste di consulenza per un settore percepito spesso come opaco.
            </p>
          </div>
        </div>
      </section>

      {/* Azioni */}
      <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <SectionTitle tag="Cosa abbiamo realizzato" title={<>UN ECOSISTEMA<br /><span className="stroke">DI CONTENUTI.</span></>} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 12,
            marginTop: '2rem',
          }}>
            {actions.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                style={{
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '.5px solid var(--b)',
                  borderRadius: 16,
                }}
              >
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 24,
                  color: 'var(--a)',
                  marginBottom: 8,
                }}>{String(i + 1).padStart(2, '0')}</div>
                <p style={{ fontSize: 14, color: 'var(--t)' }}>{a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Risultati */}
      <section style={{ padding: '8rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <SectionTitle tag="Risultato" title={<>UN SETTORE TECNICO<br /><span style={{
            fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 400, color: 'var(--a)',
          }}>diventato comprensibile.</span></>} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginTop: '2rem',
          }}>
            {[
              { num: 50000, suffix: '+', label: 'Reach contenuti' },
              { num: 80, suffix: '+', label: 'Richieste qualificate' },
              { num: null, custom: '↑', label: 'Brand awareness territoriale' },
              { num: 4, suffix: '', label: 'Servizi comunicati' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  padding: '2rem 1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '.5px solid var(--b)',
                  borderRadius: 18,
                }}
              >
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  lineHeight: 1,
                  color: i < 2 ? 'var(--a)' : 'var(--t)',
                  marginBottom: 8,
                }}>
                  {s.num !== null ? <Counter to={s.num} suffix={s.suffix} /> : s.custom}
                </div>
                <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--m)' }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
          <p style={{
            marginTop: '2rem',
            fontSize: 11,
            color: 'rgba(255,255,255,0.2)',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            {/* TODO: metriche placeholder */}
            Metriche indicative — da confermare prima della pubblicazione.
          </p>
        </div>
      </section>

      <CTABottom onClick={onContact} />
    </>
  );
};

// ──────────────────────────────────────────────────────────────
// Caso 3 — STUDIO RICCIARDI
// ──────────────────────────────────────────────────────────────

export const CaseRicciardi: React.FC<CasePageProps> = ({ onBack, onContact }) => {
  const actions = [
    'Piano editoriale',
    'Contenuti social',
    'Caroselli informativi',
    'Gestione recensioni',
    'Copywriting',
    'Ottimizzazione comunicativa',
  ];

  return (
    <>
      <section style={{
        minHeight: '85vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '8rem 2rem 4rem',
        overflow: 'hidden',
        borderBottom: '.5px solid var(--b)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 70%, rgba(180,220,255,0.1) 0%, transparent 50%), linear-gradient(135deg, #1e1d1d 0%, #25282e 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}><CaseHeroBack onBack={onBack} /></div>
          <p className="section-label" style={{ marginBottom: '1rem' }}>Caso 03 — Social · Posizionamento</p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.5rem, 7vw, 7rem)',
              lineHeight: 0.85,
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >STUDIO DENTISTICO<br />RICCIARDI</motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'var(--fs)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
              color: 'var(--a)',
              maxWidth: 720,
              marginBottom: '1.5rem',
            }}
          >Autorevolezza e fiducia online.</motion.p>
          <p style={{ fontSize: 16, color: 'var(--m)', maxWidth: 640, lineHeight: 1.7 }}>
            Una comunicazione più chiara, professionale e rassicurante, costruita alternando contenuti educativi, recensioni e contenuti di posizionamento.
          </p>
        </div>
      </section>

      <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem' }} className="grid-1-mob">
          <SectionTitle tag="Obiettivo" title={<>AFFIDABILITÀ<br /><span className="stroke">PERCEPITA.</span></>} />
          <p style={{ fontSize: 17, color: 'var(--t)', lineHeight: 1.85 }}>
            Aumentare la percezione di affidabilità dello studio e migliorare la presenza digitale per costruire fiducia prima ancora del primo appuntamento.
          </p>
        </div>
      </section>

      <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <SectionTitle tag="Cosa abbiamo realizzato" title={<>COMUNICAZIONE<br /><span className="stroke">CHIARA E CURATA.</span></>} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 12,
            marginTop: '2rem',
          }}>
            {actions.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                style={{
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '.5px solid var(--b)',
                  borderRadius: 16,
                }}
              >
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 24,
                  color: 'var(--a)',
                  marginBottom: 8,
                }}>{String(i + 1).padStart(2, '0')}</div>
                <p style={{ fontSize: 14, color: 'var(--t)' }}>{a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '8rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <SectionTitle tag="Risultato" title={<>UNO STUDIO<br /><span style={{
            fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 400, color: 'var(--a)',
          }}>che ispira fiducia.</span></>} />
          <p style={{ fontSize: 17, color: 'var(--t)', lineHeight: 1.85, marginBottom: '3rem', maxWidth: 720 }}>
            Una presenza digitale più professionale, contenuti che aiutano a scegliere e una percezione del brand più solida nel territorio.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}>
            {[
              { num: 30000, suffix: '+', label: 'Persone raggiunte' },
              { num: null, custom: '★ 4.9', label: 'Reputazione online' },
              { num: null, custom: '↑', label: 'Engagement contenuti' },
              { num: null, custom: 'Più', label: 'Richieste appuntamento' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{
                  padding: '2rem 1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '.5px solid var(--b)',
                  borderRadius: 18,
                }}
              >
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  lineHeight: 1,
                  color: i === 0 || i === 1 ? 'var(--a)' : 'var(--t)',
                  marginBottom: 8,
                }}>
                  {s.num !== null ? <Counter to={s.num} suffix={s.suffix} /> : s.custom}
                </div>
                <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--m)' }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
          <p style={{
            marginTop: '2rem',
            fontSize: 11,
            color: 'rgba(255,255,255,0.2)',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            {/* TODO: metriche placeholder */}
            Metriche indicative — da confermare prima della pubblicazione.
          </p>
        </div>
      </section>

      <CTABottom onClick={onContact} />
    </>
  );
};

// ──────────────────────────────────────────────────────────────
// CTA in fondo a ogni caso studio
// ──────────────────────────────────────────────────────────────

const CTABottom: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <section style={{ padding: '7rem 2rem' }}>
    <div style={{ maxWidth: 1120, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, rgba(205,178,255,0.08), rgba(255,255,255,0.02))',
          border: '.5px solid rgba(205,178,255,0.2)',
          borderRadius: 32,
          padding: 'clamp(2.5rem, 5vw, 4rem)',
          textAlign: 'center',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          lineHeight: 0.95,
          marginBottom: '1.5rem',
        }}>
          IL TUO PROGETTO<br /><span className="stroke">È IL PROSSIMO.</span>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--m)', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
          Raccontaci cosa vuoi ottenere. Costruiamo insieme la strategia giusta.
        </p>
        <button
          className="btn btn-p"
          onClick={onClick}
          style={{ fontSize: 13, padding: '16px 36px' }}
        >
          Iniziamo insieme <ArrowRight size={15} />
        </button>
      </motion.div>
    </div>
  </section>
);
