'use client';
import {useEffect,useRef,type ReactNode} from 'react';
// The legacy shared chrome mutates its root. Attach it only after React has
// hydrated this native page and the layout's initial deferred scripts finished.
export function ReviewsShell({children,consentScript,headerScript,route='/read-feedback/'}:{children:ReactNode;consentScript:string;headerScript:string;route?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let cancelled=false;
  function boot(){
   const root=ref.current;if(!root||cancelled||root.id==='ahv-design-root')return;
   root.id='ahv-design-root';
   for(const code of [consentScript,headerScript])if(code){const script=document.createElement('script');script.textContent=code;root.appendChild(script);}
   for(const src of ['/design/chrome.js','/design/search.js','/design/section-nav.js']){
    if(cancelled)return;
    const script=document.createElement('script');script.src=src;script.async=false;root.appendChild(script);
   }
  }
  if(document.readyState==='complete')void boot();else window.addEventListener('load',boot,{once:true});
  return()=>{cancelled=true;window.removeEventListener('load',boot);};
 },[consentScript,headerScript]);
 return <div ref={ref} id="ahv-reviews-root" data-ahv-route={route} data-ahv-family="guest-reviews" className="rv-page">{children}</div>;
}
