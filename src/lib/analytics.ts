import type { Firestore } from 'firebase/firestore/lite';
import { isFirebaseConfigured } from './firebaseConfig';
import { getLiteDb, liteFirestore } from './firestoreLite';

// Riferimenti risolti dopo il primo caricamento lazy di Firestore lite, così
// session_end (su pagehide) può scrivere in modo sincrono.
let db: Firestore | null = null;
let addEvent: ((e: any) => Promise<unknown>) | null = null;

const ensureDb = async () => {
  if (addEvent) return addEvent;
  const liteDb = await getLiteDb();
  if (!liteDb) return null;
  const { collection, addDoc } = await liteFirestore();
  db = liteDb;
  addEvent = (e) => addDoc(collection(liteDb, 'analytics_events'), e);
  return addEvent;
};

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
  path: window.location.pathname,
  created_at: new Date(), // salvato da Firestore come Timestamp
});

const queue: any[] = [];
let flushTimer: number | null = null;

const flush = async () => {
  if (queue.length === 0) return;
  const add = await ensureDb();
  if (!add) return;
  const batch = queue.splice(0, queue.length);
  try {
    await Promise.all(batch.map(add));
  } catch (e) {
    console.debug('[analytics] flush failed', e);
  }
};

const enqueue = (event: any) => {
  if (!isFirebaseConfigured()) return;
  queue.push(event);
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = window.setTimeout(flush, 1500);
};

export const trackPageview = (path?: string, referrer?: string) => {
  enqueue({
    ...baseEvent(),
    event_type: 'pageview',
    path: path ?? window.location.pathname,
    referrer: referrer ?? document.referrer ?? null,
  });
};

let maxScroll = 0;
let lastScrollSent = 0;
let currentSection = '';

export const trackScroll = (depthPct: number, section?: string) => {
  if (depthPct > maxScroll) maxScroll = depthPct;
  const shouldSend = depthPct - lastScrollSent >= 10 || (section && section !== currentSection);
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
  enqueue({ ...baseEvent(), event_type: 'click', target });
};

const trackSessionEnd = () => {
  const start = parseInt(sessionStorage.getItem(SESSION_START_KEY) ?? '0', 10);
  if (!start || !db || !addEvent) return;
  const duration = Math.round((Date.now() - start) / 1000);
  addEvent({
    ...baseEvent(),
    event_type: 'session_end',
    duration,
    scroll_depth: maxScroll,
  }).catch(() => {});
};

let initialized = false;
export const initAnalytics = () => {
  if (initialized || !isFirebaseConfigured()) return;
  initialized = true;
  trackPageview();

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (max <= 0) return;
    const pct = (window.scrollY / max) * 100;
    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    const mid = window.scrollY + window.innerHeight / 2;
    let active = '';
    sections.forEach((s) => {
      if (s.offsetTop <= mid && s.offsetTop + s.offsetHeight > mid) active = s.dataset.section ?? '';
    });
    trackScroll(pct, active);
  };

  let scrollTimer: number | null = null;
  window.addEventListener('scroll', () => {
    if (scrollTimer) return;
    scrollTimer = window.setTimeout(() => { scrollTimer = null; onScroll(); }, 250);
  }, { passive: true });

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest('[data-track]');
    if (target) trackClick(target.getAttribute('data-track') ?? 'unknown');
  });

  window.addEventListener('popstate', () => {
    maxScroll = 0; lastScrollSent = 0; currentSection = '';
  });

  window.addEventListener('beforeunload', trackSessionEnd);
  window.addEventListener('pagehide', trackSessionEnd);
  setInterval(flush, 10000);
};
