# Analisi dettagliata del sito — sintesi del Direttore (08–10/11/2026)

**Richiesta:** Nicola (08/11): "fare un'analisi molto dettagliata per vedere se serve ottimizzare qualcosa", con "ok per tutto".
**Fonti:** `docs/performance/2026-11-08.md` (Performance), `docs/seo/analisi/2026-11-08-analisi-completa.md` (SEO, branch `claude/inlab-analytics-seo-setup-hh2p6e`), controlli periodici dell'analista (05, 07, 09/11).

## 1. Esito in una pagina
- **Tecnica e sicurezza: a posto.** 230/230 pagine a 200, 0 link interni rotti, 0 redirect interni, 1 H1 per pagina, 0 title doppi, canonical e JSON-LD validi; 0 vulnerabilità nelle dipendenze; Firestore anonimo chiuso; guardia del build attiva (confermata dopo la #113).
- **Velocità: buona.** Mobile 91–95, desktop 96–99, CLS 0, accessibilità 100 (home desktop 96, eccezione nota). L'unico problema reale (gallerie troppo pesanti) è stato corretto con la #115: su desktop la galleria di Nunzio Putignano passa da 2274 a 545 KB; su telefono resta invariata (foto a 900 px per la nitidezza).
- **Visibilità su Google: cresce ma c'è un segnale da correggere.** Indicizzate 154/230 (67%), contro 129 il 03/11. Google ha scartato 5 pagine agenzia del lotto 5 (prima non succedeva mai); le pagine "gestione social" hanno il 79% di testo uguale; delle 48 pagine "servizio × città" solo 12 sono indicizzate. Sono i primi segni di "pagine fatte in serie".
- **Occasione più grande non sfruttata: Ferrara** (~150 impressioni/mese su "studio/agenzia di comunicazione ferrara", posizione 42–88).
- **Search Console (09/10–07/11):** 21 clic, 1.494 impressioni; ultimi giorni in ripresa (61 impressioni e 4 clic il 06/11).
- **GEO/AI:** llms.txt e llms-full.txt online, IndexNow attivo (229 URL inviate l'08/11), Bing ha ricevuto tutto il sito; GA4 registra già 2 sessioni da chatgpt.com.

## 2. Cosa è già stato fatto grazie all'analisi
- Performance: gallerie con `srcset` + link "Vai al contenuto" e `<main>` (#115, online).
- Protezione del build e IndexNow (#113, online); articoli e pagine nuove (#108–#112, #114, online).

## 3. Richieste per Sito Inlab, in ordine (filtro tecnico: nessun URL cambiato, nessun redirect nuovo, build/sitemap/canonical verificati, home invariata)
1. **R2 (alta, reversibile):** 36 pagine servizio×città mai lette → `noindex, follow` e fuori dalla sitemap (le 12 indicizzate restano). Coerenza richiesta: toglierle anche da `llms.txt`/`llms-full.txt` e dagli invii IndexNow.
2. **R1 (alta):** pagine gestione-social per città: portare il testo comune sotto il 50% (accorciare i blocchi generici con link a `/gestione-social`), poi la SEO scrive i campi per città nei brief del lunedì.
3. **R4 (media):** Ferrara (title, H1, description, una FAQ: testi pronti nel report SEO).
4. **R5 (media):** pagina autore di Nicola (link da articoli, `/chi-siamo` e agenzia Palagianello).
5. **R6 (media):** H1 dei casi studio Ricciardi e Paresteta, link dalle pagine agenzia.
6. **R3 (media):** blocco "Dal blog" nelle pagine dei paesi (già passata a Sito Inlab dal Blog).
7. **R7 (bassa):** `/dove-lavoriamo`, 1–2 frasi per provincia.
8. **R8 (bassa, servono dati di Nicola):** schede cliente corte (Tacco, Hermitage, Casa28, Arte e Oro, La Vela, Il Paradiso, Emmesse): "Come abbiamo lavorato" con fatti veri.
- **Da non fare:** cache blog 1 giorno (facoltativa, da concordare col Blog), JavaScript/chunk (decisione del 26/10), Review/AggregateRating nei dati strutturati (Google non li accetta se scritti dall'azienda).

## 4. Espansione dei paesi: cambio di forma (proposto dalla SEO, dentro l'"ok per tutto")
- Lotto 6: 10 paesi, **solo la pagina agenzia** (brief `docs/seo/brief/2026-11-09-lotto-6.md`); le pagine gestione social dei paesi nuovi si aprono dopo R1. Se le 5 pagine agenzia scartate del lotto 5 restano fuori per 2 settimane, la SEO propone una settimana di pausa per migliorarle.
- Resta valida la decisione di Nicola dei 10 paesi a settimana; cambia solo quante pagine per paese. **Reversibile.**

## 5. Cose che servono a Nicola (non urgenti, nessuna blocca il lavoro degli agenti)
- Dati veri per le schede cliente corte (R8) e per i nuovi clienti: Russi, Ersilia (testo prudente: attività sanitaria), Autogamma, Vivi la Rotonda; foto del sito di Ricciardi.
- Decisioni ancora aperte: piano a consumo (Blaze); riga privacy sul chatbot; avviso "stai parlando con un'IA" all'apertura della chat (sotto l'"ok per tutto" l'ho chiesto a Sito Inlab il 10/11, vedi resoconto); le 11 domande di `analisi-servizi`.
- Console/accessi: scollegare `clinicaricciardilumina-alt`, punti di `SECURITY.md`, chiavi VAPID per le notifiche, Bing Webmaster Tools, `CHAT_TOKEN` e rete nell'ambiente del Blog.

## 6. Come si misura (lunedì 16/11, SEO)
Indicizzazione per gruppo, lotto 5, somiglianza dei testi gestione social dopo R1, posizione di Ferrara dopo R4, CTR di "reel-o-post", Bing e test AI.
