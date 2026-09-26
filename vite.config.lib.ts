import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * vite.config.lib.ts - Library mode build for publishing to npm.
 *
 * Used separately from vite.config.ts (app mode for the playground) so
 * they do not interfere with one another. Output: dist/index.js (ESM),
 * dist/index.cjs (CJS), dist/index.d.ts (types), dist/style.css.
 *
 * Usage:
 *   npm run build:lib
 *
 * Runtime deps (Radix, lucide, clsx, cva, tailwind-merge, etc.) are
 * externalized so they are not duplicated with the consumer bundle.
 * react/react-dom are peerDependencies - consumers install them directly.
 */
export default defineConfig({
  plugins: [react()],
  // Do not copy public/ for the lib build - those assets are for the playground/landing only.
  publicDir: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      // JS entry = public barrel without CSS (consumers usually use
      // deep imports and import CSS separately).
      entry: path.resolve(__dirname, "src/lib.entry.ts"),
      name: "SerayuUI",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      // Externalized deps - not included in the bundle. Consumers install them themselves.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^@radix-ui\//,
        /^lucide-react$/,
        /^clsx$/,
        /^tailwind-merge$/,
        /^class-variance-authority$/,
      ],
      output: {
        // Predictable CSS filename (not a hash).
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "style.css";
          return "assets/[name][extname]";
        },
        // Inform globals for UMD/CJS.
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        // Named exports for tree-shake friendliness.
        exports: "named",
      },
    },
    sourcemap: true,
    // CssCodeSplit false so we get a single style.css, not per-chunk.
    cssCodeSplit: false,
    // No minify on the lib build so stack traces stay readable for debugging.
    minify: false,
    // Clear the output folder before build.
    emptyOutDir: true,
  },
});
