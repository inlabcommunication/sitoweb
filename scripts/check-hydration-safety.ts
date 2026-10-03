// Controllo al build (richiesta Direttore 03/10): blocca il build se un file del
// sito legge "Riduci movimento" con useReducedMotion di motion/react. Quell'hook
// vale già true nel primo render del browser, mentre l'HTML statico è generato
// senza preferenza: la pagina non combacia (errore React 418) e la home andava in
// errore. Usare src/hooks/useReducedMotion (false al primo render, poi si aggiorna).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files: string[] = [];
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(name)) files.push(p);
  }
};
walk('src');

const bad: string[] = [];
const importRe = /import\s*\{([^}]*)\}\s*from\s*['"](?:motion\/react|framer-motion)['"]/g;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(importRe)) {
    if (/\buseReducedMotion\b/.test(m[1])) bad.push(f);
  }
}

if (bad.length) {
  console.error('[check] useReducedMotion importato da motion/react in:\n  ' + bad.join('\n  ') +
    '\nUsa src/hooks/useReducedMotion: quello di motion rompe l\'aggancio dell\'HTML statico con "Riduci movimento".');
  process.exit(1);
}
console.log(`[check] aggancio sicuro: ${files.length} file controllati`);
