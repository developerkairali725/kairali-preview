'use client';
import {useRef,useState} from 'react';
import Image from 'next/image';
const photos=[
 {src:'/landing/r26/memory-1.jpg',label:'Yoga practice with an instructor',wide:true},
 {src:'/landing/r26/memory-10.jpg',label:'Personal consultation in a calm setting'},
 {src:'/landing/r10/home-kt-18.webp',label:'Independent villa accommodation'},
 {src:'/landing/r26/memory-3.jpg',label:'An Ayurvedic therapy session'},
 {src:'/landing/r26/memory-2.jpg',label:'A warm welcome at Kairali'},
 {src:'/landing/r26/memory-5.jpg',label:'Personal care from the therapy team'},
 {src:'/landing/r26/nature-walk-video.webp',label:'Garden produce and the natural surroundings'}
];
export function StayGallery(){const dialog=useRef<HTMLDialogElement>(null);const [selected,setSelected]=useState(0);const p=photos[selected];return <><div className="stay-gallery">{photos.map((p,i)=><button key={p.src} type="button" className={p.wide?'gallery-photo gallery-wide':'gallery-photo'} onClick={()=>{setSelected(i);dialog.current?.showModal();}}><Image src={p.src} alt="" width={1200} height={800} sizes="(max-width:700px) 100vw, 50vw"/><span>{p.label}<small>View photograph ↗</small></span></button>)}</div><dialog ref={dialog} aria-label={'Photograph: '+p.label} className="gallery-dialog" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><button type="button" className="gallery-close" onClick={()=>dialog.current?.close()} aria-label="Close photograph">Close ×</button><img src={p.src} alt={p.label}/><p>{p.label}</p><div className="gallery-controls"><button type="button" onClick={()=>setSelected((selected+photos.length-1)%photos.length)}>← Previous</button><span>{selected+1} / {photos.length}</span><button type="button" onClick={()=>setSelected((selected+1)%photos.length)}>Next →</button></div></dialog></>}
