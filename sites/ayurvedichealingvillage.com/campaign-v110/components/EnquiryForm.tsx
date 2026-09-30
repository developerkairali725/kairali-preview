import { CampaignEnquiryForm } from "../../app/(lp)/_components/campaign-enquiry-form";
export default function EnquiryForm({pagePath,heading,lang}:{pagePath:string;heading?:string|null;intro?:string|null;whatsappText:string;headingLevel?:2|3;lang?:string;headingLang?:string}){
 return <div className="campaign-form" lang={lang}><CampaignEnquiryForm formType={pagePath} heading={heading || "Request a consultation"} submitLabel="Plan my programme" lang={lang} /></div>;
}
