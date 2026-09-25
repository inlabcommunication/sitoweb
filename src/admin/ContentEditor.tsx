import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { Save, RotateCcw, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { WEBSITE_CONTENT } from '../constants';
import { loadContent, saveContent, SiteContent } from '../lib/content';
import { useMediaLibrary } from './MediaLibrary';

// ─── Struttura pagine + blocchi ────────────────────────────────

type Page =
  | 'home' | 'studio' | 'lavori' | 'servizi' | 'contatti';

const PAGES: { key: Page; label: string; icon: string; blocks: { key: string; label: string }[] }[] = [
  {
    key: 'home', label: 'Home', icon: '🏠',
    blocks: [
      { key: 'hero',            label: '① Hero' },
      { key: 'marquee',         label: '② Marquee testo' },
      { key: 'manifesto',       label: '③ Manifesto' },
      { key: 'services_grid',   label: '④ Servizi' },
      { key: 'metodo',          label: '⑤ Metodo' },
      { key: 'portfolio',       label: '⑥ Portfolio' },
      { key: 'clients',         label: '⑦ Clienti / Brand' },
      { key: 'per_chi',         label: '⑧ Per chi lavoriamo' },
      { key: 'testimonial',     label: '⑨ Testimonianze' },
      { key: 'stats',           label: '⑩ Numeri' },
      { key: 'cta_home',        label: '⑪ CTA finale' },
    ],
  },
  {
    key: 'studio', label: 'Chi siamo', icon: '👥',
    blocks: [
      { key: 'studio_hero', label: 'Hero & Intro' },
      { key: 'team',        label: 'Team (3 persone)' },
      { key: 'collaboratori', label: 'Collaboratori' },
    ],
  },
  {
    key: 'lavori', label: 'Portfolio', icon: '🎨',
    blocks: [
      { key: 'portfolio_settings', label: 'Impostazioni' },
      { key: 'portfolio_projects', label: 'Progetti' },
    ],
  },
  {
    key: 'servizi', label: 'Servizi', icon: '⚙️',
    blocks: [
      { key: 'services_list', label: 'Lista servizi' },
      { key: 'branding',      label: 'Branding' },
    ],
  },
  {
    key: 'contatti', label: 'Contatti', icon: '📬',
    blocks: [
      { key: 'contact_hero', label: 'Hero' },
      { key: 'contact_info', label: 'Info contatto' },
    ],
  },
];

// ─── Stili riusabili ────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '.5px solid #2a2a2a', borderRadius: 8,
  color: '#fff', fontSize: 12, fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box', resize: 'vertical' as any,
};

// ─── Componenti base ────────────────────────────────────────────

const Field = ({ label, value, onChange, multiline = false, hint, placeholder, rows = 3 }: any) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>{label}</div>
    {hint && <div style={{ fontSize: 10, color: '#444', marginBottom: 4, lineHeight: 1.4 }}>{hint}</div>}
    {multiline
      ? <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={rows} style={inputStyle} placeholder={placeholder} />
      : <input value={value ?? ''} onChange={e => onChange(e.target.value)} style={inputStyle} placeholder={placeholder} />}
  </div>
);

const ImageField = ({ label, value, onChange, type = 'image' }: any) => {
  const { pick, Modal } = useMediaLibrary();
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={value ?? ''} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="https://res.cloudinary.com/..." />
        <button onClick={async () => { const url = await pick(type); if (url) onChange(url); }}
          style={{ padding: '0 12px', background: 'rgba(205,178,255,0.1)', border: '.5px solid #cdb2ff44', borderRadius: 8, color: '#cdb2ff', cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}>
          📁
        </button>
      </div>
      {value && (
        <div style={{ marginTop: 6, borderRadius: 8, overflow: 'hidden', background: '#111', border: '.5px solid #2a2a2a', maxHeight: 100 }}>
          {type === 'video'
            ? <video src={value} style={{ width: '100%', maxHeight: 100, display: 'block' }} />
            : <img src={value} alt="" style={{ width: '100%', maxHeight: 100, objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />}
        </div>
      )}
      {Modal}
    </div>
  );
};

const CardBlock = ({ title, onDelete, children, collapsed = false, accent }: any) => {
  const [open, setOpen] = useState(!collapsed);
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `.5px solid ${accent ? '#cdb2ff33' : '#2a2a2a'}`, borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', background: accent ? 'rgba(205,178,255,0.04)' : 'transparent' }}
        onClick={() => setOpen(o => !o)}>
        <div style={{ fontSize: 11, fontWeight: 600, color: accent ? '#cdb2ff' : '#aaa' }}>{title}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {onDelete && <button onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{ background: 'none', border: 'none', color: '#ff8888', cursor: 'pointer', padding: 2, lineHeight: 1 }}>
            <Trash2 size={12} />
          </button>}
          {open ? <ChevronDown size={12} color="#555" /> : <ChevronRight size={12} color="#555" />}
        </div>
      </div>
      {open && <div style={{ padding: '0 14px 14px' }}>{children}</div>}
    </div>
  );
};

const AddBtn = ({ onClick, label }: any) => (
  <button onClick={onClick} style={{ width: '100%', padding: '9px', background: 'rgba(205,178,255,0.06)', border: '.5px dashed #cdb2ff44', borderRadius: 9, color: '#cdb2ff', fontSize: 10, cursor: 'pointer', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
    <Plus size={11} /> {label}
  </button>
);

const SectionTitle = ({ children }: any) => (
  <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: '#cdb2ff', marginBottom: 12, paddingBottom: 6, borderBottom: '.5px solid #cdb2ff22' }}>{children}</div>
);

const Note = ({ children }: any) => (
  <div style={{ fontSize: 11, color: '#555', background: 'rgba(205,178,255,0.05)', border: '.5px solid #cdb2ff22', borderRadius: 8, padding: '10px 12px', marginBottom: 12, lineHeight: 1.5 }}>{children}</div>
);

// ─── Helper per aggiornare array annidati ───────────────────────

const arrUpdate = (arr: any[], i: number, key: string, val: any) => {
  const a = JSON.parse(JSON.stringify(arr));
  a[i][key] = val;
  return a;
};

// ═══════════════════════════════════════════════════════════════
// BLOCK EDITOR — un componente per blocco
// ═══════════════════════════════════════════════════════════════

const BlockEditor = ({ block, content, set, setContent }: any) => {

  // ── HERO ────────────────────────────────────────────────────
  if (block === 'hero') return (
    <div>
      <SectionTitle>Hero Section</SectionTitle>
      <Note>Il testo ruota automaticamente: scelto → ricordato → desiderato → trovato → riconosciuto</Note>
      <Field label="Badge / Tag" value={content.hero?.tag} onChange={(v: string) => set('hero.tag', v)}
        hint="Piccolo testo sopra il titolo" placeholder="Laboratorio creativo — Taranto, Puglia" />
      <Field label="CTA principale" value={content.hero?.cta?.primary} onChange={(v: string) => set('hero.cta.primary', v)}
        placeholder="Raccontaci il tuo progetto" />
      <Field label="CTA secondario" value={content.hero?.cta?.secondary} onChange={(v: string) => set('hero.cta.secondary', v)}
        placeholder="Guarda i nostri lavori" />
      <SectionTitle>Mini statistiche sotto i bottoni</SectionTitle>
      <Note>3 numeri visualizzati subito sotto le CTA. Esempio: 100k+ / visualizzazioni</Note>
      {(content.hero?.mini_stats || [{ n: '100k+', l: 'visualizzazioni' }, { n: '47', l: 'brand seguiti' }, { n: '9', l: 'città in Puglia' }]).map((s: any, i: number) => (
        <CardBlock key={i} title={`Stat ${i + 1}: ${s.n}`}>
          <Field label="Numero" value={s.n} onChange={(v: string) => {
            const a = JSON.parse(JSON.stringify(content.hero?.mini_stats || [{ n: '100k+', l: 'visualizzazioni' }, { n: '47', l: 'brand seguiti' }, { n: '9', l: 'città in Puglia' }]));
            a[i].n = v; set('hero.mini_stats', a);
          }} />
          <Field label="Etichetta" value={s.l} onChange={(v: string) => {
            const a = JSON.parse(JSON.stringify(content.hero?.mini_stats || [{ n: '100k+', l: 'visualizzazioni' }, { n: '47', l: 'brand seguiti' }, { n: '9', l: 'città in Puglia' }]));
            a[i].l = v; set('hero.mini_stats', a);
          }} />
        </CardBlock>
      ))}
    </div>
  );

  // ── MARQUEE ─────────────────────────────────────────────────
  if (block === 'marquee') return (
    <div>
      <SectionTitle>Striscia animata (Marquee)</SectionTitle>
      <Note>Le voci scorrono in loop orizzontale. Usa ✦ come separatore.</Note>
      {(content.marquee?.items || ['Gestione Social', '✦', 'Meta Ads', '✦', 'Foto & Video']).map((item: string, i: number) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <input value={item} onChange={e => {
            const a = [...(content.marquee?.items || [])]; a[i] = e.target.value; set('marquee.items', a);
          }} style={{ ...inputStyle, flex: 1 }} placeholder="Testo o ✦" />
          <button onClick={() => setContent((p: any) => {
            const n = JSON.parse(JSON.stringify(p));
            if (!n.marquee) n.marquee = { items: [] };
            n.marquee.items.splice(i, 1); return n;
          })} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', borderRadius: 6, color: '#ff8888', padding: '0 8px', cursor: 'pointer' }}>
            <Trash2 size={11} />
          </button>
        </div>
      ))}
      <AddBtn onClick={() => setContent((p: any) => {
        const n = JSON.parse(JSON.stringify(p));
        if (!n.marquee) n.marquee = { items: [] };
        n.marquee.items.push('Nuovo elemento'); return n;
      })} label="Aggiungi voce" />
    </div>
  );

  // ── MANIFESTO ───────────────────────────────────────────────
  if (block === 'manifesto') return (
    <div>
      <SectionTitle>Sezione Manifesto</SectionTitle>
      <Field label="Tag sezione" value={(content as any).manifesto?.tag} onChange={(v: string) => set('manifesto.tag', v)}
        placeholder="Il nostro manifesto" />
      <Field label="Titolo riga 1" value={(content as any).manifesto?.title?.line1} onChange={(v: string) => set('manifesto.title.line1', v)}
        placeholder="NON CREIAMO CONTENUTI" />
      <Field label="Titolo riga 2 (outline)" value={(content as any).manifesto?.title?.line2} onChange={(v: string) => set('manifesto.title.line2', v)}
        placeholder="PER RIEMPIRE" />
      <Field label="Titolo riga 3" value={(content as any).manifesto?.title?.line3} onChange={(v: string) => set('manifesto.title.line3', v)}
        placeholder="UN CALENDARIO." />
      <Field label="Accent corsivo viola" value={(content as any).manifesto?.title?.accent} onChange={(v: string) => set('manifesto.title.accent', v)}
        placeholder="Costruiamo direzioni." />
      <Field label="Testo paragrafo" value={(content as any).manifesto?.text} onChange={(v: string) => set('manifesto.text', v)}
        multiline rows={5} />
    </div>
  );

  // ── SERVIZI ─────────────────────────────────────────────────
  if (block === 'services_grid' || block === 'services_list') return (
    <div>
      <SectionTitle>Griglia Servizi</SectionTitle>
      <Field label="Tag sezione" value={content.services?.tag} onChange={(v: string) => set('services.tag', v)} />
      <div style={{ marginTop: 8 }}>
        {(content.services?.items || []).map((s: any, i: number) => (
          <CardBlock key={i} title={`${s.icon || '◈'} ${s.title}`}
            onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.services.items.splice(i, 1); return n; })}>
            <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 8 }}>
              <Field label="Emoji" value={s.icon} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.services.items)); a[i].icon = v; set('services.items', a); }} placeholder="◈" />
              <Field label="Titolo" value={s.title} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.services.items)); a[i].title = v; set('services.items', a); }} />
            </div>
            <Field label="Descrizione" value={s.desc} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.services.items)); a[i].desc = v; set('services.items', a); }} multiline />
            <Field label="Slug pagina" value={s.slug} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.services.items)); a[i].slug = v; set('services.items', a); }}
              hint="Es: gestione-social, meta-ads, video..." placeholder="gestione-social" />
          </CardBlock>
        ))}
        <AddBtn onClick={() => setContent((p: any) => {
          const n = JSON.parse(JSON.stringify(p));
          if (!n.services) n.services = { items: [] };
          n.services.items.push({ icon: '◈', title: 'Nuovo servizio', desc: '', slug: '' }); return n;
        })} label="Aggiungi servizio" />
      </div>
    </div>
  );

  // ── METODO ──────────────────────────────────────────────────
  if (block === 'metodo') return (
    <div>
      <SectionTitle>Timeline Metodo</SectionTitle>
      <Field label="Tag sezione" value={(content as any).metodo?.tag} onChange={(v: string) => set('metodo.tag', v)} />
      <Field label="Titolo principale" value={(content as any).metodo?.title} onChange={(v: string) => set('metodo.title', v)}
        placeholder="DAL CAOS DEI CONTENUTI" />
      <Field label="Accent corsivo" value={(content as any).metodo?.accent} onChange={(v: string) => set('metodo.accent', v)}
        placeholder="a una strategia chiara." />
      <Field label="Sottotitolo descrittivo" value={(content as any).metodo?.subtitle} onChange={(v: string) => set('metodo.subtitle', v)} multiline />
      <SectionTitle>Step della timeline</SectionTitle>
      {((content as any).metodo?.steps || []).map((step: any, i: number) => (
        <CardBlock key={i} title={`${i + 1}. ${step.title}`}>
          <Field label="Titolo step" value={step.title} onChange={(v: string) => {
            const a = JSON.parse(JSON.stringify((content as any).metodo.steps)); a[i].title = v; set('metodo.steps', a);
          }} />
          <Field label="Descrizione" value={step.desc} onChange={(v: string) => {
            const a = JSON.parse(JSON.stringify((content as any).metodo.steps)); a[i].desc = v; set('metodo.steps', a);
          }} multiline />
        </CardBlock>
      ))}
      <AddBtn onClick={() => setContent((p: any) => {
        const n = JSON.parse(JSON.stringify(p));
        if (!n.metodo) n.metodo = { steps: [] };
        if (!n.metodo.steps) n.metodo.steps = [];
        n.metodo.steps.push({ title: 'Nuovo step', desc: '' }); return n;
      })} label="Aggiungi step" />
    </div>
  );

  // ── PORTFOLIO (preview homepage) ─────────────────────────────
  if (block === 'portfolio') return (
    <div>
      <SectionTitle>Portfolio — anteprima homepage</SectionTitle>
      <Note>Qui gestisci i progetti mostrati nella home (max 6). Per l'elenco completo vai su Portfolio → Progetti.</Note>
      <Field label="Tag sezione" value={(content as any).portfolio?.tag} onChange={(v: string) => set('portfolio.tag', v)} />
      <Field label="Sottotitolo" value={(content as any).portfolio?.subtitle} onChange={(v: string) => set('portfolio.subtitle', v)} multiline />
      <Field label="Testo bottone 'Vedi tutti'" value={(content as any).portfolio?.viewAllLabel} onChange={(v: string) => set('portfolio.viewAllLabel', v)} placeholder="Vedi tutti i lavori" />
    </div>
  );

  // ── PORTFOLIO SETTINGS ───────────────────────────────────────
  if (block === 'portfolio_settings') return (
    <div>
      <SectionTitle>Portfolio — Impostazioni generali</SectionTitle>
      <Field label="Tag sezione" value={(content as any).portfolio?.tag} onChange={(v: string) => set('portfolio.tag', v)} />
      <Field label="Sottotitolo" value={(content as any).portfolio?.subtitle} onChange={(v: string) => set('portfolio.subtitle', v)} multiline />
      <SectionTitle>Categorie filtro</SectionTitle>
      {((content as any).portfolio?.categories || []).map((cat: string, i: number) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <input value={cat} onChange={e => {
            const a = [...(content as any).portfolio.categories]; a[i] = e.target.value; set('portfolio.categories', a);
          }} style={{ ...inputStyle, flex: 1 }} />
          <button onClick={() => setContent((p: any) => {
            const n = JSON.parse(JSON.stringify(p)); n.portfolio.categories.splice(i, 1); return n;
          })} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', borderRadius: 6, color: '#ff8888', padding: '0 8px', cursor: 'pointer' }}>
            <Trash2 size={11} />
          </button>
        </div>
      ))}
      <AddBtn onClick={() => setContent((p: any) => {
        const n = JSON.parse(JSON.stringify(p));
        if (!n.portfolio) n.portfolio = { categories: [] };
        if (!n.portfolio.categories) n.portfolio.categories = [];
        n.portfolio.categories.push('nuova'); return n;
      })} label="Aggiungi categoria" />
    </div>
  );

  // ── PORTFOLIO PROJECTS ───────────────────────────────────────
  if (block === 'portfolio_projects') return (
    <div>
      <SectionTitle>Progetti portfolio</SectionTitle>
      {((content as any).portfolio?.projects || []).map((p: any, i: number) => (
        <CardBlock key={i} title={p.title || 'Progetto senza titolo'} collapsed
          onDelete={() => setContent((prev: any) => { const n = JSON.parse(JSON.stringify(prev)); n.portfolio.projects.splice(i, 1); return n; })}>
          <a href={`${window.location.origin}/#/progetto/${p.id}`} target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(205,178,255,0.1)', border: '.5px solid rgba(205,178,255,0.3)', borderRadius: 8, color: '#cdb2ff', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: 12 }}>
            👁 Vedi pagina ↗
          </a>

          <Field label="Titolo progetto" value={p.title} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].title = v; set('portfolio.projects', a); }} />
          <Field label="Cliente / Brand" value={p.client} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].client = v; set('portfolio.projects', a); }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="Categoria" value={p.category} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].category = v; set('portfolio.projects', a); }} hint="social, video, foto, eventi, branding, web, ads" />
            <Field label="Anno" value={p.year} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].year = v; set('portfolio.projects', a); }} />
          </div>

          <Field label="Risultato / Stat badge" value={p.stat} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].stat = v; set('portfolio.projects', a); }} placeholder="Es: +180% reach" />
          <Field label="Descrizione breve (card)" value={p.description} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].description = v; set('portfolio.projects', a); }} multiline />
          <Field label="Risultato dettagliato (pagina)" value={p.result} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].result = v; set('portfolio.projects', a); }} multiline />

          <ImageField label="Immagine copertina" value={p.image} type="image" onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].image = v; set('portfolio.projects', a); }} />
          <ImageField label="Logo cliente" value={p.clientLogo} type="image" onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].clientLogo = v; set('portfolio.projects', a); }} />
          <ImageField label="Video (Cloudinary o Instagram)" value={p.videoUrl} type="video" onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].videoUrl = v; set('portfolio.projects', a); }} />

          <SectionTitle>Galleria foto</SectionTitle>
          {(p.gallery || []).map((img: string, gi: number) => (
            <div key={gi} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input value={img} onChange={e => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].gallery[gi] = e.target.value; set('portfolio.projects', a); }} style={{ ...inputStyle, flex: 1 }} placeholder="URL immagine" />
              <button onClick={() => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].gallery.splice(gi, 1); set('portfolio.projects', a); }}
                style={{ background: 'rgba(255,100,100,0.1)', border: 'none', borderRadius: 6, color: '#ff8888', padding: '0 8px', cursor: 'pointer' }}>
                <Trash2 size={11} />
              </button>
            </div>
          ))}
          <AddBtn onClick={() => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); if (!a[i].gallery) a[i].gallery = []; a[i].gallery.push(''); set('portfolio.projects', a); }} label="Aggiungi foto galleria" />

          <SectionTitle>Link social cliente</SectionTitle>
          <Field label="Instagram" value={p.instagram} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].instagram = v; set('portfolio.projects', a); }} placeholder="https://instagram.com/..." />
          <Field label="Facebook" value={p.facebook} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].facebook = v; set('portfolio.projects', a); }} placeholder="https://facebook.com/..." />
          <Field label="TikTok" value={p.tiktok} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].tiktok = v; set('portfolio.projects', a); }} placeholder="https://tiktok.com/..." />
          <Field label="Sito web" value={p.website} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].website = v; set('portfolio.projects', a); }} placeholder="https://..." />

          <SectionTitle>Altre opzioni</SectionTitle>
          <Field label="Chi ci ha lavorato (separati da virgola)" value={(p.whoWorked || []).join(', ')} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].whoWorked = v.split(',').map((s: string) => s.trim()).filter(Boolean); set('portfolio.projects', a); }} placeholder="Nicola, Ilaria, Prince" />
          <Field label="ID prossimo progetto" value={p.nextProject} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].nextProject = v; set('portfolio.projects', a); }} hint="ID del progetto successivo (per navigazione)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <input type="checkbox" checked={p.large || false} onChange={e => { const a = JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].large = e.target.checked; set('portfolio.projects', a); }} id={`lg-${i}`} style={{ accentColor: '#cdb2ff' }} />
            <label htmlFor={`lg-${i}`} style={{ fontSize: 11, color: '#666', cursor: 'pointer' }}>Card grande (larghezza piena)</label>
          </div>
        </CardBlock>
      ))}
      <AddBtn onClick={() => setContent((prev: any) => {
        const n = JSON.parse(JSON.stringify(prev));
        if (!n.portfolio) n.portfolio = { projects: [] };
        if (!n.portfolio.projects) n.portfolio.projects = [];
        n.portfolio.projects.push({
          id: Date.now().toString(), title: 'Nuovo progetto', client: '',
          category: 'social', tags: [], stat: '', year: new Date().getFullYear().toString(),
          large: false, image: '', videoUrl: '', description: '', result: '',
          gallery: [], whoWorked: [], instagram: '', facebook: '', tiktok: '', website: '', link: '',
        }); return n;
      })} label="Aggiungi progetto" />
    </div>
  );

  // ── CLIENTI / BRAND ─────────────────────────────────────────
  if (block === 'clients') return (
    <div>
      <SectionTitle>Brand & Clienti</SectionTitle>
      <Field label="Tag / didascalia sezione" value={content.clients?.tag} onChange={(v: string) => set('clients.tag', v)}
        placeholder="Brand e progetti con cui abbiamo lavorato" />
      {(content.clients?.items || []).map((c: any, i: number) => (
        <CardBlock key={i} title={c.name}
          onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.clients.items.splice(i, 1); return n; })}>
          <Field label="ID scheda" value={c.id} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].id = v; set('clients.items', a); }}
            hint="Usato nell'URL della scheda cliente, es: nunzio-putignano" />
          <Field label="Nome cliente" value={c.name} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].name = v; set('clients.items', a); }} />
          <Field label="Settore" value={c.sector} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].sector = v; set('clients.items', a); }} placeholder="Ristorazione, beauty, hospitality..." />
          <Field label="Località" value={c.location} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].location = v; set('clients.items', a); }} placeholder="Taranto, Puglia..." />
          <Field label="Riassunto card / hero" value={c.summary} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].summary = v; set('clients.items', a); }} multiline rows={2} />
          <Field label="Descrizione scheda" value={c.description} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].description = v; set('clients.items', a); }} multiline rows={4} />
          <Field label="Servizi (separati da virgola)" value={(c.services || []).join(', ')} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].services = v.split(',').map((s: string) => s.trim()).filter(Boolean); set('clients.items', a); }} placeholder="Gestione Social, Reels, Branding" />
          <Field label="Risultati (uno per riga)" value={(c.results || []).join('\n')} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].results = v.split('\n').map((s: string) => s.trim()).filter(Boolean); set('clients.items', a); }} multiline rows={3} />
          <Field label="Sito web" value={c.website || c.url} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].website = v; a[i].url = v; set('clients.items', a); }}
            hint="Link esterno mostrato nella scheda cliente" />
          <Field label="Instagram" value={c.instagram} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].instagram = v; set('clients.items', a); }} placeholder="https://instagram.com/..." />
          <Field label="Facebook" value={c.facebook} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].facebook = v; set('clients.items', a); }} placeholder="https://facebook.com/..." />
          <Field label="Telefono" value={c.phone} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].phone = v; set('clients.items', a); }} placeholder="+39 ..." />
          <Field label="Indirizzo" value={c.address} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].address = v; set('clients.items', a); }} placeholder="Via ..., Città (TA)" />
          <ImageField label="Logo (Cloudinary)" value={c.logo} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].logo = v; set('clients.items', a); }} />
          <ImageField label="Immagine hero scheda" value={c.image} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].image = v; set('clients.items', a); }} />
        </CardBlock>
      ))}
      <AddBtn onClick={() => setContent((p: any) => {
        const n = JSON.parse(JSON.stringify(p));
        if (!n.clients) n.clients = { tag: '', items: [] };
        n.clients.items.push({
          id: `cliente-${Date.now()}`,
          name: 'Nuovo cliente',
          sector: '',
          location: '',
          summary: '',
          description: '',
          services: [],
          results: [],
          url: '',
          logo: '',
          image: '',
          website: '',
          instagram: '',
          gallery: []
        }); return n;
      })} label="Aggiungi cliente" />
    </div>
  );

  // ── PER CHI LAVORIAMO ────────────────────────────────────────
  if (block === 'per_chi') return (
    <div>
      <SectionTitle>Per chi lavoriamo</SectionTitle>
      <Note>8 categorie di clienti target. Ogni card ha un'emoji, un titolo e una descrizione breve.</Note>
      <Field label="Tag sezione" value={(content as any).per_chi?.tag} onChange={(v: string) => set('per_chi.tag', v)} placeholder="Il nostro target" />
      <Field label="Titolo" value={(content as any).per_chi?.title} onChange={(v: string) => set('per_chi.title', v)} placeholder="PER BRAND CHE VOGLIONO FARSI NOTARE." />
      <Field label="Sottotitolo" value={(content as any).per_chi?.subtitle} onChange={(v: string) => set('per_chi.subtitle', v)} multiline />
      <SectionTitle>Card target</SectionTitle>
      {((content as any).per_chi?.items || [
        { emoji: '🍽️', label: 'Ristoranti e locali', desc: 'Comunicazione che fa venir voglia di prenotare.' },
        { emoji: '🛍️', label: 'Negozi e attività', desc: 'Contenuti che portano persone in negozio e online.' },
        { emoji: '💼', label: 'Professionisti', desc: 'Immagine autorevole e riconoscibile nel tuo settore.' },
        { emoji: '⚙️', label: 'Aziende di servizi', desc: 'Spiegare bene cosa fai è già metà del lavoro.' },
        { emoji: '🚀', label: 'Brand emergenti', desc: 'Costruiamo la tua identità da zero con metodo.' },
        { emoji: '🎉', label: 'Eventi e inaugurazioni', desc: 'Prima, durante e dopo — raccontiamo ogni momento.' },
        { emoji: '🌐', label: 'Progetti digitali', desc: 'Landing page, siti e campagne che convertono.' },
        { emoji: '📍', label: 'Attività locali', desc: 'Presenza digitale forte nel territorio che servi.' },
      ]).map((item: any, i: number) => (
        <CardBlock key={i} title={`${item.emoji} ${item.label}`}
          onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); if (!n.per_chi) n.per_chi = { items: [] }; n.per_chi.items.splice(i, 1); return n; })}>
          <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 8 }}>
            <Field label="Emoji" value={item.emoji} onChange={(v: string) => {
              const base = (content as any).per_chi?.items || [];
              const a = JSON.parse(JSON.stringify(base)); a[i].emoji = v; set('per_chi.items', a);
            }} />
            <Field label="Titolo" value={item.label} onChange={(v: string) => {
              const base = (content as any).per_chi?.items || [];
              const a = JSON.parse(JSON.stringify(base)); a[i].label = v; set('per_chi.items', a);
            }} />
          </div>
          <Field label="Descrizione" value={item.desc} onChange={(v: string) => {
            const base = (content as any).per_chi?.items || [];
            const a = JSON.parse(JSON.stringify(base)); a[i].desc = v; set('per_chi.items', a);
          }} />
        </CardBlock>
      ))}
      <AddBtn onClick={() => setContent((p: any) => {
        const n = JSON.parse(JSON.stringify(p));
        if (!n.per_chi) n.per_chi = { items: [] };
        n.per_chi.items.push({ emoji: '✦', label: 'Nuovo target', desc: '' }); return n;
      })} label="Aggiungi categoria" />
    </div>
  );

  // ── TESTIMONIAL ─────────────────────────────────────────────
  if (block === 'testimonial') return (
    <div>
      <SectionTitle>Testimonianze clienti</SectionTitle>
      <Note>Le testimonianze appaiono come card con virgolette. Non inserire nomi reali se non hai il permesso del cliente — usa il ruolo.</Note>
      <Field label="Tag sezione" value={(content as any).testimonial?.tag} onChange={(v: string) => set('testimonial.tag', v)} placeholder="Cosa dicono di noi" />
      <Field label="Nota finale (sotto le card)" value={(content as any).testimonial?.footer} onChange={(v: string) => set('testimonial.footer', v)}
        placeholder="Abbiamo lavorato su progetti per attività locali, eventi, brand e servizi in tutta la provincia di Taranto." multiline />
      <SectionTitle>Testimonianze</SectionTitle>
      {((content as any).testimonial?.items || []).map((t: any, i: number) => (
        <CardBlock key={i} title={`"${(t.text || '').slice(0, 40)}…"`}
          onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.testimonial.items.splice(i, 1); return n; })}>
          <Field label="Testo testimonianza" value={t.text} onChange={(v: string) => {
            const a = JSON.parse(JSON.stringify((content as any).testimonial.items)); a[i].text = v; set('testimonial.items', a);
          }} multiline rows={3} />
          <Field label="Ruolo / Tipo cliente" value={t.role} onChange={(v: string) => {
            const a = JSON.parse(JSON.stringify((content as any).testimonial.items)); a[i].role = v; set('testimonial.items', a);
          }} placeholder="Es: Titolare, attività locale" />
          <Field label="Nome (opzionale)" value={t.name} onChange={(v: string) => {
            const a = JSON.parse(JSON.stringify((content as any).testimonial.items)); a[i].name = v; set('testimonial.items', a);
          }} placeholder="Lascia vuoto per anonimato" />
        </CardBlock>
      ))}
      <AddBtn onClick={() => setContent((p: any) => {
        const n = JSON.parse(JSON.stringify(p));
        if (!n.testimonial) n.testimonial = { items: [] };
        if (!n.testimonial.items) n.testimonial.items = [];
        n.testimonial.items.push({ text: '', role: '', name: '' }); return n;
      })} label="Aggiungi testimonianza" />
    </div>
  );

  // ── STATS ────────────────────────────────────────────────────
  if (block === 'stats') return (
    <div>
      <SectionTitle>Numeri animati</SectionTitle>
      <Note>I numeri vengono animati in contatore allo scroll. Usa valori numerici puri nel campo "Valore".</Note>
      {(content.stats || []).map((s: any, i: number) => (
        <CardBlock key={i} title={`${s.value || s.num || '?'} — ${s.label}`}
          onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.stats.splice(i, 1); return n; })}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 48px', gap: 8 }}>
            <Field label="Etichetta" value={s.label} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].label = v; set('stats', a); }} />
            <Field label="Prefisso" value={s.prefix} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].prefix = v; set('stats', a); }} placeholder="€" />
            <Field label="Suffisso" value={s.suffix} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].suffix = v; set('stats', a); }} placeholder="+" />
          </div>
          <Field label="Valore numerico" value={s.value || s.num} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].value = Number(v) || v; a[i].num = v; set('stats', a); }}
            hint="Inserisci solo il numero. Es: 3200000 per 3.2M+" placeholder="3200000" />
        </CardBlock>
      ))}
      <AddBtn onClick={() => setContent((p: any) => ({ ...p, stats: [...(p.stats || []), { value: 0, num: '0', suffix: '+', label: 'Nuova stat' }] }))} label="Aggiungi stat" />
    </div>
  );

  // ── CTA FINALE ───────────────────────────────────────────────
  if (block === 'cta_home') return (
    <div>
      <SectionTitle>CTA Finale (sfondo blu)</SectionTitle>
      <Field label="Tag / label piccolo" value={(content as any).cta?.home?.tag} onChange={(v: string) => set('cta.home.tag', v)} placeholder="Iniziamo" />
      <Field label="Titolo riga 1" value={(content as any).cta?.home?.title} onChange={(v: string) => set('cta.home.title', v)} placeholder="HAI UN'ATTIVITÀ," />
      <Field label="Titolo riga 2" value={(content as any).cta?.home?.title2} onChange={(v: string) => set('cta.home.title2', v)} placeholder="UN BRAND O UN PROGETTO" />
      <Field label="Accent corsivo" value={(content as any).cta?.home?.accent} onChange={(v: string) => set('cta.home.accent', v)} placeholder="da raccontare meglio?" />
      <Field label="Sottotitolo" value={(content as any).cta?.home?.subtitle} onChange={(v: string) => set('cta.home.subtitle', v)} multiline />
      <Field label="Bottone principale" value={(content as any).cta?.home?.btn1} onChange={(v: string) => set('cta.home.btn1', v)} placeholder="Parla con InLab" />
      <Field label="Bottone secondario" value={(content as any).cta?.home?.btn2} onChange={(v: string) => set('cta.home.btn2', v)} placeholder="Richiedi una consulenza" />
    </div>
  );

  // ── STUDIO HERO ──────────────────────────────────────────────
  if (block === 'studio_hero') return (
    <div>
      <SectionTitle>Chi siamo — Hero & Testi</SectionTitle>
      <Field label="Tag sezione" value={content.studio?.tag} onChange={(v: string) => set('studio.tag', v)} />
      {(content.studio?.title || []).map((t: string, i: number) => (
        <Field key={i} label={`Titolo riga ${i + 1}`} value={t} onChange={(v: string) => {
          const a = [...(content.studio?.title || [])]; a[i] = v; set('studio.title', a);
        }} />
      ))}
      <Field label="Paragrafo intro 1" value={content.studio?.description1} onChange={(v: string) => set('studio.description1', v)} multiline />
      <Field label="Paragrafo intro 2" value={content.studio?.description2} onChange={(v: string) => set('studio.description2', v)} multiline />
    </div>
  );

  // ── TEAM ─────────────────────────────────────────────────────
  if (block === 'team') return (
    <div>
      <SectionTitle>Team InLab (3 profili)</SectionTitle>
      <Note>I 3 profili fissi: Prince, Nicola Carpignano, Ilaria Gemma. Puoi modificare bio, ruolo e foto.</Note>
      {[
        { name: 'Prince', role: 'Strategia, sviluppo commerciale, progetti digitali', initials: 'P' },
        { name: 'Nicola Carpignano', role: 'Social media manager, comunicazione e marketing', initials: 'NC' },
        { name: 'Ilaria Gemma', role: 'Content creator e comunicazione visiva', initials: 'IG' },
      ].map((defaults, i) => {
        const teamItems = (content as any).studio?.team || [];
        const member = teamItems[i] || {};
        const updateMember = (key: string, val: string) => {
          const a: any[] = JSON.parse(JSON.stringify(teamItems.length >= 3 ? teamItems : [
            { name: 'Prince', role: 'Strategia, sviluppo commerciale, progetti digitali' },
            { name: 'Nicola Carpignano', role: 'Social media manager, comunicazione e marketing' },
            { name: 'Ilaria Gemma', role: 'Content creator e comunicazione visiva' },
          ]));
          a[i] = { ...a[i], [key]: val };
          set('studio.team', a);
        };
        return (
          <CardBlock key={i} title={`${defaults.initials} — ${defaults.name}`} accent>
            <Field label="Nome" value={member.name || defaults.name} onChange={(v: string) => updateMember('name', v)} />
            <Field label="Ruolo" value={member.role || defaults.role} onChange={(v: string) => updateMember('role', v)} />
            <Field label="Bio" value={member.bio} onChange={(v: string) => updateMember('bio', v)} multiline rows={4}
              placeholder={`Breve descrizione di ${defaults.name}...`} />
            <ImageField label="Foto profilo (Cloudinary)" value={member.photo} onChange={(v: string) => updateMember('photo', v)} />
            <Field label="Skill (separate da virgola)" value={(member.skills || []).join(', ')} onChange={(v: string) => updateMember('skills', v.split(',').map((s: string) => s.trim()).filter(Boolean) as any)}
              placeholder="Social media strategy, Copywriting, Piano editoriale" />
          </CardBlock>
        );
      })}
    </div>
  );

  // ── COLLABORATORI ────────────────────────────────────────────
  if (block === 'collaboratori') return (
    <div>
      <SectionTitle>Rete collaboratori</SectionTitle>
      {((content as any).studio?.collaboratori || []).map((c: any, i: number) => (
        <CardBlock key={i} title={c.title}
          onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.studio.collaboratori.splice(i, 1); return n; })}>
          <Field label="Titolo profilo" value={c.title} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).studio.collaboratori)); a[i].title = v; set('studio.collaboratori', a); }} />
          <Field label="Descrizione" value={c.desc} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).studio.collaboratori)); a[i].desc = v; set('studio.collaboratori', a); }} multiline />
        </CardBlock>
      ))}
      <AddBtn onClick={() => setContent((p: any) => {
        const n = JSON.parse(JSON.stringify(p));
        if (!n.studio) n.studio = {};
        if (!n.studio.collaboratori) n.studio.collaboratori = [];
        n.studio.collaboratori.push({ title: 'Nuovo profilo', desc: '' }); return n;
      })} label="Aggiungi collaboratore" />
    </div>
  );

  // ── BRANDING ─────────────────────────────────────────────────
  if (block === 'branding') return (
    <div>
      <SectionTitle>Pagina Branding</SectionTitle>
      <Note>Modifica i testi della pagina /branding dedicata all'identità visiva.</Note>
      <Field label="Hero — Tag" value={(content as any).branding?.tag} onChange={(v: string) => set('branding.tag', v)} placeholder="Servizio — Branding & Identità Visiva" />
      <Field label="Hero — Sottotitolo" value={(content as any).branding?.subtitle} onChange={(v: string) => set('branding.subtitle', v)} multiline />
      <Field label="CTA pagina" value={(content as any).branding?.cta} onChange={(v: string) => set('branding.cta', v)} placeholder="Parliamo del tuo brand" />
      <SectionTitle>Deliverable inclusi</SectionTitle>
      {((content as any).branding?.deliverables || []).map((d: any, i: number) => (
        <CardBlock key={i} title={d.title}
          onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.branding.deliverables.splice(i, 1); return n; })}>
          <Field label="Titolo" value={d.title} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).branding.deliverables)); a[i].title = v; set('branding.deliverables', a); }} />
          <Field label="Descrizione" value={d.desc} onChange={(v: string) => { const a = JSON.parse(JSON.stringify((content as any).branding.deliverables)); a[i].desc = v; set('branding.deliverables', a); }} multiline />
        </CardBlock>
      ))}
      <AddBtn onClick={() => setContent((p: any) => {
        const n = JSON.parse(JSON.stringify(p));
        if (!n.branding) n.branding = { deliverables: [] };
        if (!n.branding.deliverables) n.branding.deliverables = [];
        n.branding.deliverables.push({ title: 'Nuovo deliverable', desc: '' }); return n;
      })} label="Aggiungi deliverable" />
    </div>
  );

  // ── CONTATTI HERO ────────────────────────────────────────────
  if (block === 'contact_hero') return (
    <div>
      <SectionTitle>Pagina Contatti — Hero</SectionTitle>
      <Field label="Tag sezione" value={content.contact?.tag} onChange={(v: string) => set('contact.tag', v)} />
      <Field label="Titolo riga 1" value={content.contact?.title?.[0]} onChange={(v: string) => { const t = [...(content.contact?.title || [])]; t[0] = v; set('contact.title', t); }} />
      <Field label="Titolo riga 2" value={content.contact?.title?.[1]} onChange={(v: string) => { const t = [...(content.contact?.title || [])]; t[1] = v; set('contact.title', t); }} />
      <Field label="Sottotitolo" value={(content.contact as any)?.subtitle} onChange={(v: string) => set('contact.subtitle', v)} multiline />
    </div>
  );

  // ── CONTATTI INFO ────────────────────────────────────────────
  if (block === 'contact_info') return (
    <div>
      <SectionTitle>Info di contatto</SectionTitle>
      {(content.contact?.emails || []).map((e: any, i: number) => (
        <CardBlock key={i} title={`Email: ${e.value}`}>
          <Field label="Label" value={e.label} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.contact.emails)); a[i].label = v; set('contact.emails', a); }} />
          <Field label="Indirizzo email" value={e.value} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.contact.emails)); a[i].value = v; set('contact.emails', a); }} />
        </CardBlock>
      ))}
      {(content.contact?.phones || []).map((p: any, i: number) => (
        <CardBlock key={i} title={`Tel: ${p.value}`}>
          <Field label="Label" value={p.label} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.contact.phones)); a[i].label = v; set('contact.phones', a); }} />
          <Field label="Numero" value={p.value} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.contact.phones)); a[i].value = v; set('contact.phones', a); }} />
        </CardBlock>
      ))}
      <Field label="Sede" value={(content.contact as any)?.location} onChange={(v: string) => set('contact.location', v)} placeholder="Taranto, Puglia" />
    </div>
  );

  return <div style={{ fontSize: 12, color: '#444', padding: '1rem 0' }}>Seleziona un blocco dalla sidebar.</div>;
};

// ═══════════════════════════════════════════════════════════════
// CONTENT EDITOR — shell principale
// ═══════════════════════════════════════════════════════════════

export const ContentEditor = () => {
  const [content, setContent] = useState<SiteContent>(WEBSITE_CONTENT);
  const [original, setOriginal] = useState<SiteContent>(WEBSITE_CONTENT);
  const [page, setPage] = useState<Page>('home');
  const [block, setBlock] = useState<string>('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(true);
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({ home: true });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadContent().then(c => { setContent(c); setOriginal(c); setLoading(false); });
  }, []);

  const dirty = JSON.stringify(content) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveContent(content);
    if (ok) {
      setOriginal(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
    } else alert('Salvataggio fallito. Controlla la connessione Firebase.');
    setSaving(false);
  };

  const set = (path: string, value: any) => {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (obj[keys[i]] === undefined) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const selectBlock = (p: Page, b: string) => {
    setPage(p); setBlock(b);
    setExpandedPages(e => ({ ...e, [p]: true }));
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#555', fontSize: 13 }}>Caricamento contenuti...</div>;

  const pageUrl = {
    home: '/#/', studio: '/#/chi-siamo', lavori: '/#/portfolio',
    servizi: '/#/servizi', contatti: '/#/contatti',
  }[page] ?? '/#/';

  const currentPageDef = PAGES.find(p => p.key === page);
  const currentBlockLabel = currentPageDef?.blocks.find(b => b.key === block)?.label || block;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden', background: '#0d0d0d' }}>

      {/* ── Sidebar navigazione ── */}
      <div style={{ width: 210, borderRight: '.5px solid #1e1e1e', overflowY: 'auto', flexShrink: 0, background: '#080808' }}>
        <div style={{ padding: '12px 16px 8px', borderBottom: '.5px solid #1e1e1e' }}>
          <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: '#444' }}>Pagine & Sezioni</div>
        </div>

        {PAGES.map(p => (
          <div key={p.key}>
            <button
              onClick={() => setExpandedPages(e => ({ ...e, [p.key]: !e[p.key] }))}
              style={{ width: '100%', padding: '10px 16px', background: page === p.key ? 'rgba(205,178,255,0.06)' : 'transparent', border: 'none', color: page === p.key ? '#cdb2ff' : '#666', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', transition: 'all .15s' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13 }}>{p.icon}</span> {p.label}
              </span>
              {expandedPages[p.key] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            </button>

            {expandedPages[p.key] && p.blocks.map(b => (
              <button key={b.key} onClick={() => selectBlock(p.key, b.key)}
                style={{ width: '100%', padding: '7px 16px 7px 34px', background: block === b.key && page === p.key ? 'rgba(205,178,255,0.08)' : 'transparent', border: 'none', borderLeft: block === b.key && page === p.key ? '2px solid #cdb2ff' : '2px solid transparent', color: block === b.key && page === p.key ? '#cdb2ff' : '#555', textAlign: 'left', cursor: 'pointer', fontSize: 11, transition: 'all .12s', lineHeight: 1.4 }}>
                {b.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* ── Panel editor ── */}
      <div style={{ width: 340, borderRight: '.5px solid #1e1e1e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Header editor */}
        <div style={{ padding: '10px 16px', borderBottom: '.5px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#cdb2ff' }}>
            {currentBlockLabel}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {dirty && (
              <button onClick={() => setContent(original)}
                style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.04)', border: '.5px solid #333', borderRadius: 100, color: '#666', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <RotateCcw size={10} /> Reset
              </button>
            )}
            <button onClick={handleSave} disabled={!dirty || saving}
              style={{ padding: '5px 16px', background: saved ? '#4ade80' : dirty ? '#cdb2ff' : '#222', color: dirty ? '#000' : '#444', border: 'none', borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', cursor: dirty ? 'pointer' : 'default', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 5 }}>
              {saved ? '✓ Salvato' : saving ? '...' : <><Save size={10} /> Salva</>}
            </button>
          </div>
        </div>

        {/* Indicatore modifiche non salvate */}
        {dirty && (
          <div style={{ background: 'rgba(205,178,255,0.06)', borderBottom: '.5px solid #cdb2ff22', padding: '6px 16px', fontSize: 10, color: '#cdb2ff88', letterSpacing: '.1em' }}>
            ● Modifiche non salvate
          </div>
        )}

        {/* Corpo editor */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <BlockEditor block={block} content={content} set={set} setContent={setContent} />
        </div>
      </div>

      {/* ── Preview ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '8px 16px', borderBottom: '.5px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: 10, background: '#0a0a0a' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, background: '#1a1a1a', borderRadius: 6, padding: '4px 12px', fontSize: 10, color: '#555', fontFamily: 'monospace', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            sitoweb-beta.vercel.app{pageUrl}
          </div>
          <button onClick={() => setPreview(v => !v)}
            style={{ background: 'none', border: '.5px solid #333', borderRadius: 6, color: '#555', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
            {preview ? <><EyeOff size={11} /> Nascondi</> : <><Eye size={11} /> Mostra</>}
          </button>
        </div>

        {preview ? (
          <iframe ref={iframeRef} src={`${window.location.origin}${pageUrl}`}
            style={{ flex: 1, border: 'none', background: '#111' }} title="Anteprima sito" />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#333' }}>
            <div style={{ fontSize: 40 }}>👁</div>
            <div style={{ fontSize: 13 }}>Anteprima nascosta</div>
            <div style={{ fontSize: 11, color: '#2a2a2a' }}>Salva le modifiche per vederle riflesse</div>
          </div>
        )}
      </div>
    </div>
  );
};
