/** Owner's 24 Sep final five-route design. Reapply AFTER the general importer.
 * Patch only room amenities/binding to retain later site repairs and datasets.
 * Shared chrome, tracking, routing hierarchy and other pages are never imported.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {parseView,rewriteUrls} from './import-english-candidate.mjs';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(site,'english-candidate/package-overlay/revisions/20260924');
const views=path.join(site,'public/ahv/views');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const manifestPath=path.join(site,'english-candidate/route-manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath));
const changes=[];
for(const category of ['Gallery','Maharaja Suite','Deluxe Villa','Royal Villa','Classic Villa']) {
 const slug=category.toLowerCase().replaceAll(' ','-');
 for(const variant of ['desktop','mobile']) {
  const file=`AHV Page ${category} ${variant[0].toUpperCase()+variant.slice(1)} 2026 Candidate.dc.html`;
  const raw=fs.readFileSync(path.join(source,file),'utf8');
  const parsed=parseView(raw);
  const id=`ahv-page-${slug}-${variant}`;
  const dest=path.join(views,id+'.json');
  let payload;
  if(category==='Gallery') {
   // Use the site-local fonts already shipped; no new external font request.
   parsed.template=parsed.template.replace(/<link[^>]+href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>/g,'');
   payload={id,file,sourceSha256:hash(raw),variant,template:parsed.template,logic:parsed.logic,props:parsed.props,scripts:parsed.scripts};
  } else {
   payload=JSON.parse(fs.readFileSync(dest,'utf8'));
   const re=/<section\b[^>]*id="amenities"[\s\S]*?<\/section>/;
   const section=parsed.template.match(re)?.[0];
   if(!section || !re.test(payload.template)) throw Error(`amenities absent: ${id}`);
   payload.template=payload.template.replace(re,section);
   const key=slug==='maharaja-suite'?'maharaja':slug.split('-')[0];
   const global=key==='maharaja'?'AHV_MAHARAJA':`AHV_${key.toUpperCase()}`;
   if(!payload.logic.includes('AHV_ROOMS_2026.apply')) {
    payload.logic=payload.logic.replace(`const D = window.${global} ||`, `const D = window.AHV_ROOMS_2026.apply('${key}', window.${global}) ||`);
    payload.logic=payload.logic.replace(/(return\s*\{\s*guard:)/,`return { F: window.AHV_ROOMS_2026.features('${key}'), guard:`);
   }
   if(!payload.logic.includes(`features('${key}')`)) throw Error(`feature binding absent: ${id}`);
   if(key==='maharaja') payload.template=payload.template.replace(/>Bed<\/th>/g,'>Layout</th>');
   const script='/ahv/assets/rooms-2026-candidate.js';
   if(!payload.scripts.includes(script))payload.scripts.push(script);
   payload.revision={task:'WOPS-AHV-FINAL-DRAFT-20260924-001',source:file,sha256:hash(raw)};
  }
  fs.writeFileSync(dest,JSON.stringify(payload,null,2)+'\n');
  changes.push({id,sha256:hash(JSON.stringify(payload))});
 }
}
for(const f of ['rooms-2026-candidate.js','gallery-hub-2026-candidate.js'])fs.writeFileSync(path.join(site,'public/ahv/assets',f),rewriteUrls(fs.readFileSync(path.join(source,f),'utf8')));
const gallery=manifest.routes.find(r=>r.path==='/gallery/');
gallery.desktopView='ahv-page-gallery-desktop';gallery.mobileView='ahv-page-gallery-mobile';gallery.dataset=null;
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,1)+'\n');
fs.writeFileSync(path.join(site,'english-candidate/gallery-room-final.json'),JSON.stringify({task:'WOPS-AHV-FINAL-DRAFT-20260924-001',changes},null,2)+'\n');
console.log(`Applied ${changes.length} views to five routes; existing room data and shared chrome retained.`);
