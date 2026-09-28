// Legge i dati di Search Console e Google Analytics 4 per l'analisi SEO.
// Nessuna dipendenza: firma il JWT dell'account di servizio con node:crypto.
//
// Variabili d'ambiente:
//   GOOGLE_SA_KEY    JSON della chiave dell'account di servizio (testo o base64)
//   GA4_PROPERTY_ID  ID numerico della proprietà GA4 (es. 123456789)
//   GSC_SITE         proprietà Search Console (es. sc-domain:inlabcommunication.it)
//
// Uso:
//   node tools/seo/google-data.mjs gsc [giorni=28]   → query, pagine, dispositivi
//   node tools/seo/google-data.mjs ga  [giorni=28]   → pagine, canali, eventi
//   node tools/seo/google-data.mjs check             → verifica accesso
import { createSign } from 'node:crypto';

const env = (k) => {
  const v = process.env[k];
  if (!v) { console.error(`Manca la variabile ${k}`); process.exit(2); }
  return v;
};

const saKey = () => {
  const raw = env('GOOGLE_SA_KEY').trim();
  return JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8'));
};

const b64url = (b) => Buffer.from(b).toString('base64url');

async function token() {
  const sa = saKey();
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  }));
  const sig = createSign('RSA-SHA256').update(`${head}.${claim}`).sign(sa.private_key, 'base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${sig}` }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('Token non ottenuto: ' + JSON.stringify(j));
  return j.access_token;
}

const post = async (tk, url, body) => {
  const r = await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${tk}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(`${r.status} ${url}: ${JSON.stringify(j.error || j)}`);
  return j;
};

const day = (offset) => new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);

// Periodo corrente e precedente della stessa durata (i dati GSC arrivano con ~2-3 giorni di ritardo)
const periods = (days) => ({
  cur: { startDate: day(days + 2), endDate: day(3) },
  prev: { startDate: day(2 * days + 2), endDate: day(days + 3) },
});

async function gsc(tk, days) {
  const site = encodeURIComponent(env('GSC_SITE'));
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`;
  const { cur, prev } = periods(days);
  const q = (p, dims, rowLimit = 250) => post(tk, url, { ...p, dimensions: dims, rowLimit, dataState: 'final' }).then((j) => j.rows || []);
  const [totCur, totPrev, queries, queriesPrev, pages, pagesPrev, qp, devices, countries] = await Promise.all([
    q(cur, []), q(prev, []), q(cur, ['query'], 500), q(prev, ['query'], 500),
    q(cur, ['page']), q(prev, ['page']), q(cur, ['query', 'page'], 1000), q(cur, ['device']), q(cur, ['country'], 10),
  ]);
  return { site: env('GSC_SITE'), period: cur, previous: prev, totals: { current: totCur[0] || null, previous: totPrev[0] || null },
    queries, queriesPrev, pages, pagesPrev, queryPage: qp, devices, countries };
}

async function ga(tk, days) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${env('GA4_PROPERTY_ID')}:runReport`;
  const { cur, prev } = periods(days);
  const dateRanges = [{ ...cur, name: 'current' }, { ...prev, name: 'previous' }];
  const rep = (dimensions, metrics, limit = 100) => post(tk, url, {
    dateRanges, dimensions: dimensions.map((name) => ({ name })), metrics: metrics.map((name) => ({ name })), limit,
  });
  const [totals, pages, channels, landing, events, devices] = await Promise.all([
    rep([], ['sessions', 'totalUsers', 'newUsers', 'engagementRate', 'averageSessionDuration', 'keyEvents']),
    rep(['pagePath'], ['screenPageViews', 'totalUsers', 'userEngagementDuration', 'engagementRate'], 200),
    rep(['sessionDefaultChannelGroup'], ['sessions', 'engagementRate', 'keyEvents']),
    rep(['landingPagePlusQueryString', 'sessionDefaultChannelGroup'], ['sessions', 'engagementRate', 'keyEvents'], 200),
    rep(['eventName'], ['eventCount', 'totalUsers'], 50),
    rep(['deviceCategory'], ['sessions', 'engagementRate']),
  ]);
  return { property: env('GA4_PROPERTY_ID'), period: cur, previous: prev, totals, pages, channels, landing, events, devices };
}

const [cmd = 'check', daysArg = '28'] = process.argv.slice(2);
const days = Math.max(1, parseInt(daysArg, 10) || 28);
const tk = await token();
if (cmd === 'gsc') console.log(JSON.stringify(await gsc(tk, days), null, 2));
else if (cmd === 'ga') console.log(JSON.stringify(await ga(tk, days), null, 2));
else {
  const out = {};
  try { const g = await gsc(tk, 7); out.searchConsole = `ok (${g.queries.length} query negli ultimi 7 giorni)`; } catch (e) { out.searchConsole = 'ERRORE: ' + e.message; }
  try { const a = await ga(tk, 7); out.analytics = `ok (${a.pages.rows?.length || 0} pagine negli ultimi 7 giorni)`; } catch (e) { out.analytics = 'ERRORE: ' + e.message; }
  console.log(JSON.stringify(out, null, 2));
}
