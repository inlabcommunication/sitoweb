module.exports = {
  slug: 'social-media-ristoranti-provincia-taranto',
  hero: {
    tag: 'SOCIAL MEDIA · RISTORANTI',
    title: 'Social media<br>per <span class="acc">ristoranti</span><br>a Taranto',
    size: 60,
    sub: 'Strategie che riempiono i tavoli in provincia di Taranto',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="95" y="20" width="240" height="430" rx="34" fill="#262525" stroke="rgba(255,255,255,.14)" stroke-width="2"/>
  <circle cx="215" cy="150" r="78" fill="#2b2440" stroke="rgba(205,178,255,.5)" stroke-width="2"/>
  <circle cx="215" cy="150" r="52" fill="none" stroke="rgba(240,237,230,.25)" stroke-width="2"/>
  <circle cx="200" cy="140" r="9" fill="#cdb2ff"/><circle cx="232" cy="160" r="7" fill="rgba(240,237,230,.6)"/><circle cx="212" cy="172" r="6" fill="#cdb2ff"/>
  ${['Prenota un tavolo','Menu della settimana','Orari e chiusure'].map((l,i)=>`<rect x="115" y="${265+i*52}" width="200" height="40" rx="12" fill="${i===0?'#cdb2ff':'rgba(255,255,255,.06)'}"/><text x="215" y="${291+i*52}" text-anchor="middle" font-size="14" font-weight="700" fill="${i===0?'#1a1919':'rgba(240,237,230,.8)'}">${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'cosa-pubblicare-social-ristorante', tag: 'IL PIANO', title: 'Cosa pubblicare per <span class="acc">un ristorante</span>', cols: 2, check: true, items: [
      ['I piatti', 'Foto curate, con luce sempre simile'],
      ['I reel', 'Forno, impiattamento, cocktail al bancone'],
      ['Sala e persone', 'Staff, titolare, terrazza o camino'],
      ['Informazioni pratiche', 'Orari, chiusure, menu, eventi in evidenza'],
      ['Le recensioni', 'Condivise nelle storie'],
      ['Come prenotare', 'Link o WhatsApp sempre in bio']
    ] }
  ]
};
