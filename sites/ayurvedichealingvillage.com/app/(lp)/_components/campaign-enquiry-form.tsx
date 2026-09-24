'use client';
import {useState,type FormEvent} from 'react';

/** AHV-only short enquiry UI. The existing server endpoint stays closed on
 * staging; Deepu connects and verifies delivery before release. */
export function CampaignEnquiryForm({formType='consultation',heading='Request a consultation',submitLabel='Request consultation'}:{formType?:string;heading?:string;submitLabel?:string}) {
 const [sending,setSending]=useState(false),[error,setError]=useState(''),[sent,setSent]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;if(!form.reportValidity()||sending)return;
  const data=new FormData(form);if(data.get('company'))return;
  setSending(true);setError('');
  try{
   const url=new URL(window.location.href);
   const campaign=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].map(k=>[k,url.searchParams.get(k)||'']));
   const response=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site:'ayurvedichealingvillage.com',formType,fullName:String(data.get('fullName')).trim(),email:String(data.get('email')).trim(),phone:data.get('phone'),message:data.get('message'),subject:document.title,landingPage:window.location.href,referrer:document.referrer,consent:true,...campaign})});
   const result=await response.json();
   if(!response.ok||result.ok===false)throw new Error(result.staging?'This preview does not send enquiries. Nothing has been sent. Please use WhatsApp or email info@kairali.com.':'We could not send your enquiry. Your details are still here; please retry or use WhatsApp.');
   setSent(true);
  }catch(e){setError(e instanceof Error?e.message:'Unable to send. Please retry or use WhatsApp.');}finally{setSending(false);}
 }
 if(sent)return <p role="status">Thank you. Your enquiry has been received.</p>;
 return <form className="enquiry-form" action="/api/enquiry" method="post" onSubmit={submit}>
  <h3>{heading}</h3><p>Tell us how to reach you. Our patient care team can help you plan your visit.</p>
  <div className="field"><label htmlFor="campaign-name">Your name</label><input id="campaign-name" name="fullName" autoComplete="name" required maxLength={120} pattern={String.raw`.*\S.*`}/></div>
  <div className="field"><label htmlFor="campaign-email">Email</label><input id="campaign-email" name="email" type="email" autoComplete="email" required maxLength={254}/></div>
  <div className="field"><label htmlFor="campaign-phone">Phone / WhatsApp <span>(optional, include country code)</span></label><input id="campaign-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} pattern="[+0-9() .-]{7,30}" placeholder="+91 …"/></div>
  <div className="field"><label htmlFor="campaign-message">How can we help? <span>(optional)</span></label><textarea id="campaign-message" name="message" rows={3} maxLength={3000}/></div>
  <div hidden aria-hidden="true"><label>Leave empty<input name="company" tabIndex={-1} autoComplete="off"/></label></div>
  <label className="consent"><input name="consent" type="checkbox" required/><span>I agree to be contacted about my enquiry. <a href="/privacy-policy/">Privacy policy</a></span></label>
  <button className="btn btn-primary" disabled={sending} type="submit">{sending?'Sending…':submitLabel}</button>
  {error&&<p className="enquiry-error" role="alert">{error}</p>}
 </form>;
}
