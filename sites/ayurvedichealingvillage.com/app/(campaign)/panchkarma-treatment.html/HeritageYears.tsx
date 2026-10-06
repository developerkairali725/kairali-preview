'use client';
import {useEffect,useState} from 'react';
import {heritageYears} from '../../../lib/heritage-age.mjs';
export function HeritageYears({initial}:{initial:number}) {
 const [years,setYears]=useState(initial);
 useEffect(()=>{const refresh=()=>setYears(heritageYears());refresh();const timer=setInterval(refresh,3600000);window.addEventListener('focus',refresh);return()=>{clearInterval(timer);window.removeEventListener('focus',refresh);};},[]);
 return <span data-ahv-heritage-years>{years}</span>;
}
