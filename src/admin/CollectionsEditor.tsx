// Editor delle raccolte: schede clienti ("Progetti raccontati"), casi studio a
// blocchi ("Non solo contenuti") ed esempi mostrati nelle pagine servizio.
import { useState } from 'react';
import type React from 'react';
import { Field, ImageField, CardBlock, AddBtn, SectionTitle, Note, inputStyle } from './editorUi';
import { BLOCK_LABELS, emptyBlock, type CaseBlock } from '../data/caseStudies';
import { SERVICES_SEO } from '../seo/routes';
// Durante la digitazione: minuscole, niente spazi o accenti (i trattini finali restano)
const slugify = (v: string) => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]+/g, '-').slice(0, 80);

type Props = { content: any; set: (path: string, value: any) => void };
type FieldDef = { key: string; label: string; kind?: 'text' | 'textarea' | 'image' | 'video'; placeholder?: string; hint?: string; rows?: number };

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const moved = <T,>(arr: T[], i: number, d: number) => {
  const a = clone(arr); const j = i + d;
  if (j < 0 || j >= a.length) return a;
  [a[i], a[j]] = [a[j], a[i]];
  return a;
};

const Select = ({ label, value, onChange, options, hint }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][]; hint?: string }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>{label}</div>
    {hint && <div style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>{hint}</div>}
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
      {options.map(([v, l]) => <option key={v} value={v} style={{ background: '#111' }}>{l}</option>)}
    </select>
  </div>
);

const Check = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#aaa', marginBottom: 12, cursor: 'pointer' }}>
    <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {label}
  </label>
);

const FieldFor: React.FC<{ f: FieldDef; value: any; onChange: (v: any) => void }> = ({ f, value, onChange }) =>
  f.kind === 'image' || f.kind === 'video'
    ? <ImageField label={f.label} value={value} type={f.kind} onChange={onChange} />
    : <Field label={f.label} value={value} onChange={onChange} multiline={f.kind === 'textarea'} rows={f.rows} placeholder={f.placeholder} hint={f.hint} />;

/** Lista di oggetti con aggiungi / elimina / riordina. */
const ObjList = ({ items = [], onChange, fields, newItem, addLabel, titleOf }: {
  items: any[]; onChange: (a: any[]) => void; fields: FieldDef[]; newItem: () => any; addLabel: string; titleOf: (x: any, i: number) => string;
}) => (
  <div style={{ marginBottom: 12 }}>
    {items.map((it, i) => (
      <CardBlock key={i} title={titleOf(it, i)} collapsed={!!titleOf(it, i).trim() && items.length > 2}
        onUp={i > 0 ? () => onChange(moved(items, i, -1)) : undefined}
        onDown={i < items.length - 1 ? () => onChange(moved(items, i, 1)) : undefined}
        onDelete={() => { const a = clone(items); a.splice(i, 1); onChange(a); }}>
        {fields.map((f) => (
          <FieldFor key={f.key} f={f} value={it?.[f.key]} onChange={(v) => { const a = clone(items); a[i] = { ...a[i], [f.key]: v }; onChange(a); }} />
        ))}
      </CardBlock>
    ))}
    <AddBtn label={addLabel} onClick={() => onChange([...clone(items), newItem()])} />
  </div>
);

/** Elenco di righe di testo (una voce per riga). */
const Lines = ({ label, value = [], onChange, hint }: { label: string; value: string[]; onChange: (a: string[]) => void; hint?: string }) => (
  <Field label={label} hint={hint || 'Una voce per riga'} multiline rows={Math.min(10, Math.max(3, value.length + 1))}
    value={(value || []).join('\n')} onChange={(v: string) => onChange(v.split('\n'))} />
);

const Images = ({ label, value = [], onChange }: { label: string; value: string[]; onChange: (a: string[]) => void }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>{label}</div>
    {(value || []).map((img, i) => (
      <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}><ImageField label={`Foto ${i + 1}`} value={img} onChange={(v: string) => { const a = clone(value); a[i] = v; onChange(a); }} /></div>
        <button title="Rimuovi foto" onClick={() => { const a = clone(value); a.splice(i, 1); onChange(a); }}
          style={{ marginTop: 18, background: 'none', border: '.5px solid #3a2a2a', borderRadius: 8, color: '#ff8888', cursor: 'pointer', padding: '8px 9px', fontSize: 11 }}>✕</button>
      </div>
    ))}
    <AddBtn label="Aggiungi foto" onClick={() => onChange([...(value || []), ''])} />
  </div>
);

const REEL_FIELDS: FieldDef[] = [
  { key: 'title', label: 'Titolo del reel', placeholder: 'Es. Il cambio gomme in 30 secondi' },
  { key: 'video', label: 'Video del reel (caricalo dall\'archivio)', kind: 'video' },
  { key: 'instagram', label: 'Link al reel su Instagram', placeholder: 'https://www.instagram.com/reel/...' },
  { key: 'views', label: 'Etichetta visualizzazioni (facoltativa)', placeholder: 'Es. 1,2M views' },
];
const newReel = () => ({ title: '', video: '', instagram: '', views: '' });

// ═══════════════════════════════════════════════════════════════
// PROGETTI RACCONTATI — schede clienti
// ═══════════════════════════════════════════════════════════════

export const ClientsEditor = ({ content, set }: Props) => {
  const items: any[] = content.clients?.items || [];
  const cases: any[] = content.cases?.items || [];
  const upd = (i: number, key: string, val: any) => { const a = clone(items); a[i] = { ...a[i], [key]: val }; set('clients.items', a); };

  return (
    <div>
      <SectionTitle>Progetti raccontati — schede clienti</SectionTitle>
      <Note>Le schede compaiono in Casi studio e in home; ognuna ha la sua pagina (/cliente/…). Usa le frecce per cambiare l'ordine. Le modifiche vanno online con <b>Salva</b>.</Note>
      {items.map((c, i) => (
        <CardBlock key={c.id || i} title={c.name || 'Nuovo cliente'} collapsed
          confirmDelete={`Eliminare la scheda "${c.name}"? Dopo il salvataggio non sarà più visibile sul sito.`}
          onUp={i > 0 ? () => set('clients.items', moved(items, i, -1)) : undefined}
          onDown={i < items.length - 1 ? () => set('clients.items', moved(items, i, 1)) : undefined}
          onDelete={() => { const a = clone(items); a.splice(i, 1); set('clients.items', a); }}>
          <SectionTitle>Informazioni</SectionTitle>
          <Field label="Nome cliente" value={c.name} onChange={(v: string) => upd(i, 'name', v)} />
          <Field label="Indirizzo pagina (ID)" value={c.id} onChange={(v: string) => upd(i, 'id', slugify(v))}
            hint={`Pagina: /cliente/${c.id || '…'} — se lo cambi, i vecchi link smettono di funzionare`} />
          <Field label="Settore" value={c.sector} onChange={(v: string) => upd(i, 'sector', v)} placeholder="Ristorazione, beauty, hospitality..." />
          <Field label="Località" value={c.location} onChange={(v: string) => upd(i, 'location', v)} placeholder="Castellaneta (TA)" />
          <Field label="Riassunto (card e inizio pagina)" value={c.summary} onChange={(v: string) => upd(i, 'summary', v)} multiline rows={2} />
          <Field label="Descrizione della scheda" value={c.description} onChange={(v: string) => upd(i, 'description', v)} multiline rows={4} />
          <Field label="Servizi (separati da virgola)" value={(c.services || []).join(', ')} onChange={(v: string) => upd(i, 'services', v.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="Gestione Social, Reels, Branding" />
          <Lines label="Risultati" value={c.results || []} onChange={(a) => upd(i, 'results', a)} />
          <Select label="Caso studio collegato" value={c.caseStudy || ''} onChange={(v) => upd(i, 'caseStudy', v)}
            options={[['', '— Nessuno —'], ...cases.map((x: any) => [x.id, x.client] as [string, string])]} />

          <SectionTitle>Immagini</SectionTitle>
          <ImageField label="Logo" value={c.logo} onChange={(v: string) => upd(i, 'logo', v)} />
          <ImageField label="Immagine hero (sfondo in alto nella scheda)" value={c.image} onChange={(v: string) => upd(i, 'image', v)} />
          <Images label="Foto (galleria)" value={c.gallery || []} onChange={(a) => upd(i, 'gallery', a)} />

          <SectionTitle>Reel</SectionTitle>
          <Note>Carica il video del reel: si guarda direttamente sul sito. Con il link Instagram compare anche il pulsante per aprirlo su Instagram. Se metti solo il link, la card apre Instagram.</Note>
          <ObjList items={c.reels || []} onChange={(a) => upd(i, 'reels', a)} fields={REEL_FIELDS} newItem={newReel} addLabel="Aggiungi reel"
            titleOf={(r, j) => r.title || `Reel ${j + 1}`} />

          <SectionTitle>Contatti e link</SectionTitle>
          <Field label="Sito web" value={c.website || c.url} onChange={(v: string) => { const a = clone(items); a[i] = { ...a[i], website: v, url: v }; set('clients.items', a); }} placeholder="https://..." />
          <Field label="Instagram" value={c.instagram} onChange={(v: string) => upd(i, 'instagram', v)} placeholder="https://instagram.com/..." />
          <Field label="Facebook" value={c.facebook} onChange={(v: string) => upd(i, 'facebook', v)} placeholder="https://facebook.com/..." />
          <Field label="TikTok" value={c.tiktok} onChange={(v: string) => upd(i, 'tiktok', v)} placeholder="https://tiktok.com/@..." />
          <Field label="Telefono" value={c.phone} onChange={(v: string) => upd(i, 'phone', v)} placeholder="+39 ..." />
          <Field label="Indirizzo" value={c.address} onChange={(v: string) => upd(i, 'address', v)} placeholder="Via ..., Città (TA)" />
        </CardBlock>
      ))}
      <AddBtn label="Aggiungi cliente" onClick={() => set('clients.items', [...clone(items), {
        id: `cliente-${Date.now().toString(36)}`, name: 'Nuovo cliente', sector: '', location: '', summary: '', description: '',
        services: [], results: [], logo: '', image: '', website: '', url: '', instagram: '', gallery: [], reels: [],
      }])} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// NON SOLO CONTENUTI — casi studio a blocchi
// ═══════════════════════════════════════════════════════════════

const TITLE_FIELDS: FieldDef[] = [
  { key: 'tag', label: 'Etichetta piccola', placeholder: 'Es. Obiettivo' },
  { key: 'title', label: 'Titolo (prima riga)' },
  { key: 'titleAccent', label: 'Titolo (seconda riga, in evidenza)' },
];

const BlockFields = ({ b, onChange, clientName }: { b: CaseBlock; onChange: (b: CaseBlock) => void; clientName: string }) => {
  const u = (k: string, v: any) => onChange({ ...(b as any), [k]: v });
  const titles = TITLE_FIELDS.map((f) => <FieldFor key={f.key} f={f} value={(b as any)[f.key]} onChange={(v) => u(f.key, v)} />);
  switch (b.type) {
    case 'text': return <>{titles}
      <Field label="Testo" value={b.body} onChange={(v: string) => u('body', v)} multiline rows={5} />
      <Field label="Riquadro evidenziato: titolo (facoltativo)" value={b.boxTitle} onChange={(v: string) => u('boxTitle', v)} placeholder="Es. Strategia" />
      <Field label="Riquadro evidenziato: testo" value={b.boxBody} onChange={(v: string) => u('boxBody', v)} multiline rows={3} /></>;
    case 'timeline': return <>{titles}
      <ObjList items={b.items} onChange={(a) => u('items', a)} addLabel="Aggiungi fase" newItem={() => ({ title: '', desc: '' })} titleOf={(x, i) => x.title || `Fase ${i + 1}`}
        fields={[{ key: 'title', label: 'Titolo fase' }, { key: 'desc', label: 'Descrizione', kind: 'textarea' }]} /></>;
    case 'steps': return <>{titles}
      <Field label="Testo introduttivo" value={b.body} onChange={(v: string) => u('body', v)} multiline rows={3} />
      <ObjList items={b.items} onChange={(a) => u('items', a)} addLabel="Aggiungi step" newItem={() => ({ title: '', desc: '' })} titleOf={(x, i) => x.title || `Step ${i + 1}`}
        fields={[{ key: 'title', label: 'Titolo step' }, { key: 'desc', label: 'Descrizione', kind: 'textarea' }]} /></>;
    case 'checklist': return <>{titles}
      <Lines label="Voci" value={b.items} onChange={(a) => u('items', a)} />
      <Check label="Mostra come elenco numerato (01, 02…)" value={!!b.numbered} onChange={(v) => u('numbered', v)} /></>;
    case 'website': return <>{titles}
      <Field label="Testo" value={b.body} onChange={(v: string) => u('body', v)} multiline rows={4} />
      <Field label="Indirizzo del sito" value={b.url} onChange={(v: string) => u('url', v)} placeholder="https://..." />
      <ImageField label="Screenshot (facoltativo, altrimenti generato in automatico)" value={b.image} onChange={(v: string) => u('image', v)} />
      <ObjList items={b.pages || []} onChange={(a) => u('pages', a)} addLabel="Aggiungi pagina del sito" newItem={() => ({ url: 'https://', label: '', text: '' })} titleOf={(x, i) => x.label || `Pagina ${i + 1}`}
        fields={[{ key: 'label', label: 'Nome pagina' }, { key: 'url', label: 'Indirizzo pagina' }, { key: 'text', label: 'Descrizione', kind: 'textarea' }]} /></>;
    case 'stats': return <>{titles}
      <Field label="Testo" value={b.body} onChange={(v: string) => u('body', v)} multiline rows={3} />
      <ObjList items={b.items} onChange={(a) => u('items', a)} addLabel="Aggiungi numero" newItem={() => ({ value: '', label: '' })} titleOf={(x, i) => [x.value, x.label].filter(Boolean).join(' — ') || `Numero ${i + 1}`}
        fields={[{ key: 'value', label: 'Valore', hint: 'Es. 200+ (i numeri si animano), ★ 4.9, +35%' }, { key: 'label', label: 'Descrizione' }]} />
      <Field label="Nota sotto i numeri (facoltativa)" value={b.note} onChange={(v: string) => u('note', v)} placeholder="Es. Dati Meta Business Suite, gen–giu 2026" /></>;
    case 'reels': return <>{titles}
      <ObjList items={b.items} onChange={(a) => u('items', a)} fields={REEL_FIELDS} newItem={newReel} addLabel="Aggiungi reel" titleOf={(r, j) => r.title || `Reel ${j + 1}`} /></>;
    case 'gallery': return <>{titles}
      <Images label={`Foto — ${clientName}`} value={b.images} onChange={(a) => u('images', a)} /></>;
    case 'quote': return <>
      <Field label="Citazione / recensione" value={b.text} onChange={(v: string) => u('text', v)} multiline rows={3} />
      <Field label="Autore" value={b.author} onChange={(v: string) => u('author', v)} placeholder="Es. Dott. Francesco Ricciardi" /></>;
  }
};

export const CasesEditor = ({ content, set }: Props) => {
  const items: any[] = content.cases?.items || [];
  const clients: any[] = content.clients?.items || [];
  const [addType, setAddType] = useState<Record<number, CaseBlock['type']>>({});
  const updCase = (i: number, patch: any) => { const a = clone(items); a[i] = { ...a[i], ...patch }; set('cases.items', a); };
  const updHero = (i: number, k: string, v: string) => updCase(i, { hero: { ...(items[i].hero || {}), [k]: v } });
  const setBlocks = (i: number, blocks: CaseBlock[]) => updCase(i, { blocks });

  return (
    <div>
      <SectionTitle>Non solo contenuti — casi studio</SectionTitle>
      <Note>Ogni caso studio ha una <b>card</b> (nell'elenco) e una <b>pagina</b> fatta di blocchi: aggiungi solo quelli che ti servono (testo, fasi, sito web, numeri, reel, foto, citazione) e ordinali con le frecce. La pagina mostra solo i blocchi compilati.</Note>
      {items.map((cs, i) => (
        <CardBlock key={cs.id || i} title={cs.client || 'Nuovo caso studio'} collapsed accent
          confirmDelete={`Eliminare il caso studio "${cs.client}"?`}
          onUp={i > 0 ? () => set('cases.items', moved(items, i, -1)) : undefined}
          onDown={i < items.length - 1 ? () => set('cases.items', moved(items, i, 1)) : undefined}
          onDelete={() => { const a = clone(items); a.splice(i, 1); set('cases.items', a); }}>

          <SectionTitle>Card nell'elenco</SectionTitle>
          <Field label="Cliente / nome progetto" value={cs.client} onChange={(v: string) => updCase(i, { client: v })} />
          <Field label="Indirizzo pagina (ID)" value={cs.id} onChange={(v: string) => updCase(i, { id: slugify(v) })} hint={`Pagina: /casi-studio/${cs.id || '…'}`} />
          <Field label="Numero" value={cs.number} onChange={(v: string) => updCase(i, { number: v })} placeholder="03" />
          <Field label="Titolo" value={cs.title} onChange={(v: string) => updCase(i, { title: v })} />
          <Field label="Categorie" value={cs.category} onChange={(v: string) => updCase(i, { category: v })} placeholder="Sito web · Lead generation · Social" />
          <Field label="Il problema" value={cs.problem} onChange={(v: string) => updCase(i, { problem: v })} multiline rows={2} />
          <Field label="Il risultato" value={cs.result} onChange={(v: string) => updCase(i, { result: v })} multiline rows={2} />
          <Field label="Città in cui è presente (separate da virgola)" value={(cs.locations || []).join(', ')} onChange={(v: string) => updCase(i, { locations: v.split(',').map((t) => t.trim()).filter(Boolean) })}
            hint="Il caso studio compare nella sezione 'I nostri lavori a…' delle pagine locali di queste città" placeholder="Palagianello, Palagiano" />
          <Select label="Scheda cliente collegata" value={cs.clientId || ''} onChange={(v) => updCase(i, { clientId: v })}
            options={[['', '— Nessuna —'], ...clients.map((c: any) => [c.id, c.name] as [string, string])]} />

          <SectionTitle>Apertura della pagina</SectionTitle>
          <Field label="Etichetta" value={cs.hero?.label} onChange={(v: string) => updHero(i, 'label', v)} placeholder="Caso 03 — Social · Video" />
          <Field label="Titolo grande" value={cs.hero?.title} onChange={(v: string) => updHero(i, 'title', v)} multiline rows={2} hint="Vai a capo per spezzare il titolo su due righe" />
          <Field label="Sottotitolo (corsivo lilla)" value={cs.hero?.subtitle} onChange={(v: string) => updHero(i, 'subtitle', v)} />
          <Field label="Introduzione" value={cs.hero?.intro} onChange={(v: string) => updHero(i, 'intro', v)} multiline rows={3} />
          <ImageField label="Immagine di sfondo (facoltativa)" value={cs.hero?.image} onChange={(v: string) => updHero(i, 'image', v)} />
          <Field label="Pulsante: testo (facoltativo)" value={cs.hero?.ctaLabel} onChange={(v: string) => updHero(i, 'ctaLabel', v)} placeholder="Visita il sito" />
          <Field label="Pulsante: link" value={cs.hero?.ctaUrl} onChange={(v: string) => updHero(i, 'ctaUrl', v)} placeholder="https://..." />

          <SectionTitle>Blocchi della pagina</SectionTitle>
          {(cs.blocks || []).map((b: CaseBlock, j: number) => (
            <CardBlock key={j} title={`${j + 1}. ${BLOCK_LABELS[b.type]}${(b as any).tag ? ` — ${(b as any).tag}` : ''}`} collapsed
              confirmDelete="Eliminare questo blocco?"
              onUp={j > 0 ? () => setBlocks(i, moved(cs.blocks, j, -1)) : undefined}
              onDown={j < cs.blocks.length - 1 ? () => setBlocks(i, moved(cs.blocks, j, 1)) : undefined}
              onDelete={() => { const a = clone(cs.blocks); a.splice(j, 1); setBlocks(i, a); }}>
              <BlockFields b={b} clientName={cs.client} onChange={(nb) => { const a = clone(cs.blocks); a[j] = nb; setBlocks(i, a); }} />
            </CardBlock>
          ))}
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <select value={addType[i] || 'text'} onChange={(e) => setAddType((s) => ({ ...s, [i]: e.target.value as CaseBlock['type'] }))} style={{ ...inputStyle, flex: 1 }}>
              {Object.entries(BLOCK_LABELS).map(([k, l]) => <option key={k} value={k} style={{ background: '#111' }}>{l}</option>)}
            </select>
            <button onClick={() => setBlocks(i, [...clone(cs.blocks || []), emptyBlock(addType[i] || 'text')])}
              style={{ padding: '0 14px', background: 'rgba(205,178,255,0.1)', border: '.5px solid #cdb2ff44', borderRadius: 8, color: '#cdb2ff', cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap' }}>+ Aggiungi blocco</button>
          </div>

          <SectionTitle>SEO (facoltativa)</SectionTitle>
          <Field label="Titolo per Google" value={cs.seoTitle} onChange={(v: string) => updCase(i, { seoTitle: v })} placeholder={`${cs.client}: ${cs.title}`} />
          <Field label="Descrizione per Google" value={cs.seoDescription} onChange={(v: string) => updCase(i, { seoDescription: v })} multiline rows={2} placeholder={cs.problem} />
        </CardBlock>
      ))}
      <AddBtn label="Aggiungi caso studio" onClick={() => set('cases.items', [...clone(items), {
        id: `caso-${Date.now().toString(36)}`, number: String(items.length + 1).padStart(2, '0'), client: 'Nuovo caso studio', title: '', category: '', problem: '', result: '',
        hero: {}, blocks: [emptyBlock('text'), emptyBlock('stats')],
      }])} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SERVIZI — esempi per servizio
// ═══════════════════════════════════════════════════════════════

export const ServiceExamplesEditor = ({ content, set }: Props) => {
  const [slug, setSlug] = useState(SERVICES_SEO[0].slug);
  const all: Record<string, any[]> = content.serviceExamples || {};
  const items: any[] = all[slug] || [];
  const clients: any[] = content.clients?.items || [];
  const cases: any[] = content.cases?.items || [];
  const save = (a: any[]) => set('serviceExamples', { ...clone(all), [slug]: a });
  const upd = (i: number, patch: any) => { const a = clone(items); a[i] = { ...a[i], ...patch }; save(a); };
  const titleOf = (e: any) => e.kind === 'site' ? (e.title || e.url || 'Sito / web app')
    : e.kind === 'client' ? `Cliente: ${clients.find((c) => c.id === e.clientId)?.name || '—'}`
    : `Caso studio: ${cases.find((c) => c.id === e.caseId)?.client || '—'}`;

  return (
    <div>
      <SectionTitle>Esempi nelle pagine servizio</SectionTitle>
      <Note>Scegli il servizio e aggiungi i lavori da mostrare in fondo alla sua pagina (sezione "Esempi reali"): un <b>sito o web app</b> con anteprima, una <b>scheda cliente</b> o un <b>caso studio</b>.</Note>
      <Select label="Servizio" value={slug} onChange={setSlug} options={SERVICES_SEO.map((s) => [s.slug, `${s.label} (${(all[s.slug] || []).length})`] as [string, string])} />
      {items.map((e, i) => (
        <CardBlock key={`${slug}-${i}`} title={titleOf(e)}
          onUp={i > 0 ? () => save(moved(items, i, -1)) : undefined}
          onDown={i < items.length - 1 ? () => save(moved(items, i, 1)) : undefined}
          onDelete={() => { const a = clone(items); a.splice(i, 1); save(a); }}>
          <Select label="Tipo" value={e.kind} onChange={(v) => upd(i, v === 'site' ? { kind: v, title: e.title || '', url: e.url || 'https://', desc: e.desc || '' } : v === 'client' ? { kind: v, clientId: e.clientId || clients[0]?.id } : { kind: v, caseId: e.caseId || cases[0]?.id, title: e.title || '', desc: e.desc || '' })}
            options={[['site', 'Sito web / web app'], ['client', 'Scheda cliente'], ['case', 'Caso studio']]} />
          {e.kind === 'site' && <>
            <Field label="Titolo" value={e.title} onChange={(v: string) => upd(i, { title: v })} placeholder="Es. Pala Padel — prenotazione campi" />
            <Field label="Indirizzo" value={e.url} onChange={(v: string) => upd(i, { url: v })} placeholder="https://..." />
            <Field label="Descrizione" value={e.desc} onChange={(v: string) => upd(i, { desc: v })} multiline rows={3} />
            <Field label="Etichette (separate da virgola)" value={(e.tags || []).join(', ')} onChange={(v: string) => upd(i, { tags: v.split(',').map((t) => t.trim()).filter(Boolean) })} placeholder="Web app, Prenotazioni" />
            <ImageField label="Screenshot (facoltativo, altrimenti generato in automatico)" value={e.image} onChange={(v: string) => upd(i, { image: v })} />
            <Select label="Caso studio collegato" value={e.caseStudy || ''} onChange={(v) => upd(i, { caseStudy: v || undefined })}
              options={[['', '— Nessuno —'], ...cases.map((c: any) => [c.id, c.client] as [string, string])]} />
          </>}
          {e.kind === 'client' && (
            <Select label="Cliente" value={e.clientId || ''} onChange={(v) => upd(i, { clientId: v })} options={clients.map((c: any) => [c.id, c.name] as [string, string])} />
          )}
          {e.kind === 'case' && <>
            <Select label="Caso studio" value={e.caseId || ''} onChange={(v) => upd(i, { caseId: v })} options={cases.map((c: any) => [c.id, c.client] as [string, string])} />
            <Field label="Titolo sulla card" value={e.title} onChange={(v: string) => upd(i, { title: v })} />
            <Field label="Descrizione sulla card" value={e.desc} onChange={(v: string) => upd(i, { desc: v })} multiline rows={2} />
          </>}
        </CardBlock>
      ))}
      <AddBtn label="Aggiungi esempio" onClick={() => save([...clone(items), { kind: 'site', title: '', url: 'https://', desc: '', tags: [] }])} />
    </div>
  );
};
