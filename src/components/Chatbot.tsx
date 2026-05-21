import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

// ════════════════════════════════════════════════════════════════
// CHATBOT v3 — Backend serverless /api/chat
//
// Il browser NON conosce la chiave AI. Tutto passa dal nostro endpoint
// che vive su Vercel come funzione serverless. Più sicuro e più potente:
// - Classifica i lead (freddo/tiepido/caldo/urgente)
// - Estrae nome/email/telefono dalla conversazione
// - Salva direttamente nel DB Supabase
// - Switchabile tra Gemini e Claude da variabili d'ambiente Vercel
// ════════════════════════════════════════════════════════════════

type Msg = { role: 'user' | 'assistant'; content: string; ts: number };

const SESSION_KEY = 'inlab_sid';

const getSessionId = (): string => {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
};

// ════════════════════════════════════════════════════════════════
// MASCOTTE — Personaggio SVG stilizzato per il chatbot
// ════════════════════════════════════════════════════════════════
const MascotSVG = () => (
  <svg width="72" height="88" viewBox="0 0 72 88" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', filter: 'drop-shadow(0 8px 24px rgba(205,178,255,0.5))' }}>
    {/* Corpo */}
    <rect x="12" y="32" width="48" height="44" rx="16" fill="#cdb2ff"/>
    {/* Testa */}
    <ellipse cx="36" cy="24" rx="22" ry="22" fill="#cdb2ff"/>
    {/* Orecchie */}
    <ellipse cx="14" cy="20" rx="6" ry="8" fill="#b89cee"/>
    <ellipse cx="58" cy="20" rx="6" ry="8" fill="#b89cee"/>
    <ellipse cx="14" cy="20" rx="3" ry="5" fill="#e8d8ff"/>
    <ellipse cx="58" cy="20" rx="3" ry="5" fill="#e8d8ff"/>
    {/* Occhi */}
    <ellipse cx="28" cy="22" rx="5" ry="6" fill="#1e1d1d"/>
    <ellipse cx="44" cy="22" rx="5" ry="6" fill="#1e1d1d"/>
    {/* Lucentezza occhi */}
    <circle cx="30" cy="20" r="2" fill="white"/>
    <circle cx="46" cy="20" r="2" fill="white"/>
    {/* Naso */}
    <ellipse cx="36" cy="30" rx="3" ry="2" fill="#9a7de0"/>
    {/* Bocca sorriso */}
    <path d="M28 35 Q36 42 44 35" stroke="#1e1d1d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* Guance */}
    <ellipse cx="20" cy="32" rx="6" ry="4" fill="#e8c4ff" opacity="0.6"/>
    <ellipse cx="52" cy="32" rx="6" ry="4" fill="#e8c4ff" opacity="0.6"/>
    {/* Braccia */}
    <rect x="2" y="42" width="12" height="8" rx="4" fill="#cdb2ff"/>
    <rect x="58" y="42" width="12" height="8" rx="4" fill="#cdb2ff"/>
    {/* Gambe */}
    <rect x="18" y="70" width="14" height="18" rx="7" fill="#b89cee"/>
    <rect x="40" y="70" width="14" height="18" rx="7" fill="#b89cee"/>
    {/* Logo IL sul corpo */}
    <text x="36" y="58" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="#1e1d1d" letterSpacing="2">IL</text>
  </svg>
);

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Saluto iniziale
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            'Ciao! 👋 Sono l\'assistente di InLab. Come posso aiutarti? Cerchi info su social, sito web, video, foto o automazioni AI?',
          ts: Date.now(),
        },
      ]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: 'user', content: text, ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          sessionId: getSessionId(),
        }),
      });

      const data = await response.json();

      // Risposta del bot (sempre, anche in caso di errore mostra il messaggio fallback)
      const reply = data.reply || 'Ops, problema tecnico. Scrivici a inlab.communication@gmail.com 🙂';
      setMessages([...newMessages, { role: 'assistant', content: reply, ts: Date.now() }]);

      // Email catturata? Mostra il badge di conferma
      const email = data.meta?.contact_data?.email;
      if (email && !emailCaptured) {
        setEmailCaptured(email);
      }
    } catch (e) {
      console.error('[chatbot] network error', e);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Problema di connessione. Riprova o scrivici a inlab.communication@gmail.com 🙂',
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mascotte + bottone */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9998, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

        {/* Fumetto "Parliamo!" — solo quando chiusa */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 2, type: 'spring', stiffness: 200 }}
              style={{
                background: 'var(--a)',
                color: '#000',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '.08em',
                padding: '6px 14px',
                borderRadius: 100,
                whiteSpace: 'nowrap',
                marginBottom: 8,
                boxShadow: '0 4px 16px rgba(205,178,255,0.4)',
                cursor: 'pointer',
              }}
              onClick={() => setOpen(true)}
            >
              💬 Parliamo!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascotte SVG */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
          onClick={() => setOpen(!open)}
          data-track="chatbot_toggle"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'block',
            filter: open ? 'brightness(0.8)' : 'none',
            transition: 'filter .2s',
          }}
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          {open ? (
            /* Bottone X quando aperto */
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(205,178,255,0.4)' }}>
              <X size={22} color="#000" />
            </motion.div>
          ) : (
            /* Mascotte quando chiusa */
            <MascotSVG />
          )}
        </motion.button>
      </div>

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
                padding: '1rem 1.5rem',
                borderBottom: '.5px solid var(--b)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'linear-gradient(135deg, rgba(205,178,255,0.08) 0%, transparent 100%)',
              }}
            >
              <div style={{ width: 44, height: 44, flexShrink: 0, overflow: 'hidden' }}>
                <svg width="44" height="54" viewBox="0 0 72 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="32" width="48" height="44" rx="16" fill="#cdb2ff"/>
                  <ellipse cx="36" cy="24" rx="22" ry="22" fill="#cdb2ff"/>
                  <ellipse cx="14" cy="20" rx="6" ry="8" fill="#b89cee"/>
                  <ellipse cx="58" cy="20" rx="6" ry="8" fill="#b89cee"/>
                  <ellipse cx="14" cy="20" rx="3" ry="5" fill="#e8d8ff"/>
                  <ellipse cx="58" cy="20" rx="3" ry="5" fill="#e8d8ff"/>
                  <ellipse cx="28" cy="22" rx="5" ry="6" fill="#1e1d1d"/>
                  <ellipse cx="44" cy="22" rx="5" ry="6" fill="#1e1d1d"/>
                  <circle cx="30" cy="20" r="2" fill="white"/>
                  <circle cx="46" cy="20" r="2" fill="white"/>
                  <ellipse cx="36" cy="30" rx="3" ry="2" fill="#9a7de0"/>
                  <path d="M28 35 Q36 42 44 35" stroke="#1e1d1d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <ellipse cx="20" cy="32" rx="6" ry="4" fill="#e8c4ff" opacity="0.6"/>
                  <ellipse cx="52" cy="32" rx="6" ry="4" fill="#e8c4ff" opacity="0.6"/>
                  <text x="36" y="58" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="#1e1d1d" letterSpacing="2">IL</text>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 16, letterSpacing: '.1em' }}>INLAB AI</div>
                <div style={{ fontSize: 10, color: 'var(--m)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  {loading ? '✦ sta scrivendo...' : '✦ online · risponde subito'}
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--m)', cursor: 'pointer', padding: 4 }}>
                <X size={18} />
              </button>
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
                  ✓ Contatto salvato — ti scriviamo entro 24h
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
