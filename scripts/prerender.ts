// Dopo `vite build`: crea un HTML per ogni pagina con <head> già corretto
// (titolo, description, canonical, Open Graph, JSON-LD), più sitemap.xml e
// robots.txt. Il dominio viene da VITE_SITE_URL (o SITE_URL).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { getSeo, listRoutes, organizationJsonLd, registerBlogPosts, registerContent, SITE_URL } from '../src/seo/routes';
import { BLOG_SEED, mergePosts, normalizePost } from '../src/data/blogSeed';

const DIST = join(process.cwd(), 'dist');
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

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

const render = (path: string) => {
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
  return html.replace('</head>', `    ${gsc}${pageLd}\n  </head>`);
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

async function main() {
const saved = await fetchSiteContent();
if (saved && saved.schemaVersion >= 3) {
  registerContent(saved);
  console.log(`[prerender] contenuti dashboard: ${saved.clients?.items?.length ?? 0} clienti, ${saved.cases?.items?.length ?? 0} casi studio`);
}
const remotePosts = await fetchRemotePosts();
registerBlogPosts(mergePosts(BLOG_SEED, remotePosts));
console.log(`[prerender] blog: ${remotePosts.length} articoli da Firestore`);

const routes = listRoutes();
for (const path of routes) {
  // cleanUrls di Vercel: /servizi → servizi.html, /casi-studio/paresteta → casi-studio/paresteta.html
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, `${path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(path));
}

// Pagine senza HTML dedicato: /admin (dashboard) e 404.html come riserva per
// indirizzi sconosciuti. Entrambe caricano l'app, che mostra la pagina giusta,
// così funzionano anche se la regola di rewrite di Vercel non si applica.
const noindex = (html: string, title: string) => html
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  .replace(/(<meta name="robots" content=")[^"]*"/, '$1noindex, nofollow"');
writeFileSync(join(DIST, 'admin.html'), noindex(template, 'Dashboard | InLab Communication'));
writeFileSync(join(DIST, '404.html'), noindex(template, 'InLab Communication'));

const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .map((p) => ({ p, seo: getSeo(p) }))
  .filter(({ seo }) => !seo.noindex && seo.sitemap)
  .map(({ seo }) => `  <url>\n    <loc>${esc(seo.canonical)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${seo.sitemap!.changefreq}</changefreq>\n    <priority>${seo.sitemap!.priority.toFixed(1)}</priority>\n  </url>`);
writeFileSync(join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

writeFileSync(join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`[prerender] ${routes.length} pagine, ${urls.length} URL in sitemap — dominio ${SITE_URL}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
