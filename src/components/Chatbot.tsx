import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '../lib/supabase';

// ════════════════════════════════════════════════════════════════
// CHATBOT AI (Gemini) — Cattura lead automatica
// Il bot conosce InLab, risponde sui servizi, riconosce l'intento
// di contatto e chiede l'email in modo naturale. Salva su Supabase.
// ════════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Sei l'assistente virtuale di InLab Communication, un'agenzia di comunicazione di Taranto, Puglia.

I servizi di InLab sono:
- Gestione Social & Meta Ads (strategia, contenuti, advertising su Instagram, Facebook, TikTok)
- Siti Web & Web App (design, sviluppo, SEO)
- Automazioni con AI (chatbot, workflow, processi intelligenti)
- Shooting Fotografico (brand, prodotti, eventi)
- Video & Reels (produzione per social, milioni di view organiche)
- Landing Page (ottimizzate per conversione, A/B testing)

InLab serve clienti in tutta la Puglia: Taranto, Palagiano, Palagianello, Massafra, Mottola, Castellaneta, Laterza, Ginosa.

REGOLE:
1. Rispondi sempre in italiano, tono amichevole ma professionale, breve (max 2-3 frasi per risposta).
2. Non inventare prezzi, tempi o promesse specifiche. Se chiedono "quanto costa" o "in quanto tempo", spiega che dipende dal progetto e proponi di lasciare l'email per un preventivo personalizzato.
3. Dopo 2-3 messaggi, se l'utente sembra interessato, chiedi gentilmente nome e email per farlo contattare dal team. Non essere insistente.
4. Quando l'utente fornisce un'email valida, ringrazialo e chiudi dicendo che lo contatterete entro 24h.
5. Quando rilevi un'email nel messaggio, rispondi includendo nel JSON: {"email": "...", "intent": "breve descrizione di cosa cerca"}.
6. Formato risposta: SEMPRE JSON valido così: {"reply": "il tuo messaggio all'utente", "email": null o "email@trovata.it", "intent": null o "descrizione"}.`;

type Msg = { role: 'user' | 'assistant'; content: string; ts: number };

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

  // Saluto iniziale quando si apre per la prima volta
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Ciao! 👋 Sono l\'assistente di InLab. Come posso aiutarti? Stai cercando informazioni su social, sito web, video o altro?',
          ts: Date.now(),
        },
      ]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const saveLead = async (email: string, intent: string | null) => {
    if (!supabase) return;
    const sessionId = sessionStorage.getItem('inlab_sid') ?? null;
    try {
      await supabase.from('leads').insert({
        email,
        intent: intent ?? 'Contatto da chatbot',
        conversation: messages,
        session_id: sessionId,
        source: 'chatbot',
        status: 'new',
      });
    } catch (e) {
      console.error('[chatbot] salvataggio lead fallito', e);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: 'user', content: text, ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Estrai email se presente nel messaggio utente (sicurezza extra)
    const directEmail = text.match(EMAIL_RE)?.[0] ?? null;

    if (!apiKey) {
      // Fallback se Gemini non è configurato
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: directEmail
            ? `Grazie! Ti contatteremo a ${directEmail} entro 24 ore.`
            : 'Mi piacerebbe aiutarti meglio. Lasciami la tua email e ti contattiamo entro 24h.',
          ts: Date.now(),
        },
      ]);
      if (directEmail) {
        await saveLead(directEmail, null);
        setEmailCaptured(directEmail);
      }
      setLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const conversation = newMessages.map((m) => `${m.role === 'user' ? 'Utente' : 'Assistente'}: ${m.content}`).join('\n');
      const prompt = `${SYSTEM_PROMPT}\n\n--- CONVERSAZIONE ---\n${conversation}\n\nAssistente (rispondi SOLO con JSON valido):`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      const raw = response.text ?? '';
      // Estrai il JSON anche se Gemini aggiunge backtick
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      let reply = 'Mi dispiace, qualcosa è andato storto. Riprovi?';
      let emailFromAi: string | null = null;
      let intent: string | null = null;

      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          reply = parsed.reply ?? reply;
          emailFromAi = parsed.email && EMAIL_RE.test(parsed.email) ? parsed.email : null;
          intent = parsed.intent ?? null;
        } catch {
          reply = raw.replace(/```json|```/g, '').trim() || reply;
        }
      } else {
        reply = raw;
      }

      setMessages([...newMessages, { role: 'assistant', content: reply, ts: Date.now() }]);

      const finalEmail = emailFromAi ?? directEmail;
      if (finalEmail && !emailCaptured) {
        await saveLead(finalEmail, intent);
        setEmailCaptured(finalEmail);
      }
    } catch (e) {
      console.error('[chatbot] gemini error', e);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Ops, problema tecnico. Puoi scriverci direttamente a ciao@inlab.it 🙂',
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bottone fluttuante */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
        onClick={() => setOpen(!open)}
        data-track="chatbot_toggle"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'var(--a)',
          color: '#000',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(205,178,255,0.4)',
          zIndex: 9998,
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pannello chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 24,
              width: 'min(380px, calc(100vw - 48px))',
              height: 'min(560px, calc(100vh - 140px))',
              background: 'rgba(26,25,25,0.98)',
              backdropFilter: 'blur(20px)',
              border: '.5px solid var(--b)',
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 9999,
              boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '.5px solid var(--b)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: 'var(--a)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} color="#000" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 16, letterSpacing: '.1em' }}>INLAB AI</div>
                <div style={{ fontSize: 10, color: 'var(--m)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  {loading ? 'sta scrivendo...' : 'online · risponde subito'}
                </div>
              </div>
            </div>

            {/* Messaggi */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: m.role === 'user' ? 'var(--a)' : 'rgba(255,255,255,0.06)',
                    color: m.role === 'user' ? '#000' : 'var(--t)',
                    fontSize: 14,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {m.content}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '12px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    gap: 4,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--m)' }}
                    />
                  ))}
                </motion.div>
              )}
              {emailCaptured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    alignSelf: 'center',
                    padding: '8px 14px',
                    borderRadius: 100,
                    background: 'rgba(205,178,255,0.12)',
                    border: '.5px solid rgba(205,178,255,0.3)',
                    color: 'var(--a)',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    marginTop: 8,
                  }}
                >
                  ✓ Email salvata — ti contatteremo
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div
              style={{
                padding: '1rem 1.25rem 1.25rem',
                borderTop: '.5px solid var(--b)',
                display: 'flex',
                gap: 8,
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Scrivi un messaggio..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '.5px solid var(--b)',
                  borderRadius: 100,
                  padding: '10px 16px',
                  color: 'var(--t)',
                  fontSize: 14,
                  fontFamily: 'var(--fb)',
                  outline: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: input.trim() ? 'var(--a)' : 'rgba(255,255,255,0.06)',
                  color: input.trim() ? '#000' : 'var(--m)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  transition: 'background .2s',
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
