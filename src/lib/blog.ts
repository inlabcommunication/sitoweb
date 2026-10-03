// Blog: articoli iniziali (nel codice) + articoli scritti dalla dashboard
// (Firestore, collezione blog_posts). A parità di slug vince Firestore; un
// articolo con published=false non compare sul sito.
import { useEffect, useState } from 'react';
import { getLiteDb, liteFirestore } from './firestoreLite';
import { BLOG_SEED, mergePosts, normalizePost, type BlogPost } from '../data/blogSeed';
import { registerBlogPosts } from '../seo/routes';

export type { BlogPost };
export { slugify, mergePosts, normalizePost } from '../data/blogSeed';

export const readingMinutes = (md: string) => Math.max(1, Math.round(md.split(/\s+/).filter(Boolean).length / 200));
/** Tempo di lettura: dal testo se c'è, altrimenti dal valore calcolato al build (vite.config.ts). */
export const readingMinutesOf = (p: BlogPost) => p.content ? readingMinutes(p.content) : ((p as any).minutes ?? 1);

// Testo dell'articolo: nel sito pubblico gli articoli del codice arrivano senza
// content (vite.config.ts, plugin blog-seed-lite). Il testo è nella pagina
// dell'articolo (#post-content, scritto dal prerender) oppure in
// /blog-data/<slug>.json quando si arriva all'articolo navigando nel sito.
const textCache = new Map<string, string>();
const pageText = (slug: string): string => {
  if (typeof document === 'undefined') return '';
  try {
    const el = document.getElementById('post-content');
    const d = el?.textContent ? JSON.parse(el.textContent) : null;
    return d?.slug === slug && typeof d.content === 'string' ? d.content : '';
  } catch { return ''; }
};
const knownText = (p: BlogPost) => p.content || textCache.get(p.slug) || pageText(p.slug);

export const usePostContent = (post?: BlogPost): string => {
  const [text, setText] = useState(() => (post ? knownText(post) : ''));
  useEffect(() => {
    if (!post) return;
    const known = knownText(post);
    setText(known);
    if (known) return;
    let alive = true;
    fetch(`/blog-data/${encodeURIComponent(post.slug)}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || typeof d?.content !== 'string') return;
        textCache.set(post.slug, d.content);
        setText(d.content);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [post?.slug, post?.content]);
  return text;
};

export const formatDate = (iso: string) => {
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
};

let cache: BlogPost[] | null = null;

// Appena il blog viene aperto, la SEO conosce subito gli articoli inclusi nel codice
registerBlogPosts(mergePosts(BLOG_SEED, []));
let pending: Promise<BlogPost[]> | null = null;

export const loadBlogPosts = (): Promise<BlogPost[]> => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = (async () => {
      let remote: BlogPost[] = [];
      try {
        const db = await getLiteDb();
        if (db) {
          const { collection, getDocs, query, where } = await liteFirestore();
          // Il filtro published==true è obbligatorio: le regole Firestore
          // permettono al pubblico di leggere solo gli articoli pubblicati.
          const snap = await getDocs(query(collection(db, 'blog_posts'), where('published', '==', true)));
          remote = snap.docs.map((d) => normalizePost(d.id, d.data()));
        }
      } catch (e) {
        console.warn('[blog] uso solo gli articoli inclusi nel sito', e);
      }
      cache = mergePosts(BLOG_SEED, remote);
      registerBlogPosts(cache);
      return cache;
    })();
  }
  return pending;
};

/** Solo per la generazione dell'HTML statico: articoli già uniti (codice + Firestore). */
export const primeBlogPosts = (posts: BlogPost[]) => { cache = posts; };

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>(cache ?? mergePosts(BLOG_SEED, []));
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    let alive = true;
    loadBlogPosts().then((p) => { if (alive) { setPosts(p); setLoading(false); } });
    return () => { alive = false; };
  }, []);
  return { posts, loading };
};
