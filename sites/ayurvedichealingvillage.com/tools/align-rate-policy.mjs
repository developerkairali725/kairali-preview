// Narrow reconciliation of existing commercial copy with approved tariff terms.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const S=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(S,p),'utf8');
const json=p=>JSON.parse(read(p));
const load=p=>{const c={window:{}};vm.runInNewContext(read(p),c);return Object.entries(c.window)[0];};
const save=(p,key,d)=>fs.writeFileSync(path.join(S,p),'window.'+key+' = '+JSON.stringify(d)+';\n');
const strings=json('english-candidate/final-rates/strings.en.json');
const t=strings.common.terms;
const policyFile='public/ahv/assets/policy-family-data.js';
const [key,policy]=load(policyFile);
function set(b,text){b.text=text;b.tree={k:'e',tag:b.tag,attrs:b.tag==='h2'?{id:'b'+b.p}:{},c:[{k:'t',v:text}]};}
for(const r of policy.routes){
  if(r.path==='/cancellation-and-refund-policy/'){
    const updates={3:'Submit a booking request through the website, email or phone. '+t.booking[0]+' '+t.booking[1]+' Please retain the hospital’s written confirmation.',6:t.booking[0],9:'More than 30 days before admission',10:t.cancellation[0],11:'Refer to the published tariff and the hospital’s written confirmation for the applicable refund terms.',12:'15 to 30 days before admission',13:t.cancellation[1],14:'The applicable transaction fees and taxes are deducted in this cancellation band.'};
    for(const b of r.blocks)if(updates[b.p])set(b,updates[b.p]);
  }
  if(r.path==='/terms-and-conditions/')for(const b of r.blocks){if(b.p===12)set(b,'Booking confirmation: '+t.booking[0]+' '+t.booking[1]);if(b.p===24)set(b,'Cancellation timeframes: '+t.cancellation.join('. ')+'.');}
}
save(policyFile,key,policy);
const file='public/ahv/assets/commercial-family-data.js';const [ck,commercial]=load(file);
const yoga=commercial.routes.find(r=>r.path==='/yoga-and-meditation-package/');
const tariff=json('english-candidate/final-rates/yoga.json');
const fmt=n=>'₹'+n.toLocaleString('en-US');
const textBlock=text=>({kind:'paragraph',tag:'p',text,tree:[{k:'t',v:text}]});
for(const c of yoga.components)for(const b of c.blocks||[]){
 if(b.kind==='table')for(const row of b.rows){const villa=tariff.villas.find(v=>v.print_name===row.cells[0]?.text);if(!villa)continue;const amounts=tariff.editions.INR.tables.I[villa.id];row.cells.slice(1).forEach((cell,i)=>{cell.text=fmt(amounts[i]);cell.tree=[{k:'t',v:cell.text}];});}
 if(b.text?.startsWith('INR-'))Object.assign(b,textBlock('Published rates and all language editions: /documents/.'));
}
if(!yoga.components.some(c=>c.component==='approved-tariff-terms'))yoga.components.push({component:'approved-tariff-terms',blocks:[
 textBlock('Rates effective 1 October 2026 to 30 September 2027. Per night, per villa, single or double occupancy; taxes included. Minimum seven nights. Deluxe Villa single: ₹21,490 × 7 nights = ₹150,430. Ref. KTAHV/YMT/EN-INR/20260925-R1.'),
 ...strings.yoga.included.map(s=>textBlock('Included: '+s)),...strings.yoga.not_included.map(s=>textBlock('Charged separately: '+s)),...t.booking.slice(0,2).map(textBlock),...t.cancellation.map(textBlock)
]});
save(file,ck,commercial);
console.log('Reconciled 2 policy routes and the foundational yoga rate table.');
