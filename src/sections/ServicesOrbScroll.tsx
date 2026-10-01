import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowUpRight,
  Calendar,
  Camera,
  Layout,
  Star,
  Target,
  TrendingUp,
  Video,
  Zap,
} from "lucide-react";
import { linkClick } from "../lib/router";

type ServicesOrbScrollProps = { onServiceClick: (slug: string) => void };

function pad<T>(input: number[], output: T[]): [number[], T[]] {
  const i = [...input];
  const o = [...output];
  if (i[0] > 0) { i.unshift(0); o.unshift(o[0]); }
  if (i[i.length - 1] < 1) { i.push(1); o.push(o[o.length - 1]); }
  return [i, o];
}

const useScrollTransform = <T,>(mv: MotionValue<number>, input: number[], output: T[]) => {
  const [i, o] = pad(input, output);
  return useTransform<number, T>(mv, i, o);
};

const services = [
  { icon: TrendingUp, slug: "gestione-social", label: "Social media management", desc: "Strategia, contenuti e community per Instagram, Facebook, TikTok e LinkedIn." },
  { icon: Video, slug: "video", label: "Reel & video", desc: "Script, riprese e montaggio. Contenuti video che fanno fermare lo scroll." },
  { icon: Camera, slug: "shooting", label: "Shooting fotografici", desc: "Foto professionali per brand, prodotti, eventi e attività locali." },
  { icon: Star, slug: "branding", label: "Branding & identità", desc: "Nome, logo, palette, tono di voce. Diamo forma al modo in cui ti percepiscono." },
  { icon: Layout, slug: "siti-web", label: "Siti web & landing page", desc: "Siti veloci e landing page progettate per trasformare i visitatori in contatti." },
  { icon: Target, slug: "meta-ads", label: "Campagne pubblicitarie", desc: "Meta Ads, Google Ads, retargeting. Budget ottimizzato, risultati misurabili." },
  { icon: Zap, slug: "automazioni-ai", label: "Automazioni AI", desc: "Chatbot, workflow e processi automatizzati che fanno lavorare il tuo brand anche quando sei offline." },
  { icon: Calendar, slug: "contatti", label: "Eventi & inaugurazioni", desc: "Comunicazione integrata online e offline per trasformare aperture in eventi." },
];

const ServiceCard: React.FC<{
  service: (typeof services)[number];
  index: number;
  progress: MotionValue<number>;
  onServiceClick: (slug: string) => void;
}> = ({ service, index, progress, onServiceClick }) => {
  const Icon = service.icon;
  const start = 0.18 + index * 0.06;
  const rotate = useScrollTransform(progress, [start - 0.12, start], [index % 2 ? -4 : 4, 0]);
  const y = useScrollTransform(progress, [start - 0.12, start], [60, 0]);
  const href = `/${service.slug}`;

  return (
    <motion.a
      href={href}
      onClick={linkClick(() => onServiceClick(service.slug))}
      className={`svc-card svc-card-${index % 4}`}
      style={{ rotate, y }}
    >
      <div className="svc-card-top"><span>{String(index + 1).padStart(2, "0")}</span><Icon size={22} /></div>
      <div>
        <h3>{service.label}</h3>
        <p>{service.desc}</p>
        <span className="svc-card-link">{service.slug === "contatti" ? "Parliamone" : "Scopri"} <ArrowUpRight size={12} /></span>
      </div>
    </motion.a>
  );
};

export const ServicesOrbScroll: React.FC<ServicesOrbScrollProps> = ({ onServiceClick }) => {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, Math.round(track.scrollWidth - window.innerWidth)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const x = useScrollTransform(scrollYProgress, [0.08, 0.95], [0, -distance]);
  const bar = useScrollTransform(scrollYProgress, [0.08, 0.95], [0, 1]);

  if (reduced) {
    return (
      <section className="svc svc-static">
        <ServicesStyles />
        <div className="svc-intro"><h2>Tutti i servizi,<br /><span>un solo team.</span></h2></div>
        <div className="svc-static-grid">
          {services.map((s, i) => <ServiceCard key={s.label} service={s} index={i} progress={scrollYProgress} onServiceClick={onServiceClick} />)}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="svc" style={{ height: `calc(100vh + ${distance}px)` }}>
      <ServicesStyles />
      <div className="svc-scene">
        <motion.div ref={trackRef} className="svc-track" style={{ x }}>
          <div className="svc-intro">
            <h2>Tutti i servizi,<br /><span>un solo team.</span></h2>
            <p>Scorri per vedere cosa mettiamo al lavoro per il tuo brand.</p>
          </div>
          {services.map((s, i) => (
            <ServiceCard key={s.label} service={s} index={i} progress={scrollYProgress} onServiceClick={onServiceClick} />
          ))}
        </motion.div>
        <div className="svc-progress" aria-hidden="true"><motion.i style={{ scaleX: bar }} /></div>
      </div>
    </section>
  );
};

const ServicesStyles = () => (
  <style>{`
    .svc{position:relative;background:var(--a)}
    .svc-scene{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center}
    .svc-track{display:flex;align-items:center;gap:3.2vw;padding:0 7vw;width:max-content;will-change:transform}
    .svc-intro{flex:0 0 min(34vw,460px);padding-right:3vw;color:#171619}
    .svc-intro h2{font-family:var(--fd);font-weight:400;font-size:clamp(3.6rem,6.4vw,7rem);line-height:.84;text-transform:uppercase}
    .svc-intro h2 span{color:rgba(23,22,25,.6)}
    .svc-intro p{max-width:320px;margin-top:1.6rem;font-size:15px;line-height:1.6;color:rgba(23,22,25,.7)}
    .svc-card{
      position:relative;flex:0 0 min(34vw,520px);height:min(66svh,620px);
      padding:2.2rem;border-radius:28px;overflow:hidden;
      display:flex;flex-direction:column;justify-content:space-between;
      color:var(--t);background:#1e1d1d;
      box-shadow:0 30px 70px rgba(23,22,25,.25);
      transition:box-shadow .3s;
    }
    .svc-card:hover{box-shadow:0 40px 90px rgba(23,22,25,.38)}
    .svc-card:focus-visible{outline:2px solid #171619;outline-offset:4px}
    .svc-card-1{background:#2b2733}
    .svc-card-2{background:#f0ede6;color:#171619}
    .svc-card-3{background:#141316}
    .svc-card-top{display:flex;justify-content:space-between;align-items:center;font-size:12px;letter-spacing:.16em;opacity:.7}
    .svc-card h3{max-width:420px;font-family:var(--fd);font-weight:400;font-size:clamp(3rem,4.6vw,5.4rem);line-height:.84;text-transform:uppercase}
    .svc-card p{max-width:340px;margin-top:1.2rem;font-size:15px;line-height:1.55;opacity:.72}
    .svc-card-link{display:inline-flex;align-items:center;gap:6px;margin-top:1.5rem;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--a)}
    .svc-card-2 .svc-card-link{color:#6d52c4}
    .svc-progress{position:absolute;left:7vw;right:7vw;bottom:5svh;height:2px;background:rgba(23,22,25,.15)}
    .svc-progress i{position:absolute;inset:0;background:#171619;transform-origin:left center}
    .svc-static{padding:6rem 7vw}
    .svc-static .svc-intro{margin-bottom:3rem}
    .svc-static-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
    .svc-static-grid .svc-card{height:auto;min-height:360px}
    @media (max-width:767px){
      .svc-track{gap:14px;padding:0 20px}
      .svc-intro{flex-basis:78vw;padding-right:0}
      .svc-card{flex-basis:80vw;height:min(62svh,520px);padding:1.6rem;border-radius:22px}
      .svc-card h3{font-size:clamp(2.6rem,11vw,3.6rem)}
      .svc-progress{left:20px;right:20px}
    }
  `}</style>
);
