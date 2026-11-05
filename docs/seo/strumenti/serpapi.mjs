// Google Trends e risultati di Google Italia tramite SerpApi.
// La chiave si legge SOLO dalla variabile d'ambiente SERPAPI_KEY: non va mai scritta in file o messaggi.
//
// Uso:
//   node serpapi.mjs trends "social media manager,gestione social,agenzia di comunicazione" [IT-75] [today 12-m]
//   node serpapi.mjs related "agenzia di comunicazione" [IT-75]
//   node serpapi.mjs serp "agenzia di comunicazione castellaneta" ["Castellaneta,Apulia,Italy"]
// IT-75 = Puglia. Ogni chiamata consuma 1 ricerca del piano SerpApi.

const KEY = process.env.SERPAPI_KEY;
if (!KEY) { console.error('Manca SERPAPI_KEY nell\'ambiente.'); process.exit(1); }
const [cmd, q, a2, a3] = process.argv.slice(2);
const call = async (params) => {
  const u = new URL('https://serpapi.com/search.json');
  for (const [k, v] of Object.entries({ ...params, api_key: KEY })) if (v) u.searchParams.set(k, v);
  const r = await fetch(u);
  const j = await r.json();
  if (j.error) { console.error('Errore SerpApi:', j.error); process.exit(1); }
  return j;
};

if (cmd === 'trends') {
  const j = await call({ engine: 'google_trends', q, geo: a2 || 'IT-75', date: a3 || 'today 12-m', data_type: 'TIMESERIES', hl: 'it' });
  const rows = j.interest_over_time?.timeline_data || [];
  const names = q.split(',');
  const avg = names.map((_, i) => Math.round(rows.reduce((s, r) => s + (r.values[i]?.extracted_value || 0), 0) / (rows.length || 1)));
  console.log('Media 12 mesi (0-100):', names.map((n, i) => `${n}=${avg[i]}`).join(' | '));
  for (const r of rows) console.log(r.date, r.values.map(v => v.extracted_value).join('\t'));
} else if (cmd === 'related') {
  const j = await call({ engine: 'google_trends', q, geo: a2 || 'IT-75', date: 'today 12-m', data_type: 'RELATED_QUERIES', hl: 'it' });
  const rq = j.related_queries || {};
  console.log('TOP:'); (rq.top || []).forEach(x => console.log(' ', x.query, x.extracted_value));
  console.log('IN CRESCITA:'); (rq.rising || []).forEach(x => console.log(' ', x.query, x.value));
} else if (cmd === 'serp') {
  const j = await call({ engine: 'google', q, location: a2 || 'Castellaneta,Apulia,Italy', google_domain: 'google.it', gl: 'it', hl: 'it', num: '20' });
  console.log('MAPPA:'); (j.local_results?.places || []).forEach((p, i) => console.log(` ${i + 1}. ${p.title} | ${p.rating ?? '-'}★ (${p.reviews ?? 0}) | ${p.address ?? ''}`));
  console.log('RISULTATI:'); (j.organic_results || []).forEach(r => console.log(` ${r.position}. ${r.link}`));
} else {
  console.log('Comandi: trends | related | serp');
}
