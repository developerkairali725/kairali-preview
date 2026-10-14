import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const require=createRequire(process.env.AHV_TEST_DEPENDENCY_ROOT || import.meta.url);
const {htmlToDOM}=require('html-react-parser');
const site=new URL('../',import.meta.url);
const source=readFileSync(new URL('app/(english)/_families/static-design-boot.mjs',site),'utf8');
const start=source.indexOf('    // Captured mobile/desktop template IDs differ.');
const end=source.indexOf('      var photoData =',start);
assert(start>=0&&end>start,'Exercise the production filter initializer');
const script=source.slice(start,end)+'\n});';
function children(node){return node.children||[];}
function text(node){return node.type==='text'?node.data:children(node).map(text).join('');}
function matches(node,selector){
 const m=/^([a-z]+)(?:\[([\w-]+)(?:="([^"]*)")?\])?$/.exec(selector);assert(m,selector);
 return node.name===m[1]&&(!m[2]||(Object.hasOwn(node.attribs||{},m[2])&&(m[3]===undefined||node.attribs[m[2]]===m[3])));
}
function decorate(node){
 node.style={};node.listeners={};Object.defineProperty(node,'textContent',{get(){return text(node);}});
 node.querySelectorAll=function(selector){return children(this).flatMap(child=>[...(matches(child,selector)?[child]:[]),...child.querySelectorAll(selector)]);};
 node.querySelector=function(selector){return this.querySelectorAll(selector)[0]||null;};
 node.addEventListener=function(name,fn){(this.listeners[name]||=[]).push(fn);};
 for(const child of children(node))decorate(child);return node;
}
function snapshot(path){return decorate({children:htmlToDOM(readFileSync(new URL(path,site),'utf8'))});}
function categories(view){
 const payload=JSON.parse(readFileSync(new URL('public/ahv/views/'+view+'.json',site),'utf8'));
 const sandbox={DCLogic:class{}};
 vm.runInNewContext(payload.logic+';const c=new Component();c.props={};globalThis.items=c.renderVals().galItems;',sandbox,{timeout:1000});
 return Array.from(sandbox.items,x=>x.cat);
}
for(const [label,path,view] of [['mobile','english-candidate/prerender/index.html','home-mobile'],['desktop','public/ahv/static/index.html','home-hi-fi-v4']]){
 test(label+': actual snapshot gallery filters initialize; obsolete selector is a negative control',()=>{
  const host=snapshot(path);assert.equal(host.querySelector('section[data-dc-tpl="770"]'),null,'Old initializer cannot attach');
  const sections=host.querySelectorAll('section').filter(s=>s.querySelector('a[aria-description]')&&s.querySelector('button'));
  assert.equal(sections.length,1,'Exactly one actual homepage gallery');const section=sections[0];
  const buttons=section.querySelectorAll('button');const items=section.querySelectorAll('a[aria-description]');const cats=categories(view);
  assert.equal(buttons.length,5);assert.equal(items.length,cats.length);assert.equal(items.length,15);
  const attrs=items.map(x=>({...x.attribs}));let initialized=0;
  vm.runInNewContext(script,{host,cfg:{staticHome:{galleryCategories:cats}},initializeNearViewport(target,fn){assert.equal(target,section);initialized++;fn();}});
  assert.equal(initialized,1);
  for(const button of buttons){
   assert.equal(button.listeners.click.length,1);button.listeners.click[0]();const category=button.textContent.trim();
   assert.deepEqual(items.map(x=>x.style.display==='block'),cats.map(cat=>category==='All'||cat===category),category);
   assert(items.some(x=>x.style.display==='block'),category+' is not empty');
   assert.equal(button.style.background,'var(--marigold-400)');
   for(const other of buttons.filter(x=>x!==button))assert.equal(other.style.background,'transparent');
  }
  assert.deepEqual(items.map(x=>x.attribs),attrs,'Filter handling preserves targets/content attributes');
  const nongallery=host.querySelectorAll('button').filter(x=>!buttons.includes(x));assert(nongallery.every(x=>!x.listeners.click),'No unrelated button handlers');
 });
}
test('non-gallery sections do not receive gallery handlers',()=>{
 const host=decorate({children:htmlToDOM('<section><button>All</button><a href="/programmes/">Programmes</a></section>')});
 vm.runInNewContext(script,{host,cfg:{staticHome:{galleryCategories:[]}},initializeNearViewport(){assert.fail('Unrelated section initialized');}});
 assert.equal(host.querySelector('button').listeners.click,undefined);
});
