import { useEffect, useState } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Eye, Clock, MousePointerClick, Monitor, Smartphone, Tablet, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ════════════════════════════════════════════════════════════════
// ANALYTICS DASHBOARD
// Visualizza dati visite, pagine, scroll, dispositivi, referrer.
// ════════════════════════════════════════════════════════════════

type Range = '7d' | '30d' | '90d';

type Daily = {
  day: string;
  unique_visitors: number;
  pageviews: number;
  avg_session_duration: number | null;
  avg_scroll_depth: number | null;
};

type TopPage = { path: string; views: number; unique_visitors: number };
type Device = { device: string; sessions: number };
type Referrer = { source: string; sessions: number };

export const Analytics = () => {
  const [range, setRange] = useState<Range>('30d');
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState<Daily[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [sectionScroll, setSectionScroll] = useState<{ section: string; avg: number; views: number }[]>([]);

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    Promise.all([
      supabase.from('analytics_daily').select('*').gte('day', since.split('T')[0]).order('day'),
      supabase.from('analytics_top_pages').select('*').limit(10),
      supabase.from('analytics_devices').select('*'),
      supabase.from('analytics_referrers').select('*').limit(8),
      supabase
        .from('analytics_events')
        .select('section, scroll_depth')
        .eq('event_type', 'scroll')
        .gte('created_at', since)
        .not('section', 'is', null),
    ]).then(([d, p, dev, ref, sections]) => {
      setDaily((d.data as Daily[]) ?? []);
      setTopPages((p.data as TopPage[]) ?? []);
      setDevices((dev.data as Device[]) ?? []);
      setReferrers((ref.data as Referrer[]) ?? []);

      // Aggrega scroll per sezione
      const map = new Map<string, { sum: number; count: number }>();
      (sections.data as any[])?.forEach((r) => {
        if (!r.section) return;
        const cur = map.get(r.section) ?? { sum: 0, count: 0 };
        cur.sum += r.scroll_depth ?? 0;
        cur.count += 1;
        map.set(r.section, cur);
      });
      setSectionScroll(
        Array.from(map.entries())
          .map(([section, { sum, count }]) => ({ section, avg: sum / count, views: count }))
          .sort((a, b) => b.views - a.views)
      );

      setLoading(false);
    });
  }, [days]);

  // KPI totali nel range
  const totalVisitors = daily.reduce((a, b) => a + (b.unique_visitors || 0), 0);
  const totalViews = daily.reduce((a, b) => a + (b.pageviews || 0), 0);
  const avgDuration =
    daily.reduce((a, b) => a + (b.avg_session_duration || 0), 0) / Math.max(daily.filter((d) => d.avg_session_duration).length, 1);
  const avgScroll =
    daily.reduce((a, b) => a + (b.avg_scroll_depth || 0), 0) / Math.max(daily.filter((d) => d.avg_scroll_depth).length, 1);

  // Max per grafico
  const maxViews = Math.max(...daily.map((d) => d.pageviews || 0), 1);

  const deviceIcon = (d: string) =>
    d === 'mobile' ? <Smartphone size={14} /> : d === 'tablet' ? <Tablet size={14} /> : <Monitor size={14} />;

  return (
    <div style={{ padding: '2rem', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-label" style={{ marginBottom: 8 }}>Periodo</div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: '2.5rem', letterSpacing: '.02em' }}>ANALYTICS</h2>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 100, border: '.5px solid var(--b)' }}>
          {(['7d', '30d', '90d'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '6px 14px',
                borderRadius: 100,
                fontSize: 11,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                fontWeight: 500,
                border: 'none',
                background: range === r ? 'var(--a)' : 'transparent',
                color: range === r ? '#000' : 'var(--m)',
                transition: 'all .2s',
              }}
            >
              {r === '7d' ? '7 giorni' : r === '30d' ? '30 giorni' : '90 giorni'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--m)' }}>Caricamento...</div>
      ) : (
        <>
          {/* KPI cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Kpi icon={<Eye size={16} />} label="Visitatori unici" value={totalVisitors.toLocaleString('it')} />
            <Kpi icon={<TrendingUp size={16} />} label="Visualizzazioni pagine" value={totalViews.toLocaleString('it')} />
            <Kpi icon={<Clock size={16} />} label="Durata media sessione" value={`${Math.round(avgDuration)}s`} />
            <Kpi icon={<MousePointerClick size={16} />} label="Scroll medio" value={`${Math.round(avgScroll)}%`} />
          </div>

          {/* Grafico visite per giorno */}
          <Card title="VISITE NEGLI ULTIMI GIORNI" subtitle="Visitatori unici e pageviews">
            {daily.length === 0 ? (
              <div style={{ padding: '2rem 0', color: 'var(--m)', fontSize: 13 }}>
                Ancora nessun dato. I visitatori cominceranno ad apparire qui appena il sito è online.
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 200, marginTop: '1.5rem' }}>
                {daily.map((d, i) => {
                  const h = (d.pageviews / maxViews) * 100;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.02, type: 'spring', stiffness: 120 }}
                        title={`${d.day}: ${d.pageviews} viste · ${d.unique_visitors} visitatori`}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(180deg, var(--a) 0%, rgba(205,178,255,0.3) 100%)',
                          borderRadius: '4px 4px 0 0',
                          minHeight: 2,
                          cursor: 'pointer',
                        }}
                      />
                      {i % Math.ceil(daily.length / 8) === 0 && (
                        <div style={{ fontSize: 9, color: 'var(--m)', whiteSpace: 'nowrap' }}>
                          {new Date(d.day).getDate()}/{new Date(d.day).getMonth() + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Grid: pagine top + dispositivi + referrer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <Card title="PAGINE PIÙ VISTE" subtitle="Top 10 percorsi">
              {topPages.length === 0 ? (
                <Empty />
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  {topPages.map((p, i) => {
                    const max = Math.max(...topPages.map((t) => t.views));
                    return (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ color: 'var(--t)', fontFamily: 'monospace', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.path || '/'}
                          </span>
                          <span style={{ color: 'var(--m)' }}>{p.views.toLocaleString('it')}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(p.views / max) * 100}%` }}
                            style={{ height: '100%', background: 'var(--a)' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card title="DISPOSITIVI" subtitle="Da dove navigano">
              {devices.length === 0 ? (
                <Empty />
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  {devices.map((d, i) => {
                    const total = devices.reduce((a, b) => a + b.sessions, 0);
                    const pct = (d.sessions / total) * 100;
                    return (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t)', textTransform: 'capitalize' }}>
                            {deviceIcon(d.device)}
                            {d.device}
                          </span>
                          <span style={{ color: 'var(--m)' }}>{pct.toFixed(0)}% · {d.sessions}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} style={{ height: '100%', background: 'var(--a)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card title="PROVENIENZA" subtitle="Da dove arrivano i visitatori">
              {referrers.length === 0 ? (
                <Empty />
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  {referrers.map((r, i) => {
                    const max = Math.max(...referrers.map((t) => t.sessions));
                    const host = r.source === 'diretto' ? 'Diretto' : (() => { try { return new URL(r.source).hostname; } catch { return r.source; } })();
                    return (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t)' }}>
                            <Globe size={12} />
                            {host}
                          </span>
                          <span style={{ color: 'var(--m)' }}>{r.sessions}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(r.sessions / max) * 100}%` }} style={{ height: '100%', background: 'var(--a)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Scroll per sezione */}
          <div style={{ marginTop: '1rem' }}>
            <Card title="ENGAGEMENT PER SEZIONE" subtitle="Quanto vengono lette le sezioni del sito">
              {sectionScroll.length === 0 ? (
                <Empty hint="Le sezioni vengono tracciate dagli elementi con data-section. Verifica che il sito sia online e abbia ricevuto visite." />
              ) : (
                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {sectionScroll.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '.5px solid var(--b)',
                        borderRadius: 12,
                      }}
                    >
                      <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 6 }}>{s.section}</div>
                      <div style={{ fontFamily: 'var(--fd)', fontSize: '1.8rem', color: 'var(--a)' }}>{Math.round(s.avg)}%</div>
                      <div style={{ fontSize: 11, color: 'var(--m)' }}>{s.views} interazioni</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

const Kpi = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      padding: '1.25rem',
      background: 'var(--s)',
      border: '.5px solid var(--b)',
      borderRadius: 16,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--m)', marginBottom: 8 }}>
      {icon}
      <span style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase' }}>{label}</span>
    </div>
    <div style={{ fontFamily: 'var(--fd)', fontSize: '2.2rem', letterSpacing: '.02em' }}>{value}</div>
  </motion.div>
);

const Card = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
      padding: '1.5rem',
      background: 'var(--s)',
      border: '.5px solid var(--b)',
      borderRadius: 20,
    }}
  >
    <div>
      <div style={{ fontFamily: 'var(--fd)', fontSize: 14, letterSpacing: '.15em', color: 'var(--t)' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: 'var(--m)', marginTop: 2 }}>{subtitle}</div>}
    </div>
    {children}
  </motion.div>
);

const Empty = ({ hint }: { hint?: string } = {}) => (
  <div style={{ padding: '1.5rem 0', color: 'var(--m)', fontSize: 13, textAlign: 'center' }}>
    Nessun dato ancora.
    {hint && <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>{hint}</div>}
  </div>
);
