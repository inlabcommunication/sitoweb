// "Altri clienti": brand che seguiamo per un servizio specifico (social, foto,
// video, sito…), senza pagina dedicata: ognuno ha una piccola scheda nella
// griglia di /clienti (richiesta di Nicola tramite il Direttore, 05/10). Richiesta di Nicola (05/10):
// si mostrano insieme, senza dire chi li segue, con un titolo che fa capire
// che sono collaborazioni mirate. Si modificano dalla dashboard (Clienti →
// Altri clienti); questi sono i valori iniziali.
export type OtherClient = {
  name: string;
  /** settore, es. "Ottica", "Lido" (facoltativo) */
  sector?: string;
  /** città, es. "Castellaneta Marina" (facoltativo) */
  location?: string;
  /** una riga di descrizione, senza numeri né prezzi (facoltativa) */
  line?: string;
  /** servizi seguiti, separati da virgola (facoltativo) */
  services?: string;
  /** immagine della scheda su Cloudinary: logo o foto di un lavoro già pubblico (facoltativa) */
  logo?: string;
  /** l'immagine è una foto (riempie la scheda) e non un logo (centrato su fondo chiaro) */
  photo?: boolean;
};

export const OTHER_CLIENTS_DEFAULT: { label: string; title: string; accent: string; text: string; items: OtherClient[] } = {
  label: 'Altri clienti',
  title: 'Collaborazioni',
  accent: 'su misura.',
  text: 'Brand che seguiamo su un aspetto preciso della loro comunicazione: i social, le foto, un video, il sito. Lavori mirati, con la stessa cura.',
  items: [
    { name: 'Vision Ottica', sector: 'Ottica' },
    { name: 'Inox Racing Puglia' },
    { name: 'Acchiappasogni' },
    { name: 'Feliciano Fangio', sector: 'Parrucchiere' },
    { name: 'Arte e Oro', sector: 'Orafo · Stefano Pastore' },
    { name: 'Pasticceria Naturale', sector: 'Pasticceria', location: 'Ferrara' },
    { name: 'IMH', location: 'Ferrara' },
    { name: 'Il Paradiso', sector: 'Lido', location: 'Castellaneta Marina' },
    { name: 'Casa28', sector: 'Ristorante', location: 'Castellaneta' },
    { name: 'Tacco', sector: 'Vini' },
    { name: 'La Vela', sector: 'Lido', location: 'Castellaneta Marina' },
    { name: 'Match Point' },
    { name: 'Pizzeria Ermitage', sector: 'Pizzeria', location: 'Laterza' },
    { name: 'Olio Vanessa', sector: 'Olio' },
    { name: 'Splashcar' },
  ],
};
