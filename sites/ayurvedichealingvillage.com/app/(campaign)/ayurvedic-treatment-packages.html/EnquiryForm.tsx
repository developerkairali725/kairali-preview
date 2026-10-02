'use client';
import {useRef,useState,type FormEvent} from 'react';

/** AHV-only short enquiry UI. Receipt appears only after /api/lead/ confirms
 * durable storage (database via the signed relay, then the Sheet). While that
 * route is not configured it answers 503 *_NOT_CONFIGURED and this form says
 * so truthfully — nothing is sent, nothing is claimed. Without JavaScript the
 * form posts to /api/forms-unavailable, which never reads the body. */
export function R10EnquiryForm({formType='consultation',heading='Request a consultation',submitLabel='Request consultation',lang='en'}:{formType?:string;heading?:string;submitLabel?:string;lang?:string}) {
 const [sending,setSending]=useState(false),[error,setError]=useState(''),[sent,setSent]=useState(false);
 const submissionToken=useRef<string|null>(null);
 const de=lang==='de';
 const copy=de?{
  notConnected:'Dieses Formular ist derzeit nicht verbunden. Es wurde nichts gesendet. Bitte nutzen Sie WhatsApp oder schreiben Sie an info@kairali.com.',
  retry:'Bitte warten Sie, bevor Sie es erneut versuchen. Ihre Angaben bleiben im Formular.',
  unconfirmed:'Wir konnten den Eingang Ihrer Anfrage nicht bestätigen. Ihre Angaben bleiben im Formular; bitte versuchen Sie es erneut oder nutzen Sie WhatsApp.',
  network:'Wir konnten den Eingang Ihrer Anfrage nicht bestätigen. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
  sent:'Vielen Dank. Ihre Anfrage ist eingegangen.', intro:'Teilen Sie uns mit, wie wir Sie erreichen können. Unser Patientenservice hilft Ihnen bei der Planung Ihres Aufenthalts.',
  name:'Ihr Name',email:'E-Mail',phone:'Telefon / WhatsApp',optional:'optional, mit Ländervorwahl',message:'Wie können wir helfen?',
  messageOptional:'optional',consent:'Ich stimme zu, zu meiner Anfrage kontaktiert zu werden.',privacy:'Datenschutzerklärung (EN)',sending:'Wird gesendet…',submit:'Programm anfragen'
 }:{
  notConnected:'This form is not connected yet. Nothing has been sent. Please use WhatsApp or email info@kairali.com.',
  retry:'Please wait before trying again. Your details are still here.',
  unconfirmed:'We could not confirm your enquiry. Your details are still here; please retry or use WhatsApp.',
  network:'We could not confirm your enquiry. Check your connection and try again.',
  sent:'Thank you. Your enquiry has been received.',intro:'Tell us how to reach you. Our patient care team can help you plan your visit.',
  name:'Your name',email:'Email',phone:'Phone / WhatsApp',optional:'optional, include country code',message:'How can we help?',
  messageOptional:'optional',consent:'I agree to be contacted about my enquiry.',privacy:'Privacy policy',sending:'Sending…',submit:submitLabel
 };
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;if(!form.reportValidity()||sending)return;
  const data=new FormData(form);if(data.get('company'))return;
  setSending(true);setError('');
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  try{
   const url=new URL(window.location.href);
   const campaign=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'].map(k=>[k,url.searchParams.get(k)||'']));
   if(!submissionToken.current)submissionToken.current=crypto.randomUUID();
   const response=await fetch('/api/lead/',{method:'POST',credentials:'same-origin',cache:'no-store',signal:controller.signal,headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({form:'landing-page',submissionToken:submissionToken.current,site_language:lang,lead_source_url:window.location.href,referrer:document.referrer,...campaign,fields:{landing_page_path:window.location.pathname,form_variant:formType,fname:String(data.get('fullName')).trim(),rdogender:String(data.get('rdogender')||''),email:String(data.get('email')).trim(),phone:String(data.get('phone')||'').trim(),message:String(data.get('message')||'').trim(),consent:data.get('consent')==='on'}})});
   const result=await response.json().catch(()=>({}));
   if(response.status===503&&/_NOT_CONFIGURED$/.test(String(result.code||'')))throw new Error(copy.notConnected);
   if(!response.ok||result.ok!==true||result.status!=='received')throw new Error(response.status===429?copy.retry:copy.unconfirmed);
   if(typeof result.guideUrl==='string'&&result.guideUrl.startsWith('/')){const guide=document.createElement('a');guide.href=result.guideUrl;guide.download='';guide.hidden=true;document.body.appendChild(guide);guide.click();guide.remove();}
   setSent(true);
  }catch(e){/* only messages this form raised itself are shown; a browser network error (TypeError) or a timeout (AbortError) gets the plain retry text */setError(e instanceof Error&&e.name==='Error'?e.message:copy.network);}finally{clearTimeout(timeout);setSending(false);}
 }
 if(sent)return <p role="status">{copy.sent}</p>;
 return <form className="enquiry" id="enquiry" action="/api/forms-unavailable" method="post" onSubmit={submit} onInput={()=>{if(!sending)submissionToken.current=null}}>
  <h2>Enquire now</h2><div className="form-grid">
  <div className="field"><label htmlFor="R10-fname">Name</label><input id="R10-fname" name="fullName" autoComplete="name" required maxLength={120} pattern={String.raw`.*\S.*`}/></div>
  <fieldset className="field gender-field"><legend>Gender</legend><div className="choices"><label><input name="rdogender" type="radio" value="Male"/> Male</label><label><input name="rdogender" type="radio" value="Female"/> Female</label></div></fieldset>
  <div className="field"><label htmlFor="R10-phone">Phone No</label><input id="R10-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={30} pattern="[+0-9() .-]{7,30}"/></div>
  <div className="field"><label htmlFor="R10-email">Email Id</label><input id="R10-email" name="email" type="email" autoComplete="email" required maxLength={254}/></div>
  <div className="field"><label htmlFor="R10-message">Message</label><textarea id="R10-message" name="message" rows={4} maxLength={3000}/></div>
  <div hidden aria-hidden="true"><label>Leave empty<input name="company" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="field consent"><input id="R10-chkAgree" name="consent" type="checkbox" required/><span>I have read and agree to the <a href="/new-privacy-policy/">privacy policy</a> and <a href="/terms-and-conditions/">terms</a></span></label>
  </div><button className="primary" disabled={sending} type="submit">{sending?'Sending…':'Submit enquiry'}</button>
  {error&&<p className="enquiry-error" role="alert">{error}</p>}
 </form>;
}
