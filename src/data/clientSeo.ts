// Title delle schede /cliente/<id> nel formato "{Servizio} a {Paese}: {Cliente}"
// (brief SEO 10/10 "territorio e clienti", tabella del punto 1). `label` è
// l'etichetta sopra l'H1 e la frase aggiunta in fondo alla description.
// Le schede senza riga qui usano il title generico.
export const CLIENT_SEO: Record<string, { label: string; title: string }> = {
  'nunzio-putignano': { label: 'Gestione social a Palagiano', title: 'Gestione social a Palagiano: Nunzio Putignano Autofficina' },
  'studio-dentistico-ricciardi': { label: 'Sito web a Palagiano', title: 'Sito web a Palagiano: Studio Dentistico Ricciardi' },
  'diram-autoricambi': { label: 'Gestione social a Palagianello', title: 'Gestione social a Palagianello: DIRAM | InLab' },
  'sublime-tentazione': { label: 'Gestione social a Palagianello', title: 'Gestione social a Palagianello: Sublime Tentazione' },
  'masseria-sacramento': { label: 'Gestione social a Palagianello', title: 'Gestione social a Palagianello: Masseria Sacramento' },
  'vision-ottica': { label: 'Social media a Palagianello e Mottola', title: 'Social media a Palagianello e Mottola: Vision Ottica' },
  'arte-e-oro': { label: 'Social media a Palagianello', title: 'Social media a Palagianello: Arte e Oro Tamburrano' },
  'sottoscala': { label: 'Gestione social a Mottola', title: 'Gestione social a Mottola: Sottoscala | InLab' },
  'villa-natia': { label: 'Foto e video a Mottola', title: 'Foto e video a Mottola: Villa Natia | InLab' },
  'studio-ventimiglia-solution': { label: 'Video immobiliari a Castellaneta', title: 'Video immobiliari a Castellaneta: Studio Ventimiglia' },
  'ottica-occhiblu': { label: 'Video e social a Castellaneta', title: 'Video e social a Castellaneta: Ottica Occhi Blu' },
  'olio-vanessa': { label: 'Gestione social a Castellaneta', title: 'Gestione social a Castellaneta: Olio Vanessa | InLab' },
  'casa28': { label: 'Food photography a Castellaneta', title: 'Food photography a Castellaneta: Casa28 | InLab' },
  'match-point': { label: 'Foto e video a Castellaneta', title: 'Foto e video a Castellaneta: Match Point | InLab' },
  'il-paradiso': { label: 'Food photography a Castellaneta Marina', title: 'Food photography a Castellaneta Marina: Il Paradiso' },
  'la-vela': { label: 'Grafiche eventi a Castellaneta Marina', title: 'Grafiche eventi a Castellaneta Marina: La Vela' },
  'emmesse': { label: 'Video promozionali a Taranto', title: 'Video promozionali a Taranto: Emmesse | InLab' },
  'pizzeria-hermitage': { label: 'Video a Laterza', title: 'Video a Laterza: Pizzeria Hermitage | InLab' },
  'splashcar': { label: 'Social media a Laterza', title: 'Social media a Laterza: Splashcar | InLab' },
  'pasticceria-naturale': { label: 'Gestione social a Ferrara', title: 'Gestione social a Ferrara: Pasticceria Naturale' },
  'inox-racing-puglia': { label: 'Strategia social', title: 'Strategia social: Inox Racing Puglia | InLab' },
  'tacco': { label: 'E-commerce Shopify', title: 'E-commerce Shopify: Tacco, marchio di vini | InLab' },
};
// stessa scheda con l'indirizzo salvato in dashboard prima della correzione del nome
CLIENT_SEO['pizzeria-ermitage'] = CLIENT_SEO['pizzeria-hermitage'];

/** Description con la frase "— {servizio} a {paese}." in fondo, se non c'è già:
 *  se il totale supera `max` caratteri si accorcia il testo, mai la frase finale. */
export const withSeoSuffix = (description: string, label: string, max = 160) => {
  const phrase = label.charAt(0).toLowerCase() + label.slice(1);
  let d = String(description || '').trim().replace(/[.…]+$/, '');
  if (d.toLowerCase().includes(phrase.toLowerCase())) return `${d}.`;
  const tail = ` — ${phrase}.`;
  if (d.length + tail.length > max) d = d.slice(0, max - tail.length - 1).replace(/[\s,;:]+\S*$/, '') + '…';
  return d + tail;
};
