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
    const mime = j.type === 'jpeg' ? 'image/jpeg' : 'image/webp';
    const data = await p.evaluate(async ([d, mime]) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0); return c.toDataURL(mime, mime === 'image/jpeg' ? 0.88 : 0.9).split(',')[1];
    }, [png.toString('base64'), mime]);
    const buf = addMetadata(Buffer.from(data, 'base64'), j.type === 'jpeg' ? 'jpeg' : 'webp');
    fs.mkdirSync(path.dirname(j.out), { recursive: true });
    fs.writeFileSync(j.out, buf);
    console.log(path.relative(process.cwd(), j.out), Math.round(buf.length / 1024) + 'KB');
  }
  await b.close();
};
