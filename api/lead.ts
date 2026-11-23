/**
 * Vercel Serverless Function: /api/lead
 * Riceve il modulo contatti e salva il lead lato server: il browser non può
 * più scrivere direttamente nel database.
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { clientIp, getAdminDb, isAllowedOrigin, rateLimit, requireAdmin, safeEqual, securityHeaders, sign, str } from "./_lib/security";
import { getApps } from "firebase-admin/app";
import { cleanPath, notifyLeadCapped } from "./_lib/notify";
import { cleanAttribution, fonteOf } from "./_lib/attribution";
import { createHash } from "node:crypto";

// "Come ci hai conosciuto?" (GS-3, Nicola 23/11): solo queste voci, uguali a quelle del modulo in src/App.tsx
const HOW_FOUND = new Set(["Passaparola", "Ho visto un vostro lavoro sui social di un cliente", "Instagram o Facebook di InLab", "Ricerca su Google", "ChatGPT o altre AI", "Altro"]);

const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,24}$/i;

/** Link di download firmato per un file privato ("authenticated", raw) di Cloudinary, valido 10 minuti.
 *  Il file non passa da questa funzione (nessun limite di 4,5 MB). Vuoto se manca la chiave segreta. */
function signedDownload(publicId: string): string {
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret || !publicId) return "";
  const cloud = process.env.CLOUDINARY_CLOUD_NAME || "dp2l14rly";
  const key = process.env.CLOUDINARY_API_KEY || "189381191389964";
  const now = Math.floor(Date.now() / 1000);
  const p: Record<string, string> = { attachment: "true", expires_at: String(now + 600), public_id: publicId, timestamp: String(now), type: "authenticated" };
  const signature = createHash("sha1").update(Object.keys(p).sort().map((k) => `${k}=${p[k]}`).join("&") + secret).digest("hex");
  const qs = new URLSearchParams({ ...p, api_key: key, signature }).toString();
  return `https://api.cloudinary.com/v1_1/${cloud}/raw/download?${qs}`;
}

/** Blocco «Presentazione» con file del caso (dati della dashboard: app/site_content); le bozze solo per la prova dell'admin */
async function findPresentation(db: ReturnType<typeof getAdminDb>, caseId: string, allowDraft = false) {
  const snap = await db.doc("app/site_content").get();
  const cs = ((snap.data()?.cases?.items || []) as any[]).find((c) => c?.id === caseId);
  if (!cs || (cs.published === false && !allowDraft)) return null;
  const block = ((cs.blocks || []) as any[]).find((x) => x?.type === "presentation" && typeof x?.file?.publicId === "string" && x.file.publicId);
  return block ? { client: str(cs.client, 80), publicId: str(block.file.publicId, 200) } : null;
}

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
      // Prova del download dalla dashboard (anche con il caso in bozza): nessun lead salvato
      const testCase = str(req.query?.download, 80).replace(/[^a-z0-9-]/gi, "");
      if (testCase) {
        try {
          const doc = await findPresentation(getAdminDb(), testCase, true);
          if (!doc) return res.status(404).json({ error: "Nessun PDF salvato in questo caso: salva le modifiche e riprova." });
          const url = signedDownload(doc.publicId);
          return url ? res.status(200).json({ url }) : res.status(501).json({ error: "Manca CLOUDINARY_API_SECRET su Vercel" });
        } catch (e) {
          console.error("Download test error:", e);
          return res.status(500).json({ error: "Database del server non raggiungibile" });
        }
      }
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
    come_ci_hai_conosciuto: HOW_FOUND.has(str(b.howFound, 80)) ? str(b.howFound, 80) : null,
    message: str(b.message, 3000),
    page: cleanPath(b.page),
  };
  // Da dove arriva la visita (P1-2): prima pagina, provenienza, UTM
  const attribution = cleanAttribution(b.attribution);
  const fonte = fonteOf(attribution);
  if (attribution?.page) lead.page = attribution.page;
  // Download di una presentazione dei casi studio (Paresteta, 23/11): niente messaggio, solo nome, email,
  // azienda facoltativa e informativa. Il caso deve esistere, essere pubblicato e avere il file.
  const downloadCase = b.download ? str(b.download?.caseId, 80).replace(/[^a-z0-9-]/gi, "") : "";
  if (b.download && !downloadCase) return res.status(400).json({ error: "Dati non validi" });
  if (!lead.name || (!downloadCase && !lead.message) || !EMAIL_RE.test(lead.email) || b.privacy !== true) {
    return res.status(400).json({ error: "Dati non validi" });
  }

  try {
    const db = getAdminDb();
    if (!(await rateLimit(db, "lead", clientIp(req), 5, 3600))) {
      return res.status(429).json({ error: "Troppi invii. Riprova più tardi." });
    }
    if (downloadCase) {
      const doc = await findPresentation(db, downloadCase);
      if (!doc) return res.status(404).json({ error: "Documento non disponibile" });
      const tag = `download-presentazione-${downloadCase}`;
      await db.collection("leads").add({
        name: lead.name,
        email: lead.email,
        phone: null,
        company: lead.company,
        intent: `[DOWNLOAD] Presentazione ${doc.client}`,
        source: "download",
        download: tag,
        status: "new",
        notes: null,
        page: lead.page,
        attribution, fonte,
        created_at: new Date().toISOString(),
      });
      await notifyLeadCapped(db, { source: "contact_form", name: lead.name, email: lead.email, company: lead.company, service: `Download: ${tag}`, page: lead.page, fonte, landing: attribution?.landing });
      return res.status(200).json({ ok: true, url: signedDownload(doc.publicId) });
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
      page: lead.page,
      come_ci_hai_conosciuto: lead.come_ci_hai_conosciuto,
      attribution, fonte,
      created_at: new Date().toISOString(),
    });
    // Notifica immediata a InLab (P0-1): non blocca né cambia la risposta se fallisce
    await notifyLeadCapped(db, { source: "contact_form", ...lead, fonte, landing: attribution?.landing });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Lead API error:", e);
    return res.status(500).json({ error: "Errore interno" });
  }
}
