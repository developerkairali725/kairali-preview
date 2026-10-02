import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const site=new URL('../',import.meta.url);
test('unchanged search generation and validation preserve the release payload bytes',()=>{
 const file=new URL('../public/ahv/search-index.json',import.meta.url);
 const before=fs.readFileSync(file);
 for(const args of [['--allow-expired'],['--allow-expired'],['--check','--allow-expired']]) {
  execFileSync(process.execPath,['tools/build-search-index.mjs',...args],{cwd:site,stdio:'pipe'});
  assert.deepEqual(fs.readFileSync(file),before,`index changed for ${args.join(' ')}`);
 }
});
