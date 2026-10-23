module.exports = {
  slug: 'social-natale-attivita-locali',
  hero: {
    tag: 'SOCIAL MEDIA · NATALE',
    title: 'Social a <span class="acc">Natale</span><br>per attività<br>locali',
    size: 60,
    sub: 'Il piano da novembre all\'Epifania',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="30" y="40" width="370" height="390" rx="24" fill="#262525" stroke="rgba(255,255,255,.1)" stroke-width="2"/>
  ${['NOV','DIC','GEN'].map((m,i)=>`<text x="${80+i*120}" y="85" font-size="16" font-weight="700" letter-spacing="2" fill="${i===1?'#cdb2ff':'rgba(240,237,230,.6)'}">${m}</text>`).join('')}
  ${Array.from({length:21}).map((_,k)=>{const c=k%7,r=Math.floor(k/7);const hi=[3,9,10,16].includes(k);return `<rect x="${55+c*48}" y="${115+r*70}" width="38" height="52" rx="8" fill="${hi?'#2b2440':'rgba(255,255,255,.05)'}" stroke="${hi?'rgba(205,178,255,.6)':'none'}"/>${hi?`<circle cx="${74+c*48}" cy="${141+r*70}" r="7" fill="#cdb2ff"/>`:''}`}).join('')}
  <text x="55" y="370" font-size="15" fill="rgba(240,237,230,.75)">Preparazione · Lancio · Picco · Dopo</text>
</svg>`
  },
  inline: [
    { type: 'timeline', name: 'calendario-social-natale-attivita-locali', tag: 'IL CALENDARIO', title: 'Quattro fasi per <span class="acc">il Natale sui social</span>', items: [
      ['Inizio novembre', 'Preparazione', 'Proposte, foto e video per tutto il periodo'],
      ['Metà novembre', 'Lancio', 'Menu, regali, ordini: come e entro quando', 1],
      ['Dicembre', 'Picco', 'Date, orari, disponibilità e dietro le quinte'],
      ['Fino all\'Epifania', 'Dopo Natale', 'Grazie, saldi e richiesta di recensioni']
    ] },
    { type: 'steps', name: 'idee-contenuti-natale-social', tag: 'IDEE DI CONTENUTI', title: 'Cosa pubblicare <span class="acc">settore per settore</span>', cols: 3, items: [
      ['Ristoranti e bar', 'Menu delle feste, sale per le cene, orari speciali'],
      ['Negozi', 'Idee regalo per prezzo, pacchi, vetrina, buoni regalo'],
      ['Laboratori', 'Preparazione, come ordinare, formati e confezioni']
    ] }
  ]
};
