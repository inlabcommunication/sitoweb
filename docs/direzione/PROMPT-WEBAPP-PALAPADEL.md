# Prompt per l'agente che ha accesso alla web app del campionato (Pala Padel)

Obiettivo: mostrare la web app del campionato nel sito di InLab Communication, nel caso studio "Non solo contenuti" e nella scheda Pala Padel. Serve un pacchetto di materiali e informazioni; non modificare nulla, solo raccogliere e consegnare.

---
Ciao. Devo mostrare sul sito inlab-communication.it la web app del campionato di padel che abbiamo creato (Pala Padel). Hai accesso completo all'app: preparami un PACCHETTO, in italiano, con quanto segue. Non inventare niente: se un dato non c'è o non è pubblico, scrivi "non disponibile". Non scrivere mai password, chiavi, token o dati personali di giocatori/clienti (nomi e cognomi di privati, telefoni, email): nelle schermate usa dati di esempio o sfoca.

1. IDENTITÀ E SCOPO
- Nome ufficiale dell'app e del campionato; indirizzo pubblico (URL) a cui si accede, e se è libero o con login.
- In 2-3 frasi: cosa fa, per chi (organizzatori, giocatori, circolo), che problema risolve.
- Chi è il cliente (Pala Padel: città, circolo) e in quale periodo è stata realizzata/avviata.

2. FUNZIONI (elenco da 6 a 10 punti, una riga ciascuno)
Es.: iscrizione squadre, calendario partite, risultati e classifiche in tempo reale, prenotazione campi, tabelloni, notifiche, area organizzatore, ecc. Indica quali sono pubbliche e quali riservate.

3. NUMERI VERI (solo quelli reali e dimostrabili)
Squadre/giocatori iscritti, partite gestite, campionati/edizioni, giornate, utenti attivi, tempo risparmiato, ecc. Per ogni numero: valore, data di riferimento, da dove lo ricavi.

4. SCREENSHOT E MATERIALE VISIVO
- 6-10 schermate ad alta qualità: home, classifica, calendario, scheda partita, area organizzatore, versione da telefono (mobile) e da computer. Formato PNG o JPG, larghezza almeno 1600 px per il desktop e 1080 px per il mobile, senza dati personali visibili.
- 1 video breve (15-40 secondi, MP4 verticale e/o orizzontale) con la navigazione dell'app.
- Logo del campionato/dell'app e del circolo (PNG con sfondo trasparente o SVG), colori e font usati.
- Per ogni file: nome descrittivo con trattini (es. classifica-campionato-mobile.png) e una descrizione di 8-15 parole per il testo alternativo.
- Se possibile, un mockup su telefono/computer (facoltativo).

5. TECNICA (per capire come inserirla in sicurezza)
- Si può incorporare in una pagina del sito (iframe) o conviene un link/bottone? L'app imposta intestazioni che vietano l'incorporamento (X-Frame-Options / frame-ancestors)? Quale dominio dovrebbe essere ammesso?
- Esiste una modalità demo pubblica con dati di esempio, senza login? URL.
- Tecnologie principali (una riga), hosting, e se funziona anche da telefono come app installabile (PWA).
- Eventuali limiti o aspetti di privacy/GDPR da dichiarare.

6. STORIA DEL PROGETTO (per il caso studio)
- Il problema di partenza del cliente, cosa abbiamo proposto, le fasi (da 3 a 5, con data indicativa), il risultato.
- Una frase di feedback del cliente, solo se già detta e autorizzata alla pubblicazione (con nome e ruolo). Altrimenti "non disponibile".

7. AUTORIZZAZIONI
- Il cliente ha dato il consenso a mostrare il nome, il logo e le schermate dell'app sul nostro sito? Chi e quando.
- Cosa NON va mostrato.

8. ALTRO
- Link già pubblici (sito, Instagram, articoli, locandine del campionato).
- Qualsiasi dettaglio utile a un testo per Google: parole che usano i giocatori ("campionato padel", "classifica", "prenotazione campo"...), città e zona.

Formato di consegna: un unico testo diviso nei punti 1-8, più la cartella dei file (o i link) con l'elenco e i nomi. Metti in cima le cose mancanti o dubbie.
---

## Cosa farà il sito con questo materiale (per Nicola)
- Caso studio in "Non solo contenuti": pagina a blocchi (testo, sito/web app con immagine e pagine, numeri, galleria, reel, citazione).
- Scheda Pala Padel nelle pagine servizio (sito web/web app) e nella sezione clienti, con SEO propria.
- Un incorporamento (iframe) richiede un'autorizzazione tecnica in `vercel.json` e un controllo: si decide dopo il punto 5.
