# Regole per risparmiare crediti (valgono per tutti gli agenti)

Decise dal titolare il 10/10/2026 dopo lo stop per crediti finiti. Obiettivo: stesso risultato, meno consumo. Quando i crediti finiscono, tutte le sessioni si fermano in silenzio: ogni risparmio vale.

## Dove si spreca (analisi del Direttore)
1. **Controlli completi ripetuti senza novità** (build + 120 pagine × 4 modalità anche se main non è cambiato).
2. **Verifiche a tappeto per modifiche piccole** (rifare tutto per un commit che tocca un file).
3. **Resoconti lunghi che ripetono cose già note** (stesse richieste a Nicola ripetute in ogni report).
4. **Messaggi incrociati e lavoro rifatto** (es. PR #90: schede rifatte perché la richiesta è cambiata a metà).
5. **Messaggi di sola conferma** ("ricevuto", "ok") che svegliano una sessione per niente.
6. **Rilettura di file interi** (CLAUDE.md, brief, report) quando serve una sola riga.
7. **Lavori facoltativi** (miglioramenti non richiesti, ritocchi estetici, ricerche "per sicurezza").
8. **Sessioni lunghissime**: ogni turno rilegge tutto il contesto; più è lungo, più costa.

## Regole

**R1 — Priorità.** P0: sito non raggiungibile o problema di sicurezza alto. P1: richieste dirette di Nicola. P2: brief SEO e correzioni già approvate. P3: blog, competitor, audit di performance, ritocchi. Se i crediti sono pochi si fa solo P0 e P1.

**R2 — Controlli proporzionati (analista).**
- Se su `main` non ci sono commit nuovi dall'ultimo controllo: controllo **leggero** (sito online raggiungibile, sitemap a 200, intestazioni, Firestore da anonimo). Niente npm ci, build, né 4 modalità.
- Se ci sono commit nuovi: build e prova **solo delle pagine toccate** + 8-10 pagine campione (home, un cliente, blog, contatti, /clienti, una città, /admin).
- Controllo **completo** (tutte le pagine × 4 modalità) solo: prima del merge di una PR grande, o una volta a settimana.
- Una PR piccola → una verifica sola, non due (anteprima + dal vivo): il dal-vivo si limita ai codici di stato e al punto toccato.

**R3 — Resoconti corti.** Massimo ~15 righe. Solo ciò che è **nuovo o cambiato** dall'ultimo resoconto. Non ripetere "serve da Nicola" già noto: scrivilo solo se è nuovo. Se non è successo nulla: 3 righe.

**R3b — Nessuna ripetizione a Nicola.** Le cose da fare per Nicola stanno in `DA-FARE-NICOLA.md` (lista unica). Si scrivono a Nicola solo se nuove o cambiate; se un altro agente (es. la SEO) gliele ha già dette, non si ripetono. Gli agenti segnalano al Direttore, non a Nicola, ciò che non blocca il loro lavoro.

**R4 — Un messaggio, tutto dentro.** Raggruppa più punti in un solo messaggio. Niente messaggi di sola conferma o ringraziamento. Una risposta si manda solo se serve un'azione, una decisione o una correzione.

**R5 — Prima il dubbio, poi il lavoro.** Se la richiesta è ambigua, chiedi **una** domanda al Direttore prima di costruire. Costa meno che rifare.

**R6 — Leggi poco.** Usa ricerche mirate (grep, righe precise) invece di leggere file interi. Leggi l'ultimo brief/report, non tutti. Non rileggere ciò che hai già letto in questa sessione.

**R7 — Sito Inlab: raggruppa.** Più richieste piccole dello stesso giorno → una PR, un commit per punto. Non rifare build/prove complete a ogni commit: prove mirate, prova completa una sola volta prima della PR.

**R8 — SEO, Blog, Performance, Competitor: solo se serve.**
- Blog: parte solo se nel brief SEO ci sono compiti da scrivere; se non ci sono, chiude in 3 righe (non cerca novità a vuoto).
- Performance: misura le pagine chiave (home mobile e desktop, un cliente, /clienti, blog, contatti), non tutto il sito; rimisura solo dopo commit annunciati.
- Competitor: una analisi per volta, solo quando richiesta dal Direttore.
- SEO: brief solo con dati nuovi di Search Console/Analytics (almeno una settimana di differenza).

**R9 — Niente attese attive.** Non fare controlli ripetuti ("polling") né programmare risvegli per aspettare: i resoconti arrivano da soli.

**R10 — Niente lavoro non richiesto.** Se vedi un miglioramento, scrivilo in una riga nel resoconto come proposta; non farlo.

**R11 — Limite raggiunto.** Se un errore dice che i crediti/limite sono finiti: non riprovare. Se riesci, lascia una riga nel tuo resoconto o file di area ("fermato per limite alle hh:mm, ripartire da: …"). Il Direttore controlla le routine al risveglio e avvisa Nicola.

**R12 — Sessioni lunghe.** Quando una sessione diventa molto lunga, il Direttore propone a Nicola di aprirne una nuova con una nota di passaggio (stato, regole, cosa è aperto). Decide Nicola.

## Cosa NON si taglia
Controlli di sicurezza, verifica dell'analista prima di ogni merge, regola "nessun push su main", resoconto finale al Direttore (ma corto).
