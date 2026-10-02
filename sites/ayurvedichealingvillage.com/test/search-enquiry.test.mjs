import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('enquiry intent reaches the canonical contact form after legacy route consolidation', () => {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(new URL('../public/design/search.js', import.meta.url),'utf8'),ctx);
  const index=JSON.parse(fs.readFileSync(new URL('../public/ahv/search-index.json', import.meta.url),'utf8'));
  const engine=ctx.AHVSearch.createEngine(index);
  for (const query of ['enquiry','enquire','inquiry','enquiry form']) {
    const result=engine.query(query,{scope: "site"});
    assert.equal(result.order[0] && result[result.order[0]][0]?.route,'/contact-us/',query);
  }
});

test('translated enquiry intent reaches the same contact form in every released language', () => {
  for (const locale of ['hi','de','fr','es','it','pt','nl','ru','ar','zh','ja','ko']) {
    const ctx={}; vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(new URL(`../public/ahv/l10n/${locale}/design/search.js`,import.meta.url),'utf8'),ctx);
    const index=JSON.parse(fs.readFileSync(new URL(`../public/ahv/l10n/${locale}/search-index.json`,import.meta.url),'utf8'));
    const enquiry=index.intents.find(i=>i.target==='/contact-us/' && i.words.length===4);
    assert.ok(enquiry,`${locale}: enquiry intent retained`);
    const engine=ctx.AHVSearch.createEngine(index);
    for (const query of enquiry.words) {
      const result=engine.query(query,{scope:'site'});
      assert.equal(result.order[0] && result[result.order[0]][0]?.route,'/contact-us/',`${locale}: ${query}`);
    }
  }
});
