// Immagini del blog (hero 1200x630 + infografiche) generate da uno spec JS,
// nello stile del sito. Uso:
//   NODE_PATH=$(npm root -g) node tools/blog-images/gen.cjs tools/blog-images/specs/<slug>.cjs [...]
// Output: public/blog/<slug>/cover.jpg (copertina 1600x900) e <name>.webp per ogni infografica,
// con i metadati IPTC/XMP "InLab Communication" (metadata.cjs).
// Serve Playwright con Chromium (preinstallato negli ambienti cloud).
const fs = require('fs'); const path = require('path'); const os = require('os');
const OUT = path.join(__dirname, '../../public/blog');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'blogimg-'));
const specs = process.argv.slice(2).flatMap(f => [].concat(require(path.resolve(f))));
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const base = (w,h,body) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:${w}px;${h?`height:${h}px;`:''}background:#1e1d1d;color:#F0EDE6;font-family:'Liberation Sans','DejaVu Sans',sans-serif;overflow:hidden;position:relative}
.bgglow{position:absolute;inset:0;background:radial-gradient(circle at 85% 20%,rgba(205,178,255,.18),transparent 45%),radial-gradient(circle at 10% 110%,rgba(205,178,255,.10),transparent 40%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:40px 40px}
.tag{display:inline-block;padding:7px 16px;border-radius:100px;font-size:15px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;background:rgba(205,178,255,.14);color:#cdb2ff;border:1px solid rgba(205,178,255,.35)}
.h{font-weight:700;text-transform:uppercase;letter-spacing:-.01em;line-height:.95;transform-origin:left top}
.acc{color:#cdb2ff}.mut{color:rgba(240,237,230,.64)}
.serif{font-family:'DejaVu Serif',serif;font-style:italic}
.logo{position:absolute;display:flex;align-items:center;gap:10px;font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:rgba(240,237,230,.7)}
.logo b{display:inline-flex;width:34px;height:34px;border-radius:9px;background:#cdb2ff;color:#000;align-items:center;justify-content:center;font-size:15px;letter-spacing:0}
.card{background:#262525;border:1px solid rgba(255,255,255,.08);border-radius:22px}
</style></head><body><div class="bgglow"></div><div class="grid"></div>${body}</body></html>`;
const logo = (pos) => `<div class="logo" style="${pos}"><b>IL</b>InLab Communication</div>`;

function hero(s){ // 1200x675 → copertina 1600x900 (16:9)
  return base(1200,675,`
  <div style="position:absolute;left:64px;top:58px;width:640px">
    <span class="tag">${esc(s.tag)}</span>
    <div class="h" style="font-size:${s.size||66}px;margin-top:30px">${s.title}</div>
    <div class="mut" style="font-size:24px;line-height:1.35;margin-top:26px;max-width:600px">${esc(s.sub)}</div>
  </div>
  <div style="position:absolute;right:48px;top:50%;transform:translateY(-50%);width:430px;height:470px">${s.visual}</div>
  ${logo('left:64px;bottom:44px')}`);
}
function steps(s){ // 1200 x h: lista di passi / checklist
  const n = s.items.length, cols = s.cols || (n>4?2:1);
  const h = null;
  const items = s.items.map((it,i)=>`<div class="card" style="padding:22px 26px;display:flex;gap:20px;align-items:flex-start">
    <div style="flex:none;width:48px;height:48px;border-radius:14px;background:${s.check?'rgba(205,178,255,.14)':'#cdb2ff'};color:${s.check?'#cdb2ff':'#000'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${s.check?26:22}px">${s.check?'✓':i+1}</div>
    <div><div style="font-size:23px;font-weight:700;line-height:1.2">${esc(it[0])}</div><div class="mut" style="font-size:18px;line-height:1.4;margin-top:6px">${esc(it[1])}</div></div></div>`).join('');
  return [base(1200,h,`<div style="position:relative;padding:56px 64px 72px">
    <span class="tag">${esc(s.tag)}</span>
    <div class="h" style="font-size:44px;margin-top:20px">${s.title}</div>
    <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;margin-top:34px">${items}</div></div>
    ${logo('right:64px;top:60px')}`),h];
}
function compare(s){ // due colonne: prima / dopo, vecchio / nuovo
  const col = (c,hi)=>`<div class="card" style="padding:30px;${hi?'border-color:rgba(205,178,255,.5);background:linear-gradient(160deg,#2b2440,#262525)':''}">
    <div style="font-size:16px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${hi?'#cdb2ff':'rgba(240,237,230,.6)'}">${esc(c.label)}</div>
    ${c.items.map(x=>`<div style="display:flex;gap:14px;margin-top:20px;font-size:21px;line-height:1.35"><span style="color:${hi?'#cdb2ff':'rgba(240,237,230,.4)'};font-weight:700">${hi?'→':'–'}</span><span>${esc(x)}</span></div>`).join('')}</div>`;
  const h = null;
  return [base(1200,h,`<div style="position:relative;padding:56px 64px 72px">
    <span class="tag">${esc(s.tag)}</span>
    <div class="h" style="font-size:44px;margin-top:20px">${s.title}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:34px">${col(s.left,false)}${col(s.right,true)}</div></div>
    ${logo('right:64px;top:60px')}`),h];
}
function timeline(s){ // date in orizzontale
  const n=s.items.length, h=null;
  const items=s.items.map((it,i)=>`<div style="position:relative;padding-top:44px">
    <div style="position:absolute;top:8px;left:0;width:22px;height:22px;border-radius:50%;background:${it[3]?'#cdb2ff':'#1e1d1d'};border:3px solid #cdb2ff"></div>
    <div style="font-size:15px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#cdb2ff">${esc(it[0])}</div>
    <div style="font-size:22px;font-weight:700;line-height:1.2;margin-top:10px">${esc(it[1])}</div>
    <div class="mut" style="font-size:17px;line-height:1.4;margin-top:8px">${esc(it[2])}</div></div>`).join('');
  return [base(1200,h,`<div style="position:relative;padding:56px 64px 72px">
    <span class="tag">${esc(s.tag)}</span>
    <div class="h" style="font-size:44px;margin-top:20px">${s.title}</div>
    <div style="position:relative;margin-top:50px"><div style="position:absolute;top:18px;left:0;right:0;height:2px;background:rgba(205,178,255,.35)"></div>
    <div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:26px">${items}</div></div></div>
    ${logo('right:64px;top:60px')}`),h];
}
const jobs=[];
for (const a of specs){
  const dir = path.join(OUT, a.slug); fs.mkdirSync(dir,{recursive:true});
  const hf = path.join(TMP, a.slug + '_hero.html'); fs.writeFileSync(hf, hero(a.hero));
  jobs.push({html:hf,out:path.join(dir,'cover.jpg'),w:1200,h:675,scale:4/3,type:'jpeg'});
  (a.inline||[]).forEach((im)=>{ const [html,h] = ({steps,compare,timeline})[im.type](im);
    const f=path.join(TMP,`${a.slug}_${im.name}.html`); fs.writeFileSync(f,html); jobs.push({html:f,out:path.join(dir,im.name+'.webp'),w:1200,h:200,full:true}); });
}
require('./render.cjs')(jobs);
