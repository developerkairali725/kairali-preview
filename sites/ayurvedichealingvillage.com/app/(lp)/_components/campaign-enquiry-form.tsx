'use client';
import {useRef,useState,type FormEvent} from 'react';

/** AHV-only short enquiry UI. Receipt appears only after /api/lead/ confirms
 * durable storage (database via the signed relay, then the Sheet). While that
 * route is not configured it answers 503 *_NOT_CONFIGURED and this form says
 * so truthfully — nothing is sent, nothing is claimed. Without JavaScript the
 * form posts to /api/forms-unavailable, which never reads the body. */
export function CampaignEnquiryForm({formType='consultation',heading='Request a consultation',submitLabel='Request consultation'}:{formType?:string;heading?:string;submitLabel?:string}) {
 const [sending,setSending]=useState(false),[error,setError]=useState(''),[sent,setSent]=useState(false);
 const submissionToken=useRef<string|null>(null);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;if(!form.reportValidity()||sending)return;
  const data=new FormData(form);if(data.get('company'))return;
  setSending(true);setError('');
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  try{
   const url=new URL(window.location.href);
   const campaign=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k=>[k,url.searchParams.get(k)||'']));
   if(!submissionToken.current)submissionToken.current=crypto.randomUUID();
   const response=await fetch('/api/lead/',{method:'POST',credentials:'same-origin',cache:'no-store',signal:controller.signal,headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({form:'landing-page',submissionToken:submissionToken.current,site_language:document.documentElement.lang||'en',lead_source_url:window.location.href,referrer:document.referrer,...campaign,fields:{landing_page_path:window.location.pathname,form_variant:formType,fname:String(data.get('fullName')).trim(),email:String(data.get('email')).trim(),phone:String(data.get('phone')||'').trim(),message:String(data.get('message')||'').trim(),consent:data.get('consent')==='on'}})});
   const result=await response.json().catch(()=>({}));
   if(response.status===503&&/_NOT_CONFIGURED$/.test(String(result.code||'')))throw new Error('This form is not connected yet. Nothing has been sent. Please use WhatsApp or email info@kairali.com.');
   if(!response.ok||result.ok!==true)throw new Error(response.status===429?'Please wait before trying again. Your details are still here.':'We could not confirm your enquiry. Your details are still here; please retry or use WhatsApp.');
   if(typeof result.guideUrl==='string'&&result.guideUrl.startsWith('/')){const guide=document.createElement('a');guide.href=result.guideUrl;guide.download='';guide.hidden=true;document.body.appendChild(guide);guide.click();guide.remove();}
   setSent(true);
  }catch(e){/* only messages this form raised itself are shown; a browser network error (TypeError) or a timeout (AbortError) gets the plain retry text */setError(e instanceof Error&&e.name==='Error'?e.message:'We could not confirm your enquiry. Check your connection and try again.');}finally{clearTimeout(timeout);setSending(false);}
 }
 if(sent)return <p role="status">Thank you. Your enquiry has been received.</p>;
 return <form className="enquiry-form" action="/api/forms-unavailable" method="post" onSubmit={submit} onInput={()=>{if(!sending)submissionToken.current=null}}>
  <h3>{heading}</h3><p>Tell us how to reach you. Our patient care team can help you plan your visit.</p>
  <div className="field"><label htmlFor="campaign-name">Your name</label><input id="campaign-name" name="fullName" autoComplete="name" required maxLength={120} pattern={String.raw`.*\S.*`}/></div>
  <div className="field"><label htmlFor="campaign-email">Email</label><input id="campaign-email" name="email" type="email" autoComplete="email" required maxLength={254}/></div>
  <div className="field"><label htmlFor="campaign-phone">Phone / WhatsApp <span>(optional, include country code)</span></label><input id="campaign-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} pattern="[+0-9() .-]{7,30}" placeholder="+91 …"/></div>
  <div className="field"><label htmlFor="campaign-message">How can we help? <span>(optional)</span></label><textarea id="campaign-message" name="message" rows={3} maxLength={3000}/></div>
  <div hidden aria-hidden="true"><label>Leave empty<input name="company" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="consent"><input name="consent" type="checkbox" required/><span>I agree to be contacted about my enquiry. <a href="/new-privacy-policy/">Privacy policy</a></span></label>
  <button className="btn btn-primary" disabled={sending} type="submit">{sending?'Sending…':submitLabel}</button>
  {error&&<p className="enquiry-error" role="alert">{error}</p>}
 </form>;
}
