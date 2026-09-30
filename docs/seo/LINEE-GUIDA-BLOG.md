# Linee guida del blog InLab

Manuale per chi scrive gli articoli del blog di InLab Communication.
Lo cura il **responsabile SEO**: lo aggiorna in base ai dati di Google Analytics e
Search Console. Va letto per intero prima di scrivere e riletto quando cambia
(la data dell'ultima modifica è in fondo).

**Obiettivo del blog:** far trovare InLab su Google alle persone e alle aziende
che cercano quello che facciamo, soprattutto in provincia di Taranto e in Puglia,
e portarle a **chiederci un preventivo**. Un articolo che riceve visite ma non
porta nessuno verso i servizi o i contatti ha fatto solo metà del lavoro.

---

## 1. Come lavoriamo insieme

| Chi | Cosa fa |
|---|---|
| **Responsabile SEO** | Analizza i dati ogni settimana, decide le priorità, assegna gli articoli con la parola chiave, controlla il risultato, cura la SEO tecnica del sito (codice, sitemap, dati strutturati, velocità). |
| **Addetto al blog** | Scrive gli articoli nuovi e aggiorna quelli vecchi seguendo queste linee guida e il brief della settimana. Non modifica il codice del sito, a parte il file degli articoli (`src/data/blogSeed.ts`). |

**Ogni settimana:**

1. Il responsabile SEO pubblica il brief in `docs/seo/brief/AAAA-MM-GG.md`.
2. L'addetto al blog lo legge e lavora **nell'ordine di priorità** indicato.
3. Alla fine compila la sezione **"Resoconto dell'addetto al blog"** in fondo al
   brief: cosa ha fatto, cosa no e perché, dubbi, idee.
4. La settimana dopo il responsabile misura i risultati e aggiorna brief e linee guida.

### Dove si scrivono gli articoli (regola tecnica, non negoziabile)
Il sito legge gli articoli **solo** da due posti:
1. `src/data/blogSeed.ts`, l'array `BLOG_SEED` (formato `BlogPost`);
2. la dashboard `/admin` → Blog (collezione Firestore `blog_posts`).

I file in `content/blog/*.md` **non vengono letti dal sito**: un articolo scritto
solo lì non va online. Si può usare `content/blog/` come bozza, ma l'articolo
è consegnato solo quando si trova in `BLOG_SEED`. Se serve un campo che
`BlogPost` non ha, chiedilo nel resoconto: lo aggiunge il responsabile SEO.

### Due tipi di articolo
- **Evergreen (priorità):** guide che rispondono a ricerche stabili nel tempo
  (costi, "come fare", confronti). Le assegna il responsabile SEO nel brief, in
  base ai dati.
- **Novità:** aggiornamenti di Meta, Google, TikTok, normative. Nascono dal
  monitoraggio delle fonti descritto in `docs/blog-brief.md` (classificazione
  A/B/C). Si pubblicano solo per notizie A o B forti, e **solo dopo** aver
  completato i compiti di priorità 1 del brief in corso.

**Le indicazioni si basano sui dati, non sui gusti personali.** Ogni richiesta del
responsabile SEO deve indicare da dove nasce: numeri di Google Analytics o Search
Console, analisi dei risultati su Google, regole di Google o queste linee guida.
Una richiesta senza motivazione si può contestare. Allo stesso modo, anche le
proposte dell'addetto al blog vanno motivate con dati o ricerche.

Se un'indicazione non è chiara o pensi che sia sbagliata, scrivilo nel resoconto:
non ignorarla in silenzio.

---

## 2. A chi scriviamo

- **Titolari di attività locali** in provincia di Taranto (Castellaneta, Palagiano,
  Palagianello, Massafra, Mottola, Laterza, Ginosa, Taranto) e in Puglia:
  ristoranti, bar, negozi, studi medici e dentistici, centri estetici,
  palestre, artigiani, professionisti.
- **Piccole e medie imprese** che vogliono crescere online ma non hanno un reparto
  marketing.
- Non sono esperti di marketing: niente gergo non spiegato. Se scrivi "CTR",
  "funnel" o "lead", spiega cosa sono la prima volta.
- Hanno poco tempo e vogliono sapere: **quanto costa, quanto tempo serve, cosa
  ottengo, come scelgo, cosa posso fare da solo.**

Tono: diretto, concreto, amichevole, competente. Si dà del "tu". Niente promesse
di risultati garantiti.

---

## 3. Prima di scrivere: la parola chiave

Ogni articolo ha **una parola chiave principale** (assegnata nel brief) e 3-6
**parole chiave secondarie** (sinonimi, varianti, domande collegate).

- **Un articolo = una ricerca.** Due articoli che puntano alla stessa parola chiave
  si fanno concorrenza su Google (si chiama *cannibalizzazione*). Prima di
  proporre un argomento controlla la **mappa delle parole chiave** (sezione 10).
- **Capisci cosa vuole chi cerca** (l'*intento di ricerca*):
  - *informativo* ("come fare reel per un ristorante") → guida pratica passo passo;
  - *di confronto* ("agenzia social o social media manager freelance") → pro e
    contro, tabella, consiglio finale onesto;
  - *di costo* ("quanto costa un sito web") → fasce di prezzo reali, da cosa
    dipendono, esempi;
  - *locale/commerciale* ("agenzia social Taranto") → questo lo coprono le pagine
    dei servizi, **non il blog**: il blog deve linkarle.
- **Guarda cosa c'è già su Google** per quella ricerca: leggi i primi 5 risultati
  e scrivi qualcosa di **più utile, più concreto e più aggiornato**. Non copiarli:
  aggiungi quello che manca a loro.

---

## 4. Struttura dell'articolo

### Lunghezza
- **Minimo 1.200 parole** per le guide, **1.500-2.200** per gli argomenti
  competitivi (costi, confronti, guide complete).
- La lunghezza serve a **rispondere a tutte le domande** di chi cerca, non a
  riempire. Ogni paragrafo deve aggiungere qualcosa.

### Schema da seguire

1. **Introduzione (60-120 parole).** La parola chiave principale compare nelle
   **prime 2 frasi**. Dì subito il problema del lettore e cosa troverà
   nell'articolo. Niente frasi generiche come "Nel mondo di oggi i social sono
   importanti".
2. **Risposta breve subito.** Se l'articolo risponde a una domanda ("quanto costa…",
   "meglio X o Y…"), metti la risposta in 2-3 frasi in **grassetto** all'inizio.
   Google spesso la mostra in evidenza.
3. **Corpo diviso in sezioni `##`** (5-8 sezioni), con sottosezioni `###` quando
   servono. I titoli delle sezioni sono **frasi chiare che contengono varianti
   della parola chiave o domande reali**, non titoli creativi e vaghi.
4. **Almeno un elemento pratico:** elenco di passaggi, checklist, esempio con
   numeri, errore comune da evitare, esempio di un'attività reale del territorio.
5. **Esperienza InLab.** Almeno un paragrafo con qualcosa che **solo noi possiamo
   dire**: un caso reale (Paresteta, Studio Ricciardi, altri clienti), un dato dei
   nostri progetti, cosa abbiamo imparato lavorando con attività locali. È quello
   che distingue un articolo nostro da uno generico scritto da un'AI.
6. **Sezione `## Domande frequenti`** con 3-5 domande reali (formulate come le
   scriverebbe una persona su Google) e risposte di 2-4 frasi.
7. **Chiusura con invito all'azione:** link al servizio collegato + link a
   `/contatti`, con una frase concreta ("Raccontaci la tua attività: in 24 ore ti
   diciamo da dove partiremmo").

### Formattazione disponibile
Il sito supporta **solo** questa sintassi (il resto viene mostrato come testo):

- `## Titolo` e `### Sottotitolo` (anche `####`). **Mai `#`**: il titolo principale
  (H1) è il campo `title`.
- `**grassetto**`, `*corsivo*`
- `[testo del link](/pagina)` per i link interni, `[testo](https://...)` per quelli esterni
- `- elenco puntato` e `1. elenco numerato`
- `> citazione`
- `![descrizione dell'immagine](https://...)` **su una riga da sola**
- `---` per una linea di separazione

**Non supportati:** tabelle, codice, HTML. Una tabella in Markdown (`| … |`) sul
sito compare come righe di testo con le barre verticali: è un errore visibile.
Al posto delle tabelle usa elenchi come "**YouTube:** 41,2 milioni (-2,4%)" oppure
"**Opzione A:** … / **Opzione B:** …".

Paragrafi corti (2-4 righe da telefono). Il grassetto va sui concetti chiave,
non su frasi intere ogni due righe.

---

## 5. Campi SEO (obbligatori)

| Campo | Regole |
|---|---|
| `slug` | minuscolo, parole separate da `-`, **3-6 parole**, contiene la parola chiave, niente date né parole inutili (`il`, `di`, `e`). Es. `quanto-costa-gestione-social`. **Non si cambia mai dopo la pubblicazione.** |
| `title` (H1) | chiaro e specifico, contiene la parola chiave, può essere lungo. Promette un beneficio concreto. |
| `seoTitle` | **massimo 60 caratteri** (spazi inclusi). Parola chiave **all'inizio**, chiusura ` \| InLab`. Deve invogliare al clic: numero, anno, "guida", "esempi", "costi". |
| `seoDescription` | **140-155 caratteri**. Contiene la parola chiave, dice cosa si impara e invita a leggere. Non ripete il titolo. |
| `excerpt` | 1-2 frasi (max ~200 caratteri) per l'anteprima nel blog. |
| `category` | una tra: `Social media`, `Video & Reel`, `Siti web`, `Strategia`, `Advertising`. |
| `tags` | 3-6 tag, in minuscolo, riutilizzando quelli già esistenti quando possibile. |
| `author` | `Nicola Carpignano` (strategia, social, advertising, dati) o `Ilaria Gemma` (video, foto, contenuti visivi). |
| `date` | data **reale** di pubblicazione (`AAAA-MM-GG`). Non pubblicare più articoli con la stessa data se non sono usciti davvero insieme. **Non si cambia** quando si aggiorna l'articolo. |
| `updated` | data dell'ultimo aggiornamento **sostanziale** (`AAAA-MM-GG`): nuove sezioni, dati aggiornati, riscrittura. Non per un refuso. **Non si mette sugli articoli nuovi.** Google la legge come data di modifica e la sitemap la usa come data dell'ultima modifica. |
| `cover` | **obbligatoria.** Percorso (es. `/blog/<slug>/cover.jpg`) o URL. **JPG 1600×900 (16:9)** generata con `tools/blog-images`, < 250 KB. È anche l'immagine di anteprima sui social: il JPG è letto da tutte le piattaforme e Google consiglia immagini larghe almeno 1200 px. Tieni testo e soggetto lontani dai bordi (circa 40 px). |
| `coverAlt` | descrizione concreta della copertina (cosa si vede), 8-15 parole. Se manca si usa il titolo, ma va sempre compilata. |

Conta sempre i caratteri di `seoTitle` e `seoDescription` prima di consegnare.

---

## 6. Link

- **Interni, 3-6 per articolo:**
  - **1 link obbligatorio al servizio collegato** (tabella in sezione 10), con un
    testo del link descrittivo: "[gestione social per aziende](/gestione-social)",
    **mai** "clicca qui".
  - 1-3 link ad **altri articoli del blog** sull'argomento.
  - 1 link a un **caso studio** quando pertinente (`/casi-studio/paresteta`,
    `/casi-studio/ricciardi`).
  - 1 link a `/contatti` nella chiusura.
  - Quando parli di una città, puoi linkare la pagina locale del servizio:
    `/gestione-social-taranto`, `/siti-web-mottola`, ecc. (formato
    `/{servizio}-{città}`, città in minuscolo).
- **Quando pubblichi un articolo nuovo, aggiungi un link verso di lui in almeno
  1 articolo già esistente** dello stesso argomento. Un articolo senza link che
  arrivano verso di lui è difficile da trovare anche per Google.
- **Esterni:** 1-2 per articolo verso fonti autorevoli (documentazione ufficiale di
  Meta, Google, Instagram, ISTAT, studi di settore) quando citi un dato. Mai verso
  concorrenti.

---

## 7. Qualità ed E-E-A-T (esperienza, competenza, autorevolezza, affidabilità)

Google premia i contenuti scritti da chi ha **esperienza vera**. Quindi:

- **Niente contenuto generico.** Se una frase potrebbe stare nel blog di qualsiasi
  agenzia italiana, riscrivila con un esempio, un numero o un caso locale.
- **Dati solo se veri e con la fonte.** Non inventare statistiche, percentuali,
  clienti o risultati. Se non hai il dato, spiega il ragionamento.
- **Esempi del territorio:** "un bar a Castellaneta", "uno studio a Massafra", la
  stagionalità del turismo sulla costa di Castellaneta Marina e Ginosa Marina,
  gli eventi locali. Rende l'articolo utile e rafforza la SEO locale.
- **Prezzi: mai i prezzi dei nostri pacchetti.** Indicazione del titolare (Nicola
  Carpignano, 29/09/2026): negli articoli non si pubblicano prezzi, fasce o
  "a partire da" dei servizi InLab. **Si possono citare i prezzi generici**:
  abbonamenti e tariffe di piattaforme e strumenti (Meta One, messaggi WhatsApp
  Business, un software) e dati di mercato, sempre con la fonte e la data.
  Quando il lettore si chiede quanto costa un nostro servizio, spiega **da cosa
  dipende il costo** e **come confrontare due preventivi**, poi invita a
  chiedere un preventivo.
- **Casi dei clienti: per ora restano come sono.** Il titolare preparerà casi
  studio completi (29/09/2026). Fino ad allora cita i clienti solo con quello
  che c'è già nelle schede `/cliente/...` e nei casi studio, senza aggiungere
  dettagli o numeri, e non chiedere informazioni sui clienti.
- **Aggiornamento:** se una piattaforma cambia (nuove funzioni di Instagram, nuove
  regole di Meta Ads), l'articolo va aggiornato. Scrivi l'anno nel testo solo
  se lo aggiorneremo davvero.
- Rileggi: niente errori di battitura, frasi lunghe più di 25-30 parole, ripetizioni.

---

## 8. Immagini

**Compito fisso dell'addetto al blog, a ogni articolo nuovo o aggiornato**, prima
della consegna e senza aspettare l'analisi del responsabile SEO: tutte le
immagini dell'articolo (copertina e interne) rispettano le regole qui sotto,
cioè nome del file, testo alternativo, peso e metadati IPTC. Il responsabile
SEO lo controlla a ogni analisi.

- **Copertina obbligatoria** per ogni articolo (vedi sezione 5).
- 1 immagine ogni ~400 parole negli articoli lunghi: screenshot di esempio,
  schemi, foto dei nostri lavori (con autorizzazione del cliente).
- Il testo tra le parentesi quadre `![...]` diventa la **didascalia e il testo
  alternativo**: descrivi davvero l'immagine e, quando è naturale, includi la
  parola chiave. Es. `![Esempio di piano editoriale mensile per un ristorante](…)`.
- **Nomi dei file descrittivi**, in minuscolo con i trattini:
  `piano-editoriale-ristorante.webp`, non `IMG_2034.jpg` né `immagine1.webp`.
  La copertina può restare `cover.jpg` perché la cartella ha già lo slug
  (`/blog/<slug>/cover.jpg`).
- **Testo alternativo** (`coverAlt` e `![...]`): descrive cosa si vede, 8-15
  parole, in italiano, senza "immagine di" o "foto di" all'inizio e senza
  ripetere la stessa parola chiave in ogni immagine. Se nell'immagine c'è del
  testo (un'infografica), il testo alternativo ne riassume il contenuto.
- **Didascalia utile:** il testo attorno all'immagine conta quanto il testo
  alternativo. Metti l'immagine vicino al paragrafo che la spiega.
- **Formato e peso:** copertina JPG 1600×900 sotto i 250 KB; immagini interne
  in WebP sotto i 150 KB, larghe al massimo 1600 px.
- **Dati dell'autore nel file** (metadati IPTC: autore "InLab Communication",
  copyright "© InLab Communication"): Google Immagini li mostra come crediti.
  Li inserisce lo strumento `tools/blog-images`.
- Solo immagini nostre, create da noi o con licenza libera. Mai immagini prese
  da Google.

---

## 9. Checklist prima di pubblicare

- [ ] Parola chiave principale assegnata e **non già usata** da un altro articolo
- [ ] Parola chiave nel `title`, nel `seoTitle`, nello `slug`, nelle prime 2 frasi e in almeno un `##` (la frase esatta o quasi, non solo una parola)
- [ ] `seoTitle` ≤ 60 caratteri, `seoDescription` 140-155 caratteri
- [ ] Almeno 1.200 parole, 5-8 sezioni `##`
- [ ] Risposta breve all'inizio (se l'articolo risponde a una domanda)
- [ ] Almeno un esempio concreto o locale + un paragrafo di esperienza InLab
- [ ] Sezione `## Domande frequenti` con 3-5 domande
- [ ] Link al servizio collegato + 1-3 articoli + `/contatti`
- [ ] Aggiunto un link verso il nuovo articolo in un articolo esistente
- [ ] Articolo inserito in `src/data/blogSeed.ts` (non solo in `content/blog/`)
- [ ] Copertina presente con `coverAlt` di 8-15 parole, immagini con descrizione, nomi dei file descrittivi, pesi nei limiti (sezione 8)
- [ ] Se è un aggiornamento: `updated` compilato, `date` e `slug` invariati. Se è nuovo: niente `updated`
- [ ] Nessun dato inventato, nessuna promessa di risultati garantiti
- [ ] Solo la sintassi supportata (niente `#`, tabelle, HTML)
- [ ] Data reale, autore giusto, categoria e tag corretti
- [ ] Riletto da telefono: paragrafi corti, niente muri di testo

---

## 10. Mappa servizi e parole chiave

Ogni articolo deve portare verso **uno** di questi servizi. La colonna "Già
coperte" evita i doppioni: aggiornala ogni volta che pubblichi.

| Servizio | Pagina | Argomenti per il blog | Già coperte (parola chiave → articolo) |
|---|---|---|---|
| Gestione Social | `/gestione-social` | costi, cosa include, come scegliere, piano editoriale, social per settore (ristoranti, dentisti, negozi…) | *gestione social per attività locali* → `gestione-social-attivita-locale-cosa-include`; *quante volte pubblicare sui social* → `quante-volte-pubblicare-social`; *Meta One aziende* → `meta-one-aziende` |
| Video & Reels | `/video` | idee per reel per settore, come girare reel, durata, trend, reel vs post | *reel o post Instagram* → `reel-o-post-cosa-pubblicare-instagram`; *idee reel per ristoranti* → `idee-reel-ristoranti`; *SEO su TikTok* → `seo-tiktok-search-ads` |
| Siti Web & Web App | `/siti-web` | costi di un sito, sito vs social, SEO locale, scheda Google, e-commerce, landing page | *sito web per attività locali* → `sito-web-o-solo-social-attivita-locale`; *Google Business Profile GA4* → `google-business-profile-ga4`; *report AI Overviews Search Console* → `ai-overviews-search-console-report`; *SEO per AI Overviews / GEO* → `seo-ai-overviews-geo-google` |
| Meta Ads | `/meta-ads` | quanto investire, sponsorizzate Instagram, errori comuni, campagne per attività locali | *sponsorizzate Instagram per attività locali* → `sponsorizzate-instagram-attivita-locali`; *Meta Ads 2026* → `meta-ads-creativita-advantage` |
| Automazioni AI | `/automazioni-ai` | chatbot per attività locali, risposte automatiche WhatsApp/Instagram, AI per piccole imprese | *WhatsApp Business AI* → `whatsapp-business-ai`; *contenuti AI obblighi / AI Act* → `contenuti-ai-obblighi-ai-act` |
| Email e newsletter (nessuna pagina dedicata) | `/siti-web` come servizio principale, `/automazioni-ai` come secondario | newsletter, privacy delle email, moduli di iscrizione | *tracking pixel email Garante* → `tracking-pixel-email-garante` |
| Foto & Shooting | `/shooting` | shooting per ristoranti/prodotti, foto per i social, come prepararsi a uno shooting | — |
| Branding & Identità | `/branding` | logo, rebranding, identità visiva, nome dell'attività (caso Paresteta) | — |

**Coppie da tenere distinte** (argomenti vicini: ognuna ha il suo intento, non
scrivere un terzo articolo sullo stesso tema senza chiederlo nel resoconto):
- `sponsorizzate-instagram-attivita-locali` (guida pratica) ↔ `meta-ads-creativita-advantage` (novità 2026);
- `ai-overviews-search-console-report` (misurare) ↔ `seo-ai-overviews-geo-google` (ottimizzare);
- `gestione-social-attivita-locale-cosa-include` contiene già "come scegliere" e
  "domande da fare prima di scegliere": un articolo nuovo su *come scegliere un
  social media manager* rischia di fargli concorrenza.

Casi studio da citare: `/casi-studio/paresteta` (rebranding e lancio di un'attività
locale), `/casi-studio/ricciardi` (sito, lead generation e social per uno studio
dentistico).

---

## 11. Cosa abbiamo imparato (da dati, ricerche e regole di Google)

- **FAQ e risultati di Google.** Dall'agosto 2023 Google mostra le FAQ come
  risultato arricchito solo per siti governativi e sanitari autorevoli (Google
  Search Central, annuncio sui risultati FAQ e HowTo). Per questo il sito non
  genera lo schema FAQPage. La sezione `## Domande frequenti` resta
  obbligatoria: risponde alle domande reali dei lettori e aiuta a comparire
  nelle risposte AI e nella sezione "Altre domande".
- **Siti creati dalla scheda Google.** Google li ha chiusi nel 2024: alcuni
  risultati tra i primi lo danno ancora per possibile. Controlla sempre la
  data delle informazioni che trovi nei primi risultati (segnalato
  dall'addetto al blog, 28/09/2026).
- **Il nostro vantaggio sui primi risultati.** Per i temi social e ads i primi
  risultati italiani sono blog di agenzie e freelance con consigli generici. Ci
  distinguiamo con esempi del territorio e casi reali con clienti nominati
  (segnalato dall'addetto al blog, 28/09/2026). Da confermare con i dati di
  Search Console.

---

*Ultimo aggiornamento: 29 settembre 2026, responsabile SEO. Versione 2: regola
sui prezzi, copertine JPG 16:9, tabelle, `updated` solo sugli aggiornamenti,
coppie di articoli vicini, sezione 11. Google Analytics e Search Console sono
collegati dal 28/09/2026: le priorità dei prossimi brief nasceranno dai loro dati.*
