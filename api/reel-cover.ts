/**
 * Vercel Serverless Function: /api/reel-cover
 * Importa la copertina di un reel Instagram UNA volta e la salva su Cloudinary
 * (richiesta di Nicola, 04/10). Solo admin. Il visitatore del sito non fa mai
 * richieste a Meta: vede solo l'immagine salvata su Cloudinary.
 *
 * Strada ufficiale: Instagram Graph API "Business Discovery" (l'account
 * professionale di InLab legge i media pubblici di un account Business/Creator).
 * Niente scraping delle pagine di Instagram. Niente oEmbed: dal 3/11/2025 Meta
 * non restituisce più la miniatura.
 *
 * Variabili d'ambiente su Vercel (mai nel repository):
 *   META_IG_TOKEN    token con instagram_basic, pages_show_list, pages_read_engagement
 *   META_IG_USER_ID  ID dell'account Instagram professionale di InLab
 *   CLOUDINARY_API_SECRET (già presente per gli upload della dashboard)
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { createHash } from "node:crypto";
import { getAdminDb, isAllowedOrigin, rateLimit, requireAdmin, securityHeaders, str } from "./_lib/security";

const GRAPH = "https://graph.facebook.com/v23.0";
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dp2l14rly";
const CLOUD_KEY = process.env.CLOUDINARY_API_KEY || "189381191389964";
/** Media del cliente da sfogliare al massimo per trovare il reel (4 pagine da 50). */
const MAX_PAGES = 4;
const MAX_BYTES = 8 * 1024 * 1024;

/** Codice del post dal link o dal codice di incorporamento (stesso criterio del sito). */
export function postCode(embed: string): string | null {
  const m = embed.match(/https:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(?:reels?|p|tv)\/([\w-]{5,40})/i);
  return m ? m[1] : null;
}

const RESERVED = new Set(["reel", "reels", "p", "tv", "explore", "stories", "accounts", "about", "developer", "legal"]);

/** Username del proprietario: "(@nome)" del codice di incorporamento o instagram.com/nome/reel/… */
export function postAccount(embed: string): string | null {
  const a = embed.match(/\(@([A-Za-z0-9._]{1,30})\)/);
  if (a) return a[1].toLowerCase();
  const b = embed.match(/instagram\.com\/([A-Za-z0-9._]{1,30})\/(?:reels?|p|tv)\//i);
  if (b && !RESERVED.has(b[1].toLowerCase())) return b[1].toLowerCase();
  return null;
}

/** Solo immagini dai CDN di Meta (mai un URL qualsiasi). */
function metaCdn(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /(^|\.)(cdninstagram\.com|fbcdn\.net)$/i.test(u.hostname);
  } catch { return false; }
}

type Media = { permalink?: string; media_type?: string; thumbnail_url?: string; media_url?: string };

async function findMedia(user: string, account: string, code: string, token: string): Promise<{ media?: Media; error?: string; status?: number }> {
  let after = "";
  for (let page = 0; page < MAX_PAGES; page++) {
    const media = `media${after ? `.after(${after})` : ""}.limit(50){permalink,media_type,thumbnail_url,media_url}`;
    const url = `${GRAPH}/${encodeURIComponent(user)}?fields=${encodeURIComponent(`business_discovery.username(${account}){${media}}`)}&access_token=${encodeURIComponent(token)}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok || data.error) {
      const code190 = data?.error?.code === 190;
      // 190: token scaduto o revocato. Il resto (account non professionale, permessi…) è "non disponibile".
      return code190 ? { error: "token_expired", status: 502 } : { error: "not_available", status: 404 };
    }
    const block = data?.business_discovery?.media;
    const found = (block?.data as Media[] | undefined)?.find((m) => (m.permalink || "").includes(`/${code}/`));
    if (found) return { media: found };
    after = block?.paging?.cursors?.after || "";
    if (!after || !/^[\w=-]+$/.test(after)) break;
  }
  return { error: "not_found", status: 404 };
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

  const token = process.env.META_IG_TOKEN;
  const user = process.env.META_IG_USER_ID;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!token || !user || !/^\d{5,30}$/.test(user)) return res.status(501).json({ error: "not_configured" });
  if (!secret) return res.status(501).json({ error: "cloudinary_not_configured" });
  const uid = await requireAdmin(req);
  if (!uid) return res.status(401).json({ error: "unauthorized" });

  const embed = str(req.body?.embed, 20_000);
  const code = postCode(embed);
  if (!code) return res.status(400).json({ error: "bad_link" });
  const given = str(req.body?.account, 40).replace(/^@/, "").toLowerCase();
  const account = /^[a-z0-9._]{1,30}$/.test(given) ? given : postAccount(embed);
  if (!account) return res.status(400).json({ error: "no_account" });

  try {
    if (!(await rateLimit(getAdminDb(), "reelcover", uid, 60, 3600))) return res.status(429).json({ error: "rate_limited" });

    const found = await findMedia(user, account, code, token);
    if (!found.media) return res.status(found.status || 404).json({ error: found.error || "not_found" });
    const src = found.media.media_type === "VIDEO" ? found.media.thumbnail_url : (found.media.thumbnail_url || found.media.media_url);
    if (!src || !metaCdn(src)) return res.status(404).json({ error: "no_thumbnail" });

    const img = await fetch(src, { signal: AbortSignal.timeout(10_000) });
    // anche dopo eventuali reindirizzamenti si accettano solo i CDN di Meta
    if (!metaCdn(img.url || src)) return res.status(502).json({ error: "image_failed" });
    const type = String(img.headers.get("content-type") || "").split(";")[0].trim();
    if (!img.ok || !/^image\/(jpeg|png|webp)$/.test(type)) return res.status(502).json({ error: "image_failed" });
    const bytes = Buffer.from(await img.arrayBuffer());
    if (!bytes.length || bytes.length > MAX_BYTES) return res.status(502).json({ error: "image_failed" });

    const url = await uploadToCloudinary(bytes, type, code, secret);
    if (!url) return res.status(502).json({ error: "upload_failed" });
    return res.status(200).json({ url });
  } catch {
    return res.status(502).json({ error: "meta_unreachable" });
  }
}
