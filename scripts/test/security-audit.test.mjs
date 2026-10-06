import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyAudit as classify, PATCHED_ADVISORY } from '../lib/security-audit.mjs';
const details={title:'Reviewed stack exhaustion',cwe:'CWE-674',vulnerable_versions:'<=3.0.3',patched_versions:'>=3.0.4',severity:'high'};
const classifyAudit=(report,verify)=>classify(report,verify,details);
const advisory={...details,github_advisory_id:PATCHED_ADVISORY,module_name:'braces',findings:[{version:'3.0.3',paths:['first','second']}]};
const report=a=>({advisories:{one:a},metadata:{vulnerabilities:{high:a.severity==='high'?1:0,critical:a.severity==='critical'?1:0}}});
test('every affected dependency path must verify; one unpatched copy blocks',()=>{
 const paths=[];assert.equal(classifyAudit(report(advisory),p=>{paths.push(p);return true;})[0].patched,true);assert.deepEqual(paths,['first','second']);
 assert.equal(classifyAudit(report(advisory),p=>p==='first')[0].blocking,true);
});
test('unknown vulnerabilities, severities and versions remain blocking',()=>{
 for(const change of [{github_advisory_id:'other'},{module_name:'other'},{findings:[{version:'3.0.2',paths:['first']}]},{findings:[]},{findings:[{version:'3.0.3',paths:[]}]}]) assert.equal(classifyAudit(report({...advisory,...change}),()=>true)[0].blocking,true);
 assert.equal(classifyAudit(report({...advisory,github_advisory_id:'other',severity:'unknown'}),()=>true)[0].blocking,true);
});
test('the original high threshold preserves moderate warnings',()=>{
 const result=classifyAudit(report({...advisory,github_advisory_id:'other',severity:'moderate'}),()=>true)[0];assert.equal(result.blocking,false);assert.equal(result.patched,false);
});
test('missing/failed audit response cannot pass',()=>{
 for(const response of [null,{}, {advisories:{}},{advisories:{},metadata:{},error:'network'}])assert.throws(()=>classifyAudit(response,()=>true));
});

test('missing advisory details cannot hide a high or critical count',()=>{
 assert.throws(()=>classifyAudit({advisories:{},metadata:{vulnerabilities:{high:1,critical:0}}},()=>true));
});

test('changed upstream advisory details require a new review',()=>{
 for(const key of Object.keys(details)) {
  const changed={...advisory,[key]:key==='severity'?'critical':'changed'};
  assert.equal(classifyAudit(report(changed),()=>true)[0].blocking,true);
 }
 assert.equal(classify(report(advisory),()=>true)[0].blocking,true);
});
