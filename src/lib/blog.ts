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

export const formatDate = (iso: string) => {
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
};

let cache: BlogPost[] | null = null;
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
