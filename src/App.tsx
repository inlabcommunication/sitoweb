import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowRight, ArrowUpRight, ArrowLeft, Menu, X,
  MapPin, Phone, Mail, Check, ChevronRight,
  TrendingUp, Target, FileText, Video, Camera,
  Globe, Zap, Layout, Users, BarChart2, Star
} from "lucide-react";
import { Chatbot } from "./components/Chatbot";
import { initAnalytics } from "./lib/analytics";
import { loadContent, useContent } from "./lib/content";
 
/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --a:#cdb2ff; --bg:#1e1d1d; --s:#262525; --b:rgba(255,255,255,0.07);
      --t:#F0EDE6; --m:rgba(240,237,230,0.38);
      --fd:'Bebas Neue',sans-serif; --fs:'DM Serif Display',serif; --fb:'DM Sans',sans-serif;
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
    .stroke{-webkit-text-stroke:1px var(--t);color:transparent}
    .stroke-a{-webkit-text-stroke:1px var(--a);color:transparent}
 
    .glass{background:rgba(255,255,255,0.03);backdrop-filter:blur(12px);border:.5px solid var(--b)}
    .card{background:var(--s);border:.5px solid var(--b);border-radius:24px;padding:2rem;transition:border-color .3s,transform .3s}
    .card:hover{border-color:rgba(205,178,255,0.3);transform:translateY(-3px)}
 
    .btn{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:100px;font-size:11px;font-weight:500;letter-spacing:.13em;text-transform:uppercase;transition:all .2s;border:none}
    .btn-p{background:var(--a);color:#000}.btn-p:hover{box-shadow:0 0 28px rgba(205,178,255,.28);transform:scale(1.03)}
    .btn-g{background:transparent;color:var(--t);border:.5px solid var(--b)}.btn-g:hover{border-color:rgba(255,255,255,.3)}
 
    .tag{display:inline-block;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase}
    .tag-a{background:rgba(205,178,255,.12);color:var(--a);border:.5px solid rgba(205,178,255,.25)}
    .tag-g{background:rgba(255,255,255,.05);color:var(--m);border:.5px solid var(--b)}
 
    .divider{border:none;border-top:.5px solid var(--b);margin:0}
 
    .nav-link{font-size:10px;font-weight:500;letter-spacing:.17em;text-transform:uppercase;color:var(--m);transition:color .25s;position:relative;padding-bottom:2px}
    .nav-link::after{content:'';position:absolute;bottom:-1px;left:0;width:0;height:1px;background:var(--a);transition:width .25s}
    .nav-link:hover,.nav-link.active{color:var(--t)}
    .nav-link:hover::after,.nav-link.active::after{width:100%}
 
    .hero-h{font-family:var(--fd);line-height:.88;letter-spacing:.02em}
    .section-label{font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--m);margin-bottom:14px}
 
    @keyframes marq{to{transform:translateX(-50%)}}
    .marq-inner{display:inline-flex;gap:2.5rem;align-items:center;padding-left:2.5rem;animation:marq 28s linear infinite}
 
    @media(max-width:768px){
      .hide-mob{display:none!important}
      .show-mob{display:flex!important}
      .grid-1-mob{grid-template-columns:1fr!important}
      .pad-mob{padding:4rem 1.25rem!important}
      .grid-col-span-1-mob{grid-column:span 1!important}
    }
    @media(max-width:480px){
      .btn{padding:11px 20px!important;font-size:10px!important}
    }
  `}</style>
);
 
/* ═══════════════════════════════════════════════════════════════
   ROUTER
═══════════════════════════════════════════════════════════════ */
const RouterCtx = React.createContext({ route: "/", go: () => {} });
const useRouter = () => React.useContext(RouterCtx);
const Link = ({ to, children, style = {}, className = "", onClick = () => {} }: any) => {
  const { go } = useRouter();
  return (
    <a style={style} className={className} onClick={e => { e.preventDefault(); go(to); onClick?.(); }}>
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
  { slug: "siti-web", icon: <Globe size={22}/>, label: "Siti Web & Web App", short: "Design e sviluppo di siti che non sono solo belli: sono veloci, ottimizzati e costruiti per portare clienti." },
  { slug: "automazioni-ai", icon: <Zap size={22}/>, label: "Automazioni AI", short: "Chatbot, workflow e processi automatizzati che fanno lavorare il tuo brand anche quando sei offline." },
  { slug: "shooting", icon: <Camera size={22}/>, label: "Foto & Shooting", short: "Foto professionali per brand, prodotti ed eventi. Perché un'immagine mediocre costa clienti. Una straordinaria li conquista." },
  { slug: "video", icon: <Video size={22}/>, label: "Video & Reels", short: "Produciamo contenuti video che le persone vogliono davvero guardare. Abbiamo portato clienti a milioni di visualizzazioni organiche." },
  { slug: "landing-page", icon: <Layout size={22}/>, label: "Landing Page", short: "Pagine progettate con un solo obiettivo: trasformare i visitatori in lead. Copy, design e A/B test inclusi." },
  { slug: "gestione-social", icon: <Star size={22}/>, label: "Branding & Identità", short: "Nome, logo, palette, tono di voce. Diamo forma al modo in cui il tuo brand viene percepito dal primo sguardo." },
];
 
const CITIES = ["Taranto","Palagiano","Palagianello","Massafra","Mottola","Castellaneta","Laterza","Ginosa"];
 
const CLIENTS = ["Ristorante Da Mario","Studio Medico Rossi","Parrucchiere Chic","Moda Pugliese","Bar Centrale","Officina Auto","Agriturismo Sole","Hotel Marina"];
const STATS_GLOBAL = [
  { n:"3.2M+", l:"Visualizzazioni generate" },
  { n:"47", l:"Clienti soddisfatti" },
  { n:"9", l:"Città servite in Puglia" },
  { n:"100%", l:"Progetti consegnati in tempo" },
];
 
/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
const Navbar = () => {
  const { route, go } = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
 
  const navLinks = [
    { to:"/chi-siamo", label:"Studio" },
    { to:"/lavori", label:"Lavori" },
    { to:"/servizi", label:"Servizi" },
    { to:"/blog", label:"Journal" },
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
            <Link key={l.to} to={l.to} className={`nav-link${route===l.to?" active":""}`}>{l.label}</Link>
          ))}
        </div>
 
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <Link to="/contatti"><button className="btn btn-p" style={{padding:"11px 22px"}}>Parliamo <ArrowUpRight size={13}/></button></Link>
          <button className="show-mob" style={{display:"none",background:"none",border:"none",color:"var(--t)",padding:4}} onClick={()=>setOpen(!open)}>
            {open?<X size={24}/>:<Menu size={24}/>}
          </button>
        </div>
      </div>
 
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
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
  return (
    <footer style={{borderTop:".5px solid var(--b)",padding:"4rem 2rem 2.5rem"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"3rem",marginBottom:"3rem"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1rem"}}>
              <div style={{width:30,height:30,background:"var(--a)",borderRadius:8,transform:"rotate(-4deg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"var(--fd)",fontSize:14,color:"#000",transform:"rotate(4deg)"}}>IL</span>
              </div>
              <span style={{fontFamily:"var(--fd)",fontSize:19,letterSpacing:".15em"}}>INLAB</span>
            </div>
            <p style={{fontSize:13,color:"var(--m)",lineHeight:1.7,maxWidth:260}}>Agenzia di comunicazione a Taranto. Strategia, creatività e tecnologia per far crescere il tuo brand in Puglia.</p>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:"1rem",fontSize:12,color:"var(--m)"}}>
              <MapPin size={12}/> Taranto, Puglia
            </div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:".16em",textTransform:"uppercase",color:"var(--m)",marginBottom:"1rem"}}>Servizi</div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
              {SERVICES.map(s=>(
                <a key={s.slug} onClick={()=>go("/"+s.slug)} style={{fontSize:13,color:"var(--m)",transition:"color .2s",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--t)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--m)"}
                >{s.label}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:".16em",textTransform:"uppercase",color:"var(--m)",marginBottom:"1rem"}}>Studio</div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
              {[["Chi siamo","/chi-siamo"],["Lavori","/lavori"],["Journal","/blog"],["Contatti","/contatti"]].map(([l,r])=>(
                <a key={r} onClick={()=>go(r)} style={{fontSize:13,color:"var(--m)",transition:"color .2s",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--t)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--m)"}
                >{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:500,letterSpacing:".16em",textTransform:"uppercase",color:"var(--m)",marginBottom:"1rem"}}>Aree servite</div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
              {CITIES.map(c=>(
                <a key={c} onClick={()=>go(`/gestione-social-${c.toLowerCase()}`)} style={{fontSize:13,color:"var(--m)",transition:"color .2s",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--t)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--m)"}
                >{c}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{borderTop:".5px solid var(--b)",paddingTop:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
          <p style={{fontSize:11,fontFamily:"monospace",color:"rgba(255,255,255,.15)",letterSpacing:".08em"}}>© 2025 InLab Communication — Taranto, Puglia</p>
          <div style={{display:"flex",gap:"1.5rem"}}>
            {["Instagram","LinkedIn","Behance"].map(s=>(
              <a key={s} href="#" style={{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--m)",transition:"color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--t)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--m)"}
              >{s}</a>
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
 
const PageHero = ({tag,h1,h1b,italic,sub,cta1,cta1to,cta2,cta2to,accent=false}: any) => {
  const {go}=useRouter();
  return (
    <section style={{minHeight:"92vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"9rem 2rem 5rem",position:"relative",overflow:"hidden",borderBottom:".5px solid var(--b)"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"20%",right:"8%",width:480,height:480,background:"rgba(205,178,255,0.055)",borderRadius:"50%",filter:"blur(110px)"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"5%",width:320,height:320,background:"rgba(255,255,255,0.018)",borderRadius:"50%",filter:"blur(80px)"}}/>
      </div>
      <div style={{maxWidth:1280,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
        {tag && <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.05}}
          style={{display:"inline-flex",alignItems:"center",gap:8,border:".5px solid var(--b)",borderRadius:100,padding:"5px 14px 5px 5px",marginBottom:"2rem"}}>
          <span style={{width:20,height:20,background:"var(--a)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#000",fontWeight:700}}>✦</span>
          <span style={{fontSize:10,fontWeight:500,letterSpacing:".15em",textTransform:"uppercase",color:"var(--m)"}}>{tag}</span>
        </motion.div>}
        <motion.h1 initial={{opacity:0,y:36}} animate={{opacity:1,y:0}} transition={{delay:.12}}
          className="hero-h" style={{fontSize:"clamp(3.8rem,11vw,11.5rem)",marginBottom:"2.5rem"}}>
          {h1}<br/>
          <span className="stroke">{h1b}</span>
          {italic && <><br/><span style={{fontFamily:"var(--fs)",fontStyle:"italic",fontWeight:400,fontSize:"0.76em",color:"var(--a)"}}>{italic}</span></>}
        </motion.h1>
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.22}}
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
          <div style={{fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"var(--m)",marginTop:6}}>{s.l}</div>
        </motion.div>
      ))}
    </div>
  </section>
);
 
const ClientLogos = () => {
  const content = useContent();
  const clients = content.clients?.items || CLIENTS.map(c => ({ name: c, url: '', logo: '' }));
  const tag = content.clients?.tag || 'Alcuni dei nostri clienti';
  return (
  <section style={{padding:"5rem 2rem",borderBottom:".5px solid var(--b)"}}>
    <div style={{maxWidth:1280,margin:"0 auto"}}>
      <p className="section-label" style={{textAlign:"center",marginBottom:"2.5rem"}}>{tag}</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"1rem"}}>
        {clients.map((c: any,i: number)=>(
          <motion.div key={i} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:i*.05}}
            style={{background:"var(--s)",border:".5px solid var(--b)",borderRadius:14,padding:"1.2rem",textAlign:"center",fontSize:12,color:"var(--m)",cursor:c.url?"pointer":"default"}}
            onClick={()=>c.url&&window.open(c.url,'_blank')}>
            {c.logo ? (
              <img src={c.logo} alt={c.name} style={{width:36,height:36,objectFit:"contain",margin:"0 auto 8px",display:"block"}} onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />
            ) : (
              <div style={{width:36,height:36,background:"rgba(205,178,255,0.08)",borderRadius:"50%",margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"var(--a)",fontFamily:"var(--fd)"}}>
                {c.name?.[0]}
              </div>
            )}
            {c.name}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};
 
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
   PAGE: HOME
═══════════════════════════════════════════════════════════════ */
const PageHome = () => {
  const {go}=useRouter();
  return (
    <>
      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"9rem 2rem 6rem",position:"relative",overflow:"hidden",borderBottom:".5px solid var(--b)"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
          <div style={{position:"absolute",top:"18%",right:"8%",width:520,height:520,background:"rgba(205,178,255,0.055)",borderRadius:"50%",filter:"blur(120px)"}}/>
          <div style={{position:"absolute",bottom:"12%",left:"4%",width:380,height:380,background:"rgba(255,255,255,0.018)",borderRadius:"50%",filter:"blur(80px)"}}/>
        </div>
        <div style={{maxWidth:1280,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.08}}
            style={{display:"inline-flex",alignItems:"center",gap:8,border:".5px solid var(--b)",borderRadius:100,padding:"5px 14px 5px 5px",marginBottom:"2rem"}}>
            <span style={{width:20,height:20,background:"var(--a)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}><MapPin size={10} color="#000"/></span>
            <span style={{fontSize:10,fontWeight:500,letterSpacing:".15em",textTransform:"uppercase",color:"var(--m)"}}>Laboratorio creativo — Taranto, Puglia</span>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:.16}}
            style={{fontFamily:"var(--fd)",fontSize:"clamp(3.5rem,10vw,11rem)",lineHeight:.87,letterSpacing:".01em",marginBottom:"2.5rem"}}>
            COMUNICAZIONE<br/><span style={{WebkitTextStroke:"1px var(--t)",color:"transparent"}}>CHE SI FA</span><br/>
            <span style={{fontFamily:"var(--fs)",fontStyle:"italic",fontWeight:400,fontSize:".72em",color:"var(--a)"}}>riconoscere.</span>
          </motion.h1>
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.28}}
            style={{display:"flex",flexWrap:"wrap",gap:"2rem",alignItems:"flex-end",justifyContent:"space-between"}}>
            <p style={{maxWidth:460,fontSize:16,lineHeight:1.85,color:"var(--m)",fontWeight:300}}>
              Un laboratorio creativo che unisce strategia, contenuti foto/video, social media, branding e campagne digitali per aiutarti a comunicare meglio online.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button className="btn btn-p" onClick={()=>go("/contatti")}>Raccontaci il tuo progetto <ArrowRight size={14}/></button>
              <button className="btn btn-g" onClick={()=>go("/lavori")}>Guarda i nostri lavori</button>
            </div>
          </motion.div>
        </div>
      </section>

      <Marquee items={["Gestione Social","✦","Meta Ads","✦","Foto & Video","✦","Branding","✦","Siti Web","✦","Landing Page","✦","Organizzazione Eventi","✦"]}/>

      <StatsRow stats={STATS_GLOBAL}/>

      {/* MANIFESTO */}
      <section style={{padding:"8rem 2rem",borderBottom:".5px solid var(--b)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",width:600,height:600,background:"rgba(205,178,255,0.03)",borderRadius:"50%",filter:"blur(100px)",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{maxWidth:820}}>
            <motion.p className="section-label" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} style={{marginBottom:"2rem"}}>Il nostro manifesto</motion.p>
            <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,5vw,5.5rem)",lineHeight:.9,marginBottom:"2.5rem"}}>
              NON CREIAMO CONTENUTI<br/>PER RIEMPIRE<br/><span style={{WebkitTextStroke:"1px var(--a)",color:"transparent"}}>UN CALENDARIO.</span><br/>
              <span style={{fontFamily:"var(--fs)",fontStyle:"italic",color:"var(--a)",fontWeight:400,fontSize:".8em"}}>Costruiamo direzioni.</span>
            </motion.h2>
            <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.1}}
              style={{fontSize:17,lineHeight:1.85,color:"var(--m)",fontWeight:300,maxWidth:620}}>
              Ogni post, video, foto o campagna deve avere un motivo per esistere: raccontare il valore del brand, parlare alle persone giuste, creare fiducia e rendere la comunicazione più riconoscibile. Non vendiamo pacchetti. Costruiamo identità.
            </motion.p>
          </div>
        </div>
      </section>

      {/* SERVIZI */}
      <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"3.5rem",flexWrap:"wrap",gap:"1rem"}}>
            <div>
              <p className="section-label">Cosa facciamo</p>
              <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(3rem,6vw,6rem)",lineHeight:.9}}>SERVIZI<br/><span className="stroke">PRINCIPALI</span></h2>
            </div>
            <button className="btn btn-g" onClick={()=>go("/servizi")}>Tutti i servizi <ArrowRight size={13}/></button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1rem"}} className="grid-1-mob">
            {SERVICES.slice(0,6).map((s,i)=>(
              <motion.div key={i} className="card" initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}
                onClick={()=>go("/"+s.slug)} style={{cursor:"pointer"}}>
                <div style={{color:"var(--a)",marginBottom:"1rem"}}>{s.icon}</div>
                <h3 style={{fontSize:15,fontWeight:500,marginBottom:".5rem"}}>{s.label}</h3>
                <p style={{fontSize:13,color:"var(--m)",lineHeight:1.7,marginBottom:"1.2rem"}}>{s.short}</p>
                <span style={{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--a)",display:"flex",alignItems:"center",gap:4}}>Scopri <ArrowUpRight size={11}/></span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LAVORI */}
      <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"3rem",flexWrap:"wrap",gap:"1rem"}}>
            <div>
              <p className="section-label">Progetti selezionati</p>
              <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(3rem,6vw,6rem)",lineHeight:.9}}>LAVORI<br/><span className="stroke">SELEZIONATI</span></h2>
              <p style={{fontSize:13,color:"var(--m)",marginTop:"1rem",maxWidth:440}}>Foto, video, campagne e identità visive che raccontano il nostro modo di lavorare.</p>
            </div>
            <button className="btn btn-g" onClick={()=>go("/lavori")}>Vedi tutto <ArrowRight size={13}/></button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1rem"}} className="grid-1-mob">
            {[
              {title:"Reel Virale — Ristorante locale",tag:"Video & Reels",stat:"840K views",bg:"#2a2828",large:true,desc:"Contenuto organico prodotto in una sola giornata di riprese."},
              {title:"E-commerce — Moda Pugliese",tag:"Siti Web",stat:"+340% conversioni",bg:"#252628",large:false,desc:"Design e sviluppo completo con ottimizzazione SEO."},
              {title:"Meta Ads — Negozio Sport",tag:"Advertising",stat:"3.2× ROAS",bg:"#282525",large:false,desc:"Campagna Meta con targeting localizzato su Taranto."},
              {title:"Brand Identity — Studio Medico",tag:"Branding",stat:"Rebranding completo",bg:"#252726",large:true,desc:"Logo, palette, tono di voce e materiali di comunicazione."},
            ].map((p,i)=>(
              <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}
                onClick={()=>go("/lavori")}
                style={{gridColumn:p.large?"span 2":"span 1",minHeight:p.large?300:220,background:p.bg,borderRadius:24,border:".5px solid var(--b)",padding:"2rem",display:"flex",flexDirection:"column",justifyContent:"space-between",cursor:"pointer",transition:"border-color .3s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.15)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}
              >
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <span className="tag tag-a">{p.tag}</span>
                  <span className="tag tag-g">{p.stat}</span>
                </div>
                <div>
                  <p style={{fontSize:12,color:"var(--m)",marginBottom:"0.7rem"}}>{p.desc}</p>
                  <h3 style={{fontFamily:"var(--fd)",fontSize:p.large?"clamp(1.8rem,3.5vw,3rem)":"clamp(1.4rem,2.5vw,2rem)",lineHeight:.95,textTransform:"uppercase",marginBottom:".7rem"}}>{p.title}</h3>
                  <span style={{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--m)",display:"flex",alignItems:"center",gap:4}}>Scopri il progetto <ArrowUpRight size={11}/></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* METODO */}
      <section style={{padding:"8rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
            <div>
              <p className="section-label">Come lavoriamo</p>
              <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(3rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>IL NOSTRO<br/><span className="stroke">METODO</span></h2>
              <p style={{fontSize:14,color:"var(--m)",lineHeight:1.75}}>Non lavoriamo a caso. Ogni progetto segue un percorso preciso, costruito per produrre risultati misurabili e comunicazione riconoscibile.</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              {[
                {n:"01",title:"Analisi",desc:"Partiamo dal brand, dal pubblico, dal mercato e dagli obiettivi. Prima di creare qualsiasi contenuto, capiamo chi sei, a chi parli e cosa vuoi ottenere."},
                {n:"02",title:"Direzione creativa",desc:"Definiamo tono di voce, stile visivo, contenuti e messaggi chiave. Ogni progetto ha un'identità precisa, non un template."},
                {n:"03",title:"Produzione",desc:"Realizziamo foto, video, grafiche, copy e materiali digitali con cura artigianale. Ogni contenuto deve avere un motivo per esistere."},
                {n:"04",title:"Pubblicazione & campagne",desc:"Gestiamo i canali social, pubblichiamo con strategia e attiviamo campagne quando servono per amplificare i risultati."},
                {n:"05",title:"Ottimizzazione",desc:"Leggiamo i dati, capiamo cosa funziona e miglioriamo la strategia ogni mese. La comunicazione è un processo, non un prodotto."},
              ].map((step,i)=>(
                <motion.div key={i} initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.08}}
                  style={{display:"flex",gap:"2rem",padding:"1.75rem",border:".5px solid var(--b)",borderRadius:20,transition:"border-color .3s,background .3s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(205,178,255,.3)";e.currentTarget.style.background="rgba(205,178,255,.03)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b)";e.currentTarget.style.background="transparent"}}
                >
                  <div style={{fontFamily:"var(--fd)",fontSize:"2.5rem",color:"rgba(205,178,255,.2)",flexShrink:0,lineHeight:1}}>{step.n}</div>
                  <div>
                    <div style={{fontSize:15,fontWeight:500,marginBottom:"0.4rem"}}>{step.title}</div>
                    <p style={{fontSize:13,color:"var(--m)",lineHeight:1.75}}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ClientLogos/>

      {/* CITTA */}
      <section style={{padding:"5rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <p className="section-label" style={{display:"flex",alignItems:"center",gap:6,marginBottom:"1.5rem"}}><MapPin size={12}/> Operiamo in tutta la provincia di Taranto</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.7rem"}}>
            {CITIES.map((c,i)=>(
              <motion.div key={c} initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}}>
                <button className="tag tag-g" style={{cursor:"pointer",transition:"all .2s",padding:"8px 16px",fontSize:12}}
                  onClick={()=>go(`/gestione-social-${c.toLowerCase()}`)}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(205,178,255,.35)";e.currentTarget.style.color="var(--a)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b)";e.currentTarget.style.color="var(--m)"}}
                >{c}</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section style={{padding:"8rem 2rem"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div className="glass" style={{borderRadius:40,padding:"5rem 4rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,right:0,width:500,height:500,background:"rgba(205,178,255,0.05)",borderRadius:"50%",filter:"blur(100px)",pointerEvents:"none"}}/>
            <div style={{position:"relative",zIndex:1}}>
              <p className="section-label" style={{marginBottom:"1.5rem",display:"flex",justifyContent:"center"}}>Iniziamo a lavorare insieme</p>
              <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,6vw,6rem)",lineHeight:.9,marginBottom:"1.5rem"}}>HAI UN BRAND,<br/>MA NON SAI COME<br/><span style={{WebkitTextStroke:"1px var(--a)",color:"transparent"}}>RACCONTARLO ONLINE?</span></h2>
              <p style={{fontSize:16,color:"var(--m)",marginBottom:"2.5rem",maxWidth:520,margin:"0 auto 2.5rem"}}>Partiamo da una consulenza: capiamo dove sei, cosa vuoi comunicare e quale direzione può renderti più riconoscibile.</p>
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn btn-p" style={{fontSize:13,padding:"16px 36px"}} onClick={()=>go("/contatti")}>Parliamone <ArrowRight size={15}/></button>
                <button className="btn btn-g" style={{fontSize:13,padding:"16px 36px"}} onClick={()=>go("/lavori")}>Vedi i lavori</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
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
      cta2="Vedi i risultati" cta2to="/lavori"
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
 
    <ClientLogos/>
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
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi case study" cta2to="/lavori"
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
 
    <ClientLogos/>
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
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi portfolio web" cta2to="/lavori"
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
 
    <ClientLogos/>
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
      cta1="Scopri le possibilità" cta1to="/contatti" cta2="Vedi esempi" cta2to="/lavori"
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
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi il portfolio" cta2to="/lavori"
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
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi i video" cta2to="/lavori"
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
 
    <ServiceCTA title="IL PROSSIMO VIDEO VIRALE È IL TUO." sub="Mostraci il tuo brand. Ti diciamo come lo raccontiamo." btn="Parliamo del tuo video"/>
  </>
);
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: LANDING PAGE
═══════════════════════════════════════════════════════════════ */
const PageLandingPage = () => (
  <>
    <PageHero tag="Servizio — Landing Page ad Alta Conversione"
      h1="PAGINE CHE" h1b="CONVERTONO" italic="non solo informano."
      sub="Una landing page non è un sito web ridotto. È una macchina di conversione progettata con un obiettivo unico: trasformare i visitatori in lead o clienti."
      cta1="Richiedi un preventivo" cta1to="/contatti" cta2="Vedi esempi" cta2to="/lavori"
    />
    <Marquee items={["Lead Generation","✦","Vendite","✦","Prenotazioni","✦","Download","✦","Iscrizioni","✦","A/B Testing","✦"]}/>
    <StatsRow stats={[{n:"12%",l:"Conversion rate medio"},{n:"×4",l:"Vs sito standard"},{n:"48h",l:"Tempo di consegna"},{n:"100%",l:"Mobile-first"}]}/>
 
    <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
        <div>
          <p className="section-label">Psicologia della conversione</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:.9,marginBottom:"1.5rem"}}>OGNI ELEMENTO<br/><span className="stroke">HA UNO SCOPO</span></h2>
          <p style={{fontSize:15,color:"var(--m)",lineHeight:1.75}}>Utilizziamo principi di psicologia comportamentale, copywriting persuasivo e design orientato alla conversione. Niente è casuale.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {n:1,title:"Definizione dell'obiettivo",desc:"Una landing page = un obiettivo. Che sia un form di contatto, un acquisto, una prenotazione o un download — tutto il design è costruito intorno a quella singola azione."},
            {n:2,title:"Ricerca e copywriting",desc:"Il copy viene prima del design. Studiamo la voce del cliente ideale, le obiezioni più comuni, i benefici che contano davvero. Scriviamo headline e body copy che parlano direttamente al tuo pubblico."},
            {n:3,title:"Design persuasivo",desc:"Gerarchia visiva chiara, CTA prominente, social proof ben posizionata, rimozione di ogni elemento che distrae dalla conversione. Design che guida, non che decora."},
            {n:4,title:"Sviluppo veloce e performante",desc:"Sviluppo su Next.js o Webflow. PageSpeed 95+, caricamento <2s, ottimizzazione per Core Web Vitals. La velocità impatta direttamente la conversion rate."},
            {n:5,title:"A/B Testing",desc:"Testiamo headline alternative, varianti di CTA, posizionamento della social proof. Piccoli cambiamenti, grandi differenze. Ottimizzazione basata sui dati reali, non sulle opinioni."},
            {n:6,title:"Analytics e ottimizzazione",desc:"Google Analytics 4, Hotjar per heatmap, tracciamento conversioni preciso. Ogni settimana i dati, ogni mese l'ottimizzazione."},
          ].map(s=><ProcessStep key={s.n} {...s}/>)}
        </div>
      </div>
    </section>
 
    <ServiceCTA title="STAI PAGANDO CLICK CHE NON CONVERTONO?" sub="Mandiamo traffico su una landing ottimizzata e cambia tutto." btn="Costruiamo la tua landing"/>
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
      <StatsRow stats={STATS_GLOBAL}/>
      <section style={{padding:"7rem 2rem"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"1.2rem"}} className="grid-1-mob">
          {SERVICES.map((s,i)=>(
            <motion.div key={s.slug} className="card" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}
              onClick={()=>go("/"+s.slug)} style={{cursor:"pointer",padding:"2.5rem"}}>
              <div style={{color:"var(--a)",marginBottom:"1.2rem"}}>{s.icon}</div>
              <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(1.8rem,3vw,2.5rem)",lineHeight:.95,marginBottom:".6rem",textTransform:"uppercase"}}>{s.label}</h2>
              <p style={{fontSize:14,color:"var(--m)",lineHeight:1.7,marginBottom:"1.5rem"}}>{s.short}</p>
              <span style={{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--a)",display:"flex",alignItems:"center",gap:4}}>Scopri il servizio <ArrowUpRight size={11}/></span>
            </motion.div>
          ))}
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
  return (
    <>
      <PageHero tag="Il laboratorio"
        h1="NON SIAMO" h1b="CONSULENTI" italic="siamo partner."
        sub="InLab nasce dall'incontro tra due prospettive complementari. La mente che analizza. La voce che emoziona. Un laboratorio dove strategia e creatività si incontrano ogni giorno."
        cta1="Vedi i nostri lavori" cta1to="/lavori" cta2="Contattaci" cta2to="/contatti"
      />
 
      {/* Team */}
      <section style={{padding:"7rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <p className="section-label">Le persone dietro InLab</p>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(3rem,6vw,6rem)",lineHeight:.9,marginBottom:"4rem"}}>IL TEAM<br/><span className="stroke">INLAB</span></h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem"}} className="grid-1-mob">
            {[
              {initials:"NN",role:"Psicologo del marketing",name:"Strategia & Analisi",bio:"Studio il comportamento d'acquisto delle persone da oltre 5 anni. Prima di creare qualsiasi contenuto, analizo chi è il tuo cliente, perché compra, cosa lo frena. La strategia non è un'opinione — è una conclusione basata su dati.",skills:["Analisi comportamentale","Posizionamento brand","Strategia di comunicazione","Ricerca di mercato","SWOT e competitor analysis"]},
              {initials:"NN",role:"Content Creator & Direttrice Artistica",name:"Creatività & Visual",bio:"Trasformo strategie in contenuti che le persone vogliono davvero guardare. Dalla regia di un reel alla direzione fotografica di uno shooting, mi occupo di tutto ciò che appare — perché l'estetica non è un dettaglio, è un messaggio.",skills:["Produzione video & reels","Direzione artistica","Fotografia di brand","Script & storytelling","Social media content"]},
            ].map((p,i)=>(
              <motion.div key={i} className="card" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}
                style={{padding:"2.5rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem"}}>
                  <div style={{width:56,height:56,background:"rgba(205,178,255,0.12)",border:".5px solid rgba(205,178,255,.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fd)",fontSize:22,color:"var(--a)"}}>
                    {p.initials}
                  </div>
                  <div>
                    <div style={{fontSize:10,letterSpacing:".15em",textTransform:"uppercase",color:"var(--m)",marginBottom:3}}>{p.role}</div>
                    <div style={{fontSize:16,fontWeight:500}}>{p.name}</div>
                  </div>
                </div>
                <p style={{fontSize:14,color:"var(--m)",lineHeight:1.75,marginBottom:"1.5rem"}}>{p.bio}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {p.skills.map(s=><span key={s} className="tag tag-g" style={{fontSize:11}}>{s}</span>)}
                </div>
              </motion.div>
            ))}
          </div>
 
          {/* Collaborators */}
          <div style={{marginTop:"3rem"}}>
            <p className="section-label" style={{marginBottom:"1.5rem"}}>La nostra rete di collaboratori</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem"}}>
              {[
                {icon:<Globe size={18}/>,t:"Web Developer",d:"Sviluppatori front-end e back-end selezionati per ogni tipo di progetto. React, Next.js, WordPress."},
                {icon:<Camera size={18}/>,t:"Fotografi partner",d:"Professionisti locali per shooting che richiedono attrezzatura specifica o copertura estesa."},
                {icon:<Zap size={18}/>,t:"AI & Automation specialist",d:"Esperti di Make, Zapier e sviluppo custom per automazioni complesse."},
                {icon:<Star size={18}/>,t:"Copywriter",d:"Per progetti che richiedono copy specializzato in settori tecnici o legali."},
              ].map((c,i)=>(
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
 
      <StatsRow stats={STATS_GLOBAL}/>
      <ServiceCTA title="LAVORIAMO INSIEME?" sub="Raccontaci il tuo progetto. Valutiamo come possiamo aiutarti." btn="Contattaci"/>
    </>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: LAVORI
═══════════════════════════════════════════════════════════════ */
const PageLavori = () => {
  const {go}=useRouter();
  const [filter,setFilter]=useState("tutti");
  const works=[
    {title:"Reel Virale — Ristorante Da Mario",cat:"video",tag:"Video & Reels",stat:"840K views",metric:"Organico",bg:"#2a2927",large:true},
    {title:"E-commerce — Moda Pugliese",cat:"web",tag:"Siti Web",stat:"+340% conversioni",metric:"Web",bg:"#252628"},
    {title:"Meta Ads — Negozio Sport",cat:"ads",tag:"Meta Ads",stat:"3.2× ROAS",metric:"Advertising",bg:"#2a2525"},
    {title:"Shooting — Agriturismo Sole",cat:"foto",tag:"Shooting",stat:"Portfolio completo",metric:"Foto",bg:"#252826"},
    {title:"Rebranding — Studio Medico",cat:"brand",tag:"Brand Identity",stat:"Identità rinnovata",metric:"Design",bg:"#26252c"},
    {title:"Social Strategy — Bar Centrale",cat:"social",tag:"Gestione Social",stat:"+180% engagement",metric:"Social",bg:"#2a2524"},
    {title:"Landing Page — Studio Legale",cat:"web",tag:"Landing Page",stat:"12% conv. rate",metric:"Web",bg:"#252628"},
    {title:"TikTok Campaign — Parrucchiere",cat:"video",tag:"Video",stat:"1.1M views",metric:"Organico",bg:"#282525",large:true},
  ];
  const cats=["tutti","video","web","ads","foto","social","brand"];
  const visible=filter==="tutti"?works:works.filter(w=>w.cat===filter);
 
  return (
    <>
      <PageHero tag="Portfolio & Case Study"
        h1="RISULTATI" h1b="REALI" italic="non solo belle immagini."
        sub="Ogni progetto ha una storia. Un problema da risolvere, una strategia da applicare, un risultato da misurare. Ecco i nostri."
        cta1="Inizia un progetto" cta1to="/contatti"
      />
 
      <StatsRow stats={[{n:"3.2M+",l:"Views generate"},{n:"47",l:"Clienti"},{n:"12",l:"Reel virali"},{n:"€2M+",l:"Budget ads gestito"}]}/>
 
      {/* Client logos */}
      <ClientLogos/>
 
      {/* Portfolio grid */}
      <section style={{padding:"6rem 2rem"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2.5rem",flexWrap:"wrap",gap:"1rem"}}>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4vw,4rem)",lineHeight:.9}}>TUTTI I<br/><span className="stroke">PROGETTI</span></h2>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {cats.map(c=>(
                <button key={c} onClick={()=>setFilter(c)}
                  style={{padding:"7px 16px",borderRadius:100,border:".5px solid",borderColor:filter===c?"var(--a)":"var(--b)",
                  background:filter===c?"rgba(205,178,255,0.1)":"transparent",color:filter===c?"var(--a)":"var(--m)",
                  fontSize:10,fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",fontFamily:"var(--fb)",transition:"all .2s"}}>
                  {c==="tutti"?"Tutti":c==="ads"?"Meta Ads":c.charAt(0).toUpperCase()+c.slice(1)}
                </button>
              ))}
            </div>
          </div>
 
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1rem"}} className="grid-1-mob">
            {visible.map((p,i)=>(
              <motion.div key={p.title} layout initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}
                style={{gridColumn:p.large?"span 2":"span 1",minHeight:p.large?300:220,background:p.bg,borderRadius:24,border:".5px solid var(--b)",padding:"2rem",display:"flex",flexDirection:"column",justifyContent:"space-between",cursor:"pointer",transition:"border-color .3s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.15)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}
              >
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <span className="tag tag-a">{p.tag}</span>
                  <span className="tag tag-g">{p.stat}</span>
                </div>
                <div>
                  <h3 style={{fontFamily:"var(--fd)",fontSize:p.large?"clamp(1.8rem,3.5vw,3rem)":"clamp(1.4rem,2.5vw,2rem)",lineHeight:.95,textTransform:"uppercase",marginBottom:".7rem"}}>{p.title}</h3>
                  <span style={{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--m)",display:"flex",alignItems:"center",gap:4}}>Vedi caso studio <ArrowUpRight size={11}/></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      <ServiceCTA title="IL TUO PROGETTO È IL PROSSIMO." sub="Raccontaci cosa vuoi ottenere." btn="Iniziamo insieme"/>
    </>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: BLOG
═══════════════════════════════════════════════════════════════ */
const PageBlog = () => {
  const posts=[
    {cat:"Social Media",title:"Come fare reel virali per un ristorante (senza budget)",date:"15 Gen 2025",min:8,featured:true},
    {cat:"Meta Ads",title:"Quanto costa la pubblicità su Facebook a Taranto nel 2025",date:"8 Gen 2025",min:6},
    {cat:"SEO",title:"Come trovare clienti online se hai un negozio a Massafra",date:"2 Gen 2025",min:7},
    {cat:"Automazioni",title:"5 automazioni WhatsApp Business che ogni negozio dovrebbe avere",date:"28 Dic 2024",min:5},
    {cat:"Social Media",title:"Perché i tuoi post non ricevono engagement (e come risolvere)",date:"20 Dic 2024",min:9},
    {cat:"Siti Web",title:"WordPress o Next.js: cosa scegliere per il tuo sito nel 2025",date:"15 Dic 2024",min:6},
  ];
 
  return (
    <>
      <PageHero tag="Journal — Risorse e approfondimenti"
        h1="IMPARA" h1b="DA CHI LO" italic="fa ogni giorno."
        sub="Articoli pratici su social media, advertising, SEO e automazioni. Scritti da chi gestisce campagne reali, non da chi le studia sui libri."
      />
 
      <section style={{padding:"6rem 2rem"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
 
          {/* Featured */}
          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            style={{background:"#2a2828",borderRadius:28,border:".5px solid var(--b)",padding:"3rem",marginBottom:"2rem",cursor:"pointer",gridColumn:"span 2",transition:"border-color .3s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.15)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}
          >
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"1rem",marginBottom:"1.5rem"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span className="tag tag-a">{posts[0].cat}</span>
                <span className="tag tag-g">Articolo in evidenza</span>
              </div>
              <span style={{fontSize:11,color:"var(--m)"}}>{posts[0].date} · {posts[0].min} min di lettura</span>
            </div>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,4vw,4rem)",lineHeight:.93,marginBottom:"1rem",textTransform:"uppercase"}}>{posts[0].title}</h2>
            <span style={{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--a)",display:"flex",alignItems:"center",gap:4}}>Leggi l'articolo <ArrowUpRight size={11}/></span>
          </motion.div>
 
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1rem"}}>
            {posts.slice(1).map((p,i)=>(
              <motion.div key={i} className="card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}
                style={{cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:6}}>
                  <span className="tag tag-a">{p.cat}</span>
                  <span style={{fontSize:11,color:"var(--m)"}}>{p.min} min</span>
                </div>
                <h3 style={{fontSize:15,fontWeight:500,lineHeight:1.4,marginBottom:"1rem"}}>{p.title}</h3>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,color:"var(--m)"}}>{p.date}</span>
                  <span style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--a)",display:"flex",alignItems:"center",gap:3}}>Leggi <ArrowUpRight size={10}/></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      <ServiceCTA title="VUOI CONTENUTI COME QUESTI PER IL TUO BRAND?" sub="Gestiamo noi la comunicazione. Tu pensi al business." btn="Parliamo"/>
    </>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   PAGE: CONTATTI
═══════════════════════════════════════════════════════════════ */
const PageContatti = () => {
  const [form,setForm]=useState({nome:"",email:"",tel:"",azienda:"",servizio:"",msg:"",privacy:false});
  const [sent,setSent]=useState(false);
  const [error,setError]=useState("");
  const submit=async()=>{
    if(!form.nome||!form.email||!form.msg){setError("Compila i campi obbligatori (nome, email, messaggio)."); return;}
    if(!form.privacy){setError("Accetta la privacy policy per inviare."); return;}
    setError("");
    try {
      const { db } = await import('./lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      if(db) await addDoc(collection(db,'leads'),{
        name: form.nome,
        email: form.email,
        phone: form.tel || null,
        company: form.azienda || null,
        intent: form.servizio ? `[FORM] ${form.servizio}` : '[FORM] Contatto dal sito',
        source: 'contact_form',
        status: 'new',
        notes: form.msg,
        created_at: new Date().toISOString(),
      });
    } catch(e){ console.error('Save contact failed',e); }
    setSent(true);
  };
 
  return (
    <>
      <PageHero tag="Parliamo del tuo progetto"
        h1="INIZIAMO" h1b="INSIEME"
        italic="senza impegno."
        sub="Una chiamata di 30 minuti è sufficiente per capire cosa ti serve e come possiamo aiutarti. Senza slide inutili, senza promesse vuote."
      />
 
      <section style={{padding:"6rem 2rem"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:"5rem",alignItems:"start"}} className="grid-1-mob">
 
          {/* Info */}
          <div>
            <p className="section-label" style={{marginBottom:"2rem"}}>Come raggiungerci</p>
            {[
              {icon:<Mail size={18}/>,label:"Email",val:"ciao@inlab.it"},
              {icon:<Phone size={18}/>,label:"Telefono",val:"+39 099 000 0000"},
              {icon:<MapPin size={18}/>,label:"Sede",val:"Taranto, Puglia"},
            ].map((c,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}}
                style={{display:"flex",gap:"1rem",alignItems:"flex-start",padding:"1.2rem 0",borderBottom:".5px solid var(--b)"}}>
                <div style={{width:40,height:40,background:"rgba(205,178,255,0.08)",border:".5px solid rgba(205,178,255,.2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--a)",flexShrink:0}}>{c.icon}</div>
                <div>
                  <div style={{fontSize:10,letterSpacing:".15em",textTransform:"uppercase",color:"var(--m)",marginBottom:2}}>{c.label}</div>
                  <div style={{fontSize:16,fontWeight:400}}>{c.val}</div>
                </div>
              </motion.div>
            ))}
 
            <div style={{marginTop:"2.5rem"}}>
              <p className="section-label" style={{marginBottom:"1rem"}}>Aree servite</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {CITIES.map(c=><span key={c} className="tag tag-g" style={{fontSize:11}}>{c}</span>)}
              </div>
            </div>
          </div>
 
          {/* Form */}
          <motion.div className="glass" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            style={{borderRadius:28,padding:"2.5rem"}}>
            {!sent ? (
              <>
                <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,3.5vw,3rem)",lineHeight:.9,marginBottom:"2rem"}}>RACCONTACI<br/><span className="stroke">IL PROGETTO</span></h2>
                <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                  {[
                    {id:"nome",label:"Nome e cognome *",type:"text",ph:"Mario Rossi"},
                    {id:"email",label:"Email *",type:"email",ph:"mario@azienda.it"},
                    {id:"tel",label:"Telefono",type:"tel",ph:"+39 099 000 0000"},
                    {id:"azienda",label:"Azienda / Brand",type:"text",ph:"Nome della tua attività"},
                  ].map(f=>(
                    <div key={f.id}>
                      <label style={{fontSize:10,fontWeight:500,letterSpacing:".13em",textTransform:"uppercase",color:"var(--m)",display:"block",marginBottom:6}}>{f.label}</label>
                      <input type={f.type} placeholder={f.ph} value={(form as any)[f.id]} onChange={e=>setForm({...form,[f.id]:e.target.value})}
                        style={{width:"100%",background:"rgba(255,255,255,0.04)",border:".5px solid var(--b)",borderRadius:12,padding:"12px 16px",color:"var(--t)",fontSize:14,fontFamily:"var(--fb)",outline:"none",transition:"border-color .2s"}}
                        onFocus={e=>e.target.style.borderColor="rgba(205,178,255,.4)"}
                        onBlur={e=>e.target.style.borderColor="var(--b)"}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{fontSize:10,fontWeight:500,letterSpacing:".13em",textTransform:"uppercase",color:"var(--m)",display:"block",marginBottom:6}}>Servizio di interesse</label>
                    <select value={form.servizio} onChange={e=>setForm({...form,servizio:e.target.value})}
                      style={{width:"100%",background:"rgba(255,255,255,0.04)",border:".5px solid var(--b)",borderRadius:12,padding:"12px 16px",color:form.servizio?"var(--t)":"var(--m)",fontSize:14,fontFamily:"var(--fb)",outline:"none"}}>
                      <option value="">Seleziona un servizio</option>
                      {["Strategia social","Gestione social","Foto & video","Branding","Campagne Meta Ads","Sito o landing page","Organizzazione eventi","Altro"].map(s=><option key={s} value={s} style={{background:"#111"}}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:10,fontWeight:500,letterSpacing:".13em",textTransform:"uppercase",color:"var(--m)",display:"block",marginBottom:6}}>Raccontaci il progetto *</label>
                    <textarea rows={4} placeholder="Cosa stai cercando? Qual è il tuo obiettivo?" value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}
                      style={{width:"100%",background:"rgba(255,255,255,0.04)",border:".5px solid var(--b)",borderRadius:12,padding:"12px 16px",color:"var(--t)",fontSize:14,fontFamily:"var(--fb)",outline:"none",resize:"vertical",transition:"border-color .2s"}}
                      onFocus={e=>e.target.style.borderColor="rgba(205,178,255,.4)"}
                      onBlur={e=>e.target.style.borderColor="var(--b)"}
                    />
                  </div>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <input type="checkbox" id="privacy" checked={form.privacy} onChange={e=>setForm({...form,privacy:e.target.checked})}
                      style={{marginTop:3,accentColor:"var(--a)",width:14,height:14,flexShrink:0}}/>
                    <label htmlFor="privacy" style={{fontSize:11,color:"var(--m)",lineHeight:1.6,cursor:"pointer"}}>
                      Ho letto e accetto la <span style={{color:"var(--a)"}}>privacy policy</span>. I dati forniti saranno utilizzati esclusivamente per rispondere alla richiesta.
                    </label>
                  </div>
                  {error && <div style={{fontSize:12,color:"#ff8888",padding:"10px 14px",background:"rgba(255,100,100,0.08)",borderRadius:10,border:".5px solid rgba(255,100,100,0.2)"}}>{error}</div>}
                  <button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"16px",fontSize:12,marginTop:"0.5rem"}} onClick={submit}>
                    Invia messaggio <ArrowRight size={15}/>
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
const PageCittaSEO = ({city, service}) => {
  const {go}=useRouter();
  const svc=SERVICES.find(s=>s.slug===service)||SERVICES[0];
  const cityName=CITIES.find(c=>c.toLowerCase()===city)||city;
  const otherCities=CITIES.filter(c=>c!==cityName);
 
  return (
    <>
      <section style={{minHeight:"85vh",display:"flex",flexDirection:"column",justifyContent:"center",padding:"9rem 2rem 5rem",position:"relative",overflow:"hidden",borderBottom:".5px solid var(--b)"}}>
        <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
          <div style={{position:"absolute",top:"20%",right:"10%",width:450,height:450,background:"rgba(205,178,255,0.05)",borderRadius:"50%",filter:"blur(100px)"}}/>
        </div>
        <div style={{maxWidth:1280,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            style={{display:"inline-flex",alignItems:"center",gap:8,border:".5px solid var(--b)",borderRadius:100,padding:"5px 14px 5px 5px",marginBottom:"1.5rem"}}>
            <span style={{width:20,height:20,background:"var(--a)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}><MapPin size={10} color="#000"/></span>
            <span style={{fontSize:10,fontWeight:500,letterSpacing:".15em",textTransform:"uppercase",color:"var(--m)"}}>{svc.label} a {cityName} — InLab Communication</span>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{delay:.12}}
            style={{fontFamily:"var(--fd)",fontSize:"clamp(3.5rem,10vw,10rem)",lineHeight:.88,marginBottom:"2rem",textTransform:"uppercase"}}>
            {svc.label.toUpperCase()}<br/>
            <span style={{WebkitTextStroke:"1px var(--t)",color:"transparent"}}>A {cityName.toUpperCase()}</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.22}}
            style={{maxWidth:560,fontSize:17,lineHeight:1.75,color:"var(--m)",marginBottom:"2.5rem",fontWeight:300}}>
            InLab è l'agenzia di comunicazione di riferimento a {cityName} e in tutta la provincia di Taranto. Gestiamo la {svc.label.toLowerCase()} di aziende locali con strategie su misura, risultati misurabili e un approccio orientato alla crescita.
          </motion.p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button className="btn btn-p" onClick={()=>go("/contatti")}>Richiedi un preventivo gratuito <ArrowRight size={14}/></button>
            <button className="btn btn-g" onClick={()=>go("/"+svc.slug)}>Scopri il servizio</button>
          </div>
        </div>
      </section>
 
      <StatsRow stats={[{n:"47",l:"Clienti in Puglia"},{n:"3.2M+",l:"Views generate"},{n:"9",l:"Città servite"},{n:"100%",l:"Soddisfazione clienti"}]}/>
 
      {/* Local content */}
      <section style={{padding:"6rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"start"}} className="grid-1-mob">
          <div>
            <p className="section-label">Perché scegliere InLab a {cityName}</p>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,4.5vw,4.5rem)",lineHeight:.9,marginBottom:"2rem",textTransform:"uppercase"}}>
              CONOSCIAMO<br/><span className="stroke">IL TERRITORIO</span>
            </h2>
            <p style={{fontSize:15,color:"var(--m)",lineHeight:1.8,marginBottom:"1.5rem"}}>
              Non siamo un'agenzia milanese che non ha mai messo piede in Puglia. Lavoriamo ogni giorno con aziende di {cityName} e della provincia di Taranto — conosciamo il mercato locale, i comportamenti d'acquisto del territorio, i competitor che devi battere.
            </p>
            <p style={{fontSize:15,color:"var(--m)",lineHeight:1.8}}>
              Questo si traduce in campagne e contenuti che parlano la lingua giusta alle persone giuste, nel posto giusto.
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {[
              {t:"Conoscenza del mercato locale",d:`Sappiamo come si comportano i consumatori a ${cityName}. Le stagionalità, le abitudini, le opportunità locali che un'agenzia esterna non può conoscere.`},
              {t:"Presenza sul territorio",d:"Possiamo venire da voi per shooting, riprese o riunioni. La qualità del lavoro è superiore quando lavoriamo di persona."},
              {t:"Risultati misurabili",d:"Non vendiamo aria fritta. Definiamo insieme KPI chiari e ti mostriamo ogni mese se stiamo raggiungendo gli obiettivi."},
              {t:"Supporto continuo",d:`Un referente dedicato per la tua azienda a ${cityName}. Risposta garantita entro 24 ore, sempre.`},
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
 
      {/* Other cities */}
      <section style={{padding:"5rem 2rem",borderBottom:".5px solid var(--b)"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <p className="section-label" style={{marginBottom:"1.5rem"}}>Operiamo anche in queste città</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {otherCities.map(c=>(
              <button key={c} className="tag tag-g" style={{cursor:"pointer",fontSize:12,padding:"8px 16px"}}
                onClick={()=>go(`/${svc.slug}-${c.toLowerCase()}`)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(205,178,255,.35)";e.currentTarget.style.color="var(--a)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b)";e.currentTarget.style.color="var(--m)"}}
              >{svc.label} a {c}</button>
            ))}
          </div>
        </div>
      </section>
 
      <ClientLogos/>
      <ServiceCTA title={`VUOI CRESCERE A ${cityName.toUpperCase()}?`} sub="Parliamo del tuo business. Senza impegno." btn="Prenota una chiamata gratuita"/>
    </>
  );
};
 
/* ═══════════════════════════════════════════════════════════════
   ROUTER LOGIC
═══════════════════════════════════════════════════════════════ */
const parseRoute = (route) => {
  if(route==="/") return {page:"home"};
  if(route==="/chi-siamo") return {page:"chi-siamo"};
  if(route==="/lavori") return {page:"lavori"};
  if(route==="/servizi") return {page:"servizi"};
  if(route==="/blog") return {page:"blog"};
  if(route==="/contatti") return {page:"contatti"};
  // service pages
  const svcSlugs=SERVICES.map(s=>s.slug);
  if(svcSlugs.includes(route.slice(1))) return {page:"service",slug:route.slice(1)};
  // city SEO pages: /gestione-social-taranto
  for(const svc of SERVICES){
    for(const city of CITIES){
      const expected=`/${svc.slug}-${city.toLowerCase()}`;
      if(route===expected) return {page:"city",service:svc.slug,city:city.toLowerCase()};
    }
  }
  return {page:"home"};
};
 
const renderPage = (info) => {
  switch(info.page){
    case "home": return <PageHome/>;
    case "chi-siamo": return <PageChiSiamo/>;
    case "lavori": return <PageLavori/>;
    case "servizi": return <PageServizi/>;
    case "blog": return <PageBlog/>;
    case "contatti": return <PageContatti/>;
    case "service":
      switch(info.slug){
        case "gestione-social": return <PageGestioneSocial/>;
        case "meta-ads": return <PageMetaAds/>;
        case "siti-web": return <PageSitiWeb/>;
        case "automazioni-ai": return <PageAutomazioniAI/>;
        case "shooting": return <PageShooting/>;
        case "video": return <PageVideo/>;
        case "landing-page": return <PageLandingPage/>;
        default: return <PageHome/>;
      }
    case "city": return <PageCittaSEO city={info.city} service={info.service}/>;
    default: return <PageHome/>;
  }
};
 
/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [route,setRoute]=useState("/");

  useEffect(() => {
    // Carica contenuti dal DB e inizializza il tracking analytics
    loadContent();
    initAnalytics();
  }, []);
 
  const go=useCallback((to)=>{
    setRoute(to);
    window.scrollTo({top:0,behavior:"smooth"});
  },[]);
 
  const pageInfo=parseRoute(route);
 
  return (
    <RouterCtx.Provider value={{route,go}}>
      <G/>
      <Navbar/>
      <AnimatePresence mode="wait">
        <motion.div key={route}
          initial={{opacity:0,y:12}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-8}}
          transition={{duration:.25}}>
          {renderPage(pageInfo)}
        </motion.div>
      </AnimatePresence>
      <Footer/>
      <Chatbot/>
    </RouterCtx.Provider>
  );
}
