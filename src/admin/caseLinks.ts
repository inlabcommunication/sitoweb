import { BLOG_SEED } from '../data/blogSeed';
import { CITY_INFO } from '../data/cities';
import { SERVICE_EXAMPLES } from '../data/serviceExamples';
import { OTHER_CLIENTS_DEFAULT } from '../data/otherClients';

export const otherItemsOf = (content: any): any[] => content.otherClients?.items ?? OTHER_CLIENTS_DEFAULT.items;

/** Chi linka il caso studio {id} (richiesta del Direttore 13/11, nota analista): se il caso passa a
 *  bozza o viene eliminato, gli articoli del blog con il link scritto nel testo darebbero 404; gli
 *  altri link (esempi, pagine città, schede cliente) il sito li nasconde da solo. */
export const linksToCase = (content: any, id: string) => {
  if (!id) return { broken: [] as string[], hidden: [] as string[] };
  const href = `/casi-studio/${id}`;
  const linksTo = (text: string) => text.includes(href + ')') || text.includes(href + '#') || text.includes(href + '"') || text.endsWith(href);
  const broken = BLOG_SEED.filter((p) => p.published !== false && linksTo(p.content || '')).map((p) => `/blog/${p.slug}`);
  const hidden: string[] = [];
  const ex: Record<string, any[]> = content.serviceExamples || SERVICE_EXAMPLES;
  Object.entries(ex).forEach(([slug, list]) => { if ((list || []).some((e: any) => e?.caseStudy === id)) hidden.push(`esempi di /${slug}`); });
  CITY_INFO.forEach((c) => {
    if (c.clientiInEvidenza?.voci.some((v) => v.caso === id)) hidden.push(`clienti in evidenza a ${c.name}`);
    Object.entries(c.paginaServizio || {}).forEach(([svc, v]) => { if (v?.progettoInEvidenza?.caso === id) hidden.push(`progetto in evidenza di ${svc} a ${c.name}`); });
  });
  [...(content.clients?.items || []), ...otherItemsOf(content)].forEach((c: any) => { if (c?.caseStudy === id) hidden.push(`scheda cliente ${c.name || c.id}`); });
  return { broken, hidden };
};
export const caseLinksWarning = (content: any, id: string, action: string): string | null => {
  const { broken, hidden } = linksToCase(content, id);
  if (!broken.length && !hidden.length) return null;
  return [
    ...(broken.length ? [`ATTENZIONE: questi articoli del blog hanno nel testo il link a /casi-studio/${id} e ${action} porterebbero a una pagina inesistente (404):`, ...broken.map((b) => `- ${b}`), 'Prima chiedi all\'Addetto al Blog di togliere o cambiare quei link.', ''] : []),
    ...(hidden.length ? ['Questi link al caso spariscono da soli dal sito:', ...hidden.map((h) => `- ${h}`), ''] : []),
  ].join('\n');
};
