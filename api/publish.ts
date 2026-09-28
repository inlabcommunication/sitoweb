/**
 * Vercel Serverless Function: /api/publish
 * Avvia un nuovo deploy del sito (solo admin), così gli articoli pubblicati
 * dalla dashboard entrano subito nell'HTML pre-generato e nella sitemap.
 * Richiede VERCEL_DEPLOY_HOOK_URL nelle variabili d'ambiente di Vercel
 * (Settings → Git → Deploy Hooks).
 */
import type { VercelRequest, VercelResponse } from "./_lib/types";
import { getAdminDb, isAllowedOrigin, rateLimit, requireAdmin, securityHeaders } from "./_lib/security";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  securityHeaders(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: "Forbidden" });

  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook || !/^https:\/\/api\.vercel\.com\//.test(hook)) return res.status(501).json({ error: "Deploy hook non configurato" });
  const uid = await requireAdmin(req);
  if (!uid) return res.status(401).json({ error: "Non autorizzato" });

  try {
    if (!(await rateLimit(getAdminDb(), "publish", uid, 12, 3600))) return res.status(429).json({ error: "Troppe richieste, riprova più tardi" });
    const r = await fetch(hook, { method: "POST" });
    if (!r.ok) return res.status(502).json({ error: "Deploy non avviato" });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Errore server" });
  }
}
