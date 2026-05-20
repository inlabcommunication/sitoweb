import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { Save, RotateCcw, Check, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronRight, Image } from 'lucide-react';
import { WEBSITE_CONTENT } from '../constants';
import { loadContent, saveContent, SiteContent } from '../lib/content';

type Page = 'home' | 'studio' | 'lavori' | 'servizi' | 'journal' | 'contatti';
type Block = string;

const PAGES: { key: Page; label: string; blocks: { key: Block; label: string }[] }[] = [
  { key: 'home', label: 'Home', blocks: [
    { key: 'hero', label: 'Hero' },
    { key: 'manifesto', label: 'Manifesto' },
    { key: 'stats', label: 'Numeri' },
    { key: 'services_grid', label: 'Servizi' },
    { key: 'metodo', label: 'Metodo' },
    { key: 'clients', label: 'Clienti' },
    { key: 'cities', label: 'Città' },
    { key: 'cta_home', label: 'CTA finale' },
  ]},
  { key: 'studio', label: 'Studio', blocks: [
    { key: 'studio_hero', label: 'Hero & Testi' },
    { key: 'team', label: 'Team (con foto)' },
  ]},
  { key: 'lavori', label: 'Lavori', blocks: [
    { key: 'portfolio_settings', label: 'Impostazioni' },
    { key: 'portfolio', label: 'Progetti' },
  ]},
  { key: 'servizi', label: 'Servizi', blocks: [
    { key: 'services_list', label: 'Lista servizi' },
  ]},
  { key: 'journal', label: 'Journal', blocks: [
    { key: 'posts', label: 'Articoli' },
  ]},
  { key: 'contatti', label: 'Contatti', blocks: [
    { key: 'contact_hero', label: 'Hero' },
    { key: 'contact_info', label: 'Info contatto' },
  ]},
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)',
  border: '.5px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 12,
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' as any,
};

const Field = ({ label, value, onChange, multiline = false, hint, placeholder }: any) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 5 }}>{label}</div>
    {hint && <div style={{ fontSize: 10, color: '#444', marginBottom: 4 }}>{hint}</div>}
    {multiline
      ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} style={inputStyle} placeholder={placeholder} />
      : <input value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle} placeholder={placeholder} />}
  </div>
);

const ImageField = ({ label, value, onChange }: any) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 5 }}>{label}</div>
    <input value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle} placeholder="https://res.cloudinary.com/..." />
    {value && (
      <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', background: '#111', border: '.5px solid #2a2a2a' }}>
        <img src={value} alt="preview" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', display: 'block' }}
          onError={e => (e.currentTarget.style.display = 'none')} />
      </div>
    )}
  </div>
);

const CardBlock = ({ title, onDelete, children, collapsed = false }: any) => {
  const [open, setOpen] = useState(!collapsed);
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '.5px solid #2a2a2a', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#cdb2ff' }}>{title}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {onDelete && <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ background: 'none', border: 'none', color: '#ff8888', cursor: 'pointer', padding: 2 }}><Trash2 size={12} /></button>}
          {open ? <ChevronDown size={12} color="#666" /> : <ChevronRight size={12} color="#666" />}
        </div>
      </div>
      {open && <div style={{ padding: '0 14px 14px' }}>{children}</div>}
    </div>
  );
};

const AddBtn = ({ onClick, label }: any) => (
  <button onClick={onClick} style={{ width: '100%', padding: '9px', background: 'rgba(205,178,255,0.06)', border: '.5px dashed #cdb2ff44', borderRadius: 9, color: '#cdb2ff', fontSize: 10, cursor: 'pointer', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 4 }}>
    + {label}
  </button>
);

export const ContentEditor = () => {
  const [content, setContent] = useState<SiteContent>(WEBSITE_CONTENT);
  const [original, setOriginal] = useState<SiteContent>(WEBSITE_CONTENT);
  const [page, setPage] = useState<Page>('home');
  const [block, setBlock] = useState<Block>('hero');
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
      // Ricarica iframe dopo salvataggio
      if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
    } else alert('Salvataggio fallito.');
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

  const selectBlock = (p: Page, b: Block) => { setPage(p); setBlock(b); };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>Caricamento...</div>;

  const pageUrl = { home: '/#/', studio: '/#/chi-siamo', lavori: '/#/lavori', servizi: '/#/servizi', journal: '/#/journal', contatti: '/#/contatti' }[page];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden', background: '#0d0d0d' }}>
      {/* Sidebar */}
      <div style={{ width: 200, borderRight: '.5px solid #1e1e1e', overflowY: 'auto', flexShrink: 0, background: '#0a0a0a' }}>
        <div style={{ padding: '12px 16px 8px', borderBottom: '.5px solid #1e1e1e' }}>
          <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: '#555' }}>Pagine & Blocchi</div>
        </div>
        {PAGES.map(p => (
          <div key={p.key}>
            <button onClick={() => setExpandedPages(e => ({ ...e, [p.key]: !e[p.key] }))}
              style={{ width: '100%', padding: '10px 16px', background: page === p.key ? 'rgba(205,178,255,0.08)' : 'transparent', border: 'none', color: page === p.key ? '#cdb2ff' : '#777', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, letterSpacing: '.08em' }}>
              {p.label}
              {expandedPages[p.key] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            </button>
            {expandedPages[p.key] && p.blocks.map(b => (
              <button key={b.key} onClick={() => selectBlock(p.key, b.key)}
                style={{ width: '100%', padding: '7px 16px 7px 26px', background: block === b.key && page === p.key ? 'rgba(205,178,255,0.06)' : 'transparent', border: 'none', borderLeft: block === b.key && page === p.key ? '2px solid #cdb2ff' : '2px solid transparent', color: block === b.key && page === p.key ? '#cdb2ff' : '#555', textAlign: 'left', cursor: 'pointer', fontSize: 11, transition: 'all .15s' }}>
                {b.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Editor */}
      <div style={{ width: 320, borderRight: '.5px solid #1e1e1e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '.5px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#cdb2ff' }}>
            {PAGES.find(p => p.key === page)?.blocks.find(b => b.key === block)?.label || block}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {dirty && <button onClick={() => setContent(original)} style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: '.5px solid #333', borderRadius: 100, color: '#888', fontSize: 10, cursor: 'pointer' }}><RotateCcw size={11} /></button>}
            <button onClick={handleSave} disabled={!dirty || saving}
              style={{ padding: '5px 14px', background: saved ? '#4ade80' : '#cdb2ff', color: '#000', border: 'none', borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', cursor: dirty ? 'pointer' : 'default', opacity: !dirty ? 0.4 : 1, transition: 'all .2s' }}>
              {saved ? '✓ Salvato' : saving ? '...' : 'Salva'}
            </button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <BlockEditor block={block} content={content} set={set} setContent={setContent} />
        </div>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '8px 16px', borderBottom: '.5px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: 10, background: '#0a0a0a' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, background: '#1a1a1a', borderRadius: 6, padding: '4px 12px', fontSize: 10, color: '#555', fontFamily: 'monospace' }}>
            sitoweb-beta.vercel.app{pageUrl}
          </div>
          <button onClick={() => setPreview(p => !p)} style={{ background: 'none', border: '.5px solid #333', borderRadius: 6, color: '#666', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
            {preview ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
        </div>
        {preview ? (
          <iframe ref={iframeRef} src={`${window.location.origin}${pageUrl}`}
            style={{ flex: 1, border: 'none', background: '#111' }} title="Anteprima" />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 13 }}>
            Salva per vedere le modifiche nell'anteprima
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// BLOCK EDITOR
// ════════════════════════════════════════════════════════════════

const BlockEditor = ({ block, content, set, setContent }: any) => {
  switch (block) {

    case 'hero': return (
      <div>
        <Field label="Tag badge" value={content.hero?.tag} onChange={(v: string) => set('hero.tag', v)} />
        <Field label="Titolo riga 1" value={content.hero?.headline?.line1} onChange={(v: string) => set('hero.headline.line1', v)} />
        <Field label="Titolo riga 2 (outline)" value={content.hero?.headline?.line2} onChange={(v: string) => set('hero.headline.line2', v)} />
        <Field label="Accent corsivo (viola)" value={content.hero?.headline?.accent} onChange={(v: string) => set('hero.headline.accent', v)} />
        <Field label="Descrizione" value={content.hero?.description} onChange={(v: string) => set('hero.description', v)} multiline />
        <Field label="CTA principale" value={content.hero?.cta?.primary} onChange={(v: string) => set('hero.cta.primary', v)} />
        <Field label="CTA secondario" value={content.hero?.cta?.secondary} onChange={(v: string) => set('hero.cta.secondary', v)} />
      </div>
    );

    case 'manifesto': return (
      <div>
        <Field label="Tag sezione" value={(content as any).manifesto?.tag} onChange={(v: string) => set('manifesto.tag', v)} />
        <Field label="Titolo riga 1" value={(content as any).manifesto?.title?.line1} onChange={(v: string) => set('manifesto.title.line1', v)} />
        <Field label="Titolo riga 2" value={(content as any).manifesto?.title?.line2} onChange={(v: string) => set('manifesto.title.line2', v)} />
        <Field label="Titolo riga 3 (outline viola)" value={(content as any).manifesto?.title?.line3} onChange={(v: string) => set('manifesto.title.line3', v)} />
        <Field label="Accent corsivo (viola)" value={(content as any).manifesto?.title?.accent} onChange={(v: string) => set('manifesto.title.accent', v)} />
        <Field label="Testo paragrafo" value={(content as any).manifesto?.text} onChange={(v: string) => set('manifesto.text', v)} multiline />
      </div>
    );

    case 'stats': return (
      <div>
        {(content.stats || []).map((s: any, i: number) => (
          <CardBlock key={i} title={s.num} onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.stats.splice(i, 1); return n; })}>
            <Field label="Numero" value={s.num} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].num = v; set('stats', a); }} />
            <Field label="Etichetta" value={s.label} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].label = v; set('stats', a); }} />
          </CardBlock>
        ))}
        <AddBtn onClick={() => setContent((p: any) => ({ ...p, stats: [...(p.stats || []), { num: '0', label: 'Nuova stat' }] }))} label="Aggiungi stat" />
      </div>
    );

    case 'metodo': return (
      <div>
        <Field label="Tag sezione" value={(content as any).metodo?.tag} onChange={(v: string) => set('metodo.tag', v)} />
        <Field label="Titolo riga 1" value={(content as any).metodo?.title?.[0]} onChange={(v: string) => { const t = [...((content as any).metodo?.title||[])]; t[0]=v; set('metodo.title',t); }} />
        <Field label="Titolo riga 2 (outline)" value={(content as any).metodo?.title?.[1]} onChange={(v: string) => { const t = [...((content as any).metodo?.title||[])]; t[1]=v; set('metodo.title',t); }} />
        <Field label="Sottotitolo" value={(content as any).metodo?.subtitle} onChange={(v: string) => set('metodo.subtitle', v)} multiline />
        <div style={{ marginTop: 16 }}>
          {((content as any).metodo?.steps||[]).map((step: any, i: number) => (
            <CardBlock key={i} title={`${step.n} — ${step.title}`}>
              <Field label="Numero" value={step.n} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).metodo.steps)); a[i].n=v; set('metodo.steps',a); }} />
              <Field label="Titolo step" value={step.title} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).metodo.steps)); a[i].title=v; set('metodo.steps',a); }} />
              <Field label="Descrizione" value={step.desc} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).metodo.steps)); a[i].desc=v; set('metodo.steps',a); }} multiline />
            </CardBlock>
          ))}
          <AddBtn onClick={() => setContent((p: any) => { const n=JSON.parse(JSON.stringify(p)); if(!n.metodo)n.metodo={steps:[]}; n.metodo.steps.push({n:`0${(n.metodo.steps.length+1)}`,title:'Nuovo step',desc:''}); return n; })} label="Aggiungi step" />
        </div>
      </div>
    );

    case 'clients': return (
      <div>
        <Field label="Titolo sezione" value={content.clients?.tag} onChange={(v: string) => set('clients.tag', v)} />
        {(content.clients?.items || []).map((c: any, i: number) => (
          <CardBlock key={i} title={c.name} onDelete={() => setContent((p: any) => { const n=JSON.parse(JSON.stringify(p)); n.clients.items.splice(i,1); return n; })}>
            <Field label="Nome cliente" value={c.name} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.clients.items)); a[i].name=v; set('clients.items',a); }} />
            <Field label="URL sito (opzionale)" value={c.url} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.clients.items)); a[i].url=v; set('clients.items',a); }} />
            <ImageField label="Logo (URL Cloudinary)" value={c.logo} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.clients.items)); a[i].logo=v; set('clients.items',a); }} />
          </CardBlock>
        ))}
        <AddBtn onClick={() => setContent((p: any) => { const n=JSON.parse(JSON.stringify(p)); if(!n.clients)n.clients={tag:'',items:[]}; n.clients.items.push({name:'Nuovo cliente',url:'',logo:''}); return n; })} label="Aggiungi cliente" />
      </div>
    );

    case 'services_grid':
    case 'services_list': return (
      <div>
        <Field label="Tag sezione" value={content.services?.tag} onChange={(v: string) => set('services.tag', v)} />
        {(content.services?.items || []).map((s: any, i: number) => (
          <CardBlock key={i} title={s.title} onDelete={() => setContent((p: any) => { const n=JSON.parse(JSON.stringify(p)); n.services.items.splice(i,1); return n; })}>
            <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: 8 }}>
              <Field label="Icona" value={s.icon} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.services.items)); a[i].icon=v; set('services.items',a); }} />
              <Field label="Titolo" value={s.title} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.services.items)); a[i].title=v; set('services.items',a); }} />
            </div>
            <Field label="Descrizione" value={s.desc} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.services.items)); a[i].desc=v; set('services.items',a); }} multiline />
          </CardBlock>
        ))}
        <AddBtn onClick={() => setContent((p: any) => { const n=JSON.parse(JSON.stringify(p)); n.services.items.push({icon:'◈',title:'Nuovo servizio',desc:''}); return n; })} label="Aggiungi servizio" />
      </div>
    );

    case 'portfolio_settings': return (
      <div>
        <Field label="Tag sezione" value={(content as any).portfolio?.tag} onChange={(v: string) => set('portfolio.tag', v)} />
        <Field label="Sottotitolo" value={(content as any).portfolio?.subtitle} onChange={(v: string) => set('portfolio.subtitle', v)} multiline />
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 8 }}>Categorie filtro</div>
          {((content as any).portfolio?.categories||[]).map((cat: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input value={cat} onChange={e => { const a=[...(content as any).portfolio.categories]; a[i]=e.target.value; set('portfolio.categories',a); }} style={{ ...inputStyle, flex: 1 }} />
              <button onClick={() => setContent((p: any) => { const n=JSON.parse(JSON.stringify(p)); n.portfolio.categories.splice(i,1); return n; })} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', borderRadius: 6, color: '#ff8888', padding: '0 8px', cursor: 'pointer' }}><Trash2 size={11} /></button>
            </div>
          ))}
          <AddBtn onClick={() => setContent((p: any) => { const n=JSON.parse(JSON.stringify(p)); if(!n.portfolio.categories)n.portfolio.categories=[]; n.portfolio.categories.push('nuova'); return n; })} label="Aggiungi categoria" />
        </div>
      </div>
    );

    case 'portfolio': return (
      <div>
        {((content as any).portfolio?.projects||[]).map((p: any, i: number) => (
          <CardBlock key={i} title={p.title} collapsed onDelete={() => setContent((prev: any) => { const n=JSON.parse(JSON.stringify(prev)); n.portfolio.projects.splice(i,1); return n; })}>
            <Field label="Titolo progetto" value={p.title} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].title=v; set('portfolio.projects',a); }} />
            <Field label="Cliente" value={p.client} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].client=v; set('portfolio.projects',a); }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Field label="Categoria" value={p.category} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].category=v; set('portfolio.projects',a); }} hint="social, video, foto..." />
              <Field label="Anno" value={p.year} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].year=v; set('portfolio.projects',a); }} />
            </div>
            <Field label="Risultato / Stat" value={p.stat} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].stat=v; set('portfolio.projects',a); }} />
            <Field label="Descrizione breve" value={p.description} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].description=v; set('portfolio.projects',a); }} multiline />
            <Field label="Risultato dettagliato" value={p.result} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].result=v; set('portfolio.projects',a); }} multiline />
            <ImageField label="Immagine (URL Cloudinary)" value={p.image} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].image=v; set('portfolio.projects',a); }} />
            <Field label="URL Video / Reel (opzionale)" value={p.videoUrl} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].videoUrl=v; set('portfolio.projects',a); }} placeholder="https://www.instagram.com/reel/..." />
            <Field label="Link esterno (opzionale)" value={p.link} onChange={(v: string) => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].link=v; set('portfolio.projects',a); }} placeholder="https://..." />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <input type="checkbox" checked={p.large || false} onChange={e => { const a=JSON.parse(JSON.stringify((content as any).portfolio.projects)); a[i].large=e.target.checked; set('portfolio.projects',a); }} id={`lg-${i}`} style={{ accentColor: '#cdb2ff' }} />
              <label htmlFor={`lg-${i}`} style={{ fontSize: 11, color: '#666' }}>Card grande (occupa tutta la larghezza)</label>
            </div>
          </CardBlock>
        ))}
        <AddBtn onClick={() => setContent((prev: any) => { const n=JSON.parse(JSON.stringify(prev)); if(!n.portfolio)n.portfolio={projects:[]}; n.portfolio.projects.push({id:Date.now().toString(),title:'Nuovo progetto',client:'',category:'social',tags:[],stat:'',year:'2025',large:false,image:'',videoUrl:'',description:'',result:'',link:''}); return n; })} label="Aggiungi progetto" />
      </div>
    );

    case 'studio_hero': return (
      <div>
        <Field label="Tag sezione" value={content.studio?.tag} onChange={(v: string) => set('studio.tag', v)} />
        {(content.studio?.title || []).map((t: string, i: number) => (
          <Field key={i} label={`Titolo riga ${i + 1}`} value={t} onChange={(v: string) => { const a=[...(content.studio?.title||[])]; a[i]=v; set('studio.title',a); }} />
        ))}
        <Field label="Descrizione 1" value={content.studio?.description1} onChange={(v: string) => set('studio.description1', v)} multiline />
        <Field label="Descrizione 2" value={content.studio?.description2} onChange={(v: string) => set('studio.description2', v)} multiline />
      </div>
    );

    case 'team': return (
      <div>
        {((content as any).studio?.team || content.studio?.items || []).map((member: any, i: number) => (
          <CardBlock key={i} title={member.name || member.role}>
            <Field label="Nome / Ruolo breve" value={member.name} onChange={(v: string) => { const key=(content as any).studio?.team?'studio.team':'studio.items'; const a=JSON.parse(JSON.stringify((content as any).studio?.team||content.studio?.items||[])); a[i].name=v; set(key,a); }} />
            <Field label="Ruolo esteso" value={member.role} onChange={(v: string) => { const key=(content as any).studio?.team?'studio.team':'studio.items'; const a=JSON.parse(JSON.stringify((content as any).studio?.team||content.studio?.items||[])); a[i].role=v; set(key,a); }} />
            <Field label="Bio" value={member.bio || member.desc} onChange={(v: string) => { const key=(content as any).studio?.team?'studio.team':'studio.items'; const a=JSON.parse(JSON.stringify((content as any).studio?.team||content.studio?.items||[])); a[i].bio=v; a[i].desc=v; set(key,a); }} multiline />
            <ImageField label="Foto (URL Cloudinary)" value={member.photo} onChange={(v: string) => { const key=(content as any).studio?.team?'studio.team':'studio.items'; const a=JSON.parse(JSON.stringify((content as any).studio?.team||content.studio?.items||[])); a[i].photo=v; set(key,a); }} />
          </CardBlock>
        ))}
      </div>
    );

    case 'cities': return (
      <div>
        <Field label="Tag sezione" value={content.cities?.tag} onChange={(v: string) => set('cities.tag', v)} />
        {(content.cities?.list || []).map((c: string, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input value={c} onChange={e => { const a=[...content.cities.list]; a[i]=e.target.value; set('cities.list',a); }} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => setContent((p: any) => { const n=JSON.parse(JSON.stringify(p)); n.cities.list.splice(i,1); return n; })} style={{ background: 'rgba(255,100,100,0.1)', border: 'none', borderRadius: 6, color: '#ff8888', padding: '0 8px', cursor: 'pointer' }}><Trash2 size={11} /></button>
          </div>
        ))}
        <AddBtn onClick={() => setContent((p: any) => { const n=JSON.parse(JSON.stringify(p)); n.cities.list.push('Nuova città'); return n; })} label="Aggiungi città" />
      </div>
    );

    case 'cta_home': return (
      <div>
        <Field label="Titolo riga 1" value={(content as any).cta?.home?.title} onChange={(v: string) => set('cta.home.title', v)} />
        <Field label="Titolo riga 2" value={(content as any).cta?.home?.title2} onChange={(v: string) => set('cta.home.title2', v)} />
        <Field label="Titolo riga 3 (outline)" value={(content as any).cta?.home?.title3} onChange={(v: string) => set('cta.home.title3', v)} />
        <Field label="Sottotitolo" value={(content as any).cta?.home?.subtitle} onChange={(v: string) => set('cta.home.subtitle', v)} multiline />
        <Field label="Bottone 1" value={(content as any).cta?.home?.btn1} onChange={(v: string) => set('cta.home.btn1', v)} />
        <Field label="Bottone 2" value={(content as any).cta?.home?.btn2} onChange={(v: string) => set('cta.home.btn2', v)} />
      </div>
    );

    case 'contact_hero': return (
      <div>
        <Field label="Tag sezione" value={content.contact?.tag} onChange={(v: string) => set('contact.tag', v)} />
        <Field label="Titolo riga 1" value={content.contact?.title?.[0]} onChange={(v: string) => { const t=[...(content.contact?.title||[])]; t[0]=v; set('contact.title',t); }} />
        <Field label="Titolo riga 2" value={content.contact?.title?.[1]} onChange={(v: string) => { const t=[...(content.contact?.title||[])]; t[1]=v; set('contact.title',t); }} />
        <Field label="Sottotitolo" value={(content.contact as any)?.subtitle} onChange={(v: string) => set('contact.subtitle', v)} multiline />
      </div>
    );

    case 'contact_info': return (
      <div>
        {(content.contact?.emails || []).map((e: any, i: number) => (
          <CardBlock key={i} title={`Email ${i + 1}`}>
            <Field label="Label" value={e.label} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.contact.emails)); a[i].label=v; set('contact.emails',a); }} />
            <Field label="Indirizzo email" value={e.value} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.contact.emails)); a[i].value=v; set('contact.emails',a); }} />
          </CardBlock>
        ))}
        {(content.contact?.phones || []).map((p: any, i: number) => (
          <CardBlock key={i} title={`Telefono ${i + 1}`}>
            <Field label="Label" value={p.label} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.contact.phones)); a[i].label=v; set('contact.phones',a); }} />
            <Field label="Numero" value={p.value} onChange={(v: string) => { const a=JSON.parse(JSON.stringify(content.contact.phones)); a[i].value=v; set('contact.phones',a); }} />
          </CardBlock>
        ))}
        <Field label="Sede" value={(content.contact as any)?.location} onChange={(v: string) => set('contact.location', v)} />
      </div>
    );

    case 'posts': return (
      <div style={{ fontSize: 11, color: '#555' }}>
        <div style={{ padding: 12, background: 'rgba(205,178,255,0.06)', borderRadius: 8, border: '.5px solid #cdb2ff33' }}>
          <div style={{ color: '#cdb2ff', fontWeight: 600, marginBottom: 6 }}>Journal dinamico</div>
          Gli articoli del journal possono essere gestiti dinamicamente. Contattaci per integrare un sistema di articoli da Firestore.
        </div>
      </div>
    );

    default: return <div style={{ fontSize: 12, color: '#444', padding: '1rem 0' }}>Seleziona un blocco dalla sidebar.</div>;
  }
};
