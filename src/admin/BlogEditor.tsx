import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { Plus, Save, Trash2, Eye, Edit3, CheckCircle, AlertCircle, ExternalLink, RefreshCw, Bold, Heading2, Link2, List, Quote, Image as ImageIcon } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { BLOG_CATEGORIES, BLOG_SEED, normalizePost, slugify, type BlogPost } from '../data/blogSeed';
import { Markdown } from '../components/Markdown';
import { useMediaLibrary } from './MediaLibrary';

// Articoli del blog. Quelli "inclusi nel sito" sono nel codice: salvandoli qui
// se ne crea una copia in Firestore che li sostituisce (eliminarla ripristina
// l'originale). Gli articoli nuovi vivono solo in Firestore (blog_posts).

const AUTHORS = ['Nicola Carpignano', 'Ilaria Gemma', 'InLab Communication'];
const LIMITS = { title: 140, excerpt: 300, content: 60000, seoTitle: 70, seoDescription: 170 };
const today = () => new Date().toISOString().slice(0, 10);

type Row = BlogPost & { source: 'seed' | 'remote' | 'override' };

const emptyPost = (): BlogPost => ({
  slug: '', title: '', excerpt: '', content: '## Primo titolo\n\nScrivi qui il testo dell\'articolo.\n', category: BLOG_CATEGORIES[0],
  tags: [], author: AUTHORS[0], date: today(), cover: '', published: false, seoTitle: '', seoDescription: '',
});

const input: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '.5px solid var(--b)', borderRadius: 10, color: 'var(--t)', fontSize: 13, fontFamily: 'var(--fb)', outline: 'none', boxSizing: 'border-box' };

const Label = ({ children, count, max }: { children: React.ReactNode; count?: number; max?: number }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', margin: '14px 0 5px' }}>
    <span>{children}</span>
    {max !== undefined && <span style={{ letterSpacing: 0, color: (count || 0) > max ? '#ff8888' : 'var(--m)' }}>{count}/{max}</span>}
  </div>
);

export const BlogEditor = () => {
  const [remote, setRemote] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [edit, setEdit] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err' | 'info'; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { pick, Modal } = useMediaLibrary();

  const load = async () => {
    if (!db) return;
    setLoading(true); setLoadError(false);
    try {
      const snap = await getDocs(collection(db, 'blog_posts'));
      setRemote(snap.docs.map((d) => normalizePost(d.id, d.data())));
    } catch (e) {
      console.error('[blog] lettura fallita', e);
      setLoadError(true);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const rows: Row[] = useMemo(() => {
    const map = new Map<string, Row>();
    BLOG_SEED.forEach((p) => map.set(p.slug, { ...p, source: 'seed' }));
    remote.forEach((p) => map.set(p.slug, { ...p, source: map.has(p.slug) ? 'override' : 'remote' }));
    return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
  }, [remote]);

  const open = (p: BlogPost, fresh = false) => {
    if (dirty && !confirm('Ci sono modifiche non salvate. Continuare?')) return;
    setEdit({ ...p, tags: [...p.tags] }); setIsNew(fresh); setPreview(false); setStatus(null); setDirty(false);
  };

  const set = <K extends keyof BlogPost>(k: K, v: BlogPost[K]) => {
    setEdit((e) => {
      if (!e) return e;
      const next = { ...e, [k]: v };
      if (k === 'title' && isNew) next.slug = slugify(String(v));
      return next;
    });
    setDirty(true);
  };

  const wrap = (before: string, after = '', placeholder = 'testo') => {
    const ta = textRef.current; if (!ta || !edit) return;
    const { selectionStart: a, selectionEnd: b, value } = ta;
    const sel = value.slice(a, b) || placeholder;
    const next = value.slice(0, a) + before + sel + after + value.slice(b);
    set('content', next);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(a + before.length, a + before.length + sel.length); });
  };
  const linePrefix = (prefix: string) => {
    const ta = textRef.current; if (!ta || !edit) return;
    const { selectionStart: a, value } = ta;
    const start = value.lastIndexOf('\n', a - 1) + 1;
    set('content', value.slice(0, start) + prefix + value.slice(start));
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(a + prefix.length, a + prefix.length); });
  };
  const insertImage = async () => {
    const url = await pick('image');
    if (url) wrap(`\n\n![`, `](${url})\n\n`, 'Descrizione immagine');
  };

  const validate = (p: BlogPost): string | null => {
    if (!p.title.trim()) return 'Manca il titolo.';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug) || p.slug.length > 80) return 'Indirizzo (slug) non valido: solo lettere minuscole, numeri e trattini.';
    if (isNew && rows.some((r) => r.slug === p.slug)) return 'Esiste già un articolo con questo indirizzo: cambia il titolo o lo slug.';
    if (!p.content.trim()) return 'Manca il testo.';
    for (const [k, max] of Object.entries(LIMITS)) if (String((p as any)[k] || '').length > max) return `Il campo "${k}" è troppo lungo (max ${max} caratteri).`;
    if (p.cover && !/^https:\/\//.test(p.cover)) return 'L\'immagine di copertina deve essere un indirizzo https://';
    return null;
  };

  const save = async (publishedOverride?: boolean) => {
    if (!db || !edit) return;
    const p = { ...edit, published: publishedOverride ?? edit.published, title: edit.title.trim(), excerpt: edit.excerpt.trim() };
    const err = validate(p);
    if (err) { setStatus({ kind: 'err', msg: err }); return; }
    setBusy(true); setStatus(null);
    try {
      const data: Record<string, unknown> = {
        title: p.title, excerpt: p.excerpt, content: p.content, category: p.category, tags: p.tags.slice(0, 12),
        author: p.author, date: p.date, published: p.published, updatedAt: new Date().toISOString(),
      };
      if (p.cover) data.cover = p.cover;
      if (p.seoTitle?.trim()) data.seoTitle = p.seoTitle.trim();
      if (p.seoDescription?.trim()) data.seoDescription = p.seoDescription.trim();
      await setDoc(doc(db, 'blog_posts', p.slug), data);
      setEdit(p); setIsNew(false); setDirty(false);
      setRemote((r) => [...r.filter((x) => x.slug !== p.slug), p]);
      setStatus({ kind: 'ok', msg: p.published ? 'Salvato e pubblicato: è già visibile sul sito.' : 'Salvato come bozza (non visibile sul sito).' });
    } catch (e) {
      console.error('[blog] salvataggio fallito', e);
      setStatus({ kind: 'err', msg: 'Salvataggio non riuscito. Hai pubblicato le nuove regole Firestore (firestore.rules)?' });
    }
    setBusy(false);
  };

  const remove = async (row: Row) => {
    if (!db) return;
    const msg = row.source === 'override'
      ? 'Eliminare le modifiche e ripristinare la versione originale di questo articolo?'
      : 'Eliminare definitivamente questo articolo?';
    if (!confirm(msg)) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, 'blog_posts', row.slug));
      setRemote((r) => r.filter((x) => x.slug !== row.slug));
      if (edit?.slug === row.slug) { setEdit(null); setDirty(false); }
      setStatus({ kind: 'ok', msg: row.source === 'override' ? 'Ripristinata la versione originale.' : 'Articolo eliminato.' });
    } catch {
      setStatus({ kind: 'err', msg: 'Eliminazione non riuscita.' });
    }
    setBusy(false);
  };

  const redeploy = async () => {
    setBusy(true); setStatus(null);
    let msg: { kind: 'ok' | 'err' | 'info'; msg: string };
    try {
      const token = await auth?.currentUser?.getIdToken();
      const r = await fetch('/api/publish', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      msg = r.ok ? { kind: 'ok', msg: 'Aggiornamento avviato: tra 1-2 minuti sitemap e pagine per Google includono le novità. Lo vedi partire su Vercel → Deployments.' }
        : r.status === 501 ? { kind: 'info', msg: 'Aggiornamento automatico non configurato: su Vercel manca VERCEL_DEPLOY_HOOK_URL (o non è stato fatto il Redeploy dopo averla aggiunta).' }
        : r.status === 401 ? { kind: 'err', msg: 'Non autorizzato: esci e rientra nella dashboard, poi riprova.' }
        : r.status === 429 ? { kind: 'err', msg: 'Troppe richieste in poco tempo: riprova tra un\'ora.' }
        : r.status === 502 ? { kind: 'err', msg: 'Vercel ha rifiutato la richiesta: controlla che VERCEL_DEPLOY_HOOK_URL sia il link completo del Deploy Hook.' }
        : { kind: 'err', msg: `Aggiornamento non avviato (errore ${r.status}), riprova più tardi.` };
    } catch {
      msg = { kind: 'err', msg: 'Aggiornamento non avviato: connessione non riuscita, riprova.' };
    }
    setStatus(msg);
    setBusy(false);
  };

  const badge = (r: Row) => {
    const b = !r.published ? ['Bozza', '#ffb86b'] : r.source === 'seed' ? ['Incluso nel sito', 'var(--m)'] : r.source === 'override' ? ['Modificato', 'var(--a)'] : ['Pubblicato', '#7ee0a1'];
    return <span style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: b[1] }}>{b[0]}</span>;
  };

  const tool = (icon: React.ReactNode, title: string, fn: () => void) => (
    <button type="button" title={title} onClick={fn} style={{ background: 'rgba(255,255,255,0.04)', border: '.5px solid var(--b)', borderRadius: 8, color: 'var(--t)', padding: '6px 8px', cursor: 'pointer', display: 'flex' }}>{icon}</button>
  );

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: '1.8rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.6rem', letterSpacing: '.05em', marginBottom: 6 }}>BLOG</h2>
          <p style={{ fontSize: 13, color: 'var(--m)' }}>Scrivi, modifica e pubblica gli articoli. Quelli pubblicati compaiono subito su <a href="/blog" target="_blank" rel="noreferrer" style={{ color: 'var(--a)' }}>/blog</a>.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-g" onClick={redeploy} disabled={busy} title="Rigenera sitemap e pagine per Google" style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: busy ? 0.6 : 1 }}><RefreshCw size={13} /> {busy ? 'Avvio in corso…' : 'Aggiorna per Google'}</button>
          <button className="btn btn-p" onClick={() => open(emptyPost(), true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Nuovo articolo</button>
        </div>
      </div>

      {status && (
        <div style={{ padding: '12px 14px', borderRadius: 10, marginBottom: '1.2rem', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center',
          background: status.kind === 'err' ? 'rgba(255,120,120,0.08)' : 'rgba(205,178,255,0.07)', border: `.5px solid ${status.kind === 'err' ? 'rgba(255,120,120,0.35)' : 'rgba(205,178,255,0.25)'}`, color: status.kind === 'err' ? '#ffb4b4' : 'var(--t)' }}>
          {status.kind === 'err' ? <AlertCircle size={14} /> : <CheckCircle size={14} color="var(--a)" />} {status.msg}
        </div>
      )}
      {loadError && <div style={{ fontSize: 12, color: '#ffb4b4', marginBottom: '1rem' }}>Non riesco a leggere gli articoli salvati: controlla di aver pubblicato le regole Firestore aggiornate.</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,340px) 1fr', gap: '1.5rem', alignItems: 'start' }} className="blog-admin-grid">
        <style>{`@media(max-width:900px){.blog-admin-grid{grid-template-columns:1fr!important}}`}</style>
        <div style={{ background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 16, overflow: 'hidden' }}>
          {loading && <div style={{ padding: '1rem', fontSize: 12, color: 'var(--m)' }}>Caricamento...</div>}
          {rows.map((r) => (
            <div key={r.slug} onClick={() => open(r)} style={{ padding: '14px 16px', borderBottom: '.5px solid var(--b)', cursor: 'pointer', background: edit?.slug === r.slug && !isNew ? 'rgba(205,178,255,0.08)' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>{badge(r)}<span style={{ fontSize: 10, color: 'var(--m)' }}>{r.date}</span></div>
              <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>{r.title}</div>
            </div>
          ))}
        </div>

        {!edit ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--m)', fontSize: 13, background: 'var(--s)', border: '.5px dashed var(--b)', borderRadius: 16 }}>
            Seleziona un articolo o creane uno nuovo.
          </div>
        ) : (
          <div style={{ background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 16, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)' }}>{isNew ? 'Nuovo articolo' : 'Modifica articolo'}{dirty && ' · modifiche non salvate'}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!isNew && edit.published && <a href={`/blog/${edit.slug}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--a)' }}><ExternalLink size={12} /> Apri</a>}
                {!isNew && rows.find((r) => r.slug === edit.slug && r.source !== 'seed') && (
                  <button onClick={() => remove(rows.find((r) => r.slug === edit.slug)!)} disabled={busy} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#ff8888', cursor: 'pointer', fontSize: 12 }}>
                    <Trash2 size={12} /> {rows.find((r) => r.slug === edit.slug)?.source === 'override' ? 'Ripristina originale' : 'Elimina'}
                  </button>
                )}
              </div>
            </div>

            <Label count={edit.title.length} max={LIMITS.title}>Titolo</Label>
            <input style={{ ...input, fontSize: 16 }} value={edit.title} onChange={(e) => set('title', e.target.value)} placeholder="Es. Come scegliere un'agenzia social" />

            <Label>Indirizzo</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--m)' }}>/blog/</span>
              <input style={{ ...input, opacity: isNew ? 1 : 0.6 }} value={edit.slug} disabled={!isNew} onChange={(e) => { setEdit({ ...edit, slug: slugify(e.target.value) }); setDirty(true); }} />
            </div>
            {!isNew && <div style={{ fontSize: 11, color: 'var(--m)', marginTop: 4 }}>L'indirizzo non si cambia dopo il primo salvataggio (i link già condivisi smetterebbero di funzionare).</div>}

            <Label count={edit.excerpt.length} max={LIMITS.excerpt}>Anteprima (compare nell'elenco e su Google)</Label>
            <textarea style={{ ...input, resize: 'vertical' }} rows={2} value={edit.excerpt} onChange={(e) => set('excerpt', e.target.value)} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
              <div>
                <Label>Categoria</Label>
                <input style={input} list="blog-cats" value={edit.category} onChange={(e) => set('category', e.target.value.slice(0, 40))} />
                <datalist id="blog-cats">{BLOG_CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
              </div>
              <div>
                <Label>Autore</Label>
                <select style={input} value={edit.author} onChange={(e) => set('author', e.target.value)}>
                  {AUTHORS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <Label>Data</Label>
                <input type="date" style={input} value={edit.date} onChange={(e) => set('date', e.target.value)} />
              </div>
            </div>

            <Label>Tag (separati da virgola)</Label>
            <input style={input} value={edit.tags.join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 12))} placeholder="social media, instagram, attività locali" />

            <Label>Immagine di copertina (facoltativa)</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...input, flex: 1 }} value={edit.cover || ''} onChange={(e) => set('cover', e.target.value)} placeholder="https://res.cloudinary.com/..." />
              <button onClick={async () => { const u = await pick('image'); if (u) set('cover', u); }} style={{ padding: '0 12px', background: 'rgba(205,178,255,0.1)', border: '.5px solid #cdb2ff44', borderRadius: 8, color: '#cdb2ff', cursor: 'pointer', fontSize: 11 }}>📁 Archivio</button>
            </div>
            {edit.cover && <img src={edit.cover} alt="" style={{ marginTop: 8, width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10 }} onError={(e) => (e.currentTarget.style.display = 'none')} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 0 6px', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {!preview && <>
                  {tool(<Heading2 size={13} />, 'Titolo di sezione', () => linePrefix('## '))}
                  {tool(<Bold size={13} />, 'Grassetto', () => wrap('**', '**'))}
                  {tool(<Link2 size={13} />, 'Link', () => wrap('[', '](https://)', 'testo del link'))}
                  {tool(<List size={13} />, 'Elenco puntato', () => linePrefix('- '))}
                  {tool(<Quote size={13} />, 'Citazione', () => linePrefix('> '))}
                  {tool(<ImageIcon size={13} />, 'Immagine dall\'archivio', insertImage)}
                </>}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setPreview(false)} style={{ ...input, width: 'auto', padding: '6px 12px', cursor: 'pointer', color: !preview ? 'var(--a)' : 'var(--m)', display: 'flex', gap: 4, alignItems: 'center' }}><Edit3 size={12} /> Scrivi</button>
                <button onClick={() => setPreview(true)} style={{ ...input, width: 'auto', padding: '6px 12px', cursor: 'pointer', color: preview ? 'var(--a)' : 'var(--m)', display: 'flex', gap: 4, alignItems: 'center' }}><Eye size={12} /> Anteprima</button>
              </div>
            </div>
            {preview ? (
              <div style={{ ...input, padding: '1.2rem 1.4rem', minHeight: 360 }}>
                <style>{`.md{font-size:15px;line-height:1.75}.md>*+*{margin-top:1em}.md h2{font-family:var(--fd);font-size:1.8rem;line-height:1;margin-top:1.6em}.md h3{font-size:1.1rem;font-weight:500}.md ul,.md ol{padding-left:1.3em}.md blockquote{border-left:2px solid var(--a);padding-left:1em;font-style:italic}.md img{max-width:100%;border-radius:10px}.md-link{color:var(--a)}`}</style>
                <Markdown source={edit.content} />
              </div>
            ) : (
              <textarea ref={textRef} style={{ ...input, minHeight: 360, resize: 'vertical', lineHeight: 1.65, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12.5 }} value={edit.content} onChange={(e) => set('content', e.target.value)} />
            )}
            <div style={{ fontSize: 11, color: 'var(--m)', marginTop: 6 }}>
              Formattazione: <code>## Titolo</code> · <code>**grassetto**</code> · <code>*corsivo*</code> · <code>[testo](https://…)</code> · <code>- elenco</code> · <code>&gt; citazione</code>. Per i link interni usa l'indirizzo breve, es. <code>[contattaci](/contatti)</code>.
            </div>

            <details style={{ marginTop: 16 }}>
              <summary style={{ cursor: 'pointer', fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)' }}>SEO avanzata (facoltativa)</summary>
              <Label count={(edit.seoTitle || '').length} max={LIMITS.seoTitle}>Titolo per Google</Label>
              <input style={input} value={edit.seoTitle || ''} onChange={(e) => set('seoTitle', e.target.value)} placeholder={`${edit.title} | InLab Communication`} />
              <Label count={(edit.seoDescription || '').length} max={LIMITS.seoDescription}>Descrizione per Google</Label>
              <textarea style={{ ...input, resize: 'vertical' }} rows={2} value={edit.seoDescription || ''} onChange={(e) => set('seoDescription', e.target.value)} placeholder={edit.excerpt} />
            </details>

            <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-p" disabled={busy} onClick={() => save(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: busy ? 0.6 : 1 }}>
                <Save size={13} /> {edit.published ? 'Salva e pubblica' : 'Pubblica'}
              </button>
              <button className="btn btn-g" disabled={busy} onClick={() => save(false)} style={{ opacity: busy ? 0.6 : 1 }}>
                {edit.published ? 'Nascondi (bozza)' : 'Salva bozza'}
              </button>
            </div>
          </div>
        )}
      </div>
      {Modal}
    </div>
  );
};
