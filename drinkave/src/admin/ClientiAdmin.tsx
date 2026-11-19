import { Download, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Errore, Loading } from '../components/Ui';
import type { Backend } from '../lib/backend';
import type { Cliente } from '../lib/types';
import { useAsync } from '../lib/useAsync';
import { formatDataOra } from '../lib/util';

async function esportaExcel(clienti: Cliente[]) {
  const { default: writeXlsxFile } = await import('write-excel-file');
  const intestazione = ['Nome', 'Cognome', 'Telefono', 'Email', 'Consenso marketing', 'Iscritto il'].map((value) => ({
    value,
    fontWeight: 'bold' as const,
  }));
  const righe = clienti.map((c) => [
    { type: String, value: c.nome },
    { type: String, value: c.cognome },
    { type: String, value: c.telefono },
    { type: String, value: c.email ?? '' },
    { type: String, value: c.consensoMarketing ? 'Sì' : 'No' },
    { type: Date, value: new Date(c.creato), format: 'dd/mm/yyyy hh:mm' },
  ]);
  const oggi = new Date().toISOString().slice(0, 10);
  await writeXlsxFile([intestazione, ...righe], {
    columns: [{ width: 18 }, { width: 20 }, { width: 18 }, { width: 30 }, { width: 20 }, { width: 18 }],
    sheet: 'Clienti',
    fileName: `drinkave-clienti-${oggi}.xlsx`,
    stickyRowsCount: 1,
  });
}

export default function ClientiAdmin({ b }: { b: Backend }) {
  const { data, caricamento, errore, ricarica } = useAsync(() => b.listClienti());
  const [q, setQ] = useState('');
  const [soloMarketing, setSoloMarketing] = useState(false);
  const [busy, setBusy] = useState(false);

  const filtrati = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (data ?? []).filter(
      (c) =>
        (!soloMarketing || c.consensoMarketing) &&
        (!t || `${c.nome} ${c.cognome} ${c.telefono} ${c.email ?? ''}`.toLowerCase().includes(t)),
    );
  }, [data, q, soloMarketing]);

  async function scarica() {
    setBusy(true);
    try {
      await esportaExcel(filtrati);
    } finally {
      setBusy(false);
    }
  }

  async function elimina(c: Cliente) {
    if (!confirm(`Eliminare ${c.nome} ${c.cognome} (${c.telefono})? Non potrà più vedere la parola finché non si riscrive.`)) return;
    await b.deleteCliente(c);
    ricarica();
  }

  return (
    <div className="stack">
      <div className="row">
        <h2>Clienti</h2>
        <span className="badge">{data?.length ?? 0} iscritti</span>
        <span className="spacer" />
        <button className="btn" onClick={scarica} disabled={busy || filtrati.length === 0}>
          <Download size={16} /> Scarica Excel
        </button>
      </div>

      <div className="row">
        <label className="field" style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 15, color: 'var(--muted)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca per nome, telefono, email…" style={{ paddingLeft: 36 }} aria-label="Cerca" />
        </label>
        <label className="check">
          <input type="checkbox" checked={soloMarketing} onChange={(e) => setSoloMarketing(e.target.checked)} />
          <span>Solo con consenso marketing</span>
        </label>
      </div>

      {caricamento && <Loading />}
      {errore && <Errore testo="Non riusciamo a caricare i clienti." onRiprova={ricarica} />}
      {data && filtrati.length === 0 && <div className="empty">Nessun cliente{q ? ' trovato' : ' ancora'}.</div>}

      {filtrati.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Marketing</th>
                <th>Iscritto il</th>
                <th aria-label="Azioni" />
              </tr>
            </thead>
            <tbody>
              {filtrati.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome} {c.cognome}</td>
                  <td><a href={`tel:${c.telefono}`}>{c.telefono}</a></td>
                  <td>{c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : <span className="muted">—</span>}</td>
                  <td><span className={`badge ${c.consensoMarketing ? 'on' : ''}`}>{c.consensoMarketing ? 'Sì' : 'No'}</span></td>
                  <td className="muted">{formatDataOra(c.creato)}</td>
                  <td>
                    <button className="icon-btn" title="Elimina" aria-label={`Elimina ${c.nome} ${c.cognome}`} onClick={() => elimina(c)}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
