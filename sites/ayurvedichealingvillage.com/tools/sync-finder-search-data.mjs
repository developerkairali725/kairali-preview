#!/usr/bin/env node
// Refresh only embedded search data, preserving every design and film section.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const check=process.argv.includes('--check');
const index=JSON.parse(fs.readFileSync(path.join(site,'public/ahv/search-index.json')));
const rows=new Map(index.programmes.map(p=>[p.route,p]));
let changed=0;
for(const route of ['all-programs','ayurvedic-treatments','wellness-programs','treatment-programs','training-programs','yoga-meditation-programs']) for(const side of ['desktop','mobile']) {
 const file=path.join(site,`public/ahv/views/ahv-page-${route}-${side}.json`);
 const text=fs.readFileSync(file,'utf8'), view=JSON.parse(text);
 const m=view.logic.match(/const DATASET = (.*);/);
 if(!m) throw new Error(`Missing dataset: ${file}`);
 const data=[...rows.values()].filter(p => !['ayurvedic-treatments','treatment-programs'].includes(route) || p.cats.includes('T')).map(p => ({
  r:p.route,t:p.name,s:p.sanskrit||'',c:p.cats,n:p.nights,from:p.from,vt:p.validTo,vf:p.validFrom,ps:p.priceState,basis:p.basis,fw:p.forWhat,i:p.image||"/ahv/assets/img/F-6.jpg",a:p.aliases||[],k:p.terms,av:p.availability||'current',bookable:p.bookable!==false
 }));
 let logic=view.logic.replace(m[0],()=>`const DATASET = ${JSON.stringify(data)};`);
 for(const [key,value] of [['CHIPS',index.chips.map(c=>({id:c.id,label:c.label,routes:c.routes}))],['BANDS',index.budgetBands]]) {
  const re=new RegExp('const '+key+' = (.*);');
  if(!re.test(logic)) throw new Error(`Missing ${key} in ${file}`);
  logic=logic.replace(re,()=>`const ${key} = ${JSON.stringify(value)};`);
 }
 // Preserve the accepted template and film sections; change catalogue state only.
 if(!logic.includes('availability:')) {
  logic=logic.replace("budget: '', from:", "budget: '', availability: '', from:");
  logic=logic.replace('const metaFor = (p, cur) => {', "const metaFor = (p, cur) => {\n  if (p.av === 'coming_soon') return 'Coming Soon — enrolment is not open';");
  logic=logic.replace('.filter(inDur).filter(inBudget)', ".filter(inDur).filter(inBudget).filter(p => !st.availability || p.av === st.availability)");
  logic=logic.replace('h: HOST_URL + p.r, t: p.t,', "h: HOST_URL + p.r, canEnquire: p.av !== 'coming_soon', action: p.av === 'coming_soon' ? 'View details' : 'Read the programme', t: p.t,");
  logic=logic.replace('const filtered = !!(chip || st.dur || st.budget);', 'const filtered = !!(chip || st.dur || st.budget || st.availability);');
  logic=logic.replace('chips: chips, durations:', "statuses: [['', 'All availability'], ['current', 'Current offerings'], ['enquiry_only', 'Enquiry-only'], ['coming_soon', 'Coming Soon']].map(pair => Object.assign({ label: pair[1], pick: () => this.setState({ availability: pair[0], dur: '', budget: '' }) }, sel(st.availability === pair[0]))),\n      chips: chips, durations:");
  logic=logic.replace("reset: () => this.setState({ q: '',", "reset: () => this.setState({ q: '', availability: '',");
 }
 logic=logic.replace("'Explore all ' + DATASET.length + ' programmes.'", "'35 priced programmes, one enquiry-only service and two Coming Soon courses.'");
 let template=view.template;
 if(!template.includes('{{ statuses }}')) {
  const control='<div role="group" aria-label="Filter by availability" style="display:flex;gap:8px;flex-wrap:wrap;padding:12px 0"><sc-for list="{{ statuses }}" as="c"><button type="button" onClick="{{ c.pick }}" aria-pressed="{{ c.on }}" style="min-height:44px;padding:8px 14px;border:1px solid {{ c.bd }};border-radius:4px;background:{{ c.bg }};color:{{ c.fg }};font:inherit;cursor:pointer">{{ c.label }}</button></sc-for></div>';
  template=template.replace('<div role="group" aria-label="Condition"',control+'<div role="group" aria-label="Condition"');
  if(!template.includes('{{ statuses }}')) throw Error('No finder control anchor: '+file);
  template=template.replace('>Read the programme</a>', '>{{ p.action }}</a>');
  template=template.replace(/(<a href="{{ p.wa }}"[^>]*>[\s\S]*?<\/a>)/g,'<sc-if value="{{ p.canEnquire }}">$1</sc-if>');
 }
 if(['ayurvedic-treatments','treatment-programs'].includes(route)) {
  logic=logic.replaceAll("cat: 'A'", "cat: 'T'");
  // Category navigation remains useful, but other families have their own hubs.
  logic=logic.replace(/pick\(cat\) \{[^}]+\}\); \}/, "pick(cat) { const hubs = { A:'/all-programs/', W:'/wellness-programs/', R:'/all-programs/?category=R', Y:'/yoga-meditation-programs/' }; if (hubs[cat]) { window.location.href = hubs[cat]; return; } this.setState({ cat: 'T', chip: '', dur: '', budget: '' }); }");
 }
 if(!logic.includes("u.get('category')")) logic=logic.replace("const next = {};", "const next = {};\n      if (/^[AWTRY]$/.test(u.get('category') || '')) next.cat = u.get('category');\n      if (['current','enquiry_only','coming_soon'].includes(u.get('availability'))) next.availability = u.get('availability');");
 if(logic!==view.logic || template!==view.template){
  changed++;
  if(!check){view.logic=logic;view.template=template;fs.writeFileSync(file,JSON.stringify(view,null,text.startsWith('{\n')?1:undefined)+'\n');}
 }
}
if(check && changed) throw new Error(`${changed} finder payloads have stale search data`);
console.log(`finder search data: ${changed} ${check?'stale':'updated'} of 12 payloads`);
