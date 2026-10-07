'use client';
import {useRef,useState,type FormEvent} from 'react';

/** AHV-only short enquiry UI. Receipt appears only after /api/lead/ confirms
 * durable storage (database via the signed relay, then the Sheet). While that
 * route is not configured it answers 503 *_NOT_CONFIGURED and this form says
 * so truthfully — nothing is sent, nothing is claimed. Without JavaScript the
 * form posts to /api/forms-unavailable, which never reads the body. */
export function CampaignEnquiryForm({formType='consultation',heading='Request a consultation',submitLabel='Request consultation',localizedSubmitLabel,lang='en'}:{formType?:string;heading?:string;submitLabel?:string;localizedSubmitLabel?:string;lang?:string}) {
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
  messageOptional:'optional',consent:'Ich stimme zu, zu meiner Anfrage kontaktiert zu werden.',privacy:'Datenschutzerklärung (EN)',sending:'Wird gesendet…',submit:localizedSubmitLabel||'Programm anfragen'
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
   const bridge=(window as Window & {AHV_MEASUREMENT?:{attribution?:()=>Record<string,string>}}).AHV_MEASUREMENT;
   const incoming=new URLSearchParams(window.location.search);
   const campaign=bridge?.attribution?.()||Object.fromEntries(['gclid','gbraid','wbraid','fbclid','utm_source','utm_medium','utm_campaign','utm_content','utm_term'].flatMap(k=>{
    const pattern=k.startsWith('utm_')?/^[a-zA-Z0-9_.~ &-]{1,120}$/:/^[a-zA-Z0-9_.~-]{1,120}$/;
    const value=incoming.getAll(k).find(value=>pattern.test(value));return value?[[k,value]]:[];
   }));
   const query=new URLSearchParams(campaign);
   const sourceUrl=window.location.origin+window.location.pathname+(query.toString()?'?'+query.toString():'');
   let referrer='';try{referrer=new URL(document.referrer).origin+'/';}catch{}
   if(!submissionToken.current)submissionToken.current=crypto.randomUUID();
   const response=await fetch('/api/lead/',{method:'POST',credentials:'same-origin',cache:'no-store',signal:controller.signal,headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({form:'landing-page',submissionToken:submissionToken.current,site_language:lang,lead_source_url:sourceUrl,referrer,...campaign,fields:{landing_page_path:window.location.pathname,form_variant:formType,fname:String(data.get('fullName')).trim(),email:String(data.get('email')).trim(),phone:String(data.get('phone')||'').trim(),message:String(data.get('message')||'').trim(),consent:data.get('consent')==='on'}})});
   const result=await response.json().catch(()=>({}));
   if(response.status===503&&/_NOT_CONFIGURED$/.test(String(result.code||'')))throw new Error(copy.notConnected);
   if(!response.ok||result.ok!==true)throw new Error(response.status===429?copy.retry:copy.unconfirmed);
   if(typeof result.guideUrl==='string'&&result.guideUrl.startsWith('/')){const guide=document.createElement('a');guide.href=result.guideUrl;guide.download='';guide.hidden=true;document.body.appendChild(guide);guide.click();guide.remove();}
   setSent(true);
  }catch(e){/* only messages this form raised itself are shown; a browser network error (TypeError) or a timeout (AbortError) gets the plain retry text */setError(e instanceof Error&&e.name==='Error'?e.message:copy.network);}finally{clearTimeout(timeout);setSending(false);}
 }
 if(sent)return <p role="status">{copy.sent}</p>;
 return <form className="enquiry-form" action="/api/forms-unavailable" method="post" onSubmit={submit} onInput={()=>{if(!sending)submissionToken.current=null}}>
  <h3>{heading}</h3><p>{copy.intro}</p>
  <div className="field"><label htmlFor="campaign-name">{copy.name}</label><input id="campaign-name" name="fullName" autoComplete="name" required maxLength={120} pattern={String.raw`.*\S.*`}/></div>
  <div className="field"><label htmlFor="campaign-email">{copy.email}</label><input id="campaign-email" name="email" type="email" autoComplete="email" required maxLength={254}/></div>
  <div className="field"><label htmlFor="campaign-phone">{copy.phone} <span>({copy.optional})</span></label><input id="campaign-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} pattern="[+0-9() .-]{7,30}" placeholder="+91 …"/></div>
  <div className="field"><label htmlFor="campaign-message">{copy.message} <span>({copy.messageOptional})</span></label><textarea id="campaign-message" name="message" rows={3} maxLength={3000}/></div>
  <div hidden aria-hidden="true"><label>Leave empty<input name="company" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="consent"><input name="consent" type="checkbox" required/><span>{copy.consent} <a href="/new-privacy-policy/">{copy.privacy}</a></span></label>
  <button className="btn btn-primary" disabled={sending} type="submit">{sending?copy.sending:copy.submit}</button>
  {error&&<p className="enquiry-error" role="alert">{error}</p>}
 </form>;
}
