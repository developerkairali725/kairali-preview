// Synthetic representative ad-click URL shapes for the measurement URL filter.
// Every value is synthetic. Keys come from an earlier visible URL sample of the
// AHV-NEO expanded landing-page report (8 Sep-7 Oct 2026; account-map
// EVIDENCE-RECONCILIATION.json): campaignid, adgroupid, keyword, utm_adgroup,
// creative, device, placement, utm_device, and a utm_content value with braces.
// That sample also held 3 parameter occurrences of unsaved, unclassified keys.
// The 38-row scan saved aggregates only, so these cases are not a replay or
// coverage of those 38 rows. targetid was a scan candidate name only and was not
// returned, so it is not removed and must keep measurement off (B10, B24, B25).
// Value formats follow Google's ValueTrack documentation, not saved values.
const UTM = "utm_source=google&utm_medium=cpc&utm_campaign=synthetic_campaign";

/** Batch A, 23 synthetic cases: shapes that should be measured once ad metadata is removed.
 * A15/A16 (targetid) were retired on 2026-10-08 and became B24/B25. */
export const SYNTHETIC_AD_CLICKS = [
  { id: "A01", basis: "entered final URL shape", path: "/ayurvedic-treatment-packages.html", search: "?utm_source=src&utm_medium=medium", after: "?utm_source=src&utm_medium=medium" },
  { id: "A02", basis: "entered final URL shape", path: "/pain-management.html", search: "?utm_source=src", after: "?utm_source=src" },
  { id: "A03", basis: "entered URL + click-time Google keys", search: `?${UTM}&gad_source=1&gad_campaignid=12345678901&gclid=SyntheticGclid0001`, after: `?${UTM}&gad_source=1&gad_campaignid=12345678901&gclid=SyntheticGclid0001` },
  { id: "A04", basis: "sample key, synthetic value", search: `?${UTM}&campaignid=12345678901`, after: `?${UTM}` },
  { id: "A05", basis: "sample key, synthetic value", search: `?${UTM}&adgroupid=123456789012`, after: `?${UTM}` },
  { id: "A06", basis: "sample key, synthetic value", search: `?${UTM}&creative=765432109876`, after: `?${UTM}` },
  { id: "A07", basis: "sample key, synthetic value", search: `?${UTM}&keyword=synthetic+keyword+text`, after: `?${UTM}` },
  { id: "A08", basis: "sample key, synthetic value", search: `?${UTM}&device=m`, after: `?${UTM}` },
  { id: "A09", basis: "sample key, synthetic value", search: `?${UTM}&device=c`, after: `?${UTM}` },
  { id: "A10", basis: "sample key, synthetic value", search: `?${UTM}&placement=`, after: `?${UTM}` },
  { id: "A11", basis: "sample key, synthetic value", search: `?${UTM}&placement=www.example.com`, after: `?${UTM}` },
  { id: "A12", basis: "sample key, synthetic value", search: `?${UTM}&utm_adgroup=synthetic_group`, after: `?${UTM}` },
  { id: "A13", basis: "sample key, synthetic value", search: `?${UTM}&utm_device=t`, after: `?${UTM}` },
  { id: "A14", basis: "brace-valued utm_content (sample flag), synthetic placeholder", search: `?${UTM}&utm_content=%7B_creative%7D`, after: `?${UTM}` },
  { id: "A17", basis: "sample keys, full synthetic suffix", search: `?${UTM}&campaignid=12345678901&adgroupid=123456789012&creative=765432109876&keyword=synthetic+keyword&device=m&placement=&gclid=SyntheticGclid0002`, after: `?${UTM}&gclid=SyntheticGclid0002` },
  { id: "A18", basis: "sample keys, full synthetic suffix", search: `?${UTM}&utm_adgroup=synthetic_group&utm_device=m&campaignid=12345678901&adgroupid=123456789012&gad_source=1&gad_campaignid=12345678901&gclid=SyntheticGclid0003`, after: `?${UTM}&gad_source=1&gad_campaignid=12345678901&gclid=SyntheticGclid0003` },
  { id: "A19", basis: "sample keys, empty ValueTrack values", search: `?${UTM}&keyword=&creative=&device=`, after: `?${UTM}` },
  { id: "A20", basis: "sample keys before UTM keys", search: `?campaignid=12345678901&adgroupid=123456789012&${UTM}`, after: `?${UTM}` },
  { id: "A21", basis: "sample key repeated", search: `?${UTM}&campaignid=12345678901&campaignid=12345678902`, after: `?${UTM}` },
  { id: "A22", basis: "placeholder in utm_term with empty keyword", search: `?${UTM}&utm_term=%7Bkeyword%7D&keyword=`, after: `?${UTM}` },
  { id: "A23", basis: "percent-encoded space", search: `?${UTM}&keyword=synthetic%20keyword`, after: `?${UTM}` },
  { id: "A24", basis: "sample keys only", search: "?campaignid=12345678901&adgroupid=123456789012&creative=765432109876", after: "" },
  { id: "A25", basis: "sample key + measured anchor + gbraid", search: `?${UTM}&gbraid=SyntheticBraid01&device=t`, hash: "#enquiry", after: `?${UTM}&gbraid=SyntheticBraid01` },
];

/** Batch B, 25 cases: must stay unmeasured and leave the address untouched. */
export const BLOCKED = [
  { id: "B01", reason: "unknown key", search: `?${UTM}&srsltid=SyntheticValue` },
  { id: "B02", reason: "ad metadata beside private unknown key", search: `?${UTM}&campaignid=12345678901&email=private%40example.com` },
  { id: "B03", reason: "non-numeric id", search: `?${UTM}&campaignid=abc` },
  { id: "B04", reason: "email in id key", search: `?${UTM}&adgroupid=private%40example.com` },
  { id: "B05", reason: "device outside m/t/c", search: `?${UTM}&device=mobile` },
  { id: "B06", reason: "email in keyword", search: `?${UTM}&keyword=private%40example.com` },
  { id: "B07", reason: "line break in keyword", search: `?${UTM}&keyword=synthetic%0Aline` },
  { id: "B08", reason: "keyword over 120 characters", search: `?${UTM}&keyword=${"a".repeat(121)}` },
  { id: "B09", reason: "non-ASCII keyword (remaining blocked case)", search: `?${UTM}&keyword=f%C3%BCr` },
  { id: "B10", reason: "targetid (unknown key) carrying markup", search: `?${UTM}&targetid=kwd-1%3Cscript%3E` },
  { id: "B11", reason: "placeholder with spaces", search: `?${UTM}&utm_content=%7Bsynthetic+value%7D` },
  { id: "B12", reason: "placeholder in click id", search: `?${UTM}&gclid=%7Bgclid%7D` },
  { id: "B13", reason: "key differs in case", search: `?${UTM}&CampaignID=12345678901` },
  { id: "B14", reason: "unmeasured fragment", search: `?${UTM}&campaignid=12345678901`, hash: "#draft" },
  { id: "B15", reason: "private UTM value beside ad metadata", search: `?utm_content=private%40example.com&campaignid=12345678901` },
  { id: "B16", reason: "one repeated keyword invalid", search: `?${UTM}&keyword=synthetic&keyword=private%40example.com` },
  { id: "B17", reason: "array-style key", search: `?${UTM}&campaignid%5B%5D=12345678901` },
  { id: "B18", reason: "placement with a colon (app placement, remaining blocked case)", search: `?${UTM}&placement=mobileapp%3A%3A1-0000000000` },
  { id: "B19", reason: "search text from our own page as referrer", search: `?${UTM}`, referrer: "https://ayurvedichealingvillage.com/search/?q=synthetic+condition" },
  { id: "B20", reason: "private value in our own referrer", search: "", referrer: "https://ayurvedichealingvillage.com/contact-us/?email=private%40example.com" },
  { id: "B21", reason: "private UTM in our own referrer", search: "?gclid=SyntheticGclid0004", referrer: "https://ayurvedichealingvillage.com/?utm_term=private%40example.com" },
  { id: "B22", reason: "our own page left before its ad metadata was removed (keyword would reach raw-reading SDKs)", search: "", referrer: "https://ayurvedichealingvillage.com/?utm_source=google&campaignid=12345678901&keyword=synthetic+keyword" },
  { id: "B23", reason: "functional site parameter beside ad metadata: nothing is removed", path: "/search/", search: "?q=synthetic+text&campaignid=12345678901" },
  { id: "B24", reason: "well-formed targetid stays an unknown key (formerly A15)", search: `?${UTM}&targetid=kwd-123456789` },
  { id: "B25", reason: "targetid beside removable ad keys and gclid: nothing is removed (formerly A16)", search: `?${UTM}&campaignid=12345678901&adgroupid=123456789012&keyword=synthetic+keyword&targetid=aud-123456:kwd-7891011&gclid=SyntheticGclid0007` },
];

/** Batch C, 10 synthetic cases: a key spelled with a leading "?" (literal or
 * percent-encoded) is a different, unknown key under whole-query parsing, so it
 * must stay unmeasured and leave the address untouched even beside removable
 * ad metadata. C01, C02, C05, C06, C07 and C09 were measured before the
 * 2026-10-08 pair-parsing fix; the encoded and allowed-key cases are guards. */
export const LEADING_QUESTION_MARK = [
  { id: "C01", reason: "literal leading ? on an ad key", search: `?${UTM}&?campaignid=12345678901` },
  { id: "C02", reason: "literal leading ? on keyword", search: `?${UTM}&?keyword=synthetic+keyword` },
  { id: "C03", reason: "encoded leading ? on an ad key", search: `?${UTM}&%3Fcampaignid=12345678901` },
  { id: "C04", reason: "encoded leading ? on keyword", search: `?${UTM}&%3Fkeyword=synthetic+keyword` },
  { id: "C05", reason: "literal leading ? on a placeholder UTM", search: `?${UTM}&?utm_content=%7B_creative%7D` },
  { id: "C06", reason: "doubled ? at the start of the query", search: `??campaignid=12345678901&${UTM}` },
  { id: "C07", reason: "literal leading ? on an ad key beside gclid", search: `?${UTM}&?campaignid=12345678901&gclid=SyntheticGclid0009` },
  { id: "C08", reason: "lower-case encoded leading ? on an ad key", search: `?${UTM}&%3fadgroupid=123456789012` },
  { id: "C09", reason: "removable ad key beside a literal leading ? key: nothing is removed", search: `?${UTM}&campaignid=12345678901&?device=m` },
  { id: "C10", reason: "literal leading ? on an allowed click id", search: `?${UTM}&?gclid=SyntheticGclid0010` },
];

export const APPROVED_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "gad_source", "gad_campaignid"];
