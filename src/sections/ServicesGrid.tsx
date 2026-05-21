import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, Video, Camera, Star, Layout,
  Target, Users, Calendar, ArrowUpRight,
} from 'lucide-react';

const SERVICES_LIST = [
  { icon: TrendingUp, slug: 'gestione-social', label: 'Social Media Management', desc: 'Strategia, contenuti e community per Instagram, Facebook, TikTok e LinkedIn.' },
  { icon: Video,      slug: 'video',           label: 'Reel & Video',             desc: 'Script, riprese e montaggio. Contenuti video che fanno fermare lo scroll.' },
  { icon: Camera,     slug: 'shooting',        label: 'Shooting fotografici',      desc: 'Foto professionali per brand, prodotti, eventi e attività locali.' },
  { icon: Star,       slug: 'branding',        label: 'Branding & identità',       desc: 'Nome, logo, palette, tono di voce. Diamo forma al modo in cui ti percepiscono.' },
  { icon: Layout,     slug: 'landing-page',    label: 'Landing page',              desc: 'Pagine progettate per un obiettivo: trasformare visitatori in lead reali.' },
  { icon: Target,     slug: 'meta-ads',        label: 'Campagne pubblicitarie',    desc: 'Meta Ads, Google Ads, retargeting. Budget ottimizzato, risultati misurabili.' },
  { icon: Users,      slug: 'meta-ads',        label: 'Lead generation',           desc: 'Sistemi pensati per portare contatti qualificati al tuo business.' },
  { icon: Calendar,   slug: 'eventi',          label: 'Eventi & inaugurazioni',    desc: 'Comunicazione integrata online e offline per trasformare aperture in eventi.' },
];

interface ServicesGridProps {
  onServiceClick: (slug: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onServiceClick }) => {
  return (
    <section style={{ padding: '8rem 2rem', borderBottom: '.5px solid var(--b)', position: 'relative', overflow: 'hidden' }}>
      {/* Glow di sfondo */}
      <div style={{
        position: 'absolute', top: '40%', right: '-5%', width: 480, height: 480,
        background: 'rgba(205,178,255,0.05)', borderRadius: '50%', filter: 'blur(110px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '4rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <p className="section-label">Cosa facciamo</p>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              lineHeight: 0.9,
              marginBottom: '1.2rem',
            }}>
              UN ECOSISTEMA<br />
              <span className="stroke">DI COMUNICAZIONE</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--m)', lineHeight: 1.7, maxWidth: 480 }}>
              Non solo post. Collegamo canali, contenuti e campagne in un sistema che lavora per il tuo brand.
            </p>
          </div>
        </motion.div>

        {/* Grid servizi */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
          className="grid-1-mob"
        >
          {SERVICES_LIST.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                onClick={() => onServiceClick(s.slug)}
                style={{
                  textAlign: 'left',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))',
                  border: '.5px solid var(--b)',
                  borderRadius: 22,
                  padding: '1.8rem 1.6rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  transition: 'border-color .35s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(205,178,255,0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--b)';
                }}
              >
                {/* Gradient border accent in alto */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(205,178,255,0.5), transparent)',
                  opacity: 0.5,
                }} />

                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(205,178,255,0.08)',
                  border: '.5px solid rgba(205,178,255,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--a)',
                  marginBottom: '1.4rem',
                }}>
                  <Icon size={20} />
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: 'var(--t)' }}>
                  {s.label}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--m)', lineHeight: 1.65, marginBottom: '1.4rem' }}>
                  {s.desc}
                </p>
                <span style={{
                  fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
                  color: 'var(--a)', display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  Scopri <ArrowUpRight size={11} />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
