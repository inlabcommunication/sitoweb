// "Altri clienti": brand che seguiamo per un servizio specifico (social, foto,
// video, sito…). Richiesta di Nicola (05/10, tramite il Direttore): ognuno ha
// una scheda completa come i clienti di "Progetti raccontati" (stessi campi,
// compilata da lui in dashboard). Finché una scheda non è pubblicata compare
// solo come riquadro nella griglia di /clienti: nessuna pagina /cliente/…,
// niente sitemap. Si modificano dalla dashboard (Clienti → Altri clienti);
// questi sono i valori iniziali: solo i dati forniti da Nicola, il resto vuoto.
import { getClientId, normalizeClients } from '../lib/clientUtils';

export type OtherClient = {
  /** indirizzo della pagina: /cliente/<id> (solo quando la scheda è pubblicata) */
  id?: string;
  name: string;
  sector?: string;
  location?: string;
  /** riassunto: riga sotto il nome nel riquadro e inizio della pagina */
  summary?: string;
  description?: string;
  /** servizi seguiti (in dashboard separati da virgola) */
  services?: string[] | string;
  results?: string[];
  /** logo: nel riquadro centrato su fondo chiaro */
  logo?: string;
  /** immagine in alto nella pagina; nel riquadro se manca il logo */
  image?: string;
  gallery?: string[];
  reels?: any[];
  website?: string;
  url?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  phone?: string;
  address?: string;
  /** la scheda ha una pagina propria (/cliente/<id>) solo se pubblicata e con il riassunto */
  published?: boolean;
};

const item = (name: string, extra: Partial<OtherClient> = {}): OtherClient =>
  ({ id: getClientId({ name }), name, sector: '', location: '', summary: '', published: false, ...extra });

export const OTHER_CLIENTS_DEFAULT: { label: string; title: string; accent: string; text: string; items: OtherClient[] } = {
  label: 'Altri clienti',
  title: 'Collaborazioni',
  accent: 'su misura.',
  text: 'Brand che seguiamo su un aspetto preciso della loro comunicazione: i social, le foto, un video, il sito. Lavori mirati, con la stessa cura.',
  items: [
    item('Vision Ottica', { sector: 'Ottica' }),
    item('Inox Racing Puglia'),
    item('Acchiappasogni'),
    item('Feliciano Fangio', { sector: 'Parrucchiere' }),
    item('Arte e Oro', { sector: 'Orafo · Stefano Pastore' }),
    item('Pasticceria Naturale', { sector: 'Pasticceria', location: 'Ferrara' }),
    item('IMH', { location: 'Ferrara' }),
    item('Il Paradiso', { sector: 'Lido', location: 'Castellaneta Marina' }),
    item('Casa28', { sector: 'Ristorante', location: 'Castellaneta' }),
    item('Tacco', { sector: 'Vini' }),
    item('La Vela', { sector: 'Lido', location: 'Castellaneta Marina' }),
    item('Match Point'),
    item('Pizzeria Ermitage', { sector: 'Pizzeria', location: 'Laterza' }),
    item('Olio Vanessa', { sector: 'Olio' }),
    item('Splashcar'),
  ],
};

/** Scheda pronta per avere una pagina: pubblicata, con nome e riassunto (mai pagine vuote). */
export const isPublishable = (c: any) =>
  !!(c && c.published === true && String(c.name || '').trim() && String(c.summary || '').trim());

/**
 * Altri clienti con una pagina propria, nello stesso formato dei clienti
 * principali. `takenIds`: indirizzi già usati dai clienti principali, che
 * hanno la precedenza (nessuna pagina doppia).
 */
export const publishedOtherClients = (items: any[] = [], takenIds: Set<string> = new Set()) => {
  const seen = new Set(takenIds);
  return normalizeClients((Array.isArray(items) ? items : []).filter(isPublishable)).filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
};
