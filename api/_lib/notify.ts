/**
 * Notifica immediata di un nuovo lead per email (richiesta SEO 12/11, P0-1).
 *
 * Canale: email transazionale con Resend (API HTTPS, nessuna libreria in più).
 * Variabili d'ambiente su Vercel:
 * - RESEND_API_KEY   chiave dell'account Resend (obbligatoria: senza, nessun invio)
 * - LEAD_NOTIFY_TO   destinatario (predefinito: l'email aziendale pubblicata sul sito)
 * - LEAD_NOTIFY_FROM mittente (predefinito: l'indirizzo di prova di Resend, che può
 *                    scrivere solo all'email del proprietario dell'account Resend)
 *
 * Non blocca mai il salvataggio del lead: errori e tempi lunghi finiscono nel log,
 * senza dati personali, e la risposta al visitatore non cambia.

 * Tetto giornaliero (proposta analista 12/11): al massimo LEAD_NOTIFY_DAILY_MAX email al
 * giorno (predefinito 50). Oltre, il lead si salva lo stesso e si salta solo l'email:
 * un abuso da molti IP non riempie la casella né consuma la quota del fornitore.
 */
import type { Firestore } from "firebase-admin/firestore";
import { dailyCap } from "./security";

export type LeadNotice = {
  source: "contact_form" | "chatbot";
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  message?: string | null;
  /** pagina in cui è stato compilato il modulo o aperta la chat */
  page?: string | null;
  /** origine della visita, es. "google/organic" (P1-2) */
  fonte?: string | null;
  /** prima pagina vista nella visita (P1-2) */
  landing?: string | null;
};

const DEFAULT_TO = "inlab.communication@gmail.com";
const DEFAULT_FROM = "InLab sito <onboarding@resend.dev>";
const SITE = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://www.inlab-communication.it").replace(/\/+$/, "");

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const oneLine = (s: string, max: number) => s.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

export async function notifyLead(l: LeadNotice): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn("[lead-notify] RESEND_API_KEY assente: notifica non inviata"); return; }
  const to = process.env.LEAD_NOTIFY_TO || DEFAULT_TO;
  const from = process.env.LEAD_NOTIFY_FROM || DEFAULT_FROM;

  const who = oneLine(l.name || l.email || l.phone || "contatto senza nome", 80);
  const origin = l.source === "chatbot" ? "chatbot" : "modulo contatti";
  const subject = `Nuovo lead dal ${origin}: ${who}${l.service ? ` — ${oneLine(l.service, 60)}` : ""}`;
  const rows: [string, string | null | undefined][] = [
    ["Nome", l.name], ["Email", l.email], ["Telefono", l.phone], ["Azienda", l.company],
    ["Servizio", l.service], ["Pagina", l.page ? SITE + l.page : null], ["Fonte", l.fonte],
    ["Prima pagina vista", l.landing ? SITE + l.landing : null],
  ];
  const filled = rows.filter(([, v]) => v).map(([k, v]) => [k, oneLine(String(v), 300)] as const);
  const message = (l.message || "").slice(0, 3000);
  const text = [
    `Nuovo lead dal ${origin}.`, "",
    ...filled.map(([k, v]) => `${k}: ${v}`),
    ...(message ? ["", "Messaggio:", message] : []),
    "", `Dashboard: ${SITE}/admin`,
  ].join("\n");
  const html = `<p>Nuovo lead dal <b>${origin}</b>.</p><table cellpadding="4">${
    filled.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(String(v))}</td></tr>`).join("")
  }</table>${message ? `<p><b>Messaggio</b></p><p style="white-space:pre-wrap">${esc(message)}</p>` : ""}<p><a href="${esc(SITE)}/admin">Apri la dashboard</a></p>`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      // reply_to: rispondendo all'email si scrive direttamente al cliente
      body: JSON.stringify({ from, to: [to], subject, text, html, ...(l.email ? { reply_to: l.email } : {}) }),
      signal: ctrl.signal,
    });
    if (!r.ok) console.error(`[lead-notify] invio non riuscito: HTTP ${r.status} ${(await r.text().catch(() => "")).slice(0, 200)}`);
  } catch (e: any) {
    console.error(`[lead-notify] invio non riuscito: ${e?.name === "AbortError" ? "timeout 4s" : e?.message || "errore"}`);
  } finally {
    clearTimeout(timer);
  }
}

/** Percorso di una pagina del sito ricevuto dal browser: solo "/qualcosa", senza query né frammento. */
export const cleanPath = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const p = v.split(/[?#]/)[0].slice(0, 200);
  return /^\/[\w\-./%]*$/.test(p) ? p : null;
};

/** notifyLead con il tetto giornaliero; se il contatore non risponde, l'email parte comunque. */
export async function notifyLeadCapped(db: Firestore, l: LeadNotice): Promise<void> {
  const max = Number(process.env.LEAD_NOTIFY_DAILY_MAX) || 50;
  let allowed = true;
  try { allowed = await dailyCap(db, "lead_notify", max); } catch { /* contatore non disponibile */ }
  if (!allowed) { console.warn(`[lead-notify] tetto giornaliero di ${max} email raggiunto: notifica saltata`); return; }
  await notifyLead(l);
}
