import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { Upload, X, Check, Search, Image, Video, Trash2, Copy, ExternalLink } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// ════════════════════════════════════════════════════════════════
// MEDIA LIBRARY — Archivio media con upload Cloudinary + Firestore
// ════════════════════════════════════════════════════════════════

const CLOUD_NAME = 'dp2l14rly';
const API_KEY = '189381191389964';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
const FIRESTORE_DOC = 'app/media_library';

type MediaItem = {
  public_id: string;
  secure_url: string;
  resource_type: 'image' | 'video';
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  created_at: string;
  display_name?: string;
};

const formatBytes = (b: number) => b < 1024*1024 ? `${(b/1024).toFixed(0)}KB` : `${(b/1024/1024).toFixed(1)}MB`;

const loadFromFirestore = async (): Promise<MediaItem[]> => {
  if (!db) return [];
  try {
    const snap = await getDoc(doc(db, 'app', 'media_library'));
    if (snap.exists()) return snap.data().items || [];
  } catch {}
  return [];
};

const saveToFirestore = async (items: MediaItem[]) => {
  if (!db) return;
  try {
    await setDoc(doc(db, 'app', 'media_library'), { items, updated_at: new Date().toISOString() });
  } catch (e) { console.error('Media library save failed', e); }
};

// ─── Upload widget ───────────────────────────────────────────────
const UploadZone = ({ onUpload }: { onUpload: (item: MediaItem) => void }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('upload_preset', 'ml_default');
    formData.append('folder', 'inlab');

    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            onUpload({
              public_id: data.public_id,
              secure_url: data.secure_url,
              resource_type: data.resource_type,
              format: data.format,
              width: data.width,
              height: data.height,
              bytes: data.bytes,
              created_at: data.created_at,
              display_name: file.name,
            });
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.responseText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('POST', UPLOAD_URL);
        xhr.send(formData);
      });
    } catch (e: any) {
      setError(e.message || 'Upload fallito. Verifica che il preset "ml_default" sia abilitato su Cloudinary.');
    }
    setUploading(false);
    setProgress(0);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach(uploadFile);
  };

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragging ? '#cdb2ff' : '#2a2a2a'}`,
          borderRadius: 12,
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'rgba(205,178,255,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all .2s',
          marginBottom: 12,
        }}
      >
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
        <Upload size={24} style={{ color: '#cdb2ff', margin: '0 auto 8px' }} />
        <div style={{ fontSize: 13, color: '#fff', marginBottom: 4 }}>Trascina file o clicca per caricare</div>
        <div style={{ fontSize: 11, color: '#555' }}>Immagini e video — JPG, PNG, MP4, MOV, WebM</div>
      </div>

      {uploading && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginBottom: 4 }}>
            <span>Caricamento...</span><span>{progress}%</span>
          </div>
          <div style={{ height: 4, background: '#2a2a2a', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#cdb2ff', width: `${progress}%`, transition: 'width .2s' }} />
          </div>
        </div>
      )}

      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(255,100,100,0.08)', border: '.5px solid rgba(255,100,100,0.2)', borderRadius: 8, fontSize: 11, color: '#ff8888', marginBottom: 12 }}>
          ⚠ {error}
          <div style={{ marginTop: 6, color: '#888' }}>
            Vai su <strong>Cloudinary → Settings → Upload Presets</strong> e crea un preset chiamato <code style={{ color: '#cdb2ff' }}>ml_default</code> con modalità <strong>Unsigned</strong>.
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Instagram Embed ─────────────────────────────────────────────
const InstagramEmbed = ({ url, onSelect }: { url: string; onSelect: (url: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const [embedData, setEmbedData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchEmbed = async () => {
    if (!url.includes('instagram.com')) { setError('Inserisci un link Instagram valido'); return; }
    setLoading(true); setError(''); setEmbedData(null);
    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&maxwidth=400&fields=thumbnail_url,title,author_name,provider_name&access_token=CLIENT_ID|CLIENT_SECRET`);
      // Fallback: usa oEmbed pubblico
      const res2 = await fetch(`https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}&format=json`);
      if (res2.ok) {
        const data = await res2.json();
        setEmbedData(data);
      } else {
        // Mostra solo il link con anteprima
        setEmbedData({ thumbnail_url: null, author_name: 'Instagram', title: url });
      }
    } catch {
      setEmbedData({ thumbnail_url: null, author_name: 'Instagram', title: url });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '.5px solid #2a2a2a', borderRadius: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: '#cdb2ff', fontWeight: 600, marginBottom: 8 }}>📎 Link Instagram/Video esterno</div>
      <div style={{ fontSize: 10, color: '#555', marginBottom: 8 }}>Il video si aprirà in un overlay inline senza uscire dal sito.</div>
      {embedData && (
        <div style={{ marginBottom: 10, padding: 10, background: '#111', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
          {embedData.thumbnail_url && <img src={embedData.thumbnail_url} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />}
          <div>
            <div style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>{embedData.author_name}</div>
            <div style={{ fontSize: 10, color: '#666' }}>Instagram Reel</div>
          </div>
          <button onClick={() => onSelect(url)} style={{ marginLeft: 'auto', padding: '6px 12px', background: '#cdb2ff', color: '#000', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            Usa questo
          </button>
        </div>
      )}
      <div style={{ fontSize: 11, color: '#888', padding: '8px 12px', background: '#111', borderRadius: 8 }}>
        Il link viene salvato e mostrato come card video nel portfolio. Cliccando si apre il reel in un overlay.
      </div>
    </div>
  );
};

// ─── Media Library principale ────────────────────────────────────
type Props = {
  onSelect: (url: string) => void;
  onClose: () => void;
  filter?: 'image' | 'video' | 'all';
};

export const MediaLibrary = ({ onSelect, onClose, filter = 'all' }: Props) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'library' | 'upload' | 'instagram'>('library');
  const [copied, setCopied] = useState('');
  const [loadingLib, setLoadingLib] = useState(true);

  useEffect(() => {
    loadFromFirestore().then(data => { setItems(data); setLoadingLib(false); });
  }, []);

  const saveItems = async (newItems: MediaItem[]) => {
    setItems(newItems);
    await saveToFirestore(newItems);
  };

  const handleUpload = async (item: MediaItem) => {
    const newItems = [item, ...items];
    await saveItems(newItems);
    setTab('library');
  };

  const handleDelete = async (public_id: string) => {
    if (!confirm('Rimuovere dall\'archivio?')) return;
    await saveItems(items.filter(i => i.public_id !== public_id));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  const filtered = items.filter(item => {
    if (filter === 'image' && item.resource_type !== 'image') return false;
    if (filter === 'video' && item.resource_type !== 'video') return false;
    if (search && !item.public_id.toLowerCase().includes(search.toLowerCase()) && !(item.display_name||'').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#161616', border: '.5px solid #2a2a2a', borderRadius: 20, width: '100%', maxWidth: 860, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '.5px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '.1em', textTransform: 'uppercase', color: '#cdb2ff' }}>📁 Archivio Media</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '.5px solid #2a2a2a' }}>
          {[
            { key: 'library', label: '🗂 Libreria' },
            { key: 'upload', label: '⬆ Carica' },
            { key: 'instagram', label: '📱 Instagram / Link' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ padding: '12px 20px', background: 'transparent', border: 'none', borderBottom: tab === t.key ? '2px solid #cdb2ff' : '2px solid transparent', color: tab === t.key ? '#cdb2ff' : '#666', fontSize: 12, cursor: 'pointer', fontWeight: tab === t.key ? 600 : 400, transition: 'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

          {tab === 'upload' && (
            <div>
              <UploadZone onUpload={handleUpload} />
              <div style={{ fontSize: 11, color: '#444', lineHeight: 1.7 }}>
                I file vengono caricati su <strong style={{ color: '#888' }}>Cloudinary</strong> e salvati nell'archivio. Potrai riutilizzarli in qualsiasi sezione del sito senza ricaricarli.
              </div>
            </div>
          )}

          {tab === 'instagram' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: '1rem', lineHeight: 1.7 }}>
                  Incolla il link di un Reel o video Instagram. Nel portfolio verrà mostrato come card con un pulsante che apre il video in un overlay senza uscire dal sito.
                </div>
                <InstagramLinkSelector onSelect={(url) => { onSelect(url); onClose(); }} />
              </div>
            </div>
          )}

          {tab === 'library' && (
            <div>
              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca file..."
                  style={{ width: '100%', padding: '9px 12px 9px 34px', background: 'rgba(255,255,255,0.04)', border: '.5px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none' }} />
              </div>

              {loadingLib ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#444', fontSize: 13 }}>Caricamento libreria...</div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#444' }}>
                  <Image size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <div style={{ fontSize: 13 }}>{items.length === 0 ? 'Nessun file ancora. Carica qualcosa!' : 'Nessun file corrisponde alla ricerca.'}</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                  {filtered.map(item => (
                    <div key={item.public_id}
                      style={{ background: '#1a1a1a', border: '.5px solid #2a2a2a', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#cdb2ff'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                    >
                      {/* Preview */}
                      <div style={{ aspectRatio: '1', background: '#111', position: 'relative', overflow: 'hidden' }} onClick={() => { onSelect(item.secure_url); onClose(); }}>
                        {item.resource_type === 'image' ? (
                          <img src={item.secure_url} alt={item.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                            <Video size={24} style={{ color: '#cdb2ff' }} />
                            <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase' }}>{item.format}</div>
                          </div>
                        )}
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(205,178,255,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(205,178,255,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(205,178,255,0)'}>
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: 10, color: '#aaa', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.display_name || item.public_id.split('/').pop()}
                        </div>
                        <div style={{ fontSize: 9, color: '#555' }}>{formatBytes(item.bytes)}</div>
                        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                          <button onClick={() => { onSelect(item.secure_url); onClose(); }}
                            style={{ flex: 1, padding: '5px', background: '#cdb2ff', color: '#000', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                            Usa
                          </button>
                          <button onClick={() => copyUrl(item.secure_url)}
                            style={{ padding: '5px 8px', background: copied === item.secure_url ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 6, color: copied === item.secure_url ? '#4ade80' : '#666', cursor: 'pointer' }}>
                            {copied === item.secure_url ? <Check size={11} /> : <Copy size={11} />}
                          </button>
                          <button onClick={() => handleDelete(item.public_id)}
                            style={{ padding: '5px 8px', background: 'rgba(255,100,100,0.08)', border: 'none', borderRadius: 6, color: '#ff8888', cursor: 'pointer' }}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Instagram link selector ──────────────────────────────────────
const InstagramLinkSelector = ({ onSelect }: { onSelect: (url: string) => void }) => {
  const [url, setUrl] = useState('');
  const isValid = url.includes('instagram.com') || url.startsWith('https://');

  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: '#666', marginBottom: 6 }}>URL del video / reel</div>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.instagram.com/reel/..."
        style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '.5px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', marginBottom: 10 }} />

      {url && (
        <div style={{ padding: '12px', background: '#111', borderRadius: 10, marginBottom: 10, fontSize: 12, color: '#888', lineHeight: 1.6 }}>
          <div style={{ color: '#cdb2ff', fontWeight: 600, marginBottom: 4 }}>Come funziona:</div>
          Il link viene salvato nel progetto portfolio. Sul sito, la card mostrerà un'icona play. Cliccando si apre un overlay con il video/reel embedded senza uscire dalla pagina.
        </div>
      )}

      <button onClick={() => isValid && onSelect(url)} disabled={!isValid}
        style={{ width: '100%', padding: '10px', background: isValid ? '#cdb2ff' : '#2a2a2a', color: isValid ? '#000' : '#555', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: isValid ? 'pointer' : 'not-allowed', letterSpacing: '.08em', textTransform: 'uppercase' }}>
        Salva link
      </button>
    </div>
  );
};

// ─── Hook per aprire la media library ────────────────────────────
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

  const Modal = open ? <MediaLibrary onSelect={handleSelect} onClose={() => setOpen(false)} filter={filter} /> : null;

  return { pick, Modal };
};
