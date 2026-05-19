/**
 * InLab Communication - Central Content Configuration
 * Use this file to modify all texts, stats, services, and project data.
 */

export const WEBSITE_CONTENT = {
  brand: {
    name: "INLAB",
    shortName: "IL",
    location: "Taranto, Puglia",
    fullLocation: "Agenzia di comunicazione — Taranto, Puglia",
    copy: "© 2025 InLab Communication — Taranto, Puglia"
  },
  
  navigation: ["Studio", "Lavori", "Servizi", "Contatti"],

  hero: {
    tag: "Agenzia di comunicazione — Taranto, Puglia",
    headline: {
      line1: "FACCIAMO",
      line2: "SMETTERE",
      accent: "di scrollare."
    },
    description: "Uno studia il comportamento delle persone. L'altra le emoziona. Insieme costruiamo la comunicazione della tua azienda.",
    cta: {
      primary: "Vedi i nostri lavori",
      secondary: "Chi siamo"
    }
  },

  marquee: [
    "Gestione Social", "★", "Meta Ads", "★", "Siti Web", "★", 
    "Video & Shooting", "★", "Automazioni AI", "★", "Landing Page", "★"
  ],

  stats: [
    { num: "3.2M+", label: "Visualizzazioni generate" },
    { num: "47", label: "Clienti soddisfatti" },
    { num: "9", label: "Città servite in Puglia" },
    { num: "100%", label: "Progetti consegnati in tempo" },
  ],

  services: {
    tag: "Cosa facciamo",
    title: ["SERVIZI", "PRINCIPALI"],
    items: [
      { icon: "◈", title: "Gestione Social & Meta Ads", desc: "Strategia, contenuti e advertising su misura per far crescere la tua presenza online. Reel, stories, campagne che convertono." },
      { icon: "◻", title: "Siti Web & Web App", desc: "Design e sviluppo di siti veloci, belli e ottimizzati per il SEO. Dai siti vetrina alle web app su misura." },
      { icon: "⬡", title: "Automazioni con AI", desc: "Workflow automatizzati, chatbot, risposte automatiche e processi intelligenti per risparmiare tempo e scalare il business." },
      { icon: "◉", title: "Shooting Fotografico", desc: "Foto professionali per brand, prodotti, eventi e contenuti social. Estetica curata che racconta la tua identità." },
      { icon: "▷", title: "Video & Reels", desc: "Produzione video per social, campagne e brand. Abbiamo portato clienti a milioni di visualizzazioni organiche." },
      { icon: "◇", title: "Landing Page", desc: "Pagine di atterraggio ottimizzate per la conversione. Design persuasivo, copy strategico, A/B testing." },
    ]
  },

  portfolio: {
    tag: "Progetti selezionati",
    title: ["LAVORI", "SCELTI"],
    filters: ["tutti", "numeri", "estetica"],
    projects: [
      { title: "Reel Virale — Ristorante locale", tag: "video", type: "numeri", stat: "840K views", year: "24", size: "large", color: "#1a1a14" },
      { title: "Brand Identity — Studio Medico", tag: "brand", type: "estetica", stat: "Rebranding completo", year: "24", size: "small", color: "#141418" },
      { title: "E-commerce — Moda Pugliese", tag: "web", type: "numeri", stat: "+340% conversioni", year: "24", size: "small", color: "#131a13" },
      { title: "Campaign Social — Negozio Sport", tag: "social", type: "numeri", stat: "1.2M reach organico", year: "23", size: "large", color: "#1a1414" },
      { title: "Shooting — Agriturismo Taranto", tag: "foto", type: "estetica", stat: "Portfolio visivo", year: "23", size: "small", color: "#141518" },
      { title: "Landing Page — Studio Legale", tag: "web", type: "estetica", stat: "Conversion rate 12%", year: "23", size: "small", color: "#18141a" },
    ]
  },

  studio: {
    tag: "Il laboratorio",
    title: ["NON SIAMO", "Semplici", "CONSULENTI."],
    description1: "InLab nasce dall'incontro tra due prospettive complementari: la mente analitica di chi studia il comportamento delle persone, e la visione creativa di chi le sa emozionare.",
    description2: "Lavoriamo da Taranto con clienti in tutta la Puglia, collaborando con sviluppatori, fotografi e professionisti selezionati per ogni progetto.",
    items: [
      { role: "Psicologo del marketing", name: "Strategia & Analisi", icon: "◎", desc: "Studio del comportamento d'acquisto, posizionamento e strategia di comunicazione." },
      { role: "Content Creator", name: "Creatività & Visual", icon: "◈", desc: "Visual storytelling, produzione contenuti, direzione artistica e regia video." },
      { role: "Web Development", name: "Partner tecnici", icon: "◻", desc: "Rete di sviluppatori selezionati per ogni tipo di progetto digitale." },
      { role: "AI & Automazioni", name: "Tech & Innovation", icon: "⬡", desc: "Integrazione di strumenti AI per automatizzare e scalare i processi di comunicazione." },
    ]
  },

  cities: {
    tag: "Aree servite in Puglia",
    list: ["Taranto", "Palagiano", "Palagianello", "Massafra", "Mottola", "Castellaneta", "Laterza", "Ginosa"]
  },

  contact: {
    tag: "Iniziamo a lavorare insieme",
    title: ["HAI UN'IDEA?", "la rendiamo reale."],
    emails: [
      { label: "Scrivici", value: "ciao@inlab.it" }
    ],
    phones: [
      { label: "Chiamaci", value: "+39 099 000 0000" }
    ],
    socials: ["Instagram", "LinkedIn", "Behance"],
    cta: "Iniziamo insieme"
  }
};
