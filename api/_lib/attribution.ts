/**
 * Origine del lead (richiesta SEO 12/11, P1-2): ripulisce i dati mandati dal browser
 * (src/lib/attribution.ts) e calcola una "fonte" leggibile, es. "google/organic".
 * Solo dati tecnici: percorsi del sito, nome del dominio di provenienza, UTM.
 */
import { cleanPath } from "./notify";

export type LeadAttribution = {
  landing: string | null; page: string | null; referrer: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_term: string | null; utm_content: string | null;
  click: "gclid" | "fbclid" | null;
  /** servizio dal link verso i contatti, es. "gestione-social" (GS-2) */
  servizio: string | null;
};

const utm = (v: unknown) => (typeof v === "string" ? v.replace(/[^\p{L}\p{N} ._+%-]/gu, "").trim().slice(0, 100) : "") || null;
const host = (v: unknown) => (typeof v === "string" && /^[a-z0-9.-]{1,120}$/i.test(v) ? v.toLowerCase() : null);

export const cleanAttribution = (a: any): LeadAttribution | null => {
  if (!a || typeof a !== "object") return null;
  return {
    landing: cleanPath(a.landing), page: cleanPath(a.page), referrer: host(a.referrer),
    utm_source: utm(a.utm_source), utm_medium: utm(a.utm_medium), utm_campaign: utm(a.utm_campaign),
    utm_term: utm(a.utm_term), utm_content: utm(a.utm_content),
    click: a.click === "gclid" || a.click === "fbclid" ? a.click : null,
    servizio: typeof a.servizio === "string" && /^[a-z0-9-]{1,40}$/.test(a.servizio) ? a.servizio : null,
  };
};

const SEARCH: [RegExp, string][] = [[/(^|\.)google\./, "google"], [/(^|\.)bing\.com$/, "bing"], [/(^|\.)duckduckgo\.com$/, "duckduckgo"], [/(^|\.)yahoo\./, "yahoo"], [/(^|\.)ecosia\.org$/, "ecosia"]];
const SOCIAL: [RegExp, string][] = [[/(^|\.)instagram\.com$/, "instagram"], [/(^|\.)facebook\.com$/, "facebook"], [/(^|\.)linkedin\.com$|^lnkd\.in$/, "linkedin"], [/(^|\.)tiktok\.com$/, "tiktok"], [/^t\.co$|(^|\.)x\.com$|(^|\.)twitter\.com$/, "x"], [/(^|\.)whatsapp\.com$|^wa\.me$/, "whatsapp"]];
const AI: [RegExp, string][] = [[/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, "chatgpt"], [/(^|\.)perplexity\.ai$/, "perplexity"], [/(^|\.)gemini\.google\.com$/, "gemini"], [/(^|\.)copilot\.microsoft\.com$/, "copilot"], [/(^|\.)claude\.ai$/, "claude"]];
const match = (h: string, list: [RegExp, string][]) => list.find(([r]) => r.test(h))?.[1];

/** "sorgente/mezzo" come in GA4: UTM se presenti, poi clic pubblicitario, poi dominio di provenienza. */
export const fonteOf = (a: LeadAttribution | null): string => {
  if (!a) return "(senza consenso)"; // il browser manda la provenienza solo con il consenso ai cookie statistici
  if (a.utm_source) return `${a.utm_source}/${a.utm_medium || "(not set)"}`;
  if (a.click === "gclid") return "google/cpc";
  const h = a.referrer;
  if (a.click === "fbclid") return `${h && match(h, SOCIAL) === "instagram" ? "instagram" : "facebook"}/social`;
  if (!h) return "(direct)/(none)";
  const ai = match(h, AI); if (ai) return `${ai}/ai`;
  const se = match(h, SEARCH); if (se) return `${se}/organic`;
  const so = match(h, SOCIAL); if (so) return `${so}/social`;
  return `${h}/referral`;
};
