/** Rebuild the desktop/mobile sitemap from THE site tree (english-candidate/site-tree.json — the tree the left rail renders).
 * Re-run after design import. No route, redirect, canonical or XML index changes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// THE site tree (tools/build-site-tree.mjs) — the same tree the left rail renders (owner, 23 Sep 2026)
const tree=JSON.parse(fs.readFileSync(path.join(SITE,'english-candidate/site-tree.json'),'utf8'));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let serial=0;
const count=list=>list.reduce((n,x)=>n+(x.path?1:0)+count(x.children),0);
const ext=h=>h.startsWith('https:')?'<span class="sm-external"> ↗<span class="sm-sr"> External website</span></span>':'';
const search=(trail,n)=>esc([...trail,n.title,n.path||''].join(' '));
const node=(n,depth,trail)=>{
 if(!n.children.length) return `<li data-leaf data-search="${search(trail,n)}"><a data-link="1" href="${esc(n.path)}">${esc(n.title)}${ext(n.path)}</a></li>`;
 const id='sm-branch-'+(++serial), c=count(n.children)+(n.path?1:0);
 const head=n.path?`<a class="sm-parent" data-link="1" href="${esc(n.path)}">${esc(n.title)}</a>`:`<span class="sm-group">${esc(n.title)}</span>`;
 return `<li data-child><details id="${id}" class="sm-branch sm-depth-${depth}" data-branch data-title="${esc(n.title)}" data-search="${search(trail,n)}"${n.path?' data-self="1"':''}><summary><span class="sm-toggle" aria-hidden="true"></span>${head}<span class="sm-count">${c}<span class="sm-sr"> ${c===1?'page':'pages'}</span></span></summary><ul>${n.children.map(k=>node(k,depth+1,[...trail,n.title])).join('')}</ul></details></li>`;
};
// Advertising destinations stay served and in the site tree, but are not visitor-directory entries.
const sections=tree.sections.filter(sec=>sec.id!=='campaigns');
const trees=sections.map((sec,i)=>{
 const id='sm-branch-'+(++serial), c=count(sec.children)+(sec.hub?1:0);
 const head=sec.hub?`<a class="sm-parent" data-link="1" href="${esc(sec.hub)}">${esc(sec.title)}</a>`:`<span class="sm-group">${esc(sec.title)}</span>`;
 return `<details id="${id}" class="sm-branch sm-depth-0" data-branch data-title="${esc(sec.title)}" data-search="${esc(sec.title+' '+(sec.hub||''))}"${sec.hub?' data-self="1"':''} ${i===0?'open':''}><summary><span class="sm-toggle" aria-hidden="true"></span>${head}<span class="sm-count">${c}<span class="sm-sr"> ${c===1?'page':'pages'}</span></span></summary><ul>${sec.children.map(k=>node(k,1,[sec.title])).join('')}</ul></details>`;
});
const rootIds=trees.map(t=>t.match(/id="([^"]+)"/)[1]);
const data={roots:sections.map(s=>s.title),links:Object.keys(tree.index).filter(p=>tree.index[p].section!=='campaigns')};
const css=`
.sm-shell{background:#F7F4EA;color:#2A2118;font-family:Mulish,sans-serif;font-size:18px;line-height:1.6;-webkit-font-smoothing:antialiased}
.sm-shell *{box-sizing:border-box}.sm-shell [hidden]{display:none!important}
.sm-shell a,.sm-shell button,.sm-shell summary{text-transform:none!important;letter-spacing:normal!important}
.sm-shell a{color:#006038}.sm-shell a:hover{text-decoration:underline;text-underline-offset:4px}
.sm-shell :focus-visible{outline:2px solid #006038;outline-offset:4px}
.sm-wrap{width:min(1200px,calc(100% - 64px));margin:auto}
.sm-intro{padding:38px 0 28px;border-bottom:1px solid #DAD5CA}
.sm-breadcrumb{font-size:16px;display:flex;gap:12px;margin-bottom:28px}.sm-breadcrumb a{min-height:44px;display:inline-flex;align-items:center}.sm-breadcrumb span{display:inline-flex;align-items:center}
.sm-intro .sm-kicker{color:#75695A;margin:0 0 12px;font-size:16px}
.sm-intro h1{font:400 clamp(38px,5vw,58px)/1.15 Marcellus,serif;margin:0 0 18px;letter-spacing:-1px}
.sm-intro p{max-width:64ch;margin:0;color:#514A3F}
.sm-entry-paths{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;padding:24px 0;border-bottom:1px solid #DAD5CA}.sm-entry-paths a{display:flex;flex-direction:column;justify-content:center;min-height:92px;padding:16px 20px;background:#EDEADF;text-decoration:none;border-left:2px solid #8F6212}.sm-entry-paths strong{font:400 23px/1.3 Marcellus,serif}.sm-entry-paths span{font-size:16px;color:#514A3F;margin-top:6px}
.sm-tools{padding:24px 0;display:flex;gap:12px;align-items:end;flex-wrap:wrap}
.sm-field{flex:1 1 380px}.sm-field label{display:block;font-size:16px;font-weight:700;margin:0 0 8px}.sm-input-row{display:flex;align-items:center;background:white;border:1px solid #A49A88;border-radius:4px;overflow:hidden}.sm-input-row:focus-within{outline:2px solid #006038;outline-offset:2px}.sm-input-row input{width:100%;min-width:0;min-height:54px;padding:12px 16px;font:inherit;color:inherit;border:0;background:transparent;outline:none}.sm-input-row button{border:0!important}
.sm-shell button{min-height:48px;padding:10px 16px;background:transparent;border:1px solid #BEB5A5;border-radius:4px;color:#006038;font:600 16px/1.4 Mulish,sans-serif;cursor:pointer}.sm-shell button:hover{background:#EAE6DA}.sm-shell button:disabled{opacity:.5;cursor:default}
.sm-status{font-size:16px;color:#655C4F;margin:0 0 24px}
.sm-layout{display:grid;grid-template-columns:250px minmax(0,1fr);gap:48px;align-items:start;padding-bottom:64px}
.sm-index{position:sticky;top:95px}.sm-index h2{font-size:16px;margin:0 0 12px;color:#75695A;font-weight:600}.sm-index ol{padding:0;list-style:none;margin:0}.sm-index a{display:flex;gap:12px;align-items:baseline;padding:9px 0;min-height:44px;text-decoration:none;font-size:16px;line-height:1.45}.sm-index .sm-number{font-variant-numeric:tabular-nums;color:#8F6212;font-size:14px}.sm-index a[aria-current]{font-weight:700}
.sm-tree{border-top:1px solid #C9BFA8;min-width:0}.sm-tree summary{cursor:pointer;display:flex;align-items:baseline;gap:12px;list-style:none;min-height:48px;padding:13px 0;color:#2A2118;font-weight:600;line-height:1.45}.sm-tree summary::-webkit-details-marker{display:none}.sm-tree summary:hover{color:#006038}.sm-tree summary .sm-parent{color:#006038;text-decoration:none;font-weight:700}.sm-tree summary .sm-parent:hover{text-decoration:underline;text-underline-offset:4px}.sm-tree summary .sm-group{color:#2A2118}.sm-depth-0>summary .sm-parent,.sm-depth-0>summary .sm-group{font:400 clamp(22px,2.2vw,27px)/1.3 Marcellus,serif}\n.sm-toggle{flex:0 0 12px;font:400 22px/1 serif;color:#8F6212}.sm-toggle:before{content:'+'}.sm-branch[open]>summary>.sm-toggle:before{content:'−'}.sm-depth-0{border-bottom:1px solid #C9BFA8;scroll-margin-top:96px}.sm-depth-0>summary{font:400 26px/1.3 Marcellus,serif;padding:20px 0}.sm-count{margin-left:auto;flex-shrink:0;font:400 14px/1.4 Mulish,sans-serif;color:#75695A;font-variant-numeric:tabular-nums;padding-right:6px}.sm-tree ul{list-style:none;margin:0 0 16px 6px;padding:0 0 0 22px;border-left:1px solid #C9BFA8}.sm-tree li{position:relative;min-width:0}.sm-tree li:before{content:''!important;background:none!important;transform:none!important;position:absolute;left:-22px;top:25px;width:14px;border-top:1px solid #C9BFA8}.sm-tree li[data-leaf] a{display:block;font-size:17px;line-height:1.5;min-height:46px;padding:10px 0;text-decoration:none;overflow-wrap:anywhere}.sm-tree li[data-leaf] a:hover{text-decoration:underline;background:#EDEADF}.sm-depth-2>summary{font-size:17px}.sm-external{white-space:nowrap}.sm-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.sm-empty{padding:24px;border-left:2px solid #C1882C;margin:0 0 24px}.sm-help{padding:28px 0 40px;border-top:1px solid #DAD5CA}.sm-help p{max-width:65ch}.sm-help a{display:inline-flex;align-items:center;min-height:44px;margin-right:24px}
@media(max-width:800px){.sm-entry-paths{grid-template-columns:1fr;gap:12px}.sm-entry-paths strong{font-size:21px}.sm-wrap{width:calc(100% - 36px)}.sm-layout{grid-template-columns:1fr;gap:20px}.sm-index{position:static}.sm-index ol{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}.sm-index a{font-size:15px}.sm-intro{padding-top:20px}.sm-breadcrumb{margin-bottom:16px}.sm-tools{gap:8px}.sm-field{flex-basis:100%}.sm-depth-0>summary{font-size:23px}.sm-tree ul{padding-left:16px}.sm-tree li:before{left:-16px;width:10px}.sm-status{margin-bottom:16px}}
@media print{.sm-tools,.sm-index{display:none}.sm-layout{display:block}.sm-branch>ul{display:block!important}.sm-wrap{width:100%}}
`;
const template=`<helmet><style>${css}</style></helmet><div class="sm-shell" ref="{{ rootRef }}"><dc-import name="AHV Chrome Header" hint-size="100%,72px"></dc-import><main class="sm-wrap" id="sm-content"><header class="sm-intro"><nav class="sm-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><span aria-current="page">Sitemap</span></nav><p class="sm-kicker">Kairali — The Ayurvedic Healing Village</p><h1>A place for every page.</h1><p>Browse our main pages, organised into the same sections as the site navigation. Open a section to see the pages inside it, or search for a treatment, a villa or a place.</p></header><nav class="sm-entry-paths" aria-label="Explore programmes"><a href="/ayurvedic-treatments/"><strong>Ayurvedic treatments by condition</strong><span>Browse programmes by health concern</span></a><a href="/wellness-programs/"><strong>Preventive &amp; wellness programmes</strong><span>Explore rejuvenation and preventive care</span></a></nav><div class="sm-tools"><div class="sm-field"><label for="sm-filter">Find a page in the tree</label><div class="sm-input-row"><input id="sm-filter" type="search" data-filter autocomplete="off" placeholder="Try back pain, villas or training…"><button type="button" data-clear hidden>Clear</button></div></div><button type="button" data-expand>Expand all</button><button type="button" data-collapse>Collapse all</button></div><p class="sm-status" data-status aria-live="polite">${data.links.length} pages across ${data.roots.length} sections</p><div class="sm-layout"><nav class="sm-index" aria-label="Sitemap sections"><h2>Browse the sections</h2><ol>${data.roots.map((r,i)=>`<li><a href="#${rootIds[i]}" data-jump="${rootIds[i]}"><span class="sm-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span>${esc(r)}</span></a></li>`).join('')}</ol></nav><div><p class="sm-empty" data-empty hidden>No matching pages. Try another word, or clear the search to explore every section.</p><div class="sm-tree" aria-label="Site hierarchy">${trees.join('')}</div></div></div><section class="sm-help"><h2>Need help choosing?</h2><p>Contact the patient care team for guidance on treatments, programmes and your visit.</p><a href="/online-consultation/">Doctor consultation</a><a href="https://wa.me/919289838797">WhatsApp patient care</a><a href="/enquiry-form/">Enquire now</a></section></main><dc-import name="AHV Chrome Footer" hint-size="100%,560px"></dc-import></div>`;
const logic=`class Component extends DCLogic {
 renderVals(){return {rootRef: el => {this.root=el;}};}
 componentDidMount(){this.wire();}
 componentDidUpdate(){this.wire();}
 wire(){
  const root=this.root;if(!root||this.wired)return;
  const input=root.querySelector('[data-filter]');if(!input)return;this.wired=true;
  const leaves=Array.from(root.querySelectorAll('[data-leaf]'));
  const branches=Array.from(root.querySelectorAll('[data-branch]'));
  if(branches[0])branches[0].open=true;
  const clear=root.querySelector('[data-clear]'),status=root.querySelector('[data-status]'),empty=root.querySelector('[data-empty]');
  const expand=root.querySelector('[data-expand]'),collapse=root.querySelector('[data-collapse]');
  const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  // typo-tolerant, like every search on the site (D-20260922-26): a query word hits when the text contains it,
  // a text word starts with it, or (5+ letters) a text word is within one edit of it
  const dl=(a,b)=>{if(Math.abs(a.length-b.length)>1)return 2;const d=[];for(let i=0;i<=a.length;i++){d[i]=[i];}for(let j=0;j<=b.length;j++){d[0][j]=j;}for(let i=1;i<=a.length;i++){for(let j=1;j<=b.length;j++){const c=a[i-1]===b[j-1]?0:1;d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);}}return d[a.length][b.length];};
  const hit=(text,w)=>{if(text.includes(w))return true;const tw=text.split(' ');if(tw.some(t=>t.startsWith(w)))return true;return w.length>=5&&tw.some(t=>t.length>=4&&dl(t,w)<=1);};
  let saved=null;
  const apply=()=>{
   const words=norm(input.value).split(' ').filter(Boolean);const active=words.length>0;
   if(active&&!saved)saved=new Map(branches.map(d=>[d,d.open]));
   let hits=0;leaves.forEach(li=>{const text=norm(li.getAttribute('data-search')||'');li.hidden=!words.every(w=>hit(text,w));if(!li.hidden)hits++;});
   branches.slice().reverse().forEach(d=>{const self=active&&d.hasAttribute('data-self')&&words.every(w=>hit(norm(d.getAttribute('data-search')||''),w));if(self)hits++;const any=!active||self||Array.from(d.querySelectorAll('[data-leaf]')).some(l=>!l.hidden)||Array.from(d.querySelectorAll('[data-branch]')).some(b=>!b.hidden);d.hidden=!any;if(d.parentElement.hasAttribute('data-child'))d.parentElement.hidden=!any;if(active&&any)d.open=true;else if(!active&&saved)d.open=saved.get(d);});
   if(!active)saved=null;clear.hidden=!input.value;empty.hidden=hits>0;expand.disabled=active;collapse.disabled=active;
   status.textContent=active ? hits+' matching '+(hits===1?'page':'pages')+' — shown inside their sections' : '${data.links.length} pages across ${data.roots.length} sections';
  };
  input.addEventListener('input',apply);clear.addEventListener('click',()=>{input.value='';apply();input.focus();});
  expand.addEventListener('click',()=>branches.forEach(d=>d.open=true));collapse.addEventListener('click',()=>branches.forEach(d=>d.open=false));
  root.querySelectorAll('[data-jump]').forEach(a=>a.addEventListener('click',e=>{const d=root.querySelector('#'+a.getAttribute('data-jump'));if(!d)return;e.preventDefault();input.value='';apply();d.open=true;d.scrollIntoView({block:'start'});d.querySelector('summary').focus({preventScroll:true});}));
  window.addEventListener('beforeprint',()=>{this.printOpen=branches.map(d=>d.open);branches.forEach(d=>d.open=true);});
  window.addEventListener('afterprint',()=>{if(this.printOpen)branches.forEach((d,i)=>d.open=this.printOpen[i]);});
  apply();
 }
}`;
for(const variant of ['desktop','mobile']){
 const file=path.join(SITE,'public/ahv/views/ahv-page-sitemap-'+variant+'.json');
 // a MOBILE view imports the chrome's narrow half (sticky burger bar); without narrow="true" the desktop header renders at 390
 const tpl=variant==='mobile'?template.replace('<dc-import name="AHV Chrome Header" hint-size="100%,72px"></dc-import>','<dc-import name="AHV Chrome Header" narrow="true" style="position:sticky;top:0;z-index:80" hint-size="100%,64px"></dc-import>').replace('<dc-import name="AHV Chrome Footer" hint-size="100%,560px"></dc-import>','<dc-import name="AHV Chrome Footer" narrow="true" hint-size="100%,900px"></dc-import>'):template;
 const payload=JSON.parse(fs.readFileSync(file,'utf8'));payload.template=tpl;payload.logic=logic;
 fs.writeFileSync(file,JSON.stringify(payload));
 const cap=variant[0].toUpperCase()+variant.slice(1);
 fs.writeFileSync(path.join(SITE,'english-candidate/package-overlay/AHV Page Sitemap '+cap+'.dc.html'),`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><script src="./support.js"></script></head><body><x-dc>${template}</x-dc><script type="text/x-dc" data-dc-script>${logic}</script></body></html>`);
}
console.log('Built sitemap from the site tree: '+data.links.length+' pages, '+data.roots.length+' sections, '+serial+' branches; desktop and mobile share one tree.');

// Keep the shared footer correction repeatable after a design re-import.
const footerFile=path.join(SITE,'public/ahv/components/AHV Chrome Footer.dc.html');
const footer=fs.readFileSync(footerFile,'utf8');
fs.writeFileSync(footerFile,footer.replace(/(<a\s[^>]*href=")https:\/\/ayurvedichealingvillage.com\/givefeedback\/("[^>]*>Reviews<\/a>)/g,'$1https://ayurvedichealingvillage.com/read-feedback/$2'));
