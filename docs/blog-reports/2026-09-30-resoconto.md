# Resoconto dell'addetto al blog: 29-30 settembre 2026

Per il **responsabile SEO**. Dal 30/09 le regole di `CLAUDE.md` permettono all'addetto al blog di modificare solo `src/data/blogSeed.ts`, `public/blog/`, `docs/blog-brief.md` e `docs/blog-reports/`. Per questo il resoconto è qui e non nei brief in `docs/seo/brief/`, e la mappa "Già coperte" (sezione 10 delle linee guida) va aggiornata da te: le due voci da aggiungere sono indicate sotto. Le mie modifiche precedenti a `docs/seo/` sono state tolte dal mio branch, che ora contiene gli stessi file di `main` in quella cartella.

---

## Resoconto al brief SEO del 29/09/2026

*Compilato il 29/09/2026.*

- **Fatto:**
  - **P1.1 Tabella:** in `quante-volte-pubblicare-social` la tabella DataReportal è diventata un elenco (`- **YouTube:** 41,2 milioni (-2,4%)` …). Ho ricontrollato i numeri sul report *Digital 2026: Italy*: sono invariati. Controllati tutti i 17 articoli: nessuna altra riga che inizia con `|`.
  - **P1.2 Parola chiave nei `##`:** aggiunta nei 6 articoli indicati. Per esempio: "Reel o post su Instagram: a cosa serve ogni formato", "Sponsorizzate su Instagram: 'Metti in evidenza' o Gestione inserzioni", "Contenuti generati con AI: cosa chiede l'articolo 50 dell'AI Act", "Come leggere il report AI Overviews passo passo", "Come collegare Google Business Profile a GA4 e cosa controllare", "WhatsApp Business con l'AI: cosa fa Meta Business Agent".
  - **P1.2 Titoli ripetuti:** il `##` "Cosa cambia/significa per PMI, attività locali e professionisti" non c'è più in nessun articolo. In ogni articolo è diventato un titolo specifico, come `##` o come `###` della sezione precedente (es. "Chi deve adeguare la newsletter: ristoranti, negozi, studi ed e-commerce", "A chi conviene Meta One: e-commerce, negozi e attività locali"). Ho rinominato anche i titoli generici "Cosa è cambiato…", "Perché è importante…" e "Cosa fare in pratica" con titoli che contengono il tema o la parola chiave.
  - **Numero di sezioni:** gli articoli di novità avevano 9-11 `##`, contro le 5-8 della checklist. Ora tutti i 17 articoli hanno 7-8 `##`. "Fonti" è diventato un paragrafo in grassetto con l'elenco; alcuni esempi e casi per settore sono passati a `###`.
  - **P1.3 `coverAlt`:** i 9 articoli ora sono tra 10 e 12 parole; tutti i 17 articoli tra 10 e 15.
  - **P1.4 `updated`:** tolto da `sponsorizzate-instagram-attivita-locali` e `idee-reel-ristoranti`. Nessun `updated` aggiunto sugli articoli corretti.
  - **P2 Articoli nuovi** (data 29/09/2026, senza `updated`, copertina JPG 1600×900 e 2 infografiche ciascuno):
    - `servizio-fotografico-ristoranti`, Ilaria Gemma, circa 1.500 parole, 8 `##`, FAQ 5. Link a `/shooting`, `/contatti`, `idee-reel-ristoranti` (e da `idee-reel-ristoranti` verso di lui), clienti [Sottoscala](/cliente/sottoscala) e [Villa Natia](/cliente/villa-natia) con i soli dati della loro scheda (Aleph Caffè sostituito il 29/09 su indicazione di Nicola: non va citato nel blog). C'è la sezione "Da cosa dipende il costo" senza cifre, come da sezione 7.
    - `rebranding-attivita-commerciale`, Nicola Carpignano, circa 1.370 parole, 8 `##`, FAQ 5. Link a `/branding`, `/casi-studio/paresteta`, `/contatti` e all'articolo sito o social. Il caso Paresteta usa solo testi già pubblicati (fasi, QR code, video, evento, risultato qualitativo); le metriche "da confermare" non ci sono.
  - **P4:** link verso `servizio-fotografico-ristoranti` da `idee-reel-ristoranti` e verso `rebranding-attivita-commerciale` da `gestione-social-attivita-locale-cosa-include` (paragrafo su Paresteta). Mappa "Già coperte" aggiornata per Foto & Shooting e Branding. Controllo finale: 17 articoli, nessun link interno rotto, nessun articolo senza link in ingresso, `tsc` ok.

- **Non fatto e perché:**
  - **P3 AGCOM influencer:** non scritto. agcom.it è bloccato dalla rete di questo ambiente, quindi non posso verificarlo sulla fonte ufficiale come chiede il brief. Lo riprendo quando la verifica è possibile.
  - **Build completa:** npm non installa le dipendenze in questo ambiente; il file degli articoli passa `tsc`.

- **Cosa ho imparato dalle ricerche SEO:**
  - *servizio fotografico per ristoranti*: i primi 5 risultati sono guide di fotografi e piattaforme (Deliveroo, Plateform, HorecaNews). Coprono pulizia, luce naturale, due porzioni per i piatti delicati, foto ambientate e coerenza del menu. **Manca** come usare le foto su ogni canale (menu, delivery, Instagram con formati 4:5 e 9:16, scheda Google, sito), l'idea di girare foto e video nella stessa giornata e la stagionalità. L'ho aggiunto. Varianti trovate nei titoli: "fotografo per ristoranti" e "foto per il menu", con intento più commerciale (pagine servizio). **Proposta:** "fotografo per ristoranti" è adatta alle pagine `/shooting-<città>`, non al blog.
  - *rebranding attività commerciale*: i primi risultati sono guide generiche per aziende (TEAM LEWIS, Pixela, Shopify, Raffaele Gaito), con passaggi di strategia e comunicazione in fasi. **Manca** la parte pratica per un'attività locale: insegna, scheda Google (nome, nuova verifica, recensioni che restano sulla stessa scheda), dominio con reindirizzamento, WhatsApp Business, materiali in negozio. L'ho aggiunto, con un caso locale reale.
  - Da aggiungere alla sezione 11, se sei d'accordo: *per i temi "come fare" i primi risultati sono spesso scritti per aziende grandi; la checklist operativa per l'attività locale è il pezzo mancante che possiamo dare noi.*

- **Dubbi o proposte per il responsabile SEO:**
  1. **Categoria per le foto.** Tra le 5 categorie non ce n'è una per foto e shooting: ho usato "Social media" per `servizio-fotografico-ristoranti`. Se prevedi altri articoli sul tema, propongo una categoria "Foto & Branding" (va aggiunta in `BLOG_CATEGORIES`, cioè nel codice: è compito tuo).
  2. **Titoli `##` con parola chiave.** Negli articoli di novità ho messo la parola chiave in uno o due `##`, non in tutti, per non forzare il testo. Dimmi se preferisci una regola più precisa (per esempio "nel primo `##` dopo l'introduzione").
  3. **Esperienza InLab negli articoli di novità.** Resta generica finché Nicola non manda le informazioni sui clienti; ha chiesto di aspettarle.
  4. **Pubblicazione su `main` (tuo punto 3).** Da ora consegno solo sul mio branch, come chiedi. Nicola ha confermato il 29/09; la routine che pubblicava da sola alle 11:50 è disattivata. Le due pubblicazioni dirette del 28 e 29/09, compresa la sostituzione di Aleph Caffè con Villa Natia chiesta da Nicola, erano state autorizzate da lui all'inizio del lavoro.

**Voci da aggiungere alla mappa "Già coperte" (sezione 10):**
- Foto & Shooting: *servizio fotografico per ristoranti* → `servizio-fotografico-ristoranti`
- Branding & Identità: *rebranding attività commerciale* → `rebranding-attivita-commerciale`

---

## Resoconto al messaggio del 30/09/2026 (immagini SEO e GEO)

Il brief del 30/09 e la sezione 8 aggiornata delle linee guida non sono ancora su `main`. Ho lavorato sulle indicazioni del tuo messaggio.

- **Fatto:**
  - **Metadati IPTC** in tutte le 41 immagini del blog (17 copertine JPG e 24 infografiche WebP), con autore "InLab Communication", copyright "© InLab Communication" e crediti "InLab Communication":
    - JPEG: XMP (`dc:creator`, `dc:rights`, `photoshop:Credit`) e IPTC IIM (By-line, Credit, Copyright Notice, set di caratteri UTF-8);
    - WebP: XMP nel chunk `XMP `, con il flag nel chunk `VP8X`.
  - **Aspetto identico, verificato:** i metadati sono aggiunti ai file senza ricomprimerli. Ho confrontato le 41 immagini prima e dopo, decodificandole in Chromium pixel per pixel: 0 differenze. Peso: +1 KB circa per file.
  - **Testo alternativo delle infografiche:** 13 superavano le 15 parole (fino a 29). Ora tutte le 24 sono tra 8 e 15 parole e descrivono il contenuto. I `coverAlt` delle 17 copertine erano già tra 10 e 15.
  - **Pesi e dimensioni:** copertine JPG 1600×900 fino a 118 KB (limite 250); infografiche WebP larghe 1200 px, fino a 62 KB (limite 150).
- **Non fatto e perché:**
  - **Metadati nel generatore `tools/blog-images`:** la cartella non è nella mia area (`CLAUDE.md`). Ho aggiunto i metadati ai file già generati; per le immagini future serve la modifica al generatore, vedi "Richieste per lo sviluppo".
  - **Nomi dei file** (aggiunta del 30/09, dopo il messaggio sul compito fisso): 10 immagini con nomi generici sono state rinominate con nomi descrittivi, per esempio `checklist.webp` → `checklist-newsletter-tracking-pixel.webp` e `formati.webp` → `foto-ristorante-menu-instagram-google.webp`. Riferimenti aggiornati negli articoli, nessuna immagine mancante. Gli spec in `tools/blog-images/specs/` usano ancora i vecchi nomi: se si rigenerano quelle immagini, i nomi vanno ripresi dagli articoli.
- **Dubbi o proposte:**
  1. `CLAUDE.md` e le linee guida sono in contrasto su due punti: il resoconto "nel brief" e l'aggiornamento della mappa da parte dell'addetto al blog. Propongo che il resoconto stia sempre in `docs/blog-reports/AAAA-MM-GG-resoconto.md` e che tu lo riporti o lo linki nel brief.
  2. La consegna è sul mio branch `claude/optimistic-ritchie-mj87ne`. Per andare online serve la pull request verso `main`, come previsto da `CLAUDE.md`.

## Compito fisso sulle immagini

Da ora, prima di ogni consegna, per ogni articolo nuovo o aggiornato controllo: nomi dei file descrittivi, testo alternativo di 8-15 parole, copertina JPG sotto i 250 KB e interne WebP sotto i 150 KB (larghe al massimo 1600 px), metadati IPTC InLab Communication. Stato al 30/09: tutti i 17 articoli e le 41 immagini sono in regola.

## Metadati nel generatore (aggiornamento del 01/10/2026)

Dal 01/10 `CLAUDE.md` mette `tools/blog-images/` nell'area dell'addetto al blog, quindi **la richiesta per lo sviluppo non serve più**: l'ho fatto io.
- Nuovo `tools/blog-images/metadata.cjs`: porta in JavaScript lo script Python che c'era qui, con lo stesso risultato byte per byte (verificato). `render.cjs` lo usa su ogni immagine generata. Lo stesso file si usa anche da riga di comando sulle immagini esistenti: `node tools/blog-images/metadata.cjs public/blog/<slug>/*.jpg public/blog/<slug>/*.webp`.
- Spec aggiornati ai nuovi nomi descrittivi dei file: ogni spec ora corrisponde ai file in `public/blog/`.
- Prova: generato uno spec di prova; copertina e infografiche uscite con XMP (e IPTC IIM nel JPEG); file di prova eliminato.
