import { useEffect, useState } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Eye, Clock, MousePointerClick, Monitor, Smartphone, Tablet, Globe } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

type Range = '7d' | '30d' | '90d';
type Daily = { day: string; unique_visitors: number; pageviews: number; avg_session_duration: number | null; avg_scroll_depth: number | null };
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
    if (!db) { setLoading(false); return; }
    setLoading(true);
    const since = Timestamp.fromDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));

    const eventsRef = collection(db, 'analytics_events');

    getDocs(query(eventsRef, where('created_at', '>=', since))).then((snap) => {
      const events = snap.docs.map((d) => d.data());

      // Daily aggregation
      const dailyMap = new Map<string, { sessions: Set<string>; pageviews: number; durations: number[]; scrolls: number[] }>();
      events.forEach((e) => {
        if (e.event_type !== 'pageview' && e.event_type !== 'session_end' && e.event_type !== 'scroll') return;
        const day = e.created_at.toDate().toISOString().split('T')[0];
        if (!dailyMap.has(day)) dailyMap.set(day, { sessions: new Set(), pageviews: 0, durations: [], scrolls: [] });
        const d = dailyMap.get(day)!;
        if (e.event_type === 'pageview') { d.sessions.add(e.session_id); d.pageviews++; }
        if (e.event_type === 'session_end' && e.duration) d.durations.push(e.duration);
        if (e.event_type === 'scroll' && e.scroll_depth) d.scrolls.push(e.scroll_depth);
      });
      const dailyArr: Daily[] = Array.from(dailyMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([day, v]) => ({
          day,
          unique_visitors: v.sessions.size,
          pageviews: v.pageviews,
          avg_session_duration: v.durations.length ? v.durations.reduce((a, b) => a + b, 0) / v.durations.length : null,
          avg_scroll_depth: v.scrolls.length ? v.scrolls.reduce((a, b) => a + b, 0) / v.scrolls.length : null,
        }));
      setDaily(dailyArr);

      // Top pages
      const pageMap = new Map<string, { views: number; sessions: Set<string> }>();
      events.filter((e) => e.event_type === 'pageview' && e.path).forEach((e) => {
        if (!pageMap.has(e.path)) pageMap.set(e.path, { views: 0, sessions: new Set() });
        const p = pageMap.get(e.path)!;
        p.views++;
        p.sessions.add(e.session_id);
      });
      setTopPages(Array.from(pageMap.entries()).map(([path, v]) => ({ path, views: v.views, unique_visitors: v.sessions.size })).sort((a, b) => b.views - a.views).slice(0, 10));

      // Devices
      const devMap = new Map<string, Set<string>>();
      events.filter((e) => e.event_type === 'pageview' && e.device).forEach((e) => {
        if (!devMap.has(e.device)) devMap.set(e.device, new Set());
        devMap.get(e.device)!.add(e.session_id);
      });
      setDevices(Array.from(devMap.entries()).map(([device, s]) => ({ device, sessions: s.size })));

      // Referrers
      const refMap = new Map<string, Set<string>>();
      events.filter((e) => e.event_type === 'pageview').forEach((e) => {
        const src = e.referrer || 'diretto';
        if (!refMap.has(src)) refMap.set(src, new Set());
        refMap.get(src)!.add(e.session_id);
      });
      setReferrers(Array.from(refMap.entries()).map(([source, s]) => ({ source, sessions: s.size })).sort((a, b) => b.sessions - a.sessions).slice(0, 8));

      // Section scroll
      const secMap = new Map<string, { sum: number; count: number }>();
      events.filter((e) => e.event_type === 'scroll' && e.section).forEach((e) => {
        if (!secMap.has(e.section)) secMap.set(e.section, { sum: 0, count: 0 });
        const s = secMap.get(e.section)!;
        s.sum += e.scroll_depth ?? 0;
        s.count++;
      });
      setSectionScroll(Array.from(secMap.entries()).map(([section, v]) => ({ section, avg: v.sum / v.count, views: v.count })).sort((a, b) => b.views - a.views));

      setLoading(false);
    });
  }, [days]);

  const totalVisitors = daily.reduce((a, b) => a + (b.unique_visitors || 0), 0);
  const totalViews = daily.reduce((a, b) => a + (b.pageviews || 0), 0);
  const avgDuration = daily.reduce((a, b) => a + (b.avg_session_duration || 0), 0) / Math.max(daily.filter((d) => d.avg_session_duration).length, 1);
  const avgScroll = daily.reduce((a, b) => a + (b.avg_scroll_depth || 0), 0) / Math.max(daily.filter((d) => d.avg_scroll_depth).length, 1);
  const maxViews = Math.max(...daily.map((d) => d.pageviews || 0), 1);
  const deviceIcon = (d: string) => d === 'mobile' ? <Smartphone size={14} /> : d === 'tablet' ? <Tablet size={14} /> : <Monitor size={14} />;

  return (
    <div style={{ padding: '2rem', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-label" style={{ marginBottom: 8 }}>Periodo</div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: '2.5rem', letterSpacing: '.02em' }}>ANALYTICS</h2>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 100, border: '.5px solid var(--b)' }}>
          {(['7d', '30d', '90d'] as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500, border: 'none', background: range === r ? 'var(--a)' : 'transparent', color: range === r ? '#000' : 'var(--m)', transition: 'all .2s' }}>
              {r === '7d' ? '7 giorni' : r === '30d' ? '30 giorni' : '90 giorni'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--m)' }}>Caricamento...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Kpi icon={<Eye size={16} />} label="Visitatori unici" value={totalVisitors.toLocaleString('it')} />
            <Kpi icon={<TrendingUp size={16} />} label="Visualizzazioni pagine" value={totalViews.toLocaleString('it')} />
            <Kpi icon={<Clock size={16} />} label="Durata media sessione" value={`${Math.round(avgDuration)}s`} />
            <Kpi icon={<MousePointerClick size={16} />} label="Scroll medio" value={`${Math.round(avgScroll)}%`} />
          </div>

          <Card title="VISITE NEGLI ULTIMI GIORNI" subtitle="Visitatori unici e pageviews">
            {daily.length === 0 ? (
              <div style={{ padding: '2rem 0', color: 'var(--m)', fontSize: 13 }}>Ancora nessun dato.</div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 200, marginTop: '1.5rem' }}>
                {daily.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(d.pageviews / maxViews) * 100}%` }} transition={{ delay: i * 0.02, type: 'spring', stiffness: 120 }}
                      title={`${d.day}: ${d.pageviews} viste · ${d.unique_visitors} visitatori`}
                      style={{ width: '100%', background: 'linear-gradient(180deg, var(--a) 0%, rgba(205,178,255,0.3) 100%)', borderRadius: '4px 4px 0 0', minHeight: 2 }} />
                    {i % Math.ceil(daily.length / 8) === 0 && (
                      <div style={{ fontSize: 9, color: 'var(--m)', whiteSpace: 'nowrap' }}>{new Date(d.day).getDate()}/{new Date(d.day).getMonth() + 1}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <Card title="PAGINE PIÙ VISTE" subtitle="Top 10 percorsi">
              {topPages.length === 0 ? <Empty /> : (
                <div style={{ marginTop: '1rem' }}>
                  {topPages.map((p, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'var(--t)', fontFamily: 'monospace', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.path || '/'}</span>
                        <span style={{ color: 'var(--m)' }}>{p.views.toLocaleString('it')}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(p.views / Math.max(...topPages.map(t => t.views))) * 100}%` }} style={{ height: '100%', background: 'var(--a)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="DISPOSITIVI" subtitle="Da dove navigano">
              {devices.length === 0 ? <Empty /> : (
                <div style={{ marginTop: '1rem' }}>
                  {devices.map((d, i) => {
                    const total = devices.reduce((a, b) => a + b.sessions, 0);
                    const pct = (d.sessions / total) * 100;
                    return (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t)', textTransform: 'capitalize' }}>{deviceIcon(d.device)}{d.device}</span>
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
              {referrers.length === 0 ? <Empty /> : (
                <div style={{ marginTop: '1rem' }}>
                  {referrers.map((r, i) => {
                    const max = Math.max(...referrers.map((t) => t.sessions));
                    const host = r.source === 'diretto' ? 'Diretto' : (() => { try { return new URL(r.source).hostname; } catch { return r.source; } })();
                    return (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t)' }}><Globe size={12} />{host}</span>
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

          <div style={{ marginTop: '1rem' }}>
            <Card title="ENGAGEMENT PER SEZIONE" subtitle="Quanto vengono lette le sezioni del sito">
              {sectionScroll.length === 0 ? <Empty /> : (
                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {sectionScroll.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '.5px solid var(--b)', borderRadius: 12 }}>
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
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '1.25rem', background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--m)', marginBottom: 8 }}>{icon}<span style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase' }}>{label}</span></div>
    <div style={{ fontFamily: 'var(--fd)', fontSize: '2.2rem', letterSpacing: '.02em' }}>{value}</div>
  </motion.div>
);

const Card = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1.5rem', background: 'var(--s)', border: '.5px solid var(--b)', borderRadius: 20 }}>
    <div style={{ fontFamily: 'var(--fd)', fontSize: 14, letterSpacing: '.15em', color: 'var(--t)' }}>{title}</div>
    {subtitle && <div style={{ fontSize: 11, color: 'var(--m)', marginTop: 2 }}>{subtitle}</div>}
    {children}
  </motion.div>
);

const Empty = () => <div style={{ padding: '1.5rem 0', color: 'var(--m)', fontSize: 13, textAlign: 'center' }}>Nessun dato ancora.</div>;
