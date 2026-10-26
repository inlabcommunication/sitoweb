module.exports = {
  slug: 'instagram-su-google-seo-profilo',
  hero: {
    tag: 'INSTAGRAM · SEO',
    title: 'Instagram<br>su <span class="acc">Google</span>',
    size: 66,
    sub: 'Come far trovare i tuoi post anche a chi cerca sul web',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="25" y="40" width="380" height="70" rx="35" fill="#262525" stroke="rgba(255,255,255,.14)" stroke-width="2"/>
  <circle cx="70" cy="75" r="14" fill="none" stroke="#cdb2ff" stroke-width="3"/><line x1="80" y1="85" x2="90" y2="95" stroke="#cdb2ff" stroke-width="3"/>
  <text x="105" y="82" font-size="18" fill="#F0EDE6">panettone pistacchio Mottola</text>
  ${[0,1,2].map(i=>`<rect x="25" y="${140+i*100}" width="380" height="82" rx="16" fill="${i===0?'#2b2440':'#262525'}" stroke="${i===0?'rgba(205,178,255,.6)':'rgba(255,255,255,.08)'}"/>
  <rect x="45" y="${155+i*100}" width="52" height="52" rx="10" fill="${i===0?'#cdb2ff':'rgba(255,255,255,.1)'}"/>
  <rect x="115" y="${163+i*100}" width="${i===0?200:170}" height="11" rx="5" fill="rgba(240,237,230,.6)"/>
  <rect x="115" y="${185+i*100}" width="250" height="8" rx="4" fill="rgba(240,237,230,.25)"/>`).join('')}
  <text x="115" y="212" font-size="12" fill="#cdb2ff">instagram.com · post</text>
</svg>`
  },
  inline: [
    { type: 'steps', name: 'checklist-instagram-su-google', tag: 'FARSI TROVARE', title: 'Il profilo Instagram <span class="acc">pronto per Google</span>', check: true, cols: 2, items: [
      ['Profilo professionale pubblico', 'Aziendale o creator, non privato'],
      ['Nome con città', 'Per esempio "Gelateria Rossi · Taranto"'],
      ['Bio chiara', 'Cosa fai, dove, e il link al sito'],
      ['Prima riga della didascalia', 'Prodotto o servizio con le parole dei clienti'],
      ['Testo alternativo', 'Una frase che descrive ogni foto'],
      ['Pochi hashtag mirati', 'Meglio pertinenti che numerosi']
    ] }
  ]
};
