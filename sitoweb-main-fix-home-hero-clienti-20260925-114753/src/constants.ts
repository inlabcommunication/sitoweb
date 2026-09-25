/**
 * InLab Communication - Central Content Configuration
 * Tutti i testi e contenuti del sito sono modificabili dalla dashboard.
 */

export const WEBSITE_CONTENT = {
  brand: {
    name: "INLAB",
    shortName: "IL",
    location: "Taranto, Puglia",
    fullLocation: "Laboratorio creativo — Taranto, Puglia",
    copy: "© 2025 InLab Communication — Taranto, Puglia"
  },

  hero: {
    tag: "Laboratorio creativo — Taranto, Puglia",
    headline: {
      line1: "COMUNICAZIONE",
      line2: "CHE SI FA",
      accent: "riconoscere."
    },
    description: "Un laboratorio creativo che unisce strategia, contenuti foto/video, social media, branding e campagne digitali per aiutarti a comunicare meglio online.",
    cta: {
      primary: "Raccontaci il tuo progetto",
      secondary: "Guarda i nostri lavori"
    }
  },

  manifesto: {
    tag: "Il nostro manifesto",
    title: {
      line1: "NON CREIAMO CONTENUTI",
      line2: "PER RIEMPIRE",
      line3: "UN CALENDARIO.",
      accent: "Costruiamo direzioni."
    },
    text: "Ogni post, video, foto o campagna deve avere un motivo per esistere: raccontare il valore del brand, parlare alle persone giuste, creare fiducia e rendere la comunicazione più riconoscibile. Non vendiamo pacchetti. Costruiamo identità."
  },

  marquee: {
    items: [
      "Gestione Social", "✦", "Meta Ads", "✦", "Foto & Video", "✦",
      "Branding", "✦", "Siti Web", "✦", "Landing Page", "✦", "Organizzazione Eventi", "✦"
    ]
  },

  stats: [
    { num: "3.2M+", label: "Visualizzazioni generate" },
    { num: "47", label: "Clienti soddisfatti" },
    { num: "9", label: "Città servite in Puglia" },
    { num: "100%", label: "Progetti consegnati in tempo" },
  ],

  metodo: {
    tag: "Come lavoriamo",
    title: ["IL NOSTRO", "METODO"],
    subtitle: "Non lavoriamo a caso. Ogni progetto segue un percorso preciso, costruito per produrre risultati misurabili e comunicazione riconoscibile.",
    steps: [
      { n: "01", title: "Analisi", desc: "Partiamo dal brand, dal pubblico, dal mercato e dagli obiettivi. Prima di creare qualsiasi contenuto, capiamo chi sei, a chi parli e cosa vuoi ottenere." },
      { n: "02", title: "Direzione creativa", desc: "Definiamo tono di voce, stile visivo, contenuti e messaggi chiave. Ogni progetto ha un'identità precisa, non un template." },
      { n: "03", title: "Produzione", desc: "Realizziamo foto, video, grafiche, copy e materiali digitali con cura artigianale. Ogni contenuto deve avere un motivo per esistere." },
      { n: "04", title: "Pubblicazione & campagne", desc: "Gestiamo i canali social, pubblichiamo con strategia e attiviamo campagne quando servono per amplificare i risultati." },
      { n: "05", title: "Ottimizzazione", desc: "Leggiamo i dati, capiamo cosa funziona e miglioriamo la strategia ogni mese. La comunicazione è un processo, non un prodotto." },
    ]
  },

  clients: {
    tag: "Alcuni dei nostri clienti",
    items: [
      {
        id: "ristorante-da-mario",
        name: "Ristorante Da Mario",
        sector: "Ristorazione",
        location: "Taranto",
        summary: "Contenuti video e strategia social per aumentare riconoscibilità e prenotazioni.",
        description: "Per il ristorante abbiamo costruito un racconto più immediato e appetibile, partendo da riprese verticali, rubriche social e una direzione editoriale pensata per far emergere piatti, atmosfera e persone.",
        services: ["Video & Reels", "Gestione Social", "Direzione creativa"],
        results: ["840K visualizzazioni organiche in 72 ore", "Format video replicabile per campagne stagionali"],
        url: "",
        logo: "",
        image: "",
        website: "",
        instagram: "",
        gallery: []
      },
      {
        id: "studio-medico-rossi",
        name: "Studio Medico Rossi",
        sector: "Sanità e professionisti",
        location: "Taranto",
        summary: "Rebranding e comunicazione più chiara per uno studio medico locale.",
        description: "Il progetto ha lavorato su identità visiva, tono di voce e materiali digitali per rendere lo studio più riconoscibile, affidabile e semplice da comprendere per i pazienti.",
        services: ["Branding & Identità", "Copywriting", "Visual system"],
        results: ["Identità coerente su tutti i touchpoint", "Materiali pronti per sito, social e comunicazioni"],
        url: "",
        logo: "",
        image: "",
        website: "",
        instagram: "",
        gallery: []
      },
      {
        id: "parrucchiere-chic",
        name: "Parrucchiere Chic",
        sector: "Beauty",
        location: "Puglia",
        summary: "Social content e shooting per valorizzare lavori, team e appuntamenti.",
        description: "Abbiamo impostato una comunicazione visiva più curata, con contenuti pensati per mostrare risultati reali, atmosfera del salone e servizi ad alto margine.",
        services: ["Foto & Shooting", "Gestione Social", "Reels"],
        results: ["Feed più coerente e riconoscibile", "Contenuti riutilizzabili per campagne e stories"],
        url: "",
        logo: "",
        image: "",
        website: "",
        instagram: "",
        gallery: []
      },
      {
        id: "moda-pugliese",
        name: "Moda Pugliese",
        sector: "Fashion retail",
        location: "Puglia",
        summary: "E-commerce e ottimizzazione conversioni per un brand moda locale.",
        description: "Il lavoro ha unito UX, contenuti prodotto e ottimizzazione del percorso d'acquisto, con una struttura pensata per rendere più semplice scoprire collezioni e acquistare online.",
        services: ["Siti Web & Web App", "SEO", "E-commerce"],
        results: ["+340% conversioni rispetto al sito precedente", "Catalogo più chiaro e navigazione più veloce"],
        url: "",
        logo: "",
        image: "",
        website: "",
        instagram: "",
        gallery: []
      },
      {
        id: "bar-centrale",
        name: "Bar Centrale",
        sector: "Food & beverage",
        location: "Taranto",
        summary: "Contenuti social per raccontare quotidianità, prodotti e momenti chiave.",
        description: "Abbiamo costruito una presenza più viva e locale, alternando contenuti spontanei, mini shooting e campagne leggere per promuovere colazioni, aperitivi ed eventi.",
        services: ["Gestione Social", "Foto & Shooting", "Campagne locali"],
        results: ["Comunicazione più costante", "Maggiore riconoscibilità nel territorio"],
        url: "",
        logo: "",
        image: "",
        website: "",
        instagram: "",
        gallery: []
      },
      {
        id: "officina-auto",
        name: "Officina Auto",
        sector: "Servizi automotive",
        location: "Provincia di Taranto",
        summary: "Comunicazione più professionale per servizi tecnici e manutenzione.",
        description: "Il progetto ha trasformato servizi complessi in messaggi semplici, con contenuti informativi, visual puliti e una presenza digitale più adatta a generare fiducia.",
        services: ["Strategia contenuti", "Gestione Social", "Landing Page"],
        results: ["Servizi spiegati in modo più chiaro", "Più richieste tracciabili dai canali digitali"],
        url: "",
        logo: "",
        image: "",
        website: "",
        instagram: "",
        gallery: []
      },
      {
        id: "agriturismo-sole",
        name: "Agriturismo Sole",
        sector: "Hospitality",
        location: "Puglia",
        summary: "Shooting e portfolio visivo per raccontare accoglienza, spazi e territorio.",
        description: "Abbiamo creato un archivio fotografico completo per sito, social e campagne, valorizzando esperienza, dettagli, cucina e contesto naturale.",
        services: ["Foto & Shooting", "Brand storytelling", "Social content"],
        results: ["80+ scatti professionali utilizzabili", "Immagine coordinata per sito e social"],
        url: "",
        logo: "",
        image: "",
        website: "",
        instagram: "",
        gallery: []
      },
      {
        id: "hotel-marina",
        name: "Hotel Marina",
        sector: "Hotel e turismo",
        location: "Puglia",
        summary: "Comunicazione digitale per camere, servizi e stagionalità turistica.",
        description: "Il lavoro ha messo ordine nel racconto dell'offerta, creando contenuti e messaggi per promuovere soggiorni, servizi interni e periodi chiave della stagione.",
        services: ["Strategia digitale", "Foto & Video", "Landing Page"],
        results: ["Comunicazione più orientata alla prenotazione", "Materiali riutilizzabili per campagne stagionali"],
        url: "",
        logo: "",
        image: "",
        website: "",
        instagram: "",
        gallery: []
      },
    ]
  },

  services: {
    tag: "Cosa facciamo",
    title: ["SERVIZI", "PRINCIPALI"],
    items: [
      { icon: "◈", title: "Gestione Social", desc: "Costruiamo una presenza riconoscibile su Instagram, Facebook, TikTok e LinkedIn. Non riempiamo calendari — costruiamo direzioni." },
      { icon: "◎", title: "Meta Ads", desc: "Campagne progettate per convertire. Budget ottimizzato, audience costruita sui tuoi clienti migliori, risultati misurabili." },
      { icon: "◻", title: "Siti Web & Web App", desc: "Design e sviluppo di siti che non sono solo belli: sono veloci, ottimizzati e costruiti per portare clienti." },
      { icon: "⬡", title: "Automazioni AI", desc: "Chatbot, workflow e processi automatizzati che fanno lavorare il tuo brand anche quando sei offline." },
      { icon: "◉", title: "Foto & Shooting", desc: "Foto professionali per brand, prodotti ed eventi. Perché un'immagine mediocre costa clienti. Una straordinaria li conquista." },
      { icon: "▷", title: "Video & Reels", desc: "Produciamo contenuti video che le persone vogliono davvero guardare. Abbiamo portato clienti a milioni di visualizzazioni organiche." },
      { icon: "◇", title: "Landing Page", desc: "Pagine progettate con un solo obiettivo: trasformare i visitatori in lead. Copy, design e A/B test inclusi." },
      { icon: "★", title: "Branding & Identità", desc: "Nome, logo, palette, tono di voce. Diamo forma al modo in cui il tuo brand viene percepito dal primo sguardo." },
    ]
  },

  portfolio: {
    tag: "Progetti selezionati",
    subtitle: "Foto, video, campagne e identità visive che raccontano il nostro modo di lavorare.",
    categories: ["tutti", "social", "video", "foto", "web", "brand", "ads", "eventi"],
    projects: [
      { id:"1", title:"Reel Virale — Ristorante locale", client:"Ristorante Da Mario", clientLogo:"", category:"video", tags:["Video & Reels","Social"], stat:"840K views", year:"2024", large:true, image:"", videoUrl:"", gallery:[], description:"Contenuto organico prodotto in una sola giornata di riprese. Strategia di pubblicazione studiata per massimizzare la portata organica.", result:"840.000 visualizzazioni organiche in 72 ore.", whoWorked:["Social","Video"], link:"", instagram:"", facebook:"", tiktok:"", website:"", nextProject:"2" },
      { id:"2", title:"E-commerce — Moda Pugliese", client:"Moda Pugliese", clientLogo:"", category:"web", tags:["Siti Web","SEO"], stat:"+340% conversioni", year:"2024", large:false, image:"", videoUrl:"", gallery:[], description:"Design e sviluppo completo con ottimizzazione SEO e integrazione e-commerce.", result:"+340% conversioni rispetto al sito precedente.", whoWorked:["Web","SEO"], link:"", instagram:"", facebook:"", tiktok:"", website:"", nextProject:"3" },
      { id:"3", title:"Meta Ads — Negozio Sport", client:"Negozio Sport Taranto", clientLogo:"", category:"ads", tags:["Meta Ads","Advertising"], stat:"3.2× ROAS", year:"2024", large:false, image:"", videoUrl:"", gallery:[], description:"Campagna Meta con targeting localizzato su Taranto e provincia.", result:"3.2× ROAS medio su campagne awareness e conversione.", whoWorked:["Advertising","Strategia"], link:"", instagram:"", facebook:"", tiktok:"", website:"", nextProject:"4" },
      { id:"4", title:"Brand Identity — Studio Medico", client:"Studio Medico Rossi", clientLogo:"", category:"brand", tags:["Branding","Design"], stat:"Rebranding completo", year:"2024", large:true, image:"", videoUrl:"", gallery:[], description:"Logo, palette, tono di voce e tutti i materiali di comunicazione.", result:"Identità visiva coerente su tutti i touchpoint.", whoWorked:["Branding","Design"], link:"", instagram:"", facebook:"", tiktok:"", website:"", nextProject:"5" },
      { id:"5", title:"Shooting — Agriturismo Sole", client:"Agriturismo Sole", clientLogo:"", category:"foto", tags:["Shooting","Brand"], stat:"Portfolio visivo", year:"2023", large:false, image:"", videoUrl:"", gallery:[], description:"Shooting fotografico completo per valorizzare l'identità dell'agriturismo.", result:"Portfolio professionale di 80+ scatti utilizzati su sito e social.", whoWorked:["Foto","Brand"], link:"", instagram:"", facebook:"", tiktok:"", website:"", nextProject:"6" },
      { id:"6", title:"Evento — Presentazione Brand", client:"Cliente riservato", clientLogo:"", category:"eventi", tags:["Organizzazione eventi","Brand"], stat:"200+ partecipanti", year:"2024", large:false, image:"", videoUrl:"", gallery:[], description:"Organizzazione e comunicazione completa per evento offline di presentazione brand.", result:"200+ partecipanti, copertura media locale, contenuti social prodotti in loco.", whoWorked:["Organizzazione","Social","Video"], link:"", instagram:"", facebook:"", tiktok:"", website:"", nextProject:"1" },
    ]
  },

  studio: {
    tag: "Il laboratorio",
    title: ["NON SIAMO", "Semplici", "CONSULENTI."],
    description1: "InLab nasce dall'incontro tra due prospettive complementari: la mente analitica di chi studia il comportamento delle persone, e la visione creativa di chi le sa emozionare.",
    description2: "Lavoriamo da Taranto con clienti in tutta la Puglia, collaborando con sviluppatori, fotografi e professionisti selezionati per ogni progetto.",
    team: [
      {
        name: "Strategia & Analisi",
        role: "Psicologo del marketing",
        bio: "Studio il comportamento d'acquisto delle persone da oltre 5 anni. Prima di creare qualsiasi contenuto, analizzo chi è il tuo cliente, perché compra, cosa lo frena. La strategia non è un'opinione — è una conclusione basata su dati.",
        photo: "",
        skills: ["Analisi comportamentale", "Posizionamento brand", "Strategia di comunicazione", "Ricerca di mercato"]
      },
      {
        name: "Creatività & Visual",
        role: "Content Creator & Direttrice Artistica",
        bio: "Trasformo strategie in contenuti che le persone vogliono davvero guardare. Dalla regia di un reel alla direzione fotografica di uno shooting, mi occupo di tutto ciò che appare.",
        photo: "",
        skills: ["Produzione video & reels", "Direzione artistica", "Fotografia di brand", "Script & storytelling"]
      }
    ]
  },

  cta: {
    home: {
      title: "HAI UN BRAND,",
      title2: "MA NON SAI COME",
      title3: "RACCONTARLO ONLINE?",
      subtitle: "Partiamo da una consulenza: capiamo dove sei, cosa vuoi comunicare e quale direzione può renderti più riconoscibile.",
      btn1: "Parliamone",
      btn2: "Vedi i lavori"
    }
  },

  cities: {
    tag: "Aree servite in Puglia",
    list: ["Taranto", "Palagiano", "Palagianello", "Massafra", "Mottola", "Castellaneta", "Laterza", "Ginosa"]
  },

  contact: {
    tag: "Parliamo del tuo progetto",
    title: ["INIZIAMO", "INSIEME"],
    accent: "senza impegno.",
    subtitle: "Una chiamata di 30 minuti è sufficiente per capire cosa ti serve e come possiamo aiutarti. Senza slide inutili, senza promesse vuote.",
    emails: [{ label: "Email", value: "inlab.communication@gmail.com" }],
    phones: [{ label: "Telefono", value: "+39 329 565 4319" }],
    location: "Taranto, Puglia",
    socials: ["Instagram", "LinkedIn", "Behance"]
  }
};
