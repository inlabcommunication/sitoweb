# Guida configurazione

## Variabili d'ambiente

Su **Vercel → progetto → Settings → Environment Variables** (in locale: `.env.local`).

### Firebase (browser)

Da *console.firebase.google.com → Project Settings → Your apps → Config*:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Firebase Admin (solo server, usato da `/api/chat`)

Da *Project Settings → Service Accounts → Generate new private key*, tutto il JSON su una riga:

```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

⚠️ Senza prefisso `VITE_`: non deve mai finire nel browser.

### Chatbot AI (solo server)

```
AI_PROVIDER=gemini            # oppure "anthropic"
GEMINI_API_KEY=AIzaSy...
ANTHROPIC_API_KEY=sk-ant-...  # solo se AI_PROVIDER=anthropic
```

Provider, modello e chiavi si possono anche impostare dalla dashboard (*Impostazioni*): quei valori, salvati in Firestore `app/settings`, hanno la precedenza sulle variabili d'ambiente.

### Dominio del sito (SEO)

```
VITE_SITE_URL=https://www.tuodominio.it
```

Serve per canonical, sitemap, robots.txt e anteprime social. Senza questa variabile viene usato `https://sitoweb-beta.vercel.app`. Dopo averla cambiata serve un redeploy.

## SEO

- Ogni pagina ha un indirizzo vero (`/servizi`, `/gestione-social-taranto`, `/casi-studio/ricciardi`…); i vecchi link `/#/…` vengono reindirizzati.
- Titoli, descrizioni e dati strutturati sono in `src/seo/routes.ts`.
- In build (`npm run build`) lo script `scripts/prerender.ts` crea un HTML per ogni pagina con il `<head>` già corretto, più `sitemap.xml` e `robots.txt`.
- **Google Search Console**: aggiungi la proprietà del dominio, verifica (record DNS o file HTML in `public/`), poi invia `https://www.tuodominio.it/sitemap.xml`.

## Dati in Firestore

| Documento / collezione | Contenuto | Chi scrive |
|---|---|---|
| `app/site_content` | testi e immagini del sito | admin |
| `app/settings` | provider AI e chiavi | admin |
| `leads` | contatti da form e chatbot | form pubblico, `/api/chat` |
| `analytics_events` | pageview, scroll, click | sito pubblico |

## Sicurezza — da verificare nella console Firebase

- **Authentication**: disattiva la registrazione pubblica (*Settings → User actions → Enable create (sign-up)*) e crea gli admin a mano (*Users → Add user*).
- **Regole Firestore**: `app/settings` e `leads` devono essere leggibili solo dagli admin; il sito pubblico deve poter solo *leggere* `app/site_content` e solo *creare* documenti in `leads` e `analytics_events`.

## Dashboard

Vai su `/admin` e accedi con un utente creato in Firebase Authentication.

## Deploy

Push sul branch collegato a Vercel. Se cambi le variabili d'ambiente serve un redeploy (*Deployments → ⋯ → Redeploy*).

## Problemi comuni

- **Chatbot: "Configurazione mancante"** → manca la chiave del provider scelto (env o *Impostazioni*).
- **Chatbot: "problema tecnico"** → guarda *Vercel → Logs* della funzione `/api/chat`.
- **Dashboard: "non configurata"** → mancano le variabili `VITE_FIREBASE_*` (serve un nuovo build).
