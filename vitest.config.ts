import { defineConfig } from "vitest/config";
import path from "node:path";

// Serayu UI - vitest configuration for unit tests of hooks, utils, and
// components. Default environment node; tests that need DOM override
// per-file via `// @vitest-environment happy-dom`.
// by Serayu Digital - www.serayudigital.com
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts", "src/**/__tests__/**/*.test.tsx"],
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/__tests__/**",
        "src/**/*.test.*",
        "src/index.ts",
        "src/main.tsx",
        "src/App.tsx",
      ],
      thresholds: {
        // Initial Tier A target - raised per quarter.
        lines: 30,
        statements: 30,
        functions: 25,
        branches: 25,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
