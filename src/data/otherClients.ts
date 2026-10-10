// "Altri clienti": brand che seguiamo per un servizio specifico (social, foto,
// video, sito…). Richiesta di Nicola (05/10, tramite il Direttore): ognuno ha
// una scheda completa come i clienti di "Progetti raccontati" (stessi campi,
// compilata da lui in dashboard). Ogni scheda ha subito la sua pagina
// /cliente/… (richiesta di Nicola, 07/10: "creale grezze, anche vuote"), ma
// finché non è pubblicata con il riassunto la pagina è noindex e fuori dalla
// sitemap. Si modificano dalla dashboard (Clienti → Altri clienti);
// questi sono i valori iniziali: solo i dati forniti da Nicola, il resto vuoto.
import { getClientId, normalizeClients } from '../lib/clientUtils';

export type OtherClient = {
  /** indirizzo della pagina: /cliente/<id> */
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
  /** la pagina /cliente/<id> va su Google e in sitemap solo se pubblicata e con il riassunto */
  published?: boolean;
};

const item = (name: string, extra: Partial<OtherClient> = {}): OtherClient =>
  ({ id: getClientId({ name }), name, sector: '', location: '', summary: '', published: false, ...extra });

// Testi delle schede forniti da Nicola in chat (07/10). Riempiono una scheda
// solo finché il suo riassunto è vuoto: da quel momento valgono i dati salvati
// in dashboard (basta premere Salva una volta perché diventino i suoi).
// Chiave: indirizzo attuale della scheda (/cliente/<id>).
export const OTHER_CLIENTS_PREFILL: Record<string, Partial<OtherClient>> = {
  'vision-ottica': {
    id: 'vision-ottica', name: 'Vision Ottica Capone', sector: 'Ottica', location: 'Palagianello e Mottola (TA)',
    summary: 'Ottica con due sedi, a Palagianello e Mottola, e tanti brand di prestigio. Curiamo strategia, idee e testi dei reel e la pubblicazione.',
    description: "Vision Ottica Capone è un'ottica con due sedi, a Palagianello e a Mottola, con una selezione di brand di marca e di prestigio. A fare la differenza sono le persone: gli ottici Mariangela e Raffaele e il loro staff, simpatici e sempre disponibili con chi entra in negozio. Per loro curiamo la strategia dei social, sviluppiamo le idee e i testi dei reel e ci occupiamo della pubblicazione, per raccontare online lo stesso clima che si respira in negozio.",
    services: ['Strategia social', 'Idee e testi dei reel', 'Pubblicazione contenuti'],
  },
  'inox-racing-puglia': {
    sector: 'Marmitte sportive in acciaio inox',
    summary: 'Marmitte sportive in acciaio inox per auto sportive e storiche. In due anni da 790 a oltre 3.000 follower e 4 mesi di prenotazioni fisse.',
    description: "Inox Racing Puglia realizza marmitte sportive in acciaio inox. Angelo, il titolare, lavora per due tipi di clienti: chi ha un'auto sportiva e chi ha un'auto storica. Lo seguiamo nella strategia e lo supportiamo nella pubblicazione dei contenuti. In due anni il profilo è passato da 790 a più di 3.000 follower, ma il risultato che conta davvero sono le richieste: oggi Angelo ha quattro mesi di prenotazioni fisse.",
    services: ['Strategia social', 'Supporto alla pubblicazione'],
    results: ['Da 790 a oltre 3.000 follower in 2 anni', '4 mesi di prenotazioni fisse'],
  },
  'casa28': {
    sector: 'Ristorante', location: 'Castellaneta (TA)',
    summary: 'Ristorante a Castellaneta: abbiamo realizzato lo shooting fotografico dei piatti.',
    description: 'Casa28 è un ristorante di Castellaneta. Per loro abbiamo realizzato uno shooting fotografico dei piatti, con immagini da usare sui social, sul menu e online, per far venire voglia di sedersi a tavola già guardando le foto.',
    services: ['Shooting fotografico', 'Food photography'],
  },
  'il-paradiso': {
    sector: 'Lido', location: 'Castellaneta Marina',
    summary: 'Lido a Castellaneta Marina: abbiamo realizzato lo shooting fotografico dei piatti del suo ristorante.',
    description: 'Il Paradiso è un lido di Castellaneta Marina con un ristorante affacciato sul mare. Per il ristorante abbiamo realizzato uno shooting fotografico dei piatti, con immagini da usare sui social, sul menu e online, per far venire voglia di fermarsi a pranzo o a cena dopo una giornata in spiaggia.',
    services: ['Shooting fotografico', 'Food photography'],
  },
  'la-vela': {
    sector: 'Lido', location: 'Castellaneta Marina',
    summary: 'Lido a Castellaneta Marina: curiamo le grafiche dei suoi eventi.',
    description: 'La Vela è un lido di Castellaneta Marina con una stagione ricca di eventi. Per loro realizziamo le grafiche degli eventi: locandine e contenuti per i social, con uno stile riconoscibile che fa capire subito cosa succede e quando.',
    services: ['Grafiche eventi', 'Social media'],
  },
  'arte-e-oro': {
    sector: 'Orafo artigiano', location: 'Palagianello (TA)',
    summary: 'Orafo artigiano di Palagianello: curiamo la pubblicazione sui social delle foto dei suoi lavori.',
    description: 'Arte e Oro è il laboratorio di Stefano Tamburrano, orafo artigiano di Palagianello, molto bravo e competente nel suo mestiere. Le foto dei gioielli sono realizzate da un fotografo professionista. Noi ci occupiamo di gestire la pubblicazione sui social, perché ogni lavoro arrivi al pubblico al momento giusto e con il racconto giusto.',
    services: ['Gestione pubblicazioni', 'Social media'],
  },
  'pasticceria-naturale': {
    sector: 'Pasticceria', location: 'Ferrara',
    summary: 'Pasticceria di Ferrara: gestiamo i social, con strategia, idee e testi nostri e foto e video realizzati sul posto.',
    description: "Pasticceria Naturale è una pasticceria di Ferrara. Per loro gestiamo i social dalla strategia alla pubblicazione. Le idee dei contenuti, i testi e il piano editoriale li pensiamo e scriviamo noi. Le riprese e le foto le fa sul posto un videomaker e fotografo con cui collaboriamo, seguendo le nostre indicazioni. È il modo in cui lavoriamo anche a distanza: la strategia e la creatività restano nostre, la produzione si fa dove nascono i dolci.",
    services: ['Gestione social', 'Strategia', 'Ideazione contenuti', 'Copywriting'],
  },
  'tacco': {
    sector: 'Vini',
    summary: 'Marchio di vini: supporto grafico e revisione del sito e-commerce su Shopify.',
    description: 'Tacco è un marchio di vini. Li abbiamo affiancati con un supporto grafico e con la revisione del loro e-commerce, già realizzato su Shopify, perché il negozio online fosse più chiaro da navigare e più coerente con l\'immagine del marchio.',
    services: ['Grafica', 'Revisione e-commerce', 'Shopify'],
  },
  'match-point': {
    sector: 'Scuola di tennis', location: 'Castellaneta (TA)',
    summary: 'Scuola di tennis di Castellaneta: realizziamo foto, video e grafiche, tutti prodotti interamente da noi.',
    description: 'Match Point è una scuola di tennis di Castellaneta. Per loro curiamo tutta la parte visiva: scattiamo le foto in campo, giriamo e montiamo i video e realizziamo le grafiche. Ogni contenuto è prodotto interamente da noi, per raccontare le lezioni, i ragazzi e la vita del circolo con uno stile riconoscibile su tutti i canali.',
    services: ['Foto', 'Video', 'Grafiche'],
  },
  'pizzeria-ermitage': {
    id: 'pizzeria-hermitage', name: 'Pizzeria Hermitage', sector: 'Pizzeria', location: 'Laterza',
    summary: 'Pizzeria di Laterza: abbiamo realizzato i video come professionisti esterni.',
    description: "Hermitage è un ristorante pizzeria di Laterza. Ci hanno chiamati come professionisti esterni per la produzione video: riprese e montaggio di contenuti per raccontare il locale, la pizza e l'atmosfera della sala.",
    services: ['Video', 'Riprese e montaggio'],
  },
  'olio-vanessa': {
    sector: "Olio extravergine d'oliva", location: 'Castellaneta (TA)',
    summary: 'Azienda di olio pugliese di Castellaneta: gestione completa dei social, dalla strategia a foto, video e grafiche.',
    description: "Olio Vanessa è un'azienda di olio extravergine pugliese di Castellaneta. Per loro abbiamo gestito i social a 360 gradi: dalla strategia alla creazione dei contenuti, con foto, video e grafiche realizzati da noi. L'obiettivo è raccontare il prodotto, il territorio e il lavoro che c'è dietro ogni bottiglia.",
    services: ['Gestione social', 'Strategia', 'Foto', 'Video', 'Grafiche'],
  },
  'splashcar': {
    sector: 'Lavaggio auto', location: 'Laterza (TA)',
    summary: 'Lavaggio auto di Laterza: curiamo la strategia social, l\'ideazione degli script dei video e la pubblicazione.',
    description: 'Splashcar è un lavaggio auto di Laterza. Per loro curiamo la strategia sui social, ideiamo e scriviamo gli script dei video e ci occupiamo della pubblicazione. Così i contenuti mostrano il risultato del lavoro e la cura per ogni auto, con un piano chiaro dietro ogni post.',
    services: ['Strategia social', 'Ideazione script', 'Pubblicazione contenuti'],
  },
};

/**
 * Applica i testi di OTHER_CLIENTS_PREFILL alle schede con il riassunto ancora
 * vuoto, e le pubblica. Logo, immagini, link e le altre parti già salvate restano.
 * Le schede già compilate in dashboard non vengono toccate.
 */
export const withPrefill = <T = any>(items: T[] = []): T[] =>
  (Array.isArray(items) ? items : []).map((c: any) => {
    const p = c && OTHER_CLIENTS_PREFILL[getClientId(c)];
    return p && !String(c.summary || '').trim() ? { ...c, ...p, published: true } : c;
  });

export const OTHER_CLIENTS_DEFAULT: { label: string; title: string; accent: string; text: string; items: OtherClient[] } = {
  label: 'Altri clienti',
  title: 'Collaborazioni',
  accent: 'su misura.',
  text: 'Brand che seguiamo su un aspetto preciso della loro comunicazione: i social, le foto, un video, il sito. Lavori mirati, con la stessa cura.',
  items: withPrefill([
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
  ]),
};

/** Scheda pronta per avere una pagina: pubblicata, con nome e riassunto (mai pagine vuote). */
export const isPublishable = (c: any) =>
  !!(c && c.published === true && String(c.name || '').trim() && String(c.summary || '').trim());

/**
 * Altri clienti con la pagina /cliente/…, nello stesso formato dei clienti
 * principali: tutti quelli con un nome. `draft` è vero finché la scheda non è
 * pubblicabile: la pagina esiste ma è noindex e fuori dalla sitemap.
 * `takenIds`: indirizzi già usati dai clienti principali, che hanno la
 * precedenza (nessuna pagina doppia).
 */
export const otherClientPages = (items: any[] = [], takenIds: Set<string> = new Set()) => {
  const seen = new Set(takenIds);
  return withPrefill(Array.isArray(items) ? items : [])
    .filter((c) => c && String(c.name || '').trim())
    .map((c) => ({ ...normalizeClients([c])[0], draft: !isPublishable(c) }))
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
};
