import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

/* ════════════════════════════════════════════════════════════════
   Computer, macchina fotografica e telefono accanto al metodo.
   Il dispositivo della fase attiva passa davanti, gli altri arretrano.
   Analisi / Strategia / Report → computer (con grafici o piano)
   Produzione, riprese, foto, video → macchina fotografica
   Pubblicazione, social, campagne  → telefono
═══════════════════════════════════════════════════════════════ */

export type Device = 'pc' | 'camera' | 'phone';
export type PcScreen = 'analysis' | 'plan' | 'report';
export type Focus = { device: Device; screen: PcScreen };

const FALLBACK: Focus[] = [
  { device: 'pc', screen: 'analysis' },
  { device: 'pc', screen: 'plan' },
  { device: 'camera', screen: 'plan' },
  { device: 'phone', screen: 'plan' },
  { device: 'pc', screen: 'report' },
];

/** Dal titolo dello step (modificabile in dashboard) al dispositivo da mettere avanti. */
export const deviceFor = (title: string | undefined, i: number): Focus => {
  const t = String(title || '').toLowerCase();
  if (/ripres|produz|foto|video|shoot|contenut/.test(t)) return { device: 'camera', screen: 'plan' };
  if (/pubblic|social|campagn|ads|lancio/.test(t)) return { device: 'phone', screen: 'plan' };
  if (/report|ottimizz|risultat|misur/.test(t)) return { device: 'pc', screen: 'report' };
  if (/strateg|piano/.test(t)) return { device: 'pc', screen: 'plan' };
  if (/analisi|ricerca|studio/.test(t)) return { device: 'pc', screen: 'analysis' };
  return FALLBACK[i % FALLBACK.length];
};

type Pose = { x: number; y: number; scale: number; rotate: number; opacity: number; filter: string; zIndex: number };
const FRONT = { opacity: 1, filter: 'blur(0px)', zIndex: 3 };
const BACK = { opacity: 0.42, filter: 'blur(2px)', zIndex: 1 };

// Posizioni di ogni dispositivo per ciascun dispositivo in primo piano
const POSES: Record<Device, Record<Device, Pose>> = {
  pc: {
    pc: { x: 0, y: -55, scale: 1.08, rotate: 0, ...FRONT },
    camera: { x: -40, y: 10, scale: 0.78, rotate: -8, ...BACK, zIndex: 4 },
    phone: { x: 40, y: -10, scale: 0.8, rotate: 8, ...BACK, zIndex: 4 },
  },
  camera: {
    pc: { x: -170, y: 150, scale: 0.7, rotate: -6, ...BACK, zIndex: 2 },
    camera: { x: 150, y: -150, scale: 1.45, rotate: -3, ...FRONT },
    phone: { x: 20, y: 30, scale: 0.72, rotate: 8, ...BACK },
  },
  phone: {
    pc: { x: -160, y: 150, scale: 0.8, rotate: -8, ...BACK, zIndex: 2 },
    camera: { x: 310, y: 20, scale: 0.7, rotate: 8, ...BACK },
    phone: { x: -150, y: -150, scale: 1.5, rotate: 0, ...FRONT },
  },
};

const spring = { type: 'spring', stiffness: 90, damping: 18, mass: 0.9 } as const;

/* ─── Schermate del computer ─────────────────────────────────── */

const Bars: React.FC<{ values: number[]; delay?: number; accent?: number }> = ({ values, delay = 0, accent }) => (
  <div className="md-bars">
    {values.map((v, i) => (
      <motion.i key={i} initial={{ height: '0%' }} animate={{ height: `${v}%` }}
        transition={{ duration: 0.8, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        className={accent === i ? 'on' : ''} />
    ))}
  </div>
);

const ScreenAnalysis = () => (
  <div className="md-pc-screen">
    <div className="md-pc-top"><b>Analisi</b><span>pubblico · mercato · concorrenti</span></div>
    <div className="md-pc-row">
      <div className="md-card grow">
        <small>Interesse del pubblico</small>
        <svg viewBox="0 0 200 70" preserveAspectRatio="none">
          <motion.path d="M0 60 C 25 55, 40 40, 60 44 S 100 20, 120 26 S 165 8, 200 12" fill="none" stroke="var(--a)" strokeWidth="2.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
          <path d="M0 64 C 30 62, 50 55, 80 56 S 140 44, 200 40" fill="none" stroke="rgba(240,237,230,.25)" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </div>
      <div className="md-card">
        <small>Età</small>
        <svg viewBox="0 0 42 42" className="md-donut">
          <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="6" />
          <motion.circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--a)" strokeWidth="6" strokeLinecap="round"
            transform="rotate(-90 21 21)" initial={{ pathLength: 0 }} animate={{ pathLength: 0.62 }} transition={{ duration: 1, delay: 0.2 }} />
        </svg>
      </div>
    </div>
    <div className="md-card"><small>Canali</small><Bars values={[45, 80, 60, 30, 70, 50, 90]} accent={6} /></div>
  </div>
);

const ScreenPlan = () => (
  <div className="md-pc-screen">
    <div className="md-pc-top"><b>Strategia</b><span>piano editoriale del mese</span></div>
    <div className="md-plan">
      {['L', 'M', 'M', 'G', 'V'].map((d, i) => <small key={i}>{d}</small>)}
      {Array.from({ length: 15 }).map((_, i) => {
        const kind = [0, 3, 5, 7, 9, 12, 14].includes(i) ? 'reel' : [1, 6, 10, 13].includes(i) ? 'post' : [4, 11].includes(i) ? 'ads' : '';
        return (
          <motion.div key={i} className={`md-cell ${kind}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.03 * i, duration: 0.35 }}>
            {kind && <span>{kind === 'reel' ? 'Reel' : kind === 'post' ? 'Post' : 'Ads'}</span>}
          </motion.div>
        );
      })}
    </div>
  </div>
);

const ScreenReport = () => (
  <div className="md-pc-screen">
    <div className="md-pc-top"><b>Report</b><span>risultati del mese</span></div>
    <div className="md-pc-row">
      {[['Copertura', '+47%'], ['Contatti', '+32'], ['Costo lead', '−18%']].map(([l, v], i) => (
        <motion.div key={l} className="md-card md-kpi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
          <small>{l}</small><b>{v}</b>
        </motion.div>
      ))}
    </div>
    <div className="md-card"><small>Andamento</small><Bars values={[22, 30, 28, 42, 50, 58, 72, 88]} delay={0.2} accent={7} /></div>
  </div>
);

/* ─── Dispositivi ────────────────────────────────────────────── */

const Laptop: React.FC<{ screen: PcScreen }> = ({ screen }) => (
  <div className="md-laptop">
    <div className="md-lid">
      <div className="md-display">
        <AnimatePresence mode="wait">
          <motion.div key={screen} className="md-fill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {screen === 'analysis' ? <ScreenAnalysis /> : screen === 'plan' ? <ScreenPlan /> : <ScreenReport />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    <div className="md-base" />
  </div>
);

const Camera: React.FC<{ on: boolean }> = ({ on }) => (
  <div className="md-camera">
    <div className="md-cam-hump" />
    <div className="md-cam-dial" />
    <div className="md-cam-btn" />
    <div className="md-cam-body">
      <span className="md-cam-brand">INLAB</span>
      <div className="md-cam-grip" />
      <div className="md-lens"><div className="md-lens-in"><div className="md-lens-glass" /></div></div>
      <motion.span className="md-rec" animate={on ? { opacity: [1, 0.2, 1] } : { opacity: 0 }} transition={on ? { duration: 1.2, repeat: Infinity } : { duration: 0.2 }}>● REC</motion.span>
    </div>
  </div>
);

const Phone: React.FC<{ on: boolean }> = ({ on }) => (
  <div className="md-phone">
    <div className="md-phone-notch" />
    <div className="md-phone-screen">
      <div className="md-post-head"><i />inlab.communication<em>Sponsorizzato</em></div>
      <div className="md-post-img"><span>Nuova campagna</span></div>
      <div className="md-post-actions">♥ ✦ ➤</div>
      <AnimatePresence>
        {on && (
          <>
            <motion.div className="md-notif" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.35 }}>♥ +128 like</motion.div>
            <motion.div className="md-notif two" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.8 }}>✉ Nuovo contatto</motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export const MethodDevices: React.FC<{ focus: Focus; stepLabel: string; reduced?: boolean }> = ({ focus, stepLabel, reduced }) => {
  const t = reduced ? { duration: 0 } : spring;
  const pose = (d: Device) => POSES[focus.device][d];
  return (
    <div className="md-stage">
      <MdStyles />
      <div className="md-glow" />
      <div className="md-scene">
        <motion.div className="md-slot md-slot-pc" animate={pose('pc')} transition={t}><Laptop screen={focus.screen} /></motion.div>
        <motion.div className="md-slot md-slot-cam" animate={pose('camera')} transition={t}><Camera on={focus.device === 'camera'} /></motion.div>
        <motion.div className="md-slot md-slot-phone" animate={pose('phone')} transition={t}><Phone on={focus.device === 'phone'} /></motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={stepLabel} className="md-label" initial={{ opacity: 0, x: '-50%', y: 8 }} animate={{ opacity: 1, x: '-50%', y: 0 }} exit={{ opacity: 0, x: '-50%', y: -8 }} transition={{ duration: 0.25 }}>
          {stepLabel}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const MdStyles = () => (
  <style>{`
    .md-stage{position:relative;width:100%;height:100%}
    .md-glow{position:absolute;left:50%;top:45%;width:420px;height:420px;transform:translate(-50%,-50%);border-radius:50%;background:rgba(205,178,255,.1);filter:blur(90px);pointer-events:none}
    .md-scene{position:absolute;left:50%;top:50%;width:520px;height:440px;transform:translate(-50%,-50%)}
    .md-slot{position:absolute;will-change:transform}
    .md-slot-pc{left:90px;top:70px}
    .md-slot-cam{left:10px;top:270px}
    .md-slot-phone{left:390px;top:200px}
    /* centrata con x:'-50%' di motion (un transform nel CSS verrebbe sovrascritto e l'etichetta uscirebbe a destra) */
    .md-label{position:absolute;left:50%;bottom:0;white-space:nowrap;padding:7px 14px;border-radius:100px;border:.5px solid rgba(205,178,255,.35);background:rgba(30,29,29,.8);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--a)}

    .md-laptop{width:340px}
    .md-lid{padding:9px;border-radius:14px 14px 4px 4px;background:linear-gradient(160deg,#2c2932,#121115);border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 70px rgba(0,0,0,.5)}
    .md-display{position:relative;height:200px;border-radius:7px;overflow:hidden;background:#141217}
    .md-fill{position:absolute;inset:0}
    .md-base{height:12px;margin:0 -22px;border-radius:0 0 14px 14px;background:linear-gradient(180deg,#3a3640,#19171c);border:1px solid rgba(255,255,255,.1);border-top:none;position:relative}
    .md-base::after{content:"";position:absolute;left:50%;top:0;width:60px;height:5px;transform:translateX(-50%);border-radius:0 0 6px 6px;background:rgba(0,0,0,.4)}
    .md-pc-screen{height:100%;padding:10px;display:flex;flex-direction:column;gap:7px;font-family:var(--fb)}
    .md-pc-top{display:flex;justify-content:space-between;align-items:baseline;font-size:9px;color:rgba(240,237,230,.5)}
    .md-pc-top b{font-family:var(--fd);font-weight:400;font-size:15px;letter-spacing:.05em;color:var(--t)}
    .md-pc-row{display:flex;gap:7px}
    .md-card{flex:1;min-width:0;padding:7px 8px;border-radius:8px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07)}
    .md-card.grow{flex:2.2}
    .md-card small{display:block;font-size:7.5px;letter-spacing:.08em;text-transform:uppercase;color:rgba(240,237,230,.5);margin-bottom:4px}
    .md-card svg{width:100%;height:46px;display:block}
    .md-card svg.md-donut{width:46px;margin:0 auto}
    .md-bars{display:flex;align-items:flex-end;gap:5px;height:44px}
    .md-bars i{flex:1;border-radius:3px 3px 0 0;background:rgba(205,178,255,.35)}
    .md-bars i.on{background:var(--a);box-shadow:0 0 10px rgba(205,178,255,.5)}
    .md-kpi b{font-family:var(--fd);font-weight:400;font-size:21px;color:var(--a);letter-spacing:.03em}
    .md-plan{flex:1;display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:auto repeat(3,1fr);gap:5px}
    .md-plan small{font-size:8px;text-align:center;color:rgba(240,237,230,.45)}
    .md-cell{border-radius:6px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);display:flex;align-items:flex-end;padding:4px}
    .md-cell span{font-size:7.5px;padding:2px 5px;border-radius:4px;color:#000}
    .md-cell.reel span{background:var(--a)}
    .md-cell.post span{background:#f0ede6}
    .md-cell.ads span{background:#8f7bd0;color:#fff}

    .md-camera{position:relative;width:190px;padding-top:18px}
    .md-cam-hump{position:absolute;top:0;left:62px;width:66px;height:24px;border-radius:8px 8px 0 0;background:linear-gradient(180deg,#34303a,#1b191e);border:1px solid rgba(255,255,255,.12);border-bottom:none}
    .md-cam-dial{position:absolute;top:6px;left:18px;width:30px;height:14px;border-radius:4px;background:repeating-linear-gradient(90deg,#2e2b33 0 3px,#1c1a1f 3px 5px);border:1px solid rgba(255,255,255,.1)}
    .md-cam-btn{position:absolute;top:8px;right:22px;width:22px;height:12px;border-radius:6px;background:var(--a);box-shadow:0 0 12px rgba(205,178,255,.5)}
    .md-cam-body{position:relative;height:118px;border-radius:16px;background:linear-gradient(160deg,#2f2b35,#131215);border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 60px rgba(0,0,0,.5);overflow:hidden}
    .md-cam-grip{position:absolute;left:0;top:0;bottom:0;width:34px;background:repeating-linear-gradient(0deg,#1f1d22 0 3px,#26232a 3px 6px);border-right:1px solid rgba(255,255,255,.06)}
    .md-cam-brand{position:absolute;right:12px;top:10px;font-family:var(--fd);font-size:11px;letter-spacing:.2em;color:rgba(240,237,230,.5)}
    .md-lens{position:absolute;left:50%;top:50%;width:92px;height:92px;transform:translate(-40%,-50%);border-radius:50%;background:radial-gradient(circle,#2a2730 55%,#141316 56%);border:2px solid rgba(255,255,255,.12);display:grid;place-items:center}
    .md-lens-in{width:64px;height:64px;border-radius:50%;background:#0b0a0d;border:3px solid #2c2932;display:grid;place-items:center}
    .md-lens-glass{width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),rgba(205,178,255,.5) 18%,#2a1f45 50%,#07060a 75%)}
    .md-rec{position:absolute;right:12px;bottom:10px;font-size:9px;font-weight:600;letter-spacing:.1em;color:#ff5d6c}

    .md-phone{position:relative;width:112px;aspect-ratio:9/18.5;border-radius:20px;padding:5px;background:linear-gradient(145deg,#0d0c10,#26222d 52%,#0b0b0d);border:1px solid rgba(255,255,255,.16);box-shadow:0 26px 60px rgba(0,0,0,.5)}
    .md-phone-notch{position:absolute;top:5px;left:50%;transform:translateX(-50%);width:36px;height:9px;border-radius:0 0 7px 7px;background:#0b0b0d;z-index:2}
    .md-phone-screen{position:relative;height:100%;border-radius:15px;overflow:hidden;background:#17151b;padding:16px 6px 6px;font-family:var(--fb)}
    .md-post-head{display:flex;align-items:center;gap:4px;font-size:6px;color:var(--t)}
    .md-post-head i{width:12px;height:12px;border-radius:50%;background:var(--a)}
    .md-post-head em{margin-left:auto;font-style:normal;color:rgba(240,237,230,.45);font-size:5px}
    .md-post-img{margin-top:5px;aspect-ratio:4/5;border-radius:6px;background:linear-gradient(150deg,var(--a),#6f58b0 45%,#1a1720);display:flex;align-items:flex-end;padding:6px}
    .md-post-img span{font-family:var(--fd);font-size:13px;line-height:.9;color:#fff}
    .md-post-actions{margin-top:5px;font-size:8px;letter-spacing:3px;color:rgba(240,237,230,.7)}
    .md-notif{position:absolute;left:5px;right:5px;top:20px;padding:5px 6px;border-radius:7px;background:rgba(240,237,230,.95);color:#1e1d1d;font-size:6.5px;font-weight:500;box-shadow:0 6px 14px rgba(0,0,0,.3)}
    .md-notif.two{top:40px}

    @media(max-width:900px){
      .md-scene{transform:translate(-50%,-50%) scale(.5)}
      .md-glow{width:260px;height:260px}
      .md-label{bottom:6px;max-width:calc(100% - 2rem);overflow:hidden;text-overflow:ellipsis;font-size:9.5px}
    }
    @media(max-width:420px){.md-scene{transform:translate(-50%,-50%) scale(.46)}}
  `}</style>
);
