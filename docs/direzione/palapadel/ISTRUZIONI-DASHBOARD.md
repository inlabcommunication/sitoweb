# Pala Padel: cosa fare in dashboard (piano di Sito Inlab, 17/11) — con testi pronti da incollare

Il sito legge i casi studio da Firestore (non dal codice): il caso si inserisce dalla dashboard. Sito Inlab controlla i dati salvati prima della pubblicazione. Il consenso del cliente c'è (Nicola, 17/11).

## 1) Libreria media: carica da `docs/direzione/palapadel/`
- 5 screenshot mobile (home-news, classifica-serie-a, calendario-risultati-set, scheda-squadra, albo-oro)
- 2-3 screenshot desktop dell'area organizzatore (dashboard-organizzatore, giornata-risultati, inserimento-risultato-set)
- logo su sfondo crema
- video MP4 di navigazione (22 s, 2,5 MB)

## 2) Non solo contenuti → nuovo caso
- Cliente: PalaPadel Club
- Indirizzo pagina (ID): `palapadel-club` (pagina: /casi-studio/palapadel-club)
- Titolo: La web app dei campionati di padel
- Categoria: Web app
- Problema: Classifiche e risultati di più campionati da tenere aggiornati a mano e da comunicare ai giocatori.
- Risultato: Una web app che calcola da sola le classifiche e che i giocatori consultano dal telefono, senza login.
- Località: VUOTA
- **Pubblica: NON spuntato** (per ora)
- Hero: un'immagine mobile; bottone "Apri l'app" con indirizzo https://palapadel-c3tj-theta.vercel.app

## 3) Blocchi (in quest'ordine)
1. **Testo** "Il problema": Tenere aggiornate a mano classifiche e risultati di più campionati fa perdere tempo, porta errori e costringe a rimandare i messaggi a tutti. Serviva un posto unico, sempre aggiornato, da consultare dal telefono.
2. **Fasi** "Cosa abbiamo costruito" (6 voci): Classifiche per serie e stagione, aggiornate in automatico, con spareggi (partite giocate, scontri diretti, differenza game) / Calendario per giornata con data, ora, campo e risultato set per set / Scheda squadra con rosa, statistiche e titoli / Albo d'oro di tutte le stagioni / News in Home e notifiche push su richiesta / Area organizzatore: risultati set per set, correzioni, rinvii, import da Excel o testo, ruoli e registro delle operazioni.
3. **Sito web**: indirizzo dell'app; screenshot desktop caricato a mano (quello automatico vedrebbe solo il login); "Testo del bottone": Apri l'app.
4. **Galleria**: le immagini; il titolo del blocco deve dire "Schermate con dati di esempio" (non c'è una didascalia per singola immagine).
5. **Reel**: embed vuoto + "video MP4 dalla libreria".
6. **Checklist** "Come funziona per chi gioca": Consultabile da tutti, senza login / Installabile sul telefono (Android e iPhone) con l'icona sulla schermata Home / Notifiche solo se l'utente le attiva.
- NESSUN blocco numeri, NESSUNA citazione.

## 4) Scheda cliente (facoltativa)
- Dal caso: "Crea scheda cliente da questo caso" → finisce in "Collaborazioni su misura", in bozza. **NON metterla in "Progetti raccontati"**: la striscia loghi della home cambierebbe.

## 5) Salva e avvisa il Direttore
- Sito Inlab legge i dati (lettura pubblica) e controlla: nessuna funzione inesistente (prenotazioni, iscrizioni, pagamenti), nessuna cifra o prezzo, link solo https, dicitura "dati di esempio", nessuna località, bozza attiva.
- Se è tutto ok: spunti "Pubblica" e salvi (il salvataggio rifà il deploy). Sito Inlab verifica /casi-studio/palapadel-club (200, index, canonical), sitemap 217→218 (219 con la scheda), IndexNow, home invariata.

## Dopo (SEO)
- Esempio nella pagina servizio (es. /siti-web o /automazioni-ai) dalla dashboard, tipo caso studio con palapadel-club: pagina da scegliere dall'Addetto SEO.
