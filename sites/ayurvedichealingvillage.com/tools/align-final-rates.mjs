/** Align the existing English candidate with the approved 20260925-R1 tariff.
 * Run with --batch 0 or --batch 1 (at most 25 programme routes per invocation).
 * Source PDFs and the imported source JSON remain unchanged.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const S = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(S,p),'utf8');
const json = p => JSON.parse(read(p));
const write = (p,s) => fs.writeFileSync(path.join(S,p),s);
const J = (p,d) => write(p,JSON.stringify(d,null,2)+'\n');
const rates = Object.fromEntries(['ayurveda','yoga','training','accommodation','opd'].map(k=>[k,json(`english-candidate/final-rates/${k}.json`)]));
const strings = json('english-candidate/final-rates/strings.en.json');
const manifest = json('english-candidate/route-manifest.json').routes;
const fmt = (n,c) => ({INR:'₹',USD:'$',EUR:'€'}[c])+n.toLocaleString('en-US');
const plain = s => s.replace(/&amp;/g,'&');
const esc = s => s.replace(/&(?!(?:amp|lt|gt|quot);)/g,'&amp;').replace(/</g,'&lt;');
const list = items => '<ul>'+items.map(s=>'<li>'+s+'</li>').join('')+'</ul>';
const records = {};
for (const family of ['ayurveda','yoga']) for (const g of rates[family].groups) for(const p of g.programmes) {
  records[new URL(p.url).pathname] = {family,group:g.id,nights:p.min_nights,validity:rates[family].editions.INR.validity,
    tables:Object.fromEntries(['INR','USD','EUR'].map(c=>[c,rates[family].editions[c].tables[g.id]]))};
}
// Existing approved yoga-training page uses the foundational yoga tariff band.
records['/yoga-meditation-training/']={...records['/yoga-and-meditation-package/'],aliasOf:'/yoga-and-meditation-package/'};
for (const c of rates.training.courses) records[new URL(c.url).pathname]={family:'training',nights:c.days,validity:rates.training.validity,tables:Object.fromEntries(['INR','USD','EUR'].map(cur=>[cur,Object.fromEntries(rates.training.villas.map(v=>[v.id,rates.training.tables[v.id][cur]]))]))};
records['/ayurveda-training-programme/']={...records[new URL(rates.training.courses[0].url).pathname],hub:true};
function ref(r){return `KTAHV/${{ayurveda:'AYT',yoga:'YMT',training:'TRG'}[r.family]}/EN-INR/20260925-R1`;}
function range(r){return `${new Date(r.validity.from+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})} to 30 September 2027`;}
function terms(r){return '<p>Rates effective '+range(r)+'. Per night, per villa, by occupancy; all government taxes included.</p><h3>Booking and payment</h3>'+list(strings.common.terms.booking.slice(0,2))+'<h3>Admission and discharge</h3>'+list(strings.common.terms.admission)+'<h3>Cancellation</h3>'+list(strings.common.terms.cancellation)+'<h3>Children</h3>'+list(strings.common.terms.children)+'<p>See the <a href="/documents/">published tariff</a> for full inclusions, exclusions and terms. '+ref(r)+'.</p>';}
function replaceConst(logic,name,transform){
  const re=new RegExp('const '+name+'\\s*=\\s*'); const m=re.exec(logic); if(!m)return logic;
  const start=m.index+m[0].length; let i=start,depth=0,quote=null,escape=false;
  for(;i<logic.length;i++){const ch=logic[i];if(quote){if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch===quote)quote=null;continue;}if(ch==='"'||ch==="'"){quote=ch;continue;}if(ch==='{'||ch==='[')depth++;if(ch==='}'||ch===']'){depth--;if(!depth){i++;break;}}}
  const obj=vm.runInNewContext('('+logic.slice(start,i)+')');return logic.slice(0,start)+JSON.stringify(transform(obj))+logic.slice(i);
}
function details(template,label,body){
  return template.replace(/<details\b[^>]*>[\s\S]*?<\/details>/g,block=>{
    const sm=block.match(/<summary\b[^>]*>[\s\S]*?<\/summary>/);if(!sm||!label.test(sm[0]))return block;
    return block.slice(0,block.indexOf(sm[0])+sm[0].length)+'<div style="padding:16px 0 28px;font-size:16px;line-height:1.75">'+body+'</div></details>';
  });
}
const batch=Number(process.argv[process.argv.indexOf('--batch')+1]);
if(!Number.isInteger(batch)||batch<0||batch>1)throw Error('Specify --batch 0 or --batch 1');
const selected=Object.entries(records).slice(batch*25,(batch+1)*25);
const changed=[];
for (const [route,r] of selected){
  const row=manifest.find(m=>m.path===route);if(!row)throw Error('Missing route '+route);
  for(const view of new Set([row.desktopView,row.mobileView])){
    if(!view)continue; const file='public/ahv/views/'+view+'.json';const d=json(file);
    if(r.family!=='training'){
      d.logic=replaceConst(d.logic,'villaData',obj=>{for(const [c,vs] of Object.entries(obj)){const cur=c==='EURO'?'EUR':c;for(let i=0;i<vs.length;i++){let pair=r.tables[cur][['deluxe','classic','royal','suite'][i]];vs[i].single=fmt(pair[0],cur);vs[i].double=fmt(pair[1],cur);}}return obj;});
      d.logic=replaceConst(d.logic,'tableData',obj=>{for(const [c,vs] of Object.entries(obj)){const cur=c==='EURO'?'EUR':c;vs.forEach((v,i)=>{const pair=r.tables[cur][['deluxe','classic','royal','suite'][i]];v[1]=fmt(pair[0],cur);v[2]=fmt(pair[1],cur);});}return obj;});
      d.template=details(d.template,/Terms\s*(?:&amp;|&)\s*Conditions/i,terms(r));
      d.template=details(d.template,/Inclusions/i,'<h3>Included</h3>'+list(strings[r.family].included)+'<h3>Charged separately</h3>'+list(strings[r.family].not_included));
      d.template=d.template.replace(/Minimum Duration is \d+ Nights/g,'Minimum Duration is '+r.nights+' Nights');
      const notice='<p data-rate-reference="'+ref(r)+'" style="margin:16px 0;font-size:15px;line-height:1.6">Rates effective '+range(r)+'. Single: one person; double: two people sharing the villa. Minimum '+r.nights+' nights. <a href="/documents/">View the published tariff</a>.</p>';
      if(!d.template.includes('data-rate-reference='))d.template=d.template.replace(/(<p[^>]*>Villas — Minimum Duration[^<]*<\/p>)/, '$1'+notice);
    }else{
      const rows=rates.training.villas.map(v=>'<tr><th scope="row">'+v.print_name+'</th><td>'+fmt(r.tables.INR[v.id][0],'INR')+'</td><td>'+fmt(r.tables.INR[v.id][1],'INR')+'</td></tr>').join('');
      const block='<section data-rate-reference="'+ref(r)+'" style="width:min(1100px,92%);margin:32px auto;padding:24px 0;line-height:1.7"><h2>Residential training tariff</h2><p>Rates effective '+range(r)+'. Per night, per villa; accommodation, meals, training and taxes included.</p><div style="overflow-x:auto"><table style="width:100%;text-align:left;border-collapse:collapse"><thead><tr><th>Villa</th><th>Single occupancy</th><th>Double occupancy</th></tr></thead><tbody>'+rows+'</tbody></table></div><p>'+(r.hub?'Courses run for 1, 3, 5, 10 or 20 nights. Multiply the per-night rate by the chosen course duration.':r.nights+'-night course: Deluxe Villa single-occupancy total '+fmt(r.tables.INR.deluxe[0]*r.nights,'INR')+' ('+fmt(r.tables.INR.deluxe[0],'INR')+' × '+r.nights+' nights).')+'</p><p>Classes run Monday to Friday. Personal treatments and optional services are charged separately. Group discount: 20% for five or more students.</p><details><summary>Booking and cancellation terms</summary>'+terms(r)+'</details></section>';
      if(!d.template.includes('data-rate-reference=')){
        const pos=d.template.indexOf('<footer');d.template=pos>=0?d.template.slice(0,pos)+block+d.template.slice(pos):d.template+block;
      }
    }
    J(file,d);
  }
  changed.push(route);
}
// The shared 38-record finder is updated in the same bounded programme batches.
const ctx={window:{}};vm.runInNewContext(read('public/ahv/assets/all-programs-data.js'),ctx);const finder=ctx.window.AHV_FINDER;
for(const [route,r] of selected){const p=finder.programmes.find(p=>p.route===route);if(!p)throw Error('Missing finder '+route);p.minimumNights=r.nights;p.validFrom=r.validity.from;p.validTo=r.validity.to;p.from=Object.fromEntries(['INR','USD','EUR'].map(c=>[c,r.tables[c].deluxe[0]*(r.family==='training'?1:r.nights)]));p.sourceRef=ref(r)+(r.aliasOf?' — existing foundational yoga tariff mapping':'');if(r.family==='training')p.priceBasisNote='Per night, Deluxe Villa, single occupancy, all-inclusive stay for the course duration.';}
finder.copy.tariffNote='See each programme’s effective dates. Ayurveda rates run through 30 September 2027; yoga and training rates apply from 1 October 2026 to 30 September 2027. For dates outside the published period, request a quote.';
finder.metadata={...finder.metadata,rateRevision:'20260925-R1'};
write('public/ahv/assets/all-programs-data.js','window.AHV_FINDER = '+JSON.stringify(finder)+';\n');
J('english-candidate/final-rates/route-map.json',records);
console.log(JSON.stringify({batch,routes:changed}));
