import {readFileSync} from 'node:fs';
import {join} from 'node:path';
const directory=join(process.cwd(),'public/design');
const manifest=JSON.parse(readFileSync(join(directory,'site-route-styles.json'),'utf8'));
const cache=new Map();
export function routeStylesFor(path=''){
 const file=manifest.routes[path]||manifest.base;
 if(!cache.has(file))cache.set(file,readFileSync(join(directory,file),'utf8'));
 // The reviewed contact block changes semantic level only; preserve its original H4 typography.
 const contact = path === '/ayurveda-treatment/' ? '#ahv-design-root[data-ahv-route="/ayurveda-treatment/"] h3[data-source-pointer="/sections/3/c/3/c/12"]{font-family:Marcellus,serif!important;font-weight:400!important;line-height:1.22!important;margin:26px 0 10px!important;font-size:19.5px!important}@media(min-width:1180px){#ahv-design-root[data-ahv-route="/ayurveda-treatment/"] h3[data-source-pointer="/sections/3/c/3/c/12"]{grid-column:2!important;max-width:none!important;padding-top:0!important;margin-top:62px!important}}' : '';
 return cache.get(file)+contact;
}

/** Large snapshot pages avoid duplicating stylesheet text in their HTML and React payload. */
export function routeStyleHref(path=''){
 return ['/', '/our-villas/', '/photo-gallery/', '/panchakarma-therapy/', '/post-pregnancy-health-programme/', '/preventive-and-regenerative-treatment/'].includes(path) ? '/design/'+(manifest.routes[path]||manifest.base) : null;
}
