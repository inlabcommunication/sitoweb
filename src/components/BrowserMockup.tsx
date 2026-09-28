import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// Screenshot di una pagina web generato dal servizio mShots di WordPress.com
// (caricato dal browser del visitatore; al primo accesso può servire qualche
// secondo perché venga generato).
export const siteShot = (url: string, w = 1280, h = 800) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${w}&h=${h}`;

export const BrowserMockup: React.FC<{ url: string; label: string; w?: number; h?: number }> = ({ url, label, w, h }) => {
  const [failed, setFailed] = React.useState(false);
  return (
    <a href={url} target="_blank" rel="noreferrer" style={{
      display: 'block', textDecoration: 'none', color: 'inherit',
      borderRadius: 18, overflow: 'hidden', border: '.5px solid rgba(205,178,255,0.25)',
      background: '#161518', boxShadow: '0 30px 80px rgba(0,0,0,.45)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '.5px solid var(--b)', background: 'rgba(255,255,255,0.03)' }}>
        {[0, 1, 2].map(i => <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: i === 0 ? 'var(--a)' : 'rgba(255,255,255,0.15)' }} />)}
        <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--m)', letterSpacing: '.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {url.replace(/^https?:\/\//, '')}
        </span>
      </div>
      <div style={{ aspectRatio: `${w ?? 1280} / ${h ?? 800}`, background: 'linear-gradient(135deg, #1e1d1d, #2b2440)', position: 'relative' }}>
        {!failed ? (
          <img src={siteShot(url, w, h)} alt={label} loading="lazy" onError={() => setFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--a)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase' }}>
            Apri {label} <ArrowUpRight size={14} />
          </div>
        )}
      </div>
    </a>
  );
};

