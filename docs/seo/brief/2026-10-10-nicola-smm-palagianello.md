# Brief SEO: "Nicola Carpignano social media manager Palagianello"

**Da:** responsabile SEO → **A:** Sito Inlab
**Richiesta di Nicola (10/10):** farsi trovare per "Nicola Carpignano social media manager Palagianello".

## Situazione online (10/10)
- `/autori/nicola-carpignano`:
  - title "Nicola Carpignano: social media e marketing a Castellaneta";
  - description "social media manager e co-fondatore di InLab Communication a Castellaneta (TA)…";
  - jobTitle "Social media manager, comunicazione e marketing".
  - **Palagianello non compare né nel title né nella description**: c'è solo nel testo e in `homeLocation`.
- `/gestione-social-palagianello`:
  - title "Gestione Social a Palagianello | InLab Communication";
  - nel testo "social media manager" compare una volta e Nicola è citato;
  - **non c'è nessun link** alla pagina autore.
- `/agenzia-comunicazione-palagianello`: la sezione "casa nostra" collega già Nicola.

## Richieste per lo sviluppo

### 1. Pagina autore `/autori/nicola-carpignano` — priorità ALTA
- **Title** (62): "Nicola Carpignano, social media manager a Palagianello | InLab"
- **Description** (146): "Nicola Carpignano è social media manager e cofondatore di InLab Communication. È di Palagianello, lavora tra Palagianello, Castellaneta e Taranto."
- **H1 / sottotitolo:** sotto il nome, "Social media manager · Palagianello e Castellaneta (TA)".
- **JSON-LD Person:**
  - `jobTitle` diventa "Social media manager";
  - "comunicazione e marketing" restano in `knowsAbout`;
  - `homeLocation` Palagianello e `workLocation` Castellaneta restano come sono.
- **Prima frase della bio, se non c'è già:** "Nicola Carpignano è un social media manager di Palagianello e cofondatore di InLab Communication, l'agenzia di comunicazione con sede a Castellaneta."

### 2. `/gestione-social-palagianello` — priorità ALTA
- **Title** (57): "Social media manager a Palagianello | InLab Communication"
- **Description** (≤155): "Social media manager a Palagianello: Nicola Carpignano, cofondatore di InLab, è del paese. Gestione social, reel e sponsorizzate. Preventivo gratuito."
- **H1:** resta "Gestione social a Palagianello", così entrambe le ricerche sono coperte.
- **Link:** nel testo che cita Nicola, il nome diventa un link a `/autori/nicola-carpignano`.
- **Frase sotto l'H1 o nel primo paragrafo:** "A Palagianello il tuo social media manager è del paese: Nicola Carpignano, cofondatore di InLab Communication, segue di persona la comunicazione delle attività locali, da Sublime Tentazione a Masseria Sacramento."

### 3. `/agenzia-comunicazione-palagianello` — priorità BASSA
- Nella sezione "Palagianello è casa nostra", il link a Nicola usa come testo "Nicola Carpignano, social media manager di Palagianello", se non lo fa già.

### Note tecniche
- Nessun nuovo URL.
- Il jobTitle cambia solo nel Person JSON-LD di Nicola.

## Cosa misuro dopo
- Search Console: le query "nicola carpignano" e "social media manager palagianello", con posizione e impressioni tra 2-6 settimane.
- Nicola chiede l'indicizzazione di `/autori/nicola-carpignano` e `/gestione-social-palagianello` appena le modifiche sono online.
