'use client';
import {useEffect} from 'react';
/** Fragment navigation exposes the complete programme before scrolling to it. */
export function ProgrammeNavigation(){useEffect(()=>{
 function reveal(hash:string){const target=document.getElementById(hash.slice(1));if(target instanceof HTMLDetailsElement){target.open=true;target.scrollIntoView({block:'start'});}}
 function click(event:MouseEvent){const link=event.target instanceof Element?event.target.closest('a.programme-jump'):null;if(link)reveal(link.getAttribute('href')||'');}
 function hash(){reveal(window.location.hash);}
 document.addEventListener('click',click);window.addEventListener('hashchange',hash);hash();
 return()=>{document.removeEventListener('click',click);window.removeEventListener('hashchange',hash);};
 },[]);return null;}
