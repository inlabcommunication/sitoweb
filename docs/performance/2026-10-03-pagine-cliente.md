# Pagine cliente e scenario reale (Safari, cache vuota) — 03/10/2026

Addetto performance, su richiesta del Direttore (segnalazione di Nicola: sito lento da iPhone con Safari in navigazione privata, una pagina cliente rimasta nera).

## Metodo

- Lighthouse 12 mobile sul sito online, main 416afb5 (dopo la PR #79, che ha annullato LazyMotion), 03/10 tra le 10:18 e le 10:23 UTC. Cache sempre vuota.
- Pagine misurate:
  - `/cliente/nunzio-putignano` (con immagine in alto): 2 prove simulate e 1 con rallentamento reale;
  - `/cliente/villa-natia` (senza immagine in alto): 2 prove simulate e 1 con rete lenta (400 ms di latenza, 1,2 Mbps) e CPU 4×;
  - `/siti-web`: 2 prove.
- HTML statico e immagini controllati su tutte le 10 pagine cliente della sitemap, anche con intestazioni da iPhone/Safari. Una pagina, `ottica-occhiblu`, non si è scaricata per un errore di rete dell'ambiente di misura.
- **Safari/WebKit non è disponibile** nel mio ambiente: c'è solo Chromium, e scaricare altri browser non è consentito. Le osservazioni su Safari vengono dal codice e da come funziona Safari, non da una misura.
- Home e blog non li ho rimisurati: li avevo misurati stamattina con la cache vuota (home 98–100, `docs/performance/2026-10-03.md`).

## Risultati

| Pagina | Perf. | FCP | LCP | TBT | CLS | Peso totale |
|---|---|---|---|---|---|---|
| Nunzio Putignano (prova 1) | 99 | 1,3 s | 1,3 s | 140 ms | 0 | **2,4 MB** |
| Nunzio Putignano (prova 2) | 55 | 13,3 s | 23,4 s | 10 ms | 0,008 | **2,6 MB** |
| Nunzio Putignano (rallentamento reale) | 98 | 1,6 s | 1,6 s | 50 ms | 0,008 | 2,4 MB |
| Villa Natia (2 prove) | 98 / 100 | 1,2–1,3 s | 1,2–1,8 s | 10–150 ms | 0,016 | **4,0 MB** |
| Villa Natia (rete lenta, CPU 4×) | — | 1,2 s | 1,2 s | 67 ms | — | **4,0 MB** |
| /siti-web (2 prove) | 100 / 100 | 1,1–1,2 s | 1,1–1,6 s | 30 ms | 0 | 0,4 MB |

- Nella prova 2 di Nunzio Putignano il primo disegno *misurato davvero* è a 0,52 s. I 13 s sono una stima della simulazione di Lighthouse, falsata dai tanti file di Instagram: non è una pagina nera in Chromium.
- Nessun errore in console su nessuna pagina.
- **Il punteggio di Lighthouse qui inganna.** Gli iframe di Instagram girano in un processo separato in Chromium, quindi Lighthouse non conta né la loro banda né la loro CPU. Per questo la prova "rete lenta" scarica 4 MB in 3,9 s, cosa impossibile a 1,2 Mbps (servirebbero circa 27 s). Su un telefono vero quei MB passano tutti dalla stessa rete.

## Causa principale della lentezza: 3 riquadri Instagram aperti subito

- Tutte le pagine cliente (10 su 10) contengono **3 iframe di Instagram** già nell'HTML (`src/components/ReelCard.tsx:45`).
- Hanno `loading="lazy"`, ma su mobile la sezione Reel è vicina all'inizio della pagina: Chromium li scarica subito, a 0,45 s, insieme all'immagine in alto e agli script del sito.

| Da dove | Nunzio Putignano | Villa Natia |
|---|---|---|
| Instagram (CSS e JS, `static.cdninstagram.com`) | 1,29 MB | 1,29 MB |
| Instagram (video e immagini, `scontent-*.cdninstagram.com`) | 0,40 MB | **2,17 MB** |
| `www.instagram.com` (pagine embed) | 0,18–0,37 MB | 0,18 MB |
| **Sito InLab** (HTML, JS, CSS, font) | **0,35 MB** | **0,35 MB** |
| Cloudinary (immagine in alto + logo) | 0,17 MB | — |

- Per ogni pagina cliente Instagram fa circa 160 richieste e scarica **2–3,6 MB, cioè 6–10 volte il sito stesso**. Lo scarica senza che il visitatore abbia toccato un reel.
- Le pagine cliente hanno gli iframe dal 01/10, quindi il problema non viene dalle PR #60, #62, #70 o #76.
- **Su iPhone pesa di più che in laboratorio:**
  - Sulla rete del telefono quei 2–3,6 MB competono con l'immagine in alto e con il JavaScript che rende la pagina utilizzabile.
  - Safari non isola gli iframe di altri siti in processi separati come Chromium. Il JavaScript di Instagram (oltre 1 MB per tre riquadri) può quindi rallentare anche il disegno e lo scorrimento della pagina.
  - In navigazione privata non c'è cache: ogni pagina cliente riscarica tutto.
- **Ipotesi per il nero, da verificare su un iPhone vero.** Tre embed di Instagram insieme a pagina appena aperta sono il punto più pesante del sito per Safari, sia per la memoria sia per la CPU. Se Safari ha sospeso il disegno o ricaricato la scheda, la pagina resta scura (lo sfondo è scuro) finché non si esce e si rientra. Non l'ho potuto provare su WebKit: la segnalo come possibile concausa a Sito Inlab e all'analista, non come causa certa.
- **Nota per l'analista, privacy.** Gli embed di Instagram caricano risorse di Meta (con i relativi cookie e tracciamenti) appena si apre la pagina, prima di qualsiasi consenso. Da verificare rispetto alla linea del banner cookie.

## Seconda causa: immagine in alto a 1600 px anche su telefono

- `src/App.tsx:1841`: `<img src={cld(heroImage, 1600)} …>` senza `srcset`, `sizes` né `fetchpriority`.
- Il telefono scarica la versione da 1600 px: 167–181 KB (Nunzio Putignano, Diram Autoricambi).
- L'immagine è mostrata al 36% di opacità sotto una sfumatura scura, quindi non serve qualità piena.
- L'immagine viene richiesta presto: React la mette in `preload` nell'HTML. Il problema è solo il peso.

## Altre verifiche

- **Primo disegno**: l'HTML delle pagine cliente contiene già titolo, testo e immagine. LCP è il titolo o il paragrafo, a 1,2–1,8 s. Nessun elemento parte invisibile in attesa di animazioni.
- **Unica risorsa che blocca il primo disegno**: `index-*.css` (2 KB), che è normale. I font hanno il preload e quelli di riserva sono allineati alle metriche.
- **Prima di tutto si scaricano**: HTML 21 KB, `index` 81 KB, `react` 71 KB, `motion` 48 KB, font 53 KB e immagine in alto 167 KB.
  - `motion` è tornato nel primo caricamento con l'annullamento della PR #76 (PR #79), come previsto.
  - Le misure di oggi non mostrano che la PR #76 abbia peggiorato il primo disegno: con la #76 online home, blog e articoli avevano LCP 1,2–3,1 s e render delay sotto 0,1 s sul blog. Resta da capire se c'entra con il nero su Safari: lo stanno verificando Sito Inlab e l'analista.
- **Loghi degli altri clienti** (`ClientLogoStrip`) e **galleria**: tutte le immagini hanno `loading="lazy"` e si scaricano solo scorrendo.
- **`/siti-web` con cache vuota**: 100/100, 0,4 MB. Nessun problema.

## Richieste per lo sviluppo (al Direttore)

1. **Alta · Riquadri Instagram solo al tocco ("facciata").**
   - File: `src/components/ReelCard.tsx:45` (iframe), usato da `ReelsGrid` in `src/App.tsx:1922`.
   - Al posto dell'iframe mostrare subito una copertina statica con un pulsante play e il testo "Guarda il reel" (`aria-label` con il titolo del reel). Come copertina vanno bene:
     - un'immagine Cloudinary del cliente (`cld(…, 600)`, `loading="lazy"`);
     - oppure un riquadro scuro con l'icona di Instagram.
   - L'iframe si crea solo quando il visitatore tocca la copertina, ed entra già in riproduzione.
   - Le dimensioni della card restano uguali (stesso `aspect-ratio`), quindi niente spostamenti.
   - Alternativa più semplice, ma meno efficace: creare l'iframe solo quando la card entra davvero nello schermo, con `IntersectionObserver` e `rootMargin: "0px"`. Toglierebbe il peso dal primo caricamento, ma lo farebbe tornare appena si scorre.
   - Da misurare:
     - 0 richieste a `instagram.com` e `cdninstagram.com` prima del tocco;
     - peso della pagina cliente sotto 0,8 MB prima dell'interazione (oggi 2,4–4,0 MB);
     - il reel parte al primo tocco, con mouse, tocco e tastiera.
   - Effetto collaterale positivo: niente risorse di Meta prima del consenso (vedi la nota per l'analista).
2. **Media · Immagine in alto della pagina cliente con `srcset`.**
   - File: `src/App.tsx:1841`.
   - Proposta:
     ```tsx
     <img src={cld(heroImage, 1600)}
          srcSet={[640, 960, 1280, 1600].map(w => `${cld(heroImage, w)} ${w}w`).join(", ")}
          sizes="100vw" fetchPriority="high" …/>
     ```
   - Controllare che anche il `preload` generato da React usi lo stesso `srcset`: con React 19 succede in automatico (`imagesrcset`).
   - Facoltativo: `q_auto:eco` invece di `q_auto`, visto che l'immagine è al 36% di opacità.
   - Da misurare: su mobile, immagine in alto sotto 80 KB (oggi 167–181 KB).
3. **Da decidere dopo la causa del nero · LazyMotion.**
   - Se Sito Inlab e l'analista escludono che la PR #76 c'entri con il nero, la si può rimettere: valeva 21–27 KB in meno di JavaScript all'apertura.
   - Non è urgente: oggi il peso del sito (0,35 MB) è piccolo rispetto a quello di Instagram.
4. **Per chi ha un iPhone (Nicola o Sito Inlab), dopo il punto 1.**
   - Aprire in Safari, navigazione privata, 3 pagine cliente di seguito: Nunzio Putignano, Villa Natia e Diram Autoricambi.
   - Annotare se la pagina resta nera e quanto ci mette a comparire l'immagine in alto.
   - Se si può, con Safari su Mac → Sviluppo → iPhone collegato: scheda Rete (peso totale) e Console (errori).
   - Serve a confermare o escludere l'ipotesi sul nero, che io non posso provare senza WebKit.

## Home: perché la prima animazione arriva dopo ~4 s (03/10 ore 10:30 UTC)

Richiesta del Direttore. Nicola, con un iPhone 11 Pro e Safari, vede la prima animazione della home dopo circa 4 s.

### Metodo

- Chromium (puppeteer) sulla home online, main 416afb5, quindi **prima della PR #80**.
- Condizioni:
  - schermo 375×812 a densità 3, user agent di iPhone;
  - cache disattivata;
  - rete 4G lenta reale: 562 ms di latenza, 1,47 Mbps;
  - CPU rallentata 4×.
- Momenti misurati nella pagina:
  - **idratazione**: React aggancia la pagina, cioè la radice riceve le proprietà `__react*`;
  - **telefono 3D**: opacità che passa da 0 a più di 0 (inizio dell'animazione) e poi a 1;
  - **parola che ruota**: primo cambio.
- 2 prove. Niente Lighthouse, per non fare misure doppie.

### Sequenza (prova 1 / prova 2, in ms dall'inizio)

| Momento | Prova 1 | Prova 2 |
|---|---|---|
| HTML scaricato | 1.020 | 1.044 |
| Titolo e testo nel DOM (il telefono 3D c'è già, ma a opacità 0) | 2.053 | 1.902 |
| Primo disegno (FCP) = LCP (paragrafo del hero) | 2.339 | 1.976 |
| `motion` / `react` / `index` scaricati | 3.373 / 3.628 / 3.683 | simile |
| DOMContentLoaded | 3.858 | 3.736 |
| **React aggancia la pagina** | **4.296** | **4.028** |
| **Inizio dell'animazione del telefono** | **4.674** | **4.397** |
| Telefono del tutto visibile | 5.202 | 4.958 |
| Primo cambio della parola che ruota | 6.456 | 6.232 |

**Tra HTML scaricato e prima animazione passano 3,4–3,6 s.** È lo stesso ordine di grandezza dei 4 s di Nicola.

### Causa

1. **La prima animazione dipende dal JavaScript.** Il telefono 3D (`src/sections/HeroFlow.tsx:217`) è nell'HTML statico con `opacity:0` e `initial={{opacity:0, y:180, …}}`. Parte solo quando `motion` è scaricato e React ha agganciato tutta la home. Il testo invece è già visibile dall'HTML: i titoli hanno `initial={false}`.
2. **Il JavaScript arriva tardi perché divide la banda con i font.**
   - Nei primi ~2,5 s si scaricano insieme 200 KB di script (index 81, react 71, motion 48) e 104 KB di font (Bebas 15, DM Sans 38, i due DM Serif 51).
   - Insieme a loro c'è il poster del video (34 KB, `w_1280`), che compare solo più in basso nella pagina.
   - A 1,47 Mbps tutto questo occupa circa 2,7 s di rete.
3. **Poi la CPU**: dopo l'arrivo degli script servono altri ~0,4–0,6 s per eseguirli e agganciare l'intera home, che è lunga.
4. **Non dipende** da Firestore, dal video, dagli embed di Instagram (sulla home non ci sono) o da immagini. La PR #76 (LazyMotion, ora annullata) avrebbe tolto 48 KB, cioè circa 0,3 s, ma l'animazione sarebbe comunque rimasta legata al JavaScript.

### Trovato in più: Firestore legge lo stesso documento circa 10 volte

- Dopo il `load` la home fa 22 richieste a Firestore: circa 10 letture da 19 KB, quindi **~190 KB**, più altrettante richieste vuote.
- Causa probabile:
  - `loadContent()` in `src/lib/content.ts:79` salva il risultato solo quando la lettura è finita (`cached`);
  - più componenti lo chiamano nello stesso momento;
  - ognuno fa quindi il proprio `getDoc(app/site_content)`.
- Non ritarda l'animazione, perché parte dopo il `load`. Però su un telefono sono 190 KB in più e 10 letture in più per ogni visita nel conteggio di Firestore.

## Richieste per lo sviluppo — home (al Direttore)

1. **Alta · Entrata del telefono 3D in CSS, senza aspettare il JavaScript.**
   - File: `src/sections/HeroFlow.tsx:216–219`.
   - Spostare l'entrata (opacità, salita, rotazione, sfocatura) in una classe CSS con `@keyframes`, già presente nell'HTML statico. Durata e ritardo come oggi: 1,5 s, ritardo 0,35 s, stessa curva `cubic-bezier(0.16,1,0.3,1)`.
   - Sul `motion.div` usare `initial={false}`: motion non deve rifare l'entrata quando React aggancia la pagina.
   - L'oscillazione successiva resta com'è, già in CSS dalla PR #32.
   - Rispettare `@media (prefers-reduced-motion: reduce) { animation: none; opacity: 1; transform: none }`.
   - Se la PR #80 ha già reso visibile il telefono senza JS, basta aggiungere l'animazione CSS.
   - Effetto: l'animazione parte con il primo disegno, cioè a 2,0–2,3 s in queste condizioni molto lente invece di 4,4–4,7 s. Con il 4G normale di un iPhone dovrebbe partire entro ~1 s.
   - Da misurare: inizio dell'animazione del telefono entro 0,5 s dal primo disegno, nelle stesse condizioni di questa prova.
2. **Media · Una sola lettura di Firestore per visita.**
   - File: `src/lib/content.ts:79` (`loadContent`).
   - Salvare la promessa in corso, per esempio `let inflight: Promise<SiteContent> | null`, e restituirla alle chiamate che arrivano nel frattempo.
   - Da misurare: sulla home 1 sola lettura di `app/site_content` invece di circa 10.
3. **Media · Poster del video non nel primo caricamento.**
   - I due DM Serif (51 KB) non hanno `preload` e servono alla parola in corsivo del hero, quindi vanno bene così.
   - Il poster del video (`src/App.tsx:722`, `VideoReel`, 34 KB a `w_1280`) è più in basso nella pagina, quindi non deve partire subito:
     - poster a `w_720` come il video;
     - impostarlo solo quando la sezione si avvicina allo schermo, con lo stesso `IntersectionObserver` che fa partire il video.
   - Da misurare: nessuna richiesta del poster prima di scorrere verso il video.
4. **Dopo, se serve · LazyMotion.** Con il punto 1 il tempo dell'animazione non dipende più da `motion`. Rimetterla resta utile per la banda (48 KB), ma solo dopo che è chiarito il nero su Safari.

## Rimisura dopo la PR #80 (main 4916052) — 03/10 ore 14:50 UTC

Stesse condizioni di prima: Chromium, rete 4G lenta reale (562 ms, 1,47 Mbps), CPU 4×, cache vuota, schermo da iPhone. Per la home una prova di sequenza; per le pagine cliente una prova Lighthouse a pagina.

### Pagine cliente: richieste 1 e 2 confermate

| Pagina | Perf. | Peso | Richieste a Instagram | Immagine in alto | A11y |
|---|---|---|---|---|---|
| Villa Natia | 100 | **409 KB** (era 4,0 MB) | **0** | — | 100 |
| Nunzio Putignano | 77 | **553 KB** (era 2,4–2,6 MB) | **0** | `w_960`, 140 KB (era `w_1600`, 167 KB) | 100 |

- Il 77 di Nunzio Putignano è una stima della simulazione: l'LCP *misurato davvero* è 0,2 s. L'elemento LCP è il titolo, con un "render delay" simulato di 4,3 s, come nella prova falsata di stamattina.
- L'immagine in alto pesa ancora 140 KB perché il telefono simulato (densità 1,75) sceglie la versione da 960 px. È al 36% di opacità, quindi `q_auto:eco` la porterebbe probabilmente vicino agli 80 KB. Richiesta minore.

### Home: il telefono 3D su mobile non si vede

- Su mobile il telefono 3D sta in un contenitore `hide-mob`, quindi non è visibile e la sua animazione non parte. La nuova entrata in CSS funziona su desktop: a 0,96 s è già a opacità 0,69.
- Animazioni visibili nel primo schermo su mobile, in ms dall'inizio:

| Animazione | Inizio | Da cosa dipende |
|---|---|---|
| Sfondo sfocato che si muove (`anim-drift`, CSS) | 1.774, con il primo disegno | HTML |
| Pulsante (animazione di motion) | 5.468 | JavaScript |
| **Parola che ruota (`rot-word`), primo cambio** | **6.121–6.456** | JavaScript, **2,2 s dopo** che React aggancia la pagina (4.016) |

- **È questa la "prima animazione" che vede Nicola.** L'unico movimento evidente nel primo schermo del telefono è la parola in corsivo che cambia. `RotatingWord` (`src/sections/HeroFlow.tsx:22–31`) avvia il timer da 2.200 ms solo dopo l'aggancio di React, quindi il primo cambio arriva a "aggancio + 2,2 s".
- Su un iPhone 11 Pro con 4G normale l'aggancio arriva verosimilmente a ~1,5–2 s, quindi il primo cambio a **~4 s**: coincide con quello che vede Nicola.

## Richieste per lo sviluppo — aggiornamento dopo la PR #80 (al Direttore)

1. **Alta · Parola che ruota senza aspettare il JavaScript (o quasi).**
   - File: `src/sections/HeroFlow.tsx:22–31` (`RotatingWord`).
   - **Soluzione A, consigliata:** rotazione in CSS.
     - Le 5 parole nell'HTML statico, una sopra l'altra nella stessa riga, con un `@keyframes` che le mostra a turno: ciclo di 5 × 2,2 s e `animation-delay` scalati, primo cambio a ~1 s.
     - La riga deve avere la larghezza della parola più lunga, per non spostare il testo.
     - Accessibilità: per gli screen reader solo la prima parola, le altre con `aria-hidden="true"`.
     - Con riduci movimento resta ferma la prima parola.
   - **Soluzione B, minima:** lasciare il codice com'è ma fare il primo cambio dopo ~800 ms dall'aggancio (un `setTimeout` iniziale più corto, poi l'intervallo da 2,2 s). Il primo cambio passa da "aggancio + 2,2 s" a "aggancio + 0,8 s", cioè ~2,5 s su iPhone. Resta legato al JavaScript.
   - Da misurare: primo cambio della parola entro ~1 s dal primo disegno (soluzione A) o entro 1 s dall'aggancio (soluzione B), con lo stesso script.
2. **Media · Una sola lettura di Firestore**: ancora 22 richieste sulla home dopo il load (vedi sopra, `src/lib/content.ts:79`).
3. **Media · Poster del video**: ancora `w_1280`, 34 KB, richiesto a 0,8 s (`src/App.tsx:722`).
4. **Minore · `q_auto:eco` sull'immagine in alto delle pagine cliente** (`src/App.tsx`, immagine in alto di `PageCliente`). Da misurare: sotto 80 KB su mobile.
