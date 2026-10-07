"use client";
import { useEffect } from "react";
import { CONSENT_RUNTIME } from "../app/(english)/_families/consent-runtime";
type Measurement = {ga4:string;clarity:string;metaPixel:string;adsTagId?:string;adsSendTo:string};
export default function SharedConsent({measurement}:{measurement?:Measurement}){
 useEffect(()=>{
  const script=document.createElement("script");
  script.textContent=`(function(){var cfg={breakpoint:700,measurement:${JSON.stringify(measurement)}};var host=document.body;${CONSENT_RUNTIME}\nensureConsentNotice();if(consentChoice()==="accepted")startMeasurement();})();`;
  document.body.appendChild(script);
  return ()=>{script.remove();document.getElementById("ahv-consent")?.remove();};
 },[measurement]);
 return null;
}
