import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const read=n=>fs.readFileSync(new URL('../'+n,import.meta.url),'utf8');
const context={window:{},React:{createElement:(tag,props,...children)=>({tag,props:props||{},children})}};
vm.createContext(context);
for(const n of ['campaign-nine-data.js','collection-family-render.js','campaign-nine-render.js'])vm.runInContext(read('public/ahv/assets/'+n),context);
function nodes(n,out=[]){if(Array.isArray(n))n.forEach(x=>nodes(x,out));else if(n&&typeof n==='object'){out.push(n);nodes(n.children,out);}return out;}
for(const route of context.window.AHV_CAMPAIGN_NINE.routes.filter(r=>!r.path.startsWith('/offers'))){
 test(`${route.path}: redesigned hero, local section links and image dimensions at both widths`,()=>{
  for(const bp of ['wide','narrow']){
   const tree=nodes(context.window.AHV_CAMPAIGN_NINE_RENDER.campaignBody(route,bp));
   assert.equal(tree.filter(n=>n.tag==='h1').length,1);
   const ids=new Set(tree.map(n=>n.props.id).filter(Boolean));ids.add('campaign-enquiry');
   for(const n of tree){
    const href=n.props.href||'';
    assert.ok(!href.includes('South+Perth'));
    assert.ok(!/ayurvedichealingvillage\.com\/#/.test(href),href);
    if(href.includes(route.path+'#'))assert.ok(ids.has(href.split('#')[1]),href);
    if(n.tag==='img')assert.ok(n.props.width&&n.props.height,n.props.src);
   }
  }
 });
}
test('LP staging exposure retains denied analytics and short form validation',()=>{
 const layout=read('app/(lp)/layout.tsx'),form=read('app/(lp)/_components/campaign-enquiry-form.tsx');
 assert.ok(!layout.includes('notFound()'));
 assert.match(layout,/AHV_ANALYTICS === "1" && process.env.AHV_STAGING === "0"/);
 assert.match(form,/form.reportValidity\(\)/);
 assert.match(form,/action="\/api\/forms-unavailable" method="post"/);
 assert.match(form,/fetch\('\/api\/lead\/'/);
 assert.match(form,/response\.status===503&&\/_NOT_CONFIGURED\$\//);
 assert.match(form,/if\(!response.ok\|\|result.ok!==true\)/);
 assert.match(form,/form:'landing-page'/);
 assert.match(form,/landing_page_path:window.location.pathname/);
 assert.match(form,/lead_source_url:window.location.href/);
});
test('confirmed broken ad sitelinks map directly to existing, language-appropriate routes',()=>{
 const rules=JSON.parse(read('english-candidate/ad-sitelink-redirects.json'));
 assert.deepEqual(rules.map(r=>[r.source,r.destination]),[['/contact-us.aspx','/contact-us/'],['/villas.aspx','/our-villas/'],['/de/behandlung-in-kerala.html','/lp/behandlung-in-kerala/']]);
 const manifest=JSON.parse(read('english-candidate/route-manifest.json'));
 for(const r of rules)assert.ok(manifest.routes.some(x=>x.path===r.destination)||fs.existsSync(new URL('../app/(lp)'+r.destination+'page.tsx',import.meta.url)));
 assert.match(read('app/(lp)/lp/behandlung-in-kerala/page.tsx'),/<main lang="de">/);
});

 test("campaign enquiry targets exist in both breakpoint templates", () => {
  for (const bp of ["desktop", "mobile"]) {
    const view = JSON.parse(read(`public/ahv/views/ahv-page-campaign-nine-${bp}.json`));
    assert.ok(JSON.stringify(view).includes('id=\\"campaign-enquiry\\"'));
  }
});

test("campaign snapshots are complete HTML without capture truncation", () => {
 for (const name of fs.readdirSync(new URL("../english-candidate/prerender/", import.meta.url)).filter(n=>n.endsWith(".html"))) {
  assert.ok(!read("english-candidate/prerender/"+name).includes("[Truncated]"), name);
 }
});
