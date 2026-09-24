import { CampaignEnquiryForm } from "./campaign-enquiry-form";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "./lp";

// Consultation-request section — the same single conversion goal as the
// WhatsApp CTA, in form modality (LP doctrine §4: WhatsApp-first India-geo,
// form for international patients). Store-first lead capture per Satyam's
// production spec: @kairali/forms/route writes the lead + explicit consent
// boolean to our DB before any CRM handoff; patient-services replies from
// info@kairali.com (the locked public contact).
export function LpFormSection({
  formType = "consultation",
  heading = "Request a consultation",
  aside,
}: {
  formType?: string;
  heading?: string;
  aside?: string;
}) {
  return (
    <div className="form-wrap">
      <CampaignEnquiryForm
        formType={formType}
        heading={heading}
        submitLabel="Request consultation"
      />
      <div className="form-aside">
        <span className="k">What happens next</span>
        <p>
          {aside ??
            "Your request reaches our patient-services team with your consent recorded. We reply with consultation options and what your physician will need to know before admission."}
        </p>
        <p>
          {/* no data-cta on this utility link: tracked CTAs are the >=44px
              hero/sticky buttons; a 44px rule applies to every [data-cta] */}
          Prefer to talk now? <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp {WHATSAPP_DISPLAY}</a>
          <br />
          International patients: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </div>
  );
}
