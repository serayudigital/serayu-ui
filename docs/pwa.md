# PWA

Serayu UI is designed mobile-first with PWA support. This library provides the building blocks; installing the service worker and manifest is your responsibility (typically via `vite-plugin-pwa`).

CONCEPT

A PWA needs 3 things:

1. Web manifest - metadata for "Add to Home Screen"
2. Service worker - caching + offline support
3. Icons - launcher icon (including maskable for Android adaptive)

Serayu UI provides an icon generator and is compatible with `vite-plugin-pwa`. For other libraries (manual Workbox, Next.js PWA, etc.) the pattern is the same.

SETUP WITH VITE-PLUGIN-PWA

1. INSTALL

```bash
npm install -D vite-plugin-pwa
```

2. VITE CONFIGURATION

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Serayu App",
        short_name: "Serayu",
        description: "A mobile-first app built with Serayu UI",
        theme_color: "#0064f0",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
      },
    }),
  ],
});
```

3. GENERATE IKON

Serayu UI includes a generator script. Place `favicon.ico` in `public/`, then:

```bash
npm run generate:icons
```

Output: `public/icons/icon-192.png`, `icon-384.png`, `icon-512.png`, and `icon-maskable-512.png`.

This script uses `sharp` to rasterize SVG to PNG. The "S" monogram icon over the brand background `#0064f0`.

4. REGISTER SERVICE WORKER

```tsx
// src/main.tsx
import { registerSW } from "virtual:pwa-register";

if ("serviceWorker" in navigator) {
  registerSW({ immediate: true });
}
```

Or use the auto-register that's already active when `registerType: "autoUpdate"`.

DYNAMIC THEME COLOR

So the mobile address bar changes color based on theme:

```html
<!-- index.html -->
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0b0b10" media="(prefers-color-scheme: dark)" />
```

When the user toggles dark mode via `ThemeToggle`, the browser will swap automatically because it matches the media query.

INSTALL PROMPT

Show the "Add to Home Screen" button manually:

```tsx
import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!prompt) return null;

  return (
    <button
      onClick={async () => {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === "accepted") setPrompt(null);
      }}
    >
      Install App
    </button>
  );
}
```

IOS SAFARI QUIRKS

For Android Chrome (and modern browsers), enable installable PWA mode with:

```html
<meta name="mobile-web-app-capable" content="yes" />
```

iOS Safari does not support `theme-color` media query, but does support `<meta name="apple-mobile-web-app-capable">`:

```html
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Serayu" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

`black-translucent` makes the status bar transparent over your content (use safe-area inset). Include both `mobile-web-app-capable` (Chrome/modern) and `apple-mobile-web-app-capable` (iOS Safari) for full coverage.

OFFLINE STRATEGY

Default `vite-plugin-pwa` uses precaching for the app shell (HTML, CSS, JS, icons). For API data, add runtime caching:

```ts
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.example\.com\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
      },
    },
  ],
},
```

UPDATE FLOW

With `registerType: "autoUpdate"`, the new service worker activates immediately without reload. For a user-confirmation flow:

```ts
VitePWA({
  registerType: "prompt",
}),
```

```tsx
import { useRegisterSW } from "virtual:pwa-register/react";

function UpdatePrompt() {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <div>
      A new version is available.
      <button onClick={() => updateServiceWorker(true)}>Refresh</button>
    </div>
  );
}
```

LIGHTHOUSE SCORE TARGET

The configuration above should yield:

- PWA - 100 (manifest valid, service worker registered, HTTPS)
- Performance - 90+ (precache, gzip aktif via Vite)
- Accessibility - 95+ (Radix primitives + tap target 44px)
- Best Practices - 95+ (HTTPS, no console error)
- SEO - 90+ (meta tags, mobile viewport)

To reach Performance 100, optimize images (WebP) and reduce JS bundle (lazy load routes).
