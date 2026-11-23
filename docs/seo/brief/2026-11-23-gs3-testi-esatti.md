# GS-3: testi esatti approvati da Nicola (23/11/2026)

**Approvazione:** Nicola, 23/11, tramite il Direttore: 1 sì, 2 sì (con "consulenza gratuita"), 3 sì, 4 sì, 5 sì.
**Per:** Sito Inlab.
**Regole:**
- stessa grafica e stessi spazi;
- la home non si tocca;
- nessun prezzo;
- un commit per punto.

## a) Domande frequenti in fondo a `/gestione-social` (+ FAQPage)
Lo stile è quello delle FAQ delle pagine città.

1. **Cosa include la gestione social?**
   Il piano editoriale del mese, i reel e i video (idea, riprese, montaggio), le foto e le grafiche, la pubblicazione, le risposte a commenti e messaggi e un report mensile con i dati e le correzioni per il mese dopo.

2. **Da cosa dipende il costo della gestione social?**
   Da quanti canali seguiamo, da quanti contenuti servono ogni mese, dalle riprese sul posto e dall'eventuale budget per le sponsorizzate. Dopo una prima consulenza gratuita ti mandiamo una proposta su misura.

3. **Venite voi a fare foto e video?**
   Sì. In provincia di Taranto e nei paesi vicini veniamo direttamente nella tua attività. Per le zone più lontane organizziamo giornate di riprese.

4. **Quanto tempo serve per vedere i risultati?**
   Un profilo più curato e contenuti più visti si notano già nelle prime settimane. Per far crescere seguito e contatti servono di solito alcuni mesi di lavoro costante, e il report mensile ti mostra a che punto siamo.

5. **Lavorate anche con attività piccole?**
   Sì. Buona parte dei nostri clienti sono ristoranti, pasticcerie, officine, negozi e studi della provincia di Taranto.

6. **Chi segue i miei social?**
   Nicola Carpignano e Ilaria Gemma, i fondatori di InLab. Hai sempre un contatto diretto con chi crea i tuoi contenuti.

## b) Risultati veri su `/gestione-social`
Fonte: SOLO `docs/seo/RISULTATI-CLIENTI-VERIFICATI.md`.
- **Cosa cambia:** nella riga dei numeri si sostituiscono "+280% Crescita media follower" e "94% Clienti rinnovano" con le schede qui sotto, nello stesso formato (numero grande + etichetta).
- **Cosa resta per ora:** "3.2M+" e "47", in attesa della verifica di Nicola (punto P1-3 dell'audit).
- Ogni etichetta ha un link alla scheda del cliente.

| Numero | Etichetta | Link |
|---|---|---|
| 95% | eventi sold out nel 2026 · Masseria Sacramento | `/cliente/masseria-sacramento` |
| +30% | gelato venduto in estate, secondo il titolare · Sublime Tentazione | `/cliente/sublime-tentazione` |

**Facoltativa**, se nella riga c'è spazio per una terza scheda:

| Numero | Etichetta | Link |
|---|---|---|
| 4 mesi | di prenotazioni continue, secondo il titolare · Inox Racing Puglia | `/cliente/inox-racing-puglia` |

## c) Riga sopra il titolo e pulsante
- **Riga sopra il titolo, su `/gestione-social`:**
  - oggi: "Servizio — Gestione Social Media";
  - nuovo: **"Gestione social per aziende · Taranto e Puglia"**;
  - l'H1 "FAI CRESCERE IL TUO BRAND…" resta com'è.
- **Testo del pulsante,** sulle pagine `/gestione-social` e `/gestione-social-{città}`:
  - oggi: "Richiedi un preventivo";
  - nuovo: **"Richiedi una consulenza gratuita"**;
  - il link resta `/contatti?servizio=gestione-social`.
  - Nicola ha detto che questo testo può valere anche per altri servizi: per ora si applica solo alle pagine gestione social, così misuriamo l'effetto.

## d) Modulo contatti: campo facoltativo "Come ci hai conosciuto?"
- **Tipo:** tendina, facoltativa, nello stesso stile del campo "Servizio".
- **Opzioni:**
  - "Seleziona" (vuota, valore predefinito)
  - Passaparola
  - Ho visto un vostro lavoro sui social di un cliente
  - Instagram o Facebook di InLab
  - Ricerca su Google
  - ChatGPT o altre AI
  - Altro
- **Dati:** il valore si salva nel lead (campo `come_ci_hai_conosciuto`) e compare in dashboard e nel CSV. Non si manda a GA4.
- L'informativa privacy la aggiorna il Direttore.

## Cosa misuro dopo
- Lead con servizio "Gestione social" nelle 4 settimane dopo la pubblicazione, rispetto alle 4 prima.
- Distribuzione delle risposte a "Come ci hai conosciuto?".
