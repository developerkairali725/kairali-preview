import test from 'node:test';
import assert from 'node:assert/strict';
import { installMobileAskLabel } from '../campaign-v2/production/mobile-ask-label.ts';
function fixture(label) {
 let text='Chat',writes=0,notify=()=>{},disconnected=false,ready=false;
 const chat={get textContent(){return text},set textContent(v){writes++;text=v}};
 const doc={body:{},querySelector(s){if(s==='.lp-prod[data-variant="C"] .lp-hero__ask')return label?{textContent:label}:null;if(s==='#ahv-cta-bar .ahv-contact-trigger')return ready?chat:null;throw Error(s)}};
 class Observer {constructor(fn){notify=fn}observe(body,opts){assert.equal(body,doc.body);assert.deepEqual(opts,{childList:true,subtree:true})}disconnect(){disconnected=true}}
 const stop=installMobileAskLabel(doc,Observer);
 return {show(){ready=true;notify()},notify:()=>notify(),text:()=>text,writes:()=>writes,stop,disconnected:()=>disconnected};
}
test('localized mobile label works after delayed chrome creation and settles without repeated DOM writes',()=>{
 for(const label of ['Ask Anything','Fragen Sie uns','Задать вопрос']){
  const f=fixture(label);assert.equal(f.writes(),0);f.show();assert.equal(f.text(),label);
  for(let i=0;i<20;i++)f.notify();assert.equal(f.writes(),1);
  f.stop();assert.equal(f.disconnected(),true);
 }
});
test('other variants retain their existing Chat label',()=>{const f=fixture(null);f.show();assert.equal(f.text(),'Chat');assert.equal(f.writes(),0);f.stop();assert.equal(f.disconnected(),false,'No observer was installed')});
