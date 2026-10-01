# Mappa del progetto Inlab — Memoria centrale

Curata dal **Direttore Operativo & Memoria Centrale Inlab** (sessione "Direttore Operativo Inlab.", branch `claude/hopeful-brahmagupta-u39zb3`).
Aggiornata al **30/09/2026**. Fonte: repository (main e branch di ogni sessione), stato delle sessioni cloud. Le risposte dirette degli agenti non sono ancora arrivate: le sessioni cloud non ricevono messaggi da altre sessioni, quindi i messaggi di allineamento (in fondo) li deve incollare il titolare.

---

## Regola del titolare (01/10): lavori automatici di notte

Le routine automatiche degli agenti devono partire **entro le 3 di notte** (ora italiana), mai dopo. Aggiornate il 01/10 alle 14:19:
- Blog "monitoraggio e articolo": martedì e venerdì alle **2:47** (prima 8:47), `trig_012dfTrC8k7qjQL3cXyHXZnm`;
- Analisi sito "Controllo sito InLab": ogni 2 giorni alle **2:56** (prima 8:56), `trig_01DewoKd4ZBE4VD8i6mk8HKp`.
La routine "Blog InLab: pubblicazione ore 11:50" è disattivata e resta così. Ogni nuova routine ricorrente va programmata tra mezzanotte e le 3.

## Regola del titolare (01/10): resoconti completi

Quando il titolare chiede cosa hanno fatto gli agenti, il Direttore dà **tutto** (lavoro, esiti, problemi, decisioni richieste) per ogni agente, così il titolare non deve aprire le varie chat. Il Direttore non può leggere le chat degli altri: vede solo commit, PR, documenti sui branch, il breve riassunto di stato di ogni sessione e i messaggi che riceve. Per avere tutto, ogni agente deve mandare al Direttore il proprio resoconto alla fine di ogni lavoro (**approvato dal titolare il 01/10**: messaggio mandato a tutti e 6 gli agenti alle 08:38 UTC; prefisso `[Resoconto da <ruolo>]`; routine del Blog mar/ven aggiornata dal Direttore con il punto 6; la routine dell'Analisi sito `trig_01DewoKd4ZBE4VD8i6mk8HKp` la aggiorna l'analista stessa, perché il Direttore non può modificarla). Primi resoconti chiesti: Sito Inlab (dal 30/09 15:00), SEO (dal 30/09 14:40), Analisi sito (controllo del 01/10 8:56), Competitor (a fine lavoro, dopo le 12:00).

Esito del controllo automatico dell'Analisi sito del 01/10 (dal riassunto della sessione): sito ok, correzione di sicurezza di Sito Inlab online, 101 pagine verdi, Aleph Caffè tolto dal sito online; resta un riferimento ad Aleph nel database, negli esempi della pagina Shooting, da togliere dalla dashboard.

## ⏸ PAUSA CREDITI (dal 30/09 14:53, decisa dal titolare)

Lavora **solo Sito Inlab**; le altre sessioni non ricevono nuovi compiti dal Direttore. **Le routine programmate restano attive** (correzione del titolare alle 15:15: servono e partono nei prossimi giorni): Blog mar/ven 8:47, controllo sito ogni 2 giorni 8:56, messaggi del Competitor del 01/10 alle 8:50, promemoria del Competitor del 01/10 alle 12:00.

Quattro messaggi una tantum tra sessioni sono rimasti disattivati perché il loro orario è passato durante la pausa (14:53-15:10). Si riattivano solo se il titolare lo chiede, con un orario nuovo:
- `trig_01HkqQu5Vwhj2VkyoKJruVN4` Analisi sito → Performance: verifica font locali;
- `trig_01Fz93E3XgYgeA8vFPKHUVTE` Sito Inlab → Analisi sito: punti mobile 1 e 6 fatti (PR #38);
- `trig_01EXgqn42VWTyVzRAzwj53DJ` Sito Inlab → Direttore: PR #33 unita, PR #37, `CLAUDE.md` aggiornato (contenuto già letto dal Direttore);
- `trig_01KtTcYjV7nXwxfaZ86rEEsE` SEO: promemoria per consegnare a Sito Inlab `trig_01UkQtsoku3LzrPKVAEKdKCH` (contatori della home a zero nell'HTML statico + `llms.txt`).

**Regola per il Direttore:** mai disattivare routine programmate dal titolare o dalle sessioni senza chiederlo prima; "fermare le sessioni" vuol dire non dare nuovi compiti e interrompere il lavoro in corso.

Fatti riportati da Sito Inlab (14:42, da verificare alla ripresa): PR #37 (home mobile più leggibile, reel a 720 px, `CLAUDE.md` con Direttore, Competitor, SEO responsabile del blog, `tools/blog-images` al Blog, sezione "Coordinamento"); PR #33 del Blog unita; PR #38 (bug mobile MethodDevices, Esc sul menu, `overflow-x:clip`).

## Lavori del 01/10 mattina (partiti dalle routine del Competitor alle 8:50)

- **Sito Inlab** (PR #41, #42, #43, unite su main 8:54–9:27): P.IVA di Nicola in privacy, footer e dati strutturati; risposte tecniche al Competitor (`docs/risposte-competitor-2026-10-01.md`); `npm audit` di nuovo a 0 (override `@grpc/grpc-js`); **contatori della home con il valore finale nell'HTML** (richiesta SEO ALTA: fatta, quindi `trig_01KtTcYjV7nXwxfaZ86rEEsE` non serve più); **`llms.txt`** generato al build.
- **Performance:** confronto di velocità con 5 concorrenti (`docs/performance/competitor-2026-10-01.md`, branch `sleepy-mccarthy`): InLab il più veloce su mobile insieme a Forte e Chiaro; unico punto debole il peso della home (1,5 MB, griglia Instagram).
- **Blog:** risposte al Competitor (`docs/blog-reports/risposte-competitor-2026-10-01.md`): nessun articolo in bozza, 17 pubblicati con parola chiave.
- **SEO:** nessun commit (push bloccato). **Analisi sito:** controllo delle 8:56, esito solo nella sua chat.
- Sera del 30/09: PR #38 (Metodo + Esc), fix urgente che toglie `html{overflow-x:clip}` (bloccava le sezioni sticky su telefono), PR #39–#40 (icone del sito con il logo InLab).

## 1. Il sito

- **Azienda:** InLab Communication, agenzia di comunicazione a Castellaneta (TA). Titolare: Nicola Carpignano (autori del blog: Nicola Carpignano, Ilaria Gemma).
- **Sito:** https://www.inlab-communication.it — React 19 + Vite + TypeScript, prerender statico, pubblicato su Vercel da `main` (in automatico). Dati su Firestore, media su Cloudinary, chatbot AI (`/api/chat`, Gemini o Claude), dashboard admin su `/admin`.
- **Servizi:** gestione social, Meta Ads, siti web e web app, automazioni AI, foto/shooting, video e reel, branding.
- **Target:** PMI, attività locali e professionisti della provincia di Taranto (Castellaneta, Palagiano, Palagianello, Massafra, Mottola, Laterza, Ginosa, Taranto) e della Puglia.
- **Obiettivi:** visibilità su Google (SEO locale e blog) → richieste di preventivo (`/contatti`, chatbot). Sito veloce, accessibile e sicuro.
- **Pagine:** home, pagine servizio, 56 pagine locali `/{servizio}-{città}`, casi studio, schede cliente `/cliente/...`, blog (17 articoli sul branch del blog), contatti. Sitemap con 101 URL.

## 2. Stato attuale (30/09/2026)

- `main`: fino a PR #35 (`56d1690`, 30/09): video lazy con pausa, cover blog eager, accessibilità, prerender senza script inline, `cld()` per le immagini, archivio media, CaseCard e striscia loghi, Aleph rimosso dal codice, C1-bis, alt + sitemap immagini + ImageObject (brief SEO), animazioni in CSS, home v4, font in locale.
- **Google:** GA4 (proprietà 556088467) e Search Console collegati dal 28/09. Dati ancora quasi a zero; indicizzata solo la home al 29/09. Nessun dato reale CrUX.
- **Prestazioni (PageSpeed 30/09):** home mobile 87 (LCP 3,3 s, "da migliorare"), desktop 98; blog e articoli 99. Accessibilità 100.
- **Blog:** 10 articoli di novità (28/09) + 5 da brief SEO + 2 nuovi (29/09) = 17. Le correzioni del brief 29/09 sono sul branch del blog, **non ancora su main**.

## 3. Agenti: ruoli, confini, stato

| Agente (titolo sessione) | ID sessione | Branch | Può modificare | Stato 30/09 |
|---|---|---|---|---|
| **Direttore Operativo & Memoria Centrale** | `session_01AreWGaDhEeTCs3CDmdifT7` | `claude/hopeful-brahmagupta-u39zb3` | solo `docs/direzione/` | nuovo, allineamento in corso |
| **Sito Inlab** (sviluppo, responsabile tecnico) | `session_01U6sW6ykGz4nrdvKnHMQZsF` | `claude/github-projects-view-e5dw5i` | **unico che modifica il codice**: `src/`, `api/`, `scripts/`, `public/`, `vercel.json`, `package.json`, `firestore.rules`, `index.html`, doc tecnica | attivo; `main` fino a PR #35 (`56d1690`): home v4 di Nicola (#34), font in locale I2 (#35). Apre le PR e **le unisce lui dopo l'anteprima verde** (dice: flusso autorizzato da Nicola). Pubblica anche i documenti delle sessioni con push bloccato (es. `docs/seo` del 30/09 nella PR #31). Non vede la console Vercel, solo i check su GitHub. **Documento di passaggio pronto** (`docs/sviluppo/PASSAGGIO.md`, PR #36, su main). Da ora non inizia nuovi lavori: va sostituita da una nuova sessione (messaggio di avvio in `docs/direzione/AVVIO-SITO-INLAB.md`) e poi archiviata |
| **Adetto SEO giusto** (responsabile SEO e **responsabile strategico del blog**) | `session_018SfEyMKHa2uSgRSKzdE114` | `claude/inlab-analytics-seo-setup-hh2p6e` | solo `docs/seo/` | attivo. Push bloccato dal classificatore della modalità automatica (dal 29/09): i suoi documenti li pubblica Sito Inlab. Prompt §4.4 già corretto (niente codice). Search Console al 30/09: home 5 impressioni, 1 clic, posizione 2,4; pagine interne "rilevate, non indicizzate" |
| Addetto SEO (vecchia sessione) | `session_011qJCHS5861skWDHe1vUFbF` | stesso branch SEO | — | **da archiviare**: sostituita da "Adetto SEO giusto", ambiente diverso |
| **Addetto al Blog** | `session_017pmD2nGS4KjecYvnyGm8iM` | `claude/optimistic-ritchie-mj87ne` | `src/data/blogSeed.ts`, `public/blog/`, `docs/blog-brief.md`, `docs/blog-reports/` | PR #33 aperta (metadati IPTC e alt delle 41 immagini, 10 immagini rinominate, resoconto SEO); ultimo voto SEO 8/10; routine mar/ven 8:47 dal 2/10, pubblicazione automatica 11:50 disattivata |
| **Addetto performance** | `session_012pr6hkmubH9ZAA9gVGN4Gf` | `claude/sleepy-mccarthy-g1a968` | solo `docs/performance/` | attivo; ultima misura 30/09 14:05 (home Perf 67/88/96, LCP 3,8/3,0/2,1 s; /siti-web 95/98). Aspetta il prossimo lotto di Sito Inlab per rimisurare. Non ha chiave PageSpeed: CrUX lo legge il titolare |
| **Adetto analisi sito** (= analista sicurezza / controlli) | `session_01Kim4sfBnoqhrkBJnpGTrHz` | `claude/serene-noether-l1j2l4` | **niente, solo lettura** | attivo. Non raggiunge il sito online (rete 403): lavora su codice, build e test Playwright in locale; per i controlli dal vivo si appoggia alla Performance. Routine automatica ogni 2 giorni alle 8:56 (`trig_01DewoKd4ZBE4VD8i6mk8HKp`). Nuovo compito: controllo mobile. Nessun report su file: tutto in chat e messaggi |
| **Analisi competitor Inlab** | `session_01Si9h5q6bVpPQbAn5BzeiCE` | `claude/trusting-dirac-fhmj15` (non ancora sul remoto) | da definire: proposta `docs/competitor/` | al lavoro (30/09): concorrenti indicati dal titolare + altri 8 da cercare da sola |

### Dati che possiede ogni agente
- **SEO giusto:** accesso API a GA4 e Search Console (`tools/seo/google-data.mjs`, variabili `GOOGLE_SA_KEY`, `GA4_PROPERTY_ID`, `GSC_SITE`), brief `docs/seo/brief/2026-09-28.md` e `2026-09-29.md`, linee guida blog v2 (`docs/seo/LINEE-GUIDA-BLOG.md`), prompt del ruolo (`docs/seo/PROMPT-RESPONSABILE-SEO.md`).
- **Blog:** `docs/blog-brief.md` (fonti, classificazione A/B/C, formato), report `docs/blog-reports/2026-09-28.md` e `2026-09-30-resoconto.md`, generatore immagini `tools/blog-images/`.
- **Performance:** report `docs/performance/2026-09-30.md` (ultimo commit `6ff3791`) e artifact "Audit prestazioni InLab" (https://claude.ai/artifact/4JMeBKCCjNsomDzJpsVQQ8). Lighthouse, PageSpeed.
- **Analista:** codice e branch, build, tsc, npm audit, test Playwright con server che imita Vercel, prove da anonimo sulle regole Firestore via REST. Nessuna credenziale. Ha verificato: 6 punti di sicurezza del 29/09, redirect e 404, upload Cloudinary firmati, PR #13–#32.
- **Sito Inlab:** tutto il codice, PR e stato dei check/anteprime su GitHub, sito online via curl/Playwright. Niente console Vercel, niente GA4/GSC. Documenti: `CLAUDE.md`, `SECURITY.md`, descrizioni delle PR #20–#35.
- **Competitor:** nulla ancora; aspetta i nomi dei concorrenti.

## 4. Regole di comunicazione

**Comunicazione diretta tra agenti (senza passare dal Direttore)** per: chiedere dati, chiarire report, evitare doppioni, migliorare un'analisi, coordinare SEO e blog, confrontare performance e controlli, usare dati competitor per SEO o contenuti.

**Si passa dal Direttore** quando:
- il task richiede Sito Inlab (qualsiasi modifica al codice);
- la modifica è visibile o strategica: homepage, pagine servizio, struttura, UX, conversioni, SEO locale importante;
- più agenti hanno opinioni diverse;
- il lavoro rischia di consumare molti crediti;
- bisogna decidere cosa fare prima.

**Possono andare dritti a Sito Inlab** (il Direttore ne viene solo informato): correzioni piccole e non visibili già concordate nei flussi di `CLAUDE.md` (titoli/descrizioni del brief SEO, correzioni di accessibilità minori, fix di sicurezza concordati con l'analista, merge delle PR del blog).

**Regola SEO ↔ Blog:** Adetto SEO giusto è sempre il responsabile strategico del blog (priorità, keyword, intenti di ricerca, ottimizzazioni, link interni). Il Blog scrive e non sceglie da solo argomenti importanti. Un articolo è pronto solo se rispetta le indicazioni SEO. In caso di conflitto prevale la SEO su posizionamento, keyword, intenti, link interni e priorità organiche. Un futuro Caporedattore curerà qualità, struttura e tono, sempre dentro la strategia SEO.

**Regole fisse del titolare:** niente prezzi dei servizi di gestione negli articoli (sì ai prezzi ufficiali delle piattaforme); ottimizzazione delle immagini a ogni articolo; sui clienti solo ciò che è già pubblicato, senza numeri, salvo conferma di Nicola; Aleph Caffè non va citato; nessun push su `main`, tutto via PR con anteprima Vercel verde; mai chiavi o dati personali nel repository.

**Come si scrive a un'altra sessione:** SendMessage non funziona tra sessioni cloud. Funziona una routine: `create_trigger` con `persistent_session_id` della sessione destinataria e prompt che inizia con `[Messaggio da <ruolo>]`, poi `fire_trigger` e `delete_trigger` (provato il 30/09, Direttore → Blog). Ogni messaggio sveglia la sessione e consuma i suoi limiti: scrivere solo quando serve, un messaggio con tutto dentro. Per rispondere al Direttore: stesso metodo con `session_01AreWGaDhEeTCs3CDmdifT7`. **Attenzione (dalla SEO):** mai usare il parametro `text` di `fire_trigger` (apre una sessione nuova e vuota); tutto va nel prompt. Dopo l'invio controllare che il `session_id` del risultato sia quello della destinazione.

## 4-bis. Registro messaggi

- 30/09 14:22 Blog → Direttore: stato, PR #33, 3 domande. Risposto alle 14:23.
- 30/09 14:26 Direttore → Sito Inlab, SEO giusto, Performance, Analisi sito, Competitor: metodo di comunicazione, rubrica, regole, richiesta di risposta (max 25 righe). Al Blog solo rubrica. Tutte consegnate.
- 30/09 14:29 Analisi sito → Direttore: risposta di allineamento (ricevuta). 30/09 14:29 Performance → Direttore: risposta di allineamento con priorità aggiornate (ricevuta). 30/09 14:35 Sito Inlab → Direttore: risposta di allineamento (ricevuta). In attesa: SEO giusto, Competitor; documento di passaggio di Sito Inlab.
- 30/09 15:21 Performance → Direttore: misura della nuova home (su richiesta diretta di Nicola) e 3 richieste per Sito Inlab. Nessuna risposta necessaria.
- 30/09 14:47 Analisi sito → Direttore: riferisce che Nicola ha scritto "tutto ok" sui punti mobile 3-5; chiede il session_id della nuova Sito Inlab per aggiornare la sua routine `trig_01DewoKd4ZBE4VD8i6mk8HKp`. Conferma diretta del titolare: richiesta.
- 30/09 14:45 Sito Inlab → Direttore: `PASSAGGIO.md` pronto (commit `3004f8a`, PR #36 unita). Preparato `docs/direzione/AVVIO-SITO-INLAB.md` per la nuova sessione.
- 30/09 14:42 SEO giusto → Direttore: risposta di allineamento, patch per `docs/seo/` (salvata in `docs/direzione/patch-seo-2026-09-30.patch`), categoria Foto & Branding approvata. In attesa: Competitor.
- 30/09 14:37 Analisi sito → Direttore: controllo mobile di base (8 pagine, 360 e 412 px). Risposto: 1 ok, 2 e 6 approvati nel lotto, 3-5 al titolare.
- 30/09 14:29 Direttore → Sito Inlab: scrivere `docs/sviluppo/PASSAGGIO.md` per il passaggio a una nuova sessione (contesto > 500.000 token). Direttore → Analisi sito: nuovo compito fisso "controllo mobile" (sola lettura, 360 e 390-412 px, dopo ogni lotto che tocca il layout). Decisione del titolare: niente secondo sviluppatore per il mobile.

## 5. Priorità note

Già fatto (30/09): **I2 font in locale (PR #35, da rimisurare e da far verificare all'analista sulla CSP)**, home v4 (PR #34), alt/sitemap immagini/ImageObject. Verificato dal vivo dalla Performance: video della home (PR #22, #29), cover del blog eager (blog 74 → 98), accessibilità di menu e form (100), N1 script inline, **C1-bis hero visibile subito (PR #31)**, I5 animazioni in CSS (PR #32).

0. **Misura del 30/09 15:20 (Performance, main `d2d9e22`, nuova home):** mobile Perf 94–100, LCP 1,2–2,2 s (sempre < 2,5 s), CLS 0,03–0,04, A11y 95–96; desktop 99–100. Font in locale confermati (FCP 1,2 s). Richieste nuove per Sito Inlab, in ordine: (a) **griglia Instagram di ScrollPhoneStory** (`src/sections/ScrollPhoneStory.tsx:33` e `:90`) carica 9 cover intere del blog: la home passa da ~490 KB a 1,3–1,5 MB; miniature WebP ~300 px lazy (da concordare con il Blog se servono file in `public/blog/`), obiettivo < 600 KB; (b) contrasto di "un solo team." (`src/sections/ServicesOrbScroll.tsx:141`) da 2,57:1: opacità .45 → .6; (c) preload del corsivo DM Serif Display (`index.html`, per `HeroFlow.tsx:383`), obiettivo CLS < 0,02. Report: `docs/performance/2026-09-30.md`, commit `69e9b15`. La Performance ha mandato lo stesso testo a Sito Inlab.
1. ~~Rimisura dopo PR #34 e #35~~ fatta (vedi punto 0). (Performance) e verifica CSP senza Google Fonts (analista). Obiettivo: nessuna risorsa esterna che blocca il rendering, LCP home stabile < 2,5 s.
2. **Portare su main il lavoro del blog**: PR #33, controllo tecnico di Sito Inlab.
3. ~~Correzioni SEO del commit `4c6ebaf`~~ già su main (rifatte da Sito Inlab). Fatto anche: HTML statico con testo (101 pagine), pagine città rifatte (Gravina sì, Massafra via, Ginosa resta), pagine autore, H1 home con servizio e città, sitemap immagini (126).
4. **CLS del cerchio viola** `.anim-drift` (`src/sections/HeroFlow.tsx:343`): `overflow:hidden` o `contain: layout paint` sul contenitore. Obiettivo CLS home da 0,051 a < 0,02.
5. Aggiornare `CLAUDE.md` con i ruoli nuovi (Direttore, Competitor, SEO responsabile del blog).
6. **Cover in WebP in build** (`public/blog/`): decide il Blog con la Performance. Obiettivo LCP articolo stabile < 2,5 s (oggi 1,7–5,0 s).
7. Minori, insieme quando si tocca il Chatbot: LazyMotion (`src/sections/*`, ~15–20 KB), Chatbot lazy e `label-content-name-mismatch` del launcher (`src/components/Chatbot.tsx`), M1–M6, N2. Metadati IPTC nel generatore `tools/blog-images`.
8. Bassa (analista): `persist()` dell'archivio Media riscrive tutto il documento; con due schede o due admin vince l'ultimo salvataggio.

## 5-bis. Lotto per Sito Inlab (da mandare in un solo messaggio, dopo l'ok del titolare e preferibilmente alla nuova sessione)

1. ~~I2 font in locale~~ fatto (PR #35).
2. Controllo tecnico della PR #33 del Blog.
3. Applicare su main la patch della SEO `docs/direzione/patch-seo-2026-09-30.patch` (solo `docs/seo/`, verificata con `git apply --check`).
3-bis. Categoria blog "Foto & Branding" (approvata dalla SEO, bassa priorità) per `servizio-fotografico-ristoranti` e `rebranding-attivita-commerciale`.
3-ter. Immagini per la SEO: export dell'Archivio Media, width/height negli articoli, screenshot locali al posto di mshots, srcset, nomi file leggibili.
4. CLS del cerchio viola.
5. `CLAUDE.md`: ruoli Direttore e Competitor, SEO responsabile del blog, passaggio dal Direttore.
6. Metadati IPTC nel generatore `tools/blog-images` (prima decidere chi può modificare `tools/`: non è nell'area di nessuno in `CLAUDE.md`; proposta: Sito Inlab).
7. Alt dall'Archivio Media verso il sito (serve l'elenco dalla SEO).
8. Mobile (controllo di base dell'analista, 30/09, main `56d1690`): campo del chatbot a 16 px (niente zoom iOS) e chiusura del menu mobile con Esc. **Approvati dal Direttore.** Il bug ALTA della home che si allarga (etichetta animata di MethodDevices) l'analista l'ha già passato a Sito Inlab.
9. **In attesa del titolare (visibili):** pulsanti e link alti almeno 44 px (PARLIAMO nell'header, CTA 32-37 px, link del footer 17 px); contrasto di alcuni testi della home e di un paragrafo da 11 px nel caso studio; etichette da 10-11 px.
10. Minori noti a Sito Inlab: anteprime mshots esterne in `BrowserMockup`, `persist()` dell'archivio Media.

## 6. Problemi aperti

| # | Problema | Chi | Cosa serve |
|---|---|---|---|
| P1 | ~~Risolto 30/09~~: prompt SEO corretto, `4c6ebaf` già su main. Era: il branch SEO contiene modifiche al codice (`src/seo/routes.ts`, `scripts/prerender.ts`, `src/App.tsx`, commit `4c6ebaf`) e il prompt SEO dice "fai tu le correzioni tecniche": **in contrasto con `CLAUDE.md`** | SEO giusto → Sito Inlab | la SEO scrive le richieste nel brief; Sito Inlab le applica. Aggiornare il prompt SEO. |
| P2 | Push della SEO bloccato dal classificatore della modalità automatica (lo ha trattato come un deploy di produzione) | titolare | o una regola di permesso per il push sul branch SEO, o si continua con Sito Inlab che pubblica i suoi documenti (patch del 30/09 pronta) |
| P3 | ~~Chi apre le PR del Blog~~ **Deciso 30/09:** le apre il Blog dal suo branch; controllo tecnico di Sito Inlab; unione del titolare con anteprima verde. PR #33 da controllare | Sito Inlab | controllo della PR #33 |
| P4 | `docs/blog-brief.md` indica come responsabile SEO la vecchia sessione "Integrazione Analytics e Search Console" | Blog | aggiornare il nome in "Adetto SEO giusto" |
| P5 | Due sessioni SEO (vecchia e "giusto"): rischio doppioni e crediti | titolare | archiviare "Addetto SEO" |
| P6 | ~~Branch dell'analista con vecchie modifiche al codice~~ **Confermato dall'analista 30/09:** `serene-noether` NON va unito, resta solo come storico | — | nulla |
| P7 | Articolo AGCOM influencer bloccato: agcom.it non è raggiungibile dall'ambiente | Blog | verifica manuale del titolare o fonte alternativa |
| P8 | Richiesta del Blog: categoria "Foto & Branding" in `BLOG_CATEGORIES` (codice) | SEO decide → Sito Inlab | decisione SEO, poi richiesta a Sito Inlab |
| P9 | Attività di sicurezza nelle console esterne (`SECURITY.md`). **Fatto (titolare, 30/09):** chiave Gemini rigenerata, tetto di spesa impostato. **Fatto (verificato dall'analista):** regole Firestore pubblicate (dal vivo: tutto 403 tranne `site_content`), Cloudinary Signed + `CLOUDINARY_API_SECRET`, Deploy Hook. **Da confermare:** chiave Anthropic (se usata) e suo tetto, "Salva impostazioni" in dashboard per cancellare le vecchie chiavi dal database, registrazioni Firebase disattivate, restrizione HTTP referrer sulla browser key, TTL su `_ratelimits.expireAt`, `RATE_LIMIT_SALT` (facoltativo) | titolare | confermare i punti rimasti |
| P10 | Competitor: il titolare ha mandato i nomi il 30/09, più altri 8 da cercare alla sessione. Aveva chiesto anche le risposte delle altre sessioni: **doppione** con questa mappa | Direttore | il report deve andare in `docs/competitor/`; i dati utili passano all'Adetto SEO giusto |
| P12 | Metadati IPTC da aggiungere al generatore `tools/blog-images` (script nel resoconto del Blog del 30/09) | Sito Inlab | nel prossimo lotto |
| P13 | ~~Risolto nella patch del 30/09~~: Mappa "Già coperte" (linee guida SEO, sezione 10): le linee guida dicono che la aggiorna il Blog, ma è in `docs/seo/` | SEO giusto | aggiungere `servizio-fotografico-ristoranti` e `rebranding-attivita-commerciale`; correggere le linee guida |
| P16 | Sito Inlab unisce da solo le PR in `main` dopo l'anteprima verde (dice: autorizzato da Nicola), ma `CLAUDE.md` dice "nessuna unisce branch in main da sola" | titolare | confermare la regola e allineare `CLAUDE.md` |
| P17 | `tools/` (generatore immagini del blog, script SEO) non è nell'area di nessuno in `CLAUDE.md` | titolare | proposta: `tools/` a Sito Inlab |
| P14 | Aleph Caffè è ancora nella lista clienti in Firestore | titolare | toglierlo dalla dashboard |
| P15 | Routine dell'analista ogni 2 giorni: consuma crediti anche quando non cambia niente | titolare | decidere se passarla a settimanale |
| P18 | Confusione con "InLab Comunicazione" di Forlì; manca la scheda Google Business | titolare | link della scheda Google Business |
| P19 | Ricciardi ha sia `/cliente/` sia `/casi-studio/` (cannibalizzazione); schede cliente con ~100 parole | titolare → SEO | casi studio dal titolare |
| P20 | La SEO aspetta dal titolare: profili personali, foto del team, scelta A/B per la frase di "Chi siamo" | titolare | materiali |
| P11 | Paragrafi "metodo InLab" negli articoli senza casi reali | titolare | informazioni sui clienti |

## 7. Vincoli tecnici

- `main` va online da solo: niente push su `main`, solo PR con anteprima Vercel verde.
- Markdown del blog: niente tabelle, HTML, `#`, codice; `seoTitle` ≤ 60 caratteri con " | InLab", `seoDescription` 140–155.
- `updated` solo quando un articolo cambia davvero (diventa la data della sitemap).
- Consent Mode: GA4 conta solo chi accetta i cookie, sempre più basso di Search Console.
- Alcuni domini (agcom.it, garanteprivacy.it, facebook.com/business…) non sono raggiungibili dagli ambienti cloud; npm a volte non installa nel branch del blog.
- CSP restrittiva: ogni nuovo servizio esterno va aggiunto in `vercel.json` da Sito Inlab.

## 8. Vincoli di crediti

- Il 30/09 Sito Inlab, Addetto performance e Adetto analisi sito hanno raggiunto il limite delle 5 ore (reset 13:30 UTC); l'account è in avviso sul limite settimanale (reset 03/10).
- Spesa indicativa per sessione finora: Sito Inlab ~156 $, Blog ~61 $, Analisi sito ~38 $, SEO giusto ~32 $, SEO vecchia ~9 $, Performance ~9 $, Competitor ~0,5 $.
- **Regole per risparmiare:**
  - un'analisi alla volta, solo quando la chiede il titolare (niente analisi automatiche);
  - prima di iniziare, controllare l'ultimo report/brief per non rifare lavoro già fatto;
  - richieste a Sito Inlab raggruppate in un unico elenco con priorità, non a gocce;
  - un commit per punto, ma una sola sessione di lavoro per lotto;
  - niente misure ripetute inutili: la performance rimisura solo dopo un commit di Sito Inlab;
  - archiviare le sessioni doppie o finite.

## 9. Chi è responsabile di cosa

| Tema | Decide | Esegue | Controlla |
|---|---|---|---|
| Codice, deploy, sicurezza tecnica | Sito Inlab | Sito Inlab | Analista |
| Strategia SEO, keyword, priorità del blog | Adetto SEO giusto | SEO (brief) / Blog (articoli) / Sito Inlab (codice) | Sito Inlab (solo tecnico) |
| Articoli | SEO (strategia) | Blog | SEO |
| Velocità e accessibilità | Performance (misura) + Sito Inlab (tecnica) | Sito Inlab | Performance |
| Sicurezza e raggiungibilità | Analista + Sito Inlab insieme | Sito Inlab | Analista |
| Concorrenti | Competitor | Competitor (report) | SEO / Direttore |
| Priorità, doppioni, crediti, onboarding | Direttore | Direttore | titolare |
| Unione in main, decisioni finali, conflitti | **titolare** | titolare | — |

---

## 10. Messaggi di allineamento da incollare

Le sessioni cloud non ricevono messaggi da altre sessioni: il titolare incolla a ciascuna il testo qui sotto. Ogni agente risponde in **massimo 25 righe** (per risparmiare crediti) e il titolare incolla le risposte al Direttore.

### Testo comune (da mettere all'inizio di ogni messaggio)

> Ti scrive il **Direttore Operativo & Memoria Centrale Inlab** (sessione "Direttore Operativo Inlab."). Il mio compito: conoscere tutto il progetto, ridurre la confusione, evitare task duplicati, gestire le priorità, proteggere i crediti, fare onboarding ai nuovi agenti e filtrare le modifiche importanti prima che arrivino a Sito Inlab. La mappa completa è in `docs/direzione/MAPPA-PROGETTO.md` sul branch `claude/hopeful-brahmagupta-u39zb3`.
>
> Regole: **Sito Inlab è l'unico che modifica il codice.** Potete parlarvi direttamente per dati, chiarimenti, doppioni, coordinamento SEO-blog, performance-controlli, dati competitor. Passate da me quando serve Sito Inlab, quando la modifica è visibile o strategica (homepage, pagine servizio, struttura, UX, conversioni, SEO locale), quando ci sono opinioni diverse, quando il lavoro costa molti crediti o bisogna decidere le priorità. Adetto SEO giusto è il responsabile strategico del blog: sui temi di posizionamento prevale la SEO.
>
> Rispondimi in massimo 25 righe: 1) ruolo esatto; 2) cosa puoi e non puoi fare; 3) dati che possiedi; 4) report già prodotti (file e data); 5) problemi che conosci; 6) attività in corso; 7) attività completate; 8) cosa ti serve dagli altri agenti; 9) se c'è qualcosa in questa mappa che è sbagliato.

### Solo per Sito Inlab
> Tre richieste per te, da fare in un solo lotto quando hai crediti: (a) aggiungere a `CLAUDE.md` i ruoli Direttore Operativo (`docs/direzione/`), Analisi competitor (`docs/competitor/`), la regola "SEO responsabile strategico del blog" e il passaggio dal Direttore per le modifiche importanti; (b) C1-bis hero visibile subito (priorità 1 della performance); (c) rivedere e applicare tu le correzioni SEO del commit `4c6ebaf` sul branch SEO (titoli, descrizioni, lastmod), che non dovevano stare sul branch SEO. Dimmi anche quali PR sono aperte e cosa ti aspetti dagli altri.

### Solo per Adetto SEO giusto
> Due punti: (a) il tuo prompt (`docs/seo/PROMPT-RESPONSABILE-SEO.md`, sezione 4.4) dice "fai tu le correzioni tecniche in `routes.ts`", ma `CLAUDE.md` lo vieta: aggiornalo, e d'ora in poi le correzioni vanno in "Richieste per lo sviluppo" del brief; (b) perché il push è bloccato e cosa c'è del 30/09 non ancora sul remoto? Decidi tu anche la categoria "Foto & Branding" proposta dal Blog.

### Solo per Addetto al Blog
> Risposta alla tua domanda: la PR la apri tu dal tuo branch (contiene solo file della tua area); Sito Inlab fa il controllo tecnico e il titolare la unisce quando l'anteprima Vercel è verde. Prima fai confermare all'Adetto SEO giusto che le correzioni del brief 29/09 sono ok. In `docs/blog-brief.md` aggiorna il nome del responsabile SEO: ora è "Adetto SEO giusto".

### Solo per Addetto performance
> Il tuo report del 30/09 è nella mappa: C1-bis resta la priorità 1 e la passo io a Sito Inlab insieme agli altri lavori. Rimisuri solo dopo i commit di Sito Inlab. La conversione WebP delle cover la concordi direttamente con il Blog.

### Solo per Adetto analisi sito (analista sicurezza / controlli)
> Sei in sola lettura: segnala a Sito Inlab (e a me per conoscenza) con priorità, file e riga. Il tuo branch `serene-noether` contiene vecchie modifiche al codice del 25–28/09: confermi che non vanno unite? Sai se le attività nelle console di `SECURITY.md` (chiavi AI, tetti di spesa, regole Firestore, admin) sono state fatte?

### Solo per Analisi competitor Inlab
> Non serve che raccogli le risposte delle altre sessioni: la mappa è già pronta in `docs/direzione/MAPPA-PROGETTO.md`. Ti servono solo i nomi dei concorrenti dal titolare. Proposta: scrivi i report in `docs/competitor/AAAA-MM-GG.md` e passa i dati utili direttamente all'Adetto SEO giusto; le idee che toccano il sito passano da me.

### Per ogni nuovo agente (onboarding)
> Leggi `CLAUDE.md` e `docs/direzione/MAPPA-PROGETTO.md`. Lavora solo nella tua cartella e sul tuo branch `claude/…`. Il codice lo modifica solo Sito Inlab. Prima di iniziare un lavoro, controlla che non sia già stato fatto. Le modifiche importanti passano dal Direttore.
