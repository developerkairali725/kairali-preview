import type {Metadata} from 'next';
export function trafficMetadata(route:string,title:string,description:string):Metadata{
 const url=`https://ayurvedichealingvillage.com/${route}`;
 const image='https://ayurvedichealingvillage.com/landing/r10/og.jpg';
 return {title,description,alternates:{canonical:url},robots:{index:process.env.AHV_STAGING==='0',follow:true},openGraph:{type:'website',locale:'en_IN',url,title,description,siteName:'Kairali Ayurvedic Healing Village',images:[{url:image,width:1200,height:630}]},twitter:{card:'summary_large_image',title,description,images:[image]}};
}
