import { useState } from 'react';
import type React from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { useMediaLibrary } from './MediaLibrary';

// Componenti base condivisi dalle sezioni dell'editor contenuti.

// ─── Stili riusabili ────────────────────────────────────────────

export const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '.5px solid #2a2a2a', borderRadius: 8,
  color: '#fff', fontSize: 12, fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box', resize: 'vertical' as any,
};

// ─── Componenti base ────────────────────────────────────────────

export const Field = ({ label, value, onChange, multiline = false, hint, placeholder, rows = 3 }: any) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>{label}</div>
    {hint && <div style={{ fontSize: 10, color: '#444', marginBottom: 4, lineHeight: 1.4 }}>{hint}</div>}
    {multiline
      ? <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={rows} style={inputStyle} placeholder={placeholder} />
      : <input value={value ?? ''} onChange={e => onChange(e.target.value)} style={inputStyle} placeholder={placeholder} />}
  </div>
);

export const ImageField = ({ label, value, onChange, type = 'image' }: any) => {
  const { pick, Modal } = useMediaLibrary();
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={value ?? ''} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="https://res.cloudinary.com/..." />
        <button onClick={async () => { const url = await pick(type); if (url) onChange(url); }}
          style={{ padding: '0 12px', background: 'rgba(205,178,255,0.1)', border: '.5px solid #cdb2ff44', borderRadius: 8, color: '#cdb2ff', cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 }}>
          📁
        </button>
      </div>
      {value && (
        <div style={{ marginTop: 6, borderRadius: 8, overflow: 'hidden', background: '#111', border: '.5px solid #2a2a2a', maxHeight: 100 }}>
          {type === 'video'
            ? <video src={value} style={{ width: '100%', maxHeight: 100, display: 'block' }} />
            : <img src={value} alt="" style={{ width: '100%', maxHeight: 100, objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />}
        </div>
      )}
      {Modal}
    </div>
  );
};

const iconBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#777', cursor: 'pointer', padding: 2, lineHeight: 1 };

export const CardBlock = ({ title, onDelete, onUp, onDown, confirmDelete, children, collapsed = false, accent }: any) => {
  const [open, setOpen] = useState(!collapsed);
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `.5px solid ${accent ? '#cdb2ff33' : '#2a2a2a'}`, borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', background: accent ? 'rgba(205,178,255,0.04)' : 'transparent' }}
        onClick={() => setOpen(o => !o)}>
        <div style={{ fontSize: 11, fontWeight: 600, color: accent ? '#cdb2ff' : '#aaa' }}>{title}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {onUp && <button title="Sposta su" onClick={e => { e.stopPropagation(); onUp(); }} style={iconBtn}><ArrowUp size={12} /></button>}
          {onDown && <button title="Sposta giù" onClick={e => { e.stopPropagation(); onDown(); }} style={iconBtn}><ArrowDown size={12} /></button>}
          {onDelete && <button title="Elimina" onClick={e => { e.stopPropagation(); if (!confirmDelete || confirm(confirmDelete)) onDelete(); }}
            style={{ background: 'none', border: 'none', color: '#ff8888', cursor: 'pointer', padding: 2, lineHeight: 1 }}>
            <Trash2 size={12} />
          </button>}
          {open ? <ChevronDown size={12} color="#555" /> : <ChevronRight size={12} color="#555" />}
        </div>
      </div>
      {open && <div style={{ padding: '0 14px 14px' }}>{children}</div>}
    </div>
  );
};

export const AddBtn = ({ onClick, label }: any) => (
  <button onClick={onClick} style={{ width: '100%', padding: '9px', background: 'rgba(205,178,255,0.06)', border: '.5px dashed #cdb2ff44', borderRadius: 9, color: '#cdb2ff', fontSize: 10, cursor: 'pointer', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
    <Plus size={11} /> {label}
  </button>
);

export const SectionTitle = ({ children }: any) => (
  <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: '#cdb2ff', marginBottom: 12, paddingBottom: 6, borderBottom: '.5px solid #cdb2ff22' }}>{children}</div>
);

export const Note = ({ children }: any) => (
  <div style={{ fontSize: 11, color: '#555', background: 'rgba(205,178,255,0.05)', border: '.5px solid #cdb2ff22', borderRadius: 8, padding: '10px 12px', marginBottom: 12, lineHeight: 1.5 }}>{children}</div>
);

