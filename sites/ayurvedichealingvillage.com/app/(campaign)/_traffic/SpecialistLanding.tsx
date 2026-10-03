import {specialistStyles} from './specialist-styles';
import Image from 'next/image';
import parse,{Element,type HTMLReactParserOptions} from 'html-react-parser';
import {HeroMedia} from './HeroMedia';
import {R10EnquiryForm} from '../ayurvedic-treatment-packages.html/EnquiryForm';
import {GuestSupport} from '../ayurvedic-treatment-packages.html/GuestSupport';
import {StayGallery} from '../panchkarma-treatment.html/StayGallery';
import {HeritageYears} from '../panchkarma-treatment.html/HeritageYears';
import {heritageYears} from '../../../lib/heritage-age.mjs';
import '@kairali/ui/brand-tokens.css';

export function SpecialistLanding({content,route,title,kind}:{content:string;route:string;title:string;kind:string}){
 const options:HTMLReactParserOptions={replace(node){
  if(!(node instanceof Element))return;
  if(node.name==='traffic-enquiry')return <R10EnquiryForm formType={kind} submitLabel="Plan my programme" downloadGuide={false}/>;
  if(node.name==='heritage-years')return <HeritageYears initial={heritageYears()}/>;
  if(node.name==='stay-gallery')return <StayGallery/>;
  if(node.name==='img'){
   const a=node.attribs;if(a.class?.includes('hero-photograph'))return <HeroMedia quality={75} src={a.src} alt={a.alt||''} width={Number(a.width)||1600} height={Number(a.height)||1066}/>;
   return <Image src={a.src} alt={a.alt||''} className={a.class} width={Number(a.width)||1200} height={Number(a.height)||800} sizes="(max-width:700px) 100vw, 50vw"/>;
  }
 }};
 const schema={'@context':'https://schema.org','@type':'WebPage',url:'https://ayurvedichealingvillage.com/'+route,name:title,inLanguage:'en',isPartOf:{'@type':'WebSite',url:'https://ayurvedichealingvillage.com/',name:'Kairali Ayurvedic Healing Village'}};
 return <div className={`r10-revision tl-page tl-specialist tl-${kind}`}><style dangerouslySetInnerHTML={{__html:specialistStyles}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>{parse(content,options)}<GuestSupport/></div>;
}
