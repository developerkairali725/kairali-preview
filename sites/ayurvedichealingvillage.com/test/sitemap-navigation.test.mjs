import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const data=read('english-candidate/sitemap-navigation.json');
const baseline=read('english-candidate/sitemap-navigation-baseline.json');
const counts=ls=>ls.reduce((m,l)=>m.set(l.href,(m.get(l.href)||0)+1),new Map());
test('all 214 original sitemap entries survive, including repeated destination aliases',()=>{
 assert.equal(baseline.length,214);const after=counts(data.links);
 for(const [href,count]of counts(baseline))assert.ok(after.get(href)>=count,href);
});
test('every entry has exactly one explicit subject path and a real href',()=>{
 assert.equal(new Set(data.links.map(l=>l.id)).size,data.links.length);
 for(const l of data.links){assert.ok(data.roots.includes(l.branch[0]));assert.ok(l.branch.length>=1);assert.ok(l.branch.length<=3);assert.match(l.href,/^(\/[^#]|\/$|https:\/\/)/);assert.ok(l.title);}
 assert.ok(data.links.some(l=>l.branch.length===3));
});
test('desktop and mobile use identical trees and all destinations are present in each payload',()=>{
 const d=read('public/ahv/views/ahv-page-sitemap-desktop.json'),m=read('public/ahv/views/ahv-page-sitemap-mobile.json');
 assert.equal(d.template,m.template);assert.equal(d.logic,m.logic);
 assert.equal((d.template.match(/data-leaf /g)||[]).length,data.links.length);
 for(const l of data.links)assert.ok(d.template.includes('href="'+l.href+'"'),l.href);
 assert.equal((d.template.match(/class="sm-branch sm-depth-0"/g)||[]).length,data.roots.length);
});
test('server-rendered sitemap contains every original destination',()=>{
 const ssr=fs.readFileSync(new URL('../english-candidate/prerender/sitemap.html',import.meta.url),'utf8');
 for(const l of baseline)assert.ok(ssr.includes('href="'+l.href+'"'),l.href);
 assert.ok(!ssr.includes('{{'));assert.ok(!ssr.includes('<dc-import'));
});
