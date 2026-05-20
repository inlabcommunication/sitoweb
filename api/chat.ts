/**
 * Vercel Serverless Function: /api/chat
 * Basato sulla versione funzionante di landingpagetotallift.
 * Adattato per InLab Communication.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountJson) {
      try {
        initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
      } catch (e) {
        console.error("Service account JSON malformed", e);
        initializeApp();
      }
    } else {
      initializeApp();
    }
  }
  return getFirestore();
}

const SYSTEM_PROMPT = `Sei "INLAB AI", l'assistente virtuale di InLab Communication, un'agenzia di comunicazione di Taranto, in Puglia.

CHI È INLAB:
Agenzia che aiuta aziende e brand della Puglia a comunicare meglio attraverso strategia digitale, contenuti, advertising e tecnologia.

SERVIZI:
- Gestione Social & Meta Ads (Instagram, Facebook, TikTok — strategia, contenuti, advertising)
- Siti Web & Web App (design, sviluppo full-stack, SEO, e-commerce)
- Automazioni con AI (chatbot, workflow intelligenti, integrazioni)
- Shooting Fotografico (brand, prodotti, eventi)
- Video & Reels (produzione per social — track record di milioni di view organiche)
- Landing Page ottimizzate per conversione

AREA DI INTERVENTO: Taranto, Palagiano, Palagianello, Massafra, Mottola, Castellaneta, Laterza, Ginosa, e Puglia in generale.

CONTATTI:
Email: inlab.communication@gmail.com
Sede: Taranto, Puglia

RUOLO E TONO:
Sei accogliente, professionale ma diretto. Niente fronzoli da marketing. Risposte brevi (max 2-3 frasi).
Aiuta il visitatore a capire se InLab fa al caso suo e, se interessato, raccogli i suoi contatti (nome + email) per fissare una chiamata di 30 minuti gratuita.

OBIETTIVO PRIMARIO:
Convertire il visitatore in lead. In modo naturale, MAI forzato:
1. Capisci il bisogno (cosa cerca? per quale tipo di attività?)
2. Spiega brevemente come InLab potrebbe aiutarlo
3. Dopo 2-3 messaggi se vedi interesse, proponi: "Vuoi che ti contattiamo? Lasciami nome ed email e ti scriviamo entro 24h"

REGOLE OBBLIGATORIE:
1. NON dare prezzi specifici. Se chiedono, di': "Dipende dal progetto, parliamone in chiamata. Mi lasci nome ed email?"
2. NON promettere risultati garantiti
3. NON inventare servizi che InLab non offre
4. Rispondi SEMPRE in italiano
5. Risposte BREVI (max 2-3 frasi)
6. Quando l'utente fornisce email valida, ringrazialo e conferma che verrà contattato entro 24 ore

ALLA FINE DI OGNI TUA RISPOSTA, su una NUOVA RIGA, aggiungi ESATTAMENTE questo blocco:
<META>{"classification":"freddo|tiepido|caldo|urgente","tags":["servizio_interessato","intento"],"urgency":true|false,"contact_data":{"email":null|"email@trovata.it","name":null|"nome trovato","phone":null|"telefono trovato"}}</META>`;

function extractMetaAndCleanResponse(rawText: string): { visibleText: string; meta: any } {
  const metaMatch = rawText.match(/<META>([\s\S]*?)<\/META>/);
  let meta = {};
  let visibleText = rawText;
  if (metaMatch) {
    visibleText = rawText.replace(metaMatch[0], "").trim();
    try {
      meta = JSON.parse(metaMatch[1].trim());
    } catch (e) {
      console.warn("Meta JSON parse failed:", metaMatch[1]);
    }
  }
  return { visibleText, meta };
}

async function callAnthropic(apiKey: string, model: string, systemPrompt: string, messages: any[], maxTokens: number) {
  const cleanMessages: Anthropic.MessageParam[] = messages.map((m: any): Anthropic.MessageParam => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.role === "assistant"
      ? String(m.content).replace(/<META>[\s\S]*?<\/META>/g, "").trim()
      : String(m.content),
  })).filter((m) => typeof m.content === "string" && m.content.length > 0);

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({ model, max_tokens: maxTokens, system: systemPrompt, messages: cleanMessages });
  const rawText = response.content.filter((c: any) => c.type === "text").map((c: any) => c.text).join("\n");
  return { rawText, usage: { inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens } };
}

async function callGemini(apiKey: string, model: string, systemPrompt: string, messages: any[], maxTokens: number) {
  const MODELS = [model || "gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];

  const ai = new GoogleGenAI({ apiKey });
  const history = messages.slice(0, -1).map((m: any) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{
      text: m.role === "assistant"
        ? String(m.content).replace(/<META>[\s\S]*?<\/META>/g, "").trim()
        : String(m.content),
    }],
  })).filter((m: any) => m.parts[0].text && m.parts[0].text.length > 0);

  const lastMessage = messages[messages.length - 1];

  for (const mdl of MODELS) {
    try {
      const chat = ai.chats.create({
        model: mdl,
        config: { systemInstruction: systemPrompt, maxOutputTokens: maxTokens, temperature: 0.7 },
        history,
      });
      const response = await chat.sendMessage({ message: String(lastMessage?.content || "") });
      return {
        rawText: response.text || "",
        usage: { inputTokens: response.usageMetadata?.promptTokenCount, outputTokens: response.usageMetadata?.candidatesTokenCount },
      };
    } catch (e: any) {
      const is503 = e?.status === 503 || e?.message?.includes("503") || e?.message?.includes("UNAVAILABLE");
      if (is503 && mdl !== MODELS[MODELS.length - 1]) {
        console.warn(`[chat] ${mdl} unavailable, trying fallback...`);
        continue;
      }
      throw e;
    }
  }
  throw new Error("All Gemini models unavailable");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { messages, sessionId } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages required" });

    const fs = getFirebaseAdmin();
    const settingsSnap = await fs.collection("app").doc("settings").get();
    const settings = settingsSnap.exists ? (settingsSnap.data() as any) : {};

    const provider = settings.aiProvider || process.env.AI_PROVIDER || "gemini";
    const maxTokens = 400;
    const limitedMessages = messages.slice(-30);

    let result;
    if (provider === "anthropic") {
      const apiKey = settings.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "Anthropic API key not configured", reply: "Configurazione mancante. Scrivici a inlab.communication@gmail.com 🙂" });
      result = await callAnthropic(apiKey, settings.anthropicModel || "claude-haiku-4-5-20251001", SYSTEM_PROMPT, limitedMessages, maxTokens);
    } else {
      const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "Gemini API key not configured", reply: "Configurazione mancante. Scrivici a inlab.communication@gmail.com 🙂" });
      result = await callGemini(apiKey, settings.geminiModel || "gemini-2.5-flash", SYSTEM_PROMPT, limitedMessages, maxTokens);
    }

    const { visibleText, meta } = extractMetaAndCleanResponse(result.rawText);

    // Salva lead se email trovata
    const lastUserMsg = limitedMessages[limitedMessages.length - 1]?.content || "";
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const email = (meta as any)?.contact_data?.email || lastUserMsg.match(emailRegex)?.[0] || null;

    if (email) {
      try {
        const conversation = [...limitedMessages, { role: "assistant", content: visibleText, ts: Date.now() }];
        const leadsRef = fs.collection("leads");
        if (sessionId) {
          const existing = await leadsRef.where("session_id", "==", sessionId).where("email", "==", email).limit(1).get();
          if (!existing.empty) {
            await existing.docs[0].ref.update({ conversation, updated_at: new Date().toISOString() });
          } else {
            await leadsRef.add({
              email,
              name: (meta as any)?.contact_data?.name || null,
              phone: (meta as any)?.contact_data?.phone || null,
              intent: `[${((meta as any).classification || "freddo").toUpperCase()}] ${((meta as any).tags || []).join(", ")}`,
              conversation, source: "chatbot", status: "new",
              session_id: sessionId, created_at: new Date().toISOString(),
            });
          }
        }
      } catch (e) {
        console.error("Save lead failed:", e);
      }
    }

    return res.status(200).json({ reply: visibleText, meta, usage: result.usage, provider });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: error?.message || "Internal server error", reply: "Mi dispiace, c'è stato un problema tecnico. Scrivici a inlab.communication@gmail.com 🙂" });
  }
}
