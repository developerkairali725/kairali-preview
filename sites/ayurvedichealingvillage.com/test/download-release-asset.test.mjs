import test from 'node:test';
import assert from 'node:assert/strict';
import {downloadReleaseAsset} from '../tools/download-release-asset.mjs';
const spec={tag:'staging',repository:'org/repo',asset:'media.tar.gz'};
const failure=text=>Object.assign(new Error(text),{stderr:text});
test('transient GitHub errors retry with bounded backoff and replace only temporary partial downloads',async()=>{
  let calls=0;const waits=[];
  await downloadReleaseAsset(spec,'/temporary/assets',{run:(command,args)=>{assert.equal(command,'gh');assert.ok(args.includes('--clobber'));assert.equal(args[args.indexOf('--dir')+1],'/temporary/assets');if(++calls<3)throw failure('HTTP 500');},wait:async ms=>waits.push(ms)});
  assert.equal(calls,3);assert.deepEqual(waits,[2000,4000]);
});
test('permanent access and integrity errors fail immediately',async()=>{
  for(const message of ['HTTP 403','release not found','archive hash mismatch']) {let calls=0;await assert.rejects(downloadReleaseAsset(spec,'/temporary/assets',{run:()=>{calls++;throw failure(message)},wait:async()=>assert.fail('must not retry')}));assert.equal(calls,1);}
});
test('persistent transport failures stop after three attempts',async()=>{
  let calls=0;await assert.rejects(downloadReleaseAsset(spec,'/temporary/assets',{run:()=>{calls++;throw failure('HTTP 502')},wait:async()=>{}}));assert.equal(calls,3);
});
