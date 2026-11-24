# Diario del Direttore: cosa ho imparato

## 24/11/2026 — Il Blog faceva monitoraggio ridotto e non l'ho visto
- **Cosa è successo:** per settimane il Blog ha fatto 2–3 ricerche generiche invece del giro sulle fonti; a novembre 8 articoli di zona su 9. Io controllavo scadenze e PR.
- **Lezione:** i report che dicono «nessuna novità» sono un segnale da verificare, non un esito. Il controllo del Direttore è sulla **sostanza**: quante ricerche, su quali gruppi, con quali link.
- **Regola:** ogni report con prova delle fonti; a campione ogni settimana confronto report ↔ lavoro reale.

## 24/11/2026 — Misurare prima di decidere
- Nicola: le migliorie si fanno su ciò che si vede nei dati (Search Console, Analytics), non su ciò che si pensa.
- **Regola:** ogni richiesta ha una misura «prima» e un obiettivo «dopo»; rimisura a 2–4 settimane e scrivo l'esito.

## 24/11/2026 — Verificare l'approvato prima di dire sì
- La PR #137 era approvata dall'analista con ancora regole desktop che Nicola non voleva. L'ho colto leggendo il diff descritto, non fidandomi del «OK».
- **Regola:** prima di dare il via, confronto l'OK con l'ultima richiesta di Nicola (cosa deve restare invariato).

## 24/11/2026 — Leggere senza toccare
- Ho provato un comando che avrebbe sovrascritto i file locali. Per leggere il codice uso solo `git show`/`git grep`.

## 24/11/2026 — Lezioni dell'Analista (registrate dal Direttore)
1. **OK incompleto sulla #137.** L'analista aveva verificato la tecnica ma non il diff contro la richiesta («solo da telefono», poi «desktop identico»). Nuovo controllo: prima di ogni OK, una riga «richiesta di Nicola → cosa deve cambiare / cosa NON deve cambiare», poi il diff contro quella riga; per le richieste «solo telefono»: nessuna regola fuori da @media e misura desktop prima/dopo identica.
2. **Scritture anonime: il NUMERO, non solo lo schema.** Il rischio P1 (quota Spark) non era stato colto nei controlli di routine dal 01/10: si verificavano i campi, non quante volte al giorno uno script può scrivere. Nuovo controllo: per ogni percorso anonimo (regole Firestore e /api) «quante volte al giorno? cosa succede alla quota?»; senza limite globale = almeno MEDIO. Un revisore indipendente trova ciò che chi ha fatto i controlli non vede più: da usare negli audit settimanali.
3. **Configurazioni esterne al codice** mai controllate (main non protetto). Controllo settimanale: protezione di main, collaboratori, workflow, SPF/DMARC/CAA, preset Cloudinary firmato, piano e quota Firebase.
4. **Falsi allarmi:** una regex dei telefoni ha preso gli ID Cloudinary negli URL. Verificare il contesto prima di segnalare dati personali.
5. **GA4 raggruppa gli invii:** controllare dataLayer E richieste di rete dopo l'attesa dell'invio.
- Lezione per tutti (insegnata a Sito Inlab): ogni scrittura anonima deve avere un limite globale, non solo per IP (l'IPv6 dà indirizzi infiniti).
- Per me (Direttore): quando un agente ammette un errore con questa chiarezza, la lezione diventa subito un controllo. Prima di dare il via a una PR confronto l'OK dell'analista con l'ultima richiesta di Nicola (già nella regola del 24/11).

## 24/11/2026 — Una regressione di velocità è rimasta 16 giorni senza essere vista
- Paresteta da 94 a 71 (8/11 → 24/11) dopo l'aggiunta di un'immagine non passata da Cloudinary. Scoperta solo alla misura successiva.
- **Regola:** controllo di regressione a ogni misura (calo ≥5 punti, LCP +1 s, peso +50%) con il commit sospetto; ogni nuovo tipo di contenuto caricato dalla dashboard (immagini nelle testate) deve passare da Cloudinary nel codice, non dipendere da chi carica.
- Aggiornamento (Performance, 24/11): il calo di Paresteta non è stato causato da un commit ma da un'immagine caricata dalla dashboard (git blame invariato dal 02/10): i cali dovuti ai contenuti non lasciano traccia in git e si vedono solo misurando il sito online. Quindi: misura settimanale + controllo che le immagini Cloudinary abbiano f_auto/w_.
