# Brief SEO: 1 ottobre 2026 — pagine città diverse tra loro e pagine "agenzia di comunicazione e marketing a {città}"

**Da:** responsabile SEO → **A:** Sito Inlab (richieste per lo sviluppo)
**Richiesta di Nicola (01/10):** "perché oltre a social a {paese} non facciamo
anche marketing a? Inoltre differenzia le pagine, se sono troppo uguali Google
non le valuta."

---

## Cosa ho misurato (sito online, 01/10)

| Pagina | Parole | Sezione "Clienti a {città}" |
|---|---|---|
| /gestione-social-taranto | 541 | sì |
| /gestione-social-mottola | 578 | sì |
| /gestione-social-ginosa | 505 | **no** (Paresteta è a Ginosa ma non compare) |
| /gestione-social-gravina-in-puglia | 521 | no |

- Il testo è lo stesso modello per tutte le 56 pagine. Cambiano solo il nome
  della città, il servizio e, dove ci sono, i clienti (circa 60 parole su 550,
  dato dell'analisi competitor). Google rischia di considerarle "pagine in
  serie" e di non indicizzarle.
- **Errore:** la pagina di Gravina in Puglia dice 3 volte "provincia di
  Taranto". Gravina è in **provincia di Bari** (Città metropolitana di Bari).
- Frasi del modello da correggere perché non verificabili o uguali ovunque:
  - "l'agenzia di comunicazione di riferimento a {città}";
  - "Risposta garantita entro 24 ore, sempre" (è una promessa: Nicola non l'ha confermata);
  - "Non siamo un'agenzia milanese…";
  - "conosciamo… i competitor che devi battere".

---

## Richieste per lo sviluppo (per Sito Inlab)

### 1. Dati propri per ogni città, priorità alta
- **File:** nuovo `src/data/cities.ts`, letto da `PageCittaSEO` (`src/App.tsx`, circa riga 1393) e da `scripts/prerender.ts`.
- **Contenuto:** per ogni città `{ name, provincia, contesto, settori[], faq }`.
- **Dove compaiono nella pagina:**
  - `contesto` sostituisce i due paragrafi generici di "Conosciamo il territorio";
  - `settori` diventa un elenco nuovo, "Le attività con cui lavoriamo a {città}";
  - `faq` è una domanda con risposta, in fondo alla pagina.
- **Provincia:** si usa `provincia` al posto di "provincia di Taranto" scritto fisso.

I testi sono qui sotto. Sono fatti noti e verificabili sulle città, senza
numeri, prezzi o promesse.

**Taranto** — provincia: "provincia di Taranto"
- *Contesto:* Taranto è il capoluogo della provincia e la "città dei due mari", tra Mar Grande e Mar Piccolo. Ha la Città Vecchia sull'isola, il Borgo con le vie dello shopping e il MArTA, il Museo Archeologico Nazionale. Per un'attività di Taranto la concorrenza è più alta che nei paesi vicini: farsi trovare su Google e avere social curati fa la differenza tra chi viene scelto e chi resta invisibile.
- *Settori:* negozi e commercio del Borgo; ristoranti, bar e locali sul lungomare; studi professionali e medici; eventi e attività culturali.
- *FAQ:* "Lavorate con attività di Taranto città?" → "Sì. Siamo a Castellaneta, a meno di un'ora, e veniamo a Taranto per incontri, shooting e riprese. Il resto del lavoro lo seguiamo a distanza, con un contatto diretto con Nicola e Ilaria."

**Castellaneta** — provincia: "provincia di Taranto"
- *Contesto:* Castellaneta è la nostra sede. È la città di Rodolfo Valentino, affacciata sulla gravina, con la marina sulla costa ionica: Castellaneta Marina vive di turismo estivo, villaggi, lidi e ristorazione. Qui conosciamo di persona le attività e i ritmi dell'anno, dalla stagione estiva al lavoro dei mesi invernali.
- *Settori:* lidi, villaggi e strutture turistiche di Castellaneta Marina; ristoranti e bar; negozi del centro; artigiani e aziende agricole.
- *FAQ:* "Avete un ufficio a Castellaneta?" → "Sì, InLab Communication ha sede a Castellaneta (TA). Possiamo incontrarci di persona."

**Mottola** — provincia: "provincia di Taranto"
- *Contesto:* Mottola, la "Spia delle Puglie", guarda dall'alto la piana fino al golfo di Taranto. È conosciuta per le chiese rupestri, come San Nicola, e per le sale ricevimenti e le masserie dove si celebrano matrimoni ed eventi. Per queste attività contano foto, video e una presenza social che faccia vedere gli spazi prima ancora della visita.
- *Settori:* sale ricevimenti e location per eventi; ristoranti e agriturismi; negozi e servizi del paese.
- *FAQ:* "Fate foto e video per location di eventi a Mottola?" → "Sì, con shooting e riprese sul posto. Le schede dei nostri clienti di Mottola sono nella sezione qui sopra."

**Palagianello** — provincia: "provincia di Taranto"
- *Contesto:* Palagianello è un paese della gravina, con il castello Stella-Caracciolo e le chiese rupestri. È una comunità piccola, dove il passaparola conta molto: social e scheda Google servono a farsi trovare anche da chi arriva dai paesi vicini.
- *Settori:* attività del centro storico; ristorazione; artigiani e piccole imprese.
- *FAQ:* "Ha senso fare social per un'attività di un paese piccolo?" → "Sì, se il pubblico è quello giusto: le persone del paese e dei paesi vicini. Con le sponsorizzate si possono raggiungere solo loro, senza sprecare budget."

**Palagiano** — provincia: "provincia di Taranto"
- *Contesto:* Palagiano è terra di agrumi, in particolare delle clementine del Golfo di Taranto, con la frazione di Chiatona sul mare. Molte attività sono legate all'agricoltura, alla vendita di prodotti locali e al turismo estivo sulla costa.
- *Settori:* aziende agricole e produttori; negozi e servizi del paese; strutture e attività della costa.
- *FAQ:* "Potete aiutare un'azienda agricola a vendere online?" → "Sì: sito, e-commerce o vetrina sui social, e foto dei prodotti fatte sul posto."

**Laterza** — provincia: "provincia di Taranto"
- *Contesto:* Laterza è conosciuta per la gravina, una delle più grandi d'Italia, oggi oasi naturalistica, per la tradizione della maiolica e per il suo pane. È un territorio di artigiani e di prodotti tipici, che online funzionano quando si racconta bene la storia e il lavoro dietro il prodotto.
- *Settori:* forni e prodotti tipici; artigianato e maiolica; ristorazione; turismo legato alla gravina.
- *FAQ:* "Come si raccontano sui social prodotti artigianali?" → "Con video brevi del lavoro, foto curate e una storia coerente. Lo facciamo con shooting e reel girati in bottega."

**Ginosa** — provincia: "provincia di Taranto"
- *Contesto:* Ginosa unisce il paese sulla gravina, con il villaggio rupestre, a Ginosa Marina, sulla costa ionica, che d'estate si riempie di turisti. Per le attività del paese e della marina la sfida è farsi trovare prima della stagione e restare in mente anche durante l'inverno.
- *Settori:* negozi e commercio (come Paresteta, nostro cliente); lidi, ristoranti e strutture di Ginosa Marina; aziende agricole.
- *FAQ:* "Lavorate anche per attività stagionali di Ginosa Marina?" → "Sì: prepariamo contenuti e campagne prima dell'estate e le seguiamo durante la stagione."

**Gravina in Puglia** — provincia: **"provincia di Bari"**
- *Contesto:* Gravina in Puglia è nella Città metropolitana di Bari, alle porte del Parco Nazionale dell'Alta Murgia. È famosa per il ponte-acquedotto sulla gravina e per la Gravina sotterranea. Ha un tessuto di commercio, ristorazione e aziende del territorio murgiano, con un pubblico anche oltre il confine tra le province di Bari e di Taranto.
- *Settori:* commercio e negozi; ristoranti e prodotti della Murgia; aziende e professionisti.
- *FAQ:* "Lavorate anche fuori dalla provincia di Taranto?" → "Sì. Abbiamo clienti a Gravina in Puglia e lavoriamo in tutta la Puglia e anche fuori regione."

### 2. Correggere le frasi del modello, priorità alta
- Primo paragrafo: "InLab è l'agenzia di comunicazione di riferimento a {città}…" diventa "InLab Communication segue {servizio} per attività di {città} e della {provincia}, da Castellaneta: strategia su misura, lavoro fatto da noi e risultati che misuriamo insieme."
- "Non siamo un'agenzia milanese…" e "i competitor che devi battere": li sostituisce `contesto`.
- "Risposta garantita entro 24 ore, sempre" diventa "Parli direttamente con noi, Nicola e Ilaria".
  - La promessa delle 24 ore resta solo se Nicola la conferma.
  - La stessa frase c'è nella description SEO delle pagine città (`routes.ts`, circa riga 270: "risposta in 24 ore"). Va tolta anche lì, a meno che Nicola non la confermi.

### 3. Clienti di Ginosa, priorità media
- Paresteta (negozio a Ginosa) non compare nella pagina di Ginosa. Probabilmente il campo `location` del cliente non contiene "Ginosa".
- **Cosa fare:** controlla il dato. Se il campo va cambiato in dashboard, dimmelo e lo chiedo a Nicola.

### 4. Nuove pagine "Agenzia di comunicazione e marketing a {città}", priorità media
Risposta all'idea di Nicola, "marketing a {città}".

- **Perché una pagina per città e non un ottavo servizio "marketing" × 8 città:**
  - non abbiamo una pagina servizio "marketing": sarebbe un doppione delle altre;
  - le ricerche "agenzia di marketing Taranto" e "agenzia di comunicazione Taranto" cercano un'agenzia, non un singolo servizio. Una pagina per città risponde meglio.
- **URL:** `/agenzia-comunicazione-{città}` per **7 città**: tutte tranne Castellaneta.
  - Per Castellaneta la pagina c'è già: è la home (H1 "Agenzia di comunicazione a Castellaneta"). Una seconda pagina le farebbe concorrenza.
  - Nell'elenco delle città, Castellaneta porta alla home.
- **Title:** `Agenzia di comunicazione e marketing a {città} | InLab`, al massimo 60 caratteri.
  - Se è più lungo, usa `Agenzia di marketing a {città} | InLab Communication` oppure `Agenzia comunicazione {città} | InLab Communication`.
- **Description:** circa 145-155 caratteri. Esempio: "Agenzia di comunicazione e marketing per attività di {città}: social, video, Meta Ads, siti web e branding. Da Castellaneta (TA), preventivo gratuito."
- **H1:** "Agenzia di comunicazione e marketing a {città}".
- **Contenuto:**
  - `contesto` e `settori` della richiesta 1;
  - i **7 servizi**, con link alle pagine `/{servizio}-{città}`;
  - i clienti e i casi della città;
  - la FAQ;
  - il pulsante per il preventivo.
  Con contesto, settori e servizi propri, la pagina è diversa dalle pagine dei singoli servizi.
- **Collegamenti:**
  - da ogni pagina `/{servizio}-{città}`, un link "Tutti i servizi a {città}";
  - una riga nella pagina /servizi, o nel footer, con le 7 pagine città (scegli tu dove resta pulito);
  - aggiungere a sitemap, llms.txt (sezione Città) e BreadcrumbList.
- **JSON-LD:** WebPage + BreadcrumbList; `about` = orgRef; `areaServed` = la città.
- È una modifica alla struttura del sito: l'ha chiesta Nicola e ne informo il Direttore.

---

## Cosa misuro dopo
- Parole diverse tra due pagine città dello stesso servizio: obiettivo almeno 200 su circa 650.
- Gravina: 0 occorrenze di "provincia di Taranto".
- Ginosa: sezione clienti presente.
- Search Console, dopo 4-6 settimane: pagine città indicizzate e impressioni per "agenzia comunicazione {città}" e "{servizio} {città}".
