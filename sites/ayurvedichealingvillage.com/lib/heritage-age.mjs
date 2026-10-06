/** 1908 is the family's Ayurvedic heritage, not the property's founding date. */
export function heritageYears(date = new Date()) {
  const year = Number(new Intl.DateTimeFormat('en', {timeZone:'Asia/Kolkata', year:'numeric'}).format(date));
  return Math.max(0, year - 1908);
}
