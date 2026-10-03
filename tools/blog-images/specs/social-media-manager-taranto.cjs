module.exports = {
  slug: 'social-media-manager-taranto',
  hero: {
    tag: 'SOCIAL MEDIA · TARANTO',
    title: 'Social media<br>manager a<br><span class="acc">Taranto</span>',
    size: 62,
    sub: 'Cosa fa e quando conviene affidarsi a un professionista',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="95" y="20" width="240" height="430" rx="34" fill="#262525" stroke="rgba(255,255,255,.14)" stroke-width="2"/>
  <rect x="115" y="60" width="200" height="34" rx="10" fill="rgba(255,255,255,.06)"/>
  <circle cx="135" cy="77" r="10" fill="#cdb2ff"/><text x="155" y="83" font-size="14" font-weight="700" fill="#F0EDE6">La tua attività</text>
  ${[0,1,2,3,4,5].map(i=>`<rect x="${115+(i%3)*68}" y="${110+Math.floor(i/3)*68}" width="62" height="62" rx="8" fill="${i===1||i===3?'#2b2440':'rgba(255,255,255,.08)'}" stroke="${i===1||i===3?'rgba(205,178,255,.6)':'none'}"/>`).join('')}
  <path d="M208 132 l14 9 l-14 9 z" fill="#cdb2ff"/><path d="M140 200 l14 9 l-14 9 z" fill="#cdb2ff"/>
  ${['Piano del mese','Riprese','Messaggi','Report'].map((l,i)=>`<rect x="115" y="${270+i*42}" width="200" height="32" rx="10" fill="rgba(255,255,255,.05)"/><circle cx="133" cy="${286+i*42}" r="6" fill="#cdb2ff"/><text x="147" y="${291+i*42}" font-size="14" fill="rgba(240,237,230,.8)">${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'segnali-social-media-manager-taranto', tag: 'QUANDO AFFIDARSI', title: '6 segnali che è il momento di <span class="acc">un professionista</span>', check: true, cols: 2, items: [
      ['Pubblichi a singhiozzo', 'Due settimane piene, poi un mese di silenzio'],
      ['I social ti rubano ore', 'Tempo tolto a clienti, negozio o studio'],
      ['Rispondi tardi ai messaggi', 'Un giorno di attesa spesso è un cliente perso'],
      ['I concorrenti comunicano meglio', 'E vengono scelti prima di te'],
      ['Non sai cosa funziona', 'Pubblichi, ma senza sapere cosa porta richieste'],
      ['Un passo importante in arrivo', 'Apertura, nuovo servizio, estate o Natale']
    ] },
    { type: 'timeline', name: 'primo-mese-social-media-manager', tag: 'IL PRIMO MESE', title: 'Come iniziare <span class="acc">con il piede giusto</span>', items: [
      ['Settimana 1', 'Incontro iniziale', 'Obiettivi, clienti tipo, concorrenti'],
      ['Settimana 2', 'Piano del mese', 'Temi, formati, giorni e approvazioni', 1],
      ['Settimana 3', 'Riprese in sede', 'Foto e video per più settimane'],
      ['Fine mese', 'Primo report', 'Pochi numeri e cosa cambiare']
    ] }
  ]
};
