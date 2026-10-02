import react from '@vitejs/plugin-react';
import path from 'path';
import { pathToFileURL } from 'url';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { defineConfig, transformWithEsbuild, type Plugin } from 'vite';

// Cover del blog con la versione WebP (generate da tools/blog-images): per ognuna
// le larghezze ridotte che esistono davvero (cover-480.webp, cover-800.webp).
// Solo queste finiscono nel srcset; le cover senza .webp restano JPG.
const BLOG_DIR = path.resolve(__dirname, 'public/blog');
const blogWebp: Record<string, number[]> = {};
if (existsSync(BLOG_DIR)) {
  for (const d of readdirSync(BLOG_DIR)) {
    if (!existsSync(path.join(BLOG_DIR, d, 'cover.webp'))) continue;
    blogWebp[`/blog/${d}/cover.jpg`] = [480, 800].filter((w) => existsSync(path.join(BLOG_DIR, d, `cover-${w}.webp`)));
  }
}

// Testo degli articoli fuori dal JavaScript del sito (richiesta Performance
// 02/10, approvata da Nicola): nel build del browser src/lib/blog.ts riceve
// gli articoli di src/data/blogSeed.ts senza il campo content (con il numero
// di parole). Il testo di ogni articolo lo scrive il prerender in
// /blog-data/<slug>.json e dentro la pagina dell'articolo. blogSeed.ts non
// cambia; dashboard, HTML statico e sviluppo locale usano il file intero.
const BLOG_SEED_FILE = path.resolve(__dirname, 'src/data/blogSeed.ts');
const LITE_ID = '\0blog-seed-lite';
const blogSeedLite = (): Plugin => ({
  name: 'blog-seed-lite',
  apply: 'build',
  enforce: 'pre',
  async resolveId(source, importer, opts) {
    if (opts?.ssr || !importer?.replace(/\\/g, '/').endsWith('/src/lib/blog.ts')) return null;
    return source === '../data/blogSeed' ? LITE_ID : null;
  },
  async load(id) {
    if (id !== LITE_ID) return null;
    const ts = await import('fs').then((f) => f.readFileSync(BLOG_SEED_FILE, 'utf-8'));
    const { code } = await transformWithEsbuild(ts, BLOG_SEED_FILE, { loader: 'ts', format: 'esm' });
    const dir = path.resolve(__dirname, 'node_modules/.cache/blog-seed-lite');
    mkdirSync(dir, { recursive: true });
    const tmp = path.join(dir, `seed-${Date.now()}.mjs`);
    writeFileSync(tmp, code);
    const { BLOG_SEED } = await import(pathToFileURL(tmp).href);
    const plainWords = (md: string) => md.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#>*_`]/g, '').replace(/\s+/g, ' ').trim().split(' ').length;
    // words: parole per la SEO (wordCount); minutes: tempo di lettura delle card
    const lite = BLOG_SEED.map((p: any) => ({ ...p, content: '', words: plainWords(p.content),
      minutes: Math.max(1, Math.round(p.content.split(/\s+/).filter(Boolean).length / 200)) }));
    const real = JSON.stringify(BLOG_SEED_FILE.replace(/\\/g, '/'));
    return `export { slugify, normalizePost, mergePosts, BLOG_CATEGORIES } from ${real};\nexport const BLOG_SEED = ${JSON.stringify(lite)};\n`;
  },
});

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), blogSeedLite()],
  define: { __BLOG_WEBP__: JSON.stringify(blogWebp) },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2020',
    // la build "ssr" genera solo il codice per l'HTML statico: niente file pubblici
    copyPublicDir: !isSsrBuild,
    // elenco dei file per pagina: il prerender lo usa per i modulepreload
    // (scripts/prerender.ts) e poi lo cancella da dist
    manifest: !isSsrBuild,
    rollupOptions: {
      output: {
        // React e motion in chunk separati: restano in cache tra un deploy e l'altro.
        // Firebase no: lite (sito) e completo (admin) devono restare separati.
        // (non per la build "ssr" usata solo per generare l'HTML statico)
        manualChunks: isSsrBuild ? undefined : (id) => {
          if (!id.includes('node_modules')) return;
          if (id.includes('/motion') || id.includes('/framer-motion/')) return 'motion';
          if (id.includes('/react') || id.includes('/scheduler/')) return 'react';
        },
      },
    },
  },
  server: {
    // HMR è disattivato in AI Studio tramite DISABLE_HMR.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
}));
