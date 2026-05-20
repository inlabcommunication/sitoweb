import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `Sei "INLAB AI", l'assistente virtuale di InLab Communication, un'agenzia di comunicazione di Taranto, in Puglia.

CHI È INLAB:
Agenzia che aiuta aziende e brand della Puglia a comunicare meglio attraverso strategia digitale, contenuti, advertising e tecnologia.

SERVIZI:
- Gestione Social & Meta Ads (Instagram, Facebook, TikTok)
- Siti Web & Web App
- Automazioni con AI
- Shooting Fotografico
- Video & Reels
- Landing Page

CONTATTI: ciao@inlab.it — Taranto, Puglia

TONO: Professionale, diretto, risposte brevi (max 2-3 frasi). Raccogli nome ed email se l'utente è interessato.

ALLA FINE DI OGNI RISPOSTA aggiungi:
<META>{"classification":"freddo","tags":[],"urgency":false,"contact_data":{"email":null,"name":null,"phone":null}}</META>`;

function extractMetaAndClean(rawText: string) {
  const metaMatch = rawText.match(/<META>([\s\S]*?)<\/META>/);
  let meta: any = {};
  let visibleText = rawText;
  if (metaMatch) {
    visibleText = rawText.replace(metaMatch[0], '').trim();
    try { meta = JSON.parse(metaMatch[1].trim()); } catch {}
  }
  return { visibleText, meta };
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
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: 'messages required' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY missing', reply: 'Configurazione mancante.' });

    const ai = new GoogleGenAI({ apiKey });
    const limitedMessages = messages.slice(-30);
    const history = limitedMessages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.content).replace(/<META>[\s\S]*?<\/META>/g, '').trim() }],
    })).filter((m: any) => m.parts[0].text.length > 0);

    const lastMessage = limitedMessages[limitedMessages.length - 1];
    const chat = ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 400, temperature: 0.7 }, history });
    const response = await chat.sendMessage({ message: String(lastMessage?.content || '') });

    const { visibleText, meta } = extractMetaAndClean(response.text || '');
    return res.status(200).json({ reply: visibleText, meta, provider: 'gemini' });
  } catch (error: any) {
    console.error('[chat] error:', error);
    return res.status(500).json({ error: error?.message || 'Internal error', reply: "Problema tecnico. Scrivici a ciao@inlab.it 🙂" });
  }
}
