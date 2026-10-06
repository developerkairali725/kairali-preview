import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../public/design/landing-page-form-submit.js', import.meta.url), 'utf8');
function fixture(search, campaign, responses = [200]) {
  const listeners = {}, requests = [], attrs = new Map();
  const fields = {email:'synthetic@example.test', fname:'Synthetic test', phone:'9999999999', consent:'yes', utm_source:'old-default'};
  const elements = Object.entries(fields).map(([name,value]) => ({name,value}));
  elements.namedItem = name => elements.find(x => x.name === name);
  const status = {textContent:'', classList:{contains:()=>true}}, button = {disabled:false};
  let resets = 0;
  const form = {id:'campaign',elements,getAttribute:name=>attrs.get(name),hasAttribute:name=>attrs.has(name),setAttribute:(name,value)=>attrs.set(name,value),removeAttribute:name=>attrs.delete(name),querySelector:selector=>selector.includes('submit')?button:status,reportValidity:()=>true,reset:()=>resets++};
  const context = {URLSearchParams,AbortController,crypto:{randomUUID:()=> 'b48b7aad-56ac-424a-844c-c1c45ab186ec'},setTimeout:()=>1,clearTimeout(){},FormData:class{get(name){return fields[name]||null;}},document:{referrer:'',getElementById:()=>null,addEventListener:(name,fn)=>listeners[name]=fn,querySelectorAll:()=>[form]},window:{location:{pathname:'/pain-management.html',search,href:'https://example.test/pain-management.html'+search},AHV_LEAD_RECEIPT:{attribution:()=>campaign,siteLanguage:()=>'en'}},fetch:async(url,init)=>{requests.push({url,body:JSON.parse(init.body)});const code=responses.shift()??200;return {ok:code===200,status:code,json:async()=>({ok:code===200,status:code===200?'received':'failed'})};}};
  vm.runInNewContext(source, context);
  return {requests,status,button,get resets(){return resets;},submit:()=>listeners.submit({target:form,preventDefault(){},stopImmediatePropagation(){}})};
}
test('campaign submit runs end-to-end and posts normalized attribution with the legacy keyword alias',async()=>{
  const view=fixture('?utm_keyword=&utm_keyword=ayurvedic+care',{utm_source:'google',utm_campaign:'Brand & Competition',gclid:'paid123',gbraid:'braid456'});
  await view.submit();
  assert.equal(view.requests.length,1);
  const {url,body}=view.requests[0];
  assert.equal(url,'/api/lead/');assert.equal(body.utm_source,'google');assert.equal(body.utm_campaign,'Brand & Competition');
  assert.equal(body.gclid,'paid123');assert.equal(body.gbraid,'braid456');assert.equal(body.utm_term,'ayurvedic care');assert.equal(body.fields.utm_keyword,'ayurvedic care');
  assert.match(view.status.textContent,/received/);assert.equal(view.resets,1);assert.equal(view.button.disabled,false);
});
test('campaign submit rejects a private keyword and retries a failed receipt with the same token',async()=>{
  const view=fixture('?utm_keyword=private%40example.test',{utm_term:'preferred term'},[502,200]);
  await view.submit();assert.equal(view.resets,0);assert.match(view.status.textContent,/could not confirm/);
  await view.submit();assert.equal(view.requests.length,2);assert.equal(view.requests[0].body.submissionToken,view.requests[1].body.submissionToken);
  assert.equal(view.requests[1].body.fields.utm_keyword,'');assert.equal(view.requests[1].body.utm_term,'preferred term');assert.equal(view.resets,1);
});
