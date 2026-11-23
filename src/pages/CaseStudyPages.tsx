import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { BrowserMockup } from '../components/BrowserMockup';
import { ReelsGrid, Gallery, hasReel } from '../components/ReelCard';
import type { CaseBlock, CaseStudy } from '../data/caseStudies';
import { workAlt } from '../lib/altText';
import { cld } from '../lib/media';
import { getAttribution } from '../lib/attribution';
import { gaEvent } from '../lib/ga';

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
      color: 'var(--m)', fontSize: 12, letterSpacing: '.15em',
      textTransform: 'uppercase', padding: '8px 16px',
      cursor: 'pointer', fontFamily: 'inherit',
    }}
  >
    <ArrowLeft size={11} /> Clienti
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
  // valore finale nell'HTML statico; da 0 solo nel browser, se non ancora visibile (vedi StatsAndCTA)
  const [val, setVal] = React.useState(to);
  const fromZero = useRef(false);
  React.useLayoutEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce || el.getBoundingClientRect().top < window.innerHeight) return;
    fromZero.current = true;
    setVal(0);
  }, []);
  React.useEffect(() => {
    if (!inView || !fromZero.current) return;
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
// Pagina caso studio a blocchi: mostra solo i blocchi compilati
// ──────────────────────────────────────────────────────────────

const Title: React.FC<{ b: { tag?: string; title?: string; titleAccent?: string }; italic?: boolean }> = ({ b, italic }) =>
  (b.tag || b.title || b.titleAccent) ? (
    <SectionTitle tag={b.tag || ''} title={<>{b.title}{b.title && b.titleAccent && <br />}{b.titleAccent && (italic
      ? <span style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 400, color: 'var(--a)', textTransform: 'none' }}>{b.titleAccent}</span>
      : <span className="stroke">{b.titleAccent}</span>)}</>} />
  ) : null;

const Lead: React.FC<{ text?: string; mb?: string }> = ({ text, mb = '2.5rem' }) =>
  text ? <p style={{ fontSize: 17, color: 'var(--t)', lineHeight: 1.85, maxWidth: 760, marginBottom: mb, whiteSpace: 'pre-line' }}>{text}</p> : null;

const Section: React.FC<{ children: React.ReactNode; glow?: boolean }> = ({ children, glow }) => (
  <section style={{ padding: '7rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative', overflow: 'hidden' }}>
    {glow && <div style={{ position: 'absolute', top: '50%', left: '50%', width: 600, height: 600, transform: 'translate(-50%, -50%)', background: 'radial-gradient(closest-side, rgba(205,178,255,0.04) 0%, rgba(205,178,255,0.02) 45%, rgba(205,178,255,0) 100%)', borderRadius: '50%', pointerEvents: 'none' }} />}
    <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>{children}</div>
  </section>
);

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' }, transition: { duration: 0.5, delay: Math.min(i, 8) * 0.05 },
});

const StatValue: React.FC<{ value: string }> = ({ value }) => {
  const m = value.trim().match(/^(\d{1,9})(\+?)$/);
  return m ? <Counter to={Number(m[1])} suffix={m[2]} /> : <>{value}</>;
};

const safeUrl = (u?: string) => (u && /^https:\/\//i.test(u.trim()) ? u.trim() : '');

/** Slide della presentazione: scorrimento orizzontale (dito, rotellina, frecce e tastiera), nessun iframe.
 *  Prima slide caricata subito, le altre in lazy loading. */
const Slides: React.FC<{ slides: { image: string; alt?: string; caption?: string }[]; name: string }> = ({ slides, name }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = React.useState(0);
  const go = (d: number) => {
    const el = ref.current; if (!el) return;
    const i = Math.max(0, Math.min(slides.length - 1, at + d));
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };
  const onScroll = () => { const el = ref.current; if (el && el.clientWidth) setAt(Math.round(el.scrollLeft / el.clientWidth)); };
  const btn: React.CSSProperties = { width: 40, height: 40, borderRadius: '50%', border: '.5px solid var(--b)', background: 'rgba(255,255,255,0.05)', color: 'var(--t)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div>
      <div ref={ref} onScroll={onScroll} tabIndex={0} role="region" aria-roledescription="carosello" aria-label={`Slide della presentazione per ${name}`}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } }}
        style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', borderRadius: 18, border: '.5px solid var(--b)', background: '#0b0b0b' }}>
        {slides.map((s, i) => (
          <figure key={i} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', margin: 0 }} aria-label={`Slide ${i + 1} di ${slides.length}`}>
            <img src={cld(s.image, 1600)} srcSet={[800, 1200, 1600].map((w) => `${cld(s.image, w)} ${w}w`).join(', ')} sizes="(max-width: 1280px) 100vw, 1216px"
              alt={s.alt || `Slide ${i + 1} della presentazione per ${name}`} width={1600} height={900}
              loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
              style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'contain', display: 'block' }} />
            {s.caption && <figcaption style={{ padding: '.7rem 1rem', fontSize: 12, letterSpacing: '.08em', color: 'var(--m)', borderTop: '.5px solid var(--b)' }}>{s.caption}</figcaption>}
          </figure>
        ))}
      </div>
      {slides.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <span style={{ fontSize: 12, letterSpacing: '.15em', color: 'var(--m)' }} aria-live="polite">{at + 1} / {slides.length}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={{ ...btn, opacity: at === 0 ? 0.35 : 1 }} disabled={at === 0} onClick={() => go(-1)} aria-label="Slide precedente"><ArrowLeft size={16} /></button>
            <button type="button" style={{ ...btn, opacity: at === slides.length - 1 ? 0.35 : 1 }} disabled={at === slides.length - 1} onClick={() => go(1)} aria-label="Slide successiva"><ArrowRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

/** Download della presentazione: prima i dati (nome, email, azienda facoltativa, informativa), poi il file.
 *  Il lead lo salva /api/lead con le stesse protezioni del modulo contatti (token firmato, campo trappola, limiti). */
const DownloadForm: React.FC<{ caseId: string; cta: string }> = ({ caseId, cta }) => {
  const [open, setOpen] = React.useState(false);
  const [f, setF] = React.useState({ nome: '', email: '', azienda: '', privacy: false });
  const [hp, setHp] = React.useState('');
  const [state, setState] = React.useState<{ sending?: boolean; error?: string; done?: boolean; url?: string }>({});
  const token = useRef('');
  const getToken = async () => {
    if (token.current) return token.current;
    try { const r = await fetch('/api/lead'); token.current = String((await r.json()).token || ''); } catch { /* riprova all'invio */ }
    return token.current;
  };
  const openForm = () => { setOpen(true); getToken(); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.nome.trim() || !f.email.trim()) return setState({ error: 'Inserisci nome ed email.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setState({ error: 'Inserisci un indirizzo email valido.' });
    if (!f.privacy) return setState({ error: "Per scaricare accetta l'informativa privacy." });
    setState({ sending: true });
    try {
      const had = !!token.current;
      const t = await getToken();
      if (!had) await new Promise((r) => setTimeout(r, 3200)); // tempo minimo richiesto dal server
      const r = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.nome, email: f.email, company: f.azienda, privacy: f.privacy, download: { caseId },
          website: hp, formToken: t, page: window.location.pathname, attribution: getAttribution() }),
      });
      if (r.status === 429) return setState({ error: "Hai fatto troppe richieste. Riprova tra un'ora o scrivici a inlab.communication@gmail.com" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json().catch(() => ({}));
      setState({ done: true, url: safeUrl(d?.url) });
      // GA4: evento a parte, non generate_lead, per non contare i download come richieste (Direttore 23/11)
      gaEvent('download_presentazione', { caso: caseId });
    } catch {
      setState({ error: 'Invio non riuscito. Riprova tra qualche istante o scrivici a inlab.communication@gmail.com' });
    }
  };
  const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '.5px solid var(--b)', borderRadius: 12, padding: '12px 16px', color: 'var(--t)', fontSize: 16, fontFamily: 'var(--fb)' };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 500, letterSpacing: '.13em', textTransform: 'uppercase', color: 'var(--m)', display: 'block', marginBottom: 6 };
  if (!open) return <button type="button" className="btn btn-p" onClick={openForm} style={{ marginTop: '2rem' }}>{cta} <ArrowRight size={14} /></button>;
  if (state.done) return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', border: '.5px solid rgba(205,178,255,0.25)', borderRadius: 18, background: 'rgba(205,178,255,0.05)' }}>
      {state.url ? <>
        <p style={{ fontSize: 15, color: 'var(--t)', marginBottom: '1rem' }}>Grazie! Il download è pronto: il link vale per 10 minuti.</p>
        <a className="btn btn-p" href={state.url} rel="noopener nofollow">Scarica ora <ArrowRight size={14} /></a>
      </> : <p style={{ fontSize: 15, color: 'var(--t)' }}>Grazie! Il download non è disponibile in questo momento: ti scriviamo noi all'indirizzo che hai lasciato.</p>}
    </div>
  );
  return (
    <form onSubmit={submit} noValidate style={{ marginTop: '2rem', maxWidth: 560, display: 'grid', gap: '1rem', padding: '1.5rem', border: '.5px solid var(--b)', borderRadius: 18, position: 'relative' }}>
      <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.6 }}>Lasciaci i tuoi dati e scarica la presentazione.</p>
      <div><label htmlFor="dl-nome" style={label}>Nome *</label><input id="dl-nome" style={input} autoComplete="name" required aria-required="true" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></div>
      <div><label htmlFor="dl-email" style={label}>Email *</label><input id="dl-email" type="email" style={input} autoComplete="email" required aria-required="true" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div><label htmlFor="dl-azienda" style={label}>Azienda o attività</label><input id="dl-azienda" style={input} autoComplete="organization" value={f.azienda} onChange={(e) => setF({ ...f, azienda: e.target.value })} /></div>
      {/* campo trappola anti-bot, invisibile alle persone (come nel modulo contatti) */}
      <input type="text" name="inlab_hp_field" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <input type="checkbox" id="dl-privacy" checked={f.privacy} onChange={(e) => setF({ ...f, privacy: e.target.checked })} style={{ marginTop: 3, accentColor: 'var(--a)', width: 14, height: 14, flexShrink: 0 }} />
        <label htmlFor="dl-privacy" style={{ fontSize: 12, color: 'var(--m)', lineHeight: 1.6, cursor: 'pointer' }}>
          Ho letto e accetto la <a href="/privacy" target="_blank" rel="noopener" style={{ color: 'var(--a)', textDecoration: 'underline' }}>privacy policy</a>. I dati servono per darti il documento e per ricontattarti in merito. *
        </label>
      </div>
      {state.error && <p role="alert" style={{ fontSize: 13, color: '#ff8888' }}>{state.error}</p>}
      <button type="submit" className="btn btn-p" disabled={state.sending} style={{ justifySelf: 'start', opacity: state.sending ? 0.6 : 1 }}>{state.sending ? 'Invio…' : 'Invia e scarica'} <ArrowRight size={14} /></button>
    </form>
  );
};

const Block: React.FC<{ b: CaseBlock; name: string; photoAlt: string; caseId: string }> = ({ b, name, photoAlt, caseId }) => {
  switch (b.type) {
    case 'text':
      if (!b.body && !b.boxBody) return null;
      return (
        <Section>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem' }} className="grid-1-mob">
            <Title b={b} />
            <div>
              {b.body && <p style={{ fontSize: 17, color: 'var(--t)', lineHeight: 1.85, marginBottom: b.boxBody ? '2rem' : 0, whiteSpace: 'pre-line' }}>{b.body}</p>}
              {b.boxBody && (
                <div style={{ padding: '1.5rem', background: 'rgba(205,178,255,0.05)', border: '.5px solid rgba(205,178,255,0.2)', borderRadius: 18 }}>
                  {b.boxTitle && <p className="section-label" style={{ marginBottom: 8, color: 'var(--a)' }}>{b.boxTitle}</p>}
                  <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{b.boxBody}</p>
                </div>
              )}
            </div>
          </div>
        </Section>
      );

    case 'timeline': {
      const items = (b.items || []).filter((x) => x.title);
      if (!items.length) return null;
      return (
        <Section>
          <Title b={b} />
          <div style={{ position: 'relative', marginTop: '3rem' }}>
            {/* linea al centro dei cerchi (60px), testo dopo i cerchi: niente sovrapposizioni */}
            <div style={{ position: 'absolute', left: 30, top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, var(--a) 0%, rgba(205,178,255,0.1) 100%)' }} />
            {items.map((ph, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'relative', paddingLeft: 80, paddingBottom: '2.5rem' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: 60, height: 60, borderRadius: '50%', background: 'var(--bg)', border: '.5px solid rgba(205,178,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fd)', fontSize: 18, color: 'var(--a)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.4rem, 2.2vw, 2rem)', lineHeight: 1, textTransform: 'uppercase', marginBottom: 10, marginTop: 14 }}>{ph.title}</h3>
                {ph.desc && <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.75, maxWidth: 580 }}>{ph.desc}</p>}
              </motion.div>
            ))}
          </div>
        </Section>
      );
    }

    case 'checklist': {
      const items = (b.items || []).filter(Boolean);
      if (!items.length) return null;
      return (
        <Section>
          <Title b={b} />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${b.numbered ? 260 : 240}px, 1fr))`, gap: 12, marginTop: '2rem' }}>
            {items.map((item, i) => b.numbered ? (
              <motion.div key={i} {...fadeUp(i)} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '.5px solid var(--b)', borderRadius: 16 }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 24, color: 'var(--a)', marginBottom: 8 }}>{String(i + 1).padStart(2, '0')}</div>
                <p style={{ fontSize: 14, color: 'var(--t)' }}>{item}</p>
              </motion.div>
            ) : (
              <motion.div key={i} {...fadeUp(i)} style={{ padding: '1.2rem 1.5rem', background: 'rgba(255,255,255,0.02)', border: '.5px solid var(--b)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(205,178,255,0.12)', border: '.5px solid rgba(205,178,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--a)' }}><Check size={12} /></span>
                <span style={{ fontSize: 14, color: 'var(--t)' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </Section>
      );
    }

    case 'steps': {
      const items = (b.items || []).filter((x) => x.title);
      if (!items.length) return null;
      const hi = Math.min(2, items.length - 1);
      return (
        <Section>
          <Title b={b} />
          <Lead text={b.body} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
            {items.map((f, i) => (
              <motion.div key={i} {...fadeUp(i)} style={{ padding: '1.6rem', background: i === hi ? 'rgba(205,178,255,0.08)' : 'rgba(255,255,255,0.02)', border: i === hi ? '.5px solid rgba(205,178,255,0.3)' : '.5px solid var(--b)', borderRadius: 16 }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 24, color: 'var(--a)', marginBottom: 6 }}>{String(i + 1).padStart(2, '0')}</div>
                <p style={{ fontFamily: 'var(--fd)', fontSize: 22, letterSpacing: '.03em', marginBottom: 8 }}>{f.title}</p>
                {f.desc && <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.7 }}>{f.desc}</p>}
              </motion.div>
            ))}
          </div>
        </Section>
      );
    }

    case 'website': {
      const url = safeUrl(b.url);
      if (!url) return null;
      const pages = (b.pages || []).filter((p) => safeUrl(p.url) && p.label);
      return (
        <Section>
          <Title b={b} />
          <Lead text={b.body} mb="3rem" />
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}>
            <BrowserMockup url={url} label={`il sito ${url.replace(/^https?:\/\//, '').replace(/\/$/, '')}`} image={safeUrl(b.image)} />
          </motion.div>
          {pages.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 24 }}>
              {pages.map((pg, i) => (
                <motion.div key={i} {...fadeUp(i)}>
                  <BrowserMockup url={pg.url} label={pg.label} w={1280} h={900} />
                  <p style={{ fontFamily: 'var(--fd)', fontSize: 20, letterSpacing: '.03em', margin: '1rem 0 .4rem' }}>{pg.label}</p>
                  {pg.text && <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.7 }}>{pg.text}</p>}
                </motion.div>
              ))}
            </div>
          )}
          <div style={{ marginTop: '2rem' }}>
            <a className="btn btn-g" href={url} target="_blank" rel="noopener noreferrer">{b.cta?.trim() || 'Visita il sito'} <ArrowUpRight size={13} /></a>
          </div>
        </Section>
      );
    }

    case 'stats': {
      const items = (b.items || []).filter((x) => x.value || x.label);
      if (!items.length && !b.body) return null;
      return (
        <Section glow>
          <Title b={b} italic />
          <Lead text={b.body} mb="3.5rem" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
            {items.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{ padding: '2rem 1.5rem', background: 'rgba(255,255,255,0.02)', border: '.5px solid var(--b)', borderRadius: 18 }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1, color: i < 2 ? 'var(--a)' : 'var(--t)', marginBottom: 8 }}>
                  <StatValue value={s.value} />
                </div>
                <p style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--m)', lineHeight: 1.4 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
          {b.note && <p style={{ marginTop: '2rem', fontSize: 12, color: 'var(--m)', fontStyle: 'italic', textAlign: 'center' }}>{b.note}</p>}
        </Section>
      );
    }

    case 'reels': {
      const items = (b.items || []).filter((r) => hasReel(r));
      if (!items.length) return null;
      return (
        <Section>
          <Title b={b} />
          <div style={{ marginTop: '2rem' }}><ReelsGrid reels={items} /></div>
        </Section>
      );
    }

    case 'gallery': {
      const images = (b.images || []).filter((u) => safeUrl(u));
      if (!images.length) return null;
      return (
        <Section>
          <Title b={b} />
          <div style={{ marginTop: '2rem' }}><Gallery images={images} alt={photoAlt} /></div>
        </Section>
      );
    }

    case 'quote':
      if (!b.text) return null;
      return (
        <Section>
          <motion.blockquote {...fadeUp()} style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', lineHeight: 1.35, color: 'var(--t)' }}>“{b.text}”</p>
            {b.author && <footer style={{ marginTop: '1.5rem', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--a)' }}>— {b.author}</footer>}
          </motion.blockquote>
        </Section>
      );

    case 'presentation': {
      const slides = (b.slides || []).filter((s) => safeUrl(s?.image));
      if (b.published !== true || !slides.length) return null;
      return (
        <Section>
          <Title b={b} />
          {b.body && <p style={{ fontSize: 17, color: 'var(--m)', lineHeight: 1.85, maxWidth: 760, margin: '1.5rem 0 0', whiteSpace: 'pre-line' }}>{b.body}</p>}
          <div style={{ marginTop: '2rem' }}><Slides slides={slides} name={name} /></div>
          {b.file?.publicId && <DownloadForm caseId={caseId} cta={b.cta?.trim() || 'Scarica la presentazione'} />}
        </Section>
      );
    }
  }
  return null;
};

interface CasePageProps {
  cs: CaseStudy;
  onBack: () => void;
  onContact: () => void;
  onClient?: (id: string) => void;
}

export const CasePage: React.FC<CasePageProps> = ({ cs, onBack, onContact, onClient }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const hero = cs.hero || {};
  const heroImage = safeUrl(hero.image || cs.cover);
  const cta = safeUrl(hero.ctaUrl);

  return (
    <>
      <section ref={heroRef} style={{ minHeight: '88vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '8rem 2rem 4rem', overflow: 'hidden', borderBottom: '.5px solid var(--b)' }}>
        <motion.div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 30%, rgba(205,178,255,0.18) 0%, transparent 50%), linear-gradient(135deg, #1e1d1d 0%, #2a1f3d 100%)', y: heroY, opacity: heroOpacity }} />
        {heroImage && (
          <>
            <motion.img src={heroImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, y: heroY }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,29,29,1) 0%, rgba(30,29,29,.6) 50%, rgba(30,29,29,.25) 100%)' }} />
          </>
        )}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}><CaseHeroBack onBack={onBack} /></div>
          <motion.p initial={false} className="section-label" style={{ marginBottom: '1rem' }}>
            {hero.label || [`Caso ${cs.number || ''}`.trim(), cs.category].filter(Boolean).join(' — ')}
          </motion.p>
          {/* H1 = nome + sottotitolo (stesso aspetto di prima: due righe con stili diversi), così
              è diverso dall'H1 della scheda cliente (analisi SEO 08/11, R6). I testi restano quelli
              della dashboard. */}
          <h1 style={{ margin: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--fd)', fontSize: (hero.title || cs.client).length > 18 ? 'clamp(2.5rem, 7vw, 7rem)' : 'clamp(3rem, 9vw, 9rem)', lineHeight: 0.85, textTransform: 'uppercase', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              {hero.title || cs.client}
            </span>
            {(hero.subtitle || cs.title) && <>
              <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>: </span>
              <span style={{ display: 'block', fontFamily: 'var(--fs)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', color: 'var(--a)', maxWidth: 720, lineHeight: 1.3, marginBottom: '1.5rem' }}>
                {hero.subtitle || cs.title}
              </span>
            </>}
          </h1>
          {hero.intro && <motion.p initial={false} style={{ fontSize: 16, color: 'var(--m)', maxWidth: 640, lineHeight: 1.7, marginBottom: '2rem' }}>{hero.intro}</motion.p>}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {cta && <a className="btn btn-p" href={cta} target="_blank" rel="noopener noreferrer">{hero.ctaLabel || 'Visita il sito'} <ArrowUpRight size={14} /></a>}
            {cs.clientId && onClient && <a className="btn btn-g" href={`/cliente/${cs.clientId}`} onClick={(e) => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); onClient(cs.clientId!); }}>Scheda cliente <ArrowRight size={13} /></a>}
          </div>
        </div>
      </section>

      {(cs.blocks || []).map((b, i) => <Block key={i} b={b} name={cs.client} caseId={cs.id} photoAlt={workAlt({ name: cs.client, location: cs.locations?.[0] })} />)}

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
