import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // React e motion in chunk separati: restano in cache tra un deploy e l'altro.
        // Firebase no: lite (sito) e completo (admin) devono restare separati.
        manualChunks(id) {
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
});
