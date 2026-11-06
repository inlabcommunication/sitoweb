module.exports = {
  slug: 'quanto-costa-social-media-manager-puglia',
  hero: {
    tag: 'SOCIAL MEDIA · PREVENTIVO',
    title: 'Quanto costa<br>un <span class="acc">social media</span><br>manager',
    size: 60,
    sub: 'In Puglia: da cosa dipende il prezzo, voce per voce',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="45" y="30" width="340" height="410" rx="22" fill="#262525" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
  <text x="75" y="80" font-size="16" font-weight="700" letter-spacing="2" fill="#cdb2ff">PREVENTIVO</text>
  ${['Canali','Contenuti al mese','Foto e video','Sponsorizzate','Community','Report'].map((l,i)=>`<rect x="75" y="${105+i*50}" width="280" height="36" rx="10" fill="${i===2?'#2b2440':'rgba(255,255,255,.05)'}" stroke="${i===2?'rgba(205,178,255,.6)':'none'}"/><circle cx="96" cy="${123+i*50}" r="6" fill="#cdb2ff"/><text x="112" y="${128+i*50}" font-size="15" fill="rgba(240,237,230,.85)">${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'fattori-prezzo-social-media-manager', tag: 'DA COSA DIPENDE', title: 'Le sei voci che <span class="acc">fanno il prezzo</span>', cols: 2, items: [
      ['Canali', 'Solo Instagram o anche Facebook e TikTok'],
      ['Contenuti al mese', 'Post, caroselli, reel e storie'],
      ['Foto e video', 'Forniti da te o girati sul posto'],
      ['Sponsorizzate', 'Gestione separata dal budget pubblicitario'],
      ['Community', 'Risposte a commenti e messaggi'],
      ['Strategia e report', 'Piano editoriale e numeri ogni mese']
    ] }
  ]
};
