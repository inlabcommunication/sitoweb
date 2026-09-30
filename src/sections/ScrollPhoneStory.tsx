import React, { useEffect, useRef, useState } from 'react';
import {
  motion, useMotionValueEvent, useScroll, useSpring, useTransform,
  useReducedMotion as useFmReducedMotion, type MotionValue,
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useAgencyStats } from '../data/stats';
import { linkClick, navigate } from '../lib/router';
import { cldVideo } from '../lib/media';

/* ════════════════════════════════════════════════════════════════
   SCROLL STORY — subito dopo la hero.
   Una scena pinnata (sticky) e un solo valore di progresso 0 → 1:
     0.00–0.12  il telefono sale dal basso, il titolo è pieno
     0.12–0.20  il titolo arretra e sfuma dietro il telefono
     0.20–0.38  stato 1 · Social  (telefono a destra, testo a sinistra)
     0.38–0.48  transito con inclinazione
     0.48–0.66  stato 2 · Video   (telefono a sinistra, testo a destra)
     0.66–0.76  transito con inclinazione
     0.76–1.00  stato 3 · Web     (telefono a destra, testo a sinistra)
   Tutti gli intervalli coprono 0 → 1 per evitare che un elemento
   ricompaia dopo la fine della sua animazione.
═══════════════════════════════════════════════════════════════ */

// versione ridotta da Cloudinary (l'originale pesa 46 MB); si scarica solo quando il reel parte
const REEL_VIDEO = cldVideo('https://res.cloudinary.com/dp2l14rly/video/upload/v1779320623/0521_m03plf.mp4', 720);

const FEED = [
  'idee-reel-ristoranti', 'servizio-fotografico-ristoranti', 'reel-o-post-cosa-pubblicare-instagram',
  'sponsorizzate-instagram-attivita-locali', 'rebranding-attivita-commerciale', 'quante-volte-pubblicare-social',
  'gestione-social-attivita-locale-cosa-include', 'meta-ads-creativita-advantage', 'whatsapp-business-ai',
].map((slug) => `/blog/${slug}/cover.jpg`);

type Story = {
  key: string; num: string; label: string; title: string; accent: string;
  body: string; href: string; cta: string; side: 'left' | 'right';
  range: number[]; opacity: number[];
};

const STORIES: Story[] = [
  {
    key: 'social', num: '01', label: 'Gestione social', title: 'Social che', accent: 'lavorano per te.',
    body: 'Strategia, piano editoriale, contenuti e community su Instagram, Facebook, TikTok e LinkedIn.',
    href: '/gestione-social', cta: 'Gestione social', side: 'left',
    range: [0, 0.15, 0.21, 0.36, 0.41, 1], opacity: [0, 0, 1, 1, 0, 0],
  },
  {
    key: 'video', num: '02', label: 'Video e reel', title: 'Reel che', accent: 'fermano lo scroll.',
    body: 'Idea, riprese, montaggio e caption. Video verticali che le persone guardano fino alla fine.',
    href: '/video', cta: 'Video e reel', side: 'right',
    range: [0, 0.44, 0.5, 0.64, 0.69, 1], opacity: [0, 0, 1, 1, 0, 0],
  },
  {
    key: 'web', num: '03', label: 'Siti web', title: 'Siti che', accent: 'portano clienti.',
    body: 'Siti veloci e landing page ottimizzate per Google, pensate per trasformare le visite in richieste.',
    href: '/siti-web', cta: 'Siti web', side: 'left',
    range: [0, 0.72, 0.78, 1, 1, 1], opacity: [0, 0, 1, 1, 1, 1],
  },
];

const useIsMobile = (query = '(max-width: 900px)') => {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const up = () => setM(mq.matches);
    up();
    mq.addEventListener?.('change', up);
    return () => mq.removeEventListener?.('change', up);
  }, [query]);
  return m;
};

/* ─── Schermate del telefono ─────────────────────────────────── */

const ScreenSocial: React.FC<{ stats: { display: string; short: string }[] }> = ({ stats }) => (
  <div className="sps-screen sps-social">
    <div className="sps-ig-head">
      <span className="sps-ig-avatar"><span>IL</span></span>
      <div className="sps-ig-stats">
        {stats.slice(0, 2).map((s) => (
          <div key={s.short}><b>{s.display}</b><span>{s.short}</span></div>
        ))}
      </div>
    </div>
    <div className="sps-ig-name">inlab.communication</div>
    <div className="sps-ig-bio">Agenzia di comunicazione · Castellaneta (TA)</div>
    <div className="sps-ig-grid">
      {FEED.map((src) => <div key={src} style={{ backgroundImage: `url(${src})` }} />)}
    </div>
  </div>
);

const ScreenVideo: React.FC<{ videoRef: React.RefObject<HTMLVideoElement | null>; views: string }> = ({ videoRef, views }) => (
  <div className="sps-screen sps-video">
    <video ref={videoRef} src={REEL_VIDEO} muted loop playsInline preload="none" aria-hidden="true" />
    <div className="sps-video-shade" />
    <div className="sps-video-top"><span>Reels</span><span className="sps-live">● In riproduzione</span></div>
    <div className="sps-video-bottom">
      <div className="sps-video-user"><span className="sps-ig-avatar sm"><span>IL</span></span>inlab.communication</div>
      <p>Dietro le quinte di uno shooting ✦</p>
      {views && <div className="sps-video-views"><b>{views}</b> visualizzazioni</div>}
    </div>
  </div>
);

const ScreenWeb: React.FC = () => (
  <div className="sps-screen sps-web">
    <div className="sps-web-bar"><span className="sps-web-lock">🔒</span>luminaricciardi.it</div>
    <div className="sps-web-hero">
      <span className="sps-web-kicker">Studio dentistico · Palagiano</span>
      <div className="sps-web-title">Lumina</div>
      <div className="sps-web-sub">Il sorriso che meriti, con un percorso chiaro dalla prima visita.</div>
      <span className="sps-web-btn">Prenota una visita</span>
    </div>
    <div className="sps-web-cards">
      {['Trattamenti', 'Lo studio', 'Contatti'].map((t) => <div key={t}><i />{t}</div>)}
    </div>
    <div className="sps-web-google">
      <span className="sps-g">G</span>
      <div><b>Trovato su Google</b><span>Scheda e sito collegati</span></div>
    </div>
  </div>
);

/* ─── Testo di ogni stato (hook dentro un componente, mai in un map) ─ */

const StoryCopy: React.FC<{ s: Story; p: MotionValue<number>; mobile: boolean }> = ({ s, p, mobile }) => {
  const opacity = useTransform<number, number>(p, s.range, s.opacity);
  // sul telefono spostamento minimo: il testo cambia in dissolvenza, senza "saltare"
  const d = mobile ? 12 : 48;
  const y = useTransform(p, s.range, [d, d, 0, 0, -d, -d]);
  const pe = useTransform(opacity, (o: number) => (o > 0.5 ? 'auto' : 'none'));
  return (
    <motion.div
      className={`sps-copy ${mobile ? 'is-mobile' : `is-${s.side}`}`}
      style={{ opacity, y, pointerEvents: pe as any }}
    >
      <p className="sps-copy-label"><span>{s.num}</span>{s.label}</p>
      <h3 className="sps-copy-title">{s.title}<br /><em>{s.accent}</em></h3>
      <p className="sps-copy-body">{s.body}</p>
      <a className="sps-copy-link" href={s.href} onClick={linkClick(() => navigate(s.href))}>
        {s.cta} <ArrowUpRight size={14} />
      </a>
    </motion.div>
  );
};

const ProgressSeg: React.FC<{ p: MotionValue<number>; from: number; to: number }> = ({ p, from, to }) => {
  const scaleX = useTransform(p, [0, from, to, 1], [0, 0, 1, 1]);
  return <span className="sps-seg"><motion.i style={{ scaleX }} /></span>;
};

/* ─── Versione statica (riduci movimento) ─────────────────────── */

const StaticStory: React.FC = () => (
  <section className="sps-static">
    <div className="sps-static-inner">
      <p className="section-label">Cosa facciamo</p>
      <h2 className="sps-heading static">Social, video<br /><em>e siti web.</em></h2>
      {STORIES.map((s) => (
        <div key={s.key} className="sps-static-row">
          <div className="sps-copy">
            <p className="sps-copy-label"><span>{s.num}</span>{s.label}</p>
            <h3 className="sps-copy-title">{s.title}<br /><em>{s.accent}</em></h3>
            <p className="sps-copy-body">{s.body}</p>
            <a className="sps-copy-link" href={s.href} onClick={linkClick(() => navigate(s.href))}>
              {s.cta} <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ─── Sezione ─────────────────────────────────────────────────── */

// La scena si rimonta quando si passa da telefono a computer (key), così la
// sorgente del progresso (normale o ammorbidita) non cambia mai durante la vita
// degli hook.
export const ScrollPhoneStory: React.FC = () => {
  const mobile = useIsMobile();
  return <SpsScene key={mobile ? 'm' : 'd'} mobile={mobile} />;
};

const SpsScene: React.FC<{ mobile: boolean }> = ({ mobile }) => {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion() || !!useFmReducedMotion();
  const stats = useAgencyStats();

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Sul telefono il progresso è ammorbidito: una spinta forte allo scroll non fa
  // saltare da un servizio all'altro, il passaggio resta graduale.
  const smooth = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.6 });
  const p = mobile ? smooth : raw;

  // Titolo: pieno all'inizio, poi arretra dietro il telefono
  const hOpacity = useTransform(p, [0, 0.1, 0.19, 1], [1, 1, 0, 0]);
  const hScale = useTransform(p, [0, 0.1, 0.19, 1], [1, 1, 0.86, 0.86]);
  const hY = useTransform(p, [0, 0.1, 0.19, 1], [0, 0, -30, -30]);
  const hBlur = useTransform(p, [0, 0.1, 0.19, 1], ['blur(0px)', 'blur(0px)', 'blur(8px)', 'blur(8px)']);

  // Telefono: sale dal basso, poi destra → sinistra → destra con inclinazione
  const K = [0, 0.12, 0.2, 0.38, 0.43, 0.48, 0.66, 0.71, 0.76, 1];
  const off = mobile ? 0 : 24;
  const x = useTransform(p, K, [0, 0, off, off, 0, -off, -off, 0, off, off].map((v) => `${v}vw`));
  const y = useTransform(p, [0, 0.12, 1], mobile ? ['62vh', '-15vh', '-15vh'] : ['62vh', '0vh', '0vh']);
  const rotateY = useTransform(p, K, mobile ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : [0, 0, -14, -14, 0, 14, 14, 0, -14, -14]);
  const rotateZ = useTransform(p, K, mobile ? [8, 0, 0, 0, 0, 0, 0, 0, 0, 0] : [8, 0, 0, 0, -7, 0, 0, 7, 0, 0]);
  const rotateX = useTransform(p, [0, 0.12, 1], [32, 0, 0]);
  const scale = useTransform(p, K, mobile ? [0.8, 0.9, 1, 1, 1, 1, 1, 1, 1, 1] : [0.8, 0.9, 1, 1, 0.92, 1, 1, 0.92, 1, 1]);

  // Schermate: ognuna "sale" sopra la precedente
  const clip2 = useTransform(p, [0, 0.41, 0.47, 1], ['inset(100% 0% 0% 0%)', 'inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']);
  const clip3 = useTransform(p, [0, 0.69, 0.75, 1], ['inset(100% 0% 0% 0%)', 'inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']);

  // Bagliore dietro il telefono
  const glowOpacity = useTransform(p, [0, 0.12, 0.9, 1], [0, 1, 1, 0.6]);

  // Il reel parte solo quando la sua schermata è visibile
  useMotionValueEvent(p, 'change', (v) => {
    const vid = videoRef.current;
    if (!vid) return;
    const on = v > 0.42 && v < 0.74;
    if (on && vid.paused) vid.play().catch(() => {});
    if (!on && !vid.paused) vid.pause();
  });

  if (reduced) return <><SpsStyles /><StaticStory /></>;

  return (
    <section ref={ref} className="sps" aria-label="Cosa facciamo">
      <SpsStyles />
      <div className="sps-sticky">
        <div className="sps-grid-bg" />

        <motion.div className="sps-head" style={{ opacity: hOpacity, scale: hScale, y: hY, filter: hBlur }}>
          <p className="section-label">Cosa facciamo</p>
          <motion.h2
            className="sps-heading"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {['Social, video', 'e siti web.'].map((line, i) => (
              <span key={line} className="sps-line">
                <motion.span
                  variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}
                  className={i === 1 ? 'accent' : ''}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h2>
        </motion.div>

        <motion.div className="sps-glow" style={{ opacity: glowOpacity, x }} />

        <div className="sps-phone-wrap">
          <motion.div className="sps-phone" style={{ x, y, rotateX, rotateY, rotateZ, scale }}>
            <div className="sps-notch" />
            <div className="sps-display">
              <ScreenSocial stats={stats} />
              <motion.div className="sps-layer" style={{ clipPath: clip2 }}>
                <ScreenVideo videoRef={videoRef} views={stats[0]?.display || ''} />
              </motion.div>
              <motion.div className="sps-layer" style={{ clipPath: clip3 }}>
                <ScreenWeb />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {STORIES.map((s) => <StoryCopy key={s.key} s={s} p={p} mobile={mobile} />)}

        <div className="sps-progress" aria-hidden="true">
          <ProgressSeg p={p} from={0.18} to={0.4} />
          <ProgressSeg p={p} from={0.46} to={0.68} />
          <ProgressSeg p={p} from={0.74} to={0.95} />
        </div>
      </div>
    </section>
  );
};

const SpsStyles = () => (
  <style>{`
    .sps{position:relative;height:420vh;border-bottom:.5px solid var(--b)}
    .sps-sticky{position:sticky;top:0;height:100vh;height:100svh;overflow:clip;display:flex;align-items:center;justify-content:center}
    .sps-grid-bg{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 80%);mask-image:radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 80%)}
    .sps-head{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 1.5rem;z-index:1}
    .sps-heading{font-family:var(--fd);font-weight:400;font-size:clamp(3.2rem,10vw,9.5rem);line-height:.9;letter-spacing:.01em;text-transform:uppercase;color:var(--t)}
    .sps-line{display:block;overflow:hidden;padding-bottom:.04em}
    .sps-line>span{display:inline-block}
    .sps-heading .accent,.sps-heading em{font-family:var(--fs);font-style:italic;text-transform:none;color:var(--a);font-size:.72em}
    .sps-glow{position:absolute;width:520px;height:520px;border-radius:50%;background:rgba(205,178,255,.13);filter:blur(110px);pointer-events:none;z-index:1}
    .sps-phone-wrap{position:relative;z-index:2;perspective:1400px}
    .sps-phone{width:min(290px,64vw);aspect-ratio:9/18.5;border-radius:38px;padding:10px;background:linear-gradient(145deg,#0d0c10 0%,#26222d 52%,#0b0b0d 100%);border:1px solid rgba(255,255,255,.16);box-shadow:0 40px 100px rgba(0,0,0,.55),0 0 0 8px rgba(205,178,255,.04);position:relative;will-change:transform}
    .sps-notch{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:90px;height:22px;border-radius:0 0 16px 16px;background:#0b0b0d;z-index:5}
    .sps-display{position:relative;height:100%;border-radius:29px;overflow:hidden;background:#141217;border:1px solid rgba(255,255,255,.08)}
    .sps-layer{position:absolute;inset:0}
    .sps-screen{position:absolute;inset:0;font-family:var(--fb)}

    .sps-social{background:linear-gradient(180deg,#17151b,#1d1a22);padding:2.6rem .9rem .9rem;display:flex;flex-direction:column}
    .sps-ig-head{display:flex;align-items:center;gap:14px}
    .sps-ig-avatar{width:58px;height:58px;border-radius:50%;padding:2px;background:conic-gradient(from 200deg,var(--a),#7d63c0,var(--a));display:grid;place-items:center;flex-shrink:0}
    .sps-ig-avatar>span{width:100%;height:100%;border-radius:50%;background:#1e1d1d;display:grid;place-items:center;font-family:var(--fd);color:var(--a);font-size:20px;border:2px solid #17151b}
    .sps-ig-avatar.sm{width:26px;height:26px}.sps-ig-avatar.sm>span{font-size:10px;border-width:1px}
    .sps-ig-stats{display:flex;gap:14px;flex:1;justify-content:space-around}
    .sps-ig-stats div{display:flex;flex-direction:column;align-items:center}
    .sps-ig-stats b{font-family:var(--fd);font-weight:400;font-size:20px;letter-spacing:.03em;color:var(--t)}
    .sps-ig-stats span{font-size:8.5px;color:rgba(240,237,230,.55);text-transform:lowercase}
    .sps-ig-name{margin-top:10px;font-size:11px;font-weight:500;color:var(--t)}
    .sps-ig-bio{font-size:9.5px;color:rgba(240,237,230,.55);margin-top:2px}
    .sps-ig-grid{margin-top:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border-radius:10px;overflow:hidden}
    .sps-ig-grid div{aspect-ratio:4/5;background-size:cover;background-position:center;background-color:#2a2631}

    .sps-video{background:linear-gradient(160deg,#3a2d55,#15131a 60%)}
    .sps-video video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
    .sps-video-shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75),transparent 45%,rgba(0,0,0,.35))}
    .sps-video-top{position:absolute;top:2.5rem;left:.9rem;right:.9rem;display:flex;justify-content:space-between;font-size:11px;font-weight:500;color:#fff}
    .sps-live{color:var(--a);font-size:9px;letter-spacing:.08em;text-transform:uppercase}
    .sps-video-bottom{position:absolute;left:.9rem;right:.9rem;bottom:1rem;color:#fff}
    .sps-video-user{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:500}
    .sps-video-bottom p{font-size:10.5px;margin:8px 0 10px;color:rgba(255,255,255,.85)}
    .sps-video-views{display:inline-flex;gap:6px;align-items:baseline;padding:6px 10px;border-radius:100px;background:rgba(205,178,255,.18);border:1px solid rgba(205,178,255,.35);font-size:9.5px;text-transform:uppercase;letter-spacing:.08em}
    .sps-video-views b{font-family:var(--fd);font-weight:400;font-size:16px;color:var(--a);letter-spacing:.03em}

    .sps-web{background:#f4f1ec;color:#1e1d1d;padding-top:2.3rem;display:flex;flex-direction:column}
    .sps-web-bar{margin:0 .7rem;padding:6px 10px;border-radius:100px;background:#e6e1d9;font-size:9.5px;color:#555;display:flex;gap:6px;align-items:center}
    .sps-web-lock{font-size:8px}
    .sps-web-hero{margin:.7rem;padding:1.1rem .9rem;border-radius:18px;background:linear-gradient(150deg,#1e1d1d,#3b3348);color:#F0EDE6}
    .sps-web-kicker{font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:var(--a)}
    .sps-web-title{font-family:var(--fs);font-size:34px;line-height:1;margin:6px 0}
    .sps-web-sub{font-size:10px;line-height:1.5;color:rgba(240,237,230,.72)}
    .sps-web-btn{display:inline-block;margin-top:12px;padding:7px 12px;border-radius:100px;background:var(--a);color:#000;font-size:9.5px;font-weight:500}
    .sps-web-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0 .7rem}
    .sps-web-cards div{padding:10px 6px;border-radius:12px;background:#fff;font-size:8.5px;text-align:center;color:#333;display:flex;flex-direction:column;align-items:center;gap:6px}
    .sps-web-cards i{width:18px;height:18px;border-radius:6px;background:rgba(205,178,255,.55)}
    .sps-web-google{margin:auto .7rem .9rem;padding:10px;border-radius:14px;background:#fff;display:flex;gap:10px;align-items:center;box-shadow:0 6px 18px rgba(0,0,0,.08)}
    .sps-g{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:13px;color:#4285f4;border:1px solid #e3e3e3}
    .sps-web-google b{display:block;font-size:10px;font-weight:500}
    .sps-web-google span{font-size:8.5px;color:#777}

    .sps-copy{position:absolute;z-index:3;max-width:400px;top:50%;margin-top:-120px}
    .sps-copy.is-left{left:max(2rem,calc(50% - 600px))}
    .sps-copy.is-right{right:max(2rem,calc(50% - 600px))}
    .sps-copy.is-mobile{left:1.25rem;right:1.25rem;top:auto;margin-top:0;bottom:4.2rem;max-width:none;text-align:center}
    .sps-copy-label{display:flex;align-items:center;gap:10px;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--m);margin-bottom:1rem}
    .sps-copy.is-mobile .sps-copy-label{justify-content:center;margin-bottom:.5rem}
    .sps-copy-label span{font-family:var(--fd);font-size:15px;color:var(--a);letter-spacing:.06em}
    .sps-copy-title{font-family:var(--fd);font-weight:400;font-size:clamp(2.4rem,4.4vw,4.2rem);line-height:.92;text-transform:uppercase;color:var(--t);margin-bottom:1.1rem}
    .sps-copy-title em{font-family:var(--fs);font-style:italic;text-transform:none;color:var(--a);font-size:.78em}
    .sps-copy-body{font-size:15.5px;line-height:1.75;color:var(--m);margin-bottom:1.4rem}
    .sps-copy-link{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:100px;border:1px solid rgba(205,178,255,.4);color:var(--a);font-size:12px;letter-spacing:.1em;text-transform:uppercase;transition:background .25s,color .25s}
    .sps-copy-link:hover{background:var(--a);color:#000}
    .sps-copy.is-mobile .sps-copy-title{font-size:clamp(2rem,9vw,2.6rem);margin-bottom:.5rem}
    .sps-copy.is-mobile .sps-copy-body{font-size:13.5px;line-height:1.55;margin-bottom:.8rem}
    .sps-copy.is-mobile .sps-copy-link{padding:8px 14px;font-size:11px}
    .sps-progress{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:4}
    .sps-seg{width:44px;height:2px;border-radius:2px;background:rgba(240,237,230,.14);overflow:hidden}
    .sps-seg i{display:block;height:100%;background:var(--a);transform-origin:left}
    @media(max-width:900px){
      /* più spazio di scroll per ogni servizio: il passaggio è meno sensibile */
      .sps{height:560vh}
      .sps-phone{width:min(190px,48vw);border-radius:28px;padding:7px}
      .sps-notch{width:64px;height:16px;top:7px}
      /* testo in basso su fondo pieno, più grande e leggibile */
      .sps-copy.is-mobile{bottom:3.4rem;padding:2.2rem 0 0;background:linear-gradient(to top,var(--bg) 78%,rgba(30,29,29,0))}
      .sps-copy.is-mobile .sps-copy-title{font-size:clamp(2.1rem,9.5vw,2.8rem)}
      .sps-copy.is-mobile .sps-copy-body{font-size:15px;line-height:1.6;color:rgba(240,237,230,.78);max-width:34ch;margin-left:auto;margin-right:auto}
      .sps-display{border-radius:22px}
      .sps-progress{bottom:1.4rem}
      .sps-glow{width:320px;height:320px}
    }
    @media(max-width:900px) and (max-height:720px){.sps-phone{width:min(190px,48vw)}.sps-copy.is-mobile .sps-copy-body{display:none}}

    .sps-static{padding:7rem 2rem;border-bottom:.5px solid var(--b)}
    .sps-static-inner{max-width:1280px;margin:0 auto}
    .sps-heading.static{font-size:clamp(3rem,7vw,6rem);margin-bottom:3rem}
    .sps-static-row{position:relative;padding:2rem 0;border-top:.5px solid var(--b)}
    .sps-static-row .sps-copy{position:static;text-align:left;margin:0;max-width:640px}
    .sps-static-row .sps-copy-label{justify-content:flex-start}
  `}</style>
);
