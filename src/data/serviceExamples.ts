// Esempi reali mostrati in fondo a ogni pagina servizio (e nelle pagine
// servizio × città). Per aggiungere un lavoro basta aggiungere una voce qui.
//
//   site   → anteprima del sito in una cornice browser + link al sito
//   client → card che apre la scheda cliente (/cliente/<id>, dati da constants.ts)
//   case   → card che apre il caso studio (/casi-studio/<id>)

export type ServiceExample =
  | { kind: 'site'; title: string; url: string; desc: string; tags?: string[]; caseStudy?: string }
  | { kind: 'client'; clientId: string }
  | { kind: 'case'; caseId: string; title: string; desc: string };

export const SERVICE_EXAMPLES: Record<string, ServiceExample[]> = {
  'siti-web': [
    {
      kind: 'site',
      title: 'Lumina — Studio Dentistico Ricciardi',
      url: 'https://luminaricciardi.it/',
      desc: 'Il nuovo sito dello studio del Dott. Francesco Ricciardi a Palagiano: brand Lumina, pagine dedicate a ogni trattamento e un percorso pensato per trasformare le visite in richieste di appuntamento.',
      tags: ['Sito web', 'Lead generation', 'Brand Lumina'],
      caseStudy: 'ricciardi',
    },
    // Web app in arrivo: Pala Padel (prenotazioni campi), gestionale per
    // attività, menu digitale per locali. Aggiungerle qui come kind: 'site'.
  ],
  'gestione-social': [
    { kind: 'client', clientId: 'studio-dentistico-ricciardi' },
    { kind: 'client', clientId: 'sublime-tentazione' },
    { kind: 'client', clientId: 'masseria-sacramento' },
    { kind: 'client', clientId: 'ottica-occhiblu' },
  ],
  'video': [
    { kind: 'client', clientId: 'nunzio-putignano' },
    { kind: 'client', clientId: 'diram-autoricambi' },
    { kind: 'client', clientId: 'studio-ventimiglia-solution' },
    { kind: 'client', clientId: 'emmesse' },
  ],
  'shooting': [
    { kind: 'client', clientId: 'villa-natia' },
    { kind: 'client', clientId: 'sottoscala' },
    { kind: 'client', clientId: 'aleph-caffe' },
  ],
  'meta-ads': [
    { kind: 'case', caseId: 'ricciardi', title: 'Studio Dentistico Ricciardi', desc: 'Campagne di lead generation collegate al nuovo sito per portare richieste di appuntamento qualificate.' },
    { kind: 'case', caseId: 'paresteta', title: 'Paresteta', desc: 'Campagna in 5 fasi con teaser, QR code e video lancio per portare persone all\'inaugurazione.' },
  ],
  'branding': [
    { kind: 'case', caseId: 'paresteta', title: 'Paresteta', desc: 'Dal cambio insegna al nuovo brand: un rebranding trasformato in evento locale.' },
    { kind: 'case', caseId: 'ricciardi', title: 'Lumina — Studio Ricciardi', desc: 'Il brand Lumina: un\'identità più calda e contemporanea per lo studio dentistico.' },
  ],
};
