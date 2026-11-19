export function Ornament({ label = '◆' }: { label?: string }) {
  return (
    <div className="ornament" aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}

export function Deco() {
  return (
    <svg className="deco" viewBox="0 0 120 18" aria-hidden="true">
      <path d="M0 9h46M74 9h46" stroke="currentColor" strokeWidth="1" />
      <path d="M60 1l8 8-8 8-8-8z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="60" cy="9" r="2" fill="currentColor" />
    </svg>
  );
}

export function Loading({ testo = 'Caricamento…' }: { testo?: string }) {
  return <div className="loading">{testo}</div>;
}

export function Errore({ testo, onRiprova }: { testo: string; onRiprova?: () => void }) {
  return (
    <div className="msg err row">
      <span>{testo}</span>
      {onRiprova && (
        <button className="btn sm ghost" onClick={onRiprova}>
          Riprova
        </button>
      )}
    </div>
  );
}
