// Screenshot degli HTML con Chromium e conversione in webp (via canvas).
const { chromium } = require('playwright');
const fs = require('fs');
module.exports = async (jobs) => {
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 1 });
  for (const j of jobs) {
    await p.setViewportSize({ width: j.w, height: j.h });
    await p.setContent(fs.readFileSync(j.html, 'utf8'));
    const png = await p.screenshot({ type: 'png', fullPage: !!j.full });
    const webp = await p.evaluate(async (d) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0); return c.toDataURL('image/webp', 0.9).split(',')[1];
    }, png.toString('base64'));
    fs.mkdirSync(require('path').dirname(j.out), { recursive: true });
    fs.writeFileSync(j.out, Buffer.from(webp, 'base64'));
    if (j.png) fs.writeFileSync(j.png, png);
    console.log(j.out, Math.round(Buffer.from(webp,'base64').length/1024)+'KB');
  }
  await b.close();
};
