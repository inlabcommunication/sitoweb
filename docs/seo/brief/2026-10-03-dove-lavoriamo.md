# Brief SEO: pagina /dove-lavoriamo (mappa dei clienti)

**Da:** responsabile SEO → **A:** Sito Inlab, tramite il lotto del Direttore
**Decisione:** Nicola, 03/10. Pagina propria con link dal footer e dalle pagine città, SVG statico più elenco testuale, niente dati strutturati. I clienti minori non sono ancora autorizzati: si parte con le schede esistenti.

## Obiettivo SEO
- Una pagina che collega **tutte** le `/agenzia-comunicazione-{città}`. Oggi alcune ricevono pochi link interni, e questa li aggiunge.
- Mostrare a Google e alle AI dove lavoriamo davvero, con prove: i clienti per città.

## Richieste per lo sviluppo

### 1. Pagina `/dove-lavoriamo` — priorità ALTA
- **Title:** "Dove lavoriamo: Castellaneta, Taranto e provincia | InLab" (57 caratteri).
- **Description:** "Le città in cui lavora InLab Communication: Castellaneta, Taranto, Palagianello, Mottola, Palagiano, Ginosa e le altre. Settori e servizi per ogni città." Accorcia a 155 caratteri al massimo, se serve.
- **H1:** "Dove lavoriamo".
- **Apertura:** "Siamo a Castellaneta, in Via Regina Margherita 26, e lavoriamo con attività di tutta la provincia di Taranto e dintorni. Qui trovi le città in cui siamo presenti, i settori delle attività che seguiamo e i servizi che facciamo."
- **Mappa:** SVG statico, inline o come file, non Google Maps incorporato. Un puntino per ogni città con attività seguite, comprese Ferrara, Bologna e Roma.
  - La mappa non deve pesare sul caricamento: niente librerie esterne.
  - `aria-label` sui puntini; il puntino è un link alla pagina città se esiste, altrimenti all'ancora della città nell'elenco qui sotto.
- **Regola di Nicola (03/10): nessun nome di cliente su questa pagina.** Ogni attività si mostra solo con **città, settore e servizio**. Esempio: "Ferrara: ristorante, gestione social". Così non serve il consenso al nome.
- **Elenco testuale sotto la mappa,** la parte più importante per la SEO. Per ogni città:
  - H2 "{Città}" e, se esiste, link a `/agenzia-comunicazione-{città}`;
  - una riga "{N} attività seguite", con N **calcolato dai dati**, mai scritto a mano;
  - l'elenco anonimo: "{settore}: {servizi}". Se l'attività ha già una scheda pubblica `/cliente/…`, la riga è un link alla scheda, con testo del link descrittivo (es. "pasticceria, social e video"), senza nome.
- **Fonte dei dati:**
  - le schede pubbliche esistenti (campo città, settore, servizi);
  - più un **elenco separato di attività senza scheda**, con solo città, settore e servizi, che compila Nicola dalla dashboard.
  - Niente nomi in quell'elenco, quindi nessun dato personale.
- **Blocco finale "Lavoriamo anche a":** le città con pagina agenzia ma senza attività in elenco (oggi Bari, Matera, Gioia del Colle, Massafra), con solo il link alla pagina città.
- **CTA finale:** quella standard del sito per chiedere un preventivo.
- **Dati strutturati:** nessuno oltre ai `BreadcrumbList` e all'Organization già presenti in tutto il sito.
- **Sitemap:** aggiungere `/dove-lavoriamo`. **Prerender:** sì, come le altre pagine statiche.

### 2. Link verso `/dove-lavoriamo` — priorità ALTA
- **Footer:** "Dove lavoriamo", accanto ad "Agenzia a Taranto" (vedi il brief Taranto).
- **Ogni pagina `/agenzia-comunicazione-{città}`:** in fondo, "Vedi tutte le città in cui lavoriamo" → `/dove-lavoriamo`.
- **Pagina Chi siamo:** link nella frase sull'area servita, se c'è.

### 3. Note tecniche
- Le attività si leggono dai dati, non vanno scritte a mano: quando Nicola aggiunge un'attività con città, settore e servizi, la pagina si aggiorna da sola.
- Paresteta deve risultare solo sotto Ginosa (vedi il brief Palagianello, punto 1). La pagina userà lo stesso campo città.
- **Città fuori dalla Puglia: Ferrara, Bologna e Roma** (aggiornamento di Nicola, 03/10).
  - La mappa ha **due livelli**: uno "Italia" con Puglia, Emilia-Romagna e Lazio, e un ingrandimento sull'arco ionico.
  - Compaiono subito, con il puntino e le loro righe anonime nell'elenco, appena Nicola inserisce le attività. Non hanno link a una pagina città, perché la pagina non c'è.
  - La pagina `/agenzia-comunicazione-{città}` si apre solo quando c'è almeno un lavoro pubblicabile, e la chiede la SEO.
- **Struttura dei dati:** l'elenco delle città della mappa (nome, regione, posizione sul disegno, pagina città sì o no) va tenuto in un unico posto, separato dalle attività. Così aggiungere una città non richiede di cambiare il codice della pagina.

## Cosa misuro dopo
- Pagina indicizzata in Search Console.
- Link interni verso ogni pagina `/agenzia-comunicazione-{città}`: almeno 2 per città, dal footer o da /dove-lavoriamo e dalle pagine vicine.
