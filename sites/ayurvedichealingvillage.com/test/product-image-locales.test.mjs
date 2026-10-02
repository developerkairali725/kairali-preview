import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import{createHash}from'node:crypto';import{applyUnits,jsUnits}from'../tools/l10n/lib.mjs';
for(const view of['desktop','mobile'])test(view+' product pictures keep their approved identity when all display names are translated',()=>{
 const data=JSON.parse(fs.readFileSync('public/ahv/views/ahv-template-product-family-'+view+'.json'));const original=run(data.logic);
 for(const locale of['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko']){
  const catalog=JSON.parse(fs.readFileSync('l10n/generated/'+locale+'.catalog.json'));const translate=text=>catalog['t_'+createHash('sha256').update(text).digest('hex').slice(0,20)]??text;
  const actual=run(applyUnits(data.logic,jsUnits(data.logic).units,translate));assert.equal(actual.length,7,locale);
  for(let i=0;i<actual.length;i++){assert.ok(actual[i].src,locale+' '+actual[i].name);assert.equal(actual[i].src,original[i].src,locale+' preserves selected photograph');assert.equal(actual[i].file,original[i].file)}
 }
});
function run(logic){const context={DCLogic:class{props={}}};vm.createContext(context);return JSON.parse(vm.runInContext(logic+';JSON.stringify(new Component().renderVals().entries)',context))}
