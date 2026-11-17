module.exports = {
  slug: 'social-negozi-ottica-provincia-taranto',
  hero: {
    tag: 'SOCIAL MEDIA · OTTICA',
    title: 'Social per<br>i negozi<br>di <span class="acc">ottica</span>',
    size: 62,
    sub: 'In provincia di Taranto: far scegliere l\'occhiale prima di entrare',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <circle cx="215" cy="235" r="165" fill="none" stroke="rgba(205,178,255,.35)" stroke-width="2" stroke-dasharray="6 8"/>
  <g fill="none" stroke="#cdb2ff" stroke-width="9" stroke-linecap="round">
    <circle cx="182" cy="240" r="30"/><circle cx="248" cy="240" r="30"/><path d="M212 236 q3 -8 6 0"/><path d="M152 232 l-10 -8"/><path d="M278 232 l10 -8"/>
  </g>
  ${[['Montature',215,70],['Persone',362,235],['Brand',215,400],['Lenti',68,235]].map(([l,x,y])=>`<rect x="${x-62}" y="${y-22}" width="124" height="44" rx="22" fill="#262525" stroke="rgba(255,255,255,.14)"/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="17" font-weight="700" fill="rgba(240,237,230,.92)">${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'idee-social-ottica', tag: 'COSA PUBBLICARE', title: 'Quattro idee per <span class="acc">un\'ottica</span>', cols: 2, items: [
      ['Montature indossate', 'Lo stesso viso con tre modelli diversi'],
      ['Le persone', 'Gli ottici e il clima del negozio'],
      ['Domande frequenti', 'Lenti e servizi spiegati semplici'],
      ['Brand e momenti', 'Novità, sole, rientro a scuola']
    ] }
  ]
};
