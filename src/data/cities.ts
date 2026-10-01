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
};

export const CITY_INFO: CityInfo[] = [
  {
    name: 'Taranto', provincia: 'provincia di Taranto',
    contesto: 'Taranto è il capoluogo della provincia e la "città dei due mari", tra Mar Grande e Mar Piccolo. Ha la Città Vecchia sull\'isola, il Borgo con le vie dello shopping e il MArTA, il Museo Archeologico Nazionale. Per un\'attività di Taranto la concorrenza è più alta che nei paesi vicini: farsi trovare su Google e avere social curati fa la differenza tra chi viene scelto e chi resta invisibile.',
    settori: ['negozi e commercio del Borgo', 'ristoranti, bar e locali sul lungomare', 'studi professionali e medici', 'eventi e attività culturali'],
    faq: { q: 'Lavorate con attività di Taranto città?', a: 'Sì. Siamo a Castellaneta, a meno di un\'ora, e veniamo a Taranto per incontri, shooting e riprese. Il resto del lavoro lo seguiamo a distanza, con un contatto diretto con Nicola e Ilaria.' },
  },
  {
    name: 'Castellaneta', provincia: 'provincia di Taranto',
    contesto: 'Castellaneta è la nostra sede. È la città di Rodolfo Valentino, affacciata sulla gravina, con la marina sulla costa ionica: Castellaneta Marina vive di turismo estivo, villaggi, lidi e ristorazione. Qui conosciamo di persona le attività e i ritmi dell\'anno, dalla stagione estiva al lavoro dei mesi invernali.',
    settori: ['lidi, villaggi e strutture turistiche di Castellaneta Marina', 'ristoranti e bar', 'negozi del centro', 'artigiani e aziende agricole'],
    faq: { q: 'Avete un ufficio a Castellaneta?', a: 'Sì, InLab Communication ha sede a Castellaneta (TA). Possiamo incontrarci di persona.' },
  },
  {
    name: 'Mottola', provincia: 'provincia di Taranto',
    contesto: 'Mottola, la "Spia delle Puglie", guarda dall\'alto la piana fino al golfo di Taranto. È conosciuta per le chiese rupestri, come San Nicola, e per le sale ricevimenti e le masserie dove si celebrano matrimoni ed eventi. Per queste attività contano foto, video e una presenza social che faccia vedere gli spazi prima ancora della visita.',
    settori: ['sale ricevimenti e location per eventi', 'ristoranti e agriturismi', 'negozi e servizi del paese'],
    faq: { q: 'Fate foto e video per location di eventi a Mottola?', a: 'Sì, con shooting e riprese sul posto. Le schede dei nostri clienti di Mottola sono nella sezione qui sopra.' },
  },
  {
    name: 'Palagianello', provincia: 'provincia di Taranto',
    contesto: 'Palagianello è un paese della gravina, con il castello Stella-Caracciolo e le chiese rupestri. È una comunità piccola, dove il passaparola conta molto: social e scheda Google servono a farsi trovare anche da chi arriva dai paesi vicini.',
    settori: ['attività del centro storico', 'ristorazione', 'artigiani e piccole imprese'],
    faq: { q: 'Ha senso fare social per un\'attività di un paese piccolo?', a: 'Sì, se il pubblico è quello giusto: le persone del paese e dei paesi vicini. Con le sponsorizzate si possono raggiungere solo loro, senza sprecare budget.' },
  },
  {
    name: 'Palagiano', provincia: 'provincia di Taranto',
    contesto: 'Palagiano è terra di agrumi, in particolare delle clementine del Golfo di Taranto, con la frazione di Chiatona sul mare. Molte attività sono legate all\'agricoltura, alla vendita di prodotti locali e al turismo estivo sulla costa.',
    settori: ['aziende agricole e produttori', 'negozi e servizi del paese', 'strutture e attività della costa'],
    faq: { q: 'Potete aiutare un\'azienda agricola a vendere online?', a: 'Sì: sito, e-commerce o vetrina sui social, e foto dei prodotti fatte sul posto.' },
  },
  {
    name: 'Laterza', provincia: 'provincia di Taranto',
    contesto: 'Laterza è conosciuta per la gravina, una delle più grandi d\'Italia, oggi oasi naturalistica, per la tradizione della maiolica e per il suo pane. È un territorio di artigiani e di prodotti tipici, che online funzionano quando si racconta bene la storia e il lavoro dietro il prodotto.',
    settori: ['forni e prodotti tipici', 'artigianato e maiolica', 'ristorazione', 'turismo legato alla gravina'],
    faq: { q: 'Come si raccontano sui social prodotti artigianali?', a: 'Con video brevi del lavoro, foto curate e una storia coerente. Lo facciamo con shooting e reel girati in bottega.' },
  },
  {
    name: 'Ginosa', provincia: 'provincia di Taranto',
    contesto: 'Ginosa unisce il paese sulla gravina, con il villaggio rupestre, a Ginosa Marina, sulla costa ionica, che d\'estate si riempie di turisti. Per le attività del paese e della marina la sfida è farsi trovare prima della stagione e restare in mente anche durante l\'inverno.',
    settori: ['negozi e commercio (come Paresteta, nostro cliente)', 'lidi, ristoranti e strutture di Ginosa Marina', 'aziende agricole'],
    faq: { q: 'Lavorate anche per attività stagionali di Ginosa Marina?', a: 'Sì: prepariamo contenuti e campagne prima dell\'estate e le seguiamo durante la stagione.' },
  },
  {
    name: 'Gravina in Puglia', provincia: 'provincia di Bari',
    contesto: 'Gravina in Puglia è nella Città metropolitana di Bari, alle porte del Parco Nazionale dell\'Alta Murgia. È famosa per il ponte-acquedotto sulla gravina e per la Gravina sotterranea. Ha un tessuto di commercio, ristorazione e aziende del territorio murgiano, con un pubblico anche oltre il confine tra le province di Bari e di Taranto.',
    settori: ['commercio e negozi', 'ristoranti e prodotti della Murgia', 'aziende e professionisti'],
    faq: { q: 'Lavorate anche fuori dalla provincia di Taranto?', a: 'Sì. Abbiamo clienti a Gravina in Puglia e lavoriamo in tutta la Puglia e anche fuori regione.' },
  },
];

export const cityInfo = (name: string): CityInfo | undefined => CITY_INFO.find((c) => c.name === name);
