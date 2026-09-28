// Google Analytics 4 con consenso: lo script di Google viene caricato SOLO
// dopo che il visitatore ha accettato i cookie statistici dal banner.
// L'ID si imposta su Vercel con VITE_GA_ID (es. G-ABC123XYZ).

const RAW_ID = String(import.meta.env.VITE_GA_ID || '').trim();
export const GA_ID = /^G-[A-Z0-9]{4,20}$/.test(RAW_ID) ? RAW_ID : '';

type Consent = 'granted' | 'denied';
const KEY = 'inlab_cookie_consent_v1';
const listeners = new Set<() => void>();

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}

export const getConsent = (): Consent | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch { return null; }
};

let loaded = false;
const load = () => {
  if (loaded || !GA_ID) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer!.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  // page_view inviati a mano a ogni cambio pagina (il sito non ricarica)
  window.gtag('config', GA_ID, { send_page_view: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  gaPageview();
};

const deleteGaCookies = () => {
  const host = location.hostname;
  const domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
  document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n === '_ga' || n.startsWith('_ga_')).forEach((name) => {
    domains.forEach((d) => { document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`; });
  });
};

export const setConsent = (c: Consent) => {
  try { localStorage.setItem(KEY, c); } catch { /* navigazione privata: vale solo per questa visita */ }
  if (c === 'granted') load();
  else {
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    deleteGaCookies();
  }
  listeners.forEach((fn) => fn());
};

/** Riapre il banner (link "Preferenze cookie" nel footer). */
let reopenFn: (() => void) | null = null;
export const onReopenConsent = (fn: () => void) => { reopenFn = fn; return () => { reopenFn = null; }; };
export const reopenConsent = () => reopenFn?.();
export const onConsentChange = (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); };

export const gaPageview = () => {
  if (!loaded || getConsent() !== 'granted') return;
  window.gtag?.('event', 'page_view', { page_location: location.href, page_path: location.pathname, page_title: document.title });
};

export const gaEvent = (name: string, params: Record<string, unknown> = {}) => {
  if (!loaded || getConsent() !== 'granted') return;
  window.gtag?.('event', name, params);
};

let started = false;
/** Da chiamare una volta all'avvio: carica GA se il consenso c'è già e traccia i clic sui contatti. */
export const initGa = () => {
  if (started || !GA_ID) return;
  started = true;
  if (getConsent() === 'granted') load();
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.startsWith('tel:')) gaEvent('contact_click', { method: 'telefono' });
    else if (href.startsWith('mailto:')) gaEvent('contact_click', { method: 'email' });
    else if (/wa\.me|whatsapp\.com/.test(href)) gaEvent('contact_click', { method: 'whatsapp' });
    else if (/instagram\.com|facebook\.com|linkedin\.com|tiktok\.com/.test(href)) gaEvent('social_click', { link_url: href });
  }, { capture: true });
};
