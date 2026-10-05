# Brief SEO: pagine "gestione social" per Massafra, Gioia del Colle e Bari

**Da:** responsabile SEO → **A:** Sito Inlab
**Richiesta di Nicola (05/10):** "la maggior parte delle persone cerca *agenzia di comunicazione* o *gestione social* + paese". Ogni città deve avere almeno queste due pagine.

## Verifica (sitemap online, 05/10)
- **Città con tutte e 8 le pagine** (agenzia, gestione social, automazioni e gli altri servizi): Castellaneta, Ginosa, Gravina, Laterza, Mottola, Palagianello, Palagiano, Taranto. Qui le due pagine chieste da Nicola ci sono già.
- **Città con la sola pagina agenzia:** Massafra, Gioia del Colle, Bari, Matera. Manca **gestione social**.

**Decisione:**
- Si aggiunge solo `/gestione-social-{città}` per **Massafra, Gioia del Colle e Bari**, le città indicate da Nicola.
- Gli altri servizi non si aggiungono, per non creare pagine povere.
- Matera resta così, finché Nicola non la chiede.
- Questa scelta sostituisce la regola del 29/09 ("niente pagine servizio a Massafra"): è una decisione del titolare.

## Richieste per lo sviluppo

### 1. Tre pagine nuove — priorità ALTA
`/gestione-social-massafra`, `/gestione-social-gioia-del-colle`, `/gestione-social-bari`
- Stesso template delle `/gestione-social-{città}` esistenti: prerender, sitemap, canonical, breadcrumb, Service JSON-LD come le altre.
- **Nessun cliente da mostrare** in queste città: la sezione "I nostri lavori a {città}" va nascosta, o sostituita con il blocco "Lavoriamo in tutta la provincia" già usato nelle pagine hub. **Non inventare clienti.**
- Il testo sotto l'H1 è il campo `servizi['gestione-social']` qui sotto. Title e description vanno in `paginaServizio['gestione-social']`.

**Massafra**
- **Title:** "Gestione social a Massafra | InLab Communication"
- **Description** (150): "Gestione social a Massafra: piano editoriale, contenuti, reel e sponsorizzate per far crescere la tua attività passo dopo passo. Da Castellaneta, preventivo gratuito."
- **Testo:** "Per un'attività di Massafra i social servono a crescere: farsi trovare da chi non ti conosce ancora, farsi scegliere da chi ti confronta con altri, portare richieste concrete. Costruiamo un piano editoriale chiaro, giriamo foto e reel sul posto, a pochi chilometri dalla nostra sede, e ogni mese guardiamo insieme cosa funziona."

**Gioia del Colle**
- **Title:** "Gestione social a Gioia del Colle | InLab Communication"
- **Description** (149): "Gestione social a Gioia del Colle: contenuti che raccontano prodotti, origine e persone, per caseifici, cantine e attività del territorio. Preventivo gratuito."
- **Testo:** "A Gioia del Colle i social funzionano quando mostrano da dove arriva il prodotto: il caseificio, la cantina, le persone che ci lavorano. Raccontiamo origine e qualità con foto e video veri, in un piano editoriale costante, e portiamo i contenuti anche a chi cerca prodotti della Murgia fuori dalla Puglia."

**Bari**
- **Title:** "Gestione social a Bari | InLab Communication"
- **Description** (150): "Gestione social a Bari: strategia, piano editoriale, contenuti e campagne con il metodo di chi insegna Social Media nei master. Preventivo gratuito."
- **Testo:** "In una città grande come Bari pubblicare tanto non basta: serve sapere a chi parli e perché dovrebbe scegliere te. Partiamo dalla strategia, con l'analisi di pubblico, concorrenti e punti di forza, poi costruiamo contenuti e campagne. È il metodo che Nicola Carpignano insegna nei master di EA Formazione in Marketing e Social Media." Link sul nome di Nicola a `/autori/nicola-carpignano`.

### 2. Link interni — priorità ALTA
- Nelle tre pagine `/agenzia-comunicazione-{massafra|gioia-del-colle|bari}`, nella card "Gestione Social" della sezione servizi: link alla nuova pagina città, al posto di `/gestione-social`.
- In `/gestione-social`, riga "Dove lavoriamo": aggiungi Massafra, Gioia del Colle e Bari.

### 3. Controlli
- Testo proprio rispetto alle altre `/gestione-social-{città}`: almeno 60%.
- Le pagine nuove devono comparire nella sitemap. Il conteggio URL sale di 3.

## Cosa misuro dopo
- Indicizzazione delle 3 pagine: Nicola chiede l'indicizzazione appena sono online.
- Impressioni per "gestione social {città}" e "social media manager {città}" tra 4-8 settimane.
