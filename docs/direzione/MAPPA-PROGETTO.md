# Mappa del progetto Inlab — Memoria centrale

Curata dal **Direttore Operativo & Memoria Centrale Inlab** (sessione "Direttore Operativo Inlab.", branch `claude/hopeful-brahmagupta-u39zb3`).
Aggiornata al **30/09/2026**. Fonte: repository (main e branch di ogni sessione), stato delle sessioni cloud. Le risposte dirette degli agenti non sono ancora arrivate: le sessioni cloud non ricevono messaggi da altre sessioni, quindi i messaggi di allineamento (in fondo) li deve incollare il titolare.

---

## 1. Il sito

- **Azienda:** InLab Communication, agenzia di comunicazione a Castellaneta (TA). Titolare: Nicola Carpignano (autori del blog: Nicola Carpignano, Ilaria Gemma).
- **Sito:** https://www.inlab-communication.it — React 19 + Vite + TypeScript, prerender statico, pubblicato su Vercel da `main` (in automatico). Dati su Firestore, media su Cloudinary, chatbot AI (`/api/chat`, Gemini o Claude), dashboard admin su `/admin`.
- **Servizi:** gestione social, Meta Ads, siti web e web app, automazioni AI, foto/shooting, video e reel, branding.
- **Target:** PMI, attività locali e professionisti della provincia di Taranto (Castellaneta, Palagiano, Palagianello, Massafra, Mottola, Laterza, Ginosa, Taranto) e della Puglia.
- **Obiettivi:** visibilità su Google (SEO locale e blog) → richieste di preventivo (`/contatti`, chatbot). Sito veloce, accessibile e sicuro.
- **Pagine:** home, pagine servizio, 56 pagine locali `/{servizio}-{città}`, casi studio, schede cliente `/cliente/...`, blog (17 articoli sul branch del blog), contatti. Sitemap con 98 URL.

## 2. Stato attuale (30/09/2026)

- `main`: ultime PR #22–#30 di Sito Inlab (video home con pausa/audio, chatbot, clienti, archivio media). Ultimo commit 30/09 11:46.
- **Google:** GA4 (proprietà 556088467) e Search Console collegati dal 28/09. Dati ancora quasi a zero; indicizzata solo la home al 29/09. Nessun dato reale CrUX.
- **Prestazioni (PageSpeed 30/09):** home mobile 87 (LCP 3,3 s, "da migliorare"), desktop 98; blog e articoli 99. Accessibilità 100.
- **Blog:** 10 articoli di novità (28/09) + 5 da brief SEO + 2 nuovi (29/09) = 17. Le correzioni del brief 29/09 sono sul branch del blog, **non ancora su main**.

## 3. Agenti: ruoli, confini, stato

| Agente (titolo sessione) | ID sessione | Branch | Può modificare | Stato 30/09 |
|---|---|---|---|---|
| **Direttore Operativo & Memoria Centrale** | `session_01AreWGaDhEeTCs3CDmdifT7` | `claude/hopeful-brahmagupta-u39zb3` | solo `docs/direzione/` | nuovo, allineamento in corso |
| **Sito Inlab** (sviluppo, responsabile tecnico) | `session_01U6sW6ykGz4nrdvKnHMQZsF` | `claude/github-projects-view-e5dw5i` | **unico che modifica il codice**: `src/`, `api/`, `scripts/`, `public/`, `vercel.json`, `package.json`, `firestore.rules`, `index.html`, doc tecnica | fermo per limite crediti (reset 13:30 UTC); PR fino a #30 unite |
| **Adetto SEO giusto** (responsabile SEO e **responsabile strategico del blog**) | `session_018SfEyMKHa2uSgRSKzdE114` | `claude/inlab-analytics-seo-setup-hh2p6e` | solo `docs/seo/` | ha inviato a Sito Inlab i documenti SEO dei casi studio; push bloccato dalla policy di sicurezza |
| Addetto SEO (vecchia sessione) | `session_011qJCHS5861skWDHe1vUFbF` | stesso branch SEO | — | **da archiviare**: sostituita da "Adetto SEO giusto", ambiente diverso |
| **Addetto al Blog** | `session_017pmD2nGS4KjecYvnyGm8iM` | `claude/optimistic-ritchie-mj87ne` | `src/data/blogSeed.ts`, `public/blog/`, `docs/blog-brief.md`, `docs/blog-reports/` | PR #33 aperta (metadati IPTC e alt delle 41 immagini, 10 immagini rinominate, resoconto SEO); ultimo voto SEO 8/10; routine mar/ven 8:47 dal 2/10, pubblicazione automatica 11:50 disattivata |
| **Addetto performance** | `session_012pr6hkmubH9ZAA9gVGN4Gf` | `claude/sleepy-mccarthy-g1a968` | solo `docs/performance/` | report 30/09 fatto, fermo per limite crediti |
| **Adetto analisi sito** (= analista sicurezza / controlli) | `session_01Kim4sfBnoqhrkBJnpGTrHz` | `claude/serene-noether-l1j2l4` | **niente, solo lettura** | fermo per limite crediti |
| **Analisi competitor Inlab** | `session_01Si9h5q6bVpPQbAn5BzeiCE` | `claude/trusting-dirac-fhmj15` (non ancora sul remoto) | da definire: proposta `docs/competitor/` | al lavoro (30/09): concorrenti indicati dal titolare + altri 8 da cercare da sola |

### Dati che possiede ogni agente
- **SEO giusto:** accesso API a GA4 e Search Console (`tools/seo/google-data.mjs`, variabili `GOOGLE_SA_KEY`, `GA4_PROPERTY_ID`, `GSC_SITE`), brief `docs/seo/brief/2026-09-28.md` e `2026-09-29.md`, linee guida blog v2 (`docs/seo/LINEE-GUIDA-BLOG.md`), prompt del ruolo (`docs/seo/PROMPT-RESPONSABILE-SEO.md`).
- **Blog:** `docs/blog-brief.md` (fonti, classificazione A/B/C, formato), report `docs/blog-reports/2026-09-28.md` e `2026-09-30-resoconto.md`, generatore immagini `tools/blog-images/`.
- **Performance:** report `docs/performance/2026-09-30.md` e artifact "Audit prestazioni InLab" (https://claude.ai/artifact/4JMeBKCCjNsomDzJpsVQQ8). Lighthouse, PageSpeed.
- **Analista:** controlli su intestazioni, redirect, console, sicurezza (vedi `SECURITY.md`).
- **Sito Inlab:** tutto il codice, accesso ai deploy Vercel, PR.
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

**Come si scrive a un'altra sessione:** SendMessage non funziona tra sessioni cloud. Funziona una routine: `create_trigger` con `persistent_session_id` della sessione destinataria e prompt che inizia con `[Messaggio da <ruolo>]`, poi `fire_trigger` e `delete_trigger` (provato il 30/09, Direttore → Blog). Ogni messaggio sveglia la sessione e consuma i suoi limiti: scrivere solo quando serve, un messaggio con tutto dentro. Per rispondere al Direttore: stesso metodo con `session_01AreWGaDhEeTCs3CDmdifT7`.

## 5. Priorità note

1. **C1-bis — hero visibile subito** (critico, performance): home e /siti-web con LCP 3,3–4,6 s per l'hero che parte da `opacity:0`. Obiettivo render delay < 0,5 s, LCP < 2,5 s. → Sito Inlab.
2. **Portare su main il lavoro del blog** (correzioni brief 29/09 + 2 articoli + metadati IPTC) via PR dal branch del blog, dopo controllo SEO.
3. **Correzioni SEO tecniche del commit `4c6ebaf`** (titoli ≤ 60, descrizioni 140–155, lastmod reale in sitemap): sono codice, vanno rifatte o riviste da Sito Inlab.
4. **I2 font in locale** e risorse che bloccano il rendering (~1,1 s risparmiabili su mobile).
5. Aggiornare `CLAUDE.md` con i ruoli nuovi (Direttore, Competitor, SEO responsabile del blog).
6. Minori: `label-content-name-mismatch` del launcher chat, WebP delle cover (da concordare con il Blog, in build), I5 LazyMotion/Chatbot lazy, M1–M6, N2.

## 5-bis. Lotto per Sito Inlab (da mandare in un solo messaggio)

1. C1-bis hero visibile subito (priorità 1).
2. I2 font in locale (priorità comune di Performance e Analisi sito).
3. Controllo tecnico della PR #33 del Blog.
4. Metadati IPTC nel generatore `tools/blog-images`.
5. Correzioni SEO del commit `4c6ebaf` (titoli, descrizioni, lastmod) dal branch SEO.
6. `CLAUDE.md`: ruoli Direttore e Competitor, SEO responsabile del blog, passaggio dal Direttore.

## 6. Problemi aperti

| # | Problema | Chi | Cosa serve |
|---|---|---|---|
| P1 | Il branch SEO contiene modifiche al codice (`src/seo/routes.ts`, `scripts/prerender.ts`, `src/App.tsx`, commit `4c6ebaf`) e il prompt SEO dice "fai tu le correzioni tecniche": **in contrasto con `CLAUDE.md`** | SEO giusto → Sito Inlab | la SEO scrive le richieste nel brief; Sito Inlab le applica. Aggiornare il prompt SEO. |
| P2 | Push della sessione SEO bloccato dalla policy di sicurezza (brief del 30/09 e sezione 8 delle linee guida non sono sul remoto) | SEO giusto, titolare | capire la causa; pubblicare solo `docs/seo/` |
| P3 | ~~Chi apre le PR del Blog~~ **Deciso 30/09:** le apre il Blog dal suo branch; controllo tecnico di Sito Inlab; unione del titolare con anteprima verde. PR #33 da controllare | Sito Inlab | controllo della PR #33 |
| P4 | `docs/blog-brief.md` indica come responsabile SEO la vecchia sessione "Integrazione Analytics e Search Console" | Blog | aggiornare il nome in "Adetto SEO giusto" |
| P5 | Due sessioni SEO (vecchia e "giusto"): rischio doppioni e crediti | titolare | archiviare "Addetto SEO" |
| P6 | Il branch dell'analista (`serene-noether`) contiene vecchie modifiche al codice (25–28/09, prima delle regole), mai unite | analista / titolare | non unire; il branch resta solo come storico |
| P7 | Articolo AGCOM influencer bloccato: agcom.it non è raggiungibile dall'ambiente | Blog | verifica manuale del titolare o fonte alternativa |
| P8 | Richiesta del Blog: categoria "Foto & Branding" in `BLOG_CATEGORIES` (codice) | SEO decide → Sito Inlab | decisione SEO, poi richiesta a Sito Inlab |
| P9 | Attività di sicurezza nelle console esterne (`SECURITY.md`). **Fatto (titolare, 30/09):** chiave Gemini rigenerata, tetto di spesa impostato. **Da confermare:** chiave Anthropic (se usata), chiavi vecchie cancellate dal database ("Salva impostazioni" in dashboard), regole Firestore pubblicate, admin creati, registrazioni pubbliche bloccate | titolare | confermare i punti rimasti |
| P10 | Competitor: il titolare ha mandato i nomi il 30/09, più altri 8 da cercare alla sessione. Aveva chiesto anche le risposte delle altre sessioni: **doppione** con questa mappa | Direttore | il report deve andare in `docs/competitor/`; i dati utili passano all'Adetto SEO giusto |
| P12 | Metadati IPTC da aggiungere al generatore `tools/blog-images` (script nel resoconto del Blog del 30/09) | Sito Inlab | nel prossimo lotto |
| P13 | Mappa "Già coperte" (linee guida SEO, sezione 10): le linee guida dicono che la aggiorna il Blog, ma è in `docs/seo/` | SEO giusto | aggiungere `servizio-fotografico-ristoranti` e `rebranding-attivita-commerciale`; correggere le linee guida |
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
