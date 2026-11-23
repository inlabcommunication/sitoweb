# Presentazione Paresteta come caso studio + download con dati (richiesta di Nicola, 23/11)

Richiesta di Nicola: la presentazione di Paresteta ("Piano Strategico di Comunicazione per acquisizione negozi", Inlab Communication, marzo 2026, 11 slide) deve comparire nel caso studio Paresteta; si può anche scaricare, ma chi clicca "Scarica" deve lasciare i dati.

## Contenuto (11 slide, immagini in questa cartella: slide-01.jpg … slide-11.jpg, 1600 px, 46-191 KB)
1 Titolo · 2 Indice · 3 Obiettivo del progetto (evento di lancio, curiosità/coinvolgimento/esperienza) · 4 Concept creativo pre-evento «Non guardare» (vetrina oscurata con spioncino) · 5 QR code «prova a vincere» · 6 Format street social («La borsa dei premi», interviste beauty) · 7 Vantaggi dei format (offline/online) · 8 Contenuti organici, collaborazioni social, ADV · 9 Contenuti grafici da sviluppare · 10 Giorno dell'evento (mattina professionisti, pomeriggio pubblico) · 11 Grazie.
Il PDF originale (9,4 MB) NON è nel repository: lo ha Nicola.

## Come mostrarla
- Il documento è un PIANO (marzo 2026), non un resoconto di risultati: nel caso studio va presentato come «il piano strategico presentato a Paresteta», senza dire che i risultati dell'evento sono stati ottenuti. Nessun numero di risultato.
- Le slide 4 e 5 hanno immagini di concept (mockup con persone, vetrina, telefono): didascalia «visual di concept del piano».
- Slide 5 e 4: date non coerenti nel PDF (6/04 e 16 aprile); slide 9: invito di esempio con data ottobre 2024 e Milano (mockup). Sono da chiarire con Nicola prima della pubblicazione.

## Cosa serve (nuovo blocco «Presentazione» nei casi studio)
1. Visualizzazione: le slide come galleria/slider a scorrimento (immagini ottimizzate, lazy loading, testo alternativo da 8-15 parole per slide), dentro il caso Paresteta. Nessun iframe.
2. Pulsante «Scarica la presentazione» → modulo con i dati: nome, email (obbligatori), azienda/attività (facoltativo), accettazione dell'informativa privacy (obbligatoria); iscrizione newsletter come casella SEPARATA, facoltativa e non preselezionata (il download non può dipendere dal consenso marketing).
3. Il lead si salva come gli altri lead (fonte «download-presentazione-paresteta», consenso e provenienza solo con consenso cookie statistici) con le stesse protezioni di /api/lead: Origin, limiti per IP, tetto giornaliero, token anti-spam, nessun dato personale nei log.
4. Consegna del file DOPO l'invio: il file NON va in public/ (sarebbe scaricabile senza dati). Vincoli: il PDF pesa 9,4 MB e una funzione Vercel ha un limite di ~4,5 MB di risposta; soluzione da proporre: link firmato a tempo (es. Cloudinary con asset autenticato) generato dopo l'invio, oppure PDF compresso sotto il limite. L'email non è attiva (nessun fornitore): la consegna avviene a schermo (link a scadenza), non per email.
5. Informativa privacy: aggiungere la finalità «download di documenti» (nome, email, azienda facoltativa; usati per inviarti il documento e per ricontattarti; conservazione come le richieste). Il testo lo propone Sito Inlab/analista, il via passa dal Direttore.
6. Compatibile con dashboard: il blocco si compila da «Non solo contenuti» (titolo, testo, immagini, file, testo del pulsante); caso in bozza finché Nicola non ha il consenso di Paresteta e non spunta «Pubblica». Home invariata.

## Prima di pubblicare (decide Nicola)
- Consenso di Paresteta a mostrare e a far scaricare il piano (contiene la loro strategia, il nome di altre pagine e numeri: ViviLaterza e ViviGinosa 12.000 + 2.500 follower, e i marchi Astra/Make Up For Ever).
- Date nel documento da correggere o spiegare (6/04, 16 aprile, ottobre 2024).
- Quali dati chiedere (default: nome, email, azienda facoltativa).
