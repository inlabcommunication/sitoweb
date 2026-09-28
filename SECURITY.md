# Sicurezza — cosa è protetto e cosa fare nelle console esterne

## Cosa fa il codice (già attivo)

| Rischio | Protezione |
|---|---|
| Chiavi AI rubate | Le chiavi Gemini/Anthropic stanno **solo** nelle variabili d'ambiente di Vercel. La dashboard non le salva più e il server non le legge dal database. |
| Qualcuno usa il chatbot per spendere il credito AI | `/api/chat` accetta solo richieste dal vostro dominio, valida lunghezza e forma dei messaggi e ha limiti: **15 messaggi ogni 10 minuti e 60 al giorno per visitatore**, **400 messaggi al giorno in totale** (tetto di spesa). Configurabili con `CHAT_LIMIT_PER_IP_10MIN`, `CHAT_LIMIT_PER_IP_DAY`, `CHAT_DAILY_LIMIT`. |
| Il chatbot rivela istruzioni o dati | Il prompt vieta di rivelare istruzioni e dettagli tecnici; al browser arriva solo il testo della risposta, mai errori interni o dati di utilizzo. |
| Furto dei dati dei clienti (lead) | Il browser **non può più leggere né scrivere** i lead: li salva solo il server (`/api/lead`, `/api/chat`). Leggibili solo dagli admin, tramite regole Firestore. |
| Spam dal modulo contatti | Validazione lato server, campo trappola anti-bot, tempo minimo di compilazione, max 5 invii all'ora per visitatore. |
| Accesso alla dashboard | Serve un account Firebase **e** un documento `admins/{uid}`: gli altri account vedono "Accesso negato" e le regole bloccano comunque i dati. |
| Upload abusivi su Cloudinary | Gli upload sono **firmati** dal server solo per admin verificati (`/api/cloudinary-sign`). |
| Attacchi dal browser (XSS, clickjacking…) | Intestazioni di sicurezza su tutto il sito: Content-Security-Policy restrittiva, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy. |
| Codice visibile | Il codice del sito nel browser è sempre visibile (vale per ogni sito): per questo **nessun segreto** è nel codice pubblico. Verificato sul bundle e nella storia git. |

## ⚠️ Da fare nelle console (non si può fare dal codice)

### 1. Rigenera le chiavi AI (importante)
Le chiavi erano salvabili nel database e potrebbero essere state lette.
1. **Google AI Studio** → API keys → elimina la chiave vecchia e creane una nuova.
2. **Anthropic Console** (se usata) → API keys → revoca e crea una nuova.
3. Su **Vercel → Settings → Environment Variables** inserisci `GEMINI_API_KEY` (e `ANTHROPIC_API_KEY`) con le chiavi nuove, poi **Redeploy**.
4. In dashboard → Impostazioni premi **Salva impostazioni**: cancella dal database le chiavi vecchie.

### 2. Metti un tetto di spesa ai provider AI
- Google Cloud → Billing → **Budget e avvisi** (es. 10 €/mese con avviso) e, in AI Studio, limiti di quota.
- Anthropic Console → Settings → **Limits**: imposta un limite mensile.

### 3. Pubblica le regole Firestore
Firebase Console → Firestore Database → **Regole** → incolla il contenuto di `firestore.rules` → **Pubblica**.

### 4. Crea gli admin
1. Firebase Console → Authentication → Users: copia l'**UID** del tuo utente.
2. Firestore → **Avvia raccolta** `admins` → documento con ID = quell'UID (un campo qualsiasi, es. `email`).
3. Ripeti per ogni persona che deve entrare in dashboard.

### 5. Blocca le registrazioni pubbliche
Firebase Console → Authentication → Settings → **User actions** → disattiva *Enable create (sign-up)*. Gli utenti li crei tu da *Users → Add user*. Usa password lunghe e uniche.

### 6. Limita la chiave pubblica di Firebase
Google Cloud Console → APIs & Services → Credentials → chiave "Browser key" → **Application restrictions: HTTP referrers** → aggiungi il tuo dominio (e `*.vercel.app` se usi le anteprime).

### 7. Cloudinary
1. Settings → Upload → preset `ml_default` → **Signing mode: Signed**.
2. Su Vercel aggiungi `CLOUDINARY_API_SECRET` (Settings → API Keys di Cloudinary) e Redeploy.
Finché il preset resta "Unsigned", chiunque conosca il nome del cloud può caricare file.

### 8. Pulizia automatica dei contatori (consigliato)
Firestore → **TTL** → aggiungi una policy sul campo `expireAt` della raccolta `_ratelimits`.

### 9. Variabile consigliata
`RATE_LIMIT_SALT` su Vercel con una stringa casuale lunga (rende anonimi gli IP nei contatori).
