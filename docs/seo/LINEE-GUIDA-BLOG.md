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

**Non supportati:** tabelle, codice, HTML. Al posto delle tabelle usa elenchi
come "**Opzione A:** … / **Opzione B:** …".

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
| `date` | data **reale** di pubblicazione (`AAAA-MM-GG`). Non pubblicare più articoli con la stessa data se non sono usciti davvero insieme. |
| `cover` | **obbligatoria.** Immagine 16:9, almeno 1600×900, in WebP o JPG compressa (< 250 KB). |

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
    `/gestione-social-taranto`, `/siti-web-massafra`, ecc. (formato
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
- **Prezzi:** quando si parla di costi, dai **fasce realistiche** e spiega da cosa
  dipendono. Evitare l'argomento dei prezzi fa perdere lettori e fiducia.
- **Aggiornamento:** se una piattaforma cambia (nuove funzioni di Instagram, nuove
  regole di Meta Ads), l'articolo va aggiornato. Scrivi l'anno nel testo solo
  se lo aggiorneremo davvero.
- Rileggi: niente errori di battitura, frasi lunghe più di 25-30 parole, ripetizioni.

---

## 8. Immagini

- **Copertina obbligatoria** per ogni articolo (vedi sezione 5).
- 1 immagine ogni ~400 parole negli articoli lunghi: screenshot di esempio,
  schemi, foto dei nostri lavori (con autorizzazione del cliente).
- Il testo tra le parentesi quadre `![...]` diventa la **didascalia e il testo
  alternativo**: descrivi davvero l'immagine e, quando è naturale, includi la
  parola chiave. Es. `![Esempio di piano editoriale mensile per un ristorante](…)`.
- Nomi dei file descrittivi: `piano-editoriale-ristorante.webp`, non `IMG_2034.jpg`.
- Solo immagini nostre, create da noi o con licenza libera. Mai immagini prese
  da Google.

---

## 9. Checklist prima di pubblicare

- [ ] Parola chiave principale assegnata e **non già usata** da un altro articolo
- [ ] Parola chiave nel `title`, nel `seoTitle`, nello `slug`, nelle prime 2 frasi e in almeno un `##`
- [ ] `seoTitle` ≤ 60 caratteri, `seoDescription` 140-155 caratteri
- [ ] Almeno 1.200 parole, 5-8 sezioni `##`
- [ ] Risposta breve all'inizio (se l'articolo risponde a una domanda)
- [ ] Almeno un esempio concreto o locale + un paragrafo di esperienza InLab
- [ ] Sezione `## Domande frequenti` con 3-5 domande
- [ ] Link al servizio collegato + 1-3 articoli + `/contatti`
- [ ] Aggiunto un link verso il nuovo articolo in un articolo esistente
- [ ] Copertina presente, immagini con descrizione
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
| Gestione Social | `/gestione-social` | costi, cosa include, come scegliere, piano editoriale, social per settore (ristoranti, dentisti, negozi…) | *gestione social attività locali* → `gestione-social-attivita-locale-cosa-include` |
| Video & Reels | `/video` | idee per reel per settore, come girare reel, durata, trend, reel vs post | *reel o post Instagram* → `reel-o-post-cosa-pubblicare-instagram` |
| Siti Web & Web App | `/siti-web` | costi di un sito, sito vs social, SEO locale, scheda Google, e-commerce, landing page | *sito web o social* → `sito-web-o-solo-social-attivita-locale` |
| Meta Ads | `/meta-ads` | quanto investire, sponsorizzate Instagram, errori comuni, campagne per attività locali | — |
| Automazioni AI | `/automazioni-ai` | chatbot per attività locali, risposte automatiche WhatsApp/Instagram, AI per piccole imprese | — |
| Foto & Shooting | `/shooting` | shooting per ristoranti/prodotti, foto per i social, come prepararsi a uno shooting | — |
| Branding & Identità | `/branding` | logo, rebranding, identità visiva, nome dell'attività (caso Paresteta) | — |

Casi studio da citare: `/casi-studio/paresteta` (rebranding e lancio di un'attività
locale), `/casi-studio/ricciardi` (sito, lead generation e social per uno studio
dentistico).

---

*Ultimo aggiornamento: 28 settembre 2026, responsabile SEO. Versione 1: scritta
sulla base dell'analisi del sito e degli articoli pubblicati. Dalla prossima
versione le priorità saranno basate sui dati di Google Analytics e Search Console.*
