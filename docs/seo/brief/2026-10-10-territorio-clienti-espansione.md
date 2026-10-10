# Brief SEO: sfruttare i clienti e allargare il territorio (lotto 1)

**Da:** responsabile SEO → **A:** Sito Inlab
**Richiesta di Nicola (10/10):**
- usare di più i clienti: nelle loro schede ci vanno il paese e il servizio, per esempio "gestione social Palagiano" con Nunzio Putignano. Con Sottoscala funziona già: chi cerca "gestione social Mottola" trova la sua scheda;
- creare più collegamenti tra le pagine;
- aggiungere paesi nuovi ogni settimana, sempre di più.

## Cosa ho verificato (10/10)
- **22 schede `/cliente/…`.**
  - Il title è "{Cliente} a {Paese} | Clienti InLab": c'è il paese, ma **manca il servizio**.
- **I clienti aggiunti di recente non compaiono nelle sezioni delle loro città.**
  - I clienti sono: Pizzeria Hermitage e Splashcar (Laterza); Casa28, Match Point e Olio Vanessa (Castellaneta); Il Paradiso e La Vela (Castellaneta Marina); Vision Ottica e Arte e Oro (Palagianello); Pasticceria Naturale (Ferrara).
  - Compaiono una volta su ogni pagina, sempre uguali, in un blocco generale. Per esempio `/agenzia-comunicazione-laterza` non mostra Hermitage e Splashcar tra "I nostri lavori a Laterza".
- **Ferrara ha ora un cliente pubblicato** (Pasticceria Naturale). Con la regola del 03/10 si può aprire la pagina città.
- **Castellaneta Marina ha due clienti** (Il Paradiso, La Vela), ma per ora è solo una sezione della pagina Castellaneta.

## Richieste per lo sviluppo

### 1. Schede clienti con servizio + paese nel title — priorità ALTA
Formato: **"{Servizio principale} a {Paese}: {Cliente} | InLab"**. Se supera i 60 caratteri, togli " | InLab". In fondo alla description aggiungi " — {servizio} a {paese}." se non c'è già. Il servizio principale è il primo dei "Servizi realizzati".

| Scheda | Title nuovo |
|---|---|
| nunzio-putignano | Gestione social a Palagiano: Nunzio Putignano Autofficina |
| studio-dentistico-ricciardi | Sito web a Palagiano: Studio Dentistico Ricciardi |
| diram-autoricambi | Gestione social a Palagianello: DIRAM | InLab |
| sublime-tentazione | Gestione social a Palagianello: Sublime Tentazione |
| masseria-sacramento | Gestione social a Palagianello: Masseria Sacramento |
| vision-ottica | Social media a Palagianello e Mottola: Vision Ottica |
| arte-e-oro | Social media a Palagianello: Arte e Oro Tamburrano |
| sottoscala | Gestione social a Mottola: Sottoscala | InLab |
| villa-natia | Foto e video a Mottola: Villa Natia | InLab |
| studio-ventimiglia-solution | Video immobiliari a Castellaneta: Studio Ventimiglia |
| ottica-occhiblu | Video e social a Castellaneta: Ottica Occhi Blu |
| olio-vanessa | Gestione social a Castellaneta: Olio Vanessa | InLab |
| casa28 | Food photography a Castellaneta: Casa28 | InLab |
| match-point | Foto e video a Castellaneta: Match Point | InLab |
| il-paradiso | Food photography a Castellaneta Marina: Il Paradiso |
| la-vela | Grafiche eventi a Castellaneta Marina: La Vela |
| emmesse | Video promozionali a Taranto: Emmesse | InLab |
| pizzeria-hermitage | Video a Laterza: Pizzeria Hermitage | InLab |
| splashcar | Social media a Laterza: Splashcar | InLab |
| pasticceria-naturale | Gestione social a Ferrara: Pasticceria Naturale |
| inox-racing-puglia | Strategia social: Inox Racing Puglia | InLab (città non indicata) |
| tacco | E-commerce Shopify: Tacco, marchio di vini | InLab (città non indicata) |

**H1 della scheda:** resta il nome del cliente. Sopra l'H1 metti l'etichetta "{Servizio} a {Paese}", se il layout lo consente.

### 2. Collegamenti scheda ↔ pagine città — priorità ALTA
In ogni scheda con città, aggiungi un blocco **"Lavoriamo a {Paese}"** prima della CTA, con link a:
- `/agenzia-comunicazione-{paese}` → "Agenzia di comunicazione a {Paese}";
- `/{servizio}-{paese}` per ogni servizio realizzato che ha una pagina città, per esempio "Gestione social a Palagiano";
- `/dove-lavoriamo` → "Tutte le città".

Così ogni scheda passa forza alle pagine del suo paese, e ogni pagina del paese porta già alla scheda (card clienti). Il collegamento diventa a doppio senso.

### 3. Clienti nuovi nelle sezioni delle loro città — priorità ALTA
- Le pagine `/agenzia-comunicazione-{città}` e `/{servizio}-{città}` devono leggere **anche** gli "Altri clienti", usando il loro campo città.
- Mostrali nella stessa sezione "I nostri lavori a {città}", con la loro card e il link alla scheda.
- Vision Ottica va sia a Palagianello sia a Mottola.
- Nelle pagine servizio-città, metti **per primi** i clienti che hanno quel servizio. Esempio: in `/video-laterza`, per prima Pizzeria Hermitage.
- **Il blocco generale con tutti i clienti uguale su ogni pagina:** se serve, lascialo solo in `/clienti` e in home. Nelle pagine città crea testo duplicato su più di 100 pagine.

### 4. Nuove pagine città (lotto 1) — priorità ALTA
Per ogni città, **due pagine**: `/agenzia-comunicazione-{città}` e `/gestione-social-{città}`. Stesso template degli altri hub, con i campi `intro`, `contesto`, `focus`, `metodo`, `faq`, `altreFaq` e `servizi['gestione-social']`. Le altre pagine servizio non vanno create. Sitemap, prerender, link da `/dove-lavoriamo` e da "Agenzia anche in queste città".

**4.1 Castellaneta Marina** (frazione di Castellaneta, provincia di Taranto). Clienti: Il Paradiso, La Vela.
- **Description:** "Agenzia di comunicazione a Castellaneta Marina: foto, social, grafiche e sponsorizzate per lidi, ristoranti e strutture della costa. Preventivo gratuito."
- **intro:** "Castellaneta Marina è la nostra costa: per i lidi Il Paradiso e La Vela abbiamo curato shooting dei piatti e grafiche degli eventi. Seguiamo foto, social, video e sponsorizzate per le attività della marina, a pochi minuti dalla nostra sede di Castellaneta."
- **contesto:** "Castellaneta Marina vive tra la pineta, la Riserva naturale Stornara e una lunga spiaggia sulla costa ionica. D'estate si riempie di turisti, villaggi e lidi; il resto dell'anno contano i clienti di Castellaneta e dei paesi vicini."
- **focus. H2** "Riempire la stagione, prima che inizi". **Testo:** "Chi va al mare sceglie il lido e il ristorante guardando le foto. Per Il Paradiso abbiamo fotografato i piatti del ristorante, per La Vela creiamo le grafiche degli eventi. Il lavoro inizia prima dell'estate: contenuti, scheda Google e sponsorizzate pronti in primavera, poi foto, reel ed eventi raccontati durante la stagione."
- **FAQ:** "Quando conviene iniziare la comunicazione di un lido?" → "In primavera: a giugno i turisti hanno già scelto dove andare. Prepariamo foto, scheda Google e campagne prima dell'apertura."
- **gestione-social:** "Social per lidi e ristoranti di Castellaneta Marina: piatti, tramonti ed eventi raccontati durante la stagione, con grafiche come quelle che curiamo per La Vela."

**4.2 Ferrara** (Emilia-Romagna). Cliente: Pasticceria Naturale.
- **Description:** "Agenzia di comunicazione per attività di Ferrara: gestione social, foto e video sul posto, strategia e testi. Il caso Pasticceria Naturale. Preventivo gratuito."
- **intro:** "A Ferrara gestiamo i social della Pasticceria Naturale: strategia, idee e testi nostri, foto e video realizzati sul posto. Seguiamo attività di Ferrara con lo stesso metodo che usiamo in Puglia, lavorando a distanza e venendo di persona per le riprese."
- **contesto:** "Ferrara è la città degli Estensi, con il Castello Estense, le Mura e un centro rinascimentale patrimonio UNESCO. È una città di botteghe, locali e attività storiche, dove la qualità si racconta bene con immagini curate."
- **focus. H2** "Seguire un'attività a distanza, senza perdere il contatto". **Testo:** "Con la Pasticceria Naturale lavoriamo così: strategia e piano editoriale condivisi, testi e idee scritti da noi, foto e video girati sul posto. Il resto si fa a distanza, con un contatto diretto e report chiari. Per un'attività di Ferrara significa avere un social media manager dedicato, non un account gestito in serie."
- **FAQ:** "Seguite attività di Ferrara anche se siete in Puglia?" → "Sì: per la Pasticceria Naturale gestiamo i social a distanza e facciamo foto e video sul posto."
- **gestione-social:** "Gestione social a Ferrara come per la Pasticceria Naturale: strategia, testi, idee per i contenuti e foto e video realizzati sul posto."
- Contesto regionale: "Emilia-Romagna" al posto di "provincia di Taranto" (campo `provincia`: "provincia di Ferrara").

**4.3 Crispiano** (TA). Nessun cliente pubblicato: non citare clienti.
- **Description:** "Agenzia di comunicazione a Crispiano: social, foto, video e sponsorizzate per masserie, ristoranti e attività del paese. Da Castellaneta, preventivo gratuito."
- **intro:** "Crispiano è la città delle cento masserie, a mezz'ora dalla nostra sede. Seguiamo social, foto, video, sponsorizzate e siti per masserie, ristoranti e attività del paese."
- **contesto:** "Crispiano è conosciuta come la città delle cento masserie: la sua campagna, tra gravine e muretti a secco, è piena di masserie storiche che oggi ospitano ristoranti, eventi e turismo."
- **focus. H2** "Raccontare una masseria a chi non c'è mai stato". **Testo:** "Una masseria si sceglie dalle immagini: gli spazi, la luce, i piatti, l'atmosfera di un evento. Facciamo shooting e riprese sul posto, costruiamo un profilo social che mostri la masseria in ogni stagione e portiamo i contenuti, con le sponsorizzate, a chi cerca un posto per un matrimonio, un pranzo o un weekend."
- **FAQ:** "Lavorate con masserie ed agriturismi?" → "Sì: foto, video, social e campagne per eventi, ristorazione e ospitalità. Facciamo le riprese sul posto."
- **gestione-social:** "Social per masserie e attività di Crispiano: foto e reel girati sul posto, un calendario costante e campagne per eventi e prenotazioni."

**4.4 Statte** (TA). Nessun cliente pubblicato.
- **Description:** "Agenzia di comunicazione a Statte: social, sponsorizzate, sito e scheda Google per attività alle porte di Taranto. Da Castellaneta, preventivo gratuito."
- **intro:** "Statte è alle porte di Taranto: per le sue attività la sfida è farsi notare tra tanti concorrenti della città vicina. Seguiamo social, sponsorizzate, siti e scheda Google, da Castellaneta."
- **contesto:** "Statte si trova a pochi chilometri da Taranto, nel Parco Terra delle Gravine, con la gravina di Leucaspide e le sue masserie. Molte attività lavorano sia con il paese sia con il pubblico di Taranto."
- **focus. H2** "Farsi trovare da chi cerca a Taranto". **Testo:** "Per un'attività di Statte, il pubblico non si ferma ai confini del paese: chi cerca un servizio a Taranto può scegliere te, se ti trova. Partiamo da una scheda Google completa e curata, contenuti social riconoscibili e sponsorizzate su Statte e sui quartieri vicini di Taranto, con un budget proporzionato."
- **FAQ:** "Le sponsorizzate possono raggiungere anche Taranto?" → "Sì: impostiamo zone e raggio in base a dove si trovano i tuoi clienti, Statte e i quartieri vicini di Taranto."
- **gestione-social:** "Social per attività di Statte che vogliono farsi conoscere anche a Taranto: contenuti riconoscibili e costanti, con un piano chiaro."

**4.5 Noci** (BA). Nessun cliente pubblicato.
- **Description:** "Agenzia di comunicazione a Noci: social, foto, video e sponsorizzate per ristoranti, masserie e attività della Murgia dei Trulli. Preventivo gratuito."
- **intro:** "Noci è nella Murgia dei Trulli, tra gnostre, masserie e buona cucina. Seguiamo social, foto, video, sponsorizzate e siti per le attività del paese, da Castellaneta."
- **contesto:** "Noci, in provincia di Bari, è al confine con la Valle d'Itria: centro storico con le gnostre, masserie in campagna e una tradizione gastronomica che si festeggia con Bacco nelle Gnostre. È un paese che vive di cibo, ospitalità e turismo."
- **focus. H2** "Il cibo si vende con gli occhi". **Testo:** "Per un ristorante, una braceria o una masseria di Noci, le foto dei piatti e i video in cucina sono il primo menu che le persone vedono. Facciamo shooting e reel sul posto, curiamo la scheda Google con foto vere e prepariamo contenuti e campagne per i periodi di maggiore affluenza, come le feste e i weekend d'autunno."
- **FAQ:** "Fate food photography per ristoranti di Noci?" → "Sì, con shooting sul posto: piatti, sala e persone, da usare su social, scheda Google e sito."
- **gestione-social:** "Social per ristoranti, masserie e negozi di Noci: foto dei piatti, reel in cucina e contenuti costanti per farsi scegliere da chi arriva in paese."
- **provincia:** "provincia di Bari".

**4.6 Martina Franca** (TA). Nessun cliente pubblicato.
- **Description:** "Agenzia di comunicazione a Martina Franca: social, foto, video e campagne per hotel, ristoranti e negozi della Valle d'Itria. Preventivo gratuito."
- **intro:** "Martina Franca è la capitale barocca della Valle d'Itria. Seguiamo social, foto, video, sponsorizzate e siti per hotel, ristoranti, negozi e attività del territorio, da Castellaneta."
- **contesto:** "Martina Franca è famosa per il centro storico barocco, il Festival della Valle d'Itria e il capocollo. Tra trulli e masserie è una delle mete più amate della Puglia, con turisti italiani e stranieri per gran parte dell'anno."
- **focus. H2** "Parlare anche ai turisti". **Testo:** "A Martina Franca molti clienti arrivano da fuori. Per un hotel, un ristorante o un negozio di prodotti tipici servono contenuti che funzionino anche per chi non conosce il posto: foto curate, reel brevi, una scheda Google completa e, quando serve, testi anche in inglese. Prepariamo campagne mirate ai turisti prima della stagione e ai clienti della zona per il resto dell'anno."
- **FAQ:** "Potete fare contenuti anche in inglese?" → "Sì, per hotel, ristoranti e attività che lavorano con turisti stranieri: post, didascalie e testi del sito."
- **gestione-social:** "Social per hotel, ristoranti e negozi di Martina Franca: contenuti curati per i turisti e per chi vive in Valle d'Itria, anche in inglese."

**Regole per tutte:**
- Nelle città senza clienti nessuna sezione "I nostri lavori a {città}". Usa il blocco "Lavoriamo in tutta la provincia" con i clienti delle città vicine.
- Niente frasi del tipo "i nostri clienti di {città}".
- Ogni pagina deve avere almeno il 60% di testo proprio.

## Piano di espansione (per Direttore e Nicola)
Nicola vuole allargarsi ogni settimana. Lo faccio **a lotti settimanali**, ogni lunedì un brief come questo. Si parte dai paesi più vicini e da quelli dove ci sono clienti.

**Prossimi lotti** (l'ordine cambia se arrivano clienti nuovi):
- **Lotto 2:** Montescaglioso, Grottaglie, Santeramo in Colle, Altamura
- **Lotto 3:** Castellana Grotte, Putignano, Alberobello, Locorotondo
- **Lotto 4:** Bernalda e Metaponto, Policoro, Acquaviva delle Fonti, Turi
- **Lotto 5:** San Giorgio Ionico, Pulsano, Leporano, Montemesola
- **Poi:** Bologna e Roma, appena ci sono lavori pubblicabili, e via via altri comuni di Bari, Taranto e Matera.

**Ritmo:**
- Si parte da **4-6 paesi a settimana**, 2 pagine ciascuno, con testi propri.
- Ogni lunedì controllo in Search Console quante pagine dei lotti precedenti sono indicizzate.
- Se Google le prende, salgo fino a **10 paesi a settimana**. Se no, mi fermo e miglioro quelle esistenti.

**Perché non subito 50 paesi:** Google penalizza i siti che creano in serie pagine città simili tra loro, i cosiddetti "doorway". Il rischio è perdere posizioni su tutto il sito, anche su Castellaneta e Taranto. Crescere a lotti con testi veri è la strada più veloce che non mette a rischio quello che abbiamo già.

## Cosa misuro dopo
- Search Console, query "{servizio} {paese}": quali pagine escono, schede clienti o pagine città.
- Indicizzazione delle 12 pagine nuove: Nicola chiede l'indicizzazione appena sono online.
