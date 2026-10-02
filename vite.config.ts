import react from '@vitejs/plugin-react';
import path from 'path';
import { existsSync, readdirSync } from 'fs';
import { defineConfig } from 'vite';

// Cover del blog che hanno anche la versione WebP (generate da tools/blog-images):
// solo per queste il sito usa <picture> con la WebP, le altre restano JPG.
const BLOG_DIR = path.resolve(__dirname, 'public/blog');
const blogWebp = existsSync(BLOG_DIR)
  ? readdirSync(BLOG_DIR).filter((d) => existsSync(path.join(BLOG_DIR, d, 'cover.webp'))).map((d) => `/blog/${d}/cover.jpg`)
  : [];

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
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
