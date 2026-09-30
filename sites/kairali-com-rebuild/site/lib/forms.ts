// Form schemas rebuilt from the live field sets (output/forms_journeys + source label text).
// Owner Q7: the general enquiry and contact forms drop gender, age and full address.
// The medical consultation keeps its source field set and remains a separate journey.
// Image CAPTCHAs (turingenq/turingcon/asdfghjkl.aspx) are replaced by a honeypot here; the
// production anti-spam service is an open integration (see docs/INTEGRATIONS-PENDING.md).
import opts from "@/content/form-options.json";

export type FieldType = "text" | "email" | "tel" | "number" | "date" | "textarea" | "select" | "radio" | "checkboxes" | "consent" | "file" | "heading";
export type Field = {
  name: string; label: string; type: FieldType; required?: boolean; options?: string[]; placeholder?: string;
  hint?: string; full?: boolean; requiredMsg?: string; formatMsg?: string; pattern?: "digits" | "email"; autoComplete?: string; cols?: boolean;
};
export type FormSchema = { id: string; title: string; intro?: string; submitLabel: string; fields: Field[]; sensitive?: boolean; steps?: { title: string; from: string }[] };

const consent: Field = { name: "agree", type: "consent", required: true, full: true,
  label: "I have read and agree to kairali.com privacy & terms of use.", requiredMsg: "Please confirm that you agree to the privacy policy and terms of use." };
const country = (required = true): Field => ({ name: "country", label: "Country", type: "select", required, options: opts.countries, requiredMsg: "Please select country.", autoComplete: "country-name" });

export const GENERAL_ENQUIRY: FormSchema = {
  id: "enquiry", title: "Fill Form", intro: "All fields marked with an (*) are mandatory.", submitLabel: "Submit",
  fields: [
    { name: "name", label: "Name", type: "text", required: true, requiredMsg: "Please enter name", autoComplete: "name" },
    { name: "phone", label: "Phone No", type: "tel", required: true, pattern: "digits", requiredMsg: "Please enter phone no", formatMsg: "Enter only Numbers", autoComplete: "tel" },
    { name: "email", label: "E-mail", type: "email", required: true, pattern: "email", requiredMsg: "Please enter email", formatMsg: "Please provide a valid email", autoComplete: "email" },
    country(),
    { name: "state", label: "State", type: "text", required: true, requiredMsg: "Please select state.", autoComplete: "address-level1", hint: "State or province" },
    { name: "city", label: "City", type: "text", required: true, requiredMsg: "Please select city.", autoComplete: "address-level2" },
    { name: "subject", label: "Subject", type: "text", required: true, full: true, requiredMsg: "Please enter subject" },
    { name: "message", label: "Message", type: "textarea", required: true, full: true, requiredMsg: "Please enter message" },
    consent,
  ],
};
export const CONTACT: FormSchema = { ...GENERAL_ENQUIRY, id: "contact", title: "Contact Form" };

export const SVATA_ENQUIRY: FormSchema = {
  id: "svata", title: "Enquiry Now", submitLabel: "Submit",
  fields: [
    { name: "name", label: "Name", type: "text", required: true, requiredMsg: "Please enter name", autoComplete: "name" },
    { name: "phone", label: "Phone No.", type: "tel", required: true, pattern: "digits", requiredMsg: "Please enter phone no", formatMsg: "Enter only Numbers", autoComplete: "tel" },
    { name: "email", label: "Email Id", type: "email", required: true, pattern: "email", requiredMsg: "Please enter email", formatMsg: "Please provide a valid email", autoComplete: "email" },
    { name: "message", label: "Message", type: "textarea", required: true, full: true, requiredMsg: "Please enter message" },
    consent,
  ],
};

export const CONSULTATION: FormSchema = {
  id: "consultation", title: "Fill Form", intro: "All fields marked with an (*) are mandatory.", submitLabel: "Submit", sensitive: true,
  steps: [{ title: "About you", from: "firstName" }, { title: "Health profile", from: "bloodPressure" }, { title: "Your complaint", from: "presentProblems" }],
  fields: [
    { name: "firstName", label: "First Name", type: "text", required: true, requiredMsg: "Please enter first name", autoComplete: "given-name" },
    { name: "lastName", label: "Last Name", type: "text", required: true, requiredMsg: "Please enter last name", autoComplete: "family-name" },
    { name: "email", label: "Email", type: "email", required: true, pattern: "email", requiredMsg: "Please enter email", formatMsg: "Please provide a valid email", autoComplete: "email" },
    { name: "nationality", label: "Nationality", type: "text", required: true, requiredMsg: "Please enter nationality" },
    { name: "address", label: "Address", type: "textarea", full: true, autoComplete: "street-address" },
    country(),
    { name: "state", label: "State", type: "text", required: true, requiredMsg: "Please select state.", autoComplete: "address-level1" },
    { name: "city", label: "City", type: "text", required: true, requiredMsg: "Please select city.", autoComplete: "address-level2" },
    { name: "phone", label: "Phone", type: "tel", pattern: "digits", formatMsg: "Enter only Numbers", autoComplete: "tel" },
    { name: "mobile", label: "Mobile", type: "tel", required: true, pattern: "digits", requiredMsg: "Please enter mobile", formatMsg: "Enter only Numbers", autoComplete: "tel" },
    { name: "age", label: "Age", type: "number", required: true, pattern: "digits", requiredMsg: "Please enter age", formatMsg: "Enter only Numbers" },
    { name: "gender", label: "Gender", type: "radio", required: true, options: ["Male", "Female"], requiredMsg: "Please select gender" },
    { name: "maritalStatus", label: "Marital Status", type: "radio", options: ["Married", "Single"] },
    { name: "bloodPressure", label: "Blood Pressure", type: "text", placeholder: "192/74" },
    { name: "weight", label: "Weight", type: "text", placeholder: "Kilogram (kg.)" },
    { name: "height", label: "Height", type: "text", placeholder: "Centimeter (cm)" },
    { name: "vegetarian", label: "Are you a Vegetarian", type: "radio", options: ["Yes", "No"] },
    { name: "dependOn", label: "Dependence on", type: "checkboxes", options: opts.dependOn, full: true },
    { name: "presentProblems", label: "Present Health Problems", type: "textarea", required: true, full: true, requiredMsg: "Please present health problems" },
    { name: "personalHistory", label: "Personal History", type: "textarea", full: true },
    { name: "pastHistory", label: "Any Past History", type: "checkboxes", options: opts.pastHistory, full: true },
    { name: "investigations", label: "Any previous Investigations report", type: "textarea", full: true },
    { name: "otherInfo", label: "Other information which you think might be helpful", type: "textarea", full: true },
    { name: "pregnant", label: "Pregnant/Lactation", type: "text" },
    { name: "planningPregnancy", label: "Planning for Pregnancy in next 6 Months", type: "radio", options: ["Yes", "No"] },
    { name: "mainComplaint", label: "Main Complaint", type: "text", full: true },
    { name: "durationYear", label: "Duration of the complaint — year", type: "select", options: opts.complaintYears },
    { name: "durationMonth", label: "Duration of the complaint — month", type: "select", options: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
    { name: "durationDay", label: "Duration of the complaint — day", type: "select", options: Array.from({ length: 31 }, (_, i) => String(i + 1)) },
    { name: "minorComplaints", label: "Any other associated minor Complaints", type: "text", full: true },
    { name: "medication", label: "Taking any Medication at present", type: "textarea", full: true },
    { name: "functional", label: "Functional history", type: "checkboxes", options: opts.functional, full: true, cols: true },
    consent,
  ],
};

export function applicationSchema(jobId?: string): FormSchema & { preset: Record<string, string | string[]> } {
  const job = jobId ? (opts.jobs as Record<string, { post: string; ref: string }>)[jobId] : undefined;
  const industries = opts.industries.map((i) => i.industry);
  const companies = opts.industries.flatMap((i) => i.companies);
  return {
    id: "application", title: "Apply Now", intro: "All fields marked with an (*) are mandatory.", submitLabel: "Submit Application",
    preset: job ? { post: job.post, jobRef: job.ref } : {},
    fields: [
      { name: "industry", label: "Industry", type: "checkboxes", required: true, options: industries, full: true, requiredMsg: "Please select at least one industry." },
      { name: "company", label: "Company", type: "checkboxes", options: companies, full: true },
      { name: "firstName", label: "First Name", type: "text", required: true, requiredMsg: "Please enter first name", autoComplete: "given-name" },
      { name: "lastName", label: "Last Name", type: "text", required: true, requiredMsg: "Please enter last name", autoComplete: "family-name" },
      { name: "post", label: "Post Applied for", type: "select", required: true, options: opts.posts, requiredMsg: "Please select post applied for." },
      { name: "jobRef", label: "Job Reference Code", type: "text", required: !!job, requiredMsg: "Please enter the job reference code.", hint: job ? undefined : "Shown on the opening you are applying for, if any." },
      { name: "gender", label: "Gender", type: "radio", options: ["Male", "Female"] },
      { name: "dob", label: "Date of Birth", type: "date", required: true, requiredMsg: "Please select date of birth", autoComplete: "bday" },
      { name: "address", label: "Address", type: "textarea", full: true, autoComplete: "street-address" },
      country(),
      { name: "state", label: "State", type: "text", required: true, requiredMsg: "Please select state.", autoComplete: "address-level1" },
      { name: "city", label: "City", type: "text", required: true, requiredMsg: "Please select city.", autoComplete: "address-level2" },
      { name: "phone", label: "Phone", type: "tel", pattern: "digits", formatMsg: "Enter only Numbers", autoComplete: "tel" },
      { name: "mobile", label: "Mobile", type: "tel", required: true, pattern: "digits", requiredMsg: "Please enter mobile", formatMsg: "Enter only Numbers", autoComplete: "tel" },
      { name: "email", label: "E-mail", type: "email", required: true, pattern: "email", requiredMsg: "Please enter email", formatMsg: "Please provide a valid email", autoComplete: "email" },
      { name: "qualification", label: "Highest Qualification", type: "textarea", required: true, full: true, requiredMsg: "Please enter highest qualification" },
      { name: "expYears", label: "Total Experience — years", type: "select", required: true, options: opts.years, requiredMsg: "Please select total experience." },
      { name: "expMonths", label: "Total Experience — months", type: "select", options: opts.months },
      { name: "languages", label: "Languages Known", type: "checkboxes", options: opts.languages, full: true, cols: true },
      { name: "currentOrganization", label: "Current Organization", type: "text", autoComplete: "organization" },
      { name: "currentDesignation", label: "Current Designation", type: "text", autoComplete: "organization-title" },
      { name: "currentLocation", label: "Current Location", type: "text" },
      { name: "passport", label: "Valid Passport", type: "radio", options: ["Yes", "No"] },
      { name: "photo", label: "Upload your Photo", type: "file", hint: "(Profile with Photo's are more Likely Preferred)" },
      { name: "cv", label: "Upload your CV", type: "file", required: true, requiredMsg: "Please upload your CV." },
      { ...consent, label: "I have read and agree to Kairali Ayurvedic Group Privacy & Terms of Use." },
    ],
  };
}

export const NEWSLETTER: FormSchema = {
  id: "newsletter", title: "Subscribe to our Newsletter", submitLabel: "Subscribe",
  fields: [
    { name: "email", label: "Enter Your Email Id", type: "email", required: true, pattern: "email", requiredMsg: "Please Provide Valid Email", formatMsg: "Please Provide Valid Email", autoComplete: "email" },
    consent,
  ],
};
