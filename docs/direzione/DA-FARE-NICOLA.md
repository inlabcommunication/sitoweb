# Cose da fare per Nicola (lista unica, aggiornata dal Direttore)

Una sola lista, senza ripetizioni. Il Direttore la ripete in chat solo quando cambia qualcosa. Gli altri agenti non ripetono a Nicola ciò che c'è qui: lo segnalano al Direttore.

Aggiornata: 23/11/2026

## Priorità 23/11 (dashboard)
- [ ] **4 schede clienti con i risultati verificati** (Inox, Nunzio Putignano, Sublime Tentazione, Masseria Sacramento): testi in `CORREZIONI-SCHEDE-CLIENTI-2026-11-20.md`. Sbloccano la PR #130 (articolo Blog) e i risultati su /gestione-social. Poi scrivere "fatto".
- [ ] **PROMEMORIA (Nicola, 23/11): mettere i dati/risultati veri anche negli ALTRI clienti** (Ricciardi, DIRAM, Ventimiglia, Paresteta, Tacco, Hermitage, Casa28, Arte e Oro, La Vela, Il Paradiso, Emmesse, ecc.): per ognuno 1-3 fatti reali (da… a…, periodo, "secondo il titolare" se è un dato del cliente). Finché non ci sono dati veri, le schede restano senza numeri. Il Direttore prepara i testi appena Nicola dà i dati.
- [ ] Caso **Pala Padel** (testi in `palapadel/COPIA-INCOLLA-DASHBOARD.md`).
- [ ] Presentazione **Paresteta**: prima blocco + PDF + "Prova il download" (scrivere "fatto, PDF caricato"); slide e «Mostra sul sito» solo dopo il consenso di Paresteta (`paresteta-presentazione/ISTRUZIONI-DASHBOARD-PARESTETA.md`).
- [ ] Cancellare i 2 contatti di prova «TEST Sito Inlab - da cancellare» (e controllare «Come ci ha conosciuto: Ricerca su Google»).
- [ ] Limitare la Browser key per referrer (con *.vercel.app) · scollegare `clinicaricciardilumina-alt` · archivio vecchia storia (`serene-noether`) sì/no · restringere la routine "Chat InLab - agenti" sì/no.
- Email dei lead: NON attive (né Resend né Brevo), decisione di Nicola 23/11.

(Voci precedenti, 10/10/2026)

## Dashboard
- [ ] Togliere l'esempio Aleph (Servizi → Esempi → Shooting → cliente "aleph-caffe") — già segnalato anche dalla SEO.
- [ ] Arte e Oro: campo "settore" da "Orafo · Stefano Pastore" a quello giusto (online è Stefano Tamburrano).
- [ ] Nota "Metriche indicative" nei casi Ricciardi e Paresteta → "Dati indicativi riferiti al periodo della campagna."
- [ ] Compilare le 3 schede vuote (Acchiappasogni, Feliciano Fangio, IMH) e spuntare "Pubblica la scheda".

- [ ] Inserire in dashboard i 13 link Instagram confermati (campo Instagram di ogni scheda); Il Paradiso e Tacco: dare i link a mano.

## Decisioni
- [x] Persone nominate nelle schede: confermato da Nicola (10/10).
- [ ] Togliere il link "Scheda cliente" dalle 3 schede vuote finché non pubblicate (consiglio: sì).

## Sicurezza (analista, 10/10)
- [ ] Possibile tentativo di accesso visto da Nicola ~10 giorni fa: dire all'analista cosa ha visto; controllare utenti Firebase, attività account Google, registro sicurezza GitHub, log Vercel.
- [x] Account GitHub "clinicaricciardilumina-alt": è di Nicola (confermato 17/10); [ ] scollegarlo dal repository su GitHub (istruzioni dell'analista).

## Console (SECURITY.md)
- [ ] Sign-up Firebase disattivato · [ ] restrizione referrer sulla browser key · [ ] tetto di spesa Google e Anthropic · [ ] "Salva impostazioni" · [ ] TTL su `_ratelimits`.

## Schede esterne (guida `GUIDA-SCHEDE-ESTERNE.md`)
- [ ] Orari, servizi/città da mostrare, indirizzo o solo area di servizio → poi Google Business, Bing, Apple, Pagine Gialle.

## Per domani (24/11) — in ordine, tutto breve
**Decisioni (una parola ciascuna):**
1. Statistiche interne della dashboard: **A** (tenerle, più lavoro) o **B** (solo Google Analytics, consigliata dal Direttore)?
2. GEO: confermi «controllo gratuito» se compari nelle risposte AI e «misura mensile» ai clienti dei siti web? (sì/no, poi si pubblica)
3. Routine dell'analista: aggiornare con i controlli nuovi? Routine di Performance: misura settimanale su 8 pagine? (sì/no)
**Azioni:**
4. **Pubblicare le regole Firestore in console (con il Direttore, 5 minuti)** dopo che la PR #139 è unita.
5. **Proteggere `main` su GitHub** (5 minuti): `CHECKLIST-SICUREZZA-NICOLA-2026-11-24.md`, punto 1.
6. 2FA sugli account (GitHub, Vercel, Google, Cloudinary, GoDaddy), SPF/DMARC/CAA su GoDaddy, tetto di spesa AI.
7. Dashboard: salvare le 4 schede clienti con i risultati veri (`CORREZIONI-SCHEDE-CLIENTI-2026-11-20.md`) e togliere la nota «Metriche indicative — da confermare…» da Paresteta e Ricciardi.
8. Prove: download Paresteta da due browser; evento chatbot in Analytics (DebugView o Tempo reale).
