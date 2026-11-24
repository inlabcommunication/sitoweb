module.exports = {
  slug: 'quanto-costa-sito-web-attivita-locale-puglia',
  hero: {
    tag: 'SITI WEB · PREVENTIVO',
    title: 'Quanto costa<br>un <span class="acc">sito web</span><br>per un\'attività',
    size: 60,
    sub: 'In Puglia: da cosa dipende il prezzo, voce per voce',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="35" y="40" width="360" height="390" rx="20" fill="#262525" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
  <rect x="35" y="40" width="360" height="40" rx="20" fill="rgba(255,255,255,.06)"/>
  <circle cx="62" cy="60" r="6" fill="#cdb2ff"/><circle cx="82" cy="60" r="6" fill="rgba(205,178,255,.5)"/><circle cx="102" cy="60" r="6" fill="rgba(205,178,255,.25)"/>
  ${['Pagine','Testi e foto','Funzioni','E-commerce','SEO','Manutenzione'].map((l,i)=>`<rect x="65" y="${100+i*52}" width="300" height="38" rx="10" fill="${i===3?'#2b2440':'rgba(255,255,255,.05)'}" stroke="${i===3?'rgba(205,178,255,.6)':'none'}"/><circle cx="86" cy="${119+i*52}" r="6" fill="#cdb2ff"/><text x="102" y="${124+i*52}" font-size="15" fill="rgba(240,237,230,.85)">${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'fattori-prezzo-sito-web', tag: 'DA COSA DIPENDE', title: 'Le voci che <span class="acc">fanno il prezzo</span>', cols: 2, items: [
      ['Pagine', 'Una sola o una per ogni servizio'],
      ['Testi', 'Scritti da te o pensati per Google'],
      ['Foto e video', 'Già pronti o servizio fotografico'],
      ['Funzioni', 'Prenotazioni, moduli, WhatsApp'],
      ['E-commerce', 'Catalogo, ordini e pagamenti'],
      ['SEO e manutenzione', 'Farsi trovare e restare aggiornati']
    ] }
  ]
};
