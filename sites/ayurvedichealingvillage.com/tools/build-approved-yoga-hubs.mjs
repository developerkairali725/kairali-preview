/** Approved M007/M008/M024 identities and reuse of the detailed M007 package template. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(site,p),'utf8');
const save=(p,s)=>fs.writeFileSync(path.join(site,p),s);
const json=p=>JSON.parse(read(p));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const definitions=[
 {slug:'yoga-meditation-program',title:'Yoga Training for Personal Practice — Coming Soon',intro:'A forthcoming course for personal yoga practice.',purpose:'Personal practice',other:'/new-to-yoga-teacher-training/',otherLabel:'Professional Yoga Teacher Training — Coming Soon'},
 {slug:'new-to-yoga-teacher-training',title:'Professional Yoga Teacher Training — Coming Soon',intro:'A forthcoming professional teacher-training track.',purpose:'Professional teacher training',other:'/yoga-meditation-program/',otherLabel:'Yoga Training for Personal Practice — Coming Soon'},
];
const css=`.catalogue-page{max-width:1160px;margin:auto;padding:40px 24px 72px;font-family:Mulish,sans-serif;color:#2A2118;font-size:18px;line-height:1.7}.catalogue-page h1,.catalogue-page h2,.catalogue-page h3{font-family:Marcellus,serif;font-weight:400;line-height:1.2}.catalogue-page h1{font-size:clamp(34px,5vw,56px);max-width:24ch;margin:20px 0}.catalogue-page h2{font-size:32px;margin:0 0 16px}.catalogue-page h3{font-size:25px;margin:0 0 12px}.catalogue-page p{max-width:65ch}.catalogue-page .catalogue-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin-top:32px}.catalogue-page .catalogue-card{background:#F7F4EA;border:1px solid #C9BFA8;padding:28px;border-radius:6px}.catalogue-page a{color:#006038;display:inline-flex;align-items:center;min-height:44px;gap:8px}.catalogue-page a:focus-visible{outline:3px solid #006038;outline-offset:4px}.catalogue-page .catalogue-status{display:inline-block;padding:6px 14px;background:#EDEADF;color:#5A4420;font-weight:700}.catalogue-page nav{display:flex;gap:10px;flex-wrap:wrap}.catalogue-page .catalogue-action{padding:10px 18px;background:#006038;color:#fff;text-decoration:none;border-radius:4px}.catalogue-page section{margin-top:40px}@media(max-width:700px){.catalogue-page{padding:24px 20px 48px}.catalogue-page .catalogue-grid{grid-template-columns:1fr}.catalogue-page .catalogue-card{padding:22px}}`;
const mainFor=d=>`<main id="main-content" class="catalogue-page"><nav aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><a href="/yoga-meditation-training/">Yoga &amp; Training</a></nav><p class="catalogue-status">Coming Soon</p><h1>${esc(d.title)}</h1><p>${esc(d.intro)}</p><section class="catalogue-card"><h2>${esc(d.purpose)}</h2><p>Enrolment is not currently open. Course details, dates and fees will be announced when confirmed.</p><p>This forthcoming course is separate from the current yoga and meditation programmes.</p></section><section><h2>Explore yoga and learning</h2><div class="catalogue-grid"><div class="catalogue-card"><h3>Current yoga programmes</h3><p>View the three yoga programmes and personalised yoga option.</p><a class="catalogue-action" href="/yoga-meditation-programs/">Explore yoga programmes</a></div><div class="catalogue-card"><h3>${esc(d.otherLabel)}</h3><a href="${d.other}">View details</a></div></div><p><a href="/all-programs/?category=R&amp;availability=coming_soon">Browse forthcoming yoga training</a></p></section></main>`;
// Direct links reuse the approved course identities (name + route) from the search index; no new copy.
const courses=json('public/ahv/search-index.json').programmes.filter(p=>p.course);
if(courses.length!==5)throw new Error(`expected 5 approved courses in search-index, found ${courses.length}`);
const courseLinks=`<ul>${courses.map(p=>`<li><a href="${esc(p.route)}">${esc(p.name)}</a></li>`).join('')}</ul>`;
const hubMain=`<main id="main-content" class="catalogue-page"><nav aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><span>Yoga &amp; Training</span></nav><h1>Yoga &amp; Training</h1><p>Explore yoga and meditation programmes, personalised yoga and Ayurveda courses. Forthcoming yoga training is clearly marked Coming Soon.</p><div class="catalogue-grid"><section class="catalogue-card"><h2>Yoga &amp; meditation programmes</h2><p>Three distinct yoga programmes, with their own minimum admissions and published tariffs.</p><ul><li><a href="/yoga-and-meditation-package/">Dhyāna-Yoga Shibiram</a></li><li><a href="/digestive-wellness-gut-health-yoga-therapy/">Agni Dīpanam Yoga Chikitsa</a></li><li><a href="/yoga-based-stress-energy-reset-program/">Prāna Sāmya Yoga Chikitsa</a></li></ul><a class="catalogue-action" href="/yoga-meditation-programs/">Compare yoga programmes</a></section><section class="catalogue-card"><h2>Personalised yoga</h2><p>An enquiry-only option, with a yoga programme tailored after a physician’s assessment.</p><a href="/yoga-therapy-individual/">Explore personalised yoga</a></section><section class="catalogue-card"><h2>Ayurveda training</h2><p>Explore the five Ayurveda courses, from the one-day workshop to the advanced training programme.</p>${courseLinks}<a class="catalogue-action" href="/ayurveda-training-programme/">View Ayurveda courses</a></section><section class="catalogue-card"><h2>Forthcoming yoga training</h2><p class="catalogue-status">Coming Soon</p><p>Enrolment is not currently open.</p><ul><li><a href="/yoga-meditation-program/">Yoga Training for Personal Practice — Coming Soon</a></li><li><a href="/new-to-yoga-teacher-training/">Professional Yoga Teacher Training — Coming Soon</a></li></ul></section></div></main>`;
const ovr=json('english-candidate/route-overrides.json');
for(const variant of ['desktop','mobile']){
 const oldId=`ahv-page-yoga-meditation-program-${variant}`;
 const packageId=`ahv-page-yoga-and-meditation-package-${variant}`;
 let old=json(`public/ahv/views/${oldId}.json`);
 if(!fs.existsSync(path.join(site,`public/ahv/views/${packageId}.json`))){
  const pkg=JSON.parse(JSON.stringify(old));pkg.id=packageId;pkg.file=packageId+'.dc.html';
  pkg.template=pkg.template.replaceAll('/yoga-meditation-program/','/yoga-and-meditation-package/').replace('Yoga &amp; Meditation Program</h1>','Yoga &amp; Meditation Package</h1>');
  save(`public/ahv/views/${packageId}.json`,JSON.stringify(pkg)+'\n');
 }
 for(const d of [...definitions,{slug:'yoga-meditation-training',title:'Yoga & Training',intro:'Explore yoga programmes, personalised yoga and Ayurveda courses.'}]){
  const id=`ahv-page-${d.slug}-${variant}`;const main=d.slug==='yoga-meditation-training'?hubMain:mainFor(d);
  const title=esc(d.title+' | Kairali');const head=`<helmet><link href="/ahv/fonts/ahv-33eeac48ab44.css" rel="stylesheet"><title>${title}</title><meta name="description" content="${esc(d.intro)}"><link rel="canonical" href="https://ayurvedichealingvillage.com/${d.slug}/"><style>${css}</style></helmet>`;
  const header=`<dc-import name="AHV Chrome Header" ${variant==='mobile'?'narrow="true" ':''}hint-size="100%,72px"></dc-import>`;
  const footer=`<dc-import name="AHV Chrome Footer" ${variant==='mobile'?'narrow="true" ':''}hint-size="100%,560px"></dc-import>`;
  const view={id,file:id+'.dc.html',variant,template:head+header+main+footer,logic:"class Component extends DCLogic { renderVals() { return {}; } }",props:{},scripts:[]};
  save(`public/ahv/views/${id}.json`,JSON.stringify(view)+'\n');
  ovr.routes['/'+d.slug+'/']={...(ovr.routes['/'+d.slug+'/']||{}),desktopView:`ahv-page-${d.slug}-desktop`,mobileView:`ahv-page-${d.slug}-mobile`,dataset:null,metadata:{title:d.title+' | Kairali',description:d.intro,ogTitle:d.title,ogDescription:d.intro,canonical:`https://ayurvedichealingvillage.com/${d.slug}/`},sitemapExclude:false};
  if(variant==='mobile')save(`english-candidate/prerender/${d.slug}.html`,`<style>${css}</style>${main}`);
 }
}
ovr.routes['/yoga-and-meditation-package/']={...(ovr.routes['/yoga-and-meditation-package/']||{}),desktopView:'ahv-page-yoga-and-meditation-package-desktop',mobileView:'ahv-page-yoga-and-meditation-package-mobile',dataset:null};
save('english-candidate/route-overrides.json',JSON.stringify(ovr,null,2)+'\n');
console.log('Approved Yoga & Training hub, two Coming Soon pages, detailed yoga package template.');
