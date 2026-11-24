// Genera src/data/blogCityLinks.generated.ts: per ogni pagina agenzia (e quindi anche
// gestione social) 2-3 articoli del blog per il blocco "Dal blog" (analisi SEO 08/11, R3).
// Regola della SEO: prima gli articoli che citano la città, poi quelli che citano la sua
// provincia, poi gli articoli del servizio gestione social; al massimo 3, i più recenti prima.
// Gira prima di `vite build`: così le pagine città hanno solo un piccolo elenco
// (slug + titolo) e non caricano il blog né leggono Firestore.
import { writeFileSync } from 'node:fs';
import { BLOG_SEED } from '../src/data/blogSeed';
import { AGENCY_CITIES } from '../src/seo/routes';
import { cityInfo } from '../src/data/cities';

const SERVICE_POSTS = ['reel-o-post-cosa-pubblicare-instagram', 'idee-reel-ristoranti', 'quante-volte-pubblicare-social', 'gestione-social-attivita-locale-cosa-include'];
const MAX = 3;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// nome con iniziale maiuscola e confini di parola (es. "Noci" non trova "noci", "Bari" non trova "Barletta")
const mentions = (text: string, name: string) => new RegExp(`(^|[^\\p{L}])${esc(name)}(?![\\p{L}])`, 'u').test(text);

const posts = BLOG_SEED.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
const textOf = (p: (typeof posts)[number]) => `${p.title}\n${p.excerpt || ''}\n${p.content || ''}`;
const out: Record<string, string[]> = {};
const used = new Set<string>();
for (const city of AGENCY_CITIES) {
  const prov = (cityInfo(city)?.provincia || '').replace(/\s*\(.*\)\s*$/, '');
  const pick: typeof posts = [];
  const add = (list: typeof posts) => { for (const p of list) if (pick.length < MAX && !pick.includes(p)) pick.push(p); };
  add(posts.filter((p) => mentions(textOf(p), city)));
  if (prov) add(posts.filter((p) => textOf(p).includes(prov)));
  add(SERVICE_POSTS.map((s) => posts.find((p) => p.slug === s)).filter((p): p is (typeof posts)[number] => !!p));
  out[city] = pick.map((p) => p.slug);
  pick.forEach((p) => used.add(p.slug));
}
// titoli una volta sola: il file finisce nel bundle principale, deve restare piccolo
const titles = Object.fromEntries(posts.filter((p) => used.has(p.slug)).map((p) => [p.slug, p.title]));
writeFileSync(new URL('../src/data/blogCityLinks.generated.ts', import.meta.url),
  '// File generato da scripts/blog-city-links.ts a ogni build: non modificarlo a mano.\n' +
  `export const BLOG_TITLES: Record<string, string> = ${JSON.stringify(titles)};\n` +
  `export const BLOG_CITY_LINKS: Record<string, string[]> = ${JSON.stringify(out)};\n`);
console.log(`[blog-city-links] ${Object.keys(out).length} città, ${used.size} articoli usati su ${posts.length}`);
