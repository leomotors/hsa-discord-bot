// @ts-check

import { createESLintConfig } from "@leomotors/config";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...createESLintConfig(),
  {
    files: ["*.config.ts"],
    rules: {
      "no-undef": "off",
    },
  },
]);
