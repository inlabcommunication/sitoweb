# 🚀 InLab Dashboard v3 — Guida configurazione

## Cosa cambia rispetto a v2

- 🔐 **Sicurezza**: chiave Gemini ora nascosta sul server. Il browser non la vede più.
- 🧠 **Chatbot più intelligente**: classifica i lead in *freddo / tiepido / caldo / urgente*, estrae nome/email/telefono automaticamente.
- 🔄 **Provider switchabile**: Gemini di default, ma puoi passare a Claude in qualsiasi momento aggiungendo una variabile.
- 📦 **Bundle browser più leggero**: niente più SDK Gemini caricato dal cliente (-56 KB).

---

## 🔧 Variabili d'ambiente Vercel — da aggiornare

Vai su **Vercel → tuo progetto → Settings → Environment Variables**. Devi avere queste variabili:

### ✅ Già presenti dalla v1/v2 (lasciale)

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### 🆕 Nuove da aggiungere ora

```
GEMINI_API_KEY=AIzaSy...           ← STESSA chiave di prima, ma SENZA prefisso VITE_
SUPABASE_URL=https://xxxxx.supabase.co     ← STESSO URL di sopra, ma SENZA prefisso VITE_
SUPABASE_SERVICE_KEY=sb_secret_...  ← LA CHIAVE SEGRETA (Secret key, NON publishable)
```

### 🗑️ Puoi eliminare

```
VITE_GEMINI_API_KEY                ← non serve più: il browser non chiama Gemini direttamente
```

(Se la lasci non rompi niente, è solo inutile.)

### ⚙️ Opzionali

```
AI_PROVIDER=gemini                  ← oppure "anthropic" se vuoi usare Claude
GEMINI_MODEL=gemini-2.5-flash       ← se non specifichi, usa questo
ANTHROPIC_API_KEY=sk-ant-...        ← solo se vuoi attivare Claude
ANTHROPIC_MODEL=claude-haiku-4-5    ← se non specifichi, usa questo
```

---

## 🔑 Come trovare la SUPABASE_SERVICE_KEY

⚠️ **MOLTO IMPORTANTE**: la `SUPABASE_SERVICE_KEY` è una chiave SEGRETA che dà pieni poteri al database. **Mai metterla nel codice del browser**, mai pubblicarla.

Si trova qui:

1. Vai su **supabase.com** → tuo progetto
2. **Settings** → **API Keys**
3. Scorri fino alla sezione **"Secret keys"** (sotto le Publishable keys)
4. Clicca il pulsante 👁️ accanto a `default` per vedere il valore
5. Copia il valore (inizia con `sb_secret_...`)
6. Incollalo in Vercel come `SUPABASE_SERVICE_KEY`

Questa chiave la usa SOLO la nostra funzione `/api/chat` per salvare i lead. Non viene mai mandata al browser.

---

## 🚀 Passi per attivare v3

1. **Carica i nuovi file su GitHub** (sostituisci tutto col contenuto del nuovo zip)
2. **Aggiungi le 3 variabili nuove** su Vercel (vedi sopra)
3. **Forza un redeploy**: Vercel → Deployments → ⋯ → Redeploy
4. **Test**:
   - Apri il sito
   - Clicca il chatbot
   - Scrivi "ciao, vorrei info per un sito web"
   - Dovrebbe risponderti
   - Lascia un'email tipo `test@test.it`
   - Vai su `/#/admin` → tab Lead → dovresti vedere il contatto con status "qualified" (perché classificato "caldo")

---

## 🎨 Come funziona ora il chatbot

Quando un utente scrive un messaggio:

```
Browser
   │ POST /api/chat
   │ { messages: [...], sessionId: "..." }
   ▼
Vercel Function /api/chat (server-side)
   │ 1. Costruisce il system prompt InLab
   │ 2. Chiama Gemini con la chiave segreta
   │ 3. Riceve risposta + blocco <META>
   │ 4. Se trova un'email nei meta → salva lead in Supabase
   │ 5. Restituisce al browser solo la risposta visibile
   ▼
Browser
   │ Mostra la risposta nel pannello chat
   │ Se email catturata → badge "Contatto salvato"
```

**Classificazione automatica dei lead:**

Il sistema legge ogni risposta del bot e classifica:
- `freddo`: utente curioso, info generiche → status `new`
- `tiepido`: confronta opzioni → status `new`
- `caldo`: vuole un preventivo, dà l'email → status `qualified` ✨
- `urgente`: ha bisogno subito → status `qualified` ✨

I lead "caldi" e "urgenti" appaiono già pre-qualificati nella dashboard.

---

## 🔄 Come switchare a Claude (futuro)

Quando vuoi provare Claude:

1. Vai su [console.anthropic.com](https://console.anthropic.com) → API keys → crea una key
2. Aggiungi minimo $5 di credito (saldo prepagato)
3. Su Vercel aggiungi:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   AI_PROVIDER=anthropic
   ```
4. Redeploy

Costo previsto: ~€0.50 per ogni 1000 conversazioni con Claude Haiku.

Per tornare a Gemini: imposta `AI_PROVIDER=gemini` (o rimuovi la variabile).

---

## 📁 File modificati in v3

```
NUOVI:
├── api/chat.ts                          serverless function (Gemini + Claude)
└── vercel.json                          config functions

MODIFICATI:
├── src/components/Chatbot.tsx          ora chiama /api/chat invece di Gemini diretto
├── package.json                         + @anthropic-ai/sdk, @vercel/node

INVARIATI rispetto a v2:
├── tutto il resto (editor inline, leads, etc.)
```

---

## ❓ Problemi comuni v3

**Chatbot dice "Configurazione chatbot incompleta"**
→ Manca `GEMINI_API_KEY` (senza prefisso VITE_) nelle env Vercel. Aggiungila e redeploy.

**Chatbot dice "Problema di connessione"**
→ La function `/api/chat` non risponde. Vai su Vercel → Logs → trova l'errore.

**Lead non vengono salvati nonostante l'email sia stata data**
→ Manca `SUPABASE_SERVICE_KEY` o è quella sbagliata. Verifica sia la **Secret key**, non la Publishable.

**Voglio usare Claude ma dà errore "ANTHROPIC_API_KEY missing"**
→ Hai messo `AI_PROVIDER=anthropic` ma non hai aggiunto la chiave. O aggiungi la chiave, o togli `AI_PROVIDER` (torna a Gemini).

**Errore "Module not found: @anthropic-ai/sdk" in build**
→ Vercel non ha installato le nuove dipendenze. Forza un redeploy con "Use existing build cache" disattivato.
