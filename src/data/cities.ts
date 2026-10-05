// Testi propri di ogni città per le pagine /{servizio}-{città} e
// /agenzia-comunicazione-{città} (brief SEO del 01/10/2026). Fatti noti e
// verificabili sulle città: niente numeri, prezzi o promesse.
export type CityInfo = {
  name: string;
  /** "provincia di Taranto" / "provincia di Bari" */
  provincia: string;
  contesto: string;
  settori: string[];
  faq: { q: string; a: string };
  /** "Come lavoriamo a {città}" (brief SEO 01/10 sera) */
  metodo?: string;
  faq2?: { q: string; a: string };
  /** Terza domanda (brief SEO 02/10 pomeriggio) */
  faq3?: { q: string; a: string };
  /** Domande in più dopo la terza (brief SEO 03/10 Taranto) */
  altreFaq?: { q: string; a: string }[];
  /** Sezione in più nella pagina agenzia (es. "Castellaneta Marina", brief SEO 02/10) */
  sezione?: { titolo: string; testo: string };
  /** Descrizioni proprie dei servizi (slug → testo): sostituiscono quella generica
   * nella pagina agenzia e in /{servizio}-{città} (brief SEO 03/10 Palagianello) */
  servizi?: Record<string, string>;
  /** Paragrafo di apertura della pagina agenzia al posto di quello generico */
  intro?: string;
  /** Meta description propria della pagina agenzia (140-155 caratteri) */
  description?: string;
  /** Title proprio della pagina agenzia (max 60 caratteri) */
  title?: string;
  /** Sezione sul fondatore del posto: testo + slug della pagina autore (anche in JSON-LD "mentions") */
  casaNostra?: { titolo: string; testo: string; autore: string; link: string };
  /** Argomento proprio della pagina agenzia: H2 + testo subito dopo l'apertura (brief SEO 05/10 città) */
  focus?: { titolo: string; testo: string };
  /** Collegamento su una parola dell'apertura (es. il nome di Nicola → pagina autore) */
  introLink?: { testo: string; href: string };
  /** Clienti in evidenza subito dopo l'apertura della pagina agenzia, con una riga
   * in più per cliente (id della scheda cliente, id del caso studio facoltativo).
   * Brief SEO 05/10 Palagiano. */
  clientiInEvidenza?: { titolo: string; voci: { cliente: string; nome: string; riga: string; caso?: string }[] };
  /** Testi propri delle pagine /{servizio}-{città} (slug del servizio → testi). Brief SEO 05/10 Palagiano. */
  paginaServizio?: Record<string, {
    /** Title (max 60 caratteri) e meta description (140-155) al posto di quelli generici */
    title?: string;
    description?: string;
    /** Un lavoro fatto in città, mostrato subito dopo l'apertura */
    progettoInEvidenza?: {
      titolo: string;
      testo: string;
      punti?: string[];
      /** id del caso studio (link "Leggi il caso studio") */
      caso?: string;
      /** sito esterno del lavoro: link senza nofollow, è un lavoro nostro */
      sito?: { url: string; label: string };
      immagine?: { src: string; alt: string };
    };
  }>;
};

export const CITY_INFO: CityInfo[] = [
  {
    name: 'Taranto', provincia: 'provincia di Taranto',
    contesto: 'Taranto è il capoluogo della provincia e la "città dei due mari", tra Mar Grande e Mar Piccolo. Ha la Città Vecchia sull\'isola, il Borgo con le vie dello shopping e il MArTA, il Museo Archeologico Nazionale. Per un\'attività di Taranto la concorrenza è più alta che nei paesi vicini: farsi trovare su Google e avere social curati fa la differenza tra chi viene scelto e chi resta invisibile.',
    settori: ['negozi e commercio del Borgo', 'ristoranti, bar e locali sul lungomare', 'studi professionali e medici', 'eventi e attività culturali'],
    faq: { q: 'Lavorate con attività di Taranto città?', a: 'Sì. Siamo a Castellaneta, a meno di un\'ora, e veniamo a Taranto per incontri, shooting e riprese. Il resto del lavoro lo seguiamo a distanza, con un contatto diretto con Nicola e Ilaria.' },
    metodo: "A Taranto lavoriamo soprattutto su visibilità e differenza dalla concorrenza: in città ci sono molte attività dello stesso settore, quindi contano una scheda Google curata, recensioni, contenuti riconoscibili e campagne mirate per quartiere o per zona, dal Borgo al lungomare. Partiamo da un'analisi di come ti trovano oggi i clienti e di cosa fanno le attività vicine a te.",
    faq2: { q: "Si possono fare sponsorizzate solo per alcune zone di Taranto?", a: "Sì. Con Meta Ads si può scegliere un raggio intorno all'attività o alcune zone della città, così il budget va solo alle persone che possono venire da te." },
    faq3: { q: "Che tipo di attività di Taranto seguite?", a: "Soprattutto negozi, locali, studi professionali e attività che vogliono farsi trovare da chi cerca in città. Partiamo spesso da scheda Google, sito e social, poi aggiungiamo campagne mirate per zona quando servono." },
    altreFaq: [
      { q: "Quanto tempo serve per vedere risultati a Taranto?", a: "Per le sponsorizzate bastano poche settimane per i primi contatti. Per la visibilità su Google e la crescita dei social servono alcuni mesi di lavoro costante. Te lo spieghiamo con numeri chiari, mese per mese." },
      { q: "Seguite anche aziende in provincia di Taranto fuori città?", a: "Sì: lavoriamo con attività di Castellaneta, Palagianello, Palagiano, Mottola, Laterza, Ginosa e Massafra. Trovi i lavori qui sopra, divisi per città." },
    ],
    sezione: { titolo: "Perché un'agenzia di Castellaneta per Taranto", testo: "Siamo a meno di un'ora da Taranto: veniamo di persona per incontri, shooting e riprese, e seguiamo il resto a distanza con un contatto diretto. Conosciamo la provincia perché ci lavoriamo ogni giorno, da Castellaneta a Palagianello, da Mottola a Ginosa: per un'attività di Taranto vuol dire avere un'agenzia vicina, con costi e tempi da agenzia locale." },
    servizi: {
      'gestione-social': "A Taranto ogni settore ha decine di concorrenti: sui social vince chi si riconosce subito. Costruiamo una linea editoriale chiara, con contenuti che mostrano le persone e il lavoro vero, non post generici.",
      'meta-ads': "Sponsorizzate mirate per quartiere o per raggio intorno all'attività, dal Borgo a Talsano: il budget va solo a chi può venire da te, con report chiari su contatti e richieste.",
      'siti-web': "Un sito veloce e collegato alla scheda Google per farti trovare da chi cerca a Taranto: pagine dei servizi, recensioni, mappa e contatti a portata di tocco.",
      'automazioni-ai': "Risposte automatiche su WhatsApp e Instagram per prenotazioni, preventivi e domande frequenti: utili a studi, locali e negozi di Taranto che ricevono tanti messaggi.",
      'shooting': "Shooting in negozio, in studio o in esterna tra il lungomare e la Città Vecchia: foto vere che fanno riconoscere la tua attività, al posto delle immagini di repertorio.",
      'video': "Video parlati che spiegano un servizio in modo semplice, come quelli per Emmesse sul fotovoltaico, e reel brevi per farti scegliere tra tanti concorrenti.",
      'branding': "Nome, logo e immagine coordinata per distinguersi in una città con tanta offerta: un'identità chiara su insegna, social, sito e materiali.",
    },
    title: 'Agenzia di comunicazione a Taranto e provincia | InLab',
    description: "Agenzia di comunicazione e marketing per attività di Taranto e provincia: social, sponsorizzate, siti, video e branding. Preventivo gratuito.",
    intro: "Dal Borgo alla Città Vecchia, dal lungomare ai quartieri residenziali: InLab Communication segue social, video, sponsorizzate, siti e branding per attività di Taranto, con un'agenzia a meno di un'ora, a Castellaneta. Lavoriamo già con aziende di Taranto come Emmesse e con attività in tutta la provincia, da Castellaneta a Ginosa.",
  },
  {
    name: 'Castellaneta', provincia: 'provincia di Taranto',
    contesto: 'Castellaneta è la nostra sede. È la città di Rodolfo Valentino, affacciata sulla gravina, con la marina sulla costa ionica: Castellaneta Marina vive di turismo estivo, villaggi, lidi e ristorazione. Qui conosciamo di persona le attività e i ritmi dell\'anno, dalla stagione estiva al lavoro dei mesi invernali.',
    settori: ['lidi, villaggi e strutture turistiche di Castellaneta Marina', 'ristoranti e bar', 'negozi del centro', 'artigiani e aziende agricole'],
    faq: { q: 'Avete un ufficio a Castellaneta?', a: 'Sì, InLab Communication ha sede a Castellaneta (TA). Possiamo incontrarci di persona.' },
    metodo: "A Castellaneta il lavoro segue due stagioni: d'estate il pubblico arriva da fuori, con turisti e famiglie a Castellaneta Marina, mentre il resto dell'anno contano i clienti del paese e dei paesi vicini. Per questo prepariamo i contenuti in anticipo sulla stagione e teniamo viva la comunicazione anche d'inverno.",
    faq2: { q: "Lavorate anche per strutture di Castellaneta Marina?", a: "Sì: foto, video, social e sponsorizzate per lidi, ristoranti e strutture della costa, preparati prima dell'estate." },
    sezione: { titolo: 'Castellaneta Marina', testo: "Castellaneta Marina, sulla costa ionica, vive di turismo estivo, villaggi, lidi e ristorazione. Per le strutture della costa prepariamo foto, video, social e sponsorizzate prima dell'estate, quando i turisti scelgono dove andare, e le seguiamo durante tutta la stagione." },
    faq3: { q: "Possiamo vederci di persona a Castellaneta?", a: "Sì, la nostra sede è in Via Regina Margherita 26. Per molte attività del paese il primo incontro lo facciamo direttamente nel locale o in negozio, per capire spazi, clienti e cosa raccontare." },
    description: "Agenzia di comunicazione a Castellaneta, in Via Regina Margherita 26: video, social e sponsorizzate per il paese e la Marina. Preventivo gratuito.",
    intro: "Siamo a Castellaneta, in Via Regina Margherita 26: per le attività del paese siamo l'agenzia sotto casa. Seguiamo social, video, sponsorizzate, siti e branding, e ci vediamo di persona quando serve, in sede o direttamente da te.",
    focus: {
      titolo: "Il video che fa vendere: due esempi da Castellaneta",
      testo: "Un video breve spiega in pochi secondi quello che una foto non riesce a dire. Per lo Studio Ventimiglia Solution giriamo video di presentazione degli immobili in vendita: chi guarda capisce spazi, luce e posizione prima ancora di chiamare. Per l'Ottica Occhi Blu abbiamo scelto video promozionali simpatici, che rendono semplice e leggera la scelta di un paio di occhiali. Settori diversi, lo stesso obiettivo: far capire subito perché scegliere te.",
    },
    altreFaq: [
      { q: "Quanto costa fare un video per la mia attività a Castellaneta?", a: "Dipende da durata, riprese e quante versioni servono per i social. Dopo un primo incontro in sede ti facciamo un preventivo chiaro e gratuito." },
    ],
    servizi: {
      'video': "Video brevi che spiegano e fanno scegliere: presentazioni degli immobili per lo Studio Ventimiglia, video simpatici per l'Ottica Occhi Blu. Li giriamo a Castellaneta, a due passi dalla nostra sede.",
    },
  },
  {
    name: 'Mottola', provincia: 'provincia di Taranto',
    contesto: 'Mottola, la "Spia delle Puglie", guarda dall\'alto la piana fino al golfo di Taranto. È conosciuta per le chiese rupestri, come San Nicola, e per le sale ricevimenti e le masserie dove si celebrano matrimoni ed eventi. Per queste attività contano foto, video e una presenza social che faccia vedere gli spazi prima ancora della visita.',
    settori: ['sale ricevimenti e location per eventi', 'ristoranti e agriturismi', 'negozi e servizi del paese'],
    faq: { q: 'Fate foto e video per location di eventi a Mottola?', a: 'Sì, con shooting e riprese sul posto. Le schede dei nostri clienti di Mottola sono nella sezione qui sopra.' },
    metodo: "A Mottola molte attività vivono di eventi, cerimonie e passaparola. Per una location o un ristorante contano le immagini: foto degli spazi, video delle serate, recensioni e un profilo Instagram che faccia venire voglia di prenotare una visita. Lavoriamo sul posto per raccontare gli ambienti come li vede un ospite.",
    faq2: { q: "Fate anche video di matrimoni o eventi a Mottola?", a: "Facciamo video e reel per la comunicazione della location e dell'attività: contenuti che mostrano gli spazi e l'atmosfera, da usare su social, sito e campagne." },
    faq3: { q: "Lavorate anche per attività di Mottola che non fanno eventi?", a: "Sì: negozi, ristoranti e servizi del paese. Per loro lavoriamo su presenza costante sui social, foto curate e una scheda Google completa, così chi è di passaggio sulla statale li trova." },
    description: "Agenzia di comunicazione a Mottola: foto, video e social per sale ricevimenti e locali del paese, come Villa Natia e Sottoscala. Preventivo gratuito.",
    intro: "A Mottola raccontiamo locali e location con le immagini: foto e video che fanno venire voglia di prenotare. Seguiamo social, video, sponsorizzate, siti e branding per le attività del paese, da Castellaneta.",
    focus: {
      titolo: "Prima si guarda, poi si prenota",
      testo: "Per una sala ricevimenti o un locale, la prima visita avviene sullo schermo. Per Villa Natia raccontiamo matrimoni ed eventi con foto e video che ne mostrano l'eleganza; per Sottoscala abbiamo costruito un'identità visiva food, con foto curate e reel di sushi, cocktail e focacce. In entrambi i casi il lavoro è lo stesso: far vedere gli spazi e l'atmosfera come li vivrà l'ospite, così la telefonata arriva da chi ha già deciso.",
    },
    altreFaq: [
      { q: "Conviene investire nei social per una sala ricevimenti?", a: "Sì: oggi gli sposi e chi organizza un evento guardano prima i profili e le foto, poi chiedono un appuntamento. Contenuti curati e costanti portano richieste più mirate." },
    ],
    servizi: {
      'shooting': "Shooting sul posto per sale, ristoranti e locali di Mottola: gli spazi, i piatti e le persone, come per Villa Natia e Sottoscala.",
      'gestione-social': "Un profilo Instagram che fa da vetrina: foto degli spazi, reel delle serate e contenuti costanti, per far venire voglia di prenotare una visita o un tavolo.",
    },
  },
  {
    name: 'Palagianello', provincia: 'provincia di Taranto',
    contesto: 'Palagianello è un paese della gravina, con il castello Stella-Caracciolo e le chiese rupestri. È una comunità piccola, dove il passaparola conta molto: social e scheda Google servono a farsi trovare anche da chi arriva dai paesi vicini. Nicola Carpignano, co-fondatore di InLab, è di Palagianello: qui conosciamo le attività e le persone da sempre.',
    settori: ['attività del centro storico', 'ristorazione', 'artigiani e piccole imprese'],
    faq: { q: 'Ha senso fare social per un\'attività di un paese piccolo?', a: 'Sì, se il pubblico è quello giusto: le persone del paese e dei paesi vicini. Con le sponsorizzate si possono raggiungere solo loro, senza sprecare budget.' },
    metodo: "A Palagianello il pubblico è soprattutto del paese e dei comuni vicini, come Palagiano, Mottola e Castellaneta. Per questo lavoriamo su una comunicazione vicina e riconoscibile: scheda Google completa, post che mostrano le persone dietro l'attività e sponsorizzate locali con budget contenuti.",
    faq2: { q: "Serve un sito se ho già la pagina Facebook?", a: "Spesso sì: il sito e la scheda Google fanno trovare l'attività su Google, mentre i social tengono il contatto con chi ti conosce già. Insieme funzionano meglio." },
    faq3: { q: "Perché scegliere un'agenzia vicina a Palagianello?", a: "Perché conosciamo il paese e le persone: Nicola è di Palagianello. Possiamo venire in negozio per foto e video senza costi di trasferta importanti e seguirti con incontri di persona quando serve." },
    description: "Agenzia di comunicazione a Palagianello, fondata da chi è del paese: social, video, sponsorizzate, siti e foto per le attività locali. Preventivo gratuito.",
    intro: "InLab Communication è di casa a Palagianello: Nicola Carpignano, uno dei due fondatori, è di Palagianello. Seguiamo social, video, sponsorizzate, siti e foto per le attività del paese, da Sublime Tentazione a Masseria Sacramento e DIRAM.",
    casaNostra: {
      titolo: 'Palagianello è casa nostra',
      testo: "Nicola Carpignano, co-fondatore di InLab Communication, è di Palagianello. Si è laureato in Psicologia all'Università di Bari, insegna Marketing e Social Media nei master di EA Formazione e ha pubblicato ricerche sulla comunicazione digitale. Per le attività del paese vuol dire avere vicino qualcuno che conosce il territorio e il mestiere.",
      autore: 'nicola-carpignano',
      link: 'Scopri chi è Nicola',
    },
    servizi: {
      'gestione-social': "A Palagianello i social sono il passaparola che continua online: raccontiamo le persone dietro il bancone, le novità e gli eventi del paese. Come per Sublime Tentazione, con una presenza costante tra gelati d'estate e panettoni a Natale.",
      'meta-ads': "Sponsorizzate mirate a Palagianello e ai paesi vicini, come Palagiano, Mottola, Castellaneta e Massafra: budget contenuti e un pubblico che può davvero venire da te, senza sprechi.",
      'siti-web': "Un sito semplice e veloce, collegato alla scheda Google, per farti trovare da chi cerca un'attività a Palagianello e da chi arriva da fuori per la gravina e il castello.",
      'automazioni-ai': "Risposte automatiche su WhatsApp e Instagram per prenotazioni e domande frequenti: utili a masserie, ristoranti e negozi del paese che non possono stare sempre al telefono.",
      'shooting': "Shooting sul posto, in negozio, in laboratorio o in masseria: foto vere degli spazi, dei prodotti e delle serate, al posto delle immagini di repertorio.",
      'video': "Video brevi e leggeri che raccontano il negozio e chi ci lavora. Come per DIRAM, tra ricambi, riparazioni e punto Poste.",
      'branding': "Nome, logo e immagine coordinata per chi apre o rinnova un'attività a Palagianello: un'identità che si riconosce in paese e nei comuni vicini.",
    },
  },
  {
    name: 'Palagiano', provincia: 'provincia di Taranto',
    contesto: 'Palagiano è terra di agrumi, in particolare delle clementine del Golfo di Taranto, con la frazione di Chiatona sul mare. Molte attività sono legate all\'agricoltura, alla vendita di prodotti locali e al turismo estivo sulla costa.',
    settori: ['aziende agricole e produttori', 'negozi e servizi del paese', 'strutture e attività della costa'],
    faq: { q: 'Potete aiutare un\'azienda agricola a vendere online?', a: 'Sì: sito, e-commerce o vetrina sui social, e foto dei prodotti fatte sul posto.' },
    metodo: "A Palagiano partiamo sempre dalla persona che c'è dietro l'attività. Con l'Autofficina Putignano abbiamo scelto la strada più naturale: il titolare davanti alla telecamera, in dialetto, con l'ironia che lo fa riconoscere in paese. Con lo Studio Ricciardi serviva l'opposto: un tono professionale e rassicurante, un sito chiaro su ogni trattamento e contenuti che spiegano prima di vendere. Due stili diversi, lo stesso metodo: capire chi sei, scegliere il linguaggio giusto per i tuoi clienti e misurare i risultati.",
    faq2: { q: "Fate foto dei prodotti direttamente in azienda?", a: "Sì, facciamo gli shooting sul posto: in campo, in magazzino o in negozio, per avere foto vere e non immagini di repertorio." },
    faq3: { q: "Lavorate anche con strutture e attività di Chiatona?", a: "Sì: lidi, ristoranti e strutture della costa. Prepariamo contenuti e campagne prima dell'estate e li seguiamo durante la stagione, insieme alle attività del paese che lavorano tutto l'anno." },
    altreFaq: [
      { q: "Lavorate anche con studi medici e professionisti di Palagiano?", a: "Sì: per lo Studio Dentistico Ricciardi seguiamo sito, campagne e social. Con i professionisti curiamo soprattutto chiarezza e fiducia: spiegare bene i servizi, mostrare lo studio e le persone, rendere facile prenotare." },
    ],
    description: "Agenzia di comunicazione a Palagiano: reel per l'Autofficina Putignano, sito e campagne per lo Studio Dentistico Ricciardi. Preventivo gratuito.",
    intro: "A Palagiano lavoriamo con attività molto diverse tra loro: per l'Autofficina Nunzio Putignano giriamo reel ironici in dialetto con il titolare e il suo team, per lo Studio Dentistico Ricciardi abbiamo creato il sito Lumina e le campagne che portano richieste di visita. InLab Communication segue social, video, sponsorizzate, siti e branding da Castellaneta, a pochi chilometri dal paese.",
    paginaServizio: {
      'siti-web': {
        title: 'Realizzazione siti web a Palagiano | InLab',
        description: "Siti web a Palagiano: per lo Studio Dentistico Ricciardi abbiamo creato luminaricciardi.it, con una pagina per ogni trattamento. Preventivo gratuito.",
        progettoInEvidenza: {
          titolo: 'Il sito che abbiamo fatto a Palagiano: luminaricciardi.it',
          testo: "Per lo Studio Dentistico Ricciardi, in Via Imbriani a Palagiano, abbiamo progettato il nuovo sito attorno al brand Lumina. Ci sono una pagina per ogni trattamento, dalla prevenzione all'implantologia computer guidata, la presentazione dello studio e del team e i contatti sempre visibili per prenotare una visita. Il sito lavora insieme ai social e alle campagne: chi vede un contenuto arriva sulla pagina del trattamento giusto e da lì chiede un appuntamento.",
          punti: ['Sito web', 'Pagine dedicate ai trattamenti', 'Copywriting', 'Brand Lumina', 'Collegamento con campagne e social'],
          caso: 'ricciardi',
          sito: { url: 'https://luminaricciardi.it/', label: 'Visita il sito' },
        },
      },
    },
    clientiInEvidenza: {
      titolo: 'I nostri clienti a Palagiano',
      voci: [
        { cliente: 'studio-dentistico-ricciardi', nome: 'Studio Dentistico Ricciardi', riga: 'Sito luminaricciardi.it, lead generation e social', caso: 'ricciardi' },
        { cliente: 'nunzio-putignano', nome: 'Autofficina Nunzio Putignano', riga: 'Reel in dialetto e gestione social' },
      ],
    },
    servizi: {
      'gestione-social': "Per un'attività di paese i social funzionano quando mostrano le persone. Come per l'Autofficina Putignano: il titolare e il team protagonisti, con un tono che chi abita a Palagiano riconosce subito.",
      'video': "Reel spontanei, anche in dialetto, girati sul posto: è il formato con cui abbiamo raccontato l'Autofficina Putignano. Per gli studi professionali, video più calmi che spiegano un servizio in modo semplice.",
      'siti-web': "Siti con una pagina per ogni servizio e la richiesta di contatto sempre a portata di mano, come luminaricciardi.it, il sito che abbiamo fatto per lo Studio Dentistico Ricciardi.",
      'meta-ads': "Campagne mirate su Palagiano, Chiatona e i paesi vicini, per portare richieste concrete: per lo Studio Ricciardi le campagne portano le persone alle pagine dei trattamenti e alla prenotazione.",
      'shooting': "Foto vere della tua attività, del team e del lavoro, al posto delle immagini di repertorio: in officina, in studio, in negozio o in azienda.",
      'branding': "Un'identità chiara su insegna, social e sito. Per lo Studio Ricciardi abbiamo costruito il brand Lumina, più caldo e contemporaneo.",
      'automazioni-ai': "Risposte automatiche su WhatsApp e Instagram per prenotazioni e domande frequenti: utili a studi e attività di Palagiano che ricevono tanti messaggi.",
    },
  },
  {
    name: 'Laterza', provincia: 'provincia di Taranto',
    contesto: 'Laterza è conosciuta per la gravina, una delle più grandi d\'Italia, oggi oasi naturalistica, per la tradizione della maiolica e per il suo pane. È un territorio di artigiani e di prodotti tipici, che online funzionano quando si racconta bene la storia e il lavoro dietro il prodotto.',
    settori: ['forni e prodotti tipici', 'artigianato e maiolica', 'ristorazione', 'turismo legato alla gravina'],
    faq: { q: 'Come si raccontano sui social prodotti artigianali?', a: 'Con video brevi del lavoro, foto curate e una storia coerente. Lo facciamo con shooting e reel girati in bottega.' },
    metodo: "A Laterza il valore sta nel saper fare: forni, botteghe, ceramisti e produttori. Lavoriamo con video brevi del lavoro, foto curate dei prodotti e testi che spiegano la tradizione senza retorica. Così anche chi non è del posto capisce perché vale la pena comprare o fare una deviazione per venire a trovarti.",
    faq2: { q: "Si possono vendere online prodotti artigianali di Laterza?", a: "Sì: con un piccolo e-commerce o con un catalogo collegato a WhatsApp e Instagram. Ti aiutiamo a scegliere la soluzione più semplice da gestire." },
    faq3: { q: "Si può portare più gente a Laterza con i social?", a: "Sì, raccontando bene quello che c'è: la gravina, il pane, la maiolica. Video brevi e foto curate funzionano anche con chi arriva da fuori, per esempio da Matera o dalla costa." },
    description: "Agenzia di comunicazione a Laterza: social, video e foto per forni, botteghe e artigiani, per farsi conoscere anche fuori dal paese. Preventivo gratuito.",
    intro: "Laterza ha forni, botteghe e ceramisti che lavorano bene da generazioni. Li aiutiamo a farsi conoscere anche fuori dal paese con social, video, foto, siti e branding, da Castellaneta.",
    focus: {
      titolo: "Perché comunicare sui social anche se ti conoscono tutti",
      testo: "In paese ti conoscono già, ma chi arriva da fuori, chi è emigrato e chi cerca un regalo o un prodotto tipico ti trova solo se sei online. I social sono il posto dove si sceglie dove fare una deviazione, cosa comprare, dove portare un ospite. Un forno che mostra il pane appena sfornato o una bottega che racconta come nasce una maiolica non vende solo un prodotto: fa conoscere il lavoro e la storia che ci sono dietro.",
    },
    altreFaq: [
      { q: "Ho poco tempo: quanto devo pubblicare?", a: "Meno di quanto pensi: due o tre contenuti curati a settimana bastano per iniziare. Riprese e montaggio li facciamo noi, tu continui a lavorare." },
    ],
    servizi: {
      'video': "Video brevi girati in bottega o al forno: le mani, i gesti, il prodotto finito. È il formato che fa capire il valore del saper fare.",
    },
  },
  {
    name: 'Ginosa', provincia: 'provincia di Taranto',
    contesto: 'Ginosa unisce il paese sulla gravina, con il villaggio rupestre, a Ginosa Marina, sulla costa ionica, che d\'estate si riempie di turisti. Per le attività del paese e della marina la sfida è farsi trovare prima della stagione e restare in mente anche durante l\'inverno.',
    settori: ['negozi e commercio (come Paresteta, nostro cliente)', 'lidi, ristoranti e strutture di Ginosa Marina', 'aziende agricole'],
    faq: { q: 'Lavorate anche per attività stagionali di Ginosa Marina?', a: 'Sì: prepariamo contenuti e campagne prima dell\'estate e le seguiamo durante la stagione.' },
    metodo: "A Ginosa lavoriamo su due pubblici diversi: chi vive in paese tutto l'anno e chi arriva d'estate a Ginosa Marina. Per i negozi del centro contano costanza e riconoscibilità, come nel caso di Paresteta; per le attività della marina conta farsi trovare prima della stagione, con contenuti e campagne pronti già in primavera.",
    faq2: { q: "Quando conviene iniziare a promuovere un'attività di Ginosa Marina?", a: "Qualche mese prima dell'estate: i turisti scelgono dove andare in anticipo, quindi contenuti, scheda Google e sponsorizzate devono essere pronti prima dell'arrivo della stagione." },
    sezione: { titolo: 'Ginosa Marina', testo: "Ginosa Marina, sulla costa ionica, d'estate si riempie di turisti. Per lidi, ristoranti e strutture della marina conta farsi trovare prima della stagione: contenuti, scheda Google e sponsorizzate pronti in anticipo, poi seguiti durante l'estate." },
    faq3: { q: "Seguite attività sia di Ginosa paese sia di Ginosa Marina?", a: "Sì, con due strategie diverse: comunicazione costante tutto l'anno per il paese, campagne e contenuti stagionali per la marina. Spesso la stessa attività ha bisogno di entrambe." },
    description: "Agenzia di comunicazione a Ginosa e Ginosa Marina: lancio, rebranding, social e sponsorizzate. Il caso Paresteta, da H28 a nuovo nome. Preventivo gratuito.",
    intro: "A Ginosa abbiamo seguito il cambio di nome di un negozio, da H28 a Paresteta, trasformandolo in un evento del paese. InLab Communication segue lancio, rebranding, social, video e sponsorizzate per Ginosa e Ginosa Marina, da Castellaneta.",
    focus: {
      titolo: "Nuova apertura o nuovo nome: come farlo sapere a tutti",
      testo: "Un'apertura o un cambio di insegna sono il momento in cui il paese ti guarda di più. Con Paresteta il cambio da H28 è diventato un'inaugurazione con attenzione e gente in negozio: nome e immagine nuovi, contenuti social prima dell'evento, sponsorizzate sulla zona e il racconto della giornata. Lo stesso metodo vale per un lido che riapre a Ginosa Marina o per un'attività nuova in paese: preparare l'attesa, riempire il giorno dell'apertura, poi restare presenti.",
    },
    altreFaq: [
      { q: "Quanto tempo prima di un'apertura bisogna iniziare a comunicare?", a: "Qualche settimana prima: il tempo di preparare nome e immagine, creare attesa sui social e far partire le sponsorizzate sulla zona. Il caso Paresteta mostra come lo facciamo." },
    ],
    servizi: {
      'branding': "Nome, logo e immagine coordinata per chi apre o si rinnova, come nel caso Paresteta: dall'insegna ai social, tutto racconta la stessa novità.",
    },
  },
  {
    name: 'Gravina in Puglia', provincia: 'provincia di Bari',
    contesto: 'Gravina in Puglia è nella Città metropolitana di Bari, alle porte del Parco Nazionale dell\'Alta Murgia. È famosa per il ponte-acquedotto sulla gravina e per la Gravina sotterranea. Ha un tessuto di commercio, ristorazione e aziende del territorio murgiano, con un pubblico anche oltre il confine tra le province di Bari e di Taranto.',
    settori: ['commercio e negozi', 'ristoranti e prodotti della Murgia', 'aziende e professionisti'],
    faq: { q: 'Lavorate anche fuori dalla provincia di Taranto?', a: 'Sì. Abbiamo clienti a Gravina in Puglia e lavoriamo in tutta la Puglia e anche fuori regione.' },
    metodo: "A Gravina in Puglia lavoriamo per attività che guardano sia alla Murgia sia al resto della Puglia. Molte hanno clienti anche nei comuni del barese e del materano: per questo impostiamo social e campagne su un'area più ampia del solo paese e curiamo la scheda Google, perché chi arriva da fuori cerca prima di tutto lì.",
    faq2: { q: "Venite anche a Gravina in Puglia per shooting e riprese?", a: "Sì, ci spostiamo da Castellaneta per incontri, foto e video. Il resto del lavoro lo seguiamo a distanza, con un contatto diretto." },
    faq3: { q: "Lavorate anche per attività vicine ad Altamura e alla Murgia?", a: "Sì: impostiamo social e campagne su un'area più ampia del solo paese, perché molte attività di Gravina hanno clienti anche nei comuni vicini, tra Bari e Matera." },
  },
  // Città senza clienti per ora (brief SEO 02/10, punto 5): solo la pagina agenzia.
  {
    name: 'Massafra', provincia: 'provincia di Taranto',
    contesto: 'Massafra è conosciuta come la "Tebaide d\'Italia" per le sue gravine e gli insediamenti rupestri, ed è famosa per il suo Carnevale. È una città viva per commercio, agricoltura e servizi, a pochi chilometri da Castellaneta e Palagianello: per noi è vicina di casa.',
    settori: ['negozi e commercio', 'aziende agricole', 'ristorazione', 'eventi'],
    faq: { q: 'Lavorate anche con attività di Massafra?', a: 'Sì, Massafra è a pochi chilometri dalla nostra sede: possiamo incontrarci di persona e fare shooting e riprese sul posto.' },
    description: "Agenzia di comunicazione a Massafra: un piano per far crescere la tua attività con social, sponsorizzate, sito e scheda Google. Preventivo gratuito.",
    intro: "Massafra è una città di commercio e servizi, a pochi chilometri dalla nostra sede. Aiutiamo le attività a crescere passo dopo passo: social, sponsorizzate, sito e scheda Google, con un piano chiaro e risultati misurati insieme.",
    focus: {
      titolo: "Crescere un passo alla volta",
      testo: "La crescita di un'attività locale raramente arriva da un post fortunato: arriva da un piano. Il primo passo è farsi trovare, con la scheda Google completa e un profilo social curato. Il secondo è farsi scegliere, con contenuti che mostrano chi sei e cosa fai meglio degli altri. Il terzo è portare richieste, con sponsorizzate mirate su Massafra e dintorni e un sito che trasforma una visita in un contatto. Ogni mese guardiamo insieme cosa funziona e dove spingere di più.",
    },
    altreFaq: [
      { q: "Da dove si parte per far crescere un'attività a Massafra?", a: "Da quello che c'è già: scheda Google, profili social, sito. Li analizziamo in un primo incontro e ti diciamo quali sono i due o tre passi che servono subito." },
    ],
    servizi: {
      'meta-ads': "Sponsorizzate mirate su Massafra e sui paesi vicini, con un budget che cresce solo quando i risultati lo giustificano.",
    },
  },
  {
    name: 'Bari', provincia: 'Città metropolitana di Bari',
    contesto: 'Bari è il capoluogo della Puglia, con Bari Vecchia, il lungomare e un tessuto di imprese, professionisti e attività commerciali tra i più grandi del Sud. Per InLab è una città di casa: Nicola Carpignano ha studiato Psicologia a Bari e insegna Marketing e Social Media nei master di EA Formazione.',
    settori: ['aziende e professionisti', 'commercio e ristorazione', 'eventi e formazione'],
    faq: { q: 'Seguite aziende di Bari anche se avete sede a Castellaneta?', a: 'Sì. Lavoriamo a distanza per strategia, contenuti e campagne, e veniamo a Bari per incontri, shooting e riprese.' },
  },
  {
    name: 'Matera', provincia: 'provincia di Matera',
    contesto: 'Matera, con i Sassi patrimonio UNESCO e Capitale Europea della Cultura nel 2019, è a breve distanza da Laterza e Ginosa. Vive di turismo, ospitalità, ristorazione e cultura: settori in cui immagini, video e una presenza online curata fanno la differenza.',
    settori: ['strutture ricettive e B&B', 'ristoranti', 'esperienze ed eventi culturali', 'artigianato'],
    faq: { q: 'Lavorate anche fuori dalla Puglia, a Matera?', a: 'Sì. Matera è vicina ai paesi in cui lavoriamo ogni giorno, e seguiamo attività anche fuori regione.' },
  },
  {
    name: 'Gioia del Colle', provincia: 'Città metropolitana di Bari',
    contesto: 'Gioia del Colle, nella Murgia barese, è conosciuta per il castello normanno-svevo, per la mozzarella e i latticini e per il vino Primitivo di Gioia del Colle DOC. È un territorio di produttori e di aziende agroalimentari, che online hanno bisogno di raccontare qualità e origine.',
    settori: ['caseifici e produttori', 'cantine', 'commercio e ristorazione'],
    faq: { q: 'Potete aiutare un caseificio o una cantina a vendere di più online?', a: 'Sì: foto e video dei prodotti fatti sul posto, social, sito o e-commerce, e campagne mirate a chi cerca prodotti tipici.' },
    description: "Agenzia di comunicazione a Gioia del Colle: foto, social, e-commerce e campagne per caseifici, cantine e produttori della Murgia. Preventivo gratuito.",
    intro: "Mozzarella, latticini e Primitivo: a Gioia del Colle i prodotti parlano da soli, se qualcuno li fa vedere bene. Seguiamo foto, video, social, siti, e-commerce e campagne per produttori e attività del territorio, da Castellaneta.",
    focus: {
      titolo: "Dal caseificio alla tavola di chi compra online",
      testo: "Chi compra un prodotto tipico vuole sapere da dove arriva e chi lo fa. Per questo partiamo dalle immagini vere: il latte che diventa mozzarella, la vendemmia, la cantina. Con queste costruiamo social che raccontano l'origine, un sito o un piccolo e-commerce semplice da gestire, e campagne rivolte a chi cerca prodotti della Murgia anche fuori dalla Puglia.",
    },
    altreFaq: [
      { q: "Si possono vendere online prodotti freschi come i latticini?", a: "Sì, con le giuste scelte su spedizioni e confezioni. Prima ti aiutiamo a capire se conviene e con quale formula: ordini con ritiro, consegna in zona o spedizione." },
    ],
    servizi: {
      'siti-web': "E-commerce e cataloghi semplici da gestire, collegati a WhatsApp e Instagram, per vendere latticini, vino e prodotti tipici anche fuori regione.",
    },
  },
];

export const cityInfo = (name: string): CityInfo | undefined => CITY_INFO.find((c) => c.name === name);
