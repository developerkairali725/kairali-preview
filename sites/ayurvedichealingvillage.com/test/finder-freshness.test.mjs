import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
test('build sync detects stale prices and budget bands while preserving designs and literal text',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ahv-finder-freshness-'));
 try {
  fs.mkdirSync(path.join(dir,'tools'),{recursive:true});
  fs.mkdirSync(path.join(dir,'public/ahv/views'),{recursive:true});
  fs.copyFileSync('tools/sync-finder-search-data.mjs',path.join(dir,'tools/sync-finder-search-data.mjs'));
  const index=JSON.parse(fs.readFileSync('public/ahv/search-index.json'));
  const marker='Literal $& text';index.programmes[0].name=marker;index.budgetBands.INR=[123456];
  fs.writeFileSync(path.join(dir,'public/ahv/search-index.json'),JSON.stringify(index));
  const originals=new Map();
  for(const route of ['all-programs','ayurvedic-treatments','wellness-programs','treatment-programs','training-programs','yoga-meditation-programs'])for(const side of ['desktop','mobile']){
   const rel=`public/ahv/views/ahv-page-${route}-${side}.json`;
   fs.copyFileSync(rel,path.join(dir,rel));originals.set(rel,JSON.parse(fs.readFileSync(rel)).template);
  }
  const run=(...args)=>spawnSync(process.execPath,[path.join(dir,'tools/sync-finder-search-data.mjs'),...args],{encoding:'utf8'});
  assert.notEqual(run('--check').status,0);
  assert.equal(run().status,0);
  assert.equal(run('--check').status,0);
  for(const [rel,template] of originals){
   const v=JSON.parse(fs.readFileSync(path.join(dir,rel)));
   assert.equal(v.template,template);
   assert.ok(v.logic.includes(marker));
   assert.ok(v.logic.includes('"INR":[123456]'));
  }
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
