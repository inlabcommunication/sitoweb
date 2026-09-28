// Dopo `vite build`: crea un HTML per ogni pagina con <head> già corretto
// (titolo, description, canonical, Open Graph, JSON-LD), più sitemap.xml e
// robots.txt. Il dominio viene da VITE_SITE_URL (o SITE_URL).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { getSeo, listRoutes, organizationJsonLd, SITE_URL } from '../src/seo/routes';

const DIST = join(process.cwd(), 'dist');
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = (o: object) => JSON.stringify(o).replace(/</g, '\\u003c');

const setAttr = (html: string, selector: RegExp, value: string) => {
  if (!selector.test(html)) throw new Error(`Tag non trovato in index.html: ${selector}`);
  return html.replace(selector, (_m, before) => `${before}${esc(value)}"`);
};

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
  return html.replace('</head>', `    ${pageLd}\n  </head>`);
};

const routes = listRoutes();
for (const path of routes) {
  // cleanUrls di Vercel: /servizi → servizi.html, /casi-studio/paresteta → casi-studio/paresteta.html
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, `${path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(path));
}

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
