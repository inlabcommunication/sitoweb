module.exports = {
  slug: 'gestione-social-attivita-locale-cosa-include',
  hero: {
    tag: 'SOCIAL MEDIA · GESTIONE SOCIAL',
    title: 'Gestione social<br>per attività <span class="acc">locali</span>',
    size: 62,
    sub: 'Cosa include davvero un servizio serio e come sceglierlo',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="30" y="40" width="370" height="390" rx="28" fill="#262525" stroke="rgba(255,255,255,.1)" stroke-width="2"/>
  <text x="60" y="88" font-size="17" font-weight="700" fill="#F0EDE6">Piano editoriale · Ottobre</text>
  <text x="60" y="110" font-size="12" fill="rgba(240,237,230,.5)">Pizzeria · Massafra</text>
  ${['L','M','M','G','V','S','D'].map((d,i)=>`<text x="${72+i*47}" y="148" text-anchor="middle" font-size="12" fill="rgba(240,237,230,.45)">${d}</text>`).join('')}
  ${[0,1,2,3].map(r=>[0,1,2,3,4,5,6].map(c=>{const k=(r*7+c)%5;const fill=k===1?'#cdb2ff':k===3?'rgba(205,178,255,.35)':'rgba(255,255,255,.06)';return `<rect x="${55+c*47}" y="${165+r*52}" width="34" height="38" rx="8" fill="${fill}"/>`}).join('')).join('')}
  <circle cx="68" cy="395" r="7" fill="#cdb2ff"/><text x="82" y="400" font-size="12" fill="rgba(240,237,230,.7)">Reel</text>
  <circle cx="140" cy="395" r="7" fill="rgba(205,178,255,.35)"/><text x="154" y="400" font-size="12" fill="rgba(240,237,230,.7)">Carosello</text>
  <circle cx="240" cy="395" r="7" fill="rgba(255,255,255,.12)"/><text x="254" y="400" font-size="12" fill="rgba(240,237,230,.7)">Storie</text>
</svg>`
  },
  inline: [
    { type: 'steps', name: 'cosa-include', tag: 'GESTIONE SOCIAL', title: 'Le 5 voci di un <span class="acc">servizio completo</span>', cols: 1, items: [
      ['Strategia', 'A chi parli, cosa vuoi ottenere, su quali canali'],
      ['Piano editoriale', 'Il calendario del mese, approvato insieme'],
      ['Foto e video', 'Girati nella tua attività, con le tue persone'],
      ['Community', 'Risposte a commenti, messaggi e recensioni'],
      ['Report', 'Numeri legati a contatti e prenotazioni, non solo like']
    ] },
    { type: 'compare', name: 'fai-da-te-agenzia', tag: 'COME SCEGLIERE', title: 'Fai-da-te o <span class="acc">affidarsi a qualcuno</span>', left: { label: 'Fai-da-te', items: ['Richiede tempo ogni settimana', 'Rischio di fermarsi dopo poco', 'Foto e video improvvisati', 'Nessuno guarda i numeri'] }, right: { label: 'Gestione professionale', items: ['Piano mensile e costanza', 'Riprese organizzate', 'Risposte rapide ai messaggi', 'Report e miglioramento continuo'] } }
  ]
};
