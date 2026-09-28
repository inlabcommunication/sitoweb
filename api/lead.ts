/**
 * Vercel Serverless Function: /api/lead
 * Riceve il modulo contatti e salva il lead lato server: il browser non può
 * più scrivere direttamente nel database.
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { clientIp, getAdminDb, isAllowedOrigin, rateLimit, securityHeaders, str } from "./_lib/security";

const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,24}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  securityHeaders(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "Forbidden" });

  const b = req.body || {};

  // Anti-bot: campo nascosto che le persone non compilano, e tempo minimo di compilazione
  const elapsed = Date.now() - Number(b.startedAt || 0);
  if (str(b.website, 200) || !Number.isFinite(elapsed) || elapsed < 3000) {
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
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Lead API error:", e);
    return res.status(500).json({ error: "Errore interno" });
  }
}
