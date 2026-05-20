import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { Save, RotateCcw, Check, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { WEBSITE_CONTENT } from '../constants';
import { loadContent, saveContent, SiteContent } from '../lib/content';

// ════════════════════════════════════════════════════════════════
// CONTENT EDITOR — Split view: editor sx + anteprima dx
// ════════════════════════════════════════════════════════════════

type Page = 'home' | 'studio' | 'lavori' | 'servizi' | 'journal' | 'contatti';
type Block = string;

const PAGES: { key: Page; label: string; blocks: { key: Block; label: string }[] }[] = [
  { key: 'home', label: 'Home', blocks: [
    { key: 'hero', label: 'Hero' },
    { key: 'stats', label: 'Numeri' },
    { key: 'clients', label: 'Clienti' },
    { key: 'services_grid', label: 'Servizi (griglia)' },
    { key: 'featured_works', label: 'Lavori in evidenza' },
    { key: 'cities', label: 'Città' },
    { key: 'cta_home', label: 'CTA finale' },
  ]},
  { key: 'studio', label: 'Studio', blocks: [
    { key: 'studio_hero', label: 'Hero' },
    { key: 'team', label: 'Team' },
    { key: 'collaborators', label: 'Collaboratori' },
  ]},
  { key: 'lavori', label: 'Lavori', blocks: [
    { key: 'lavori_hero', label: 'Hero' },
    { key: 'portfolio', label: 'Progetti' },
  ]},
  { key: 'servizi', label: 'Servizi', blocks: [
    { key: 'servizi_hero', label: 'Hero' },
    { key: 'services_list', label: 'Lista servizi' },
  ]},
  { key: 'journal', label: 'Journal', blocks: [
    { key: 'journal_hero', label: 'Hero' },
    { key: 'posts', label: 'Articoli' },
  ]},
  { key: 'contatti', label: 'Contatti', blocks: [
    { key: 'contact_hero', label: 'Hero' },
    { key: 'contact_info', label: 'Info contatto' },
    { key: 'contact_form', label: 'Form' },
  ]},
];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)',
  border: '.5px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 12,
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' as any,
};

const Field = ({ label, value, onChange, multiline = false, hint }: any) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 5 }}>{label}</div>
    {hint && <div style={{ fontSize: 10, color: '#444', marginBottom: 4 }}>{hint}</div>}
    {multiline
      ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} style={inputStyle} />
      : <input value={value || ''} onChange={e => onChange(e.target.value)} style={inputStyle} />}
  </div>
);

const CardBlock = ({ title, onDelete, children }: any) => (
  <div style={{ background: 'rgba(255,255,255,0.03)', border: '.5px solid #2a2a2a', borderRadius: 10, padding: 14, marginBottom: 10 }}>
    {title && (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#cdb2ff' }}>{title}</div>
        {onDelete && <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#ff8888', cursor: 'pointer', padding: 2 }}><Trash2 size={12} /></button>}
      </div>
    )}
    {children}
  </div>
);

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
    if (ok) { setOriginal(content); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    else alert('Salvataggio fallito.');
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

  const scrollPreview = (sectionId: string) => {
    if (!iframeRef.current) return;
    try {
      const el = iframeRef.current.contentDocument?.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {}
  };

  const selectBlock = (p: Page, b: Block) => {
    setPage(p);
    setBlock(b);
    scrollPreview(`section-${b}`);
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>Caricamento...</div>;

  const pageUrl = {
    home: '/#/',
    studio: '/#/chi-siamo',
    lavori: '/#/lavori',
    servizi: '/#/servizi',
    journal: '/#/journal',
    contatti: '/#/contatti',
  }[page];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden', background: '#0d0d0d' }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 220, borderRight: '.5px solid #1e1e1e', overflowY: 'auto', flexShrink: 0, background: '#0a0a0a' }}>
        <div style={{ padding: '16px 16px 8px', borderBottom: '.5px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#555' }}>Pagine</div>
        </div>
        {PAGES.map(p => (
          <div key={p.key}>
            <button onClick={() => setExpandedPages(e => ({ ...e, [p.key]: !e[p.key] }))}
              style={{ width: '100%', padding: '10px 16px', background: page === p.key ? 'rgba(205,178,255,0.08)' : 'transparent', border: 'none', color: page === p.key ? '#cdb2ff' : '#888', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, letterSpacing: '.05em' }}>
              {p.label}
              {expandedPages[p.key] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
            {expandedPages[p.key] && p.blocks.map(b => (
              <button key={b.key} onClick={() => selectBlock(p.key, b.key)}
                style={{ width: '100%', padding: '8px 16px 8px 28px', background: block === b.key && page === p.key ? 'rgba(205,178,255,0.06)' : 'transparent', border: 'none', borderLeft: block === b.key && page === p.key ? '2px solid #cdb2ff' : '2px solid transparent', color: block === b.key && page === p.key ? '#cdb2ff' : '#555', textAlign: 'left', cursor: 'pointer', fontSize: 11, transition: 'all .15s' }}>
                {b.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* ── Editor ── */}
      <div style={{ width: 300, borderRight: '.5px solid #1e1e1e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '.5px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#cdb2ff' }}>
            {PAGES.find(p => p.key === page)?.blocks.find(b => b.key === block)?.label || block}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {dirty && <button onClick={() => setContent(original)} style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: '.5px solid #333', borderRadius: 100, color: '#888', fontSize: 10, cursor: 'pointer' }}><RotateCcw size={11} /></button>}
            <button onClick={handleSave} disabled={!dirty || saving}
              style={{ padding: '5px 12px', background: saved ? '#4ade80' : '#cdb2ff', color: '#000', border: 'none', borderRadius: 100, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', cursor: dirty ? 'pointer' : 'default', opacity: !dirty ? 0.4 : 1, transition: 'all .2s' }}>
              {saved ? '✓ Salvato' : saving ? '...' : 'Salva'}
            </button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <BlockEditor block={block} content={content} set={set} setContent={setContent} />
        </div>
      </div>

      {/* ── Preview ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '8px 16px', borderBottom: '.5px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: 10, background: '#0a0a0a' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{ flex: 1, background: '#1a1a1a', borderRadius: 6, padding: '4px 12px', fontSize: 10, color: '#555', fontFamily: 'monospace' }}>
            sitoweb-beta.vercel.app{pageUrl}
          </div>
          <button onClick={() => setPreview(p => !p)} style={{ background: 'none', border: '.5px solid #333', borderRadius: 6, color: '#666', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
            {preview ? <EyeOff size={11} /> : <Eye size={11} />} {preview ? 'Nascondi' : 'Anteprima'}
          </button>
        </div>
        {preview ? (
          <iframe
            ref={iframeRef}
            src={`${window.location.origin}${pageUrl}`}
            style={{ flex: 1, border: 'none', background: '#111' }}
            title="Anteprima sito"
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 13 }}>
            Anteprima nascosta — salva per vedere le modifiche
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// BLOCK EDITOR — switcha in base al blocco selezionato
// ════════════════════════════════════════════════════════════════

const BlockEditor = ({ block, content, set, setContent }: any) => {
  switch (block) {

    // ── HOME ────────────────────────────────────────────────────

    case 'hero': return (
      <div>
        <Field label="Tag badge" value={content.hero?.tag} onChange={(v: string) => set('hero.tag', v)} />
        <Field label="Titolo riga 1" value={content.hero?.headline?.line1} onChange={(v: string) => set('hero.headline.line1', v)} />
        <Field label="Titolo riga 2" value={content.hero?.headline?.line2} onChange={(v: string) => set('hero.headline.line2', v)} />
        <Field label="Accent corsivo" value={content.hero?.headline?.accent} onChange={(v: string) => set('hero.headline.accent', v)} />
        <Field label="Descrizione" value={content.hero?.description} onChange={(v: string) => set('hero.description', v)} multiline />
        <Field label="CTA principale" value={content.hero?.cta?.primary} onChange={(v: string) => set('hero.cta.primary', v)} />
        <Field label="CTA secondario" value={content.hero?.cta?.secondary} onChange={(v: string) => set('hero.cta.secondary', v)} />
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

    case 'clients': return (
      <div>
        <Field label="Titolo sezione" value={content.clients?.tag} onChange={(v: string) => set('clients.tag', v)} />
        {(content.clients?.items || []).map((c: any, i: number) => (
          <CardBlock key={i} title={c.name} onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.clients.items.splice(i, 1); return n; })}>
            <Field label="Nome" value={c.name} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].name = v; set('clients.items', a); }} />
            <Field label="URL sito" value={c.url} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].url = v; set('clients.items', a); }} />
            <Field label="URL logo" value={c.logo} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.clients.items)); a[i].logo = v; set('clients.items', a); }} hint="Incolla URL immagine" />
            {c.logo && <img src={c.logo} alt={c.name} style={{ maxHeight: 36, maxWidth: 100, objectFit: 'contain', marginTop: 6, opacity: 0.7 }} onError={e => (e.currentTarget.style.display = 'none')} />}
          </CardBlock>
        ))}
        <AddBtn onClick={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); if (!n.clients) n.clients = { tag: 'Clienti', items: [] }; n.clients.items.push({ name: 'Nuovo cliente', url: '', logo: '' }); return n; })} label="Aggiungi cliente" />
      </div>
    );

    case 'services_grid':
    case 'services_list': return (
      <div>
        <Field label="Tag sezione" value={content.services?.tag} onChange={(v: string) => set('services.tag', v)} />
        {(content.services?.items || []).map((s: any, i: number) => (
          <CardBlock key={i} title={s.title} onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.services.items.splice(i, 1); return n; })}>
            <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: 8 }}>
              <Field label="Icona" value={s.icon} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.services.items)); a[i].icon = v; set('services.items', a); }} />
              <Field label="Titolo" value={s.title} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.services.items)); a[i].title = v; set('services.items', a); }} />
            </div>
            <Field label="Descrizione" value={s.desc} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.services.items)); a[i].desc = v; set('services.items', a); }} multiline />
          </CardBlock>
        ))}
        <AddBtn onClick={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.services.items.push({ icon: '◈', title: 'Nuovo servizio', desc: '' }); return n; })} label="Aggiungi servizio" />
      </div>
    );

    case 'featured_works':
    case 'portfolio': return (
      <div>
        <Field label="Tag sezione" value={content.portfolio?.tag} onChange={(v: string) => set('portfolio.tag', v)} />
        {(content.portfolio?.projects || []).map((p: any, i: number) => (
          <CardBlock key={i} title={p.title} onDelete={() => setContent((prev: any) => { const n = JSON.parse(JSON.stringify(prev)); n.portfolio.projects.splice(i, 1); return n; })}>
            <Field label="Titolo" value={p.title} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.portfolio.projects)); a[i].title = v; set('portfolio.projects', a); }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Field label="Tag" value={p.tag} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.portfolio.projects)); a[i].tag = v; set('portfolio.projects', a); }} hint="video, brand, web..." />
              <Field label="Risultato" value={p.stat} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.portfolio.projects)); a[i].stat = v; set('portfolio.projects', a); }} />
            </div>
            <Field label="Anno" value={p.year} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.portfolio.projects)); a[i].year = v; set('portfolio.projects', a); }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <input type="checkbox" checked={p.large || false} onChange={e => { const a = JSON.parse(JSON.stringify(content.portfolio.projects)); a[i].large = e.target.checked; set('portfolio.projects', a); }} id={`lg-${i}`} />
              <label htmlFor={`lg-${i}`} style={{ fontSize: 11, color: '#666' }}>Card grande</label>
            </div>
          </CardBlock>
        ))}
        <AddBtn onClick={() => setContent((prev: any) => { const n = JSON.parse(JSON.stringify(prev)); if (!n.portfolio) n.portfolio = { tag: '', projects: [] }; n.portfolio.projects.push({ title: 'Nuovo progetto', tag: 'web', stat: '', year: '25', large: false }); return n; })} label="Aggiungi progetto" />
      </div>
    );

    case 'cities': return (
      <div>
        <Field label="Tag sezione" value={content.cities?.tag} onChange={(v: string) => set('cities.tag', v)} />
        {(content.cities?.list || []).map((c: string, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={c} onChange={e => { const a = [...content.cities.list]; a[i] = e.target.value; set('cities.list', a); }} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.cities.list.splice(i, 1); return n; })} style={{ background: 'rgba(255,100,100,0.1)', border: '.5px solid rgba(255,100,100,0.2)', borderRadius: 8, color: '#ff8888', padding: '0 10px', cursor: 'pointer' }}><Trash2 size={12} /></button>
          </div>
        ))}
        <AddBtn onClick={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.cities.list.push('Nuova città'); return n; })} label="Aggiungi città" />
      </div>
    );

    case 'cta_home': return (
      <div>
        <Field label="Titolo CTA" value={content.contact?.cta || 'Iniziamo insieme'} onChange={(v: string) => set('contact.cta', v)} />
        <Field label="Tag sezione contatti" value={content.contact?.tag} onChange={(v: string) => set('contact.tag', v)} />
      </div>
    );

    // ── STUDIO ──────────────────────────────────────────────────

    case 'studio_hero': return (
      <div>
        <Field label="Tag sezione" value={content.studio?.tag} onChange={(v: string) => set('studio.tag', v)} />
        {(content.studio?.title || []).map((t: string, i: number) => (
          <Field key={i} label={`Titolo riga ${i + 1}`} value={t} onChange={(v: string) => { const a = [...(content.studio?.title || [])]; a[i] = v; set('studio.title', a); }} />
        ))}
        <Field label="Descrizione 1" value={content.studio?.description1} onChange={(v: string) => set('studio.description1', v)} multiline />
        <Field label="Descrizione 2" value={content.studio?.description2} onChange={(v: string) => set('studio.description2', v)} multiline />
      </div>
    );

    case 'team': return (
      <div>
        {(content.studio?.items || []).map((s: any, i: number) => (
          <CardBlock key={i} title={s.name}>
            <Field label="Icona" value={s.icon} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.studio.items)); a[i].icon = v; set('studio.items', a); }} />
            <Field label="Nome / Ruolo" value={s.name} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.studio.items)); a[i].name = v; set('studio.items', a); }} />
            <Field label="Ruolo esteso" value={s.role} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.studio.items)); a[i].role = v; set('studio.items', a); }} />
            <Field label="Descrizione" value={s.desc} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.studio.items)); a[i].desc = v; set('studio.items', a); }} multiline />
          </CardBlock>
        ))}
      </div>
    );

    case 'collaborators': return (
      <div>
        <div style={{ fontSize: 11, color: '#555', marginBottom: 12 }}>I collaboratori sono hardcoded nel codice. Per modificarli, edita direttamente App.tsx nella sezione PageChiSiamo.</div>
      </div>
    );

    // ── LAVORI ──────────────────────────────────────────────────

    case 'lavori_hero': return (
      <div>
        <Field label="Tag sezione" value={content.portfolio?.tag} onChange={(v: string) => set('portfolio.tag', v)} />
        <div style={{ fontSize: 11, color: '#555', marginTop: 8 }}>I titoli dell'hero e le stats della pagina Lavori sono hardcoded. Per modificarli edita PageLavori in App.tsx.</div>
      </div>
    );

    // ── SERVIZI ─────────────────────────────────────────────────

    case 'servizi_hero': return (
      <div>
        <Field label="Tag sezione" value={content.services?.tag} onChange={(v: string) => set('services.tag', v)} />
        <div style={{ fontSize: 11, color: '#555', marginTop: 8 }}>I titoli dell'hero sono hardcoded in PageServizi in App.tsx.</div>
      </div>
    );

    // ── JOURNAL ─────────────────────────────────────────────────

    case 'journal_hero': return (
      <div style={{ fontSize: 11, color: '#555' }}>Il journal è hardcoded in PageBlog. Per aggiungere articoli reali, serve integrare un CMS o Firestore. Contattaci per l'implementazione.</div>
    );

    case 'posts': return (
      <div style={{ fontSize: 11, color: '#555' }}>
        Gli articoli del journal sono hardcoded in PageBlog in App.tsx.
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(205,178,255,0.06)', borderRadius: 8, border: '.5px solid #cdb2ff33' }}>
          <div style={{ color: '#cdb2ff', fontWeight: 600, marginBottom: 6 }}>Vuoi articoli dinamici?</div>
          Possiamo integrare Firestore per gestire gli articoli dalla dashboard. Chiedilo allo sviluppatore.
        </div>
      </div>
    );

    // ── CONTATTI ────────────────────────────────────────────────

    case 'contact_hero': return (
      <div>
        <Field label="Tag sezione" value={content.contact?.tag} onChange={(v: string) => set('contact.tag', v)} />
        <Field label="Titolo riga 1" value={content.contact?.title?.[0]} onChange={(v: string) => { const t = [...(content.contact?.title || [])]; t[0] = v; set('contact.title', t); }} />
        <Field label="Titolo riga 2" value={content.contact?.title?.[1]} onChange={(v: string) => { const t = [...(content.contact?.title || [])]; t[1] = v; set('contact.title', t); }} />
      </div>
    );

    case 'contact_info': return (
      <div>
        {(content.contact?.emails || []).map((e: any, i: number) => (
          <CardBlock key={i} title={`Email ${i + 1}`}>
            <Field label="Label" value={e.label} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.contact.emails)); a[i].label = v; set('contact.emails', a); }} />
            <Field label="Email" value={e.value} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.contact.emails)); a[i].value = v; set('contact.emails', a); }} />
          </CardBlock>
        ))}
        {(content.contact?.phones || []).map((p: any, i: number) => (
          <CardBlock key={i} title={`Telefono ${i + 1}`}>
            <Field label="Label" value={p.label} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.contact.phones)); a[i].label = v; set('contact.phones', a); }} />
            <Field label="Numero" value={p.value} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.contact.phones)); a[i].value = v; set('contact.phones', a); }} />
          </CardBlock>
        ))}
      </div>
    );

    case 'contact_form': return (
      <div style={{ fontSize: 11, color: '#555' }}>
        Il form raccoglie: nome, email, telefono, servizio e messaggio. I dati vengono salvati su Firestore nella collezione "leads" e visibili nella tab Lead della dashboard.
      </div>
    );

    default: return (
      <div style={{ fontSize: 12, color: '#444', padding: '1rem 0' }}>Seleziona un blocco dalla sidebar.</div>
    );
  }
};
