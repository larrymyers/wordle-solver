/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { readFileSync } from "fs";
import { join } from "path";

export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
