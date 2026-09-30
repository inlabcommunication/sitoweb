# Brief editoriale del blog InLab

Istruzioni per chi (persona o sessione automatica) cura il blog. Ruolo: SEO strategist senior, content strategist e digital marketing analyst.

## Chi decide

- **Il responsabile SEO** (sessione "Adetto SEO giusto") è il riferimento dell'addetto al blog e il responsabile strategico del blog: priorità, parole chiave, intenti, link interni. Il suo ruolo è descritto in `docs/seo/PROMPT-RESPONSABILE-SEO.md`: analizza Google Analytics e Search Console ogni due settimane, scrive il brief in `docs/seo/brief/` e cura `docs/seo/LINEE-GUIDA-BLOG.md`. I suoi messaggi iniziano con `[Messaggio dal responsabile SEO]`. **Le sue indicazioni vanno sempre seguite**; se una sembra sbagliata o poco chiara, lo si scrive nel resoconto del brief, non la si ignora.
- **Conta solo il nuovo responsabile SEO** (decisione di Nicola). Il brief del 2026-09-28 e i messaggi del responsabile precedente non valgono più: i compiti rimasti aperti lì non vanno ripresi. Si seguono i brief successivi.
- **Ordine di lavoro:** prima i compiti del brief SEO in corso (priorità 1, poi 2, poi 3); gli articoli di novità di questo documento vengono dopo.
- **Argomenti fuori dal brief SEO:** non sceglierli da soli. Un articolo di novità (metodo A/B/C) si propone prima al responsabile SEO, nel resoconto o con un messaggio alla sua sessione, e si scrive quando lui lo approva. In caso di conflitto sul posizionamento prevale la SEO (indicazione del direttore, 30/09/2026).
- **Direttore Operativo** (sessione "Direttore Operativo Inlab."): coordina il progetto, le priorità e i crediti. Si passa da lui quando serve la sessione Sito Inlab, quando c'è un disaccordo o quando un lavoro costa molti crediti. Mappa del progetto: `docs/direzione/MAPPA-PROGETTO.md`.
- **Pull request:** le apre l'addetto al blog dal proprio branch, solo con file della sua area. Sito Inlab fa il controllo tecnico, Nicola la unisce.
- **Mappa "Già coperte":** la aggiorna il responsabile SEO. L'addetto al blog scrive le voci nuove nel resoconto, nella sezione "Voci da aggiungere alla mappa".
- **Crediti:** se in una sessione non ci sono compiti del brief né notizie A o B forti, basta un report breve, senza articolo.
- **Rubrica delle sessioni** (dal direttore, 30/09/2026). Per scrivere a una sessione: `create_trigger` con `persistent_session_id`, poi `fire_trigger` e `delete_trigger`. Ogni messaggio sveglia l'altra sessione e consuma i suoi limiti: scrivere solo quando serve, con tutto dentro.
  - Direttore Operativo: `session_01AreWGaDhEeTCs3CDmdifT7`
  - Sito Inlab (unico che modifica il codice): `session_01U6sW6ykGz4nrdvKnHMQZsF`
  - Adetto SEO giusto (responsabile strategico del blog): `session_018SfEyMKHa2uSgRSKzdE114`
  - Addetto performance: `session_012pr6hkmubH9ZAA9gVGN4Gf` (con lui si concorda direttamente l'eventuale conversione WebP delle copertine)
  - Adetto analisi sito (controlli e sicurezza, sola lettura): `session_01Kim4sfBnoqhrkBJnpGTrHz`
  - Analisi competitor Inlab: `session_01Si9h5q6bVpPQbAn5BzeiCE`
  - La vecchia "Addetto SEO" (`session_011qJCHS5861skWDHe1vUFbF`) non si usa più.
- **Regola di Nicola: niente prezzi dei servizi di gestione** negli articoli: tariffe o fasce di costo di agenzie, freelance o InLab (gestione social, siti, campagne, video…). I prezzi ufficiali delle piattaforme (per esempio abbonamenti Meta One o commissioni di TikTok Shop) si possono citare con la fonte. Se un brief chiede i costi di gestione, non farlo e segnalalo nel resoconto.
- **Clienti InLab:** per ora cita i clienti solo con quello che c'è già nelle schede `/cliente/...` e nei casi studio, senza dettagli o numeri in più. Non chiedere informazioni sui clienti: Nicola preparerà i casi studio completi (linee guida, sezione 7).
- **Clienti da non citare nel blog:** Aleph Caffè (indicazione di Nicola, 29/09/2026).
- **Compito fisso sulle immagini** (Nicola, 30/09/2026), per ogni articolo nuovo o aggiornato, prima della consegna: nomi dei file descrittivi con trattini, testo alternativo di 8-15 parole, copertina JPG 1600×900 sotto i 250 KB, interne WebP sotto i 150 KB e larghe al massimo 1600 px, metadati IPTC "InLab Communication" (sezioni 8 e 9 delle linee guida).

## Contesto e tono

Agenzia di comunicazione italiana (Castellaneta, TA) per PMI, aziende locali e professionisti.
Tono da agenzia moderna ma concreta: autorevole, chiaro, pratico. Niente fuffa, eccessi tecnici inutili o promesse irrealistiche (tipo "aumenta subito le vendite").

## Frequenza e flusso

Ogni **martedì e venerdì**:

1. Analizza le fonti indicate sotto.
2. Individua novità, aggiornamenti, trend, casi studio o segnali interessanti.
3. Classifica ogni elemento per importanza (A/B/C).
4. Decidi se vale la pena trasformarlo in un articolo.
5. Se sì, scrivi un articolo SEO ottimizzato. La mattina fai analisi e scrittura; l'articolo va **online alle 11:50**.
6. Se no, scrivi solo un breve report interno.

Pubblica solo per notizie A o B forti. Non pubblicare contenuti deboli solo per rispettare la cadenza.
Non ripetere temi già trattati: controlla gli articoli in `src/data/blogSeed.ts`. Se c'è un seguito di un tema già coperto, preferisci aggiornare l'articolo esistente (campo `updated`) o scriverne uno che lo linki.

## Fonti da monitorare

**Ufficiali**: Meta Newsroom (about.fb.com/news, anche la categoria product-news), Meta for Business News (facebook.com/business/news), Meta Business Help, Meta Transparency Center, Google Ads & Commerce Blog (blog.google/products/ads-commerce), Google Ads Announcements (business.google.com/us/accelerate/announcements), Google Ads Help, Google Search Central Blog e Docs, Think with Google, Google Analytics Help (in particolare "What's new": support.google.com/analytics/answer/9164320), TikTok Newsroom, TikTok for Business Blog, TikTok Ads Help, TikTok Creative Center, LinkedIn Marketing Solutions, Pinterest Business e Policy, Reddit Ads Help, Snap Ads Policies.

**Normative e dati**: Garante Privacy, EDPB, Commissione europea (digital economy), IAB, IAB Italia, DataReportal, Pew Research Center, Ofcom Online Nation, Eurostat. In più AGCOM (influencer) e AgID (accessibilità).

**Settore**: Search Engine Land, Search Engine Roundtable, Search Engine Journal, Moz, Ahrefs, Semrush, Social Media Today, Social Media Examiner, Buffer, Hootsuite, Sprout Social, Content Marketing Institute, HubSpot, Mailchimp, Litmus.

**Esperti** (fonti interpretative, non ufficiali): Danny Sullivan, John Mueller, Martin Splitt, Gary Illyes, Ginny Marvin, Barry Schwartz, Aleyda Solis, Marie Haynes, Lily Ray, Glenn Gabe, Kevin Indig, Rand Fishkin, Matt Navarra, Rachel Karten, Lia Haberman, Jon Loomer, Mari Smith, Simo Ahava, Julius Fedorovicius, Ann Handley, Joe Pulizzi, Giorgio Taverniti, Veronica Gentili.

## Classificazione

- **A, molto importante**: cambia policy, strumenti, algoritmi, advertising, analytics, privacy o SEO; influenza concretamente PMI, aziende locali o professionisti; richiede un'azione o un aggiornamento strategico; può generare traffico SEO qualificato.
- **B, interessante**: nuovo trend, funzione, report o comportamento degli utenti; spunto per un contenuto educativo; utile per spiegare opportunità o rischi ai clienti.
- **C, generica**: comunicazione aziendale senza impatto pratico, aggiornamento minore, notizia troppo tecnica o poco utile per il target.

**Scrivi** se il tema interessa il target, aiuta a capire cosa fare, ha potenziale SEO, è coerente con social, contenuti, comunicazione digitale, Meta, TikTok, Google, SEO, analytics o strategia, e posiziona l'agenzia come competente e concreta.
**Non scrivere** se la notizia è solo promozionale, mancano fonti affidabili, non c'è impatto reale o il tema è troppo lontano dai servizi dell'agenzia.

## Formato articolo

Titolo SEO, slug, meta title, meta description, H1, struttura H2/H3, introduzione chiara, spiegazione della novità, perché è importante, impatto per PMI, aziende locali e professionisti, cosa fare in pratica, eventuale esempio o caso studio, conclusione con call to action morbida verso l'agenzia, fonti con link, link interni verso pagine e articoli pertinenti. FAQ SEO quando servono; schema Article/FAQ indicato nel frontmatter.

### Dove e come si pubblica

- Gli articoli sono in `src/data/blogSeed.ts` (array `BLOG_SEED`): `slug`, `title` (H1), `excerpt`, `category` (una tra Social media, Video & Reel, Siti web, Strategia, Advertising), `tags` (3-6, minuscolo), `author` (Nicola Carpignano o Ilaria Gemma), `date` (data reale), `cover` (`/blog/<slug>/cover.jpg`, 1600×900), `published: true`, `seoTitle` (max 60 caratteri, termina con " | InLab"), `seoDescription` (140-155 caratteri), `content` (Markdown).
- Markdown supportato dal sito: `##`/`###`/`####`, grassetto, corsivo, link, elenchi `-` e `1.`, `>` citazione di una sola riga logica, immagine `![alt](url)` su riga propria (l'alt diventa anche la didascalia), `---`. **Niente** `#`, tabelle, HTML o codice; niente elenchi dentro le citazioni.
- Se esiste, segui anche `docs/seo/LINEE-GUIDA-BLOG.md` (manuale del responsabile SEO): lunghezza minima 1.200 parole, risposta breve in grassetto, "## Domande frequenti", link al servizio collegato, a 1-3 articoli e a `/contatti`, un link verso il nuovo articolo da un articolo già esistente.
- Immagini: spec in `tools/blog-images/specs/<slug>.cjs`, poi `NODE_PATH=$(npm root -g) node tools/blog-images/gen.cjs tools/blog-images/specs/<slug>.cjs`. Crea `public/blog/<slug>/cover.jpg` e le infografiche `.webp`. Usa gli spec esistenti come modello.
- Prima del commit: `npx tsc --ignoreConfig --noEmit --target es2022 --strict src/data/blogSeed.ts` (oppure `npm run lint` se le dipendenze sono installate).

## Stile

- Italiano, frasi chiare e paragrafi brevi, niente muri di testo.
- Apertura forte ma non sensazionalistica; spiega subito perché l'argomento conta.
- Alterna spiegazione, esempi e consigli pratici; titoli H2/H3 che guidano davvero la lettura.
- Parla a PMI, aziende locali e professionisti in modo concreto; competenza senza tono accademico.
- Chiudi con un punto pratico o una riflessione utile.
- Utile anche a chi non è esperto.

## SEO

Keyword principale e secondarie; title, meta description, H1, H2 e primi paragrafi ottimizzati; search intent curato; internal linking; contenuti correlati suggeriti; niente keyword stuffing; leggibilità.

## Casi studio

Si possono usare casi forniti dall'agenzia, casi da fonti autorevoli, esempi reali da piattaforme ufficiali, report o ricerche, trend leggeri se spiegano un comportamento o una lezione di marketing.
**Non inventare dati, risultati o casi.** Un caso ipotetico va dichiarato come tale.

## Immagini

Per ogni articolo: immagine hero, eventuali immagini interne, grafiche semplici che spiegano concetti, dati o passaggi. Devono aiutare a capire, non decorare. Stile del sito: moderno, concreto, pulito (sfondo scuro, accento lilla). Niente stock banale o visual astratti.
Per ogni immagine: titolo, prompt per generarla, alt text SEO, posizione consigliata. Si generano con `tools/blog-images` (vedi sopra); titolo, prompt, alt e posizione vanno nel report della sessione.

## Google Search Console e GA4

Se disponibili, usali solo per scegliere e ottimizzare i nuovi articoli: query coerenti con i temi, opportunità SEO, pagine esistenti per i link interni. Col tempo, per capire cosa funziona: CTR dei titoli, argomenti con più impression, articoli letti più a lungo, engagement, formati migliori (guide, checklist, analisi trend, casi studio, spiegazioni pratiche).
Niente audit mensili, niente riottimizzazione del sito, niente modifiche a pagine servizi, struttura, layout, menu, codice o elementi tecnici.

## Regole di qualità

- Verifica sempre le fonti; dai priorità a quelle ufficiali.
- Distingui fatti, interpretazioni e opinioni.
- Non pubblicare se le informazioni sono incerte; niente toni sensazionalistici; niente testi copiati.
- Non modificare parti tecniche o la struttura del sito senza autorizzazione.

## Report dopo ogni sessione

In `docs/blog-reports/AAAA-MM-GG.md`:

1. Fonti analizzate.
2. Novità trovate.
3. Classificazione A/B/C.
4. Decisione: pubblicato / non pubblicato.
5. Se pubblicato: URL dell'articolo, keyword target, fonti usate.
6. Prossime opportunità editoriali.
