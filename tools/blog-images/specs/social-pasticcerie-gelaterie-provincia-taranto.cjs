module.exports = {
  slug: 'social-pasticcerie-gelaterie-provincia-taranto',
  hero: {
    tag: 'SOCIAL MEDIA · PASTICCERIE',
    title: 'Social per<br><span class="acc">pasticcerie</span><br>e gelaterie',
    size: 62,
    sub: 'In provincia di Taranto: cosa pubblicare tutto l\'anno',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <circle cx="215" cy="235" r="165" fill="none" stroke="rgba(205,178,255,.35)" stroke-width="2" stroke-dasharray="6 8"/>
  <circle cx="215" cy="235" r="78" fill="#2b2440" stroke="rgba(205,178,255,.7)" stroke-width="3"/>
  <path d="M175 225 h80 l-10 45 h-60 z" fill="#cdb2ff"/><path d="M170 225 q45 -45 90 0 z" fill="rgba(205,178,255,.55)"/>
  ${[['Pasqua',215,70],['Gelato',362,235],['Natale',215,400],['Torte',68,235]].map(([l,x,y])=>`<rect x="${x-62}" y="${y-22}" width="124" height="44" rx="22" fill="#262525" stroke="rgba(255,255,255,.14)"/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="17" font-weight="700" fill="rgba(240,237,230,.92)">${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'timeline', name: 'calendario-social-pasticceria', tag: 'IL CALENDARIO', title: 'Un passo <span class="acc">prima</span> di ogni ricorrenza', items: [
      ['Gen-Feb', 'San Valentino', 'Dolci di Carnevale e coppie'],
      ['Mar-Apr', 'Pasqua', 'Colombe, uova, festa del papà'],
      ['Mag-Giu', 'Cerimonie', 'Torte su misura, festa della mamma', 1],
      ['Estate', 'Gelato', 'Gusti nuovi e turisti'],
      ['Dicembre', 'Natale', 'Panettoni e regali']
    ] }
  ]
};
