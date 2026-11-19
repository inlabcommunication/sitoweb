import type { Menu, NewsItem, Parola, PodcastEpisode } from './types';

const giorno = 86_400_000;
const ora = Date.now();

export const menuIniziale: Menu = {
  categorie: [
    {
      id: 'signature',
      nome: 'Signature',
      nota: 'Le creazioni della casa',
      voci: [
        { id: 's1', nome: 'Parola d’Ordine', descrizione: 'Bourbon, vermouth rosso, amaro alle erbe, bitter al cacao', prezzo: '12', tag: 'Forte' },
        { id: 's2', nome: 'Porta Chiusa', descrizione: 'Gin, liquore ai fiori di sambuco, limone, albume, lavanda', prezzo: '11' },
        { id: 's3', nome: 'Luna di Contrabbando', descrizione: 'Rum scuro, caffè, vaniglia bourbon, scorza d’arancia', prezzo: '12' },
      ],
    },
    {
      id: 'classici',
      nome: 'Classici',
      voci: [
        { id: 'c1', nome: 'Negroni', descrizione: 'Gin, bitter, vermouth rosso', prezzo: '10' },
        { id: 'c2', nome: 'Old Fashioned', descrizione: 'Rye whiskey, zucchero, Angostura', prezzo: '11' },
        { id: 'c3', nome: 'Martinez', descrizione: 'Old Tom gin, vermouth, maraschino', prezzo: '11' },
      ],
    },
    {
      id: 'analcolici',
      nome: 'Senza alcol',
      voci: [{ id: 'a1', nome: 'Proibito', descrizione: 'Tè nero affumicato, miele, limone, soda allo zenzero', prezzo: '8', tag: 'Analcolico' }],
    },
  ],
  aggiornato: ora,
};

export const newsIniziali: NewsItem[] = [
  {
    id: 'n1',
    titolo: 'Giovedì jazz dal vivo',
    sommario: 'Ogni giovedì dalle 22 un trio jazz suona tra i tavoli.',
    testo: 'Da questa settimana il giovedì sera diventa la serata del jazz. Un trio dal vivo, luci basse e una drink list dedicata.\n\nPosti limitati: arriva presto e ricordati la parola d’ordine.',
    categoria: 'Eventi',
    data: ora - giorno,
    pubblicata: true,
  },
  {
    id: 'n2',
    titolo: 'Nuova drink list d’autunno',
    sommario: 'Cinque nuovi cocktail con ingredienti di stagione.',
    testo: 'Castagne, fichi, spezie e agrumi invernali: la nuova lista è arrivata. Chiedi al bartender il percorso degustazione.',
    categoria: 'Novità',
    data: ora - 6 * giorno,
    pubblicata: true,
  },
];

export const podcastIniziali: PodcastEpisode[] = [
  {
    id: 'p1',
    titolo: 'Episodio di esempio',
    descrizione: 'Sostituisci questo episodio dal pannello di gestione incollando il link YouTube del podcast.',
    youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    data: ora - 3 * giorno,
    pubblicato: true,
  },
];

export const parolaIniziale: Parola = { parola: 'Gatsby', nota: 'Valida fino a domenica', aggiornata: ora };
