import { measurementForEnvironment } from "../lib/measurement-config.mjs";
import type { ReactNode } from "react";
import Script from "next/script";
import localFont from "next/font/local";
import { ConsentScripts } from "@kairali/consent";
import { ChatbaseLoader } from "@kairali/chat";
import analyticsConfig from "../analytics.config.json";
import SharedConsent from "./SharedConsent";
import "./pages/globals.css";
import "./integration.css";
import "../public/design/campaign-bundle.css";
const cormorant=localFont({src:"./pages/fonts/cormorant-garamond-latin.woff2",weight:"400 500",display:"swap",variable:"--font-cormorant"});
const jost=localFont({src:"./pages/fonts/jost-latin.woff2",weight:"300 500",display:"swap",variable:"--font-jost"});
export default function CampaignDocument({children,lang="en"}:{children:ReactNode;lang?:string}){
 const measurement = measurementForEnvironment(process.env, analyticsConfig);
 return <html lang={lang} className={`${cormorant.variable} ${jost.variable}`}><head><ConsentScripts /><Script src="/design/lead-receipt.js" strategy="beforeInteractive" /></head><body data-ahv-campaign="true">{children}<SharedConsent measurement={measurement} /><ChatbaseLoader /><Script src="/design/chrome.js" strategy="afterInteractive" /></body></html>;
}
