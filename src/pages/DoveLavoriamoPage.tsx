// /dove-lavoriamo (brief SEO 03/10): mappa SVG statica e elenco per città.
// Regola di Nicola: nessun nome di cliente, solo città, settore e servizi.
// Le attività arrivano dai dati (schede clienti, casi studio, elenco della
// dashboard): il numero per città non è mai scritto a mano.
import React from 'react';
import { MAP_CITIES, MAP_HOME, type MapCity } from '../data/mapCities';
import { BUSINESS } from '../seo/routes';

type Go = (to: string) => void;
export type Activity = { city: string; sector: string; services: string[]; href?: string };
type Props = { activities: Activity[]; agencyCities: string[]; agencyPath: (c: string) => string; go: Go; cta: React.ReactNode };

const norm = (v: string) => String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const slug = (v: string) => norm(v).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const linkTo = (go: Go, to: string) => (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
  e.preventDefault(); go(to);
};
const list = (items: string[]) => {
  const l = items.map((s) => s.trim().toLowerCase()).filter(Boolean);
  return l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} e ${l[l.length - 1]}`;
};
/** "Palagianello (TA)" → "Palagianello", con il nome scritto come in MAP_CITIES */
export const cityOf = (location: string) => {
  const raw = String(location || '').split(/[(,]/)[0].trim();
  return MAP_CITIES.find((c) => norm(c.name) === norm(raw))?.name || raw;
};

// Contorno dell'Italia molto semplificato (lat, lon): serve solo a orientarsi.
const ITALY: [number, number][][] = [
  [[43.79, 7.53], [44.1, 8.2], [44.4, 8.95], [44.07, 9.85], [43.55, 10.3], [42.95, 10.55], [42.4, 11.2], [41.75, 12.25], [41.25, 13.05],
    [40.8, 14.1], [40.6, 14.4], [40.25, 15], [39.95, 15.6], [39.2, 16.05], [38.7, 15.9], [38.2, 15.65], [37.93, 16.06], [38.45, 16.55],
    [38.9, 17.15], [39.4, 17.1], [39.9, 16.6], [40.2, 16.7], [40.45, 17], [40.47, 17.25], [40.3, 17.7], [40.05, 18], [39.8, 18.37],
    [40.15, 18.52], [40.65, 17.95], [41, 17.2], [41.3, 16.5], [41.55, 15.9], [41.9, 16.18], [41.92, 15.4], [42.2, 14.7], [42.65, 14.05],
    [43.3, 13.7], [43.62, 13.5], [44.07, 12.57], [44.45, 12.3], [45.05, 12.4], [45.45, 12.3], [45.65, 13.1], [45.65, 13.8], [46.5, 13.7],
    [46.6, 12.3], [47.05, 12.1], [46.5, 10.4], [46.4, 9.3], [46.45, 8.4], [45.9, 7], [45.15, 6.8], [44.4, 6.9]],
  [[38.27, 15.65], [37.9, 15.3], [37.05, 15.3], [36.65, 15.1], [36.75, 14.4], [37.1, 13.8], [37.55, 12.65], [38, 12.5], [38.15, 13.35], [38.03, 14.2]],
  [[41.25, 9.2], [40.9, 9.75], [40.05, 9.7], [39.15, 9.55], [38.9, 8.6], [39.4, 8.4], [40.1, 8.4], [40.9, 8.2]],
];
// Costa del golfo di Taranto e dell'Adriatico vicino a Bari, per l'ingrandimento
const COAST: [number, number][][] = [
  [[40.3, 16.7], [40.37, 16.82], [40.42, 16.88], [40.44, 16.93], [40.47, 17], [40.5, 17.06], [40.49, 17.13], [40.47, 17.19], [40.44, 17.23], [40.41, 17.29], [40.37, 17.37], [40.33, 17.45], [40.28, 17.6]],
  [[41.3, 16.5], [41.2, 16.65], [41.13, 16.85], [41.05, 17.05], [41, 17.2], [40.9, 17.4]],
];

const K = Math.cos((41 * Math.PI) / 180);
type Box = { minLat: number; maxLat: number; minLon: number; maxLon: number };
const projector = (b: Box, width: number) => {
  const s = width / ((b.maxLon - b.minLon) * K);
  return { s, h: (b.maxLat - b.minLat) * s, p: (lat: number, lon: number) => [(lon - b.minLon) * K * s, (b.maxLat - lat) * s] as const };
};
const pathOf = (pts: [number, number][], p: (lat: number, lon: number) => readonly [number, number], close: boolean) =>
  pts.map(([la, lo], i) => `${i ? 'L' : 'M'}${p(la, lo)[0].toFixed(1)} ${p(la, lo)[1].toFixed(1)}`).join('') + (close ? 'Z' : '');

const Dot: React.FC<{ c: MapCity; x: number; y: number; n: number; href: string; go: Go; home: boolean; label?: string; size: number }> = ({ c, x, y, n, href, go, home, label = 'e', size }) => {
  const r = home ? size * 0.55 : size * 0.4;
  const off = r + size * 0.35;
  const [tx, ty, anchor] = label === 'n' ? [x, y - off, 'middle'] : label === 's' ? [x, y + off + size * 0.8, 'middle'] : label === 'w' ? [x - off, y + size * 0.35, 'end'] : [x + off, y + size * 0.35, 'start'];
  const text = `${c.name}: ${n} ${n === 1 ? 'attività seguita' : 'attività seguite'}${home ? ' (la nostra sede)' : ''}`;
  return (
    <a href={href} onClick={href.startsWith('#') ? undefined : linkTo(go, href)} aria-label={text} className="map-dot">
      <title>{text}</title>
      {home && <circle cx={x} cy={y} r={r * 1.9} fill="none" stroke="var(--a)" strokeOpacity={0.5} />}
      <circle className="dot" cx={x} cy={y} r={r} fill="var(--a)" />
      <circle cx={x} cy={y} r={Math.max(r * 2.2, 15)} fill="transparent" />
      <text x={tx} y={ty} textAnchor={anchor as any} fontSize={size} fill="var(--t)" fontFamily="var(--fb, inherit)">{c.name}</text>
    </a>
  );
};

export const PageDoveLavoriamo: React.FC<Props> = ({ activities, agencyCities, agencyPath, go, cta }) => {
  // Attività raggruppate per città: prima la sede, poi le città con più attività
  const groups = new Map<string, Activity[]>();
  activities.forEach((a) => { if (a.city) groups.set(a.city, [...(groups.get(a.city) || []), a]); });
  const cities = [...groups.entries()].sort((a, b) => (a[0] === MAP_HOME ? -1 : b[0] === MAP_HOME ? 1 : b[1].length - a[1].length || a[0].localeCompare(b[0])));
  const hasPage = (c: string) => agencyCities.includes(c);
  const hrefOf = (c: string) => (hasPage(c) ? agencyPath(c) : `#${slug(c)}`);
  const onMap = MAP_CITIES.filter((c) => groups.has(c.name) || c.name === MAP_HOME);
  const others = [...agencyCities, ...MAP_CITIES.map((c) => c.name)].filter((c, i, a) => a.indexOf(c) === i && !groups.has(c));

  // Ingrandimento: solo l'area delle città pugliesi e lucane con attività
  const near = onMap.filter((c) => c.region === 'Puglia' || c.region === 'Basilicata');
  const far = onMap.filter((c) => !near.includes(c));
  const zb: Box = {
    minLat: Math.min(...near.map((c) => c.lat)) - 0.1, maxLat: Math.max(...near.map((c) => c.lat)) + 0.07,
    minLon: Math.min(...near.map((c) => c.lon)) - 0.12, maxLon: Math.max(...near.map((c) => c.lon)) + 0.16,
  };
  const zoom = projector(zb, 600);
  const italy = projector({ minLat: 36.5, maxLat: 47.2, minLon: 6.5, maxLon: 18.7 }, 300);
  const [zx1, zy1] = italy.p(zb.maxLat, zb.minLon);
  const [zx2, zy2] = italy.p(zb.minLat, zb.maxLon);

  return (
    <>
      <section style={{ padding: '10rem 2rem 4rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p className="section-label">Le nostre città</p>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(3rem,8vw,7.5rem)', lineHeight: 0.9, marginBottom: '2rem', textTransform: 'uppercase', fontWeight: 400 }}>Dove lavoriamo</h1>
          <p style={{ maxWidth: 680, fontSize: 17, lineHeight: 1.75, color: 'var(--m)', fontWeight: 300 }}>
            Siamo a {BUSINESS.city}, in {BUSINESS.street}, e lavoriamo con attività di tutta la provincia di Taranto e dintorni. Qui trovi le città in cui siamo presenti, i settori delle attività che seguiamo e i servizi che facciamo.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <style>{`.map-dot{cursor:pointer}.map-dot:focus{outline:none}.map-dot:focus-visible .dot,.map-dot:hover .dot{stroke:var(--t);stroke-width:2}.map-grid{display:grid;grid-template-columns:1fr 2fr;gap:2rem;align-items:center}@media(max-width:768px){.map-grid{grid-template-columns:1fr}}@media(max-width:480px){.map-zoom text{font-size:23px}}`}</style>
        <div className="map-grid" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <figure style={{ margin: 0 }}>
            <svg viewBox={`0 0 ${italy.s * (18.7 - 6.5) * K} ${italy.h}`} width="100%" role="group" aria-labelledby="map-it-title" style={{ display: 'block', maxWidth: 340, margin: '0 auto' }}>
              <title id="map-it-title">Mappa dell'Italia con le città in cui lavoriamo</title>
              {ITALY.map((pts, i) => <path key={i} d={pathOf(pts, italy.p, true)} fill="rgba(240,237,230,.06)" stroke="rgba(240,237,230,.35)" strokeWidth={1} />)}
              <rect x={zx1} y={zy1} width={Math.max(zx2 - zx1, 8)} height={Math.max(zy2 - zy1, 8)} fill="none" stroke="var(--a)" strokeWidth={1.5} />
              {far.map((c) => { const [x, y] = italy.p(c.lat, c.lon); return <Dot key={c.name} c={c} x={x} y={y} n={groups.get(c.name)?.length || 0} href={hrefOf(c.name)} go={go} home={false} size={11} />; })}
            </svg>
            <figcaption style={{ fontSize: 13, color: 'var(--m)', textAlign: 'center', marginTop: '.8rem' }}>Il riquadro è l'arco ionico, ingrandito qui accanto.</figcaption>
          </figure>
          <figure style={{ margin: 0 }}>
            <svg viewBox={`0 0 600 ${zoom.h.toFixed(0)}`} width="100%" role="group" aria-labelledby="map-zoom-title" className="map-zoom" style={{ display: 'block' }}>
              <title id="map-zoom-title">Mappa dell'arco ionico con le città in cui lavoriamo</title>
              {COAST.map((pts, i) => <path key={i} d={pathOf(pts, zoom.p, false)} fill="none" stroke="rgba(240,237,230,.35)" strokeWidth={1.5} strokeDasharray="4 4" />)}
              {near.map((c) => { const [x, y] = zoom.p(c.lat, c.lon); return <Dot key={c.name} c={c} x={x} y={y} n={groups.get(c.name)?.length || 0} href={hrefOf(c.name)} go={go} home={c.name === MAP_HOME} label={c.label} size={17} />; })}
            </svg>
            <figcaption style={{ fontSize: 13, color: 'var(--m)', textAlign: 'center', marginTop: '.8rem' }}>Ogni punto è una città in cui seguiamo almeno un'attività. L'elenco completo è qui sotto.</figcaption>
          </figure>
        </div>
      </section>

      <section style={{ padding: '5rem 2rem', borderBottom: '.5px solid var(--b)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: '2.5rem 3rem' }}>
          {cities.map(([city, items]) => (
            <div key={city} id={slug(city)} style={{ scrollMarginTop: 100 }}>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(2rem,3.4vw,3rem)', lineHeight: 1, textTransform: 'uppercase', fontWeight: 400, marginBottom: '.4rem' }}>{city}</h2>
              <p style={{ fontSize: 14, color: 'var(--a)', marginBottom: '1rem' }}>{items.length} {items.length === 1 ? 'attività seguita' : 'attività seguite'}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem' }}>
                {items.map((a, i) => {
                  const text = `${a.sector.toLowerCase()}${a.services.length ? `: ${list(a.services)}` : ''}`;
                  return (
                    <li key={i} style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.6, padding: '.5rem 0', borderBottom: '.5px solid var(--b)' }}>
                      {a.href ? <a href={a.href} onClick={linkTo(go, a.href)} style={{ color: 'var(--t)', textDecoration: 'underline', textUnderlineOffset: 3 }}>{text}</a> : text}
                    </li>
                  );
                })}
              </ul>
              {hasPage(city) && <a href={agencyPath(city)} onClick={linkTo(go, agencyPath(city))} className="foot-link" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontSize: 14, color: 'var(--a)' }}>Agenzia a {city} →</a>}
            </div>
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section style={{ padding: '4rem 2rem', borderBottom: '.5px solid var(--b)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <h2 className="section-label" style={{ marginBottom: '1.5rem' }}>Lavoriamo anche a</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {others.map((c) => hasPage(c)
                ? <a key={c} href={agencyPath(c)} onClick={linkTo(go, agencyPath(c))} className="tag tag-g city-link" style={{ fontSize: 12, padding: '8px 16px' }}>{c}</a>
                : <span key={c} className="tag tag-g" style={{ fontSize: 12, padding: '8px 16px' }}>{c}</span>)}
            </div>
          </div>
        </section>
      )}

      {cta}
    </>
  );
};
