/**
 * Vercel Serverless Function: /api/lead
 * Riceve il modulo contatti e salva il lead lato server: il browser non può
 * più scrivere direttamente nel database.
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { clientIp, getAdminDb, isAllowedOrigin, rateLimit, requireAdmin, safeEqual, securityHeaders, sign, str } from "./_lib/security";
import { getApps } from "firebase-admin/app";
import { notifyNewLead } from "./_lib/notify";

const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,24}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  securityHeaders(res);
  // GET: il server emette un token firmato con l'ora di apertura del modulo,
  // così il tempo di compilazione non dipende da un valore scelto dal browser
  if (req.method === "GET") {
    // Con il login admin: verifica del collegamento per la sezione Lead della
    // dashboard (in quale progetto scrive il server e quanti lead vede).
    // Nessun dato personale: solo ID del progetto, conteggio, data e origine dell'ultimo.
    if (req.headers.authorization) {
      if (!(await requireAdmin(req))) return res.status(401).json({ error: "Non autorizzato" });
      try {
        const db = getAdminDb();
        let project = "";
        try { project = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}").project_id || ""; } catch { /* chiave non leggibile */ }
        project = project || String(getApps()[0]?.options.projectId || process.env.GOOGLE_CLOUD_PROJECT || "");
        const total = (await db.collection("leads").count().get()).data().count;
        const last = await db.collection("leads").orderBy("created_at", "desc").limit(1).get();
        const l = last.docs[0]?.data();
        return res.status(200).json({ project, total, last: l ? { created_at: str(l.created_at, 40), source: str(l.source, 40) } : null });
      } catch (e) {
        console.error("Lead check error:", e);
        return res.status(500).json({ error: "Database del server non raggiungibile" });
      }
    }
    const ts = String(Date.now());
    return res.status(200).json({ token: `${ts}.${sign("lead:" + ts)}` });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "Forbidden" });

  const b = req.body || {};

  // Anti-bot: campo nascosto che le persone non compilano, e tempo minimo di
  // compilazione misurato dal token firmato (min 3 secondi, max 24 ore)
  const [ts = "", mac = ""] = str(b.formToken, 80).split(".");
  const elapsed = Date.now() - Number(ts);
  const validToken = /^\d{13}$/.test(ts) && safeEqual(mac, sign("lead:" + ts));
  if (str(b.website, 200) || !validToken || !Number.isFinite(elapsed) || elapsed < 3000 || elapsed > 86_400_000) {
    return res.status(200).json({ ok: true }); // risposta neutra: il bot non capisce di essere stato scartato
  }

  const lead = {
    name: str(b.name, 100),
    email: str(b.email, 254).toLowerCase(),
    phone: str(b.phone, 30).replace(/[^\d+ ().-]/g, "") || null,
    company: str(b.company, 120) || null,
    service: str(b.service, 80),
    message: str(b.message, 3000),
  };
  if (!lead.name || !lead.message || !EMAIL_RE.test(lead.email) || b.privacy !== true) {
    return res.status(400).json({ error: "Dati non validi" });
  }

  try {
    const db = getAdminDb();
    if (!(await rateLimit(db, "lead", clientIp(req), 5, 3600))) {
      return res.status(429).json({ error: "Troppi invii. Riprova più tardi." });
    }
    await db.collection("leads").add({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      intent: lead.service ? `[FORM] ${lead.service}` : "[FORM] Contatto dal sito",
      source: "contact_form",
      status: "new",
      notes: lead.message,
      created_at: new Date().toISOString(),
    });
    // Avviso su Telegram, email e push (il lead è già salvato: un errore qui non cambia la risposta)
    await notifyNewLead(db, {
      source: "contact_form", name: lead.name, email: lead.email, phone: lead.phone,
      company: lead.company, intent: lead.service || "Contatto dal sito", message: lead.message,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Lead API error:", e);
    return res.status(500).json({ error: "Errore interno" });
  }
}
