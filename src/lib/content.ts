import { startTransition, useEffect, useState } from 'react';
import { getLiteDb, liteFirestore } from './firestoreLite';
import { WEBSITE_CONTENT } from '../constants';
import { getClientId, normalizeClients } from './clientUtils';
import { instagramPost } from './instagram';

export type SiteContent = typeof WEBSITE_CONTENT;

// Versione dello schema dei contenuti. Le sezioni sotto sono collegate alla
// dashboard dalla v2: i valori salvati con versioni precedenti (testi vecchi,
// sede "Taranto", profilo Prince…) vengono ignorati finché un admin non salva
// di nuovo dalla dashboard aggiornata.
// Dalla v3 l'elenco clienti salvato è quello definitivo (i clienti eliminati
// in dashboard restano eliminati) e ci sono casi studio ed esempi per servizio.
export const CONTENT_SCHEMA = 3;
const V2_SECTIONS = ['manifesto', 'metodo', 'stats', 'cta', 'studio', 'contact'];

function dropStaleSections(saved: any) {
  if (!saved || saved.schemaVersion >= 2) return saved;
  const clean = { ...saved };
  for (const k of V2_SECTIONS) delete clean[k];
  if (clean.hero) { clean.hero = { ...clean.hero }; delete clean.hero.mini_stats; }
  return clean;
}

let cached: SiteContent | null = null;
const listeners = new Set<(c: SiteContent) => void>();

// Impronta dei dati salvati: se Firestore restituisce gli stessi dati già in
// pagina, i componenti non vengono ridisegnati.
let savedKey = '';
const stableKey = (v: any): string => JSON.stringify(v, (_k, x) =>
  x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x);

// true se i contenuti in memoria vengono dal blocco nella pagina (versione
// ridotta): la dashboard li ricarica completi prima di modificarli.
let cachedSlim = false;

/**
 * Versione ridotta per il blocco #site-content nella pagina: il codice di
 * incorporamento Instagram dei reel (quasi tutto il peso del documento)
 * diventa il solo link del post, che è l'unica parte usata dal sito.
 */
const slimReels = (items: any[]) => items.map((c: any) => !Array.isArray(c?.reels) ? c : {
  ...c,
  reels: c.reels.map((r: any) => {
    if (!r || typeof r.embed !== 'string') return r;
    const post = instagramPost(r.embed);
    return { ...r, embed: post ? `https://www.instagram.com/${post.kind}/${post.id}/` : '' };
  }),
});

export const slimForPage = (saved: any) => {
  let out = saved;
  // stesso trattamento per i clienti e per gli "Altri clienti" (schede complete)
  for (const key of ['clients', 'otherClients']) {
    const items = out?.[key]?.items;
    if (Array.isArray(items)) out = { ...out, [key]: { ...out[key], items: slimReels(items) } };
  }
  return out;
};

/** Contenuti salvati in dashboard: per l'HTML statico (al build) e, nel browser, dal blocco #site-content. */
export const primeContent = (saved: any, slim = false) => {
  const clean = dropStaleSections(saved);
  cached = normalizeSiteContent(deepMerge(WEBSITE_CONTENT, clean), clean?.schemaVersion >= 3);
  savedKey = stableKey(slim ? saved : slimForPage(saved));
  cachedSlim = slim;
};

// Contenuti predefiniti: sempre lo stesso oggetto, così se Firestore non c'è
// (o non risponde) useContent non riceve un oggetto "nuovo" uguale al primo.
// Non va in `cached`: la dashboard deve sempre leggere i dati veri.
let defaults: SiteContent | null = null;
const defaultContent = () => (defaults ??= normalizeSiteContent(WEBSITE_CONTENT));

export const getContent = (): SiteContent => cached ?? defaultContent();

/** full = servono i dati completi (dashboard), non la versione ridotta della pagina. */
export const loadContent = async (forceRefresh = false, full = false): Promise<SiteContent> => {
  if (cached && !forceRefresh && !(full && cachedSlim)) return cached;
  try {
    const db = await getLiteDb();
    if (!db) {
      if (full && cachedSlim) throw new Error('contenuti completi non disponibili');
      cached ??= defaultContent(); return cached;
    }
    const { doc, getDoc } = await liteFirestore();
    const snap = await getDoc(doc(db, 'app', 'site_content'));
    if (snap.exists()) {
      const raw = snap.data() as any;
      const key = stableKey(slimForPage(raw));
      if (cached && key === savedKey && !(full && cachedSlim)) return cached;
      savedKey = key;
      cachedSlim = false;
      const saved = dropStaleSections(raw);
      cached = normalizeSiteContent(deepMerge(WEBSITE_CONTENT, saved), saved?.schemaVersion >= 3);
    } else {
      cached = normalizeSiteContent(WEBSITE_CONTENT);
    }
  } catch (e) {
    // La dashboard non deve mai modificare (e poi salvare) la versione ridotta.
    if (full && cachedSlim) throw e;
    console.warn('[content] fallback ai contenuti statici', e);
    cached ??= defaultContent();
  }
  return cached;
};

export const saveContent = async (newContent: SiteContent): Promise<boolean> => {
  // Scrittura dalla dashboard: usa l'SDK completo (già caricato in /admin) così
  // la richiesta porta il token di autenticazione dell'admin.
  const [{ db }, { doc, setDoc }] = await Promise.all([import('./firebase'), import('firebase/firestore')]);
  if (!db) return false;
  try {
    const prepared = { ...normalizeSiteContent(newContent, true), schemaVersion: CONTENT_SCHEMA } as SiteContent;
    await setDoc(doc(db, 'app', 'site_content'), prepared);
    cached = prepared;
    cachedSlim = false;
    listeners.forEach((fn) => fn(prepared));
    return true;
  } catch (e) {
    console.error('[content] save failed', e);
    return false;
  }
};

export const subscribeContent = (fn: (c: SiteContent) => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// Aggiornamento da Firestore una sola volta per visita, condiviso da tutti i
// componenti: prima ogni sezione che usava i contenuti rifaceva la stessa
// richiesta (8+ scaricamenti uguali da ~19 KB sulla home, 03/10).
let refreshOnce: Promise<SiteContent> | null = null;
export const useContent = (): SiteContent => {
  // Lo stesso oggetto per tutti i componenti e per loadContent: se i dati non
  // cambiano, nessun aggiornamento dopo l'hydration.
  const [content, setContent] = useState<SiteContent>(() => cached ?? defaultContent());
  useEffect(() => {
    // In una transition: un aggiornamento arrivato mentre il blocco Suspense di
    // una pagina lazy non è ancora agganciato non deve farlo ridisegnare.
    (refreshOnce ??= loadContent(true)).then(c => { startTransition(() => setContent(c)); });
    return subscribeContent(setContent);
  }, []);
  return content;
};

/** authoritative = l'elenco clienti salvato è completo (non va unito ai clienti predefiniti) */
function normalizeSiteContent(content: any, authoritative = false): SiteContent {
  const clients = mergeClientItems(authoritative ? [] : WEBSITE_CONTENT.clients?.items || [], content?.clients?.items || []);
  return {
    ...content,
    clients: {
      ...WEBSITE_CONTENT.clients,
      ...(content?.clients || {}),
      items: clients,
    },
  } as SiteContent;
}

// Clienti di esempio della prima versione del sito: se sono rimasti salvati in
// Firestore non vanno mostrati accanto ai clienti reali.
const DEMO_CLIENT_IDS = new Set([
  'ristorante-da-mario', 'studio-medico-rossi', 'parrucchiere-chic', 'moda-pugliese',
  'bar-centrale', 'officina-auto', 'agriturismo-sole', 'hotel-marina',
]);

function mergeClientItems(defaultItems: any[] = [], savedItems: any[] = []) {
  const merged = new Map<string, any>();

  normalizeClients(defaultItems).forEach((client) => {
    merged.set(getClientId(client), client);
  });

  normalizeClients(savedItems).filter((client) => !DEMO_CLIENT_IDS.has(getClientId(client))).forEach((client) => {
    const id = getClientId(client);
    const nameId = client.name ? getClientId({ name: client.name }) : id;
    const finalId = merged.has(id) ? id : merged.has(nameId) ? nameId : id;
    const base = merged.get(finalId) || {};

    merged.set(finalId, {
      ...base,
      ...client,
      id: finalId,
      services: client.services?.length ? client.services : base.services || [],
      results: client.results?.length ? client.results : base.results || [],
      gallery: client.gallery?.length ? client.gallery : base.gallery || [],
      reels: client.reels?.length ? client.reels : base.reels || [],
    });
  });

  return [...merged.values()];
}

function deepMerge(target: any, source: any): any {
  if (Array.isArray(source)) return source;
  if (typeof source !== 'object' || source === null) return source;
  const out: any = { ...target };
  for (const k of Object.keys(source)) {
    if (k in target && typeof target[k] === 'object' && !Array.isArray(target[k])) {
      out[k] = deepMerge(target[k], source[k]);
    } else {
      out[k] = source[k];
    }
  }
  return out;
}

// Nel browser: stessi contenuti dell'HTML statico già dal primo render (in
// fondo al modulo, dopo le funzioni e le costanti che primeContent usa).
if (typeof document !== 'undefined') {
  try {
    const el = document.getElementById('site-content');
    if (el?.textContent) primeContent(JSON.parse(el.textContent), true);
  } catch (e) {
    console.warn('[content] contenuti in pagina non letti', e);
  }
}
