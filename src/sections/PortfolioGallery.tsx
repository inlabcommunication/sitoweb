import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export type PortfolioProject = {
  id: string;
  client: string;
  title: string;
  category: string;        // per filtri
  categoryLabel: string;
  description: string;
  image?: string;
  videoUrl?: string;
  large?: boolean;
};

const PROJECTS: PortfolioProject[] = [
  { id: 'paresteta',   client: 'Paresteta',                  title: 'Dal rebranding all\'inaugurazione',     category: 'eventi',    categoryLabel: 'Eventi & Branding',  description: 'Una strategia integrata online e offline per un cambio insegna trasformato in evento locale.', large: true },
  { id: 'imh',         client: 'IMH',                        title: 'Comunicare fiducia nel settore energia', category: 'campagne',  categoryLabel: 'Campagne & Lead',    description: 'Contenuti, reel e landing page per generare lead qualificati nel settore luce, gas, fotovoltaico.' },
  { id: 'ricciardi',   client: 'Studio Dentistico Ricciardi',title: 'Autorevolezza e fiducia online',         category: 'social',    categoryLabel: 'Social Media',       description: 'Piano editoriale e contenuti che alternano educazione, recensioni e posizionamento.' },
  { id: 'inox-racing', client: 'Inox Racing Puglia',         title: 'Video e storytelling motorsport',         category: 'video',     categoryLabel: 'Reel & Video',       description: 'Storytelling visivo per un settore di nicchia. Riprese, montaggio e narrazione.' },
  { id: 'bmax',        client: 'Bmax',                       title: 'Fotovoltaico e contenuti educativi',      category: 'social',    categoryLabel: 'Social Media',       description: 'Contenuti che spiegano un servizio tecnico in modo chiaro e accessibile.' },
  { id: 'sottoscala',  client: 'Sottoscala',                 title: 'Food, reel e shooting',                   category: 'shooting',  categoryLabel: 'Shooting & Reel',    description: 'Identità visiva food costruita con foto curate e contenuti video ad alto impatto.' },
  { id: 'capone',      client: 'VisionOttica Capone',        title: 'Comunicazione locale e contenuti',        category: 'social',    categoryLabel: 'Social Media',       description: 'Presenza social costante e riconoscibile per un brand fortemente legato al territorio.' },
  { id: 'aleph',       client: 'Aleph Caffè',                title: 'Shooting e social content',               category: 'shooting',  categoryLabel: 'Shooting',           description: 'Shooting di prodotto e contenuti social per raccontare il rituale del caffè.' },
];

const FILTERS = [
  { value: 'all',       label: 'Tutti' },
  { value: 'social',    label: 'Social Media' },
  { value: 'video',     label: 'Reel & Video' },
  { value: 'shooting',  label: 'Shooting' },
  { value: 'branding',  label: 'Branding' },
  { value: 'eventi',    label: 'Eventi' },
  { value: 'landing',   label: 'Landing page' },
  { value: 'campagne',  label: 'Campagne' },
];

interface PortfolioGalleryProps {
  onProjectClick: (id: string) => void;
  showHeader?: boolean;
  maxItems?: number;
  onViewAll?: () => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  onProjectClick,
  showHeader = true,
  maxItems,
  onViewAll,
}) => {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const base = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter);
    return maxItems ? base.slice(0, maxItems) : base;
  }, [filter, maxItems]);

  return (
    <section style={{ padding: '8rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '3rem',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <p className="section-label">Portfolio</p>
              <h2 style={{
                fontFamily: 'var(--fd)',
                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                lineHeight: 0.9,
                marginBottom: '1.2rem',
              }}>
                I NOSTRI<br />
                <span className="stroke">LAVORI</span>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.7, maxWidth: 520 }}>
                Strategia, contenuti, eventi, campagne e identità visive realizzate per brand, attività locali e professionisti.
              </p>
            </div>
            {onViewAll && (
              <button className="btn btn-g" onClick={onViewAll}>Vedi tutto</button>
            )}
          </motion.div>
        )}

        {/* Filtri */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: '2.5rem',
          }}
        >
          {FILTERS.map(f => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  background: active ? 'var(--a)' : 'transparent',
                  color: active ? '#000' : 'var(--m)',
                  border: active ? '.5px solid var(--a)' : '.5px solid var(--b)',
                  cursor: 'pointer',
                  transition: 'all .25s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                    e.currentTarget.style.color = 'var(--t)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = 'var(--b)';
                    e.currentTarget.style.color = 'var(--m)';
                  }
                }}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* Grid masonry */}
        <LayoutGroup>
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 16,
            }}
            className="portfolio-grid"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.button
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  onClick={() => onProjectClick(p.id)}
                  style={{
                    gridColumn: p.large ? 'span 8' : 'span 4',
                    minHeight: p.large ? 380 : 280,
                    background: p.image ? '#111' : '#252525',
                    borderRadius: 24,
                    border: '.5px solid var(--b)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    fontFamily: 'inherit',
                    color: 'inherit',
                    textAlign: 'left',
                    padding: 0,
                  }}
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.client}
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.42,
                        transition: 'transform .6s, opacity .35s',
                      }}
                      className="portfolio-img"
                    />
                  )}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(30,29,29,0.95) 0%, rgba(30,29,29,0.4) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    minHeight: 'inherit',
                  }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="tag tag-a">{p.categoryLabel}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--m)', marginBottom: '0.7rem' }}>{p.description}</p>
                      <h3 style={{
                        fontFamily: 'var(--fd)',
                        fontSize: p.large ? 'clamp(2rem, 4vw, 3.2rem)' : 'clamp(1.4rem, 2.5vw, 2rem)',
                        lineHeight: 0.95,
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                      }}>
                        {p.client}
                      </h3>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: '0.8rem' }}>{p.title}</p>
                      <span style={{
                        fontSize: 10,
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        color: 'var(--a)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        Scopri il progetto <ArrowUpRight size={11} />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .portfolio-grid > button {
            grid-column: span 12 !important;
          }
        }
        .portfolio-grid button:hover .portfolio-img {
          transform: scale(1.05);
          opacity: 0.55;
        }
      `}</style>
    </section>
  );
};

export { PROJECTS };
