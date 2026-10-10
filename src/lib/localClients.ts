// Clienti per città e per servizio (brief SEO 10/10 "territorio e clienti"):
// le pagine città, le pagine servizio-città e il blocco "Lavoriamo a …" delle
// schede leggono da qui sia i clienti di "Progetti raccontati" sia gli "Altri
// clienti" pubblicati, confrontando la città in modo esatto.
import { normalizeClients } from './clientUtils';
import { otherClientPages } from '../data/otherClients';

const norm = (v: string) => String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

/** Città scritte nel campo località: "Palagianello e Mottola (TA)" → ["Palagianello", "Mottola"]. */
export const locationCities = (loc: string): string[] =>
  String(loc || '').replace(/\([^)]*\)/g, '').split(/,|\/|\s+e\s+/i).map((t) => t.trim()).filter(Boolean);

/** Il cliente lavora in quella città? ("Castellaneta Marina" non vale per "Castellaneta") */
export const inCity = (cl: any, city: string) => locationCities(cl?.location).some((c) => norm(c) === norm(city));

/** Clienti principali + "Altri clienti" pubblicati (senza indirizzi doppi). */
export const siteClients = (content: any): any[] => {
  const main = normalizeClients(content?.clients?.items || []);
  // solo le schede pubblicate: le bozze hanno una pagina noindex, non vanno mostrate nelle città
  return [...main, ...otherClientPages(content?.otherClients?.items, new Set(main.map((c: any) => c.id))).filter((c: any) => !c.draft)];
};

// Parole dei "Servizi realizzati" → pagina servizio
const SERVICE_WORDS: Record<string, RegExp> = {
  'gestione-social': /social|pubblicazion|piano editoriale|copywriting|ideazione/i,
  'video': /video|reel|riprese|montaggio|script/i,
  'shooting': /shooting|foto|photography/i,
  'siti-web': /sito|siti|web|shopify|e-?commerce/i,
  'meta-ads': /sponsor|ads|lead generation|campagn/i,
  'branding': /brand|logo|grafic|identit/i,
  'automazioni-ai': /automazion|chatbot|\bai\b/i,
};

/** Pagine servizio che corrispondono ai servizi realizzati per il cliente. */
export const clientServiceSlugs = (cl: any): string[] => {
  const list = (Array.isArray(cl?.services) ? cl.services : String(cl?.services || '').split(',')).map(String);
  return Object.keys(SERVICE_WORDS).filter((slug) => list.some((s: string) => SERVICE_WORDS[slug].test(s)));
};

/** Clienti di una città; con `service`, per primi quelli che hanno quel servizio (ordine stabile). */
export const clientsInCity = (content: any, city: string, service?: string): any[] => {
  const list = siteClients(content).filter((cl) => inCity(cl, city));
  if (!service) return list;
  const has = (cl: any) => clientServiceSlugs(cl).includes(service);
  return [...list.filter(has), ...list.filter((cl) => !has(cl))];
};
