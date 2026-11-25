# Regole Firestore: statistiche più strette (Sicurezza P1(a), 24/11/2026)

Cosa cambia: solo la regola `analytics_events`. Ora l'ora dell'evento deve essere quella del server (`created_at == request.time`), `scroll_depth` deve stare tra 0 e 100 e `duration` tra 0 e 86400 secondi. Le altre collezioni non cambiano (vedi la prova qui sotto).

## Per Nicola: come pubblicare (SOLO quando il Direttore dà il via, dopo il deploy del sito)

0. **Prima di tutto, una copia di sicurezza:** nella scheda Regole seleziona tutto il testo attuale e incollalo in un file di testo sul computer (oppure controlla che la versione attuale compaia nella scheda **Cronologia**). Così, se in console ci fosse una versione diversa da quella del repository, non si perde niente. (Nota dell'Analista, 24/11.)
1. Firebase Console → Firestore Database → **Regole**.
2. Cancella tutto e incolla l'intero file `firestore.rules` del repository (versione su `main` dopo il merge). Il blocco che cambia è questo:

```
    // Statistiche: il sito può solo AGGIUNGERE eventi con forma e dimensioni controllate
    match /analytics_events/{id} {
      allow read, delete: if isAdmin();
      allow update: if false;
      allow create: if request.resource.data.keys().hasOnly([
          'session_id', 'user_agent', 'device', 'path', 'created_at', 'event_type',
          'referrer', 'scroll_depth', 'section', 'target', 'duration'])
        && request.resource.data.event_type in ['pageview', 'scroll', 'click', 'session_end']
        && shortStr(request.resource.data.session_id, 40)
        && shortStr(request.resource.data.user_agent, 200)
        && request.resource.data.device in ['mobile', 'tablet', 'desktop']
        && shortStr(request.resource.data.path, 300)
        // ora del server (serverTimestamp nel client): niente date inventate
        && request.resource.data.created_at == request.time
        && (!('referrer' in request.resource.data) || request.resource.data.referrer == null || shortStr(request.resource.data.referrer, 500))
        && (!('section' in request.resource.data) || shortStr(request.resource.data.section, 60))
        && (!('target' in request.resource.data) || shortStr(request.resource.data.target, 80))
        && (!('scroll_depth' in request.resource.data) || (request.resource.data.scroll_depth is number
             && request.resource.data.scroll_depth >= 0 && request.resource.data.scroll_depth <= 100))
        && (!('duration' in request.resource.data) || (request.resource.data.duration is number
             && request.resource.data.duration >= 0 && request.resource.data.duration <= 86400));
    }
```

3. Premi **Pubblica**.

## Per Nicola: come tornare indietro (3 righe)

1. Firebase Console → Firestore Database → Regole → scheda **Cronologia** (in alto) → scegli la versione precedente → **Ripristina**.
2. In alternativa: incolla il contenuto di `docs/sviluppo/firestore-rules-ripristino-2026-11-24.rules` e premi Pubblica.
3. Ha effetto in circa un minuto; il sito non va rifatto.

## Stato e verifiche

- **24/11 ore 00:44:** client in produzione (#139). Verificato online alle 12:35: gli eventi delle statistiche si salvano (risposta 200) con l'ora del server (`setToServerValue: REQUEST_TIME`), con le regole ancora vecchie.
- **Regole:** da pubblicare con Nicola presente, quando il Direttore dà il via.
- **Dopo la pubblicazione** (Sito Inlab e Analista): una visita normale con consenso deve salvare l'evento (200); un POST con `created_at` nel 2000 deve dare 403 (non scrive niente); la pagina Statistiche della dashboard e il modulo contatti devono funzionare.
- **Resta aperto (P1, volume):** queste regole tolgono le date false e i numeri assurdi, ma **non limitano quante scritture** può fare qualcuno. Per questo serve la scelta di Nicola: contatore ibrido (b) oppure statistiche interne spente (`create: false`).

## Perché l'ordine conta

Le versioni vecchie del sito mandano l'ora del browser: con le regole nuove quegli eventi vengono rifiutati (in silenzio, il sito non si rompe; si perde solo l'evento). Per questo prima va online il sito nuovo, poi si pubblicano le regole.

## Prova con l'emulatore Firestore (stesse prove, regole prima e dopo)

Script: `docs/sviluppo/test-regole-firestore.mjs` (emulatore Firestore e `@firebase/rules-unit-testing`, fuori dal progetto).

| Prova | Prima | Dopo |
|---|---|---|
| site_content read anon | ALLOW | ALLOW |
| site_content write anon | DENY | DENY |
| site_content write user | DENY | DENY |
| site_content write admin | ALLOW | ALLOW |
| app/settings read anon | DENY | DENY |
| app/settings read admin | ALLOW | ALLOW |
| app/settings write admin | ALLOW | ALLOW |
| admins read self | ALLOW | ALLOW |
| admins read other | DENY | DENY |
| admins write admin | DENY | DENY |
| blog read pub anon | ALLOW | ALLOW |
| blog read draft anon | DENY | DENY |
| blog read draft admin | ALLOW | ALLOW |
| blog create admin | ALLOW | ALLOW |
| blog create anon | DENY | DENY |
| blog bad slug admin | DENY | DENY |
| blog delete admin | ALLOW | ALLOW |
| leads read anon | DENY | DENY |
| leads read admin | ALLOW | ALLOW |
| leads create anon | DENY | DENY |
| leads create admin | DENY | DENY |
| leads update admin | ALLOW | ALLOW |
| chats read anon | DENY | DENY |
| usage read admin | DENY | DENY |
| ratelimits write anon | DENY | DENY |
| analytics read anon | DENY | DENY |
| analytics read admin | ALLOW | ALLOW |
| analytics update anon | DENY | DENY |
| analytics delete admin | ALLOW | ALLOW |
| EV pageview serverTimestamp | ALLOW | ALLOW |
| EV scroll 55 serverTimestamp | ALLOW | ALLOW |
| EV session_end 120s | ALLOW | ALLOW |
| EV session_end 86400s | ALLOW | ALLOW |
| EV click | ALLOW | ALLOW |
| EV created_at 2000 (date client) | ALLOW | DENY | **cambia**
| EV created_at now (date client) | ALLOW | DENY | **cambia**
| EV scroll 101 | ALLOW | DENY | **cambia**
| EV scroll -1 | ALLOW | DENY | **cambia**
| EV duration 1e9 | ALLOW | DENY | **cambia**
| EV duration -5 | ALLOW | DENY | **cambia**
| EV extra field | DENY | DENY |

Risultato: cambiano solo i 6 casi di `analytics_events` con dati falsati (data del browser, valori fuori scala). Tutte le altre prove danno lo stesso risultato: lead, chat, contenuti del sito, blog, admin, contatori.
