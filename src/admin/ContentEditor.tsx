import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { Save, RotateCcw, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { WEBSITE_CONTENT } from '../constants';
import { loadContent, saveContent, SiteContent } from '../lib/content';
import { inputStyle, Field, ImageField, CardBlock, AddBtn, SectionTitle, Note } from './editorUi';
import { ClientsEditor, CasesEditor, ServiceExamplesEditor } from './CollectionsEditor';

// ─── Struttura pagine + blocchi ────────────────────────────────

type Page = 'home' | 'casi' | 'servizi' | 'studio' | 'contatti';

// Solo le sezioni che il sito legge davvero da qui. I testi lunghi delle
// pagine servizio restano nel codice; i loro esempi si gestiscono in "Servizi".
const PAGES: { key: Page; label: string; icon: string; blocks: { key: string; label: string }[] }[] = [
  {
    key: 'home', label: 'Home', icon: '🏠',
    blocks: [
      { key: 'hero',            label: '① Hero' },
      { key: 'marquee',         label: '② Fascia scorrevole' },
      { key: 'manifesto',       label: '③ Manifesto' },
      { key: 'metodo',          label: '④ Metodo' },
      { key: 'stats',           label: '⑤ Numeri' },
      { key: 'cta_home',        label: '⑥ CTA finale' },
    ],
  },
  {
    key: 'casi', label: 'Casi studio', icon: '📂',
    blocks: [
      { key: 'clients', label: 'Progetti raccontati (schede clienti)' },
      { key: 'cases',   label: 'Non solo contenuti (casi studio)' },
    ],
  },
  {
    key: 'servizi', label: 'Servizi', icon: '🧩',
    blocks: [
      { key: 'service_examples', label: 'Esempi per servizio' },
    ],
  },
  {
    key: 'studio', label: 'Chi siamo', icon: '👥',
    blocks: [
      { key: 'studio_hero', label: 'Hero & Intro' },
      { key: 'team',        label: 'Team' },
      { key: 'collaboratori', label: 'Collaboratori' },
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
        hint="Piccolo testo sopra il titolo. È il titolo principale (H1) della home per Google: tieni servizio e città" placeholder="Agenzia di comunicazione a Castellaneta (TA): social, video, siti e Meta Ads" />
      <Field label="CTA principale" value={content.hero?.cta?.primary} onChange={(v: string) => set('hero.cta.primary', v)}
        placeholder="Raccontaci il tuo progetto" />
      <Field label="Descrizione" value={(content.hero as any)?.description} onChange={(v: string) => set('hero.description', v)} multiline
        hint="Paragrafo sotto il titolo" />
      <Note>I 3 numeri sotto il bottone sono i primi 3 della sezione ⑥ Numeri.</Note>
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

  // ── CASI STUDIO / SERVIZI (raccolte) ─────────────────────────
  if (block === 'clients') return <ClientsEditor content={content} set={set} />;
  if (block === 'cases') return <CasesEditor content={content} set={set} />;
  if (block === 'service_examples') return <ServiceExamplesEditor content={content} set={set} />;

  // ── STATS ────────────────────────────────────────────────────
  if (block === 'stats') return (
    <div>
      <SectionTitle>Numeri animati</SectionTitle>
      <Note>Usati nella fascia lilla "I numeri", nelle pagine Studio/Servizi/città e (i primi 3) sotto il titolo della home. Nel campo "Valore" scrivi solo il numero: 3200000 diventa 3.2M.</Note>
      {(content.stats || []).map((s: any, i: number) => (
        <CardBlock key={i} title={`${s.value || s.num || '?'} — ${s.label}`}
          onDelete={() => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.stats.splice(i, 1); return n; })}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 48px', gap: 8 }}>
            <Field label="Etichetta" value={s.label} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].label = v; set('stats', a); }} />
            <Field label="Prefisso" value={s.prefix} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].prefix = v; set('stats', a); }} placeholder="€" />
            <Field label="Suffisso" value={s.suffix} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].suffix = v; set('stats', a); }} placeholder="+" />
          </div>
          <Field label="Etichetta breve (hero)" value={s.short} onChange={(v: string) => { const a = JSON.parse(JSON.stringify(content.stats)); a[i].short = v; set('stats', a); }} placeholder="visualizzazioni" />
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
      <SectionTitle>CTA finale (in fondo alle pagine)</SectionTitle>
      <Field label="Tag / label piccolo" value={(content as any).cta?.home?.tag} onChange={(v: string) => set('cta.home.tag', v)} placeholder="Iniziamo" />
      <Field label="Titolo riga 1" value={(content as any).cta?.home?.title} onChange={(v: string) => set('cta.home.title', v)} placeholder="HAI UN'ATTIVITÀ," />
      <Field label="Titolo riga 2" value={(content as any).cta?.home?.title2} onChange={(v: string) => set('cta.home.title2', v)} placeholder="UN BRAND O UN PROGETTO" />
      <Field label="Accent corsivo" value={(content as any).cta?.home?.accent} onChange={(v: string) => set('cta.home.accent', v)} placeholder="da raccontare meglio?" />
      <Field label="Sottotitolo" value={(content as any).cta?.home?.subtitle} onChange={(v: string) => set('cta.home.subtitle', v)} multiline />
      <Field label="Bottone principale" value={(content as any).cta?.home?.btn1} onChange={(v: string) => set('cta.home.btn1', v)} placeholder="Parla con InLab" />
    </div>
  );

  // ── STUDIO HERO ──────────────────────────────────────────────
  if (block === 'studio_hero') return (
    <div>
      <SectionTitle>Chi siamo — Hero</SectionTitle>
      <Field label="Tag sezione" value={content.studio?.tag} onChange={(v: string) => set('studio.tag', v)} placeholder="Il laboratorio" />
      {['Titolo riga 1', 'Titolo riga 2 (tono tenue)', 'Frase corsiva lilla'].map((label, i) => (
        <Field key={i} label={label} value={(content.studio?.title || [])[i]} onChange={(v: string) => {
          const a = [...(content.studio?.title || [])]; a[i] = v; set('studio.title', a);
        }} />
      ))}
      <Field label="Sottotitolo" value={content.studio?.description1} onChange={(v: string) => set('studio.description1', v)} multiline />
    </div>
  );

  // ── TEAM ─────────────────────────────────────────────────────
  if (block === 'team') {
    const team: any[] = ((content as any).studio?.team || []).filter((m: any) => m?.name !== 'Prince');
    const setTeam = (a: any[]) => set('studio.team', a);
    const upd = (i: number, key: string, val: any) => { const a = JSON.parse(JSON.stringify(team)); a[i] = { ...a[i], [key]: val }; setTeam(a); };
    return (
      <div>
        <SectionTitle>Team InLab</SectionTitle>
        <Note>Le card della pagina Chi siamo. Senza foto viene mostrata l'iniziale del nome.</Note>
        {team.map((m, i) => (
          <CardBlock key={i} title={m.name || `Persona ${i + 1}`} accent
            onDelete={() => { const a = JSON.parse(JSON.stringify(team)); a.splice(i, 1); setTeam(a); }}>
            <Field label="Nome" value={m.name} onChange={(v: string) => upd(i, 'name', v)} />
            <Field label="Ruolo" value={m.role} onChange={(v: string) => upd(i, 'role', v)} />
            <Field label="Bio" value={m.bio} onChange={(v: string) => upd(i, 'bio', v)} multiline rows={4} />
            <Field label="Formazione (una per riga)" value={(m.edu || []).join('\n')} onChange={(v: string) => upd(i, 'edu', v.split('\n').map((x: string) => x.trim()).filter(Boolean))} multiline rows={3}
              placeholder="Psicologia della comunicazione — Sapienza Università di Roma" />
            <Field label="Competenze (separate da virgola)" value={(m.skills || []).join(', ')} onChange={(v: string) => upd(i, 'skills', v.split(',').map((x: string) => x.trim()).filter(Boolean))} />
            <ImageField label="Foto profilo" value={m.photo} onChange={(v: string) => upd(i, 'photo', v)} />
          </CardBlock>
        ))}
        <AddBtn onClick={() => setTeam([...team, { name: 'Nuova persona', role: '', bio: '', edu: [], skills: [], photo: '' }])} label="Aggiungi persona" />
      </div>
    );
  }

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

  // ── CONTATTI HERO ────────────────────────────────────────────
  if (block === 'contact_hero') return (
    <div>
      <SectionTitle>Pagina Contatti — Hero</SectionTitle>
      <Field label="Tag sezione" value={content.contact?.tag} onChange={(v: string) => set('contact.tag', v)} />
      <Field label="Titolo riga 1" value={content.contact?.title?.[0]} onChange={(v: string) => { const t = [...(content.contact?.title || [])]; t[0] = v; set('contact.title', t); }} />
      <Field label="Titolo riga 2" value={content.contact?.title?.[1]} onChange={(v: string) => { const t = [...(content.contact?.title || [])]; t[1] = v; set('contact.title', t); }} />
      <Field label="Frase corsiva lilla" value={(content.contact as any)?.accent} onChange={(v: string) => set('contact.accent', v)} placeholder="senza impegno." />
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
    loadContent(false, true).then(c => { setContent(c); setOriginal(c); setLoading(false); });
  }, []);

  const dirty = JSON.stringify(content) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveContent(content);
    if (ok) {
      // Rigenera le pagine per Google (nuovi clienti/casi studio) se il Deploy Hook è configurato
      import('../lib/firebase').then(({ auth }) => auth?.currentUser?.getIdToken())
        .then((token) => token && fetch('/api/publish', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }))
        .catch(() => { /* facoltativo: senza hook le pagine si aggiornano al prossimo deploy */ });
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
    home: '/', studio: '/chi-siamo', casi: '/casi-studio',
    servizi: '/siti-web', contatti: '/contatti',
  }[page] ?? '/';

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
      <div style={{ width: ['clients', 'cases', 'service_examples'].includes(block) ? 480 : 340, borderRight: '.5px solid #1e1e1e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
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
            {window.location.host}{pageUrl}
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
