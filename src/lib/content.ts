import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { WEBSITE_CONTENT } from '../constants';

// ════════════════════════════════════════════════════════════════
// CONTENT LOADER
// Carica i contenuti dal DB. Se il DB non è raggiungibile o vuoto,
// usa quelli di constants.ts come fallback. Quando salvi dall'editor,
// scrive nel DB e tutti i visitatori vedono il nuovo contenuto.
// ════════════════════════════════════════════════════════════════

export type SiteContent = typeof WEBSITE_CONTENT;

let cached: SiteContent | null = null;
const listeners = new Set<(c: SiteContent) => void>();

export const getContent = (): SiteContent => cached ?? WEBSITE_CONTENT;

export const loadContent = async (): Promise<SiteContent> => {
  if (cached) return cached;
  if (!supabase) {
    cached = WEBSITE_CONTENT;
    return cached;
  }
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', 'current')
      .maybeSingle();
    if (error) throw error;
    if (data?.data) {
      // Merge profondo con i defaults per non rompere se aggiungiamo
      // campi nuovi dopo il primo salvataggio
      cached = deepMerge(WEBSITE_CONTENT, data.data) as SiteContent;
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
  if (!supabase) return false;
  const { error } = await supabase
    .from('site_content')
    .upsert({ id: 'current', data: newContent, updated_at: new Date().toISOString() });
  if (error) {
    console.error('[content] save failed', error);
    return false;
  }
  cached = newContent;
  listeners.forEach((fn) => fn(newContent));
  return true;
};

export const subscribeContent = (fn: (c: SiteContent) => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// Hook per i componenti React
export const useContent = (): SiteContent => {
  const [content, setContent] = useState<SiteContent>(cached ?? WEBSITE_CONTENT);
  useEffect(() => {
    if (!cached) {
      loadContent().then(setContent);
    }
    return subscribeContent(setContent);
  }, []);
  return content;
};

// Helper: deep merge (per fondere il content da DB con eventuali default nuovi)
function deepMerge(target: any, source: any): any {
  if (Array.isArray(source)) return source; // gli array sovrascrivono interi
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
