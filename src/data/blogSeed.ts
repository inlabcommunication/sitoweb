// Articoli iniziali del blog (inclusi nel codice, quindi sempre presenti in
// sitemap e HTML pre-generato). Gli articoli scritti dalla dashboard stanno in
// Firestore (blog_posts) e, a parità di slug, sostituiscono questi.
// Nessun import di React: il file è usato anche dallo script di build.

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;      // Markdown semplice: ## titoli, **grassetto**, *corsivo*, [link](url), elenchi, > citazioni
  category: string;
  tags: string[];
  author: string;
  date: string;         // YYYY-MM-DD
  updated?: string;     // YYYY-MM-DD, ultimo aggiornamento sostanziale (dateModified per Google)
  cover?: string;
  coverAlt?: string;    // descrizione della copertina (se manca si usa il titolo)
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

// ── Funzioni pure (usate da sito, dashboard e script di build) ──
export const slugify = (s: string) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

/** Pulisce un documento Firestore: solo i campi attesi, con i tipi giusti. */
export const normalizePost = (slug: string, d: any): BlogPost => ({
  slug,
  title: String(d?.title || ''),
  excerpt: String(d?.excerpt || ''),
  content: String(d?.content || ''),
  category: String(d?.category || 'Strategia'),
  tags: Array.isArray(d?.tags) ? d.tags.map(String).slice(0, 12) : [],
  author: String(d?.author || 'InLab Communication'),
  date: /^\d{4}-\d{2}-\d{2}$/.test(d?.date) ? d.date : new Date().toISOString().slice(0, 10),
  updated: /^\d{4}-\d{2}-\d{2}$/.test(d?.updated) ? d.updated : undefined,
  cover: d?.cover ? String(d.cover) : undefined,
  coverAlt: d?.coverAlt ? String(d.coverAlt) : undefined,
  published: d?.published === true,
  seoTitle: d?.seoTitle ? String(d.seoTitle) : undefined,
  seoDescription: d?.seoDescription ? String(d.seoDescription) : undefined,
});

export const mergePosts = (seed: BlogPost[], remote: BlogPost[]) => {
  const map = new Map<string, BlogPost>();
  seed.forEach((p) => map.set(p.slug, p));
  remote.forEach((p) => map.set(p.slug, p));
  return [...map.values()]
    .filter((p) => p.published && p.title)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
};

export const BLOG_CATEGORIES = ['Social media', 'Video & Reel', 'Siti web', 'Strategia', 'Advertising'];

export const BLOG_SEED: BlogPost[] = [
  {
    slug: 'gestione-social-attivita-locale-cosa-include',
    title: 'Gestione social per attività locali: cosa include davvero (e come sceglierla)',
    excerpt: 'Strategia, piano editoriale, foto e video, community e report: cosa aspettarsi da una gestione social professionale, com\'è fatto un mese tipo e le domande da fare prima di scegliere.',
    category: 'Social media',
    tags: ['gestione social', 'attività locali', 'instagram', 'facebook', 'piano editoriale'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    updated: '2026-09-28',
    cover: '/blog/gestione-social-attivita-locale-cosa-include/cover.jpg',
    coverAlt: 'Calendario del piano editoriale mensile di una pizzeria con reel, caroselli e storie',
    published: true,
    seoTitle: 'Gestione social per attività locali: cosa include | InLab',
    seoDescription: 'Gestione social per attività locali: cosa include un servizio serio, un mese tipo di contenuti, agenzia o fai-da-te e cosa chiedere prima di scegliere.',
    content: `La **gestione social per attività locali** è molto più di "pubblicare qualche post". Se hai un ristorante, un negozio o uno studio e stai pensando di affidare Instagram e Facebook a qualcuno, qui trovi cosa deve includere un servizio serio, com'è fatto un mese tipo e le domande da fare prima di scegliere.

**Risposta breve: una gestione social professionale comprende strategia, piano editoriale mensile, produzione di foto e video, pubblicazione, risposte a commenti e messaggi e un report con i numeri. Se in un preventivo manca una di queste voci, chiedi perché.**

Molte attività aprono una pagina Instagram, pubblicano per qualche settimana e poi si fermano. Non per pigrizia: gestire i social bene richiede tempo, idee e costanza, tre cose che chi manda avanti un'attività ha raramente. Vediamo allora cosa significa, in concreto, delegare.

## Cosa include la gestione social per attività locali

Un servizio completo si regge su cinque attività. Se in un preventivo ne manca una, chiedi perché.

### 1. Strategia: chi vuoi raggiungere e perché

Prima dei contenuti si decide la direzione. A chi parli? Clienti nuovi, clienti abituali, turisti d'estate? Cosa vuoi ottenere: più prenotazioni, più passaggi in negozio, più richieste di preventivo?

Da qui nascono il **tono di voce**, i temi ricorrenti e i canali giusti. Un bar in piazza vive su Instagram e sulle storie. Uno studio professionale può aver bisogno anche di Facebook, che in Italia raggiunge ancora un pubblico molto ampio, soprattutto adulto.

### 2. Piano editoriale: il calendario del mese

Il piano editoriale è il calendario dei contenuti: cosa esce, quando e su quale canale. Di solito si prepara ogni mese e si approva insieme al cliente.

Un buon piano tiene conto della stagionalità, degli eventi del paese e dei momenti forti dell'attività. In provincia di Taranto questo conta molto: un locale di Castellaneta Marina ha un'estate fittissima e un inverno tranquillo, un negozio di città ha i suoi picchi a Natale e con i saldi.

### 3. Produzione di foto e video

È la parte che fa la differenza. **Foto e video girati nella tua attività**, con le persone che ci lavorano, funzionano molto meglio delle immagini di repertorio. Anche le piattaforme lo premiano: Meta ha annunciato nel 2026 che su Facebook i contenuti ripubblicati senza apporto originale vengono mostrati meno.

Nel servizio vanno chiariti tre punti: chi gira, ogni quanto si fanno le riprese e quanti reel escono da ogni sessione. Se hai bisogno di immagini curate per prodotti o piatti, valuta anche uno [shooting fotografico](/shooting) dedicato.

### 4. Community: commenti, messaggi e recensioni

I social sono una conversazione. Rispondere ai commenti e ai messaggi privati in tempi rapidi e con il tono giusto conta quanto un bel post. Una domanda sugli orari lasciata senza risposta è un cliente perso.

Chiedi sempre chi risponde ai messaggi, in quali orari e cosa succede con le richieste di prenotazione o di prezzo.

### 5. Numeri e miglioramento

Ogni mese si guardano i dati: quali contenuti hanno funzionato, da dove arrivano i contatti, cosa cambiare. **La strategia evolve con i risultati reali**, non con le impressioni. Un report utile non elenca solo like e follower, ma collega i contenuti a qualcosa di concreto: messaggi ricevuti, chiamate, clic al sito, prenotazioni.

![Le cinque voci di una gestione social: strategia, piano, contenuti, community e report](/blog/gestione-social-attivita-locale-cosa-include/cosa-include.webp)

## Un mese tipo di gestione social: un esempio

Facciamo un esempio per una pizzeria di Massafra con una gestione di livello intermedio. Un mese potrebbe contenere:

- **1 sessione di riprese** di mezza giornata nel locale, da cui escono foto e video per tutto il mese;
- **8-10 contenuti nel feed**, di cui 4-6 reel e 2-3 caroselli (per esempio il menu della settimana o i nuovi impasti);
- **storie quasi ogni giorno**: la pizza del giorno, sondaggi, dietro le quinte, promemoria della serata con musica;
- **risposte a commenti e messaggi** nei giorni lavorativi;
- **un report a fine mese** con cosa ha funzionato e cosa cambiare nel mese successivo.

Non è una regola fissa. Per capire il ritmo giusto per la tua attività, leggi la guida su [quante volte pubblicare sui social](/blog/quante-volte-pubblicare-social): la costanza conta più della quantità.

## Cosa cambia da un servizio all'altro

Due gestioni social possono avere lo stesso nome e contenere cose molto diverse. Quando confronti più proposte, metti a fianco queste voci:

- **quanti canali** vengono seguiti (solo Instagram, oppure anche Facebook, TikTok, LinkedIn);
- **chi produce i contenuti**: foto e video girati da chi gestisce, oppure materiale fornito da te;
- **quante sessioni di riprese** sono previste ogni mese;
- **chi risponde a commenti e messaggi**, e in quali orari;
- **se le sponsorizzate sono incluse** o sono un servizio a parte (il budget pubblicitario si paga sempre direttamente a Meta);
- **cosa contiene il report** e ogni quanto lo ricevi.

Più le voci sono chiare, più è facile capire cosa stai comprando e confrontare le proposte in modo corretto.

## Agenzia, freelance o fai-da-te: come scegliere

Non esiste la scelta giusta per tutti. Dipende dal tempo che hai e da quanto contano i social per il tuo lavoro.

**Fai-da-te.** Costa poco in denaro ma molto in tempo. Funziona se hai qualcuno in squadra che ama farlo e riesce a essere costante. Il rischio è fermarsi alla prima settimana piena.

**Freelance.** Di solito costa meno di un'agenzia ed è un buon compromesso per chi ha esigenze semplici. Verifica chi produce foto e video e cosa succede quando il professionista è in ferie o malato.

**Agenzia.** Ha un costo più alto, ma mette insieme più competenze: strategia, riprese, grafica, advertising, sito. Ha senso quando vuoi un unico referente per tutta la comunicazione, anche offline.

![Confronto tra gestione social fai-da-te e gestione professionale per un'attività locale](/blog/gestione-social-attivita-locale-cosa-include/fai-da-te-agenzia.webp)

## Gli errori più comuni

- **Pubblicare senza un obiettivo.** Tanti post scollegati non costruiscono niente. Meglio pochi contenuti riconoscibili e costanti.
- **Usare solo foto di repertorio.** Le persone vogliono vedere il tuo locale, i tuoi piatti, le tue facce.
- **Ignorare i messaggi.** Chi scrive in privato spesso è pronto a prenotare o comprare.
- **Guardare solo i follower.** Mille follower del tuo paese valgono più di diecimila sconosciuti.
- **Fermarsi dopo un mese.** I social danno risultati con la costanza: servono almeno tre mesi per capire cosa funziona.

## Cosa abbiamo imparato gestendo i social di attività locali

Lavorando con attività della provincia di Taranto abbiamo visto che il contenuto che funziona segue la vita reale dell'attività. Per [Sublime Tentazione](/cliente/sublime-tentazione), gelateria e pasticceria di Palagianello, i contenuti seguono le stagioni del laboratorio: il gelato d'estate, i panettoni a Natale. Per [Masseria Sacramento](/cliente/masseria-sacramento) la comunicazione accompagna ogni appuntamento del calendario, dalla festa della birra alle serate con musica live.

Il caso più completo è quello di [Paresteta](/casi-studio/paresteta): un cambio insegna trasformato in un evento locale, con teaser sui social, QR code per raccogliere contatti, video di lancio e attività in città. I social, da soli, fanno una parte del lavoro. Collegati a quello che succede offline, fanno la differenza. Se anche tu stai pensando a un cambio di nome o di insegna, leggi la guida al [rebranding di un'attività commerciale](/blog/rebranding-attivita-commerciale).

Se vuoi capire quale formato usare per ogni contenuto, leggi anche [reel o post: cosa pubblicare su Instagram](/blog/reel-o-post-cosa-pubblicare-instagram).

## Domande frequenti

### Cosa fa esattamente un social media manager per un'attività locale?

Definisce la strategia, prepara il piano editoriale, crea o coordina foto e video, pubblica, risponde a commenti e messaggi e misura i risultati ogni mese. In un'agenzia queste attività sono divise tra più persone.

### Quanto tempo serve per vedere risultati dalla gestione social?

Di solito servono almeno tre mesi di pubblicazione costante per capire cosa funziona e vedere una crescita stabile. Con le sponsorizzate i primi contatti possono arrivare prima, ma la base resta un profilo curato.

### Devo dare le password dei miei profili all'agenzia?

No. Con Meta Business Suite puoi dare accesso alla tua pagina e al tuo profilo Instagram senza condividere le password, e toglierlo quando vuoi. I profili restano sempre tuoi.

### La gestione della pagina Instagram aziendale include le sponsorizzate?

Spesso l'impostazione delle campagne è un servizio a parte, e il budget pubblicitario si paga sempre direttamente a Meta. Chiedi che nel preventivo le due voci siano separate e chiare.

### Posso gestire i social da solo e farmi aiutare solo con i video?

Sì, è una soluzione frequente per chi ha tempo per pubblicare ma non per girare e montare. In quel caso ha senso un servizio di [video e reel](/video) con sessioni di riprese periodiche.

## Le domande da fare prima di scegliere

Prima di firmare, chiedi di vedere lavori reali per attività simili alla tua, chi produce foto e video, ogni quanto ricevi un report e cosa contiene. Un'agenzia seria risponde con esempi concreti e non promette risultati garantiti in poche settimane.

Se ti chiedi con che ritmo pubblicare, leggi la guida su [quante volte pubblicare sui social](/blog/quante-volte-pubblicare-social). Se la tua attività è in provincia di Taranto, trovi i dettagli del servizio nella pagina sulla [gestione social a Taranto](/gestione-social-taranto).

Vuoi capire come potrebbe funzionare per la tua attività? [Scopri il servizio di gestione social](/gestione-social) oppure [raccontaci la tua attività](/contatti): in 24 ore ti diciamo da dove partiremmo.`,
  },
  {
    slug: 'reel-o-post-cosa-pubblicare-instagram',
    title: 'Reel o post? Cosa pubblicare su Instagram per far crescere un\'attività locale',
    excerpt: 'Reel, caroselli, foto e storie: a cosa serve ogni formato, quanto deve durare un reel, come aprirlo nei primi 3 secondi e 10 idee concrete divise per settore.',
    category: 'Video & Reel',
    tags: ['reel', 'instagram', 'contenuti', 'video', 'caroselli'],
    author: 'Ilaria Gemma',
    date: '2026-09-28',
    updated: '2026-09-28',
    cover: '/blog/reel-o-post-cosa-pubblicare-instagram/cover.jpg',
    coverAlt: 'Schermate di un reel, di un carosello e delle storie di Instagram affiancate',
    published: true,
    seoTitle: 'Reel o post su Instagram? Guida e 10 idee | InLab',
    seoDescription: 'Reel o post su Instagram: a cosa serve ogni formato, quanto deve durare un reel, i primi 3 secondi, 10 idee per settore e un piano settimanale da copiare.',
    content: `Reel o post? È la domanda che ci fanno più spesso i titolari di attività locali che gestiscono Instagram da soli. In questa guida trovi a cosa serve ogni formato, quanto deve durare un reel, 10 idee concrete divise per settore e un piano settimanale da copiare.

**Risposta breve: i reel servono a farti scoprire da persone che non ti seguono ancora, i caroselli a spiegare e convincere, le storie a restare presenti ogni giorno con chi ti segue già. Per un'attività locale funziona un mix dei tre formati, non uno solo.**

Nessun formato è "il migliore" in assoluto. Ognuno ha un lavoro preciso da fare. Capire quale lavoro ti serve in un certo momento è il primo passo per pubblicare con meno fatica e più risultati.

## Reel o post su Instagram: a cosa serve ogni formato

### Reel: per farti scoprire

I reel sono il formato che Instagram mostra di più a chi non ti segue ancora. Sono il modo più diretto per farti conoscere da nuove persone della tua zona.

Funzionano bene quando mostrano qualcosa di vero: un piatto che esce dal forno, un prima e dopo, il titolare che risponde a una domanda. Non serve una produzione cinematografica, serve un'idea chiara e girata bene.

### Carosello: per spiegare e convincere

Il carosello è una sequenza di immagini che si scorrono. È perfetto per spiegare: i passaggi di un trattamento, le novità del menu, i lavori finiti, le risposte alle domande frequenti.

Chi scorre fino all'ultima immagine è una persona interessata. Per questo il carosello è ottimo per chi sta già valutando di sceglierti.

### Post con foto singola: per le comunicazioni semplici

La foto singola ha ancora senso per annunci veloci: un nuovo orario, una chiusura per ferie, un prodotto appena arrivato. Da sola però raggiunge meno persone di un reel, quindi non conviene usarla come formato principale.

### Storie: per restare presenti ogni giorno

Le storie durano 24 ore e le vede soprattutto chi ti segue già. Servono per la relazione quotidiana: la novità del giorno, un sondaggio, un dietro le quinte, il promemoria di un evento.

Sono il formato più "vicino" alle persone, e spesso è da una storia che arriva il messaggio privato con una richiesta.

![A cosa servono reel, storie, caroselli e foto singole su Instagram per un'attività locale](/blog/reel-o-post-cosa-pubblicare-instagram/formati-instagram-reel-post-storie.webp)

## Quanto deve durare un reel e come iniziarlo

### La durata giusta

Da inizio 2025 Instagram permette reel fino a 3 minuti. Questo non vuol dire che debbano essere lunghi.

Per farsi scoprire, di solito conviene restare **tra i 7 e i 30 secondi**: un'idea sola, raccontata senza pause. Un reel più lungo ha senso quando il contenuto lo giustifica, per esempio un tutorial, una ricetta o la presentazione di un immobile.

La regola pratica è semplice: taglia tutto quello che non serve. Se un secondo non aggiunge niente, via.

### I primi 3 secondi: dove si decide tutto

Chi scorre decide in un attimo se fermarsi. Nei primi 3 secondi devono succedere due cose: si deve capire **di cosa parla il video** e **perché vale la pena guardarlo**.

Qualche modo per aprire bene:

- **una domanda diretta**: "Sai perché la nostra pizza riposa 48 ore?";
- **il risultato prima del processo**: il piatto finito, poi come si prepara;
- **un testo a schermo chiaro**, perché molti guardano senza audio;
- **un volto**: le persone si fermano per le persone.

Evita le aperture lente con il logo o con inquadrature vuote del locale. Il logo può arrivare alla fine.

## 10 idee di reel per attività locali, divise per settore

### Ristorante, bar e pizzeria

1. **La preparazione del piatto simbolo**, dall'impasto al tavolo, in 15 secondi.
2. **"Una giornata in cucina"**: il team che si prepara al servizio, montato veloce.
3. **Il cliente abituale** che racconta il suo piatto preferito (con il suo permesso).

Ne abbiamo raccolte molte altre, con i consigli per girarle, nella guida alle [idee di reel per ristoranti e bar](/blog/idee-reel-ristoranti).

### Negozio

4. **"3 modi di abbinare"** un capo, un accessorio o un prodotto appena arrivato.
5. **L'unboxing dei nuovi arrivi** raccontato dal titolare.
6. **La domanda che ti fanno tutti** in negozio, con la risposta in 20 secondi.

### Studio medico o dentistico

7. **"Cosa succede durante la prima visita"**, spiegato con calma dal professionista.
8. **Il mito da sfatare**: una convinzione diffusa e cosa dice davvero la pratica clinica, sempre con un linguaggio corretto e senza promesse.

### Centro estetico e parrucchiere

9. **Il prima e dopo** di un trattamento o di un taglio, con il consenso della cliente.
10. **Il consiglio da portare a casa**: come mantenere il risultato dopo il trattamento.

## Un piano settimanale di esempio

Per molte attività locali un buon punto di partenza è questo:

- **lunedì**: storia con la novità della settimana;
- **martedì**: reel (per esempio un dietro le quinte);
- **mercoledì**: carosello (un approfondimento o le domande frequenti);
- **giovedì**: storie con sondaggio o domanda;
- **venerdì**: reel (il prodotto o il piatto forte del weekend);
- **sabato e domenica**: storie dal vivo, se l'attività è aperta.

Sono **2 reel, 1 carosello e storie quasi ogni giorno**. Poi i numeri dicono cosa aumentare e cosa ridurre. Per le frequenze consigliate su ogni piattaforma trovi i dati nella guida su [quante volte pubblicare sui social](/blog/quante-volte-pubblicare-social).

![Esempio di piano settimanale Instagram con due reel, un carosello e storie quasi ogni giorno](/blog/reel-o-post-cosa-pubblicare-instagram/piano-settimanale.webp)

## Cosa abbiamo imparato girando reel per attività locali

Nei progetti che seguiamo in provincia di Taranto, i reel che funzionano meglio sono quelli in cui si riconoscono le persone e il posto. Per [Nunzio Putignano Autofficina](/cliente/nunzio-putignano) a Palagiano abbiamo scelto reel ironici e spontanei, spesso in dialetto, con il titolare e il suo team protagonisti. Per [Ottica Occhi Blu](/cliente/ottica-occhiblu) a Castellaneta i video spiegano i servizi in modo semplice e simpatico.

Sono settori molto diversi, ma il principio è lo stesso: **meglio un video autentico girato bene che un contenuto perfetto e impersonale**. Gli stessi video, con qualche accorgimento, possono farti trovare anche su TikTok, che molti usano come motore di ricerca: te lo spieghiamo nella guida alla [SEO su TikTok](/blog/seo-tiktok-search-ads).

### Gli errori più comuni

- **Pubblicare tanto senza un filo conduttore.** Meglio pochi contenuti riconoscibili e costanti che tanti post scollegati.
- **Copiare i trend senza adattarli.** Un audio di tendenza non basta se non c'entra niente con la tua attività.
- **Dimenticare i sottotitoli.** Molte persone guardano i reel senza audio.
- **Non rispondere ai commenti.** Un reel che genera domande è un'occasione: rispondi presto.

## Domande frequenti

### È meglio pubblicare reel o post su Instagram?

Dipende dall'obiettivo. I reel servono soprattutto a raggiungere persone nuove, i caroselli a spiegare e convincere chi è già interessato. Per un'attività locale conviene alternarli, con le storie ogni giorno.

### Quanto deve durare un reel per un'attività?

Per farsi scoprire di solito bastano tra 7 e 30 secondi, con un'idea sola. Reel più lunghi vanno bene per tutorial o presentazioni, purché ogni secondo aggiunga qualcosa.

### Quanti reel a settimana deve pubblicare un'attività locale?

Un buon punto di partenza sono 2-3 reel a settimana, con storie quasi ogni giorno. È più importante riuscire a mantenere il ritmo nel tempo che pubblicare tanto per un mese e poi fermarsi.

### Serve una videocamera professionale per fare reel?

No, uno smartphone recente basta per la maggior parte dei contenuti. Contano di più luce, audio pulito e un'idea chiara. Per i contenuti più importanti, come un lancio o un evento, una produzione professionale fa la differenza.

### I caroselli funzionano ancora su Instagram?

Sì. Sono il formato più adatto per spiegare e vengono salvati e condivisi spesso. Sono utili soprattutto per menu, listini di servizi, passaggi di un trattamento e domande frequenti.

## Da dove partire

Scegli un formato per ogni obiettivo e un ritmo che riesci a mantenere per tre mesi. Poi guarda i numeri e aggiusta. Se ti serve una mano anche con la parte organizzativa, leggi [cosa include una gestione social](/blog/gestione-social-attivita-locale-cosa-include).

Se vuoi reel che raccontano davvero la tua attività, dai un'occhiata al nostro [servizio Video & Reels](/video) e agli [shooting fotografici](/shooting) per prodotti e locali. Oppure [raccontaci la tua attività](/contatti): in 24 ore ti diciamo da dove partiremmo.`,
  },
  {
    slug: 'sito-web-o-solo-social-attivita-locale',
    title: 'Sito web o solo social? Perché a un\'attività locale servono entrambi',
    excerpt: 'Cosa fa il sito che i social non fanno, come lavora con la scheda Google (Google Business Profile) e la checklist del sito per un\'attività locale, con il caso Lumina.',
    category: 'Siti web',
    tags: ['sito web', 'seo locale', 'google business profile', 'lead generation'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    updated: '2026-09-28',
    cover: '/blog/sito-web-o-solo-social-attivita-locale/cover.jpg',
    coverAlt: 'Un sito web, un profilo social e la scheda Google di un\'attività collegati tra loro',
    published: true,
    seoTitle: 'Sito web o social? Cosa serve a un\'attività locale | InLab',
    seoDescription: 'Sito web per attività locali: perché servono sia il sito sia i social, come lavora la scheda Google e la checklist per farti trovare e ricevere richieste.',
    content: `Un **sito web per attività locali** serve ancora, anche se hai una pagina Instagram curata e tanti follower? È una domanda legittima: i social sono gratuiti, veloci da aggiornare e le persone ci passano ore. Qui vediamo cosa fa il sito che i social non possono fare, come lavora insieme alla scheda Google e cosa deve avere per portarti clienti.

**Risposta breve: sì, a un'attività locale servono entrambi. I social fanno conoscere e ricordare, il sito ti fa trovare su Google, spiega bene i servizi e trasforma l'interesse in una richiesta. In mezzo c'è la scheda Google (Google Business Profile), che collega le ricerche al tuo sito e al tuo telefono.**

Non è una gara tra strumenti. Sono pezzi dello stesso percorso: una persona ti scopre, ti cerca, ti valuta e alla fine ti contatta. Ogni strumento copre un tratto diverso.

## Cosa fa il sito che i social non fanno

### Ti fa trovare quando qualcuno ti cerca

Quando una persona ha un bisogno preciso, "dentista a Palagiano", "pizzeria aperta la domenica a Massafra", "ottico a Castellaneta", apre Google, non Instagram. I post dei social compaiono raramente in queste ricerche. Un sito con una pagina per ogni servizio, invece, può comparire proprio lì.

### Risponde alle domande prima che te le facciano

Sui social le informazioni scorrono e si perdono. Sul sito restano ordinate: servizi, orari, come arrivare, domande frequenti, come prenotare. Chi arriva sul sito trova risposte e si presenta già deciso.

### È tuo, e resta tuo

C'è anche un motivo pratico: i social possono cambiare regole, ridurre la visibilità o bloccare un profilo. **Il sito e il dominio restano tuoi**, e tutto quello che costruisci lì non si perde.

### Ti permette di misurare

Con un sito puoi sapere quante persone sono arrivate da Google, dai social o dalla scheda Google, e cosa hanno fatto dopo: hanno chiamato, compilato il modulo, chiesto le indicazioni. È la base per capire dove investire tempo e budget.

![Confronto tra sito web e social per un'attività locale: cosa fa ciascuno](/blog/sito-web-o-solo-social-attivita-locale/sito-o-social.webp)

## Serve un sito web se ho già Instagram?

Instagram è ottimo per farti conoscere e per mostrare chi sei ogni giorno. Ma ha tre limiti per un'attività locale:

- **non ti porta chi cerca su Google** un servizio specifico nella tua zona;
- **non ti dà spazio per spiegare bene** servizi, trattamenti, menu o condizioni;
- **non è tuo**: dipendi dalle regole e dall'algoritmo di una piattaforma.

Il modo migliore è farli lavorare insieme. I social portano le persone a conoscerti e le mandano sul sito quando vogliono approfondire o prenotare. Il sito, a sua volta, mostra i contenuti social e rimanda ai profili.

## La scheda Google (Google Business Profile) e come lavora con il sito

La scheda Google è il riquadro che compare su Google e su Maps quando cerchi un'attività: nome, orari, recensioni, foto, pulsanti per chiamare e per le indicazioni. Si chiama **Google Business Profile** ed è gratuita.

Per un'attività locale è spesso il primo contatto, prima ancora del sito. Ma **la scheda non sostituisce il sito**: fino al 2024 Google permetteva di creare un semplice sito dalla scheda, poi ha chiuso questa funzione. Oggi il pulsante "Sito web" della scheda deve portare a un sito vero.

Scheda e sito si rafforzano a vicenda quando:

- **nome, indirizzo e telefono** sono identici su scheda, sito e social;
- le **categorie della scheda** corrispondono alle pagine dei servizi sul sito;
- il link della scheda porta alla **pagina giusta**, non sempre alla home;
- le **recensioni** vengono lette e ricevono risposta;
- le **foto** sono reali e aggiornate.

Dal 2026 puoi anche collegare la scheda a Google Analytics 4 e vedere in un unico posto chiamate, indicazioni stradali e visite al sito. Ti spieghiamo come nella guida su come [collegare Google Business Profile a GA4](/blog/google-business-profile-ga4).

## Checklist: cosa deve avere un sito per un'attività locale

- **Caricamento veloce** e ottima resa da telefono: la maggior parte delle visite arriva da smartphone.
- **Una pagina per ogni servizio principale**, con un titolo chiaro che contiene il servizio e la zona.
- **Contatti sempre visibili**: telefono cliccabile, WhatsApp, modulo breve.
- **Indirizzo, orari e mappa** facili da trovare.
- **Foto reali** dell'attività, dello staff e dei lavori.
- **Recensioni o testimonianze** vere, con il consenso dei clienti.
- **Domande frequenti** scritte con le parole dei tuoi clienti.
- **Testi scritti per le persone** (e quindi anche per Google), senza frasi generiche.
- **Informativa privacy e cookie** in regola.
- **Statistiche attive** per sapere da dove arrivano i contatti.

![Checklist del sito per attività locali: velocità, servizi, contatti, recensioni e scheda Google](/blog/sito-web-o-solo-social-attivita-locale/checklist-sito.webp)

## Un caso reale: Lumina, il sito dello Studio Dentistico Ricciardi

Per lo studio del Dott. Francesco Ricciardi a Palagiano abbiamo realizzato il nuovo sito **Lumina**. L'obiettivo era aumentare la percezione di affidabilità dello studio e trasformarla in richieste concrete di appuntamento.

Il sito ha **una pagina dedicata a ogni trattamento**, così chi cerca un servizio specifico trova subito le informazioni giuste. Intorno al sito abbiamo costruito il resto del percorso: campagne di lead generation, un piano editoriale con contenuti educativi e caroselli informativi, la gestione delle recensioni.

È un buon esempio di come sito e social lavorano insieme: i contenuti social costruiscono fiducia, il sito risponde alle domande e raccoglie le richieste. Trovi tutti i dettagli nel [caso studio Lumina](/casi-studio/ricciardi).

## Gli errori più comuni

- **Un sito "vetrina" con una sola pagina** che dice tutto e niente: Google non sa per cosa mostrarlo.
- **Contatti nascosti** in fondo a una pagina lunga.
- **Informazioni vecchie**: orari non aggiornati, servizi che non offri più.
- **Nessun collegamento tra scheda Google, sito e social.**
- **Nessuna statistica**: non sai se il sito lavora o no.

## Domande frequenti

### Serve un sito web se ho Instagram e la scheda Google?

Sì, se vuoi farti trovare da chi cerca un servizio specifico su Google e avere uno spazio tuo per spiegare e raccogliere richieste. Instagram e la scheda Google sono utilissimi, ma lavorano meglio quando rimandano a un sito ben fatto.

### Google Business Profile può sostituire un sito?

No. La scheda è fondamentale per farti trovare su Google e Maps, ma dal 2024 Google non offre più i siti creati dalla scheda. Il pulsante "Sito web" della scheda deve portare a un sito vero, con le pagine dei tuoi servizi.

### Quante pagine deve avere il sito di un'attività locale?

Almeno una home, una pagina per ogni servizio principale, una pagina contatti con mappa e orari e una pagina chi siamo. È meglio avere poche pagine chiare e aggiornate che tante pagine vuote.

### Il sito aiuta la SEO locale?

Sì. Un sito con pagine dedicate ai servizi e alla zona, dati di contatto coerenti con la scheda Google e contenuti utili aiuta a comparire nelle ricerche locali. La SEO locale lavora sempre insieme alla scheda Google e alle recensioni.

### Quanto tempo serve per vedere un sito su Google?

Un sito nuovo viene di solito indicizzato in qualche giorno o settimana, ma per posizionarsi bene su ricerche competitive servono mesi di contenuti utili e aggiornati. Per le ricerche con il nome dell'attività i tempi sono più brevi.

## Da dove partire

Se hai già social attivi, il passo successivo è dare loro una "casa": un sito semplice, veloce, con i tuoi servizi ben spiegati e collegato alla scheda Google. Per curare anche la parte social, leggi [cosa include una gestione social per attività locali](/blog/gestione-social-attivita-locale-cosa-include).

Se la tua attività è in provincia di Taranto, trovi i dettagli nella pagina sulla [realizzazione di siti web a Taranto](/siti-web-taranto). Oppure scopri il servizio [Siti Web & Web App](/siti-web) e [raccontaci la tua attività](/contatti): in 24 ore ti diciamo da dove partiremmo.`,
  },
  {
    slug: 'tracking-pixel-email-garante',
    title: 'Tracking pixel nelle email e Garante Privacy: come mettere in regola la tua newsletter',
    excerpt: 'Il Garante Privacy equipara i pixel nelle email ai cookie: senza consenso non puoi tracciare chi apre le tue newsletter. Ecco cosa cambia e cosa fare entro fine ottobre 2026.',
    category: 'Strategia',
    tags: ['email marketing', 'newsletter', 'gdpr', 'garante privacy', 'tracking pixel', 'consenso'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/tracking-pixel-email-garante/cover.jpg',
    coverAlt: 'Busta email con un pixel di tracciamento e l\'interruttore del consenso',
    published: true,
    seoTitle: 'Tracking pixel email e Garante: cosa fare ora | InLab',
    seoDescription: 'Tracking pixel email Garante: cosa prevedono le linee guida, quando serve il consenso e la checklist per adeguare la newsletter entro ottobre 2026.',
    content: `Se mandi newsletter o DEM, le linee guida del Garante sui **tracking pixel nelle email** ti riguardano da vicino. Il Garante Privacy ha stabilito che il pixel che registra chi apre i tuoi messaggi va trattato come un cookie: serve il consenso, e il tempo per adeguarsi scade **entro fine ottobre 2026**.

**Risposta breve: se la tua piattaforma registra chi apre ogni singola email, ti serve un consenso specifico, come per i cookie. Hai tempo fino a fine ottobre 2026 per aggiornare moduli, informativa e impostazioni. Senza consenso puoi contare solo le aperture complessive in forma anonima.**

Non è un tema da ufficio legale e basta. Cambia il modo in cui raccogli le iscrizioni, cosa scrivi nell'informativa e perfino come leggi i risultati delle tue campagne. Qui trovi cosa dice il provvedimento, cosa resta permesso e una checklist pratica da seguire.

**In breve**

- I pixel nelle email rientrano nell'art. 122 del Codice privacy, lo stesso regime dei cookie: serve un consenso preventivo, libero, specifico e informato.
- Senza consenso puoi misurare solo il tasso di apertura complessivo in forma anonima, oltre ai pixel per sicurezza e comunicazioni obbligatorie per legge.
- L'utente deve poter togliere solo il tracciamento e continuare a ricevere le email.
- Scadenza per mettersi in regola: entro fine ottobre 2026.
- L'open rate diventerà meno affidabile: conviene spostare l'attenzione su clic, risposte e conversioni.

## Cosa ha deciso il Garante sui tracking pixel nelle email

Partiamo dalla definizione. Un **tracking pixel** è un'immagine minuscola, spesso invisibile, inserita nel corpo dell'email. Quando il destinatario apre il messaggio, il client di posta scarica quell'immagine e la piattaforma di invio registra l'apertura. Quasi tutti gli strumenti di email marketing, da Mailchimp a Brevo a MailUp, usano questo meccanismo per calcolare il tasso di apertura.

Con il [provvedimento del 17 aprile 2026](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10241943), pubblicato in Gazzetta Ufficiale il 29 aprile 2026, il Garante ha adottato linee guida specifiche su questo tema. Il testo concede sei mesi per adeguarsi: la scadenza cade quindi entro fine ottobre 2026.

### Il pixel come un cookie

Il punto centrale è l'inquadramento giuridico. Secondo il Garante, i pixel nelle email rientrano nell'**art. 122 del Codice privacy**, la stessa norma che regola i cookie sui siti. In pratica, leggere informazioni dal dispositivo di chi apre la mail richiede un consenso:

- **preventivo**, cioè raccolto prima di attivare il tracciamento;
- **libero**, senza forzature;
- **specifico**, riferito proprio al tracciamento delle aperture;
- **informato**, dopo aver spiegato in modo chiaro cosa succede.

### Cosa resta permesso senza consenso

Le linee guida individuano tre eccezioni:

1. **Statistica anonima delle aperture.** Puoi contare quante persone hanno aperto una campagna in totale, a patto che i pixel siano uguali per tutti (non individuali) e che indirizzi IP e dati sul client di posta siano anonimizzati.
2. **Sicurezza e autenticazione.** Ad esempio email di attivazione dell'account o di cambio password.
3. **Comunicazioni di servizio obbligatorie per legge.**

Attenzione a un dettaglio che fa la differenza: se la piattaforma conserva il dato di apertura legato al singolo indirizzo, **anche solo per poco tempo**, quel dato non è anonimo. E quindi serve il consenso.

### Informativa e revoca granulare

Chi si iscrive deve capire in modo chiaro che le email contengono pixel e a cosa servono. Inoltre la revoca deve essere semplice e **granulare**: l'utente deve poter scegliere se disiscriversi del tutto oppure togliere solo il tracciamento, continuando a ricevere le tue email senza pixel.

Le regole valgono per chiunque invii email con pixel: aziende, piattaforme di invio (ESP) e provider di posta. Le analisi di [Agenda Digitale](https://www.agendadigitale.eu/sicurezza/privacy/tracking-pixel-nelle-email-sei-mesi-per-mettersi-in-regola/) e [Altalex](https://www.altalex.com/documents/news/2026/05/08/tracking-pixel-comunicazioni-posta-elettronica-nuove-linee-guida) approfondiscono gli aspetti tecnici e giuridici.

## Perché conta anche se mandi "solo" una newsletter al mese

Molte piccole attività pensano che queste regole riguardino solo i grandi e-commerce. Non è così. Se usi una piattaforma di email marketing con le impostazioni standard, con buona probabilità stai già tracciando le aperture individuali di ogni iscritto.

Il 2026 è stato anche un anno di controlli concreti sul marketing. Due casi aiutano a capire l'aria che tira:

- **Altroconsumo Edizioni**, luglio 2026: sanzione da 280 mila euro. Secondo il [provvedimento del Garante](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10275843), la società aveva inviato email promozionali a utenti che non avevano completato la creazione dell'account. Nessuna vendita conclusa, quindi niente "soft spam". A questo si aggiungevano ritardi nel rispondere alle richieste di esercizio dei diritti.
- **Lusha Systems**, data broker attivo nella lead generation B2B, luglio 2026: sanzione da 2 milioni di euro e divieto di trattamento.

Queste sanzioni non riguardano i pixel, ma ribadiscono principi che chi fa email marketing deve conoscere. Li trovi nel box qui sotto.

**Errori da evitare nell'email marketing**

- Usare dati trovati online (profili LinkedIn, siti aziendali) per inviare promozioni come se fossero liberamente utilizzabili: non lo sono.
- Comprare liste di contatti senza verificare che le persone abbiano dato un consenso specifico alla cessione dei loro dati.
- Applicare il "soft spam" a chi non ha mai comprato: vale solo per clienti con una vendita conclusa.
- Perdere le disiscrizioni quando cambi piattaforma o CRM: devono restare valide anche dopo la migrazione.
- Rispondere in ritardo a chi chiede accesso o cancellazione dei propri dati.

## Chi deve adeguare la newsletter: ristoranti, negozi, studi ed e-commerce

L'impatto dipende da come usi le email. Qualche scenario tipico, a titolo di esempio.

**Ristorante o pizzeria.** Mandi una newsletter con il menu della settimana e le serate a tema. Se vuoi sapere chi apre, ti serve il consenso. Se ti basta il dato complessivo, puoi lavorare con statistiche anonime, purché la piattaforma le produca davvero in forma anonima.

**Negozio con carta fedeltà.** Raccogli email in cassa o sul sito. È il momento di rivedere il modulo di iscrizione: oltre al consenso al marketing, serve una scelta separata e chiara sul tracciamento delle aperture.

**Studio professionale (dentista, commercialista, avvocato).** Le email di promemoria appuntamento e le comunicazioni di servizio vanno distinte dalle newsletter informative. Solo le comunicazioni obbligatorie per legge rientrano nell'eccezione: le altre seguono la regola generale.

**E-commerce.** È il caso più delicato, perché spesso le automazioni (carrello abbandonato, email di benvenuto, riattivazione) si basano proprio sulle aperture individuali. Se un flusso scatta quando qualcuno apre o non apre una mail, va ripensato per chi non ha dato il consenso.

### Il tasso di apertura diventa meno affidabile

C'è un effetto collaterale che riguarda tutti: l'**open rate** perderà valore come indicatore. Una parte degli iscritti non darà il consenso, quindi le aperture misurate saranno parziali.

Secondo noi è un'occasione per misurare meglio. Clic, risposte, prenotazioni, vendite e visite al sito dicono molto di più sul valore di una newsletter rispetto a un'apertura, che non garantisce nemmeno che il messaggio sia stato letto. Se il tuo obiettivo è portare persone sul sito, ti conviene [misurare cosa arriva dal sito in GA4](/blog/google-business-profile-ga4) e collegare le campagne ai risultati reali.

## Tracking pixel nelle email: cosa fare entro fine ottobre 2026

Ecco una checklist operativa. Non sostituisce il parere del tuo consulente privacy, ma ti aiuta a non arrivare impreparato.

1. **Mappa dove usi i pixel.** Elenca newsletter, DEM, automazioni ed email transazionali. Per ciascuna chiediti: c'è un pixel? Serve davvero?
2. **Verifica come lavora la tua piattaforma.** Controlla se il tracciamento delle aperture è individuale e se esistono opzioni per disattivarlo o renderlo anonimo. Se il dato resta legato all'indirizzo, anche per poco, non è anonimo.
3. **Separa le email di servizio.** Attivazione account, cambio password e comunicazioni obbligatorie per legge possono restare fuori dalla regola del consenso. Le promozioni no.
4. **Aggiorna i moduli di iscrizione.** Aggiungi una richiesta di consenso specifica per il tracciamento, separata da quella al marketing e non preselezionata. Se i tuoi form sono sul sito, è il momento di rivederli insieme a chi gestisce i tuoi [siti web e landing page](/siti-web).
5. **Riscrivi l'informativa.** Spiega in parole semplici cosa sono i pixel, cosa registrano e come rinunciarvi.
6. **Rendi la revoca granulare.** Nel footer delle email e nel centro preferenze devono esserci due strade: disiscrizione completa oppure stop al solo tracciamento.
7. **Gestisci la base iscritti esistente.** Per chi è già in lista e non ha dato un consenso specifico al tracciamento, valuta con il tuo consulente se inviare email senza pixel o chiedere il consenso.
8. **Rivedi KPI e automazioni.** Sostituisci i flussi basati sulle aperture con trigger legati a clic, acquisti o azioni sul sito. Se usi [automazioni e chatbot AI](/automazioni-ai) collegati al CRM, controlla che rispettino le nuove scelte degli utenti.

![Checklist in sei punti per adeguare la newsletter ai tracking pixel entro ottobre](/blog/tracking-pixel-email-garante/checklist-newsletter-tracking-pixel.webp)

## Un esempio concreto: la newsletter di un negozio di arredamento

Facciamo un esempio ipotetico. Un negozio di arredamento in provincia di Taranto invia due newsletter al mese con novità e promozioni a circa duemila iscritti, raccolti in negozio e dal sito. La piattaforma registra le aperture per ogni contatto e c'è un'automazione che rimanda la stessa email a chi non l'ha aperta.

Per adeguarsi, il negozio:

- aggiunge al form del sito una casella separata per il consenso al tracciamento;
- aggiorna l'informativa con una sezione dedicata ai pixel;
- inserisce nel footer un link "ricevi le email senza tracciamento";
- per chi non ha dato il consenso, invia le email senza pixel e sostituisce l'automazione "non ha aperto" con un invio programmato uguale per tutti;
- inizia a valutare le campagne in base ai clic sui prodotti e alle richieste di preventivo.

Il risultato è una newsletter meno "spiata", ma più facile da difendere in caso di controllo e misurata su numeri che contano davvero.

## Come lo affrontiamo con i nostri clienti

Quando rivediamo l'email marketing di un'attività locale, partiamo sempre dallo stesso punto: da dove arrivano i contatti e cosa è stato detto alle persone quando si sono iscritte. Spesso la lista nasce in modi diversi (il modulo del sito, la cassa del negozio, un evento) e ogni fonte va controllata a parte.

Il secondo passo è guardare la newsletter con gli occhi di chi la riceve. Una mail utile, con un'offerta chiara e un link che porta dove promette, funziona anche senza sapere chi l'ha aperta. È lo stesso principio che applichiamo quando progettiamo [siti web e landing page](/siti-web): misurare le azioni vere, come una richiesta di preventivo o una prenotazione, invece delle metriche di vanità.

## Domande frequenti

### Cosa sono i tracking pixel nelle email?

Sono immagini minuscole, di solito invisibili, inserite nel corpo dell'email. Quando il destinatario apre il messaggio, l'immagine viene scaricata e la piattaforma registra l'apertura, spesso collegandola al singolo indirizzo.

### Entro quando bisogna adeguarsi alle linee guida del Garante?

Il provvedimento del 17 aprile 2026 è stato pubblicato in Gazzetta Ufficiale il 29 aprile 2026 e concede sei mesi per mettersi in regola. La scadenza cade quindi entro fine ottobre 2026.

### Posso ancora misurare il tasso di apertura senza consenso?

Sì, ma solo come conteggio statistico anonimo e complessivo: pixel uguali per tutti, non individuali, e indirizzi IP e dati del client anonimizzati. Se la piattaforma lega l'apertura al singolo indirizzo, anche per poco tempo, serve il consenso.

### Le email transazionali e di servizio sono coinvolte?

Le linee guida ammettono senza consenso i pixel usati per sicurezza e autenticazione, come attivazione dell'account o cambio password, e quelli nelle comunicazioni di servizio obbligatorie per legge. Per tutto il resto vale la regola del consenso.

### Cosa succede se un utente revoca solo il consenso al tracciamento?

Deve poter continuare a ricevere le tue email, ma senza pixel. Le linee guida chiedono una revoca semplice e granulare: disiscrizione completa oppure stop al solo tracciamento.

## Mettere in regola la newsletter senza perdere i risultati

Le linee guida del Garante sui tracking pixel non vietano l'email marketing: chiedono trasparenza e scelte reali per chi riceve i tuoi messaggi. Il primo passo pratico è semplice: apri la tua piattaforma di invio, verifica come registra le aperture e aggiorna form e informativa prima di fine ottobre 2026.

Il 2026 porta novità anche su altri fronti, come gli [obblighi sui contenuti generati con l'AI](/blog/contenuti-ai-obblighi-ai-act). Se vuoi rivedere form, automazioni e metriche delle tue campagne email, [parliamone](/contatti): possiamo aiutarti a impostare un sistema chiaro e misurabile.

*Questo articolo ha scopo informativo e non sostituisce una consulenza legale. Per valutare il tuo caso specifico rivolgiti a un professionista della protezione dei dati.*

**Fonti**

- [Linee guida sui tracking pixel nelle comunicazioni di posta elettronica, provvedimento del 17 aprile 2026 – Garante per la protezione dei dati personali, aprile 2026](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10241943)
- [Comunicato sulle linee guida sui tracking pixel nelle email – Garante per la protezione dei dati personali, 2026](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10241977)
- [Tracking pixel nelle email: sei mesi per mettersi in regola – Agenda Digitale, 2026](https://www.agendadigitale.eu/sicurezza/privacy/tracking-pixel-nelle-email-sei-mesi-per-mettersi-in-regola/)
- [Tracking pixel nelle comunicazioni di posta elettronica: le nuove linee guida – Altalex, 8 maggio 2026](https://www.altalex.com/documents/news/2026/05/08/tracking-pixel-comunicazioni-posta-elettronica-nuove-linee-guida)
- [Provvedimento sanzionatorio nei confronti di Altroconsumo Edizioni – Garante per la protezione dei dati personali, luglio 2026](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10275843)`,
  },
  {
    slug: 'contenuti-ai-obblighi-ai-act',
    title: 'Contenuti generati con AI: obblighi di trasparenza tra AI Act e legge italiana',
    excerpt: 'Dal 2 agosto 2026 l\'articolo 50 dell\'AI Act impone trasparenza su chatbot, deepfake e contenuti sintetici. Ecco cosa cambia per chi usa l\'AI per post, ads e immagini, anche alla luce della legge italiana 132/2025.',
    category: 'Strategia',
    tags: ['intelligenza artificiale', 'ai act', 'legge 132/2025', 'deepfake', 'chatbot', 'contenuti ai'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/contenuti-ai-obblighi-ai-act/cover.jpg',
    coverAlt: 'Post social con l\'etichetta "Creato con AI" su un\'immagine generata',
    published: true,
    seoTitle: 'Contenuti AI: obblighi AI Act e legge italiana | InLab',
    seoDescription: 'Contenuti generati con AI: obblighi dell\'AI Act art. 50 dal 2 agosto 2026 e della legge 132/2025. Cosa etichettare, chatbot, deepfake e checklist per PMI.',
    content: `Se usi ChatGPT per i post, un generatore di immagini per le ads o un chatbot sul sito, devi conoscere gli obblighi sui **contenuti generati con AI**. Dal 2 agosto 2026 si applica l'articolo 50 dell'AI Act europeo, che introduce regole di trasparenza su chatbot, deepfake e contenuti sintetici.

In Italia, poi, è già in vigore dal 10 ottobre 2025 la legge 132/2025 sull'intelligenza artificiale, con norme su professionisti, diritto d'autore e deepfake. In questo articolo mettiamo ordine: cosa è obbligatorio, cosa no e come organizzarti senza rinunciare agli strumenti AI.

**In breve**

- Dal 2 agosto 2026 l'articolo 50 dell'AI Act impone trasparenza su chatbot, contenuti sintetici e deepfake.
- Anche l'azienda che si limita a usare uno strumento AI (il "deployer") ha obblighi, soprattutto sui deepfake.
- I testi su temi di interesse pubblico non vanno etichettati se c'è revisione umana e una persona ne è responsabile.
- La legge italiana 132/2025 obbliga i professionisti a informare i clienti sull'uso dell'AI e punisce i deepfake dannosi con la reclusione da 1 a 5 anni.
- Un logo o un'immagine generati al 100% dall'AI potrebbero non essere tutelati dal diritto d'autore.

## Contenuti generati con AI: cosa chiede l'articolo 50 dell'AI Act

L'AI Act (Regolamento UE 2024/1689) è la normativa europea sull'intelligenza artificiale. L'**articolo 50** riguarda la trasparenza: in parole semplici, le persone devono sapere quando parlano con una macchina o guardano un contenuto creato da una macchina. Questi obblighi si applicano dal **2 agosto 2026**. Il 20 luglio 2026 la Commissione europea ha adottato le [linee guida finali](https://digital-strategy.ec.europa.eu/en/news/commission-publishes-guidelines-transparency-obligations-providers-and-deployers-certain-ai-systems) per interpretarli.

### I quattro ambiti della trasparenza

Il [testo dell'articolo 50](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50) copre quattro situazioni:

1. **Chatbot e sistemi che interagiscono con le persone**: devono rendere chiaro che si tratta di un'AI.
2. **Marcatura dei contenuti sintetici** (art. 50, paragrafo 2): immagini, audio, video e testi generati devono avere un contrassegno leggibile da una macchina, come un watermark o metadati. Questo obbligo è a carico dei **fornitori**, cioè di chi sviluppa lo strumento.
3. **Riconoscimento delle emozioni e categorizzazione biometrica**: un ambito specifico, che raramente riguarda una piccola attività.
4. **Deepfake e testi su temi di interesse pubblico** (art. 50, paragrafo 4): obblighi a carico dei **deployer**.

### Chi è il "deployer"

Qui c'è il punto che interessa di più alle PMI. Il deployer non è solo una grande azienda tecnologica: è **chiunque usi un sistema AI** nella propria attività. Se il tuo negozio crea un'immagine con un generatore AI e la pubblica su Instagram, per l'AI Act sei un deployer.

### Deepfake: quando va dichiarato

Per deepfake si intendono immagini, audio o video che **somigliano a persone, luoghi o eventi reali** e che possono sembrare autentici. In questi casi serve una dichiarazione chiara e visibile al primo contatto con il contenuto.

Se l'opera è chiaramente artistica, satirica o di finzione, la dichiarazione può essere attenuata, ad esempio inserita nei materiali di accompagnamento, senza rovinare la fruizione.

### Testi generati con AI

I testi prodotti con l'AI su temi di interesse pubblico vanno dichiarati. L'etichetta però **non serve** se c'è una revisione umana o un controllo editoriale e una persona ne ha la responsabilità. Per chi usa l'AI come aiuto e poi rilegge, corregge e firma, è una distinzione importante.

### Il Digital Omnibus: cosa è stato rinviato e cosa no

Il [Digital Omnibus sull'AI](https://digital-strategy.ec.europa.eu/en/news/ai-omnibus-enters-force), in vigore dal 27 luglio 2026, ha modificato alcune scadenze. Ma **non rinvia l'articolo 50** in generale. Le novità principali:

- per il watermark (art. 50, paragrafo 2), i sistemi già sul mercato prima del 2 agosto 2026 hanno tempo fino al **2 dicembre 2026**;
- gli obblighi per i sistemi ad alto rischio slittano al **2 dicembre 2027** per quelli dell'Allegato III (ad esempio selezione del personale e credit scoring) e al **2 agosto 2028** per quelli dell'Allegato I;
- l'obbligo di alfabetizzazione AI (art. 4) è stato ammorbidito: ora si chiede di "adottare misure per favorire" le competenze, invece di "garantire un livello sufficiente".

![Le scadenze di AI Act e legge italiana sull'AI dal 2025 al 2027](/blog/contenuti-ai-obblighi-ai-act/scadenze-ai-act-legge-italiana.webp)

### Il codice di condotta UE e l'etichetta comune

Il 10 giugno 2026 la Commissione ha pubblicato la versione finale del [codice di condotta sulla marcatura e l'etichettatura dei contenuti AI](https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content). L'adesione è volontaria e prevede un'icona UE comune o etichette equivalenti. Il 28 luglio 2026 [Meta ha annunciato](https://about.fb.com/news/2026/07/meta-is-signing-the-eu-ai-act-code-of-practice-on-transparency-of-ai-generated-content/) che lo firmerà.

## La legge italiana sull'AI: cosa aggiunge

La [legge 23 settembre 2025, n. 132](https://www.gazzettaufficiale.it/eli/id/2025/09/25/25G00143/sg), in vigore dal 10 ottobre 2025, affianca l'AI Act con alcune regole nazionali:

- **Professioni intellettuali (art. 13)**: l'AI può essere usata solo come supporto, con prevalenza del lavoro del professionista. Il cliente va informato in modo chiaro.
- **Deepfake come reato**: il nuovo art. 612-quater del codice penale punisce la diffusione illecita di contenuti generati o alterati con AI che causa un danno ingiusto, con la reclusione da 1 a 5 anni.
- **Diritto d'autore**: sono protette solo le opere con un apporto creativo umano.
- **Minori**: sotto i 14 anni serve il consenso dei genitori.

## Sanzioni e fiducia: perché riguarda anche una piccola attività

Le sanzioni previste dall'AI Act per le violazioni della trasparenza arrivano fino a **15 milioni di euro o al 3% del fatturato mondiale**. Ma secondo noi il rischio più concreto per una PMI è un altro: la fiducia.

Un cliente che scopre che la "recensione video" o il "prima e dopo" erano generati con l'AI senza dirlo difficilmente torna. La trasparenza, al contrario, può diventare un segno di serietà. E la tendenza delle piattaforme va nella stessa direzione, come mostra l'adesione annunciata da Meta al codice di condotta.

### Esempi per settore: quando serve l'etichetta e quando no

Qualche scenario, a titolo di esempio.

**Ristorante.** Usi l'AI per scrivere le didascalie dei post e poi le rileggi: nessuna etichetta obbligatoria. Se invece generi una foto realistica della tua sala piena di clienti che non ci sono mai stati, il contenuto raffigura un luogo reale e può sembrare autentico: va dichiarato.

**Negozio o e-commerce.** Immagini prodotto ambientate create con l'AI, modelle virtuali, video promozionali: se sono realistici e possono essere scambiati per reali, serve un'etichetta chiara. Vale anche per le [campagne Meta Ads](/meta-ads), dove le creatività AI sono sempre più diffuse (ne parliamo nell'articolo su [creatività e Advantage+ nelle Meta Ads](/blog/meta-ads-creativita-advantage)).

**Studio professionale.** Commercialisti, avvocati, consulenti e altri professionisti intellettuali che usano l'AI per bozze, ricerche o analisi devono rispettare l'art. 13 della legge 132/2025: il lavoro del professionista deve restare prevalente e il cliente va informato.

**Qualsiasi attività con un chatbot.** L'assistente sul sito o su WhatsApp deve presentarsi come AI. Se stai valutando di introdurne uno, conviene progettarlo così fin dall'inizio: è quello che facciamo quando sviluppiamo [chatbot e automazioni AI](/automazioni-ai).

## Contenuti generati con AI: la checklist per social, sito e annunci

1. **Scrivi una policy interna "contenuti AI".** Anche una pagina: quali strumenti usate, per cosa, chi rivede i contenuti e quando si etichetta.
2. **Etichetta immagini, video e audio realistici.** Se un contenuto AI rappresenta persone, luoghi o eventi che sembrano reali, aggiungi una dichiarazione visibile, ad esempio "Immagine generata con AI" sul visual o all'inizio della didascalia.
3. **Fai presentare il chatbot come AI.** Un messaggio di benvenuto chiaro basta: "Ciao, sono l'assistente virtuale di…, un sistema di intelligenza artificiale".
4. **Non rimuovere metadati e watermark.** Quando scarichi un contenuto da uno strumento AI, evita di cancellare i contrassegni inseriti dal fornitore.
5. **Mantieni la revisione umana sui testi.** Rileggi, correggi e assegna la responsabilità di ogni contenuto a una persona.
6. **Se sei un professionista, aggiorna l'informativa clienti.** Spiega in modo chiaro se e come usi l'AI nel tuo lavoro.
7. **Garantisci l'apporto umano sui brand asset.** Logo, mascotte, payoff: l'AI può aiutare a esplorare idee, ma il lavoro creativo deve restare umano. Un logo generato al 100% dall'AI potrebbe non essere tutelabile. È un tema che affrontiamo in ogni progetto di [branding](/branding).

## Un esempio: il "testimonial" AI di un centro estetico

Facciamo un esempio ipotetico. Un centro estetico vuole lanciare una promozione e crea con l'AI un video di una "cliente soddisfatta" molto realistica che racconta il trattamento. Nessuna persona reale ha girato quel video.

Il contenuto somiglia a una persona reale e può sembrare autentico: rientra nella definizione di deepfake. Va quindi dichiarato in modo chiaro e visibile fin dal primo contatto, ad esempio con una scritta sul video. Senza dichiarazione, il centro rischia sanzioni e, soprattutto, di perdere credibilità con le clienti.

Il nostro consiglio: per le testimonianze, usa clienti veri con il loro consenso. Riserva l'AI a contenuti in cui l'origine sintetica è evidente o dichiarata.

## Come usiamo l'AI in agenzia

Anche noi usiamo strumenti di AI generativa: per esplorare idee, preparare bozze, varianti di testo o mockup. La regola che ci siamo dati è semplice: l'AI accelera il lavoro, ma le scelte creative e la verifica finale restano a una persona del team.

Per un'attività locale la trasparenza è anche una questione di fiducia. Facciamo un esempio: un ristorante di Castellaneta Marina che pubblica foto dei piatti generate con l'AI rischia di deludere il cliente quando il piatto arriva al tavolo. Per questo, quando possibile, preferiamo [shooting fotografici](/shooting) reali per prodotti e locali. Teniamo l'AI per grafiche e usi dove è chiaro che non si tratta di una foto.

## Domande frequenti

### Devo scrivere "generato con AI" su ogni post creato con ChatGPT?

Non necessariamente. Per i testi su temi di interesse pubblico l'etichetta non serve se c'è revisione umana e una persona ne ha la responsabilità editoriale. L'obbligo più netto riguarda immagini, audio e video realistici che possono sembrare autentici, cioè i deepfake.

### Da quando si applicano gli obblighi dell'articolo 50 dell'AI Act?

Dal 2 agosto 2026. Il Digital Omnibus sull'AI non ha rinviato l'articolo 50 in generale: solo per il watermark dei sistemi già sul mercato prima di quella data c'è tempo fino al 2 dicembre 2026, e riguarda i fornitori degli strumenti.

### Il chatbot sul mio sito deve dire che è un'intelligenza artificiale?

Sì. I sistemi che interagiscono con le persone devono rendere chiaro che si tratta di un'AI. Il modo più semplice è un messaggio di benvenuto esplicito all'apertura della chat.

### Un logo creato con l'AI è protetto dal diritto d'autore?

La legge italiana 132/2025 tutela solo le opere con un apporto creativo umano. Un logo generato al 100% dall'AI potrebbe quindi non essere tutelabile: per i brand asset conviene che il lavoro creativo resti umano.

### Quali sanzioni prevede l'AI Act per chi non rispetta la trasparenza?

Per le violazioni degli obblighi di trasparenza sono previste sanzioni fino a 15 milioni di euro o al 3% del fatturato mondiale annuo.

## Usare l'AI, ma in modo trasparente

L'AI resta uno strumento utile per creare contenuti più velocemente. Le nuove regole non lo vietano: chiedono di essere chiari con chi guarda, legge o chatta con te. Il primo passo pratico è fare l'elenco dei contenuti AI che pubblichi oggi e decidere quali vanno etichettati.

Se hai una newsletter, dai un'occhiata anche alle nuove regole sui [tracking pixel nelle email](/blog/tracking-pixel-email-garante). E se vuoi impostare una policy sui contenuti AI o un chatbot trasparente per la tua attività, [parliamone](/contatti).

*Questo articolo ha scopo informativo e non sostituisce una consulenza legale. Per valutare il tuo caso specifico rivolgiti a un professionista.*

**Fonti**

- [Commission publishes guidelines on transparency obligations for providers and deployers of certain AI systems – Commissione europea, 20 luglio 2026](https://digital-strategy.ec.europa.eu/en/news/commission-publishes-guidelines-transparency-obligations-providers-and-deployers-certain-ai-systems)
- [AI Act, Article 50: Transparency obligations – AI Act Service Desk, Commissione europea](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50)
- [AI Omnibus enters into force – Commissione europea, 27 luglio 2026](https://digital-strategy.ec.europa.eu/en/news/ai-omnibus-enters-force)
- [Commission publishes Code of Practice on marking and labelling of AI-generated content – Commissione europea, 10 giugno 2026](https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content)
- [Legge 23 settembre 2025, n. 132 – Gazzetta Ufficiale, 25 settembre 2025](https://www.gazzettaufficiale.it/eli/id/2025/09/25/25G00143/sg)
- [Meta is signing the EU AI Act Code of Practice on transparency of AI-generated content – Meta, 28 luglio 2026](https://about.fb.com/news/2026/07/meta-is-signing-the-eu-ai-act-code-of-practice-on-transparency-of-ai-generated-content/)`,
  },
  {
    slug: 'ai-overviews-search-console-report',
    title: 'Report AI Overviews in Search Console: cosa mostra e come usarlo davvero',
    excerpt: 'Google ha aggiunto a Search Console un report sulle impressioni in AI Overviews e AI Mode, un controllo per escludersi e il nuovo tipo di ricerca multimodale. Ecco come leggerli e cosa fare.',
    category: 'Siti web',
    tags: ['search console', 'ai overviews', 'ai mode', 'google lens', 'seo', 'analytics'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/ai-overviews-search-console-report/cover.jpg',
    coverAlt: 'Schermata semplificata di Search Console con grafico delle impressioni in AI Overviews e AI Mode',
    published: true,
    seoTitle: 'Report AI Overviews in Search Console: guida | InLab',
    seoDescription: 'Report AI Overviews in Search Console: come leggere le impressioni in AI Mode e Discover, quando conviene escludersi e cosa fare subito per la tua PMI.',
    content: `Fino a pochi mesi fa capire se il tuo sito compariva nelle risposte AI di Google era quasi impossibile. Oggi il **report AI Overviews in Search Console** (il nome ufficiale è "Generative AI performance") ti dice quante volte le tue pagine vengono mostrate nelle AI Overviews, in AI Mode e in Discover.

È una novità che conta per un motivo semplice: una parte crescente delle ricerche passa da lì. E se non misuri, decidi a sensazione. In questa guida vediamo cosa mostra il report, cosa non mostra, quando ha senso (quasi mai) escludersi e cosa fare in pratica.

**In breve**

- Search Console ha un nuovo report con le impressioni del tuo sito in AI Overviews, AI Mode e Discover. Niente clic, solo impressioni.
- Dalle Impostazioni puoi scegliere se includere o escludere il sito dalle funzioni di AI generativa di Google.
- Dal 24 settembre 2026 c'è anche il tipo di ricerca "multimodal": Google Lens, Cerchia e Cerca e ricerche per immagine.
- Per una PMI escludersi quasi sempre non conviene: meglio usare i dati per capire quali pagine funzionano.
- Foto originali e dati strutturati prodotto diventano ancora più importanti.

## Il report AI Overviews in Search Console: cosa c'è di nuovo

Search Console è lo strumento gratuito di Google che mostra come il tuo sito si comporta nella Ricerca: per quali parole compare, quanti clic riceve, eventuali errori. Nel 2026 si è arricchito di tre novità legate all'intelligenza artificiale.

### Il report "Generative AI performance"

Google lo ha [annunciato il 3 giugno 2026](https://blog.google/products-and-platforms/products/search/new-controls-website-owners/), inizialmente in test su un gruppo di siti del Regno Unito. Il 31 agosto 2026 è stato esteso a tutti i siti nel mondo, quindi anche al tuo.

Il report mostra le **impressioni**, cioè quante volte una tua pagina è stata mostrata, nelle funzioni di AI generativa:

- **AI Overviews**, i riassunti generati dall'AI in cima ai risultati di Google;
- **AI Mode**, la modalità di ricerca conversazionale;
- un report dedicato a **Discover**, il feed di contenuti consigliati sul telefono.

Puoi filtrare i dati per Pagine (l'URL canonico, cioè la versione "ufficiale" della pagina), Paesi, Dispositivi (solo per la Ricerca) e Date, con granularità oraria, giornaliera, settimanale o mensile. C'è l'export, con un limite di 1.000 righe. I dettagli sono nella [documentazione ufficiale del report](https://support.google.com/webmasters/answer/16984139).

Tre cose da sapere subito:

1. **Non ci sono i clic.** Solo impressioni.
2. **Le impressioni AI restano anche nel report Prestazioni generale.** Il nuovo report le isola, non le aggiunge.
3. **Gli esperimenti di Search Labs sono esclusi** dai dati.

### Il controllo "Search generative AI"

Nelle Impostazioni di Search Console trovi la voce "Search generative AI" con tre opzioni: **Includi** (predefinita), **Escludi**, **Eredita dalla proprietà padre**.

Se scegli Escludi, Google non mostra link al tuo sito nelle funzioni AI e non usa i tuoi contenuti per il "grounding", cioè per ancorare le risposte dell'AI a fonti reali. Risultato: zero impressioni e zero traffico da AI Overviews, AI Mode e AI in Discover. L'effetto arriva in 1-2 giorni, a volte di più.

Secondo [Google](https://support.google.com/webmasters/answer/16908024) il controllo non è usato come segnale di ranking al di fuori delle funzioni AI. Non riguarda l'addestramento dei modelli (per quello esiste Google-Extended) né l'app Gemini.

### Il tipo di ricerca "multimodal"

Dal [24 settembre 2026](https://developers.google.com/search/blog/2026/09/web-multimodal-in-sc) nei report Prestazioni e Generative AI compare un nuovo tipo di ricerca: "multimodal". Comprende le ricerche fatte con Google Lens, con Cerchia e Cerca su Android, caricando un'immagine su Google Search e con "Cerca questa immagine" dal tasto destro di Chrome.

Nel report Gen AI trovi quindi due voci: "Web: text-based" (ricerche scritte) e "Web: multimodal" (ricerche per immagine). Il rollout è globale, ma vedi dati solo se il tuo sito riceve davvero quel traffico.

### Bonus: le platform properties

Dal [29 luglio 2026](https://developers.google.com/search/blog/2026/07/platform-properties-social-video-guide) Search Console permette anche di misurare come rendono su Search, Discover e News i profili e i post di Instagram, TikTok, X e YouTube. Se curi la [gestione dei social](/gestione-social), è un dato in più da tenere d'occhio.

## Perché è importante misurare la visibilità nelle risposte AI

I numeri li dà Google stesso: le AI Overviews superano i 2,5 miliardi di utenti attivi mensili, AI Mode supera il miliardo di utenti mensili. Sono dati globali, non solo italiani. Ma [AI Mode è disponibile in Italia e in italiano dall'8 ottobre 2025](https://blog.google/intl/it-it/ai-mode-arriva-anche-in-italia/), quindi riguarda anche i tuoi clienti.

Finora molti siti vedevano calare i clic senza capire perché. Il report non risolve tutto, perché i clic dalle risposte AI non sono separati. Però ti dice almeno una cosa preziosa: **quali pagine Google considera abbastanza utili da mostrarle nelle risposte AI**.

È un'informazione che prima dovevi indovinare. Ora puoi usarla per decidere su cosa investire.

### Cosa guardare nel report se hai un ristorante, un negozio o uno studio

Il report è uguale per tutti, ma cosa guardare cambia in base al tipo di attività. Qualche esempio.

**Ristorante o pizzeria.** Le ricerche per immagine contano: chi fotografa un piatto o un locale con Lens può arrivare a te. Foto originali del menu, dei piatti e della sala valgono più di qualsiasi immagine stock. Per la visibilità locale, lavora anche su [Google Business Profile e SEO locale](/blog/google-business-profile-ga4).

**Negozio di moda o arredamento.** Qui la voce "Web: multimodal" può diventare interessante. Chi vede un divano o una giacca e lo inquadra con il telefono cerca un prodotto simile. Se le tue schede hanno foto tue, chiare e ben descritte, hai più possibilità di comparire.

**Studio professionale (dentista, avvocato, commercialista).** Le domande informative ("quanto dura un impianto?", "cosa serve per aprire la partita IVA?") sono terreno delle AI Overviews. Guarda quali pagine del sito compaiono e quali no: ti dice dove i contenuti sono chiari e dove serve lavorare.

**E-commerce.** Controlla che le pagine prodotto abbiano dati strutturati corretti (il codice che descrive a Google prezzo, disponibilità, recensioni) e immagini originali. Sono due leve concrete, anche per la ricerca multimodale.

**Turismo e ospitalità.** B&B, agriturismi, lidi: chi cerca un posto spesso parte da una foto. Immagini vere del luogo, non generiche, sono un investimento che si ripaga anche qui.

### Conviene escludersi dalle AI Overviews?

Il nostro consiglio: **per una PMI quasi mai**. Escludersi significa rinunciare a impressioni e traffico da AI Overviews, AI Mode e AI in Discover, e i tuoi contenuti non verranno usati come fonte per le risposte.

Può avere senso valutarlo in casi molto specifici, per esempio se vendi contenuti a pagamento che l'AI rischia di riassumere al posto tuo. Ma per un'attività locale o un professionista, che vive di visibilità, di solito è un autogol. Ricorda comunque che la scelta è reversibile.

## Come leggere il report AI Overviews passo passo

Ecco un metodo semplice, che puoi seguire anche se non sei un esperto di SEO.

1. **Apri il report.** Entra in Search Console, seleziona la tua proprietà e cerca il report "Generative AI performance". Se hai più proprietà, verifica anche l'impostazione "Search generative AI" in Impostazioni.
2. **Guarda le pagine che compaiono.** Filtra per Pagine e ordina per impressioni. Sono le pagine che Google usa di più nelle risposte AI. Spesso non sono quelle che ti aspetti.
3. **Confronta con i clic.** Apri il report Prestazioni generale sulle stesse pagine. Se una pagina ha tante impressioni AI ma pochi clic, forse la risposta dell'AI basta già all'utente: valuta di aggiungere qualcosa che l'AI non può dare (preventivo, prenotazione, casi reali, foto tue).
4. **Segui l'andamento settimanale.** La granularità giornaliera è molto "rumorosa". Quella settimanale ti mostra le tendenze vere, senza farti preoccupare per un calo di un giorno.
5. **Annota le modifiche.** Ogni volta che pubblichi o aggiorni una pagina, segnalo con le annotazioni di Search Console o in un foglio condiviso. Dopo qualche settimana capirai cosa funziona.

![Checklist in 5 passi per leggere il report Generative AI performance di Search Console](/blog/ai-overviews-search-console-report/come-leggere-report-ai-overviews.webp)

### Tre controlli da fare subito

- **Immagini originali.** Sostituisci le foto stock nelle pagine chiave con foto vere dei tuoi prodotti, del locale, del team. Se ti serve una mano, il nostro [servizio di shooting fotografico](/shooting) nasce proprio per questo.
- **Dati strutturati prodotto.** Se hai un e-commerce, verifica che le schede prodotto abbiano il markup corretto e senza errori in Search Console.
- **Impostazione AI.** Controlla che il sito sia su "Includi" (o "Eredita" da una proprietà che include). Capita che qualcuno lo cambi senza pensarci.

## Un esempio pratico (ipotetico)

Facciamo un esempio: un negozio di arredamento di Taranto con un piccolo e-commerce. Aprendo il report scopre che la pagina più mostrata nelle AI Overviews non è una scheda prodotto, ma una guida su come scegliere il divano per un soggiorno piccolo.

Nel report Prestazioni, però, quella guida riceve pochi clic. Il titolare decide di arricchirla: aggiunge foto scattate in negozio, due ambienti reali allestiti e un link diretto ai modelli disponibili. Poi annota la data della modifica e segue l'andamento settimanale per un mese.

Nel frattempo nota qualche impressione su "Web: multimodal" per le schede con foto proprie, e decide di rifare anche quelle con immagini originali. Non è una formula magica: è un modo di prendere decisioni sui dati invece che a sensazione.

Per capire come scrivere contenuti che Google considera utili nelle risposte AI, leggi anche la nostra guida su [cosa dice davvero Google sulla SEO per l'intelligenza artificiale](/blog/seo-ai-overviews-geo-google).

## Cosa guardiamo noi nei report dei clienti

Quando seguiamo il sito di un'attività, il report sull'AI non sostituisce quello classico: lo affianchiamo. Ci interessa capire quali pagine compaiono nelle risposte AI e se sono le stesse che portano clic e contatti.

Facciamo un esempio. Un B&B tra Ginosa Marina e Castellaneta Marina potrebbe comparire nelle AI Overviews con la pagina sulle spiagge vicine, mentre le prenotazioni arrivano dalla pagina delle camere. È un'informazione utile: dice quali contenuti costruiscono visibilità e quali la trasformano in richieste. Nel [caso studio dello Studio Dentistico Ricciardi](/casi-studio/ricciardi) il sito è stato progettato proprio così, con pagine dedicate ai singoli trattamenti.

## Domande frequenti

### Il report AI di Search Console mostra anche i clic?

No. Il report Generative AI performance mostra solo le impressioni nelle AI Overviews, in AI Mode e in Discover. Per i clic devi guardare il report Prestazioni generale e confrontare i due dati pagina per pagina.

### Le impressioni AI vengono contate due volte?

Le impressioni ottenute nelle funzioni di AI generativa restano conteggiate anche nel report Prestazioni generale. Il report dedicato serve a isolarle, non a sommarle al totale.

### Se escludo il mio sito dalle AI Overviews perdo posizioni su Google?

Secondo Google il controllo non viene usato come segnale di ranking al di fuori delle funzioni AI. Però, se escludi il sito, azzeri impressioni e traffico da AI Overviews, AI Mode e AI in Discover.

### Escludere il sito blocca anche l'addestramento dei modelli di Google?

No. Il controllo di Search Console non riguarda l'addestramento dei modelli, per cui esiste Google-Extended, e non riguarda l'app Gemini.

### Cosa significa "Web: multimodal" nel report?

Sono le ricerche fatte con immagini: Google Lens, Cerchia e Cerca su Android, upload di immagini su Google e "Cerca questa immagine" in Chrome. Vedi dati solo se il tuo sito riceve quel tipo di traffico.

## Conclusione: misura prima di decidere

Il report AI Overviews in Search Console non ti dà tutte le risposte, perché mancano i clic. Ma ti dice quali pagine Google usa nelle sue risposte AI, e questo basta per iniziare a lavorare meglio: rafforzare le pagine che compaiono, migliorare quelle che non compaiono, curare immagini e dati strutturati.

Il primo passo è semplice: apri Search Console questa settimana, guarda le prime dieci pagine del report e confrontale con i clic. Se vuoi un aiuto a leggere i dati o a sistemare il tuo sito, dai un'occhiata a come lavoriamo sui [siti web](/siti-web) oppure [parliamone](/contatti).

**Fonti**

- [New controls for website owners – Google, The Keyword, 3 giugno 2026](https://blog.google/products-and-platforms/products/search/new-controls-website-owners/)
- [Generative AI performance reports in Search Console – Google Search Central Blog, giugno 2026](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
- [Report sulle prestazioni dell'AI generativa – Guida di Search Console, 2026](https://support.google.com/webmasters/answer/16984139)
- [Controllo Search generative AI – Guida di Search Console, 2026](https://support.google.com/webmasters/answer/16908024)
- [Web multimodal search type in Search Console – Google Search Central Blog, 24 settembre 2026](https://developers.google.com/search/blog/2026/09/web-multimodal-in-sc)
- [Platform properties: social and video guide – Google Search Central Blog, 29 luglio 2026](https://developers.google.com/search/blog/2026/07/platform-properties-social-video-guide)
- [AI Mode arriva anche in Italia – Google Italia, 8 ottobre 2025](https://blog.google/intl/it-it/ai-mode-arriva-anche-in-italia/)`,
  },
  {
    slug: 'seo-ai-overviews-geo-google',
    title: 'SEO per AI Overviews e GEO: cosa dice davvero Google',
    excerpt: 'Google ha pubblicato una guida ufficiale su come ottimizzare un sito per le funzioni AI della Ricerca. Spoiler: è SEO. Ecco cosa conta, cosa puoi ignorare e come difenderti dalle offerte GEO miracolose.',
    category: 'Siti web',
    tags: ['seo', 'geo', 'ai overviews', 'ai mode', 'llms.txt', 'core update'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/seo-ai-overviews-geo-google/cover.jpg',
    coverAlt: 'Una ricerca su Google scomposta in più domande e la risposta AI con fonte',
    published: true,
    seoTitle: 'SEO per AI Overviews e GEO: cosa dice Google | InLab',
    seoDescription: 'SEO per AI Overviews e GEO: la guida ufficiale di Google spiega cosa conta davvero, perché llms.txt non serve e come riconoscere le offerte GEO fuffa.',
    content: `Negli ultimi mesi si è moltiplicata un'offerta nuova: la "GEO", ottimizzazione per i motori generativi, venduta come qualcosa di diverso dalla solita SEO. Se ti stai chiedendo come funziona la **SEO per AI Overviews** e se devi davvero pagare per un servizio a parte, c'è finalmente una risposta ufficiale: l'ha data Google.

**Risposta breve: per Google la "GEO" non è una disciplina a parte. Le risposte AI si basano sugli stessi sistemi della ricerca classica: servono pagine indicizzate e contenuti originali, non file llms.txt o testi riscritti "per l'AI".**

Il 15 maggio 2026 Google ha pubblicato una guida dedicata all'ottimizzazione dei siti per le sue funzioni di AI generativa. Il messaggio è chiaro e ti fa risparmiare tempo e soldi: conta la qualità dei contenuti, non i trucchi.

**In breve**

- Per Google "AEO" e "GEO" restano SEO: AI Overviews e AI Mode usano gli stessi sistemi di ranking della Ricerca.
- La priorità sono i contenuti "non-commodity": esperienza diretta, dati propri, casi reali.
- llms.txt, "chunking" dei testi e riscritture "per l'AI" si possono ignorare, per Google Search.
- Creare pagine per ogni variante di domanda viola le regole contro lo spam.
- Per attività locali ed e-commerce contano Google Business Profile e Merchant Center.

## SEO per AI Overviews: cosa dice la guida ufficiale di Google

Il [15 maggio 2026](https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing) John Mueller, di Google, ha annunciato la guida "[Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)". È il primo documento ufficiale che spiega cosa fare (e cosa no) per comparire nelle risposte AI della Ricerca.

### AEO e GEO? Per Google è sempre SEO

Il punto centrale: le funzioni AI di Google si basano sui **sistemi di ranking core**, gli stessi che ordinano i risultati classici. Due concetti aiutano a capire perché.

Il primo è il **grounding**: l'AI ancora le sue risposte a pagine web reali, che trova con la Ricerca. Il secondo è il **query fan-out**: l'AI scompone la tua domanda in più ricerche correlate. Se chiedi "dove mangiare pesce a Taranto con bambini", l'AI può cercare separatamente ristoranti di pesce, locali adatti alle famiglie, recensioni recenti.

In pratica: se una pagina è forte nella Ricerca normale, ha buone possibilità di esserlo anche nelle risposte AI.

### La priorità: contenuti non-commodity

Google insiste sui contenuti **non-commodity**. "Commodity" è un prodotto indistinguibile, uguale ovunque. Un contenuto commodity è quello che trovi identico su cento siti.

L'esempio di Google è chiaro: un articolo "7 consigli per chi compra casa per la prima volta" è commodity. Il racconto in prima persona di chi l'ha comprata davvero, con errori e scoperte, non lo è. L'AI può riassumere i sette consigli da sola. L'esperienza vissuta no.

### Cosa è vietato: moltiplicare pagine

Creare una pagina per ogni variante di una domanda, o per ogni possibile query di fan-out, con lo scopo di manipolare i risultati viola la policy sullo **scaled content abuse**, cioè la produzione di contenuti in massa per scalare le classifiche. Non è una zona grigia: è spam.

## GEO, llms.txt e le altre tattiche che puoi ignorare

Qui la guida è preziosa, perché smonta diverse tattiche vendute come "GEO". Per Google Search puoi ignorare:

- **llms.txt** e altri file o markup "speciali" pensati per l'AI;
- il **"chunking"**, cioè spezzare i testi in blocchetti per renderli "digeribili" dall'AI;
- **riscrivere i testi "per l'AI"**;
- cercare **menzioni non autentiche** del tuo brand in giro per il web.

Non serve nemmeno uno schema di dati strutturati speciale. I dati strutturati restano utili, ma per i rich result, cioè i risultati arricchiti con stelline, prezzi o eventi.

I requisiti tecnici sono pochi: la pagina deve essere **indicizzata** e **idonea a mostrare uno snippet**, e il sito deve essere incluso nel controllo AI di Search Console. Se vuoi capire come verificarlo e come misurare i risultati, leggi la nostra guida su come [misurare la visibilità del sito nelle risposte AI](/blog/ai-overviews-search-console-report).

![Tattiche GEO che Google dice di ignorare e fattori che contano per le AI Overviews](/blog/seo-ai-overviews-geo-google/serve-non-serve.webp)

## I core update 2026 e la fine dei contenuti commodity

La guida arriva in un anno movimentato. I core update sono aggiornamenti generali degli algoritmi di Google, e possono spostare molto traffico.

Secondo le rilevazioni di Search Engine Land, nel 2026 ci sono stati il March 2026 core update (dal 27 marzo all'8 aprile) e il [May 2026 core update](https://searchengineland.com/google-may-2026-core-update-rollout-is-now-complete-479119) (dal 21 maggio al 2 giugno). Uno spam update è partito il 24 settembre 2026.

Esperti come Glenn Gabe e Lily Ray ritengono che il core update di maggio sia stato più forte di quello di marzo. Diverse analisi di settore indicano tra i più penalizzati i contenuti commodity e le traduzioni fatte con l'AI su larga scala. È un'interpretazione, non una dichiarazione di Google, ma è coerente con la direzione della guida.

C'è poi un dato ufficiale: il [Discover core update del 5 febbraio 2026](https://developers.google.com/search/blog/2026/02/discover-core-update). Punta a mostrare più contenuti locali di siti del proprio Paese, meno clickbait, più contenuti approfonditi e originali, e valuta la competenza argomento per argomento. È partito in inglese negli Stati Uniti, con espansione prevista a tutti i Paesi.

Il filo rosso è sempre lo stesso: **originalità e competenza reale**.

## Il vantaggio delle piccole imprese: esperienza e territorio

La buona notizia: una piccola impresa ha spesso più materiale non-commodity di un grande portale. Ha clienti veri, casi veri, un territorio. Basta usarlo.

**Ristorante.** Invece di "i 5 piatti tipici pugliesi", racconta come prepari le tue orecchiette, da chi compri la farina, quali piatti chiedono di più i clienti. E cura il Google Business Profile: per la ricerca locale pesa molto.

**Negozio o e-commerce.** Schede prodotto con foto tue, misure verificate, risposte alle domande che i clienti ti fanno davvero. Google indica il **feed Merchant Center** (l'elenco prodotti che invii a Google) come aiuto alla visibilità nelle risposte AI.

**Studio professionale.** Un dentista che spiega come gestisce la paura del paziente alla prima visita offre qualcosa che nessuna AI può inventare. Lo stesso vale per un commercialista che racconta gli errori più frequenti che vede nei suoi clienti. È l'approccio che seguiamo anche nei progetti per studi professionali, come il [sito e lead generation per uno studio dentistico](/casi-studio/ricciardi).

**Attività locali in generale.** Google cita esplicitamente **Google Business Profile** tra gli strumenti che aiutano la visibilità nelle risposte AI. Se non l'hai ancora curato, parti da lì: trovi i dettagli nel nostro articolo su [Google Business Profile e la SEO locale](/blog/google-business-profile-ga4).

## Come ottimizzare i contenuti per le risposte AI di Google

### Come rendere un contenuto non-commodity

1. **Parti dall'esperienza diretta.** Scrivi cosa hai fatto, visto, sbagliato. In prima persona, con nome e cognome.
2. **Usa dati tuoi.** Tempi medi di consegna, domande più frequenti, stagionalità delle richieste. Anche numeri piccoli, purché veri.
3. **Metti foto tue.** Prodotti, locale, team, lavori finiti. Niente stock nelle pagine importanti.
4. **Racconta casi reali.** Con il permesso del cliente, e senza gonfiare i risultati.
5. **Firma le opinioni.** "Secondo noi" è un valore: mostra che dietro c'è una persona competente.
6. **Scrivi FAQ vere.** Raccogli le domande che ti fanno al telefono, su WhatsApp, in negozio. Sono le stesse che le persone fanno a Google.

### Come riconoscere un'offerta GEO fuffa

Prima di firmare, fai queste domande al fornitore:

- **"Cosa fate di diverso dalla SEO?"** Se la risposta è llms.txt, chunking o riscrittura dei testi "per l'AI", sono proprio le cose che Google dice di poter ignorare.
- **"Da dove vengono le vostre metriche?"** Diffida di chi dice di usare metriche "interne" di Google: Google stessa invita a essere cauti con i tool di terze parti che fanno queste affermazioni.
- **"Pensate di creare molte pagine simili?"** Se il piano è una pagina per ogni variante di domanda, rischi di violare la policy sullo scaled content abuse.
- **"Come costruite le menzioni del brand?"** Menzioni non autentiche sono tra le cose da ignorare, oltre che un rischio.
- **"Come misurerete i risultati?"** Una risposta seria parte da Search Console e dal report sulle prestazioni dell'AI generativa.
- **"Chi scrive i contenuti?"** Se la risposta è "l'AI, in massa, anche tradotti", ripensaci.

Il nostro consiglio: se un'offerta promette di "farti comparire su ChatGPT e Google AI in 30 giorni", è un campanello d'allarme. Nessuno può garantirlo.

### Un esempio pratico (ipotetico)

Facciamo un esempio: un centro di fisioterapia di Castellaneta ha un blog con articoli generici tipo "10 esercizi per il mal di schiena", simili a quelli di mille altri siti.

Decide di cambiare approccio. Il fisioterapista titolare scrive un articolo firmato sui tre errori che vede più spesso nei pazienti che lavorano in ufficio, con foto scattate nello studio e le domande reali raccolte in sala d'attesa. Aggiorna il Google Business Profile con orari, servizi e foto recenti.

Nessun file llms.txt, nessun testo "riscritto per l'AI". Solo contenuti che nessun altro sito può copiare, perché nascono dalla sua esperienza. Poi misura in Search Console quali pagine compaiono nelle risposte AI e decide i prossimi articoli su quella base.

## Come lavoriamo sui contenuti dei siti

Quando scriviamo i testi di un sito, per ogni pagina facciamo al titolare una domanda precisa: cosa ti chiedono davvero i clienti, al telefono o in negozio? Le risposte a quelle domande sono il contenuto "non-commodity" che Google descrive: nessun concorrente può copiarlo, perché nasce dall'esperienza di quell'attività.

È anche il motivo per cui diffidiamo delle scorciatoie. Pagine scritte in serie per ogni paese della provincia, testi generati e mai rivisti, file tecnici venduti come soluzione miracolosa: nella migliore delle ipotesi non servono. Una pagina servizio chiara, con foto vere e FAQ reali, lavora meglio sia per le persone sia per Google.

## Domande frequenti

### La GEO è diversa dalla SEO?

Secondo Google no: ottimizzare per le funzioni AI della Ricerca resta SEO. AI Overviews e AI Mode si basano sugli stessi sistemi di ranking core della Ricerca classica.

### Serve il file llms.txt per comparire nelle AI Overviews?

Per Google Search no. Nella sua guida Google indica llms.txt e altri file o markup "speciali" tra le cose che puoi ignorare. Non serve nemmeno uno schema di dati strutturati dedicato all'AI.

### Cosa sono i contenuti non-commodity?

Sono contenuti che non si trovano uguali ovunque: esperienza diretta, dati tuoi, foto tue, casi reali, opinioni firmate. Una lista generica di consigli è commodity, il racconto di un'esperienza vissuta no.

### Quali sono i requisiti minimi per comparire nelle risposte AI di Google?

La pagina deve essere indicizzata e idonea a mostrare uno snippet, e il sito deve essere incluso nel controllo AI di Search Console. Poi contano la qualità e l'utilità del contenuto.

### Conviene creare una pagina per ogni variante di una domanda?

No. Google dice che creare pagine per ogni variante o per le query di fan-out allo scopo di manipolare i risultati viola la policy contro lo scaled content abuse.

## Conclusione: meno trucchi, più sostanza

La SEO per AI Overviews non è una disciplina segreta. È buona SEO con un'attenzione in più all'originalità: pagine indicizzate, contenuti che nascono dalla tua esperienza, profili locali curati. Il resto, per Google Search, è rumore.

Il passo pratico da fare oggi: prendi le tre pagine più importanti del tuo sito e chiediti cosa contengono che un concorrente non potrebbe copiare. Se la risposta è "niente", sai da dove partire. Se vuoi un sito costruito su questi principi, scopri come lavoriamo sui [siti web](/siti-web) oppure [parliamone](/contatti).

**Fonti**

- [A new resource for optimizing your website for generative AI features – Google Search Central Blog, 15 maggio 2026](https://developers.google.com/search/blog/2026/05/a-new-resource-for-optimizing)
- [Optimizing your website for generative AI features on Google Search – Google Search Central, maggio 2026](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Discover core update – Google Search Central Blog, 5 febbraio 2026](https://developers.google.com/search/blog/2026/02/discover-core-update)
- [Google May 2026 core update rollout is now complete – Search Engine Land, giugno 2026](https://searchengineland.com/google-may-2026-core-update-rollout-is-now-complete-479119)`,
  },
  {
    slug: 'google-business-profile-ga4',
    title: 'Collegare Google Business Profile a GA4: cosa cambia per la SEO locale nel 2026',
    excerpt: 'Da giugno 2026 i dati della scheda Google finiscono in GA4 e c\'è un canale dedicato al traffico da ChatGPT e simili. Ecco cosa guardare e cosa fare se hai un\'attività locale.',
    category: 'Siti web',
    tags: ['google business profile', 'ga4', 'seo locale', 'google maps', 'ai assistant', 'ask maps'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/google-business-profile-ga4/cover.jpg',
    coverAlt: 'Scheda Google di una pasticceria collegata a un report di GA4',
    published: true,
    seoTitle: 'Google Business Profile in GA4: SEO locale 2026 | InLab',
    seoDescription: 'Come collegare Google Business Profile a GA4, quali metriche guardare ogni mese e come leggere il traffico da ChatGPT: guida pratica per attività locali.',
    content: `Collegare Google Business Profile a GA4 oggi è possibile, ed è una delle novità più utili del 2026 per chi ha un'attività con una sede fisica. Se fai SEO locale nel 2026, cioè lavori per farti trovare da chi cerca "vicino a me" su Google e su Maps, finalmente puoi vedere nello stesso posto quante persone ti chiamano dalla scheda e quante visitano il sito.

Non è l'unico cambiamento. Google Analytics 4 ha introdotto anche un canale dedicato al traffico che arriva da ChatGPT, Gemini e altri assistenti AI, mentre su Google Maps sta arrivando un modo nuovo di cercare, basato su domande in linguaggio naturale. In questa guida vediamo cosa è cambiato, cosa guardare e cosa fare, senza tecnicismi inutili.

**In breve**

- Dall'8 giugno 2026 puoi collegare una proprietà GA4 al tuo profilo Google Business Profile e vedere 7 metriche della scheda, su una finestra di 6 mesi.
- Dal 13 maggio 2026 GA4 ha un canale "AI Assistant" che raccoglie il traffico da ChatGPT, Gemini, Claude e altri.
- Ask Maps porta le domande conversazionali su Google Maps, ma il funzionamento in italiano in Italia non è ancora confermato.
- Secondo Google, una scheda curata aiuta anche la visibilità nelle risposte generate dall'AI.
- Il nostro consiglio: tre metriche da controllare ogni mese e una scheda sempre aggiornata valgono più di cento report.

## Google Business Profile e GA4: le novità del 2026

Tutte le novità che seguono sono elencate nella pagina ufficiale ["Novità di Google Analytics"](https://support.google.com/analytics/answer/9164320), che abbiamo consultato a settembre 2026.

### Google Business Profile dentro GA4

Dall'8 giugno 2026 puoi collegare una proprietà GA4 ai tuoi profili Google Business Profile (la scheda gratuita che compare su Google e Maps con orari, foto e recensioni). Il collegamento si fa dal pannello Amministrazione di GA4.

Una volta attivo, trovi una nuova raccolta di report con 7 metriche della scheda:

- **interazioni**, il totale delle azioni fatte sulla scheda;
- **chiamate**;
- **prenotazioni**;
- **indicazioni stradali**;
- **clic al sito**;
- **messaggi**;
- **menu**.

Un dettaglio da non trascurare: i dati sono calcolati su una **finestra mobile di 6 mesi**. In pratica vedi sempre gli ultimi sei mesi, non lo storico completo.

### Un canale per il traffico da ChatGPT e dagli assistenti AI

Dal 13 maggio 2026 il raggruppamento canali predefinito di GA4 (cioè il modo in cui Analytics divide le visite per provenienza: organico, social, diretto e così via) include un nuovo canale, **AI Assistant**. Le visite arrivano con medium "ai-assistant" e campagna "(ai-assistant)" e comprendono il traffico da ChatGPT, Gemini, Claude e altri assistenti.

Prima questo traffico finiva spesso mescolato tra i "referral" o nel "diretto". Ora ha un nome e un posto preciso.

### Le altre novità utili

- **Source Group** (11 giugno 2026): una dimensione che raggruppa sorgenti simili, per esempio Facebook, Instagram e TikTok, e include anche ChatGPT/OpenAI e Perplexity. È retroattiva, quindi vale anche per i dati passati.
- **Filtri hostname** (11 giugno e 21 settembre 2026): prima sono arrivati i filtri di esclusione, poi quelli di tipo "Include". Con questi ultimi puoi indicare quali domini sono tuoi e tenere fuori lo spam dai report.
- **Finestre di conversione personalizzate** (11 agosto 2026): puoi scegliere una finestra click-through da 1 a 90 giorni.
- **Dashboard** (9 settembre 2026): report componibili con il trascinamento e nuove visualizzazioni.

### Ask Maps: cercare su Maps facendo domande

Il 12 marzo 2026 Google ha lanciato [Ask Maps](https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/), cioè Gemini dentro Google Maps, in USA e India. È un pulsante conversazionale per fare domande complesse, che attinge a oltre 300 milioni di luoghi e alle recensioni di oltre 500 milioni di contributori.

Secondo un post di Google su X (non un annuncio sul blog ufficiale), ad agosto 2026 la funzione si è estesa ad altri Paesi e a "oltre 150 Paesi in inglese". **Non abbiamo verificato che funzioni in italiano in Italia**: per ora trattala come una direzione di marcia, non come qualcosa su cui contare oggi.

## Perché è importante per la SEO locale

Fino a ieri, per un'attività locale, i dati erano sparsi: le chiamate e le indicazioni stavano nella scheda, le visite al sito in Analytics. Confrontarli richiedeva tempo e fogli di calcolo. Adesso puoi vedere nello stesso strumento **cosa fa la gente sulla scheda e cosa fa dopo sul sito**.

Il secondo motivo riguarda l'intelligenza artificiale. Nella sua [guida di maggio 2026 sulle funzioni AI della Ricerca](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), Google indica che Google Business Profile e i feed di Merchant Center aiutano la visibilità nelle risposte generate dall'AI. Ne abbiamo parlato anche nell'articolo su [cosa dice Google sulla SEO per l'intelligenza artificiale](/blog/seo-ai-overviews-geo-google).

Secondo noi il messaggio è chiaro: la scheda Google non è più un "extra". È una delle fonti da cui Google, Maps e gli assistenti AI prendono le informazioni sulla tua attività. Se è incompleta o vecchia, rischi di essere raccontato male o di non essere raccontato affatto.

### Quali metriche contano per ristoranti, negozi e studi

Le 7 metriche non pesano allo stesso modo per tutti. Ecco come leggerle in base al tipo di attività.

- **Ristorante o pizzeria**: contano soprattutto chiamate, prenotazioni, menu e indicazioni stradali. Se le visualizzazioni del menu salgono ma le prenotazioni no, forse il percorso per prenotare non è chiaro.
- **Negozio**: indicazioni stradali e chiamate sono i segnali più vicini a una visita in negozio. I clic al sito ti dicono quanta gente vuole vedere prodotti o orari prima di muoversi.
- **Studio professionale** (dentista, commercialista, avvocato): chiamate, messaggi e clic al sito. Qui il sito fa spesso da "seconda verifica" prima di contattarti, quindi deve essere chiaro e aggiornato.
- **Centro estetico**: prenotazioni e messaggi. Se ricevi molti messaggi, conviene organizzare risposte rapide e coerenti.
- **E-commerce con punto vendita**: il canale AI Assistant e i clic al sito diventano interessanti, insieme ai feed di Merchant Center che Google cita nella sua guida.

Il canale AI Assistant, per ora, porterà numeri piccoli a molte attività locali. Non è un problema: l'importante è iniziare a osservarlo, così saprai se e quando cresce.

## Come collegare Google Business Profile a GA4 e cosa controllare

### 1. Collega Google Business Profile a GA4

1. Verifica di avere accesso sia alla proprietà GA4 del sito sia al profilo dell'attività (spesso sono account diversi, magari uno in mano all'agenzia e uno al titolare).
2. Entra in GA4 e apri il pannello **Amministrazione**.
3. Cerca l'area dei collegamenti con gli altri prodotti Google e seleziona Google Business Profile.
4. Scegli il profilo (o i profili, se hai più sedi) e conferma.
5. Dopo il collegamento, cerca la nuova raccolta di report dedicata alla scheda.

### 2. Scegli 3 metriche da guardare ogni mese

Il nostro consiglio: non guardare tutto. Per la maggior parte delle attività locali bastano tre numeri.

1. **Chiamate** (o prenotazioni, se le usi): il contatto più diretto.
2. **Indicazioni stradali**: chi si sta muovendo verso di te.
3. **Clic al sito**: chi vuole saperne di più prima di decidere.

Annota i valori ogni mese in un foglio. Ricorda che la finestra è di 6 mesi: senza un tuo archivio, i confronti anno su anno si perdono.

### 3. Leggi il canale AI Assistant

Nei report di acquisizione cerca il canale **AI Assistant**. Guarda tre cose: quante visite arrivano, su quali pagine atterrano e se quelle visite portano a un contatto (una chiamata, un modulo, una prenotazione). Con la dimensione Source Group puoi vedere, per esempio, quanto arriva da ChatGPT/OpenAI rispetto a Perplexity.

Se vuoi completare il quadro con Google Search Console, leggi la nostra guida su come [misurare la visibilità in AI Overviews con Search Console](/blog/ai-overviews-search-console-report).

### 4. Pulisci i dati

Con i filtri hostname di tipo "Include" puoi dire a GA4 quali sono i tuoi domini. È un modo semplice per tenere fuori dai report il traffico spam che "finge" di arrivare dal tuo sito.

### 5. Cura la scheda come cureresti la vetrina

- **Categorie**: scegli quella principale con attenzione e aggiungi solo categorie secondarie pertinenti.
- **Orari**: aggiornali sempre, festivi e chiusure comprese.
- **Foto reali**: del locale, dei prodotti, delle persone. Meglio una foto vera fatta bene che dieci immagini generiche.
- **Risposte alle recensioni**: rispondi a tutte, positive e negative, con tono calmo e personale.
- **Post**: novità, eventi, offerte stagionali. Anche pochi post, ma regolari.

### 6. Controlla nome, indirizzo e telefono

Nome, indirizzo e numero di telefono devono essere **identici** sulla scheda, sul [sito web](/siti-web) e sui social. Sembra un dettaglio, ma informazioni contrastanti confondono i clienti e rendono meno chiaro chi sei a chi legge i tuoi dati.

![Checklist mensile per attività locali: chiamate, indicazioni, clic al sito, traffico AI e recensioni](/blog/google-business-profile-ga4/checklist-mensile.webp)

*La checklist da ripetere ogni mese: tre metriche GBP, il canale AI Assistant e la cura della scheda.*

## Un esempio: la pasticceria di Castellaneta

Facciamo un esempio ipotetico. Un bar pasticceria di Castellaneta collega la sua scheda a GA4 e, dopo qualche mese, confronta due dati: le **chiamate dalla scheda** e le **visite al sito**.

Scopre che le chiamate crescono nelle settimane prima delle festività, quando la gente ordina torte e vassoi, mentre le visite al sito restano stabili. La lettura possibile: chi cerca la pasticceria su Maps chiama direttamente, senza passare dal sito.

Cosa può fare il titolare? Mettere in evidenza sulla scheda, con un post e foto reali dei prodotti, le informazioni che le persone chiedono al telefono: tempi di ordinazione, formati, orari. E sul sito, una pagina chiara sugli ordini per le feste. Il mese successivo controlla se le chiamate "di informazione" calano e quelle di ordine restano. Nessun numero magico: solo un confronto mese per mese.

## Cosa vediamo lavorando con le attività locali

Nel lavoro con le attività della provincia di Taranto la scheda Google è spesso il primo punto di contatto, prima ancora del sito e dei social. Chi cerca "pasticceria aperta" o "dentista Massafra" decide spesso lì se chiamare, chiedere le indicazioni o passare oltre.

Per questo quando progettiamo un sito lo colleghiamo sempre alla scheda: stessi dati di contatto, stesse categorie di servizi, link diretti alle pagine giuste. Il collegamento con GA4 ci permette finalmente di mostrare al cliente, in un unico posto, quante persone sono arrivate dalla scheda e cosa hanno fatto dopo.

## Domande frequenti

### Come si collega Google Business Profile a GA4?

Dall'8 giugno 2026 il collegamento si fa dal pannello Amministrazione della proprietà GA4, nell'area dei collegamenti con gli altri prodotti Google. Serve avere accesso sia alla proprietà GA4 sia al profilo dell'attività. Una volta collegato, compare una raccolta di report dedicata.

### Quali dati di Google Business Profile vedo in GA4?

Sette metriche: interazioni, chiamate, prenotazioni, indicazioni stradali, clic al sito, messaggi e menu. I dati coprono una finestra mobile di 6 mesi, quindi conviene esportarli o annotarli se vuoi confronti su periodi più lunghi.

### Come vedo in GA4 il traffico che arriva da ChatGPT?

Dal 13 maggio 2026 GA4 ha un canale predefinito chiamato AI Assistant, con medium ai-assistant, che raccoglie le visite da assistenti come ChatGPT, Gemini e Claude. Lo trovi nei report di acquisizione, accanto a ricerca organica, social e diretto.

### Ask Maps funziona in Italia?

Al momento non lo sappiamo con certezza. Ask Maps è stato lanciato a marzo 2026 in USA e India e, secondo un post di Google su X, ad agosto si è esteso ad altri Paesi e a oltre 150 Paesi in inglese. Non abbiamo conferme sul funzionamento in italiano in Italia.

### La scheda Google conta anche per le risposte dell'intelligenza artificiale?

Sì, secondo la guida di Google di maggio 2026 sulle funzioni AI della Ricerca, Google Business Profile e i feed di Merchant Center aiutano la visibilità nelle risposte generate dall'AI. Curare la scheda resta quindi una delle azioni più utili per un'attività locale.

## Dalla scheda al sito: un unico percorso da misurare

La SEO locale nel 2026 non si gioca solo sulla posizione in Maps. Si gioca sulla qualità della scheda, sulla coerenza delle informazioni e sulla capacità di capire cosa succede dopo il primo clic. Il collegamento tra Google Business Profile e GA4 ti dà, per la prima volta, una vista unica su questo percorso.

Il punto pratico: collega la scheda, scegli tre metriche e guardale ogni mese, sempre nello stesso giorno. Il resto viene di conseguenza.

Se ti chiedi se ti serve ancora un sito quando hai già la scheda e i social, leggi [sito web o solo social: cosa serve a un'attività locale](/blog/sito-web-o-solo-social-attivita-locale).

Se lavori in provincia di Taranto e vuoi una mano a mettere in ordine scheda, sito e misurazione, possiamo aiutarti con i [siti web a Taranto](/siti-web-taranto) e con la [gestione social a Taranto](/gestione-social-taranto), così che le informazioni siano coerenti ovunque. Se vuoi partire da un controllo della tua scheda, [parliamone](/contatti).

**Fonti**

- [Novità di Google Analytics (What's new in Google Analytics)](https://support.google.com/analytics/answer/9164320) – Google Analytics Help, consultata a settembre 2026
- [Ask Maps e navigazione immersiva in Google Maps](https://blog.google/products-and-platforms/products/maps/ask-maps-immersive-navigation/) – Google The Keyword, 12 marzo 2026
- [Guida all'ottimizzazione per le funzioni AI della Ricerca](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) – Google Search Central, maggio 2026`,
  },
  {
    slug: 'whatsapp-business-ai',
    title: 'WhatsApp Business AI: cosa cambia con Meta Business Agent per le attività locali',
    excerpt: 'Meta ha lanciato un assistente AI che risponde ai clienti su WhatsApp e Messenger. Ecco cosa fa davvero, cosa cambia con username e annunci negli Stati e come prepararti senza errori.',
    category: 'Social media',
    tags: ['whatsapp business', 'meta business agent', 'chatbot', 'intelligenza artificiale', 'attività locali', 'meta'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/whatsapp-business-ai/cover.jpg',
    coverAlt: 'Chat WhatsApp di una trattoria in cui l\'assistente AI prenota un tavolo',
    published: true,
    seoTitle: 'WhatsApp Business AI: guida a Meta Business Agent | InLab',
    seoDescription: 'WhatsApp Business AI e Meta Business Agent: cosa fa l\'assistente, username, annunci negli Stati e costi dei messaggi. Guida pratica per attività locali.',
    content: `WhatsApp Business AI non è più un esperimento: con **Meta Business Agent**, l'assistente AI annunciato da Meta a giugno 2026, un'attività può far rispondere ai clienti un agente che conosce orari, prodotti e disponibilità. Per chi riceve decine di messaggi al giorno, spesso fuori orario, è una novità che conviene capire subito, prima di attivarla alla cieca.

**Risposta breve: Meta Business Agent è l'assistente AI di Meta che risponde ai clienti su WhatsApp e Messenger, consiglia prodotti e prenota appuntamenti. L'attivazione iniziale è gratuita. Funziona bene solo se prima gli dai informazioni complete e regole chiare su quando passare la chat a una persona.**

In questa guida vediamo cosa fa davvero l'assistente, cosa cambia con username, annunci negli Stati e prezzi dei messaggi, e come prepararti.

**In breve**

- Meta Business Agent risponde ai clienti su WhatsApp e Messenger, consiglia prodotti, prenota appuntamenti e ogni mattina ti riepiloga le conversazioni perse.
- L'attivazione iniziale è gratuita; in futuro l'accesso passerà da abbonamenti. La disponibilità in Italia va verificata nell'app.
- Da fine giugno 2026 puoi prenotare lo username WhatsApp: i clienti ti scrivono senza vedere il numero.
- Per chi usa la piattaforma API, in Italia dal 1° luglio 2026 i messaggi marketing costano di più: servono liste segmentate.
- Prima di attivare l'AI prepara informazioni, regole di passaggio all'operatore e attenzione ai dati sensibili.

## WhatsApp Business con l'AI: cosa fa Meta Business Agent

### Cosa fa Meta Business Agent

Il 3 giugno 2026, all'evento Conversations di Londra, Meta ha presentato [Meta Business Agent](https://about.fb.com/news/2026/06/meta-business-agent/), un assistente basato sull'intelligenza artificiale pensato per le aziende. In pratica è un addetto virtuale che risponde nelle chat al posto tuo, quando non puoi farlo.

Secondo Meta, l'assistente può:

- rispondere alle domande sulla tua attività (orari, servizi, politiche);
- consigliare prodotti presi dal tuo catalogo;
- prenotare appuntamenti;
- qualificare i contatti, cioè capire chi è davvero interessato, e chiudere vendite;
- inviarti ogni mattina un riepilogo delle conversazioni che ti sei perso.

Risponde nella lingua del cliente e con il tono della tua attività. Oggi funziona su WhatsApp e Messenger, e Meta lo sta estendendo a Instagram. L'azienda dichiara che lo usano già oltre un milione di imprese e che ogni giorno sono attivi più di un miliardo di thread di conversazione con le aziende.

### Configurazione e costi

Meta parla di configurazione "in minuti" e di attivazione iniziale gratuita, con un futuro accesso tramite offerte in abbonamento. Online circolano date precise per il passaggio a pagamento, ma non sono confermate da fonti ufficiali. Il nostro consiglio: per ora non pianificare il budget su quelle.

Un punto importante: la pagina ufficiale **non indica in quali Paesi** l'assistente è disponibile. Se lo vedi nella tua app WhatsApp Business, puoi usarlo; se non lo vedi, non è ancora arrivato per il tuo account.

Per completezza: il 28 settembre 2026 Meta ha annunciato [Meta Enterprise Platform](https://about.fb.com/news/2026/09/launching-meta-enterprise-platform/), una piattaforma dedicata alle grandi aziende. Per un'attività locale non è la notizia principale.

### Username, annunci negli Stati, prezzi e chiamate

Attorno all'assistente AI si muovono altre novità che toccano chi usa WhatsApp per lavoro.

**Username.** Dalla settimana del 29 giugno 2026 si può [prenotare il nome utente](https://about.fb.com/news/2026/06/its-time-to-reserve-your-whatsapp-username/) da Impostazioni > Account > Nome utente. Il lancio completo è previsto entro l'anno, con rilascio graduale per Paese e notifica in app. Brand e creator possono rivendicare lo stesso username che usano su Instagram o Facebook. Non esiste una directory pubblica, e con lo username attivo il tuo numero resta nascosto ai nuovi contatti.

**Pubblicità nella scheda Aggiornamenti.** Meta ha annunciato [annunci negli Stati](https://about.fb.com/news/2025/06/helping-you-find-more-channels-businesses-on-whatsapp/) (da cui l'utente può aprire una chat con l'azienda), canali promossi e abbonamenti ai canali. Nelle chat personali non compare nessuna pubblicità. La scheda Aggiornamenti conta 1,5 miliardi di utenti al giorno (dato globale). Il targeting si basa su Paese o città, lingua, canali seguiti e interazioni con gli annunci, oltre ai dati dell'account Meta se collegato al Centro gestione account. Meta precisa che non venderà né condividerà il numero di telefono. Sull'arrivo in Italia non c'è ancora una data ufficiale certa: a quanto risulta, Meta nel suo report DMA di marzo 2026 parlava di "prossime settimane".

**Messaggi marketing in Ads Manager.** Da luglio 2025 i messaggi marketing WhatsApp sono [un posizionamento in Ads Manager](https://about.fb.com/news/2025/07/centralized-campaigns-ai-support-businesses-whatsapp/), accanto a Facebook e Instagram. Significa gestire tutto da un'unica campagna.

**Prezzi della piattaforma API.** Per chi usa la WhatsApp Business Platform (la versione per integrazioni e gestionali, diversa dall'app), dal 1° luglio 2025 si paga [a messaggio](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/). I messaggi di tipo "utility" (conferme, promemoria) inviati dentro la finestra di servizio, cioè mentre stai già conversando con il cliente, sono gratuiti. Dal 1° luglio 2026, in Italia, i messaggi marketing hanno una tariffa più alta.

**Chiamate.** Con la [Business Calling API](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/) i clienti possono chiamarti su WhatsApp e, anche in Italia, puoi essere tu a chiamarli. Per i clienti le chiamate sono gratuite.

## Perché è importante per chi lavora con i clienti in chat

Secondo i dati We Are Social / DataReportal, WhatsApp è la piattaforma più usata in Italia. Per molti clienti è il canale più naturale: scrivono lì prima di telefonare, prima di compilare un modulo, spesso prima ancora di guardare il sito.

Il problema è noto a chiunque gestisca un'attività: i messaggi arrivano quando sei in cucina, in poltrona con un paziente, alla cassa. Risposte lente significano clienti che scrivono al concorrente. Un assistente AI ben configurato copre proprio quei vuoti.

Ma c'è un rovescio. Un assistente che risponde male, inventa un prezzo o promette un orario che non esiste fa più danni del silenzio. Il valore non sta nell'attivare l'AI, sta nel **prepararla bene**.

### Come usarlo in un ristorante, in uno studio, in un negozio o in un e-commerce

**Ristorante o pizzeria.** Le domande sono sempre le stesse: siete aperti lunedì, avete opzioni senza glutine, c'è posto sabato. L'assistente può rispondere e raccogliere prenotazioni anche a servizio in corso, lasciando a te solo i casi particolari (gruppi numerosi, eventi).

**Studio medico o dentistico.** Utile per orari, indicazioni, prime informazioni sulle prestazioni e richieste di appuntamento. Qui però serve prudenza: i dati sanitari sono dati particolari secondo il GDPR. L'assistente non dovrebbe chiedere sintomi o dettagli clinici; meglio limitarlo alla parte organizzativa e passare a una persona tutto il resto.

**Parrucchiere o centro estetico.** Prenotazioni, spostamenti di appuntamento, listino dei servizi. Il riepilogo mattutino delle conversazioni perse ti aiuta a richiamare chi ha scritto la sera.

**Negozio.** Disponibilità di un prodotto, orari, resi. Se hai un catalogo su WhatsApp, l'assistente può proporre gli articoli giusti.

**E-commerce.** Domande su spedizioni, taglie, stato dell'ordine. Qui entrano in gioco anche i prezzi della piattaforma API: i messaggi di servizio nella finestra di conversazione sono gratuiti, quelli promozionali in Italia costano di più. Inviare offerte a tutta la lista senza criterio diventa una spesa, oltre che un fastidio per i clienti.

## Come preparare WhatsApp Business prima di attivare l'assistente

1. **Costruisci la base informativa.** Scrivi in modo chiaro orari, listini, servizi, FAQ, politiche di reso o disdetta, zone di consegna. L'assistente risponde bene solo se ha informazioni aggiornate e complete.
2. **Definisci quando passa la mano.** Decidi in quali casi la conversazione deve arrivare a una persona: reclami, richieste complesse, preventivi su misura, qualunque tema sanitario o legale.
3. **Metti dei limiti sui dati sensibili.** Soprattutto per studi medici e professionisti: stabilisci cosa il bot non deve chiedere e aggiorna l'informativa privacy.
4. **Sii trasparente.** Il cliente deve sapere che sta parlando con un'AI. Dal 2 agosto 2026 è un obbligo previsto dall'AI Act: ne parliamo nell'articolo sugli [obblighi di trasparenza sui contenuti AI](/blog/contenuti-ai-obblighi-ai-act).
5. **Prenota lo username.** Scegli un nome coerente con Instagram e Facebook, prima che lo faccia qualcun altro.
6. **Segmenta le liste marketing.** Se invii messaggi promozionali tramite piattaforma, dividi i contatti per interesse e frequenza d'acquisto. In Italia ogni messaggio marketing costa di più: meglio pochi e mirati.
7. **Porta traffico in chat con gli annunci click-to-WhatsApp.** Sono annunci su Facebook e Instagram che aprono direttamente una conversazione. Se l'assistente è pronto a rispondere, il contatto non si raffredda. Le impostiamo spesso nelle nostre [campagne Meta Ads](/meta-ads).
8. **Controlla le conversazioni.** Nelle prime settimane leggi il riepilogo ogni mattina e correggi le risposte sbagliate aggiornando la base informativa.

![Checklist in sei punti da completare prima di attivare l'assistente AI su WhatsApp Business](/blog/whatsapp-business-ai/checklist-assistente-ai-whatsapp.webp)

## Un esempio: lo studio dentistico e la trattoria

Facciamo un esempio ipotetico. Uno studio dentistico riceve la sera messaggi come "Fate sbiancamenti?" o "Avete posto giovedì?". Con l'assistente configurato, il paziente riceve subito orari, informazioni generali sul servizio e una proposta di appuntamento. Se scrive "Ho un dolore forte a un dente", l'assistente non entra nel merito: indica il numero per le urgenze e segnala il caso alla segreteria. La mattina, il riepilogo mostra chi richiamare.

Stesso schema per una trattoria: l'AI risponde su menu e allergeni in base alle schede che le hai fornito, prende la prenotazione per quattro persone e lascia a te la festa di compleanno da trenta.

Il punto non è sostituire le persone, ma togliere loro le domande ripetitive. Se vuoi vedere come lavoriamo sulla generazione di contatti per uno studio, guarda [il progetto per lo studio dentistico Ricciardi](/casi-studio/ricciardi).

## Cosa abbiamo imparato progettando chatbot

Nei progetti di [automazioni e chatbot AI](/automazioni-ai) la parte più lunga non è la tecnologia: è scrivere le risposte. Orari, prezzi indicativi, cosa succede se il cliente arriva in ritardo, come si disdice una prenotazione. Sono informazioni che il titolare ha in testa ma che raramente sono scritte da qualche parte.

Il nostro consiglio è partire da lì, anche prima di attivare Meta Business Agent. Facciamo un esempio: una trattoria di Mottola che riceve messaggi soprattutto il sabato mattina può raccogliere per due settimane le domande più frequenti. Con quell'elenco l'assistente risponde meglio, e il personale sa quali chat deve gestire di persona.

## Domande frequenti

### Cos'è Meta Business Agent?

È l'assistente AI di Meta per le aziende, presentato il 3 giugno 2026. Risponde ai clienti su WhatsApp e Messenger, consiglia prodotti dal catalogo, prenota appuntamenti, qualifica contatti e invia al titolare un riepilogo delle conversazioni perse. L'estensione a Instagram è in corso.

### Meta Business Agent è disponibile in Italia?

L'annuncio ufficiale non indica i Paesi coperti. Il modo più sicuro per saperlo è controllare direttamente nell'app WhatsApp Business o negli strumenti Meta della tua attività.

### Quanto costa l'assistente AI di WhatsApp Business?

Meta dice che l'attivazione iniziale è gratuita e che in futuro l'accesso passerà da offerte in abbonamento. Tempi e prezzi di questo passaggio non sono ancora stati comunicati in modo ufficiale: meglio non basare il budget su date circolate online.

### Posso usare un chatbot WhatsApp in uno studio medico?

Sì, ma con cautela. L'assistente può gestire orari, prenotazioni e informazioni generali, mentre i dati sanitari richiedono attenzione particolare al GDPR. Stabilisci cosa il bot non deve chiedere né trattare e quando passare la conversazione a una persona.

### A cosa serve lo username di WhatsApp per un'azienda?

Permette ai clienti di trovarti e scriverti senza conoscere il tuo numero, che resta nascosto ai nuovi contatti. I brand possono rivendicare lo stesso nome usato su Instagram o Facebook. La prenotazione si fa da Impostazioni > Account > Nome utente.

## In conclusione: prepara le risposte prima di attivare l'AI

WhatsApp Business AI può far risparmiare ore e non perdere clienti fuori orario, a patto di dargli informazioni corrette, limiti chiari e un passaggio rapido a una persona quando serve. Intanto prenota lo username e rivedi come usi i messaggi promozionali, perché in Italia costano di più.

Se vuoi un assistente su misura, collegato ai tuoi strumenti e costruito sulle regole della tua attività, realizziamo [chatbot e automazioni AI](/automazioni-ai) per PMI e professionisti. Se hai dubbi su da dove partire, [parliamone](/contatti).

*Questo articolo ha scopo informativo e non sostituisce una consulenza legale, in particolare sul trattamento dei dati personali.*

**Fonti**

- [Meta Business Agent, annuncio ufficiale](https://about.fb.com/news/2026/06/meta-business-agent/) – Meta, 3 giugno 2026
- [Meta Enterprise Platform, annuncio di lancio](https://about.fb.com/news/2026/09/launching-meta-enterprise-platform/) – Meta, 28 settembre 2026
- [Username WhatsApp, apertura delle prenotazioni](https://about.fb.com/news/2026/06/its-time-to-reserve-your-whatsapp-username/) – Meta, 29 giugno 2026
- [Scheda Aggiornamenti: annunci negli Stati e canali promossi](https://about.fb.com/news/2025/06/helping-you-find-more-channels-businesses-on-whatsapp/) – Meta, giugno 2025
- [Campagne centralizzate e supporto AI per le aziende su WhatsApp](https://about.fb.com/news/2025/07/centralized-campaigns-ai-support-businesses-whatsapp/) – Meta, luglio 2025
- [WhatsApp Business Platform, aggiornamenti sui prezzi](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/) – Meta for Developers
- [WhatsApp Cloud API, Business Calling API](https://developers.facebook.com/docs/whatsapp/cloud-api/calling/) – Meta for Developers`,
  },
  {
    slug: 'meta-ads-creativita-advantage',
    title: 'Meta Ads 2026: con l\'AI e Advantage+ la creatività diventa il vero targeting',
    excerpt: 'Nel 2026 è l\'intelligenza artificiale di Meta a scegliere chi vede i tuoi annunci. Il tuo lavoro si sposta su creatività, segnali di conversione e misurazione: ecco come organizzarti.',
    category: 'Advertising',
    tags: ['meta ads', 'advantage+', 'facebook ads', 'instagram ads', 'intelligenza artificiale', 'pmi'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/meta-ads-creativita-advantage/cover.jpg',
    coverAlt: 'Tre creatività diverse che l\'AI di Meta distribuisce a pubblici diversi',
    published: true,
    seoTitle: 'Meta Ads 2026: creatività, AI e Advantage+ | InLab',
    seoDescription: 'Meta Ads 2026: come l\'AI decide chi vede i tuoi annunci, cosa cambia con verifica inserzionisti e regole UE, e come impostare creatività e segnali.',
    content: `Meta Ads 2026 funziona in modo diverso da qualche anno fa: oggi è l'intelligenza artificiale di Meta a decidere, in larga parte, chi vede i tuoi annunci e quando. Per un'impresa questo cambia le priorità: meno tempo a scegliere interessi e pubblici, più attenzione alle creatività, ai dati che arrivano dal sito e alla misurazione.

Vediamo cosa ha comunicato Meta, cosa ne pensano gli addetti ai lavori e cosa fare in concreto.

**In breve**

- Meta dichiara che i nuovi modelli AI hanno migliorato clic e conversioni degli annunci (dati globali, Q4 2025).
- Secondo un'interpretazione diffusa tra gli esperti, oggi la creatività guida la distribuzione più del targeting per interessi.
- Entro fine 2026 Meta vuole che il 90% del fatturato pubblicitario arrivi da inserzionisti verificati.
- Nell'UE niente più annunci politici, elettorali e su temi sociali dal 6 ottobre 2025.
- Il lavoro si sposta su creatività varie, segnali di conversione puliti e test.

## Cosa è cambiato in Meta Ads nel 2026

### L'AI al centro della distribuzione

Il 28 gennaio 2026 Meta ha pubblicato [un aggiornamento sui risultati dei suoi sistemi pubblicitari](https://about.fb.com/news/2026/01/2026-ai-drives-performance/). Alcuni numeri, tutti riferiti al quarto trimestre 2025 e a livello globale:

- il nuovo sistema di ranking (l'algoritmo che ordina gli annunci da mostrare) ha portato un +3,5% di clic sugli annunci Facebook e oltre +1% di conversioni su Instagram;
- il modello di Instagram per Feed, Stories e Reels ha aumentato del 3% il tasso di conversione;
- GEM, il modello generativo con cui Meta raccomanda gli annunci, è stato addestrato con il doppio delle GPU;
- il consolidamento dei modelli in Meta Lattice ha migliorato del 12% la qualità degli annunci;
- gli strumenti di generazione video per le inserzioni hanno raggiunto un run-rate (il valore annuo stimato al ritmo attuale) di 10 miliardi di dollari;
- quasi il 10% delle visualizzazioni giornaliere dei Reels riguarda contenuti creati con Edits, l'app di montaggio di Meta;
- negli Stati Uniti gli annunci click-to-message, quelli che aprono una chat, sono cresciuti del 50% anno su anno.

Meta ha anche introdotto un'attribuzione "incrementale", che prova a misurare solo le conversioni che senza l'annuncio non ci sarebbero state. Secondo l'azienda, rispetto al modello standard rileva il 24% in più di conversioni incrementali.

### Verso campagne sempre più automatiche

Secondo quanto riportato dal Wall Street Journal a giugno 2025, l'obiettivo di Meta è arrivare entro fine 2026 a campagne completamente automatizzate: l'inserzionista fornisce URL, immagine e budget, l'AI fa il resto. Non è un annuncio ufficiale, ma la direzione è coerente con la crescita di Advantage+, cioè le funzioni in cui Meta gestisce da sola pubblico, posizionamenti e ottimizzazione.

### Perché la creatività pesa di più

Tra gli addetti ai lavori (per esempio il consulente statunitense Jon Loomer) si è diffusa una lettura: a quanto risulta Andromeda è il sistema che seleziona quali annunci entrano nella fase di ranking, cioè quali hanno una possibilità di essere mostrati. La conseguenza pratica, secondo questa interpretazione, è che **la creatività pesa più del targeting per interessi**: è l'annuncio stesso a "trovare" il pubblico giusto.

![Meta Ads prima e ora: dal targeting manuale a creatività e segnali di conversione](/blog/meta-ads-creativita-advantage/prima-dopo.webp)

### Verifica degli inserzionisti e regole europee

L'11 marzo 2026 Meta ha presentato [nuovi strumenti contro le truffe](https://about.fb.com/news/2026/03/meta-launches-new-anti-scam-tools-deploys-ai-technology-to-fight-scammers-and-protect-people/). L'obiettivo è che entro fine 2026 il 90% del fatturato pubblicitario arrivi da inserzionisti verificati, contro il 70% attuale. La verifica si concentra sulle categorie più a rischio e può essere richiesta in base al luogo, allo storico di conformità e al tipo di annuncio. Nel 2025 Meta dichiara di aver rimosso oltre 159 milioni di annunci truffa, il 92% prima di qualsiasi segnalazione.

Poi ci sono le regole UE:

- **Annunci politici e sociali.** Dal 6 ottobre 2025 Meta [non pubblica più annunci politici, elettorali e su temi sociali](https://about.fb.com/news/2025/07/ending-political-electoral-and-social-issue-advertising-in-the-eu/) nell'Unione europea, per effetto del regolamento TTPA sulla pubblicità politica, in vigore dal 10 ottobre 2025. I contenuti organici restano consentiti.
- **Annunci meno personalizzati.** A quanto risulta, in base a un impegno preso con la Commissione europea a dicembre 2025 nell'ambito del Digital Markets Act, da gennaio 2026 gli utenti UE possono scegliere tra annunci personalizzati, abbonamento senza pubblicità e annunci "meno personalizzati". Se confermato, una parte del pubblico riceve annunci basati su meno dati, e la creatività deve funzionare anche senza un targeting preciso.
- **Etichette AI.** Il 28 luglio 2026 Meta ha firmato il Codice di condotta UE sulla trasparenza dei contenuti AI: è ragionevole aspettarsi più etichette sulle creatività generate con l'AI.

## Con l'AI il tuo lavoro si sposta: le leve che restano a te

Secondo noi il messaggio è chiaro. Se l'AI decide chi vede cosa, il vantaggio competitivo non sta più nel conoscere le impostazioni nascoste del pannello, ma in cinque cose:

1. **Creatività varie e di qualità**: formati diversi, angoli di messaggio diversi, contenuti in stile UGC (girati come se li avesse fatti un cliente), video verticali.
2. **Segnali puliti**: Pixel e API Conversioni (il collegamento diretto tra il tuo sito e Meta) installati bene, con eventi corretti.
3. **Obiettivi giusti**: ottimizzare per l'azione che conta davvero, non per quella più facile.
4. **Offerta chiara e landing veloce**: l'AI porta le persone, ma è la pagina a convincerle.
5. **Misurazione**: attribuzione incrementale e test, per capire cosa funziona davvero.

L'algoritmo impara da quello che gli dai. Creatività scarse e dati sporchi producono risultati scarsi, anche con il sistema più avanzato.

### Le creatività giuste per ristoranti, negozi e studi

**Ristorante o bar.** Un solo annuncio con la foto del locale non basta più. Servono varianti: il piatto in primo piano, un breve video della preparazione, una recensione letta da un cliente. Il sistema capisce da solo a chi mostrare cosa.

**Negozio.** Il carosello prodotti resta utile, ma affiancato da un video verticale che mostra un articolo in uso. Gli annunci che aprono una chat possono funzionare bene per chi preferisce chiedere prima di passare in negozio: se ti interessa, leggi la nostra guida all'[assistente AI su WhatsApp](/blog/whatsapp-business-ai).

**Studio professionale.** Per uno studio dentistico, legale o medico il tracciamento corretto dei contatti è decisivo: se Meta non riceve il segnale "richiesta inviata", ottimizza su clic poco utili. Attenzione anche alla verifica dell'account, che per alcune categorie può essere richiesta.

**E-commerce.** Il catalogo e Advantage+ lavorano meglio con eventi d'acquisto affidabili. Qui la misurazione incrementale aiuta a capire se le campagne portano vendite nuove o intercettano chi avrebbe comprato comunque.

**Associazioni, liste civiche, enti.** Dal 6 ottobre 2025 nell'UE non è più possibile sponsorizzare contenuti politici, elettorali o su temi sociali. Resta la comunicazione organica, su cui conviene investire con più costanza.

## Meta Ads 2026: la checklist per le piccole imprese

1. **Costruisci una griglia creativa.** Per esempio 3 angoli di messaggio (prezzo, qualità, esperienza del cliente) per 3 formati (video verticale, immagine statica, carosello). Nove annunci da cui l'AI può scegliere.
2. **Cura foto e video.** Materiale autentico, girato bene, dà all'algoritmo qualcosa su cui lavorare. È il motivo per cui abbiniamo spesso le campagne a [shooting fotografici](/shooting) e produzione di [video e reel](/video).
3. **Controlla Pixel e API Conversioni.** Verifica che gli eventi importanti (contatto, prenotazione, acquisto) vengano registrati una sola volta e con i dati giusti.
4. **Verifica l'account in anticipo.** Completa i dati del Business Manager, verifica l'attività e i metodi di pagamento prima di averne bisogno.
5. **Non spezzettare il budget.** Tante campagne da pochi euro al giorno danno all'AI pochi dati per imparare. Meglio meno campagne, con più varianti creative dentro.
6. **Scegli l'obiettivo giusto.** Se vuoi contatti, ottimizza per i contatti, non per il traffico.
7. **Etichetta le creatività AI realistiche.** Se usi immagini o video generati con l'AI che sembrano reali, dichiaralo. Approfondiamo gli [obblighi sui contenuti AI](/blog/contenuti-ai-obblighi-ai-act) in un articolo dedicato.
8. **Testa e misura.** Usa l'attribuzione incrementale quando disponibile e confronta le varianti per qualche settimana prima di tirare conclusioni.

## Un esempio reale: lead generation per uno studio dentistico

Un esempio concreto di questo approccio è il [caso dello studio dentistico Ricciardi](/casi-studio/ricciardi): abbiamo lavorato insieme su sito e lead generation, cioè sulla raccolta di richieste di contatto da pazienti potenziali. Il principio è lo stesso descritto qui: creatività pensate per il pubblico locale, pagina di destinazione chiara e tracciamento affidabile delle richieste, così che le campagne possano ottimizzare sul risultato che conta.

Se lavori in provincia, trovi anche la nostra pagina dedicata a [Meta Ads a Taranto](/meta-ads-taranto).

## Come impostiamo le campagne oggi

Nelle campagne che gestiamo per attività locali il tempo si è spostato: meno ore sulle impostazioni del pubblico, più ore sui contenuti. Per ogni campagna prepariamo varianti diverse per formato e messaggio, e le produciamo quando possibile con [video e reel](/video) girati nell'attività, con le persone che ci lavorano.

L'altra metà del lavoro è la misurazione. Prima di spendere il budget verifichiamo che Pixel ed eventi registrino le azioni giuste: una richiesta di contatto, una prenotazione, una telefonata. Nel [caso studio dello Studio Dentistico Ricciardi](/casi-studio/ricciardi) le campagne di lead generation sono state costruite insieme al sito proprio per questo.

## Domande frequenti

### Nel 2026 il targeting per interessi su Meta Ads serve ancora?

Può ancora servire in alcuni casi, ma pesa meno di un tempo. Il sistema di Meta usa l'AI per decidere a chi mostrare gli annunci, e molti addetti ai lavori ritengono che oggi sia la creatività a guidare la distribuzione. Per questo conviene investire soprattutto su annunci vari e di qualità.

### Cos'è Advantage+ e conviene a una piccola impresa?

Advantage+ è l'insieme delle funzioni automatiche di Meta Ads, in cui l'AI gestisce pubblico, posizionamenti e ottimizzazione. Può funzionare bene anche per una PMI, a patto di fornire creatività sufficienti, un evento di conversione ben tracciato e un budget non troppo frammentato.

### Devo verificare il mio account inserzionista Meta?

Meta punta a far arrivare entro fine 2026 il 90% del fatturato pubblicitario da inserzionisti verificati. La verifica si concentra sulle categorie a rischio e può essere richiesta in base a luogo, storico e tipo di annuncio. Conviene completare i dati del Business Manager in anticipo, per non trovarsi le campagne bloccate.

### Un'associazione può fare pubblicità su Meta nell'UE?

Dal 6 ottobre 2025 Meta non pubblica più annunci politici, elettorali e su temi sociali nell'Unione europea. I contenuti organici restano consentiti. Associazioni, liste civiche ed enti devono quindi valutare con attenzione il tema di ogni annuncio.

### Le creatività fatte con l'AI vanno etichettate?

Per immagini e video realistici generati con l'AI è bene prevedere un'etichetta. Meta ha firmato il Codice di condotta UE sulla trasparenza dei contenuti AI, quindi è ragionevole aspettarsi più etichette automatiche sulle piattaforme.

## In conclusione: dai all'AI materiale migliore

Nel 2026 fare Meta Ads significa meno regolazioni manuali e più sostanza: creatività varie, dati affidabili, un'offerta chiara e test fatti con metodo. Se parti da qui, le campagne automatiche lavorano a tuo favore invece che al buio.

Se hai un'attività locale e vuoi partire con la prima campagna, segui la guida passo passo alle [sponsorizzate Instagram per attività locali](/blog/sponsorizzate-instagram-attivita-locali).

Se vuoi impostare così le tue campagne, la nostra [gestione delle campagne Meta Ads](/meta-ads) parte proprio da creatività e tracciamento. Hai un dubbio sul tuo account? [Parliamone](/contatti).

*Le parti su regole UE e verifica degli inserzionisti hanno scopo informativo e non sostituiscono una consulenza legale.*

**Fonti**

- [Come l'AI guida le performance pubblicitarie nel 2026](https://about.fb.com/news/2026/01/2026-ai-drives-performance/) – Meta, 28 gennaio 2026
- [Nuovi strumenti e AI contro le truffe](https://about.fb.com/news/2026/03/meta-launches-new-anti-scam-tools-deploys-ai-technology-to-fight-scammers-and-protect-people/) – Meta, 11 marzo 2026
- [Stop agli annunci politici, elettorali e su temi sociali nell'UE](https://about.fb.com/news/2025/07/ending-political-electoral-and-social-issue-advertising-in-the-eu/) – Meta, luglio 2025`,
  },
  {
    slug: 'meta-one-aziende',
    title: 'Meta One per aziende: cosa offre, quanto costa e quando conviene davvero',
    excerpt: 'Meta ha lanciato Meta One, l\'abbonamento unico per Instagram, Facebook e WhatsApp. Ecco cosa includono i piani per aziende, quanto costano e come capire se ti servono davvero.',
    category: 'Social media',
    tags: ['meta one', 'instagram', 'facebook', 'whatsapp business', 'social media marketing', 'pmi'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/meta-one-aziende/cover.jpg',
    coverAlt: 'Profilo Instagram aziendale con badge verificato e i piani di Meta One',
    published: true,
    seoTitle: 'Meta One per aziende: prezzi e se conviene | InLab',
    seoDescription: 'Meta One aziende: prezzi dei piani, link nei post Instagram, badge verificato e 4 domande per capire se l\'abbonamento conviene alla tua PMI.',
    content: `**Meta One** è il nuovo abbonamento unico di Meta per Instagram, Facebook, WhatsApp e Meta AI, e per le **aziende** introduce piani a pagamento con funzioni che fino a ieri non esistevano, come i link cliccabili nei post organici. La domanda che ci stanno facendo i clienti è una sola: conviene?

**Risposta breve: Meta One conviene soprattutto a chi vive di clic verso il sito (e-commerce, prenotazioni online) e a chi subisce profili falsi che lo imitano. Per molte attività locali che lavorano con messaggi e telefonate si può aspettare: prima verifica il prezzo in euro nella tua app.**

La risposta onesta è "dipende". In questo articolo trovi cosa includono i piani, quanto costano secondo Meta e un metodo semplice in quattro domande per decidere senza farti guidare dall'effetto novità.

**In breve**

- Il 15 settembre 2026 Meta ha annunciato Meta One, un abbonamento unico per le sue app, con piani per singoli utenti e per creator e aziende.
- I bundle business partono da 14,99 $ al mese (Essential) e 49,99 $ (Advanced); i prezzi ufficiali sono in dollari e possono variare per Paese e account.
- Link nei post e nei Reels organici, Storie programmate fino a 30 giorni prima e accesso del team sono nel piano Advanced; badge verificato e protezione dai profili falsi già nell'Essential.
- L'abbonamento non sostituisce la leva più importante: su Facebook Meta premia i contenuti originali e declassa quelli ripubblicati.
- Prima di abbonarti, verifica il prezzo in euro nell'app e confrontalo con quello che otterresti investendo la stessa cifra in sponsorizzate.

## Meta One per aziende: piani e funzioni in parole semplici

Con l'[annuncio del 15 settembre 2026](https://about.fb.com/news/2026/09/introducing-meta-one-subscription-service-more-features-ai/) Meta ha riunito sotto un unico nome gli abbonamenti alle sue app. Il servizio è presentato come disponibile a livello globale, ma Meta specifica che piani, prezzi e disponibilità possono cambiare in base alla regione, all'app e al tipo di account.

### I piani per utenti singoli

Ci sono abbonamenti per la singola app: Instagram Plus e Facebook Plus a 3,99 $ al mese, WhatsApp Plus a 2,99 $. Poi due pacchetti che li combinano: Core a 7,99 $ e Premium a 19,99 $. Sono pensati per l'uso personale, non per chi gestisce un'attività.

### I bundle per creator e aziende

Qui c'è la parte che interessa a te. Meta indica prezzi "a partire da", sempre in dollari:

- **Essential, da 14,99 $/mese**: badge verificato, canale verificato nell'app WhatsApp Business, protezione dall'impersonificazione (cioè dai profili che si spacciano per il tuo brand) e accesso a Meta Business Agent, l'assistente AI di Meta per le aziende.
- **Advanced, da 49,99 $/mese**: programmazione delle Storie fino a 30 giorni prima, link nei post e nei Reels organici, analytics esportabili, accesso per i membri del team e più capacità per l'agente AI.
- **Expert (149 $) e Max (499 $)**: pensati per team strutturati.

Tra le funzioni business annunciate ci sono anche un profilo arricchito con sito web, sedi e una sezione "cosa dicono di te" con le recensioni, un pulsante Segui più evidente sui Reels e inviti automatici a seguire l'account rivolti a chi interagisce con i tuoi contenuti.

### E i prezzi in euro?

La pagina ufficiale non riporta prezzi in euro. Secondo alcune testate di settore i bundle business in Europa partirebbero da 16,99 €, ma è un dato da confermare. Il nostro consiglio: la cifra che conta è quella che vedi nell'app, sul tuo account, al momento dell'acquisto.

## Link nei post e originalità: cosa cambia davvero e cosa no

Per anni la regola su Instagram è stata "link in bio", perché i link nei post organici non erano cliccabili. Meta One cambia questo punto, ma solo per chi paga il piano Advanced. È una novità concreta per chi vive di traffico verso il sito.

Allo stesso tempo, l'abbonamento non è una scorciatoia per la visibilità. A marzo 2026 Meta ha spiegato come [premia i creator originali su Facebook](https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/):

- è **originale** un contenuto girato o prodotto dal titolare del profilo o della Pagina;
- un **remix** conta come originale solo se aggiunge informazioni, analisi o miglioramenti sostanziali;
- non basta reagire a un video, cucire clip, aggiungere bordi, didascalie o cambiare la velocità;
- il contenuto non originale viene declassato in Feed e Reels, e gli account che pubblicano soprattutto materiale altrui possono diventare non raccomandabili e perdere la monetizzazione.

Secondo Meta, visualizzazioni e tempo di visione dei Reels originali sono circa raddoppiati nel secondo semestre 2025 rispetto allo stesso periodo del 2024. Il messaggio è chiaro: il badge si compra, la pertinenza no.

### Badge verificato: gratuito o a pagamento?

C'è un possibile equivoco. A luglio 2026 Meta ha lanciato [Facebook Verified](https://about.fb.com/news/2026/07/introducing-facebook-verified/), un badge gratuito per persone maggiorenni che si verificano con un video-selfie, in mercati selezionati. Però non è disponibile per le Pagine né per i profili in modalità professionale. Per una Pagina aziendale, quindi, il badge verificato passa dai bundle business di Meta One.

## A chi conviene Meta One: e-commerce, negozi e attività locali

Non tutte le attività traggono lo stesso vantaggio da Meta One. Vediamo alcuni casi tipici.

**E-commerce e negozi con vendita online.** Se ogni clic al sito può diventare un ordine, i link nei post e nei Reels organici del piano Advanced possono avere senso: ogni contenuto diventa una porta verso la scheda prodotto, senza passare dal link in bio.

**Brand imitati da profili falsi.** Se ti è capitato di trovare account che copiano nome e logo per truffare i tuoi clienti, il badge verificato e la protezione dall'impersonificazione dell'Essential sono un investimento in fiducia. Qui conta anche una [identità di marca](/branding) riconoscibile e coerente, che rende più facile distinguere l'originale dalla copia.

**Aziende con un team che gestisce i social.** Accessi per i membri del team, Storie programmate con un mese di anticipo e analytics esportabili aiutano chi lavora con più persone o con un'agenzia.

**Attività locali che convertono via messaggio o telefono.** Un ristorante che riceve prenotazioni in DM, un parrucchiere che fissa appuntamenti su WhatsApp, uno studio professionale che viene chiamato dopo aver visto un post: per loro il link nel post aggiunge poco. Spesso conviene aspettare e lavorare su contenuti e messaggistica. Se il tuo canale principale è WhatsApp, leggi la nostra guida su [WhatsApp Business e Meta Business Agent](/blog/whatsapp-business-ai).

## Cosa fare in pratica: 5 passi prima di abbonarti

1. **Controlla il prezzo reale nell'app.** Apri le impostazioni del tuo account aziendale e verifica se Meta One è disponibile e a quanto, in euro, IVA inclusa.
2. **Guarda da dove arrivano i clienti.** Negli ultimi tre mesi, quanti contatti sono arrivati da clic al sito e quanti da messaggi o telefonate? Se i clic sono marginali, il piano Advanced ha poco da offrirti.
3. **Confronta il costo con le sponsorizzate.** Il canone annuo di un piano Advanced è una cifra che potresti investire in [campagne Meta Ads](/meta-ads) mirate. Chiediti quale delle due opzioni ti porterebbe più contatti misurabili.
4. **Valuta il rischio di profili falsi.** Se hai già avuto casi di imitazione o lavori in un settore dove sono frequenti, l'Essential può valere anche solo per il badge e la protezione.
5. **Prova per un periodo definito.** Se decidi di abbonarti, fissa un obiettivo (per esempio clic dai post o richieste ricevute) e dopo due o tre mesi verifica se il costo si è ripagato.

![Quattro domande per capire se l'abbonamento Meta One conviene alla tua azienda](/blog/meta-one-aziende/conviene-4-domande.webp)

### La leva che resta gratuita: contenuti originali

Qualunque cosa decidi sull'abbonamento, la base non cambia. Secondo noi il miglior investimento per una PMI resta produrre contenuti propri: riprese in negozio, lo staff al lavoro, il dietro le quinte di un servizio o di una preparazione.

Meta stessa mette a disposizione strumenti gratuiti. L'app [Edits](https://about.fb.com/news/2026/04/one-year-of-edits-built-for-and-with-creators/) offre teleprompter, sottotitoli, curve di velocità, una scheda Idee con spunti AI settimanali e template. I [Trial reels](https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfoms-best/) permettono di mostrare un reel prima a chi non ti segue, per capire cosa funziona senza "sporcare" il profilo. Se vuoi un aiuto a impostare le riprese, trovi il nostro servizio di [video e reel](/video).

## Un esempio: negozio di arredamento contro pizzeria

Facciamo un esempio ipotetico con due attività della stessa città.

Il **negozio di arredamento** vende anche online e ogni settimana pubblica Reels con i nuovi arrivi. Oggi chi vuole il prodotto deve andare nel profilo, aprire il link in bio e cercarlo sul sito. Con il link diretto nel Reel il percorso si accorcia. In più, il team di tre persone potrebbe condividere gli accessi e programmare le Storie delle promozioni in anticipo. Per lui l'Advanced è un'ipotesi concreta da testare.

La **pizzeria** riceve quasi tutte le prenotazioni per telefono o WhatsApp e non ha un e-commerce. Il link nel post porterebbe al massimo al menu. Per lei l'abbonamento può aspettare: lo stesso budget rende di più in video girati in cucina, in una buona [gestione dei social](/gestione-social) e magari in una piccola sponsorizzata locale nel weekend.

Stessa piattaforma, scelte opposte. Ed entrambe corrette.

## Il nostro punto di vista

Nei profili che gestiamo, i contenuti che funzionano meglio sono quasi sempre quelli girati nell'attività: il laboratorio, il banco, lo staff al lavoro. È quello che Meta chiama contenuto originale, ed è gratis. Un abbonamento può aggiungere strumenti utili, ma non sostituisce una buona idea girata bene.

Facciamo un esempio: una boutique di Taranto che vende anche online potrebbe avere un vantaggio reale dai link nei post e nei Reels. Un bar di Palagiano che lavora con clienti di passaggio probabilmente no. Prima di abbonarti guarda i tuoi numeri: quante persone cliccano già il link nella bio e quante ti scrivono in DM. Se vuoi un parere su come impostare il profilo, è parte del nostro lavoro di [gestione social](/gestione-social).

## Domande frequenti

### Quanto costa Meta One per le aziende?

Meta indica prezzi ufficiali in dollari: i bundle per creator e aziende partono da 14,99 $ al mese (Essential) e 49,99 $ (Advanced), fino a 149 $ (Expert) e 499 $ (Max). La pagina ufficiale non riporta prezzi in euro e Meta precisa che piani e prezzi possono variare per Paese, app e account: controlla la cifra direttamente nell'app.

### Con Meta One posso mettere link nei post Instagram?

Sì, secondo l'annuncio di Meta i link nei post e nei Reels organici sono inclusi nel bundle Advanced, non nell'Essential. Se il tuo obiettivo principale è portare traffico al sito, è la funzione da valutare con più attenzione.

### La spunta blu su Instagram per aziende è inclusa in Meta One?

Il badge verificato è incluso già nel bundle Essential, insieme alla protezione dall'impersonificazione e al canale verificato su WhatsApp Business. Il badge gratuito Facebook Verified tramite video-selfie, invece, non è disponibile per Pagine e profili professionali.

### Senza abbonamento i miei post avranno meno visibilità?

Nelle comunicazioni ufficiali che abbiamo consultato non si parla di penalizzazioni per chi non si abbona. Il fattore che Meta ha dichiarato di premiare su Facebook è l'originalità: i contenuti girati o prodotti da te vengono favoriti, quelli ripubblicati da altri vengono declassati in Feed e Reels.

### Meta One conviene a un'attività locale?

Dipende da come arrivano i tuoi clienti. Se convertono soprattutto via messaggio o telefono, spesso puoi aspettare e investire prima in contenuti e sponsorizzate. Se vivi di clic al sito o hai problemi di profili falsi, vale la pena fare due conti.

## Conclusione: decidi con i numeri, non con l'effetto novità

Meta One porta funzioni utili, soprattutto i link nei post organici e la protezione dai profili falsi. Ma è un costo fisso che va giustificato con risultati misurabili, e non sostituisce la cosa che l'algoritmo premia davvero: contenuti tuoi, girati da te, pubblicati con costanza. Se non sai da dove partire, un [piano editoriale](/blog/quante-volte-pubblicare-social) realistico è il primo passo.

Se vuoi capire se l'abbonamento ha senso per la tua attività, guardando i tuoi dati e non quelli medi, [parliamone](/contatti).

**Fonti**

- [Introducing Meta One: A Subscription Service With More Features and AI – Meta Newsroom, 15 settembre 2026](https://about.fb.com/news/2026/09/introducing-meta-one-subscription-service-more-features-ai/)
- [Rewarding Original Creators on Facebook – Meta Newsroom, marzo 2026](https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/)
- [Introducing Facebook Verified – Meta Newsroom, 24 luglio 2026](https://about.fb.com/news/2026/07/introducing-facebook-verified/)
- [One Year of Edits: Built for and With Creators – Meta Newsroom, 22 aprile 2026](https://about.fb.com/news/2026/04/one-year-of-edits-built-for-and-with-creators/)
- [Trial Reels: Try Content With Non-Followers First – Meta Newsroom, dicembre 2024](https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfoms-best/)`,
  },
  {
    slug: 'seo-tiktok-search-ads',
    title: 'SEO su TikTok e TikTok Search Ads: la guida pratica per attività e PMI',
    excerpt: 'TikTok è sempre più usato come motore di ricerca. Ecco come ottimizzare i tuoi video per farti trovare, come funzionano le Search Ads disponibili in Italia e quando ha senso TikTok Shop.',
    category: 'Social media',
    tags: ['tiktok', 'seo su tiktok', 'tiktok search ads', 'tiktok shop', 'pubblicità locale', 'video marketing'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/seo-tiktok-search-ads/cover.jpg',
    coverAlt: 'Ricerca su TikTok di un parrucchiere a Massafra con un video sponsorizzato',
    published: true,
    seoTitle: 'SEO su TikTok e Search Ads per attività locali | InLab',
    seoDescription: 'SEO su TikTok e TikTok Search Ads in Italia: come ottimizzare i video per la ricerca, usare keyword locali e valutare TikTok Shop con i conti giusti.',
    content: `Fare **SEO su TikTok** significa preparare i tuoi video perché compaiano quando qualcuno cerca un servizio, un prodotto o un posto dentro l'app, e con le **TikTok Search Ads** oggi puoi anche sponsorizzarti proprio in quei risultati di ricerca. Per molte persone, soprattutto quando cercano un ristorante, un parrucchiere o un prodotto da provare, TikTok è diventato un vero motore di ricerca.

Questo cambia il modo di pensare i contenuti: non basta intrattenere, serve anche farsi trovare. Vediamo cosa è cambiato, cosa è disponibile in Italia e cosa puoi fare da subito.

**In breve**

- Secondo dati globali di TikTok, il 57% degli utenti usa la funzione di ricerca e il 23% cerca qualcosa entro 30 secondi dall'apertura dell'app.
- In Italia le campagne Search Ads sono disponibili con obiettivi Traffico e Conversioni sul sito web, con targeting per parole chiave.
- Un video si ottimizza per la ricerca dicendo e scrivendo la parola chiave, con una didascalia descrittiva e la località.
- TikTok Shop in Italia conta oltre 21.000 venditori attivi: può valere la pena, ma solo facendo bene i conti dei margini.

## TikTok come motore di ricerca: numeri e Search Ads in Italia

I numeri che TikTok comunica sono chiari, anche se vanno letti per quello che sono: **dati globali, non italiani**. Secondo TikTok, il 57% degli utenti usa la ricerca, il 23% cerca qualcosa entro 30 secondi dall'apertura dell'app e oltre la metà preferisce cercare prodotti su video e social piuttosto che sui browser.

In pratica, molte persone aprono TikTok e scrivono "dove mangiare a Taranto" come farebbero su Google. E i risultati sono video.

### Le Search Ads Campaign, disponibili anche in Italia

Su questa abitudine TikTok ha costruito un formato pubblicitario dedicato. Secondo la [pagina di disponibilità delle Search Ads Campaign](https://ads.tiktok.com/help/article/search-ads-campaign-availability?lang=en), aggiornata ad aprile 2026, in Italia puoi usarle con due obiettivi: **Traffico** (portare persone al sito) e **Conversioni sul sito web** (spingerle a compiere un'azione, come un acquisto o una richiesta). L'obiettivo Lead generation risulta disponibile solo negli Stati Uniti.

I formati previsti sono tre:

- **Search Ads Video**, cioè annunci video nei risultati di ricerca;
- **Carousel Image Ads**, annunci a carosello di immagini;
- **Search Catalog**, basati su un catalogo prodotti, solo per le categorie Sales e Travel & Entertainment.

Come spiega TikTok nella [presentazione del formato](https://ads.tiktok.com/business/en-US/blog/introducing-search-ads-campaign), il targeting avviene per parole chiave nella pagina dei risultati. Ci sono strumenti di suggerimento delle keyword con stima delle impressioni (quante volte l'annuncio potrebbe essere visto), keyword automatiche, miniature generate in automatico ("smart thumbnails") e annunci con più varianti di testo.

### Le novità in arrivo

Nella [Product Preview del terzo trimestre 2026](https://ads.tiktok.com/business/en-US/blog/tiktok-product-preview) TikTok ha annunciato le "Smart+ Search Ads", cioè una versione più automatizzata delle campagne di ricerca. A [TikTok World '26](https://newsroom.tiktok.com/tiktok-world-26?lang=it-IT) sono stati presentati anche i Search Hubs, pagine del brand che compaiono in cima ai risultati di ricerca: un prodotto premium, pensato più per grandi marchi che per le PMI.

## Perché chi cerca su TikTok è già pronto a scegliere

Chi cerca ha già un'intenzione. Chi scorre il feed, invece, si sta distraendo. È la stessa differenza che c'è tra una ricerca su Google e un annuncio visto per caso.

TikTok sostiene che usare Search Ads insieme agli annunci In-Feed (quelli che compaiono mentre scorri i video) porti in media il 20% di conversioni in più, e che il 18% di chi non converte con un annuncio In-Feed lo faccia dopo averne visto uno nella ricerca. Sono dati dell'azienda, da prendere come indicazione e non come promessa.

Il punto per noi è un altro: se i tuoi video non sono pensati per essere trovati, stai lasciando fuori proprio le persone più vicine a scegliere.

## Cosa cercano le persone su TikTok: ristoranti, parrucchieri, negozi

**Ristoranti e bar.** Le ricerche con città e tipo di locale ("brunch Taranto", "pizzeria Castellaneta") sono il terreno ideale. Un video che mostra il piatto e dice chiaramente dove sei può comparire per mesi.

**Parrucchieri, estetiste e centri benessere.** Le persone cercano tagli, colori, trattamenti. Un video "prima e dopo" con il nome del trattamento detto e scritto risponde esattamente a quella ricerca.

**Negozi e e-commerce.** Qui entra in gioco anche TikTok Shop, che vediamo tra poco. Chi cerca "idee regalo" o un prodotto specifico è già in modalità acquisto.

**Studi professionali.** Un dentista, un commercialista o un avvocato possono rispondere in video alle domande che si sentono fare ogni giorno. Non per vendere subito, ma per essere il nome che compare quando qualcuno cerca.

### TikTok Shop Italia: i numeri e i conti da fare

Secondo il [comunicato di TikTok sul primo anno di TikTok Shop in Italia](https://newsroom.tiktok.com/tiktok-shop-italia-un-anno-dopo-il-discovery-e-commerce-riscrive-il-retail-digitale?lang=it-IT), pubblicato ad aprile 2026:

- i venditori attivi in Italia sono oltre 21.000, contro gli oltre 8.000 di settembre 2025;
- TikTok Italia dichiara 25,2 milioni di utenti attivi mensili;
- secondo NielsenIQ, 1 e-shopper su 5 usa TikTok Shop;
- il 38% del fatturato arriva dai video acquistabili e il 20% dalle LIVE di shopping;
- gli over 40 valgono il 41% del valore di TikTok Shop, contro il 32% dell'e-commerce nel suo complesso;
- bellezza, moda, casa ed elettronica sono le categorie in crescita.

Il dato sugli over 40 è interessante: smentisce l'idea che TikTok sia solo per ragazzi.

Attenzione però ai costi. Secondo quanto riportato da alcune testate di settore, dall'8 gennaio 2026 la commissione di TikTok Shop in Italia sarebbe passata dal 5% al 9%. Il nostro consiglio: prima di aprire, calcola il margine reale per prodotto, considerando commissioni, spedizioni, resi ed eventuali compensi ai creator.

## Cosa fare in pratica: SEO su TikTok passo per passo

Le indicazioni che seguono non sono regole ufficiali di TikTok, ma le buone pratiche che applichiamo ogni giorno nella produzione di [video e reel](/video) per i nostri clienti.

![Sei passi per ottimizzare un video per la ricerca su TikTok](/blog/seo-tiktok-search-ads/ottimizzare-video-ricerca.webp)

1. **Di' la parola chiave nei primi secondi.** Se il video parla di "taglio bob", dillo a voce all'inizio. Aiuta chi guarda a capire subito e rende chiaro l'argomento.
2. **Scrivila anche a schermo.** Un testo in sovrimpressione con la parola chiave rafforza il messaggio, anche per chi guarda senza audio.
3. **Scrivi una didascalia descrittiva, con la località.** Non "Che ne dite? 😍", ma "Taglio bob corto per capelli ricci, nel nostro salone a Massafra".
4. **Attiva i sottotitoli.** Rendono il video accessibile e più comprensibile anche in contesti silenziosi.
5. **Usa pochi hashtag, ma pertinenti.** Meglio tre hashtag legati al servizio e alla città che dieci hashtag di tendenza che non c'entrano.
6. **Rispondi alle domande vere dei clienti.** "Quanto dura una piega?", "Si può prenotare per un gruppo?": ogni domanda ricorrente è un video.
7. **Crea serie ricorrenti.** Un appuntamento fisso ("il piatto del giovedì", "un consiglio a settimana") aiuta a pubblicare con costanza. Per decidere ritmo e frequenza, parti da un [piano editoriale](/blog/quante-volte-pubblicare-social) sostenibile.

### Poi, testa le Search Ads su keyword locali

Quando hai qualche video che funziona in modo organico, puoi provare le Search Ads su poche parole chiave locali, come "pizzeria Taranto" o "parrucchiere Massafra". Parti con un budget contenuto, usa lo strumento di suggerimento keyword per stimare le impressioni e misura i clic al sito.

Se già investi su Instagram e Facebook, confronta i risultati con le tue campagne [Meta Ads](/meta-ads): non tutte le attività hanno bisogno di essere ovunque.

## Un esempio: il parrucchiere di Massafra

Facciamo un esempio ipotetico. Un salone di Massafra pubblica ogni settimana un video "prima e dopo". Finora le didascalie erano solo emoji.

Cambia approccio: nei primi secondi la titolare dice "balayage biondo miele su capelli castani", lo stesso testo compare a schermo, la didascalia cita il salone e la città, gli hashtag sono tre e pertinenti. Lancia una serie "Domande dal salone" con le richieste che riceve più spesso.

Dopo qualche settimana, avvia una piccola campagna Search Ads con obiettivo Traffico verso la pagina di prenotazione, su due o tre keyword come "parrucchiere Massafra" e "balayage Massafra". Il budget è limitato e l'obiettivo è capire se quelle ricerche portano prenotazioni vere. Solo dopo decide se continuare.

## Cosa osserviamo nei contenuti per attività locali

Quando progettiamo i video per un'attività locale partiamo dalle domande che i clienti fanno davvero: "quanto dura un trattamento", "si può prenotare per gruppi", "cosa c'è di nuovo nel menu". Un video che risponde a una domanda precisa ha più possibilità di comparire quando qualcuno la cerca. Vale per TikTok, ma anche per Instagram e YouTube Shorts.

L'altra lezione riguarda la costanza. Una serie di video con lo stesso format è più facile da produrre per chi ha poco tempo, ed è più riconoscibile per chi guarda. Nel [caso studio Paresteta](/casi-studio/paresteta) la campagna di lancio era divisa in fasi, con contenuti diversi prima e dopo l'inaugurazione.

## Domande frequenti

### Cos'è la SEO su TikTok?

È l'insieme di accorgimenti che aiutano un video a comparire quando qualcuno cerca un argomento dentro TikTok: parole chiave dette e scritte, didascalie descrittive, sottotitoli, hashtag pertinenti. L'idea è la stessa della SEO su Google, applicata ai video.

### Le TikTok Search Ads sono disponibili in Italia?

Sì. Secondo la pagina di disponibilità di TikTok aggiornata ad aprile 2026, in Italia le campagne Search Ads si possono usare con gli obiettivi Traffico e Conversioni sul sito web. L'obiettivo Lead generation, invece, risulta disponibile solo negli Stati Uniti.

### Le Search Ads servono anche a un'attività locale?

Possono servire, soprattutto se le persone cercano il tuo servizio con il nome della città, per esempio "parrucchiere Massafra". Il nostro consiglio è partire con un budget contenuto su poche keyword locali e misurare i risultati prima di aumentare la spesa.

### Quanto costa vendere su TikTok Shop in Italia?

Secondo quanto riportato da alcune testate di settore, dall'8 gennaio 2026 la commissione di TikTok Shop in Italia sarebbe passata dal 5% al 9%. Verifica sempre le condizioni aggiornate nel Seller Center prima di fare i conti sui margini.

### Quanti hashtag usare su TikTok per farsi trovare?

Non esiste un numero magico. Secondo la nostra esperienza funzionano meglio pochi hashtag pertinenti al contenuto e alla località, rispetto a lunghe liste di hashtag generici o di tendenza che non c'entrano con il video.

## Conclusione: prima farsi trovare, poi sponsorizzarsi

Su TikTok la ricerca è ormai un'abitudine. Il primo passo non costa nulla: rendere ogni video chiaro su cosa mostra e dove sei. Il secondo è testare le Search Ads su poche keyword locali, con un budget piccolo e obiettivi misurabili. Il terzo, se vendi prodotti, è valutare TikTok Shop con i conti alla mano.

Se hai un ristorante o un bar e cerchi spunti su cosa girare, trovi 15 esempi pronti nella guida alle [idee di reel per ristoranti e bar](/blog/idee-reel-ristoranti).

Se vuoi impostare una strategia TikTok per la tua attività, con una [gestione dei social](/gestione-social) pensata per il tuo territorio (lavoriamo anche con la [gestione social a Taranto](/gestione-social-taranto) e provincia), [parliamone](/contatti).

**Fonti**

- [Search Ads Campaign availability – TikTok Ads Manager Help Center, aprile 2026](https://ads.tiktok.com/help/article/search-ads-campaign-availability?lang=en)
- [Introducing Search Ads Campaign – TikTok for Business](https://ads.tiktok.com/business/en-US/blog/introducing-search-ads-campaign)
- [TikTok Product Preview Q3 2026 – TikTok for Business, 28 luglio 2026](https://ads.tiktok.com/business/en-US/blog/tiktok-product-preview)
- [TikTok World '26 – TikTok Newsroom, 13 maggio 2026](https://newsroom.tiktok.com/tiktok-world-26?lang=it-IT)
- [TikTok Shop Italia un anno dopo – TikTok Newsroom, 27 aprile 2026](https://newsroom.tiktok.com/tiktok-shop-italia-un-anno-dopo-il-discovery-e-commerce-riscrive-il-retail-digitale?lang=it-IT)`,
  },
  {
    slug: 'quante-volte-pubblicare-social',
    title: 'Quante volte pubblicare sui social nel 2026: frequenza, orari e un piano sostenibile per PMI',
    excerpt: 'Frequenza consigliata per Instagram, TikTok, LinkedIn, Facebook, YouTube e Pinterest, orari da cui partire e un piano minimo che una PMI riesce davvero a mantenere.',
    category: 'Social media',
    tags: ['piano editoriale', 'instagram', 'linkedin', 'tiktok', 'facebook', 'statistiche social'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/quante-volte-pubblicare-social/cover.jpg',
    coverAlt: 'Calendario settimanale dei contenuti social con post, reel e storie',
    published: true,
    seoTitle: 'Quante volte pubblicare sui social: guida 2026 | InLab',
    seoDescription: 'Quante volte pubblicare sui social e a che ora: frequenze per piattaforma, orari migliori 2026, dati Italia e un piano editoriale sostenibile per PMI.',
    content: `Quante volte pubblicare sui social, e a che ora? È la domanda che ci fanno più spesso titolari di negozi, ristoranti e studi professionali, e la risposta onesta è: dipende dalla piattaforma, ma soprattutto da quanto riesci a sostenere nel tempo. In questa guida mettiamo insieme gli orari migliori per pubblicare nel 2026 secondo i dati più recenti, le frequenze consigliate per ogni social e un piano editoriale minimo che una PMI può davvero rispettare.

**Risposta breve: per una PMI un buon punto di partenza è 3-5 contenuti a settimana su Instagram, 2-5 su TikTok e LinkedIn, 1-2 al giorno su Facebook solo se è un canale centrale. Conta più la costanza della quantità: meglio un ritmo che riesci a tenere per mesi.**

Una premessa importante: quasi tutti gli studi su frequenza e orari sono basati su dati internazionali, non italiani. Li useremo come punto di partenza, non come regola, e ti spieghiamo come verificarli sul tuo profilo in quattro settimane.

**In breve**

- In Italia 41,2 milioni di persone hanno un'identità social (69,7% della popolazione), secondo DataReportal.
- Frequenze di partenza secondo Buffer: Instagram 3-5 post a settimana, TikTok 2-5, LinkedIn 2-5, Facebook 1-2 al giorno, YouTube 1 video a settimana.
- Il mercoledì è il giorno forte per Facebook, Instagram e LinkedIn; TikTok e YouTube vanno meglio nel weekend.
- La costanza conta più del volume: chi pubblica con regolarità ottiene in media 5 volte più engagement (dati Buffer).
- Contenuti fatti da persone e originali: lo chiedono i consumatori e, su Facebook, lo premia l'algoritmo.

## Il quadro in Italia: dove sono le persone nel 2026

Partiamo dai numeri italiani. Il report ["Digital 2026: Italy"](https://datareportal.com/reports/digital-2026-italy) di DataReportal, pubblicato il 5 novembre 2025 con dati di ottobre 2025, fotografa un Paese di 59,1 milioni di abitanti, con un'età mediana di 48,2 anni. Gli utenti internet sono 53,1 milioni (89,9%) e le identità social 41,2 milioni (69,7%).

Per le singole piattaforme DataReportal riporta la **copertura pubblicitaria**, cioè quante persone si possono raggiungere con gli annunci. Non è il numero di utenti attivi, ma dà un'idea chiara delle proporzioni:

- **YouTube:** 41,2 milioni (-2,4%)
- **Instagram:** 29,9 milioni (+4,2%)
- **Facebook:** 28,5 milioni (-2,6%)
- **LinkedIn:** 25,0 milioni (+13,6%)
- **TikTok (18+):** 22,0 milioni (+6,9%)
- **Reddit:** 14,8 milioni
- **Pinterest:** 10,9 milioni

Due letture utili. LinkedIn è la piattaforma che cresce di più (+13,6%), un segnale da non ignorare per professionisti e aziende B2B. Facebook e YouTube calano leggermente ma restano tra i canali più ampi, soprattutto considerando un'età mediana vicina ai 48 anni.

## Quante volte pubblicare sui social: le frequenze per piattaforma

La [guida di Buffer sulla frequenza](https://buffer.com/resources/social-media-frequency-guide/), aggiornata il 13 gennaio 2026 e basata su dati interni della piattaforma, dà queste indicazioni:

- **Instagram: 3-5 post a settimana.** Rispetto a 1-2 post, porta in media circa il 12% di reach in più per ogni post.
- **TikTok: 2-5 video a settimana.** Fino al 17% di visualizzazioni in più per post rispetto a un solo video.
- **LinkedIn: 2-5 post a settimana.** Il salto vero si vede passando da 1 post a 2-5.
- **Facebook: 1-2 post al giorno**, secondo uno studio HubSpot citato da Buffer.
- **YouTube: 1 video a settimana.**
- **Pinterest: 15-25 pin al giorno.** Una frequenza alta, pensata per chi usa Pinterest come canale principale.

C'è poi un dato che per noi è il più importante di tutti: in un'analisi su oltre 100.000 utenti, Buffer ha rilevato che **pubblicare con regolarità si associa a un engagement 5 volte superiore**. Tradotto: meglio costante che tanto.

![Frequenza consigliata di pubblicazione per Instagram, TikTok, LinkedIn, Facebook, YouTube e Pinterest](/blog/quante-volte-pubblicare-social/frequenza-piattaforme.webp)

*Le frequenze di partenza per piattaforma secondo Buffer (dati non italiani, gennaio 2026).*

## Gli orari migliori per pubblicare nel 2026

Buffer ha analizzato oltre 52 milioni di post, considerando l'ora locale di chi pubblica. Ecco le fasce migliori emerse dalla sua [analisi sugli orari](https://buffer.com/resources/best-time-to-post-social-media/):

- **Facebook**: mercoledì, tra le 8 e le 12.
- **Instagram**: mercoledì alle 9 e alle 18.
- **LinkedIn**: mercoledì, tra le 15 e le 18.
- **TikTok**: sabato, tra le 18 e le 23.
- **YouTube Shorts**: venerdì, tra le 16 e le 19.
- **YouTube (video lunghi)**: domenica, tra le 18 e le 22.

In generale il weekend è in calo, tranne per TikTok e YouTube.

### Il caso LinkedIn

Su LinkedIn Buffer ha pubblicato un [approfondimento aggiornato al 9 settembre 2026](https://buffer.com/resources/best-time-to-post-on-linkedin/), basato su 4,8 milioni di post. La fascia migliore è **15-20 nei giorni feriali**, con un picco il mercoledì alle 16. Lunedì e martedì risultano i giorni più deboli. E i **caroselli** (post a più slide da scorrere) funzionano meglio dei post di solo testo.

## Perché la quantità da sola non basta

Pubblicare di più non serve se i contenuti sono deboli o copiati. Due segnali del 2026 vanno nella stessa direzione.

Il primo arriva dal [2026 Content Strategy Report di Sprout Social](https://sproutsocial.com/insights/data/2026-social-media-content-strategy-report/), che ha coinvolto oltre 2.300 consumatori tra USA, Regno Unito e Australia e 1.200 marketer. La priorità numero uno dei consumatori sono i **contenuti fatti da persone**, con l'intelligenza artificiale in un ruolo di supporto. Anche qui, dati non italiani.

Il secondo arriva da Meta: da marzo 2026, su Facebook [i contenuti non originali vengono declassati](https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/), cioè i post ripubblicati senza un apporto proprio ricevono meno visibilità. Ne parliamo anche nell'articolo su [Meta One e originalità dei contenuti](/blog/meta-one-aziende).

Secondo noi il punto è semplice: foto vere del tuo locale, video girati con il tuo team, la tua voce. Un buon [shooting fotografico](/shooting) e qualche sessione dedicata a [reel e video](/video) possono alimentare settimane di contenuti originali.

### Quali canali scegliere: ristoranti, negozi e professionisti

Le frequenze di Buffer sono pensate per chi ha tempo e risorse. Una PMI deve scegliere dove concentrarsi.

- **Ristorante o bar**: Instagram è il canale centrale, con reel dei piatti e stories quotidiane. Facebook resta utile per una clientela più adulta, visto che l'età mediana italiana è di 48,2 anni.
- **Negozio**: Instagram per prodotti e novità, stories per raccontare arrivi e offerte. TikTok solo se hai le energie per produrre video con regolarità.
- **Studio professionale** (commercialista, avvocato, dentista, consulente): LinkedIn, che in Italia cresce più di tutti. Due o tre post a settimana, meglio se caroselli.
- **E-commerce**: Instagram e TikTok per la scoperta dei prodotti; Pinterest solo se il tuo settore è visivo (arredo, moda, food). Su TikTok vale anche la logica di ricerca, di cui parliamo nell'articolo su [TikTok come motore di ricerca](/blog/seo-tiktok-search-ads).

## Cosa fare in pratica: un piano editoriale minimo e sostenibile

### La settimana tipo per un'attività locale

Il nostro consiglio è partire da qui e crescere solo quando il ritmo è diventato un'abitudine:

- **3 post su Instagram** (per esempio lunedì, mercoledì e venerdì), di cui uno pubblicato il mercoledì mattina o alle 18;
- **2 reel** a settimana, anche brevi, girati nel locale;
- **stories ogni giorno**: dietro le quinte, prodotto del giorno, orari, sondaggi;
- **Facebook**: condividi i contenuti più forti, adattandoli e aggiungendo un testo pensato per quel pubblico.

### La settimana tipo per un professionista

- **2-3 post su LinkedIn**, nei giorni centrali della settimana, nella fascia 15-18;
- almeno **un carosello** a settimana (una checklist, un errore comune, una domanda frequente dei clienti);
- evita di concentrare tutto il lunedì e il martedì.

### Come testare gli orari in 4 settimane

1. **Settimana 1**: pubblica negli orari consigliati da Buffer e annota i risultati di ogni post.
2. **Settimana 2**: sposta gli stessi tipi di contenuto in una fascia diversa (per esempio dalla mattina alla sera).
3. **Settimana 3**: prova gli orari suggeriti dagli insight del tuo profilo, cioè quando i tuoi follower sono più attivi.
4. **Settimana 4**: ripeti la fascia che ha funzionato meglio e confronta.

Cambia una sola variabile alla volta: se modifichi insieme orario, formato e argomento, non saprai cosa ha fatto la differenza.

### Cosa misurare

- **Copertura (reach)**: quante persone diverse hanno visto il contenuto.
- **Interazioni**: commenti, condivisioni, salvataggi. Salvataggi e condivisioni dicono più dei "mi piace".
- **Visualizzazioni dei reel** e tempo di visione, se disponibile.
- **Azioni concrete**: messaggi, clic al sito, chiamate, richieste di prenotazione.
- **Costanza**: quante settimane hai rispettato il piano. Sembra banale, ma è il primo indicatore da guardare.

### Un esempio: una pizzeria che smette di pubblicare "a caso"

Facciamo un esempio ipotetico. Una pizzeria di Taranto pubblica quando capita: tre post in un giorno, poi due settimane di silenzio. Decide di passare al piano minimo: 3 post, 2 reel e stories quotidiane, preparati la domenica in un'ora di lavoro con le foto di uno shooting fatto a inizio mese.

Per quattro settimane segue il test degli orari e annota reach e messaggi ricevuti. Alla fine non ha "la formula perfetta", ma sa quali giorni e fasce funzionano per il suo pubblico e ha un ritmo che riesce a mantenere. È esattamente questo il risultato che conta.

## Come costruiamo un piano editoriale

Quando costruiamo un piano editoriale per un'attività locale non partiamo dal numero di post: partiamo da quanto materiale si riesce a produrre ogni mese. Una giornata di riprese ben organizzata può coprire settimane di contenuti. Pubblicare ogni giorno materiale improvvisato, invece, stanca il titolare e anche chi guarda.

Il secondo criterio è la stagionalità, che in provincia di Taranto conta molto. Facciamo un esempio: uno stabilimento o un ristorante di Castellaneta Marina avrà un ritmo estivo molto più fitto di quello invernale. Un negozio di Taranto città, invece, avrà i suoi picchi tra dicembre e i saldi. Il piano segue il calendario reale dell'attività, non una regola uguale per tutti.

## Domande frequenti

### Quante volte a settimana pubblicare su Instagram?

Secondo i dati interni di Buffer, 3-5 post a settimana portano in media circa il 12% di reach in più per post rispetto a 1-2. Per una PMI è un buon obiettivo, a patto di riuscire a mantenerlo nel tempo.

### Qual è l'orario migliore per pubblicare sui social?

Dall'analisi Buffer su oltre 52 milioni di post emergono alcune fasce, per esempio mercoledì alle 9 e alle 18 per Instagram e mercoledì tra le 15 e le 18 per LinkedIn. Sono dati non italiani: usali come punto di partenza e verificali con gli insight del tuo profilo.

### Quante volte pubblicare su LinkedIn?

Buffer indica 2-5 post a settimana, con il salto più evidente quando si passa da 1 a 2-5. La fascia oraria migliore nei feriali è 15-20, con un picco il mercoledì alle 16, e i caroselli funzionano meglio del solo testo.

### È meglio pubblicare tanto o con costanza?

Con costanza. Un'analisi di Buffer su oltre 100.000 utenti associa la pubblicazione regolare a un engagement 5 volte superiore. Un piano più leggero ma rispettato ogni settimana vale più di un periodo intenso seguito da settimane di silenzio.

### Posso usare l'intelligenza artificiale per i post?

Sì, come supporto. Secondo il 2026 Content Strategy Report di Sprout Social, la priorità numero uno dei consumatori sono i contenuti fatti da persone. E su Facebook Meta declassa i contenuti non originali, ripubblicati senza un apporto proprio.

## Meglio costante che tanto: da dove partire

Non esiste un numero magico valido per tutti. Esistono frequenze di partenza, orari da testare e soprattutto un ritmo che puoi mantenere. Il punto pratico: scegli una o due piattaforme, adotta il piano minimo, fai il test di quattro settimane e decidi in base ai tuoi dati, non a quelli di qualcun altro.

Se ti serve una mano a costruire un piano editoriale realistico e a produrre contenuti originali, la nostra [gestione social](/gestione-social) nasce proprio per questo, anche per le attività della provincia con la [gestione social a Taranto](/gestione-social-taranto). Vuoi capire quale ritmo è giusto per te? [Parliamone](/contatti).

**Fonti**

- [Digital 2026: Italy](https://datareportal.com/reports/digital-2026-italy) – DataReportal, 5 novembre 2025
- [How Often Should You Post on Social Media](https://buffer.com/resources/social-media-frequency-guide/) – Buffer, 13 gennaio 2026
- [The Best Time to Post on Social Media](https://buffer.com/resources/best-time-to-post-social-media/) – Buffer, 2026
- [The Best Time to Post on LinkedIn](https://buffer.com/resources/best-time-to-post-on-linkedin/) – Buffer, aggiornato il 9 settembre 2026
- [2026 Social Media Content Strategy Report](https://sproutsocial.com/insights/data/2026-social-media-content-strategy-report/) – Sprout Social, 2026
- [Rewarding Original Creators on Facebook](https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/) – Meta, marzo 2026`,
  },
  {
    slug: 'sponsorizzate-instagram-attivita-locali',
    title: 'Sponsorizzate su Instagram e Facebook: come farle funzionare per un\'attività locale',
    excerpt: 'Obiettivo, zona e contenuto: come impostare le sponsorizzate Instagram per un\'attività locale, la differenza tra Metti in evidenza e Gestione inserzioni e cosa misurare.',
    category: 'Advertising',
    tags: ['sponsorizzate', 'instagram', 'meta ads', 'attività locali', 'facebook'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    cover: '/blog/sponsorizzate-instagram-attivita-locali/cover.jpg',
    coverAlt: 'Mappa con un raggio intorno a un\'attività locale e i risultati messaggi, chiamate e prenotazioni',
    published: true,
    seoTitle: 'Sponsorizzate Instagram per attività locali: guida | InLab',
    seoDescription: 'Sponsorizzate Instagram per attività locali: come scegliere obiettivo e zona, quali contenuti funzionano, cosa misurare e gli errori da evitare.',
    content: `Le **sponsorizzate su Instagram per attività locali** possono portare nuovi clienti dal tuo paese e dai comuni vicini, oppure bruciare budget senza lasciare niente. La differenza raramente sta nel "trucco" giusto: sta nell'obiettivo scelto, nella zona impostata e nel contenuto che mostri. In questa guida vediamo come impostarle passo passo e cosa guardare per capire se funzionano.

**Risposta breve: per un'attività locale una sponsorizzata funziona quando ha un solo obiettivo concreto (messaggi, chiamate, prenotazioni o visite al sito), una zona geografica realistica intorno all'attività e un contenuto girato nel tuo locale. Si misura in contatti ricevuti, non in like.**

Instagram e Facebook fanno parte dello stesso sistema pubblicitario di Meta. Quello che leggi qui vale quindi per entrambi: una campagna ben fatta può mostrare lo stesso annuncio su tutti e due.

## Sponsorizzate su Instagram: "Metti in evidenza" o Gestione inserzioni

Ci sono due strade per sponsorizzare un contenuto.

**Il pulsante "Metti in evidenza"** si trova direttamente sotto i post e i reel nell'app. È rapido: scegli il pubblico, la durata e il budget, e il contenuto parte. Va bene per dare una spinta a un post che sta già andando bene, per esempio l'annuncio di una serata.

**Gestione inserzioni (Ads Manager)** è lo strumento completo di Meta. Permette di scegliere obiettivi più precisi, creare più versioni dello stesso annuncio, collegare il sito e misurare i risultati in modo affidabile. È la strada giusta quando vuoi ottenere contatti o prenotazioni in modo continuativo.

Il nostro consiglio: usa "Metti in evidenza" per gli annunci occasionali e Gestione inserzioni per tutto quello che deve portare richieste nel tempo.

## Obiettivo e zona: le due scelte che contano

### Scegli un solo obiettivo, quello giusto per te

L'errore più comune è chiedere tutto a una sola campagna: follower, like, visite e prenotazioni insieme. Meta ottimizza la distribuzione verso l'obiettivo che scegli, quindi sceglilo bene.

- **Messaggi**: per chi vende su appuntamento o riceve richieste in chat, come centri estetici, parrucchieri, studi. Le persone ti scrivono su WhatsApp, Messenger o Instagram Direct.
- **Chiamate**: per chi riceve prenotazioni al telefono, come ristoranti e servizi urgenti.
- **Traffico o contatti sul sito**: per chi ha un sito con un modulo o un sistema di prenotazione. Serve che il sito misuri correttamente le richieste.
- **Notorietà nella zona**: per far conoscere un'apertura, un evento o un cambio di gestione a più persone possibile nel raggio dell'attività.

Se usi i messaggi, preparati a rispondere in fretta. Ti può aiutare anche l'[assistente AI di WhatsApp Business](/blog/whatsapp-business-ai), purché sia impostato bene.

### Il pubblico locale: dove, non solo chi

Per un'attività locale la cosa più importante è **la zona**. Puoi impostare un raggio intorno all'indirizzo oppure scegliere comuni specifici.

Qualche indicazione pratica:

- **Pensa a da dove arrivano davvero i tuoi clienti.** Una pizzeria di Mottola lavora con il paese e i comuni vicini, una sala ricevimenti può attirare persone da tutta la provincia.
- **Considera la stagionalità.** D'estate un locale di Castellaneta Marina o Ginosa Marina parla anche a turisti e a chi ha una casa al mare.
- **Non restringere troppo.** Un pubblico piccolissimo, con molti interessi combinati, rende la campagna più lenta a imparare.

Negli ultimi anni i sistemi di Meta sono diventati molto bravi a trovare le persone giuste da soli, dentro la zona che scegli. Per questo conta sempre di più il contenuto: ne abbiamo parlato nell'articolo su [Meta Ads 2026 e la creatività](/blog/meta-ads-creativita-advantage).

![I cinque passi per impostare una sponsorizzata Instagram per un'attività locale](/blog/sponsorizzate-instagram-attivita-locali/impostare-campagna.webp)

## Il contenuto che funziona per un'attività locale

L'annuncio deve fermare chi scorre e far capire subito chi sei, dove sei e cosa offri. Funzionano soprattutto:

- **video verticali girati nella tua attività**, con le persone che ci lavorano;
- **il prodotto o il servizio in azione**: il piatto che esce dal forno, il trattamento, il lavoro finito;
- **un'offerta chiara e limitata nel tempo**, se c'è: una serata, un evento, una novità;
- **il luogo riconoscibile**: la piazza, la via, il panorama, così chi è della zona si identifica.

Prepara almeno due o tre versioni dello stesso annuncio con attacchi diversi. Meta mostrerà di più quella che funziona meglio. Se hai bisogno di contenuti girati bene, un servizio di [video e reel](/video) ti evita di sponsorizzare materiale improvvisato.

## Quanto investire: il ragionamento, prima della cifra

Non esiste un budget giusto per tutti. Dipende dalla zona, dal settore, dall'obiettivo e da quanto vale per te un cliente nuovo.

Il ragionamento che consigliamo è questo:

1. **Parti con un test** di qualche settimana su un solo obiettivo e una sola zona.
2. **Dai tempo alla campagna** prima di cambiarla: i primi giorni servono a Meta per imparare.
3. **Guarda quanto ti costa un contatto utile**, cioè un messaggio vero, una chiamata, una prenotazione.
4. **Confrontalo con quanto vale un cliente** per la tua attività nel tempo, non solo al primo acquisto.
5. **Aumenta gradualmente** solo quello che funziona.

Il budget pubblicitario si paga direttamente a Meta ed è sempre distinto dal lavoro di chi imposta e segue le campagne.

## Come capire se una sponsorizzata funziona

Like e visualizzazioni non pagano l'affitto. Guarda i numeri legati all'obiettivo:

- **costo per messaggio o per contatto**, se l'obiettivo è ricevere richieste;
- **chiamate e prenotazioni** arrivate nel periodo della campagna;
- **qualità dei contatti**: le persone che scrivono sono della zona? Sono interessate davvero?
- **frequenza**: se le stesse persone vedono l'annuncio troppe volte, è ora di cambiare contenuto.

Tieni un semplice foglio con le richieste ricevute e da dove arrivano. È il modo più affidabile per capire cosa rende davvero.

![Le metriche da guardare nelle sponsorizzate Instagram per attività locali: contatti, chiamate e prenotazioni](/blog/sponsorizzate-instagram-attivita-locali/metriche-sponsorizzate-instagram.webp)

### Gli errori più comuni

- **Sponsorizzare per avere follower** invece di clienti.
- **Nessuna zona impostata**, o una zona troppo ampia per un'attività che lavora con il paese.
- **Un solo annuncio** per settimane, finché le persone non lo guardano più.
- **Non rispondere ai messaggi** generati dalla campagna.
- **Cambiare tutto ogni due giorni**, senza dare alla campagna il tempo di imparare.
- **Dimenticare la verifica dell'account.** Meta sta chiedendo la verifica a sempre più inserzionisti: tieni pronti i dati dell'attività per evitare blocchi.

Un caso a parte riguarda **associazioni, liste civiche ed enti**: dal 6 ottobre 2025 Meta non pubblica più nell'Unione Europea annunci politici, elettorali e su temi sociali. I contenuti organici restano consentiti.

## Cosa vediamo nei progetti per attività locali

Nelle campagne che seguiamo, la sponsorizzata funziona meglio quando è **l'ultimo pezzo di un percorso**, non il primo. Nel caso [Paresteta](/casi-studio/paresteta) la comunicazione per l'inaugurazione era divisa in fasi: teaser sui social, QR code per raccogliere contatti, video di lancio e attività in città. Ogni fase preparava la successiva.

Per lo [Studio Dentistico Ricciardi](/casi-studio/ricciardi) a Palagiano le campagne di lead generation sono state costruite insieme al nuovo sito, con pagine dedicate ai trattamenti: chi cliccava trovava subito risposte e un modo semplice per chiedere un appuntamento.

## Domande frequenti

### Come fare una sponsorizzata su Instagram per un'attività locale?

Scegli un obiettivo concreto (messaggi, chiamate o richieste dal sito), imposta la zona intorno all'attività, prepara due o tre video girati nel tuo locale e lascia lavorare la campagna per qualche settimana. Poi misura quanti contatti utili ha portato.

### Meglio "Metti in evidenza" o Gestione inserzioni?

"Metti in evidenza" va bene per spingere un singolo post, per esempio un evento. Per ottenere contatti in modo continuativo è meglio Gestione inserzioni, che permette obiettivi più precisi, più versioni dell'annuncio e una misurazione affidabile.

### Le sponsorizzate su Instagram escono anche su Facebook?

Sì, se lo scegli. Instagram e Facebook usano lo stesso sistema pubblicitario di Meta, e una campagna può essere mostrata su entrambe le piattaforme, anche nelle storie e nei reel.

### Quanto deve durare una campagna sponsorizzata?

Per un'attività locale conviene ragionare per settimane, non per giorni. Meta ha bisogno di qualche giorno per capire a chi mostrare l'annuncio, e servono dati sufficienti per valutare i risultati. Per un evento, invece, la campagna segue le date dell'evento.

### Perché la mia sponsorizzata ha tanti like ma nessun cliente?

Probabilmente l'obiettivo scelto era l'interazione, non i contatti. Meta ottimizza per quello che chiedi: se vuoi messaggi o chiamate, scegli quell'obiettivo e misura quelli.

## Da dove partire

Scegli un obiettivo, una zona e un contenuto girato bene. Poi dai alla campagna il tempo di lavorare e misura i contatti veri. Per capire come è cambiato il ruolo della creatività con l'AI, leggi anche [Meta Ads 2026: la creatività è il nuovo targeting](/blog/meta-ads-creativita-advantage).

Se preferisci affidarti a chi lo fa ogni giorno, scopri il servizio di [campagne Meta Ads](/meta-ads) o la pagina dedicata alle [campagne Meta Ads a Taranto](/meta-ads-taranto). Oppure [raccontaci la tua attività](/contatti): in 24 ore ti diciamo da dove partiremmo.`,
  },
  {
    slug: 'idee-reel-ristoranti',
    title: '15 idee di reel per ristoranti e bar (con esempi da girare subito)',
    excerpt: 'Dalla cucina allo staff, dal locale pieno agli eventi: 15 idee di reel per ristoranti, bar e pizzerie, con le regole per girarle e come organizzare le riprese in mezza giornata.',
    category: 'Video & Reel',
    tags: ['reel', 'ristoranti', 'instagram', 'video', 'contenuti'],
    author: 'Ilaria Gemma',
    date: '2026-09-28',
    cover: '/blog/idee-reel-ristoranti/cover.jpg',
    coverAlt: 'Smartphone che mostra il reel di una pizza del giorno appena sfornata',
    published: true,
    seoTitle: 'Idee reel per ristoranti e bar: 15 esempi da girare | InLab',
    seoDescription: 'Idee reel per ristoranti e bar: 15 esempi da girare subito, come aprire il video nei primi 3 secondi e come organizzare le riprese in mezza giornata.',
    content: `Cerchi **idee di reel per ristoranti** e bar che non siano il solito piatto ripreso dall'alto? Qui ne trovi 15, divise per tema, con come girarle e cosa mettere nei primi secondi. Sono pensate per chi ha poco tempo e uno smartphone, e funzionano anche per pizzerie, pasticcerie, pub e caffetterie.

**Risposta breve: i reel che portano clienti a un ristorante mostrano cose vere e riconoscibili: il piatto mentre nasce, le persone che ci lavorano, il locale pieno, le informazioni utili (menu, serate, orari). Si girano in verticale, con luce naturale, e fanno capire nei primi 3 secondi dove siamo e cosa si mangia.**

Un buon reel non deve per forza diventare virale. Deve far venire voglia a chi abita vicino di venirti a trovare, e ricordare a chi c'è già stato perché tornare.

## Prima di girare: 3 regole che valgono per tutti i reel

1. **Si deve capire dove siamo entro 3 secondi.** Un'insegna, un testo a schermo con il nome del locale e del paese, un dettaglio riconoscibile. Chi non ti conosce deve collocarti subito.
2. **Verticale, luce naturale, audio pulito.** Gira vicino a una finestra o all'aperto, tieni il telefono stabile e, se qualcuno parla, avvicinati. Aggiungi sempre i sottotitoli: molti guardano senza audio.
3. **Un'idea per video.** Un piatto, una persona, una notizia. Se vuoi dire tre cose, fai tre reel.

![Tre regole per girare reel per ristoranti: luogo in 3 secondi, verticale, un'idea](/blog/idee-reel-ristoranti/tre-regole.webp)

## 15 idee di reel per ristoranti e bar

### Dalla cucina: il piatto mentre nasce

**1. Il piatto simbolo in 15 secondi.** Dall'ingrediente crudo al piatto in tavola, con tagli veloci. Apri con il piatto finito, poi torna indietro: il risultato prima del processo ferma chi scorre.

**2. L'ingrediente del territorio.** Il fornitore, l'olio del frantoio vicino, la mozzarella appena arrivata. Racconta da dove viene e perché l'hai scelto. È un contenuto che parla di qualità senza doverlo dire.

**3. Il suono della cucina.** Il crepitio della frittura, la pizza che entra in forno, il caffè che sale. Pochi secondi con l'audio originale e un testo a schermo. Funziona molto bene nelle storie.

**4. "Come lo facciamo noi".** Un passaggio che i clienti non vedono mai: la lievitazione, la pasta tirata a mano, la crema preparata al mattino. Mostra il tempo e la cura dietro al piatto.

**5. Il piatto della settimana.** Un format fisso, sempre nello stesso giorno: "Ogni martedì vi mostriamo il piatto della settimana". Le persone imparano ad aspettarlo.

### Le persone: chi c'è dietro

**6. Presentiamo lo staff.** Una persona per reel: nome, cosa fa, il suo piatto preferito del menu. Le persone tornano dove si sentono conosciute.

**7. Il titolare risponde.** Una domanda vera dei clienti ("fate piatti senza glutine?", "si può prenotare per gruppi?") e la risposta del titolare in 20 secondi, guardando in camera.

**8. Prima dell'apertura.** Tavoli apparecchiati, luci che si accendono, il team che si prepara. Un momento che i clienti non vedono e che racconta l'atmosfera.

### I clienti e il locale vivo

**9. Il locale pieno.** Il sabato sera, il pranzo della domenica, l'aperitivo in piazza. Pochi secondi di atmosfera vera valgono più di cento foto del locale vuoto. Evita di inquadrare da vicino i clienti senza il loro permesso.

**10. La reazione al primo assaggio.** Con clienti che accettano di essere ripresi: il primo morso, la faccia, una frase spontanea. È un contenuto sincero e difficile da imitare.

**11. L'evento in 30 secondi.** La serata con musica, la degustazione, la festa a tema. Gira durante l'evento e pubblica il giorno dopo, con l'invito al prossimo appuntamento.

### Informazioni utili che fanno prenotare

**12. Il menu in 10 secondi.** Scorri le novità del menu con un testo a schermo per ogni piatto. Alla fine: come prenotare.

**13. "Dove siamo" in modo semplice.** Il percorso dalla piazza o dal parcheggio fino all'ingresso. Utilissimo d'estate, quando arrivano turisti che non conoscono la zona, per esempio a Castellaneta Marina o Ginosa Marina.

**14. Il dietro le quinte della consegna o dell'asporto.** Come prepari una pizza da asporto o un vassoio di dolci per una festa. Rassicura chi ordina e mostra la cura anche fuori dal locale.

### Stagioni e occasioni

**15. Il calendario del territorio.** La sagra del paese, le feste patronali, Natale, l'estate al mare. Collega il tuo menu a quello che succede intorno: le persone cercano proprio questi momenti.

![Le 15 idee di reel per ristoranti e bar divise per tema](/blog/idee-reel-ristoranti/quindici-idee.webp)

## Come organizzare le riprese in mezza giornata

Non serve girare tutti i giorni. Con un po' di organizzazione, una mattina di riprese può coprire due o tre settimane di contenuti.

1. **Scegli 5-6 idee** da questa lista e scrivi per ognuna la prima frase o il primo testo a schermo.
2. **Gira nel momento giusto**: la cucina che si prepara al mattino, il locale pieno la sera.
3. **Riprendi più del necessario**: dettagli, mani, vapore, facce. Serviranno per più video.
4. **Monta subito i primi due reel** e programma gli altri nei giorni successivi.

Se vuoi immagini curate anche per il menu, il sito e le campagne, uno [shooting fotografico](/shooting) nella stessa giornata ti fa risparmiare tempo. Come prepararlo e cosa fotografare lo spieghiamo nella guida al [servizio fotografico per ristoranti](/blog/servizio-fotografico-ristoranti).

## Quanti reel pubblicare e quando

Per un ristorante o un bar un buon ritmo di partenza è **2-3 reel a settimana**, con storie quasi ogni giorno. Pubblica prima dei momenti in cui le persone decidono dove andare: a metà settimana per il weekend, a fine mattinata per il pranzo.

Per le frequenze consigliate e gli orari trovi i dati nella guida su [quante volte pubblicare sui social](/blog/quante-volte-pubblicare-social). Per capire quando usare un reel e quando un carosello, leggi [reel o post: cosa pubblicare su Instagram](/blog/reel-o-post-cosa-pubblicare-instagram).

## Cosa abbiamo imparato girando per locali della provincia di Taranto

Con i locali che seguiamo abbiamo visto che il contenuto più efficace è quello che segue la vita reale dell'attività. Per [Sottoscala](/cliente/sottoscala), bar di Mottola con una proposta ampia tra sushi, cocktail, focacce e poke, abbiamo costruito un'identità food riconoscibile con foto curate e reel che valorizzano piatti e atmosfera. Per [Sublime Tentazione](/cliente/sublime-tentazione), gelateria e pasticceria di Palagianello, i contenuti seguono le stagioni del laboratorio, dal gelato d'estate ai panettoni a Natale.

Per [Masseria Sacramento](/cliente/masseria-sacramento) a Palagianello la comunicazione accompagna ogni appuntamento del calendario, dalla festa della birra alle serate con musica live e al pranzo della domenica. Il reel non è mai isolato: annuncia, racconta e invita al prossimo evento.

## Domande frequenti

### Che reel fare per un ristorante?

I più efficaci mostrano il piatto mentre nasce, le persone dello staff, il locale pieno e le informazioni utili come menu, serate e come prenotare. Scegli pochi format fissi e ripetili nel tempo, così il pubblico li riconosce.

### Quanto deve durare un reel per un ristorante?

Di solito tra 7 e 30 secondi, con un'idea sola. La preparazione di un piatto o una ricetta possono durare di più, purché il ritmo resti veloce e ogni passaggio aggiunga qualcosa.

### Posso riprendere i clienti nei reel del mio locale?

Solo con il loro consenso, soprattutto se sono riconoscibili. Per l'atmosfera del locale pieno puoi usare inquadrature generali, dettagli e mani, senza primi piani di chi non ha dato il permesso.

### Meglio girare con lo smartphone o con una videocamera?

Per la maggior parte dei reel basta uno smartphone recente, con buona luce e il telefono stabile. Per lanci, eventi importanti o contenuti da sponsorizzare, una produzione professionale dà un risultato più curato.

### Servono i reel anche su TikTok?

Sì, se la tua clientela è anche lì. Molti usano TikTok per cercare dove mangiare, quindi conviene curare testo a schermo, parole chiave e località. Ti spieghiamo come nella guida alla [SEO su TikTok](/blog/seo-tiktok-search-ads).

## Da dove partire

Scegli tre idee da questa lista, gira questa settimana e pubblica la prossima. Poi guarda quali reel portano messaggi, prenotazioni e commenti, e fai di più di quelli.

Se vuoi reel che raccontano davvero il tuo locale, scopri il nostro servizio di [video e reel per attività](/video). Oppure [raccontaci il tuo locale](/contatti): in 24 ore ti diciamo da dove partiremmo.`,
  },
  {
    slug: 'servizio-fotografico-ristoranti',
    title: 'Servizio fotografico per ristoranti: come prepararlo e cosa fotografare',
    excerpt: 'Come preparare il locale, quali piatti e scatti fare, come usare le foto su menu, Instagram e scheda Google e da cosa dipende il costo di uno shooting per ristoranti.',
    category: 'Social media',
    tags: ['shooting', 'ristoranti', 'foto', 'instagram', 'google business profile'],
    author: 'Ilaria Gemma',
    date: '2026-09-29',
    cover: '/blog/servizio-fotografico-ristoranti/cover.jpg',
    coverAlt: 'Macchina fotografica che inquadra un piatto con le foto della sala e dello staff',
    published: true,
    seoTitle: 'Servizio fotografico per ristoranti: guida pratica | InLab',
    seoDescription: 'Servizio fotografico per ristoranti: come preparare il locale, cosa fotografare, come usare le foto su menu, Instagram e scheda Google e come scegliere.',
    content: `Un **servizio fotografico per ristoranti** è una delle cose che si notano di più online: le foto dei piatti e della sala sono spesso il primo motivo per cui qualcuno sceglie di prenotare. In questa guida trovi come preparare il locale, cosa fotografare, come usare le stesse foto per menu, Instagram e scheda Google, e da cosa dipende il costo di uno shooting.

**Risposta breve: per un servizio fotografico riuscito servono tre cose. Un obiettivo chiaro (menu, social, sito o scheda Google), una lista precisa di piatti e scatti preparata prima, e un locale pulito, con buona luce naturale e lo staff pronto. Le foto migliori mostrano i tuoi piatti veri, il tuo locale e le persone che ci lavorano.**

Una buona foto non deve essere "perfetta" in astratto. Deve far venire fame e far capire com'è stare da te. È questo che trasforma chi scorre in un cliente che prenota.

## Perché un servizio fotografico per ristoranti fa la differenza

Chi cerca dove mangiare guarda prima le immagini e poi, forse, legge. Succede su Google Maps, su Instagram, sulle app di consegna e sul tuo sito. Foto scure, sfocate o tutte diverse tra loro comunicano poca cura, anche quando la cucina è ottima.

Le foto professionali servono a tre scopi:

- **far scegliere il piatto**: nel menu e sulle piattaforme di consegna, una foto chiara aiuta a decidere;
- **raccontare l'esperienza**: la sala, la luce, la terrazza d'estate, il bancone al mattino;
- **dare coerenza al marchio**: le stesse luci e gli stessi colori su sito, social e scheda Google rendono il locale riconoscibile.

C'è anche un tema di fiducia. Le persone vogliono vedere quello che troveranno davvero nel piatto. Per questo le foto dei tuoi piatti reali valgono più di qualsiasi immagine di repertorio o generata con l'intelligenza artificiale.

## Prima dello shooting: come preparare il ristorante

### Decidi a cosa serviranno le foto

Prima di tutto chiarisci dove verranno usate: menu stampato, menu digitale, Instagram, sito, scheda Google, piattaforme di consegna, campagne sponsorizzate. Ogni uso ha formati e inquadrature diversi, e il fotografo deve saperlo prima.

### Scegli giorno e orario giusti

Meglio un giorno di chiusura o una fascia tranquilla, per lavorare con calma. Se vuoi foto con la luce del giorno, organizza lo shooting nelle ore in cui la sala è più luminosa. Se il locale vive soprattutto la sera, prevedi anche qualche scatto con le luci accese e l'atmosfera serale.

### Prepara la lista dei piatti

Scrivi l'elenco dei piatti da fotografare, partendo da quelli che vendi di più e da quelli che ti rappresentano. Per i piatti che si rovinano in fretta (fritti, gelati, semifreddi, piatti con salse) conviene prepararne due porzioni: una per sistemare la luce, una per lo scatto.

### Pulizia e dettagli

Tovaglie stirate, bicchieri senza aloni, piatti puliti sui bordi. Togli dalla vista quello che distrae: cartelli, fili, scatoloni, avvisi attaccati ai vetri. Sono dettagli che dal vivo non noti, ma in foto si vedono subito.

### Avvisa lo staff

Se vuoi foto con le persone, e dovresti, avvisa lo staff qualche giorno prima: divise in ordine, disponibilità a farsi riprendere. Chi non vuole comparire va rispettato. Se nelle foto compaiono clienti riconoscibili, serve il loro consenso.

![Checklist per preparare un servizio fotografico per ristoranti: obiettivo, orario, lista piatti, pulizia e staff](/blog/servizio-fotografico-ristoranti/preparare-servizio-fotografico-ristorante.webp)

## Cosa fotografare: la lista degli scatti

### I piatti

Sono i protagonisti. Per ogni piatto importante conviene avere almeno due inquadrature: una dall'alto, utile per il menu e per i piatti "piatti" come pizze e taglieri, e una a circa 45 gradi, più vicina a come lo vede chi è seduto al tavolo. Aggiungi qualche dettaglio ravvicinato: la crosta, il ripieno, il filo d'olio.

### L'ambiente

La sala vuota e apparecchiata, la sala viva durante il servizio, l'esterno con l'insegna, la terrazza o il dehors. Queste foto rispondono a una domanda precisa: "com'è il posto?". Sono fondamentali per la scheda Google e per chi deve organizzare una cena o un evento.

### Le persone

Lo chef che impiatta, il pizzaiolo davanti al forno, il personale di sala che serve, il titolare. Le persone rendono il locale familiare prima ancora di entrarci.

### Ingredienti e territorio

I prodotti del territorio, il fornitore di fiducia, la farina, l'olio, il pescato del giorno. Sono foto che raccontano la qualità senza bisogno di scriverla.

## Foto per il menu, per Instagram e per la scheda Google

Le stesse foto possono lavorare su più canali, ma non tutte vanno bene ovunque.

- **Menu e piattaforme di consegna.** Serve coerenza: stessa luce, stesso sfondo, stessa inquadratura per tutti i piatti. Altrimenti il menu sembra composto da foto di locali diversi.
- **Instagram.** Meglio formati verticali: 4:5 per il feed, 9:16 per storie e reel. Qui funzionano anche foto più "vive": mani, movimento, atmosfera.
- **Scheda Google (Google Business Profile).** Carica foto reali e aggiornate di piatti, sala, esterno e insegna. Chi ti cerca su Maps vuole capire subito com'è il locale e dove si trova l'ingresso.
- **Sito web.** Foto orizzontali ampie per la home e per la pagina del menu, con spazio per i testi.

Il consiglio pratico è organizzare **foto e video nella stessa giornata**. Mentre si fotografano i piatti si possono girare anche le clip per i reel: trovi 15 spunti nella guida alle [idee di reel per ristoranti e bar](/blog/idee-reel-ristoranti).

![Come usare le foto del ristorante su menu, Instagram, scheda Google e sito](/blog/servizio-fotografico-ristoranti/foto-ristorante-menu-instagram-google.webp)

## Da cosa dipende il costo di un servizio fotografico

Ogni shooting è diverso, e il preventivo cambia in base a poche voci. Quando confronti due proposte, controlla:

- **quanti piatti e quanti scatti finali** sono inclusi;
- **la durata** della sessione e se è previsto più di un orario (giorno e sera);
- **il fotoritocco**: correzione di luce e colore su tutte le foto o solo su alcune;
- **i formati consegnati**: versioni per stampa, sito e social;
- **i diritti d'uso**: dove e per quanto tempo puoi usare le foto, anche nelle campagne sponsorizzate;
- **i video**, se sono compresi o sono un servizio a parte;
- **food styling**: se c'è qualcuno che cura la presentazione dei piatti o se se ne occupa la cucina.

Più il preventivo è dettagliato su queste voci, più è facile capire cosa stai comprando.

## Cosa abbiamo imparato fotografando locali della provincia di Taranto

Con [Sottoscala](/cliente/sottoscala), bar di Mottola con una proposta ampia tra sushi, cocktail, focacce, insalate e poke, abbiamo lavorato su shooting e contenuti video per costruire un'immagine food riconoscibile, che valorizza piatti e atmosfera. Con una proposta così varia, la coerenza di luce e stile è quello che tiene tutto insieme.

Per [Villa Natia](/cliente/villa-natia), sala ricevimenti e luxury hotel a Mottola, seguiamo matrimoni ed eventi con servizi fotografici e contenuti video. Lo storytelling visivo mette al centro l'eleganza della location e le emozioni delle giornate più importanti: chi sta scegliendo dove festeggiare vuole vedere com'è la sala nel momento in cui conta. In entrambi i casi il punto di partenza è stato lo stesso: fotografare quello che il cliente trova davvero, nel modo più bello possibile.

Un'ultima lezione riguarda la stagionalità. In provincia di Taranto il menu cambia con le stagioni, e d'estate molti locali tra Castellaneta Marina e Ginosa Marina hanno una clientela diversa. Conviene programmare **due sessioni all'anno**, una per il menu estivo e una per quello invernale, invece di usare le stesse foto per anni.

## Domande frequenti

### Come prepararsi a un servizio fotografico per il ristorante?

Decidi a cosa serviranno le foto, scegli un giorno tranquillo con buona luce, prepara la lista dei piatti e pulisci il locale nei dettagli. Avvisa lo staff se vuoi foto con le persone e prepara due porzioni dei piatti che si rovinano in fretta.

### Quanti piatti fotografare in un servizio per ristoranti?

Parti dai piatti più venduti e da quelli che rappresentano la tua cucina, più qualche foto della sala, dell'esterno e dello staff. Meglio poche foto ben fatte e coerenti tra loro che tante foto diverse per stile e luce.

### Meglio foto con luce naturale o artificiale?

La luce naturale indiretta, vicino a una finestra, dà un risultato morbido e realistico. Un fotografo professionista può ricrearla anche con luci artificiali, utile quando si lavora di sera o in ambienti poco luminosi. Il flash diretto del telefono, invece, va evitato.

### Ogni quanto rifare le foto del ristorante?

Almeno quando cambia il menu, e in generale una o due volte l'anno. Le foto della scheda Google e del sito devono corrispondere a quello che il cliente trova oggi: foto di piatti che non servi più creano aspettative sbagliate.

### Posso usare le foto dello shooting anche per le sponsorizzate?

Sì, se i diritti d'uso concordati con il fotografo lo prevedono. Chiedilo sempre prima: nelle campagne le foto del tuo locale funzionano di solito meglio delle immagini di repertorio.

## Da dove partire

Scrivi oggi la lista dei cinque piatti che ti rappresentano di più e dei tre angoli del locale che vorresti mostrare. È già metà del lavoro di preparazione.

Se vuoi un servizio fotografico pensato per menu, social e scheda Google, scopri i nostri [shooting fotografici per attività](/shooting). Oppure [raccontaci il tuo locale](/contatti): in 24 ore ti diciamo da dove partiremmo.`,
  },
  {
    slug: 'rebranding-attivita-commerciale',
    title: 'Rebranding di un\'attività commerciale: quando serve e come farlo senza perdere clienti',
    excerpt: 'Quando conviene cambiare nome, logo o insegna, cosa aggiornare dall\'insegna alla scheda Google e come comunicare il rebranding ai clienti, con il caso Paresteta.',
    category: 'Strategia',
    tags: ['branding', 'rebranding', 'attività locali', 'logo', 'google business profile'],
    author: 'Nicola Carpignano',
    date: '2026-09-29',
    cover: '/blog/rebranding-attivita-commerciale/cover.jpg',
    coverAlt: 'Passaggio dal vecchio al nuovo marchio con insegna, scheda Google e social da aggiornare',
    published: true,
    seoTitle: 'Rebranding attività commerciale: quando e come farlo | InLab',
    seoDescription: 'Rebranding di un\'attività commerciale: quando serve, cosa cambiare dall\'insegna alla scheda Google e come comunicarlo ai clienti senza perderli.',
    content: `Il **rebranding di un'attività commerciale** fa paura a molti titolari: cambiare nome, logo o insegna sembra il modo più rapido per perdere i clienti che ti conoscono da anni. Succede solo se il cambiamento non viene preparato e raccontato. In questa guida vediamo quando serve davvero, cosa cambiare, come comunicarlo e cosa abbiamo imparato accompagnando un cambio insegna.

**Risposta breve: un rebranding ha senso quando il nome o l'immagine non rappresentano più l'attività, quando cambia la proprietà o l'offerta, o quando c'è confusione con altri. Per non perdere clienti va preparato per fasi: prima si crea attesa, poi si presenta il nuovo marchio con un momento preciso, e infine si aggiornano con cura insegna, scheda Google, social e materiali.**

Un rebranding ben fatto non cancella la storia dell'attività: la porta avanti con un vestito nuovo. Chi ti conosceva deve riconoscerti, chi non ti conosceva deve trovare un motivo per entrare.

## Quando serve un rebranding di un'attività commerciale (e quando no)

Ci sono situazioni in cui rinnovare l'identità è una scelta sensata:

- **cambia la proprietà o la gestione**, e il nuovo titolare vuole un'identità che lo rappresenti;
- **cambia l'offerta**: da bar a bistrot, da negozio di un marchio a multimarca, da laboratorio a punto vendita;
- **il nome crea confusione** con un'altra attività della zona, oppure è difficile da pronunciare, scrivere o cercare;
- **l'immagine è rimasta ferma** a molti anni fa e non comunica più la qualità di quello che offri;
- **finisce un franchising** o un'insegna di gruppo e l'attività diventa indipendente.

Ci sono anche casi in cui **non serve**. Se il problema sono le vendite in calo, un nuovo logo da solo non risolve niente: prima bisogna capire se il problema è l'offerta, il prezzo, il servizio o la comunicazione. E se il tuo nome è conosciuto e apprezzato in paese, spesso basta un restyling.

## Rebranding, restyling o solo un nuovo logo: le differenze

Sono tre interventi diversi, con effetti diversi sui clienti.

- **Restyling:** si aggiorna l'aspetto (logo, colori, font) mantenendo il nome. È il più leggero e il meno rischioso.
- **Nuovo logo:** si cambia il simbolo ma non il nome né il modo di comunicare. Utile quando il logo attuale è datato o poco leggibile.
- **Rebranding:** cambia l'identità nel suo insieme. Spesso il nome, poi logo, colori, tono di voce, a volte l'offerta e il pubblico. È il più impegnativo e va raccontato.

Capire in quale dei tre casi ti trovi è il primo passo: evita di fare troppo, o troppo poco.

## Come fare un rebranding senza perdere clienti: i passaggi

### 1. Parti da cosa deve restare

Prima di decidere cosa cambiare, chiediti cosa i clienti apprezzano di te e deve restare riconoscibile: un colore, un prodotto simbolo, un modo di accogliere, il volto del titolare. Il nuovo marchio deve tenere un filo con il passato.

### 2. Scegli il nome con criteri pratici

Se cambi nome, verifica che sia facile da dire e da scrivere, che non sia già usato da un'attività simile nella tua zona, che siano liberi il dominio del sito e i nomi utente sui social. Controlla anche la disponibilità come marchio con un professionista, prima di stampare qualsiasi cosa.

### 3. Costruisci l'identità visiva

Logo, colori, caratteri, stile delle foto e dei video. Tutto deve funzionare sull'insegna, sui social, sul sito, sugli scontrini e sul packaging. Un'identità che rende bene solo in un formato creerà problemi alla prima vetrofania.

### 4. Definisci il tono di voce

Come parla il nuovo marchio? Formale o amichevole, ironico o essenziale. Il tono deve essere lo stesso in negozio, nei post, nei messaggi WhatsApp e nelle risposte alle recensioni.

## Checklist: cosa cambiare, dall'insegna alla scheda Google

Il giorno del cambio molte cose devono aggiornarsi insieme. Una dimenticanza crea confusione, soprattutto online.

- **Insegna, vetrofanie, targhe e segnaletica.**
- **Scheda Google (Google Business Profile):** nome, foto, logo, descrizione. Alcune modifiche, come il nome, possono richiedere una nuova verifica della scheda: tienilo presente nei tempi. Le recensioni restano legate alla scheda.
- **Profili social:** nome, nome utente, immagine del profilo, copertine, bio, link.
- **Sito web e dominio:** se cambi dominio, il vecchio indirizzo deve reindirizzare al nuovo, così non perdi le visite e la posizione su Google.
- **WhatsApp Business:** nome, foto, messaggio di benvenuto.
- **Materiali:** biglietti da visita, menu, listini, buste, packaging, divise.
- **Documenti e fornitori:** fatture, contratti, portali delle piattaforme di consegna o prenotazione.

Il nostro consiglio: prepara l'elenco con largo anticipo e assegna a ogni voce una persona e una data.

![Checklist del rebranding di un'attività commerciale: insegna, scheda Google, social, sito, WhatsApp e materiali](/blog/rebranding-attivita-commerciale/checklist-rebranding-insegna-social.webp)

## Come comunicare il rebranding ai clienti

### Prima: crea attesa

Nelle settimane precedenti annuncia che qualcosa sta cambiando, senza svelare tutto. Teaser sui social, un cartello in vetrina, due parole con i clienti abituali. Chi è coinvolto prima si sente parte del cambiamento, invece di subirlo.

### Il giorno del cambio: dai un momento preciso

Una data, un evento, un motivo per passare: un'inaugurazione, una degustazione, un'offerta di benvenuto. Il cambio diventa una notizia da condividere, non un dettaglio che qualcuno nota per caso.

### Dopo: accompagna la transizione

Per un periodo ricorda il vecchio nome ("prima eravamo…"), soprattutto sulla scheda Google, sui social e in negozio. Rispondi alle domande, ringrazia chi ha partecipato e mostra le novità. Poi, passato qualche mese, smetti di citare il vecchio nome.

![Le tre fasi per comunicare il rebranding: prima, il giorno del cambio, dopo](/blog/rebranding-attivita-commerciale/fasi-comunicare-rebranding.webp)

## Il caso Paresteta: un cambio insegna diventato evento

Un esempio concreto è il lavoro fatto con [Paresteta](/casi-studio/paresteta). L'obiettivo era accompagnare il passaggio da H28 a Paresteta senza disperdere il pubblico esistente, trasformandolo in attesa per qualcosa di nuovo, e portare persone in negozio il giorno dell'inaugurazione.

La strategia è stata divisa in fasi:

1. **teaser** visivi sui social e attività di comunicazione locale, per generare curiosità prima dell'apertura;
2. **QR code** dedicati per raccogliere i contatti delle persone interessate fin dal lancio;
3. **contenuti social progressivi e video di lancio**, per portare il pubblico digitale verso il momento dell'inaugurazione;
4. **l'evento**, con comunicazione integrata online e offline il giorno dell'apertura.

Il risultato è stato un cambio insegna trasformato in un evento locale, con curiosità, partecipazione e percezione del brand cresciute in modo coordinato. La lezione che portiamo in ogni progetto di [branding e identità visiva](/branding) è semplice: **il cambiamento va raccontato prima, durante e dopo**, online e offline insieme.

## Domande frequenti

### Quando conviene fare un rebranding?

Quando il nome o l'immagine non rappresentano più l'attività: nuova proprietà, nuova offerta, confusione con altre attività o un'immagine rimasta ferma a molti anni fa. Se il problema sono solo le vendite, prima conviene capirne la causa.

### Cambiare nome all'attività fa perdere clienti?

Può succedere se il cambio avviene all'improvviso e senza spiegazioni. Se lo annunci prima, dai un momento preciso al cambio e per un periodo ricordi il vecchio nome, i clienti abituali ti seguono e il cambio può diventare un'occasione per farti conoscere da nuove persone.

### Cosa succede alle recensioni di Google se cambio nome?

Se aggiorni il nome sulla stessa scheda Google, le recensioni restano. Evita invece di creare una scheda nuova per la stessa sede: perderesti lo storico e rischieresti schede doppie. Alcune modifiche possono richiedere una nuova verifica della scheda.

### Meglio un restyling o un rebranding completo?

Se il nome è conosciuto e apprezzato, spesso basta un restyling: si rinnova l'aspetto senza perdere la riconoscibilità. Il rebranding completo ha senso quando cambiano davvero la proprietà, l'offerta o il posizionamento.

### Come comunicare il rebranding ai clienti?

Per fasi: attesa nelle settimane prima, un evento o una data precisa per il cambio, e un periodo di transizione in cui ricordi il vecchio nome. Usa tutti i canali insieme: negozio, social, scheda Google, WhatsApp e passaparola.

## Da dove partire

Prendi un foglio e scrivi tre colonne: cosa deve restare, cosa deve cambiare, dove compare oggi il tuo marchio. È la base per capire se ti serve un restyling o un rebranding, e quanto lavoro c'è da fare. Se il rebranding riguarda anche il sito, leggi perché a un'attività locale servono [sito web e social insieme](/blog/sito-web-o-solo-social-attivita-locale).

Scopri il nostro servizio di [branding e identità visiva](/branding) oppure [raccontaci la tua attività](/contatti): in 24 ore ti diciamo da dove partiremmo.`,
  },
  {
    slug: 'agenzia-comunicazione-taranto-come-scegliere',
    title: 'Come scegliere un\'agenzia di comunicazione a Taranto: 7 domande da fare prima di firmare',
    excerpt: 'Le 7 domande da fare prima di scegliere un\'agenzia di comunicazione a Taranto, i segnali che devono farti dubitare e un esempio dal territorio.',
    category: 'Strategia',
    tags: ['agenzia di comunicazione', 'Taranto', 'attività locali', 'marketing locale', 'social media'],
    author: 'Nicola Carpignano',
    date: '2026-10-03',
    cover: '/blog/agenzia-comunicazione-taranto-come-scegliere/cover.jpg',
    coverAlt: 'Checklist con le domande per scegliere un\'agenzia di comunicazione a Taranto',
    published: true,
    seoTitle: 'Come scegliere un\'agenzia di comunicazione a Taranto | InLab',
    seoDescription: 'Come scegliere un\'agenzia di comunicazione a Taranto: 7 domande da fare prima di firmare, i segnali d\'allarme e cosa conta per un\'attività locale.',
    content: `Scegliere un'**agenzia di comunicazione a Taranto** non è semplice: le proposte sono tante, i siti delle agenzie si somigliano e spesso si decide guardando solo il preventivo. Poi, dopo qualche mese, ci si accorge che non era quello che serviva. In questa guida trovi le 7 domande da fare prima di firmare, i segnali che devono farti dubitare e cosa conta davvero per un'attività di Taranto e provincia.

**Risposta breve: prima di scegliere un'agenzia di comunicazione a Taranto chiedi lavori simili al tuo fatti in zona, chi seguirà davvero il progetto, cosa è incluso e cosa resta a te, se foto e video si fanno sul posto, come si misurano i risultati, di chi restano profili e account, e come si chiude l'accordo. Un'agenzia seria risponde a tutte e sette con chiarezza, prima di firmare.**

L'obiettivo non è trovare l'agenzia "migliore" in assoluto, ma quella giusta per la tua attività, il tuo pubblico e il tuo modo di lavorare.

## Cosa fa un'agenzia di comunicazione (e cosa non può fare)

Un'agenzia di comunicazione aiuta un'attività a farsi conoscere e scegliere. In pratica può occuparsi di:

- **strategia**: a chi parlare, con quale messaggio, su quali canali;
- **social media**: piano editoriale, contenuti, gestione di commenti e messaggi;
- **foto e video**: shooting, reel, video che spiegano un servizio;
- **sponsorizzate** su Instagram e Facebook;
- **sito web** e presenza su Google;
- **branding**: nome, logo, immagine coordinata.

Ci sono anche cose che un'agenzia **non può fare** da sola. Non può sistemare un servizio che non funziona, inventare un'offerta che non c'è o garantire un numero preciso di clienti. Chi promette risultati certi in tempi brevi, senza conoscere la tua attività, sta vendendo una speranza.

## Le 7 domande da fare prima di scegliere un'agenzia di comunicazione a Taranto

### 1. Avete lavorato con attività simili alla mia, qui in zona?

Chiedi di vedere lavori veri: profili social, video, siti, con il nome dell'attività. Non serve che siano del tuo stesso settore, ma devono avere problemi simili ai tuoi. Un negozio di quartiere, uno studio professionale e un'azienda che vende servizi tecnici hanno bisogno di comunicazioni diverse.

### 2. Chi segue concretamente il mio progetto?

Sapere chi scrive i testi, chi fa le riprese e chi risponde quando hai un dubbio evita molte incomprensioni. Chiedi se avrai un referente unico e come lo potrai contattare: telefono, WhatsApp, email.

### 3. Cosa fate voi e cosa resta a me?

Ogni collaborazione richiede qualcosa anche al titolare: approvare i contenuti, essere disponibile per le riprese, segnalare novità e offerte. Fatti dire con precisione cosa è incluso (quanti contenuti, quante uscite, quali canali) e quanto tempo ti verrà chiesto ogni mese.

### 4. Foto e video li fate sul posto?

Per un'attività locale le immagini vere valgono più di qualsiasi foto di repertorio. Un'agenzia che può venire nella tua sede, in negozio o in cantiere, ti racconta per quello che sei. Chiedi ogni quanto sono previste le riprese.

### 5. Come misuriamo i risultati, e ogni quanto me li mostrate?

Mettetevi d'accordo prima su cosa conta per te: richieste su WhatsApp, chiamate, prenotazioni, visite in negozio, contatti dal sito. Poi chiedi un report periodico con pochi numeri chiari e una spiegazione di cosa cambiare nel mese successivo.

### 6. Di chi sono profili, account pubblicitari, sito e materiali?

I profili social, la scheda Google, l'account pubblicitario e il dominio del sito devono essere **intestati a te**. L'agenzia lavora con un accesso da collaboratore. Chiedi anche se foto e video realizzati restano a tua disposizione se un giorno smetterete di lavorare insieme.

### 7. Quanto dura l'accordo e come si chiude?

Leggi con calma durata, rinnovo e preavviso. Un primo periodo di prova di qualche mese è utile a entrambi: l'agenzia conosce l'attività, tu vedi come lavora. Diffida dei contratti lunghi firmati al primo incontro.

![Le 7 domande da fare prima di scegliere un'agenzia di comunicazione a Taranto](/blog/agenzia-comunicazione-taranto-come-scegliere/domande-scegliere-agenzia-comunicazione-taranto.webp)

## I segnali che devono farti dubitare

Durante il primo incontro alcuni segnali dicono molto più del preventivo.

**Buoni segnali:**

- fanno molte domande sulla tua attività, sui clienti e sulla concorrenza;
- ti mostrano lavori veri, con nomi e link;
- ti propongono pochi obiettivi chiari, non tutto insieme;
- ti spiegano cosa misureranno e come.

**Campanelli d'allarme:**

- promettono "migliaia di follower" o risultati garantiti;
- ti propongono lo stesso pacchetto che propongono a tutti;
- non mostrano lavori o mostrano solo grafiche senza nomi;
- vogliono gestire profili e account intestati a loro.

![Buoni segnali e campanelli d'allarme nel primo incontro con un'agenzia di comunicazione](/blog/agenzia-comunicazione-taranto-come-scegliere/segnali-scelta-agenzia-comunicazione.webp)

## Agenzia in città o in provincia: conta la distanza?

Conta meno di quanto si pensi, a una condizione: che l'agenzia possa venire da te quando serve. Strategia, piano editoriale, testi, sponsorizzate e report si seguono bene anche a distanza, con un referente sempre raggiungibile. Riprese, shooting e incontri importanti invece vanno fatti sul posto.

Più della distanza conta la **conoscenza del territorio**. Taranto ha pubblici molto diversi tra il Borgo, la Città Vecchia, i quartieri residenziali e i comuni della provincia. Chi lavora ogni giorno in zona sa come parlano le persone, quali periodi dell'anno muovono gli acquisti e quali canali usano davvero i tuoi clienti.

## Un esempio dal territorio: spiegare un servizio tecnico con i video

Con [Emmesse](/cliente/emmesse), azienda di Taranto che si occupa di impianti fotovoltaici e termici, abbiamo lavorato soprattutto su **video parlati promozionali**. Il fotovoltaico è un tema tecnico e chi deve scegliere un impianto ha molti dubbi: sentire una persona competente che spiega le cose in modo semplice vale più di cento grafiche.

Qui c'è la lezione che vale per ogni scelta di agenzia: **la comunicazione giusta parte da cosa devono capire i tuoi clienti**, non dal formato di moda. Un'agenzia che inizia da questa domanda è sulla strada giusta.

## Domande frequenti

### Quanto costa un'agenzia di comunicazione a Taranto?

Dipende da cosa serve: quanti canali, quanti contenuti al mese, se ci sono riprese, sponsorizzate o un sito da realizzare. Più del prezzo conta capire cosa è incluso: confronta i preventivi voce per voce, usando le 7 domande di questa guida.

### Meglio un'agenzia o un freelance?

Un freelance può bastare se ti serve una sola competenza, per esempio solo i testi o solo le sponsorizzate. Un'agenzia è più adatta quando servono insieme strategia, foto, video, social e campagne, con una sola persona di riferimento che coordina tutto.

### Quanto tempo serve per vedere i primi risultati?

Con le sponsorizzate i primi contatti possono arrivare in poche settimane. La crescita dei social e la visibilità su Google richiedono invece alcuni mesi di lavoro costante. Diffida di chi promette risultati importanti in pochi giorni.

### Posso cambiare agenzia senza perdere i profili?

Sì, se profili, scheda Google, account pubblicitario e dominio sono intestati a te. Per questo è importante chiarirlo prima di iniziare: chi cambia agenzia con gli account a proprio nome riparte in pochi giorni.

### Un'agenzia di fuori Taranto può seguire la mia attività?

Sì, se viene sul posto per riprese e incontri e ha un referente sempre raggiungibile. Conta di più che conosca il territorio e il tuo tipo di clientela.

## Da dove partire

Prima del primo incontro scrivi su un foglio tre cose: cosa vendi, a chi, e cosa vorresti che succedesse tra sei mesi. Porta il foglio all'incontro insieme alle 7 domande: capirai in pochi minuti se l'agenzia che hai davanti fa per te.

Se hai un'attività a Taranto o in provincia, scopri come lavoriamo come [agenzia di comunicazione a Taranto](/agenzia-comunicazione-taranto) e cosa include la nostra [gestione social a Taranto](/gestione-social-taranto). Oppure [raccontaci la tua attività](/contatti): in 24 ore ti diciamo da dove partiremmo.`,
  },
  {
    slug: 'social-media-manager-taranto',
    title: 'Social media manager a Taranto: cosa fa e quando conviene affidarsi a un professionista',
    excerpt: 'Cosa fa in concreto un social media manager, le competenze che servono, i 6 segnali per capire quando affidarsi a un professionista a Taranto e come lavorare insieme.',
    category: 'Social media',
    tags: ['social media manager', 'Taranto', 'gestione social', 'instagram', 'attività locali'],
    author: 'Nicola Carpignano',
    date: '2026-10-03',
    cover: '/blog/social-media-manager-taranto/cover.jpg',
    coverAlt: 'Social media manager a Taranto che pianifica contenuti, riprese e report per un\'attività',
    published: true,
    seoTitle: 'Social media manager a Taranto: cosa fa e quando | InLab',
    seoDescription: 'Social media manager a Taranto: cosa fa in concreto, le competenze che servono e i 6 segnali per capire quando conviene affidarsi a un professionista.',
    content: `Cercare un **social media manager a Taranto** di solito arriva dopo mesi di post pubblicati quando c'è tempo, storie dimenticate e messaggi a cui si risponde tardi. Il dubbio è sempre lo stesso: serve davvero un professionista, o basta impegnarsi un po' di più? In questa guida vediamo cosa fa in concreto un social media manager, quali competenze servono, i segnali che dicono che è il momento di affidarsi a qualcuno e come lavorare bene insieme.

**Risposta breve: un social media manager decide cosa pubblicare e perché, organizza foto e video, scrive i testi, risponde a commenti e messaggi e guarda i numeri per migliorare ogni mese. Conviene affidarsi a un professionista quando i social ti tolgono tempo senza portare richieste, quando pubblichi a singhiozzo o quando i concorrenti in zona comunicano meglio di te.**

Avere un professionista non vuol dire sparire dai social: il titolare resta la voce più credibile dell'attività. Cambia il fatto che qualcuno costruisce un metodo intorno a quella voce.

## Cosa fa un social media manager, in concreto

Il lavoro di un social media manager non è "fare post". In una settimana tipo:

- **pianifica**: decide i temi della settimana in base agli obiettivi, alle stagioni e alle novità dell'attività;
- **organizza le riprese**: prepara cosa girare e fotografare, spesso in una sola sessione per più contenuti;
- **scrive**: testi dei post, copioni dei reel, risposte ai commenti;
- **pubblica** nei giorni e negli orari in cui il tuo pubblico è attivo;
- **ascolta**: legge commenti e messaggi, li gira a te quando serve una risposta tua;
- **misura**: controlla cosa porta richieste e cosa no, e corregge il piano.

Se vuoi il dettaglio di tutto quello che comprende un servizio completo, lo trovi nella guida su [cosa include la gestione social per attività locali](/blog/gestione-social-attivita-locale-cosa-include). Qui ci concentriamo sulla figura professionale e su quando conviene sceglierla.

## Le competenze che fanno la differenza

Un buon social media manager mette insieme abilità diverse, e raramente il fai-da-te le copre tutte:

- **strategia**: capire chi sono i tuoi clienti e cosa li convince a sceglierti;
- **scrittura**: dire le cose in modo semplice, con il tono giusto per la tua attività;
- **linguaggio video**: sapere cosa funziona nei primi secondi di un reel e come girarlo;
- **conoscenza delle piattaforme**: formati, regole e novità di Instagram, Facebook e TikTok cambiano spesso;
- **lettura dei numeri**: distinguere i dati che contano (messaggi, chiamate, prenotazioni) da quelli che fanno solo scena;
- **relazione**: gestire anche un commento negativo con calma e trasformarlo in un'occasione.

A queste si aggiunge una competenza meno visibile ma decisiva: la **costanza**. Un piano seguito per mesi batte qualsiasi contenuto geniale pubblicato una volta sola.

## Quando conviene affidarsi a un social media manager a Taranto: 6 segnali

1. **Pubblichi a singhiozzo**: due settimane piene, poi un mese di silenzio.
2. **I social ti rubano ore** che dovresti dedicare ai clienti, al negozio o allo studio.
3. **Ti scrivono, ma rispondi tardi**: un messaggio che aspetta un giorno spesso è un cliente perso.
4. **I concorrenti in zona comunicano meglio**: a Taranto in molti settori ci sono decine di attività simili, e chi si fa riconoscere online viene scelto prima.
5. **Non sai cosa funziona**: pubblichi, ma non sai quali contenuti portano richieste.
6. **Stai per fare un passo importante**: un'apertura, un nuovo servizio, una stagione decisiva come l'estate o il Natale.

Se ti riconosci in almeno due di questi punti, è il momento di valutare un aiuto professionale.

![I 6 segnali che indicano quando affidarsi a un social media manager a Taranto](/blog/social-media-manager-taranto/segnali-social-media-manager-taranto.webp)

## Cosa resta al titolare, anche con un professionista

Affidare i social non vuol dire delegare tutto. Le collaborazioni che funzionano meglio hanno sempre un titolare presente:

- **ci mette la faccia** quando serve: nei video parlati, nelle presentazioni, nei momenti importanti;
- **segnala le novità**: un prodotto nuovo, un evento, una recensione bella da condividere;
- **approva i contenuti** in tempi brevi, così il calendario non si blocca;
- **risponde alle domande tecniche** che solo lui conosce.

In cambio si libera dal lavoro più pesante: pensare ogni giorno a cosa pubblicare, montare video, scrivere testi e seguire le statistiche.

## Perché conta conoscere Taranto e la provincia

Un social media manager che lavora sul territorio sa cose che non si trovano nei manuali. Sa come cambia il pubblico d'estate sul litorale, quando i paesi si svuotano e le marine si riempiono. Sa che in provincia il passaparola corre veloce anche online. E sa che il tono giusto a volte è quello di casa.

Due esempi dal nostro lavoro in provincia di Taranto:

- con [Nunzio Putignano](/cliente/nunzio-putignano), autofficina di Palagiano, raccontiamo l'officina con reel simpatici e spontanei, spesso in dialetto, con il titolare e il suo team in prima linea. Il risultato è un'officina riconoscibile in paese e sui social;
- con [Emmesse](/cliente/emmesse), azienda di Taranto che lavora su impianti fotovoltaici e termici, usiamo video parlati per spiegare in modo chiaro un tema tecnico e far emergere la competenza dell'azienda.

Due attività diversissime, una regola comune: **i contenuti funzionano quando somigliano a chi li pubblica**.

## Come lavorare bene con il tuo social media manager

Il primo mese è quello che decide come andrà la collaborazione. Ecco come impostarlo:

1. **Incontro iniziale**: obiettivi, clienti tipo, concorrenti, cosa ha funzionato e cosa no finora.
2. **Piano del primo mese**: temi, formati, giorni di pubblicazione e chi approva.
3. **Prima sessione di riprese**: foto e video per più settimane di contenuti, in sede.
4. **Primo report**: pochi numeri chiari e cosa cambiare nel mese successivo.

Chiarite subito anche gli aspetti pratici: i profili restano intestati a te, il social media manager accede come collaboratore, e c'è un canale diretto (di solito WhatsApp) per le comunicazioni veloci.

![Il primo mese di lavoro con un social media manager: incontro, piano, riprese e report](/blog/social-media-manager-taranto/primo-mese-social-media-manager.webp)

## Domande frequenti

### Che differenza c'è tra social media manager e gestione social?

Il social media manager è la figura professionale; la gestione social è il servizio che svolge. Lo stesso lavoro può farlo un freelance, una persona interna all'azienda o un'agenzia, che di solito affianca al social media manager anche chi fa foto, video e sponsorizzate.

### Un social media manager si occupa anche delle sponsorizzate?

Spesso sì, ma non sempre: chiedilo prima. Le sponsorizzate richiedono competenze specifiche su pubblici, budget e misurazione. Quando social e campagne li segue la stessa squadra, contenuti e annunci lavorano meglio insieme.

### Basta un social media manager a distanza per un'attività di Taranto?

Per strategia, testi, pubblicazione e messaggi sì. Per foto e video invece serve qualcuno che venga sul posto: i contenuti girati nella tua attività, con le tue persone, funzionano molto meglio delle immagini di repertorio.

### Quanto tempo serve per vedere risultati?

I primi segnali, come più messaggi e più interazioni dalle persone della zona, arrivano di solito nei primi mesi. Una crescita stabile richiede costanza nel tempo. Le sponsorizzate possono accelerare, se c'è un'offerta chiara.

### Devo dare la password dei miei profili?

No. Su Instagram e Facebook si può aggiungere il social media manager come collaboratore dalla gestione dell'account aziendale, senza condividere la password. I profili restano tuoi.

## Da dove partire

Prendi le ultime dieci pubblicazioni sui tuoi profili e segna quante ti hanno portato un messaggio, una chiamata o una visita. Se la risposta è "quasi nessuna" o "non lo so", il problema non è quanto pubblichi, ma il metodo.

Scopri come lavoriamo come [social media manager a Taranto](/gestione-social-taranto) e cosa facciamo come [agenzia di comunicazione a Taranto](/agenzia-comunicazione-taranto). Oppure [raccontaci la tua attività](/contatti): in 24 ore ti diciamo da dove partiremmo.`,
  },
];
