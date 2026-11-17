module.exports = {
  slug: 'social-investimento-risultati-clienti',
  hero: {
    tag: 'GESTIONE SOCIAL · RISULTATI',
    title: 'I social non sono<br>una spesa, ma un<br><span class="acc">investimento</span>',
    size: 56,
    sub: 'Lo dimostrano i nostri clienti in provincia di Taranto',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="35" y="50" width="360" height="370" rx="22" fill="#262525" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
  ${[['95%','degli eventi sold out',0],['quasi 4.000','follower, da circa 800',1],['circa 60 km','clienti anche da Bari',2]].map(([n,l,i])=>`<text x="70" y="${135+i*110}" font-size="46" font-weight="800" fill="#cdb2ff">${n}</text><text x="72" y="${165+i*110}" font-size="17" fill="rgba(240,237,230,.8)">${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'risultati-clienti-social', tag: 'I RISULTATI', title: 'Quattro clienti, <span class="acc">quattro risultati</span>', cols: 2, items: [
      ['Inox Racing Puglia', 'Da circa 800 a quasi 4.000 follower'],
      ['Nunzio Putignano', 'Clienti anche da Bari e da altre regioni'],
      ['Sublime Tentazione', 'Più gelato e più torte, secondo il titolare'],
      ['Masseria Sacramento', 'Il 95% degli eventi sold out']
    ] }
  ]
};
