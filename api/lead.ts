/**
 * Vercel Serverless Function: /api/lead
 * Riceve il modulo contatti e salva il lead lato server: il browser non può
 * più scrivere direttamente nel database.
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { ipKey, dailyCap, getAdminDb, hashKey, isAllowedOrigin, rateLimit, requireAdmin, safeEqual, securityHeaders, sign, str } from "./_lib/security";
import { getApps } from "firebase-admin/app";
import { FieldValue } from "firebase-admin/firestore";
import { cleanPath, notifyLeadCapped } from "./_lib/notify";
import { cleanAttribution, fonteOf } from "./_lib/attribution";
import { createHash } from "node:crypto";

// "Come ci hai conosciuto?" (GS-3, Nicola 23/11): solo queste voci, uguali a quelle del modulo in src/App.tsx
const HOW_FOUND = new Set(["Passaparola", "Ho visto un vostro lavoro sui social di un cliente", "Instagram o Facebook di InLab", "Ricerca su Google", "ChatGPT o altre AI", "Altro"]);

/** Tetto giornaliero globale dei lead salvati (audit 24/11, P2): oltre, niente scritture e i contatti diretti */
const LEAD_DAILY_CAP = 200;
const CONTACT_FALLBACK = "Non riusciamo a salvare la richiesta in questo momento: scrivici a inlab.communication@gmail.com o chiama il +39 329 565 4319.";

/** Solo codice e messaggio dell'errore nel log, mai i dati del lead */
const dbError = (e: any) => `${e?.code ?? ""} ${String(e?.message ?? e).slice(0, 200)}`.trim();

const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,24}$/i;

/** Tetto giornaliero per istanza alle scritture del contatore degli scarti (il numero in dashboard è «almeno N») */
const TRAP_MAX_PER_DAY = 50;
let trapDay = "", trapCount = 0;
function trapBudget(): boolean {
  const day = new Date().toISOString().slice(0, 10);
  if (day !== trapDay) { trapDay = day; trapCount = 0; }
  return ++trapCount <= TRAP_MAX_PER_DAY;
}

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

/** «Pass» di download (Nicola 23/11): chi ha già lasciato i dati riscarica il documento senza rifare il
 *  modulo. Firmato dal server, legato al caso, scade dopo 90 giorni; nessun dato personale dentro.
 *  Formato: v1.{caso}.{scadenza in secondi}.{firma} */
const PASS_DAYS = 90;
function issuePass(caseId: string): string {
  const exp = Math.floor(Date.now() / 1000) + PASS_DAYS * 86_400;
  return `v1.${caseId}.${exp}.${sign(`dlpass:${caseId}:${exp}`)}`;
}
function passValid(pass: string, caseId: string): boolean {
  const m = /^v1\.([a-z0-9-]{1,80})\.(\d{10})\.([A-Za-z0-9_-]{32})$/i.exec(pass);
  if (!m || m[1] !== caseId) return false;
  const exp = Number(m[2]);
  return exp > Date.now() / 1000 && safeEqual(m[3], sign(`dlpass:${caseId}:${exp}`));
}

/** Blocco «Presentazione» con file del caso (dati della dashboard: app/site_content); le bozze solo per la prova dell'admin */
async function findPresentation(db: ReturnType<typeof getAdminDb>, caseId: string, allowDraft = false) {
  const snap = await db.doc("app/site_content").get();
  const cs = ((snap.data()?.cases?.items || []) as any[]).find((c) => c?.id === caseId);
  if (!cs || (cs.published === false && !allowDraft)) return null;
  const block = ((cs.blocks || []) as any[]).find((x) => x?.type === "presentation" && (x.published === true || allowDraft) && typeof x?.file?.publicId === "string" && x.file.publicId);
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
          if (!url) return res.status(501).json({ error: "Manca CLOUDINARY_API_SECRET su Vercel" });
          // Prova del link dal server (solo per l'admin): Cloudinary risponde con lo stato e, se rifiuta,
          // con il motivo nell'intestazione x-cld-error (nessun segreto). Si legge solo il primo byte.
          let probe: { status: number; error: string } = { status: 0, error: "" };
          try {
            const r = await fetch(url, { headers: { Range: "bytes=0-0" }, signal: AbortSignal.timeout(8000) });
            probe = { status: r.status, error: str(r.headers.get("x-cld-error"), 300) };
            await r.body?.cancel().catch(() => {});
          } catch (e: any) { probe = { status: 0, error: e?.name === "TimeoutError" ? "Cloudinary non risponde (timeout 8 s)" : "Cloudinary non raggiungibile" }; }
          return res.status(200).json({ url, probe });
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
        // invii scartati dagli ultimi 7 giorni (solo numeri), per vedere se il campo trappola blocca persone vere
        const days = Array.from({ length: 7 }, (_, i) => new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10));
        const snaps = await db.getAll(...days.map((d) => db.collection("_usage").doc(`lead_scartati_${d}`)));
        const discarded = { trappola_token_valido: 0 };
        for (const s of snaps) for (const k of Object.keys(discarded) as (keyof typeof discarded)[]) discarded[k] += Number(s.data()?.[k] || 0);
        return res.status(200).json({ project, total, last: l ? { created_at: str(l.created_at, 40), source: str(l.source, 40) } : null, discarded });
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

  // Nuovo download con il pass: nessun dato personale, nessun lead, solo un nuovo link di 10 minuti
  if (b.download && typeof b.pass === "string") {
    const caseId = str(b.download?.caseId, 80).replace(/[^a-z0-9-]/gi, "");
    const pass = str(b.pass, 200);
    if (!caseId || !passValid(pass, caseId)) return res.status(403).json({ error: "pass" });
    try {
      const db = getAdminDb();
      if (!(await rateLimit(db, "dlpass_ip", ipKey(req), 20, 3600)) || !(await rateLimit(db, "dlpass", hashKey(pass), 10, 3600))) {
        return res.status(429).json({ error: "Troppe richieste. Riprova più tardi." });
      }
      const doc = await findPresentation(db, caseId);
      if (!doc) return res.status(404).json({ error: "Documento non disponibile" });
      return res.status(200).json({ ok: true, url: signedDownload(doc.publicId) });
    } catch (e) {
      console.error("Download pass error:", dbError(e));
      return res.status(503).json({ error: CONTACT_FALLBACK });
    }
  }

  // Anti-bot: campo nascosto che le persone non compilano, e tempo minimo di
  // compilazione misurato dal token firmato (min 3 secondi, max 24 ore)
  const [ts = "", mac = ""] = str(b.formToken, 80).split(".");
  const elapsed = Date.now() - Number(ts);
  const validToken = /^\d{13}$/.test(ts) && safeEqual(mac, sign("lead:" + ts));
  const trap = !!str(b.website, 200);
  if (trap || !validToken || !Number.isFinite(elapsed) || elapsed < 3000 || elapsed > 86_400_000) {
    // Scarto contato e registrato senza dati personali (Direttore 23/11): se il campo trappola si riempie
    // spesso con token valido, è la compilazione automatica di un browser e si perdono lead veri.
    const reason = trap ? (validToken && elapsed >= 3000 ? "trappola_token_valido" : "trappola") : "token";
    console.warn(`[lead] invio scartato: ${reason}${b.download ? " (download)" : ""}`);
    // Contatore nel database SOLO per «campo pieno con tempi da persona» (possibile autocompilazione, cioè
    // lead veri persi), con un tetto in memoria per istanza: oltre il tetto solo log. Gli altri scarti solo
    // nel log. Così un attacco non consuma la quota di scritture di Firestore (analista 23/11).
    if (reason === "trappola_token_valido" && trapBudget()) try {
      const day = new Date().toISOString().slice(0, 10);
      await getAdminDb().collection("_usage").doc(`lead_scartati_${day}`).set({ day, [reason]: FieldValue.increment(1) }, { merge: true });
    } catch { /* il contatore non deve mai cambiare la risposta */ }
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
    if (!(await rateLimit(db, "lead", ipKey(req), 5, 3600))) {
      return res.status(429).json({ error: "Troppi invii. Riprova più tardi." });
    }
    if (!(await dailyCap(db, "lead_create", LEAD_DAILY_CAP))) {
      console.warn("[lead] tetto giornaliero dei lead raggiunto");
      return res.status(429).json({ error: CONTACT_FALLBACK });
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
      return res.status(200).json({ ok: true, url: signedDownload(doc.publicId), pass: issuePass(downloadCase) });
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
    // Database non raggiungibile (es. quota esaurita): il lead non si può salvare, quindi la risposta
    // dà subito email e telefono di InLab (audit 24/11, P2). Nel log solo codice e messaggio dell'errore.
    console.error("Lead API error:", dbError(e));
    return res.status(503).json({ error: CONTACT_FALLBACK });
  }
}
