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
  /** Sezione in più nella pagina agenzia (es. "Castellaneta Marina", brief SEO 02/10) */
  sezione?: { titolo: string; testo: string };
};

export const CITY_INFO: CityInfo[] = [
  {
    name: 'Taranto', provincia: 'provincia di Taranto',
    contesto: 'Taranto è il capoluogo della provincia e la "città dei due mari", tra Mar Grande e Mar Piccolo. Ha la Città Vecchia sull\'isola, il Borgo con le vie dello shopping e il MArTA, il Museo Archeologico Nazionale. Per un\'attività di Taranto la concorrenza è più alta che nei paesi vicini: farsi trovare su Google e avere social curati fa la differenza tra chi viene scelto e chi resta invisibile.',
    settori: ['negozi e commercio del Borgo', 'ristoranti, bar e locali sul lungomare', 'studi professionali e medici', 'eventi e attività culturali'],
    faq: { q: 'Lavorate con attività di Taranto città?', a: 'Sì. Siamo a Castellaneta, a meno di un\'ora, e veniamo a Taranto per incontri, shooting e riprese. Il resto del lavoro lo seguiamo a distanza, con un contatto diretto con Nicola e Ilaria.' },
    metodo: "A Taranto lavoriamo soprattutto su visibilità e differenza dalla concorrenza: in città ci sono molte attività dello stesso settore, quindi contano una scheda Google curata, recensioni, contenuti riconoscibili e campagne mirate per quartiere o per zona, dal Borgo al lungomare. Partiamo da un'analisi di come ti trovano oggi i clienti e di cosa fanno le attività vicine a te.",
    faq2: { q: "Si possono fare sponsorizzate solo per alcune zone di Taranto?", a: "Sì. Con Meta Ads si può scegliere un raggio intorno all'attività o alcune zone della città, così il budget va solo alle persone che possono venire da te." },
  },
  {
    name: 'Castellaneta', provincia: 'provincia di Taranto',
    contesto: 'Castellaneta è la nostra sede. È la città di Rodolfo Valentino, affacciata sulla gravina, con la marina sulla costa ionica: Castellaneta Marina vive di turismo estivo, villaggi, lidi e ristorazione. Qui conosciamo di persona le attività e i ritmi dell\'anno, dalla stagione estiva al lavoro dei mesi invernali.',
    settori: ['lidi, villaggi e strutture turistiche di Castellaneta Marina', 'ristoranti e bar', 'negozi del centro', 'artigiani e aziende agricole'],
    faq: { q: 'Avete un ufficio a Castellaneta?', a: 'Sì, InLab Communication ha sede a Castellaneta (TA). Possiamo incontrarci di persona.' },
    metodo: "A Castellaneta il lavoro segue due stagioni: d'estate il pubblico arriva da fuori, con turisti e famiglie a Castellaneta Marina, mentre il resto dell'anno contano i clienti del paese e dei paesi vicini. Per questo prepariamo i contenuti in anticipo sulla stagione e teniamo viva la comunicazione anche d'inverno.",
    faq2: { q: "Lavorate anche per strutture di Castellaneta Marina?", a: "Sì: foto, video, social e sponsorizzate per lidi, ristoranti e strutture della costa, preparati prima dell'estate." },
    sezione: { titolo: 'Castellaneta Marina', testo: "Castellaneta Marina, sulla costa ionica, vive di turismo estivo, villaggi, lidi e ristorazione. Per le strutture della costa prepariamo foto, video, social e sponsorizzate prima dell'estate, quando i turisti scelgono dove andare, e le seguiamo durante tutta la stagione." },
  },
  {
    name: 'Mottola', provincia: 'provincia di Taranto',
    contesto: 'Mottola, la "Spia delle Puglie", guarda dall\'alto la piana fino al golfo di Taranto. È conosciuta per le chiese rupestri, come San Nicola, e per le sale ricevimenti e le masserie dove si celebrano matrimoni ed eventi. Per queste attività contano foto, video e una presenza social che faccia vedere gli spazi prima ancora della visita.',
    settori: ['sale ricevimenti e location per eventi', 'ristoranti e agriturismi', 'negozi e servizi del paese'],
    faq: { q: 'Fate foto e video per location di eventi a Mottola?', a: 'Sì, con shooting e riprese sul posto. Le schede dei nostri clienti di Mottola sono nella sezione qui sopra.' },
    metodo: "A Mottola molte attività vivono di eventi, cerimonie e passaparola. Per una location o un ristorante contano le immagini: foto degli spazi, video delle serate, recensioni e un profilo Instagram che faccia venire voglia di prenotare una visita. Lavoriamo sul posto per raccontare gli ambienti come li vede un ospite.",
    faq2: { q: "Fate anche video di matrimoni o eventi a Mottola?", a: "Facciamo video e reel per la comunicazione della location e dell'attività: contenuti che mostrano gli spazi e l'atmosfera, da usare su social, sito e campagne." },
  },
  {
    name: 'Palagianello', provincia: 'provincia di Taranto',
    contesto: 'Palagianello è un paese della gravina, con il castello Stella-Caracciolo e le chiese rupestri. È una comunità piccola, dove il passaparola conta molto: social e scheda Google servono a farsi trovare anche da chi arriva dai paesi vicini. Nicola Carpignano, co-fondatore di InLab, è di Palagianello: qui conosciamo le attività e le persone da sempre.',
    settori: ['attività del centro storico', 'ristorazione', 'artigiani e piccole imprese'],
    faq: { q: 'Ha senso fare social per un\'attività di un paese piccolo?', a: 'Sì, se il pubblico è quello giusto: le persone del paese e dei paesi vicini. Con le sponsorizzate si possono raggiungere solo loro, senza sprecare budget.' },
    metodo: "A Palagianello il pubblico è soprattutto del paese e dei comuni vicini, come Palagiano, Mottola e Castellaneta. Per questo lavoriamo su una comunicazione vicina e riconoscibile: scheda Google completa, post che mostrano le persone dietro l'attività e sponsorizzate locali con budget contenuti.",
    faq2: { q: "Serve un sito se ho già la pagina Facebook?", a: "Spesso sì: il sito e la scheda Google fanno trovare l'attività su Google, mentre i social tengono il contatto con chi ti conosce già. Insieme funzionano meglio." },
  },
  {
    name: 'Palagiano', provincia: 'provincia di Taranto',
    contesto: 'Palagiano è terra di agrumi, in particolare delle clementine del Golfo di Taranto, con la frazione di Chiatona sul mare. Molte attività sono legate all\'agricoltura, alla vendita di prodotti locali e al turismo estivo sulla costa.',
    settori: ['aziende agricole e produttori', 'negozi e servizi del paese', 'strutture e attività della costa'],
    faq: { q: 'Potete aiutare un\'azienda agricola a vendere online?', a: 'Sì: sito, e-commerce o vetrina sui social, e foto dei prodotti fatte sul posto.' },
    metodo: "A Palagiano lavoriamo spesso con chi produce: aziende agricole, produttori di agrumi e attività che vendono prodotti del territorio. Fotografiamo i prodotti e le fasi del lavoro, prepariamo schede chiare per il sito o per la vendita online e raccontiamo la filiera sui social, perché chi compra vuole sapere da dove arriva quello che mangia.",
    faq2: { q: "Fate foto dei prodotti direttamente in azienda?", a: "Sì, facciamo gli shooting sul posto: in campo, in magazzino o in negozio, per avere foto vere e non immagini di repertorio." },
  },
  {
    name: 'Laterza', provincia: 'provincia di Taranto',
    contesto: 'Laterza è conosciuta per la gravina, una delle più grandi d\'Italia, oggi oasi naturalistica, per la tradizione della maiolica e per il suo pane. È un territorio di artigiani e di prodotti tipici, che online funzionano quando si racconta bene la storia e il lavoro dietro il prodotto.',
    settori: ['forni e prodotti tipici', 'artigianato e maiolica', 'ristorazione', 'turismo legato alla gravina'],
    faq: { q: 'Come si raccontano sui social prodotti artigianali?', a: 'Con video brevi del lavoro, foto curate e una storia coerente. Lo facciamo con shooting e reel girati in bottega.' },
    metodo: "A Laterza il valore sta nel saper fare: forni, botteghe, ceramisti e produttori. Lavoriamo con video brevi del lavoro, foto curate dei prodotti e testi che spiegano la tradizione senza retorica. Così anche chi non è del posto capisce perché vale la pena comprare o fare una deviazione per venire a trovarti.",
    faq2: { q: "Si possono vendere online prodotti artigianali di Laterza?", a: "Sì: con un piccolo e-commerce o con un catalogo collegato a WhatsApp e Instagram. Ti aiutiamo a scegliere la soluzione più semplice da gestire." },
  },
  {
    name: 'Ginosa', provincia: 'provincia di Taranto',
    contesto: 'Ginosa unisce il paese sulla gravina, con il villaggio rupestre, a Ginosa Marina, sulla costa ionica, che d\'estate si riempie di turisti. Per le attività del paese e della marina la sfida è farsi trovare prima della stagione e restare in mente anche durante l\'inverno.',
    settori: ['negozi e commercio (come Paresteta, nostro cliente)', 'lidi, ristoranti e strutture di Ginosa Marina', 'aziende agricole'],
    faq: { q: 'Lavorate anche per attività stagionali di Ginosa Marina?', a: 'Sì: prepariamo contenuti e campagne prima dell\'estate e le seguiamo durante la stagione.' },
    metodo: "A Ginosa lavoriamo su due pubblici diversi: chi vive in paese tutto l'anno e chi arriva d'estate a Ginosa Marina. Per i negozi del centro contano costanza e riconoscibilità, come nel caso di Paresteta; per le attività della marina conta farsi trovare prima della stagione, con contenuti e campagne pronti già in primavera.",
    faq2: { q: "Quando conviene iniziare a promuovere un'attività di Ginosa Marina?", a: "Qualche mese prima dell'estate: i turisti scelgono dove andare in anticipo, quindi contenuti, scheda Google e sponsorizzate devono essere pronti prima dell'arrivo della stagione." },
    sezione: { titolo: 'Ginosa Marina', testo: "Ginosa Marina, sulla costa ionica, d'estate si riempie di turisti. Per lidi, ristoranti e strutture della marina conta farsi trovare prima della stagione: contenuti, scheda Google e sponsorizzate pronti in anticipo, poi seguiti durante l'estate." },
  },
  {
    name: 'Gravina in Puglia', provincia: 'provincia di Bari',
    contesto: 'Gravina in Puglia è nella Città metropolitana di Bari, alle porte del Parco Nazionale dell\'Alta Murgia. È famosa per il ponte-acquedotto sulla gravina e per la Gravina sotterranea. Ha un tessuto di commercio, ristorazione e aziende del territorio murgiano, con un pubblico anche oltre il confine tra le province di Bari e di Taranto.',
    settori: ['commercio e negozi', 'ristoranti e prodotti della Murgia', 'aziende e professionisti'],
    faq: { q: 'Lavorate anche fuori dalla provincia di Taranto?', a: 'Sì. Abbiamo clienti a Gravina in Puglia e lavoriamo in tutta la Puglia e anche fuori regione.' },
    metodo: "A Gravina in Puglia lavoriamo per attività che guardano sia alla Murgia sia al resto della Puglia. Molte hanno clienti anche nei comuni del barese e del materano: per questo impostiamo social e campagne su un'area più ampia del solo paese e curiamo la scheda Google, perché chi arriva da fuori cerca prima di tutto lì.",
    faq2: { q: "Venite anche a Gravina in Puglia per shooting e riprese?", a: "Sì, ci spostiamo da Castellaneta per incontri, foto e video. Il resto del lavoro lo seguiamo a distanza, con un contatto diretto." },
  },
  // Città senza clienti per ora (brief SEO 02/10, punto 5): solo la pagina agenzia.
  {
    name: 'Massafra', provincia: 'provincia di Taranto',
    contesto: 'Massafra è conosciuta come la "Tebaide d\'Italia" per le sue gravine e gli insediamenti rupestri, ed è famosa per il suo Carnevale. È una città viva per commercio, agricoltura e servizi, a pochi chilometri da Castellaneta e Palagianello: per noi è vicina di casa.',
    settori: ['negozi e commercio', 'aziende agricole', 'ristorazione', 'eventi'],
    faq: { q: 'Lavorate anche con attività di Massafra?', a: 'Sì, Massafra è a pochi chilometri dalla nostra sede: possiamo incontrarci di persona e fare shooting e riprese sul posto.' },
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
  },
];

export const cityInfo = (name: string): CityInfo | undefined => CITY_INFO.find((c) => c.name === name);
