# Diario delle lezioni — Addetto performance

Da rileggere ogni settimana (Patto del team, 24/11/2026). Ogni lezione viene da una misura, non da un'opinione. Le più recenti sono in alto.

| Data | Lezione | Da dove viene |
|---|---|---|
| 24/11/2026 | Un'immagine caricata dalla dashboard può far crollare una pagina se in quel punto del codice manca `cld()`. Bisogna controllare sempre che gli indirizzi Cloudinary abbiano `f_auto,q_auto,w_…`. | `/casi-studio/paresteta`: da 94 a 71, PNG da 2,3 MB |
| 08/11/2026 | Con `f_auto` Cloudinary può scegliere JPEG a 900 px (207 KB) e WebP a 600 px (105 KB). La larghezza giusta conta più del formato. | Galleria delle schede cliente, 2,5 MB su desktop |
| 08/11/2026 | Senza chiave API, PageSpeed risponde 429 e non dà i dati reali (CrUX). I dati reali vanno letti in Search Console. | Analisi dettagliata |
| 26/10/2026 | "Avoid multiple page redirects" può dipendere da come si scrive l'indirizzo (senza www), non dal sito. Si misura sempre con www. | PageSpeed di Nicola |
| 26/10/2026 | Con il punteggio già alto, il titolare preferisce nessun rischio a pochi KB in meno: proporre solo interventi sicuri. | Decisione di Nicola |
| 10/10/2026 | Lighthouse controlla il contrasto anche del testo nascosto con `aria-hidden`. Il testo decorativo può restare un'eccezione nota. | Telefono finto in `MethodDevices` |
| 03/10/2026 | Gli iframe di altri siti (Instagram) non entrano nei conti di Lighthouse, ma sul telefono pesano: 2,4–4 MB. La "facciata" (iframe solo al tocco) li toglie del tutto. | Schede cliente, PR #80 |
| 03/10/2026 | La "prima animazione" che vede l'utente va cercata sul telefono vero. Su mobile il telefono 3D era nascosto, e la prima cosa che si muoveva era la parola che ruota. | Home su iPhone, PR #82 |
| 03/10/2026 | Più componenti che leggono gli stessi dati insieme fanno N richieste uguali, se la lettura in corso non viene condivisa. | Firestore, 22 → 4 richieste |
| 02/10/2026 | Il font di riserva deve avere le stesse misure del font finale, altrimenti al cambio di font la pagina si sposta (CLS). | Home, CLS da 0,15 a 0 |
| 30/09/2026 | Le animazioni infinite in JavaScript occupano la CPU e ritardano il disegno. In CSS costano quasi niente. | Home, CPU di motion da 4–7 s a 0,5 s |
| 30/09/2026 | Il valore stimato da Lighthouse e quello misurato davvero possono essere molto diversi. Vanno riportati tutti e due e distinti. | Molte prove |
