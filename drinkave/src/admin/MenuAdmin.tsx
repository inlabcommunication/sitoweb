import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Loading } from '../components/Ui';
import type { Backend } from '../lib/backend';
import type { Menu, MenuCategory, MenuItem } from '../lib/types';
import { useAsync } from '../lib/useAsync';
import { uid } from '../lib/util';

function sposta<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const c = [...arr];
  [c[i], c[j]] = [c[j], c[i]];
  return c;
}

export default function MenuAdmin({ b }: { b: Backend }) {
  const { data } = useAsync(() => b.getMenu());
  const [menu, setMenu] = useState<Menu | null>(null);
  const [modificato, setModificato] = useState(false);
  const [stato, setStato] = useState<{ ok: boolean; testo: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setMenu(structuredClone(data));
  }, [data]);

  // Avviso se si lascia la pagina con modifiche non salvate.
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (modificato) e.preventDefault();
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [modificato]);

  if (!menu) return <Loading />;

  const aggiorna = (cats: MenuCategory[]) => {
    setMenu({ ...menu, categorie: cats });
    setModificato(true);
    setStato(null);
  };
  const setCat = (i: number, patch: Partial<MenuCategory>) =>
    aggiorna(menu.categorie.map((c, k) => (k === i ? { ...c, ...patch } : c)));
  const setVoce = (ci: number, vi: number, patch: Partial<MenuItem>) =>
    setCat(ci, { voci: menu.categorie[ci].voci.map((v, k) => (k === vi ? { ...v, ...patch } : v)) });

  async function salva() {
    if (!menu) return;
    setBusy(true);
    try {
      const pulito: Menu = {
        categorie: menu.categorie
          .filter((c) => c.nome.trim())
          .map((c) => ({ ...c, nome: c.nome.trim(), voci: c.voci.filter((v) => v.nome.trim()) })),
      };
      await b.saveMenu(pulito);
      setMenu(pulito);
      setModificato(false);
      setStato({ ok: true, testo: 'Menu salvato: è già visibile nell’app.' });
    } catch {
      setStato({ ok: false, testo: 'Salvataggio non riuscito.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <div className="row">
        <h2>Menu</h2>
        <span className="spacer" />
        <button className="btn" onClick={salva} disabled={busy || !modificato}>
          {busy ? 'Salvataggio…' : modificato ? 'Salva modifiche' : 'Salvato'}
        </button>
      </div>
      {stato && <div className={`msg ${stato.ok ? 'ok' : 'err'}`}>{stato.testo}</div>}

      {menu.categorie.map((c, ci) => (
        <div key={c.id} className="card stack">
          <div className="row">
            <label className="field" style={{ flex: 1, minWidth: 180 }}>
              <span>Categoria</span>
              <input value={c.nome} onChange={(e) => setCat(ci, { nome: e.target.value })} placeholder="Es. Signature" />
            </label>
            <div className="row" style={{ alignSelf: 'flex-end' }}>
              <button className="icon-btn" title="Sposta su" onClick={() => aggiorna(sposta(menu.categorie, ci, -1))}><ArrowUp size={16} /></button>
              <button className="icon-btn" title="Sposta giù" onClick={() => aggiorna(sposta(menu.categorie, ci, 1))}><ArrowDown size={16} /></button>
              <button
                className="icon-btn"
                title="Elimina categoria"
                onClick={() => confirm(`Eliminare la categoria “${c.nome}” e tutte le sue voci?`) && aggiorna(menu.categorie.filter((_, k) => k !== ci))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <label className="field">
            <span>Sottotitolo (facoltativo)</span>
            <input value={c.nota ?? ''} onChange={(e) => setCat(ci, { nota: e.target.value })} />
          </label>

          {c.voci.map((v, vi) => (
            <div key={v.id} className="editor-item stack">
              <div className="editor-grid">
                <label className="field">
                  <span>Nome</span>
                  <input value={v.nome} onChange={(e) => setVoce(ci, vi, { nome: e.target.value })} />
                </label>
                <label className="field">
                  <span>Prezzo €</span>
                  <input value={v.prezzo} inputMode="decimal" onChange={(e) => setVoce(ci, vi, { prezzo: e.target.value })} />
                </label>
              </div>
              <label className="field">
                <span>Descrizione / ingredienti</span>
                <input value={v.descrizione} onChange={(e) => setVoce(ci, vi, { descrizione: e.target.value })} />
              </label>
              <div className="row">
                <label className="field" style={{ flex: 1, minWidth: 160 }}>
                  <span>Etichetta (facoltativa)</span>
                  <input value={v.tag ?? ''} onChange={(e) => setVoce(ci, vi, { tag: e.target.value })} placeholder="Es. Novità, Analcolico" />
                </label>
                <div className="row" style={{ alignSelf: 'flex-end' }}>
                  <button className="icon-btn" title="Sposta su" onClick={() => setCat(ci, { voci: sposta(c.voci, vi, -1) })}><ArrowUp size={16} /></button>
                  <button className="icon-btn" title="Sposta giù" onClick={() => setCat(ci, { voci: sposta(c.voci, vi, 1) })}><ArrowDown size={16} /></button>
                  <button className="icon-btn" title="Elimina voce" onClick={() => setCat(ci, { voci: c.voci.filter((_, k) => k !== vi) })}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          <button
            className="btn ghost sm"
            onClick={() => setCat(ci, { voci: [...c.voci, { id: uid(), nome: '', descrizione: '', prezzo: '' }] })}
          >
            <Plus size={14} /> Aggiungi voce
          </button>
        </div>
      ))}

      <button className="btn ghost" onClick={() => aggiorna([...menu.categorie, { id: uid(), nome: '', voci: [] }])}>
        <Plus size={16} /> Aggiungi categoria
      </button>
    </div>
  );
}
