// Copertine dei reel importate da Instagram (richiesta di Nicola, 04/10).
// Quando incolli il codice di incorporamento (o il link) di un reel senza
// copertina, la dashboard chiede a /api/reel-cover di prendere la miniatura dalla
// pagina pubblica di incorporamento UNA volta e salvarla su Cloudinary: il campo Copertina si compila da solo
// e va online con Salva, come sempre. Una copertina già presente (anche caricata
// a mano) non viene mai sovrascritta senza conferma.
import { useRef, useState } from 'react';
import type React from 'react';
import { auth } from '../lib/firebase';
import { instagramPost } from '../lib/instagram';

type Status = { kind: 'busy' | 'ok' | 'err'; msg: string };

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const codeOf = (r: any) => instagramPost(r?.embed)?.id || '';

const message = (error: string): string => ({
  disabled: 'Importazione copertine spenta (REEL_COVER_IMPORT=off su Vercel). Puoi caricare la copertina a mano.',
  cloudinary_not_configured: 'Importazione non configurata: su Vercel manca CLOUDINARY_API_SECRET.',
  unauthorized: 'Non autorizzato: esci e rientra nella dashboard, poi riprova.',
  bad_link: 'Il codice o il link del reel non sembra valido.',
  no_thumbnail: 'Copertina non disponibile da Instagram (il post può essere privato, rimosso o la pagina è cambiata): caricala a mano.',
  blocked: 'Instagram non ha risposto o ha bloccato la richiesta: riprova più tardi o carica la copertina a mano.',
  rate_limited: 'Troppe importazioni in poco tempo: riprova tra un\'ora.',
} as Record<string, string>)[error] || 'Copertina non disponibile: riprova più tardi o caricala a mano.';

async function fetchCover(embed: string): Promise<{ url?: string; error?: string }> {
  try {
    const token = await auth?.currentUser?.getIdToken();
    const r = await fetch('/api/reel-cover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
      body: JSON.stringify({ embed }),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok && typeof data.url === 'string' && data.url.startsWith('https://res.cloudinary.com/')) return { url: data.url };
    return { error: typeof data.error === 'string' ? data.error : 'failed' };
  } catch {
    return { error: 'failed' };
  }
}

const btn: React.CSSProperties = { padding: '7px 10px', background: 'rgba(205,178,255,0.08)', border: '.5px solid #cdb2ff44', borderRadius: 8, color: '#cdb2ff', fontSize: 10, cursor: 'pointer', letterSpacing: '.08em' };

/** Lista dei reel (stessa ObjList delle altre raccolte) con l'importazione delle copertine. */
export const ReelsList = ({ List, items = [], onChange, ...rest }: {
  List: React.ComponentType<any>; items: any[]; onChange: (a: any[]) => void; [k: string]: any;
}) => {
  const latest = useRef(items); latest.current = items;
  const change = useRef(onChange); change.current = onChange;
  const timers = useRef<Record<string, number>>({});
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [bulk, setBulk] = useState('');
  const [summary, setSummary] = useState<Status | null>(null);

  /** Importa la copertina del reel con quel codice; `force` sostituisce quella esistente. */
  const run = async (code: string, force = false): Promise<string> => {
    const r = latest.current.find((x) => codeOf(x) === code);
    if (!r || (!force && r.cover)) return 'skipped';
    setStatus((s) => ({ ...s, [code]: { kind: 'busy', msg: 'Sto importando la copertina da Instagram…' } }));
    const res = await fetchCover(r.embed);
    if (res.url) {
      const a = clone(latest.current);
      const j = a.findIndex((x) => codeOf(x) === code);
      // nel frattempo qualcuno può aver caricato una copertina a mano: non si tocca
      if (j >= 0 && (force || !a[j].cover)) { a[j] = { ...a[j], cover: res.url }; change.current(a); }
      setStatus((s) => ({ ...s, [code]: { kind: 'ok', msg: 'Copertina importata da Instagram. Ricordati di premere Salva.' } }));
      return 'ok';
    }
    setStatus((s) => ({ ...s, [code]: { kind: 'err', msg: message(res.error || '') } }));
    return res.error || 'failed';
  };

  // All'incolla: se è cambiato il reel di UNA voce e non ha copertina, importa (dopo una breve pausa)
  const handleChange = (next: any[]) => {
    const prev = latest.current;
    onChange(next);
    if (next.length !== prev.length) return;
    const changed = next.map((r, i) => ((r?.embed || '') !== (prev[i]?.embed || '') ? i : -1)).filter((i) => i >= 0);
    if (changed.length !== 1) return; // riordino o modifiche multiple: niente importazione automatica
    const r = next[changed[0]];
    const code = codeOf(r);
    if (!code || r.cover || code === codeOf(prev[changed[0]])) return;
    window.clearTimeout(timers.current[code]);
    setStatus((s) => ({ ...s, [code]: { kind: 'busy', msg: 'Sto importando la copertina da Instagram…' } }));
    timers.current[code] = window.setTimeout(() => { run(code); }, 700);
  };

  const missing = items.filter((r) => codeOf(r) && !r.cover);
  const importMissing = async () => {
    const codes = missing.map(codeOf);
    const results: string[] = [];
    setSummary(null);
    for (let k = 0; k < codes.length; k++) {
      setBulk(`Importo ${k + 1} di ${codes.length}…`);
      const res = await run(codes[k]);
      results.push(res);
      // problema di configurazione: inutile continuare con gli altri reel
      if (['disabled', 'cloudinary_not_configured', 'unauthorized', 'rate_limited', 'blocked'].includes(res)) break;
      // pausa tra un reel e l'altro: poche richieste e distanziate
      if (k < codes.length - 1) await new Promise((ok) => setTimeout(ok, 2500));
    }
    setBulk('');
    const ok = results.filter((r) => r === 'ok').length;
    const fail = results.filter((r) => r !== 'ok' && r !== 'skipped');
    // i messaggi dei singoli reel stanno dentro le schede (spesso chiuse): qui il riepilogo
    setSummary(!fail.length ? { kind: 'ok', msg: `Importate ${ok} copertine. Ricordati di premere Salva.` }
      : new Set(fail).size === 1 && !ok ? { kind: 'err', msg: message(fail[0]) }
      : { kind: 'err', msg: `Importate ${ok} copertine, ${fail.length} non riuscite: apri i reel senza copertina per vedere il motivo.` });
  };

  const extra = (r: any) => {
    const code = codeOf(r);
    if (!code) return null;
    const st = status[code];
    return (
      <div style={{ marginTop: -4, marginBottom: 10 }}>
        <button type="button" style={btn} disabled={st?.kind === 'busy'}
          onClick={() => { if (!r.cover || confirm('Sostituire la copertina attuale con quella di Instagram?')) run(code, !!r.cover); }}>
          {r.cover ? 'Reimporta copertina da Instagram' : 'Importa copertina da Instagram'}
        </button>
        {st && <div role="status" style={{ fontSize: 10, marginTop: 6, lineHeight: 1.4, color: st.kind === 'err' ? '#ff9b9b' : st.kind === 'ok' ? '#9be3b0' : '#aaa' }}>{st.msg}</div>}
      </div>
    );
  };

  return (
    <>
      {(missing.length > 1 || summary) && (
        <div style={{ marginBottom: 10 }}>
          {missing.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="button" style={btn} disabled={!!bulk} onClick={importMissing}>Importa copertine mancanti ({missing.length})</button>
              {bulk && <span style={{ fontSize: 10, color: '#aaa' }}>{bulk}</span>}
            </div>
          )}
          {summary && !bulk && <div role="status" style={{ fontSize: 10, marginTop: 6, lineHeight: 1.4, color: summary.kind === 'err' ? '#ff9b9b' : '#9be3b0' }}>{summary.msg}</div>}
        </div>
      )}
      <List {...rest} items={items} onChange={handleChange} extra={extra} />
    </>
  );
};
