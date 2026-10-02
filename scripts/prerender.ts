// Dopo `vite build`: crea un HTML per ogni pagina con <head> già corretto
// (titolo, description, canonical, Open Graph, JSON-LD), più sitemap.xml e
// robots.txt. Il dominio viene da VITE_SITE_URL (o SITE_URL).
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { AGENCY_CITIES, EXTRA_AGENCY_CITIES, agencyPath, AUTHORS, authorPath, CITIES, getBlogPosts, getSeo, listRoutes, organizationJsonLd, registerBlogPosts, registerContent, SERVICES_SEO, SITE_URL, BUSINESS } from '../src/seo/routes';
import { BLOG_SEED, mergePosts, normalizePost } from '../src/data/blogSeed';

const DIST = join(process.cwd(), 'dist');
// index.html contiene l'indirizzo provvisorio: sostituito ovunque col dominio attuale
const template = readFileSync(join(DIST, 'index.html'), 'utf-8').split('https://sitoweb-beta.vercel.app').join(SITE_URL);

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = (o: object) => JSON.stringify(o).replace(/</g, '\\u003c');

const setAttr = (html: string, selector: RegExp, value: string) => {
  if (!selector.test(html)) throw new Error(`Tag non trovato in index.html: ${selector}`);
  return html.replace(selector, (_m, before) => `${before}${esc(value)}"`);
};

// Google Search Console: codice di verifica (metodo "tag HTML"). Si può
// incollare solo il codice o l'intero tag <meta ...>.
const GSC = (() => {
  const raw = String(process.env.VITE_GSC_VERIFICATION || '').trim();
  const code = raw.match(/content="([^"]+)"/)?.[1] ?? raw;
  return /^[A-Za-z0-9_-]{10,100}$/.test(code) ? code : '';
})();
if (process.env.VITE_GSC_VERIFICATION && !GSC) console.warn('[prerender] VITE_GSC_VERIFICATION non valido: ignorato');

// Pagine caricate a parte (lazy): il loro file va precaricato subito, insieme
// a quelli della pagina, invece di aspettare che lo chieda React (richiesta
// Performance 02/10: sul blog arrivava dopo i file di Firebase e la pagina
// veniva ridisegnata in ritardo). Nomi dei file dal manifest di Vite.
const MANIFEST = join(DIST, '.vite', 'manifest.json');
const manifest: Record<string, { file: string; imports?: string[] }> =
  existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};
const lazyPage = (path: string) =>
  path === '/privacy' ? 'src/pages/PrivacyPage.tsx'
  : path === '/blog' || path.startsWith('/blog/') || path.startsWith('/autori/') ? 'src/pages/BlogPages.tsx'
  : path.startsWith('/casi-studio/') ? 'src/pages/CaseStudyPages.tsx'
  : '';
const preloadTags = (path: string) => {
  const entry = manifest[lazyPage(path)];
  if (!entry) return '';
  const files = [entry.file, ...(entry.imports || []).filter((k) => k !== 'index.html').map((k) => manifest[k]?.file)]
    .filter((f): f is string => !!f && !template.includes(`/${f}"`));
  return files.map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`).join('\n    ');
};

// Cover del blog (elemento LCP di /blog e degli articoli): preload in <head>,
// prima dei modulepreload, con gli stessi srcset e sizes del <picture> in
// BlogPages.tsx, così parte subito e non viene scaricata due volte
// (richiesta Performance 02/10). Solo per le cover locali con la .webp.
const coverPreload = (path: string) => {
  const posts = getBlogPosts();
  const post = path === '/blog' ? posts[0] : path.startsWith('/blog/') ? posts.find((p) => `/blog/${p.slug}` === path) : undefined;
  const m = post?.cover?.match(/^\/blog\/([^/]+)\/cover\.jpg$/);
  if (!m || !existsSync(join(DIST, 'blog', m[1], 'cover.webp'))) return '';
  const base = `/blog/${m[1]}`;
  const srcset = [480, 800].filter((w) => existsSync(join(DIST, 'blog', m[1], `cover-${w}.webp`)))
    .map((w) => `${base}/cover-${w}.webp ${w}w`).concat(`${base}/cover.webp 1600w`).join(', ');
  const sizes = path === '/blog' ? '(max-width: 768px) 100vw, 800px' : '(max-width: 768px) 100vw, 1080px';
  return `<link rel="preload" as="image" type="image/webp" imagesrcset="${srcset}" imagesizes="${sizes}" fetchpriority="high">`;
};

const render = (path: string, body = '') => {
  const seo = getSeo(path);
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
  html = setAttr(html, /(<meta name="description" content=")[^"]*"/, seo.description);
  html = setAttr(html, /(<meta name="robots" content=")[^"]*"/, seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
  html = setAttr(html, /(<link rel="canonical" href=")[^"]*"/, seo.canonical);
  html = setAttr(html, /(<meta property="og:url" content=")[^"]*"/, seo.canonical);
  html = setAttr(html, /(<meta property="og:title" content=")[^"]*"/, seo.title);
  html = setAttr(html, /(<meta property="og:description" content=")[^"]*"/, seo.description);
  html = setAttr(html, /(<meta property="og:image" content=")[^"]*"/, seo.image);
  html = setAttr(html, /(<meta name="twitter:title" content=")[^"]*"/, seo.title);
  html = setAttr(html, /(<meta name="twitter:description" content=")[^"]*"/, seo.description);
  html = setAttr(html, /(<meta name="twitter:image" content=")[^"]*"/, seo.image);
  html = html.replace(/<script type="application\/ld\+json" data-seo="org">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" data-seo="org">${json(organizationJsonLd())}</script>`);
  const pageLd = seo.jsonLd.map((o) => `<script type="application/ld+json" data-seo="page">${json(o)}</script>`).join('\n    ');
  const gsc = GSC ? `<meta name="google-site-verification" content="${esc(GSC)}" />\n    ` : '';
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>${contentTag}`);
  const cover = coverPreload(path);
  if (cover) html = html.replace(/<link rel="modulepreload"/, `${cover}\n    <link rel="modulepreload"`);
  const preload = preloadTags(path);
  return html.replace('</head>', `    ${gsc}${preload ? preload + '\n    ' : ''}${pageLd}\n  </head>`);
};

// Articoli pubblicati dalla dashboard (Firestore, API REST pubblica: le regole
// consentono di leggere solo quelli con published == true). Se Firestore non è
// raggiungibile il build continua con i soli articoli inclusi nel codice.
const fromValue = (v: any): any => {
  if (!v) return undefined;
  if ('stringValue' in v) return v.stringValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fromValue(x)]));
  return undefined;
};

// Contenuti salvati dalla dashboard (documento pubblico app/site_content):
// dalla versione 3 elenco clienti e casi studio salvati sono quelli definitivi.
async function fetchSiteContent() {
  const project = process.env.VITE_FIREBASE_PROJECT_ID;
  const key = process.env.VITE_FIREBASE_API_KEY;
  if (!project || !key) return null;
  try {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents/app/site_content?key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const doc = (await r.json()) as any;
    return Object.fromEntries(Object.entries(doc.fields || {}).map(([k, v]) => [k, fromValue(v)])) as any;
  } catch (e) {
    console.warn('[prerender] contenuti dashboard non caricati:', (e as Error).message);
    return null;
  }
}

async function fetchRemotePosts() {
  const project = process.env.VITE_FIREBASE_PROJECT_ID;
  const key = process.env.VITE_FIREBASE_API_KEY;
  if (!project || !key) return [];
  try {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents:runQuery?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ structuredQuery: {
        from: [{ collectionId: 'blog_posts' }],
        where: { fieldFilter: { field: { fieldPath: 'published' }, op: 'EQUAL', value: { booleanValue: true } } },
        limit: 500,
      } }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const rows = (await r.json()) as any[];
    return rows.filter((x) => x.document).map((x) => {
      const doc = x.document;
      const data = Object.fromEntries(Object.entries(doc.fields || {}).map(([k, v]) => [k, fromValue(v)]));
      return normalizePost(doc.name.split('/').pop(), data);
    });
  } catch (e) {
    console.warn('[prerender] articoli Firestore non caricati:', (e as Error).message);
    return [];
  }
}

// Contenuti della dashboard dentro la pagina (richiesta Performance 02/10): il
// browser parte dagli stessi testi dell'HTML statico invece che dai testi
// predefiniti, così il hero non cambia testo quando arriva Firestore (CLS e
// LCP su mobile). È un blocco di dati, non viene eseguito: la CSP non cambia.
// Il documento è già pubblico (lo legge ogni visitatore da Firestore).
let contentTag = '';
const CONTENT_TAG_MAX = 100_000;

async function main() {
const saved = await fetchSiteContent();

if (saved && saved.schemaVersion >= 3) {
  registerContent(saved);
  console.log(`[prerender] contenuti dashboard: ${saved.clients?.items?.length ?? 0} clienti, ${saved.cases?.items?.length ?? 0} casi studio`);
}
const remotePosts = await fetchRemotePosts();
const posts = mergePosts(BLOG_SEED, remotePosts);
registerBlogPosts(posts);
console.log(`[prerender] blog: ${remotePosts.length} articoli da Firestore`);

// Testo delle pagine nell'HTML statico (per motori di ricerca e sistemi AI):
// stesso codice React del sito, compilato da `vite build --ssr`. Se il
// rendering di una pagina fallisce, la pagina viene scritta come prima
// (senza testo) e il build continua: il sito non si blocca mai per questo.
type Ssr = { renderPage: (p: string) => Promise<string>; primeContent: (c: any) => void; slimForPage: (c: any) => any; primeBlogPosts: (p: any[]) => void };
let ssr: Ssr | null = null;
try {
  ssr = await import(pathToFileURL(join(process.cwd(), 'dist-ssr', 'entry-server.mjs')).href) as Ssr;
  if (saved) {
    ssr.primeContent(saved);
    // Versione ridotta (reel Instagram come semplice link): stessi testi.
    const tag = `<script type="application/json" id="site-content">${json(ssr.slimForPage(saved))}</script>`;
    if (tag.length <= CONTENT_TAG_MAX) contentTag = tag;
    console.log(`[prerender] contenuti nella pagina: ${(tag.length / 1024).toFixed(1)} KB${contentTag ? '' : ' (troppo grandi, non inseriti)'}`);
  }
  ssr.primeBlogPosts(posts);
} catch (e) {
  console.warn('[prerender] HTML statico non disponibile, pagine senza testo:', (e as Error).message);
}
let ssrFailed = 0;
const body = async (path: string) => {
  if (!ssr) return '';
  try { return await ssr.renderPage(path); }
  catch (e) { ssrFailed++; console.warn(`[prerender] testo non generato per ${path}:`, (e as Error).message); return ''; }
};

// Immagini di ogni pagina per la sitemap immagini: prese dall'HTML statico
// appena generato, solo quelle con testo alternativo (le decorative hanno alt=""),
// solo file del nostro dominio o di Cloudinary, al massimo 20 per pagina.
const pageImages = new Map<string, string[]>();
const imagesOf = (html: string): string[] => {
  const out = new Set<string>();
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const src = /\ssrc="([^"]+)"/.exec(tag)?.[1]?.replace(/&amp;/g, '&');
    const alt = /\salt="([^"]*)"/.exec(tag)?.[1] ?? '';
    if (!src || !alt.trim()) continue;
    if (src.startsWith('/') && !src.startsWith('//')) out.add(SITE_URL + src);
    else if (src.startsWith('https://res.cloudinary.com/')) out.add(src);
    if (out.size >= 20) break;
  }
  return [...out];
};

const routes = listRoutes();
for (const path of routes) {
  // cleanUrls di Vercel: /servizi → servizi.html, /casi-studio/paresteta → casi-studio/paresteta.html
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, `${path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  const html = await body(path);
  pageImages.set(path, imagesOf(html));
  writeFileSync(file, render(path, html));
}
console.log(`[prerender] HTML statico: ${ssr ? routes.length - ssrFailed : 0}/${routes.length} pagine con testo`);

// Pagine senza HTML dedicato: /admin (dashboard) e 404.html come riserva per
// indirizzi sconosciuti. Entrambe caricano l'app, che mostra la pagina giusta,
// così funzionano anche se la regola di rewrite di Vercel non si applica.
const noindex = (html: string, title: string) => html
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  .replace(/(<meta name="robots" content=")[^"]*"/, '$1noindex, nofollow"');
writeFileSync(join(DIST, 'admin.html'), noindex(template, 'Dashboard | InLab Communication'));
writeFileSync(join(DIST, '404.html'), noindex(template, 'Pagina non trovata | InLab Communication')
  .replace('<div id="root"></div>', `<div id="root">${await body('/__pagina-non-trovata__')}</div>`));

// lastmod solo dove la data è reale (articoli del blog): Google ignora le date
// che cambiano a ogni build senza che la pagina cambi.
const urls = routes
  .map((p) => ({ p, seo: getSeo(p) }))
  .filter(({ seo }) => !seo.noindex && seo.sitemap)
  .map(({ p, seo }) => `  <url>\n    <loc>${esc(seo.canonical)}</loc>\n${seo.lastmod ? `    <lastmod>${seo.lastmod}</lastmod>\n` : ''}    <changefreq>${seo.sitemap!.changefreq}</changefreq>\n    <priority>${seo.sitemap!.priority.toFixed(1)}</priority>\n${(pageImages.get(p) || []).map((u) => `    <image:image><image:loc>${esc(u)}</image:loc></image:image>\n`).join('')}  </url>`);
writeFileSync(join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`);

// Bot AI scritti per nome (richiesta SEO 01/10). Un gruppo dedicato sostituisce
// "*" per quei bot, quindi ripete gli stessi Disallow: /admin e /api/ restano esclusi.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'bingbot'];
const RULES = 'Allow: /\nDisallow: /admin\nDisallow: /api/\n';
writeFileSync(join(DIST, 'robots.txt'),
  `User-agent: *\n${RULES}\n${AI_BOTS.map((b) => `User-agent: ${b}`).join('\n')}\n${RULES}\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// llms.txt (richiesta SEO 01/10): sommario in Markdown per i sistemi AI, solo
// pagine indicizzabili con indirizzo assoluto. Non va in sitemap.
const indexable = (p: string) => routes.includes(p) && !getSeo(p).noindex;
const line = (p: string, label?: string) => {
  const seo = getSeo(p);
  return `- [${label || seo.title}](${seo.canonical}): ${seo.description}`;
};
const org = organizationJsonLd() as any;
const caseRoutes = routes.filter((p) => p.startsWith('/casi-studio/'));
const llms = [
  `# ${org.name}`, '',
  '> InLab Communication è un\'agenzia di comunicazione e digital marketing con sede a Castellaneta, in provincia di Taranto, fondata da Nicola Carpignano e Ilaria Gemma. Social media, video e reel, Meta Ads, siti web, branding, foto e automazioni AI per attività locali e PMI, in Puglia e in tutta Italia.', '',
  org.disambiguatingDescription, '',
  '## Servizi', '',
  ...SERVICES_SEO.map((s) => '/' + s.slug).filter(indexable).map((p) => line(p)),
  '', '## Chi siamo', '',
  ...['/chi-siamo', ...AUTHORS.map((a) => authorPath(a.slug))].filter(indexable).map((p) => line(p)),
  '', '## Casi studio', '',
  ...['/casi-studio', ...caseRoutes].filter(indexable).map((p) => line(p)),
  '', '## Città in cui lavoriamo', '',
  `Lavoriamo con attività di ${CITIES.join(', ')}. Ogni servizio ha una pagina per città, ad esempio ${SITE_URL}/gestione-social-castellaneta. Seguiamo anche attività di ${EXTRA_AGENCY_CITIES.join(', ')}.`,
  '', ...AGENCY_CITIES.map(agencyPath).filter(indexable).map((p) => line(p)),
  '', '## Blog', '',
  ...(indexable('/blog') ? [line('/blog')] : []),
  ...getBlogPosts().map((p) => '/blog/' + p.slug).filter(indexable).map((p) => line(p)),
  '', '## Contatti', '',
  ...(indexable('/contatti') ? [line('/contatti')] : []),
  `- Email: ${BUSINESS.email}`,
  `- Telefono: ${BUSINESS.telephone}`,
  ...AUTHORS.filter((a) => a.vatID).map((a) => `- P.IVA ${a.name}: ${a.vatID}`),
  `- Sede: ${BUSINESS.street}, ${BUSINESS.postalCode} ${BUSINESS.city} (TA), ${BUSINESS.region}`, '',
].join('\n');
writeFileSync(join(DIST, 'llms.txt'), llms);

console.log(`[prerender] ${routes.length} pagine, ${urls.length} URL in sitemap — dominio ${SITE_URL}`);
// il manifest serve solo qui: non va pubblicato
rmSync(join(DIST, '.vite'), { recursive: true, force: true });
}

main().catch((e) => { console.error(e); process.exit(1); });
