import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const responses = fileURLToPath(new URL("../local-font-responses.cjs", import.meta.url));

const result = spawnSync(process.execPath, [nextBin, "build"], {
  env: {
    ...process.env,
    NEXT_FONT_GOOGLE_MOCKED_RESPONSES: responses,
  },
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
