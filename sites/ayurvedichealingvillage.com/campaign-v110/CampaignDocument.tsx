import type { ReactNode } from "react";
import Script from "next/script";
import localFont from "next/font/local";
import { ConsentScripts } from "@kairali/consent";
import { ChatbaseLoader } from "@kairali/chat";
import { Analytics } from "@kairali/analytics";
import SharedConsent from "./SharedConsent";
import "./pages/globals.css";
import "./integration.css";
const cormorant=localFont({src:"./pages/fonts/cormorant-garamond-latin.woff2",weight:"400 500",display:"swap",variable:"--font-cormorant"});
const jost=localFont({src:"./pages/fonts/jost-latin.woff2",weight:"300 500",display:"swap",variable:"--font-jost"});
export default function CampaignDocument({children,lang="en"}:{children:ReactNode;lang?:string}){
 return <html lang={lang} className={`${cormorant.variable} ${jost.variable}`}><head><link rel="stylesheet" href="/design/chrome.css" /><link rel="stylesheet" href="/design/newsletter.css" /><link rel="stylesheet" href="/ahv/fonts/ahv-b6a82009abac.css" /><ConsentScripts />{process.env.AHV_ANALYTICS === "1" && process.env.AHV_STAGING === "0" ? <Analytics /> : null}</head><body data-ahv-campaign="true">{children}<SharedConsent /><ChatbaseLoader /><Script src="/design/chrome.js" strategy="afterInteractive" /></body></html>;
}
