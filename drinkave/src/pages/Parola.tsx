import { DoorClosed, DoorOpen, LogOut } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { NotificheCard } from '../components/NotificheButton';
import { Deco, Loading } from '../components/Ui';
import { backend, ErroreUtente } from '../lib/backend';
import { getMembro, setMembro } from '../lib/membro';
import type { Parola } from '../lib/types';
import { emailValida, formatDataOra, normalizzaTelefono, telefonoValido } from '../lib/util';

type Modo = 'iscriviti' | 'accedi';

export default function ParolaPage() {
  const [membro, setM] = useState(getMembro);
  const [parola, setParola] = useState<Parola | null>(null);
  const [modo, setModo] = useState<Modo>('iscriviti');
  const [busy, setBusy] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [avviso, setAvviso] = useState<string | null>(null);
  const [autoCarico, setAutoCarico] = useState(!!membro);

  const [f, setF] = useState({ nome: '', cognome: '', telefono: '', email: '', privacy: false, marketing: false });
  const set = (k: keyof typeof f) => (e: { target: { value: string; checked?: boolean; type?: string } }) =>
    setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  // Chi è già iscritto su questo dispositivo vede subito la parola.
  useEffect(() => {
    if (!membro) return;
    backend()
      .then((b) => b.accedi(membro.telefono))
      .then(setParola)
      .catch(() => {
        setMembro(null);
        setM(null);
      })
      .finally(() => setAutoCarico(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function messaggio(e: unknown) {
    return e instanceof ErroreUtente ? e.message : 'Connessione non riuscita. Riprova tra poco.';
  }

  async function invia(e: FormEvent) {
    e.preventDefault();
    setErrore(null);
    setAvviso(null);
    if (modo === 'iscriviti' && (!f.nome.trim() || !f.cognome.trim())) return setErrore('Nome e cognome sono obbligatori.');
    if (!telefonoValido(f.telefono)) return setErrore('Inserisci un numero di telefono valido.');

    if (modo === 'iscriviti') {
      if (f.email.trim() && !emailValida(f.email)) return setErrore('L’email non sembra corretta (puoi anche lasciarla vuota).');
      if (!f.privacy) return setErrore('Per iscriverti devi accettare l’informativa sulla privacy.');
    }

    setBusy(true);
    try {
      const b = await backend();
      if (modo === 'iscriviti') {
        const r = await b.registra({
          nome: f.nome,
          cognome: f.cognome,
          telefono: f.telefono,
          email: f.email,
          consensoMarketing: f.marketing,
        });
        if (r.giaIscritto) setAvviso('Eri già iscritto: bentornato!');
        setParola(r.parola);
        const m = { nome: f.nome.trim(), telefono: normalizzaTelefono(f.telefono) };
        setMembro(m);
        setM(m);
      } else {
        const p = await b.accedi(f.telefono);
        setParola(p);
        const m = { nome: '', telefono: normalizzaTelefono(f.telefono) };
        setMembro(m);
        setM(m);
      }
    } catch (err) {
      setErrore(messaggio(err));
    } finally {
      setBusy(false);
    }
  }

  function esci() {
    setMembro(null);
    setM(null);
    setParola(null);
  }

  if (autoCarico) return <div className="wrap page"><Loading testo="Apriamo la porta…" /></div>;

  if (parola) {
    return (
      <div className="wrap page stack">
        <div className="door">
          <DoorOpen size={46} strokeWidth={1.2} />
        </div>
        {avviso && <div className="msg ok">{avviso}</div>}
        <div className="secret">
          <div className="eyebrow">{membro?.nome ? `${membro.nome}, la parola è` : 'La parola d’ordine è'}</div>
          <div className="word">{parola.parola}</div>
          <Deco />
          {parola.nota && <p className="muted" style={{ marginBottom: 0 }}>{parola.nota}</p>}
          <p className="muted small" style={{ marginBottom: 0 }}>Aggiornata il {formatDataOra(parola.aggiornata)}</p>
        </div>
        <p className="center muted small">Sussurrala alla porta. Non condividerla.</p>
        <NotificheCard />
        <div className="center">
          <button className="btn ghost sm" onClick={esci}>
            <LogOut size={14} /> Esci da questo dispositivo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page stack">
      <header className="center">
        <div className="door">
          <DoorClosed size={46} strokeWidth={1.2} />
        </div>
        <div className="eyebrow">Area riservata</div>
        <h1>La parola segreta</h1>
        <Deco />
        <p className="muted">Lascia il tuo nome alla porta e scopri la parola d’ordine per entrare.</p>
      </header>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={modo === 'iscriviti'} onClick={() => { setModo('iscriviti'); setErrore(null); }}>
          Iscriviti
        </button>
        <button role="tab" aria-selected={modo === 'accedi'} onClick={() => { setModo('accedi'); setErrore(null); }}>
          Accedi
        </button>
      </div>

      <form className="card stack" onSubmit={invia} noValidate>
        {modo === 'iscriviti' ? (
          <>
            <div className="grid2">
              <label className="field">
                <span>Nome *</span>
                <input value={f.nome} onChange={set('nome')} autoComplete="given-name" maxLength={60} required />
              </label>
              <label className="field">
                <span>Cognome *</span>
                <input value={f.cognome} onChange={set('cognome')} autoComplete="family-name" maxLength={60} required />
              </label>
            </div>
            <label className="field">
              <span>Telefono *</span>
              <input value={f.telefono} onChange={set('telefono')} type="tel" inputMode="tel" autoComplete="tel" placeholder="333 123 4567" required />
            </label>
            <label className="field">
              <span>Email (facoltativa)</span>
              <input value={f.email} onChange={set('email')} type="email" inputMode="email" autoComplete="email" maxLength={120} />
            </label>
            <label className="check">
              <input type="checkbox" checked={f.privacy} onChange={set('privacy')} />
              <span>
                Ho letto l’<a href="#/privacy">informativa privacy</a> e acconsento al trattamento dei miei dati per l’accesso al locale. *
              </span>
            </label>
            <label className="check">
              <input type="checkbox" checked={f.marketing} onChange={set('marketing')} />
              <span>Voglio ricevere inviti a eventi e promozioni (facoltativo).</span>
            </label>
          </>
        ) : (
          <>
            <p className="muted small" style={{ margin: 0 }}>Sei già iscritto? Inserisci il numero con cui ti sei registrato.</p>
            <label className="field">
              <span>Telefono</span>
              <input value={f.telefono} onChange={set('telefono')} type="tel" inputMode="tel" autoComplete="tel" placeholder="333 123 4567" required />
            </label>
          </>
        )}

        {errore && <div className="msg err" role="alert">{errore}</div>}

        <button className="btn block" type="submit" disabled={busy}>
          {busy ? 'Un momento…' : modo === 'iscriviti' ? 'Iscriviti e scopri la parola' : 'Accedi e scopri la parola'}
        </button>
      </form>
    </div>
  );
}
