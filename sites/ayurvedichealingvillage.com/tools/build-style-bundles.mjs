// Preserve source order/rules while removing repeated blocking network requests.
import fs from 'node:fs';
import path from 'node:path';
const site = ['directions','article-reader','campaign','consistency','chrome','newsletter','film-player','search','section-nav','family-header'].map(name => `/design/${name}.css`);
const campaign = ['/design/chrome.css','/design/newsletter.css','/ahv/fonts/ahv-b6a82009abac.css'];
for (const [name, files] of [['site',site],['campaign',campaign]]) {
  const css = files.map(file => {
    const content = fs.readFileSync('public' + file,'utf8').replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g, (full, quote, url) => {
      if (url.startsWith('/') || url.includes(':') || url.startsWith('#')) return full;
      return `url(${quote}${path.posix.join(path.posix.dirname(file),url)}${quote})`;
    });
    return `/* source: ${file} */\n${content}`;
  }).join('\n');
  fs.writeFileSync(`public/design/${name}-bundle.css`, css);
  console.log(`${name}: ${files.length} stylesheets -> one; ${Buffer.byteLength(css)} bytes before transport compression`);
}

// Keep first-paint rules in their original order, while excluding only styles
// explicitly scoped to other route/family attributes. Unscoped rules stay.
const {createRequire}=await import('node:module');
const runtimeRequire=createRequire(import.meta.url),nextRequire=createRequire(runtimeRequire.resolve('next'));
const postcss=nextRequire('postcss'),cssnano=nextRequire('next/dist/compiled/cssnano-simple');
const names=['directions','article-reader','campaign','consistency','chrome','newsletter','film-player','search','section-nav','family-header'];
const trees=names.map(name=>({name,tree:postcss.parse(fs.readFileSync('public/design/'+name+'.css','utf8'))}));
function outerSelector(selector){
 let out='',depth=0,brackets=0,quote='';
 for(let i=0;i<selector.length;i++){
  const ch=selector[i];
  if(quote){if(ch===quote&&selector[i-1]!=='\\')quote='';}
  else if(ch==='"'||ch==="'")quote=ch;
  else if(ch==='[')brackets++;
  else if(ch===']')brackets--;
  else if(!brackets&&ch==='('){depth++;continue;}
  else if(!brackets&&ch===')'){depth--;continue;}
  if(depth===0)out+=ch;
 }
 return out;
}
const scope=(selector,attr)=>[...selector.matchAll(new RegExp('\\[data-ahv-'+attr+'\\s*=\\s*["\']([^"\']+)["\']\\s*\\]','g'))].map(m=>m[1]);
function foreign(selector,path,family,consistent){
 const outer=outerSelector(selector);
 const families=scope(outer,'family'),routes=scope(outer,'route'),consistency=scope(outer,'consistency');
 // Functional selector contents are excluded: only positive outer guards prove absence.
 if(families.length&&!families.includes(family))return true;
 if(routes.length&&!routes.includes(path))return true;
 if(consistency.length&&!consistent)return true;
 return false;
}
async function rules(path,family,consistent){
 let output='';
 for(const {name,tree} of trees){
  const copy=tree.clone();
  copy.walkRules(rule=>{
   if(rule.parent.type==='atrule'&&/keyframes$/i.test(rule.parent.name))return;
   const selectors=rule.selectors.filter(sel=>!foreign(sel,path,family,consistent));
   if(!selectors.length)rule.remove();else rule.selectors=selectors;
  });
  copy.walkAtRules(rule=>{if(rule.nodes&&rule.nodes.length===0)rule.remove()});
  output+=copy.toString();
 }
 const result=await postcss([cssnano({})]).process(output,{from:undefined});
 if(result.warnings().length)throw Error(result.warnings().map(String).join('\n'));
 return result.css;
}
const crypto=await import('node:crypto');
const bundles={},routes={};
async function save(css){
 const id=crypto.createHash('sha256').update(css).digest('hex').slice(0,16),file='site-route-'+id+'.css';
 if(!bundles[id]){fs.writeFileSync('public/design/'+file,css);bundles[id]={file,bytes:Buffer.byteLength(css)}}
 return file;
}
const base=await save(await rules('', '', false));
const manifest=JSON.parse(fs.readFileSync('english-candidate/route-manifest.json','utf8'));
const inventory=Array.isArray(manifest)?manifest:manifest.routes;
const locked=JSON.parse(fs.readFileSync('english-candidate/consistency-locked-families.json','utf8')).families;
for(let start=0;start<inventory.length;start+=25)for(const route of inventory.slice(start,start+25)){
 const family=(route.desktopView||route.mobileView||'').replace(/^ahv-page-/,'').replace(/-(desktop|mobile)$/,'').replace(/--[a-z0-9-]+$/,'');
 const consistent=!Object.hasOwn(locked,family.replace(/^ahv-template-/,''));
 routes[route.path]=await save(await rules(route.path,family,consistent));
}
fs.writeFileSync('public/design/site-route-styles.json',JSON.stringify({base,routes,bundles},null,2)+'\n');
console.log('Scoped first-paint styles: '+Object.keys(routes).length+' routes / '+Object.keys(bundles).length+' bundles / base '+fs.statSync('public/design/'+base).size+' bytes');

const full=await postcss([cssnano({})]).process(fs.readFileSync('public/design/site-bundle.css','utf8'),{from:undefined});
fs.writeFileSync('public/design/site-bundle.inline.css',full.css);
