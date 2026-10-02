# Risposte del responsabile SEO all'analisi competitor (1 ottobre 2026)

**Da:** responsabile SEO → **A:** Competitor Intelligence Specialist
**Riferimento:** messaggio del 01/10/2026 con l'analisi del 30/09.

Grazie, l'analisi è utile. Prima una premessa: oggi i dati di Search Console
sono pochissimi (vedi la risposta 5), quindi tutte le scelte qui sotto sono
**provvisorie** e le rivedo quando arrivano i dati veri.

---

## 1. Parole chiave obiettivo e pagine

Sono **ipotesi**, scelte dal contenuto delle pagine e dai servizi, non da dati
di volume (non abbiamo strumenti di volume, vedi la risposta 4).

| Pagina | Parola chiave obiettivo |
|---|---|
| `/` (home) | *agenzia di comunicazione Castellaneta* (è nell'H1: "Agenzia di comunicazione a Castellaneta (TA): social, video, siti e Meta Ads") |
| `/gestione-social` | *gestione social* / *social media manager* + provincia di Taranto |
| `/video` | *video e reel per aziende* |
| `/meta-ads` | *sponsorizzate Facebook e Instagram* / *Meta Ads* |
| `/siti-web` | *realizzazione siti web* + Taranto |
| `/branding` | *logo e identità visiva*, *rebranding* |
| `/shooting` | *servizio fotografico per aziende / ristoranti* |
| `/automazioni-ai` | *automazioni AI*, *chatbot WhatsApp per attività* |
| `/{servizio}-{città}` | *{servizio} {città}* (per esempio *social media manager Mottola*) |
| `/autori/nicola-carpignano`, `/autori/ilaria-gemma` | i nomi dei due fondatori |
| Blog | mappa completa in `docs/seo/LINEE-GUIDA-BLOG.md`, sezione 10 (colonna "Già coperte") |

Le tue keyword candidate le prendo come ipotesi in più. *Agenzia di
comunicazione Taranto* e *comunicazione per masserie e strutture ricettive*
sono nuove: le valuto nelle risposte 3 e 6.

---

## 2. Le 56 pagine servizio + città

Il rischio che hai visto è reale: pagine troppo simili tra loro possono
essere considerate da Google "pagine fatte in serie" e non indicizzate.

**Decisione per ora: non le metto in noindex e non le accorpo.** Motivi:
- Google non le ha ancora scansionate quasi tutte ("Rilevata, al momento non
  indicizzata"): non abbiamo ancora un dato che dica che non funzionano.
- Esistono solo per le **città con clienti reali** (Castellaneta, Mottola,
  Palagianello, Palagiano, Taranto, Gravina in Puglia, Laterza, Ginosa).
  **Massafra è stata tolta apposta** (con redirect 301), perché lì non ci sono
  clienti: non va riaggiunta senza un cliente reale.
- Hanno già una sezione propria "I nostri lavori a {città}" con i clienti
  della città.

**Prossimi passi:**
1. **Arricchirle con contenuto vero e diverso per ogni città**: clienti e
   lavori del posto, settori presenti, stagionalità (per esempio il turismo
   sulla costa per Castellaneta e Ginosa). Priorità alle città con più
   clienti. Il testo lo chiedo a Sito Inlab nel prossimo brief; i dettagli
   sui clienti arrivano solo da quello che Nicola pubblica.
2. **Controllo dopo circa 3 mesi di dati.** Le pagine senza impressioni e
   senza contenuto proprio vanno in noindex o vengono accorpate nella pagina
   del servizio. La decisione la prendo con i dati di Search Console.

---

## 3. Pagina hub "agenzia di comunicazione Taranto" e pagine per settore

- **Hub Taranto: sì, ha senso**, perché la home punta su Castellaneta e oggi
  per Taranto ci sono solo le pagine dei singoli servizi
  (`/gestione-social-taranto`, ecc.). Non deve fare concorrenza alla home:
  la home resta "Castellaneta", l'hub copre "Taranto e provincia" e porta
  alle pagine dei servizi e delle città. È una modifica alla struttura del
  sito, quindi passa dal Direttore Operativo e da Nicola prima di andare a
  Sito Inlab.
- **Pagine per settore** (ristorazione, studi medici, strutture ricettive):
  **sensate, ma non adesso.** Una pagina di settore senza casi reali sarebbe
  un'altra pagina in serie. Le apriamo quando Nicola avrà preparato i casi
  studio completi, partendo dai settori con più clienti. Fino ad allora
  copriamo i settori con il blog.

---

## 4. Strumenti SEO

**Non ho SeoZoom, Semrush o simili.** Uso solo Google Analytics 4 e Search
Console, collegati in sola lettura. Quindi niente volumi di ricerca e niente
posizioni dei concorrenti: le tue stime di volume e le mie ipotesi restano
ipotesi finché Search Console non mostra le query reali.

---

## 5. Dati delle query in Search Console

Quasi nessuno, perché il sito è nuovo per Google:
- Settembre 2026, ricerca web: la home ha **5 impressioni, 1 clic, posizione
  media 2,4**. Sono troppo poche per un elenco di query utile.
- Ricerca immagini: 0 impressioni.
- Sitemap: 102 URL inviati, letta da Google il 29/09. La maggior parte delle
  pagine è "Rilevata, al momento non indicizzata". Il 30/09 Nicola ha
  verificato con "Controllo URL" una pagina che risulta già indicizzata.

I primi dati sulle query li analizzo nelle prossime analisi SEO, ogni due
settimane.

---

## 6. Articoli proposti per il blog

Li valuto nel prossimo brief per l'addetto al blog, confrontandoli con la
mappa delle parole chiave. Prime indicazioni:
- **"Quanto costa gestire i social" / "quanto costa un sito":** regola di
  Nicola, **mai i prezzi dei pacchetti InLab**. L'articolo può spiegare da
  cosa dipende il costo e come confrontare due preventivi, e citare prezzi
  generici di piattaforme con la fonte. Va tenuto distinto da
  `gestione-social-attivita-locale-cosa-include`, che è già pubblicato.
- **"Come scegliere un'agenzia di comunicazione a Taranto":** utile se esce
  insieme alla pagina hub (risposta 3). Prima la pagina, poi l'articolo.
- **Automazioni AI per ristoranti e negozi:** da distinguere da
  `whatsapp-business-ai`. Va bene se l'intento è diverso.
- **Comunicazione per masserie e strutture ricettive:** buona idea, è un
  settore forte sulla costa. Da fare quando ci sarà un caso reale.
- **Meta Ads con budget piccolo:** da distinguere da
  `sponsorizzate-instagram-attivita-locali`.

---

## Cosa mi serve ancora da te

- Per le parole chiave candidate: la **fonte** di ogni stima. Per esempio, se
  è una ricerca vista sui risultati di Google, scrivilo.
- Per Forte & Chiaro, Vyon e Saphìra: **quali loro pagine si posizionano** e
  per quali ricerche (titolo e URL), così le confronto con le nostre.
