import { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { WEBSITE_CONTENT } from '../constants';
import { getClientId, normalizeClients } from './clientUtils';

export type SiteContent = typeof WEBSITE_CONTENT;

let cached: SiteContent | null = null;
const listeners = new Set<(c: SiteContent) => void>();

export const getContent = (): SiteContent => cached ?? normalizeSiteContent(WEBSITE_CONTENT);

export const loadContent = async (forceRefresh = false): Promise<SiteContent> => {
  if (cached && !forceRefresh) return cached;
  if (!db) { cached = normalizeSiteContent(WEBSITE_CONTENT); return cached; }
  try {
    const snap = await getDoc(doc(db, 'app', 'site_content'));
    if (snap.exists()) {
      cached = normalizeSiteContent(deepMerge(WEBSITE_CONTENT, snap.data() as any));
    } else {
      cached = normalizeSiteContent(WEBSITE_CONTENT);
    }
  } catch (e) {
    console.warn('[content] fallback ai contenuti statici', e);
    cached = normalizeSiteContent(WEBSITE_CONTENT);
  }
  return cached;
};

export const saveContent = async (newContent: SiteContent): Promise<boolean> => {
  if (!db) return false;
  try {
    const prepared = normalizeSiteContent(newContent);
    await setDoc(doc(db, 'app', 'site_content'), prepared);
    cached = prepared;
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

export const useContent = (): SiteContent => {
  const [content, setContent] = useState<SiteContent>(cached ?? normalizeSiteContent(WEBSITE_CONTENT));
  useEffect(() => {
    loadContent(true).then(c => { setContent(c); });
    return subscribeContent(setContent);
  }, []);
  return content;
};

function normalizeSiteContent(content: any): SiteContent {
  const clients = mergeClientItems(WEBSITE_CONTENT.clients?.items || [], content?.clients?.items || []);
  return {
    ...content,
    clients: {
      ...WEBSITE_CONTENT.clients,
      ...(content?.clients || {}),
      items: clients,
    },
  } as SiteContent;
}

function mergeClientItems(defaultItems: any[] = [], savedItems: any[] = []) {
  const merged = new Map<string, any>();

  normalizeClients(defaultItems).forEach((client) => {
    merged.set(getClientId(client), client);
  });

  normalizeClients(savedItems).forEach((client) => {
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
