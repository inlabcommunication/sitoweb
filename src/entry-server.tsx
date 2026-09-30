// Generazione dell'HTML statico delle pagine (solo in fase di build, vedi
// scripts/prerender.ts). Il browser poi ridisegna la pagina da zero con
// createRoot (nessuna hydration), quindi aspetto e funzionamento restano
// identici: questo HTML serve a motori di ricerca e sistemi AI che leggono
// il testo senza eseguire JavaScript.
import { prerenderToNodeStream } from 'react-dom/static';
import App from './App';
import { primeContent } from './lib/content';
import { primeBlogPosts, type BlogPost } from './lib/blog';

export { primeContent, primeBlogPosts };
export type { BlogPost };

export async function renderPage(path: string): Promise<string> {
  // Senza limite di dimensione React scrive ogni blocco <Suspense> già al suo
  // posto. Con il limite predefinito (~12 KB) le pagine lunghe caricate con
  // lazy() (blog, casi studio, privacy) finivano in un <div hidden> rivelato da
  // script inline, che la CSP blocca e che chi non esegue JS non vede.
  const { prelude } = await prerenderToNodeStream(<App ssrPath={path} />, { progressiveChunkSize: Number.POSITIVE_INFINITY });
  const chunks: Buffer[] = [];
  for await (const c of prelude) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
  return Buffer.concat(chunks).toString('utf8');
}
