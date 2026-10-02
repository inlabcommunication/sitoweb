// Se una pagina va in errore (per esempio un file non più disponibile dopo un
// deploy), invece dello schermo nero mostra un messaggio con il pulsante per
// ricaricare. Colori espliciti: gli stili globali del sito potrebbero non
// esserci più.
import { Component, type ReactNode } from 'react';

type State = { failed: boolean };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  declare readonly props: Readonly<{ children: ReactNode }>;
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[pagina] errore', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#1e1d1d', color: '#F0EDE6', fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>
        <div style={{ maxWidth: 420 }}>
          <p style={{ fontSize: 20, marginBottom: '0.75rem' }}>Il sito è stato aggiornato.</p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(240,237,230,0.75)', marginBottom: '1.5rem' }}>Ricarica la pagina per vedere la versione nuova.</p>
          <button type="button" onClick={() => window.location.reload()}
            style={{ minHeight: 44, padding: '0 1.5rem', borderRadius: 999, border: 0, background: '#cdb2ff', color: '#1e1d1d', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
            Ricarica la pagina
          </button>
        </div>
      </div>
    );
  }
}
