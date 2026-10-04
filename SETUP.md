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

Dalla dashboard (*Impostazioni*) si scelgono solo provider e modello. **Le chiavi si impostano esclusivamente qui su Vercel**, mai nel database.

### Sicurezza (vedi [SECURITY.md](SECURITY.md))

```
CLOUDINARY_API_SECRET=...     # firma degli upload dalla dashboard
RATE_LIMIT_SALT=...           # stringa casuale lunga
CHAT_DAILY_LIMIT=400          # opzionale: tetto giornaliero di messaggi al chatbot
```

### Dominio del sito (SEO)

```
VITE_SITE_URL=https://www.tuodominio.it
```

Serve per canonical, sitemap, robots.txt e anteprime social. Senza questa variabile viene usato `https://sitoweb-beta.vercel.app`. Dopo averla cambiata serve un redeploy.

### Google Analytics e Search Console

```
VITE_GA_ID=G-XXXXXXXXXX          # Analytics → Amministrazione → Stream di dati → ID misurazione
VITE_GSC_VERIFICATION=...         # Search Console → metodo "Tag HTML" (codice o intero <meta>)
```

- Analytics parte **solo dopo il consenso** dal banner cookie (Accetta/Rifiuta); eventi inviati: `page_view`, `generate_lead` (modulo contatti), `contact_click` (telefono/email/WhatsApp), `social_click`.
- Informativa in `/privacy` (`src/pages/PrivacyPage.tsx`): va verificata e tenuta aggiornata.
- Dopo aver impostato le variabili serve un **Redeploy**.

## SEO

- Ogni pagina ha un indirizzo vero (`/servizi`, `/gestione-social-taranto`, `/casi-studio/ricciardi`…); i vecchi link `/#/…` vengono reindirizzati.
- Titoli, descrizioni e dati strutturati sono in `src/seo/routes.ts`.
- In build (`npm run build`) lo script `scripts/prerender.ts` crea un HTML per ogni pagina con il `<head>` già corretto, più `sitemap.xml` e `robots.txt`.
- **Google Search Console**: aggiungi la proprietà del dominio, verifica (record DNS o file HTML in `public/`), poi invia `https://www.tuodominio.it/sitemap.xml`.

## Dati in Firestore

| Documento / collezione | Contenuto | Chi scrive |
|---|---|---|
| `app/site_content` | testi e immagini del sito | admin |
| `blog_posts` | articoli del blog (pubblici solo se `published`) | admin |
| `app/settings` | provider/modello AI e informazioni per il chatbot | admin |
| `leads` | contatti da form e chatbot | solo server: `/api/lead`, `/api/chat` |
| `admins` | UID degli amministratori | a mano dalla console |
| `analytics_events` | pageview, scroll, click | sito pubblico |

## Sicurezza

Tutti i passaggi (regole Firestore, admin, chiavi, Cloudinary) sono in **[SECURITY.md](SECURITY.md)**.

## Casi studio, clienti ed esempi

Dashboard → Editor:
- **Casi studio → Progetti raccontati**: schede clienti (aggiungi, modifica, riordina, elimina), con logo, immagine hero, foto e reel. Per ogni reel carichi il video, che si guarda sul sito, e il link Instagram.
- **Casi studio → Non solo contenuti**: casi studio a blocchi (testo, fasi, sito web, numeri, reel, foto, citazione). La pagina mostra solo i blocchi compilati.
- **Servizi → Esempi per servizio**: i lavori mostrati in fondo a ogni pagina servizio (siti e web app, schede clienti, casi studio).

I valori iniziali sono in `src/constants.ts`, `src/data/caseStudies.ts` e `src/data/serviceExamples.ts`. Dopo il primo salvataggio dalla dashboard vale quello che è salvato in Firestore.

## Blog

- Pagine: `/blog` e `/blog/<indirizzo>`. Gli articoli iniziali sono in `src/data/blogSeed.ts`; quelli nuovi si scrivono in dashboard → **Blog** (salvati in Firestore `blog_posts`).
- Un articolo pubblicato è visibile subito. Per inserirlo anche nella sitemap e nell'HTML pre-generato serve un nuovo deploy: crea un *Deploy Hook* su Vercel (*Settings → Git → Deploy Hooks*, branch `main`) e salvalo come variabile `VERCEL_DEPLOY_HOOK_URL`; poi in dashboard basta il pulsante **Aggiorna per Google**.

## Dashboard

Vai su `/admin` e accedi con un utente creato in Firebase Authentication **e presente in `admins/{uid}`** (vedi SECURITY.md).

## Deploy

Push sul branch collegato a Vercel. Se cambi le variabili d'ambiente serve un redeploy (*Deployments → ⋯ → Redeploy*).

## Problemi comuni

- **Chatbot non risponde** → apri la console del browser (F12): il codice dopo `[chatbot] errore server:` indica la causa (NO_KEY, AI_KEY, AI_QUOTA, AI_MODEL, SERVER).
- **Cosa sa il chatbot** → servizi, sede e contatti sono in `api/chat.ts`; il resto (FAQ, orari, pacchetti…) si scrive in dashboard → Impostazioni → *Informazioni per il chatbot*.
- **Chatbot: "problema tecnico"** → guarda *Vercel → Logs* della funzione `/api/chat`.
- **Dashboard: "non configurata"** → mancano le variabili `VITE_FIREBASE_*` (serve un nuovo build).
