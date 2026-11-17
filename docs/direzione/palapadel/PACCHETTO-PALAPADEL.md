# Pacchetto Pala Padel per inlab-communication.it

Preparato il 12/11/2026. Le fonti sono il codice dell'app (repository `inlabcommunication/palapadel`, ramo `main`) e quello che il titolare mi ha mostrato in questa sessione. Non ho accesso ai dati reali (database Firebase), al pannello Vercel né al sito pubblicato: dove serviva un dato di quel tipo ho scritto "non disponibile".

---

## Da sapere prima: cose mancanti o dubbie

1. **Numeri reali non disponibili.** Squadre, partite, edizioni e utenti attivi stanno nel database di produzione, che io non vedo. Li può leggere il titolare nell'app (vedi punto 3).
2. **Cliente: nome legale e città non disponibili.** Nel codice compare solo il marchio "PalaPadel Club". Nessuna città, indirizzo o ragione sociale.
3. **Data di realizzazione incerta.** Il codice è stato caricato su GitHub il 03/11/2026 in un unico invio, quindi la cronologia precedente non c'è. Gli unici indizi sono le date delle variabili su Vercel (screenshot del titolare): progetto attivo almeno dal 23/07/2026.
4. **Consenso del cliente non disponibile** (punto 7). Senza consenso non si pubblicano né nome né logo del circolo.
5. **Citazione del cliente non disponibile.**
6. **Logo del circolo in SVG non disponibile.** Ci sono solo i PNG usati dall'app.
7. **Attenzione a una differenza con il sito Inlab.** Nel codice del sito, `src/data/serviceExamples.ts` riga 24 e un testo di esempio in `src/admin/CollectionsEditor.tsx` riga 339, Pala Padel è descritta con la "prenotazione campi". **L'app non ha la prenotazione dei campi** e nemmeno le iscrizioni online. Non va scritto.
8. **Problema grafico su desktop nella parte pubblica.** Da computer le pagine pubbliche restano una colonna stretta, larga quanto un telefono, al centro dello schermo. In Home, con più news, la prima viene schiacciata in una colonna di circa 110 px e il titolo va a capo parola per parola. Per questo **le schermate desktop sono solo dell'area organizzatore**; le pagine pubbliche sono in formato telefono. Va corretto prima di mostrare l'app pubblica da desktop (o in un iframe largo).
9. **Le schermate non sono dell'app online.** Le ho fatte su una copia locale dell'app con un database di prova e **dati inventati**: squadre "Smash Club", "Por Tres"…, giocatori "Giocatore 1, 2…". Le immagini delle news sono grafiche di esempio. Grafica e funzioni sono quelle reali.
10. **Nome di una persona nelle schermate.** Nel piè di pagina dell'app compare "Web app creata da InLab – Nicola Carpignano", visibile nella schermata dell'Albo d'oro, nella dashboard e nel video. È il credito Inlab presente nell'app reale: va bene se Nicola è d'accordo, altrimenti va sfocato.
11. **Sito del circolo.** "palapadel.it" compare scritto nell'immagine della giornata che l'app genera per la condivisione. Non ho potuto verificare se il sito esiste: non disponibile.
12. **Correzione Analytics in attesa.** Il riepilogo Analytics sommava i dati di più di 30 giorni. La correzione è nella PR [inlabcommunication/palapadel#12](https://github.com/inlabcommunication/palapadel/pull/12), non ancora online. Prima di leggere i numeri del punto 3 conviene metterla online.

---

## 1. Identità e scopo

| Voce | Dato |
|---|---|
| Nome dell'app | **PalaPadel**: nome nel manifest, titolo della pagina "PalaPadel — Campionati e classifiche" |
| Nome del campionato | Non c'è un nome unico. L'app gestisce più campionati per serie e stagione; nei dati reali visti c'è "Serie C 2026/2027", le altre serie sono non disponibili |
| URL pubblico | `https://palapadel-c3tj-theta.vercel.app` (indirizzo Vercel, non un dominio proprio) |
| Accesso | **Libero, senza login** per Home, campionati, classifiche, calendario, albo d'oro, news e notifiche. **Con login** solo l'area organizzatore |
| Cliente | "PalaPadel Club" (marchio nel logo). Ragione sociale e città: non disponibili |
| Realizzata da | InLab Communication (credito nel piè di pagina dell'app) |
| Quando | Online su Vercel almeno dal 23/07/2026 (data delle variabili del progetto). Ultimi aggiornamenti: 10-12/11/2026. Data di inizio lavori: non disponibile |

**Cosa fa, in 3 frasi.** PalaPadel è la web app dei campionati del circolo: risultati, classifiche aggiornate in automatico, calendario delle giornate, schede delle squadre, albo d'oro e news, consultabili da chiunque dal telefono. È pensata per i giocatori e il pubblico, che seguono il campionato senza chiedere in segreteria o aspettare il messaggio su WhatsApp, e per gli organizzatori, che inseriscono un risultato set per set e trovano la classifica già ricalcolata. Risolve il problema di tenere classifiche e risultati aggiornati a mano, con il rischio di errori, e di comunicarli a tutti.

---

## 2. Funzioni

| # | Funzione | Accesso |
|---|---|---|
| 1 | **Classifiche per serie e stagione** (Serie A, B, C…), aggiornate in automatico, con partite giocate (PG), differenza game (DG) e spareggi: partite giocate, scontri diretti, differenza game | Pubblica |
| 2 | **Calendario per giornata** con data, ora, campo e risultato set per set (es. 6-4 3-6 6-2) | Pubblica |
| 3 | **Scheda squadra** con foto di gruppo, rosa, statistiche della stagione (giocate, vinte, perse) e titoli vinti | Pubblica |
| 4 | **Campionato femminile individuale** a tappe, con classifica delle giocatrici | Pubblica |
| 5 | **Tabellone finale** a eliminazione diretta, se attivato per l'edizione | Pubblica |
| 6 | **Albo d'oro** con i vincitori di tutte le stagioni, filtrabile per serie | Pubblica |
| 7 | **News in Home** (ultime 3, le altre nella pagina News) e **notifiche push** su risultati e classifiche, su richiesta dell'utente | Lettura pubblica; scrittura e invio riservati |
| 8 | **App installabile** sul telefono (icona sulla schermata Home, Android e iPhone) | Pubblica |
| 9 | **Area organizzatore**: inserimento risultati set per set, correzioni, rinvii, calendario, import di calendario e classifiche da Excel o testo, condivisione di classifica e giornata come immagine | Riservata (login) |
| 10 | **Ruoli e controllo**: Super Admin, Admin, Gestore risultati; registro delle operazioni con annullamento, backup, analytics interni anonimi | Riservata (login) |

**Non presenti**: iscrizioni online, prenotazione campi, pagamenti.

---

## 3. Numeri veri

| Dato | Valore | Data | Fonte |
|---|---|---|---|
| Squadre | non disponibile | — | Da contare in app: Area organizzatore → Campionati e squadre → Squadre |
| Giocatori | non disponibile | — | Rose delle squadre (stesso punto). Sono dati personali: pubblicare solo il numero |
| Partite gestite | non disponibile | — | Area organizzatore → Giornate e partite, edizione per edizione |
| Edizioni / campionati | non disponibile (nei dati reali visti c'è almeno "Serie C 2026/2027") | 12/11/2026 | Area organizzatore → Campionati e squadre |
| Utenti attivi | non disponibile | — | Area organizzatore → Analytics → "Dispositivi attivi (30 gg)". È una stima per eccesso: lo stesso telefono può contare più volte |
| Installazioni | Il titolare ha visto **42**, ma quel numero **non è affidabile** (somma di più di 30 giorni, vedi il dubbio 12) | 12/11/2026 | Analytics → "Installazioni". Non conta gli iPhone |
| Test automatici dell'app | **157** test, tutti superati | 12/11/2026 | Repository `palapadel`, `npm run test:unit` |

Consiglio: dopo aver messo online la PR #12, leggere i numeri in Analytics nello stesso giorno e indicarli con data e fonte ("dati app al GG/MM/AAAA").

---

## 4. Materiale visivo

Cartella `pacchetto-palapadel/`. Tutte le schermate usano dati inventati: nessun dato personale.

### Screenshot

| File | Formato | Descrizione |
|---|---|---|
| `screenshot/palapadel-mobile-home-news.png` | 1170×2532 | Home dell'app da telefono con sezione PalaPadel News e menu in basso. |
| `screenshot/palapadel-mobile-classifica-serie-a.png` | 1170×2532 | Classifica Serie A con partite giocate, differenza game e punti per squadra. |
| `screenshot/palapadel-mobile-calendario-risultati-set.png` | 1170×2532 | Calendario della quarta giornata con orari e risultati set per set. |
| `screenshot/palapadel-mobile-scheda-squadra.png` | 1170×2532 | Scheda squadra con rosa, statistiche di stagione e titoli vinti. |
| `screenshot/palapadel-mobile-albo-oro.png` | 1170×2532 | Albo d'oro con i vincitori delle stagioni filtrabili per serie. |
| `screenshot/palapadel-desktop-dashboard-organizzatore.png` | 1920×1200 | Dashboard dell'area organizzatore da computer con anteprima della Home pubblica. |
| `screenshot/palapadel-desktop-giornata-risultati.png` | 1920×1200 | Gestione di una giornata completata con risultati e set di ogni partita. |
| `screenshot/palapadel-desktop-inserimento-risultato-set.png` | 1920×1200 | Inserimento di un risultato set per set con calcolo automatico del vincitore. |
| `screenshot/palapadel-desktop-gestione-campionati-classifica.png` | 1920×1200 | Gestione campionati: ordine delle serie, visibilità delle edizioni e classifica. |

Nota: nelle schermate desktop compare un pulsante "Notifica" fluttuante in basso al centro. Fa parte dell'app.

### Video

| File | Formato | Descrizione |
|---|---|---|
| `video/palapadel-video-navigazione-mobile.mp4` | 1080×2338, 22 s, MP4 H.264, senza audio, 2,5 MB | Navigazione da telefono: Home, classifica, calendario, scheda squadra, albo d'oro e news. |

Nota: verso il 6° secondo, aprendo Campionati, compare per meno di mezzo secondo la scritta "Nessuna squadra iscritta" mentre i dati si caricano. È il comportamento reale dell'app e si può correggere. Se dà fastidio si taglia quel frammento.

### Loghi

| File | Formato | Descrizione |
|---|---|---|
| `loghi/palapadel-club-logo-trasparente-per-sfondi-scuri.png` | PNG trasparente 1016×332, tratto crema | Logo "PalaPadel Club" color crema su fondo trasparente, per sfondi scuri. |
| `loghi/palapadel-club-logo-su-sfondo-crema.png` | PNG 718×251, non trasparente | Logo "PalaPadel Club" su fondo crema, usato nell'area organizzatore dell'app. |
| `loghi/palapadel-icona-app-512.png` | PNG 512×512, non trasparente | Icona quadrata dell'app installabile su fondo verde scuro. |

Logo in SVG: non disponibile. Logo ufficiale del circolo, se diverso da quello dell'app: non disponibile.

### Colori e font (da `tailwind.config.js` e `src/index.css`)

| Ruolo | Colore |
|---|---|
| Verde scuro (sfondo principale) | `#123008` |
| Verde medio | `#1F4A15` |
| Verde di brand | `#3B7A2A` |
| Nero delle schede | `#0A0B08` |
| Lime (accento, pulsanti) | `#BBFF5E` |
| Crema (testo) | `#FBF3DE` |

Font: **Anton** per i titoli e **Inter** per i testi, entrambi Google Fonts.

---

## 5. Tecnica

**Incorporamento (iframe) o link?**
- Nel codice l'app **non vieta l'incorporamento**: `vercel.json` e `index.html` non impostano né `X-Frame-Options` né `Content-Security-Policy`/`frame-ancestors`. Le intestazioni del sito online non le ho potute verificare. Per controllare: `curl -sI https://palapadel-c3tj-theta.vercel.app`.
- Il **sito Inlab** oggi non permette l'iframe. Nel `vercel.json` del sito, la riga `frame-src` ammette solo il sito stesso, Instagram, `*.firebaseapp.com`, YouTube e Vimeo. Servirebbe aggiungere `https://palapadel-c3tj-theta.vercel.app`: è una richiesta per Sito Inlab.
- **Consiglio: link, più screenshot e video.** Dentro un iframe l'app perde alcune funzioni. Non si può installare e non può chiedere il permesso per le notifiche. Su Safari la memoria del browser è separata, quindi le statistiche dell'app contano come visite i passaggi dal sito Inlab. Inoltre la parte pubblica su desktop ha il problema di layout del dubbio 8. Un bottone "Apri l'app" è più semplice e sicuro.

**Demo pubblica con dati di esempio**: non disponibile. L'app pubblica mostra i dati reali del circolo; una versione demo separata non esiste.

**Tecnologie**: React 19, TypeScript, Vite, Tailwind CSS. Dati e accessi su Google Firebase (Firestore, Authentication, Storage, Cloud Messaging per le notifiche). Hosting e funzioni server su Vercel. Il server salva risultati e classifiche con operazioni atomiche e un registro delle modifiche.

**Installabile come app**: sì, è una PWA (manifest + service worker). Si installa su Android da Chrome con il pulsante "Installa"; da Samsung Internet una guida porta a Chrome. Su iPhone si usa Condividi → Aggiungi alla schermata Home, con una guida per ogni browser. Funziona da telefono e da computer.

**Privacy e GDPR**: da verificare con chi si occupa della privacy.
- **Dati personali pubblici**: nomi dei giocatori nelle rose, foto di gruppo delle squadre, nomi delle giocatrici del campionato femminile. Il titolare del trattamento (il circolo) deve avere il consenso o un'altra base, e le liberatorie per le foto.
- **Statistiche interne**: senza Google Analytics e senza cookie. L'app salva nel browser un codice casuale del dispositivo (`localStorage`) e registra pagine viste, tipo di browser (user agent) e se è aperta come app. Esclusi gli account Admin e Super Admin; i Gestori risultati vengono contati.
- **Notifiche push**: se l'utente le attiva si salva il token di Firebase Cloud Messaging con il tipo di browser.
- **Account organizzatori**: nome utente ed email su Firebase Authentication.
- **Fornitori**: Google (Firebase, Google Fonts) e Vercel, con possibili trasferimenti fuori UE. Regione del database: non disponibile. I font vengono caricati dai server Google, quindi l'IP del visitatore arriva a Google; si può evitare ospitandoli nell'app.
- **Informativa privacy nell'app: non presente.** Nel codice non c'è nessuna pagina o testo di privacy o cookie: va aggiunta.

---

## 6. Storia del progetto

- **Problema di partenza**: non disponibile come dichiarazione del cliente. Dal codice si ricava questo: classifiche e risultati di più campionati da tenere aggiornati e da comunicare ai giocatori, con correzioni, rinvii, ritiri di squadre, classifiche iniziali importate e uno storico dei vincitori.
- **Cosa abbiamo proposto**: una web app installabile, consultabile da tutti senza login, con un'area organizzatore che calcola da sola le classifiche e manda le notifiche.

**Fasi, con le sole date verificabili:**

| Fase | Data | Fonte |
|---|---|---|
| App online su Vercel con le chiavi Firebase configurate | entro il 23/07/2026 | Date delle variabili nel progetto Vercel `palapadel-c3tj` (screenshot del titolare) |
| Notifiche push configurate (chiave VAPID) | 29/07/2026 | Stessa fonte |
| Codice su GitHub | 03/11/2026 | Primo commit del repository |
| Installazione su Android da Samsung Internet tramite Chrome, aggiornamenti di sicurezza | 10/11/2026 | PR #8 |
| Risultati set per set, spareggi in classifica (partite giocate, scontri diretti, differenza game), news in Home ridotte alle ultime 3 | 11-12/11/2026 | PR #9 e #10 |

Le fasi intermedie tra luglio e novembre 2026 non sono disponibili, perché il codice è arrivato su GitHub in un unico caricamento.

- **Risultato**: app in uso per la stagione 2026/2027 (nei dati reali c'è "Serie C 2026/2027"). Numeri d'uso: vedi punto 3.
- **Frase del cliente**: non disponibile.

---

## 7. Autorizzazioni

- **Consenso del cliente** a mostrare nome, logo e schermate sul sito Inlab (chi e quando): non disponibile. Va chiesto per iscritto.
- **Da NON mostrare**:
  - nomi e cognomi reali di giocatori e giocatrici, rose e foto reali delle squadre (usare le schermate di esempio del pacchetto);
  - screenshot dell'app online senza sfocatura;
  - dati dell'area organizzatore: utenti, email, registro operazioni, analytics, impostazioni notifiche;
  - l'indirizzo del pannello organizzatore come "accesso", e qualunque credenziale;
  - la funzione "prenotazione campi", perché non esiste;
  - numeri d'uso senza data e fonte.

---

## 8. Altro

**Link già pubblici:**
- App: `https://palapadel-c3tj-theta.vercel.app`
- Instagram di InLab Communication, collegato dal piè di pagina dell'app: `https://www.instagram.com/inlab.communication/`
- Sito, Instagram e locandine del circolo: non disponibili. "palapadel.it" compare nelle immagini di condivisione ma non è verificato.

**Parole di ricerca dei giocatori, con città e zona**: non disponibili. Non ho dati di Search Console o Analytics per l'app, e la città del circolo non c'è nel codice. Le parole che l'app usa nei menu e nei titoli sono "campionati", "classifiche", "calendario", "risultati", "albo d'oro", "news". Sono termini dell'interfaccia, non dati di ricerca: da validare con l'Addetto SEO.

---

## Domande aperte (le decide il titolare)

1. La web app va solo nel caso studio "Non solo contenuti" e nella scheda Pala Padel, o anche in una pagina propria "web app" tra i servizi?
2. Il cliente sa che la mostriamo sul sito? Ha dato il consenso per nome, logo e schermate?
3. Correggo prima il layout desktop della parte pubblica (dubbio 8)? Serve se volete mostrarla da computer o in un iframe.
