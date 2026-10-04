# Guida: copertine dei reel nelle pagine cliente

Per Nicola. L'importazione automatica è online (PR #85, 04/10). Il sito prende la copertina di ogni reel dalla pagina pubblica di Instagram **una sola volta**, la salva su Cloudinary e la mostra come immagine nostra, leggera. I visitatori non contattano mai Instagram prima del tocco.

## Come importare le copertine dei reel già inseriti
1. Vai in dashboard (`/admin`) → **Progetti raccontati** → apri un cliente → sezione **Reel**.
2. Premi **"Importa copertine mancanti"**. Il sito le prende una alla volta (circa 3 secondi l'una) e sotto il pulsante scrive quante ne ha importate.
3. Controlla le copertine (anteprima sotto il campo Copertina). Se una non ti piace, caricane un'altra con 📁: la tua non viene mai sostituita in automatico.
4. Premi **SALVA**. Senza Salva le copertine non vanno online.
5. Ripeti per ogni cliente.

## Per i reel nuovi
Quando incolli il **codice di incorporamento** (o il link) del reel, la copertina arriva da sola in pochi secondi ("Sto importando la copertina…" → "Copertina importata"). Poi **Salva**.

## Se vedi un messaggio rosso
- **"Copertina non disponibile":** il post è privato o rimosso, oppure Instagram ha cambiato la pagina. Carica la copertina a mano (screenshot del reel, verticale 9:16, con 📁).
- **"Instagram ha bloccato la richiesta":** riprova più tardi (anche il giorno dopo); se continua, carica a mano e avvisa il Direttore.
- **"Troppe importazioni":** massimo 30 all'ora, riprova tra un'ora.

In ogni caso il sito **non mostra errori ai visitatori**: dove manca la copertina resta lo sfondo con il pulsante play.

## Cosa tenere presente
- È una lettura automatica di una pagina pubblica di Instagram: i termini di Instagram la vietano senza permesso. Rischio pratico basso (una richiesta per reel, solo dalla dashboard), ma può smettere di funzionare quando Instagram cambia o blocca i server. In quel caso la strada è la copertina a mano.
- Si può spegnere senza modificare il codice: variabile `REEL_COVER_IMPORT=off` su Vercel, poi Redeploy.
- Non importare più di 30 reel in un'ora.

## Alternativa manuale (sempre valida)
Uno screenshot per reel (verticale 9:16, circa 1080×1920, un fotogramma significativo senza testi importanti ai bordi) caricato con 📁 nel campo **Copertina (facoltativa)**; il sito la ridimensiona e la comprime da solo.
