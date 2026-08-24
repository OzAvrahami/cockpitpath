import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([
    // Checked-in design-tool references are immutable inputs, not application code.
    "docs/design/**",
  ]),
]);
