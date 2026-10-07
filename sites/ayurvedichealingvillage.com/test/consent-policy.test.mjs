import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { REVISION, EXPIRY_DAYS, preferences, legacyRejection } from '../public/consent/policy.mjs';
import { translation, languages } from '../public/consent/copy.mjs';
test('optional categories never grant by default, unknown choice or geography',()=>{
 for(const input of [null,undefined,[],['necessary'],['unknown']])assert.deepEqual(preferences(input),{analytics:false,advertising:false});
 assert.deepEqual(preferences(['analytics']),{analytics:true,advertising:false});
 assert.deepEqual(preferences(['advertising']),{analytics:false,advertising:true});
 assert.deepEqual(preferences(['analytics','advertising'],true),{analytics:true,advertising:false});
});
test('legacy migration preserves rejection but never silently grants a blanket acceptance',()=>{
 for(const choice of ['accepted','declined',null]){
 const storage={getItem:k=>k==='ktahv-consent'?choice:null};
 assert.equal(legacyRejection(storage),choice==='declined');
 }
 assert.equal(legacyRejection({getItem(){throw Error('blocked')}}),false);
 assert.equal(legacyRejection({getItem:k=>k==='ktahv-consent'?'declined':'1'}),false);
});
test('13 complete candidate languages and safe unknown-language fallback',()=>{
 assert.equal(languages.length,13);
 for(const lang of languages){const t=translation(lang,'/new-privacy-policy/');assert.equal(t.preferencesModal.sections.length,3);assert.ok(t.consentModal.acceptNecessaryBtn);assert.ok(t.preferencesModal.closeIconLabel);}
 assert.deepEqual(translation('unknown','/privacy'),translation('en','/privacy'));
 assert.ok(REVISION>0);assert.equal(EXPIRY_DAYS,182);
});
test('pinned upstream JS/CSS/license bytes retain their reviewed hashes',()=>{
 const base=new URL('../public/consent/vendor/',import.meta.url);
 const manifest=JSON.parse(readFileSync(new URL('UPSTREAM.json',base)));
 assert.equal(manifest.version,'3.1.0');assert.equal(manifest.commit,'e6279509aab5b96be198297b0283b321ad76b0a9');
 for(const entry of manifest.files)assert.equal(createHash('sha256').update(readFileSync(new URL(entry.file,base))).digest('hex'),entry.sha256,entry.file);
});
