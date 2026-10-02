# Brief SEO: pagina Palagianello più personale

**Da:** responsabile SEO → **A:** Sito Inlab
**Richiesta di Nicola:** "/agenzia-comunicazione-palagianello non farla identica". Vuole farsi trovare come agenzia di Palagianello, il suo paese.

## Cosa ho misurato (sito online)
- Rispetto alle altre pagine agenzia, Palagianello ha già circa il 40% di testo proprio: 232 parole diverse su 583 rispetto a Mottola, 222 rispetto a Palagiano.
- Le parti ancora uguali in tutte le pagine sono le **7 descrizioni dei servizi**: sono identiche ovunque e cambia solo il nome della città.
- **Errore:** in "I nostri lavori a Palagianello" compare il caso studio **Paresteta**, che è di **Ginosa**. Succede perché il caso in dashboard ha il campo "Città in cui è presente" vuoto e il sito usa le città predefinite.

## Richieste per lo sviluppo (per Sito Inlab)

### 1. Paresteta solo a Ginosa — priorità ALTA
- Il caso Paresteta deve comparire solo nelle pagine di Ginosa.
- Correggi le città predefinite del caso, oppure il fallback quando il campo è vuoto. Un caso senza città non deve comparire in nessuna pagina città.
- Controlla anche gli altri casi studio.

### 2. Descrizioni dei servizi proprie per Palagianello — priorità ALTA
- **File:** `src/data/cities.ts`, campo facoltativo `servizi: { [slug]: string }`. Se c'è, sostituisce la descrizione generica del servizio nelle pagine `/agenzia-comunicazione-palagianello` e `/{servizio}-palagianello`; se non c'è, resta il testo di oggi.
- **Testi per Palagianello** (i clienti sono citati solo con quello che è già scritto nelle loro schede):
  - **gestione-social:** "A Palagianello i social sono il passaparola che continua online: raccontiamo le persone dietro il bancone, le novità e gli eventi del paese. Come per Sublime Tentazione, con una presenza costante tra gelati d'estate e panettoni a Natale."
  - **meta-ads:** "Sponsorizzate mirate a Palagianello e ai paesi vicini, come Palagiano, Mottola, Castellaneta e Massafra: budget contenuti e un pubblico che può davvero venire da te, senza sprechi."
  - **siti-web:** "Un sito semplice e veloce, collegato alla scheda Google, per farti trovare da chi cerca un'attività a Palagianello e da chi arriva da fuori per la gravina e il castello."
  - **automazioni-ai:** "Risposte automatiche su WhatsApp e Instagram per prenotazioni e domande frequenti: utili a masserie, ristoranti e negozi del paese che non possono stare sempre al telefono."
  - **shooting:** "Shooting sul posto, in negozio, in laboratorio o in masseria: foto vere degli spazi, dei prodotti e delle serate, al posto delle immagini di repertorio."
  - **video:** "Video brevi e leggeri che raccontano il negozio e chi ci lavora. Come per DIRAM, tra ricambi, riparazioni e punto Poste."
  - **branding:** "Nome, logo e immagine coordinata per chi apre o rinnova un'attività a Palagianello: un'identità che si riconosce in paese e nei comuni vicini."

### 3. Sezione "Palagianello è casa nostra" — priorità MEDIA
- **Dove:** solo in `/agenzia-comunicazione-palagianello`, sotto "Il territorio", con un link alla pagina autore.
- **Testo:** "Nicola Carpignano, co-fondatore di InLab Communication, è di Palagianello. Si è laureato in Psicologia all'Università di Bari, insegna Marketing e Social Media nei master di EA Formazione e ha pubblicato ricerche sulla comunicazione digitale. Per le attività del paese vuol dire avere vicino qualcuno che conosce il territorio e il mestiere."
- **Link:** "Scopri chi è Nicola →" verso `/autori/nicola-carpignano`.
- **JSON-LD della pagina:** aggiungi `mentions` (oppure `about`) con l'@id di Nicola.

### 4. Title e description — priorità BASSA
- **Title:** resta "Agenzia di comunicazione e marketing a Palagianello | InLab".
- **Description:** "Agenzia di comunicazione e marketing a Palagianello, fondata da chi è del paese: social, video, sponsorizzate, siti e foto per le attività locali. Preventivo gratuito." Correggi se esce dai 140-155 caratteri.

## Cosa misuro dopo
- Paresteta presente solo a Ginosa.
- Almeno il 60% di testo proprio tra la pagina di Palagianello e quella di Mottola.
- Search Console: impressioni per "agenzia comunicazione Palagianello", "social media manager Palagianello" e "Nicola Carpignano Palagianello".

Se funziona, lo stesso schema (servizi con testi propri) vale per le altre città, partendo da quelle con più clienti.
