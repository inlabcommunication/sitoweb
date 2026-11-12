// Da dove arriva la visita, per sapere quale pagina e quale canale portano i lead
// (richiesta SEO 12/11, P1-2). Dati tecnici, nessun dato personale:
// - prima pagina vista (solo il percorso), sito di provenienza (solo il nome del
//   dominio), parametri UTM e il tipo di clic pubblicitario (gclid/fbclid, senza il valore);
// - restano solo in memoria finché la pagina è aperta (nessun cookie, niente
//   localStorage/sessionStorage) e partono solo insieme a un lead; niente a GA4.
export type Attribution = {
  landing: string;
  referrer: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_term: string | null; utm_content: string | null;
  click: 'gclid' | 'fbclid' | null;
  page: string;
  /** servizio passato dal link verso i contatti (es. ?servizio=gestione-social, GS-2) */
  servizio: string | null;
};

let first: Omit<Attribution, 'page' | 'servizio'> | null = null;

/** Da chiamare all'avvio, prima che il sito cambi pagina. */
export const captureAttribution = () => {
  if (first || typeof window === 'undefined') return;
  const u = new URL(window.location.href);
  const q = (k: string) => (u.searchParams.get(k) || '').slice(0, 100) || null;
  let referrer: string | null = null;
  try {
    if (document.referrer) {
      const h = new URL(document.referrer).hostname;
      if (h && h !== window.location.hostname) referrer = h;
    }
  } catch { /* referrer non valido */ }
  first = {
    landing: u.pathname, referrer,
    utm_source: q('utm_source'), utm_medium: q('utm_medium'), utm_campaign: q('utm_campaign'), utm_term: q('utm_term'), utm_content: q('utm_content'),
    click: u.searchParams.has('gclid') ? 'gclid' : u.searchParams.has('fbclid') ? 'fbclid' : null,
  };
};

export const getAttribution = (): Attribution | null => {
  if (typeof window === 'undefined') return null;
  captureAttribution();
  const servizio = (new URLSearchParams(window.location.search).get('servizio') || '').replace(/[^a-z0-9-]/g, '').slice(0, 40) || null;
  return { ...first!, page: window.location.pathname, servizio };
};
