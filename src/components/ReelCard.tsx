// Card di un reel: il video caricato si guarda direttamente sul sito, il
// pulsante apre il post originale su Instagram. Senza video, la card porta
// direttamente al reel su Instagram.
import React from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import type { Reel } from '../data/caseStudies';
import { cld, cldVideoPoster } from '../lib/media';

const safe = (u?: string) => (u && /^https:\/\//i.test(u.trim()) ? u.trim() : '');

/** Copertina automatica per i video Cloudinary (primo fotogramma in JPG). */
export const videoPoster = (url: string) =>
  cldVideoPoster(url, 900) || (/res\.cloudinary\.com\/.+\/video\/upload\//.test(url)
    ? url.replace('/video/upload/', '/video/upload/so_0/').replace(/\.(mp4|mov|webm|m4v)(\?.*)?$/i, '.jpg')
    : undefined);

export const ReelCard: React.FC<{ reel: Reel }> = ({ reel }) => {
  const video = safe(reel.video);
  const ig = safe(reel.instagram);
  if (!video && !ig) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'relative', aspectRatio: '9 / 16', borderRadius: 20, overflow: 'hidden', border: '.5px solid var(--b)', background: 'linear-gradient(160deg, #2b2440, #1a191b 70%)' }}>
        {video ? (
          <video src={video} poster={videoPoster(video)} controls playsInline preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#000' }} />
        ) : (
          <a href={ig} target="_blank" rel="noopener noreferrer" aria-label={`Guarda ${reel.title || 'il reel'} su Instagram`}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--a)' }}>
            <span style={{ width: 58, height: 58, borderRadius: '50%', background: 'rgba(205,178,255,0.14)', border: '.5px solid rgba(205,178,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={22} fill="currentColor" />
            </span>
            <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase' }}>Guarda su Instagram</span>
          </a>
        )}
        {reel.views && (
          <span style={{ position: 'absolute', top: 12, left: 12, pointerEvents: 'none', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000', background: 'var(--a)', borderRadius: 100, padding: '5px 10px' }}>
            {reel.views}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--t)', lineHeight: 1.4 }}>{reel.title}</span>
        {ig && video && (
          <a href={ig} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--a)', whiteSpace: 'nowrap' }}>
            Instagram <ArrowUpRight size={12} />
          </a>
        )}
      </div>
    </div>
  );
};

export const ReelsGrid: React.FC<{ reels: Reel[] }> = ({ reels }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.2rem' }}>
    {reels.map((r, i) => <ReelCard key={i} reel={r} />)}
  </div>
);

/** `alt`: testo alternativo completo, uguale per tutte le foto della galleria (niente "foto 1, 2…"). */
export const Gallery: React.FC<{ images: string[]; alt: string }> = ({ images, alt }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
    {images.filter((u) => safe(u)).map((img, i) => (
      <a key={i} href={img} target="_blank" rel="noopener noreferrer" style={{ display: 'block', borderRadius: 16, overflow: 'hidden', border: '.5px solid var(--b)' }}>
        <img src={cld(img, 900)} alt={alt} loading="lazy" decoding="async" style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', display: 'block' }} />
      </a>
    ))}
  </div>
);
