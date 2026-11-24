# GEO nei servizi: testo validato dalla SEO (24/11/2026)

**Richiesta di Nicola (24/11, tramite il Direttore):** dove si parla di SEO scrivere che facciamo anche la GEO (visibilità nelle risposte delle AI), con una sezione importante.
**Base:** proposta del Direttore `docs/direzione/TESTO-GEO-SERVIZI-2026-11-24.md`, branch `claude/hopeful-brahmagupta-u39zb3`.

## Verdetto SEO
La proposta è valida e coerente con i nostri articoli `seo-ai-overviews-geo-google` e `ai-overviews-search-console-report`: per Google la GEO resta SEO, niente promesse.

**Correzioni:**
1. **Nessuna pagina dedicata alla GEO per ora.**
   - **Dati, Google Trends Italia, 12 mesi (SerpApi, 24/11):**
     - "geo seo" ha un interesse intermittente: 0 in molte settimane, picchi tra 27 e 50;
     - "seo chatgpt", "seo per ai" e "generative engine optimization" sono quasi a 0, tra 0 e 11;
     - come riferimento, "realizzazione siti web" sta tra 33 e 78.
   - Una pagina a sé sarebbe sottile e farebbe concorrenza all'articolo `seo-ai-overviews-geo-google`, che risponde alla stessa ricerca informativa.
   - **Meglio:** una sezione nella pagina commerciale `/siti-web`, collegata all'articolo nei due sensi.
   - **Quando la rivaluto:** quando Search Console mostra almeno 50 impressioni al mese su ricerche "geo", "seo ai" o "chatgpt" per `/siti-web`.
2. **Il file llms.txt non va nell'elenco "cosa facciamo per te".** Google dice che per la sua Ricerca non serve, e il nostro articolo lo dice: metterlo tra i servizi lo contraddirebbe. Resta solo nella FAQ, spiegato com'è.
3. **Più precisione su cosa misuriamo,** con i nomi veri degli strumenti, come nei nostri articoli:
   - il canale "AI Assistant" di GA4;
   - il report "Generative AI performance" di Search Console, che mostra solo impressioni e non clic.
4. **Nessuna frase del tipo "ChatGPT già ci consiglia".** Non è misurato; "lo facciamo già sul nostro sito" invece è vero: JSON-LD, llms.txt e IndexNow sono online.
5. **Pulsante:** `/contatti?servizio=siti-web` oggi non preseleziona niente, perché il modulo riconosce solo `gestione-social` (`src/App.tsx` riga ~1365). Vedi il punto G6.
6. **Pagine `/siti-web-{città}`:** non si toccano adesso.
   - Il template città è sotto osservazione fino al 30/11 (R9).
   - Una frase uguale su tante pagine viola l'anti-somiglianza.
   - Se serve, la valuto dopo il 30/11.
7. **Design:** la sezione nuova è una modifica visibile chiesta da Nicola. Si fa riusando componenti e stili già presenti nella pagina (vedi G4): niente colori, font o animazioni nuovi. La home non si tocca.

---

## Richieste per lo sviluppo: Sito Inlab

Un commit per punto. Righe di `origin/main` del 24/11.

### G1. `/siti-web`, sottotitolo dell'hero (`src/App.tsx` riga ~996)
- **Oggi:** "Design curato, codice pulito, ottimizzazione SEO. Il tuo sito non è una brochure — è il miglior venditore che hai."
- **Nuovo:**
  > "Design curato, codice pulito, ottimizzazione SEO e GEO: per Google e per le risposte delle AI. Il tuo sito non è una brochure — è il miglior venditore che hai."
- **Controllo tecnico:** il testo è più lungo di 45 caratteri; verificare su mobile che l'hero non vada a capo male.

### G2. `/siti-web`, marquee (riga ~999)
Aggiungere `"GEO","✦",` subito dopo `"SEO","✦",`.

### G3. `/siti-web`, fase 5 di "Come lo costruiamo" (riga ~1015)
- **Titolo oggi:** "SEO on-page e contenuti".
- **Titolo nuovo:**
  > "SEO e GEO: contenuti e dati"
- **Testo oggi:** "Meta title, description, heading, schema markup, sitemap, velocità. Ottimizziamo ogni pagina per le keyword target — incluse quelle locali per le tue città."
- **Testo nuovo:**
  > "Meta title, description, heading, dati strutturati, FAQ, sitemap, velocità. Ottimizziamo ogni pagina per le ricerche che contano, anche quelle locali delle tue città, e la rendiamo chiara anche per le risposte delle AI di Google, di ChatGPT e di Gemini."

### G4. `/siti-web`, sezione nuova (dopo "Che tipo di sito?", prima di `<ServiceExamples slug="siti-web"/>`, riga ~1043)
- **Struttura:** la stessa della sezione "Come lo costruiamo":
  - colonna sinistra con `section-label`, H2 grande con seconda riga `stroke` e un paragrafo;
  - colonna destra con 4 `card`, come in "Che tipo di sito?".
  - Sotto ci sono la riga "Onestà", il link e le 3 FAQ.
  - Ancora `id="geo"`, per i link dal blog.
- **section-label:**
  > "SEO e GEO · Visibilità nelle risposte delle AI"
- **H2:**
  > "TI TROVANO" / riga stroke: "ANCHE LE AI"
- **Paragrafo:**
  > "Sempre più persone, prima di scegliere un ristorante, uno studio o un'agenzia, lo chiedono a ChatGPT, a Gemini o alle risposte AI di Google. Se il tuo sito non è chiaro, la tua attività non viene citata, e non te ne accorgi: quei clienti persi non lasciano traccia. Si chiama GEO, ottimizzazione per le risposte generate dalle AI. Per Google è la SEO fatta bene: per questo la facciamo insieme alla SEO, non come servizio a parte."
- **4 card** (titolo + testo):
  1. **"Pagine chiare"** — "Scriviamo pagine e FAQ che dicono subito chi sei, cosa fai, dove lavori e per chi: facili da leggere per le persone e da citare per le AI."
  2. **"Dati per le macchine"** — "Dati strutturati (schema) su ogni pagina e sito indicizzato su Google e Bing, con avviso immediato delle pagine nuove ai motori di ricerca."
  3. **"Informazioni uguali ovunque"** — "Nome, indirizzo, orari e servizi identici su sito, Scheda Google, social e directory: le AI si fidano di più delle informazioni coerenti."
  4. **"Misura ogni mese"** — "Controlliamo le visite che arrivano da ChatGPT, Gemini e altri assistenti (canale AI Assistant di Google Analytics) e le impressioni nelle AI Overviews e in AI Mode (Search Console)."
- **Riga "Onestà"** (paragrafo piccolo, stile `var(--m)`):
  > "Nessuno può garantirti di essere citato da un'AI: chi lo promette racconta una storia. Noi possiamo darti tutto quello che serve per esserlo, e misurare se funziona. È quello che facciamo già sul nostro sito."
- **Link testuale:** usare lo stile dei link già presenti nella pagina, non un componente nuovo.
  > "Controlliamo gratis se la tua attività compare nelle risposte delle AI →" → `/contatti?servizio=siti-web` (vedi G6)
  - Sotto, un secondo link:
  > "Cosa dice davvero Google sulla GEO" → `/blog/seo-ai-overviews-geo-google`

### G5. `/siti-web`, 3 FAQ nella sezione G4 (+ FAQPage)
Stesso stile delle FAQ di `/gestione-social` (`gsFaq.ts`): file dati separato, testo identico tra pagina e JSON-LD.
- **Controllo tecnico:**
  - verificare che `/siti-web` non abbia già un altro FAQPage, che non deve essere doppio;
  - nessun prezzo.
1. **Che differenza c'è tra SEO e GEO?**
   > "La SEO lavora per farti trovare nei risultati di Google. La GEO cura gli stessi contenuti perché siano chiari e affidabili anche per le risposte delle AI. Google dice che le basi sono le stesse: per questo le facciamo insieme, non come due servizi separati."
2. **Mi garantite che ChatGPT citerà la mia attività?**
   > "No, e diffida di chi lo promette: nessuno decide cosa rispondono le AI. Possiamo preparare sito, contenuti e Scheda Google perché la tua attività sia facile da citare, e mostrarti ogni mese cosa misuriamo."
3. **Serve il file llms.txt?**
   > "Per la Ricerca di Google no: lo dice Google stesso. Alcuni assistenti AI possono leggerlo, quindi sul nostro sito lo teniamo, ma non lo consideriamo la soluzione: contano pagine chiare, dati corretti e una Scheda Google curata."

### G6. Modulo contatti: preselezione `siti-web` (`src/App.tsx` riga ~1365)
- Oggi `?servizio=` riconosce solo `gestione-social`. Estenderlo a `siti-web` → servizio "Siti web", con la stessa logica: dopo il primo render, sempre modificabile.
- Se l'estensione è rischiosa, il link va a `/contatti` semplice.

### G7. Meta description di `/siti-web` (`src/seo/routes.ts` riga 117)
- **Oggi:** "Realizzazione siti web, e-commerce e landing page veloci, ottimizzati SEO e pensati per portare clienti: design su misura, sviluppo e gestione."
- **Nuova (149 caratteri):**
  > "Realizzazione siti web, e-commerce e landing page veloci, ottimizzati per Google e per le risposte delle AI (SEO e GEO), pensati per portare clienti."
- Il title e la keyword `realizzazione siti web` restano uguali, per non disturbare il posizionamento.

### G8. `/gestione-social`, richiamo (`src/data/gsFaq.ts`, 7ª FAQ in fondo)
Non aggiunge sezioni: è solo una FAQ in più nel blocco esistente, quindi resta anche nel FAQPage.
- **Domanda:**
  > "Mi aiutate anche a farmi trovare su Google e nelle risposte delle AI?"
- **Risposta:**
  > "Sì. I social li seguiamo noi; per Google, Scheda Google e risposte delle AI lavoriamo sul sito, con SEO e GEO insieme. Trovi tutto nella pagina dei siti web."
- **Link:** se il componente FAQ supporta i link, "pagina dei siti web" punta a `/siti-web#geo`; altrimenti si lascia testo semplice.

---

## Per il Blog (lo coordina il Direttore)
- **Serie "Visibilità nelle risposte AI":** sì, ma **2 articoli al mese**, dentro gli 8 mensili. La gestione social resta il servizio prioritario e queste ricerche portano poco traffico locale. Un articolo in più solo se arriva una novità ufficiale (Google, OpenAI).
- **Primi temi, pratici e locali:**
  1. "Come controllare se ChatGPT e Gemini conoscono la tua attività": test passo passo, cosa fare se le informazioni sono sbagliate.
  2. "Risposte AI e attività locali: cosa conta per ristoranti e strutture ricettive": Scheda Google, recensioni, menu e orari coerenti.
- **Link:**
  - ogni articolo linka `/siti-web#geo` e almeno uno tra `seo-ai-overviews-geo-google` e `ai-overviews-search-console-report`;
  - `seo-ai-overviews-geo-google` aggiunge un link a `/siti-web#geo` nella chiusura, dopo l'applicazione di G4.
- **Regole:** come la §13 delle linee guida (niente promesse, niente prezzi), fonti ufficiali, nessun "GEO miracolosa".

## Cosa misuro dopo
- Impressioni e posizione di `/siti-web` su "realizzazione siti web" e sulle ricerche "geo / seo ai / chatgpt", con 4 settimane prima e 4 dopo.
- Lead con servizio "Siti web" e con risposta "ChatGPT o altre AI" al campo "Come ci hai conosciuto?".
- Visite dal canale AI Assistant in GA4, ogni mese, con un grafico nel report.
