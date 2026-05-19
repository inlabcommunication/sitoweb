import { useEffect, useState } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Calendar, Download, Search, Trash2, MessageSquare, Tag, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ════════════════════════════════════════════════════════════════
// LEADS — Contatti raccolti dal chatbot
// ════════════════════════════════════════════════════════════════

type Lead = {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  intent: string | null;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  notes: string | null;
  conversation: any[] | null;
  created_at: string;
};

const STATUS_LABEL: Record<Lead['status'], string> = {
  new: 'Nuovo',
  contacted: 'Contattato',
  qualified: 'Qualificato',
  closed: 'Chiuso',
};

const STATUS_COLOR: Record<Lead['status'], string> = {
  new: '#cdb2ff',
  contacted: '#ffd699',
  qualified: '#a3e4a3',
  closed: 'rgba(255,255,255,0.3)',
};

export const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<'all' | Lead['status']>('all');
  const [search, setSearch] = useState('');

  const load = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateLead = async (id: number, patch: Partial<Lead>) => {
    if (!supabase) return;
    await supabase.from('leads').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
    setLeads(leads.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    if (selected?.id === id) setSelected({ ...selected, ...patch });
  };

  const deleteLead = async (id: number) => {
    if (!supabase) return;
    if (!confirm('Eliminare definitivamente questo lead?')) return;
    await supabase.from('leads').delete().eq('id', id);
    setLeads(leads.filter((l) => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const exportCsv = () => {
    const rows = [['Email', 'Nome', 'Telefono', 'Intento', 'Stato', 'Data', 'Note']];
    leads.forEach((l) => {
      rows.push([
        l.email,
        l.name ?? '',
        l.phone ?? '',
        l.intent ?? '',
        STATUS_LABEL[l.status],
        new Date(l.created_at).toLocaleString('it'),
        (l.notes ?? '').replace(/\n/g, ' '),
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inlab-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = leads.filter((l) => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!l.email.toLowerCase().includes(q) && !(l.intent ?? '').toLowerCase().includes(q) && !(l.name ?? '').toLowerCase().includes(q))
        return false;
    }
    return true;
  });

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    closed: leads.filter((l) => l.status === 'closed').length,
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-label" style={{ marginBottom: 8 }}>Lead raccolti</div>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: '2.5rem', letterSpacing: '.02em' }}>CONTATTI</h2>
        </div>
        <button
          onClick={exportCsv}
          disabled={leads.length === 0}
          className="btn btn-g"
          style={{ opacity: leads.length === 0 ? 0.4 : 1 }}
        >
          <Download size={14} /> Esporta CSV
        </button>
      </div>

      {/* Filtri */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {(['all', 'new', 'contacted', 'qualified', 'closed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 14px',
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              border: '.5px solid var(--b)',
              background: filter === s ? 'var(--a)' : 'transparent',
              color: filter === s ? '#000' : 'var(--m)',
              cursor: 'pointer',
              transition: 'all .2s',
            }}
          >
            {s === 'all' ? 'Tutti' : STATUS_LABEL[s]} · {counts[s]}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--m)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per email, nome o intento..."
          style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            background: 'rgba(255,255,255,0.04)',
            border: '.5px solid var(--b)',
            borderRadius: 100,
            color: 'var(--t)',
            fontSize: 13,
            fontFamily: 'var(--fb)',
            outline: 'none',
          }}
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--m)' }}>Caricamento...</div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'var(--m)',
            background: 'var(--s)',
            border: '.5px solid var(--b)',
            borderRadius: 20,
          }}
        >
          <Mail size={28} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontSize: 14 }}>{leads.length === 0 ? 'Ancora nessun lead. I contatti dal chatbot appariranno qui.' : 'Nessun lead corrisponde ai filtri.'}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setSelected(l)}
              style={{
                padding: '1rem 1.25rem',
                background: 'var(--s)',
                border: '.5px solid var(--b)',
                borderRadius: 14,
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto',
                gap: 16,
                alignItems: 'center',
                transition: 'border-color .2s, transform .2s',
              }}
              whileHover={{ borderColor: 'rgba(205,178,255,0.3)', x: 2 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: STATUS_COLOR[l.status],
                }}
              />
              <div>
                <div style={{ fontSize: 14, color: 'var(--t)', marginBottom: 2 }}>{l.email}</div>
                <div style={{ fontSize: 12, color: 'var(--m)' }}>{l.intent ?? 'Contatto generico'}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--m)', textAlign: 'right' }}>
                {new Date(l.created_at).toLocaleDateString('it', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: STATUS_COLOR[l.status],
                  fontWeight: 500,
                }}
              >
                {STATUS_LABEL[l.status]}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pannello dettaglio */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100 }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(500px, 100vw)',
                background: 'var(--bg)',
                borderLeft: '.5px solid var(--b)',
                zIndex: 101,
                overflowY: 'auto',
                padding: '2rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <div className="section-label" style={{ marginBottom: 6 }}>Lead #{selected.id}</div>
                  <h3 style={{ fontFamily: 'var(--fs)', fontSize: '1.6rem' }}>{selected.email}</h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--m)', cursor: 'pointer', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <Field icon={<Calendar size={14} />} label="Data">
                  {new Date(selected.created_at).toLocaleString('it')}
                </Field>
                {selected.name && <Field icon={<Tag size={14} />} label="Nome">{selected.name}</Field>}
                {selected.phone && <Field icon={<Phone size={14} />} label="Telefono">{selected.phone}</Field>}
                {selected.intent && <Field icon={<Tag size={14} />} label="Intento">{selected.intent}</Field>}

                <div>
                  <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 8 }}>Stato</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(['new', 'contacted', 'qualified', 'closed'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateLead(selected.id, { status: s })}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 100,
                          fontSize: 11,
                          fontWeight: 500,
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          border: `.5px solid ${selected.status === s ? STATUS_COLOR[s] : 'var(--b)'}`,
                          background: selected.status === s ? `${STATUS_COLOR[s]}22` : 'transparent',
                          color: selected.status === s ? STATUS_COLOR[s] : 'var(--m)',
                          cursor: 'pointer',
                          transition: 'all .2s',
                        }}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 8 }}>Note interne</div>
                  <textarea
                    value={selected.notes ?? ''}
                    onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
                    onBlur={() => updateLead(selected.id, { notes: selected.notes })}
                    placeholder="Aggiungi note sulla trattativa..."
                    style={{
                      width: '100%',
                      minHeight: 80,
                      padding: 12,
                      background: 'rgba(255,255,255,0.04)',
                      border: '.5px solid var(--b)',
                      borderRadius: 12,
                      color: 'var(--t)',
                      fontSize: 13,
                      fontFamily: 'var(--fb)',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {selected.conversation && selected.conversation.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MessageSquare size={12} />
                      Conversazione chatbot
                    </div>
                    <div
                      style={{
                        background: 'var(--s)',
                        border: '.5px solid var(--b)',
                        borderRadius: 16,
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      {selected.conversation.map((m: any, i: number) => (
                        <div
                          key={i}
                          style={{
                            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            padding: '8px 12px',
                            borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                            background: m.role === 'user' ? 'rgba(205,178,255,0.15)' : 'rgba(255,255,255,0.04)',
                            fontSize: 12,
                            lineHeight: 1.5,
                            color: 'var(--t)',
                          }}
                        >
                          {m.content}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => deleteLead(selected.id)}
                  style={{
                    marginTop: '1rem',
                    padding: '10px 16px',
                    background: 'rgba(255,100,100,0.08)',
                    border: '.5px solid rgba(255,100,100,0.2)',
                    borderRadius: 100,
                    color: '#ff8888',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Trash2 size={12} /> Elimina lead
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Field = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 4 }}>
      {icon}
      {label}
    </div>
    <div style={{ fontSize: 14, color: 'var(--t)' }}>{children}</div>
  </div>
);
