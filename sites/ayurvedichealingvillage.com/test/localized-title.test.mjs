import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import { reviewedTitleFor, restoreReviewedTitle } from '../app/(english)/_families/localized-title.mjs';
const locales=['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko'];
test('Only the two reviewed routes in twelve registered locales reuse their accepted catalogue titles',()=>{
 for(const locale of locales){const meta=JSON.parse(fs.readFileSync(new URL('../l10n/generated/'+locale+'.json',import.meta.url))).meta;for(const path of ['/ayurvedic-treatment-packages.html','/panchkarma-treatment.html']){const title=meta[path].title;assert.equal(reviewedTitleFor(path,locale,title),title);assert.equal(reviewedTitleFor(path,'en',title),undefined);}}
 for(const path of ['/','/contact-us/','/lp/treatment-packages/'])assert.equal(reviewedTitleFor(path,'de','Title'),undefined);
 for(const value of [undefined,null,'', '  '])assert.equal(reviewedTitleFor('/panchkarma-treatment.html','de',value),undefined);
 assert.equal(reviewedTitleFor('/panchkarma-treatment.html','xx','Title'),undefined);
});
function fixture(initial){let value=initial,writes=0,node=initial===null?null:{get textContent(){return value},set textContent(v){value=v;writes++}};const doc={head:{querySelector(s){assert.equal(s,'title');return node},appendChild(n){node=n}},createElement(t){assert.equal(t,'title');return{get textContent(){return value},set textContent(v){value=v;writes++}}}};return{doc,text:()=>value,writes:()=>writes};}
test('Runtime corrects an English overwrite once and remains quiet on later head passes',()=>{
 const run=vm.runInNewContext('('+restoreReviewedTitle.toString()+')');const f=fixture('English title');assert.equal(run(f.doc,'Ayurveda-Behandlungsprogramme in Kerala | Kairali'),true);for(let i=0;i<25;i++)assert.equal(run(f.doc,'Ayurveda-Behandlungsprogramme in Kerala | Kairali'),false);assert.equal(f.writes(),1);assert.equal(f.text(),'Ayurveda-Behandlungsprogramme in Kerala | Kairali');
});
test('Missing title is restored; unconfigured pages are untouched',()=>{const f=fixture(null);assert.equal(restoreReviewedTitle(f.doc,'Reviewed title'),true);assert.equal(f.text(),'Reviewed title');assert.equal(f.writes(),1);assert.equal(restoreReviewedTitle(f.doc,undefined),false);assert.equal(f.writes(),1)});
