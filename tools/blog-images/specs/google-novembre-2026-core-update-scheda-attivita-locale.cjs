module.exports = {
  slug: 'google-novembre-2026-core-update-scheda-attivita-locale',
  hero: {
    tag: 'GOOGLE · NOVEMBRE 2026',
    title: 'Core update<br>e <span class="acc">scheda Google</span>:<br>cosa controllare',
    size: 60,
    sub: 'Per un\'attività in provincia di Taranto',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="45" y="40" width="340" height="390" rx="22" fill="#262525" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
  <text x="75" y="90" font-size="16" font-weight="700" letter-spacing="2" fill="#cdb2ff">SCHEDA GOOGLE</text>
  ${['Prenota','Ordina','Sito','Chiama'].map((l,i)=>`<rect x="75" y="${115+i*72}" width="280" height="52" rx="14" fill="${i===0?'#2b2440':'rgba(255,255,255,.05)'}" stroke="${i===0?'rgba(205,178,255,.6)':'none'}"/><text x="100" y="${148+i*72}" font-size="18" fill="rgba(240,237,230,.9)">${l}</text><text x="330" y="${148+i*72}" text-anchor="end" font-size="20" fill="#cdb2ff">${i===0?'?':'✓'}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'verifiche-sito-scheda-google', tag: 'LE VERIFICHE', title: 'Cosa controllare <span class="acc">oggi</span>', cols: 2, items: [
      ['Pagine dei servizi', 'Rispondono alle domande dei clienti?'],
      ['Telefono e contatti', 'Il sito si apre bene e si chiama subito'],
      ['Link della scheda', 'Prenota e Ordina portano dove devono?'],
      ['Dati in Search Console', 'Guardali a rilascio finito']
    ] }
  ]
};
