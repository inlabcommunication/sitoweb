module.exports = {
  slug: 'servizio-fotografico-ristoranti',
  hero: {
    tag: 'FOTO & SHOOTING · RISTORAZIONE',
    title: 'Servizio fotografico<br>per <span class="acc">ristoranti</span>',
    size: 58,
    sub: 'Come prepararlo, cosa fotografare e come usare le foto su ogni canale',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="40" y="90" width="350" height="250" rx="34" fill="#262525" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
  <rect x="80" y="70" width="90" height="34" rx="10" fill="#262525" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
  <circle cx="215" cy="215" r="92" fill="#2b2440" stroke="rgba(205,178,255,.55)" stroke-width="4"/>
  <circle cx="215" cy="215" r="64" fill="none" stroke="rgba(205,178,255,.35)" stroke-width="3"/>
  <circle cx="215" cy="215" r="36" fill="rgba(205,178,255,.18)"/>
  <circle cx="340" cy="130" r="10" fill="#cdb2ff"/>
  <rect x="60" y="370" width="95" height="70" rx="12" fill="rgba(205,178,255,.22)"/>
  <rect x="167" y="370" width="95" height="70" rx="12" fill="rgba(255,255,255,.08)"/>
  <rect x="274" y="370" width="95" height="70" rx="12" fill="rgba(255,255,255,.08)"/>
  <circle cx="107" cy="405" r="18" fill="none" stroke="#cdb2ff" stroke-width="3"/>
  <text x="214" y="410" text-anchor="middle" font-size="12" fill="rgba(240,237,230,.6)">Sala</text>
  <text x="321" y="410" text-anchor="middle" font-size="12" fill="rgba(240,237,230,.6)">Staff</text>
</svg>`
  },
  inline: [
    { type: 'steps', name: 'preparare-servizio-fotografico-ristorante', tag: 'PRIMA DELLO SHOOTING', title: 'Come preparare <span class="acc">il ristorante</span>', check: true, cols: 2, items: [
      ['Obiettivo chiaro', 'Menu, Instagram, sito, scheda Google o delivery?'],
      ['Giorno e luce', 'Un giorno tranquillo, nelle ore più luminose'],
      ['Lista dei piatti', 'I più venduti e quelli che ti rappresentano'],
      ['Doppia porzione', 'Per fritti, gelati e piatti che si rovinano in fretta'],
      ['Pulizia e dettagli', 'Via cartelli, fili e avvisi dalle inquadrature'],
      ['Staff avvisato', 'Divise in ordine, consenso di chi compare']
    ] },
    { type: 'compare', name: 'foto-ristorante-menu-instagram-google', tag: 'OGNI CANALE IL SUO FORMATO', title: 'Le stesse foto, <span class="acc">usi diversi</span>', left: { label: 'Menu, delivery e sito', items: ['Stessa luce e stesso sfondo per tutti i piatti', 'Vista dall\'alto per pizze e taglieri', 'Orizzontali ampie per il sito', 'Coerenza prima di tutto'] }, right: { label: 'Instagram e scheda Google', items: ['Verticale 4:5 nel feed, 9:16 per storie', 'Mani, movimento, atmosfera', 'Sala, esterno e insegna su Google', 'Foto reali e aggiornate'] } }
  ]
};
