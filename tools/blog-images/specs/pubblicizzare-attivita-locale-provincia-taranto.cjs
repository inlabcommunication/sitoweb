module.exports = {
  slug: 'pubblicizzare-attivita-locale-provincia-taranto',
  hero: {
    tag: 'STRATEGIA · TARANTO',
    title: 'Come pubblicizzare<br>un\'attività in<br><span class="acc">provincia di Taranto</span>',
    size: 54,
    sub: 'Social, Google e passaparola per negozi, locali e studi',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <circle cx="215" cy="235" r="150" fill="none" stroke="rgba(205,178,255,.25)" stroke-width="2" stroke-dasharray="6 6"/>
  <circle cx="215" cy="235" r="70" fill="#2b2440" stroke="rgba(205,178,255,.6)" stroke-width="2"/>
  <path d="M215 200 c-18 0 -30 13 -30 29 c0 22 30 50 30 50 s30 -28 30 -50 c0 -16 -12 -29 -30 -29 z" fill="#cdb2ff"/><circle cx="215" cy="229" r="10" fill="#2b2440"/>
  ${[['Google',215,70],['Social',375,235],['Recensioni',215,405],['Eventi',55,235]].map(([l,x,y])=>`<rect x="${x-55}" y="${y-20}" width="110" height="40" rx="20" fill="#262525" stroke="rgba(255,255,255,.14)"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="700" fill="#F0EDE6">${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'timeline', name: 'canali-pubblicizzare-attivita-locale', tag: 'I CANALI', title: 'Da dove partire, <span class="acc">in ordine</span>', items: [
      ['1', 'Scheda Google', 'Categoria, orari, foto, recensioni'],
      ['2', 'Social', 'Contenuti veri e costanti', 1],
      ['3', 'Sponsorizzate', 'Solo sulla tua zona, con un obiettivo'],
      ['4', 'Territorio', 'Eventi, collaborazioni, passaparola']
    ] }
  ]
};
