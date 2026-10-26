// Testi propri di ogni città per le pagine /{servizio}-{città} e
// /agenzia-comunicazione-{città} (brief SEO del 01/10/2026). Fatti noti e
// verificabili sulle città: niente numeri, prezzi o promesse.
export type CityInfo = {
  name: string;
  /** "provincia di Taranto" / "provincia di Bari" */
  provincia: string;
  contesto: string;
  settori: string[];
  /** `link`: collegamento su una parola della risposta (es. un cliente → la sua scheda, brief SEO 26/10) */
  faq: { q: string; a: string; link?: { testo: string; href: string } };
  /** "Come lavoriamo a {città}" (brief SEO 01/10 sera) */
  metodo?: string;
  faq2?: { q: string; a: string };
  /** Terza domanda (brief SEO 02/10 pomeriggio) */
  faq3?: { q: string; a: string };
  /** Domande in più dopo la terza (brief SEO 03/10 Taranto) */
  altreFaq?: { q: string; a: string }[];
  /** Sezione in più nella pagina agenzia (es. "Castellaneta Marina", brief SEO 02/10) */
  /** `link`: collegamento in fondo alla sezione (es. Castellaneta Marina → la sua pagina, decisione SEO 10/10) */
  sezione?: { titolo: string; testo: string; link?: { testo: string; href: string } };
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
  /** Città senza clienti: nella pagina agenzia il blocco "Lavoriamo in tutta la provincia"
   * con i lavori dei paesi vicini al posto di "I nostri lavori" (brief SEO 10/10 territorio) */
  lavoriVicini?: boolean;
  /** Argomento proprio della pagina agenzia: H2 + testo subito dopo l'apertura (brief SEO 05/10 città) */
  /** `link`: collegamento su una parola del testo (es. un lavoro nostro → il suo caso studio, brief SEO 12/10) */
  focus?: { titolo: string; testo: string; link?: { testo: string; href: string } };
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
    sezione: { titolo: 'Castellaneta Marina', testo: "Castellaneta Marina, sulla costa ionica, vive di turismo estivo, villaggi, lidi e ristorazione. Per le strutture della costa prepariamo foto, video, social e sponsorizzate prima dell'estate, quando i turisti scelgono dove andare, e le seguiamo durante tutta la stagione.", link: { testo: 'Agenzia di comunicazione a Castellaneta Marina', href: '/agenzia-comunicazione-castellaneta-marina' } },
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
      autore: 'nicola-carpignano-social-media-manager-palagianello',
      link: 'Nicola Carpignano, social media manager di Palagianello',
    },
    servizi: {
      'gestione-social': "A Palagianello il tuo social media manager è del paese: Nicola Carpignano, cofondatore di InLab Communication, segue di persona la comunicazione delle attività locali, da Sublime Tentazione a Masseria Sacramento. I social sono il passaparola che continua online: raccontiamo le persone dietro il bancone, le novità e gli eventi del paese. Come per Sublime Tentazione, con una presenza costante tra gelati d'estate e panettoni a Natale.",
      'meta-ads': "Sponsorizzate mirate a Palagianello e ai paesi vicini, come Palagiano, Mottola, Castellaneta e Massafra: budget contenuti e un pubblico che può davvero venire da te, senza sprechi.",
      'siti-web': "Un sito semplice e veloce, collegato alla scheda Google, per farti trovare da chi cerca un'attività a Palagianello e da chi arriva da fuori per la gravina e il castello.",
      'automazioni-ai': "Risposte automatiche su WhatsApp e Instagram per prenotazioni e domande frequenti: utili a masserie, ristoranti e negozi del paese che non possono stare sempre al telefono.",
      'shooting': "Shooting sul posto, in negozio, in laboratorio o in masseria: foto vere degli spazi, dei prodotti e delle serate, al posto delle immagini di repertorio.",
      'video': "Video brevi e leggeri che raccontano il negozio e chi ci lavora. Come per DIRAM, tra ricambi, riparazioni e punto Poste.",
      'branding': "Nome, logo e immagine coordinata per chi apre o rinnova un'attività a Palagianello: un'identità che si riconosce in paese e nei comuni vicini.",
    },
    // brief SEO 10/10: "social media manager Palagianello"; l'H1 della pagina resta "Gestione social a Palagianello"
    introLink: { testo: "Nicola Carpignano", href: "/autori/nicola-carpignano-social-media-manager-palagianello" },
    paginaServizio: {
      'gestione-social': {
        title: "Social media manager a Palagianello | InLab Communication",
        description: "Social media manager a Palagianello: Nicola Carpignano, cofondatore di InLab, è del paese. Gestione social, reel e sponsorizzate. Preventivo gratuito.",
      },
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
      'gestione-social': "Per un'attività di Massafra i social servono a crescere: farsi trovare da chi non ti conosce ancora, farsi scegliere da chi ti confronta con altri, portare richieste concrete. Costruiamo un piano editoriale chiaro, giriamo foto e reel sul posto, a pochi chilometri dalla nostra sede, e ogni mese guardiamo insieme cosa funziona.",
      'meta-ads': "Sponsorizzate mirate su Massafra e sui paesi vicini, con un budget che cresce solo quando i risultati lo giustificano.",
    },
    paginaServizio: {
      'gestione-social': {
        title: "Gestione social a Massafra | InLab Communication",
        description: "Gestione social a Massafra: piano editoriale, contenuti, reel e sponsorizzate per far crescere la tua attività passo dopo passo. Preventivo gratuito.",
      },
    },
  },
  {
    name: 'Bari', provincia: 'Città metropolitana di Bari',
    contesto: 'Bari è il capoluogo della Puglia, con Bari Vecchia, il lungomare e un tessuto di imprese, professionisti e attività commerciali tra i più grandi del Sud. Per InLab è una città di casa: Nicola Carpignano ha studiato Psicologia a Bari e insegna Marketing e Social Media nei master di EA Formazione.',
    settori: ['aziende e professionisti', 'commercio e ristorazione', 'eventi e formazione'],
    faq: { q: 'Seguite aziende di Bari anche se avete sede a Castellaneta?', a: 'Sì. Lavoriamo a distanza per strategia, contenuti e campagne, e veniamo a Bari per incontri, shooting e riprese.' },
    description: "Agenzia di comunicazione per attività di Bari: strategia, social, sponsorizzate e siti con il metodo di chi insegna marketing. Preventivo gratuito.",
    intro: "A Bari Nicola Carpignano, cofondatore di InLab, ha studiato Psicologia e insegna Marketing e Social Media nei master di EA Formazione. Portiamo lo stesso metodo alle attività di Bari: strategia prima dei post, numeri chiari e contenuti che parlano alle persone giuste.",
    introLink: { testo: "Nicola Carpignano", href: "/autori/nicola-carpignano-social-media-manager-palagianello" },
    focus: {
      titolo: "Prima la strategia, poi i contenuti",
      testo: "In una città grande come Bari pubblicare tanto non basta: bisogna sapere a chi parli e perché dovrebbe scegliere te. Partiamo da qui, con l'analisi del pubblico, dei concorrenti e di cosa ti rende diverso. Poi costruiamo il piano: quali contenuti, su quali canali, con quale budget per le sponsorizzate, e come misureremo i risultati. È lo stesso approccio che Nicola insegna nei master in Marketing e Social Media: psicologia delle persone, obiettivi chiari, dati.",
    },
    altreFaq: [
      { q: "Che differenza c'è tra un social media manager e una strategia di comunicazione?", a: "Il social media manager pubblica; la strategia decide cosa, per chi e perché. Noi facciamo entrambe le cose: prima il piano, poi i contenuti e le campagne." },
    ],
    servizi: {
      'gestione-social': "In una città grande come Bari pubblicare tanto non basta: serve sapere a chi parli e perché dovrebbe scegliere te. Partiamo dalla strategia, con l'analisi di pubblico, concorrenti e punti di forza, poi costruiamo contenuti e campagne. È il metodo che Nicola Carpignano insegna nei master di EA Formazione in Marketing e Social Media.",
    },
    paginaServizio: {
      'gestione-social': {
        title: "Gestione social a Bari | InLab Communication",
        description: "Gestione social a Bari: strategia, piano editoriale, contenuti e campagne con il metodo di chi insegna Social Media nei master. Preventivo gratuito.",
      },
    },
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
      'gestione-social': "A Gioia del Colle i social funzionano quando mostrano da dove arriva il prodotto: il caseificio, la cantina, le persone che ci lavorano. Raccontiamo origine e qualità con foto e video veri, in un piano editoriale costante, e portiamo i contenuti anche a chi cerca prodotti della Murgia fuori dalla Puglia.",
      'siti-web': "E-commerce e cataloghi semplici da gestire, collegati a WhatsApp e Instagram, per vendere latticini, vino e prodotti tipici anche fuori regione.",
    },
    paginaServizio: {
      'gestione-social': {
        title: "Gestione social a Gioia del Colle | InLab Communication",
        description: "Gestione social a Gioia del Colle: contenuti su prodotti, origine e persone, per caseifici, cantine e attività del territorio. Preventivo gratuito.",
      },
    },
  },
  {
    // brief SEO 10/10 territorio, lotto 1
    name: "Castellaneta Marina", provincia: "provincia di Taranto",
    contesto: "Castellaneta Marina vive tra la pineta, la Riserva naturale Stornara e una lunga spiaggia sulla costa ionica. D'estate si riempie di turisti, villaggi e lidi; il resto dell'anno contano i clienti di Castellaneta e dei paesi vicini.",
    settori: ["lidi e stabilimenti balneari", "ristoranti e bar della costa", "villaggi e strutture ricettive"],
    faq: { q: "Quando conviene iniziare la comunicazione di un lido?", a: "In primavera: a giugno i turisti hanno già scelto dove andare. Prepariamo foto, scheda Google e campagne prima dell'apertura." },
    description: "Agenzia di comunicazione a Castellaneta Marina: foto, social, grafiche e sponsorizzate per lidi, ristoranti e strutture della costa. Preventivo gratuito.",
    intro: "Castellaneta Marina è la nostra costa: per i lidi Il Paradiso e La Vela abbiamo curato shooting dei piatti e grafiche degli eventi. Seguiamo foto, social, video e sponsorizzate per le attività della marina, a pochi minuti dalla nostra sede di Castellaneta.",
    focus: { titolo: "Riempire la stagione, prima che inizi", testo: "Chi va al mare sceglie il lido e il ristorante guardando le foto. Per Il Paradiso abbiamo fotografato i piatti del ristorante, per La Vela creiamo le grafiche degli eventi. Il lavoro inizia prima dell'estate: contenuti, scheda Google e sponsorizzate pronti in primavera, poi foto, reel ed eventi raccontati durante la stagione." },
    servizi: { 'gestione-social': "Social per lidi e ristoranti di Castellaneta Marina: piatti, tramonti ed eventi raccontati durante la stagione, con grafiche come quelle che curiamo per La Vela." },
  },
  {
    // brief SEO 10/10 territorio, lotto 1
    name: "Ferrara", provincia: "provincia di Ferrara",
    contesto: "Ferrara è la città degli Estensi, con il Castello Estense, le Mura e un centro rinascimentale patrimonio UNESCO. È una città di botteghe, locali e attività storiche, dove la qualità si racconta bene con immagini curate.",
    settori: ["pasticcerie e botteghe", "locali e ristoranti", "attività storiche del centro"],
    faq: { q: "Seguite attività di Ferrara anche se siete in Puglia?", a: "Sì: per la Pasticceria Naturale gestiamo i social a distanza e facciamo foto e video sul posto." },
    description: "Agenzia di comunicazione per attività di Ferrara: gestione social, foto e video sul posto, strategia e testi. Il caso Pasticceria Naturale. Preventivo gratuito.",
    intro: "A Ferrara gestiamo i social della Pasticceria Naturale: strategia, idee e testi nostri, foto e video realizzati sul posto. Seguiamo attività di Ferrara con lo stesso metodo che usiamo in Puglia, lavorando a distanza e venendo di persona per le riprese.",
    focus: { titolo: "Seguire un'attività a distanza, senza perdere il contatto", testo: "Con la Pasticceria Naturale lavoriamo così: strategia e piano editoriale condivisi, testi e idee scritti da noi, foto e video girati sul posto. Il resto si fa a distanza, con un contatto diretto e report chiari. Per un'attività di Ferrara significa avere un social media manager dedicato, non un account gestito in serie." },
    servizi: { 'gestione-social': "Gestione social a Ferrara come per la Pasticceria Naturale: strategia, testi, idee per i contenuti e foto e video realizzati sul posto." },
  },
  {
    // brief SEO 10/10 territorio, lotto 1
    name: "Crispiano", provincia: "provincia di Taranto",
    contesto: "Crispiano è conosciuta come la città delle cento masserie: la sua campagna, tra gravine e muretti a secco, è piena di masserie storiche che oggi ospitano ristoranti, eventi e turismo.",
    settori: ["masserie ed eventi", "ristoranti e agriturismi", "attività del paese"],
    faq: { q: "Lavorate con masserie ed agriturismi?", a: "Sì: foto, video, social e campagne per eventi, ristorazione e ospitalità. Facciamo le riprese sul posto." },
    description: "Agenzia di comunicazione a Crispiano: social, foto, video e sponsorizzate per masserie, ristoranti e attività del paese. Da Castellaneta, preventivo gratuito.",
    intro: "Crispiano è la città delle cento masserie, a mezz'ora dalla nostra sede. Seguiamo social, foto, video, sponsorizzate e siti per masserie, ristoranti e attività del paese.",
    focus: { titolo: "Raccontare una masseria a chi non c'è mai stato", testo: "Una masseria si sceglie dalle immagini: gli spazi, la luce, i piatti, l'atmosfera di un evento. Facciamo shooting e riprese sul posto, costruiamo un profilo social che mostri la masseria in ogni stagione e portiamo i contenuti, con le sponsorizzate, a chi cerca un posto per un matrimonio, un pranzo o un weekend." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per masserie e attività di Crispiano: foto e reel girati sul posto, un calendario costante e campagne per eventi e prenotazioni." },
  },
  {
    // brief SEO 10/10 territorio, lotto 1
    name: "Statte", provincia: "provincia di Taranto",
    contesto: "Statte si trova a pochi chilometri da Taranto, nel Parco Terra delle Gravine, con la gravina di Leucaspide e le sue masserie. Molte attività lavorano sia con il paese sia con il pubblico di Taranto.",
    settori: ["negozi e servizi del paese", "masserie e ristorazione", "attività che lavorano anche con Taranto"],
    faq: { q: "Le sponsorizzate possono raggiungere anche Taranto?", a: "Sì: impostiamo zone e raggio in base a dove si trovano i tuoi clienti, Statte e i quartieri vicini di Taranto." },
    description: "Agenzia di comunicazione a Statte: social, sponsorizzate, sito e scheda Google per attività alle porte di Taranto. Da Castellaneta, preventivo gratuito.",
    intro: "Statte è alle porte di Taranto: per le sue attività la sfida è farsi notare tra tanti concorrenti della città vicina. Seguiamo social, sponsorizzate, siti e scheda Google, da Castellaneta.",
    focus: { titolo: "Farsi trovare da chi cerca a Taranto", testo: "Per un'attività di Statte, il pubblico non si ferma ai confini del paese: chi cerca un servizio a Taranto può scegliere te, se ti trova. Partiamo da una scheda Google completa e curata, contenuti social riconoscibili e sponsorizzate su Statte e sui quartieri vicini di Taranto, con un budget proporzionato." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per attività di Statte che vogliono farsi conoscere anche a Taranto: contenuti riconoscibili e costanti, con un piano chiaro." },
  },
  {
    // brief SEO 10/10 territorio, lotto 1
    name: "Noci", provincia: "provincia di Bari",
    contesto: "Noci, in provincia di Bari, è al confine con la Valle d'Itria: centro storico con le gnostre, masserie in campagna e una tradizione gastronomica che si festeggia con Bacco nelle Gnostre. È un paese che vive di cibo, ospitalità e turismo.",
    settori: ["ristoranti e bracerie", "masserie e ospitalità", "negozi del centro storico"],
    faq: { q: "Fate food photography per ristoranti di Noci?", a: "Sì, con shooting sul posto: piatti, sala e persone, da usare su social, scheda Google e sito." },
    description: "Agenzia di comunicazione a Noci: social, foto, video e sponsorizzate per ristoranti, masserie e attività della Murgia dei Trulli. Preventivo gratuito.",
    intro: "Noci è nella Murgia dei Trulli, tra gnostre, masserie e buona cucina. Seguiamo social, foto, video, sponsorizzate e siti per le attività del paese, da Castellaneta.",
    focus: { titolo: "Il cibo si vende con gli occhi", testo: "Per un ristorante, una braceria o una masseria di Noci, le foto dei piatti e i video in cucina sono il primo menu che le persone vedono. Facciamo shooting e reel sul posto, curiamo la scheda Google con foto vere e prepariamo contenuti e campagne per i periodi di maggiore affluenza, come le feste e i weekend d'autunno." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per ristoranti, masserie e negozi di Noci: foto dei piatti, reel in cucina e contenuti costanti per farsi scegliere da chi arriva in paese." },
  },
  {
    // brief SEO 10/10 territorio, lotto 1
    name: "Martina Franca", provincia: "provincia di Taranto",
    contesto: "Martina Franca è famosa per il centro storico barocco, il Festival della Valle d'Itria e il capocollo. Tra trulli e masserie è una delle mete più amate della Puglia, con turisti italiani e stranieri per gran parte dell'anno.",
    settori: ["hotel e strutture ricettive", "ristoranti", "negozi di prodotti tipici"],
    faq: { q: "Potete fare contenuti anche in inglese?", a: "Sì, per hotel, ristoranti e attività che lavorano con turisti stranieri: post, didascalie e testi del sito." },
    description: "Agenzia di comunicazione a Martina Franca: social, foto, video e campagne per hotel, ristoranti e negozi della Valle d'Itria. Preventivo gratuito.",
    intro: "Martina Franca è la capitale barocca della Valle d'Itria. Seguiamo social, foto, video, sponsorizzate e siti per hotel, ristoranti, negozi e attività del territorio, da Castellaneta.",
    focus: { titolo: "Parlare anche ai turisti", testo: "A Martina Franca molti clienti arrivano da fuori. Per un hotel, un ristorante o un negozio di prodotti tipici servono contenuti che funzionino anche per chi non conosce il posto: foto curate, reel brevi, una scheda Google completa e, quando serve, testi anche in inglese. Prepariamo campagne mirate ai turisti prima della stagione e ai clienti della zona per il resto dell'anno." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per hotel, ristoranti e negozi di Martina Franca: contenuti curati per i turisti e per chi vive in Valle d'Itria, anche in inglese." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "Grottaglie", provincia: "provincia di Taranto",
    contesto: "Grottaglie è famosa per il Quartiere delle Ceramiche, dove le botteghe lavorano l'argilla da secoli, e per l'aeroporto di Taranto-Grottaglie. È un paese di artigiani, negozi e piccole imprese a pochi chilometri da Taranto.",
    settori: ["botteghe di ceramica e artigiani", "negozi e servizi del paese", "ristoranti e attività turistiche"],
    faq: { q: "Potete aiutare una bottega di ceramica a vendere online?", a: "Sì: foto dei prodotti, social e un piccolo e-commerce o un catalogo collegato a Instagram e WhatsApp." },
    description: "Agenzia di comunicazione a Grottaglie: social, foto, video e siti per botteghe di ceramica, negozi e attività del paese. Preventivo gratuito.",
    intro: "Grottaglie è la città delle ceramiche. Seguiamo social, foto, video, sponsorizzate e siti per botteghe, negozi e attività del paese, da Castellaneta.",
    focus: { titolo: "Far vedere le mani che lavorano", testo: "Una ceramica fatta a mano si vende meglio quando si vede come nasce: il tornio, la decorazione, la cottura. Giriamo reel in bottega, fotografiamo i pezzi finiti con luce curata e costruiamo un profilo che parli sia ai clienti del posto sia a chi compra online o arriva da turista." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per botteghe e negozi di Grottaglie: reel in laboratorio, foto dei pezzi e contenuti costanti per farsi conoscere anche fuori dal paese." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "San Giorgio Ionico", provincia: "provincia di Taranto",
    contesto: "San Giorgio Ionico si trova a sud-est di Taranto, tra campagne e vigneti. Molte attività lavorano sia con chi vive in paese sia con chi arriva dai comuni vicini e dalla città.",
    settori: ["negozi e servizi", "ristorazione e bar", "artigiani e imprese locali"],
    faq: { q: "Mi aiutate anche con la scheda Google?", a: "Sì: la completiamo con foto vere, descrizione, orari e servizi, e la teniamo aggiornata insieme ai social." },
    description: "Agenzia di comunicazione a San Giorgio Ionico: social, sponsorizzate, scheda Google e sito per negozi e attività alle porte di Taranto. Preventivo gratuito.",
    intro: "San Giorgio Ionico è a pochi minuti da Taranto: per le sue attività conta farsi scegliere dai clienti del paese e da quelli della città vicina. Seguiamo social, sponsorizzate, siti e scheda Google, da Castellaneta.",
    focus: { titolo: "Prima ti cercano su Google, poi entrano", testo: "Chi cerca un negozio o un servizio vicino a casa guarda prima la scheda Google: orari, foto, recensioni. Partiamo da lì, con una scheda completa e aggiornata. Poi la colleghiamo a social curati e a sponsorizzate su San Giorgio e sui paesi vicini, così chi ti trova online sa subito chi sei e come raggiungerti." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per attività di San Giorgio Ionico: contenuti riconoscibili, legati alla scheda Google e alle sponsorizzate sulla zona." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "Locorotondo", provincia: "provincia di Bari",
    contesto: "Locorotondo è tra i Borghi più belli d'Italia, con il centro storico a pianta circolare affacciato sulla Valle d'Itria. È conosciuta per il vino bianco Locorotondo DOC, per le masserie e i trulli delle campagne e per il turismo, che dura gran parte dell'anno.",
    settori: ["cantine e produttori di vino", "B&B, masserie e strutture ricettive", "ristoranti e bar del centro"],
    faq: { q: "Lavorate con cantine e strutture ricettive?", a: "Sì: foto, video, social e campagne, anche in inglese per i turisti stranieri." },
    description: "Agenzia di comunicazione a Locorotondo: social, foto, video e campagne per cantine, masserie, ristoranti e B&B della Valle d'Itria. Preventivo gratuito.",
    intro: "Locorotondo, con il suo centro bianco e circolare, è uno dei borghi più fotografati della Valle d'Itria. Seguiamo social, foto, video, sponsorizzate e siti per cantine, strutture ricettive e locali del paese.",
    focus: { titolo: "Un borgo che si sceglie dalle foto", testo: "Chi prenota una camera, un tavolo o una visita in cantina a Locorotondo lo fa guardando le immagini. Curiamo foto e video che rendano giustizia al posto, profili social che raccontano le stagioni, dalla vendemmia all'estate, e campagne per raggiungere i turisti prima che partano, anche in inglese." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per cantine, B&B e ristoranti di Locorotondo: immagini curate del borgo e del prodotto, contenuti per ogni stagione e testi anche in inglese." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "Alberobello", provincia: "provincia di Bari",
    contesto: "I trulli di Alberobello, nei rioni Monti e Aia Piccola, sono patrimonio mondiale UNESCO dal 1996. La città vive di turismo tutto l'anno: case vacanza nei trulli, ristoranti, negozi di artigianato e prodotti tipici.",
    settori: ["trulli e case vacanza", "ristoranti e locali", "negozi di artigianato e prodotti tipici"],
    faq: { q: "Potete aiutare un trullo in affitto ad avere più prenotazioni dirette?", a: "Sì: foto curate, sito con richiesta di prenotazione, scheda Google e social, per dipendere meno dai portali." },
    description: "Agenzia di comunicazione ad Alberobello: social, foto, video e campagne per trulli in affitto, ristoranti e negozi della città dei trulli. Preventivo gratuito.",
    intro: "Alberobello è la città dei trulli, patrimonio UNESCO, con turisti da tutto il mondo. Seguiamo social, foto, video, sponsorizzate e siti per strutture ricettive, ristoranti e negozi, da Castellaneta.",
    focus: { titolo: "Distinguersi dove tutti hanno un trullo", testo: "Ad Alberobello molte attività offrono qualcosa di simile: lo stesso panorama, gli stessi trulli. Per farsi scegliere serve mostrare cosa ti rende diverso: l'accoglienza, la cucina, i dettagli. Lavoriamo su foto e video autentici, recensioni, scheda Google e prenotazioni, con contenuti pensati anche per i turisti stranieri." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per strutture, ristoranti e negozi di Alberobello: contenuti autentici, recensioni valorizzate e testi anche in inglese per i turisti." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "Santeramo in Colle", provincia: "provincia di Bari",
    contesto: "Santeramo in Colle, sull'altopiano della Murgia barese, è conosciuta come uno dei centri del distretto del mobile imbottito. Accanto alle imprese del settore ci sono negozi, ristoranti e attività legate alla campagna e alla carne della Murgia.",
    settori: ["aziende e produttori", "negozi e showroom", "ristoranti e bracerie"],
    faq: { q: "Lavorate anche con aziende e showroom?", a: "Sì: sito, branding, foto e video dei prodotti, social e campagne per generare contatti." },
    description: "Agenzia di comunicazione a Santeramo in Colle: social, video, siti e campagne per aziende, negozi e attività della Murgia. Preventivo gratuito.",
    intro: "Santeramo in Colle è sulla Murgia, a pochi chilometri da Gioia del Colle e Matera. Seguiamo social, video, sponsorizzate, siti e branding per aziende e attività del paese, da Castellaneta.",
    focus: { titolo: "Comunicare come un'azienda, anche se sei piccolo", testo: "In un territorio con imprese conosciute anche fuori dall'Italia, anche le attività più piccole possono comunicare in modo professionale: un'immagine coordinata, un sito chiaro, contenuti costanti. Partiamo dal branding e dal sito, poi costruiamo social e campagne che portano richieste concrete, dal paese e dai comuni vicini." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per aziende, showroom e negozi di Santeramo in Colle: contenuti professionali, foto dei prodotti e campagne per richieste di contatto." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "Altamura", provincia: "provincia di Bari",
    contesto: "Altamura è famosa per il Pane di Altamura DOP, per la Cattedrale voluta da Federico II e per l'Uomo di Altamura, uno dei reperti preistorici più importanti d'Europa. È una città grande e viva, con un'economia di aziende agroalimentari, commercio e servizi.",
    settori: ["forni e aziende agroalimentari", "ristoranti e attività del centro", "negozi e servizi"],
    faq: { q: "Potete aiutare un forno o un'azienda alimentare a vendere online?", a: "Sì: foto dei prodotti, social, e-commerce o catalogo con ordini su WhatsApp, e campagne mirate." },
    description: "Agenzia di comunicazione ad Altamura: social, foto, video, siti e campagne per forni, ristoranti, negozi e aziende della Murgia. Preventivo gratuito.",
    intro: "Altamura è la città del pane DOP e il cuore dell'Alta Murgia. Seguiamo social, foto, video, sponsorizzate e siti per forni, ristoranti, negozi e aziende del territorio, da Castellaneta.",
    focus: { titolo: "Un prodotto famoso va raccontato bene", testo: "Il nome Altamura è già conosciuto in tutta Italia: il lavoro è farlo arrivare al tuo forno, al tuo ristorante o alla tua azienda. Raccontiamo il prodotto con foto e video sul posto, curiamo social e scheda Google e prepariamo campagne per chi cerca prodotti tipici, anche per la vendita online." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per forni, ristoranti e negozi di Altamura: il prodotto raccontato con foto e video veri, contenuti costanti e campagne sulla zona." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "Acquaviva delle Fonti", provincia: "provincia di Bari",
    contesto: "Acquaviva delle Fonti, nel cuore della provincia di Bari, è conosciuta per la cipolla rossa di Acquaviva e per l'ospedale Miulli, che porta in città persone da tutta la zona. È un centro di servizi, commercio e professionisti.",
    settori: ["studi professionali e sanitari", "negozi e servizi", "ristorazione e prodotti tipici"],
    faq: { q: "Quanto tempo serve per realizzare un sito?", a: "Dipende dalle pagine e dai contenuti: dopo un primo incontro ti diamo tempi e preventivo chiari." },
    description: "Agenzia di comunicazione ad Acquaviva delle Fonti: siti web, social, sponsorizzate e scheda Google per negozi, studi e attività. Preventivo gratuito.",
    intro: "Ad Acquaviva delle Fonti realizziamo siti web, social e campagne per negozi, studi professionali e attività del paese. Lavoriamo da Castellaneta, con incontri di persona quando serve.",
    focus: { titolo: "Un sito che lavora per te", testo: "Per uno studio, un negozio o un'attività di servizi, il sito è il posto dove chi ti ha trovato decide se contattarti. Realizziamo siti veloci e chiari, con una pagina per ogni servizio, contatti sempre visibili e collegamento alla scheda Google, come abbiamo fatto con luminaricciardi.it per uno studio dentistico di Palagiano.", link: { testo: "luminaricciardi.it", href: "/casi-studio/ricciardi" } },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per negozi, studi e attività di Acquaviva delle Fonti: contenuti chiari e costanti, collegati al sito e alla scheda Google." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "Polignano a Mare", provincia: "provincia di Bari",
    contesto: "Polignano a Mare, con il centro storico a picco sul mare e la spiaggia di Lama Monachile, è la città di Domenico Modugno e ospita tappe del Red Bull Cliff Diving. Il turismo è forte tutto l'anno, con molti visitatori stranieri.",
    settori: ["ristoranti e locali", "B&B e case vacanza", "negozi e attività turistiche"],
    faq: { q: "Fate contenuti per turisti stranieri?", a: "Sì: post, didascalie e testi del sito anche in inglese, e campagne mirate a chi sta pianificando un viaggio in Puglia." },
    description: "Agenzia di comunicazione a Polignano a Mare: social, foto, video e campagne per ristoranti, B&B, locali e attività turistiche. Preventivo gratuito.",
    intro: "Polignano a Mare è uno dei borghi sul mare più conosciuti della Puglia. Seguiamo social, foto, video, sponsorizzate e siti per ristoranti, B&B e locali, da Castellaneta.",
    focus: { titolo: "Farsi trovare tra tanti", testo: "A Polignano l'offerta è enorme e il panorama è uguale per tutti. Per un ristorante o un B&B conta la scheda Google, con foto e recensioni, i profili social curati e i contenuti in inglese. Lavoriamo su questi tre punti insieme, con campagne mirate ai turisti prima e durante la stagione." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per ristoranti, B&B e locali di Polignano a Mare: foto e reel curati, recensioni valorizzate e contenuti anche in inglese." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "Montescaglioso", provincia: "provincia di Matera (Basilicata)",
    contesto: "Montescaglioso domina la valle del Bradano ed è conosciuta per l'Abbazia benedettina di Sant'Angelo. Vicina a Matera, vive di agricoltura, prodotti tipici e di un turismo che cresce insieme a quello della città dei Sassi.",
    settori: ["strutture ricettive e agriturismi", "produttori e aziende agricole", "ristoranti e attività del paese"],
    faq: { q: "Lavorate anche in Basilicata?", a: "Sì: siamo a Castellaneta, a pochi chilometri dal confine, e seguiamo attività tra Matera, Montescaglioso e il Metapontino." },
    description: "Agenzia di comunicazione a Montescaglioso: social, foto, video e siti per attività, masserie e produttori tra Matera e il Metapontino. Preventivo gratuito.",
    intro: "Montescaglioso è a pochi chilometri da Matera e dalla nostra Ginosa. Seguiamo social, foto, video, sponsorizzate e siti per attività, produttori e strutture del paese, da Castellaneta.",
    focus: { titolo: "Sfruttare la vicinanza con Matera", testo: "Chi visita Matera cerca anche dove dormire, mangiare e cosa vedere nei dintorni. Per un'attività di Montescaglioso conta farsi trovare da quei visitatori: scheda Google completa, foto curate, social che raccontano il paese e l'abbazia, campagne mirate a chi sta organizzando un viaggio in Basilicata." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per strutture, produttori e ristoranti di Montescaglioso: il paese e i prodotti raccontati anche a chi visita Matera." },
  },
  {
    // brief SEO 12/10, lotto 2
    name: "Bernalda", provincia: "provincia di Matera (Basilicata)",
    contesto: "Bernalda, con il suo centro storico e Palazzo Margherita legato alla famiglia Coppola, comprende Metaponto, con le Tavole Palatine e le spiagge del Lido. Il territorio unisce turismo balneare, archeologia e una forte agricoltura, dalle fragole alla frutta della piana.",
    settori: ["lidi e strutture turistiche di Metaponto", "aziende agricole e produttori", "ristoranti e attività del paese"],
    faq: { q: "Seguite anche lidi e strutture di Metaponto?", a: "Sì: foto, video, social e sponsorizzate preparati prima dell'estate e seguiti durante la stagione." },
    description: "Agenzia di comunicazione a Bernalda e Metaponto: social, foto, video e campagne per lidi, strutture, ristoranti e aziende agricole. Preventivo gratuito.",
    intro: "Da Bernalda al Lido di Metaponto: seguiamo social, foto, video, sponsorizzate e siti per strutture turistiche, ristoranti e aziende agricole, a mezz'ora dalla nostra sede di Castellaneta.",
    focus: { titolo: "Due stagioni, due pubblici", testo: "D'estate il pubblico sono i turisti di Metaponto, il resto dell'anno sono i clienti del paese e le aziende agricole. Prepariamo contenuti e campagne per la stagione balneare con anticipo, e costruiamo per le aziende del territorio una comunicazione costante, con foto e video dei prodotti e della produzione." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per lidi, strutture e aziende di Bernalda e Metaponto: contenuti per la stagione estiva e una presenza costante tutto l'anno." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Pulsano", provincia: "provincia di Taranto",
    contesto: "Pulsano, a sud-est di Taranto, ha nel centro il Castello De Falconibus e sulla costa marine come Lido Silvana e Montedarena. D'estate la popolazione cresce con turisti e seconde case; il resto dell'anno contano i clienti del paese e di Taranto.",
    settori: ["lidi e attività delle marine", "ristoranti, pizzerie e bar", "negozi e servizi del paese"],
    faq: { q: "Seguite anche attività delle marine di Pulsano?", a: "Sì: lidi, ristoranti e strutture della costa, con contenuti e campagne preparati prima dell'estate." },
    description: "Agenzia di comunicazione a Pulsano: social, foto, sponsorizzate e scheda Google per lidi, ristoranti e attività del paese e delle marine. Preventivo gratuito.",
    intro: "Pulsano unisce il paese e le sue marine sulla costa ionica. Seguiamo social, foto, video, sponsorizzate e siti per lidi, ristoranti e attività, da Castellaneta.",
    focus: { titolo: "Il paese d'inverno, il mare d'estate", testo: "Un'attività di Pulsano parla a due pubblici diversi: chi vive qui tutto l'anno e chi arriva d'estate al mare. Prepariamo i contenuti e le campagne per la stagione con anticipo, e per il resto dell'anno teniamo viva la comunicazione con il paese e con i quartieri vicini di Taranto." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per lidi, ristoranti e negozi di Pulsano: contenuti per la stagione al mare e una presenza costante per il paese tutto l'anno." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Manduria", provincia: "provincia di Taranto",
    contesto: "Manduria dà il nome al Primitivo di Manduria DOC e conserva le mura messapiche e il Fonte Pliniano. Sulla costa ci sono marine come San Pietro in Bevagna. È un territorio di vino, agricoltura e turismo estivo.",
    settori: ["cantine e produttori di vino", "ristoranti e strutture ricettive", "attività delle marine"],
    faq: { q: "Lavorate con cantine?", a: "Sì: foto e video in vigna e in cantina, social, sito o e-commerce e campagne per visite e vendita." },
    description: "Agenzia di comunicazione a Manduria: social, foto, video, siti e campagne per cantine del Primitivo, ristoranti, strutture e attività. Preventivo gratuito.",
    intro: "Manduria è la terra del Primitivo. Seguiamo social, foto, video, sponsorizzate e siti per cantine, ristoranti, strutture ricettive e attività del paese e delle marine.",
    focus: { titolo: "Raccontare il vino a chi lo compra", testo: "Il Primitivo di Manduria è conosciuto anche all'estero. Per una cantina conta raccontare la propria storia, non solo la denominazione: le vigne, la vendemmia, le persone. Facciamo foto e video in vigna e in cantina, social curati, siti con vendita online o richiesta di visita, e campagne rivolte agli appassionati e ai turisti." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per cantine, ristoranti e strutture di Manduria: vigne, vendemmia e persone raccontate con foto e video veri." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Cisternino", provincia: "provincia di Brindisi",
    contesto: "Cisternino è tra i Borghi più belli d'Italia, con un centro storico bianco affacciato sulla Valle d'Itria. È conosciuto per le macellerie con fornello pronto, dove la carne scelta al banco viene cotta alla brace, e per un turismo che arriva da tutta Europa.",
    settori: ["bracerie e fornelli pronti", "ristoranti e locali", "B&B, masserie e case vacanza"],
    faq: { q: "Fate video per bracerie e ristoranti?", a: "Sì: reel sul posto, food photography e contenuti per social e scheda Google." },
    description: "Agenzia di comunicazione a Cisternino: social, foto, video e campagne per bracerie, ristoranti, B&B e negozi della Valle d'Itria. Preventivo gratuito.",
    intro: "Cisternino, borgo bianco della Valle d'Itria, è famoso per i suoi fornelli pronti. Seguiamo social, foto, video, sponsorizzate e siti per bracerie, ristoranti e strutture del paese.",
    focus: { titolo: "Far venire fame dallo schermo", testo: "Per una braceria o un ristorante di Cisternino le foto e i video del fuoco, della carne e della sala valgono più di qualsiasi testo. Giriamo reel sul posto, curiamo la scheda Google con foto vere e recensioni, e prepariamo contenuti anche in inglese per i turisti che organizzano la serata dalla Valle d'Itria." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per bracerie, ristoranti e strutture di Cisternino: brace e sala in reel, foto vere e contenuti anche in inglese." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Ceglie Messapica", provincia: "provincia di Brindisi",
    contesto: "Ceglie Messapica, con il suo Castello Ducale, è conosciuta per la tradizione gastronomica e per il biscotto cegliese, dolce di mandorle presidio Slow Food. Ristoranti e laboratori attirano visitatori dalla Valle d'Itria e dalla costa.",
    settori: ["ristoranti e trattorie", "forni, pasticcerie e laboratori", "negozi e attività del centro"],
    faq: { q: "Potete aiutare un laboratorio di dolci a vendere online?", a: "Sì: foto dei prodotti, social e un catalogo o e-commerce semplice, con ordini anche su WhatsApp." },
    description: "Agenzia di comunicazione a Ceglie Messapica: social, foto, video e campagne per ristoranti, forni, pasticcerie e attività del paese. Preventivo gratuito.",
    intro: "Ceglie Messapica è una delle capitali della buona cucina in Puglia. Seguiamo social, foto, video, sponsorizzate e siti per ristoranti, forni, pasticcerie e attività del paese.",
    focus: { titolo: "Una tradizione che si fotografa", testo: "Dietro un biscotto cegliese o un piatto della tradizione ci sono gesti e ricette tramandati. Raccontarli con foto e video curati fa la differenza tra un locale come tanti e uno che le persone vogliono provare. Lavoriamo sul posto, in cucina e in laboratorio, e portiamo i contenuti a chi cerca dove mangiare in zona." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per ristoranti, forni e pasticcerie di Ceglie Messapica: ricette e laboratorio raccontati con foto e reel." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Ostuni", provincia: "provincia di Brindisi",
    contesto: "Ostuni è conosciuta come la Città Bianca per il centro storico a calce, tra la Valle d'Itria e il mare. Tra uliveti secolari e masserie, il turismo arriva da tutto il mondo, e la costa ha marine e spiagge molto frequentate in estate.",
    settori: ["hotel, masserie e strutture di lusso", "ristoranti e locali", "negozi e artigianato"],
    faq: { q: "Lavorate anche in inglese?", a: "Sì: social, sito e campagne anche in inglese per il pubblico internazionale." },
    description: "Agenzia di comunicazione a Ostuni: social, foto, video e campagne per hotel, masserie, ristoranti e negozi della Città Bianca. Preventivo gratuito.",
    intro: "Ostuni, la Città Bianca, è una delle mete più internazionali della Puglia. Seguiamo social, foto, video, sponsorizzate e siti per hotel, masserie, ristoranti e negozi, da Castellaneta.",
    focus: { titolo: "Comunicare a un pubblico internazionale", testo: "A Ostuni molti clienti arrivano dall'estero e prenotano mesi prima. Servono foto all'altezza del posto, un sito con prenotazione diretta, una scheda Google curata e contenuti in inglese. Lavoriamo su tutto insieme, così una masseria o un ristorante si fanno scegliere senza dipendere solo dai portali." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per hotel, masserie e ristoranti di Ostuni: immagini curate, contenuti in italiano e in inglese e campagne mirate ai viaggiatori." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Putignano", provincia: "provincia di Bari",
    contesto: "Il Carnevale di Putignano, con i suoi carri allegorici, è tra i più antichi d'Europa. La città è anche conosciuta per le aziende dell'abbigliamento e degli abiti da sposa, con atelier e showroom che lavorano con clienti da tutta Italia.",
    settori: ["atelier, abbigliamento e abiti da sposa", "negozi e showroom", "ristorazione ed eventi"],
    faq: { q: "Lavorate con atelier e negozi di abbigliamento?", a: "Sì: shooting dei capi, reel, social e campagne per portare appuntamenti in showroom." },
    description: "Agenzia di comunicazione a Putignano: social, video, siti e campagne per negozi, atelier, aziende e attività del paese del Carnevale. Preventivo gratuito.",
    intro: "Putignano è la città del Carnevale più antico d'Europa e di un forte distretto della moda. Seguiamo social, video, sponsorizzate, siti e branding per negozi, atelier e aziende del paese.",
    focus: { titolo: "Far vedere il prodotto prima della visita", testo: "Per un atelier o un negozio di abbigliamento, chi arriva in showroom ha spesso già scelto guardando le foto online. Curiamo shooting dei capi, video brevi, profili social e campagne per portare appuntamenti, anche da fuori provincia. Per gli eventi come il Carnevale prepariamo contenuti e sponsorizzate con anticipo." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per atelier, negozi ed eventi di Putignano: shooting dei capi, reel e campagne per appuntamenti." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Castellana Grotte", provincia: "provincia di Bari",
    contesto: "Le Grotte di Castellana sono tra le grotte più visitate d'Italia e portano in paese turisti per gran parte dell'anno. Accanto al turismo, Castellana ha negozi, ristoranti e imprese che lavorano con i comuni vicini del sud-est barese.",
    settori: ["ristoranti e bar", "B&B e strutture ricettive", "negozi e attività turistiche"],
    faq: { q: "Le campagne possono raggiungere i turisti in zona?", a: "Sì: impostiamo sponsorizzate e scheda Google per chi si trova a Castellana e dintorni." },
    description: "Agenzia di comunicazione a Castellana Grotte: social, foto, video e campagne per ristoranti, B&B, negozi e attività turistiche. Preventivo gratuito.",
    intro: "Castellana Grotte accoglie ogni anno i visitatori delle sue grotte famose in tutta Italia. Seguiamo social, foto, video, sponsorizzate e siti per ristoranti, strutture e attività del paese.",
    focus: { titolo: "Intercettare chi è già in viaggio", testo: "Chi visita le grotte cerca subito dove mangiare, dormire o cosa vedere nei dintorni, spesso dal telefono. Conta essere lì in quel momento: scheda Google completa, foto vere, recensioni curate e campagne mirate a chi si trova in zona. Lo stesso lavoro, con contenuti costanti, porta clienti anche dai paesi vicini." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per ristoranti, B&B e negozi di Castellana Grotte: contenuti per i turisti delle grotte e per i clienti del territorio." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Conversano", provincia: "provincia di Bari",
    contesto: "Conversano conserva il Castello degli Acquaviva d'Aragona e il Monastero di San Benedetto. Le campagne intorno sono conosciute per le ciliegie e per le masserie e le ville che ospitano matrimoni ed eventi.",
    settori: ["ville, masserie e location per eventi", "ristoranti e attività del centro", "produttori agricoli"],
    faq: { q: "Lavorate con location per matrimoni ed eventi?", a: "Sì: foto e video degli spazi, social e campagne per sposi e aziende." },
    description: "Agenzia di comunicazione a Conversano: social, foto, video, siti e campagne per ristoranti, sale ricevimenti, produttori e negozi. Preventivo gratuito.",
    intro: "Conversano è una città d'arte del sud-est barese, tra castello, monastero e campagne di ciliegi. Seguiamo social, foto, video, sponsorizzate e siti per attività, location e produttori.",
    focus: { titolo: "Location ed eventi: le immagini fanno la prenotazione", testo: "Una villa o una masseria per eventi si sceglie prima sullo schermo. Raccontiamo gli spazi con foto e video curati, profili social che mostrano gli eventi e campagne rivolte a sposi e aziende, come facciamo a Mottola con una sala ricevimenti.", link: { testo: "a Mottola con una sala ricevimenti", href: "/cliente/villa-natia" } },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per location, ristoranti e produttori di Conversano: spazi ed eventi raccontati con foto e video curati." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Pisticci", provincia: "provincia di Matera (Basilicata)",
    contesto: "Pisticci è conosciuta per i calanchi che la circondano, per il Rione Dirupo con le sue case bianche e per l'Amaro Lucano, nato qui. Sulla costa ionica, Marina di Pisticci accoglie villaggi e strutture turistiche in estate.",
    settori: ["strutture turistiche e villaggi della marina", "aziende agricole e produttori", "attività del paese"],
    faq: { q: "Seguite anche strutture di Marina di Pisticci?", a: "Sì: foto, video, social e campagne preparati prima dell'estate e seguiti durante la stagione." },
    description: "Agenzia di comunicazione a Pisticci e Marina di Pisticci: social, foto, video e campagne per strutture, lidi, aziende e attività. Preventivo gratuito.",
    intro: "Da Pisticci a Marina di Pisticci: seguiamo social, foto, video, sponsorizzate e siti per strutture turistiche, aziende agricole e attività, da Castellaneta.",
    focus: { titolo: "Un paesaggio unico, da far vedere", testo: "I calanchi, il Rione Dirupo e il mare sono immagini che restano impresse. Per le attività di Pisticci li usiamo per costruire una comunicazione riconoscibile: foto e video sul posto, social che raccontano il territorio e campagne per i turisti della costa e per i clienti del paese." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per strutture, aziende e attività di Pisticci e della marina: territorio e prodotti raccontati con immagini vere." },
  },
  {
    // brief SEO 19/10, lotto 3
    name: "Policoro", provincia: "provincia di Matera (Basilicata)",
    contesto: "Policoro, sulla costa ionica della Basilicata, ospita il Museo della Siritide, che racconta l'antica Herakleia, e la riserva del Bosco Pantano. È un centro di commercio e servizi per tutto il Metapontino, con una forte agricoltura di frutta e ortaggi e un turismo balneare in crescita.",
    settori: ["lidi e strutture turistiche", "aziende agricole e ortofrutta", "negozi e servizi"],
    faq: { q: "Lavorate con aziende agricole?", a: "Sì: foto e video in campo e in magazzino, social, sito e campagne per la vendita." },
    description: "Agenzia di comunicazione a Policoro: social, foto, video, siti e campagne per lidi, strutture, aziende agricole e negozi. Preventivo gratuito.",
    intro: "Policoro è il centro più vivo della costa ionica lucana. Seguiamo social, foto, video, sponsorizzate e siti per lidi, strutture, aziende agricole e negozi, da Castellaneta.",
    focus: { titolo: "Il punto di riferimento della costa lucana", testo: "Policoro serve un'area ampia, dal mare all'entroterra. Per negozi e servizi conta farsi trovare da chi arriva dai paesi vicini; per lidi e strutture conta la stagione estiva; per le aziende agricole conta raccontare il prodotto. Costruiamo una comunicazione diversa per ognuno, con scheda Google, social, sito e campagne." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per lidi, aziende e negozi di Policoro: contenuti per la stagione al mare e per i clienti di tutto il Metapontino." },
  },
  {
    // brief SEO 26/10, lotto 4
    name: "Francavilla Fontana", provincia: "provincia di Brindisi",
    contesto: "Francavilla Fontana deve il suo nome di Città degli Imperiali alla famiglia che costruì il Castello Imperiali e ne segnò il centro barocco. È un centro commerciale e di servizi per molti comuni vicini, tra la provincia di Brindisi e quella di Taranto.",
    settori: ["negozi e commercio", "ristoranti e bar", "servizi e professionisti"],
    faq: { q: "Le sponsorizzate possono raggiungere anche i paesi vicini?", a: "Sì: scegliamo zona e raggio in base a dove abitano i tuoi clienti." },
    description: "Agenzia di comunicazione a Francavilla Fontana: social, foto, video, siti e campagne per negozi, ristoranti e attività della Città degli Imperiali. Preventivo gratuito.",
    intro: "Francavilla Fontana è la Città degli Imperiali, a metà strada tra Taranto e Brindisi. Seguiamo social, foto, video, sponsorizzate e siti per negozi, ristoranti e attività del paese, da Castellaneta.",
    focus: { titolo: "Farsi scegliere da chi arriva dai paesi vicini", testo: "Molti clienti di un'attività di Francavilla arrivano dai comuni intorno. Per loro contano la scheda Google, le recensioni e un profilo social che faccia capire subito cosa offri. Impostiamo sponsorizzate per raggio su Francavilla e dintorni e contenuti costanti che fanno ricordare il tuo nome quando serve." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per negozi, ristoranti e servizi di Francavilla Fontana: contenuti riconoscibili e sponsorizzate sulla zona." },
  },
  {
    // brief SEO 26/10, lotto 4
    name: "Lecce", provincia: "provincia di Lecce",
    contesto: "Lecce è conosciuta per il barocco in pietra leccese, la Basilica di Santa Croce e l'anfiteatro romano in piazza Sant'Oronzo. È una città universitaria e turistica, con ristoranti, strutture ricettive e negozi che lavorano con un pubblico locale e internazionale.",
    settori: ["ristoranti e locali del centro", "strutture ricettive e case vacanza", "negozi, studi e servizi"],
    faq: { q: "Seguite attività di Lecce anche se siete in provincia di Taranto?", a: "Sì: strategia, contenuti e campagne a distanza, con incontri e riprese sul posto quando servono." },
    description: "Agenzia di comunicazione a Lecce: strategia, social, video, siti e campagne per attività, ristoranti e strutture del Salento. Da Castellaneta, preventivo gratuito.",
    intro: "Lecce è la capitale del barocco e del Salento, con un mercato vivace e molta concorrenza. Portiamo strategia, social, video, siti e campagne alle attività leccesi, lavorando da Castellaneta e venendo di persona per riprese e incontri.",
    focus: { titolo: "In una città piena di offerta serve un'identità", testo: "A Lecce molte attività si somigliano: stesso centro storico, stessi turisti, stessi scatti. Per farsi scegliere bisogna avere un'identità precisa, che si riconosce su social, sito e scheda Google. Partiamo da lì, con branding e strategia, e costruiamo contenuti e campagne coerenti, per i leccesi e per chi visita il Salento." },
    lavoriVicini: true,
    servizi: { 'gestione-social': "Social per ristoranti, strutture e negozi di Lecce: identità chiara, contenuti curati e campagne per leccesi e turisti." },
  },
];

export const cityInfo = (name: string): CityInfo | undefined => CITY_INFO.find((c) => c.name === name);
