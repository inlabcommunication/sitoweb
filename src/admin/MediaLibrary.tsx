import { useState, useEffect, useRef, useCallback } from 'react';
import type React from 'react';
import {
  Upload, X, Check, Search, Image, Video, Trash2, Copy,
  ZoomIn, FolderOpen, RefreshCw, Filter, Grid, List,
  Film, FileImage, Plus, AlertCircle, Download, Link2,
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// ═══════════════════════════════════════════════════════════════
// CONFIG CLOUDINARY
// ═══════════════════════════════════════════════════════════════

const CLOUD_NAME = 'dp2l14rly';
const API_KEY = '189381191389964';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
const FIRESTORE_DOC = 'app/media_library';

// ═══════════════════════════════════════════════════════════════
// TIPI
// ═══════════════════════════════════════════════════════════════

export type MediaItem = {
  id: string;           // public_id Cloudinary
  secure_url: string;
  resource_type: 'image' | 'video' | 'raw';
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  created_at: string;
  name: string;         // nome file leggibile
  folder: string;       // cartella virtuale
  tags: string[];
  alt?: string;         // testo alternativo per SEO
};

// ═══════════════════════════════════════════════════════════════
// SINGLETON GLOBALE — shared tra tutte le istanze
// ═══════════════════════════════════════════════════════════════

let _items: MediaItem[] = [];
let _loaded = false;
const _listeners = new Set<() => void>();

const notify = () => _listeners.forEach(fn => fn());

const persist = async (items: MediaItem[]) => {
  _items = items;
  notify();
  if (!db) return;
  try {
    await setDoc(doc(db, 'app', 'media_library'), {
      items,
      updated_at: new Date().toISOString(),
    });
  } catch (e) { console.error('MediaLibrary save error', e); }
};

const loadLibrary = async () => {
  if (_loaded) return _items;
  if (!db) { _loaded = true; return _items; }
  try {
    const snap = await getDoc(doc(db, 'app', 'media_library'));
    if (snap.exists()) _items = snap.data().items || [];
  } catch {}
  _loaded = true;
  return _items;
};

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════

const fmt = (b: number) =>
  b < 1024 ? `${b}B`
  : b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB`
  : `${(b / 1024 / 1024).toFixed(1)} MB`;

const thumb = (item: MediaItem, w = 300) => {
  if (item.resource_type !== 'image') return '';
  return item.secure_url.replace('/upload/', `/upload/w_${w},c_fill,q_auto,f_auto/`);
};

const isVideo = (item: MediaItem) => item.resource_type === 'video';

const DEFAULT_FOLDERS = ['Tutti', 'Team', 'Portfolio', 'Clienti', 'Servizi', 'Video', 'Altro'];

// ═══════════════════════════════════════════════════════════════
// UPLOAD ENGINE
// ═══════════════════════════════════════════════════════════════

type UploadTask = {
  id: string;
  file: File;
  progress: number;
  status: 'queued' | 'uploading' | 'done' | 'error';
  error?: string;
  result?: MediaItem;
};

const uploadFile = (
  file: File,
  folder: string,
  onProgress: (p: number) => void
): Promise<MediaItem> =>
  new Promise(async (resolve, reject) => {
    const fd = new FormData();
    const targetFolder = `inlab/${folder === 'Tutti' || folder === 'Altro' ? 'generale' : folder.toLowerCase()}`;
    const context = `alt=${file.name.replace(/[|=]/g, ' ').slice(0, 150)}`;
    fd.append('file', file);
    fd.append('api_key', API_KEY);
    // Upload firmato: la firma la rilascia /api/cloudinary-sign solo agli admin
    try {
      const token = await auth?.currentUser?.getIdToken();
      const r = await fetch('/api/cloudinary-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
        body: JSON.stringify({ folder: targetFolder, context }),
      });
      if (r.ok) {
        const signed = await r.json();
        for (const k of ['folder', 'timestamp', 'upload_preset', 'context', 'signature']) if (signed[k]) fd.append(k, signed[k]);
      } else if (r.status === 501) {
        // Firma non ancora configurata su Vercel: upload con preset non firmato (vedi SECURITY.md)
        fd.append('upload_preset', 'ml_default');
        fd.append('folder', targetFolder);
        fd.append('context', context);
      } else {
        return reject(new Error('Upload non autorizzato'));
      }
    } catch {
      return reject(new Error('Impossibile preparare l\'upload'));
    }

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        const d = JSON.parse(xhr.responseText);
        resolve({
          id: d.public_id,
          secure_url: d.secure_url,
          resource_type: d.resource_type,
          format: d.format,
          width: d.width,
          height: d.height,
          bytes: d.bytes,
          created_at: new Date().toISOString(),
          name: file.name.replace(/\.[^.]+$/, ''),
          folder,
          tags: [],
          alt: '',
        });
      } else {
        reject(new Error(JSON.parse(xhr.responseText)?.error?.message || 'Upload failed'));
      }
    };
    xhr.onerror = () => reject(new Error('Errore di rete'));
    xhr.open('POST', UPLOAD_URL);
    xhr.send(fd);
  });

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: DROP ZONE
// ═══════════════════════════════════════════════════════════════

const DropZone = ({
  onFiles,
  compact = false,
}: {
  onFiles: (files: File[]) => void;
  compact?: boolean;
}) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (files: FileList | null) => {
    if (!files?.length) return;
    onFiles(Array.from(files));
  };

  if (compact) return (
    <button
      onClick={() => inputRef.current?.click()}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '9px 18px', background: '#cdb2ff', color: '#000',
        border: 'none', borderRadius: 100, fontSize: 11, fontWeight: 700,
        letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer',
      }}
    >
      <Upload size={13} /> Carica file
      <input ref={inputRef} type="file" multiple accept="image/*,video/*"
        style={{ display: 'none' }} onChange={e => handle(e.target.files)} />
    </button>
  );

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${drag ? '#cdb2ff' : '#2a2a2a'}`,
        borderRadius: 16, padding: '3rem 2rem', textAlign: 'center',
        cursor: 'pointer', transition: 'all .2s',
        background: drag ? 'rgba(205,178,255,0.06)' : 'rgba(255,255,255,0.02)',
      }}
    >
      <input ref={inputRef} type="file" multiple accept="image/*,video/*"
        style={{ display: 'none' }} onChange={e => handle(e.target.files)} />
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(205,178,255,0.1)', border: '.5px solid #cdb2ff44', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
        <Upload size={22} style={{ color: '#cdb2ff' }} />
      </div>
      <div style={{ fontSize: 15, color: '#fff', fontWeight: 500, marginBottom: 6 }}>
        Trascina qui i file oppure clicca
      </div>
      <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>
        JPG, PNG, WebP, GIF, SVG, MP4, MOV, WebM<br />
        Puoi caricare più file insieme
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: UPLOAD QUEUE
// ═══════════════════════════════════════════════════════════════

const UploadQueue = ({ tasks }: { tasks: UploadTask[] }) => {
  if (!tasks.length) return null;
  const active = tasks.filter(t => t.status !== 'done');
  if (!active.length) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 20000,
      background: '#1a1a1a', border: '.5px solid #2a2a2a',
      borderRadius: 16, padding: '1rem', width: 320,
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#cdb2ff', marginBottom: 10 }}>
        Caricamento in corso
      </div>
      {active.map(t => (
        <div key={t.id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginBottom: 3 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{t.file.name}</span>
            <span style={{ color: t.status === 'error' ? '#ff8888' : '#cdb2ff', flexShrink: 0 }}>
              {t.status === 'error' ? '✗' : t.status === 'uploading' ? `${t.progress}%` : '...'}
            </span>
          </div>
          <div style={{ height: 3, background: '#2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: t.status === 'error' ? '#ff8888' : '#cdb2ff',
              width: `${t.progress}%`, transition: 'width .3s',
            }} />
          </div>
          {t.error && <div style={{ fontSize: 10, color: '#ff8888', marginTop: 3 }}>{t.error}</div>}
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: LIGHTBOX
// ═══════════════════════════════════════════════════════════════

const Lightbox = ({ item, onClose }: { item: MediaItem; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(item.secure_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
      onClick={onClose}
    >
      <div style={{ maxWidth: 900, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', gap: 12 }}
        onClick={e => e.stopPropagation()}>
        {/* Preview */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
          {isVideo(item)
            ? <video src={item.secure_url} controls style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 12 }} />
            : <img src={item.secure_url} alt={item.alt || item.name} style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 12 }} />
          }
        </div>
        {/* Info bar */}
        <div style={{ background: '#1a1a1a', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 2 }}>{item.name}</div>
            <div style={{ fontSize: 11, color: '#555', display: 'flex', gap: 12 }}>
              {item.width && <span>{item.width}×{item.height}px</span>}
              <span>{fmt(item.bytes)}</span>
              <span style={{ textTransform: 'uppercase' }}>{item.format}</span>
              <span style={{ background: '#cdb2ff22', color: '#cdb2ff', padding: '1px 6px', borderRadius: 100, fontSize: 10 }}>{item.folder}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={copy}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(205,178,255,0.12)', border: `.5px solid ${copied ? '#4ade8044' : '#cdb2ff44'}`, borderRadius: 8, color: copied ? '#4ade80' : '#cdb2ff', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copiato!' : 'Copia URL'}
            </button>
            <a href={item.secure_url} download target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.06)', border: '.5px solid #333', borderRadius: 8, color: '#888', fontSize: 11, textDecoration: 'none' }}>
              <Download size={13} /> Scarica
            </a>
            <button onClick={onClose}
              style={{ padding: '8px 14px', background: 'rgba(255,100,100,0.08)', border: '.5px solid rgba(255,100,100,0.2)', borderRadius: 8, color: '#ff8888', fontSize: 11, cursor: 'pointer' }}>
              <X size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: MEDIA CARD
// ═══════════════════════════════════════════════════════════════

type MediaCardProps = {
  item: MediaItem;
  selected?: boolean;
  onSelect?: () => void;
  onPreview: () => void;
  onDelete: () => void;
  onCopy: () => void;
  listView: boolean;
};

const MediaCard: React.FC<MediaCardProps> = ({
  item,
  selected,
  onSelect,
  onPreview,
  onDelete,
  onCopy,
  listView,
}) => {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (listView) return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
        borderRadius: 10, cursor: onSelect ? 'pointer' : 'default', transition: 'background .15s',
        background: selected ? 'rgba(205,178,255,0.1)' : hover ? 'rgba(255,255,255,0.03)' : 'transparent',
        border: selected ? '.5px solid #cdb2ff44' : '.5px solid transparent',
      }}
    >
      {/* Thumb */}
      <div style={{ width: 44, height: 44, borderRadius: 8, background: '#111', overflow: 'hidden', flexShrink: 0 }}>
        {isVideo(item)
          ? <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}><Film size={18} style={{ color: '#cdb2ff' }} /></div>
          : <img src={thumb(item, 88)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        }
      </div>
      {/* Nome */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#ddd', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
        <div style={{ fontSize: 10, color: '#555', display: 'flex', gap: 8, marginTop: 2 }}>
          <span>{fmt(item.bytes)}</span>
          {item.width && <span>{item.width}×{item.height}</span>}
          <span style={{ textTransform: 'uppercase' }}>{item.format}</span>
        </div>
      </div>
      {/* Cartella */}
      <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(205,178,255,0.08)', color: '#cdb2ff77', borderRadius: 100 }}>{item.folder}</span>
      {/* Azioni */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={e => { e.stopPropagation(); onPreview(); }}
          style={{ padding: '5px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, color: '#666', cursor: 'pointer' }}>
          <ZoomIn size={12} />
        </button>
        <button onClick={handleCopy}
          style={{ padding: '5px', background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, color: copied ? '#4ade80' : '#666', cursor: 'pointer' }}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
        {onSelect && (
          <button onClick={onSelect}
            style={{ padding: '5px 10px', background: selected ? '#cdb2ff' : 'rgba(205,178,255,0.12)', border: 'none', borderRadius: 6, color: selected ? '#000' : '#cdb2ff', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>
            {selected ? 'Selezionato' : 'Usa'}
          </button>
        )}
        <button onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{ padding: '5px', background: 'rgba(255,100,100,0.08)', border: 'none', borderRadius: 6, color: '#ff8888', cursor: 'pointer' }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#1a1a1a', borderRadius: 12, overflow: 'hidden',
        border: selected ? '.5px solid #cdb2ff' : `.5px solid ${hover ? '#3a3a3a' : '#2a2a2a'}`,
        transition: 'border-color .15s, transform .15s',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Preview */}
      <div
        style={{ aspectRatio: '4/3', background: '#111', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
        onClick={onPreview}
      >
        {isVideo(item) ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <Film size={28} style={{ color: '#cdb2ff' }} />
            <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '.1em' }}>{item.format}</div>
          </div>
        ) : (
          <img src={thumb(item)} alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        )}
        {/* Overlay hover */}
        {hover && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <button onClick={e => { e.stopPropagation(); onPreview(); }}
              style={{ padding: '8px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
              <ZoomIn size={16} />
            </button>
          </div>
        )}
        {/* Badge tipo */}
        <div style={{ position: 'absolute', top: 8, left: 8, padding: '2px 6px', background: 'rgba(0,0,0,0.6)', borderRadius: 4, fontSize: 9, color: '#aaa', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          {isVideo(item) ? '▶ video' : item.format}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 11, color: '#ccc', fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
          {item.name}
        </div>
        <div style={{ fontSize: 10, color: '#555', marginBottom: 8 }}>{fmt(item.bytes)} · {item.folder}</div>

        {/* Azioni */}
        <div style={{ display: 'flex', gap: 4 }}>
          {onSelect && (
            <button onClick={onSelect}
              style={{ flex: 1, padding: '6px', background: selected ? '#cdb2ff' : 'rgba(205,178,255,0.12)', border: 'none', borderRadius: 7, color: selected ? '#000' : '#cdb2ff', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}>
              {selected ? '✓ Usato' : 'Usa'}
            </button>
          )}
          <button onClick={handleCopy}
            style={{ padding: '6px 8px', background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 7, color: copied ? '#4ade80' : '#666', cursor: 'pointer', transition: 'all .15s' }}
            title="Copia URL">
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{ padding: '6px 8px', background: 'rgba(255,100,100,0.08)', border: 'none', borderRadius: 7, color: '#ff8888', cursor: 'pointer' }}
            title="Elimina">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: INSTAGRAM LINK
// ═══════════════════════════════════════════════════════════════

const InstagramLinkPanel = ({ onSave }: { onSave: (url: string) => void }) => {
  const [url, setUrl] = useState('');
  const valid = url.includes('instagram.com') || url.includes('cloudinary.com') || url.startsWith('https://');

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ fontSize: 13, color: '#888', lineHeight: 1.8, marginBottom: '1.5rem', background: 'rgba(205,178,255,0.04)', border: '.5px solid #cdb2ff22', borderRadius: 12, padding: '1rem 1.25rem' }}>
        <strong style={{ color: '#cdb2ff' }}>Come funziona:</strong><br />
        Incolla un link Instagram Reel o un video esterno. Verrà salvato nel progetto portfolio e sul sito mostrerà un overlay video quando cliccato, senza uscire dalla pagina.
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>URL video / reel</div>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.instagram.com/reel/... oppure link Cloudinary"
          style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: `.5px solid ${valid && url ? '#cdb2ff44' : '#2a2a2a'}`, borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none' }}
        />
      </div>
      <button
        onClick={() => { if (valid && url) { onSave(url); setUrl(''); } }}
        disabled={!valid || !url}
        style={{ width: '100%', padding: '12px', background: valid && url ? '#cdb2ff' : '#2a2a2a', color: valid && url ? '#000' : '#555', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: valid && url ? 'pointer' : 'not-allowed', letterSpacing: '.08em', textTransform: 'uppercase', transition: 'all .2s' }}>
        Salva link video
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MEDIA LIBRARY STANDALONE (tab intera dashboard)
// ═══════════════════════════════════════════════════════════════

export const MediaLibraryPage = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('Tutti');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [listView, setListView] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [uploadFolder, setUploadFolder] = useState('Altro');
  const [tab, setTab] = useState<'library' | 'upload' | 'link'>('library');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [newFolderName, setNewFolderName] = useState('');
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState('');

  const allFolders = [...DEFAULT_FOLDERS, ...customFolders.filter(f => !DEFAULT_FOLDERS.includes(f))];

  useEffect(() => {
    const update = () => setItems([..._items]);
    _listeners.add(update);
    loadLibrary().then(data => { setItems([...data]); setLoading(false); });
    return () => { _listeners.delete(update); };
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    const newTasks: UploadTask[] = files.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      progress: 0,
      status: 'queued' as const,
    }));
    setTasks(prev => [...prev, ...newTasks]);
    setTab('library');

    for (const task of newTasks) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'uploading' } : t));
      try {
        const result = await uploadFile(task.file, uploadFolder, (p) => {
          setTasks(prev => prev.map(t => t.id === task.id ? { ...t, progress: p } : t));
        });
        await persist([result, ..._items]);
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'done', progress: 100, result } : t));
      } catch (e: any) {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'error', error: e.message } : t));
      }
    }
    // Pulisci task completati dopo 3s
    setTimeout(() => setTasks(prev => prev.filter(t => t.status !== 'done')), 3000);
  }, [uploadFolder]);

  const handleDelete = async (id: string) => {
    if (!confirm('Rimuovere questo file dall\'archivio?')) return;
    await persist(_items.filter(i => i.id !== id));
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // Filtra + ordina
  const filtered = items
    .filter(item => {
      if (folder !== 'Tutti' && item.folder !== folder) return false;
      if (typeFilter === 'image' && isVideo(item)) return false;
      if (typeFilter === 'video' && !isVideo(item)) return false;
      if (search) {
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.folder.toLowerCase().includes(q) || item.format.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.bytes - a.bytes;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: items.length,
    images: items.filter(i => !isVideo(i)).length,
    videos: items.filter(i => isVideo(i)).length,
    size: items.reduce((acc, i) => acc + i.bytes, 0),
  };

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', background: '#0d0d0d' }}>

      {/* ── Header ── */}
      <div style={{ padding: '1.25rem 2rem', borderBottom: '.5px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: '#0a0a0a' }}>
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '.1em', color: '#cdb2ff', marginBottom: 2 }}>
            ARCHIVIO MEDIA
          </h2>
          <div style={{ fontSize: 11, color: '#555' }}>
            {stats.total} file · {stats.images} immagini · {stats.videos} video · {fmt(stats.size)} totali
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Tab switcher */}
          {[
            { key: 'library', label: '🗂 Libreria' },
            { key: 'upload', label: '⬆ Carica' },
            { key: 'link', label: '🔗 Link video' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ padding: '8px 16px', background: tab === t.key ? 'rgba(205,178,255,0.12)' : 'rgba(255,255,255,0.04)', border: `.5px solid ${tab === t.key ? '#cdb2ff44' : '#2a2a2a'}`, borderRadius: 100, color: tab === t.key ? '#cdb2ff' : '#666', fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: '.06em', transition: 'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

        {/* ── Sidebar cartelle ── */}
        <div style={{ width: 180, borderRight: '.5px solid #1e1e1e', overflowY: 'auto', flexShrink: 0, background: '#080808', padding: '1rem 0' }}>
          <div style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#444', padding: '0 16px', marginBottom: 8 }}>Cartelle</div>
          {allFolders.map(f => (
            <button key={f} onClick={() => setFolder(f)}
              style={{ width: '100%', padding: '8px 16px', background: folder === f ? 'rgba(205,178,255,0.08)' : 'transparent', border: 'none', borderLeft: folder === f ? '2px solid #cdb2ff' : '2px solid transparent', color: folder === f ? '#cdb2ff' : '#666', textAlign: 'left', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all .12s' }}>
              <span>{f === 'Tutti' ? '📁 ' : '📂 '}{f}</span>
              <span style={{ fontSize: 9, color: '#444' }}>
                {f === 'Tutti' ? items.length : items.filter(i => i.folder === f).length}
              </span>
            </button>
          ))}

          {/* Nuova cartella */}
          <div style={{ padding: '12px 12px 0', marginTop: 8, borderTop: '.5px solid #1e1e1e' }}>
            <input
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              placeholder="Nuova cartella..."
              onKeyDown={e => {
                if (e.key === 'Enter' && newFolderName.trim()) {
                  const name = newFolderName.trim();
                  if (!allFolders.includes(name)) setCustomFolders(prev => [...prev, name]);
                  setFolder(name);
                  setNewFolderName('');
                }
              }}
              style={{ width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '.5px solid #2a2a2a', borderRadius: 8, color: '#aaa', fontSize: 11, outline: 'none' }}
            />
            <div style={{ fontSize: 9, color: '#444', marginTop: 4 }}>Premi Invio per creare</div>
          </div>
        </div>

        {/* ── Area principale ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {tab === 'upload' && (
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ maxWidth: 600 }}>
                {/* Scelta cartella destinazione */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: '#666', marginBottom: 8 }}>Carica nella cartella</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {allFolders.filter(f => f !== 'Tutti').map(f => (
                      <button key={f} onClick={() => setUploadFolder(f)}
                        style={{ padding: '6px 12px', background: uploadFolder === f ? 'rgba(205,178,255,0.15)' : 'rgba(255,255,255,0.04)', border: `.5px solid ${uploadFolder === f ? '#cdb2ff44' : '#2a2a2a'}`, borderRadius: 100, color: uploadFolder === f ? '#cdb2ff' : '#666', fontSize: 11, cursor: 'pointer', transition: 'all .15s' }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <DropZone onFiles={handleFiles} />
                {/* Task con errori */}
                {tasks.filter(t => t.status === 'error').map(t => (
                  <div key={t.id} style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(255,100,100,0.08)', border: '.5px solid rgba(255,100,100,0.2)', borderRadius: 10, fontSize: 12, color: '#ff8888' }}>
                    <strong>{t.file.name}</strong>: {t.error}
                    <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                      Assicurati che il preset <code style={{ color: '#cdb2ff' }}>ml_default</code> sia attivo su Cloudinary come <strong>Unsigned</strong>.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'link' && (
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
              <InstagramLinkPanel onSave={(url) => {
                // Salva come item speciale
                const item: MediaItem = {
                  id: `link_${Date.now()}`,
                  secure_url: url,
                  resource_type: 'video',
                  format: url.includes('instagram') ? 'instagram' : 'link',
                  bytes: 0,
                  created_at: new Date().toISOString(),
                  name: url.split('/').filter(Boolean).pop() || 'Link video',
                  folder: 'Video',
                  tags: ['link'],
                };
                persist([item, ..._items]);
                setTab('library');
                setFolder('Video');
              }} />
            </div>
          )}

          {tab === 'library' && (
            <>
              {/* ── Toolbar ── */}
              <div style={{ padding: '12px 20px', borderBottom: '.5px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: '#0f0f0f' }}>
                {/* Cerca */}
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                  <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome, cartella, formato..."
                    style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'rgba(255,255,255,0.04)', border: '.5px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none' }} />
                </div>

                {/* Filtro tipo */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '.5px solid #2a2a2a', borderRadius: 8, overflow: 'hidden' }}>
                  {[
                    { key: 'all', label: 'Tutti', icon: <Filter size={11} /> },
                    { key: 'image', label: 'Foto', icon: <FileImage size={11} /> },
                    { key: 'video', label: 'Video', icon: <Film size={11} /> },
                  ].map(f => (
                    <button key={f.key} onClick={() => setTypeFilter(f.key as any)}
                      style={{ padding: '7px 12px', background: typeFilter === f.key ? 'rgba(205,178,255,0.15)' : 'transparent', border: 'none', color: typeFilter === f.key ? '#cdb2ff' : '#555', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all .15s' }}>
                      {f.icon} {f.label}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                  style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '.5px solid #2a2a2a', borderRadius: 8, color: '#666', fontSize: 11, outline: 'none' }}>
                  <option value="date">Più recenti</option>
                  <option value="name">Nome A-Z</option>
                  <option value="size">Dimensione</option>
                </select>

                {/* Vista */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '.5px solid #2a2a2a', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => setListView(false)}
                    style={{ padding: '7px 10px', background: !listView ? 'rgba(205,178,255,0.15)' : 'transparent', border: 'none', color: !listView ? '#cdb2ff' : '#555', cursor: 'pointer' }}>
                    <Grid size={13} />
                  </button>
                  <button onClick={() => setListView(true)}
                    style={{ padding: '7px 10px', background: listView ? 'rgba(205,178,255,0.15)' : 'transparent', border: 'none', color: listView ? '#cdb2ff' : '#555', cursor: 'pointer' }}>
                    <List size={13} />
                  </button>
                </div>

                {/* Upload rapido */}
                <DropZone onFiles={handleFiles} compact />

                {/* Count */}
                <span style={{ fontSize: 11, color: '#444', whiteSpace: 'nowrap' }}>
                  {filtered.length} {filtered.length === 1 ? 'file' : 'file'}
                </span>
              </div>

              {/* ── Griglia / Lista ── */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60%', flexDirection: 'column', gap: 12 }}>
                    <RefreshCw size={24} style={{ color: '#cdb2ff', animation: 'spin 1s linear infinite' }} />
                    <div style={{ fontSize: 13, color: '#555' }}>Caricamento archivio...</div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60%', flexDirection: 'column', gap: 16, color: '#444' }}>
                    {items.length === 0 ? (
                      <>
                        <FolderOpen size={48} style={{ opacity: 0.3 }} />
                        <div style={{ fontSize: 14 }}>Nessun file ancora</div>
                        <div style={{ fontSize: 12 }}>Vai su "Carica" per aggiungere immagini e video</div>
                        <button onClick={() => setTab('upload')}
                          style={{ padding: '10px 20px', background: '#cdb2ff', color: '#000', border: 'none', borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                          Carica il primo file
                        </button>
                      </>
                    ) : (
                      <>
                        <Search size={36} style={{ opacity: 0.3 }} />
                        <div style={{ fontSize: 14 }}>Nessun file corrisponde ai filtri</div>
                        <button onClick={() => { setSearch(''); setFolder('Tutti'); setTypeFilter('all'); }}
                          style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.06)', border: '.5px solid #333', borderRadius: 100, color: '#888', fontSize: 11, cursor: 'pointer' }}>
                          Rimuovi filtri
                        </button>
                      </>
                    )}
                  </div>
                ) : listView ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filtered.map(item => (
                      <MediaCard
                        key={item.id} item={item} listView
                        onPreview={() => setPreview(item)}
                        onDelete={() => handleDelete(item.id)}
                        onCopy={() => copyUrl(item.secure_url, item.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                    {filtered.map(item => (
                      <MediaCard
                        key={item.id} item={item} listView={false}
                        onPreview={() => setPreview(item)}
                        onDelete={() => handleDelete(item.id)}
                        onCopy={() => copyUrl(item.secure_url, item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast upload in corso */}
      <UploadQueue tasks={tasks} />

      {/* Lightbox */}
      {preview && <Lightbox item={preview} onClose={() => setPreview(null)} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MODAL PICKER (usato dall'editor quando clicchi "📁 Archivio")
// ═══════════════════════════════════════════════════════════════

type PickerProps = {
  onSelect: (url: string) => void;
  onClose: () => void;
  filter?: 'image' | 'video' | 'all';
};

export const MediaLibrary = ({ onSelect, onClose, filter = 'all' }: PickerProps) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('Tutti');
  const [tab, setTab] = useState<'library' | 'upload'>('library');
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [uploadFolder, setUploadFolder] = useState('Altro');

  useEffect(() => {
    const update = () => setItems([..._items]);
    _listeners.add(update);
    loadLibrary().then(data => { setItems([...data]); setLoading(false); });
    return () => { _listeners.delete(update); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleFiles = useCallback(async (files: File[]) => {
    const newTasks: UploadTask[] = files.map(f => ({
      id: Math.random().toString(36).slice(2), file: f, progress: 0, status: 'queued' as const,
    }));
    setTasks(prev => [...prev, ...newTasks]);
    setTab('library');
    for (const task of newTasks) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'uploading' } : t));
      try {
        const result = await uploadFile(task.file, uploadFolder, (p) => {
          setTasks(prev => prev.map(t => t.id === task.id ? { ...t, progress: p } : t));
        });
        await persist([result, ..._items]);
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'done', progress: 100 } : t));
      } catch (e: any) {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'error', error: e.message } : t));
      }
    }
    setTimeout(() => setTasks(prev => prev.filter(t => t.status !== 'done')), 3000);
  }, [uploadFolder]);

  const filtered = items.filter(item => {
    if (filter === 'image' && isVideo(item)) return false;
    if (filter === 'video' && !isVideo(item)) return false;
    if (folder !== 'Tutti' && item.folder !== folder) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.folder.toLowerCase().includes(q);
    }
    return true;
  });

  const allFolders = [...new Set(['Tutti', ..._items.map(i => i.folder)])];

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ background: '#161616', border: '.5px solid #2a2a2a', borderRadius: 20, width: '100%', maxWidth: 800, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: '1rem 1.5rem', borderBottom: '.5px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: '#cdb2ff' }}>
              📁 Scegli da archivio
              {filter !== 'all' && <span style={{ fontSize: 10, color: '#666', fontWeight: 400, marginLeft: 8 }}>— solo {filter === 'image' ? 'immagini' : 'video'}</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Tab */}
              {[{ key: 'library', label: '🗂 Libreria' }, { key: 'upload', label: '⬆ Carica nuovo' }].map(t => (
                <button key={t.key} onClick={() => setTab(t.key as any)}
                  style={{ padding: '6px 14px', background: tab === t.key ? 'rgba(205,178,255,0.12)' : 'transparent', border: `.5px solid ${tab === t.key ? '#cdb2ff44' : '#2a2a2a'}`, borderRadius: 100, color: tab === t.key ? '#cdb2ff' : '#666', fontSize: 11, cursor: 'pointer' }}>
                  {t.label}
                </button>
              ))}
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            {tab === 'upload' ? (
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: '#666', marginBottom: 8 }}>Cartella destinazione</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {DEFAULT_FOLDERS.filter(f => f !== 'Tutti').map(f => (
                      <button key={f} onClick={() => setUploadFolder(f)}
                        style={{ padding: '5px 10px', background: uploadFolder === f ? 'rgba(205,178,255,0.15)' : 'rgba(255,255,255,0.04)', border: `.5px solid ${uploadFolder === f ? '#cdb2ff44' : '#2a2a2a'}`, borderRadius: 100, color: uploadFolder === f ? '#cdb2ff' : '#666', fontSize: 10, cursor: 'pointer' }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <DropZone onFiles={handleFiles} />
                {tasks.filter(t => t.status === 'uploading' || t.status === 'queued').map(t => (
                  <div key={t.id} style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginBottom: 3 }}>
                      <span>{t.file.name}</span><span>{t.progress}%</span>
                    </div>
                    <div style={{ height: 3, background: '#2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#cdb2ff', width: `${t.progress}%`, transition: 'width .2s' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Sidebar cartelle */}
                <div style={{ width: 150, borderRight: '.5px solid #1e1e1e', overflowY: 'auto', background: '#0f0f0f', padding: '8px 0' }}>
                  {allFolders.map(f => (
                    <button key={f} onClick={() => setFolder(f)}
                      style={{ width: '100%', padding: '7px 14px', background: folder === f ? 'rgba(205,178,255,0.08)' : 'transparent', border: 'none', borderLeft: folder === f ? '2px solid #cdb2ff' : '2px solid transparent', color: folder === f ? '#cdb2ff' : '#555', textAlign: 'left', cursor: 'pointer', fontSize: 11 }}>
                      {f}
                    </button>
                  ))}
                </div>

                {/* Griglia */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', borderBottom: '.5px solid #1e1e1e' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca..."
                        style={{ width: '100%', padding: '7px 10px 7px 30px', background: 'rgba(255,255,255,0.04)', border: '.5px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
                    {loading ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#444', fontSize: 13 }}>Caricamento...</div>
                    ) : filtered.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#444' }}>
                        {items.length === 0 ? 'Archivio vuoto. Carica dei file!' : 'Nessun file trovato.'}
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                        {filtered.map(item => (
                          <div key={item.id}
                            style={{ background: '#1a1a1a', borderRadius: 10, overflow: 'hidden', border: '.5px solid #2a2a2a', cursor: 'pointer', transition: 'border-color .15s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#cdb2ff'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                          >
                            <div style={{ aspectRatio: '1', background: '#111', overflow: 'hidden', position: 'relative' }}
                              onClick={() => { onSelect(item.secure_url); onClose(); }}>
                              {isVideo(item) ? (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Film size={22} style={{ color: '#cdb2ff' }} />
                                </div>
                              ) : (
                                <img src={thumb(item, 280)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                            <div style={{ padding: '7px 8px' }}>
                              <div style={{ fontSize: 10, color: '#bbb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 5 }}>{item.name}</div>
                              <button onClick={() => { onSelect(item.secure_url); onClose(); }}
                                style={{ width: '100%', padding: '5px', background: '#cdb2ff', color: '#000', border: 'none', borderRadius: 5, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                                Usa
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <UploadQueue tasks={tasks} />
      {preview && <Lightbox item={preview} onClose={() => setPreview(null)} />}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// HOOK per aprire il picker dall'editor
// ═══════════════════════════════════════════════════════════════

export const useMediaLibrary = () => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'image' | 'video' | 'all'>('all');
  const resolveRef = useRef<((url: string) => void) | null>(null);

  const pick = (f: 'image' | 'video' | 'all' = 'all'): Promise<string> => {
    setFilter(f);
    setOpen(true);
    return new Promise(resolve => { resolveRef.current = resolve; });
  };

  const handleSelect = (url: string) => {
    resolveRef.current?.(url);
    setOpen(false);
  };

  const Modal = open
    ? <MediaLibrary onSelect={handleSelect} onClose={() => setOpen(false)} filter={filter} />
    : null;

  return { pick, Modal };
};
