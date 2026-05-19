# 🚀 INLAB Dashboard — Setup

Guida passo-passo per attivare dashboard, analytics, chatbot AI ed editor contenuti.

**Tempo totale: ~15 minuti.**

---

## Cosa hai ora

Il tuo sito InLab ha ricevuto 4 funzionalità nuove, tutte accessibili da `tuosito.it/#/admin`:

1. **📊 Analytics** — visitatori reali, pagine viste, scroll medio, dispositivi, provenienza, engagement per sezione
2. **👥 Lead** — contatti raccolti dal chatbot, con stato, note, conversazione, export CSV
3. **✏️ Editor** — modifica testi, stats, servizi, portfolio del sito → salvi → live per i visitatori
4. **🤖 Chatbot AI** (sul sito pubblico) — conversa con i visitatori, cattura email, salva nei lead

Tutto richiede **un account Supabase** (gratuito) e **una API key Gemini** (gratuita).

---

## Passo 1 — Account Supabase (5 min)

1. Vai su **[supabase.com](https://supabase.com)** → "Start your project" → registrati con email o GitHub.
2. Clicca **"New project"**:
   - Nome: `inlab-communication` (o quello che vuoi)
   - Password database: generane una forte e **salvala** (potrebbe servirti dopo)
   - Region: **Frankfurt** (più vicina all'Italia)
   - Plan: **Free** (ti basta e avanza)
3. Aspetta 1-2 minuti che il progetto venga creato.

## Passo 2 — Crea le tabelle (1 min)

1. Nel pannello Supabase, sidebar a sinistra → **SQL Editor**.
2. Clicca **"New query"**.
3. Apri il file `supabase/schema.sql` del tuo progetto, copia **tutto** il contenuto.
4. Incolla nel SQL Editor e clicca **"Run"** (in basso a destra).
5. Dovresti vedere "Success. No rows returned" — perfetto.

## Passo 3 — Crea utente admin (1 min)

1. Sidebar → **Authentication** → **Users** → **"Add user"** → **"Create new user"**.
2. Email: la tua email
3. Password: scegline una forte
4. Spunta **"Auto Confirm User"** (così non devi confermare l'email)
5. Clicca **"Create user"**.

Questa sarà la tua credenziale per entrare in `/admin`.

## Passo 4 — Copia le chiavi (1 min)

1. Sidebar → **Settings** (icona ingranaggio) → **API**.
2. Copia in un foglio temporaneo:
   - **Project URL** → andrà in `VITE_SUPABASE_URL`
   - **anon public key** (la prima, lunga) → andrà in `VITE_SUPABASE_ANON_KEY`

⚠️ La **service_role** NO — quella è segreta, non usarla mai nel frontend.

## Passo 5 — API key Gemini (2 min)

1. Vai su **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)**.
2. Accedi con il tuo Google account.
3. Clicca **"Create API key"** → seleziona o crea un progetto Google Cloud → copia la chiave.
4. La incollerai in `VITE_GEMINI_API_KEY`.

Il piano gratuito di Gemini ti dà 1500 richieste/giorno — più che sufficienti per il chatbot.

## Passo 6 — Configura il file .env (1 min)

Nella cartella del progetto:

```bash
cp .env.example .env
```

Apri `.env` e sostituisci i placeholder con i valori veri:

```
VITE_SUPABASE_URL=https://abcdefghijkl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_GEMINI_API_KEY=AIzaSy...
```

## Passo 7 — Installa la nuova dipendenza e avvia

```bash
npm install
npm run dev
```

---

## ✅ Test che tutto funzioni

1. Apri `http://localhost:3000` → in basso a destra dovresti vedere il bottone viola del chatbot. Prova a parlarci.
2. Apri `http://localhost:3000/#/admin` → schermata di login. Entra con email/password del Passo 3.
3. Una volta dentro:
   - **Analytics** sarà vuoto finché non ricevi visite
   - **Lead** mostrerà le conversazioni del chatbot man mano che le persone lasciano l'email
   - **Editor** ti permette di modificare ogni testo del sito → salva → ricarica la home per vederlo

---

## 🌐 Quando metti il sito online

Quando deployi su Vercel/Netlify/Cloudflare Pages:

1. Aggiungi le 3 variabili d'ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GEMINI_API_KEY`) nel pannello del provider.
2. Le visite reali appariranno in Analytics.

**URL della dashboard online**: `https://tuosito.it/#/admin`

---

## 🔐 Sicurezza — riepilogo

- La `anon key` di Supabase è **pubblica per design** — la protezione è nel Row Level Security (già configurato nello schema).
- Solo gli utenti autenticati possono leggere lead e analytics o modificare contenuti.
- Il chatbot/visitatore può **solo** inserire eventi e lead, non leggere niente.
- Le chiavi `.env` non vanno mai committate (aggiungi `.env` al `.gitignore` se non c'è già).

---

## ❓ Problemi comuni

**"Variabili Supabase mancanti" in console** → il file `.env` non c'è o ha nomi sbagliati. Devono iniziare con `VITE_`.

**Il chatbot non risponde** → manca `VITE_GEMINI_API_KEY` o ha quota esaurita. Controlla la console del browser.

**Login admin fallisce** → utente non creato, o "Auto confirm" non spuntato. Vai su Authentication → Users e verifica.

**Analytics vuoto anche dopo molte visite** → controlla la console del browser per errori RLS. Verifica che le policy del file `schema.sql` siano state create (SQL Editor → fai una query: `select * from analytics_events limit 1;`).

**L'editor salva ma il sito non si aggiorna** → svuota cache browser (Ctrl+Shift+R). Il contenuto è cached in memoria per la sessione corrente.

---

## 📂 File creati/modificati

```
NUOVI:
├── supabase/schema.sql               schema database
├── src/lib/supabase.ts               client DB
├── src/lib/analytics.ts              tracker visite/scroll
├── src/lib/content.ts                loader contenuti dinamici
├── src/components/Chatbot.tsx        chatbot AI Gemini
├── src/admin/AdminApp.tsx            shell admin + login
├── src/admin/Analytics.tsx           dashboard analytics
├── src/admin/Leads.tsx               gestione lead
├── src/admin/ContentEditor.tsx       editor stile Shopify
├── .env.example                      template variabili
└── SETUP.md                          (questo file)

MODIFICATI:
├── src/main.tsx                      routing /admin vs sito
├── src/App.tsx                       + Chatbot + init analytics
└── package.json                      + @supabase/supabase-js
```

Il file `src/constants.ts` è **invariato** e rimane il fallback se Supabase non è raggiungibile — così il sito funziona anche se il DB ha problemi.
