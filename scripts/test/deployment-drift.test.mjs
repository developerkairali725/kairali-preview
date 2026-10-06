import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDeploymentMappings } from '../deployment-drift.mjs';
const a={id:'a',name:'first',rootDirectory:'sites/a',mode:'hold',gitConnected:false};
const b={id:'b',name:'second',rootDirectory:'sites/b',mode:'git',gitConnected:true,branch:'main',affectedProjects:true};
const manifest={repository:'owner/repo',projects:[a,b]};
const actual={...b,link:{org:'owner',repo:'repo',productionBranch:'main'},enableAffectedProjectsDeployments:true};
test('matching project identities, roots, Git settings and holds pass',()=>{
 assert.deepEqual(checkDeploymentMappings(manifest,p=>p.id==='a'?a:actual,()=>{}),[]);
});
test('one unreadable project fails safely, redacts diagnostics and checks remaining projects',()=>{
 const reads=[],logs=[];
 const errors=checkDeploymentMappings(manifest,p=>{reads.push(p.id);if(p.id==='a')throw Error('private-response-body');return actual;},s=>logs.push(s));
 assert.deepEqual(reads,['a','b']);
 assert.equal(errors.length,1);assert.match(errors[0],/project read failed/);
 assert.ok(!errors.join().includes('private-response-body'));assert.equal(logs.length,1);
});
test('deployment drift fails for wrong root, repository, branch or affected setting',()=>{
 const errors=checkDeploymentMappings({repository:'owner/repo',projects:[b]},()=>({...actual,rootDirectory:'wrong',link:{org:'wrong',repo:'repo',productionBranch:'other'},enableAffectedProjectsDeployments:false}),()=>{});
 for(const failure of ['source root','repository','branch','unaffected-project skipping'])assert.ok(errors[0].includes(failure));
});
