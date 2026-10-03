import {validCampaignPhone,normaliseCampaignPhone} from './campaign-phone.ts';
import type { LeadTable } from './lead-store.ts';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DRIVE_FILE_URL_RE = /^https:\/\/drive\.google\.com\/file\/d\/[a-z0-9_-]+\/view(?:\?.*)?$/i;

const present = (values: Record<string, string | number | boolean | null>, key: string) =>
  typeof values[key] === 'string' ? values[key].trim() !== '' : values[key] !== undefined && values[key] !== null;

export function validationProblem(table: LeadTable, values: Record<string, string | number | boolean | null>): string | null {
  const email = typeof values.email === 'string' ? values.email : '';
  if (email && !EMAIL_RE.test(email)) return 'INVALID_EMAIL';

  if (table === 'contact' || table === 'enquiry-form') {
    return ['full_name', 'countrycode', 'phone', 'email'].every((key) => present(values, key))
      ? null : 'MISSING_REQUIRED_FIELDS';
  }

  if (table === 'apply-now') {
    if (values.application_type === 'careers-apply') {
      const required = [
        'fname', 'lname', 'post_applied_for', 'job_reference_code', 'state', 'city',
        'phone', 'mobile', 'email', 'current_organization', 'current_designation', 'current_location',
      ];
      if (!required.every((key) => present(values, key))) return 'MISSING_REQUIRED_FIELDS';
      for (const key of ['photo_url', 'resume_url']) {
        if (present(values, key) && !DRIVE_FILE_URL_RE.test(String(values[key]))) return 'INVALID_FILE_REFERENCE';
      }
      return null;
    }
    if (values.application_type === 'job-detail') {
      const required = ['full_name', 'phone', 'email', 'cover_letter', 'application_file_url'];
      if (!required.every((key) => present(values, key)) || values.privacy_consent !== true) {
        return 'MISSING_REQUIRED_FIELDS';
      }
      return DRIVE_FILE_URL_RE.test(String(values.application_file_url)) ? null : 'INVALID_FILE_REFERENCE';
    }
    return 'INVALID_APPLICATION_TYPE';
  }

  if (table === 'opd') {
    const required = ['full_name', 'age', 'gender', 'phone', 'symptoms'];
    if (!required.every((key) => present(values, key)) || values.consent !== true) return 'MISSING_REQUIRED_FIELDS';
    return null;
  }

  if (table === 'landing-page') {
    const campaignPath = typeof values.landing_page_path === 'string' ? values.landing_page_path.replace(/\/+$/, '') : '';
    if (['/ayurvedic-treatment-packages.html','/panchkarma-treatment.html','/pain-management.html','/family-ayurvedic-retreat-kerala.html','/preventive-rejuvenation-detoxification.html','/ayurveda-retreat-kerala.html','/weight-loss-programme','/digestive-wellness-gut-health-yoga-therapy','/karkidaka-chikitsha-or-monsoon-wellness.html'].includes(campaignPath) || (typeof values.form_variant === 'string' && values.form_variant.startsWith('r10-'))) {
      if (!['landing_page_path','fname','phone','email'].every((key)=>present(values,key)) || values.consent !== true) return 'MISSING_REQUIRED_FIELDS';
      const phone = normaliseCampaignPhone(String(values.phone));
      values.phone = phone;
      if (!validCampaignPhone(phone)) return 'INVALID_PHONE';
      if (String(values.fname).length > 120 || email.length > 254 || String(values.message || '').length > 3000) return 'INVALID_FIELD_LENGTH';
      return null;
    }
    const required = ['landing_page_path', 'email'];
    return required.every((key) => present(values, key)) ? null : 'MISSING_REQUIRED_FIELDS';
  }

  if (table === 'exit-intent') {
    const required = ['full_name', 'countrycode', 'phone', 'email'];
    return required.every((key) => present(values, key)) && values.consent === true
      ? null : 'MISSING_REQUIRED_FIELDS';
  }

  const required = ['full_name', 'countrycode', 'phone', 'email', 'country', 'health_concern'];
  if (!required.every((key) => present(values, key)) || values.consent !== true) return 'MISSING_REQUIRED_FIELDS';
  return null;
}
