// Invio notifiche push a tutti i dispositivi iscritti (Vercel Serverless Function).
// Richiede la variabile d'ambiente FIREBASE_SERVICE_ACCOUNT (JSON dell'account di servizio).
import type { IncomingMessage, ServerResponse } from 'node:http';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

type Req = IncomingMessage & { body?: unknown; method?: string };
type Res = ServerResponse & { status: (c: number) => Res; json: (b: unknown) => void };

function app() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT mancante');
  return initializeApp({ credential: cert(JSON.parse(raw)) });
}

const testo = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') return res.status(405).json({ errore: 'Metodo non consentito' });

  let a;
  try {
    a = app();
  } catch {
    return res.status(500).json({ errore: 'Notifiche non configurate sul server (FIREBASE_SERVICE_ACCOUNT).' });
  }

  // Solo un admin autenticato può inviare.
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  let uid: string;
  try {
    uid = (await getAuth(a).verifyIdToken(token)).uid;
  } catch {
    return res.status(401).json({ errore: 'Non autenticato' });
  }
  const db = getFirestore(a);
  if (!(await db.doc(`admins/${uid}`).get()).exists) return res.status(403).json({ errore: 'Non autorizzato' });

  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}) as Record<string, unknown>;
  const titolo = testo(body.titolo, 80);
  const messaggio = testo(body.testo, 240);
  const linkGrezzo = testo(body.link, 200) || '/';
  const link = linkGrezzo.startsWith('/') && !linkGrezzo.startsWith('//') ? linkGrezzo : '/';
  if (!titolo) return res.status(400).json({ errore: 'Il titolo è obbligatorio.' });

  const snap = await db.collection('pushTokens').get();
  const tokens = snap.docs.map((d) => d.id);
  let inviate = 0;
  let errori = 0;
  const daRimuovere: string[] = [];

  for (let i = 0; i < tokens.length; i += 500) {
    const gruppo = tokens.slice(i, i + 500);
    const r = await getMessaging(a).sendEachForMulticast({
      tokens: gruppo,
      data: { title: titolo, body: messaggio, link },
      webpush: { headers: { Urgency: 'high', TTL: '86400' } },
    });
    r.responses.forEach((x, j) => {
      if (x.success) return void inviate++;
      errori++;
      const code = x.error?.code || '';
      if (code.includes('registration-token-not-registered') || code.includes('invalid-argument')) daRimuovere.push(gruppo[j]);
    });
  }

  // Pulizia dei dispositivi che hanno disattivato le notifiche.
  for (let i = 0; i < daRimuovere.length; i += 400) {
    const batch = db.batch();
    daRimuovere.slice(i, i + 400).forEach((t) => batch.delete(db.doc(`pushTokens/${t}`)));
    await batch.commit();
  }

  return res.status(200).json({ inviate, errori, dispositivi: tokens.length });
}
