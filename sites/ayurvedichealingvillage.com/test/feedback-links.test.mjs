import test from 'node:test';
import assert from 'node:assert/strict';
import {feedbackLinks,QUICK_LINKS,MANAGEMENT_EMAIL,PATIENT_CARE_NUMBER} from '../app/(english)/givefeedback/feedback-links.ts';
test('Email and WhatsApp drafts preserve Unicode, punctuation and line breaks without changing recipients',()=>{
 const d={name:'Preview Test',stay:'September 2026 / TEST-123',topic:'A concern',message:'Room & food?\nSuggestion: शांत समय + more details #1'};
 const links=feedbackLinks(d);const email=new URL(links.email);const wa=new URL(links.whatsapp);
 assert.equal(email.pathname,MANAGEMENT_EMAIL);assert.match(email.searchParams.get('subject'),/^For management: A concern/);
 assert.ok(email.searchParams.get('body').includes(d.message));assert.ok(email.searchParams.get('body').includes(d.stay));
 assert.equal(wa.hostname,'wa.me');assert.equal(wa.pathname,'/'+PATIENT_CARE_NUMBER);assert.ok(wa.searchParams.get('text').includes(d.message));assert.match(wa.searchParams.get('text'),/Please pass this to the management team/);
 assert.deepEqual([...email.searchParams.keys()],['subject','body']);assert.deepEqual([...wa.searchParams.keys()],['text']);
});
test('Optional fields omitted and unrecognised topics cannot inject mail headers',()=>{
 const links=feedbackLinks({name:' ',stay:'',topic:'bad\r\nBcc:someone@example.test',message:'A suggestion'});
 const email=new URL(links.email);assert.match(email.searchParams.get('subject'),/General feedback/);assert.doesNotMatch(email.searchParams.get('body'),/Name:|booking reference:/);assert.equal(email.searchParams.has('bcc'),false);
});
test('Quick actions include editable prompts and management destination',()=>{
 assert.match(QUICK_LINKS.email,/^mailto:info@kairali.com\?/);assert.match(QUICK_LINKS.emailBody,/What I would like you to know:/);assert.match(QUICK_LINKS.whatsappBody,/Hi Priya/);
});
