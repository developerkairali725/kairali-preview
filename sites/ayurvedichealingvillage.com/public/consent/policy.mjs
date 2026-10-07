// Candidate retention and copy require owner/privacy review before publication.
export const REVISION = 2;
export const EXPIRY_DAYS = 182;
export const STORAGE_KEY = 'ahv-consent-v2';
export function preferences(categories, globalPrivacyControl = false) {
  const choices = Array.isArray(categories) ? categories : [];
  return { analytics: choices.includes('analytics'), advertising: !globalPrivacyControl && choices.includes('advertising') };
}
export function legacyRejection(storage) {
  try { return !storage.getItem('ahv-consent-migrated-v2') && !storage.getItem(STORAGE_KEY) && storage.getItem('ktahv-consent') === 'declined'; } catch { return false; }
}
