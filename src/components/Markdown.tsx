// Mini renderer Markdown per gli articoli del blog. Produce solo elementi
// React (niente HTML grezzo), quindi un testo scritto in dashboard non può
// iniettare script. Supporta: ## / ### titoli, paragrafi, **grassetto**,
// *corsivo*, [link](url), ![immagine](url), elenchi - e 1., > citazioni, ---.
import React from 'react';

const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i;
const safeUrl = (u: string) => (SAFE_URL.test(u.trim()) ? u.trim() : '');

type Nav = (to: string) => void;

const inline = (text: string, onNavigate?: Nav, keyBase = 'i'): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  // ordine: link, grassetto, corsivo
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0; let m: RegExpExecArray | null; let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${k++}`;
    if (m[1] !== undefined) {
      const href = safeUrl(m[2]);
      if (!href) out.push(m[1]);
      else if (href.startsWith('/')) {
        out.push(<a key={key} href={href} className="md-link" onClick={(e) => {
          if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault(); onNavigate(href);
        }}>{inline(m[1], onNavigate, key)}</a>);
      } else {
        out.push(<a key={key} href={href} className="md-link" target="_blank" rel="noopener noreferrer">{inline(m[1], onNavigate, key)}</a>);
      }
    } else if (m[3] !== undefined) out.push(<strong key={key}>{inline(m[3], onNavigate, key)}</strong>);
    else if (m[4] !== undefined) out.push(<em key={key}>{m[4]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

export const Markdown = ({ source, onNavigate }: { source: string; onNavigate?: Nav }) => {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0; let b = 0;
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    const key = `b${b++}`;
    if (!t) { i++; continue; }

    let m;
    if ((m = t.match(/^(#{2,4})\s+(.*)$/))) {
      const level = m[1].length;
      const Tag = (level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4') as 'h2';
      blocks.push(<Tag key={key}>{inline(m[2], onNavigate, key)}</Tag>);
      i++; continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(t)) { blocks.push(<hr key={key} />); i++; continue; }
    if ((m = t.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/))) {
      const src = safeUrl(m[2]);
      if (src) blocks.push(<figure key={key}><img src={src} alt={m[1]} loading="lazy" decoding="async" />{m[1] && <figcaption>{m[1]}</figcaption>}</figure>);
      i++; continue;
    }
    if (t.startsWith('>')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) { quote.push(lines[i].trim().replace(/^>\s?/, '')); i++; }
      blocks.push(<blockquote key={key}>{inline(quote.join(' '), onNavigate, key)}</blockquote>);
      continue;
    }
    if (/^[-*]\s+/.test(t) || /^\d+[.)]\s+/.test(t)) {
      const ordered = /^\d/.test(t);
      const items: string[] = [];
      const itemRe = ordered ? /^\d+[.)]\s+/ : /^[-*]\s+/;
      while (i < lines.length && itemRe.test(lines[i].trim())) { items.push(lines[i].trim().replace(itemRe, '')); i++; }
      const lis = items.map((it, j) => <li key={j}>{inline(it, onNavigate, `${key}-${j}`)}</li>);
      blocks.push(ordered ? <ol key={key}>{lis}</ol> : <ul key={key}>{lis}</ul>);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,4}\s|>|[-*]\s|\d+[.)]\s|!\[|-{3,}$)/.test(lines[i].trim())) { para.push(lines[i].trim()); i++; }
    if (!para.length) { para.push(t); i++; }
    blocks.push(<p key={key}>{inline(para.join(' '), onNavigate, key)}</p>);
  }
  return <div className="md">{blocks}</div>;
};

/** Testo semplice (per anteprime e dati strutturati). */
export const stripMarkdown = (md: string) => md
  .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[#>*_`]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
