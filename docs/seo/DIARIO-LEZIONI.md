# Diario delle lezioni: Addetto SEO

Lo rileggo ogni lunedì, prima dell'analisi settimanale. Ogni voce indica: cosa è successo, la lezione e la regola che ne è nata.

## Errori e come li evito
- **Ottobre: messaggio mandato alla sessione sbagliata** (il Competitor invece del Direttore). Ora faccio sempre `get_session` e verifico il titolo prima di scrivere.
- **Ottobre: chiave dell'account di servizio stampata in un log di errore.** Ora non stampo mai variabili d'ambiente né risposte grezze di autenticazione. Le chiavi si usano solo come `$NOME`.
- **Novembre: dichiarato un problema sulla data `datePublished` senza averlo verificato.** Era sbagliato e l'ho ritirato. Ora prima di segnalare un problema controllo il codice e l'HTML in produzione.
- **12-23/11: ho scritto io "servono alcuni mesi" nelle FAQ di gestione social,** contro il messaggio commerciale di Nicola. Prima di proporre un testo commerciale controllo le decisioni di Nicola in MANDATO-MASTER.

## Scoperte dai dati
- **Prova di Google sugli articoli nuovi (26-30/10):** `reel-o-post` e `tracking-pixel` sono andati in prima pagina per pochi giorni e poi sono scesi. Chi risponde subito alla domanda e tiene il lettore resta in alto (linee guida §12).
- **Prima del 24/10 il blog aveva 0 impressioni.** Dal 24/10 al 20/11 i primi 5 articoli ne hanno fatte 912. Il blog porta visibilità, ma per ora quasi nessun clic: 5 clic sono di `tracking-pixel`.
- **Mappe:** sulle ricerche locali (agenzia + paese) Google Maps prende la maggior parte dei clic. Per i lead conta la Scheda Google, non solo il sito.
- **Trends (24/11):** "geo seo" in Italia è intermittente e "seo chatgpt" è quasi a 0. Per la GEO non serve una pagina dedicata: basta una sezione su una pagina che vende.
- **IndexNow e Bing:** Bing ha letto la sitemap da solo (229 pagine). Le richieste di indicizzazione su Google restano utili per le pagine nuove non scoperte.

## Regole nate dalle lezioni
1. Ogni richiesta a Sito Inlab ha misura prima, obiettivo e data di ricontrollo (2-4 settimane), poi l'esito scritto: funzionato, no o da riprovare.
2. Ogni analisi del lunedì ha 1-2 grafici e la sezione "Per il Blog: cosa funziona".
3. Ogni analisi finisce con tre righe: cosa ho imparato, cosa cambio, cosa insegno a un collega.
4. Le novità che porta il Blog e i dati del Competitor entrano nei brief: li cito come fonte.

## Rilettura settimanale
| Data | Riletto | Lezione nuova della settimana |
|---|---|---|
| 24/11/2026 | sì (prima stesura) | il messaggio commerciale di Nicola (tempi dei risultati) viene prima delle formule di prudenza |
