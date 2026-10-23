module.exports = {
  slug: 'marketing-masserie-strutture-ricettive-puglia',
  hero: {
    tag: 'STRATEGIA · OSPITALITÀ',
    title: 'Marketing per<br><span class="acc">masserie</span><br>in Puglia',
    size: 60,
    sub: 'Social, sito e prenotazioni per strutture ricettive ed eventi',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="30" y="200" width="370" height="170" rx="10" fill="#262525" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
  <path d="M30 200 L215 120 L400 200 Z" fill="#2b2440" stroke="rgba(205,178,255,.5)" stroke-width="2"/>
  <rect x="185" y="280" width="60" height="90" rx="30" fill="rgba(205,178,255,.25)"/>
  ${[0,1].map(i=>`<rect x="${70+i*230}" y="240" width="60" height="50" rx="6" fill="rgba(255,255,255,.08)"/>`).join('')}
  ${[0,1,2].map(i=>`<g transform="translate(${60+i*140},390)"><line x1="10" y1="60" x2="10" y2="20" stroke="rgba(240,237,230,.4)" stroke-width="4"/><circle cx="10" cy="15" r="18" fill="rgba(205,178,255,.35)"/></g>`).join('')}
  <rect x="270" y="40" width="140" height="56" rx="14" fill="#262525" stroke="rgba(205,178,255,.5)"/>
  <text x="290" y="74" font-size="15" font-weight="700" fill="#cdb2ff">Prenota ora</text>
</svg>`
  },
  inline: [
    { type: 'steps', name: 'social-masseria-cosa-pubblicare', tag: 'COSA PUBBLICARE', title: 'I contenuti che riempiono <span class="acc">una masseria</span>', cols: 2, items: [
      ['Gli spazi', 'Camere, corte, sale e piscina nelle ore giuste'],
      ['Cucina e territorio', 'Piatti, orto, olio, forno'],
      ['Gli eventi', 'Prima con date e menu, dopo con foto e video'],
      ['Le persone', 'Chi accoglie, lo chef, il personale di sala']
    ] }
  ]
};
