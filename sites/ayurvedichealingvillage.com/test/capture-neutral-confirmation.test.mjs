import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {inspectCapturePage,assertCapturePage,captureContentRequirements,createCaptureEvaluation} from '../tools/capture-page-guard.mjs';
const routes=['/contact-us/thank-you/','/onlinebookingthankyou/','/onlineconsultation-thanks/','/ppc-thanks/','/thanks/','/thanks-old/','/emailsubscriber/'];
const route=routes[0];
const requirements=(r=route,locale='zh-Hans')=>captureContentRequirements(r,{},locale);
const contract=requirements().neutralConfirmation;
const node=(text,href)=>({textContent:text,getAttribute:key=>key==='href'?href:null});
// Minimal DOM-shaped fixtures exercise the actual inspector, including its clone
// and serialized-extraction path. Actual source/template equality is checked below.
function fixture(expected=contract,changes={}) {
 const value={heading:expected.heading,body:expected.body,label:expected.label,href:expected.href,brand:'Kairali — The Ayurvedic Healing Village · 始于1908年',states:1,headings:1,paragraphs:1,actions:1,receipts:0,forms:0,...changes};
 const headings=Array.from({length:value.headings},()=>node(value.heading));
 const paragraphs=Array.from({length:value.paragraphs},()=>node(value.body));
 const actions=Array.from({length:value.actions},()=>node(value.label,value.href));
 const direct={textContent:[value.brand,...headings.map(x=>x.textContent),...paragraphs.map(x=>x.textContent),...actions.map(x=>x.textContent)].join(' '),querySelectorAll(selector){return selector==='h1'?headings:selector==='p'?paragraphs:selector==='a'?actions:selector==='form'?Array(value.forms).fill({}):[];}};
 const errors=value.error?[{textContent:value.error,querySelector:()=>null}]:[];
 const root={textContent:value.bodyText??('跳至主要内容 '+direct.textContent),getAttribute:()=>null,hasAttribute:()=>false,querySelector:()=>null,querySelectorAll(selector){
  if(selector==='h1')return value.rootHeadings??headings;
  if(selector==='[data-state="direct-visit"]')return Array(value.states).fill(direct);
  if(selector==='[data-state="receipt"]')return Array(value.receipts).fill({});
  if(selector==='.sc-logic-error,.sc-has-error,.sc-placeholder-error,[data-ahv-error]')return errors;
  return [];
 },cloneNode(){return this;}};
 return root;
}
function proof(changes={},r=route,locale='zh-Hans') {
 const req=requirements(r,locale),root=fixture(req.neutralConfirmation||contract,changes),prior=globalThis.document;
 globalThis.document={getElementById:()=>root};
 try{return inspectCapturePage(req)}finally{if(prior===undefined)delete globalThis.document;else globalThis.document=prior}
}

test('all seven exact approved Chinese neutral routes pass complete 85/86-character states',()=>{
 for(const r of routes){const p=proof({},r);assert.equal(p.bodyChars,r==='/emailsubscriber/'?86:85);assert.equal(p.neutralConfirmation.complete,true);assert.doesNotThrow(()=>assertCapturePage(p,r));}
});

test('approved home destination accepts source absolute and repaired root-relative hrefs',()=>{
 for(const href of ['https://ayurvedichealingvillage.com/zh/','/zh/'])assert.doesNotThrow(()=>assertCapturePage(proof({href}),route));
 const prior=globalThis.location;globalThis.location={origin:'http://127.0.0.1:3218'};
 try{assert.doesNotThrow(()=>assertCapturePage(proof({href:'http://127.0.0.1:3218/zh/'}),route));}finally{if(prior===undefined)delete globalThis.location;else globalThis.location=prior}
});

test('other locales and routes retain the ordinary100-character floor',()=>{
 for(const locale of ['en','ja','ko','zh']){assert.equal(requirements(route,locale).neutralConfirmation,undefined);assert.throws(()=>assertCapturePage(proof({},route,locale),route),/page body/);}
 for(const r of ['/about-us/','/cart/','/checkout/']){assert.equal(requirements(r).neutralConfirmation,undefined);assert.throws(()=>assertCapturePage(proof({},r),r),/page body/);}
});

test('missing or altered neutral heading cannot pass',()=>{
 for(const changes of [{headings:0},{heading:'已提交'},{headings:2}])assert.throws(()=>assertCapturePage(proof(changes),route),/H1|neutral confirmation/);
});

test('missing, altered, duplicate or filler neutral paragraph cannot pass',()=>{
 for(const changes of [{paragraphs:0},{body:'已收到您的留言。'},{paragraphs:2},{body:contract.body+' arbitrary filler '.repeat(12)}])assert.throws(()=>assertCapturePage(proof(changes),route),/neutral confirmation/);
});

test('missing, duplicate or altered action and wrong destinations cannot pass',()=>{
 for(const changes of [{actions:0},{actions:2},{label:'提交成功'},{href:''},{href:'/en/'},{href:'https://example.com/zh/'},{href:'/zh/?success=true'},{href:'/zh/#submitted'},{href:'.'},{href:'./'},{href:'https://user:password@ayurvedichealingvillage.com/zh/'}])assert.throws(()=>assertCapturePage(proof(changes),route),/neutral confirmation/);
});

test('exact neutral state rejects receipt success, missing/duplicate state and forms',()=>{
 for(const changes of [{receipts:1},{states:0},{states:2},{forms:1},{brand:'Wrong brand'}])assert.throws(()=>assertCapturePage(proof(changes),route),/neutral confirmation/);
});

test('component errors and missing H1 remain unconditional failures',()=>{
 assert.throws(()=>assertCapturePage(proof({error:'Component import failed'}),route),/Rendered component error/);
 assert.throws(()=>assertCapturePage(proof({rootHeadings:[]}),route),/H1/);
});

test('arbitrary short or malformed serialized neutral proofs cannot bypass the floor',()=>{
 const p=proof();
 for(const bodyChars of [0,1,40,77])assert.throws(()=>assertCapturePage({...p,bodyChars},route),/page body/);
 for(const neutralConfirmation of [null,{}, {...p.neutralConfirmation,locale:'ja'},{...p.neutralConfirmation,id:'unknown'}, {...p.neutralConfirmation,complete:undefined}])assert.throws(()=>assertCapturePage({...p,neutralConfirmation},route),/Malformed/);
 const noProof={...p};delete noProof.neutralConfirmation;assert.throws(()=>assertCapturePage(noProof,route),/page body/);
 assert.throws(()=>assertCapturePage(p,'/about-us/'),/Malformed/);
});

test('ordinary pages still require100 characters and all existing content booleans',()=>{
 const ordinary={errors:[],heading:'Page',bodyChars:99,requiredForm:true,requiredContent:true,forbiddenContent:false};
 assert.throws(()=>assertCapturePage(ordinary,'/about-us/'),/page body/);
 assert.doesNotThrow(()=>assertCapturePage({...ordinary,bodyChars:100},'/about-us/'));
 for(const key of ['requiredForm','requiredContent'])assert.throws(()=>assertCapturePage({...proof(),[key]:false},route));
 assert.throws(()=>assertCapturePage({...proof(),forbiddenContent:true},route));
});

test('both live and extracted neutral proofs independently enforce complete semantics',()=>{
 for(const [liveChanges,savedChanges]of [[{},{}],[{paragraphs:0},{}],[{},{actions:0}]]){
  const live=fixture(contract,liveChanges),saved=fixture(contract,savedChanges),prior=globalThis.document;
  globalThis.document={getElementById:()=>live,createElement:()=>({content:{firstElementChild:saved}})};
  try{const result=createCaptureEvaluation(()=>({html:'<section data-state="direct-visit"></section>'}))(requirements());
   if(liveChanges.paragraphs===0)assert.throws(()=>assertCapturePage(result.liveContentProof,route),/neutral confirmation/);else assert.doesNotThrow(()=>assertCapturePage(result.liveContentProof,route));
   if(savedChanges.actions===0)assert.throws(()=>assertCapturePage(result.contentProof,route),/neutral confirmation/);else assert.doesNotThrow(()=>assertCapturePage(result.contentProof,route));
  }finally{if(prior===undefined)delete globalThis.document;else globalThis.document=prior}
 }
});

test('seven contracts exactly match frozen approved Chinese data and both source views',()=>{
 const site=process.env.AHV_NEUTRAL_CONTRACT_SITE||fileURLToPath(new URL('../',import.meta.url));
 const window={};vm.runInNewContext(fs.readFileSync(path.join(site,'public/ahv/l10n/zh/assets/confirmation-family-data.js'),'utf8'),{window});
 for(const r of routes){const source=window.AHV_CONFIRM.routes.find(x=>x.path===r),dv=source.directVisit||window.AHV_CONFIRM.directVisit,expected=requirements(r).neutralConfirmation;assert.equal(expected.heading,dv.heading);assert.equal(expected.body,dv.body);assert.equal(expected.label,dv.link.label);assert.equal(expected.href,dv.link.href);}
 for(const variant of ['mobile','desktop']){const view=JSON.parse(fs.readFileSync(path.join(site,'public/ahv/l10n/zh/views/ahv-page-confirmation-'+variant+'.json')));assert.ok(view.template.includes('data-state="direct-visit"'));assert.ok(view.template.includes('Kairali — The Ayurvedic Healing Village · 始于1908年'));assert.match(view.logic,/isDirect: utility \|\| !receipt \|\| !R/);}
});
