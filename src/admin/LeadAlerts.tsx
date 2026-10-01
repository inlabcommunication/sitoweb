import { useEffect, useState } from 'react';
import { Bell, BellOff, Send } from 'lucide-react';
import { auth } from '../lib/firebase';

// Pannello "Avvisi lead" (sezione Lead): stato di Telegram, email e push,
// attivazione delle notifiche push su questo dispositivo e avviso di prova.

type Status = { channels: { telegram: boolean; email: boolean; push: boolean }; devices: number; vapidPublicKey: string | null };
type Result = { channel: 'telegram' | 'email' | 'push'; ok: boolean; detail?: string };

const CHANNEL_LABEL = { telegram: 'Telegram', email: 'Email', push: 'Push dashboard' } as const;
const SW_URL = '/admin-sw.js';

const api = async (method: 'GET' | 'POST', body?: unknown) => {
  const token = await auth?.currentUser?.getIdToken();
  const r = await fetch('/api/notify', {
    method,
    headers: { Authorization: `Bearer ${token || ''}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
  return d;
};

const keyToBytes = (base64: string) => {
  const b = atob((base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};

const pushSupported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = () => window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone === true;

export const LeadAlerts = () => {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [message, setMessage] = useState('');

  const refresh = async () => {
    try { setStatus(await api('GET')); setError(''); } catch (e: any) { setError(e.message); }
    if (pushSupported()) {
      const reg = await navigator.serviceWorker.getRegistration('/admin').catch(() => undefined);
      setSubscribed(!!(await reg?.pushManager.getSubscription().catch(() => null)));
    }
  };
  useEffect(() => { refresh(); }, []);

  const enable = async () => {
    setBusy(true); setMessage('');
    try {
      if (!status?.vapidPublicKey) throw new Error('Push non configurate sul server (VAPID_PUBLIC_KEY mancante).');
      if (await Notification.requestPermission() !== 'granted') throw new Error('Permesso negato: abilita le notifiche per questo sito nelle impostazioni del browser.');
      const reg = await navigator.serviceWorker.register(SW_URL, { scope: '/admin' });
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription() || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(status.vapidPublicKey) });
      await api('POST', { action: 'subscribe', subscription: sub.toJSON() });
      setMessage('Notifiche attivate su questo dispositivo.');
    } catch (e: any) {
      setMessage(e.message || 'Attivazione non riuscita');
    } finally {
      setBusy(false); refresh();
    }
  };

  const disable = async () => {
    setBusy(true); setMessage('');
    try {
      const reg = await navigator.serviceWorker.getRegistration('/admin');
      const sub = await reg?.pushManager.getSubscription();
      if (sub) { await api('POST', { action: 'unsubscribe', endpoint: sub.endpoint }); await sub.unsubscribe(); }
      setMessage('Notifiche disattivate su questo dispositivo.');
    } catch (e: any) {
      setMessage(e.message || 'Disattivazione non riuscita');
    } finally {
      setBusy(false); refresh();
    }
  };

  const test = async () => {
    setBusy(true); setMessage(''); setResults(null);
    try {
      const d = await api('POST', { action: 'test' });
      setResults(d.results || []);
      if (!d.results?.length) setMessage('Nessun canale configurato su Vercel.');
    } catch (e: any) {
      setMessage(e.message || 'Prova non riuscita');
    } finally {
      setBusy(false);
    }
  };

  const iosHint = isIos() && !isStandalone();

  return (
    <div style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 14, fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div className="section-label" style={{ marginBottom: 6 }}>Avvisi nuove lead</div>
          {error ? <span style={{ color: '#ffb4b4' }}>Stato non disponibile: {error}</span> : status && (
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {(Object.keys(CHANNEL_LABEL) as (keyof typeof CHANNEL_LABEL)[]).map((c) => (
                <span key={c} style={{ color: status.channels[c] ? '#a3e4a3' : 'var(--m)' }}>
                  {status.channels[c] ? '●' : '○'} {CHANNEL_LABEL[c]}{c === 'push' && status.channels.push ? ` (${status.devices} dispositivi)` : ''}{!status.channels[c] ? ' — non configurato' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {pushSupported() && !iosHint && (subscribed
            ? <button onClick={disable} disabled={busy} className="btn btn-g"><BellOff size={14} /> Disattiva su questo dispositivo</button>
            : <button onClick={enable} disabled={busy || !status?.channels.push} className="btn btn-p" style={{ opacity: status?.channels.push ? 1 : 0.4 }}><Bell size={14} /> Attiva notifiche qui</button>)}
          <button onClick={test} disabled={busy} className="btn btn-g"><Send size={14} /> Invia prova</button>
        </div>
      </div>
      {iosHint && <div style={{ marginTop: 8, color: 'var(--m)' }}>Su iPhone le notifiche funzionano solo dall'app: tocca <b>Condividi → Aggiungi alla schermata Home</b>, apri InLab Admin dalla Home ed entra qui.</div>}
      {!pushSupported() && !iosHint && <div style={{ marginTop: 8, color: 'var(--m)' }}>Questo browser non supporta le notifiche push.</div>}
      {message && <div role="status" style={{ marginTop: 8 }}>{message}</div>}
      {results && results.length > 0 && (
        <div role="status" style={{ marginTop: 8, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {results.map((r) => <span key={r.channel} style={{ color: r.ok ? '#a3e4a3' : '#ffb4b4' }}>{r.ok ? '✓' : '✗'} {CHANNEL_LABEL[r.channel]}{r.detail ? ` (${r.detail})` : ''}</span>)}
        </div>
      )}
    </div>
  );
};
