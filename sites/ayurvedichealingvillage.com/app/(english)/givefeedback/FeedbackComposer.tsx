'use client';
import {useState,type FormEvent} from 'react';
import {feedbackLinks,MANAGEMENT_EMAIL,TOPICS,type FeedbackDraft} from './feedback-links';
export default function FeedbackComposer(){
 const [draft,setDraft]=useState<FeedbackDraft>({name:'',stay:'',topic:TOPICS[0],message:''});
 const [status,setStatus]=useState('');
 const [copyFallback,setCopyFallback]=useState(false);
 const links=feedbackLinks(draft);
 function change(field:keyof FeedbackDraft,value:string){setDraft(d=>({...d,[field]:value}));setStatus('');setCopyFallback(false);}
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!draft.message.trim()){setStatus('Please write your feedback before choosing a channel.');event.currentTarget.querySelector<HTMLTextAreaElement>('textarea')?.focus();return;}
  const channel=(event.nativeEvent as SubmitEvent).submitter?.getAttribute('value')||'email';
  if(channel==='copy'){
   try{await navigator.clipboard.writeText(`${links.subject}\n\n${links.emailBody}`);setStatus('Message copied. Paste it into an email or WhatsApp conversation.');}catch{setCopyFallback(true);setStatus('Select and copy your message below.');}
  }else if(channel==='whatsapp'){
   const opened=window.open(links.whatsapp,'_blank','noopener,noreferrer');
   // Browsers may return null with noopener even when the new tab opened.
   void opened;setStatus('Continue in WhatsApp to review and send your message. Nothing is sent automatically.');
  }else{window.location.href=links.email;setStatus('Your email app has been requested. Review the draft and send it there. If no app opens, copy your message and email '+MANAGEMENT_EMAIL+'.');}
 }
 return <form className="fb-form" onSubmit={submit}>
 <div className="fb-fields"><label>Your name <span>(optional)</span><input name="name" autoComplete="name" maxLength={80} value={draft.name} onChange={e=>change('name',e.target.value)}/></label><label>Stay dates or booking reference <span>(optional)</span><input name="stay" maxLength={100} placeholder="For example, September 2026" value={draft.stay} onChange={e=>change('stay',e.target.value)}/></label></div>
 <label>What would you like to share?<select name="topic" value={draft.topic} onChange={e=>change('topic',e.target.value)}>{TOPICS.map(t=><option key={t}>{t}</option>)}</select></label>
 <label>Your feedback <span>(required)</span><textarea name="message" required rows={6} maxLength={1500} value={draft.message} onChange={e=>change('message',e.target.value)} placeholder="Tell us what went well, what could be better, or how we can help." aria-describedby="feedback-message-help"/></label>
 <p id="feedback-message-help" className="fb-help">{draft.message.length}/1,500 characters · Include the details you want the team to follow up on.</p>
 <div className="fb-compose-actions"><button className="rv-button" type="submit" name="channel" value="email">Open email to management ↗</button><button className="rv-button rv-button-outline" type="submit" name="channel" value="whatsapp">Open WhatsApp to Priya ↗</button><button className="fb-copy" type="submit" name="channel" value="copy">Copy message</button></div>
 <p className="fb-help">You choose when to send. This page prepares your draft; your email app or WhatsApp sends it.</p><p className="fb-status" role="status">{status}</p>
 {copyFallback&&<label>Your message to copy<textarea readOnly rows={8} value={`${links.subject}\n\n${links.emailBody}`} onFocus={e=>e.currentTarget.select()}/></label>}
 </form>;
}
