// Strumento Search Console / GA4 per il responsabile SEO.
// Nessun segreto qui: legge le credenziali dalle variabili d'ambiente.
//   GOOGLE_SA_KEY  JSON (o base64) dell'account di servizio
//   GSC_SITE       proprietà Search Console (es. sc-domain:inlab-communication.it)
//   GA4_PROPERTY_ID (facoltativa)
// Uso:
//   node gsc.mjs inspect <percorso> [<percorso>...]     stato di indicizzazione (es. agenzia-comunicazione-noci)
//   node gsc.mjs perf page|query [giorni]                prime righe del rendimento (default 28 giorni)
//   node gsc.mjs sitemap                                 reinvia /sitemap.xml e mostra lo stato
import { createSign } from 'node:crypto';
const BASE = 'https://www.inlab-communication.it/';
const raw = process.env.GOOGLE_SA_KEY.trim();
const sa = JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString());
const b64 = (x) => Buffer.from(x).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const head = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
const claim = b64(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
const sig = createSign('RSA-SHA256').update(`${head}.${claim}`).sign(sa.private_key, 'base64url');
const tk = (await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${sig}` }) })).json()).access_token;
const g = async (u, o = {}) => { const r = await fetch(u, { ...o, headers: { authorization: `Bearer ${tk}`, 'content-type': 'application/json' } }); return [r.status, await r.text()]; };
const SITE = encodeURIComponent(process.env.GSC_SITE);
const [cmd, ...args] = process.argv.slice(2);

if (cmd === 'inspect') {
  let ok = 0;
  for (const p of args) {
    const [, t] = await g('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', { method: 'POST', body: JSON.stringify({ inspectionUrl: BASE + p.replace(/^\//, ''), siteUrl: process.env.GSC_SITE }) });
    const r = JSON.parse(t).inspectionResult?.indexStatusResult || {};
    if (r.verdict === 'PASS') ok++;
    console.log(p, '|', r.coverageState, '|', r.lastCrawlTime || '-');
  }
  console.log('indicizzate', ok, '/', args.length);
} else if (cmd === 'perf') {
  const days = Number(args[1] || 28);
  const end = new Date(); const start = new Date(Date.now() - days * 864e5);
  const [, t] = await g(`https://searchconsole.googleapis.com/webmasters/v3/sites/${SITE}/searchAnalytics/query`, { method: 'POST', body: JSON.stringify({ startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10), dimensions: [args[0] || 'page'], rowLimit: 50 }) });
  for (const r of JSON.parse(t).rows || []) console.log(r.keys[0].replace(BASE, '/'), '| impr', r.impressions, '| clic', r.clicks, '| pos', r.position.toFixed(1));
} else if (cmd === 'sitemap') {
  const sm = encodeURIComponent(BASE + 'sitemap.xml');
  const [s1] = await g(`https://searchconsole.googleapis.com/webmasters/v3/sites/${SITE}/sitemaps/${sm}`, { method: 'PUT' });
  const [, t] = await g(`https://searchconsole.googleapis.com/webmasters/v3/sites/${SITE}/sitemaps/${sm}`);
  const j = JSON.parse(t);
  console.log('invio', s1, '| ultimo invio', j.lastSubmitted, '| letta', j.lastDownloaded, '| errori', j.errors, '| avvisi', j.warnings, JSON.stringify(j.contents || []));
} else {
  console.log('comandi: inspect <percorsi…> | perf page|query [giorni] | sitemap');
}
