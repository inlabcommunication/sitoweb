// Casi studio ("Non solo contenuti"). Ogni caso studio è una scheda (card
// nell'elenco) più una pagina composta da blocchi opzionali: la pagina mostra
// solo i blocchi inseriti, nell'ordine scelto dalla dashboard.
// File senza React: usato anche dalla SEO e dallo script di build.

/** `embed`: codice di incorporamento Instagram (o link del reel). `video`/`instagram` restano per i reel già salvati. */
export type Reel = { title?: string; embed?: string; showViews?: boolean; video?: string; instagram?: string; views?: string };

export type CaseBlock =
  | { type: 'text'; tag?: string; title?: string; titleAccent?: string; body?: string; boxTitle?: string; boxBody?: string }
  | { type: 'timeline'; tag?: string; title?: string; titleAccent?: string; items: { title: string; desc?: string }[] }
  | { type: 'checklist'; tag?: string; title?: string; titleAccent?: string; numbered?: boolean; items: string[] }
  | { type: 'steps'; tag?: string; title?: string; titleAccent?: string; body?: string; items: { title: string; desc?: string }[] }
  | { type: 'website'; tag?: string; title?: string; titleAccent?: string; body?: string; url: string; image?: string; pages?: { url: string; label: string; text?: string }[] }
  | { type: 'stats'; tag?: string; title?: string; titleAccent?: string; body?: string; items: { value: string; label: string }[]; note?: string }
  | { type: 'reels'; tag?: string; title?: string; titleAccent?: string; items: Reel[] }
  | { type: 'gallery'; tag?: string; title?: string; titleAccent?: string; images: string[] }
  | { type: 'quote'; text: string; author?: string };

export type CaseStudy = {
  id: string;
  /** card nell'elenco */
  number?: string;
  client: string;
  title: string;
  category?: string;
  problem?: string;
  result?: string;
  cover?: string;
  /** scheda cliente collegata (id) */
  clientId?: string;
  /** città in cui il cliente è presente: il caso compare nelle pagine locali */
  locations?: string[];
  /** pagina */
  hero?: { label?: string; title?: string; subtitle?: string; intro?: string; image?: string; ctaLabel?: string; ctaUrl?: string };
  blocks: CaseBlock[];
  /** SEO */
  seoTitle?: string;
  seoDescription?: string;
};

const LUMINA = 'https://luminaricciardi.it/';

export const DEFAULT_CASES: CaseStudy[] = [
  {
    id: 'paresteta',
    number: '01',
    client: 'Paresteta',
    title: 'Dal rebranding all\'inaugurazione',
    category: 'Eventi · Branding · Lead generation',
    locations: ['Ginosa'],
    problem: 'Trasformare un cambio insegna da H28 a Paresteta in un evento locale capace di generare attenzione e presenza fisica in negozio.',
    result: 'Campagna in 5 fasi tra teaser, QR code, video lancio e attività offline. Lead raccolti, partecipazione all\'inaugurazione, percezione del brand rafforzata.',
    seoTitle: 'Paresteta: dal rebranding all\'inaugurazione',
    seoDescription: 'Caso studio Paresteta: campagna in 5 fasi tra teaser, QR code, video lancio e attività offline per trasformare un cambio insegna in un evento locale.',
    hero: {
      label: 'Caso 01 — Eventi · Branding · Lead generation',
      title: 'Paresteta',
      subtitle: 'Dal rebranding all\'inaugurazione.',
      intro: 'Una strategia integrata online e offline per trasformare un cambio insegna in un evento locale.',
    },
    blocks: [
      {
        type: 'text', tag: 'Obiettivo', title: 'L\'insegna', titleAccent: 'diventa evento.',
        body: 'Accompagnare il passaggio da H28 a Paresteta, generando attenzione prima dell\'apertura e portando persone fisicamente in negozio nel giorno dell\'inaugurazione.',
        boxTitle: 'Strategia',
        boxBody: 'Una campagna divisa in più fasi: teaser iniziale, QR code per la raccolta lead, contenuti social progressivi, video di lancio, attività offline e comunicazione locale.',
      },
      {
        type: 'timeline', tag: 'Il racconto', title: 'Sei fasi,', titleAccent: 'una storia.',
        items: [
          { title: 'Prima — Il cambio insegna', desc: 'Il rebranding da H28 a Paresteta richiedeva di non disperdere il pubblico esistente, ma di trasformarlo in attesa per qualcosa di nuovo.' },
          { title: 'Curiosità — Teaser e offline', desc: 'Comunicazione divisa in fasi: teaser visivi sui social e attività di comunicazione locale per generare attenzione prima dell\'apertura.' },
          { title: 'Raccolta lead — QR code', desc: 'QR code dedicati per intercettare contatti e costruire una base di pubblico interessata fin dal lancio.' },
          { title: 'Lancio — Contenuti social e video', desc: 'Video lancio e contenuti progressivi per portare il pubblico digitale verso il momento fisico dell\'inaugurazione.' },
          { title: 'Evento — Inaugurazione', desc: 'Comunicazione integrata online e offline il giorno dell\'apertura: presenza in città e amplificazione digitale.' },
          { title: 'Risultato — Attenzione e brand', desc: 'Curiosità, partecipazione fisica e percezione del brand cresciuti in modo coordinato.' },
        ],
      },
      {
        type: 'checklist', tag: 'Cosa abbiamo realizzato', title: 'Ogni elemento', titleAccent: 'di un lancio.',
        items: ['Concept creativo del lancio', 'Comunicazione social', 'Contenuti teaser', 'Video di lancio', 'Strategia QR code', 'Raccolta contatti', 'Attività offline in città', 'Supporto comunicazione inaugurazione'],
      },
      {
        type: 'stats', tag: 'Risultato', title: 'Un cambio insegna', titleAccent: 'diventato esperienza.',
        body: 'Una campagna capace di trasformare un semplice cambio insegna in un vero evento locale, aumentando curiosità, partecipazione e percezione del brand.',
        items: [
          { value: '200+', label: 'Contatti raccolti' },
          { value: '100000+', label: 'Visualizzazioni' },
          { value: 'Crescita', label: 'Social del brand' },
          { value: 'Evento', label: 'Locale trasformato in esperienza' },
        ],
        note: 'Metriche indicative — da confermare prima della pubblicazione.',
      },
    ],
  },
  {
    id: 'ricciardi',
    number: '02',
    client: 'Studio Dentistico Ricciardi',
    title: 'Lumina: dalla fiducia online alle prenotazioni',
    category: 'Sito web · Lead generation · Social media',
    problem: 'Aumentare la percezione di affidabilità di uno studio dentistico e trasformarla in richieste concrete di appuntamento.',
    result: 'Nuovo sito luminaricciardi.it, campagne di lead generation e piano editoriale con contenuti educativi e recensioni. Più richieste e un brand più solido.',
    clientId: 'studio-dentistico-ricciardi',
    seoTitle: 'Studio Dentistico Ricciardi: sito web e lead generation',
    seoDescription: 'Caso studio Studio Dentistico Ricciardi: nuovo sito Lumina, campagne di lead generation e social per trasformare la fiducia online in prenotazioni.',
    hero: {
      label: 'Caso 02 — Sito web · Lead generation · Social',
      title: 'Studio Dentistico\nRicciardi',
      subtitle: 'Lumina: dalla fiducia online alle prenotazioni.',
      intro: 'Un progetto completo per lo studio del Dott. Francesco Ricciardi a Palagiano: il nuovo sito Lumina, campagne di lead generation e una comunicazione social chiara, professionale e rassicurante.',
      ctaLabel: 'Visita luminaricciardi.it',
      ctaUrl: LUMINA,
    },
    blocks: [
      {
        type: 'text', tag: 'Obiettivo', title: 'Affidabilità', titleAccent: 'percepita.',
        body: 'Aumentare la percezione di affidabilità dello studio e trasformarla in richieste concrete: un sito che presenta trattamenti e team in modo professionale, campagne che portano pazienti in target e contenuti che costruiscono fiducia prima ancora del primo appuntamento.',
      },
      {
        type: 'website', tag: 'Il sito web', title: 'luminaricciardi.it', titleAccent: 'Uno studio che si mostra.',
        body: 'Abbiamo progettato il nuovo sito dello studio attorno al brand Lumina: un\'identità più calda e contemporanea, pagine chiare per ogni trattamento, lo studio e il team raccontati con cura, e contatti sempre a portata di mano per prenotare una visita.',
        url: LUMINA,
        pages: [
          { url: LUMINA + 'servizi/', label: 'Servizi', text: 'Tutti i trattamenti in un unico punto: dalla prevenzione all\'estetica, spiegati in modo semplice per aiutare il paziente a orientarsi.' },
          { url: LUMINA + 'about/', label: 'Lo Studio', text: 'Lo studio, il team e l\'approccio Lumina: più di una visita, un\'esperienza di cura che costruisce fiducia prima del primo appuntamento.' },
          { url: LUMINA + 'implantologia-computer-guidata/', label: 'Implantologia computer guidata', text: 'Pagine verticali sui trattamenti ad alto valore, pensate come landing: spiegano il percorso e portano alla richiesta di una visita.' },
        ],
      },
      {
        type: 'steps', tag: 'Lead generation', title: 'Dal feed', titleAccent: 'alla poltrona.',
        body: 'Sito, social e campagne lavorano insieme come un unico percorso: ogni contenuto ha il compito di portare la persona un passo più vicina alla richiesta di appuntamento.',
        items: [
          { title: 'Attenzione', desc: 'Contenuti social educativi, recensioni e campagne mirate intercettano chi cerca un dentista in zona.' },
          { title: 'Approfondimento', desc: 'Il traffico arriva sul sito e sulle pagine dei trattamenti, dove trova risposte chiare e rassicuranti.' },
          { title: 'Contatto', desc: 'Inviti all\'azione chiari trasformano l\'interesse in una richiesta di appuntamento.' },
          { title: 'Fiducia', desc: 'Recensioni e contenuti costanti mantengono viva la relazione e rafforzano la reputazione dello studio.' },
        ],
      },
      {
        type: 'checklist', tag: 'Cosa abbiamo realizzato', title: 'Un progetto', titleAccent: 'a 360 gradi.', numbered: true,
        items: ['Sito web luminaricciardi.it', 'Pagine dedicate ai trattamenti', 'Campagne di lead generation', 'Piano editoriale', 'Contenuti social e caroselli informativi', 'Gestione recensioni', 'Copywriting', 'Brand Lumina'],
      },
      {
        type: 'stats', tag: 'Risultato', title: 'Uno studio', titleAccent: 'che ispira fiducia.',
        body: 'Un sito che presenta lo studio al meglio, un flusso costante di richieste di appuntamento e una percezione del brand più solida nel territorio.',
        items: [
          { value: '30000+', label: 'Persone raggiunte' },
          { value: '★ 4.9', label: 'Reputazione online' },
          { value: '↑', label: 'Engagement contenuti' },
          { value: 'Più', label: 'Richieste appuntamento' },
        ],
        note: 'Metriche indicative — da confermare prima della pubblicazione.',
      },
    ],
  },
];

/** Etichette e campi dei blocchi (usati dalla dashboard). */
export const BLOCK_LABELS: Record<CaseBlock['type'], string> = {
  text: 'Testo (obiettivo, sfida, strategia…)',
  timeline: 'Fasi / racconto',
  checklist: 'Cosa abbiamo realizzato',
  steps: 'Percorso a step (es. funnel)',
  website: 'Sito web (anteprime)',
  stats: 'Numeri e risultati',
  reels: 'Reel',
  gallery: 'Galleria foto',
  quote: 'Citazione / recensione',
};

export const emptyBlock = (type: CaseBlock['type']): CaseBlock => {
  switch (type) {
    case 'text': return { type, tag: 'Obiettivo', title: '', titleAccent: '', body: '' };
    case 'timeline': return { type, tag: 'Il racconto', title: '', titleAccent: '', items: [{ title: '', desc: '' }] };
    case 'checklist': return { type, tag: 'Cosa abbiamo realizzato', title: '', titleAccent: '', items: [''] };
    case 'steps': return { type, tag: 'Il percorso', title: '', titleAccent: '', body: '', items: [{ title: '', desc: '' }] };
    case 'website': return { type, tag: 'Il sito web', title: '', titleAccent: '', body: '', url: 'https://', pages: [] };
    case 'stats': return { type, tag: 'Risultati', title: '', titleAccent: '', body: '', items: [{ value: '', label: '' }] };
    case 'reels': return { type, tag: 'I reel', title: 'Contenuti', titleAccent: 'che girano.', items: [{ title: '', embed: '', showViews: false, views: '' }] };
    case 'gallery': return { type, tag: 'Foto', title: '', titleAccent: '', images: [] };
    case 'quote': return { type, text: '', author: '' };
  }
};
