# Bio di Nicola Carpignano: testo rivisto (02/10/2026)

Richiesta di Nicola del 02/10: riscrivere la sua bio in modo più completo e ottimizzato.

La bio si trova nel codice, che è fuori dall'area del Blog:
- `src/constants.ts`, `studio.team[0]`: bio breve e formazione nella card di /chi-siamo;
- `src/seo/routes.ts`, `AUTHORS[0]`: pagina /autori/nicola-carpignano e JSON-LD.

Per questo qui trovi solo il testo. Lo applica la sessione Sito Inlab.

Per la pagina autore ho seguito il brief SEO del 02/10 (punto 4): Palagianello, Bari, EA Formazione e una sezione Ricerca.

Rispetto al testo di Nicola ho fatto queste modifiche:
- corretti i refusi ("ala specialistica", "espereinze");
- tolte le frasi vaghe ("Dopo diverse esperienze");
- aggiunto il secondo articolo di ricerca, "#Melomerito", con il link nuovo dato da Nicola. Il brief SEO lo segnava "in attesa del link giusto".

## Richieste per lo sviluppo

### 1. Card in /chi-siamo — `src/constants.ts`, `studio.team[0].bio`

Sostituire la bio attuale con:

> Si occupa di strategia editoriale, copywriting, gestione dei social e posizionamento dei contenuti. Unisce gli studi in psicologia della comunicazione al lavoro di ogni giorno con le attività del territorio: trasforma gli obiettivi di business in piani di comunicazione concreti e riconoscibili. Insegna Marketing e Social Media nei master di EA Formazione a Bari.

Cambiare `edu` in:

```ts
edu: ["Laurea magistrale in Psicologia della comunicazione e del marketing — Sapienza Università di Roma", "Laurea in Psicologia — Università di Bari", "Master in Digital Marketing"],
```

Sul titolo "Laurea in Psicologia — Università di Bari" va chiesta conferma a Nicola. Lui scrive "Ha studiato Psicologia a Bari": se a Bari non si è laureato, scrivere solo "Psicologia — Università di Bari".

### 2. Pagina autore — `src/seo/routes.ts`, `AUTHORS[0]`

`inBreve`:

> Originario di Palagianello (TA), ha studiato Psicologia a Bari e si è specializzato in Psicologia della comunicazione e del marketing alla Sapienza di Roma. Oggi guida strategia e social di InLab Communication e insegna Marketing e Social Media nei master di EA Formazione.

`facts`, in quest'ordine:

```ts
facts: [
  'Originario di Palagianello (TA).',
  'Ha studiato Psicologia all\'Università di Bari e si è specializzato in Psicologia della comunicazione e del marketing alla Sapienza Università di Roma.',
  'Docente di Marketing e Social Media in due master di EA Formazione (Bari): il Master in Management degli Eventi e il master sui social media.',
  'Nella ricerca universitaria ha studiato lo stile della comunicazione online: come si parla di lavoro, recruiting e temi sociali sui social.',
],
```

Testo introduttivo della sezione "Ricerca", se il componente lo prevede:

> Il suo interesse per i social parte dallo studio dello stile comunicativo. Con l'Università di Bari ha analizzato la comunicazione del recruiting digitale con un metodo netnografico. Con la Sapienza ha studiato come i giornali di diverso orientamento politico raccontano l'immigrazione su Facebook.

`research`: aggiungere "#Melomerito" prima dell'articolo già presente:

```ts
{
  authors: ['Carpignano N.'], // da confermare con Nicola: coautori e anno
  year: '',
  title: '"#Melomerito": a Netnographic Study on Communication in Digital Recruiting',
  book: '', publisher: 'Università degli Studi di Bari', pages: '',
  url: 'https://www.researchgate.net/publication/331529739_Melomerito_a_Netnographic_Study_on_Communication_in_Digital_Recruiting',
},
```

Coautori, anno e rivista non sono riuscito a verificarli: ResearchGate non si apre da qui e il titolo non risulta nelle ricerche. Prima di pubblicarli servono da Nicola. Se il tipo `Research` non accetta campi vuoti, conviene renderli facoltativi, così la citazione non mostra parentesi vuote.

`knowsAbout`: aggiungere `'Comunicazione digitale nel recruiting'` e `'Rappresentazioni sociali'`, legati alle due ricerche.

### Controllo tecnico per Sito Inlab
- Il JSON-LD `ScholarlyArticle` va generato anche per la seconda ricerca, con `author` uguale all'`@id` di Nicola.
- I campi vuoti (anno, pagine) non devono comparire né nel testo né nel JSON-LD.
- Nessun prezzo e nessun dato personale oltre a quelli già forniti da Nicola.

## Da confermare con Nicola
1. Laurea a Bari: triennale in Psicologia?
2. "#Melomerito": coautori, anno e dove è stato pubblicato (rivista o atti).
3. Il nome esatto del secondo master EA Formazione, già chiesto dalla SEO.
