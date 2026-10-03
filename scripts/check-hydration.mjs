// Prova nel browser (in locale, non al build: su Vercel non c'è un browser).
// Apre home e 2 pagine con "Riduci movimento" attivo e no, su cellulare e computer,
// e fallisce se compare un errore di aggancio (React 418/423/425) o l'avviso
// "Il sito è stato aggiornato". Uso: npm run build && npx vite preview --port 4174
// poi, in un altro terminale: npm run check:hydration [http://localhost:4174]
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

let pw;
try { pw = await import('playwright'); } catch {
  const root = execSync('npm root -g').toString().trim();
  pw = createRequire(root + '/')('playwright');
}
const { chromium, devices } = pw;
const base = process.argv[2] || 'http://localhost:4174';
const pages = ['/', '/gestione-social', '/chi-siamo'];
const contexts = [
  ['cellulare', devices['iPhone 13']],
  ['computer', { viewport: { width: 1440, height: 900 } }],
];

const browser = await chromium.launch();
let failed = 0;
for (const [name, dev] of contexts) {
  for (const reducedMotion of ['reduce', 'no-preference']) {
    const ctx = await browser.newContext({ ...dev, reducedMotion });
    for (const path of pages) {
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(e.message.slice(0, 120)));
      page.on('console', (m) => {
        if (m.type() === 'error' && /Minified React error #(418|423|425)|hydrat/i.test(m.text())) errs.push(m.text().slice(0, 120));
      });
      await page.goto(base + path, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(1500);
      if (await page.evaluate(() => document.body.innerText.includes('Il sito è stato aggiornato'))) errs.push('ErrorBoundary visibile');
      console.log(`${errs.length ? 'ERRORE' : 'ok    '} ${name} ${reducedMotion.padEnd(13)} ${path}${errs.length ? ' → ' + errs.join(' | ') : ''}`);
      failed += errs.length ? 1 : 0;
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
if (failed) { console.error(`[check] ${failed} pagine con errori di aggancio`); process.exit(1); }
console.log('[check] nessun errore di aggancio');
