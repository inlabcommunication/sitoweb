import { Bell, BellOff, BellRing } from 'lucide-react';
import { useState } from 'react';
import { attivaNotifiche, isIOS, isStandalone, messaggioPush, statoNotifiche } from '../lib/push';

/** Pulsante/scheda per attivare le notifiche push. */
export function NotificheCard() {
  const [stato, setStato] = useState(statoNotifiche);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const iosDaInstallare = isIOS() && !isStandalone();

  async function attiva() {
    setBusy(true);
    const r = await attivaNotifiche();
    setMsg(messaggioPush[r]);
    setStato(statoNotifiche());
    setBusy(false);
  }

  return (
    <div className="card stack">
      <div className="row">
        {stato === 'attive' ? <BellRing size={22} color="var(--gold)" /> : stato === 'negate' ? <BellOff size={22} color="var(--muted)" /> : <Bell size={22} color="var(--gold)" />}
        <h3>Notifiche</h3>
      </div>
      {iosDaInstallare ? (
        <p className="muted small" style={{ margin: 0 }}>
          Su iPhone: tocca <strong>Condividi</strong> → <strong>Aggiungi alla schermata Home</strong>, apri Drinkave dall’icona e
          attiva qui le notifiche.
        </p>
      ) : stato === 'attive' ? (
        <p className="muted small" style={{ margin: 0 }}>Sei nella lista: riceverai eventi, serate speciali e la nuova parola d’ordine.</p>
      ) : stato === 'negate' ? (
        <p className="muted small" style={{ margin: 0 }}>{messaggioPush.negate}</p>
      ) : stato === 'non-supportate' ? (
        <p className="muted small" style={{ margin: 0 }}>{messaggioPush['non-supportate']}</p>
      ) : (
        <>
          <p className="muted small" style={{ margin: 0 }}>Ricevi un avviso per eventi, serate speciali e quando cambia la parola d’ordine.</p>
          <button className="btn" onClick={attiva} disabled={busy}>
            <Bell size={16} /> Attiva notifiche
          </button>
        </>
      )}
      {msg && stato !== 'da-chiedere' && <div className="msg info">{msg}</div>}
    </div>
  );
}
