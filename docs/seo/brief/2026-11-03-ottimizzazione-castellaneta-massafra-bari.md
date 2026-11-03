# Brief SEO: rafforzare Castellaneta, Massafra, Bari e "gestione social Palagianello" (03/11/2026)

**Da:** responsabile SEO → **A:** Sito Inlab (session_011S4HYEoovHviMzacnSR2wm)
**Richiesta di Nicola (03/11):** queste pagine sono peggiorate, vanno ottimizzate.

## Dati di Search Console (20/09 – 01/11)

| Pagina | Prima | Ultime settimane | Impressioni totali |
|---|---|---|---|
| /agenzia-comunicazione-castellaneta | posizione 3-6 | posizione 10 | 29 |
| /agenzia-comunicazione-massafra | posizione 12 | posizione 23 | 6 |
| /agenzia-comunicazione-bari | posizione 10 | non compare | 18 |
| /gestione-social-palagianello | posizione 12 | posizione 68 | 14 |

- **I numeri sono piccoli:** in questi paesi le ricerche sono poche e Google nasconde quasi tutte le query.
- **Le cause che si vedono sul sito sono quattro:**
  1. **Castellaneta compete con la home.**
     - La home ha title "InLab Communication Castellaneta | Agenzia di comunicazione" e description "Agenzia di comunicazione a Castellaneta (TA)…".
     - Google sceglie tra due pagine per la stessa ricerca e le indebolisce entrambe.
     - In più la pagina Castellaneta ripete un blocco su Castellaneta Marina, che ha già la sua pagina.
  2. **Massafra e Bari non mostrano nessun lavoro.**
     - Non hanno il blocco "I nostri lavori": sono le uniche tra i paesi principali.
     - Hanno meno testo: circa 1.230 parole contro le 1.450-1.550 di Mottola e Palagianello, che invece salgono.
  3. **Su Palagianello ci sono troppe pagine con lo stesso titolo.**
     - /gestione-social-palagianello ha title "Social media manager a Palagianello". È lo stesso tema della pagina di Nicola: "Nicola Carpignano, social media manager a Palagianello".
     - Tre schede cliente hanno title "Gestione social a Palagianello: …" (DIRAM, Masseria Sacramento, Sublime Tentazione).
     - Google non sa quale mostrare per "gestione social Palagianello". La pagina principale è scesa dalla posizione 12 alla 68.
  4. **Il blog non collega mai** le pagine agenzia di Castellaneta, Massafra e Bari.

## Richieste per lo sviluppo
Un commit per punto. Non cambiare gli URL, non aggiungere redirect.

### 1. Castellaneta: la home porta il marchio, la pagina città porta la ricerca locale
> **Decisione di Nicola (03/11): la home NON si tocca.** Title e description restano con "Castellaneta", perché la home è forte su quella ricerca (posizione 4-6). Le 3 voci sulla home qui sotto sono **annullate**. Si applica solo la parte sulla pagina città, che rafforza la sede e il paese senza togliere niente alla home.

- ~~**Home: title.**~~ ANNULLATO.
  - Da "InLab Communication Castellaneta | Agenzia di comunicazione"
  - a "InLab Communication | Agenzia di comunicazione in provincia di Taranto".
- **Home: description.** "InLab Communication, agenzia di comunicazione con sede a Castellaneta (TA): social, video, siti, branding e Meta Ads per aziende della provincia di Taranto e della Puglia."
  - Castellaneta resta nel testo come sede, ma la ricerca "agenzia di comunicazione Castellaneta" va alla pagina dedicata.
- **Home: link.** Nel testo della home, link con testo esatto "agenzia di comunicazione a Castellaneta" → `/agenzia-comunicazione-castellaneta`, nella prima metà della pagina.
  - Oggi il link c'è ma non è nel testo principale. Se è già così, lascialo.
- **Pagina Castellaneta: title.** "Agenzia di comunicazione a Castellaneta (TA) | InLab, Via Regina Margherita 26".
  - Va sotto i 65 caratteri. Se lo supera, togli "(TA)".
- **Pagina Castellaneta: H2 "Castellaneta Marina".**
  - Accorcialo a 1 frase con link "Agenzia di comunicazione a Castellaneta Marina" → `/agenzia-comunicazione-castellaneta-marina`.
  - Al suo posto metti un H2 **"La nostra sede a Castellaneta"** con questo testo: "Siamo in Via Regina Margherita 26, nel centro di Castellaneta. Qui incontriamo i clienti, prepariamo le strategie e partiamo per le riprese. Per un'attività del paese vuol dire avere l'agenzia a pochi passi: si passa in studio, si gira in negozio la mattina stessa, si guarda insieme il lavoro."
  - Aggiungi il link "Indicazioni su Google Maps" (`https://www.google.com/maps/search/?api=1&query=InLab+Communication+Via+Regina+Margherita+26+Castellaneta`).
- **Pagina Castellaneta: FAQ.** Aggiungi in `altreFaq`: "Posso venire in agenzia?" → "Sì: siamo in Via Regina Margherita 26 a Castellaneta. Scrivici o chiamaci per fissare un incontro."
- **Prima di applicare:** verifica che il cambio del title della home non tocchi og:title e i dati strutturati Organization (nome "InLab Communication" invariato).

### 2. Massafra: mostrare lavori veri e un testo più ricco
- **Blocco lavori.** Aggiungi il blocco "Lavori vicino a Massafra" con i 6 lavori più vicini, come nei lotti nuovi: Palagianello, Mottola e Castellaneta.
- **contesto (aggiunta in coda):** "Massafra è conosciuta per le gravine e le chiese rupestri, come quella della Madonna della Scala, e per il Carnevale massafrese, uno dei più seguiti della Puglia. È il comune più grande tra Taranto e Castellaneta, con commercio e servizi che lavorano con tutta la zona."
- **altreFaq**, due domande:
  - "Seguite la comunicazione di eventi come il Carnevale?" → "Sì: grafiche, reel, dirette e sponsorizzate per far conoscere eventi e serate, prima e durante."
  - "Siete vicini a Massafra?" → "Sì: la nostra sede a Castellaneta è a circa 20 minuti. Veniamo in negozio per incontri, foto e video."
- **Link.** Nel testo di `/agenzia-comunicazione-palagiano` e di `/agenzia-comunicazione-taranto`, un link contestuale "agenzia di comunicazione a Massafra" → `/agenzia-comunicazione-massafra`, dove il testo parla dei paesi vicini.

### 3. Bari: punto di riferimento per la provincia
- **Title.** "Agenzia di comunicazione a Bari e provincia | InLab".
- **Blocco lavori.** Aggiungi il blocco "I nostri lavori" con i 6 lavori più vicini.
- **Nuovo H2 "Bari e provincia".** Testo: "Lavoriamo con attività di Bari e di tutta la provincia, dalla costa alla Murgia." Poi i link alle pagine agenzia dei comuni della provincia già online:
  - Monopoli, Polignano a Mare, Conversano, Castellana Grotte, Putignano;
  - Turi, Noci, Gioia del Colle, Acquaviva delle Fonti, Santeramo in Colle;
  - Altamura, Gravina in Puglia, Molfetta;
  - Cassano delle Murge, quando è online con il lotto 5.
- **Link di ritorno.** Nelle pagine agenzia di quei comuni, un link di ritorno con testo "agenzia di comunicazione a Bari e provincia" → `/agenzia-comunicazione-bari`, vicino al campo `provincia`. Basta una riga nel template, solo per le città con `provincia` = "provincia di Bari".
- **Il legame vero con Bari.** Nell'intro o nel focus: "Nicola Carpignano insegna marketing e social media nei master di EA Formazione a Bari", con link alla pagina autore `/autori/nicola-carpignano-social-media-manager-palagianello`. Il fatto è già nei dati strutturati (`routes.ts`, teaching).

### 4. Palagianello: una pagina per ogni ricerca
- **`/gestione-social-palagianello`.** Title da "Social media manager a Palagianello | InLab Communication" a **"Gestione social a Palagianello | InLab Communication"**, uguale all'H1.
  - La ricerca "social media manager Palagianello" la tiene la pagina di Nicola.
- **Schede cliente:** il nome dell'attività va prima del paese. Le ricerche col nome funzionano già (es. "sublime tentazione palagianello", posizione 8).
  - `/cliente/sublime-tentazione` → "Sublime Tentazione, pasticceria a Palagianello | InLab"
  - `/cliente/diram-autoricambi` → "DIRAM Autoricambi, Palagianello: social | InLab"
  - `/cliente/masseria-sacramento` → "Masseria Sacramento, Palagianello: social | InLab"
- **Link.** Ogni scheda mantiene il link a `/gestione-social-palagianello`, con il testo "gestione social a Palagianello".
- Questo **corregge in parte** la regola dei title cliente del brief del 10/10: il servizio e il paese restano nel title, ma dopo il nome.

## Per l'Addetto al Blog (lo avviso io)
- Nei prossimi articoli locali, link a `/agenzia-comunicazione-castellaneta`, `/agenzia-comunicazione-massafra` e `/agenzia-comunicazione-bari` dove il tema lo permette.

## Cosa misuro
- **Dopo 2 e 4 settimane:**
  - posizione e impressioni delle 4 pagine;
  - quale pagina compare per "agenzia di comunicazione Castellaneta": dovrebbe essere quella dedicata;
  - la home deve restare stabile sulle ricerche del marchio "InLab".
- **Se la home perde clic sulle ricerche del marchio:** rimettiamo "Castellaneta" nel title della home.
