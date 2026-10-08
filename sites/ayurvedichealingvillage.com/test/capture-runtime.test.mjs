import test from 'node:test';
import assert from 'node:assert/strict';
import {captureRuntimeEnabled,isLocalCaptureHost} from '../app/(english)/_families/capture-runtime.mjs';
test('normal production and preview keep the static renderer',()=>{for(const env of [{},{NODE_ENV:'production',VERCEL_ENV:'production'},{AHV_CAPTURE_RUNTIME:'0',NODE_ENV:'production'}])assert.equal(captureRuntimeEnabled(env),false);});
test('capture requires explicit development and a localhost origin',()=>{
 const valid={AHV_CAPTURE_RUNTIME:'1',NODE_ENV:'development',AHV_CAPTURE_ORIGIN:'http://127.0.0.1:3218'};assert.equal(captureRuntimeEnabled(valid),true);
 for(const changes of [{NODE_ENV:'production'},{VERCEL_ENV:'production'},{VERCEL_ENV:'preview'},{VERCEL:'1'},{AHV_CAPTURE_RUNTIME:'redacted'},{AHV_CAPTURE_ORIGIN:'https://ayurvedichealingvillage.com'},{AHV_CAPTURE_ORIGIN:'http://localhost.evil.invalid'},{AHV_CAPTURE_ORIGIN:'http://localhost:3218/path'},{AHV_CAPTURE_ORIGIN:''}])assert.throws(()=>captureRuntimeEnabled({...valid,...changes}));
});
test('capture server refuses remote or missing Host values',()=>{
 for(const host of ['127.0.0.1:3218','localhost:3218'])assert.equal(isLocalCaptureHost(host),true);
 for(const host of [undefined,'','ayurvedichealingvillage.com','localhost.evil.invalid','127.0.0.1.evil.invalid','user@localhost','localhost/path','localhost:99999'])assert.equal(isLocalCaptureHost(host),false);
});

test('Next phases reject capture even with inherited development NODE_ENV', async()=>{
 const {captureConfigEnabled}=await import('../app/(english)/_families/capture-runtime.mjs');
 const env={AHV_CAPTURE_RUNTIME:'1',NODE_ENV:'development',AHV_CAPTURE_ORIGIN:'http://127.0.0.1:3218'};
 assert.equal(captureConfigEnabled('phase-development-server',env),true);
 for(const phase of ['phase-production-build','phase-production-server','phase-export','phase-info','phase-test',undefined,'']){
  assert.throws(()=>captureConfigEnabled(phase,env),/development-server phase/,String(phase));
 }
});

test('phase enforcement preserves flag-off production, preview and development',async()=>{
 const {captureConfigEnabled}=await import('../app/(english)/_families/capture-runtime.mjs');
 for(const phase of ['phase-development-server','phase-production-build','phase-production-server','phase-export']){
  for(const env of [{},{NODE_ENV:'production',VERCEL_ENV:'production'},{AHV_CAPTURE_RUNTIME:'0',NODE_ENV:'development',AHV_CAPTURE_ORIGIN:'http://127.0.0.1:3218'}]){
   assert.equal(captureConfigEnabled(phase,env),false,phase);
  }
 }
});

test('real Next config forwards its phase to the guard before returning configuration',async()=>{
 const {readFileSync}=await import('node:fs');
 const {fileURLToPath}=await import('node:url');
 const {createRequire}=await import('node:module');
 const {captureConfigEnabled}=await import('../app/(english)/_families/capture-runtime.mjs');
 const require=createRequire(new URL('../next.config.ts',import.meta.url));
 const ts=require('typescript');
 const {PHASE_DEVELOPMENT_SERVER,PHASE_PRODUCTION_BUILD,PHASE_PRODUCTION_SERVER,PHASE_EXPORT}=require('next/constants');
 const source=ts.transpileModule(readFileSync(new URL('../next.config.ts',import.meta.url),'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},
 }).outputText;
 const env={NODE_ENV:'development',AHV_STAGING:'0',AHV_CAPTURE_RUNTIME:'1',AHV_CAPTURE_ORIGIN:'http://127.0.0.1:3218'};
 const module={exports:{}};const phases=[];
 const dependencies=specifier=>specifier==='./app/(english)/_families/capture-runtime.mjs'
  ?{captureRuntimeEnabled:()=>captureRuntimeEnabled(env),captureConfigEnabled:phase=>{phases.push(phase);return captureConfigEnabled(phase,env);}}
  :require(specifier);
 new Function('require','module','exports','process',source)(dependencies,module,module.exports,{...process,env,cwd:()=>fileURLToPath(new URL('../',import.meta.url))});
 const configForPhase=phase=>typeof module.exports.default==='function'?module.exports.default(phase):module.exports.default;
 for(const phase of [PHASE_PRODUCTION_BUILD,PHASE_PRODUCTION_SERVER,PHASE_EXPORT]){
  assert.throws(()=>configForPhase(phase),/development-server phase/,phase);
 }
 const config=configForPhase(PHASE_DEVELOPMENT_SERVER);
 assert.equal(typeof config.redirects,'function');assert.equal(typeof config.headers,'function');
 assert.deepEqual(phases,[PHASE_PRODUCTION_BUILD,PHASE_PRODUCTION_SERVER,PHASE_EXPORT,PHASE_DEVELOPMENT_SERVER]);
 env.AHV_CAPTURE_RUNTIME='0';
 for(const phase of [PHASE_PRODUCTION_BUILD,PHASE_PRODUCTION_SERVER,PHASE_EXPORT])assert.equal(configForPhase(phase),config);
});
