# Brief SEO: Palagiano, pagina agenzia e pagina siti web

**Da:** responsabile SEO → **A:** Sito Inlab
**Richiesta di Nicola (05/10):** rendere proprie le due pagine di Palagiano che Google non ha ancora visto:
- `/agenzia-comunicazione-palagiano`: mettere in risalto i nostri clienti di Palagiano;
- `/siti-web-palagiano`: mettere in risalto il sito fatto per lo Studio Dentistico Ricciardi.

## Situazione (Search Console, 05/10)
- **Indicizzate:** `/video-palagiano` e `/branding-palagiano`.
- **"URL sconosciuto a Google":** `/agenzia-comunicazione-palagiano` e `/siti-web-palagiano`. Sono entrambe in sitemap e rispondono 200.
- **"Rilevata, non indicizzata":** le altre 4 pagine servizio di Palagiano.
- **Oggi entrambe le pagine sono generiche.** Apertura e descrizioni dei servizi sono uguali alle altre città.
- **Il testo "Come lavoriamo a Palagiano" va sostituito.** Oggi dice "lavoriamo spesso con chi produce: aziende agricole, produttori di agrumi", ma tra i clienti pubblicati di Palagiano non ci sono aziende agricole. Lo sostituisco con un testo basato sui clienti reali (punto 1.3).

**Clienti pubblicati a Palagiano** (dalle schede online, nessun dato inventato):
- **Studio Dentistico Ricciardi**, Via Imbriani 40: sito luminaricciardi.it con il brand Lumina, pagine per ogni trattamento, lead generation, piano editoriale, reel. Caso studio: `/casi-studio/ricciardi`. Scheda: `/cliente/studio-dentistico-ricciardi`.
- **Nunzio Putignano Autofficina:** reel ironici in dialetto con il titolare e il team, gestione social, foto. Scheda: `/cliente/nunzio-putignano`. Il reel più visto ha 1,3 milioni di visualizzazioni, come indicato sulla scheda.

Uso i campi già previsti in `cities.ts` (`intro`, `title`, `description`, `servizi`, `altreFaq`, `metodo`).

## Richieste per lo sviluppo

### 1. `/agenzia-comunicazione-palagiano` — priorità ALTA

**1.1 Title e description**
- **Title:** resta "Agenzia di comunicazione e marketing a Palagiano | InLab".
- **Description** (144 caratteri): "Agenzia di comunicazione a Palagiano: reel per l'Autofficina Putignano, sito e campagne per lo Studio Dentistico Ricciardi. Preventivo gratuito."

**1.2 Apertura (`intro`)**
"A Palagiano lavoriamo con attività molto diverse tra loro: per l'Autofficina Nunzio Putignano giriamo reel ironici in dialetto con il titolare e il suo team, per lo Studio Dentistico Ricciardi abbiamo creato il sito Lumina e le campagne che portano richieste di visita. InLab Communication segue social, video, sponsorizzate, siti e branding da Castellaneta, a pochi chilometri dal paese."

**1.3 "Come lavoriamo a Palagiano" (`metodo`), al posto del testo attuale**
"A Palagiano partiamo sempre dalla persona che c'è dietro l'attività. Con l'Autofficina Putignano abbiamo scelto la strada più naturale: il titolare davanti alla telecamera, in dialetto, con l'ironia che lo fa riconoscere in paese. Con lo Studio Ricciardi serviva l'opposto: un tono professionale e rassicurante, un sito chiaro su ogni trattamento e contenuti che spiegano prima di vendere. Due stili diversi, lo stesso metodo: capire chi sei, scegliere il linguaggio giusto per i tuoi clienti e misurare i risultati."

**1.4 Sezione clienti in evidenza**
- Spostala **subito dopo l'apertura**, prima dei servizi, con H2 "I nostri clienti a Palagiano".
- Per ogni cliente una riga in più, oltre alla card attuale:
  - **Studio Dentistico Ricciardi:** "Sito luminaricciardi.it, lead generation e social" → link a `/casi-studio/ricciardi` ("Leggi il caso studio") e alla scheda.
  - **Autofficina Nunzio Putignano:** "Reel in dialetto e gestione social" → link alla scheda.
- Se la grafica attuale delle card resta uguale, basta spostare la sezione e aggiungere la riga.

**1.5 Testi dei servizi (`servizi`)**, usati anche come paragrafo sotto l'H1 delle `/{servizio}-palagiano`
- **gestione-social:** "Per un'attività di paese i social funzionano quando mostrano le persone. Come per l'Autofficina Putignano: il titolare e il team protagonisti, con un tono che chi abita a Palagiano riconosce subito."
- **video:** "Reel spontanei, anche in dialetto, girati sul posto: è il formato con cui abbiamo raccontato l'Autofficina Putignano. Per gli studi professionali, video più calmi che spiegano un servizio in modo semplice."
- **siti-web:** "Siti con una pagina per ogni servizio e la richiesta di contatto sempre a portata di mano, come luminaricciardi.it, il sito che abbiamo fatto per lo Studio Dentistico Ricciardi."
- **meta-ads:** "Campagne mirate su Palagiano, Chiatona e i paesi vicini, per portare richieste concrete: per lo Studio Ricciardi le campagne portano le persone alle pagine dei trattamenti e alla prenotazione."
- **shooting:** "Foto vere della tua attività, del team e del lavoro, al posto delle immagini di repertorio: in officina, in studio, in negozio o in azienda."
- **branding:** "Un'identità chiara su insegna, social e sito. Per lo Studio Ricciardi abbiamo costruito il brand Lumina, più caldo e contemporaneo."
- **automazioni-ai:** "Risposte automatiche su WhatsApp e Instagram per prenotazioni e domande frequenti: utili a studi e attività di Palagiano che ricevono tanti messaggi."

**1.6 FAQ: la prima resta, aggiungi questa (`altreFaq`)**
- "Lavorate anche con studi medici e professionisti di Palagiano?" → "Sì: per lo Studio Dentistico Ricciardi seguiamo sito, campagne e social. Con i professionisti curiamo soprattutto chiarezza e fiducia: spiegare bene i servizi, mostrare lo studio e le persone, rendere facile prenotare."
- Le FAQ attuali su aziende agricole e Chiatona restano, perché descrivono servizi possibili e non clienti.

### 2. `/siti-web-palagiano` — priorità ALTA

**2.1 Title e description**
- **Title:** "Realizzazione siti web a Palagiano | InLab" (42 caratteri).
- **Description** (148 caratteri): "Siti web a Palagiano: per lo Studio Dentistico Ricciardi abbiamo creato luminaricciardi.it, con una pagina per ogni trattamento. Preventivo gratuito."

**2.2 Paragrafo sotto l'H1:** il testo `servizi['siti-web']` del punto 1.5.

**2.3 Sezione nuova "Il sito che abbiamo fatto a Palagiano: luminaricciardi.it"**, subito dopo l'apertura
- Testo: "Per lo Studio Dentistico Ricciardi, in Via Imbriani a Palagiano, abbiamo progettato il nuovo sito attorno al brand Lumina. Ci sono una pagina per ogni trattamento, dalla prevenzione all'implantologia computer guidata, la presentazione dello studio e del team e i contatti sempre visibili per prenotare una visita. Il sito lavora insieme ai social e alle campagne: chi vede un contenuto arriva sulla pagina del trattamento giusto e da lì chiede un appuntamento."
- Elenco "Cosa abbiamo realizzato", preso dal caso studio: sito web, pagine dedicate ai trattamenti, copywriting, brand Lumina, collegamento con campagne e social.
- Link: "Leggi il caso studio" → `/casi-studio/ricciardi`; "Visita il sito" → `https://luminaricciardi.it/`, link esterno con `rel="noopener"`, **senza nofollow**, perché è un lavoro nostro.
- Immagine: se ce n'è una del sito nel caso studio, riusala con alt "Sito luminaricciardi.it realizzato da InLab per lo Studio Dentistico Ricciardi di Palagiano".
- **Dati strutturati:** nessuno nuovo.

**2.4 Struttura del campo:** se serve un campo nuovo, propongo `progettoInEvidenza` per città e servizio (titolo, testo, punti, link al caso, link esterno, immagine). Così si può riusare in altre città quando ci sono casi simili.

## Da segnalare a Nicola (non è codice)
In `/casi-studio/ricciardi`, sotto i risultati (30k+ persone raggiunte, ★ 4.9), si legge online **"Metriche indicative — da confermare prima della pubblicazione."**
- Va tolta la frase, oppure vanno confermati o tolti i numeri dalla dashboard.
- Numeri "da confermare" pubblicati danneggiano la credibilità, anche agli occhi delle AI che leggono la pagina.
- Se la frase è nel codice e non nella dashboard, toglierla è compito di Sito Inlab, dopo la conferma di Nicola.

## Cosa misuro dopo
- Le due pagine passano da "URL sconosciuto" a "Indicizzata". Nicola chiede l'indicizzazione appena le modifiche sono online.
- Testo proprio rispetto a `/agenzia-comunicazione-mottola` e `/siti-web-mottola`: almeno 60%.
- Search Console tra 4-8 settimane: impressioni per "agenzia comunicazione Palagiano", "siti web Palagiano", "social Palagiano".
