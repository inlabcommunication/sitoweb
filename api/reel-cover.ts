/**
 * Vercel Serverless Function: /api/reel-cover
 * Importa la copertina di un reel Instagram UNA volta e la salva su Cloudinary
 * (decisione di Nicola, 04/10: niente app Meta, niente token). Solo admin, solo
 * dalla dashboard. Il visitatore del sito non fa mai richieste a Instagram:
 * vede solo l'immagine salvata su Cloudinary.
 *
 * Fonte: la pagina pubblica di incorporamento del post
 * (https://www.instagram.com/reel/<codice>/embed/), la stessa che Instagram
 * offre per incorporare il reel. Una sola richiesta per reel, intestazioni
 * oneste che dicono chi siamo, nessun aggiramento dei blocchi. È un metodo
 * "best effort": se Instagram cambia la pagina o blocca la richiesta, la
 * dashboard lo dice e la copertina si carica a mano. Nessun errore sul sito.
 *
 * Interruttore: REEL_COVER_IMPORT=off su Vercel spegne la funzione (vale dal
 * deploy successivo: basta un Redeploy, nessuna modifica al codice).
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { createHash } from "node:crypto";
import { getAdminDb, isAllowedOrigin, rateLimit, requireAdmin, securityHeaders, str } from "./_lib/security";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dp2l14rly";
const CLOUD_KEY = process.env.CLOUDINARY_API_KEY || "189381191389964";
const USER_AGENT = "InLabSite/1.0 (+https://www.inlab-communication.it; copertina del reel per il sito, una volta)";
const MAX_PAGE = 2 * 1024 * 1024;
const MAX_IMAGE = 8 * 1024 * 1024;

/** Tipo e codice del post dal link o dal codice di incorporamento (stesso criterio del sito). */
export function postRef(embed: string): { kind: "reel" | "p"; code: string } | null {
  const m = embed.match(/https:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]{5,40})/i);
  if (!m) return null;
  return { kind: m[1].toLowerCase() === "p" ? "p" : "reel", code: m[2] };
}

/** Solo immagini dai CDN di Meta (mai un URL qualsiasi). */
function metaCdn(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /(^|\.)(cdninstagram\.com|fbcdn\.net)$/i.test(u.hostname);
  } catch { return false; }
}

const decodeHtml = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x2F;|&#47;/g, "/").replace(/&quot;/g, '"');
const decodeJson = (s: string) => s.replace(/\\\//g, "/").replace(/\\u0026/g, "&").replace(/\\u003d/gi, "=");

/** Miniatura dalla pagina di incorporamento: immagine principale, poi display_url nei dati della pagina. */
export function thumbnailFrom(page: string): string | null {
  const img = page.match(/<img[^>]*class="[^"]*EmbeddedMediaImage[^"]*"[^>]*>/i)?.[0];
  const src = img?.match(/\ssrc="([^"]+)"/i)?.[1];
  if (src && metaCdn(decodeHtml(src))) return decodeHtml(src);
  const json = page.match(/\\?"display_url\\?"\s*:\s*\\?"(https:[^"\\]*(?:\\.[^"\\]*)*)/)?.[1];
  const url = json ? decodeJson(json.replace(/\\\\/g, "\\")) : "";
  return url && metaCdn(url) ? url : null;
}

/** Corpo della risposta fino a `max` byte: si legge a pezzi e ci si ferma appena si
 *  supera il limite, anche quando la risposta non dichiara la dimensione (chunked). */
async function readLimited(r: Response, max: number): Promise<Buffer | null> {
  const len = Number(r.headers.get("content-length") || 0);
  if (len > max) { await r.body?.cancel().catch(() => {}); return null; }
  if (!r.body) return null;
  const reader = r.body.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) { await reader.cancel().catch(() => {}); return null; }
    parts.push(value);
  }
  return Buffer.concat(parts);
}

async function uploadToCloudinary(bytes: Buffer, type: string, code: string, secret: string): Promise<string | null> {
  const params: Record<string, string> = {
    folder: "inlab/reel",
    public_id: `reel-${code}`,
    overwrite: "true",
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  const fd = new FormData();
  fd.append("file", new Blob([bytes], { type }), `reel-${code}`);
  for (const [k, v] of Object.entries(params)) fd.append(k, v);
  fd.append("api_key", CLOUD_KEY);
  fd.append("signature", createHash("sha1").update(toSign + secret).digest("hex"));
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd, signal: AbortSignal.timeout(20_000) });
  const data: any = await r.json().catch(() => ({}));
  const url = typeof data?.secure_url === "string" ? data.secure_url : "";
  return r.ok && url.startsWith(`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`) ? url : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  securityHeaders(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "Forbidden" });
  // Prima l'autenticazione: un anonimo non deve sapere se la funzione è accesa o configurata
  const uid = await requireAdmin(req);
  if (!uid) return res.status(401).json({ error: "unauthorized" });
  if (String(process.env.REEL_COVER_IMPORT || "").toLowerCase() === "off") return res.status(503).json({ error: "disabled" });
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) return res.status(501).json({ error: "cloudinary_not_configured" });

  const ref = postRef(str(req.body?.embed, 20_000));
  if (!ref) return res.status(400).json({ error: "bad_link" });

  try {
    if (!(await rateLimit(getAdminDb(), "reelcover", uid, 30, 3600))) return res.status(429).json({ error: "rate_limited" });

    // Una sola richiesta alla pagina di incorporamento; nessun reindirizzamento seguito (es. verso il login)
    const page = await fetch(`https://www.instagram.com/${ref.kind}/${ref.code}/embed/`, {
      redirect: "manual",
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: AbortSignal.timeout(8_000),
    });
    if (page.status !== 200) return res.status(502).json({ error: "blocked" });
    const html = await readLimited(page, MAX_PAGE);
    const src = html ? thumbnailFrom(html.toString("utf8")) : null;
    if (!src) return res.status(404).json({ error: "no_thumbnail" });

    // Nessun reindirizzamento seguito: si accetta solo una risposta 200 diretta dal CDN di Meta
    const img = await fetch(src, { redirect: "manual", headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(8_000) });
    if (img.status !== 200) return res.status(502).json({ error: "image_failed" });
    const type = String(img.headers.get("content-type") || "").split(";")[0].trim();
    if (!/^image\/(jpeg|png|webp)$/.test(type)) return res.status(502).json({ error: "image_failed" });
    const bytes = await readLimited(img, MAX_IMAGE);
    if (!bytes || !bytes.length) return res.status(502).json({ error: "image_failed" });

    const url = await uploadToCloudinary(bytes, type, ref.code, secret);
    if (!url) return res.status(502).json({ error: "upload_failed" });
    return res.status(200).json({ url });
  } catch {
    return res.status(502).json({ error: "blocked" });
  }
}
