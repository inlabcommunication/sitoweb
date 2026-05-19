import { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { WEBSITE_CONTENT } from '../constants';

export type SiteContent = typeof WEBSITE_CONTENT;

let cached: SiteContent | null = null;
const listeners = new Set<(c: SiteContent) => void>();

export const getContent = (): SiteContent => cached ?? WEBSITE_CONTENT;

export const loadContent = async (): Promise<SiteContent> => {
  if (cached) return cached;
  if (!db) { cached = WEBSITE_CONTENT; return cached; }
  try {
    const snap = await getDoc(doc(db, 'app', 'site_content'));
    if (snap.exists()) {
      cached = deepMerge(WEBSITE_CONTENT, snap.data() as any) as SiteContent;
    } else {
      cached = WEBSITE_CONTENT;
    }
  } catch (e) {
    console.warn('[content] fallback ai contenuti statici', e);
    cached = WEBSITE_CONTENT;
  }
  return cached;
};

export const saveContent = async (newContent: SiteContent): Promise<boolean> => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'app', 'site_content'), newContent);
    cached = newContent;
    listeners.forEach((fn) => fn(newContent));
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
  const [content, setContent] = useState<SiteContent>(cached ?? WEBSITE_CONTENT);
  useEffect(() => {
    if (!cached) loadContent().then(setContent);
    return subscribeContent(setContent);
  }, []);
  return content;
};

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
