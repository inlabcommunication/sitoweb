import { useState, useEffect } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, RotateCcw, Check, ChevronRight, Edit3, Plus, Trash2 } from 'lucide-react';
import { WEBSITE_CONTENT } from '../constants';
import { loadContent, saveContent, SiteContent } from '../lib/content';

// ════════════════════════════════════════════════════════════════
// CONTENT EDITOR — Modifica testi e dati del sito stile Shopify
// Naviga tra le sezioni del sito, modifica ogni campo, salva → live.
// ════════════════════════════════════════════════════════════════

type Section = 'brand' | 'hero' | 'stats' | 'services' | 'portfolio' | 'studio' | 'cities' | 'contact';

const SECTIONS: { key: Section; label: string; desc: string }[] = [
  { key: 'brand', label: 'Brand', desc: 'Nome, location, copyright' },
  { key: 'hero', label: 'Hero / Apertura', desc: 'Titolo principale, descrizione, CTA' },
  { key: 'stats', label: 'Numeri', desc: 'Stats mostrate sotto l\'hero' },
  { key: 'services', label: 'Servizi', desc: 'Cosa offrite' },
  { key: 'portfolio', label: 'Portfolio', desc: 'Lavori e progetti' },
  { key: 'studio', label: 'Studio', desc: 'Chi siete' },
  { key: 'cities', label: 'Città servite', desc: 'Aree geografiche' },
  { key: 'contact', label: 'Contatti', desc: 'Email, telefono, social' },
];

export const ContentEditor = () => {
  const [content, setContent] = useState<SiteContent>(WEBSITE_CONTENT);
  const [original, setOriginal] = useState<SiteContent>(WEBSITE_CONTENT);
  const [section, setSection] = useState<Section>('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent().then((c) => {
      setContent(c);
      setOriginal(c);
      setLoading(false);
    });
  }, []);

  const dirty = JSON.stringify(content) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveContent(content);
    if (ok) {
      setOriginal(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert('Salvataggio fallito. Controlla la console.');
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (!dirty) return;
    if (confirm('Annullare le modifiche non salvate?')) setContent(original);
  };

  const update = (path: string, value: any) => {
    setContent(setIn(content, path.split('.'), value));
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--m)' }}>Caricamento contenuti...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 60px)' }}>
      {/* Sidebar sezioni */}
      <aside
        style={{
          borderRight: '.5px solid var(--b)',
          padding: '2rem 0',
          background: 'rgba(0,0,0,0.2)',
          position: 'sticky',
          top: 60,
          alignSelf: 'flex-start',
          maxHeight: 'calc(100vh - 60px)',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '0 1.5rem 1rem' }}>
          <div className="section-label">Sezioni del sito</div>
        </div>
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 1.5rem',
              background: section === s.key ? 'rgba(205,178,255,0.06)' : 'transparent',
              border: 'none',
              borderLeft: `2px solid ${section === s.key ? 'var(--a)' : 'transparent'}`,
              color: section === s.key ? 'var(--t)' : 'var(--m)',
              cursor: 'pointer',
              transition: 'all .2s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{s.desc}</div>
            </div>
            <ChevronRight size={14} style={{ opacity: section === s.key ? 1 : 0.3 }} />
          </button>
        ))}
      </aside>

      {/* Editor */}
      <main style={{ padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-label" style={{ marginBottom: 6 }}>Editor contenuti</div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: '2.2rem', letterSpacing: '.02em' }}>
                {SECTIONS.find((s) => s.key === section)?.label.toUpperCase()}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleReset}
                disabled={!dirty}
                className="btn btn-g"
                style={{ opacity: dirty ? 1 : 0.4 }}
              >
                <RotateCcw size={13} /> Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={!dirty || saving}
                className="btn btn-p"
                style={{ opacity: dirty && !saving ? 1 : 0.5 }}
              >
                {saved ? <><Check size={13} /> Salvato</> : saving ? 'Salvo...' : <><Save size={13} /> Salva</>}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {section === 'brand' && (
                <>
                  <TextField label="Nome brand" value={content.brand.name} onChange={(v) => update('brand.name', v)} />
                  <TextField label="Nome breve" value={content.brand.shortName} onChange={(v) => update('brand.shortName', v)} />
                  <TextField label="Location" value={content.brand.location} onChange={(v) => update('brand.location', v)} />
                  <TextField label="Location completa" value={content.brand.fullLocation} onChange={(v) => update('brand.fullLocation', v)} />
                  <TextField label="Copyright" value={content.brand.copy} onChange={(v) => update('brand.copy', v)} />
                </>
              )}

              {section === 'hero' && (
                <>
                  <TextField label="Tag (badge sopra il titolo)" value={content.hero.tag} onChange={(v) => update('hero.tag', v)} />
                  <TextField label="Titolo riga 1" value={content.hero.headline.line1} onChange={(v) => update('hero.headline.line1', v)} />
                  <TextField label="Titolo riga 2" value={content.hero.headline.line2} onChange={(v) => update('hero.headline.line2', v)} />
                  <TextField label="Titolo accent (corsivo viola)" value={content.hero.headline.accent} onChange={(v) => update('hero.headline.accent', v)} />
                  <TextField label="Descrizione" multiline value={content.hero.description} onChange={(v) => update('hero.description', v)} />
                  <TextField label="Bottone primario" value={content.hero.cta.primary} onChange={(v) => update('hero.cta.primary', v)} />
                  <TextField label="Bottone secondario" value={content.hero.cta.secondary} onChange={(v) => update('hero.cta.secondary', v)} />
                </>
              )}

              {section === 'stats' && (
                <ListEditor
                  items={content.stats}
                  onChange={(items) => update('stats', items)}
                  newItem={() => ({ num: '', label: '' })}
                  render={(item, onItemChange) => (
                    <>
                      <TextField label="Numero" value={item.num} onChange={(v) => onItemChange({ ...item, num: v })} />
                      <TextField label="Descrizione" value={item.label} onChange={(v) => onItemChange({ ...item, label: v })} />
                    </>
                  )}
                  title={(item) => item.num || 'Nuova stat'}
                />
              )}

              {section === 'services' && (
                <>
                  <TextField label="Tag sezione" value={content.services.tag} onChange={(v) => update('services.tag', v)} />
                  <TextField label="Titolo riga 1" value={content.services.title[0]} onChange={(v) => update('services.title.0', v)} />
                  <TextField label="Titolo riga 2" value={content.services.title[1]} onChange={(v) => update('services.title.1', v)} />
                  <div style={{ marginTop: '1rem' }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>Servizi</div>
                    <ListEditor
                      items={content.services.items}
                      onChange={(items) => update('services.items', items)}
                      newItem={() => ({ icon: '◇', title: '', desc: '' })}
                      render={(item, onItemChange) => (
                        <>
                          <TextField label="Icona (carattere unicode)" value={item.icon} onChange={(v) => onItemChange({ ...item, icon: v })} />
                          <TextField label="Titolo" value={item.title} onChange={(v) => onItemChange({ ...item, title: v })} />
                          <TextField label="Descrizione" multiline value={item.desc} onChange={(v) => onItemChange({ ...item, desc: v })} />
                        </>
                      )}
                      title={(item) => item.title || 'Nuovo servizio'}
                    />
                  </div>
                </>
              )}

              {section === 'portfolio' && (
                <>
                  <TextField label="Tag" value={content.portfolio.tag} onChange={(v) => update('portfolio.tag', v)} />
                  <TextField label="Titolo riga 1" value={content.portfolio.title[0]} onChange={(v) => update('portfolio.title.0', v)} />
                  <TextField label="Titolo riga 2" value={content.portfolio.title[1]} onChange={(v) => update('portfolio.title.1', v)} />
                  <div style={{ marginTop: '1rem' }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>Progetti</div>
                    <ListEditor
                      items={content.portfolio.projects}
                      onChange={(items) => update('portfolio.projects', items)}
                      newItem={() => ({ title: '', tag: '', type: 'numeri', stat: '', year: '25', size: 'small', color: '#1a1a14' })}
                      render={(item, onItemChange) => (
                        <>
                          <TextField label="Titolo progetto" value={item.title} onChange={(v) => onItemChange({ ...item, title: v })} />
                          <TextField label="Tag (web, video, social, foto...)" value={item.tag} onChange={(v) => onItemChange({ ...item, tag: v })} />
                          <TextField label="Statistica / risultato" value={item.stat} onChange={(v) => onItemChange({ ...item, stat: v })} />
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                            <TextField label="Anno" value={item.year} onChange={(v) => onItemChange({ ...item, year: v })} />
                            <SelectField label="Tipo" value={item.type} options={['numeri', 'estetica']} onChange={(v) => onItemChange({ ...item, type: v })} />
                            <SelectField label="Dimensione" value={item.size} options={['small', 'large']} onChange={(v) => onItemChange({ ...item, size: v })} />
                          </div>
                          <TextField label="Colore sfondo (hex)" value={item.color} onChange={(v) => onItemChange({ ...item, color: v })} />
                        </>
                      )}
                      title={(item) => item.title || 'Nuovo progetto'}
                    />
                  </div>
                </>
              )}

              {section === 'studio' && (
                <>
                  <TextField label="Tag" value={content.studio.tag} onChange={(v) => update('studio.tag', v)} />
                  <TextField label="Titolo parte 1" value={content.studio.title[0]} onChange={(v) => update('studio.title.0', v)} />
                  <TextField label="Titolo parte 2 (corsivo)" value={content.studio.title[1]} onChange={(v) => update('studio.title.1', v)} />
                  <TextField label="Titolo parte 3" value={content.studio.title[2]} onChange={(v) => update('studio.title.2', v)} />
                  <TextField label="Descrizione 1" multiline value={content.studio.description1} onChange={(v) => update('studio.description1', v)} />
                  <TextField label="Descrizione 2" multiline value={content.studio.description2} onChange={(v) => update('studio.description2', v)} />
                  <div style={{ marginTop: '1rem' }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>Team / Competenze</div>
                    <ListEditor
                      items={content.studio.items}
                      onChange={(items) => update('studio.items', items)}
                      newItem={() => ({ icon: '◇', role: '', name: '', desc: '' })}
                      render={(item, onItemChange) => (
                        <>
                          <TextField label="Icona" value={item.icon} onChange={(v) => onItemChange({ ...item, icon: v })} />
                          <TextField label="Ruolo" value={item.role} onChange={(v) => onItemChange({ ...item, role: v })} />
                          <TextField label="Nome competenza" value={item.name} onChange={(v) => onItemChange({ ...item, name: v })} />
                          <TextField label="Descrizione" multiline value={item.desc} onChange={(v) => onItemChange({ ...item, desc: v })} />
                        </>
                      )}
                      title={(item) => item.name || 'Nuova competenza'}
                    />
                  </div>
                </>
              )}

              {section === 'cities' && (
                <>
                  <TextField label="Tag" value={content.cities.tag} onChange={(v) => update('cities.tag', v)} />
                  <div>
                    <div className="section-label" style={{ marginBottom: 8 }}>Città</div>
                    <SimpleListEditor
                      items={content.cities.list}
                      onChange={(items) => update('cities.list', items)}
                      placeholder="Nome città"
                    />
                  </div>
                </>
              )}

              {section === 'contact' && (
                <>
                  <TextField label="Tag" value={content.contact.tag} onChange={(v) => update('contact.tag', v)} />
                  <TextField label="Titolo parte 1" value={content.contact.title[0]} onChange={(v) => update('contact.title.0', v)} />
                  <TextField label="Titolo parte 2 (corsivo)" value={content.contact.title[1]} onChange={(v) => update('contact.title.1', v)} />
                  <TextField label="CTA bottone" value={content.contact.cta} onChange={(v) => update('contact.cta', v)} />
                  <div style={{ marginTop: '1rem' }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>Email</div>
                    <ListEditor
                      items={content.contact.emails}
                      onChange={(items) => update('contact.emails', items)}
                      newItem={() => ({ label: '', value: '' })}
                      render={(item, onItemChange) => (
                        <>
                          <TextField label="Etichetta" value={item.label} onChange={(v) => onItemChange({ ...item, label: v })} />
                          <TextField label="Email" value={item.value} onChange={(v) => onItemChange({ ...item, value: v })} />
                        </>
                      )}
                      title={(item) => item.value || 'Nuova email'}
                    />
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>Telefoni</div>
                    <ListEditor
                      items={content.contact.phones}
                      onChange={(items) => update('contact.phones', items)}
                      newItem={() => ({ label: '', value: '' })}
                      render={(item, onItemChange) => (
                        <>
                          <TextField label="Etichetta" value={item.label} onChange={(v) => onItemChange({ ...item, label: v })} />
                          <TextField label="Numero" value={item.value} onChange={(v) => onItemChange({ ...item, value: v })} />
                        </>
                      )}
                      title={(item) => item.value || 'Nuovo numero'}
                    />
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <div className="section-label" style={{ marginBottom: 8 }}>Social</div>
                    <SimpleListEditor
                      items={content.contact.socials}
                      onChange={(items) => update('contact.socials', items)}
                      placeholder="Nome social"
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// ─── Componenti form ────────────────────────────────────────────

const TextField = ({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) => (
  <div>
    <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 6 }}>
      {label}
    </div>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          minHeight: 80,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.04)',
          border: '.5px solid var(--b)',
          borderRadius: 10,
          color: 'var(--t)',
          fontSize: 14,
          fontFamily: 'var(--fb)',
          outline: 'none',
          resize: 'vertical',
          lineHeight: 1.6,
        }}
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.04)',
          border: '.5px solid var(--b)',
          borderRadius: 10,
          color: 'var(--t)',
          fontSize: 14,
          fontFamily: 'var(--fb)',
          outline: 'none',
        }}
      />
    )}
  </div>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
  <div>
    <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--m)', marginBottom: 6 }}>{label}</div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: '.5px solid var(--b)',
        borderRadius: 10,
        color: 'var(--t)',
        fontSize: 14,
        fontFamily: 'var(--fb)',
        outline: 'none',
      }}
    >
      {options.map((o) => (
        <option key={o} value={o} style={{ background: 'var(--bg)' }}>{o}</option>
      ))}
    </select>
  </div>
);

function ListEditor<T>({
  items,
  onChange,
  render,
  newItem,
  title,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, onItemChange: (i: T) => void) => React.ReactNode;
  newItem: () => T;
  title: (item: T) => string;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            background: 'var(--s)',
            border: '.5px solid var(--b)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            style={{
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Edit3 size={12} style={{ color: 'var(--m)' }} />
              <span style={{ fontSize: 13, color: 'var(--t)' }}>{title(item)}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Eliminare questo elemento?')) {
                    onChange(items.filter((_, i) => i !== idx));
                  }
                }}
                style={{ background: 'none', border: 'none', color: 'var(--m)', cursor: 'pointer', padding: 4 }}
              >
                <Trash2 size={13} />
              </button>
              <ChevronRight
                size={14}
                style={{
                  color: 'var(--m)',
                  transform: expanded === idx ? 'rotate(90deg)' : 'none',
                  transition: 'transform .2s',
                }}
              />
            </div>
          </div>
          <AnimatePresence>
            {expanded === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '.5px solid var(--b)', paddingTop: 16 }}>
                  {render(item, (updated) => {
                    const copy = [...items];
                    copy[idx] = updated;
                    onChange(copy);
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <button
        onClick={() => {
          onChange([...items, newItem()]);
          setExpanded(items.length);
        }}
        style={{
          padding: '12px',
          background: 'transparent',
          border: '.5px dashed rgba(255,255,255,0.15)',
          borderRadius: 12,
          color: 'var(--m)',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transition: 'all .2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--a)';
          e.currentTarget.style.color = 'var(--a)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.color = 'var(--m)';
        }}
      >
        <Plus size={13} /> Aggiungi
      </button>
    </div>
  );
}

const SimpleListEditor = ({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {items.map((item, idx) => (
      <div key={idx} style={{ display: 'flex', gap: 6 }}>
        <input
          value={item}
          onChange={(e) => {
            const copy = [...items];
            copy[idx] = e.target.value;
            onChange(copy);
          }}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '.5px solid var(--b)',
            borderRadius: 10,
            color: 'var(--t)',
            fontSize: 14,
            fontFamily: 'var(--fb)',
            outline: 'none',
          }}
        />
        <button
          onClick={() => onChange(items.filter((_, i) => i !== idx))}
          style={{
            padding: '10px 12px',
            background: 'transparent',
            border: '.5px solid var(--b)',
            borderRadius: 10,
            color: 'var(--m)',
            cursor: 'pointer',
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    ))}
    <button
      onClick={() => onChange([...items, ''])}
      style={{
        padding: '10px',
        background: 'transparent',
        border: '.5px dashed rgba(255,255,255,0.15)',
        borderRadius: 10,
        color: 'var(--m)',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      <Plus size={13} /> Aggiungi
    </button>
  </div>
);

// ─── Helper: deep set immutabile ────────────────────────────────
function setIn(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const idx = /^\d+$/.test(head) ? parseInt(head, 10) : null;
  if (idx !== null && Array.isArray(obj)) {
    const copy = [...obj];
    copy[idx] = setIn(obj[idx], rest, value);
    return copy;
  }
  return { ...obj, [head]: setIn(obj?.[head] ?? {}, rest, value) };
}
