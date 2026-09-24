export const REVIEW_LANGUAGES = new Set(['en', 'hi', 'de', 'fr', 'ru']);
export type Review = {name:string; profile:string; photo:string; rating:number; text:string; originalText:string; originalLanguage:string; language:string; published:string; href:string};
export type ReviewResult = {status:'ready'|'unavailable'; rating?:number; count?:number; href?:string; reviews:Review[]};
function safeUrl(value:unknown, photo=false):string {
  if (typeof value !== 'string') return '';
  try {const u=new URL(value);return u.protocol==='https:' && (photo ? /(^|\.)googleusercontent\.com$/.test(u.hostname) : /(^|\.)(google\.com|google\.co\.in|g\.page|goo\.gl)$/.test(u.hostname)) ? u.href : '';}catch{return '';}
}
export async function loadGoogleReviews(config:{key?:string;placeId?:string;enabled?:string;language:string},fetcher:typeof fetch=fetch):Promise<ReviewResult>{
  const unavailable:ReviewResult={status:'unavailable',reviews:[]};
  if(config.enabled!=='1'||!config.key||!config.placeId||!REVIEW_LANGUAGES.has(config.language))return unavailable;
  try {
    const response=await fetcher(`https://places.googleapis.com/v1/places/${encodeURIComponent(config.placeId)}?languageCode=${config.language}`,{headers:{'X-Goog-Api-Key':config.key,'X-Goog-FieldMask':'displayName,rating,userRatingCount,googleMapsUri,reviews'},cache:'no-store',signal:AbortSignal.timeout(8000)});
    if(!response.ok)return unavailable;
    const data=await response.json();
    // Fail closed if an unrelated Place ID was configured accidentally.
    if(!/kairali/i.test(data.displayName?.text||'')||!/healing village/i.test(data.displayName?.text||''))return unavailable;
    const reviews:Review[]=(Array.isArray(data.reviews)?data.reviews:[]).slice(0,5).map((r:any)=>({name:String(r.authorAttribution?.displayName||'Google reviewer'),profile:safeUrl(r.authorAttribution?.uri),photo:safeUrl(r.authorAttribution?.photoUri,true),rating:Number(r.rating)||0,text:String(r.text?.text||''),originalText:String(r.originalText?.text||r.text?.text||''),originalLanguage:String(r.originalText?.languageCode||''),language:String(r.text?.languageCode||''),published:String(r.publishTime||''),href:safeUrl(r.googleMapsUri)||safeUrl(data.googleMapsUri)}));
    return {status:'ready',rating:typeof data.rating==='number'?data.rating:undefined,count:typeof data.userRatingCount==='number'?data.userRatingCount:undefined,href:safeUrl(data.googleMapsUri),reviews};
  }catch{return unavailable;}
}
