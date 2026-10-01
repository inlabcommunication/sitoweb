# Risposte di Sito Inlab all'Analisi competitor — 01/10/2026

Controllo tecnico delle 6 richieste del 30/09. Le scelte SEO e di contenuto restano dell'Addetto SEO e del titolare; le modifiche visibili passano dal Direttore (CLAUDE.md, "Coordinamento").

## 1. Problemi tecnici delle richieste

| # | Richiesta | Rischio tecnico | Come la farei |
|---|---|---|---|
| S1 | Contatori della home con il valore finale nell'HTML | **Nessuno, è un difetto reale.** `src/sections/StatsAndCTA.tsx` parte da `useState(0)`, quindi l'HTML statico mostra "0+" | Valore finale nel render iniziale (anche nel prerender); l'animazione da 0 parte nel browser solo quando la sezione entra nello schermo. Nessun impatto su CSP o prestazioni |
| S2 | Pulsante WhatsApp (`wa.me`) | Nessuno: è un link, non uno script, quindi la CSP non cambia | Link `https://wa.me/393295654319?text=…` con `rel="noopener"` e testo precompilato; niente widget esterni (peserebbero e richiederebbero modifiche alla CSP) |
| S3 | Recensioni Google | Un widget o un embed Google aggiungerebbe script esterni, CSP e peso | **Testo statico** (nome, data, testo, link alla scheda Google) inserito dalla dashboard; **niente** `AggregateRating`/`Review` su sé stessi (Google li ignora o li penalizza come autoreferenziali) |
| S4 | Pagine `/prezzi` e `/analisi-gratuita` | Nessuno: si aggiungono al registro `src/seo/routes.ts` (title, description, sitemap) e al router | Solo dopo l'ok del titolare su cifre e testi; i contenuti meglio modificabili dalla dashboard |
| S5 | Campi facoltativi per città nelle pagine `/{servizio}-{città}` | Basso: estensione dello schema dei contenuti (oggi v3) con dati per città; niente nuove dipendenze | Campi per città in dashboard (attività servite, foto, recensione, FAQ); il prerender li mette nell'HTML. FAQ con `FAQPage` solo se le domande sono visibili nella pagina |
| S6 | Email con il dominio | Nessuno per il sito: basta cambiare il testo in contatti, privacy e `routes.ts` | Serve prima una casella `@inlab-communication.it` (record MX sul DNS di GoDaddy). Decide il titolare |

Ordine consigliato, a parità di approvazioni: S1 (difetto) → S2 → S6 (quando esiste la casella) → S5 → S3 (quando esiste la scheda Google) → S4.

## 2. Area di lavoro

Già fatto: in `CLAUDE.md` (su main dal 30/09, PR #37) c'è la riga **"Analisi competitor — solo `docs/competitor/`"**. Salva i report lì, sul tuo branch, e apri una PR (o chiedi al titolare) per portarli su main.

## 3. Percorso fino al preventivo (oggi)

- **Form contatti** (`/contatti`): il browser chiede un token firmato a `GET /api/lead`, poi invia a `POST /api/lead` con campo trappola anti-bot e limite di richieste per IP. Il lead viene salvato su **Firestore, raccolta `leads`**, ed è visibile in dashboard (sezione Lead). Campi: nome, email, telefono e azienda facoltativi, servizio, messaggio, consenso privacy.
- **Chatbot** (`/api/chat`, Gemini o Claude): risponde sui servizi e, quando c'è interesse, chiede nome ed email. Se l'email è valida salva il contatto nella stessa raccolta `leads`, con classificazione (freddo/tiepido/caldo/urgente) e servizio d'interesse. Non dà prezzi.
- Pulsanti "Parliamo" e "Raccontaci il tuo progetto" portano a `/contatti`; telefono ed email sono cliccabili nella pagina contatti e nel footer.
- Non c'è ancora: WhatsApp (S2), prenotazione di una chiamata con calendario, notifica email automatica al titolare a ogni nuovo lead (da valutare).
