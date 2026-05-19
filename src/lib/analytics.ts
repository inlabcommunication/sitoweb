import { supabase } from './supabase';

// ════════════════════════════════════════════════════════════════
// ANALYTICS — Tracking visite, scroll, sezioni viste, click
// Privacy-friendly: nessun cookie di profilazione, niente fingerprinting,
// session_id casuale memorizzato solo in sessionStorage (sparisce
// quando l'utente chiude il browser → GDPR-compliant senza banner).
// ════════════════════════════════════════════════════════════════

const SESSION_KEY = 'inlab_sid';
const SESSION_START_KEY = 'inlab_sst';

const getSessionId = (): string => {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, sid);
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }
  return sid;
};

const getDevice = (): 'mobile' | 'tablet' | 'desktop' => {
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
};

const baseEvent = () => ({
  session_id: getSessionId(),
  user_agent: navigator.userAgent.slice(0, 200),
  device: getDevice(),
  path: window.location.pathname + window.location.hash,
});

// Coda di eventi con debounce per non sovraccaricare il DB.
const queue: any[] = [];
let flushTimer: number | null = null;

const flush = async () => {
  if (!supabase || queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  try {
    await supabase.from('analytics_events').insert(batch);
  } catch (e) {
    // Se fallisce, perdiamo l'evento ma non vogliamo rompere il sito
    console.debug('[analytics] flush failed', e);
  }
};

const enqueue = (event: any) => {
  if (!supabase) return;
  queue.push(event);
  if (flushTimer) clearTimeout(flushTimer);
  // Aspetta 1.5s prima di mandare, così aggreghiamo gli eventi vicini
  flushTimer = window.setTimeout(flush, 1500);
};

// ─── EVENTI PUBBLICI ────────────────────────────────────────────

export const trackPageview = (path?: string, referrer?: string) => {
  enqueue({
    ...baseEvent(),
    event_type: 'pageview',
    path: path ?? window.location.pathname + window.location.hash,
    referrer: referrer ?? document.referrer ?? null,
  });
};

let maxScroll = 0;
let lastScrollSent = 0;
let currentSection = '';

export const trackScroll = (depthPct: number, section?: string) => {
  if (depthPct > maxScroll) maxScroll = depthPct;
  // Mandiamo un evento solo ogni 10% in più o cambio sezione
  const shouldSend =
    depthPct - lastScrollSent >= 10 ||
    (section && section !== currentSection);
  if (!shouldSend) return;
  lastScrollSent = depthPct;
  if (section) currentSection = section;
  enqueue({
    ...baseEvent(),
    event_type: 'scroll',
    scroll_depth: Math.round(depthPct),
    section: section ?? currentSection,
  });
};

export const trackClick = (target: string) => {
  enqueue({
    ...baseEvent(),
    event_type: 'click',
    target,
  });
};

const trackSessionEnd = () => {
  const start = parseInt(sessionStorage.getItem(SESSION_START_KEY) ?? '0', 10);
  if (!start) return;
  const duration = Math.round((Date.now() - start) / 1000);
  // Invio sincrono con sendBeacon per non perdere l'evento alla chiusura
  if (supabase && 'sendBeacon' in navigator) {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/analytics_events`;
    const payload = JSON.stringify({
      ...baseEvent(),
      event_type: 'session_end',
      duration,
      scroll_depth: maxScroll,
    });
    const blob = new Blob([payload], { type: 'application/json' });
    // Headers via fetch keepalive (sendBeacon non supporta auth headers custom)
    fetch(url, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: payload,
    }).catch(() => {});
  }
};

// ─── INIZIALIZZAZIONE ───────────────────────────────────────────

let initialized = false;
export const initAnalytics = () => {
  if (initialized || !supabase) return;
  initialized = true;

  // Pageview iniziale
  trackPageview();

  // Scroll tracking — calcolato sulla % della pagina, e sezione visibile
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (max <= 0) return;
    const pct = (window.scrollY / max) * 100;

    // Trova la sezione attualmente al centro del viewport
    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    const mid = window.scrollY + window.innerHeight / 2;
    let active = '';
    sections.forEach((s) => {
      if (s.offsetTop <= mid && s.offsetTop + s.offsetHeight > mid) {
        active = s.dataset.section ?? '';
      }
    });

    trackScroll(pct, active);
  };

  let scrollTimer: number | null = null;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTimer) return;
      scrollTimer = window.setTimeout(() => {
        scrollTimer = null;
        onScroll();
      }, 250);
    },
    { passive: true }
  );

  // Click su elementi marcati (data-track)
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest('[data-track]');
    if (target) {
      const label = target.getAttribute('data-track') ?? 'unknown';
      trackClick(label);
    }
  });

  // Cambio route (per hash routing)
  window.addEventListener('hashchange', () => {
    maxScroll = 0;
    lastScrollSent = 0;
    currentSection = '';
    trackPageview();
  });

  // Fine sessione
  window.addEventListener('beforeunload', trackSessionEnd);
  window.addEventListener('pagehide', trackSessionEnd);

  // Flush periodico per eventi in coda
  setInterval(flush, 10000);
};
