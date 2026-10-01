// Avvisi per i nuovi lead: Telegram, email e notifiche push sulla dashboard.
// Ogni canale è attivo solo se le sue variabili d'ambiente sono impostate su
// Vercel; un canale che fallisce non blocca gli altri né il salvataggio del lead.
import type { Firestore } from "firebase-admin/firestore";
import { createHash } from "node:crypto";

export type LeadAlert = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  intent?: string | null;
  message?: string | null;
  source: "contact_form" | "chatbot" | "test";
};

export type ChannelResult = { channel: "telegram" | "email" | "push"; ok: boolean; detail?: string };

const TIMEOUT_MS = 5000;
export const PUSH_COLLECTION = "admin_push_subscriptions";

const SOURCE_LABEL: Record<LeadAlert["source"], string> = {
  contact_form: "modulo contatti",
  chatbot: "chatbot",
  test: "prova",
};

function siteUrl(): string {
  return (process.env.VITE_SITE_URL || process.env.SITE_URL || "https://sitoweb-beta.vercel.app").replace(/\/+$/, "");
}

/** Configurazione dei canali (solo presenza, mai i valori). */
export function channelsConfigured() {
  return {
    telegram: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    email: !!(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL),
    push: !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
  };
}

/** ID del documento di un dispositivo: hash dell'endpoint (lungo e con caratteri non ammessi). */
export const pushDocId = (endpoint: string) => createHash("sha256").update(endpoint).digest("hex").slice(0, 40);

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function withTimeout<T>(p: Promise<T>, label: string): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`${label}: timeout`)), TIMEOUT_MS))]);
}

/** Righe del lead (solo campi presenti), usate da Telegram ed email. */
function leadLines(l: LeadAlert): [string, string][] {
  const rows: [string, string | null | undefined][] = [
    ["Nome", l.name], ["Email", l.email], ["Telefono", l.phone], ["Azienda", l.company],
    ["Richiesta", l.intent], ["Messaggio", l.message ? l.message.slice(0, 1500) : null],
  ];
  return rows.filter((r): r is [string, string] => !!r[1]);
}

async function sendTelegram(l: LeadAlert): Promise<ChannelResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chats = process.env.TELEGRAM_CHAT_ID!.split(",").map((s) => s.trim()).filter(Boolean);
  const text = [
    `<b>🔔 Nuova lead dal ${SOURCE_LABEL[l.source]}</b>`,
    "",
    ...leadLines(l).map(([k, v]) => `<b>${k}:</b> ${esc(v)}`),
    "",
    `<a href="${siteUrl()}/admin">Apri la dashboard</a>`,
  ].join("\n");
  const results = await Promise.all(chats.map(async (chat_id) => {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    return r.ok ? null : `HTTP ${r.status}`;
  }));
  const err = results.find(Boolean);
  return { channel: "telegram", ok: !err, ...(err ? { detail: err } : {}) };
}

async function sendEmail(l: LeadAlert): Promise<ChannelResult> {
  const to = process.env.LEAD_NOTIFY_EMAIL!.split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.LEAD_NOTIFY_FROM || "Sito InLab <onboarding@resend.dev>";
  const who = l.name || l.email || l.phone || "contatto";
  const rows = leadLines(l).map(([k, v]) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
    <h2 style="margin:0 0 12px">Nuova lead dal ${SOURCE_LABEL[l.source]}</h2>
    <table style="border-collapse:collapse">${rows}</table>
    <p style="margin-top:20px"><a href="${siteUrl()}/admin">Apri la dashboard</a></p></div>`;
  const textBody = leadLines(l).map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nDashboard: ${siteUrl()}/admin`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from, to,
      subject: `${l.source === "test" ? "[Prova] " : ""}Nuova lead: ${who}`.slice(0, 150),
      html, text: textBody,
      // "Rispondi" scrive direttamente al cliente
      ...(l.email ? { reply_to: l.email } : {}),
    }),
  });
  return { channel: "email", ok: r.ok, ...(r.ok ? {} : { detail: `HTTP ${r.status}` }) };
}

async function sendPush(db: Firestore, l: LeadAlert): Promise<ChannelResult> {
  const webpush = (await import("web-push")).default;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || `mailto:${(process.env.LEAD_NOTIFY_EMAIL || "info@inlab.it").split(",")[0].trim()}`,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  const subs = await db.collection(PUSH_COLLECTION).limit(50).get();
  if (subs.empty) return { channel: "push", ok: false, detail: "nessun dispositivo attivato" };
  // Il testo della notifica resta breve: i dettagli si leggono in dashboard
  const payload = JSON.stringify({
    title: l.source === "test" ? "Notifica di prova" : `Nuova lead dal ${SOURCE_LABEL[l.source]}`,
    body: [l.name || l.email || l.phone, l.intent].filter(Boolean).join(" · ").slice(0, 180) || "Apri la dashboard per i dettagli",
    url: "/admin",
  });
  let sent = 0;
  await Promise.all(subs.docs.map(async (d) => {
    const s = d.data();
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, payload, { TTL: 86400, urgency: "high" });
      sent++;
    } catch (e: any) {
      // 404/410: il dispositivo ha revocato il permesso o l'iscrizione è scaduta
      if (e?.statusCode === 404 || e?.statusCode === 410) await d.ref.delete().catch(() => {});
      else console.error("Push non inviata:", e?.statusCode || e?.message);
    }
  }));
  return { channel: "push", ok: sent > 0, detail: `${sent}/${subs.size} dispositivi` };
}

/** Invia l'avviso su tutti i canali configurati. Non lancia mai eccezioni. */
export async function notifyNewLead(db: Firestore, lead: LeadAlert): Promise<ChannelResult[]> {
  const on = channelsConfigured();
  const jobs: Promise<ChannelResult>[] = [];
  if (on.telegram) jobs.push(withTimeout(sendTelegram(lead), "telegram").catch((e) => ({ channel: "telegram", ok: false, detail: String(e?.message || e).slice(0, 80) })));
  if (on.email) jobs.push(withTimeout(sendEmail(lead), "email").catch((e) => ({ channel: "email", ok: false, detail: String(e?.message || e).slice(0, 80) })));
  if (on.push) jobs.push(withTimeout(sendPush(db, lead), "push").catch((e) => ({ channel: "push", ok: false, detail: String(e?.message || e).slice(0, 80) })));
  const results = await Promise.all(jobs);
  // Nei log solo l'esito, mai i dati del lead
  for (const r of results) if (!r.ok) console.error(`Avviso lead ${r.channel} non riuscito:`, r.detail);
  return results;
}
