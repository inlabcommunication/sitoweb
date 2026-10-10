// Città della mappa di /dove-lavoriamo (brief SEO 03/10). Unica fonte: per
// aggiungere una città basta una riga qui, la pagina non va toccata.
// La posizione sul disegno si calcola da latitudine e longitudine.
// La pagina città (link) si ricava da AGENCY_CITIES in src/seo/routes.ts.
export type MapCity = {
  name: string;
  region: 'Puglia' | 'Basilicata' | 'Emilia-Romagna' | 'Lazio';
  lat: number;
  lon: number;
  /** Dove scrivere il nome nell'ingrandimento (default: a destra) */
  label?: 'n' | 's' | 'e' | 'w';
};

export const MAP_CITIES: MapCity[] = [
  { name: 'Castellaneta', label: 'n', region: 'Puglia', lat: 40.628, lon: 16.938 },
  { name: 'Taranto', region: 'Puglia', lat: 40.464, lon: 17.247 },
  { name: 'Palagianello', label: 's', region: 'Puglia', lat: 40.609, lon: 16.977 },
  { name: 'Palagiano', label: 's', region: 'Puglia', lat: 40.578, lon: 17.040 },
  { name: 'Mottola', region: 'Puglia', lat: 40.634, lon: 17.037 },
  { name: 'Massafra', region: 'Puglia', lat: 40.587, lon: 17.113 },
  { name: 'Laterza', label: 'n', region: 'Puglia', lat: 40.630, lon: 16.799 },
  { name: 'Ginosa', label: 's', region: 'Puglia', lat: 40.578, lon: 16.757 },
  { name: 'Gravina in Puglia', label: 'n', region: 'Puglia', lat: 40.818, lon: 16.420 },
  { name: 'Gioia del Colle', label: 'n', region: 'Puglia', lat: 40.799, lon: 16.923 },
  { name: 'Bari', label: 'n', region: 'Puglia', lat: 41.117, lon: 16.872 },
  { name: 'Matera', label: 'w', region: 'Basilicata', lat: 40.666, lon: 16.604 },
  { name: 'Castellaneta Marina', label: 's', region: 'Puglia', lat: 40.533, lon: 16.939 },
  { name: 'Crispiano', region: 'Puglia', lat: 40.603, lon: 17.231 },
  { name: 'Statte', label: 's', region: 'Puglia', lat: 40.565, lon: 17.206 },
  { name: 'Noci', region: 'Puglia', lat: 40.792, lon: 17.126 },
  { name: 'Martina Franca', label: 'e', region: 'Puglia', lat: 40.705, lon: 17.336 },
  { name: 'Ferrara', region: 'Emilia-Romagna', lat: 44.836, lon: 11.619 },
  { name: 'Bologna', region: 'Emilia-Romagna', lat: 44.494, lon: 11.343 },
  { name: 'Roma', region: 'Lazio', lat: 41.903, lon: 12.496 },
];

/** Sede: sempre evidenziata sulla mappa */
export const MAP_HOME = 'Castellaneta';
