import {loadGoogleReviews, REVIEW_LANGUAGES} from '../../../../lib/google-reviews';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const language=new URL(request.url).searchParams.get('language')||'en';
 if(!REVIEW_LANGUAGES.has(language))return Response.json({error:'Unsupported language'},{status:400});
 const result=await loadGoogleReviews({enabled:process.env.AHV_GOOGLE_REVIEWS_ENABLED,key:process.env.AHV_GOOGLE_PLACES_API_KEY,placeId:process.env.AHV_GOOGLE_PLACE_ID,language});
 return Response.json(result,{headers:{'Cache-Control':'no-store'}});
}
