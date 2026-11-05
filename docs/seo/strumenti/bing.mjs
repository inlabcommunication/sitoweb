// Bing Webmaster Tools API. La chiave si legge SOLO da BING_WEBMASTER_KEY: mai scriverla in file o messaggi.
// Uso:
//   node bing.mjs query      → ricerche per cui compariamo su Bing (impressioni, clic, posizione)
//   node bing.mjs pages      → pagine con impressioni/clic
//   node bing.mjs crawl      → statistiche di scansione (pagine indicizzate, errori)
//   node bing.mjs url /path  → stato di una singola pagina
//   node bing.mjs quota      → quota di invio URL
const KEY = process.env.BING_WEBMASTER_KEY;
if (!KEY) { console.error("Manca BING_WEBMASTER_KEY nell'ambiente."); process.exit(1); }
const SITE = 'https://www.inlab-communication.it/';
const [cmd, arg] = process.argv.slice(2);
const api = async (method, params = {}) => {
  const u = new URL(`https://ssl.bing.com/webmaster/api.svc/json/${method}`);
  u.searchParams.set('siteUrl', SITE); u.searchParams.set('apikey', KEY);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const r = await fetch(u); const t = await r.text();
  if (!r.ok) { console.error('Errore Bing', r.status, t.slice(0, 300)); process.exit(1); }
  return JSON.parse(t).d;
};
const day = (d) => new Date(Number(String(d).match(/\d+/)?.[0] || 0)).toISOString().slice(0, 10);
if (cmd === 'query' || cmd === 'pages') {
  const d = await api(cmd === 'query' ? 'GetQueryStats' : 'GetPageStats');
  const agg = {};
  for (const r of d || []) { const k = r.Query; const a = (agg[k] ??= { i: 0, c: 0, p: 0, n: 0 }); a.i += r.Impressions; a.c += r.Clicks; a.p += r.AvgImpressionPosition; a.n++; }
  Object.entries(agg).sort((a, b) => b[1].i - a[1].i).slice(0, 40)
    .forEach(([k, a]) => console.log(`${k} | ${a.i} impr | ${a.c} clic | pos ${(a.p / a.n).toFixed(1)}`));
} else if (cmd === 'crawl') {
  const d = await api('GetCrawlStats');
  (d || []).slice(-10).forEach(r => console.log(day(r.Date), 'indicizzate', r.InIndex, 'scansionate', r.CrawledPages, 'errori', r.CrawlErrors, 'bloccate', r.BlockedByRobotsTxt));
} else if (cmd === 'url') {
  const d = await api('GetUrlInfo', { url: SITE.replace(/\/$/, '') + (arg || '/') });
  console.log(JSON.stringify(d, null, 1));
} else if (cmd === 'quota') {
  console.log(JSON.stringify(await api('GetUrlSubmissionQuota')));
} else console.log('Comandi: query | pages | crawl | url /path | quota');
