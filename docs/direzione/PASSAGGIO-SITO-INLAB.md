# Nota di passaggio — sessione "Sito Inlab" (13/10/2026)

Per la **nuova** sessione Sito Inlab. La vecchia (`session_01U6sW6ykGz4nrdvKnHMQZsF`) aveva 519.000 token di contesto (consumo alto): si riparte da qui con contesto pulito. Leggi questo file e `CLAUDE.md`, poi aspetta richieste. **Non rifare lavoro già fatto.**

## Ruolo e regole
- Sei l'**unica sessione che modifica il codice** (`src/`, `api/`, `scripts/`, `public/`, `vercel.json`, `package.json`, `firestore.rules`, `index.html`, documentazione tecnica). Le altre aree: SEO `docs/seo/`, Blog (`src/data/blogSeed.ts`, `public/blog/`, `docs/blog-*`), Performance `docs/performance/`, Competitor `docs/competitor/`, Direttore `docs/direzione/`. Analista = sola lettura.
- **Mai push su `main`.** Lavori sul branch `claude/github-projects-view-e5dw5i` (prima di iniziare: `git fetch origin main`, controlla se ci sono commit non uniti; se è tutto unito: `git checkout -B claude/github-projects-view-e5dw5i origin/main`). Una PR per lotto, **un commit per punto**; **l'analista verifica prima del merge**; si unisce solo con anteprima Vercel verde e ok dell'analista. Poi comunichi i commit a chi li ha chiesti.
- Tu non valuti se le scelte SEO sono giuste: fai il **controllo tecnico** (build, pagine, redirect, sitemap, robots, canonical, dati strutturati, prestazioni, sicurezza). Se una richiesta è rischiosa, proponi un'alternativa sicura.
- Mai chiavi/password/dati personali nel repo o in chat; i token li inserisce Nicola in Vercel.
- **Regole di Nicola:** nessun prezzo dei servizi di gestione (sito e blog); `/dove-lavoriamo` senza nomi di clienti (solo settori); **Aleph Caffè mai citato**; clienti solo con informazioni già pubbliche; la velocità del sito è fondamentale; i contenuti dalla dashboard li compila Nicola.
- **Crediti:** leggi `docs/direzione/REGOLE-CREDITI.md` (branch `claude/hopeful-brahmagupta-u39zb3`). In breve: priorità P0 sito giù/sicurezza, P1 richieste di Nicola, P2 brief/correzioni approvate, P3 il resto; raggruppa le richieste piccole in una PR; prove mirate a ogni commit, prova completa una volta prima della PR; un messaggio solo, niente conferme; se ambiguo una domanda prima di costruire; leggi poco (grep).

## Canale tra sessioni
`create_trigger` (persistent_session_id = destinataria, initiation human_request) → `fire_trigger` **senza** `text` → `delete_trigger`. Risposte e messaggi arrivano come notifiche (`ReadNotifications`).
Sessioni: Direttore `session_01AreWGaDhEeTCs3CDmdifT7`; SEO `session_018SfEyMKHa2uSgRSKzdE114`; Blog `session_017pmD2nGS4KjecYvnyGm8iM`; Performance `session_012pr6hkmubH9ZAA9gVGN4Gf`; Analisi sito (analista) `session_01Kim4sfBnoqhrkBJnpGTrHz`; Competitor `session_01Si9h5q6bVpPQbAn5BzeiCE`.
Resoconto al Direttore alla fine di ogni lavoro (max ~15 righe, solo novità).

## Stato al 13/10 (main `b193d94`, PR fino alla #97 unite)
- Sito: 143 URL in sitemap, tutti 200. Controlli al build: `check:hydration`, guardia "pagina della sitemap in un redirect di vercel.json".
- Fatto di recente: Clienti (`/clienti`, 301 da `/casi-studio`), Altri clienti (15 schede `/cliente/…`, 12 pubblicate, 3 bozze noindex), pagina autore `/autori/nicola-carpignano-social-media-manager-palagianello` (301 dal vecchio), lotto 1 città (Castellaneta Marina, Ferrara, Crispiano, Statte, Noci, Martina Franca: agenzia + gestione social), copertine reel (`api/reel-cover`, import automatico all'incolla dell'embed, kill-switch `REEL_COVER_IMPORT=off`), ritocchi accessibilità (link autore sottolineati; "Sponsorizzato" contrasto), docs Performance su main.
- **Da fare / in attesa:**
  1. **Lotto 2 SEO (10 paesi, 2 pagine ciascuno = 20 pagine)**: brief `docs/seo/brief/` nel branch SEO `claude/inlab-analytics-seo-setup-hh2p6e` (commit `86dcdf8`, "brief lotto 2, dieci paesi"). Arriverà dalla SEO (o la chiede il Direttore). Ogni lunedì un lotto da 10 (decisione di Nicola del 10/10).
  2. **Coordinate della sede**: serve il link completo di Google Maps/Business (Nicola ha problemi a ottenerlo): non inventare coordinate.
  3. Voci aperte con Nicola (non tue): console di SECURITY.md, nota "Metriche indicative", schede vuote da compilare.
- Ricorda: `vercel.json` ha redirect che vengono prima dei file statici: confronta sempre i redirect quando tocchi indirizzi.
- Lezioni: fai una domanda se la richiesta è ambigua (PR #90: schede rifatte); un controllo di sicurezza lo fa l'analista, non tu da solo.
