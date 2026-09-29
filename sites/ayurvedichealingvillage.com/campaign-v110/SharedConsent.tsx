"use client";
import { useEffect } from "react";
import { CONSENT_RUNTIME } from "../app/(english)/_families/consent-runtime";
export default function SharedConsent(){
 useEffect(()=>{
  const script=document.createElement("script");
  script.textContent=`(function(){var cfg={breakpoint:700};var host=document.body;${CONSENT_RUNTIME}\nensureConsentNotice();})();`;
  document.body.appendChild(script);
  return ()=>{script.remove();document.getElementById("ahv-consent")?.remove();};
 },[]);
 return null;
}
