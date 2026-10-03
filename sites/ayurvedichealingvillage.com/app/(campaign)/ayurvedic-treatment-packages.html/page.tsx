import {HeroMedia} from '../_traffic/HeroMedia';
import type { Metadata } from 'next';
import Image from 'next/image';
import parse, { Element, type HTMLReactParserOptions } from 'html-react-parser';
import { approvedContent } from './content';
import { R10EnquiryForm } from './EnquiryForm';
import { GuestSupport } from './GuestSupport';
import '@kairali/ui/brand-tokens.css';
import './r10.css';

const canonical = 'https://ayurvedichealingvillage.com/ayurvedic-treatment-packages.html';
const title = 'Ayurvedic Treatment Packages in Kerala | Kairali';
const description = 'Explore authentic Ayurvedic treatment packages, villa stays, yoga and meditation at Kairali Ayurvedic Healing Village in Palakkad, Kerala. Plan your stay.';
export const metadata: Metadata = {
 title, description, alternates: { canonical },
 robots: { index: process.env.AHV_STAGING === '0', follow: true },
 openGraph: { type: 'website', locale: 'en_IN', siteName: 'Kairali Ayurvedic Healing Village', title, description, url: canonical,
  images: [{ url: 'https://ayurvedichealingvillage.com/landing/r10/og.jpg', width: 1200, height: 630, alt: 'Kairali Ayurvedic Healing Village in Palakkad, Kerala' }] },
 twitter: { card: 'summary_large_image', title, description, images: ['https://ayurvedichealingvillage.com/landing/r10/og.jpg'] },
};
const options: HTMLReactParserOptions = { replace(node) {
 if (!(node instanceof Element)) return;
 if (node.name === 'r10-enquiry') return <R10EnquiryForm formType="ayurvedic-treatment-packages" submitLabel="Submit enquiry"/>;
 if (node.name === 'img') {
  const a=node.attribs;
  const hero=a.class?.includes('hero-photograph');
  if(hero)return <HeroMedia src={a.src} alt={a.alt||''} width={Number(a.width)||1600} height={Number(a.height)||1000}/>;return <Image src={a.src} alt={a.alt || ''} className={a.class} width={Number(a.width)||1200} height={Number(a.height)||800} priority={hero} fetchPriority={hero?'high':undefined} quality={hero?60:75} sizes={hero?'100vw':'(max-width: 700px) 100vw, 50vw'}/>;
 }
}};
const schema = {
 '@context': 'https://schema.org', '@type': 'WebPage', '@id': canonical+'#webpage', url:canonical, name:title, description,
 inLanguage:'en', isPartOf:{'@type':'WebSite',url:'https://ayurvedichealingvillage.com/',name:'Kairali Ayurvedic Healing Village'},
 breadcrumb:{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://ayurvedichealingvillage.com/'},{'@type':'ListItem',position:2,name:'Ayurvedic treatment packages',item:canonical}]}
};
export default function Page() {
 return <div className="r10-revision"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>{parse(approvedContent,options)}<GuestSupport/></div>;
}
