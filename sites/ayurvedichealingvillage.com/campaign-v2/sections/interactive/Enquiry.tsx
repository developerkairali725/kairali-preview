import type { SectionProps } from "../LandingPage";
import { SectionHead } from "../head";
import { CHANNELS, LENGTHS, formSchemaFor, monthOptions, programOptions, resolveSchema } from "../../forms/schema.ts";
import type { PrefillLabels } from "./consult-prefill.ts";
import { contact, site } from "../../../campaign-v110/lib/site.ts";
import { WaIcon, PhoneIcon } from "../icons";
import EnquiryForm from "./EnquiryForm";

/**
 * #enquiry — the enquiry (Main.dc.html section 11). Default: the live campaign enquiry form (one step);
 * `form.schemaId: "three-step"` gives the 3-step channel form (Form-Flow.dc.html).
 * This server part resolves the form schema (forms/schema.ts formSchemaFor) into plain data, because
 * schema functions (month list, consent label) cannot cross into a client component. EnquiryForm is the
 * interactive client part; the submit adapter is chosen there by id (campaign `form.adapterId`).
 */
export default function Enquiry({ c, v, req }: SectionProps) {
  const octx = { campaign: c, locale: req.locale, now: new Date() };
  const base = formSchemaFor(c.form);
  // Live ad routes: the submit button carries the campaign's own primary CTA wording.
  const production = req.surface === "production" ? c.productionForm : undefined;
  const schema = resolveSchema(production && c.cta?.primary ? { ...base, submitLabel: c.cta.primary } : base, octx);
  // Labels for the ConsultBar answers, written into a textarea when the schema has no fields for them.
  const prefillLabels: PrefillLabels = {
    program: programOptions(octx), month: monthOptions(octx), length: LENGTHS,
    channel: CHANNELS.map((x) => ({ value: x.id, label: x.label })),
  };
  return (
    <section id="enquiry" className="lp-sec lp-enq" aria-labelledby="lp-enq-h">
      <div className="lp-enq__intro">
        <SectionHead v={v} kicker="Free doctor consultation" title="Tell us when. Your doctor’s team will plan the rest." id="lp-enq-h" />
        {schema.lede ? <p className="lp-enq__lede">{schema.lede}</p> : null}
        <ul className="lp-enq__contact">
          <li>
            <a href={`https://wa.me/${contact.whatsapp.number}`} data-track="cta_click" data-track-cta="whatsapp" data-track-position="section">
              <WaIcon size={18} />Prefer to talk? WhatsApp · {contact.whatsapp.display}
            </a>
          </li>
          <li>
            <a href={contact.phone.href} data-track="cta_click" data-track-cta="call" data-track-position="section">
              <PhoneIcon size={18} />Call · {contact.phone.display}
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`} data-track="cta_click" data-track-cta="email" data-track-position="section">{contact.email}</a>
          </li>
        </ul>
      </div>
      <EnquiryForm
        schema={schema}
        adapterId={c.form?.adapterId}
        campaign={{ tracking: c.tracking }}
        variant={v}
        locale={req.locale}
        country={req.country}
        privacyHref={site.legal.privacy}
        prefillLabels={prefillLabels}
        {...(production ? { production } : {})}
      />
    </section>
  );
}
