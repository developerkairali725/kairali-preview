import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
// Train J batch 1 regenerates the locale review chrome (route map without the retired /the-baoli-special-deal/); its
// exact delta is peeled first, so the snapshot manifest pin is unchanged (fixtures/train-j1-20261015.mjs).
import {peelTrainJ1Generated} from './fixtures/train-j1-20261015.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const actionSlice=s=>s.slice(s.indexOf('  function ctaBar()'),s.indexOf('  window.addEventListener("resize"'));
test('all captured locale chrome remains bound to the existing snapshot manifest',()=>{
 const spec=JSON.parse(read('english-candidate/locale-prerenders-release.json'));
 const rows=spec.sources.filter(x=>/^public\/ahv\/l10n\/[^/]+\/design\/review-chrome\.js$/.test(x.file));
 assert.equal(rows.length,12);
 for(const row of rows)assert.equal(sha(peelTrainJ1Generated(row.file,read(row.file))),row.sha256,row.file);
});
test('DE/RU campaign bundles differ only by the current reviewed CTA actions and retain their own localized chrome',()=>{
 const routes=JSON.parse(read('l10n/routes.json')).routes;
 const actions=actionSlice(read('public/design/review-chrome.js'));
 const frozen=JSON.parse(read('tools/frozen-locale-cta-actions.json'));
 assert.equal(sha(frozen.actions),frozen.sha256);
 for(const locale of ['de','ru']){
  const paths=Object.fromEntries(Object.entries(routes).map(([p,targets])=>[p,targets[locale]||p]));
  const localize=s=>s.replace('var lp = window.AHV_LOCAL_PATHS,',`var lp = window.AHV_LOCAL_PATHS || ${JSON.stringify(paths)},`);
  const normal=read(`public/ahv/l10n/${locale}/design/review-chrome.js`);
  const campaign=read(`public/ahv/l10n/${locale}/design/campaign-review-chrome.js`);
  assert.equal(actionSlice(normal),localize(frozen.actions));
  assert.equal(actionSlice(campaign),localize(actions));
  assert.equal(campaign.replace(actionSlice(campaign),actionSlice(normal)),normal);
  assert.match(campaign,/function syncFreeConsult\(/);
 }
});
