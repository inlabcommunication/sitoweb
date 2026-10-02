// Pagine del blog: elenco articoli (/blog) e articolo singolo (/blog/:slug).
// Caricate on-demand (lazy) per non appesantire il resto del sito.
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { useBlogPosts, readingMinutes, formatDate, type BlogPost } from '../lib/blog';
import { Markdown } from '../components/Markdown';
import { applySeo } from '../seo/head';
import { getSeo, AUTHORS, authorByName, authorPath } from '../seo/routes';
import { useContent } from '../lib/content';
import { cld } from '../lib/media';

type Go = (to: string) => void;

const BlogStyles = () => (
  <style>{`
    .blog-chip{padding:8px 16px;border-radius:100px;border:.5px solid var(--b);background:transparent;color:var(--m);font-size:12px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;font-family:inherit;transition:all .2s}
    .blog-chip:hover{color:var(--t);border-color:rgba(255,255,255,.25)}
    .blog-chip.on{background:var(--a);border-color:var(--a);color:#000}
    .blog-card{display:flex;flex-direction:column;background:var(--s);border:.5px solid var(--b);border-radius:24px;overflow:hidden;color:inherit;text-decoration:none;transition:border-color .3s,transform .3s;height:100%}
    .blog-card:hover{border-color:rgba(205,178,255,.35);transform:translateY(-4px)}
    .blog-card:hover .blog-read{color:var(--a)}
    .blog-card:hover .blog-cover img{transform:scale(1.04)}
    .blog-cover{position:relative;aspect-ratio:16/9;overflow:hidden;background:linear-gradient(135deg,rgba(205,178,255,.22),rgba(205,178,255,.04) 60%),var(--s)}
    .blog-cover picture{display:contents}
    .blog-cover img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s}
    .blog-cover-ph{position:absolute;inset:0;display:flex;align-items:flex-end;padding:1.4rem;font-family:var(--fd);font-size:clamp(1.6rem,3vw,2.4rem);line-height:.9;color:rgba(240,237,230,.18);letter-spacing:.02em;text-transform:uppercase}
    .blog-feat{display:grid;grid-template-columns:1.25fr 1fr}
    .blog-feat .blog-cover{aspect-ratio:auto;min-height:340px}
    .blog-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--m)}
    .blog-cat{color:var(--a)}
    .blog-read{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;color:var(--t);transition:color .2s;margin-top:auto;padding-top:1.2rem}
    .md{font-size:17px;line-height:1.8;color:rgba(240,237,230,.86)}
    .md>*+*{margin-top:1.2em}
    .md h2{font-family:var(--fd);font-size:clamp(1.9rem,3.4vw,2.6rem);line-height:.95;letter-spacing:.02em;color:var(--t);margin-top:2.2em;text-transform:uppercase}
    .md h3{font-size:1.2rem;font-weight:500;color:var(--t);margin-top:1.8em}
    .md h4{font-size:1rem;font-weight:500;color:var(--t)}
    .md strong{color:var(--t);font-weight:500}
    .md em{font-family:var(--fs);font-style:italic}
    .md ul,.md ol{padding-left:1.3em}
    .md li{margin:.45em 0;padding-left:.3em}
    .md li::marker{color:var(--a)}
    .md blockquote{border-left:2px solid var(--a);padding:.4em 0 .4em 1.3em;font-family:var(--fs);font-style:italic;font-size:1.2em;line-height:1.6;color:var(--t)}
    .md hr{border:none;border-top:.5px solid var(--b);margin:2.5em 0}
    .md figure img{width:100%;border-radius:18px;display:block}
    .md figcaption{font-size:12px;color:var(--m);margin-top:.6em;text-align:center}
    .md-link{color:var(--a);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
    .md-link:hover{text-decoration-thickness:2px}
    @media(max-width:860px){.blog-feat{grid-template-columns:1fr}.blog-feat .blog-cover{min-height:0;aspect-ratio:16/9}.md{font-size:16px}}
  `}</style>
);

const linkTo = (go: Go, to: string) => (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
  e.preventDefault(); go(to);
};

// La prima card (in evidenza) è l'immagine principale della pagina: si carica
// subito e con priorità alta; le altre solo quando stanno per entrare nello schermo.
// Versione WebP della cover locale, se esiste (richiesta Performance 02/10),
// con le larghezze ridotte per il telefono (480 e 800 px) quando ci sono.
// Il JPG resta come riserva e per le anteprime social.
const CoverImg = ({ src, sizes, ...img }: { src: string; sizes: string } & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const widths = __BLOG_WEBP__[src];
  if (!widths) return <img src={src} {...img} />;
  const base = src.replace(/\/cover\.jpg$/, '');
  const srcSet = [...widths.map((w) => `${base}/cover-${w}.webp ${w}w`), `${base}/cover.webp 1600w`].join(', ');
  return <picture><source type="image/webp" srcSet={srcSet} sizes={sizes} /><img src={src} {...img} /></picture>;
};

const Cover = ({ post, priority = false }: { post: BlogPost; priority?: boolean }) => (
  <div className="blog-cover">
    {post.cover
      ? <CoverImg src={cld(post.cover, 900)} sizes="(max-width: 768px) 100vw, 800px" alt={post.coverAlt || post.title} width={1600} height={900}
          loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />
      : <div className="blog-cover-ph" aria-hidden="true">{post.category}</div>}
  </div>
);

const Meta = ({ post }: { post: BlogPost }) => (
  <div className="blog-meta">
    <span className="blog-cat">{post.category}</span>
    <span aria-hidden="true">·</span>
    <time dateTime={post.date}>{formatDate(post.date)}</time>
    <span aria-hidden="true">·</span>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {readingMinutes(post.content)} min</span>
  </div>
);

const PostCard: React.FC<{ post: BlogPost; go: Go; featured?: boolean; i?: number }> = ({ post, go, featured = false, i = 0 }) => (
  <motion.a href={`/blog/${post.slug}`} onClick={linkTo(go, `/blog/${post.slug}`)}
    className={`blog-card${featured ? ' blog-feat' : ''}`}
    initial={featured ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i, 6) * 0.06 }}>
    <Cover post={post} priority={featured} />
    <div style={{ padding: featured ? '2.4rem' : '1.6rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: featured ? 'center' : 'flex-start' }}>
      {featured && <p className="section-label" style={{ color: 'var(--a)' }}>Ultimo articolo</p>}
      <Meta post={post} />
      <h2 style={{ fontFamily: featured ? 'var(--fd)' : 'var(--fb)', fontSize: featured ? 'clamp(2rem,3.6vw,3rem)' : '1.15rem', lineHeight: featured ? 0.95 : 1.35, fontWeight: featured ? 400 : 500, margin: '0.9rem 0 0.7rem', textTransform: featured ? 'uppercase' : 'none' }}>{post.title}</h2>
      <p style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.7 }}>{post.excerpt}</p>
      <span className="blog-read">Leggi l'articolo <ArrowRight size={13} /></span>
    </div>
  </motion.a>
);

export const PageBlog = ({ go }: { go: Go }) => {
  const { posts, loading } = useBlogPosts();
  // titolo, descrizione e dati strutturati del blog (gli articoli si caricano con questa pagina)
  useEffect(() => { applySeo(getSeo('/blog')); }, [loading]);
  const [cat, setCat] = useState('Tutti');
  const cats = useMemo(() => ['Tutti', ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const list = cat === 'Tutti' ? posts : posts.filter((p) => p.category === cat);
  const [first, ...rest] = list;

  return (
    <>
      <BlogStyles />
      <section style={{ padding: '10rem 2rem 3.5rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <motion.p initial={false} className="section-label">Blog</motion.p>
          <motion.h1 initial={false}
            style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(3rem,8vw,7rem)', lineHeight: 0.9, marginBottom: '1.5rem' }}>
            IDEE CHE<br /><span className="stroke">FUNZIONANO.</span>
          </motion.h1>
          <motion.p initial={false}
            style={{ fontSize: 16, color: 'var(--m)', maxWidth: 640, lineHeight: 1.75 }}>
            Guide pratiche su social media, video, siti web e advertising per aziende e attività locali. Quello che impariamo ogni giorno lavorando con i nostri clienti.
          </motion.p>
          {cats.length > 2 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '2.2rem' }} role="tablist" aria-label="Filtra per categoria">
              {cats.map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} className={`blog-chip${cat === c ? ' on' : ''}`} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '4rem 2rem 7rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {!first && <p style={{ color: 'var(--m)' }}>Nessun articolo in questa categoria, per ora.</p>}
          {first && <PostCard post={first} go={go} featured />}
          {rest.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.2rem', marginTop: '1.2rem' }}>
              {rest.map((p, i) => <PostCard key={p.slug} post={p} go={go} i={i} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export const PageArticolo = ({ slug, go }: { slug: string; go: Go }) => {
  const { posts, loading } = useBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  // Gli articoli scritti dalla dashboard arrivano dopo il caricamento:
  // aggiorna titolo/description/dati strutturati appena disponibili.
  useEffect(() => { applySeo(getSeo('/blog/' + slug)); }, [loading, slug]);

  if (!post) {
    if (loading) return <div style={{ minHeight: '100vh' }} />;
    return (
      <section style={{ padding: '10rem 2rem 8rem', minHeight: '60vh' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label">Articolo non trovato</p>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem,5vw,4rem)', lineHeight: 0.9, marginBottom: '1.5rem' }}>
            QUESTO ARTICOLO<br /><span className="stroke">NON ESISTE.</span>
          </h1>
          <a href="/blog" onClick={linkTo(go, '/blog')} className="btn btn-p">Tutti gli articoli <ArrowRight size={14} /></a>
        </div>
      </section>
    );
  }

  const related = [
    ...posts.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...posts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);

  return (
    <>
      <BlogStyles />
      <article>
        <header style={{ padding: '9rem 2rem 2.5rem' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <a href="/blog" onClick={linkTo(go, '/blog')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '.5px solid var(--b)', borderRadius: 100, color: 'var(--m)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', padding: '8px 16px', marginBottom: '2rem' }}>
              <ArrowLeft size={11} /> Blog
            </a>
            <Meta post={post} />
            <motion.h1 initial={false}
              style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.6rem,6vw,5rem)', lineHeight: 0.92, margin: '1.2rem 0 1.4rem', textTransform: 'uppercase' }}>
              {post.title}
            </motion.h1>
            <p style={{ fontSize: 18, color: 'var(--m)', lineHeight: 1.7, fontFamily: 'var(--fs)', fontStyle: 'italic' }}>{post.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '1.8rem' }}>
              <div aria-hidden="true" style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--a)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fd)', fontSize: 16 }}>
                {post.author.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
              <div style={{ fontSize: 13 }}>
                <div style={{ fontWeight: 500 }}>{authorByName(post.author)
                  ? <a href={authorPath(authorByName(post.author)!.slug)} onClick={linkTo(go, authorPath(authorByName(post.author)!.slug))} rel="author" style={{ color: 'inherit' }}>{post.author}</a>
                  : post.author}</div>
                <div style={{ color: 'var(--m)', fontSize: 12 }}>InLab Communication</div>
              </div>
            </div>
          </div>
        </header>

        {post.cover && (
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 2rem 1rem' }}>
            <CoverImg src={cld(post.cover, 1600)} sizes="(max-width: 768px) 100vw, 1080px" alt={post.coverAlt || post.title} width={1600} height={900} fetchPriority="high" style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 24, display: 'block', border: '.5px solid var(--b)' }} />
          </div>
        )}

        <div style={{ maxWidth: 820, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
          <Markdown source={post.content} onNavigate={go} />
          {post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '3rem', paddingTop: '2rem', borderTop: '.5px solid var(--b)' }}>
              {post.tags.map((t) => (
                <span key={t} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 100, background: 'rgba(205,178,255,0.08)', color: 'var(--a)', border: '.5px solid rgba(205,178,255,0.2)' }}>#{t}</span>
              ))}
            </div>
          )}

          <div style={{ marginTop: '3rem', padding: '2.2rem', borderRadius: 24, background: 'var(--a)', color: '#000' }}>
            <div style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem,3.4vw,2.6rem)', lineHeight: 0.95, marginBottom: '0.8rem' }}>VUOI APPLICARLO ALLA TUA ATTIVITÀ?</div>
            <p style={{ fontSize: 15, lineHeight: 1.65, marginBottom: '1.4rem', maxWidth: 520, opacity: 0.8 }}>Raccontaci il tuo progetto: ti diciamo con sincerità da dove partire. La prima chiacchierata è senza impegno.</p>
            <a href="/contatti" onClick={linkTo(go, '/contatti')} className="btn" style={{ background: '#000', color: 'var(--a)' }}>Parliamone <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section style={{ padding: '4rem 2rem 7rem', borderTop: '.5px solid var(--b)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <p className="section-label">Continua a leggere</p>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.2rem,4vw,3.6rem)', lineHeight: 0.9, marginBottom: '2rem' }}>ALTRI <span className="stroke">ARTICOLI</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.2rem' }}>
              {related.map((p, i) => <PostCard key={p.slug} post={p} go={go} i={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

// Pagina autore (/autori/:slug): chi è, cosa fa e gli articoli che ha firmato.
// Usa solo informazioni già presenti nel sito (team in /chi-siamo e dati SEO).
// "Instagram (@ilari_3)", "LinkedIn", "Facebook": nome leggibile del profilo
const profileLabel = (u: string) => {
  const host = u.includes('linkedin.') ? 'LinkedIn' : u.includes('instagram.') ? 'Instagram' : u.includes('facebook.') ? 'Facebook' : new URL(u).hostname;
  const handle = host === 'Instagram' ? u.split('/').filter(Boolean).pop() : '';
  return handle ? `${host} (@${handle})` : host;
};

export const PageAutore = ({ slug, go }: { slug: string; go: Go }) => {
  const author = AUTHORS.find((a) => a.slug === slug);
  const { posts, loading } = useBlogPosts();
  const team = (((useContent() as any).studio?.team) || []) as any[];
  useEffect(() => { if (author) applySeo(getSeo(authorPath(author.slug))); }, [loading, slug]);

  if (!author) {
    return (
      <section style={{ padding: '10rem 2rem 8rem', minHeight: '60vh' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label">Autore non trovato</p>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.5rem,5vw,4rem)', lineHeight: 0.9, marginBottom: '1.5rem' }}>PAGINA<br /><span className="stroke">NON TROVATA.</span></h1>
          <a href="/chi-siamo" onClick={linkTo(go, '/chi-siamo')} className="btn btn-p">Chi siamo <ArrowRight size={14} /></a>
        </div>
      </section>
    );
  }
  const member = team.find((m) => String(m?.name || '').toLowerCase() === author.name.toLowerCase()) || {};
  const edu = (Array.isArray(member.edu) ? member.edu : []).filter(Boolean) as string[];
  const mine = posts.filter((p) => authorByName(p.author)?.slug === author.slug);

  return (
    <>
      <BlogStyles />
      <section style={{ padding: '10rem 2rem 4rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: member.photo ? '220px 1fr' : '1fr', gap: '3rem', alignItems: 'center' }} className="grid-1-mob">
          {member.photo && <img src={cld(member.photo, 600)} alt={author.name} style={{ width: 220, height: 220, borderRadius: '50%', objectFit: 'cover', border: '.5px solid var(--b)' }} />}
          <div>
            <p className="section-label">Autore · InLab Communication</p>
            <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(3rem,8vw,6.5rem)', lineHeight: 0.9, marginBottom: '1rem', textTransform: 'uppercase' }}>{author.name}</h1>
            <p style={{ fontFamily: 'var(--fs)', fontStyle: 'italic', fontSize: 'clamp(1.2rem,2.2vw,1.7rem)', color: 'var(--a)', marginBottom: '1.4rem' }}>{author.jobTitle}</p>
            {member.bio && <p style={{ fontSize: 16, color: 'var(--m)', lineHeight: 1.8, maxWidth: 640 }}>{member.bio}</p>}
            {author.facts && author.facts.length > 0 && <p style={{ fontSize: 16, color: 'var(--m)', lineHeight: 1.8, maxWidth: 640, marginTop: member.bio ? '1rem' : 0 }}>{author.facts.join(' ')}</p>}
            {/* Ricerca dentro la bio (richiesta di Nicola, 02/10) */}
            {author.researchIntro && <p style={{ fontSize: 16, color: 'var(--m)', lineHeight: 1.8, maxWidth: 640, marginTop: '1rem' }}>{author.researchIntro}</p>}
            {author.research && author.research.length > 0 && (
              <ul style={{ paddingLeft: '1.1rem', margin: '1rem 0 0', maxWidth: 640 }}>
                {author.research.map((r) => (
                  <li key={r.url} style={{ fontSize: 14, color: 'var(--m)', lineHeight: 1.7, marginBottom: 6 }}>
                    {r.authors.join(', ')} ({r.year}), <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--t)' }}>{r.title.startsWith('"') ? r.title : `"${r.title}"`}</a>{r.book ? <>, in <em>{r.book}</em></> : null}, {r.publisher}{r.pages ? `, pp. ${r.pages}` : ''}.
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.2rem' }}>
          {edu.length > 0 && (
            <div className="card">
              <h2 className="section-label" style={{ fontWeight: 500 }}>Formazione</h2>
              <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>{edu.map((e) => <li key={e} style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 6 }}>{e}</li>)}</ul>
            </div>
          )}
          <div className="card">
            <h2 className="section-label" style={{ fontWeight: 500 }}>Di cosa si occupa</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {author.knowsAbout.map((k) => <span key={k} className="tag tag-a">{k}</span>)}
            </div>
            <p style={{ fontSize: 13, color: 'var(--m)', lineHeight: 1.7, marginTop: '1rem' }}>Lavora in InLab Communication, agenzia di comunicazione con sede a Castellaneta (TA).</p>
            {author.vatID && <p style={{ fontSize: 13, color: 'var(--m)', marginTop: '.5rem' }}>P.IVA {author.vatID}</p>}
            {author.sameAs.length > 0 && (
              <p style={{ fontSize: 13, color: 'var(--m)', marginTop: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0 1rem' }}>
                <span>Profili:</span>
                {author.sameAs.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noopener" style={{ color: 'var(--t)', display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>{profileLabel(u)}</a>
                ))}
              </p>
            )}
          </div>
        </div>
      </section>

      {mine.length > 0 && (
        <section style={{ padding: '5rem 2rem', borderBottom: '.5px solid var(--b)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <p className="section-label">Articoli</p>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2.2rem,4vw,3.6rem)', lineHeight: 0.9, marginBottom: '2rem' }}>SCRITTI DA <span className="stroke">{author.name.toUpperCase()}</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.2rem' }}>
              {mine.map((p, i) => <PostCard key={p.slug} post={p} go={go} i={i} />)}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: '4rem 2rem 6rem' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="/chi-siamo" onClick={linkTo(go, '/chi-siamo')} className="btn btn-g">Chi siamo</a>
          <a href="/contatti" onClick={linkTo(go, '/contatti')} className="btn btn-p">Contatta InLab <ArrowUpRight size={14} /></a>
        </div>
      </section>
    </>
  );
};
