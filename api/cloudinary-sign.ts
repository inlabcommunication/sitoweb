/**
 * Vercel Serverless Function: /api/cloudinary-sign
 * Firma gli upload su Cloudinary SOLO per admin autenticati, così nessun
 * estraneo può caricare file sul vostro account.
 * Richiede CLOUDINARY_API_SECRET (e opzionalmente CLOUDINARY_API_KEY /
 * CLOUDINARY_CLOUD_NAME) nelle variabili d'ambiente di Vercel.
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { createHash } from "node:crypto";
import { isAllowedOrigin, requireAdmin, securityHeaders, str } from "./_lib/security";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  securityHeaders(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "Forbidden" });

  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) return res.status(501).json({ error: "Firma upload non configurata" });
  if (!(await requireAdmin(req))) return res.status(401).json({ error: "Non autorizzato" });

  // File privato da scaricare dopo il modulo (blocco «Presentazione», Paresteta 23/11): tipo "authenticated",
  // senza preset (così nessuna impostazione del preset lo rende pubblico), sempre nella cartella dei documenti
  if (req.body?.privateFile === true) {
    const p: Record<string, string> = { folder: "inlab/documenti", timestamp: String(Math.floor(Date.now() / 1000)), type: "authenticated" };
    const sig = createHash("sha1").update(Object.keys(p).sort().map((k) => `${k}=${p[k]}`).join("&") + secret).digest("hex");
    return res.status(200).json({ ...p, signature: sig });
  }
  const folder = str(req.body?.folder, 80).replace(/[^a-z0-9/_-]/gi, "") || "inlab/generale";
  const context = str(req.body?.context, 200);
  const params: Record<string, string> = {
    folder,
    timestamp: String(Math.floor(Date.now() / 1000)),
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default",
    ...(context ? { context } : {}),
  };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  const signature = createHash("sha1").update(toSign + secret).digest("hex");
  return res.status(200).json({ ...params, signature });
}
