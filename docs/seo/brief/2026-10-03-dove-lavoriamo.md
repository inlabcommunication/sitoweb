# Brief SEO: pagina /dove-lavoriamo (mappa dei clienti)

**Da:** responsabile SEO → **A:** Sito Inlab, tramite il lotto del Direttore
**Decisione:** Nicola, 03/10. Pagina propria con link dal footer e dalle pagine città, SVG statico più elenco testuale, niente dati strutturati. I clienti minori non sono ancora autorizzati: si parte con le schede esistenti.

## Obiettivo SEO
- Una pagina che collega **tutte** le `/agenzia-comunicazione-{città}`. Oggi alcune ricevono pochi link interni, e questa li aggiunge.
- Mostrare a Google e alle AI dove lavoriamo davvero, con prove: i clienti per città.

## Richieste per lo sviluppo

### 1. Pagina `/dove-lavoriamo` — priorità ALTA
- **Title:** "Dove lavoriamo: Castellaneta, Taranto e provincia | InLab" (57 caratteri).
- **Description:** "Le città in cui lavora InLab Communication: Castellaneta, Taranto, Palagianello, Mottola, Palagiano, Ginosa e le altre. Clienti, lavori e servizi per ogni città." Accorcia a 155 caratteri al massimo, se serve.
- **H1:** "Dove lavoriamo".
- **Apertura:** "Siamo a Castellaneta, in Via Regina Margherita 26, e lavoriamo con attività di tutta la provincia di Taranto e dintorni. Qui trovi le città in cui siamo presenti, con i clienti che seguiamo e i servizi che facciamo per ognuno."
- **Mappa:** SVG statico, inline o come file, non Google Maps incorporato. Un puntino per ogni città con clienti pubblicati.
  - La mappa non deve pesare sul caricamento: niente librerie esterne.
  - `aria-label` sui puntini; ogni puntino è un link alla pagina città.
- **Elenco testuale sotto la mappa,** la parte più importante per la SEO. Per ogni città:
  - H2 "{Città}";
  - link a `/agenzia-comunicazione-{città}`;
  - i clienti pubblicati in quella città, presi **dagli stessi dati delle schede** `/cliente/…` già esistenti (campo città), con link alla scheda e al caso studio se c'è.
  - Le città con pagina agenzia ma senza clienti (Bari, Matera, Gioia del Colle, Massafra) vanno in un blocco finale "Lavoriamo anche a" con solo il link alla pagina città.
- **CTA finale:** quella standard del sito per chiedere un preventivo.
- **Dati strutturati:** nessuno oltre ai `BreadcrumbList` e all'Organization già presenti in tutto il sito.
- **Sitemap:** aggiungere `/dove-lavoriamo`. **Prerender:** sì, come le altre pagine statiche.

### 2. Link verso `/dove-lavoriamo` — priorità ALTA
- **Footer:** "Dove lavoriamo", accanto ad "Agenzia a Taranto" (vedi il brief Taranto).
- **Ogni pagina `/agenzia-comunicazione-{città}`:** in fondo, "Vedi tutte le città in cui lavoriamo" → `/dove-lavoriamo`.
- **Pagina Chi siamo:** link nella frase sull'area servita, se c'è.

### 3. Note tecniche
- I clienti si leggono dai dati, non vanno scritti a mano: quando Nicola pubblica un nuovo cliente con la città, la pagina si aggiorna da sola.
- Paresteta deve risultare solo sotto Ginosa (vedi il brief Palagianello, punto 1). La pagina userà lo stesso campo città.
- **Città fuori dalla Puglia: Ferrara, Bologna e Roma** (aggiornamento di Nicola, 03/10). Lì ci sono già clienti, ma nomi, settori e consenso arriveranno più avanti.
  - La mappa ha **due livelli**: uno "Italia" con Puglia, Emilia-Romagna e Lazio, e un ingrandimento sull'arco ionico.
  - Le tre città compaiono **subito**: puntino sulla mappa e voce nel blocco "Lavoriamo anche a", **senza link**, perché la pagina città non c'è.
  - Quando ci sarà un cliente pubblicato con quella città, la città passa automaticamente all'elenco principale con i clienti.
  - La pagina `/agenzia-comunicazione-{città}` si apre solo con almeno un lavoro pubblicabile, e la chiede la SEO.
  - **Struttura dei dati:** l'elenco delle città della mappa (nome, regione, coordinate sul disegno, pagina città sì o no) va tenuto in un unico posto, separato dai clienti. Così aggiungere una città non richiede di cambiare il codice della pagina.

## Cosa misuro dopo
- Pagina indicizzata in Search Console.
- Link interni verso ogni pagina `/agenzia-comunicazione-{città}`: almeno 2 per città, dal footer o da /dove-lavoriamo e dalle pagine vicine.
