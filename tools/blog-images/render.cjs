// Screenshot degli HTML con Chromium; conversione in webp/jpeg via canvas,
// poi metadati IPTC/XMP "InLab Communication" (metadata.cjs).
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const { addMetadata } = require('./metadata.cjs');
module.exports = async (jobs) => {
  const b = await chromium.launch();
  const pages = {};
  const pageFor = async (scale) => (pages[scale] ||= await b.newPage({ deviceScaleFactor: scale }));
  for (const j of jobs) {
    const p = await pageFor(j.scale || 1);
    await p.setViewportSize({ width: j.w, height: j.h });
    await p.setContent(fs.readFileSync(j.html, 'utf8'));
    const png = await p.screenshot({ type: 'png', fullPage: !!j.full });
    const outputs = j.outputs || [{ out: j.out, type: j.type === 'jpeg' ? 'jpeg' : 'webp', quality: j.type === 'jpeg' ? 0.88 : 0.9 }];
    for (const o of outputs) {
      const mime = o.type === 'jpeg' ? 'image/jpeg' : 'image/webp';
      // o.width: versione ridotta (stesse proporzioni), rimpicciolita a metà per volta per restare nitida
      const data = await p.evaluate(async ([d, mime, q, width]) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
        let src = img, w = img.width, h = img.height;
        const target = width || w;
        while (w > target) {
          const nw = Math.max(target, Math.round(w / 2)), nh = Math.round(img.height * nw / img.width);
          const t = document.createElement('canvas'); t.width = nw; t.height = nh;
          const x = t.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, nw, nh);
          src = t; w = nw; h = nh;
        }
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(src, 0, 0); return c.toDataURL(mime, q).split(',')[1];
      }, [png.toString('base64'), mime, o.quality, o.width || 0]);
      const buf = addMetadata(Buffer.from(data, 'base64'), o.type);
      fs.mkdirSync(path.dirname(o.out), { recursive: true });
      fs.writeFileSync(o.out, buf);
      console.log(path.relative(process.cwd(), o.out), Math.round(buf.length / 1024) + 'KB');
    }
  }
  await b.close();
};
