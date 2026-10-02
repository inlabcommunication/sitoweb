import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import {
  ArrowRight, ArrowUpRight, ArrowLeft, Menu, X,
  MapPin, Phone, Mail, Check,
  TrendingUp, Target, FileText, Video, Camera,
  Globe, Zap, Layout, Users, BarChart2, Star,
  GraduationCap,
} from "lucide-react";
import { Chatbot } from "./components/Chatbot";
import { CookieBanner } from "./components/CookieBanner";
import { initGa, gaPageview, gaEvent, reopenConsent, GA_ID } from "./lib/ga";
import { initAnalytics, trackPageview } from "./lib/analytics";
import { getCurrentPath, linkClick, navigate } from "./lib/router";
import { useAgencyStats } from "./data/stats";
import { SERVICE_EXAMPLES, type ServiceExample } from "./data/serviceExamples";
import { BrowserMockup } from "./components/BrowserMockup";
import { getSeo } from "./seo/routes";
import { applySeo } from "./seo/head";
import { loadContent, useContent } from "./lib/content";
import { getClientId, normalizeClients } from "./lib/clientUtils";

// Nuove sezioni modulari
import { HeroFlow } from "./sections/HeroFlow";
import { ScrollPhoneStory } from "./sections/ScrollPhoneStory";
import { InLabOrbReveal } from "./sections/InLabOrbReveal";
import { ServicesOrbScroll } from "./sections/ServicesOrbScroll";
import { MethodTimeline } from "./sections/MethodTimeline";
import { ClientsWall } from "./sections/ClientsWall";
import { ClientLogoStrip } from "./sections/ClientLogoStrip";
import { CaseCard, CaseCardGrid } from "./components/CaseCard";
import { CaseStudiesSection } from "./sections/CaseStudiesSection";
import { ReelsGrid, Gallery, hasReel } from "./components/ReelCard";
import { registerContent, CITIES, citySlug, authorByName, authorPath, BUSINESS, AGENCY_CITIES, agencyPath } from "./seo/routes";
import { cityInfo } from "./data/cities";
import { DEFAULT_CASES } from "./data/caseStudies";
import { AnimatedStats, FinalCTA } from "./sections/StatsAndCTA";
import { cld, cldVideo, cldVideoPoster } from "./lib/media";
import { workAlt } from "./lib/altText";
// Pagine dei casi studio caricate solo quando servono (chunk separato)
const CasePage = lazy(() => import("./pages/CaseStudyPages").then(m => ({ default: m.CasePage })));
const PagePrivacy = lazy(() => import("./pages/PrivacyPage").then(m => ({ default: m.PagePrivacy })));
const PageBlog = lazy(() => import("./pages/BlogPages").then(m => ({ default: m.PageBlog })));
const PageArticolo = lazy(() => import("./pages/BlogPages").then(m => ({ default: m.PageArticolo })));
const PageAutore = lazy(() => import("./pages/BlogPages").then(m => ({ default: m.PageAutore })));
 
/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const G = () => (
  <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --a:#cdb2ff; --bg:#1e1d1d; --s:#262525; --b:rgba(255,255,255,0.07);
      --t:#F0EDE6; --m:rgba(240,237,230,0.64);
      --fd:'Bebas Neue','Bebas Neue Fallback',sans-serif; --fs:'DM Serif Display','DM Serif Display Fallback',serif; --fb:'DM Sans','DM Sans Fallback',sans-serif;
    }
    html{scroll-behavior:smooth}
    body{background:var(--bg);color:var(--t);font-family:var(--fb);font-weight:300;overflow-x:hidden}
    ::selection{background:var(--a);color:#000}
    a{color:inherit;text-decoration:none;cursor:pointer}
    button{cursor:pointer;font-family:var(--fb)}
    img{max-width:100%}
 
    .fd{font-family:var(--fd)}
    .fs{font-family:var(--fs)}
    .acc{color:var(--a)}
    .mut{color:var(--m)}
    /* seconda riga dei titoli: tono più tenue invece del contorno (più leggibile) */
    .stroke{color:rgba(240,237,230,0.42)}
    .stroke-a{-webkit-text-stroke:1px var(--a);color:transparent}
 
    .glass{background:rgba(255,255,255,0.03);backdrop-filter:blur(12px);border:.5px solid var(--b)}
    .card{background:var(--s);border:.5px solid var(--b);border-radius:24px;padding:2rem;transition:border-color .3s,transform .3s}
    .card:hover{border-color:rgba(205,178,255,0.3);transform:translateY(-3px)}
 
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:13px 26px;border-radius:100px;font-size:12px;font-weight:500;letter-spacing:.13em;text-transform:uppercase;transition:all .2s;border:none}
    .btn-p{background:var(--a);color:#000}.btn-p:hover{box-shadow:0 0 28px rgba(205,178,255,.28);transform:scale(1.03)}
    .btn-g{background:transparent;color:var(--t);border:.5px solid var(--b)}.btn-g:hover{border-color:rgba(255,255,255,.3)}
 
    .tag{display:inline-block;padding:3px 10px;border-radius:100px;font-size:12px;font-weight:500;letter-spacing:.12em;text-transform:uppercase}
    .tag-a{background:rgba(205,178,255,.12);color:var(--a);border:.5px solid rgba(205,178,255,.25)}
    .tag-g{background:rgba(255,255,255,.05);color:var(--m);border:.5px solid var(--b)}
 
    .divider{border:none;border-top:.5px solid var(--b);margin:0}
 
    .nav-link{font-size:12px;font-weight:500;letter-spacing:.17em;text-transform:uppercase;color:var(--m);transition:color .25s;position:relative;padding-bottom:2px}
    .nav-link::after{content:'';position:absolute;bottom:-1px;left:0;width:0;height:1px;background:var(--a);transition:width .25s}
    .nav-link:hover,.nav-link.active{color:var(--t)}
    .nav-link:hover::after,.nav-link.active::after{width:100%}
 
    .hero-h{font-family:var(--fd);line-height:.88;letter-spacing:.02em}
    .section-label{font-size:12px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--m);margin-bottom:14px}
 
    @keyframes marq{to{transform:translateX(-50%)}}
    /* animazioni infinite in CSS (solo transform/opacity, fuori dal thread principale) */
    @keyframes drift{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(25px,-15px,0)}}
    @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(1deg)}}
    @keyframes glowA{0%,100%{opacity:.3}50%{opacity:.6}}
    @keyframes glowB{0%,100%{opacity:.2}50%{opacity:.45}}
    .anim-drift{animation:drift 18s ease-in-out infinite;will-change:transform}
    .anim-float{animation:float 5.5s ease-in-out 1.9s infinite;will-change:transform}
    .anim-glowA{animation:glowA 4s ease-in-out infinite;will-change:opacity}
    .anim-glowB{animation:glowB 5s ease-in-out 1.5s infinite;will-change:opacity;opacity:.2}
    @media (prefers-reduced-motion:reduce){.anim-drift,.anim-float,.anim-glowA,.anim-glowB{animation:none}}
    /* riquadri di clienti ed esempi: stesso stile dei casi studio */
    .case-card{
    position:relative;overflow:hidden;text-decoration:none;color:inherit;font:inherit;
    display:flex;flex-direction:column;min-height:300px;
    padding:clamp(1.8rem,3vw,2.4rem);border-radius:28px;cursor:pointer;
    background:linear-gradient(135deg,rgba(205,178,255,0.06),rgba(255,255,255,0.02));
    border:.5px solid var(--b);transition:border-color .3s,transform .3s;
    }
    .case-card:hover{border-color:rgba(205,178,255,0.3);transform:scale(1.005)}
    .case-card:focus-visible{outline:2px solid var(--a);outline-offset:3px}
    .case-card-num{position:absolute;right:1.2rem;top:50%;transform:translateY(-50%);font-family:var(--fd);font-size:clamp(8rem,14vw,12rem);line-height:.85;color:rgba(205,178,255,0.05);pointer-events:none;user-select:none;letter-spacing:-.04em}
    .case-card-desc{font-size:14px;line-height:1.7;color:var(--m);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:1.4rem}
    .case-card-cta{margin-top:auto;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--a);display:inline-flex;align-items:center;gap:6px;transition:gap .25s}
    .case-card:hover .case-card-cta{gap:10px}
    .logo-strip{display:flex;width:max-content;gap:1.2rem;animation:marq 40s linear infinite}
    .logo-strip-wrap:hover .logo-strip{animation-play-state:paused}
    @media (prefers-reduced-motion:reduce){.logo-strip{animation:none;flex-wrap:wrap;width:auto;justify-content:center;padding:0 2rem}.logo-copy{display:none!important}}
    .form-field:focus{outline:none}
    .form-field:focus-visible{outline:2px solid var(--a);outline-offset:2px}
    .foot-link:hover{color:var(--t)!important}
    .city-link:hover{border-color:rgba(205,178,255,.35)!important;color:var(--a)!important}
    .marq-inner{display:inline-flex;gap:2.5rem;align-items:center;padding-left:2.5rem;animation:marq 28s linear infinite}
 
    @media(max-width:768px){
      .hide-mob{display:none!important}
      .show-mob{display:flex!important}
      /* "Ti serve essere" + parola lilla sempre sulla riga sotto, qualunque sia la parola */
      .rot-word{display:block!important}
      .grid-1-mob{grid-template-columns:1fr!important}
      .pad-mob{padding:4rem 1.25rem!important}
      .grid-col-span-1-mob{grid-column:span 1!important}
      .grid-2-mob{grid-template-columns:repeat(2,1fr)!important}
      .chat-launcher{transform:scale(.8);transform-origin:bottom right;bottom:12px!important;right:12px!important}
      .chat-bubble{display:none!important}
      /* area di tocco di almeno 44 px per i link del footer (richiesta analista, approvata) */
      footer .foot-link{display:inline-flex;align-items:center;min-height:44px}
      .foot-list{gap:0!important}
    }
    @media(max-width:480px){
      .btn{padding:11px 20px!important;font-size:12px!important}
    }
  `}</style>
);
 
/* ═══════════════════════════════════════════════════════════════
   ROUTER
═══════════════════════════════════════════════════════════════ */
const RouterCtx = React.createContext<{route:string;go:(to:string)=>void}>({ route: "/", go: () => {} });
const useRouter = () => React.useContext(RouterCtx);
// Link interno: <a href> vero (seguibile dai motori di ricerca) + navigazione senza ricarica
const Link = ({ to, children, style = {}, className = "", onClick = () => {}, ...rest }: any) => {
  const { go } = useRouter();
  return (
    <a href={to} style={style} className={className} {...rest} onClick={e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // apri in nuova scheda
      e.preventDefault(); go(to); onClick?.();
    }}>
      {children}
    </a>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   SHARED DATA
═══════════════════════════════════════════════════════════════ */
const SERVICES = [
  { slug: "gestione-social", icon: <TrendingUp size={22}/>, label: "Gestione Social", short: "Costruiamo una presenza riconoscibile su Instagram, Facebook, TikTok e LinkedIn. Non riempiamo calendari — costruiamo direzioni." },
  { slug: "meta-ads", icon: <Target size={22}/>, label: "Meta Ads", short: "Campagne progettate per convertire. Budget ottimizzato, audience costruita sui tuoi clienti migliori, risultati misurabili." },
  { slug: "siti-web", icon: <Globe size={22}/>, label: "Siti Web & Web App", short: "Siti, e-commerce e landing page che non sono solo belli: sono veloci, ottimizzati e costruiti per portare clienti." },
  { slug: "automazioni-ai", icon: <Zap size={22}/>, label: "Automazioni AI", short: "Chatbot, workflow e processi automatizzati che fanno lavorare il tuo brand anche quando sei offline." },
  { slug: "shooting", icon: <Camera size={22}/>, label: "Foto & Shooting", short: "Foto professionali per brand, prodotti ed eventi. Perché un'immagine mediocre costa clienti. Una straordinaria li conquista." },
  { slug: "video", icon: <Video size={22}/>, label: "Video & Reels", short: "Produciamo contenuti video che le persone vogliono davvero guardare. Abbiamo portato clienti a milioni di visualizzazioni organiche." },
  { slug: "branding", icon: <Star size={22}/>, label: "Branding & Identità", short: "Nome, logo, palette, tono di voce. Diamo forma al modo in cui il tuo brand viene percepito dal primo sguardo." },
];
 
// Città delle pagine locali: un solo elenco, in src/seo/routes.ts
 
// Riga di numeri dell'agenzia (modificabili da dashboard → Home → Numeri)
const AgencyStatsRow = () => {
  const stats = useAgencyStats();
  return <StatsRow stats={stats.map(s => ({ n: s.display, l: s.label }))}/>;
};
 
/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
const Navbar = () => {
  const { route, go } = useRouter();
  const [open, setOpen] = useState(false);
  const menuBtn = React.useRef<HTMLButtonElement>(null);
  // Esc chiude il menu mobile e riporta il focus al pulsante
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
 
  const navLinks = [
    { to:"/", label:"Home" },
    { to:"/chi-siamo", label:"Studio" },
    { to:"/casi-studio", label:"Casi studio" },
    { to:"/servizi", label:"Servizi" },
    { to:"/blog", label:"Blog" },
    { to:"/contatti", label:"Contatti" },
  ];
 
  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      padding: scrolled ? "14px 0":"26px 0",
      transition:"padding .4s,background .4s,border-color .4s",
      background: scrolled ? "rgba(10,10,8,0.88)":"transparent",
      backdropFilter: scrolled ? "blur(14px)":"none",
      borderBottom: scrolled ? ".5px solid var(--b)":".5px solid transparent",
    }}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 2rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Link to="/" style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:"var(--a)",borderRadius:9,transform:"rotate(-4deg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"var(--fd)",fontSize:17,color:"#000",transform:"rotate(4deg)"}}>IL</span>
          </div>
          <span style={{fontFamily:"var(--fd)",fontSize:21,letterSpacing:".15em"}}>INLAB</span>
        </Link>
 
        <div className="hide-mob" style={{display:"flex",gap:32,alignItems:"center"}}>
          {navLinks.map(l=>(
            <Link key={l.to} to={l.to} className={`nav-link${route===l.to||(l.to!=="/"&&route.startsWith(l.to+"/"))?" active":""}`}>{l.label}</Link>
          ))}
        </div>
 
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <Link to="/contatti"><button className="btn btn-p" style={{padding:"11px 22px"}}>Parliamo <ArrowUpRight size={13}/></button></Link>
          <button ref={menuBtn} className="show-mob" aria-label={open?"Chiudi menu":"Apri menu"} aria-expanded={open} aria-controls="menu-mobile"
            style={{display:"none",background:"none",border:"none",color:"var(--t)",minWidth:44,minHeight:44,padding:10,alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>setOpen(!open)}>
            {open?<X size={24}/>:<Menu size={24}/>}
          </button>
        </div>
      </div>
 
      <AnimatePresence>
        {open && (
          <motion.div id="menu-mobile" initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
            style={{overflow:"hidden",borderTop:".5px solid var(--b)",background:"rgba(10,10,8,0.97)"}}>
            <div style={{padding:"2rem",display:"flex",flexDirection:"column",gap:"1.2rem"}}>
              {navLinks.map(l=>(
                <Link key={l.to} to={l.to} onClick={()=>setOpen(false)}
                  style={{fontFamily:"var(--fd)",fontSize:"2.2rem",letterSpacing:".1em"}}>
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
const Footer = () => {
  const { go } = useRouter();
  const location = ((useContent() as any).contact?.location) || "Castellaneta (TA), Puglia";
  return (
    <footer style={{borderTop:".5px solid var(--b)",padding:"4rem 2rem 2.5rem"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:"3rem",marginBottom:"3rem"}} className="grid-1-mob">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1rem"}}>
              <div style={{width:30,height:30,background:"var(--a)",borderRadius:8,transform:"rotate(-4deg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"var(--fd)",fontSize:14,color:"#000",transform:"rotate(4deg)"}}>IL</span>
              </div>
              <span style={{fontFamily:"var(--fd)",fontSize:19,letterSpacing:".15em"}}>INLAB</span>
            </div>
            <p style={{fontSize:13,color:"var(--m)",lineHeight:1.7,maxWidth:260}}>Agenzia di comunicazione con sede a Castellaneta (TA). Strategia, creatività e tecnologia per far crescere il tuo brand.</p>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:"0.5rem",minHeight:44,fontSize:12,color:"var(--m)"}}>
              <MapPin size={12}/> {location}
            </div>
            {/* NAP visibile su ogni pagina (richiesta SEO 01/10): stessi valori del JSON-LD */}
            <a href={`tel:${BUSINESS.telephone}`} className="foot-link" style={{display:"flex",alignItems:"center",gap:6,minHeight:44,fontSize:12,color:"var(--m)",width:"fit-content"}}>
              <Phone size={12}/> {BUSINESS.telephone.replace(/^\+39(\d{3})(\d{3})(\d{4})$/, "+39 $1 $2 $3")}
            </a>
            <a href={`mailto:${BUSINESS.email}`} className="foot-link" style={{display:"flex",alignItems:"center",gap:6,minHeight:44,fontSize:12,color:"var(--m)",width:"fit-content"}}>
              <Mail size={12}/> {BUSINESS.email}
            </a>
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:500,letterSpacing:".16em",textTransform:"uppercase",color:"var(--m)",marginBottom:"1rem"}}>Servizi</div>
            <div className="foot-list" style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
              {SERVICES.map(s=>(
                <Link key={s.slug} to={"/"+s.slug} className="foot-link" style={{fontSize:13,color:"var(--m)",transition:"color .2s"}}>{s.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:500,letterSpacing:".16em",textTransform:"uppercase",color:"var(--m)",marginBottom:"1rem"}}>Studio</div>
            <div className="foot-list" style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
              {[["Chi siamo","/chi-siamo"],["Casi studio","/casi-studio"],["Blog","/blog"],["Contatti","/contatti"]].map(([l,r])=>(
                <Link key={r} to={r} className="foot-link" style={{fontSize:13,color:"var(--m)",transition:"color .2s"}}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{borderTop:".5px solid var(--b)",paddingTop:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
          <p style={{fontSize:12,color:"var(--m)",letterSpacing:".08em",display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center"}}>
            <span>© {new Date().getFullYear()} InLab Communication di Nicola Carpignano — Agenzia di comunicazione — Castellaneta (TA), 74011 — P.IVA 03411970738</span>
            <Link to="/privacy" className="foot-link" style={{color:"var(--m)"}}>Privacy e cookie</Link>
            {GA_ID && <button onClick={()=>reopenConsent()} className="foot-link" style={{background:"none",border:"none",color:"var(--m)",fontSize:12,letterSpacing:".08em",cursor:"pointer",padding:0,fontFamily:"inherit"}}>Preferenze cookie</button>}
          </p>
          <div style={{display:"flex",gap:"1.5rem"}}>
            {[
              {label:"Instagram",url:"https://www.instagram.com/inlab.communication/"},
              {label:"LinkedIn",url:"https://www.linkedin.com/company/inlab-communication/"},
              {label:"Facebook",url:"https://www.facebook.com/inlab.communication"},
            ].map(s=>(
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer noopener" className="foot-link" style={{fontSize:12,letterSpacing:".14em",textTransform:"uppercase",color:"var(--m)",transition:"color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--t)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--m)"}
              >{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════ */
const Marquee = ({items}) => {
  const all = [...items,...items];
  return (
    <div style={{background:"var(--a)",overflow:"hidden",padding:"13px 0",whiteSpace:"nowrap"}}>
      <div className="marq-inner">
        {all.map((item,i)=>(
          <span key={i} style={{fontFamily:item==="✦"?"inherit":"var(--fd)",fontSize:item==="✦"?11:14,letterSpacing:item==="✦"?0:".14em",color:"#000",opacity:item==="✦"?.3:1}}>{item}</span>
        ))}
      </div>
    </div>
  );
};
 
// Hero delle pagine interne: visibile subito, senza dissolvenza (è l'elemento principale della pagina)
// Frase di definizione dell'agenzia in "Chi siamo" (brief SEO 02/10): subito dopo
// "InLab nasce…", anche se il testo è stato cambiato in dashboard.
const AGENCY_DEFINITION = "InLab Communication è un'agenzia di comunicazione e digital marketing con sede a Castellaneta, in provincia di Taranto, fondata da Nicola Carpignano e Ilaria Gemma.";
const withDefinition = (text?: string) => {
  const t = String(text || "").trim();
  if (t.includes(AGENCY_DEFINITION)) return t;
  const first = "InLab nasce dall'incontro tra due prospettive complementari.";
  return t.includes(first) ? t.replace(first, `${first} ${AGENCY_DEFINITION}`) : [AGENCY_DEFINITION, t].filter(Boolean).join(" ");
};

const PageHero = ({tag,h1,h1b,italic,sub,cta1,cta1to,cta2,cta2to,accent=false}: any) => {
  const {go}=useRouter();
  return (
    <section style={{minHeight:"92vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"9rem 2rem 5rem",position:"relative",overflow:"hidden",borderBottom:".5px solid var(--b)"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"20%",right:"8%",width:480,height:480,background:"rgba(205,178,255,0.055)",borderRadius:"50%",filter:"blur(110px)"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"5%",width:320,height:320,background:"rgba(255,255,255,0.018)",borderRadius:"50%",filter:"blur(80px)"}}/>
      </div>
      <div style={{maxWidth:1280,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
        {tag && <motion.div initial={false}
          style={{display:"inline-flex",alignItems:"center",gap:8,border:".5px solid var(--b)",borderRadius:100,padding:"5px 14px 5px 5px",marginBottom:"2rem"}}>
          <span style={{width:20,height:20,background:"var(--a)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#000",fontWeight:700}}>✦</span>
          <span style={{fontSize:12,fontWeight:500,letterSpacing:".15em",textTransform:"uppercase",color:"var(--m)"}}>{tag}</span>
        </motion.div>}
        <motion.h1 initial={false}
          className="hero-h" style={{fontSize:"clamp(3.8rem,11vw,11.5rem)",marginBottom:"2.5rem"}}>
          {h1}<br/>
          <span className="stroke">{h1b}</span>
          {italic && <><br/><span style={{fontFamily:"var(--fs)",fontStyle:"italic",fontWeight:400,fontSize:"0.76em",color:"var(--a)"}}>{italic}</span></>}
        </motion.h1>
        <motion.div initial={false}
          style={{display:"flex",flexWrap:"wrap",gap:"1.5rem",alignItems:"flex-end",justifyContent:"space-between"}}>
          {sub && <p style={{maxWidth:440,fontSize:17,lineHeight:1.75,color:"var(--m)",fontWeight:300}}>{sub}</p>}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {cta1 && <button className="btn btn-p" onClick={()=>cta1to&&go(cta1to)}>{cta1} <ArrowRight size={14}/></button>}
            {cta2 && <button className="btn btn-g" onClick={()=>cta2to&&go(cta2to)}>{cta2}</button>}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
 
const StatsRow = ({stats}) => (
  <section style={{padding:"4rem 2rem",borderBottom:".5px solid var(--b)"}}>
    <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"2rem"}}>
      {stats.map((s,i)=>(
        <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}
          style={{borderLeft:".5px solid var(--b)",paddingLeft:"1.5rem"}}>
          <div style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,4vw,3.2rem)",lineHeight:1,color:i===0?"var(--a)":"var(--t)"}}>{s.n}</div>
          <div style={{fontSize:12,letterSpacing:".1em",textTransform:"uppercase",color:"var(--m)",marginTop:6}}>{s.l}</div>
        </motion.div>
      ))}
    </div>
  </section>
);
 
const ServiceCTA = ({title="Vuoi questo servizio?",sub="Parliamo del tuo progetto senza impegno.",btn="Richiedi un preventivo",to="/contatti"}) => {
  const {go}=useRouter();
  return (
    <section style={{padding:"6rem 2rem"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div className="glass" style={{borderRadius:40,padding:"4rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,width:400,height:400,background:"rgba(205,178,255,0.04)",borderRadius:"50%",filter:"blur(90px)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,5vw,5rem)",lineHeight:.9,marginBottom:"1rem"}}>{title}</h2>
            <p style={{fontSize:16,color:"var(--m)",marginBottom:"2rem"}}>{sub}</p>
            <button className="btn btn-p" style={{fontSize:13,padding:"16px 36px"}} onClick={()=>go(to)}>{btn} <ArrowRight size={15}/></button>
          </div>
        </div>
      </div>
    </section>
  );
};
 
const ProcessStep = ({n,title,desc}: any) => (
  <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:n*.09}}
    style={{display:"flex",gap:"1.5rem",paddingBottom:"2.5rem",borderBottom:".5px solid var(--b)"}}>
    <div style={{flexShrink:0,width:44,height:44,border:".5px solid var(--a)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fd)",fontSize:18,color:"var(--a)"}}>
      {String(n).padStart(2,"0")}
    </div>
    <div>
      <h3 style={{fontSize:16,fontWeight:500,marginBottom:".4rem"}}>{title}</h3>
      <p style={{fontSize:14,color:"var(--m)",lineHeight:1.7}}>{desc}</p>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   VIDEO REEL — Sezione "dietro le quinte" con sfumatura sui bordi
═══════════════════════════════════════════════════════════════ */
const VideoReel = ({
  src,
  tag = "Dietro le quinte",
  title1 = "IL LAVORO",
  title2 = "ACCADE",
  italic = "ogni giorno.",
  subtitle = "Set, riprese, montaggio. Quello che vedi online nasce qui."
}: any) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  // se il visitatore mette in pausa, il video non riparte da solo quando torna nello schermo
  const userPaused = React.useRef(false);

  // Il video si scarica solo quando entra nello schermo, nella versione
  // ridotta da Cloudinary (720 px sul telefono, 1280 px sul computer).
  // Con "Riduci movimento" o "Risparmio dati" non parte da solo: resta il
  // poster e si avvia col pulsante audio.
  const load = (v: HTMLVideoElement) => {
    if (!v.getAttribute('src')) v.src = cldVideo(src, window.innerWidth < 768 ? 720 : 1280);
  };
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      || (navigator as any).connection?.saveData === true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (reduce || userPaused.current) return;
            load(v);
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.35 } // parte quando il 35% del video è visibile
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [src]);

  const toggleAudio = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) { userPaused.current = false; load(v); v.play().catch(()=>{}); }
    setMuted(v.muted);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { userPaused.current = false; load(v); v.play().catch(()=>{}); }
    else { userPaused.current = true; v.pause(); }
  };

  return (
    <section style={{padding:"7rem 0 6rem",borderBottom:".5px solid var(--b)",position:"relative",overflow:"hidden"}}>
      {/* Glow di sfondo coerente col resto del sito */}
      <div style={{position:"absolute",top:"30%",right:"-5%",width:520,height:520,background:"rgba(205,178,255,0.05)",borderRadius:"50%",filter:"blur(120px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"5%",left:"-5%",width:380,height:380,background:"rgba(205,178,255,0.03)",borderRadius:"50%",filter:"blur(100px)",pointerEvents:"none"}}/>

      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 2rem",position:"relative",zIndex:1}}>
        {/* Header */}
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{marginBottom:"3.5rem",textAlign:"center"}}>
          <p className="section-label" style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:"1rem"}}>
            <span style={{width:6,height:6,background:"var(--a)",borderRadius:"50%",display:"inline-block"}}/>
            {tag}
          </p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,5vw,5rem)",lineHeight:.9,marginBottom:"1rem"}}>
            {title1}<br/>
            <span className="stroke">{title2}</span>
            {italic && <> <span style={{fontFamily:"var(--fs)",fontStyle:"italic",fontSize:".55em",color:"var(--a)",fontWeight:400,verticalAlign:"middle",marginLeft:8}}>{italic}</span></>}
          </h2>
          {subtitle && <p style={{fontSize:15,color:"var(--m)",maxWidth:520,margin:"0 auto",lineHeight:1.7}}>{subtitle}</p>}
        </motion.div>

      </div>

        {/* Video a tutta larghezza in 16:9, sfumato solo sopra e sotto */}
        <motion.div
          initial={{opacity:0,scale:.97}}
          whileInView={{opacity:1,scale:1}}
          viewport={{once:true,margin:"-80px"}}
          transition={{duration:.8,ease:[0.16,1,0.3,1]}}
          style={{position:"relative",width:"100%"}}
        >
          <div style={{
            position:"relative",
            // 16:9 a tutta larghezza: niente ritaglio/zoom del video (che su schermi
            // alti o sul telefono lo ingrandiva molto e lo rendeva sgranato)
            aspectRatio:"16/9",
            maxHeight:"100svh",
            WebkitMaskImage:"linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
            maskImage:"linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
          }}>
            <video
              ref={videoRef}
              poster={cldVideoPoster(src, 1280) || undefined}
              loop
              muted
              playsInline
              preload="none"
              onPlay={()=>setPlaying(true)}
              onPause={()=>setPlaying(false)}
              style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
            />
          </div>

          {/* Pausa / riproduci (WCAG 2.2.2: il video è in loop) */}
          <button
            onClick={togglePlay}
            aria-label={playing?"Metti in pausa il video":"Riproduci il video"}
            style={{
              position:"absolute",bottom:"14%",right:"calc(4% + 64px)",zIndex:2,
              width:52,height:52,borderRadius:"50%",
              background:"rgba(20,20,20,0.7)",backdropFilter:"blur(10px)",
              border:".5px solid rgba(255,255,255,0.18)",color:"var(--t)",
              display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .25s",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(205,178,255,0.18)"; e.currentTarget.style.borderColor="rgba(205,178,255,0.45)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(20,20,20,0.7)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"; }}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>
            )}
          </button>

          {/* Bottone audio — fuori dal wrapper sfumato così resta nitido */}
          <button
            onClick={toggleAudio}
            aria-label={muted?"Attiva audio":"Disattiva audio"}
            style={{
              position:"absolute",bottom:"14%",right:"4%",zIndex:2,
              width:52,height:52,borderRadius:"50%",
              background:"rgba(20,20,20,0.7)",
              backdropFilter:"blur(10px)",
              border:".5px solid rgba(255,255,255,0.18)",
              color:"var(--t)",
              display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",
              transition:"all .25s",
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.background="rgba(205,178,255,0.18)";
              e.currentTarget.style.borderColor="rgba(205,178,255,0.45)";
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.background="rgba(20,20,20,0.7)";
              e.currentTarget.style.borderColor="rgba(255,255,255,0.18)";
            }}
          >
            {muted ? (
              // icona muto
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              // icona audio attivo
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                <path d="M15.54 8.46a5 5 0 010 7.07"/>
                <path d="M19.07 4.93a10 10 0 010 14.14"/>
              </svg>
            )}
          </button>
        </motion.div>
    </section>
  );
};
const MarqueeHome = () => {
  const c = useContent();
  const items = (c as any).marquee?.items || [
    "Gestione Social", "✦", "Meta Ads", "✦", "Foto & Video", "✦",
    "Branding", "✦", "Siti Web", "✦",
    "Organizzazione Eventi", "✦", "Lead Generation", "✦",
  ];
  return <Marquee items={items} />;
};

 
/* ═══════════════════════════════════════════════════════════════
   PAGE: HOME — orchestra le sezioni modulari
═══════════════════════════════════════════════════════════════ */
const PageHome = () => {
  const { go } = useRouter();
  const content = useContent();
  const hero = (content as any).hero || {};
  const manifesto = (content as any).manifesto || {};

  return (
    <>
      <HeroFlow
        onPrimaryCta={() => go("/contatti")}
        tag={hero.tag}
        description={hero.description}
        ctaPrimary={hero.cta?.primary}
      />

      {/* SCROLL STORY: telefono pinnato con i servizi */}
      <ScrollPhoneStory />

      {/* Marquee servizi */}
      <MarqueeHome />

      {/* UNA STRATEGIA: pallino che si espande */}
      <InLabOrbReveal />

      {/* SERVIZI: schede orizzontali */}
      <ServicesOrbScroll onServiceClick={(slug) => go("/" + slug)} />

      {/* MANIFESTO */}
      <section style={{padding:"8rem 2rem",borderBottom:".5px solid var(--b)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"10%",left:"-5%",width:400,height:400,background:"rgba(205,178,255,0.04)",borderRadius:"50%",filter:"blur(100px)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:"4rem",alignItems:"end"}} className="grid-1-mob">
            <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-80px"}}>
              <p className="section-label">{manifesto.tag}</p>
              <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,5vw,4.5rem)",lineHeight:.92,marginBottom:"1.5rem"}}>
                {manifesto.title?.line1}<br/>
                <span className="stroke">{manifesto.title?.line2}</span><br/>
                {manifesto.title?.line3}{" "}
                <span style={{fontFamily:"var(--fs)",fontStyle:"italic",fontWeight:400,color:"var(--a)",fontSize:".75em"}}>{manifesto.title?.accent}</span>
              </h2>
            </motion.div>
            <motion.p
              initial={{opacity:0,y:16}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:"-80px"}}
              transition={{delay:.15}}
              style={{fontSize:18,lineHeight:1.8,color:"rgba(240,237,230,0.78)",fontWeight:300,maxWidth:560,paddingBottom:"1.4rem",borderLeft:"2px solid var(--a)",paddingLeft:"1.6rem"}}
            >
              {manifesto.text}
            </motion.p>
          </div>
        </div>
      </section>

      {/* VIDEO REEL — dietro le quinte */}
      <VideoReel src="https://res.cloudinary.com/dp2l14rly/video/upload/v1779320623/0521_m03plf.mp4"/>

      {/* CLIENTI */}
      <ClientLogoStrip />

      {/* METODO: timeline con computer, fotocamera e telefono */}
      <MethodTimeline />

      {/* NUMERI */}
      <AnimatedStats />

      {/* CTA FINALE */}
      <FinalCTA onClick={() => go("/contatti")} />
    </>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   ESEMPI REALI per pagina servizio (dati in src/data/serviceExamples.ts)
═══════════════════════════════════════════════════════════════ */
const ServiceExamples = ({ slug }: { slug: string }) => {
  const content = useContent();
  const examples = (((content as any).serviceExamples || SERVICE_EXAMPLES)[slug] || []) as ServiceExample[];
  if (!examples.length) return null;
  const cases = ((content as any).cases?.items || []) as any[];
  const clients = normalizeClients(((content as any).clients?.items || []) as any[]);
  const sites = examples.filter((e): e is Extract<ServiceExample, { kind: 'site' }> => e.kind === 'site');
  const cards = examples.filter(e => e.kind !== 'site');

  return (
    <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <p className="section-label">Esempi reali</p>
        <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"3rem"}}>
          ALCUNI LAVORI<br/><span style={{fontFamily:"var(--fs)",fontStyle:"italic",fontWeight:400,color:"var(--a)",fontSize:".7em"}}>che abbiamo realizzato.</span>
        </h2>

        {sites.map(site => (
          <div key={site.url+site.title} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:"3rem",alignItems:"center",marginBottom:cards.length?"3rem":0}} className="grid-1-mob">
            <BrowserMockup url={site.url} label={site.title} image={site.image}/>
            <div>
              {site.tags && <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:"1rem"}}>{site.tags.map(t=><span key={t} className="tag tag-g" style={{fontSize:12}}>{t}</span>)}</div>}
              <h3 style={{fontFamily:"var(--fd)",fontSize:"clamp(1.8rem,3vw,2.6rem)",lineHeight:.95,marginBottom:"1rem",textTransform:"uppercase"}}>{site.title}</h3>
              <p style={{fontSize:15.5,color:"var(--m)",lineHeight:1.75,marginBottom:"1.6rem"}}>{site.desc}</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <a className="btn btn-p" href={site.url} target="_blank" rel="noreferrer">Visita il sito <ArrowUpRight size={14}/></a>
                {site.caseStudy && <Link to={`/casi-studio/${site.caseStudy}`} className="btn btn-g">Leggi il caso studio</Link>}
              </div>
            </div>
          </div>
        ))}

        {cards.length>0 && (
          <CaseCardGrid>
            {cards.map((e,i) => {
              const c = e.kind === 'client' ? clients.find((x: any) => x.id === e.clientId) : null;
              if (e.kind === 'client' && !c) return null;
              if (e.kind === 'case' && !cases.some((x: any) => x.id === e.caseId)) return null;
              const to = e.kind === 'client' ? `/cliente/${e.clientId}` : `/casi-studio/${(e as any).caseId}`;
              return e.kind === 'client'
                ? <CaseCard key={i} href={to} number={i+1} kicker="Cliente" title={c.name} italic={c.sector} meta={c.location} desc={c.summary} logo={c.logo} cta="Scheda cliente"/>
                : <CaseCard key={i} href={to} number={i+1} kicker="Caso" title={(e as any).title} desc={(e as any).desc} cta="Leggi il caso studio"/>;
            })}
          </CaseCardGrid>
        )}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: GESTIONE SOCIAL
═══════════════════════════════════════════════════════════════ */
const PageGestioneSocial = () => (
  <>
    <PageHero
      tag="Servizio — Gestione Social Media"
      h1="FAI CRESCERE"
      h1b="IL TUO BRAND"
      italic="con la giusta comunicazione social."
      sub="Non pubblichiamo solo post. Costruiamo una presenza digitale strategica che trasforma follower in clienti reali."
      cta1="Richiedi un preventivo" cta1to="/contatti"
      cta2="Vedi i risultati" cta2to="/casi-studio"
    />
    <Marquee items={["Analisi","✦","Strategia","✦","Contenuti","✦","Pubblicazione","✦","Ottimizzazione","✦","Crescita","✦"]}/>
    <StatsRow stats={[{n:"3.2M+",l:"Views generate"},{n:"47",l:"Brand gestiti"},{n:"+280%",l:"Crescita media follower"},{n:"94%",l:"Clienti rinnovano"}]}/>
 
    {/* Process */}
    <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
        <div>
          <p className="section-label">Come lavoriamo</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>IL NOSTRO<br/><span className="stroke">PROCESSO</span></h2>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.75}}>Ogni brand è unico. Per questo partiamo sempre dall'ascolto e dall'analisi — mai da template prefabbricati.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {n:1,title:"Analisi del brand e del target",desc:"Studiamo la tua azienda, il tuo pubblico, i competitor. Analizziamo cosa funziona nel tuo settore e cosa no. SWOT aziendale, benchmark di settore, audit dei canali esistenti."},
            {n:2,title:"Competitor analysis",desc:"Monitoriamo cosa fanno i tuoi concorrenti: frequenza di pubblicazione, tipo di contenuti, engagement, posizionamento. Troviamo i gap da colmare e le opportunità da sfruttare."},
            {n:3,title:"Piano editoriale & calendario",desc:"Definiamo temi, format, frequenza e obiettivi per ogni tipo di contenuto. Il calendario editoriale mensile ti tiene sempre informato su cosa pubblichiamo e perché."},
            {n:4,title:"Script, riprese e montaggio",desc:"Scriviamo gli script dei reel, organizziamo le riprese, montiamo e ottimizziamo ogni video. Gestiamo noi tutto il processo creativo — tu devi solo approvare."},
            {n:5,title:"Pubblicazione e community management",desc:"Pubblichiamo negli orari ottimali, rispondiamo ai commenti, gestiamo i messaggi. La tua community è curata ogni giorno."},
            {n:6,title:"Report mensile e ottimizzazione",desc:"Ogni mese un report completo con metriche reali: reach, engagement, follower guadagnati, clic. Aggiustiamo la strategia in base ai dati."},
          ].map(s=><ProcessStep key={s.n} {...s}/>)}
        </div>
      </div>
    </section>
 
    {/* Deliverables */}
    <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <p className="section-label">Cosa è incluso</p>
        <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"3rem"}}>COSA RICEVI<br/><span className="stroke">OGNI MESE</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"1rem"}}>
          {[
            {icon:<FileText size={20}/>,t:"Piano editoriale mensile",d:"Tutti i contenuti pianificati con anticipo"},
            {icon:<Video size={20}/>,t:"Reel e video prodotti",d:"Script, riprese, montaggio e caption"},
            {icon:<Camera size={20}/>,t:"Foto e grafiche",d:"Immagini statiche, caroselli, stories"},
            {icon:<BarChart2 size={20}/>,t:"Report mensile",d:"Dati reali, analisi e raccomandazioni"},
            {icon:<Users size={20}/>,t:"Community management",d:"Risposte a commenti e DM quotidiani"},
            {icon:<Target size={20}/>,t:"Ottimizzazione continua",d:"A/B test su format e orari di pubblicazione"},
          ].map((item,i)=>(
            <motion.div key={i} className="card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}>
              <div style={{color:"var(--a)",marginBottom:".8rem"}}>{item.icon}</div>
              <h3 style={{fontSize:14,fontWeight:500,marginBottom:".35rem"}}>{item.t}</h3>
              <p style={{fontSize:12,color:"var(--m)",lineHeight:1.6}}>{item.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
 
    <ServiceExamples slug="gestione-social"/>
    <ServiceCTA title="PRONTO A CRESCERE?" sub="Analizziamo gratuitamente il tuo profilo social e ti diciamo dove puoi migliorare." btn="Audit gratuito"/>
  </>
);
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: META ADS
═══════════════════════════════════════════════════════════════ */
const PageMetaAds = () => (
  <>
    <PageHero tag="Servizio — Meta Ads & Facebook Advertising"
      h1="CAMPAGNE CHE" h1b="CONVERTONO" italic="non solo che impressionano."
      sub="Gestiamo le tue campagne su Facebook e Instagram con metodo: obiettivi chiari, budget ottimizzato, risultati misurabili."
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi case study" cta2to="/casi-studio"
    />
    <Marquee items={["Facebook Ads","✦","Instagram Ads","✦","Retargeting","✦","Lead Generation","✦","E-commerce","✦","Brand Awareness","✦"]}/>
    <StatsRow stats={[{n:"3.2×",l:"ROAS medio clienti"},{n:"-42%",l:"Costo per lead medio"},{n:"28",l:"Campagne attive ora"},{n:"€2M+",l:"Budget gestito"}]}/>
 
    <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
        <div>
          <p className="section-label">Il metodo inlab</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>ZERO<br/><span className="stroke">SPRECHI</span></h2>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.75}}>La maggior parte dei budget pubblicitari viene sprecata su audience sbagliate e creatività inefficaci. Noi lavoriamo in modo diverso.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {n:1,title:"Audit dell'account e degli obiettivi",desc:"Analizziamo la situazione attuale: campagne precedenti, audience, pixel. Definiamo obiettivi chiari e KPI misurabili — lead, vendite, traffico, appuntamenti."},
            {n:2,title:"Ricerca audience e segmentazione",desc:"Identifichiamo i tuoi clienti ideali: dati demografici, interessi, comportamenti. Creiamo audience lookalike dai tuoi clienti migliori e strategie di retargeting avanzate."},
            {n:3,title:"Creazione delle creatività",desc:"Scriviamo i copy, progettiamo i visual, produciamo i video. Ogni elemento è pensato per fermare lo scroll e spingere all'azione. Testiamo più varianti in parallelo."},
            {n:4,title:"Lancio e monitoraggio continuo",desc:"Lancio graduale per raccogliere dati, poi ottimizzazione quotidiana del budget. Monitoraggio di CPM, CTR, CPC, CPA — ogni giorno."},
            {n:5,title:"Ottimizzazione e scaling",desc:"Quando un'inserzione funziona, la scaliamo. Quando non funziona, la sostituiamo. Il budget va sempre dove porta risultati reali."},
            {n:6,title:"Report trasparente",desc:"Ogni settimana un aggiornamento, ogni mese un report completo con tutti i numeri. Nessun dato nascosto."},
          ].map(s=><ProcessStep key={s.n} {...s}/>)}
        </div>
      </div>
    </section>
 
    <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <p className="section-label">Tipologie di campagna</p>
        <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"3rem"}}>PER OGNI<br/><span className="stroke">OBIETTIVO</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1rem"}}>
          {[
            {t:"Lead Generation",d:"Acquisisci contatti qualificati di persone interessate al tuo prodotto o servizio. Ideale per studi professionali, corsi, servizi B2B."},
            {t:"Traffico al sito",d:"Porta visitatori altamente profilati sul tuo sito o landing page. Retargeting su chi ha già visitato senza convertire."},
            {t:"Vendite e-commerce",d:"Campagne Dynamic Product Ads, retargeting carrello abbandonato, up-sell e cross-sell automatizzati."},
            {t:"Brand Awareness locale",d:"Fai conoscere la tua attività nelle città target. Perfetto per negozi, ristoranti, professionisti locali."},
            {t:"Appuntamenti",d:"Campagne specifiche per prenotazioni: ristoranti, studi medici, centri estetici, palestre."},
            {t:"App & eventi",d:"Promuovi il download di un'app o la partecipazione a un evento con campagne ottimizzate per la conversione specifica."},
          ].map((item,i)=>(
            <motion.div key={i} className="card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}>
              <h3 style={{fontSize:14,fontWeight:500,marginBottom:".5rem",color:"var(--a)"}}>{item.t}</h3>
              <p style={{fontSize:12,color:"var(--m)",lineHeight:1.65}}>{item.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
 
    <ServiceExamples slug="meta-ads"/>
    <ServiceCTA title="PAGA SOLO I RISULTATI." sub="Inizia con un budget piccolo. Scalalo quando vedi i ritorni." btn="Parliamo del tuo budget"/>
  </>
);
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: SITI WEB
═══════════════════════════════════════════════════════════════ */
const PageSitiWeb = () => (
  <>
    <PageHero tag="Servizio — Siti Web & Web App"
      h1="SITI WEB CHE" h1b="LAVORANO" italic="anche di notte."
      sub="Design curato, codice pulito, ottimizzazione SEO. Il tuo sito non è una brochure — è il miglior venditore che hai."
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi portfolio web" cta2to="/casi-studio"
    />
    <Marquee items={["Design","✦","Sviluppo","✦","SEO","✦","Performance","✦","CMS","✦","E-commerce","✦","Web App","✦"]}/>
    <StatsRow stats={[{n:"<2s",l:"Tempo di caricamento medio"},{n:"98",l:"Score PageSpeed medio"},{n:"Top 3",l:"Posizione Google media"},{n:"100%",l:"Siti mobile-first"}]}/>
 
    <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
        <div>
          <p className="section-label">Dalla strategia al codice</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>COME LO<br/><span className="stroke">COSTRUIAMO</span></h2>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.75}}>Non usiamo template. Ogni sito è progettato da zero per il tuo brand, il tuo settore e i tuoi clienti.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {n:1,title:"Discovery e brief strategico",desc:"Analizziamo la tua azienda, i competitor, il target e gli obiettivi. Definiamo l'architettura del sito, i contenuti necessari e la strategia SEO prima ancora di aprire Figma."},
            {n:2,title:"UX e architettura dell'informazione",desc:"Progettiamo il percorso dell'utente: come arriva, cosa vede, dove lo portiamo, come lo convinciamo a contattarti. Wireframe di ogni pagina."},
            {n:3,title:"UI Design e identità visiva",desc:"Design completo in Figma: tipografia, colori, componenti, responsive per mobile. Approviamo insieme ogni pagina prima di scrivere una riga di codice."},
            {n:4,title:"Sviluppo e ottimizzazione",desc:"Sviluppo su Next.js o WordPress (a seconda del progetto). Codice pulito, veloce, ottimizzato per SEO e Core Web Vitals. Integrazione con CMS per gestione autonoma."},
            {n:5,title:"SEO on-page e contenuti",desc:"Meta title, description, heading, schema markup, sitemap, velocità. Ottimizziamo ogni pagina per le keyword target — incluse quelle locali per le tue città."},
            {n:6,title:"Lancio, test e manutenzione",desc:"Test su tutti i device, controllo form e integrazioni, deploy su hosting performante. Poi supporto continuo per aggiornamenti e ottimizzazioni."},
          ].map(s=><ProcessStep key={s.n} {...s}/>)}
        </div>
      </div>
    </section>
 
    <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <p className="section-label">Tipologie di progetto</p>
        <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"3rem"}}>CHE TIPO<br/><span className="stroke">DI SITO?</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1rem"}}>
          {[
            {t:"Sito vetrina",d:"Presentazione professionale della tua attività. Design curato, SEO ottimizzato, form di contatto. Per professionisti, studi, attività locali."},
            {t:"E-commerce",d:"Vendita online con gestione prodotti, pagamenti sicuri, spedizioni, fatturazione automatica. WooCommerce o Shopify."},
            {t:"Web App",d:"Applicazioni web su misura: gestionali, booking online, portali clienti, dashboard. Sviluppo custom con Next.js."},
            {t:"Landing Page",d:"Pagina singola ottimizzata per la conversione. Per campagne ADV, lanci di prodotti, raccolta lead."},
            {t:"Blog & Magazine",d:"Siti editoriali con gestione contenuti semplice. SEO-first per portare traffico organico costante."},
            {t:"Restyling",d:"Riprogettiamo il tuo sito esistente senza perderti il posizionamento SEO che hai già costruito."},
          ].map((item,i)=>(
            <motion.div key={i} className="card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}>
              <h3 style={{fontSize:14,fontWeight:500,marginBottom:".5rem",color:"var(--a)"}}>{item.t}</h3>
              <p style={{fontSize:12,color:"var(--m)",lineHeight:1.65}}>{item.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
 
    <ServiceExamples slug="siti-web"/>
    <ServiceCTA title="IL TUO SITO ATTUALE TI PORTA CLIENTI?" sub="Se la risposta è no, possiamo cambiarlo." btn="Richiedi un'analisi gratuita"/>
  </>
);
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: AUTOMAZIONI AI
═══════════════════════════════════════════════════════════════ */
const PageAutomazioniAI = () => (
  <>
    <PageHero tag="Servizio — Automazioni con Intelligenza Artificiale"
      h1="LAVORA DI" h1b="MENO" italic="ottieni di più."
      sub="Integriamo strumenti AI nei tuoi processi aziendali. Risposte automatiche, flussi di lavoro intelligenti, chatbot. Tu ti concentri su quello che conta."
      cta1="Scopri le possibilità" cta1to="/contatti" cta2="Vedi esempi" cta2to="/casi-studio"
    />
    <Marquee items={["ChatGPT","✦","Make","✦","Zapier","✦","WhatsApp Business","✦","CRM","✦","Email automatiche","✦","Chatbot","✦"]}/>
    <StatsRow stats={[{n:"-60%",l:"Tempo su task ripetitivi"},{n:"24/7",l:"Risposte automatiche attive"},{n:"+180%",l:"Lead gestiti senza effort"},{n:"3 sett.",l:"Tempo medio implementazione"}]}/>
 
    <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
        <div>
          <p className="section-label">Automazione intelligente</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>COME<br/><span className="stroke">FUNZIONA</span></h2>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.75}}>Non vendiamo software. Analizziamo i tuoi processi e implementiamo le automazioni che hanno senso per la tua azienda — concrete e misurabili.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {n:1,title:"Analisi dei processi aziendali",desc:"Mappiamo tutti i processi della tua azienda e identifichiamo quelli ripetitivi, time-consuming o soggetti a errori umani. Questi sono i candidati ideali per l'automazione."},
            {n:2,title:"Selezione degli strumenti",desc:"Scegliamo gli strumenti giusti per il tuo caso: Make, Zapier, n8n, ChatGPT API, Manychat, ActiveCampaign. Non vendiamo una soluzione unica — troviamo quella adatta a te."},
            {n:3,title:"Progettazione dei flussi",desc:"Progettiamo ogni automazione in dettaglio: trigger, condizioni, azioni, gestione degli errori. Prima di implementare, revisioniamo insieme ogni flusso."},
            {n:4,title:"Implementazione e test",desc:"Sviluppiamo le automazioni e le testiamo con dati reali. Simuliamo tutti i casi limite per assicurarci che funzionino in ogni situazione."},
            {n:5,title:"Formazione del team",desc:"Ti formiamo su come monitorare le automazioni, fare modifiche semplici e risolvere eventuali problemi. Non vuoi dipendere da noi per ogni piccola modifica."},
            {n:6,title:"Monitoraggio e ottimizzazione",desc:"Monitoriamo le performance delle automazioni e le ottimizziamo nel tempo. Le aggiungiamo, modifichiamo o spegniamo in base all'evoluzione del tuo business."},
          ].map(s=><ProcessStep key={s.n} {...s}/>)}
        </div>
      </div>
    </section>
 
    <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <p className="section-label">Esempi concreti</p>
        <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"3rem"}}>COSA<br/><span className="stroke">AUTOMATIZZIAMO</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1rem"}}>
          {[
            {t:"Risposta automatica WhatsApp",d:"Il cliente scrive su WhatsApp alle 23:00. Il chatbot risponde, raccoglie le info, prenota l'appuntamento. Tu la mattina trovi tutto organizzato."},
            {t:"Gestione lead automatica",d:"Un lead arriva dal sito → entra nel CRM → riceve un'email di benvenuto → viene assegnato al commerciale → reminder automatico dopo 3 giorni."},
            {t:"Post social da email",d:"Scrivi una newsletter → l'automazione la trasforma in 3 varianti di post per Instagram, Facebook e LinkedIn. Un click, tre canali."},
            {t:"Fatturazione automatica",d:"Il cliente paga online → viene creata la fattura → inviata per email → aggiornato il gestionale. Zero lavoro manuale."},
            {t:"Report automatici",d:"Ogni lunedì mattina ricevi un report con i KPI della settimana: social, ads, sito, vendite. Tutto aggregato senza aprire 5 piattaforme."},
            {t:"Chatbot sul sito",d:"Assistente virtuale che risponde alle FAQ, qualifica i lead, prenota chiamate o appuntamenti. Disponibile 24/7 senza costi di personale."},
          ].map((item,i)=>(
            <motion.div key={i} className="card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"var(--a)",marginBottom:".8rem"}}/>
              <h3 style={{fontSize:14,fontWeight:500,marginBottom:".5rem"}}>{item.t}</h3>
              <p style={{fontSize:12,color:"var(--m)",lineHeight:1.65}}>{item.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
 
    <ServiceExamples slug="automazioni-ai"/>
    <ServiceCTA title="QUANTO TEMPO PERDI OGNI GIORNO?" sub="Una consulenza gratuita di 30 minuti per scoprire cosa possiamo automatizzare." btn="Prenota la consulenza"/>
  </>
);
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: SHOOTING
═══════════════════════════════════════════════════════════════ */
const PageShooting = () => (
  <>
    <PageHero tag="Servizio — Shooting Fotografico Professionale"
      h1="IMMAGINI CHE" h1b="RACCONTANO" italic="la tua storia."
      sub="La fotografia professionale non è un lusso — è un investimento. Foto mediocri costano clienti. Foto straordinarie li conquistano."
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi il portfolio" cta2to="/casi-studio"
    />
    <Marquee items={["Brand Photography","✦","Product Shooting","✦","Food Photography","✦","Corporate","✦","Reportage","✦","Social Content","✦"]}/>
    <StatsRow stats={[{n:"200+",l:"Shooting completati"},{n:"47",l:"Brand fotografati"},{n:"100%",l:"Clienti soddisfatti"},{n:"48h",l:"Consegna materiale"}]}/>
 
    <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
        <div>
          <p className="section-label">Direzione artistica</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>OGNI SCATTO<br/><span className="stroke">HA UNO SCOPO</span></h2>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.75}}>Non fotografiamo solo ciò che vediamo. Costruiamo visivamente il tuo brand attraverso ogni scatto, luce, inquadratura.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {n:1,title:"Brief creativo e mood board",desc:"Prima dello shooting analizziamo il tuo brand, il tuo target e gli obiettivi. Costruiamo un mood board con riferimenti visivi, palette colori, stile fotografico. Tutto approvato prima di partire."},
            {n:2,title:"Scouting location e organizzazione",desc:"Scegliamo le location più adatte — in studio, in esterno, nella tua sede. Pianifichiamo orari, luce, props e tutto il necessario per uno shooting fluido e produttivo."},
            {n:3,title:"Shooting diretto",desc:"Gestiamo ogni aspetto della giornata di riprese: direzione dei soggetti, luce naturale e artificiale, composizione. Lavoriamo veloce e con metodo."},
            {n:4,title:"Selezione e post-produzione",desc:"Selezioniamo i migliori scatti e li lavoriamo in post-produzione: correzione colore, ritocco, ottimizzazione per web e stampa. Stile coerente con il tuo brand."},
            {n:5,title:"Consegna e formati multipli",desc:"Consegna entro 48 ore su Google Drive. Formati ottimizzati per social (Instagram, Facebook, LinkedIn), sito web, stampa. File originali sempre disponibili."},
          ].map(s=><ProcessStep key={s.n} {...s}/>)}
        </div>
      </div>
    </section>
 
    <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <p className="section-label">Tipologie di shooting</p>
        <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"3rem"}}>PER OGNI<br/><span className="stroke">ESIGENZA</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1rem"}}>
          {[
            {t:"Brand & Corporate",d:"Foto professionali di team, uffici, produzione. Per sito web, LinkedIn, comunicati stampa, presentazioni aziendali."},
            {t:"Food Photography",d:"Ristoranti, pasticcerie, agriturismi. Foto che fanno venire appetito — e fanno prenotare."},
            {t:"Product Photography",d:"E-commerce, cataloghi, social. Prodotti su sfondo neutro o in contesto, con luce professionale."},
            {t:"Personal Branding",d:"Liberi professionisti, consulenti, coach. Foto che trasmettono autorevolezza e avvicinano le persone a te."},
            {t:"Reportage eventi",d:"Inaugurazioni, fiere, eventi aziendali. Racconto autentico senza posa artificiale."},
            {t:"Content Social",d:"Batch di contenuti ottimizzati per Instagram e Facebook. Shooting programmato mensile per non restare mai senza materiale fresco."},
          ].map((item,i)=>(
            <motion.div key={i} className="card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}>
              <h3 style={{fontSize:14,fontWeight:500,marginBottom:".5rem",color:"var(--a)"}}>{item.t}</h3>
              <p style={{fontSize:12,color:"var(--m)",lineHeight:1.65}}>{item.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
 
    <ServiceExamples slug="shooting"/>
    <ServiceCTA title="LA TUA AZIENDA MERITA FOTO MIGLIORI." sub="Prenota una call per discutere il tuo shooting." btn="Richiedi disponibilità"/>
  </>
);
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: VIDEO
═══════════════════════════════════════════════════════════════ */
const PageVideo = () => (
  <>
    <PageHero tag="Servizio — Video Production & Reels"
      h1="VIDEO CHE" h1b="FERMANO" italic="lo scroll."
      sub="Abbiamo portato brand locali a milioni di visualizzazioni organiche. Non con la fortuna — con metodo, script e produzione professionale."
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi i video" cta2to="/casi-studio"
    />
    <Marquee items={["Reel Instagram","✦","TikTok","✦","YouTube","✦","Video Istituzionale","✦","Spot Pubblicitario","✦","Documentario","✦"]}/>
    <StatsRow stats={[{n:"3.2M+",l:"Views organiche generate"},{n:"840K",l:"Record su singolo video"},{n:"12",l:"Reel virali prodotti"},{n:"×8",l:"Engagement medio vs media"}]}/>
 
    <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
        <div>
          <p className="section-label">Produzione video</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>DALLA IDEA<br/><span className="stroke">AL MONTAGGIO</span></h2>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.75}}>Ogni video virale inizia da un insight psicologico: perché le persone si fermano? Cosa le spinge a guardare fino alla fine? Costruiamo ogni video su queste risposte.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {n:1,title:"Concept e strategia",desc:"Analizziamo il tuo brand, il target e cosa funziona nel tuo settore. Definiamo il concept del video: tipo di hook, struttura narrativa, call to action. La strategia viene prima della telecamera."},
            {n:2,title:"Scrittura dello script",desc:"Scriviamo ogni parola, ogni pausa, ogni transizione. Lo script include il hook dei primi 3 secondi (il più critico), la struttura narrativa, il ritmo dei tagli e la CTA finale."},
            {n:3,title:"Pre-produzione",desc:"Location scouting, cast (se necessario), props, piano di ripresa, planning della giornata. Arrivare sul set preparati fa la differenza tra 4 ore di riprese e 12."},
            {n:4,title:"Riprese",desc:"Regia professionale, stabilizzatore, microfoni direzionali, luce aggiuntiva. Giriamo sempre materiale extra per il montaggio. Qualità cinema con attrezzatura professionale."},
            {n:5,title:"Montaggio e post-produzione",desc:"Color grading, sound design, testo animato, effetti. Il montaggio segue il ritmo psicologico giusto: tagli veloci dove serve attenzione, pause dove serve impatto."},
            {n:6,title:"Ottimizzazione per ogni piattaforma",desc:"Instagram Reel, TikTok, YouTube Shorts — ogni piattaforma ha le sue specifiche tecniche e il suo comportamento algoritmo. Ottimizziamo ogni versione."},
          ].map(s=><ProcessStep key={s.n} {...s}/>)}
        </div>
      </div>
    </section>
 
    <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <p className="section-label">Tipologie di video</p>
        <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"3rem"}}>OGNI<br/><span className="stroke">FORMATO</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1rem"}}>
          {[
            {t:"Reel & TikTok",d:"Contenuti brevi e ad alto engagement per crescere organicamente su Instagram e TikTok. Hook psicologici, ritmo preciso, ottimizzazione algoritmo."},
            {t:"Video istituzionale",d:"Presentazione professionale della tua azienda. Per il sito web, fiere, pitch con investitori, formazione interna."},
            {t:"Spot pubblicitario",d:"Video per campagne Meta Ads e Google Ads. Formato breve (15-30s) ottimizzato per la conversione, non per la visione."},
            {t:"Testimonial & Case Study",d:"I tuoi clienti soddisfatti raccontano la loro esperienza. Il contenuto più convincente che esiste — nessun copy pubblicitario lo batte."},
            {t:"Tutorial & How-to",d:"Video educativi che posizionano il tuo brand come esperto di settore. Ottimi per YouTube e per costruire fiducia prima dell'acquisto."},
            {t:"Behind the scenes",d:"La quotidianità del tuo lavoro raccontata con autenticità. Il formato che crea il legame emotivo più forte con il pubblico."},
          ].map((item,i)=>(
            <motion.div key={i} className="card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}>
              <h3 style={{fontSize:14,fontWeight:500,marginBottom:".5rem",color:"var(--a)"}}>{item.t}</h3>
              <p style={{fontSize:12,color:"var(--m)",lineHeight:1.65}}>{item.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
 
    <ServiceExamples slug="video"/>
    <ServiceCTA title="IL PROSSIMO VIDEO VIRALE È IL TUO." sub="Mostraci il tuo brand. Ti diciamo come lo raccontiamo." btn="Parliamo del tuo video"/>
  </>
);
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: SERVIZI (overview)
═══════════════════════════════════════════════════════════════ */
const PageServizi = () => {
  const {go}=useRouter();
  return (
    <>
      <PageHero tag="I nostri servizi"
        h1="TUTTO QUELLO" h1b="CHE TI SERVE" italic="per crescere online."
        sub="Dalla strategia all'esecuzione. Dal brand alla conversione. Lavoriamo su ogni touchpoint della tua comunicazione digitale."
        cta1="Parliamo del tuo progetto" cta1to="/contatti"
      />
      <AgencyStatsRow/>
      <section style={{padding:"7rem 2rem"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"1.2rem"}} className="grid-1-mob">
          {SERVICES.map((s,i)=>(
            <motion.a key={s.slug} href={"/"+s.slug} className="card" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}
              onClick={linkClick(()=>go("/"+s.slug))} style={{cursor:"pointer",padding:"2.5rem",display:"block",color:"inherit",textDecoration:"none"}}>
              <div style={{color:"var(--a)",marginBottom:"1.2rem"}}>{s.icon}</div>
              <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(1.8rem,3vw,2.5rem)",lineHeight:.95,marginBottom:".6rem",textTransform:"uppercase"}}>{s.label}</h2>
              <p style={{fontSize:14,color:"var(--m)",lineHeight:1.7,marginBottom:"1.5rem"}}>{s.short}</p>
              <span style={{fontSize:12,letterSpacing:".14em",textTransform:"uppercase",color:"var(--a)",display:"flex",alignItems:"center",gap:4}}>Scopri il servizio <ArrowUpRight size={11}/></span>
            </motion.a>
          ))}
        </div>
      </section>
      <section style={{padding:"4rem 2rem",borderTop:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <p className="section-label" style={{marginBottom:"1.5rem"}}>Agenzia di comunicazione e marketing nella tua città</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {AGENCY_CITIES.map(c=>(
              <Link key={c} to={agencyPath(c)} className="tag tag-g city-link" style={{fontSize:12,padding:"8px 16px"}}>Agenzia a {c}</Link>
            ))}
          </div>
        </div>
      </section>
      <ServiceCTA title="NON SAI DA DOVE INIZIARE?" sub="Una chiamata di 30 minuti e ti diciamo esattamente cosa ti serve." btn="Chiamata gratuita"/>
    </>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: CHI SIAMO
═══════════════════════════════════════════════════════════════ */
const PageChiSiamo = () => {
  const {go}=useRouter();
  // Testi, team e collaboratori modificabili da dashboard → Chi siamo
  const studio = ((useContent() as any).studio) || {};
  const title = Array.isArray(studio.title) ? studio.title : [];
  const initialsOf = (name = "") => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
  const team = (Array.isArray(studio.team) ? studio.team : [])
    .filter((m: any) => m?.name && m.name !== "Prince")
    .map((m: any) => ({ ...m, initials: initialsOf(m.name), skills: Array.isArray(m.skills) ? m.skills : [], edu: Array.isArray(m.edu) ? m.edu.filter(Boolean) : [] }));
  const collabIcons = [<Globe size={18}/>, <Camera size={18}/>, <Zap size={18}/>, <Star size={18}/>];
  const collaboratori = (Array.isArray(studio.collaboratori) ? studio.collaboratori : [])
    .filter((c: any) => c?.title)
    .map((c: any, i: number) => ({ icon: collabIcons[i % collabIcons.length], t: c.title, d: c.desc }));
  return (
    <>
      <PageHero tag={studio.tag || "Il laboratorio"}
        h1={title[0] || "NON SIAMO"} h1b={title[1] || "CONSULENTI"} italic={title[2] || "siamo partner."}
        sub={withDefinition(studio.description1)}
        cta1="Vedi i casi studio" cta1to="/casi-studio" cta2="Contattaci" cta2to="/contatti"
      />
 
      {/* Team */}
      <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <p className="section-label">Le persone dietro InLab</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(3rem,6vw,6rem)",lineHeight:.9,marginBottom:"4rem"}}>IL TEAM<br/><span className="stroke">INLAB</span></h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"2rem",maxWidth:980}} className="grid-1-mob">
            {team.map((p: any,i: number)=>(
              <motion.div key={i} className="card" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}
                style={{padding:"2.5rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem"}}>
                  <div style={{width:56,height:56,background:"rgba(205,178,255,0.12)",border:".5px solid rgba(205,178,255,.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fd)",fontSize:22,color:"var(--a)"}}>
                    {p.photo ? <img src={cld(p.photo, 400)} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/> : p.initials}
                  </div>
                  <div>
                    <div style={{fontSize:12,letterSpacing:".15em",textTransform:"uppercase",color:"var(--m)",marginBottom:3}}>{p.role}</div>
                    <div style={{fontSize:16,fontWeight:500}}>{authorByName(p.name) ? <Link to={authorPath(authorByName(p.name)!.slug)} style={{color:"inherit"}}>{p.name}</Link> : p.name}</div>
                  </div>
                </div>
                <p style={{fontSize:14,color:"var(--m)",lineHeight:1.75,marginBottom:"1.5rem"}}>{p.bio}{authorByName(p.name)?.inBreve ? " "+authorByName(p.name)!.inBreve : ""}</p>
                {p.edu?.length>0&&(
                  <div style={{marginBottom:"1.5rem",padding:"1rem 1.1rem",borderRadius:14,background:"rgba(205,178,255,0.06)",border:".5px solid rgba(205,178,255,0.2)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,letterSpacing:".15em",textTransform:"uppercase",color:"var(--a)",marginBottom:8}}>
                      <GraduationCap size={13}/> Formazione
                    </div>
                    {p.edu.map((e: string)=><p key={e} style={{fontSize:13.5,color:"var(--t)",lineHeight:1.55,marginBottom:4}}>{e}</p>)}
                  </div>
                )}
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {p.skills.map((s: string)=><span key={s} className="tag tag-g" style={{fontSize:12}}>{s}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
 
          {/* Collaborators */}
          <div style={{marginTop:"3rem"}}>
            <p className="section-label" style={{marginBottom:"1.5rem"}}>La nostra rete di collaboratori</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem"}}>
              {collaboratori.map((c: any,i: number)=>(
                <motion.div key={i} className="card" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}
                  style={{padding:"1.5rem"}}>
                  <div style={{color:"var(--a)",marginBottom:".7rem"}}>{c.icon}</div>
                  <div style={{fontSize:13,fontWeight:500,marginBottom:".3rem"}}>{c.t}</div>
                  <div style={{fontSize:12,color:"var(--m)",lineHeight:1.6}}>{c.d}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      <AgencyStatsRow/>
      <ServiceCTA title="LAVORIAMO INSIEME?" sub="Raccontaci il tuo progetto. Valutiamo come possiamo aiutarti." btn="Contattaci"/>
    </>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: CONTATTI
═══════════════════════════════════════════════════════════════ */
const PageContatti = () => {
  const contact = ((useContent() as any).contact) || {};
  const [form,setForm]=useState({nome:"",email:"",tel:"",azienda:"",servizio:"",msg:"",privacy:false});
  // Anti-bot: campo nascosto (le persone non lo vedono) e ora di apertura del modulo
  const [honeypot,setHoneypot]=useState("");
  // Token firmato dal server all'apertura del modulo (anti-bot sul tempo di compilazione)
  const formToken=React.useRef("");
  const getFormToken=async()=>{
    if(formToken.current) return formToken.current;
    try{ const r=await fetch('/api/lead'); const d=await r.json(); formToken.current=String(d.token||""); }catch{ /* riprova all'invio */ }
    return formToken.current;
  };
  useEffect(()=>{ getFormToken(); },[]);
  // Se il token non era arrivato all'apertura, lo chiede ora e attende il tempo minimo
  const tokenForSubmit=async()=>{
    if(formToken.current) return formToken.current;
    const t=await getFormToken();
    await new Promise(r=>setTimeout(r,3200));
    return t;
  };
  const [sent,setSent]=useState(false);
  const [error,setError]=useState("");
  const [sending,setSending]=useState(false);
  const submit=async()=>{
    if(!form.nome||!form.email||!form.msg){setError("Compila i campi obbligatori (nome, email, messaggio)."); return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){setError("Inserisci un indirizzo email valido."); return;}
    if(!form.privacy){setError("Accetta la privacy policy per inviare."); return;}
    setError("");
    setSending(true);
    try {
      // Il lead viene salvato dal server (/api/lead), con controlli anti-spam
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.nome, email: form.email, phone: form.tel, company: form.azienda,
          service: form.servizio, message: form.msg, privacy: form.privacy,
          website: honeypot, formToken: await tokenForSubmit(),
        }),
      });
      if (r.status === 429) { setError("Hai inviato troppe richieste. Riprova tra un'ora o scrivici a inlab.communication@gmail.com"); return; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setSent(true);
      gaEvent('generate_lead', { method: 'modulo_contatti', service: form.servizio || 'non indicato' });
    } catch(e){
      console.error('Save contact failed',e);
      setError("Invio non riuscito. Riprova tra qualche istante o scrivici a inlab.communication@gmail.com");
    } finally {
      setSending(false);
    }
  };
 
  return (
    <>
      <PageHero tag={contact.tag || "Parliamo del tuo progetto"}
        h1={contact.title?.[0] || "INIZIAMO"} h1b={contact.title?.[1] || "INSIEME"}
        italic={contact.accent || "senza impegno."}
        sub={contact.subtitle}
      />
 
      <section style={{padding:"6rem 2rem"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
 
          {/* Info */}
          <div>
            <p className="section-label" style={{marginBottom:"2rem"}}>Come raggiungerci</p>
            {[
              ...(contact.emails || []).map((e: any) => ({icon:<Mail size={18}/>,label:e.label || "Email",val:e.value,href:`mailto:${e.value}`})),
              ...(contact.phones || []).map((p: any) => ({icon:<Phone size={18}/>,label:p.label || "Telefono",val:p.value,href:`tel:${String(p.value).replace(/[^\d+]/g,"")}`})),
              ...(contact.location ? [{icon:<MapPin size={18}/>,label:"Sede",val:contact.location,href:""}] : []),
            ].filter((c: any) => c.val).map((c: any,i: number)=>(
              <motion.div key={i} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}}
                style={{display:"flex",gap:"1rem",alignItems:"flex-start",padding:"1.2rem 0",borderBottom:".5px solid var(--b)"}}>
                <div style={{width:40,height:40,background:"rgba(205,178,255,0.08)",border:".5px solid rgba(205,178,255,.2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--a)",flexShrink:0}}>{c.icon}</div>
                <div>
                  <div style={{fontSize:12,letterSpacing:".15em",textTransform:"uppercase",color:"var(--m)",marginBottom:2}}>{c.label}</div>
                  {c.href ? <a href={c.href} style={{fontSize:16,fontWeight:400,color:"var(--t)",textDecoration:"none"}}>{c.val}</a> : <div style={{fontSize:16,fontWeight:400}}>{c.val}</div>}
                </div>
              </motion.div>
            ))}
 
            <p style={{marginTop:"2.5rem",fontSize:14,color:"var(--m)",lineHeight:1.7,maxWidth:420}}>
              Sede a Castellaneta (TA). Lavoriamo con aziende e professionisti in tutta la Puglia e non solo: molti progetti si seguono anche da remoto.
            </p>
            <div style={{marginTop:"2rem"}}><DoveSiamo/></div>
          </div>
 
          {/* Form */}
          <motion.div className="glass" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            style={{borderRadius:28,padding:"2.5rem"}}>
            {!sent ? (
              <>
                <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,3.5vw,3rem)",lineHeight:.9,marginBottom:"2rem"}}>RACCONTACI<br/><span className="stroke">IL PROGETTO</span></h2>
                <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                  {[
                    {id:"nome",label:"Nome e cognome *",type:"text",ph:"Mario Rossi",ac:"name",req:true},
                    {id:"email",label:"Email *",type:"email",ph:"mario@azienda.it",ac:"email",req:true},
                    {id:"tel",label:"Telefono",type:"tel",ph:"+39 329 565 4319",ac:"tel",req:false},
                    {id:"azienda",label:"Azienda / Brand",type:"text",ph:"Nome della tua attività",ac:"organization",req:false},
                  ].map(f=>(
                    <div key={f.id}>
                      <label htmlFor={"f-"+f.id} style={{fontSize:12,fontWeight:500,letterSpacing:".13em",textTransform:"uppercase",color:"var(--m)",display:"block",marginBottom:6}}>{f.label}</label>
                      <input id={"f-"+f.id} className="form-field" autoComplete={f.ac} required={f.req} aria-required={f.req} type={f.type} placeholder={f.ph} value={(form as any)[f.id]} onChange={e=>setForm({...form,[f.id]:e.target.value})}
                        style={{width:"100%",background:"rgba(255,255,255,0.04)",border:".5px solid var(--b)",borderRadius:12,padding:"12px 16px",color:"var(--t)",fontSize:16,fontFamily:"var(--fb)",transition:"border-color .2s"}}
                        onFocus={e=>e.target.style.borderColor="rgba(205,178,255,.4)"}
                        onBlur={e=>e.target.style.borderColor="var(--b)"}
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="f-servizio" style={{fontSize:12,fontWeight:500,letterSpacing:".13em",textTransform:"uppercase",color:"var(--m)",display:"block",marginBottom:6}}>Servizio di interesse</label>
                    <select id="f-servizio" className="form-field" value={form.servizio} onChange={e=>setForm({...form,servizio:e.target.value})}
                      style={{width:"100%",background:"rgba(255,255,255,0.04)",border:".5px solid var(--b)",borderRadius:12,padding:"12px 16px",color:form.servizio?"var(--t)":"var(--m)",fontSize:16,fontFamily:"var(--fb)"}}>
                      <option value="">Seleziona un servizio</option>
                      {["Strategia social","Gestione social","Foto & video","Branding","Campagne Meta Ads","Sito o landing page","Organizzazione eventi","Altro"].map(s=><option key={s} value={s} style={{background:"#111"}}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-msg" style={{fontSize:12,fontWeight:500,letterSpacing:".13em",textTransform:"uppercase",color:"var(--m)",display:"block",marginBottom:6}}>Raccontaci il progetto *</label>
                    {/* campo trappola anti-bot: invisibile alle persone. Nome senza significato
                        apposta: con "website" la compilazione automatica (es. Safari) lo riempiva
                        e il server scartava in silenzio richieste vere */}
                    <input type="text" name="inlab_hp_field" value={honeypot} onChange={e=>setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true"
                      style={{position:"absolute",left:"-10000px",width:1,height:1,opacity:0}}/>
                    <textarea id="f-msg" className="form-field" required aria-required="true" rows={4} placeholder="Cosa stai cercando? Qual è il tuo obiettivo?" value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}
                      style={{width:"100%",background:"rgba(255,255,255,0.04)",border:".5px solid var(--b)",borderRadius:12,padding:"12px 16px",color:"var(--t)",fontSize:16,fontFamily:"var(--fb)",resize:"vertical",transition:"border-color .2s"}}
                      onFocus={e=>e.target.style.borderColor="rgba(205,178,255,.4)"}
                      onBlur={e=>e.target.style.borderColor="var(--b)"}
                    />
                  </div>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <input type="checkbox" id="privacy" checked={form.privacy} onChange={e=>setForm({...form,privacy:e.target.checked})}
                      style={{marginTop:3,accentColor:"var(--a)",width:14,height:14,flexShrink:0}}/>
                    <label htmlFor="privacy" style={{fontSize:12,color:"var(--m)",lineHeight:1.6,cursor:"pointer"}}>
                      Ho letto e accetto la <a href="/privacy" target="_blank" rel="noopener" style={{color:"var(--a)",textDecoration:"underline"}}>privacy policy</a>. I dati forniti saranno utilizzati esclusivamente per rispondere alla richiesta.
                    </label>
                  </div>
                  {error && <div role="alert" style={{fontSize:12,color:"#ff8888",padding:"10px 14px",background:"rgba(255,100,100,0.08)",borderRadius:10,border:".5px solid rgba(255,100,100,0.2)"}}>{error}</div>}
                  <button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"16px",fontSize:12,marginTop:"0.5rem",opacity:sending?0.6:1,pointerEvents:sending?"none":"auto"}} onClick={submit} disabled={sending}>
                    {sending ? "Invio in corso…" : <>Invia messaggio <ArrowRight size={15}/></>}
                  </button>
                </div>
              </>
            ) : (
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{textAlign:"center",padding:"2rem 0"}}>
                <div style={{width:60,height:60,background:"rgba(205,178,255,0.12)",border:".5px solid rgba(205,178,255,.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.5rem",color:"var(--a)"}}>
                  <Check size={28}/>
                </div>
                <h3 style={{fontFamily:"var(--fd)",fontSize:"2.5rem",marginBottom:".8rem"}}>MESSAGGIO INVIATO!</h3>
                <p style={{fontSize:14,color:"var(--m)",lineHeight:1.7}}>Grazie, abbiamo ricevuto la tua richiesta. Ti ricontatteremo per capire meglio il progetto e valutare la direzione più adatta.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

 
/* ═══════════════════════════════════════════════════════════════
   PAGE: CITTÀ SEO (template)
═══════════════════════════════════════════════════════════════ */
/* Pagina "Agenzia di comunicazione e marketing a {città}" (brief SEO 01/10) */
const PageAgenziaCitta = ({city}: {city: string}) => {
  const {go}=useRouter();
  const info=cityInfo(city);
  const provincia=info?.provincia||"provincia di Taranto";
  const norm=(v: string)=>String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const content=useContent() as any;
  const localClients=normalizeClients((content.clients?.items||[]) as any[]).filter((cl: any)=>norm(cl.location).includes(norm(city)));
  const localCases=((content.cases?.items||[]) as any[]).filter((cs: any)=>caseLocations(cs).some((l: string)=>norm(l)===norm(city)));
  // Le città senza clienti (EXTRA_AGENCY_CITIES) non hanno pagine per servizio:
  // i servizi puntano alle pagine generali.
  const hasServicePages=CITIES.includes(city);
  const isHome=city===BUSINESS.city;
  // Taranto: clienti e casi di tutta la provincia, raggruppati per città (brief SEO 02/10)
  const provinceGroups=city==="Taranto" ? PROVINCE_CITIES.map(c=>({
    city:c,
    cases:((content.cases?.items||[]) as any[]).filter((cs: any)=>caseLocations(cs).some((l: string)=>norm(l)===norm(c))),
    clients:normalizeClients((content.clients?.items||[]) as any[]).filter((cl: any)=>norm(cl.location).includes(norm(c))),
  })).filter(g=>g.cases.length||g.clients.length) : [];
  return (
    <>
      <section style={{padding:"10rem 2rem 5rem",position:"relative",overflow:"hidden",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>
          <p className="section-label">Agenzia a {city} — {provincia}</p>
          <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(3rem,8vw,7.5rem)",lineHeight:.9,marginBottom:"2rem",textTransform:"uppercase",fontWeight:400}}>
            Agenzia di comunicazione e marketing<br/><span style={{WebkitTextStroke:"1px var(--t)",color:"transparent"}}>a {city}</span>
          </h1>
          <p style={{maxWidth:620,fontSize:17,lineHeight:1.75,color:"var(--m)",marginBottom:"2.5rem",fontWeight:300}}>
            {isHome
              ? "InLab Communication ha sede a Castellaneta: seguiamo social, video, campagne, siti web e branding per le attività del paese e di Castellaneta Marina, con strategia su misura, lavoro fatto da noi e risultati che misuriamo insieme."
              : `InLab Communication segue social, video, campagne, siti web e branding per attività di ${city} e della ${provincia}, da Castellaneta: strategia su misura, lavoro fatto da noi e risultati che misuriamo insieme.`}
          </p>
          <button className="btn btn-p" onClick={()=>go("/contatti")}>Richiedi un preventivo gratuito <ArrowRight size={14}/></button>
        </div>
      </section>

      {info && (
        <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
          <div style={{maxWidth:900,margin:"0 auto"}}>
            <p className="section-label">Il territorio</p>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.2rem,4vw,4rem)",lineHeight:.95,marginBottom:"1.5rem",textTransform:"uppercase",fontWeight:400}}>Comunicare a {city}</h2>
            <p style={{fontSize:16,color:"var(--m)",lineHeight:1.8}}>{info.contesto}</p>
            {info.sezione && <>
              <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,3.6vw,3.4rem)",lineHeight:.95,margin:"3rem 0 1.2rem",textTransform:"uppercase",fontWeight:400}}>{info.sezione.titolo}</h2>
              <p style={{fontSize:16,color:"var(--m)",lineHeight:1.8}}>{info.sezione.testo}</p>
            </>}
          </div>
        </section>
      )}

      <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <p className="section-label">Servizi a {city}</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.2rem,4vw,4rem)",lineHeight:.95,marginBottom:"2rem",textTransform:"uppercase",fontWeight:400}}>Cosa facciamo per le attività di {city}</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,300px),1fr))",gap:"1rem"}}>
            {SERVICES.map(s=>(
              <Link key={s.slug} to={hasServicePages?`/${s.slug}-${citySlug(city)}`:`/${s.slug}`} className="glass" style={{display:"block",borderRadius:20,padding:"1.6rem",color:"var(--t)",textDecoration:"none"}}>
                <span style={{display:"flex",alignItems:"center",gap:10,color:"var(--a)",marginBottom:".8rem"}}>{s.icon}<span style={{fontFamily:"var(--fd)",fontSize:22,letterSpacing:".04em",color:"var(--t)"}}>{hasServicePages?`${s.label} a ${city}`:s.label}</span></span>
                <span style={{display:"block",fontSize:14,color:"var(--m)",lineHeight:1.6}}>{s.short}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {provinceGroups.length>0&&(
        <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <p className="section-label">Clienti in provincia di Taranto</p>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.2rem,4vw,4rem)",lineHeight:.95,marginBottom:"2rem",textTransform:"uppercase",fontWeight:400}}>Lavoriamo in tutta la provincia</h2>
            {provinceGroups.map(g=>(
              <div key={g.city} style={{marginBottom:"3rem"}}>
                <h3 style={{fontFamily:"var(--fd)",fontWeight:400,fontSize:"clamp(1.6rem,2.6vw,2.4rem)",lineHeight:1,textTransform:"uppercase",marginBottom:"1.2rem"}}>{g.city}</h3>
                <CaseCardGrid>
                  {g.cases.map((cs: any, i: number)=>(
                    <CaseCard key={"caso-"+cs.id} href={`/casi-studio/${cs.id}`} number={i+1} kicker="Caso" title={cs.client} italic={cs.title} desc={cs.problem} cta="Leggi il caso studio"/>
                  ))}
                  {g.clients.map((cl: any, i: number)=>(
                    <CaseCard key={cl.id} href={`/cliente/${cl.id}`} number={g.cases.length+i+1} kicker="Cliente" title={cl.name} italic={cl.sector} meta={cl.location} desc={cl.summary} logo={cl.logo} cta="Scheda cliente"/>
                  ))}
                </CaseCardGrid>
              </div>
            ))}
          </div>
        </section>
      )}

      {provinceGroups.length===0&&(localClients.length>0||localCases.length>0)&&(
        <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <p className="section-label">Clienti a {city}</p>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.2rem,4vw,4rem)",lineHeight:.95,marginBottom:"2rem",textTransform:"uppercase",fontWeight:400}}>I nostri lavori a {city}</h2>
            <CaseCardGrid>
              {localCases.map((cs: any, i: number)=>(
                <CaseCard key={"caso-"+cs.id} heading href={`/casi-studio/${cs.id}`} number={i+1} kicker="Caso" title={cs.client} italic={cs.title} desc={cs.problem} cta="Leggi il caso studio"/>
              ))}
              {localClients.map((cl: any, i: number)=>(
                <CaseCard key={cl.id} heading href={`/cliente/${cl.id}`} number={localCases.length+i+1} kicker="Cliente" title={cl.name} italic={cl.sector} meta={cl.location} desc={cl.summary} logo={cl.logo} cta="Scheda cliente"/>
              ))}
            </CaseCardGrid>
          </div>
        </section>
      )}

      {info && <CityDetails info={info}/>}

      {isHome && (
        <section style={{padding:"5rem 2rem",borderBottom:".5px solid var(--b)"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}><DoveSiamo/></div>
        </section>
      )}

      <section style={{padding:"5rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <p className="section-label" style={{marginBottom:"1.5rem"}}>Agenzia anche in queste città</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {AGENCY_CITIES.filter(c=>c!==city).map(c=>(
              <Link key={c} to={agencyPath(c)} className="tag tag-g city-link" style={{fontSize:12,padding:"8px 16px"}}>Agenzia a {c}</Link>
            ))}
          </div>
        </div>
      </section>

      <ServiceCTA title={`PARLIAMO DEL TUO PROGETTO A ${city.toUpperCase()}`} sub="Raccontaci la tua attività: ti diciamo da dove partire." btn="Richiedi un preventivo gratuito"/>
    </>
  );
};

// "Dove siamo" (richiesta SEO 02/10): indirizzo come testo e link a Google Maps,
// senza iframe per non appesantire la pagina.
const DoveSiamo = () => (
  <div>
    <p className="section-label">Dove siamo</p>
    <p style={{fontSize:16,color:"var(--t)",lineHeight:1.7,marginBottom:".6rem"}}>InLab Communication — {BUSINESS.street}, {BUSINESS.postalCode} {BUSINESS.city} (TA)</p>
    <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer" className="foot-link" style={{display:"inline-flex",alignItems:"center",gap:6,minHeight:44,fontSize:14,color:"var(--a)"}}>
      <MapPin size={14}/> Apri in Google Maps <ArrowUpRight size={13}/>
    </a>
  </div>
);

// Città della provincia di Taranto per la sezione "Lavoriamo in tutta la provincia"
const PROVINCE_CITIES=["Castellaneta","Palagianello","Palagiano","Mottola","Taranto","Laterza","Ginosa"];

// Città di un caso studio: quelle salvate in dashboard, altrimenti quelle del
// caso predefinito con lo stesso id (es. Paresteta: il campo in dashboard è vuoto)
const caseLocations = (cs: any): string[] =>
  Array.isArray(cs?.locations) && cs.locations.length ? cs.locations
    : ((DEFAULT_CASES.find((d: any)=>d.id===cs?.id) as any)?.locations || []);

// Settori e domanda frequente della città (testi in src/data/cities.ts)
const CityDetails = ({info}: {info: NonNullable<ReturnType<typeof cityInfo>>}) => (
  <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
    <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"start"}} className="grid-1-mob">
      <div>
        <p className="section-label">Settori</p>
        <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,3.6vw,3.4rem)",lineHeight:.95,marginBottom:"1.5rem",textTransform:"uppercase"}}>Le attività con cui lavoriamo a {info.name}</h2>
        <ul style={{listStyle:"none",padding:0,margin:0}}>
          {info.settori.map(t=>(
            <li key={t} style={{display:"flex",gap:"1rem",padding:"1rem 0",borderBottom:".5px solid var(--b)",fontSize:15,color:"var(--m)",lineHeight:1.6}}>
              <Check size={16} style={{color:"var(--a)",flexShrink:0,marginTop:4}}/>{t.charAt(0).toUpperCase()+t.slice(1)}
            </li>
          ))}
        </ul>
        {info.metodo && <>
          <h3 style={{fontFamily:"var(--fd)",fontWeight:400,fontSize:"clamp(1.6rem,2.6vw,2.4rem)",lineHeight:1,textTransform:"uppercase",margin:"2.5rem 0 1rem"}}>Come lavoriamo a {info.name}</h3>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.8}}>{info.metodo}</p>
        </>}
      </div>
      <div>
        <p className="section-label">Domanda frequente</p>
        <h3 style={{fontFamily:"var(--fs)",fontStyle:"italic",fontWeight:400,fontSize:"clamp(1.4rem,2.2vw,1.9rem)",lineHeight:1.25,color:"var(--a)",marginBottom:"1rem"}}>{info.faq.q}</h3>
        <p style={{fontSize:15,color:"var(--m)",lineHeight:1.8}}>{info.faq.a}</p>
        {info.faq2 && <>
          <h3 style={{fontFamily:"var(--fs)",fontStyle:"italic",fontWeight:400,fontSize:"clamp(1.4rem,2.2vw,1.9rem)",lineHeight:1.25,color:"var(--a)",margin:"2rem 0 1rem"}}>{info.faq2.q}</h3>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.8}}>{info.faq2.a}</p>
        </>}
      </div>
    </div>
  </section>
);

const PageCittaSEO = ({city, service}) => {
  const {go}=useRouter();
  const svc=SERVICES.find(s=>s.slug===service)||SERVICES[0];
  const cityName=CITIES.find(c=>citySlug(c)===city)||city;
  const otherCities=CITIES.filter(c=>c!==cityName);
  const norm=(v: string)=>String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const localClients=normalizeClients(((useContent() as any).clients?.items||[]) as any[])
    .filter((cl: any)=>norm(cl.location).includes(norm(cityName)));
  const localCases=(((useContent() as any).cases?.items||[]) as any[])
    .filter((cs: any)=>caseLocations(cs).some((l: string)=>norm(l)===norm(cityName)));
  const info=cityInfo(cityName);
  const provincia=info?.provincia||"provincia di Taranto";
 
  return (
    <>
      <section style={{minHeight:"85vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"9rem 2rem 5rem",position:"relative",overflow:"hidden",borderBottom:".5px solid var(--b)"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
          <div style={{position:"absolute",top:"20%",right:"10%",width:450,height:450,background:"rgba(205,178,255,0.05)",borderRadius:"50%",filter:"blur(100px)"}}/>
        </div>
        <div style={{maxWidth:1280,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
          <motion.div initial={false}
            style={{display:"inline-flex",alignItems:"center",gap:8,border:".5px solid var(--b)",borderRadius:100,padding:"5px 14px 5px 5px",marginBottom:"1.5rem"}}>
            <span style={{width:20,height:20,background:"var(--a)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}><MapPin size={10} color="#000"/></span>
            <span style={{fontSize:12,fontWeight:500,letterSpacing:".15em",textTransform:"uppercase",color:"var(--m)"}}>{svc.label} a {cityName} — InLab Communication</span>
          </motion.div>
          <motion.h1 initial={false}
            style={{fontFamily:"var(--fd)",fontSize:"clamp(3.5rem,10vw,10rem)",lineHeight:.88,marginBottom:"2rem",textTransform:"uppercase"}}>
            {svc.label.toUpperCase()}<br/>
            <span style={{WebkitTextStroke:"1px var(--t)",color:"transparent"}}>A {cityName.toUpperCase()}</span>
          </motion.h1>
          <motion.p initial={false}
            style={{maxWidth:560,fontSize:17,lineHeight:1.75,color:"var(--m)",marginBottom:"2.5rem",fontWeight:300}}>
            InLab Communication segue {svc.label} per attività di {cityName} e della {provincia}, da Castellaneta: strategia su misura, lavoro fatto da noi e risultati che misuriamo insieme.
          </motion.p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button className="btn btn-p" onClick={()=>go("/contatti")}>Richiedi un preventivo gratuito <ArrowRight size={14}/></button>
            <button className="btn btn-g" onClick={()=>go("/"+svc.slug)}>Scopri il servizio</button>
          </div>
        </div>
      </section>
 
      <AgencyStatsRow/>
 
      {/* Local content */}
      <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"start"}} className="grid-1-mob">
          <div>
            <p className="section-label">Perché scegliere InLab a {cityName}</p>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"2rem",textTransform:"uppercase"}}>
              CONOSCIAMO<br/><span className="stroke">IL TERRITORIO</span>
            </h2>
            {info ? (
              <p style={{fontSize:15,color:"var(--m)",lineHeight:1.8}}>{info.contesto}</p>
            ) : (
              <p style={{fontSize:15,color:"var(--m)",lineHeight:1.8}}>Lavoriamo con attività di {cityName} e della {provincia}: campagne e contenuti che parlano la lingua giusta alle persone giuste, nel posto giusto.</p>
            )}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {[
              {t:"Conoscenza del mercato locale",d:`Lavoriamo da Castellaneta con attività della ${provincia}: conosciamo stagionalità e abitudini del territorio.`},
              {t:"Presenza sul territorio",d:"Possiamo venire da voi per shooting, riprese o riunioni. La qualità del lavoro è superiore quando lavoriamo di persona."},
              {t:"Risultati misurabili",d:"Non vendiamo aria fritta. Definiamo insieme KPI chiari e ti mostriamo ogni mese se stiamo raggiungendo gli obiettivi."},
              {t:"Supporto continuo",d:"Parli direttamente con noi, Nicola e Ilaria."},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:"1rem",padding:"1.2rem 0",borderBottom:".5px solid var(--b)"}}>
                <Check size={16} style={{color:"var(--a)",flexShrink:0,marginTop:3}}/>
                <div>
                  <div style={{fontSize:14,fontWeight:500,marginBottom:.3+"rem"}}>{item.t}</div>
                  <div style={{fontSize:13,color:"var(--m)",lineHeight:1.65}}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Lavori reali in questa città: contenuto diverso per ogni pagina locale */}
      {(localClients.length>0||localCases.length>0)&&(
        <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <p className="section-label">Clienti a {cityName}</p>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"2.5rem"}}>I NOSTRI LAVORI<br/><span className="stroke">A {cityName.toUpperCase()}</span></h2>
            <CaseCardGrid>
              {localCases.map((cs: any, i: number)=>(
                <CaseCard key={"caso-"+cs.id} heading href={`/casi-studio/${cs.id}`} number={i+1} kicker="Caso" title={cs.client} italic={cs.title} desc={cs.problem} cta="Leggi il caso studio"/>
              ))}
              {localClients.map((cl: any, i: number)=>(
                <CaseCard key={cl.id} heading href={`/cliente/${cl.id}`} number={localCases.length+i+1} kicker="Cliente" title={cl.name} italic={cl.sector} meta={cl.location} desc={cl.summary} logo={cl.logo} cta="Scheda cliente"/>
              ))}
            </CaseCardGrid>
          </div>
        </section>
      )}

      {info && <CityDetails info={info}/>}

      {AGENCY_CITIES.includes(cityName) && (
        <section style={{padding:"3rem 2rem",borderBottom:".5px solid var(--b)"}}>
          <div style={{maxWidth:1280,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
            <p style={{fontSize:15,color:"var(--m)"}}>Ti serve più di un servizio a {cityName}?</p>
            <Link to={agencyPath(cityName)} className="btn btn-g">Tutti i servizi a {cityName} <ArrowUpRight size={13}/></Link>
          </div>
        </section>
      )}

      {/* Other cities */}
      <section style={{padding:"5rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <p className="section-label" style={{marginBottom:"1.5rem"}}>Operiamo anche in queste città</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {otherCities.map(c=>(
              <Link key={c} to={`/${svc.slug}-${citySlug(c)}`} className="tag tag-g city-link" style={{cursor:"pointer",fontSize:12,padding:"8px 16px"}}>{svc.label} a {c}</Link>
            ))}
          </div>
        </div>
      </section>
 
      <ServiceExamples slug={svc.slug}/>
      <ServiceCTA title={`VUOI CRESCERE A ${cityName.toUpperCase()}?`} sub="Parliamo del tuo business. Senza impegno." btn="Prenota una chiamata gratuita"/>
    </>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: CLIENTE
═══════════════════════════════════════════════════════════════ */
const PageCliente = ({id}: {id: string}) => {
  const {go}=useRouter();
  const c=useContent();
  const clients=normalizeClients(((c as any).clients?.items || []) as any[]);
  const client=clients.find((item: any)=>getClientId(item)===id);
  const heroImage=client?.image || client?.gallery?.[0];
  const reels=((client?.reels || []) as any[]).filter((r: any)=>hasReel(r));
  const gallery=((client?.gallery || []) as string[]).filter((u)=>/^https:\/\//.test(u));
  const linkedCase=(((c as any).cases?.items || []) as any[]).find((x: any)=>x.id===client?.caseStudy || x.clientId===client?.id);
  const links=[
    {label:"Sito web", href:client?.website || client?.url},
    {label:"Instagram", href:client?.instagram},
    {label:"Facebook", href:client?.facebook},
    {label:"TikTok", href:client?.tiktok},
    {label:"LinkedIn", href:client?.linkedin},
    {label:client?.phone ? `Tel. ${client.phone}` : "", href:client?.phone ? `tel:${String(client.phone).replace(/[^\d+]/g,"")}` : ""},
    {label:client?.address ? "Come arrivare" : "", href:client?.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${client.name} ${client.address}`)}` : ""},
  ].filter(link=>link.label && link.href && /^(https?:\/\/|tel:)/.test(String(link.href)));

  if(!client){
    return (
      <section style={{minHeight:"70vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"8rem 2rem",textAlign:"center"}}>
        <div style={{maxWidth:560}}>
          <p className="section-label">Cliente non trovato</p>
          <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(3rem,8vw,7rem)",lineHeight:.9,marginBottom:"1.2rem"}}>SCHEDA<br/><span className="stroke">NON DISPONIBILE</span></h1>
          <p style={{color:"var(--m)",lineHeight:1.7,marginBottom:"2rem"}}>La card selezionata non ha ancora una scheda cliente associata.</p>
          <button className="btn btn-p" onClick={()=>go("/")}>Torna alla home <ArrowRight size={14}/></button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section style={{minHeight:"92vh",display:"flex",alignItems:"flex-end",position:"relative",overflow:"hidden",padding:"9rem 2rem 4rem",borderBottom:".5px solid var(--b)"}}>
        {heroImage
          ? <img src={cld(heroImage, 1600)} alt={workAlt(client)} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.36}}/>
          : <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#262525 0%,#151515 58%,#2b2440 100%)"}}/>
        }
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(30,29,29,1) 0%,rgba(30,29,29,.66) 48%,rgba(30,29,29,.2) 100%)"}}/>
        <div style={{maxWidth:1280,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
          <Link to="/casi-studio" className="btn btn-g" style={{marginBottom:"2rem",fontSize:12,padding:"8px 16px"}}>
            <ArrowLeft size={12}/> Clienti
          </Link>
          <div style={{display:"grid",gridTemplateColumns:"1.25fr .75fr",gap:"4rem",alignItems:"end"}} className="grid-1-mob">
            <div>
              <p className="section-label">{client.sector || "Cliente InLab"}</p>
              <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(4rem,10vw,10rem)",lineHeight:.84,textTransform:"uppercase",marginBottom:"1.5rem"}}>{client.name}</h1>
              <p style={{maxWidth:620,fontSize:17,lineHeight:1.8,color:"rgba(240,237,230,.72)"}}>{client.summary || client.description || "Scheda cliente InLab Communication."}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px",background:"var(--b)",borderRadius:24,overflow:"hidden",border:".5px solid var(--b)"}}>
              {[
                ["Settore", client.sector],
                ["Area", client.address || client.location],
                ["Servizi", client.services?.length ? `${client.services.length}` : ""],
                ["Contenuti", reels.length || gallery.length ? [reels.length && `${reels.length} reel`, gallery.length && `${gallery.length} foto`].filter(Boolean).join(" · ") : ""],
              ].map(([label,value])=>(
                <div key={label} style={{background:"rgba(255,255,255,.03)",padding:"1.2rem"}}>
                  <p style={{fontSize:12,letterSpacing:".18em",textTransform:"uppercase",color:"var(--m)",marginBottom:8}}>{label}</p>
                  <p style={{fontSize:14,color:"var(--t)",lineHeight:1.45}}>{value || "Non indicato"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
          <div>
            {client.logo&&<img src={cld(client.logo, 400)} alt={`Logo ${client.name}`} style={{maxHeight:74,maxWidth:240,objectFit:"contain",marginBottom:"2rem",display:"block"}}/>}
            <p className="section-label">Scheda cliente</p>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>INFORMAZIONI<br/><span className="stroke">E CONTESTO</span></h2>
            <p style={{fontSize:16,color:"var(--m)",lineHeight:1.9,marginBottom:"2rem"}}>{client.description || client.summary || "Aggiungi una descrizione dalla dashboard per completare questa scheda cliente."}</p>
            {linkedCase&&(
              <Link to={`/casi-studio/${linkedCase.id}`} className="btn btn-p" style={{marginBottom:"1rem"}}>
                Leggi il caso studio <ArrowRight size={14}/>
              </Link>
            )}
            {links.length>0&&(
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {links.map(link=><a key={link.label} className="btn btn-g" href={link.href} target={link.href.startsWith("tel:") ? undefined : "_blank"} rel="noreferrer" style={{fontSize:12,padding:"9px 16px"}}>{link.label} <ArrowUpRight size={12}/></a>)}
              </div>
            )}
          </div>

          <div style={{display:"grid",gap:"1rem"}}>
            {client.services?.length>0&&(
              <div className="card">
                <p className="section-label">Servizi realizzati</p>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {client.services.map((service: string)=><span key={service} className="tag tag-a">{service}</span>)}
                </div>
              </div>
            )}
            {client.results?.length>0&&(
              <div className="card">
                <p className="section-label">Risultati</p>
                <div style={{display:"grid",gap:12}}>
                  {client.results.map((result: string,i: number)=>(
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <Check size={15} style={{color:"var(--a)",marginTop:2,flexShrink:0}}/>
                      <p style={{fontSize:14,lineHeight:1.7,color:"var(--t)"}}>{result}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {reels.length>0&&(
        <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <p className="section-label">Reel</p>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.6rem,5vw,5rem)",lineHeight:.9,marginBottom:"2.5rem"}}>CONTENUTI<br/><span className="stroke">VIRALI</span></h2>
            <ReelsGrid reels={reels}/>
          </div>
        </section>
      )}

      {gallery.length>0&&(
        <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
          <div style={{maxWidth:1280,margin:"0 auto"}}>
            <p className="section-label">Foto</p>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.6rem,5vw,5rem)",lineHeight:.9,marginBottom:"2.5rem"}}>DIETRO<br/><span className="stroke">L'OBIETTIVO</span></h2>
            <Gallery images={gallery} alt={workAlt(client)}/>
          </div>
        </section>
      )}

      <ClientLogoStrip excludeId={client.id} allClients label="Altri brand che hanno scelto InLab" />

      <ServiceCTA title={`VUOI UN PROGETTO COME ${client.name.toUpperCase()}?`} sub="Raccontaci cosa vuoi ottenere e capiamo insieme la direzione migliore." btn="Parliamone"/>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: CASI STUDIO (overview)
═══════════════════════════════════════════════════════════════ */
const PageCasiStudio = () => {
  const { go } = useRouter();
  return (
    <>
      <section style={{padding:"10rem 2rem 4rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <motion.p initial={false} className="section-label">Casi studio</motion.p>
          <motion.h1
            initial={false}
            style={{fontFamily:"var(--fd)",fontSize:"clamp(3rem,8vw,7rem)",lineHeight:.9,marginBottom:"1.5rem"}}
          >
            PROGETTI<br/><span className="stroke">RACCONTATI.</span>
          </motion.h1>
          <motion.p
            initial={false}
            style={{fontSize:16,color:"var(--m)",maxWidth:640,lineHeight:1.75}}
          >
            Non solo contenuti. Progetti costruiti con strategia, direzione creativa e obiettivi concreti — raccontati passo per passo.
          </motion.p>
        </div>
      </section>
      <ClientsWall showHeader={false} onClientClick={(id) => go(`/cliente/${id}`)} />
      <CaseStudiesSection onCaseClick={(id) => go("/casi-studio/" + id)} />
      <FinalCTA onClick={() => go("/contatti")} />
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PAGE: CASO STUDIO (singolo)
═══════════════════════════════════════════════════════════════ */
const PageCaso = ({id}: {id:string}) => {
  const { go } = useRouter();
  const onBack = () => go("/casi-studio");
  const onContact = () => go("/contatti");

  // Scroll in alto quando si arriva sulla pagina
  useEffect(() => { window.scrollTo({top:0,behavior:"instant" as any}); }, [id]);

  const page = (el: React.ReactNode) => <Suspense fallback={<div style={{minHeight:"100vh"}}/>}>{el}</Suspense>;

  const cs = (((useContent() as any).cases?.items || []) as any[]).find((x: any) => x.id === id);
  switch(Boolean(cs)){
    case true: return page(<CasePage cs={cs} onBack={onBack} onContact={onContact} onClient={(cid: string) => go(`/cliente/${cid}`)}/>);
    default:
      return (
        <section style={{padding:"10rem 2rem 8rem",minHeight:"60vh"}}>
          <div style={{maxWidth:720,margin:"0 auto",textAlign:"center"}}>
            <p className="section-label">Caso studio non trovato</p>
            <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,5vw,4rem)",lineHeight:.9,marginBottom:"1.5rem"}}>
              QUESTO PROGETTO<br/><span className="stroke">NON ESISTE.</span>
            </h1>
            <p style={{color:"var(--m)",marginBottom:"2rem"}}>Forse stavi cercando un altro dei nostri progetti.</p>
            <button className="btn btn-p" onClick={() => go("/casi-studio")}>
              Torna ai casi studio <ArrowRight size={14}/>
            </button>
          </div>
        </section>
      );
  }
};


/* ═══════════════════════════════════════════════════════════════
   PAGE: BRANDING
═══════════════════════════════════════════════════════════════ */
const PageBranding = () => (
  <>
    <PageHero tag="Servizio — Branding & Identità Visiva"
      h1="IL TUO BRAND" h1b="HA UNA VOCE?" italic="Diamogliene una memorabile."
      sub="Diamo forma all'immagine del brand con grafiche, tono, colori e contenuti coerenti. Non solo un logo — un sistema visivo che comunica chi sei prima ancora che tu parli."
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi i casi studio" cta2to="/casi-studio"
    />
    <Marquee items={["Logo & Naming","✦","Brand Identity","✦","Palette colori","✦","Tono di voce","✦","Brand guidelines","✦","Visual system","✦"]}/>
    <StatsRow stats={[{n:"100%",l:"Progetti con brand guidelines"},{n:"48h",l:"Prime proposte visive"},{n:"3+",l:"Revisioni incluse"},{n:"∞",l:"File sorgenti consegnati"}]}/>

    <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
        <div>
          <p className="section-label">Identità che dura</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>COME<br/><span className="stroke">LO COSTRUIAMO</span></h2>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.75}}>Il branding non è solo estetica. È il modo in cui le persone ti percepiscono prima ancora di leggere cosa scrivi. Partiamo da lì.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {n:1,title:"Discovery & analisi",desc:"Studiamo il tuo settore, i competitor, il tuo target. Capire il contesto è il punto di partenza per costruire un'identità che si distingua davvero."},
            {n:2,title:"Naming e concept",desc:"Se necessario, lavoriamo sul nome. Poi definiamo il concept creativo che guiderà tutte le scelte visive: forma, personalità, tono."},
            {n:3,title:"Identità visiva",desc:"Logo, palette colori, tipografia, pattern. Ogni elemento è scelto con una logica. Ti consegniamo il brand manual con tutte le istruzioni d'uso."},
            {n:4,title:"Tono di voce",desc:"Come parla il tuo brand? Definire il tono di voce significa dare coerenza a ogni testo — social, sito, campagne, comunicazioni."},
            {n:5,title:"Applicazioni pratiche",desc:"Mocku su social, biglietti da visita, firme email, template grafici. Il brand prende forma su ogni superficie dove compare."},
          ].map(s=><ProcessStep key={s.n} {...s}/>)}
        </div>
      </div>
    </section>

    <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <p className="section-label">Cosa è incluso</p>
        <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"3rem"}}>COSA RICEVI<br/><span className="stroke">DAL PROGETTO</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"1rem"}}>
          {[
            {t:"Logo principale + varianti",d:"Logo orizzontale, verticale, simbolo isolato, versione monocromatica. File vettoriali (.ai, .svg, .pdf, .png)."},
            {t:"Palette colori",d:"Colori primari e secondari con codici esatti HEX, RGB, CMYK. Per uso digitale e stampa."},
            {t:"Brand guidelines",d:"Documento con tutte le regole: spazi di rispetto, tipografia, utilizzi corretti e non corretti del logo."},
            {t:"Template social",d:"Formati grafici pronti per feed Instagram, stories, copertine. Editabili su Canva o Figma."},
            {t:"Tono di voce",d:"Documento con le linee guida comunicative: come parla il brand, cosa evita, esempi di copy giusti e sbagliati."},
            {t:"Supporto post-lancio",d:"30 giorni di supporto per applicare correttamente l'identità visiva e rispondere a dubbi implementativi."},
          ].map((item,i)=>(
            <motion.div key={i} className="card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}>
              <h3 style={{fontSize:14,fontWeight:500,marginBottom:".5rem",color:"var(--a)"}}>{item.t}</h3>
              <p style={{fontSize:12,color:"var(--m)",lineHeight:1.65}}>{item.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <ServiceExamples slug="branding"/>
    <ServiceCTA title="IL TUO BRAND MERITA UN'IDENTITÀ VERA." sub="Costruiamola insieme, con metodo e visione." btn="Parliamo del tuo brand"/>
  </>
);

const parseRoute = (route) => {
  if(route==="/") return {page:"home"};
  if(route==="/chi-siamo") return {page:"chi-siamo"};
  // Vecchie pagine del portfolio dimostrativo: come il redirect 301 del server
  if(route==="/lavori"||route==="/portfolio"||route.startsWith("/progetto/")) return {page:"casi-studio"};
  if(route==="/casi-studio") return {page:"casi-studio"};
  if(route==="/servizi") return {page:"servizi"};
  if(route==="/contatti") return {page:"contatti"};
  if(route==="/privacy") return {page:"privacy"};
  if(route==="/blog") return {page:"blog"};
  if(route.startsWith("/blog/")) return {page:"articolo",id:route.replace("/blog/","")};
  if(route.startsWith("/autori/")) return {page:"autore",id:route.replace("/autori/","")};
  // case study detail pages: /casi-studio/paresteta
  if(route.startsWith("/casi-studio/")) return {page:"caso",id:route.replace("/casi-studio/","")};
  // client detail pages: /cliente/nunzio-putignano
  if(route.startsWith("/cliente/")) return {page:"cliente",id:route.replace("/cliente/","")};
  // "Landing Page" non è più un servizio a sé (è dentro Siti Web)
  if(route==="/landing-page"||route.startsWith("/landing-page-")) return parseRoute(route.replace("/landing-page","/siti-web"));
  // service pages
  const svcSlugs=SERVICES.map(s=>s.slug);
  if(svcSlugs.includes(route.slice(1))) return {page:"service",slug:route.slice(1)};
  // "Agenzia di comunicazione e marketing a {città}"
  const agencyCity=AGENCY_CITIES.find(c=>route===agencyPath(c));
  if(agencyCity) return {page:"agency",city:agencyCity};
  // city SEO pages
  for(const svc of SERVICES){
    for(const city of CITIES){
      const expected=`/${svc.slug}-${citySlug(city)}`;
      if(route===expected) return {page:"city",service:svc.slug,city:citySlug(city)};
    }
  }
  return {page:"notfound"};
};

/* Pagina 404: indirizzo inesistente (il server risponde con stato 404) */
const PageNotFound = () => (
  <section style={{padding:"11rem 2rem 8rem",minHeight:"70vh"}}>
    <div style={{maxWidth:720,margin:"0 auto",textAlign:"center"}}>
      <p className="section-label">Errore 404</p>
      <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(3rem,8vw,6rem)",lineHeight:.9,marginBottom:"1.5rem"}}>
        PAGINA<br/><span className="stroke">NON TROVATA.</span>
      </h1>
      <p style={{color:"var(--m)",lineHeight:1.7,marginBottom:"2rem"}}>L'indirizzo che hai aperto non esiste o è stato spostato. Da qui puoi tornare alle pagine principali.</p>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <Link to="/" className="btn btn-p">Torna alla home <ArrowRight size={14}/></Link>
        <Link to="/servizi" className="btn btn-g">Servizi</Link>
        <Link to="/contatti" className="btn btn-g">Contatti</Link>
      </div>
    </div>
  </section>
);
 
const renderPage = (info) => {
  switch(info.page){
    case "cliente": return <PageCliente id={info.id}/>;
    case "caso": return <PageCaso id={info.id}/>;
    case "home": return <PageHome/>;
    case "chi-siamo": return <PageChiSiamo/>;
    case "casi-studio": return <PageCasiStudio/>;
    case "servizi": return <PageServizi/>;
    case "contatti": return <PageContatti/>;
    case "privacy": return <Suspense fallback={<div style={{minHeight:"100vh"}}/>}><PagePrivacy/></Suspense>;
    case "blog": return <Suspense fallback={<div style={{minHeight:"100vh"}}/>}><PageBlog go={navigate}/></Suspense>;
    case "autore": return <Suspense fallback={<div style={{minHeight:"100vh"}}/>}><PageAutore slug={info.id} go={navigate}/></Suspense>;
    case "articolo": return <Suspense fallback={<div style={{minHeight:"100vh"}}/>}><PageArticolo slug={info.id} go={navigate}/></Suspense>;
    case "service":
      switch(info.slug){
        case "branding": return <PageBranding/>;
        case "gestione-social": return <PageGestioneSocial/>;
        case "meta-ads": return <PageMetaAds/>;
        case "siti-web": return <PageSitiWeb/>;
        case "automazioni-ai": return <PageAutomazioniAI/>;
        case "shooting": return <PageShooting/>;
        case "video": return <PageVideo/>;
        default: return <PageHome/>;
      }
    case "city": return <PageCittaSEO city={info.city} service={info.service}/>;
    case "agency": return <PageAgenziaCitta city={info.city}/>;
    case "notfound": return <PageNotFound/>;
    default: return <PageHome/>;
  }
};
 
/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
export default function App({ ssrPath }: { ssrPath?: string } = {}) {
  // ssrPath: usato solo in fase di build per generare l'HTML statico di ogni pagina
  const [route,setRoute]=useState(() => ssrPath ?? getCurrentPath());

  useEffect(() => {
    loadContent();
    initAnalytics();
    initGa();
    const onPop = () => setRoute(getCurrentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Pageview e scroll in alto a ogni cambio pagina (la prima la traccia initAnalytics)
  const firstRoute = React.useRef(true);
  useEffect(() => {
    if (firstRoute.current) { firstRoute.current = false; return; }
    trackPageview();
    window.scrollTo({top:0,behavior:"smooth"});
  }, [route]);

  const go=useCallback((to)=>navigate(to),[]);

  // SEO: titolo, description, canonical e dati strutturati della pagina corrente
  // (ricalcolati quando arrivano i contenuti salvati dalla dashboard)
  const siteContent = useContent();
  useEffect(() => { registerContent(siteContent); applySeo(getSeo(route)); }, [route, siteContent]);
  // Google Analytics (solo con consenso): page_view dopo l'aggiornamento del titolo
  const lastGaRoute = React.useRef(route); // la prima visualizzazione la invia initGa
  useEffect(() => {
    if (lastGaRoute.current === route) return;
    const t = window.setTimeout(() => { lastGaRoute.current = route; gaPageview(); }, 50);
    return () => window.clearTimeout(t);
  }, [route]);
 
  const pageInfo=parseRoute(route);
  const mounted = React.useRef(false);
  useEffect(() => { mounted.current = true; }, []);
 
  return (
    <RouterCtx.Provider value={{route,go}}>
      <G/>
      <Navbar/>
      <AnimatePresence mode="wait">
        {/* al primo caricamento la pagina è visibile subito (niente dissolvenza
            sull'HTML statico); la transizione resta nei cambi di pagina. Le
            animazioni delle singole sezioni non cambiano. */}
        <motion.div key={route}
          initial={mounted.current ? {opacity:0,y:12} : false}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-8}}
          transition={{duration:.25}}>
          {renderPage(pageInfo)}
        </motion.div>
      </AnimatePresence>
      <Footer/>
      {/* chat e banner cookie solo nel browser, non nell'HTML statico */}
      {ssrPath === undefined && <><Chatbot/><CookieBanner/></>}
    </RouterCtx.Provider>
  );
}
