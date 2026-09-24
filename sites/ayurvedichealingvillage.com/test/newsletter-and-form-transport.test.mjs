import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newsletterFooters} from '../app/(english)/_families/newsletter-markup.mjs';
import {formPostSafety} from '../app/(english)/_families/form-post-safety.mjs';
import {POST as newsletterPost} from '../app/api/newsletter/route.ts';
import {POST as unavailablePost} from '../app/api/forms-unavailable/route.ts';

test('newsletter is separate from leads and never reads or stores the submitted body before configuration',async()=>{
 const req=new Request('https://example.test/api/newsletter',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'synthetic@example.invalid'})});
 const res=await newsletterPost(req);assert.equal(res.status,503);assert.equal(req.bodyUsed,false);assert.equal(res.headers.get('cache-control'),'no-store');assert.deepEqual(await res.json(),{ok:false,code:'NEWSLETTER_NOT_CONFIGURED'});
});
test('no-JS newsletter response does not echo personal input or claim success',async()=>{
 const req=new Request('https://example.test/api/newsletter',{method:'POST',headers:{accept:'text/html'},body:'email=synthetic%40example.invalid'});const res=await newsletterPost(req);assert.equal(res.status,503);assert.equal(req.bodyUsed,false);const body=await res.text();assert.match(body,/Nothing has been saved or sent/);assert.doesNotMatch(body,/synthetic/);
});
test('pending form fallback is unavailable rather than a false receipt',async()=>{const res=await unavailablePost();assert.equal(res.status,503);assert.match(await res.text(),/not been saved or sent/)});
test('personal fields cannot be encoded into a GET URL or posted to legacy PHP',()=>{
 for(const form of ['<form><input name="email"></form>','<form method="get" action="/enquiry-form/"><input name="message"></form>','<form action="https://ayurvedichealingvillage.com/submitContactForm.php" method="post"><input name="phone"></form>']){
 const safe=formPostSafety(form);assert.match(safe,/action="\/api\/forms-unavailable" method="post"/);assert.doesNotMatch(safe,/method="get"|action="https:/);assert.equal(formPostSafety(safe),safe);
 }
});
test('search navigation, guide navigation and dedicated newsletter keep their contracts',()=>{
 for(const form of ['<form role="search" action="/ayurvedic-treatments/" method="get">','<form action="/search" method="get">','<form id="u7-search">','<form data-ahv-guide-form="1" action="/faqs-downloads/#downloads" method="get">','<form data-ahv-newsletter="1" action="/api/newsletter" method="post">'])assert.equal(formPostSafety(form),form);
});
test('all captured footer Subscribe links become real email forms, in bounded batches',()=>{
 const dir=new URL('../english-candidate/prerender/',import.meta.url);const files=fs.readdirSync(dir).filter(f=>f.endsWith('.html'));let converted=0;
 for(let start=0;start<files.length;start+=25)for(const file of files.slice(start,start+25)){
 const old=fs.readFileSync(new URL(file,dir),'utf8');const updated=newsletterFooters(old);assert.equal(newsletterFooters(updated),updated);
 for(const footer of updated.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)||[]){assert.doesNotMatch(footer,/<a\b[^>]*>Subscribe<\/a>/i,file);assert.doesNotMatch(footer,/<button\b[^>]*type="button"[^>]*>Subscribe<\/button>/i,file)}
 if(old!==updated)converted++;
 }
 assert.ok(converted>200,'Expected shared footer coverage across registered page snapshots');
});

test('all design form templates and snapshots use safe transport without changing field definitions',()=>{
 const dir=new URL('../public/ahv/views/',import.meta.url);const files=fs.readdirSync(dir).filter(f=>f.endsWith('.json'));let forms=0;
 for(let start=0;start<files.length;start+=25)for(const file of files.slice(start,start+25)){
 const {template=''}=JSON.parse(fs.readFileSync(new URL(file,dir),'utf8'));const safe=formPostSafety(template);
 assert.deepEqual(safe.match(/<(?:input|select|textarea)\b[^>]*>/gi),template.match(/<(?:input|select|textarea)\b[^>]*>/gi),file);
 for(const tag of safe.match(/<form\b[^>]*>/gi)||[]){forms++;if(/data-ahv-delivery-pending/.test(tag)){assert.match(tag,/method="post"/);assert.match(tag,/action="\/api\/forms-unavailable"/)}else assert.match(tag,/role="search"|id="u7-search"|data-ahv-newsletter|data-ahv-guide-form|action="\/search/)}
 }
 assert.ok(forms>20);
});
