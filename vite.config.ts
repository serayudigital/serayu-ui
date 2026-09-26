import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import path from "node:path";

// Serayu UI - Mobile-first React UI components built with Radix UI and Tailwind CSS.
// by Serayu Digital - www.serayudigital.com
export default defineConfig(({ command }) => {
  const isAnalyze = process.env["ANALYZE"] === "true";
  const plugins = [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Serayu UI Playground",
        short_name: "Serayu",
        description:
          "Serayu UI - Mobile-first React UI components built with Radix UI and Tailwind CSS. by Serayu Digital - www.serayudigital.com",
        start_url: "/",
        display: "standalone",
        theme_color: "#0064f0",
        background_color: "#ffffff",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
      },
      devOptions: {
        enabled: command === "serve",
      },
    }),
  ];

  if (isAnalyze) {
    plugins.push(
      visualizer({
        filename: "scripts/dist/stats.html",
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }) as never
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          playground: path.resolve(__dirname, "playground/index.html"),
        },
        output: {
          manualChunks: (id) => {
            // Separate chunks for heavy components so tree-shaking
            // stays clear. The library keeps eager exports so consumers
            // do not need to call React.lazy manually.
            if (id.includes("patterns/story-reels-viewer")) {
              return "pattern-story-reels";
            }
            if (id.includes("patterns/map-preview")) {
              return "pattern-map-preview";
            }
            if (id.includes("patterns/command-bar-mobile")) {
              return "pattern-command-bar";
            }
            if (id.includes("charts")) {
              return "ui-charts";
            }
            return undefined;
          },
        },
      },
    },
  };
});
