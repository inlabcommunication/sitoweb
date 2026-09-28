// Utility di sicurezza condivise dalle funzioni /api (Vercel non espone come
// endpoint i file dentro cartelle che iniziano con "_").
import type { VercelRequest, VercelResponse } from "./types";
import { createHash } from "node:crypto";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue, type Firestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export function getAdminDb(): Firestore {
  if (getApps().length === 0) {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    initializeApp(json ? { credential: cert(JSON.parse(json)) } : undefined);
  }
  return getFirestore();
}

/** IP del client (Vercel mette l'IP reale come primo valore di x-forwarded-for). */
export function clientIp(req: VercelRequest): string {
  const fwd = String(req.headers["x-forwarded-for"] || "");
  return (fwd.split(",")[0] || req.socket?.remoteAddress || "unknown").trim();
}

/** Hash dell'IP con salt: per i limiti non serve (e non conserviamo) l'IP in chiaro. */
export function hashKey(value: string): string {
  const salt = process.env.RATE_LIMIT_SALT || "inlab-default-salt";
  return createHash("sha256").update(salt + value).digest("hex").slice(0, 32);
}

/**
 * Accetta solo richieste dal browser sul nostro stesso dominio.
 * (Non basta da solo contro script che falsificano l'header: per quello ci sono i limiti.)
 */
export function isAllowedOrigin(req: VercelRequest): boolean {
  const origin = String(req.headers.origin || "");
  if (!origin) return false;
  let host: string;
  try { host = new URL(origin).host; } catch { return false; }
  const allowed = new Set<string>([String(req.headers.host || "")]);
  for (const u of [process.env.VITE_SITE_URL, process.env.SITE_URL, ...(process.env.ALLOWED_ORIGINS || "").split(",")]) {
    if (!u) continue;
    try { allowed.add(new URL(u.trim()).host); } catch { /* ignora valori non validi */ }
  }
  return allowed.has(host);
}

/**
 * Limite di richieste con contatore su Firestore (condiviso tra tutte le
 * istanze serverless). Ritorna true se la richiesta può procedere.
 */
export async function rateLimit(db: Firestore, bucket: string, key: string, limit: number, windowSec: number): Promise<boolean> {
  const windowId = Math.floor(Date.now() / 1000 / windowSec);
  const ref = db.collection("_ratelimits").doc(`${bucket}_${hashKey(key)}_${windowId}`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = (snap.exists ? (snap.data()!.count as number) : 0) + 1;
    if (count > limit) return false;
    // expireAt: attiva un TTL su questo campo in Firestore per la pulizia automatica
    tx.set(ref, { count, expireAt: new Date((windowId + 1) * windowSec * 1000 + 86400_000) }, { merge: true });
    return true;
  });
}

/** Contatore giornaliero globale (tetto di spesa per l'AI). */
export async function dailyCap(db: Firestore, name: string, limit: number): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const ref = db.collection("_usage").doc(`${name}_${day}`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = (snap.exists ? (snap.data()!.count as number) : 0) + 1;
    if (count > limit) return false;
    tx.set(ref, { count, day, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return true;
  });
}

/** Verifica che la richiesta arrivi da un admin loggato (token Firebase + documento admins/{uid}). */
export async function requireAdmin(req: VercelRequest): Promise<string | null> {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  try {
    const db = getAdminDb();
    const decoded = await getAuth().verifyIdToken(token, true);
    const admin = await db.collection("admins").doc(decoded.uid).get();
    return admin.exists ? decoded.uid : null;
  } catch {
    return null;
  }
}

export function securityHeaders(res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

export const str = (v: unknown, max: number): string =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";
