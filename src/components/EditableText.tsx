import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import type React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Save, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { loadContent, saveContent, SiteContent } from '../lib/content';

// ════════════════════════════════════════════════════════════════
// EDITOR INLINE STILE SHOPIFY
// Quando l'admin loggato attiva la "modalità modifica", ogni
// componente <EditableText path="hero.headline.line1"> diventa
// modificabile direttamente sul sito. Si salva su Supabase.
// ════════════════════════════════════════════════════════════════

type Ctx = {
  editing: boolean;
  isAdmin: boolean;
  dirty: Record<string, any>;
  setValue: (path: string, value: any) => void;
  hasChanges: boolean;
};

const EditCtx = createContext<Ctx>({
  editing: false,
  isAdmin: false,
  dirty: {},
  setValue: () => {},
  hasChanges: false,
});

export const useEdit = () => useContext(EditCtx);

// ─── Provider ──────────────────────────────────────────────────

export const EditableProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState<Record<string, any>>({});

  // Verifica se l'utente è loggato come admin
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setIsAdmin(!!s);
      if (!s) {
        setEditing(false);
        setDirty({});
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Quando arriva l'hash #edit, attiva subito modalità modifica
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.includes('edit') && isAdmin) {
        setEditing(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [isAdmin]);

  const setValue = useCallback((path: string, value: any) => {
    setDirty((prev) => ({ ...prev, [path]: value }));
  }, []);

  const hasChanges = Object.keys(dirty).length > 0;

  return (
    <EditCtx.Provider value={{ editing, isAdmin, dirty, setValue, hasChanges }}>
      {children}
      {isAdmin && (
        <EditorToolbar
          editing={editing}
          setEditing={setEditing}
          dirty={dirty}
          setDirty={setDirty}
          hasChanges={hasChanges}
        />
      )}
    </EditCtx.Provider>
  );
};

// ─── Toolbar fluttuante per attivare/salvare ───────────────────

const EditorToolbar = ({
  editing,
  setEditing,
  dirty,
  setDirty,
  hasChanges,
}: {
  editing: boolean;
  setEditing: (b: boolean) => void;
  dirty: Record<string, any>;
  setDirty: (d: Record<string, any>) => void;
  hasChanges: boolean;
}) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const current = await loadContent();
      let next = JSON.parse(JSON.stringify(current));
      for (const [path, value] of Object.entries(dirty)) {
        next = setIn(next, path.split('.'), value);
      }
      const ok = await saveContent(next as SiteContent);
      if (ok) {
        setDirty({});
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        alert('Salvataggio fallito. Riprova.');
      }
    } catch (e) {
      console.error('[editor] save error', e);
      alert('Errore durante il salvataggio.');
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (!hasChanges) {
      setEditing(false);
      return;
    }
    if (confirm('Annullare le modifiche non salvate?')) {
      setDirty({});
      setEditing(false);
    }
  };

  return (
    <>
      {/* Barra di stato in alto quando in modifica */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(90deg, var(--a) 0%, #d4c0ff 100%)',
              color: '#000',
              padding: '10px 24px',
              zIndex: 9997,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Edit3 size={14} />
              MODALITÀ MODIFICA ATTIVA · Clicca qualsiasi testo per modificarlo
              {hasChanges && (
                <span
                  style={{
                    marginLeft: 12,
                    padding: '2px 8px',
                    background: '#000',
                    color: 'var(--a)',
                    borderRadius: 100,
                    fontSize: 10,
                  }}
                >
                  {Object.keys(dirty).length} modifiche
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {hasChanges && (
                <button
                  onClick={save}
                  disabled={saving}
                  style={{
                    padding: '6px 16px',
                    background: '#000',
                    color: 'var(--a)',
                    border: 'none',
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    cursor: saving ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {saved ? <><Check size={12} /> Salvato</> : saving ? 'Salvo...' : <><Save size={12} /> Salva tutto</>}
                </button>
              )}
              <button
                onClick={discard}
                style={{
                  padding: '6px 16px',
                  background: 'transparent',
                  color: '#000',
                  border: '1px solid #000',
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <X size={12} /> Esci
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottone fluttuante per attivare/disattivare la modalità */}
      {!editing && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setEditing(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            padding: '12px 18px',
            background: 'var(--a)',
            color: '#000',
            border: 'none',
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '.13em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 8px 24px rgba(205,178,255,0.3)',
            zIndex: 9996,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit3 size={13} /> Modifica sito
        </motion.button>
      )}
    </>
  );
};

// ─── Bottone esportato anche separatamente ─────────────────────

export const EditModeToggle = () => null; // placeholder per import compat

// ─── Hook per leggere un valore (sito o dirty) ─────────────────

const useFieldValue = (path: string, fallback: any) => {
  const { dirty } = useEdit();
  // Se è in dirty, mostra quello (anteprima live mentre modifichi)
  if (path in dirty) return dirty[path];
  return fallback;
};

// ─── Componente EditableText ───────────────────────────────────

type EditableProps = {
  path: string; // es. "hero.headline.line1"
  value: string;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
};

export const EditableText = ({
  path,
  value,
  as: Tag = 'span',
  style,
  className,
  multiline,
  placeholder,
}: EditableProps) => {
  const { editing, setValue } = useEdit();
  const current = useFieldValue(path, value);
  const ref = useRef<HTMLElement>(null);

  // Tiene sincronizzato il testo mostrato col current quando si entra in edit
  useEffect(() => {
    if (editing && ref.current && ref.current.innerText !== current) {
      ref.current.innerText = current;
    }
  }, [editing, current]);

  if (!editing) {
    const Component = Tag as any;
    return (
      <Component style={style} className={className}>
        {current}
      </Component>
    );
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.currentTarget.innerText;
    if (newValue !== value) {
      setValue(path, newValue);
    } else {
      // Se è tornato uguale al valore originale, lo rimuoviamo da dirty
      setValue(path, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === 'Escape') {
      (e.target as HTMLElement).blur();
    }
  };

  const editStyle: React.CSSProperties = {
    ...style,
    outline: '1.5px dashed rgba(205,178,255,0.5)',
    outlineOffset: 4,
    borderRadius: 2,
    cursor: 'text',
    transition: 'outline-color .2s, background .2s',
    minHeight: '1em',
    minWidth: '0.5em',
    display: style?.display ?? 'inline-block',
  };

  const Component = Tag as any;
  return (
    <Component
      ref={ref as any}
      style={editStyle}
      className={className}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.outlineColor = 'var(--a)';
        e.currentTarget.style.background = 'rgba(205,178,255,0.06)';
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.outlineColor = 'rgba(205,178,255,0.5)';
        e.currentTarget.style.background = 'transparent';
      }}
      data-edit-path={path}
      data-placeholder={placeholder}
    >
      {current}
    </Component>
  );
};

// ─── Helper: deep set immutabile ───────────────────────────────

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
