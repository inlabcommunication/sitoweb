// Volumi di ricerca dal Keyword Planner (Google Ads API), solo lettura.
// Variabili d'ambiente (mai scriverne i valori in file o messaggi):
//   GOOGLE_SA_KEY (account di servizio, JSON o base64), GOOGLE_ADS_DEVELOPER_TOKEN,
//   GOOGLE_ADS_CUSTOMER_ID (account Ads), GOOGLE_ADS_LOGIN_CUSTOMER_ID (Manager).
// Uso:
//   node ads-keyword.mjs volumi file.txt [geo]   → una parola per riga; geo predefinito Puglia (20768)
//   node ads-keyword.mjs idee "parola1,parola2" [geo]
// Geo: 2380 Italia, 20768 Puglia (geoTargetConstants).
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

for (const v of ['GOOGLE_SA_KEY', 'GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CUSTOMER_ID', 'GOOGLE_ADS_LOGIN_CUSTOMER_ID'])
  if (!process.env[v]) { console.error(`Manca ${v} nell'ambiente.`); process.exit(1); }
const raw = process.env.GOOGLE_SA_KEY.trim();
const sa = JSON.parse(raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString());
const b64 = (x) => Buffer.from(x).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const head = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
const claim = b64(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/adwords', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
const sig = createSign('RSA-SHA256').update(`${head}.${claim}`).sign(sa.private_key, 'base64url');
const tok = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${sig}` }) })).json();
if (!tok.access_token) { console.error('Accesso non riuscito:', tok.error || 'errore'); process.exit(1); }

const CID = process.env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, '');
const headers = {
  authorization: `Bearer ${tok.access_token}`, 'content-type': 'application/json',
  'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  'login-customer-id': process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID.replace(/-/g, ''),
};
// La versione dell'API cambia nel tempo: provo dalla più recente.
const call = async (method, body) => {
  for (let v = 26; v >= 18; v--) {
    const r = await fetch(`https://googleads.googleapis.com/v${v}/customers/${CID}:${method}`, { method: 'POST', headers, body: JSON.stringify(body) });
    if (r.status === 404) continue;
    const t = await r.text();
    if (!r.ok) { console.error(`Errore API v${v} (${r.status}):`, t.slice(0, 600)); process.exit(1); }
    return JSON.parse(t);
  }
  console.error('Nessuna versione API raggiungibile.'); process.exit(1);
};
const [cmd, arg, geo = '20768'] = process.argv.slice(2);
const common = { language: 'languageConstants/1004', geoTargetConstants: [`geoTargetConstants/${geo}`], keywordPlanNetwork: 'GOOGLE_SEARCH' };
const show = (rows) => rows
  .map(r => ({ k: r.text, m: r.keywordMetrics || r.keywordIdeaMetrics || {} }))
  .sort((a, b) => (Number(b.m.avgMonthlySearches) || 0) - (Number(a.m.avgMonthlySearches) || 0))
  .forEach(({ k, m }) => console.log(`${k} | ${m.avgMonthlySearches ?? 0} ricerche/mese | concorrenza ${m.competition ?? '-'} | CPC ${m.lowTopOfPageBidMicros ? (m.lowTopOfPageBidMicros / 1e6).toFixed(2) : '-'}-${m.highTopOfPageBidMicros ? (m.highTopOfPageBidMicros / 1e6).toFixed(2) : '-'} €`));
if (cmd === 'volumi') {
  const kws = readFileSync(arg, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
  const j = await call('generateKeywordHistoricalMetrics', { keywords: kws, ...common });
  show(j.results || []);
} else if (cmd === 'idee') {
  const j = await call('generateKeywordIdeas', { keywordSeed: { keywords: arg.split(',') }, ...common, pageSize: 100 });
  show(j.results || []);
} else console.log('Comandi: volumi file.txt [geo] | idee "a,b" [geo]');
