'use client';
import {useEffect,useRef} from 'react';

type Measurement = {recordInteraction?: (name:string,target:string)=>boolean};
function event(name:string,target:string) {
 (window as Window & {AHV_MEASUREMENT?:Measurement}).AHV_MEASUREMENT?.recordInteraction?.(name,target);
}

/** R10 only: help with programme selection, without an unapproved discount,
 * a second lead form or interception of the visitor's navigation. */
export function GuestSupport() {
 const dialog=useRef<HTMLDialogElement>(null);
 const opener=useRef<HTMLElement|null>(null);
 useEffect(()=>{
  const started=Date.now();let engaged=false,shown=false,peak=window.scrollY;
  try {shown=sessionStorage.getItem('ahv-r10-exit-help')==='shown';}catch{}
  function show(){
   const active=document.activeElement;
   if(shown||!engaged||Date.now()-started<30000||document.getElementById('ahv-consent')||
      active?.closest('form')||document.querySelector('dialog[open], [aria-modal="true"]'))return;
   shown=true;try{sessionStorage.setItem('ahv-r10-exit-help','shown');}catch{}
   opener.current=active instanceof HTMLElement?active:null;
   dialog.current?.showModal();event('exit_help','shown');
  }
  function scroll(){
   const y=window.scrollY;
   if(y>window.innerHeight)engaged=true;
   // Touch devices have no mouse exit. Offer help on a deliberate return
   // towards the top after meaningful engagement; never trap the Back button.
   peak=Math.max(peak,y);
   if(matchMedia('(pointer: coarse)').matches&&peak-y>window.innerHeight&&y<window.innerHeight)show();
  }
  function exit(e:MouseEvent){if(e.clientY<=0&&!e.relatedTarget&&matchMedia('(pointer: fine)').matches)show();}
  function clicks(e:MouseEvent){
   const a=e.target instanceof Element?e.target.closest('a'):null;if(!a)return;
   const href=a.getAttribute('href')||'';
   if(href==='#enquiry')event('enquiry_open','enquiry');
   else if(href.startsWith('tel:'))event('contact_click','phone');
   else if(href.startsWith('mailto:'))event('contact_click','email');
   else if(href.includes('wa.me/'))event('contact_click','whatsapp');
   else if(href.includes('google.com/maps/'))event('contact_click','directions');
   else if(href.includes('/pdf/'))event('tariff_download','tariff');
   else if(href.includes('youtube.com/'))event('video_open','video');
   else if(a.closest('#section-1,#section-6'))event('programme_open','programme');
  }
  window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('mouseout',exit);document.addEventListener('click',clicks);
  return()=>{window.removeEventListener('scroll',scroll);document.removeEventListener('mouseout',exit);document.removeEventListener('click',clicks);};
 },[]);
 function close(target='dismissed'){dialog.current?.close();event('exit_help',target);opener.current?.focus();}
 return <dialog ref={dialog} className="r10-exit-help" aria-labelledby="r10-exit-title" onCancel={()=>event('exit_help','dismissed')} onClose={()=>opener.current?.focus()}>
  <button type="button" className="r10-exit-close" aria-label="Close programme help" onClick={()=>close()}>×</button>
  <span className="section-overline">Your stay, thoughtfully planned</span>
  <h2 id="r10-exit-title">Need help choosing a programme?</h2>
  <p>Our patient care team can help you understand the programmes, villa options and what your stay includes.</p>
  <a className="primary" href="#enquiry" onClick={()=>{close('enquire');setTimeout(()=>document.getElementById('R10-fname')?.focus(),0);}}>Ask about my stay</a>
  <a className="r10-exit-whatsapp" href="https://wa.me/919289838797" target="_blank" rel="noopener noreferrer" onClick={()=>close('whatsapp')}>Speak with patient care on WhatsApp ↗</a>
  <button type="button" className="r10-exit-later" onClick={()=>close()}>Continue browsing</button>
 </dialog>;
}
