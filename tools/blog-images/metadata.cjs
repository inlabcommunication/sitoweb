// Metadati IPTC (IIM) e XMP per le immagini del blog: autore, crediti e
// copyright "InLab Communication". Google Immagini li mostra come crediti.
// Inserisce i dati nel file senza ricomprimere i pixel.
// Uso diretto su file esistenti: node tools/blog-images/metadata.cjs public/blog/<slug>/*.{jpg,webp}
const fs = require('fs');

const CREATOR = 'InLab Communication';
const CREDIT = 'InLab Communication';
const COPYRIGHT = '© InLab Communication';

const XMP = Buffer.from(`<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
   <dc:creator><rdf:Seq><rdf:li>${CREATOR}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${COPYRIGHT}</rdf:li></rdf:Alt></dc:rights>
   <photoshop:Credit>${CREDIT}</photoshop:Credit>
   <xmpRights:Marked>True</xmpRights:Marked>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`, 'utf8');
const XMP_NS = Buffer.from('http://ns.adobe.com/xap/1.0/\0', 'latin1');

const u16be = (n) => { const b = Buffer.alloc(2); b.writeUInt16BE(n); return b; };
const u32be = (n) => { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b; };
const u32le = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };

function iim() {
  const ds = (rec, tag, val) => Buffer.concat([Buffer.from([0x1c, rec, tag]), u16be(val.length), val]);
  const data = Buffer.concat([
    ds(1, 90, Buffer.from('\x1b%G', 'latin1')), // set di caratteri UTF-8
    ds(2, 80, Buffer.from(CREATOR)), ds(2, 110, Buffer.from(CREDIT)), ds(2, 116, Buffer.from(COPYRIGHT)),
  ]);
  const parts = [Buffer.from('Photoshop 3.0\0', 'latin1'), Buffer.from('8BIM'), u16be(0x0404), Buffer.from([0, 0]), u32be(data.length), data];
  if (data.length % 2) parts.push(Buffer.from([0]));
  return Buffer.concat(parts);
}

const seg = (marker, payload) => Buffer.concat([Buffer.from([0xff, marker]), u16be(payload.length + 2), payload]);

function jpeg(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('non è un JPEG');
  if (buf.subarray(0, 4096).includes(XMP_NS)) return null; // già presenti
  let i = 2;
  if (buf[2] === 0xff && buf[3] === 0xe0) i = 4 + buf.readUInt16BE(4); // dopo APP0 (JFIF)
  return Buffer.concat([buf.subarray(0, i), seg(0xe1, Buffer.concat([XMP_NS, XMP])), seg(0xed, iim()), buf.subarray(i)]);
}

function webp(buf) {
  if (buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') throw new Error('non è un WebP');
  const chunks = []; let i = 12;
  while (i < buf.length) {
    const id = buf.toString('latin1', i, i + 4); const size = buf.readUInt32LE(i + 4);
    chunks.push([id, buf.subarray(i + 8, i + 8 + size)]); i += 8 + size + (size & 1);
  }
  if (chunks.some((c) => c[0] === 'XMP ')) return null;
  if (chunks[0][0] !== 'VP8X') { // immagine semplice: serve il chunk VP8X con le dimensioni
    const d = chunks[0][1]; let w, h;
    if (chunks[0][0] === 'VP8 ') { w = d.readUInt16LE(6) & 0x3fff; h = d.readUInt16LE(8) & 0x3fff; }
    else { const b = d.readUInt32LE(1); w = (b & 0x3fff) + 1; h = ((b >>> 14) & 0x3fff) + 1; }
    const x = Buffer.alloc(10); x.writeUIntLE(w - 1, 4, 3); x.writeUIntLE(h - 1, 7, 3);
    chunks.unshift(['VP8X', x]);
  }
  const vp8x = Buffer.from(chunks[0][1]); vp8x[0] |= 0x04; chunks[0][1] = vp8x; // flag XMP
  chunks.push(['XMP ', XMP]);
  const body = Buffer.concat(chunks.flatMap(([id, d]) => [Buffer.from(id, 'latin1'), u32le(d.length), d, d.length & 1 ? Buffer.from([0]) : Buffer.alloc(0)]));
  return Buffer.concat([Buffer.from('RIFF'), u32le(4 + body.length), Buffer.from('WEBP'), body]);
}

/** Aggiunge i metadati; restituisce il buffer invariato se ci sono già. */
const addMetadata = (buf, type) => (type === 'jpeg' ? jpeg(buf) : webp(buf)) || buf;
module.exports = { addMetadata };

if (require.main === module) {
  for (const f of process.argv.slice(2)) {
    const b = fs.readFileSync(f);
    const out = addMetadata(b, f.endsWith('.jpg') || f.endsWith('.jpeg') ? 'jpeg' : 'webp');
    if (out === b) { console.log('già presenti', f); continue; }
    fs.writeFileSync(f, out); console.log(f, Math.round(b.length / 1024) + ' KB -> ' + Math.round(out.length / 1024) + ' KB');
  }
}
