# Controllo dei peggioramenti (regressioni)

Dal 24/11/2026, su richiesta del Direttore. Paresteta era scesa da 94 a 71 e ce ne siamo accorti dopo 16 giorni.

## Regola

A ogni misura confronto ogni pagina chiave con la misura precedente e **segnalo subito al Direttore**, in un messaggio a parte, se c'è anche solo una di queste condizioni:
- punteggio Lighthouse **giù di 5 punti o più**, su mobile o su desktop;
- **LCP più alto di 1 s o più**;
- **peso della pagina più alto del 50% o più**.

Nella segnalazione indico la causa sospetta:
- `git log` tra le due date per le modifiche al codice;
- oppure, se il codice non è cambiato, un contenuto caricato dalla dashboard (immagini, testate, gallerie), che non lascia traccia in git. Il caso Paresteta era di questo tipo: un'immagine nuova in un punto del codice senza `cld()`.

Lighthouse varia da una prova all'altra. Prima di segnalare un calo ripeto la prova una volta: se il calo resta, lo segnalo.

## Valori di riferimento (mobile, Lighthouse 12, con www)

Da aggiornare a ogni misura. Il riferimento di ogni pagina è la sua ultima misura.

| Pagina | Data | Perf. mobile | LCP mobile (stimato) | Peso mobile | Perf. desktop |
|---|---|---|---|---|---|
| Home | 08/11 | 92 | 2,9 s | 454 KB | 96 |
| /clienti | 08/11 | 93 | 2,8 s | 450 KB | 99 |
| /cliente/nunzio-putignano | 08/11 | 95 | 2,4 s | 607 KB | 98 |
| /casi-studio/paresteta | **24/11** | **71** | **15,1 s** | **2.741 KB** | **82** |
| /gestione-social | 08/11 | 93 | 2,7 s | 421 KB | 99 |
| /agenzia-comunicazione-sava | 08/11 | 93 | 2,7 s | 425 KB | 99 |
| /blog | 08/11 | 91 | 2,9 s | 490 KB | 99 |
| /contatti | 08/11 | 95 | 2,5 s | 419 KB | 99 |

La riga di Paresteta resta in grassetto finché la correzione non è online.

## Frequenza

Proposta al Direttore il 24/11: misura **settimanale**, una prova mobile sulle 8 pagine qui sopra. Desktop solo se il mobile cala. In più:
- una rimisura mirata dopo ogni PR che tocca immagini, pagine o caricamento;
- per le pagine con contenuti caricati dalla dashboard (casi studio, schede cliente), un controllo leggero che tutte le immagini Cloudinary nell'HTML abbiano `f_auto`/`w_`. Basta `curl`, non serve Lighthouse.

La frequenza la decide il Direttore in base ai crediti.
