import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
const site=process.cwd();
const spec=JSON.parse(fs.readFileSync('english-candidate/locale-prerenders-release.json'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
test('locale release includes crawlable bodies in every released language and a verified archive',()=>{
 assert.match(spec.sha256,/^[a-f0-9]{64}$/);
 const archive='english-candidate/'+spec.archive;
 if(fs.existsSync(archive))assert.equal(hash(fs.readFileSync(archive)),spec.sha256);
 for(const locale of ['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko']){
  assert.ok(spec.files.some(f=>f.file===`l10n/prerender/${locale}/index.html.gz`));
  assert.ok(spec.files.filter(f=>f.file.startsWith(`l10n/prerender/${locale}/`)).length>=200);
 }
});
test('empty-checkout restoration is exact and refuses a changed body without overwriting it',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'ahv-snapshot-restore-test-'));
 try{
  const script='tools/restore-locale-prerenders.mjs';
  for(const file of [script,'tools/download-release-asset.mjs']){const dest=path.join(tmp,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(site,file),dest);}
  fs.mkdirSync(path.join(tmp,'english-candidate'),{recursive:true});
  const member='l10n/prerender/hi/index.html.gz';const fixture=path.join(tmp,member);
  fs.mkdirSync(path.dirname(fixture),{recursive:true});fs.writeFileSync(fixture,'verified fixture');
  const archive='ahv-locale-prerenders-test.tar.gz';
  execFileSync('tar',['-czf','english-candidate/'+archive,member],{cwd:tmp});
  const fixtureSpec={archive,asset:archive,sha256:hash(fs.readFileSync(path.join(tmp,'english-candidate',archive))),sources:[],files:[{file:member,sha256:hash(fs.readFileSync(fixture))}]};
  fs.writeFileSync(path.join(tmp,'english-candidate/locale-prerenders-release.json'),JSON.stringify(fixtureSpec));fs.rmSync(path.join(tmp,'l10n'),{recursive:true});
  execFileSync(process.execPath,[script],{cwd:tmp,stdio:'pipe'});
  for(const f of fixtureSpec.files)assert.equal(hash(fs.readFileSync(path.join(tmp,f.file))),f.sha256);
  const affected=path.join(tmp,'l10n/prerender/hi/index.html.gz');fs.writeFileSync(affected,'user change');
  const result=spawnSync(process.execPath,[script],{cwd:tmp,encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/Refusing to overwrite/);assert.equal(fs.readFileSync(affected,'utf8'),'user change');
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
