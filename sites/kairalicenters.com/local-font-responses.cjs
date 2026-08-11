const { resolve } = require("node:path");

const assets = resolve(__dirname, "../../packages/ui/fonts/assets");

function face(family, weight, file) {
  return `/* latin */
@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url(${resolve(assets, file)}) format('woff2');
}`;
}

const families = {
  Kurale: face("Kurale", "400", "kurale-400.woff2"),
  Asap: face("Asap", "100 900", "asap-latin.woff2"),
  Lato: [
    face("Lato", "300", "lato-300.woff2"),
    face("Lato", "400", "lato-400.woff2"),
    face("Lato", "700", "lato-700.woff2"),
  ].join("\n"),
};

module.exports = new Proxy(Object.create(null), {
  get(_target, requestUrl) {
    if (typeof requestUrl !== "string") return undefined;
    try {
      const familySpec = new URL(requestUrl).searchParams.get("family") ?? "";
      return families[familySpec.split(":", 1)[0]];
    } catch {
      return undefined;
    }
  },
});
