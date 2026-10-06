export const CAMPAIGN_PHONE_PATTERN=String.raw`[+0-9\(\) .\-]{7,30}`;
/** Shared campaign validation. This checks number structure, not ownership. */
// Remove optional national trunk 0 for these common calling codes. Italy's 0 is retained.
export function normaliseCampaignPhone(value: string): string {
 return value.trim().replace(/^(\+(?:91|44|49|33|61|971))[ () .-]*0\)?/, '$1 ');
}
export function validCampaignPhone(value: string): boolean {
 const phone=normaliseCampaignPhone(value);
 if (!/^\+[1-9][0-9() .-]+$/.test(phone) || phone.length>30) return false;
 const digits=phone.replace(/[^0-9]/g,'');
 if(digits.length<8 || digits.length>15) return false;
 // India numbers need ten national digits; international numbers retain E.164 bounds.
 const national=digits.startsWith('91')?digits.slice(2):digits;
 if(digits.startsWith('91') && !/^[1-9][0-9]{9}$/.test(national)) return false;
 if (/^(\d)\1{6,}$/.test(national) || /^(?:0?1234567890?|9876543210?)$/.test(national)) return false;
 return true;
}
