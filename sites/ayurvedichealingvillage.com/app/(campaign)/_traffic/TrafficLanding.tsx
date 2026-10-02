import type {Metadata} from 'next';
import Image from 'next/image';
import parse,{Element,type HTMLReactParserOptions} from 'html-react-parser';
import {R10EnquiryForm} from '../ayurvedic-treatment-packages.html/EnquiryForm';
import {GuestSupport} from '../ayurvedic-treatment-packages.html/GuestSupport';
import {StayGallery} from '../panchkarma-treatment.html/StayGallery';
import {HeritageYears} from '../panchkarma-treatment.html/HeritageYears';
import {heritageYears} from '../../../lib/heritage-age.mjs';
import '@kairali/ui/brand-tokens.css';
import '../ayurvedic-treatment-packages.html/r10.css';
import './traffic.css';
import {ProgrammeNavigation} from './ProgrammeNavigation';
export function trafficMetadata(route:string,title:string,description:string):Metadata{
 const url=`https://ayurvedichealingvillage.com/${route}`;
 const image='https://ayurvedichealingvillage.com/landing/r10/og.jpg';
 return {title,description,alternates:{canonical:url},robots:{index:process.env.AHV_STAGING==='0',follow:true},openGraph:{type:'website',locale:'en_IN',url,title,description,siteName:'Kairali Ayurvedic Healing Village',images:[{url:image,width:1200,height:630}]},twitter:{card:'summary_large_image',title,description,images:[image]}};
}
export function TrafficLanding({content,kind}:{content:string;kind:'pain'|'family'}){
 const options:HTMLReactParserOptions={replace(node){
  if(!(node instanceof Element))return;
  if(node.name==='traffic-enquiry')return <R10EnquiryForm formType={kind==='pain'?'pain-management':'family-retreat'} familyFields={kind==='family'} submitLabel={kind==='pain'?'Request pain management consultation':'Plan my family retreat'} downloadGuide={false}/>;
  if(node.name==='heritage-years')return <HeritageYears initial={heritageYears()}/>;
  if(node.name==='stay-gallery')return <StayGallery/>;
  if(node.name==='img'){const a=node.attribs,hero=a.class?.includes('hero-photograph');return <Image src={a.src} alt={a.alt||''} className={a.class} width={Number(a.width)||1200} height={Number(a.height)||800} priority={hero} fetchPriority={hero?'high':undefined} quality={hero?60:75} sizes={hero?'100vw':'(max-width:700px) 100vw, 50vw'}/>;}
 }};
 const url='https://ayurvedichealingvillage.com/'+(kind==='pain'?'pain-management.html':'family-ayurvedic-retreat-kerala.html');
 const schema={'@context':'https://schema.org','@type':'WebPage',url,name:kind==='pain'?'Ayurvedic Pain Management in Kerala':'Family Ayurveda Retreat in Kerala',inLanguage:'en',isPartOf:{'@type':'WebSite',url:'https://ayurvedichealingvillage.com/',name:'Kairali Ayurvedic Healing Village'}};
 return <div className={`r10-revision tl-page tl-${kind}`}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>{kind==='family'&&<ProgrammeNavigation/>}{parse(content,options)}<GuestSupport/></div>;
}
