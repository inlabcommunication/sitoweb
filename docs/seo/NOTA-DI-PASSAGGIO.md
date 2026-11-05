# Nota di passaggio: responsabile SEO (aggiornata al 13/10/2026)

Serve a far ripartire una sessione SEO nuova con un contesto pulito.

## Chi sono e come lavoro
- **Ruolo:** responsabile SEO/GEO di inlab-communication.it. Scrivo a Nicola in italiano semplice.
- **Area:** solo `docs/seo/`. Il codice lo cambia la sessione **Sito Inlab**: le richieste vanno nei brief, in `docs/seo/brief/AAAA-MM-GG-*.md`, sezione "Richieste per lo sviluppo".
- **Branch:** `claude/inlab-analytics-seo-setup-hh2p6e`. Solo commit di docs; mai push su `main`.
  - **Non resettare** il branch su `origin/main` se ha commit non ancora uniti: il 10/10 si sono persi così dei brief, poi recuperati dal reflog.
- **Regole di Nicola:**
  - mai dati inventati;
  - niente chiavi nei file;
  - niente PR o merge senza permesso;
  - regole crediti del Direttore (`docs/direzione/REGOLE-CREDITI.md`): resoconti brevi, un messaggio per destinatario, niente lavoro non richiesto.

## Sessioni (messaggi con create_trigger + persistent_session_id, fire senza testo, poi delete)
| Sessione | ID |
|---|---|
| Sito Inlab (NUOVA dal 13/10) | `session_011S4HYEoovHviMzacnSR2wm` |
| Direttore Operativo | `session_01AreWGaDhEeTCs3CDmdifT7` |
| Addetto al Blog | `session_017pmD2nGS4KjecYvnyGm8iM` |
| Analisi competitor | `session_01Si9h5q6bVpPQbAn5BzeiCE` |

- Resoconto al Direttore dopo ogni lavoro, con prompt che inizia "[Resoconto da SEO giusto]".
- La vecchia sessione Sito Inlab `session_01U6sW6ykGz4nrdvKnHMQZsF` **non si usa più**.

## Strumenti e dati
- `docs/seo/strumenti/gsc.mjs`: controllo URL, rendimento per pagina o query, reinvio della sitemap.
  - Credenziali dalle variabili d'ambiente `GOOGLE_SA_KEY` e `GSC_SITE`, che ci sono già nell'ambiente.
  - Accesso a Search Console **completo** dal 10/10. "Richiedi indicizzazione" resta manuale e lo fa Nicola.
- **Routine** "SEO: lotto settimanale nuove città" (`trig_01HHci9SmKUT3nwVt5LugNdt`): lunedì 00:53 ora di Roma.

- `docs/seo/strumenti/serpapi.mjs`: Google Trends (trends, related) e risultati di Google Italia per località (serp), tramite SerpApi.
  - Legge la chiave solo da `SERPAPI_KEY`, che Nicola ha messo nell'ambiente il 05/11.
  - Piano gratuito: circa 100 ricerche al mese. Usarle con parsimonia: 3 confronti Trends e 5 SERP a settimana.
- Cartella Drive "InLab SEO dati" (id 1N-OHhDTikcKtkqnzV5unSefAFWCd0aTy): file CSV di Trends e del Keyword Planner caricati da Nicola.

## Decisioni in vigore
- **Blog (Nicola, 23/10):** almeno **8 articoli al mese**, ogni martedì e venerdì. L'Addetto al Blog scrive anche senza brief. Se l'ultimo articolo ha più di 7-10 giorni, o il ritmo è sotto 8 al mese, la SEO sollecita l'Addetto al Blog e propone gli argomenti. È un controllo fisso nella routine del lunedì.
- **Espansione territorio:** 10 paesi fissi a settimana (decisione di Nicola). Piano a quattro direzioni in `docs/seo/PIANO-ESPANSIONE-TERRITORIO.md`.
  - Ogni paese ha 2 pagine: agenzia + gestione social.
  - Testi veri e propri; clienti solo se pubblicati.
- **Pagine città con argomento proprio:** brief del 05/10. Clienti citati per paese.
- **Schede `/cliente/`:** title "{Cliente}, {Paese}: {servizio}", con il nome dell'attività per primo (dal 03/11). Il vecchio "Gestione social a Palagianello: …" faceva concorrenza alle pagine del paese. Link alle pagine del paese.
- **Home (Nicola, 03/11):** title e description con "Castellaneta" **non si toccano**.

## Metodo di lavoro (dal 03/11, richiesta di Nicola: "ottimizza anche te stesso")
Ogni lunedì, in quest'ordine:
1. **Controlli prima di scrivere.**
   - Prima di ogni messaggio, `get_session` sull'ID e controllo del titolo. Il 03/11 un resoconto è finito alla sessione Competitor.
   - Controllo che la sessione Blog non sia "failed" o ferma da più di 7 giorni.
2. **Search Console.**
   - Indicizzazione di tutte le URL in sitemap.
   - Rendimento per settimana, sempre anche **senza i picchi del blog**.
   - Pagine vecchie che scendono: per ognuna cerco la causa sul sito, cioè title doppi tra pagine nostre, mancanza di lavori, link, testo.
3. **Cosa c'è nei risultati di ricerca (SERP)** per 5 ricerche chiave della settimana.
   - Chi è sopra di noi e che cosa ha più di noi.
   - Lo strumento di ricerca web di questa sessione non è Google Italia, quindi lo uso solo come segnale. Per le ricerche locali chiedo a Nicola uno screenshot.
4. **Blog:** articoli del mese su 8, ultimo articolo, aggiornamenti, date nei dati strutturati.
5. **Lotto** della settimana, poi resoconto al Direttore e messaggio a Nicola.
- Ogni decisione nuova di Nicola va scritta qui subito.
- **`/dove-lavoriamo`:** niente nomi per i clienti senza scheda.
- **Dati ufficiali (NAP):** InLab Communication, Via Regina Margherita 26, 74011 Castellaneta (TA). Geo provvisorio 40.6333, 16.9333.
- **Nicola:** pagina autore `/autori/nicola-carpignano-social-media-manager-palagianello`.

## Lotti
- **Lotto 1** (10/10, online): Castellaneta Marina, Ferrara, Crispiano, Statte, Noci, Martina Franca.
- **Lotto 2** (12/10, consegnato dal Direttore alla nuova Sito Inlab): Grottaglie, San Giorgio Ionico, Locorotondo, Alberobello, Santeramo, Altamura, Acquaviva delle Fonti, Polignano a Mare, Montescaglioso, Bernalda/Metaponto.
- **Lotto 3:** si scende nelle colonne del piano.
  - Valle d'Itria: Cisternino, Ceglie Messapica.
  - Salento: Pulsano, Manduria.
  - Barese: Putignano, Castellana Grotte.
  - Basilicata: Pisticci, Policoro.
  - Più 2 paesi con clienti nuovi, se ci sono.

## Cose aperte (da Nicola)
- **Scheda Google:** nome "InLab Communication", link Maps completo e coordinate esatte.
- **Casi Ricciardi e Paresteta:** togliere "Metriche indicative — da confermare" dalla dashboard, dopo aver confermato i numeri.
- **Citazioni esterne:** crediti sui siti dei clienti, EA Formazione, Bing/Apple/Pagine Gialle, stampa locale.
- **Richieste di indicizzazione:** pagine dei lotti, autore, `/clienti`.
- **"Dove lavoriamo" in dashboard:** attività di Ferrara, Bologna e Roma.
