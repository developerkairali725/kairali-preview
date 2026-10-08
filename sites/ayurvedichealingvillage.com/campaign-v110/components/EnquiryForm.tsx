import {isCampaign, FREE_CONSULTATION} from "./campaign-presentation";
import { CampaignEnquiryForm } from "../../app/(lp)/_components/campaign-enquiry-form";
export default function EnquiryForm({pagePath,heading,lang}:{pagePath:string;heading?:string|null;intro?:string|null;whatsappText:string;headingLevel?:2|3;lang?:string;headingLang?:string}){
 return <div className="campaign-form" lang={lang}><CampaignEnquiryForm formType={pagePath} heading={isCampaign(pagePath) ? (lang === "de" ? "Kostenlose ärztliche Erstberatung" : FREE_CONSULTATION) : heading || "Request a consultation"} submitLabel={isCampaign(pagePath) ? FREE_CONSULTATION : "Plan my programme"} localizedSubmitLabel={isCampaign(pagePath) && lang === "de" ? "Kostenlose ärztliche Erstberatung" : undefined} lang={lang} /></div>;
}
