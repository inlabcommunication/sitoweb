# InLab Communication — sito web

Sito di InLab Communication (React 19 + Vite + TypeScript) con dashboard admin e chatbot AI, pubblicato su Vercel.

## Struttura

```
src/
  main.tsx          routing: /#/admin → dashboard (caricata a parte), resto → sito
  App.tsx           sito pubblico (pagine, stili globali nel componente <G/>)
  sections/         sezioni della home
  pages/            pagine dei casi studio (caricate on-demand)
  components/       Chatbot
  admin/            dashboard: contenuti, media, lead, analytics, impostazioni
  lib/
    firebaseConfig.ts  config Firebase (variabili VITE_FIREBASE_*)
    firestoreLite.ts   Firestore "lite" lazy per il sito pubblico
    firebase.ts        SDK completo (Auth + Firestore), solo per /admin
    content.ts         contenuti del sito (Firestore app/site_content + fallback in constants.ts)
    analytics.ts       tracking pageview/scroll/click
api/
  chat.ts           funzione serverless Vercel del chatbot (Gemini o Claude)
```

## Sviluppo

```bash
npm install
cp .env.example .env.local   # poi compila i valori
npm run dev                  # http://localhost:3000
npm run lint                 # controllo TypeScript
npm run build                # build di produzione in dist/
```

Configurazione di Firebase, Vercel e chatbot: vedi [SETUP.md](SETUP.md).
