import { useState, useEffect } from 'react';
import type React from 'react';
import { Save, RotateCcw, Check, Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { WEBSITE_CONTENT } from '../constants';
import { loadContent, saveContent, SiteContent } from '../lib/content';

type Section = 'brand' | 'hero' | 'marquee' | 'stats' | 'clients' | 'services' | 'portfolio' | 'studio' | 'cities' | 'contact';

const SECTIONS: { key: Section; label: string; desc: string }[] = [
  { key: 'brand', label: 'Brand', desc: 'Nome, location, copyright' },
  { key: 'hero', label: 'Hero', desc: 'Titolo, descrizione, CTA' },
  { key: 'marquee', label: 'Marquee', desc: 'Testi dello slider animato' },
  { key: 'stats', label: 'Numeri', desc: 'Statistiche principali' },
  { key: 'clients', label: 'Clienti', desc: 'Logo, nome e link clienti' },
  { key: 'services', label: 'Servizi', desc: 'Servizi offerti' },
  { key: 'portfolio', label: 'Portfolio', desc: 'Progetti e lavori' },
  { key: 'studio', label: 'Studio', desc: 'Chi siamo, team' },
  { key: 'cities', label: 'Città', desc: 'Aree geografiche servite' },
  { key: 'contact', label: 'Contatti', desc: 'Email, telefono, social' },
];

export const ContentEditor = () => {
  const [content, setContent] = useState<SiteContent>(WEBSITE_CONTENT);
  const [original, setOriginal] = useState<SiteContent>(WEBSITE_CONTENT);
  const [section, setSection] = useState<Section>('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent().then((c) => { setContent(c); setOriginal(c); setLoading(false); });
  }, []);

  const dirty = JSON.stringify(content) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveContent(content);
    if (ok) { setOriginal(content); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    else alert('Salvataggio fallito.');
    setSaving(false);
  };

  const set = (path: string, value: any) => {
    setContent((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--m)' }}>Caricamento...</div>;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      {/* Sidebar sezioni */}
      <div style={{ width: 220, borderRight: '.5px solid var(--b)', overflowY: 'auto', flexShrink: 0, padding: '1.5rem 0' }}>
        {SECTIONS.map((s) => (
          <button key={s.key} onClick={() => setSection(s.key)} style={{ width: '100%', padding: '12px 20px', background: section === s.key ? 'rgba(205,178,255,0.1)' : 'transparent', border: 'none', borderLeft: section === s.key ? '2px solid var(--a)' : '2px solid transparent', color: section === s.key ? 'var(--a)' : 'var(--m)', textAlign: 'left', cursor: 'pointer', transition: 'all .2s' }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', letterSpacing: '.1em' }}>
                {SECTIONS.find(s => s.key === section)?.label.toUpperCase()}
              </h2>
              <p style={{ fontSize: 12, color: 'var(--m)', marginTop: 4 }}>{SECTIONS.find(s => s.key === section)?.desc}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {dirty && (
                <button onClick={() => setContent(original)} className="btn btn-g" style={{ gap: 6 }}>
                  <RotateCcw size={13} /> Annulla
                </button>
              )}
              <button onClick={handleSave} disabled={!dirty || saving} className="btn btn-p" style={{ gap: 6, opacity: !dirty ? 0.4 : 1 }}>
                {saved ? <><Check size={13} /> Salvato</> : <><Save size={13} /> {saving ? 'Salvataggio...' : 'Salva'}</>}
              </button>
            </div>
          </div>

          {section === 'brand' && <BrandEditor content={content} set={set} />}
          {section === 'hero' && <HeroEditor content={content} set={set} />}
          {section === 'marquee' && <MarqueeEditor content={content} set={set} setContent={setContent} />}
          {section === 'stats' && <StatsEditor content={content} setContent={setContent} />}
          {section === 'clients' && <ClientsEditor content={content} setContent={setContent} set={set} />}
          {section === 'services' && <ServicesEditor content={content} setContent={setContent} set={set} />}
          {section === 'portfolio' && <PortfolioEditor content={content} setContent={setContent} set={set} />}
          {section === 'studio' && <StudioEditor content={content} setContent={setContent} set={set} />}
          {section === 'cities' && <CitiesEditor content={content} setContent={setContent} />}
          {section === 'contact' && <ContactEditor content={content} set={set} setContent={setContent} />}
        </div>
      </div>
    </div>
  );
};

// ─── Helpers UI ─────────────────────────────────────────────────

const Field = ({ label, value, onChange, multiline = false, hint }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 6 }}>{label}</div>
    {hint && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{hint}</div>}
    {multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={inputStyle as any} />
    ) : (
      <input value={value} onChange={e => onChange(e.target.value)} style={inputStyle as any} />
    )}
  </div>
);

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 16, padding: '1.5rem', marginBottom: '1rem', ...style }}>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '.5px solid var(--b)', borderRadius: 10, color: 'var(--t)', fontSize: 13, fontFamily: 'var(--fb)', outline: 'none', boxSizing: 'border-box', resize: 'vertical' as any };

// ─── Sezione BRAND ───────────────────────────────────────────────
const BrandEditor = ({ content, set }: any) => (
  <Card>
    <Field label="Nome agenzia" value={content.brand.name} onChange={v => set('brand.name', v)} />
    <Field label="Iniziali (logo)" value={content.brand.shortName} onChange={v => set('brand.shortName', v)} hint="Max 2 caratteri" />
    <Field label="Location" value={content.brand.location} onChange={v => set('brand.location', v)} />
    <Field label="Descrizione estesa" value={content.brand.fullLocation} onChange={v => set('brand.fullLocation', v)} />
    <Field label="Copyright footer" value={content.brand.copy} onChange={v => set('brand.copy', v)} />
  </Card>
);

// ─── Sezione HERO ────────────────────────────────────────────────
const HeroEditor = ({ content, set }: any) => (
  <>
    <Card>
      <Field label="Tag label" value={content.hero.tag} onChange={v => set('hero.tag', v)} />
      <Field label="Titolo riga 1" value={content.hero.headline.line1} onChange={v => set('hero.headline.line1', v)} />
      <Field label="Titolo riga 2" value={content.hero.headline.line2} onChange={v => set('hero.headline.line2', v)} />
      <Field label="Testo accent (corsivo)" value={content.hero.headline.accent} onChange={v => set('hero.headline.accent', v)} />
      <Field label="Descrizione" value={content.hero.description} onChange={v => set('hero.description', v)} multiline />
    </Card>
    <Card>
      <div style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: '1rem' }}>CTA</div>
      <Field label="Bottone primario" value={content.hero.cta.primary} onChange={v => set('hero.cta.primary', v)} />
      <Field label="Bottone secondario" value={content.hero.cta.secondary} onChange={v => set('hero.cta.secondary', v)} />
    </Card>
  </>
);

// ─── Sezione MARQUEE ─────────────────────────────────────────────
const MarqueeEditor = ({ content, setContent }: any) => {
  const items: string[] = content.marquee;
  const update = (i: number, v: string) => setContent((p: any) => { const n = { ...p, marquee: [...p.marquee] }; n.marquee[i] = v; return n; });
  const add = () => setContent((p: any) => ({ ...p, marquee: [...p.marquee, 'Nuovo testo'] }));
  const remove = (i: number) => setContent((p: any) => ({ ...p, marquee: p.marquee.filter((_: any, j: number) => j !== i) }));
  return (
    <Card>
      <div style={{ fontSize: 11, color: 'var(--m)', marginBottom: '1rem' }}>Usa "★" come separatore decorativo</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input value={item} onChange={e => update(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          <button onClick={() => remove(i)} style={{ background: 'rgba(255,100,100,0.1)', border: '.5px solid rgba(255,100,100,0.2)', borderRadius: 8, color: '#ff8888', padding: '0 12px', cursor: 'pointer' }}><Trash2 size={13} /></button>
        </div>
      ))}
      <button onClick={add} className="btn btn-g" style={{ marginTop: 8, gap: 6, fontSize: 11 }}><Plus size={13} /> Aggiungi voce</button>
    </Card>
  );
};

// ─── Sezione STATS ───────────────────────────────────────────────
const StatsEditor = ({ content, setContent }: any) => {
  const stats = content.stats;
  const update = (i: number, key: string, v: string) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.stats[i][key] = v; return n; });
  const add = () => setContent((p: any) => ({ ...p, stats: [...p.stats, { num: '0', label: 'Nuova stat' }] }));
  const remove = (i: number) => setContent((p: any) => ({ ...p, stats: p.stats.filter((_: any, j: number) => j !== i) }));
  return (
    <div>
      {stats.map((s: any, i: number) => (
        <Card key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: 11, color: 'var(--m)' }}>Stat {i + 1}</div>
            <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#ff8888', cursor: 'pointer' }}><Trash2 size={13} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <Field label="Numero" value={s.num} onChange={v => update(i, 'num', v)} />
            <Field label="Etichetta" value={s.label} onChange={v => update(i, 'label', v)} />
          </div>
        </Card>
      ))}
      <button onClick={add} className="btn btn-g" style={{ gap: 6 }}><Plus size={13} /> Aggiungi stat</button>
    </div>
  );
};

// ─── Sezione CLIENTI ─────────────────────────────────────────────
const ClientsEditor = ({ content, setContent, set }: any) => {
  const clients = content.clients?.items || [];
  const update = (i: number, key: string, v: string) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); if (!n.clients) n.clients = { tag: '', items: [] }; n.clients.items[i][key] = v; return n; });
  const add = () => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); if (!n.clients) n.clients = { tag: '', items: [] }; n.clients.items.push({ name: 'Nuovo Cliente', url: '', logo: '' }); return n; });
  const remove = (i: number) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.clients.items.splice(i, 1); return n; });

  return (
    <div>
      <Card>
        <Field label="Titolo sezione" value={content.clients?.tag || 'Alcuni dei nostri clienti'} onChange={v => set('clients.tag', v)} />
      </Card>
      {clients.map((c: any, i: number) => (
        <Card key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t)' }}>{c.name || `Cliente ${i + 1}`}</div>
            <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#ff8888', cursor: 'pointer' }}><Trash2 size={13} /></button>
          </div>
          <Field label="Nome cliente" value={c.name} onChange={v => update(i, 'name', v)} />
          <Field label="URL sito (opzionale)" value={c.url} onChange={v => update(i, 'url', v)} hint="Es: https://esempio.it" />
          <Field label="URL logo (opzionale)" value={c.logo} onChange={v => update(i, 'logo', v)} hint="Incolla URL immagine logo (png, svg, jpg)" />
          {c.logo && (
            <div style={{ marginTop: 8 }}>
              <img src={c.logo} alt={c.name} style={{ maxHeight: 48, maxWidth: 120, objectFit: 'contain', opacity: 0.8 }} onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </Card>
      ))}
      <button onClick={add} className="btn btn-g" style={{ gap: 6 }}><Plus size={13} /> Aggiungi cliente</button>
    </div>
  );
};

// ─── Sezione SERVIZI ─────────────────────────────────────────────
const ServicesEditor = ({ content, setContent, set }: any) => {
  const items = content.services.items;
  const update = (i: number, key: string, v: string) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.services.items[i][key] = v; return n; });
  const add = () => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.services.items.push({ icon: '◈', title: 'Nuovo servizio', desc: '' }); return n; });
  const remove = (i: number) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.services.items.splice(i, 1); return n; });

  return (
    <div>
      <Card>
        <Field label="Tag sezione" value={content.services.tag} onChange={v => set('services.tag', v)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Titolo riga 1" value={content.services.title[0]} onChange={v => { const t = [...content.services.title]; t[0] = v; set('services.title', t); }} />
          <Field label="Titolo riga 2" value={content.services.title[1]} onChange={v => { const t = [...content.services.title]; t[1] = v; set('services.title', t); }} />
        </div>
      </Card>
      {items.map((s: any, i: number) => (
        <Card key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{s.title}</div>
            <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#ff8888', cursor: 'pointer' }}><Trash2 size={13} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
            <Field label="Icona" value={s.icon} onChange={v => update(i, 'icon', v)} />
            <Field label="Titolo" value={s.title} onChange={v => update(i, 'title', v)} />
          </div>
          <Field label="Descrizione" value={s.desc} onChange={v => update(i, 'desc', v)} multiline />
        </Card>
      ))}
      <button onClick={add} className="btn btn-g" style={{ gap: 6 }}><Plus size={13} /> Aggiungi servizio</button>
    </div>
  );
};

// ─── Sezione PORTFOLIO ───────────────────────────────────────────
const PortfolioEditor = ({ content, setContent, set }: any) => {
  const projects = content.portfolio.projects;
  const update = (i: number, key: string, v: any) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.portfolio.projects[i][key] = v; return n; });
  const add = () => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.portfolio.projects.push({ title: 'Nuovo progetto', tag: 'web', stat: '', year: '25', large: false }); return n; });
  const remove = (i: number) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.portfolio.projects.splice(i, 1); return n; });

  return (
    <div>
      <Card>
        <Field label="Tag sezione" value={content.portfolio.tag} onChange={v => set('portfolio.tag', v)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Titolo riga 1" value={content.portfolio.title[0]} onChange={v => { const t = [...content.portfolio.title]; t[0] = v; set('portfolio.title', t); }} />
          <Field label="Titolo riga 2" value={content.portfolio.title[1]} onChange={v => { const t = [...content.portfolio.title]; t[1] = v; set('portfolio.title', t); }} />
        </div>
      </Card>
      {projects.map((p: any, i: number) => (
        <Card key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{p.title}</div>
            <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#ff8888', cursor: 'pointer' }}><Trash2 size={13} /></button>
          </div>
          <Field label="Titolo progetto" value={p.title} onChange={v => update(i, 'title', v)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="Tag" value={p.tag} onChange={v => update(i, 'tag', v)} hint="video, brand, web, social, foto" />
            <Field label="Stat / Risultato" value={p.stat} onChange={v => update(i, 'stat', v)} />
            <Field label="Anno" value={p.year} onChange={v => update(i, 'year', v)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <input type="checkbox" checked={p.large} onChange={e => update(i, 'large', e.target.checked)} id={`large-${i}`} />
            <label htmlFor={`large-${i}`} style={{ fontSize: 12, color: 'var(--m)' }}>Card grande (occupa più spazio)</label>
          </div>
        </Card>
      ))}
      <button onClick={add} className="btn btn-g" style={{ gap: 6 }}><Plus size={13} /> Aggiungi progetto</button>
    </div>
  );
};

// ─── Sezione STUDIO ──────────────────────────────────────────────
const StudioEditor = ({ content, setContent, set }: any) => {
  const items = content.studio.items;
  const update = (i: number, key: string, v: string) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.studio.items[i][key] = v; return n; });

  return (
    <div>
      <Card>
        <Field label="Tag sezione" value={content.studio.tag} onChange={v => set('studio.tag', v)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {content.studio.title.map((t: string, i: number) => (
            <Field key={i} label={`Titolo riga ${i + 1}`} value={t} onChange={v => { const arr = [...content.studio.title]; arr[i] = v; set('studio.title', arr); }} />
          ))}
        </div>
        <Field label="Descrizione 1" value={content.studio.description1} onChange={v => set('studio.description1', v)} multiline />
        <Field label="Descrizione 2" value={content.studio.description2} onChange={v => set('studio.description2', v)} multiline />
      </Card>
      <div style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', margin: '1.5rem 0 1rem' }}>Membri / ruoli</div>
      {items.map((s: any, i: number) => (
        <Card key={i}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 12 }}>
            <Field label="Icona" value={s.icon} onChange={v => update(i, 'icon', v)} />
            <Field label="Nome" value={s.name} onChange={v => update(i, 'name', v)} />
          </div>
          <Field label="Ruolo" value={s.role} onChange={v => update(i, 'role', v)} />
          <Field label="Descrizione" value={s.desc} onChange={v => update(i, 'desc', v)} multiline />
        </Card>
      ))}
    </div>
  );
};

// ─── Sezione CITTÀ ───────────────────────────────────────────────
const CitiesEditor = ({ content, setContent }: any) => {
  const cities: string[] = content.cities.list;
  const update = (i: number, v: string) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.cities.list[i] = v; return n; });
  const add = () => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.cities.list.push('Nuova città'); return n; });
  const remove = (i: number) => setContent((p: any) => { const n = JSON.parse(JSON.stringify(p)); n.cities.list.splice(i, 1); return n; });

  return (
    <Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {cities.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <input value={c} onChange={e => update(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={() => remove(i)} style={{ background: 'rgba(255,100,100,0.1)', border: '.5px solid rgba(255,100,100,0.2)', borderRadius: 8, color: '#ff8888', padding: '0 10px', cursor: 'pointer' }}><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
      <button onClick={add} className="btn btn-g" style={{ marginTop: 12, gap: 6 }}><Plus size={13} /> Aggiungi città</button>
    </Card>
  );
};

// ─── Sezione CONTATTI ────────────────────────────────────────────
const ContactEditor = ({ content, set, setContent }: any) => (
  <div>
    <Card>
      <Field label="Tag sezione" value={content.contact.tag} onChange={v => set('contact.tag', v)} />
      <Field label="Titolo riga 1" value={content.contact.title[0]} onChange={v => { const t = [...content.contact.title]; t[0] = v; set('contact.title', t); }} />
      <Field label="Titolo riga 2" value={content.contact.title[1]} onChange={v => { const t = [...content.contact.title]; t[1] = v; set('contact.title', t); }} />
      <Field label="Testo CTA bottone" value={content.contact.cta} onChange={v => set('contact.cta', v)} />
    </Card>
    <Card>
      <div style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: '1rem' }}>Email</div>
      {content.contact.emails.map((e: any, i: number) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
          <Field label="Label" value={e.label} onChange={v => { const arr = JSON.parse(JSON.stringify(content.contact.emails)); arr[i].label = v; set('contact.emails', arr); }} />
          <Field label="Email" value={e.value} onChange={v => { const arr = JSON.parse(JSON.stringify(content.contact.emails)); arr[i].value = v; set('contact.emails', arr); }} />
        </div>
      ))}
    </Card>
    <Card>
      <div style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: '1rem' }}>Telefono</div>
      {content.contact.phones.map((p: any, i: number) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
          <Field label="Label" value={p.label} onChange={v => { const arr = JSON.parse(JSON.stringify(content.contact.phones)); arr[i].label = v; set('contact.phones', arr); }} />
          <Field label="Numero" value={p.value} onChange={v => { const arr = JSON.parse(JSON.stringify(content.contact.phones)); arr[i].value = v; set('contact.phones', arr); }} />
        </div>
      ))}
    </Card>
  </div>
);
