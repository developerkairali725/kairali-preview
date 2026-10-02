import {readFileSync} from 'node:fs';
import {join} from 'node:path';
const directory=join(process.cwd(),'public/design');
const manifest=JSON.parse(readFileSync(join(directory,'site-route-styles.json'),'utf8'));
const cache=new Map();
export function routeStylesFor(path=''){
 const file=manifest.routes[path]||manifest.base;
 if(!cache.has(file))cache.set(file,readFileSync(join(directory,file),'utf8'));
 return cache.get(file);
}

/** Large snapshot pages avoid duplicating stylesheet text in their HTML and React payload. */
export function routeStyleHref(path=''){
 return ['/', '/our-villas/', '/photo-gallery/'].includes(path) ? '/design/'+(manifest.routes[path]||manifest.base) : null;
}
