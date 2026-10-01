/**
 * Vercel Serverless Function: /api/notify
 * Avvisi per i nuovi lead, gestiti dalla sezione Lead della dashboard (solo admin):
 * - GET: canali configurati, numero di dispositivi e chiave pubblica per le push
 * - POST { action: "subscribe", subscription }: attiva le push su questo dispositivo
 * - POST { action: "unsubscribe", endpoint }: le disattiva
 * - POST { action: "test" }: invia un avviso di prova su tutti i canali
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { getAdminDb, isAllowedOrigin, requireAdmin, securityHeaders, str } from "./_lib/security";
import { PUSH_COLLECTION, channelsConfigured, notifyNewLead, pushDocId } from "./_lib/notify";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  securityHeaders(res);
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (req.method === "POST" && !isAllowedOrigin(req)) return res.status(403).json({ error: "Forbidden" });
  const uid = await requireAdmin(req);
  if (!uid) return res.status(401).json({ error: "Non autorizzato" });

  try {
    const db = getAdminDb();
    if (req.method === "GET") {
      const devices = (await db.collection(PUSH_COLLECTION).count().get()).data().count;
      return res.status(200).json({ channels: channelsConfigured(), devices, vapidPublicKey: process.env.VAPID_PUBLIC_KEY || null });
    }

    const b = req.body || {};
    if (b.action === "subscribe") {
      const s = b.subscription || {};
      const endpoint = str(s.endpoint, 1000);
      const keys = { p256dh: str(s.keys?.p256dh, 200), auth: str(s.keys?.auth, 100) };
      // Solo endpoint https dei servizi push dei browser
      if (!/^https:\/\/[^\s]+$/.test(endpoint) || !keys.p256dh || !keys.auth) return res.status(400).json({ error: "Iscrizione non valida" });
      await db.collection(PUSH_COLLECTION).doc(pushDocId(endpoint)).set({
        endpoint, keys, uid,
        device: str(req.headers["user-agent"], 200),
        created_at: new Date().toISOString(),
      });
      return res.status(200).json({ ok: true });
    }
    if (b.action === "unsubscribe") {
      const endpoint = str(b.endpoint, 1000);
      if (endpoint) await db.collection(PUSH_COLLECTION).doc(pushDocId(endpoint)).delete();
      return res.status(200).json({ ok: true });
    }
    if (b.action === "test") {
      const results = await notifyNewLead(db, {
        source: "test", name: "Mario Rossi (prova)", email: "mario.rossi@example.com",
        intent: "[FORM] Siti web", message: "Questo è un avviso di prova inviato dalla dashboard.",
      });
      return res.status(200).json({ results });
    }
    return res.status(400).json({ error: "Azione non valida" });
  } catch (e) {
    console.error("Notify API error:", e);
    return res.status(500).json({ error: "Errore interno" });
  }
}
