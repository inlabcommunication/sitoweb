/**
 * Vercel Serverless Function: /api/chat
 *
 * Adattata da uno schema Firebase originale per:
 * - InLab Communication (agenzia di Taranto)
 * - Supabase invece di Firebase
 * - Provider switchabili (Gemini default, Claude opzionale)
 *
 * ARCHITETTURA SICURA: la chiave AI vive SOLO sul server,
 * il browser non la vede mai.
 *
 * VARIABILI D'AMBIENTE RICHIESTE SU VERCEL:
 *   GEMINI_API_KEY         (obbligatoria — chiave Google AI Studio)
 *   ANTHROPIC_API_KEY      (opzionale — per attivare Claude)
 *   SUPABASE_URL           (obbligatoria — uguale a VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_KEY   (obbligatoria — la SECRET key, non la publishable)
 *   AI_PROVIDER            (opzionale — 'gemini' | 'anthropic', default: gemini)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// =====================================================
// SUPABASE ADMIN CLIENT (lato server, con chiave segreta)
// =====================================================
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error('Supabase env vars missing (SUPABASE_URL, SUPABASE_SERVICE_KEY)');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// =====================================================
// SYSTEM PROMPT — calibrato per InLab Communication
// =====================================================
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
Email: ciao@inlab.it
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
2. NON promettere risultati garantiti (es. "raddoppi sicuramente le vendite")
3. NON inventare servizi che InLab non offre
4. Rispondi SEMPRE in italiano
5. Risposte BREVI (max 2-3 frasi)
6. Quando l'utente fornisce email valida, ringrazialo e conferma che verrà contattato entro 24 ore
7. Se l'utente è ostile o spam, resta cortese ma chiudi educatamente

CLASSIFICAZIONE LEAD (per uso interno):
- "freddo": curioso, info generiche
- "tiepido": confronta opzioni, vuole capire di più
- "caldo": ha un progetto in mente, vuole essere contattato
- "urgente": ha bisogno subito (es. lancio imminente, problema da risolvere)

ALLA FINE DI OGNI TUA RISPOSTA, su una NUOVA RIGA, aggiungi ESATTAMENTE questo blocco di metadati (lo userà il sistema, NON mostrarlo nella risposta visibile):
<META>{"classification":"freddo|tiepido|caldo|urgente","tags":["servizio_interessato","intento"],"urgency":true|false,"contact_data":{"email":null|"email@trovata.it","name":null|"nome trovato","phone":null|"telefono trovato"}}</META>

Esempi di tags utili: "social", "web", "video", "foto", "automazioni", "landing", "info_prezzi", "vuole_contatto", "richiesta_consulenza".`;

function extractMetaAndClean(rawText: string): {
  visibleText: string;
  meta: any;
} {
  const metaMatch = rawText.match(/<META>([\s\S]*?)<\/META>/);
  let meta: any = {};
  let visibleText = rawText;
  if (metaMatch) {
    visibleText = rawText.replace(metaMatch[0], '').trim();
    try {
      meta = JSON.parse(metaMatch[1].trim());
    } catch (e) {
      console.warn('Meta JSON parse failed:', metaMatch[1]);
    }
  }
  return { visibleText, meta };
}

// =====================================================
// PROVIDER: GOOGLE GEMINI
// =====================================================
async function callGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: any[],
  maxTokens: number
) {
  const ai = new GoogleGenAI({ apiKey });

  // History: tutti tranne l'ultimo (che è la domanda corrente)
  const history = messages
    .slice(0, -1)
    .map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [
        {
          text:
            m.role === 'assistant'
              ? String(m.content).replace(/<META>[\s\S]*?<\/META>/g, '').trim()
              : String(m.content),
        },
      ],
    }))
    .filter((m: any) => m.parts[0].text && m.parts[0].text.length > 0);

  const lastMessage = messages[messages.length - 1];
  const currentMessage = String(lastMessage?.content || '');

  const chat = ai.chats.create({
    model: model || 'gemini-2.5-flash',
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: maxTokens,
      temperature: 0.7,
    },
    history: history,
  });

  const response = await chat.sendMessage({ message: currentMessage });
  const rawText = response.text || '';

  return {
    rawText,
    usage: {
      inputTokens: response.usageMetadata?.promptTokenCount,
      outputTokens: response.usageMetadata?.candidatesTokenCount,
    },
  };
}

// =====================================================
// PROVIDER: ANTHROPIC CLAUDE
// =====================================================
async function callAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: any[],
  maxTokens: number
) {
  const cleanMessages: Anthropic.MessageParam[] = messages
    .map((m: any): Anthropic.MessageParam => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content:
        m.role === 'assistant'
          ? String(m.content).replace(/<META>[\s\S]*?<\/META>/g, '').trim()
          : String(m.content),
    }))
    .filter((m) => typeof m.content === 'string' && m.content.length > 0);

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: cleanMessages,
  });

  const rawText = response.content
    .filter((c: any) => c.type === 'text')
    .map((c: any) => c.text)
    .join('\n');

  return {
    rawText,
    usage: {
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
    },
  };
}

// =====================================================
// SALVATAGGIO LEAD AUTOMATICO
// Quando l'utente lascia l'email, viene salvato come lead in Supabase
// =====================================================
async function saveLeadIfEmailFound(
  sessionId: string | null,
  email: string | null,
  name: string | null,
  phone: string | null,
  meta: any,
  conversation: any[]
) {
  if (!email) return;
  try {
    const supabase = getSupabase();

    // Verifica se questo lead esiste già per la stessa sessione (evita duplicati)
    if (sessionId) {
      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('session_id', sessionId)
        .eq('email', email)
        .limit(1);

      if (existing && existing.length > 0) {
        // Aggiorna invece di duplicare
        await supabase
          .from('leads')
          .update({
            conversation,
            intent: meta.tags?.join(', ') || 'Contatto da chatbot',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing[0].id);
        return;
      }
    }

    const classification = meta.classification || 'freddo';
    const tags = Array.isArray(meta.tags) ? meta.tags : [];
    const urgent = meta.urgency === true;

    await supabase.from('leads').insert({
      email,
      name: name || null,
      phone: phone || null,
      intent:
        tags.length > 0
          ? `[${classification.toUpperCase()}${urgent ? ' · URGENTE' : ''}] ${tags.join(', ')}`
          : `[${classification.toUpperCase()}] Contatto da chatbot`,
      conversation,
      source: 'chatbot',
      status: urgent || classification === 'caldo' ? 'qualified' : 'new',
      session_id: sessionId,
    });
  } catch (e) {
    console.error('[chat] save lead failed', e);
  }
}

// =====================================================
// MAIN HANDLER
// =====================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — il chatbot è sul tuo dominio, quindi same-origin di default,
  // ma se usi un dominio diverso aggiungi qui l'origin permesso.
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, sessionId } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }

    // Limita la lunghezza della history (anti-abuso)
    const limitedMessages = messages.slice(-30);

    // Scegli provider — default Gemini
    const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    const maxTokens = 400;

    let result;
    if (provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'ANTHROPIC_API_KEY missing',
          reply: 'Configurazione chatbot incompleta. Scrivici a ciao@inlab.it 🙂',
        });
      }
      result = await callAnthropic(
        apiKey,
        process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
        SYSTEM_PROMPT,
        limitedMessages,
        maxTokens
      );
    } else {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY missing',
          reply: 'Configurazione chatbot incompleta. Scrivici a ciao@inlab.it 🙂',
        });
      }
      result = await callGemini(
        apiKey,
        process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        SYSTEM_PROMPT,
        limitedMessages,
        maxTokens
      );
    }

    const { visibleText, meta } = extractMetaAndClean(result.rawText);

    // Conversazione completa per salvataggio lead
    const fullConversation = [
      ...limitedMessages,
      { role: 'assistant', content: visibleText, ts: Date.now() },
    ];

    // Estrai contatti dai meta (e fallback regex sull'ultimo messaggio utente)
    const lastUserMsg = limitedMessages[limitedMessages.length - 1]?.content || '';
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(?:\+39\s?)?(?:\d{2,4}[\s.-]?){2,4}\d{2,4}/;

    const email =
      meta?.contact_data?.email ||
      lastUserMsg.match(emailRegex)?.[0] ||
      null;
    const name = meta?.contact_data?.name || null;
    const phone =
      meta?.contact_data?.phone ||
      lastUserMsg.match(phoneRegex)?.[0] ||
      null;

    if (email) {
      await saveLeadIfEmailFound(
        sessionId || null,
        email,
        name,
        phone,
        meta,
        fullConversation
      );
    }

    return res.status(200).json({
      reply: visibleText,
      meta,
      usage: result.usage,
      provider,
    });
  } catch (error: any) {
    console.error('[chat] handler error:', error);
    return res.status(500).json({
      error: error?.message || 'Internal server error',
      reply:
        "Mi dispiace, c'è stato un problema tecnico. Scrivici a ciao@inlab.it e ti risponderemo entro 24h 🙂",
    });
  }
}
