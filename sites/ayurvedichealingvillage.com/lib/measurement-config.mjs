/** Owner 1 October 2026: consented staging verification, separate from indexing. */
export function measurementForEnvironment(env, config) {
  if (env.AHV_ANALYTICS !== "1") return undefined;
  const staging = env.AHV_STAGING !== "0";
  if (staging && env.AHV_ANALYTICS_STAGING !== "1") return undefined;
  return {
    ga4: config.measurement.ga4.id,
    clarity: config.measurement.clarity.id,
    metaPixel: config.measurement.metaPixel.id,
    // A destination ID is not a safe fallback for the independently verified tag.
    adsTagId: /^GT-[A-Z0-9]+$/.test(config.googleAds.tagId || "") ? config.googleAds.tagId : undefined,
    adsSendTo: config.googleAds.sendTo,
    environment: staging ? "staging" : "production",
  };
}
