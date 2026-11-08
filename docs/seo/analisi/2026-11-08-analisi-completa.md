# Analisi SEO/GEO completa del sito (08/11/2026)

**Da:** responsabile SEO → **Per:** Direttore, Nicola, Sito Inlab
**Richiesta:** Nicola, tramite il Direttore (08/11).
**Ambito:** tutto ciò che riguarda Google, Bing e le AI. Performance e accessibilità sono già nel report `docs/performance/2026-11-08.md`.

**Fonti:**
- **Controllo URL di Search Console** su tutte le **230** pagine della sitemap (08/11, dato in tempo reale).
- **Search Console Rendimento** 09/10–07/11. Google ha 2 giorni di ritardo.
- **Scaricamento di tutte le 230 pagine pubblicate:** title, description, H1, canonical, robots, parole, link interni, dati strutturati.
- **Confronto dei testi** tra pagine dello stesso tipo: somiglianza a gruppi di 5 parole, solo nella parte centrale della pagina.
- **GA4, Bing Webmaster API, SerpApi** (risultati di Google Italia e Trends).

## In breve
1. **Tecnicamente il sito è pulito.**
   - 230/230 pagine rispondono 200, 0 link interni rotti, 0 redirect interni;
   - 1 solo H1 per pagina, 0 title o description doppi, 0 title oltre i 65 caratteri;
   - canonical corretti e JSON-LD valido su tutte le pagine.
2. **Pagine indicizzate: 154/230 (67%)**, contro 149 il 05/11 e 129 il 03/11. La crescita c'è, ma rallenta.
3. **Il segnale da guardare è nuovo.**
   - Google **ha letto e scartato** ("Scansionata, non indicizzata") 5 pagine agenzia del lotto 5. Fino al lotto 4 non era mai successo.
   - Le 58 pagine **gestione social** sono uguali tra loro per il **79%** del testo.
   - Le 48 pagine **servizio×città** (video, foto, siti, meta ads, branding per città) sono indicizzate solo per **12 su 48**.
   - Sono i primi segnali di "pagine fatte in serie": vanno corretti prima di aprire altre pagine dello stesso tipo.
4. **L'occasione più grande non sfruttata è Ferrara:** circa 150 impressioni in un mese su "studio/agenzia di comunicazione ferrara", ma siamo in posizione 42–88.
5. **Le pagine dei paesi non collegano mai gli articoli del blog** (0 link), e 7 articoli su 26 non sono ancora indicizzati.

## 1. Indicizzazione (08/11, 230 URL)

| Gruppo | Indicizzate | Perché le altre no |
|---|---|---|
| Home | 1/1 | — |
| Pagine generali (servizi, chi siamo, contatti, ecc.) | 12/14 | /dove-lavoriamo e /privacy: "scansionata, non indicizzata" |
| Agenzia per città | **52/58** | 6 scansionate e scartate: Galatina, Otranto, Cassano delle Murge, Barletta, Potenza (lotto 5) e Santeramo |
| Gestione social per città | **44/57** | 9 rilevate, 3 sconosciute, 1 scansionata (Otranto) |
| Servizio×città (video, shooting, siti, meta ads, branding, automazioni) | **12/48** | 32 rilevate, mai lette; 4 sconosciute |
| Schede cliente | **13/22** | 7 rilevate, 1 sconosciuta, 1 scansionata (Emmesse) |
| Casi studio | **0/2** | Ricciardi e Paresteta: rilevate, mai lette |
| Blog | **19/26** | 5 rilevate (gli articoli più nuovi), 1 sconosciuta, 1 noindex |
| Autori | 1/2 | **Nicola: "scansionata, non indicizzata"** |

- **Lotto 4:** 19/20 in 12 giorni; manca solo gestione-social-fasano.
- **Lotto 5:** 11/20 in 5 giorni.
  - Mancano 4 pagine gestione social (Otranto, Brindisi, Barletta, Potenza).
  - Mancano 5 pagine agenzia, scansionate e scartate: Galatina, Otranto, Cassano delle Murge, Barletta, Potenza.
  - Queste 5 pagine **non** hanno problemi di link: ne ricevono 60 ciascuna, come le altre città. Il problema è il testo, troppo simile alle altre.
- **I 3 articoli bloccati dal vecchio noindex:**
  - `agenzia-comunicazione-taranto-come-scegliere` e `google-business-profile-ga4` sono **rientrati** (riletti il 05 e il 07/11);
  - `ai-overviews-search-console-report` risulta ancora noindex, perché Google non lo rilegge dal 25/10. La pagina oggi dice "index": serve solo che Google ripassi.
- **noindex voluti:** `/cliente/acchiappasogni`, `/cliente/feliciano-fangio`, `/cliente/imh` sono noindex e fuori sitemap, con 1 link interno ciascuna. È corretto: sono schede senza testo sufficiente.
- **IndexNow e llms.txt:**
  - IndexNow ha inviato 229 URL l'08/11 alle 19:59. L'effetto si vedrà su Bing nei prossimi giorni: oggi Bing non ha ancora letto la home.
  - A Bing ho mandato a mano tutte le 230 pagine (05-08/11), tramite API.
  - llms.txt e llms-full.txt sono online dal 05/11. Il traffico da AI è già misurabile: GA4 registra 2 sessioni da chatgpt.com.

## 2. Ricerche e posizioni (09/10–07/11: 21 clic, 1.494 impressioni)
- **Ultimi giorni:** 30 impressioni il 4/11, 47 il 5/11, **61 il 6/11 con 4 clic**. Il calo di inizio novembre si sta riassorbendo.
- **Ricerche con più impressioni:**
  - Ferrara (circa 150 in totale, posizione 42–88);
  - "differenza tra post e reel" e varianti (circa 60, posizione 5–9);
  - "sublime tentazione palagianello" (19, posizione 8);
  - "diram palagianello" (16, posizione 13);
  - "reel per ristoranti" (14, posizione 13);
  - "paresteta ginosa" (13, posizione 10);
  - "pasticceria palagianello" (7, posizione 12).
- **Pagine con clic:**
  - home: 6 clic, posizione 5;
  - tracking-pixel: 5 clic;
  - agenzia Palagianello e agenzia Turi: 2 clic ciascuna;
  - agenzia Acquaviva, Nardò, Ostuni e Taranto, instagram-su-google e sublime-tentazione: 1 clic ciascuna.
- **Pagine vicine alla prima pagina** (posizione 7–15) da spingere:
  - blog: `idee-reel-ristoranti` (9,0), `sponsorizzate-instagram-attivita-locali` (10,7);
  - clienti: `cliente/sublime-tentazione` (8,4), `cliente/nunzio-putignano` (9,3), `cliente/studio-ventimiglia-solution` (9,7);
  - agenzia: Taranto (11,3), Ginosa (8,7), Castellaneta (7,2), Polignano (9,3), Putignano (8,0), Fasano (8,8);
  - gestione social: Castellaneta (8,8), Mottola (7,2);
  - altre: `chi-siamo` (9,2), `branding` (10,8).
- **Risultati veri di Google Italia (SerpApi, 05/11):**
  - "agenzia di comunicazione castellaneta":
    - nella mappa InLab è **2ª** (5★, 10 recensioni), dopo Vyon (4,5★, 6 recensioni);
    - nei risultati sotto la mappa **il nostro sito non è tra i primi 9**: ci sono ProntoPro, Pagine Gialle e Sortlist.
  - "agenzia social taranto":
    - nella mappa ci sono Alessia Boccanfuso (17 recensioni) e Creative Space (3);
    - noi non ci siamo.
- **Trends:**
  - in Italia "social media manager" (71) è più cercato di "agenzia marketing" (47), "agenzia di comunicazione" (46) e "gestione social" (22);
  - in Puglia chi cerca "social media manager" cerca soprattutto "stipendio" e "cosa fa", cioè lavoro, non clienti.

## 3. Cannibalizzazione e doppioni
- **Nei dati di Search Console** ci sono solo casi minori:
  - "pasticceria palagianello": scheda Sublime Tentazione (posizione 11,5) e gestione-social-palagianello (12). Va bene: la scheda è più pertinente;
  - "lab communication": home e chi-siamo, entrambe per ricerche sul marchio.
- **Ricciardi:**
  - `/cliente/studio-dentistico-ricciardi` e `/casi-studio/ricciardi` hanno **lo stesso H1** ("Studio Dentistico Ricciardi"), title diversi, e si linkano a vicenda;
  - il caso studio non è mai stato letto da Google.
  - → H1 diversi (R6).
- **Agenzia e gestione social della stessa città:** in media sono simili al 32% (massimo 58%). Va bene, non competono.
- **Pagine dello stesso tipo tra loro:** questo è il problema vero.

| Tipo | Somiglianza media tra due pagine | Indicizzazione |
|---|---|---|
| gestione-social-{città} | **79%** (max 82%) | 44/57 |
| agenzia-comunicazione-{città} | 60% (max 75%) | 52/58 |
| video-{città} | 52% | servizio×città: 12/48 |
| shooting / siti-web / meta-ads / branding | 45–48% | (come sopra) |

## 4. Title, description e H1
- Sono tutti presenti, unici e della lunghezza giusta.
- Le correzioni del 03/11 sono online: Castellaneta con l'indirizzo, Bari "e provincia", Palagianello, schede cliente con il nome prima del paese.
- **CTR basso con molte impressioni:**
  - "differenza tra post e reel": circa 60 impressioni in posizione 5–9 e **0 clic**. Il title è già stato aggiornato il 03/11: si misura tra 2 settimane.
  - Ferrara: le impressioni arrivano in posizioni troppo basse per avere clic (punto R4).
- **Ancora da decidere:** il brief title per intento del 26/10. Alla luce di Trends lo aggiorno: "Social media manager" va affiancato ad "agenzia", non messo al posto suo.

## 5. Link interni
- **Pagine con pochi link in entrata:**
  - `/cliente/inox-racing-puglia` (1), `/cliente/tacco` (2), `/cliente/pasticceria-naturale` (3);
  - `/blog/meta-one-aziende` (3), `/blog/tracking-pixel-email-garante` (3), che è l'articolo con più clic.
- **Pagine dei paesi verso il blog: 0 link** (mediana sia per agenzia sia per gestione social).
  - Gli articoli locali (ristoranti in provincia di Taranto, masserie, prodotti tipici, Natale) linkano le città, ma le città non linkano loro.
- **Pagine servizio×città:** ricevono link quasi solo dalla pagina del servizio e dall'agenzia della stessa città (mediana 8). È poco per 48 pagine.
- **Pagina autore di Nicola:** 26 link in entrata, ma Google l'ha **scansionata e non indicizzata**. È la pagina che deve uscire per "Nicola Carpignano social media manager Palagianello".

## 6. Contenuto sottile e pagine in serie (con numeri, per la decisione sull'espansione)
- **Schede cliente:** 210–340 parole, le più corte del sito. Indicizzate 13/22.
- **Gestione social:** 79% di testo uguale tra le città. È il rischio principale di essere visti come "pagine fatte in serie".
- **Servizio×città:** 36 pagine su 48 mai lette da Google dopo settimane. Google le considera poco importanti, e diluiscono la scansione del resto.
- **Lotto 5:** per la prima volta Google scarta pagine agenzia appena lette (5 su 10).
- **Proposta sull'espansione.** La decisione di Nicola è di 10 paesi a settimana; i dati suggeriscono di cambiare forma, non di fermarsi:
  - **lotto 6 con 10 paesi, ma solo la pagina agenzia** (testi propri, come sempre);
  - le pagine gestione social dei paesi nuovi si aprono **dopo** che il loro testo comune scende sotto il 50% (R1);
  - così l'espansione continua con metà delle pagine fatte in serie.
  - **Se entro 2 settimane le 5 pagine agenzia del lotto 5 restano scartate,** propongo una settimana di pausa per migliorarle, come prevede il piano.

## 7. Blog
- 26 articoli, 19 indicizzati. I 5 non ancora letti sono i più recenti (3–6/11): normale.
- **Ritmo:** novembre è a 5/8 al 06/11, con 2 articoli già programmati (10 e 13/11). In linea.
- **Articoli che portano visite:** tracking-pixel (5 clic), instagram-su-google (1 clic, posizione 4,1); reel-o-post è nella "prova" di Google (§12 delle linee guida).
- Articoli nazionali con pochi link interni: meta-one, tracking-pixel, sponsorizzate-instagram.

## 8. Dati strutturati e GEO
- **JSON-LD:** 0 blocchi non validi. Tipi presenti:
  - Organization, ProfessionalService/LocalBusiness con indirizzo, geo, areaServed e sameAs;
  - FAQPage su 189 pagine (agenzia, gestione social, servizio×città, blog);
  - BlogPosting, BreadcrumbList, Person/ProfilePage, Service/Offer.
- **Review/AggregateRating:** non vanno aggiunti. Google non accetta recensioni scritte dall'azienda su sé stessa nei propri dati strutturati: le stelle arrivano dalla scheda Google.
- **Search Console:** l'API non espone il rapporto "Miglioramenti". Nicola può guardarlo in Search Console → Miglioramenti (FAQ, breadcrumb): da qui non risultano errori nei dati.
- **GEO:**
  - llms.txt (50 KB) e llms-full.txt (675 KB) sono online;
  - IndexNow è attivo;
  - Bing ha ricevuto tutto il sito;
  - ChatGPT già ci consiglia per Castellaneta e i paesi vicini, non per "agenzia social Taranto" (test di Nicola del 05/11).

## 9. Schede cliente e "Risultati"
- La sezione "Risultati" è presente su tutte le 22 schede.
- **Indicizzate 13/22.** Non indicizzate:
  - Emmesse: scansionata e scartata;
  - le altre 8 sono rilevate o sconosciute. Sono le più corte del sito.

## 10. Errori
- 0 pagine 404 o 5xx, 0 redirect nei link interni, 0 canonical sbagliati, 0 noindex non voluti (salvo il residuo dell'articolo ai-overviews).

---

## Richieste per lo sviluppo
Un commit per punto. La **home non si tocca**. Nessun prezzo. Nessun URL cambiato, nessun redirect nuovo.

### R1. Gestione social per città: meno testo uguale — PRIORITÀ ALTA
- **File:** template della pagina gestione social per città (componente delle pagine `/gestione-social-{città}`) e `src/data/cities.ts`.
- **Perché:** il testo è uguale al 79% tra le città, e 13 pagine su 57 non sono indicizzate. È il segnale di "pagine in serie" più forte del sito.
- **Cosa fare:**
  1. Misura la parte comune (blocchi uguali per tutte le città) e portala sotto il 50%:
     - accorcia i blocchi generici ripetuti (metodo, "conosciamo", elenco servizi) a 2-3 righe, con un link a `/gestione-social`, che spiega tutto una volta sola;
     - tieni per esteso solo le parti della città.
  2. Mostra nella pagina gestione social i campi della città che oggi stanno solo nella pagina agenzia, **riscritti in chiave social**. Li scrivo io nei brief:
     - comincio con le 13 pagine non indicizzate e con Castellaneta, Mottola e Taranto;
     - poi le altre a gruppi di 10, nei brief del lunedì.
  3. **Finché i testi non sono pronti,** basta il punto 1.
- **Cosa misuro:** somiglianza media sotto il 50%, poi l'indicizzazione delle 13 pagine.

### R2. Pagine servizio×città mai lette: togliere dalla sitemap e noindex — PRIORITÀ ALTA
- **File:** generatore della sitemap e `getSeo` in `src/seo/routes.ts` (robots).
- **Perché:**
  - 36 delle 48 pagine (video, shooting, siti-web, meta-ads, branding, automazioni-ai per città) non sono mai state lette, o sono sconosciute, dopo settimane;
  - non portano impressioni;
  - diluiscono la scansione delle pagine agenzia e gestione social, che invece funzionano.
- **Cosa fare:**
  - per le pagine servizio×città **non indicizzate oggi** (elenco qui sotto), metti `noindex, follow` e toglile dalla sitemap;
  - **le 12 indicizzate restano come sono;**
  - le pagine restano online e raggiungibili dai link: la modifica si annulla in un attimo.
- **Cosa misuro:** velocità di indicizzazione di agenzia e gestione social nelle 2 settimane successive.
- **Pagine da mettere in noindex e togliere dalla sitemap (36):** /automazioni-ai-gravina-in-puglia, /automazioni-ai-palagianello, /automazioni-ai-palagiano, /branding-castellaneta, /branding-gravina-in-puglia, /branding-laterza, /branding-mottola, /branding-palagianello, /branding-taranto, /meta-ads-castellaneta, /meta-ads-ginosa, /meta-ads-gravina-in-puglia, /meta-ads-laterza, /meta-ads-mottola, /meta-ads-palagiano, /shooting-castellaneta, /shooting-gravina-in-puglia, /shooting-laterza, /shooting-mottola, /shooting-palagianello, /shooting-palagiano, /shooting-taranto, /siti-web-castellaneta, /siti-web-ginosa, /siti-web-gravina-in-puglia, /siti-web-laterza, /siti-web-mottola, /siti-web-palagianello, /siti-web-palagiano, /siti-web-taranto, /video-castellaneta, /video-ginosa, /video-gravina-in-puglia, /video-mottola, /video-palagianello, /video-taranto
- **Pagine da lasciare come sono (12, indicizzate):** /automazioni-ai-castellaneta, /automazioni-ai-ginosa, /automazioni-ai-laterza, /automazioni-ai-mottola, /automazioni-ai-taranto, /branding-ginosa, /branding-palagiano, /meta-ads-palagianello, /meta-ads-taranto, /shooting-ginosa, /video-laterza, /video-palagiano

### R3. Pagine dei paesi verso il blog: blocco "Dal blog" — PRIORITÀ MEDIA
- **File:** template delle pagine agenzia e gestione social.
- **Perché:** oggi ricevono 0 link verso gli articoli. Gli articoli locali e quelli vicini alla prima pagina ne hanno bisogno.
- **Cosa fare:** un blocco "Dal blog" con 2-3 articoli scelti in quest'ordine:
  1. articoli che citano la città, o la sua provincia, in `blogSeed` (campo città, se c'è, oppure testo);
  2. poi articoli del servizio (per la pagina gestione social: reel-o-post, idee-reel-ristoranti, quante-volte-pubblicare-social, gestione-social-attivita-locale-cosa-include).
- **Testo del titolo del blocco:** "Dal blog: idee per le attività di {Città}".

### R4. Ferrara: farsi trovare per "studio di comunicazione ferrara" — PRIORITÀ MEDIA
- **File:** `src/data/cities.ts` (Ferrara).
- **Perché:** circa 150 impressioni al mese, in posizione 42–88, su "studio di comunicazione ferrara" (57), "agenzia di comunicazione ferrara" (16) e "agenzia pubblicitaria/marketing ferrara". È il gruppo di ricerche più grande che non sfruttiamo.
- **Cosa fare:**
  - **title:** "Agenzia e studio di comunicazione a Ferrara | InLab" (50 caratteri);
  - **H1:** "Agenzia e studio di comunicazione a Ferrara";
  - **description:** "Studio di comunicazione per attività di Ferrara: social, foto e video sul posto, strategia e testi. Il caso Pasticceria Naturale. Preventivo gratuito.";
  - una FAQ in `altreFaq`: "Siete uno studio di comunicazione o un'agenzia?" → "Siamo uno studio di comunicazione e marketing: seguiamo social, foto, video, siti e campagne. A Ferrara lavoriamo con attività come Pasticceria Naturale.", con link alla scheda.

### R5. Pagina autore di Nicola scartata da Google — PRIORITÀ MEDIA
- **File:** pagine autore, articoli del blog, `/chi-siamo`.
- **Perché:** "scansionata, non indicizzata". È la pagina della ricerca "Nicola Carpignano social media manager Palagianello", che Nicola ha chiesto.
- **Cosa fare:**
  1. Ogni articolo scritto da Nicola deve avere un link alla pagina autore nel riquadro autore (controlla che sia così);
  2. da `/chi-siamo` serve un link con testo "Nicola Carpignano, social media manager" a `/autori/nicola-carpignano-social-media-manager-palagianello`;
  3. dalla pagina `/agenzia-comunicazione-palagianello` serve un link con testo "Nicola Carpignano, social media manager di Palagianello".
- La pagina è già lunga (1.506 parole): il testo non va allungato.

### R6. Casi studio mai letti e H1 uguale alla scheda Ricciardi — PRIORITÀ MEDIA
- **File:** pagine `/casi-studio/*`.
- **Cosa fare:**
  - H1 di `/casi-studio/ricciardi` → "Studio Dentistico Ricciardi: sito e campagne che portano prenotazioni";
  - H1 di `/casi-studio/paresteta` → "Paresteta: dal rebranding all'inaugurazione";
  - dalle pagine agenzia di Palagiano e Ginosa, link con testo "Leggi il caso completo" verso i due casi.
- **Perché:** 0/2 indicizzati, e Ricciardi ha lo stesso H1 della scheda cliente.

### R7. /dove-lavoriamo scartata — PRIORITÀ BASSA
- **Perché:** "scansionata, non indicizzata". È soprattutto un elenco di nomi.
- **Cosa fare:** sopra ogni provincia, 1-2 frasi vere (es. "In provincia di Taranto lavoriamo da Castellaneta con attività di Palagianello, Mottola, Ginosa…"), con il link alla pagina agenzia del capoluogo.

### R8. Schede cliente corte — PRIORITÀ BASSA (servono dati di Nicola)
- **Le schede da 210-340 parole:** Tacco, Hermitage, Casa28, Arte e Oro, La Vela, Il Paradiso, Emmesse.
- **Cosa serve per allungarle:**
  - una sezione "Come abbiamo lavorato" in 3 passi, con fatti veri: il periodo, cosa abbiamo fatto, un risultato misurabile;
  - i dati li chiedo a Nicola; senza dati veri le schede non si allungano.

## Per l'Addetto al Blog (lo avviso io)
- Link interni verso `tracking-pixel-email-garante`, `meta-one-aziende` e `sponsorizzate-instagram-attivita-locali` dagli articoli vicini.
- L'articolo del 13/11 ("Quanto costa un social media manager in Puglia") **non** deve puntare a chi cerca lavoro: Trends mostra che in Puglia "social media manager" si cerca soprattutto per "stipendio". Il titolo deve parlare all'attività che deve scegliere ("quanto costa affidare i social…").

## Cosa misuro lunedì 16/11
- Indicizzazione per gruppo; lotto 5 (le 5 pagine agenzia scartate).
- Somiglianza delle pagine gestione social dopo R1.
- Posizione di Ferrara dopo R4; CTR di reel-o-post.
- Bing: pagine lette e prime ricerche; test AI del lunedì.
