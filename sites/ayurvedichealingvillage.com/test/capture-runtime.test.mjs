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
