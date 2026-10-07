/** Privacy-limited observations only; these never decide capture acceptance. */
export function createCaptureFailureRecorder(base, allowedPaths = []) {
 const origin=new URL(base).origin,pageErrors=new Map(),failedPaths=new Map();
 const knownPaths=new Set(allowedPaths);
 const knownNames=new Set(['Error','TypeError','ReferenceError','SyntaxError','RangeError','EvalError','URIError','AggregateError']);
 return {
  pageError(error){const name=knownNames.has(error?.name)?error.name:'OtherError';pageErrors.set(name,(pageErrors.get(name)||0)+1);},
  requestFailed(value){try{const url=new URL(value);if(url.origin!==origin)return;const key=knownPaths.has(url.pathname)?url.pathname:'[unlisted-first-party-path]';failedPaths.set(key,(failedPaths.get(key)||0)+1);}catch{}},
  snapshot(){return {pageErrorCount:[...pageErrors.values()].reduce((a,b)=>a+b,0),pageErrors:[...pageErrors].map(([name,count])=>({name,count})),firstPartyRequestFailureCount:[...failedPaths.values()].reduce((a,b)=>a+b,0),firstPartyRequestFailures:[...failedPaths].map(([path,count])=>({path,count}))};}
 };
}

// Self-contained for page.evaluate. No body text, form values or raw error text.
export function inspectCaptureFailureRoot({allowedViews=[]}={}) {
 const root=document.getElementById('ahv-design-root');
 if(!root)return {exists:false};
 const view=(root.getAttribute('data-ahv-view')||'').split(/[?#]/)[0];
 const state=root.getAttribute('data-ahv-snapshot-state');
 const selectors=['.sc-logic-error','.sc-has-error','.sc-placeholder-error','[data-ahv-error]'];
 const componentErrors=selectors.map(selector=>({selector,count:root.querySelectorAll(selector).length})).filter(row=>row.count);
 const errorKinds=[];
 for(const node of root.querySelectorAll('.sc-logic-error,.sc-placeholder-error')){
  const text=node.textContent||'';
  const property=text.match(/Cannot read properties of (undefined|null) \(reading ['"]([A-Za-z_$][\w$]{0,64})['"]\)/);
  const reference=text.match(/\b([A-Za-z_$][\w$]{0,64}) is not defined\b/);
  const kind=property?{kind:'missing-property',receiver:property[1]}:reference?{kind:'undefined-reference'}:{kind:'component-error-text-omitted'};
  errorKinds.push(kind);if(errorKinds.length===10)break;
 }
 return {exists:true,errorPresent:root.hasAttribute('data-ahv-error'),livePending:root.hasAttribute('data-ahv-live-pending'),snapshotState:['retired','active','pending'].includes(state)?state:state===null?null:'other',view:allowedViews.includes(view)?view:view?'omitted':null,textChars:(root.innerText||'').trim().length,hasFirstElementChild:!!root.firstElementChild,snapshotCount:root.querySelectorAll('[data-ahv-snapshot]').length,componentErrors,errorKinds};
}
