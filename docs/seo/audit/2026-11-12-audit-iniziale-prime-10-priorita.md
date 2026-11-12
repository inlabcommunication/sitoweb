# INLAB — Audit iniziale e prime 10 priorità (12/11/2026)

**Mandato:** Master Prompt di Nicola del 12/11, sintesi in `docs/seo/MANDATO-MASTER.md`.
**Questo documento:** il primo passo richiesto, cioè audit reale e classifica delle prime 10 priorità. Gli altri 11 documenti del mandato seguono nella roadmap in fondo.

**Fonti verificate:**
- **Siti e codice:**
  - le 230 pagine pubblicate, scaricate l'08/11;
  - home, servizi, contatti, clienti, casi studio e chi siamo, riscaricate il 12/11;
  - il codice del modulo e di `/api/lead` sul branch `main`.
- **Dati:**
  - Controllo URL di Search Console su 230 URL (08/11);
  - Search Console Rendimento 09/10–10/11;
  - GA4;
  - SerpApi, cioè risultati veri di Google Italia (05/11);
  - Bing Webmaster API.
- **Cosa non ho:**
  - i dati commerciali: ticket medio, margini, capacità del team, contratti;
  - i lead reali al di fuori della dashboard;
  - lo stato della scheda Google dall'interno.
- **Dove servono,** lo indico come "dato mancante".

**Regola di design:** nessuna proposta qui sotto cambia layout, colori, font, animazioni o la disposizione degli elementi. Dove serve cambiare un testo visibile, lo segnalo come **"richiede approvazione"**, con un testo della stessa lunghezza.

---

## Situazione in 6 numeri
| Indicatore | Valore | Fonte |
|---|---|---|
| Pagine indicizzate | 154/230 | Controllo URL, 08/11 |
| Clic organici | 21 dal 9/10 al 7/11; 11 nella settimana 4–10/11 | Search Console |
| Impressioni delle pagine servizio principali in 30 giorni | gestione-social 2, meta-ads 3, siti-web 3, video 10, shooting 2 | Search Console |
| Lead veri da settembre | **0**: 1 sola richiesta registrata in GA4, ed era una prova | GA4 e Nicola, 03/11 |
| Posizione nella mappa per "agenzia di comunicazione castellaneta" | 2ª (5★, 10 recensioni) | SerpApi, 05/11 |
| Notifica quando arriva un lead | **nessuna**: il lead viene solo salvato in Firestore | codice `api/lead.ts` |

---

## LE PRIME 10 PRIORITÀ

### P0-1 · Nessuno viene avvisato quando arriva un lead
- **URL:** /contatti, modulo; chatbot. **File:** `api/lead.ts`, `api/chat.ts`.
- **Problema e evidenza:**
  - `api/lead.ts` salva il lead nella collezione `leads` di Firestore e risponde 200;
  - non c'è nessuna email, notifica o messaggio;
  - le notifiche push della chat agenti risultano disattivate ("chiavi VAPID mancanti", 03/11);
  - un lead si vede solo aprendo la dashboard.
- **Impatto commerciale:** una richiesta può restare senza risposta per giorni. In questo settore chi risponde per primo spesso vince il lavoro. È l'unico punto in cui il sito può **perdere un cliente già acquisito dalla SEO**.
- **Soluzione:**
  - email immediata a inlab.communication@gmail.com con nome, servizio, messaggio e pagina di provenienza (vedi P1-2);
  - in alternativa, notifica push con le chiavi VAPID su Vercel.
  - Stessa cosa per i contatti lasciati nel chatbot.
- **Rischio:** basso, è solo lato server. Serve un servizio di invio email o un SMTP: la chiave va nell'ambiente, mai nel codice.
- **Criterio di accettazione:** un invio di prova autorizzato genera la notifica entro 1 minuto, una sola volta.
- **Responsabile:** Sito Inlab. **Autorizzazione:** non serve, è invisibile; scelta del servizio email con Nicola.

### P1-2 · I lead non dicono da dove arrivano
- **File:** `api/lead.ts`, modulo in `src/App.tsx`, chatbot.
- **Problema:** il lead salvato contiene nome, email, servizio e messaggio, ma **non** la pagina d'ingresso, il referrer, la pagina di invio o gli UTM.
- **Conseguenze:**
  - non possiamo collegare un contratto alla ricerca organica;
  - GA4 vede solo chi accetta i cookie: dal 9/10 sono 125 sessioni registrate, contro migliaia di impressioni.
- **Soluzione:**
  - salvare con il lead: prima pagina vista nella sessione, referrer, UTM e pagina del modulo. Sono dati tecnici: niente dati personali in più, niente invii a GA4;
  - nella dashboard Lead, aggiungere lo **stato commerciale** con i valori della pipeline del mandato: nuovo → qualificato → call → preventivo → vinto/perso/non pertinente;
  - aggiungere il campo **valore del contratto**.
- **Criterio di accettazione:** un lead di prova mostra in dashboard la pagina d'ingresso e la fonte "google / organic".

### P1-3 · Numeri pubblicati non verificati
**Evidenza:** sono valori scritti a mano nel codice, per esempio `StatsRow` in `src/App.tsx`.

| Pagina | Dichiarazione |
|---|---|
| /meta-ads | "3.2× ROAS medio clienti", "-42% Costo per lead medio", "28 Campagne attive ora", "€2M+ Budget gestito" |
| /gestione-social | "+280% Crescita media follower", "94% Clienti rinnovano" |
| /automazioni-ai | "-60% Tempo su task ripetitivi", "+180% Lead gestiti senza effort" |
| /shooting | "200+ Shooting completati", "47 Brand fotografati" |
| home, /servizi, /chi-siamo, /video | "3.2M+ visualizzazioni", "47+ brand seguiti", "840K record su un singolo video" |

- **Inoltre:** /casi-studio/ricciardi e /casi-studio/paresteta mostrano **in pagina** la scritta "Metriche indicative — da confermare prima della pubblicazione". La stessa frase è anche nei dati della pagina su tutto il sito.
- **Rischio:**
  - credibilità con i clienti;
  - pubblicità ingannevole, se un numero non è dimostrabile;
  - qualità percepita da Google e dalle AI.
  - Un "€2M+ di budget gestito" non verificabile pesa più di nessun numero.
- **Soluzione:**
  1. Nicola conferma per ogni numero: fonte, periodo e metodo di calcolo;
  2. i numeri confermati restano, togliendo la scritta "Metriche indicative";
  3. quelli non dimostrabili si sostituiscono con prove qualitative nello stesso spazio grafico. Esempi: "Campagne seguite in provincia di Taranto", "Dal 2024", "Clienti in 4 province".
- **Dato mancante:** conferma di Nicola, numero per numero. **Richiede approvazione** perché è testo visibile.

### P1-4 · Scheda Google e recensioni, la leva più rapida per Castellaneta e i paesi vicini
- **Evidenza:**
  - per "agenzia di comunicazione castellaneta" la mappa mostra Vyon (4,5★, 6 recensioni), **Inlab Communication (5★, 10)** e GDS Agency;
  - nei risultati sotto la mappa il sito non è tra i primi 9;
  - per "agenzia social taranto" la mappa mostra Alessia Boccanfuso (17 recensioni), Creative Space (3) e SocialPulse (0): noi non ci siamo;
  - ChatGPT ci consiglia per Castellaneta e i paesi vicini, non per Taranto (test di Nicola, 05/11).
- **Blocco attuale:** cambio di sede, quindi la scheda non si modifica finché non c'è il nuovo indirizzo.
- **Cosa si può fare subito,** senza toccare l'indirizzo:
  1. chiedere recensioni ai clienti soddisfatti: obiettivo 10 → 25 entro dicembre, e se possibile nel testo il paese e il servizio, per esempio "gestione social del nostro ristorante a Mottola";
  2. rispondere a tutte le recensioni;
  3. un post a settimana;
  4. foto vere del lavoro.
- **Dopo il trasloco:**
  - indirizzo nuovo ovunque: scheda, sito, dati strutturati, llms.txt e pagina Castellaneta;
  - elenchi di aziende con dati identici;
  - link del sito nella scheda con UTM (`?utm_source=google&utm_medium=organic&utm_campaign=gbp`), così i clic dalla mappa si misurano separati.
- **Non fare:** schede Google a Taranto o Bari senza una sede reale (regole Google).

### P1-5 · Pagine fatte in serie (gestione social e servizio×città)
- **Evidenza (08/11):**
  - gestione social: testo comune al 79% tra le città, indicizzate 44/57;
  - servizio×città: indicizzate 12/48;
  - lotto 5: 5 pagine agenzia lette e scartate da Google.
- **Stato:** la correzione è già pronta nella **PR #119**:
  - testo comune al 35%;
  - 36 pagine in noindex e fuori sitemap;
  - lotto 6 solo con le pagine agenzia.
- **Prossima decisione:** classificare tutte le città in Tier 1, 2 e 3 (Local SEO Masterplan, in roadmap). Non si apre una pagina gestione social per una città senza clienti né domanda.
- **Criterio di accettazione:**
  - dopo il merge rimisuro la somiglianza;
  - entro 3 settimane, indicizzazione delle gestione social ≥ 50/57;
  - le 5 pagine agenzia del lotto 5 rientrano.

### P1-6 · Le pagine servizio, quelle che vendono, sono invisibili su Google
- **Evidenza (Search Console, 30 giorni):**

| Pagina | Impressioni | Posizione |
|---|---|---|
| /gestione-social | 2 | — |
| /meta-ads | 3 | 53 |
| /video | 10 | 55 |
| /shooting | 2 | 31 |
| /siti-web | 3 | — |

- **Altri problemi trovati:**
  - le pagine hanno 560-710 parole e **nessuna FAQ**;
  - l'H1 è creativo e senza parola chiave, per esempio "VIDEO CHE FERMANO lo scroll" o "FAI CRESCERE IL TUO BRAND…";
  - /gestione-social e /video non collegano nessun caso studio;
  - la CTA è uguale su tutte le pagine: "Parliamo" / "Richiedi un preventivo".
- **Causa probabile:**
  - i title puntano a "{servizio} per aziende in Puglia", una ricerca regionale dove competono agenzie nazionali;
  - la pagina non dà a Google segnali locali né prove.
- **Soluzione, che mantiene il design:**
  - **Invisibile o quasi:**
    - title orientati all'intento commerciale locale, per esempio "Gestione social per aziende a Taranto e in Puglia | InLab". Da decidere con la Keyword Map, per non scontrarsi con /gestione-social-taranto;
    - FAQ commerciali in fondo alla pagina, nello stesso stile delle pagine città: prezzi come fattori e non come cifre, tempi, cosa include, chi segue il lavoro;
    - FAQPage nei dati strutturati.
  - **Richiede approvazione, perché è testo visibile della stessa lunghezza:**
    - la riga piccola sopra l'H1 (es. oggi "Servizio — Gestione Social Media") con la parola chiave: "Gestione social per aziende · Taranto e provincia". L'H1 creativo resta com'è;
    - CTA per servizio, per esempio "Richiedi una consulenza social" o "Parlaci del video che vuoi realizzare";
    - blocco "Lavori su questo servizio" con le schede cliente pertinenti.
- **Dato mancante:** quali servizi rendono di più (ticket, margine, rinnovo), per decidere da quale partire. Ipotesi da verificare con Nicola: gestione social e Meta Ads, perché sono contratti ricorrenti.

### P1-7 · Il mercato di Taranto non è ancora preso
- **Evidenza:**
  - /agenzia-comunicazione-taranto: 26 impressioni e 1 clic in 30 giorni, posizione 11,3; nella settimana 4–10/11 ha fatto 2 clic, i primi;
  - "agenzia social taranto": assenti sia dalla mappa sia dai risultati sotto.
  - Concorrenti visti: Extra-web, Mediabrand, Kreativa, Vyon, Pagine Gialle, ProntoPro.
- **Soluzione:**
  1. casi e schede di clienti di Taranto città (oggi c'è solo Emmesse);
  2. recensioni che citano Taranto;
  3. 1-2 citazioni locali, cioè una testata o un'associazione di categoria che parla di un vostro lavoro;
  4. articoli del blog sul mercato di Taranto, con link alla pagina Taranto (già in parte);
  5. presenza negli elenchi che compaiono tra i risultati di Google (Pagine Gialle, ProntoPro, Sortlist), dopo il trasloco.
- **Non fare:** dichiarare una sede a Taranto.

### P2-8 · Il blog porta visite poco commerciali
- **Evidenza:**
  - gli articoli con più impressioni sono `tracking-pixel-email-garante` (328, 5 clic) e `reel-o-post` (233, 0 clic): lettori nazionali e informativi;
  - Trends Puglia: chi cerca "social media manager" cerca "stipendio" e "cosa fa", cioè vuole fare quel lavoro.
- **Soluzione:**
  - dare priorità ai contenuti di scelta e di costo, già in corso: "quanto costa un social media manager", "quanto costa un sito", "come scegliere un'agenzia a Taranto";
  - fermare i nuovi articoli generici nazionali senza un collegamento a un servizio;
  - ogni articolo con link al servizio e al caso studio pertinente, e una CTA coerente.
- **Output:** piano editoriale a 6 mesi ordinato per potenziale di lead (in roadmap).

### P2-9 · La home dichiara 8 servizi, il resto del sito 7
- **Evidenza:**
  - la home mostra "08 Eventi & inaugurazioni", con CTA "Parliamone";
  - /servizi, il menu, llms.txt e i dati strutturati ne hanno 7;
  - non esiste una pagina "eventi e inaugurazioni", ma c'è un caso reale (Paresteta).
- **Decisione da prendere con Nicola:**
  - **(a)** creare la landing `/eventi-inaugurazioni`, nuova pagina con il caso Paresteta, senza toccare la home;
  - **(b)** lasciare eventi come parte di branding o Meta Ads e allineare il testo.
- **Raccomandazione:** (a), se Nicola vuole davvero vendere questo servizio. È una ricerca con intento chiaro: "organizzare inaugurazione negozio", "comunicazione inaugurazione".
- **La home non si tocca** (decisione di Nicola). Le proposte per la home (headline e CTA) le preparo come documento a parte, **solo da approvare**.

### P2-10 · Modulo contatti: funziona, ma qualifica poco
- **Evidenza dal codice:**
  - campi: nome, email, telefono facoltativo, azienda facoltativa, servizio da tendina, messaggio, privacy;
  - controlli: honeypot, token, limite di 5 invii all'ora per IP, invio lato server;
  - `generate_lead` parte **solo dopo** la conferma del server: è corretto;
  - `GET /api/lead` risponde 200;
  - non ho fatto invii di prova (serve un'autorizzazione).
- **Mancano:**
  - **località**: utile per la qualificazione e per sapere quali pagine città funzionano;
  - **messaggio dopo l'invio** con il prossimo passo e i tempi ("Ti rispondiamo entro 24 ore lavorative");
  - **evento `form_start`**, per misurare chi inizia e abbandona.
- **Soluzione:**
  - campo facoltativo "Città/zona", nello stesso stile dei campi esistenti;
  - testo di conferma con i tempi di risposta;
  - `form_start` in GA4.
  - **Richiede approvazione** (campo visibile).
- **Test:** un invio di prova autorizzato su ambiente di anteprima.

---

## Risposte rapide alle domande del mandato che i dati permettono già
- **(1) La home è orientata alle ricerche commerciali?** In parte.
  - Title e H1 contengono "Agenzia di comunicazione a Castellaneta": bene, porta 6 clic in 30 giorni in posizione 5.
  - Mancano prove verificate (P1-3) e c'è l'incoerenza 8/7 servizi (P2-9).
- **(8) Rischi della struttura servizio+città?** Sì, verificati (P1-5). La correzione è nella PR #119.
- **(12) Il form funziona?** Sì, lato codice. Manca la notifica (P0-1). Non l'ho testato con un invio reale: serve un'autorizzazione.
- **(13) I lead sono tracciati e qualificati?** No:
  - non si sa da dove arrivano (P1-2);
  - GA4 vede solo chi accetta i cookie;
  - non c'è uno stato commerciale.
- **(14) Si misurano gli appuntamenti?** No: non esiste un sistema di prenotazione. Proposta nel CRO Audit.
- **(15) Contenuti con visite ma pochi potenziali clienti:** tracking-pixel, meta-one, AI Act, AI Overviews (P2-8).
- **(17) Metriche da verificare:** l'elenco completo è in P1-3.
- **(22) Scheda Google ottimizzata?** Esiste ed è 2ª nella mappa a Castellaneta. Il resto (categorie, servizi, foto, UTM) lo verifico quando Nicola mi dà accesso o screenshot.
- **(23) Problemi tecnici?**
  - Nessun errore grave: 230/230 pagine con risposta 200, 0 link rotti, canonical e JSON-LD corretti.
  - Performance: mobile 91-95 (report dell'Addetto performance, 08/11).

## Interventi che richiedono autorizzazione prima di essere fatti
1. Modifica o rimozione dei numeri pubblicati (P1-3).
2. Testi visibili nelle pagine servizio: riga sopra l'H1, CTA, blocco lavori (P1-6).
3. Nuovo campo "Città/zona" e messaggio di conferma del modulo (P2-10).
4. Nuova landing eventi e inaugurazioni (P2-9).
5. Qualsiasi proposta per la home (headline, CTA), che resta solo un documento.
6. Invio di prova del modulo in produzione.
7. Scelta del servizio email per le notifiche (P0-1).

## Dati che servono da Nicola per gli altri documenti del mandato
1. Per ogni servizio: prezzo medio, margine, durata tipica, rinnovi, ore richieste, quanti nuovi clienti il team può gestire al mese.
2. I servizi che **volete** vendere di più, e quelli che non volete.
3. Conferma, numero per numero, delle metriche pubblicate (P1-3).
4. Le richieste ricevute negli ultimi 6 mesi, anche fuori dal sito: canale, servizio, esito.
5. Accesso o screenshot della scheda Google: categorie, servizi, foto, recensioni.
6. Clienti di Taranto città che possiamo citare e casi da raccontare.

## Roadmap dei documenti del mandato
| Settimana | Documento | Dipende da |
|---|---|---|
| 1 (questa) | Audit iniziale + prime 10 priorità | — |
| 1 | Tracking Plan (eventi GA4, dati del lead, pipeline in dashboard) | — |
| 2 | Keyword Master + Keyword Map (volumi da Keyword Planner) | token Google Ads Basic, oppure CSV |
| 2 | Local SEO Audit + classificazione delle città in Tier 1-2-3 | dati di Search Console dopo la PR #119 |
| 2 | CRO Audit (modulo, CTA, prenotazione di una call) | autorizzazione per i test |
| 3 | Landing Optimization (7 servizi + proposta home solo da approvare) | dati commerciali di Nicola |
| 3 | Competitor Gap (5 concorrenti a Taranto, 3 in Puglia, con SerpApi) | — |
| 4 | Content Plan a 6 mesi per potenziale di lead | Keyword Map |
| 4 | Priority Roadmap a 90 giorni + Intervention Tracker + Dashboard | tutti i precedenti |
| Mensile | Monthly Report a 4 livelli (visibilità, conversioni, qualità, economico) | P1-2 attivo |
