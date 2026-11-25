# Lezioni tecniche — Sito Inlab

Diario del Patto del team (24/11/2026). Si rilegge ogni settimana, prima di iniziare un lavoro nuovo.
Ogni voce: cosa è successo, la regola che ne viene.

## Misurare
- **Accorciare un elemento sopra la piega può peggiorare il LCP.** Accorciando l'hero, la sua immagine è diventata l'elemento LCP (Lighthouse mobile 93 → 83). Regola: Lighthouse prima/dopo su ogni modifica visibile sopra la piega.
- **Desktop e mobile si misurano separati.** La #137 doveva cambiare solo il mobile: si controllano le altezze a 360/390/412 e a 1280 px, e il desktop deve restare identico al pixel.
- **Le build locali senza Firestore non sono confrontabili.** Si builda con `VITE_FIREBASE_PROJECT_ID=sitoweb-b4a12`. Nel confronto delle pagine si tolgono gli `<script>`, perché l'ordine delle chiavi del JSON incorporato cambia tra una build e l'altra.
- **I dati strutturati vanno confrontati col testo visibile.** Ogni FAQPage si verifica in `dist/` con uno script: domande e risposte devono coincidere parola per parola con la pagina.

## Git e build
- **`src/data/blogCityLinks.generated.ts` viene rigenerato dalla build.** Va sempre ripristinato con `git checkout` e non va mai committato.
- **Un commit per punto**, così si può togliere un singolo punto (reset o revert) senza toccare gli altri. È servito sulla #137 (reels e desktop).
- **Un ok dell'Analista vale solo per lo SHA su cui è stato dato.** Prima del merge si confronta lo SHA dell'ok con l'head della PR.

## Prodotto
- **Niente cambi fuori richiesta.** Anche un miglioramento "ovvio" (reels, galleria, desktop) se non è stato chiesto si toglie.
- **I contenuti già pubblicati non si accendono da soli.** Un nuovo blocco su contenuti esistenti nasce spento (`published: false`) e lo accende Nicola dalla dashboard.
- **I popup su mobile vengono bloccati.** Un download non si apre con `window.open` dopo una chiamata asincrona: si mostra sempre un link da toccare.
- **I contatori pubblici sono una superficie di abuso.** Ogni scrittura su Firestore che chiunque può provocare va filtrata (solo i casi utili) e limitata (tetto per istanza o per giorno), perché il piano Spark ha 20k scritture al giorno.

## Sicurezza
- Le regole Firestore le pubblica Nicola a mano: prima va in produzione il client compatibile, poi si pubblicano le regole. Se l'ordine è invertito, le scritture si rompono.

## API (25/11)
- **Su Vercel `req.body` è letto la prima volta che lo si usa, e lancia un'eccezione se il JSON è malformato.** Va letto una volta sola dentro un `try` (`jsonBody()` in `api/_lib/security.ts`), altrimenti un JSON rotto diventa un 500.
- **I limiti per IP vanno pensati anche per IPv6:** una connessione ha un intero /64. La chiave del limite è `ipKey()`.
- **Le prove dei limiti si fanno sull'emulatore Firestore**, chiamando l'handler con richieste finte: si prova il caso «oltre il tetto» senza aspettare e senza toccare la produzione. Per simulare «database giù» basta una chiave di servizio non valida: `getAdminDb()` fallisce subito, invece di restare appeso.
- **Mai far dipendere la sicurezza da un dato scritto dal browser:** per esempio le battute «assistant» della chat, o un id di sessione prevedibile.
