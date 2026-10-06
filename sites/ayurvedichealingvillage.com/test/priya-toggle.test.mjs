import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
for (const chromeFile of ['chrome.js', 'review-chrome.js']) {
const source=readFileSync(new URL('../public/design/'+chromeFile,import.meta.url),'utf8');
function fixture(ready=true){
 const code=source.slice(source.indexOf('  var chatPending ='),source.indexOf('  function chatLinks(f)'));
 const label={textContent:'Chat with Priya'};
 const element=()=>({attrs:{},getAttribute(k){return this.attrs[k]??null},setAttribute(k,v){this.attrs[k]=v},querySelector(){return label}});
 const body=element(),launcher=element(),button=element(),panel=element();button.attrs['aria-expanded']='false';let clicks=0;button.click=()=>{clicks++;button.attrs['aria-expanded']=button.attrs['aria-expanded']==='true'?'false':'true'};
 const timers=new Map();let seq=0;let isReady=ready;
 const context={document:{body,getElementById(id){return isReady?(id==='chatbase-bubble-button'?button:panel):null},querySelector(){return launcher}},window:{dispatchEvent(){},location:{href:''}},Event:class{},visible:()=>false,WA_HREF:'https://wa.me/919289838797',setTimeout(fn){timers.set(++seq,fn);return seq},clearTimeout(id){timers.delete(id)}};
 vm.createContext(context);vm.runInContext(code,context);
 return {context,launcher,button,label,body,timers,ready(){isReady=true},click(){context.openChat({preventDefault(){}})},get clicks(){return clicks},tick(){const [id,fn]=timers.entries().next().value;timers.delete(id);fn()}};
}
test('same launcher toggles native widget and synchronizes when provider close control is used',()=>{
 const f=fixture();f.click();assert.equal(f.launcher.attrs['aria-expanded'],'true');assert.equal(f.label.textContent,'Minimize chat');f.click();assert.equal(f.launcher.attrs['aria-expanded'],'false');assert.equal(f.clicks,2);
 f.click();f.button.attrs['aria-expanded']='false';f.context.syncChatState();assert.equal(f.label.textContent,'Chat with Priya');f.click();assert.equal(f.button.attrs['aria-expanded'],'true');
});
test('second click while loading cancels pending open and fallback',()=>{
 const f=fixture(false);f.click();assert.equal(f.launcher.attrs['aria-busy'],'true');f.click();assert.equal(f.timers.size,0);f.ready();f.context.syncChatState();assert.equal(f.clicks,0);assert.equal(f.context.window.location.href,'');assert.equal(f.launcher.attrs['aria-busy'],'false');
});
test('deferred widget opens once after readiness and offline fallback remains available',()=>{
 const f=fixture(false);f.click();f.ready();f.tick();assert.equal(f.clicks,1);assert.equal(f.timers.size,0);
 const offline=fixture(false);offline.click();while(offline.timers.size)offline.tick();assert.equal(offline.context.window.location.href,'https://wa.me/919289838797');
});

}
