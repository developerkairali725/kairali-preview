import test from 'node:test';
import assert from 'node:assert/strict';
import {validationProblem} from '../lib/lead-validation.ts';
import {validCampaignPhone,normaliseCampaignPhone,CAMPAIGN_PHONE_PATTERN} from '../lib/campaign-phone.ts';
const paths=['/ayurvedic-treatment-packages.html','/panchkarma-treatment.html','/pain-management.html','/family-ayurvedic-retreat-kerala.html','/preventive-rejuvenation-detoxification.html','/ayurveda-retreat-kerala.html','/weight-loss-programme','/digestive-wellness-gut-health-yoga-therapy','/karkidaka-chikitsha-or-monsoon-wellness.html'];
for(const path of paths) test(`Native campaign cannot omit required fields or consent: ${path}`,()=>{
 const fields={landing_page_path:path+'/',fname:'Example Visitor',email:'visitor@example.com',phone:'+91 98765 43219',consent:true,message:''};
 assert.equal(validationProblem('landing-page',fields),null);
 for(const missing of ['fname','phone','email']) assert.equal(validationProblem('landing-page',{...fields,[missing]:''}),'MISSING_REQUIRED_FIELDS');
 assert.equal(validationProblem('landing-page',{...fields,consent:false}),'MISSING_REQUIRED_FIELDS');
 assert.equal(validationProblem('landing-page',{...fields,fname:'x'.repeat(121)}),'INVALID_FIELD_LENGTH');
 assert.equal(validationProblem('landing-page',{...fields,message:'x'.repeat(3001)}),'INVALID_FIELD_LENGTH');
});
test('International phone formatting accepts country codes and rejects obvious spam',()=>{
 for(const number of ['+91 98765 43219','+44 20 7946 0958','+1 (202) 555-0137','+49 30 12345678','+971 50 123 4567'])assert.equal(validCampaignPhone(number),true,number);
 for(const number of ['9876543219','+91 9999999999','+91 1234567890','+91 98765','+00 123456789','+1 1111111111','+1234567890123456','+44 abc12345678'])assert.equal(validCampaignPhone(number),false,number);
});

test('Common national trunk prefixes normalize without stripping Italy’s significant zero',()=>{
 assert.equal(normaliseCampaignPhone('+91 09876543219'),'+91 9876543219');
 assert.equal(normaliseCampaignPhone('+44 (0)20 7946 0958'),'+44 20 7946 0958');
 assert.equal(normaliseCampaignPhone('+39 06 12345678'),'+39 06 12345678');
 assert.equal(validCampaignPhone('+91 09876543219'),true);
});

test('Server rejects honeypot and invalid campaign before any transport',async()=>{
 const {POST}=await import('../app/api/lead/route.ts');
 const config={AHV_FORM_RELAY_URL:'https://relay.example.test/ahv-form-relay/',AHV_FORM_RELAY_SECRET:'r'.repeat(48),AHV_LEAD_SHEET_WEBHOOK_URL:'https://script.google.com/macros/s/test/exec',AHV_LEAD_SHEET_WEBHOOK_SECRET:'test-secret-that-is-at-least-24-characters'};
 const previous=Object.fromEntries(Object.keys(config).map(k=>[k,process.env[k]]));Object.assign(process.env,config);
 try{
  const make=payload=>new Request('https://example.test/api/lead/',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const spam=await POST(make({form:'landing-page',company:'spam bot'}));assert.equal(spam.status,400);assert.equal((await spam.json()).code,'INVALID_SUBMISSION');
  for(const path of paths){const invalid=await POST(make({form:'landing-page',submissionToken:'545404ff-a177-4f93-b5ab-10b90ee90d58',fields:{landing_page_path:path,email:'visitor@example.com'}}));assert.equal(invalid.status,400);assert.equal((await invalid.json()).code,'MISSING_REQUIRED_FIELDS');}
 }finally{for(const k of Object.keys(config)) previous[k]===undefined?delete process.env[k]:process.env[k]=previous[k];}
});

test('Native HTML phone pattern compiles with modern browser Unicode sets',()=>{
 const pattern=new RegExp('^(?:'+CAMPAIGN_PHONE_PATTERN+')$','v');
 assert.equal(pattern.test('+1 (202) 555-0137'),true);
 assert.equal(pattern.test('98765 43219'),true);
 assert.equal(pattern.test('abc12345678'),false);
});
