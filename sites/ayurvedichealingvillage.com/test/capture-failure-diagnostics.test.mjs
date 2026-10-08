import test from 'node:test';
import assert from 'node:assert/strict';
import {createCaptureFailureRecorder,inspectCaptureFailureRoot} from '../tools/capture-failure-diagnostics.mjs';

test('failure records retain counts and local paths without query values, URLs or raw errors',()=>{
 const recorder=createCaptureFailureRecorder('http://127.0.0.1:3218',['/ahv/view.json']);
 recorder.pageError({name:'TypeError',message:'secret-message token=private-value'});
 recorder.pageError({name:'TypeError',stack:'sensitive-stack'});
 recorder.pageError({name:'private-custom-error'});
 recorder.requestFailed('http://127.0.0.1:3218/ahv/view.json?token=secret-query#secret-fragment');
 recorder.requestFailed('http://127.0.0.1:3218/ahv/view.json?other=secret');
 recorder.requestFailed('https://external.example/private-path?secret=hidden');
 recorder.requestFailed('http://127.0.0.1:3218/private-secret-path');
 const got=recorder.snapshot();assert.equal(got.pageErrorCount,3);assert.deepEqual(got.pageErrors,[{name:'TypeError',count:2},{name:'OtherError',count:1}]);
 assert.deepEqual(got.firstPartyRequestFailures,[{path:'/ahv/view.json',count:2},{path:'[unlisted-first-party-path]',count:1}]);
 assert.doesNotMatch(JSON.stringify(got),/secret|private|sensitive|https?:|\?|#/);
});

test('root diagnostics distinguish pending snapshots and caught component errors without body text',()=>{
 const prior=globalThis.document;
 const attrs={'data-ahv-live-pending':'','data-ahv-snapshot-state':'pending','data-ahv-view':'/ahv/view.json?token=secret','data-ahv-error':'secret-error'};
 const component={textContent:"Root: Cannot read properties of undefined (reading 'canonicalOption') secret-body"};
 const root={innerText:'private form value',firstElementChild:{},hasAttribute:key=>Object.hasOwn(attrs,key),getAttribute:key=>attrs[key]??null,querySelectorAll:selector=>selector==='[data-ahv-snapshot]'?[{}]:selector==='.sc-logic-error'||selector==='.sc-logic-error,.sc-placeholder-error'?[component]:[]};
 globalThis.document={getElementById:()=>root};
 try{const got=inspectCaptureFailureRoot({allowedViews:['/ahv/view.json']});assert.equal(got.livePending,true);assert.equal(got.snapshotCount,1);assert.equal(got.errorPresent,true);assert.equal(got.view,'/ahv/view.json');assert.deepEqual(got.errorKinds,[{kind:'missing-property',receiver:'undefined'}]);assert.doesNotMatch(JSON.stringify(got),/private|secret|\?/);attrs['data-ahv-view']='PRIVATE_VIEW_123';component.textContent="Cannot read properties of undefined (reading 'PRIVATE_PROPERTY_123')";const unknown=inspectCaptureFailureRoot();assert.equal(unknown.view,'omitted');assert.doesNotMatch(JSON.stringify(unknown),/PRIVATE/);}finally{globalThis.document=prior;}
});
