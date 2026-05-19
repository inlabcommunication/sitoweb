import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountJson) {
      try { initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) }); }
      catch (e) { console.error('Service account JSON malformed', e); initializeApp(); }
    } else { initializeApp(); }
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
2. NON promettere risultati garantiti
3. NON inventare servizi che InLab non offre
4. Rispondi SEMPRE in italiano
5. Risposte BREVI (max 2-3 frasi)
6. Quando l'utente fornisce email valida, ringrazialo e conferma che verrà contattato entro 24 ore

ALLA FINE DI OGNI TUA RISPOSTA, su una NUOVA RIGA, aggiungi ESATTAMENTE questo blocco:
<META>{"classification":"freddo|tiepido|caldo|urgente","tags":["servizio_interessato","intento"],"urgency":true|false,"contact_data":{"email":null|"email@trovata.it","name":null|"nome trovato","phone":null|"telefono trovato"}}</META>`;

function extractMetaAndClean(rawText: string): { visibleText: string; meta: any } {
  const metaMatch = rawText.match(/<META>([\s\S]*?)<\/META>/);
  let meta: any = {};
  let visibleText = rawText;
  if (metaMatch) {
    visibleText = rawText.replace(metaMatch[0], '').trim();
    try { meta = JSON.parse(metaMatch[1].trim()); } catch (e) { console.warn('Meta JSON parse failed:', metaMatch[1]); }
  }
  return { visibleText, meta };
}

async function callGemini(apiKey: string, model: string, systemPrompt: string, messages: any[], maxTokens: number) {
  const ai = new GoogleGenAI({ apiKey });
  const history = messages.slice(0, -1).map((m: any) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.role === 'assistant' ? String(m.content).replace(/<META>[\s\S]*?<\/META>/g, '').trim() : String(m.content) }],
  })).filter((m: any) => m.parts[0].text && m.parts[0].text.length > 0);

  const lastMessage = messages[messages.length - 1];
  const chat = ai.chats.create({ model: model || 'gemini-2.5-flash', config: { systemInstruction: systemPrompt, maxOutputTokens: maxTokens, temperature: 0.7 }, history });
  const response = await chat.sendMessage({ message: String(lastMessage?.content || '') });
  return { rawText: response.text || '', usage: { inputTokens: response.usageMetadata?.promptTokenCount, outputTokens: response.usageMetadata?.candidatesTokenCount } };
}

async function callAnthropic(apiKey: string, model: string, systemPrompt: string, messages: any[], maxTokens: number) {
  const cleanMessages: Anthropic.MessageParam[] = messages
    .map((m: any): Anthropic.MessageParam => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.role === 'assistant' ? String(m.content).replace(/<META>[\s\S]*?<\/META>/g, '').trim() : String(m.content) }))
    .filter((m) => typeof m.content === 'string' && m.content.length > 0);

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({ model, max_tokens: maxTokens, system: systemPrompt, messages: cleanMessages });
  const rawText = response.content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('\n');
  return { rawText, usage: { inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens } };
}

async function saveLeadIfEmailFound(sessionId: string | null, email: string | null, name: string | null, phone: string | null, meta: any, conversation: any[]) {
  if (!email) return;
  try {
    const fs = getFirebaseAdmin();
    const leadsRef = fs.collection('leads');

    if (sessionId) {
      const existing = await leadsRef.where('session_id', '==', sessionId).where('email', '==', email).limit(1).get();
      if (!existing.empty) {
        await existing.docs[0].ref.update({ conversation, intent: meta.tags?.join(', ') || 'Contatto da chatbot', updated_at: new Date().toISOString() });
        return;
      }
    }

    const classification = meta.classification || 'freddo';
    const tags = Array.isArray(meta.tags) ? meta.tags : [];
    const urgent = meta.urgency === true;

    await leadsRef.add({
      email, name: name || null, phone: phone || null,
      intent: tags.length > 0 ? `[${classification.toUpperCase()}${urgent ? ' · URGENTE' : ''}] ${tags.join(', ')}` : `[${classification.toUpperCase()}] Contatto da chatbot`,
      conversation, source: 'chatbot',
      status: urgent || classification === 'caldo' ? 'qualified' : 'new',
      session_id: sessionId,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[chat] save lead failed', e);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, sessionId } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: 'messages array required' });

    const limitedMessages = messages.slice(-30);

    // Leggi impostazioni da Firestore
    let dbSettings: any = {};
    try {
      const fs = getFirebaseAdmin();
      const snap = await fs.collection('app').doc('settings').get();
      if (snap.exists) dbSettings = snap.data() || {};
    } catch (_) {}

    const provider = (dbSettings.aiProvider || process.env.AI_PROVIDER || 'gemini').toLowerCase();
    const maxTokens = 400;

    let result;
    if (provider === 'anthropic') {
      const apiKey = dbSettings.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY missing', reply: 'Configurazione chatbot incompleta. Scrivici a ciao@inlab.it 🙂' });
      result = await callAnthropic(apiKey, dbSettings.anthropicModel || process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001', SYSTEM_PROMPT, limitedMessages, maxTokens);
    } else {
      const apiKey = dbSettings.geminiApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY missing', reply: 'Configurazione chatbot incompleta. Scrivici a ciao@inlab.it 🙂' });
      result = await callGemini(apiKey, dbSettings.geminiModel || process.env.GEMINI_MODEL || 'gemini-2.5-flash', SYSTEM_PROMPT, limitedMessages, maxTokens);
    }

    const { visibleText, meta } = extractMetaAndClean(result.rawText);
    const fullConversation = [...limitedMessages, { role: 'assistant', content: visibleText, ts: Date.now() }];

    const lastUserMsg = limitedMessages[limitedMessages.length - 1]?.content || '';
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(?:\+39\s?)?(?:\d{2,4}[\s.-]?){2,4}\d{2,4}/;
    const email = meta?.contact_data?.email || lastUserMsg.match(emailRegex)?.[0] || null;
    const name = meta?.contact_data?.name || null;
    const phone = meta?.contact_data?.phone || lastUserMsg.match(phoneRegex)?.[0] || null;

    if (email) await saveLeadIfEmailFound(sessionId || null, email, name, phone, meta, fullConversation);

    return res.status(200).json({ reply: visibleText, meta, usage: result.usage, provider });
  } catch (error: any) {
    console.error('[chat] handler error:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error', reply: "Mi dispiace, c'è stato un problema tecnico. Scrivici a ciao@inlab.it e ti risponderemo entro 24h 🙂" });
  }
}
