# Tempi dei risultati: testi da allineare (23/11/2026)

**Decisione di Nicola (23/11, tramite il Direttore):**
- non scrivere mai che "servono alcuni mesi", "4-6 mesi" o "almeno tre mesi" per vedere i risultati;
- i primi risultati si vedono **già dopo il primo mese**;
- chi pensa di fermarsi dopo un mese è meglio che non inizi: sarebbe una spesa, non un investimento;
- i social sono un investimento.

**Limiti:**
- nessun numero garantito;
- nessun prezzo;
- non si promettono tempi per le posizioni su Google, perché quelle non dipendono solo da noi.

**Testo di riferimento:** la FAQ di `/gestione-social` scelta dal Direttore (`docs/direzione/TESTO-FAQ-TEMPI-RISULTATI-2026-11-23.md`, già nella PR della Direzione per Sito Inlab).

**Regola anti-somiglianza:**
- le frasi qui sotto sono tutte diverse tra loro e diverse dalla FAQ di `/gestione-social`;
- la frase "se pensi di fermarti dopo un mese, meglio non iniziare" resta solo lì;
- altrove lo stesso concetto è detto con parole diverse.

**Ricerca fatta su:** `origin/main` del 23/11 (`src/data/`, `docs/seo/`). Non toccano il tema: i contenuti in cui "mesi" indica altro (scadenze di legge, contratti di prova, piano editoriale "per tre mesi", Inox Racing "4 mesi di agenda piena").

---

## Richieste per lo sviluppo: Sito Inlab (dati)

Un commit per punto. Stessa grafica, stessi spazi, solo testo.

### S1. `src/data/cities.ts` riga 84: FAQ Taranto
- **Domanda (resta uguale):** "Quanto tempo serve per vedere risultati a Taranto?"
- **Risposta oggi:** "Per le sponsorizzate bastano poche settimane per i primi contatti. Per la visibilità su Google e la crescita dei social servono alcuni mesi di lavoro costante. Te lo spieghiamo con numeri chiari, mese per mese."
- **Risposta nuova:**
  > "I primi effetti si vedono già dopo il primo mese: contenuti visti da più persone della zona, i primi messaggi e, con le sponsorizzate, i primi contatti. Poi i risultati si rafforzano mese dopo mese, se il lavoro continua. Per questo la comunicazione è un investimento e non una prova di qualche settimana. Ogni mese ti mostriamo i numeri in modo chiaro."
- **Controllo tecnico:**
  - la FAQ finisce anche nello schema FAQPage della pagina; serve solo verificare che il testo nel JSON-LD sia identico a quello visibile;
  - attenzione alle virgolette dentro la stringa.

### S2. `src/data/gsFaq.ts` riga 12: FAQ di `/gestione-social`
È già coperta dalla PR della Direzione con il testo scelto da Nicola. **Nessuna richiesta in più da parte mia.**

---

## Richieste per il Blog (articoli in `src/data/blogSeed.ts`)

Per ogni articolo:
- un commit;
- dopo la modifica, aggiornare `dateModified`.

I numeri di riga si riferiscono a `origin/main` del 23/11.

### B1. `gestione-social-attivita-locale-cosa-include` riga 158 (elenco errori)
- **Oggi:** "- **Fermarsi dopo un mese.** I social danno risultati con la costanza: servono almeno tre mesi per capire cosa funziona."
- **Nuovo:**
  > "- **Fermarsi dopo un mese.** I primi segnali arrivano già dopo il primo mese, ma è la continuità a trasformarli in clienti. Chi parte con l'idea di smettere subito trasforma un investimento in una spesa."

### B2. Stesso articolo, riga 176 (FAQ "Quanto tempo serve per vedere risultati dalla gestione social?")
- **Oggi:** "Di solito servono almeno tre mesi di pubblicazione costante per capire cosa funziona e vedere una crescita stabile. Con le sponsorizzate i primi contatti possono arrivare prima, ma la base resta un profilo curato."
- **Nuovo:**
  > "I primi segnali si vedono già dopo il primo mese: più visualizzazioni, più interazioni, i primi messaggi. Pubblicando con costanza capisci presto cosa funziona meglio, e la crescita diventa stabile. Le sponsorizzate possono anticipare i primi contatti, ma la base resta un profilo curato."

### B3. `agenzia-comunicazione-taranto-come-scegliere` riga 2754 (FAQ "Quanto tempo serve per vedere i primi risultati?")
- **Oggi:** "Con le sponsorizzate i primi contatti possono arrivare in poche settimane. La crescita dei social e la visibilità su Google richiedono invece alcuni mesi di lavoro costante. Diffida di chi promette risultati importanti in pochi giorni."
- **Nuovo:**
  > "Un buon lavoro mostra i primi risultati già dopo il primo mese, e con le sponsorizzate i primi contatti possono arrivare anche prima. Da lì i risultati crescono solo se la comunicazione continua: va pensata come un investimento, non come un tentativo di poche settimane. Diffida di chi promette risultati importanti in pochi giorni, e chiedi all'agenzia cosa misurerete insieme già alla fine del primo mese."

### B4. `social-media-manager-taranto` riga 2879 (FAQ "Quanto tempo serve per vedere risultati?")
- **Oggi:** "I primi segnali, come più messaggi e più interazioni dalle persone della zona, arrivano di solito nei primi mesi. Una crescita stabile richiede costanza nel tempo. Le sponsorizzate possono accelerare, se c'è un'offerta chiara."
- **Nuovo:**
  > "Più messaggi e più interazioni dalle persone della zona si notano già dopo il primo mese. Da lì in poi conta la costanza: un social media manager lavora bene se ha tempo per costruire, non se viene giudicato dopo poche settimane. Le sponsorizzate possono accelerare, se c'è un'offerta chiara."

### B5. `pubblicizzare-attivita-locale-provincia-taranto` riga 3710 (FAQ "Quanto tempo serve per vedere risultati?")
- **Oggi:** "Le sponsorizzate danno i primi contatti in poche settimane. Scheda Google, recensioni e social crescono in qualche mese di lavoro costante."
- **Nuovo:**
  > "Le sponsorizzate possono dare i primi contatti in poche settimane, e già dopo il primo mese si vedono i primi effetti anche sui social. Scheda Google e recensioni migliorano passo dopo passo: più a lungo lavori con costanza, più la pubblicità rende."

### B6. `social-investimento-risultati-clienti` riga 3936 (FAQ "In quanto tempo si vedono i risultati sui social?")
- **Oggi:** "Dipende dall'attività e dall'obiettivo. I primi segnali, come più messaggi e più richieste, arrivano spesso nei primi mesi; i risultati più solidi, come agenda piena o eventi sold out, si costruiscono nel tempo."
- **Nuovo:**
  > "Dipende dall'attività e dall'obiettivo, ma i primi segnali, come più messaggi e più richieste, si vedono già dopo il primo mese. I risultati più solidi, come agenda piena o eventi sold out, arrivano con la continuità. È proprio questa la differenza tra spesa e investimento: chi smette dopo poche settimane paga senza raccogliere."
- **Nota:** è l'articolo dove il concetto "investimento" è il tema. Qui il messaggio di Nicola può essere più esplicito.

### Regola per gli articoli nuovi
È in `docs/seo/LINEE-GUIDA-BLOG.md` §13.

---

## Documenti SEO corretti da me (stesso commit di questo brief)
- `docs/seo/brief/2026-10-03-taranto.md`: FAQ Taranto, rimando a S1.
- `docs/seo/brief/2026-11-12-focus-gestione-social.md`: FAQ GS-3, rimando al testo della Direzione.
- `docs/seo/brief/2026-11-23-gs3-testi-esatti.md`: FAQ n. 4, sostituita dal testo della Direzione.
- `docs/seo/LINEE-GUIDA-BLOG.md`: nuova §13.
- `docs/seo/MANDATO-MASTER.md`: decisione del 23/11.

## Cosa misuro dopo
Nessun effetto SEO atteso da queste modifiche, che riguardano coerenza e fiducia.
- Controllo che la FAQ Taranto resti nei risultati arricchiti e che gli articoli non perdano impressioni, settimana del 30/11 e del 07/12.
