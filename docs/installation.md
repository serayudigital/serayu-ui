# Installation

Complete guide to setting up Serayu UI in a React + Vite project (or other compatible toolchains).

REQUIREMENTS

- Node.js >= 18
- React >= 18.3
- TypeScript >= 5.0 (optional, but recommended)

STEP 1: INSTALL PACKAGE

```bash
npm install @serayu/ui
```

`@serayu/ui` ships with the following dependencies automatically:

- `@radix-ui/*` - primitives for Dialog, Popover, Tooltip, etc.
- `class-variance-authority` - variant styling utility
- `clsx` + `tailwind-merge` - class composition
- `lucide-react` - icons

STEP 2: IMPORT STYLESHEET

The stylesheet contains design tokens and utility classes. Import it once in the application entry.

OPTION A - DIRECT IMPORT (RECOMMENDED)

```tsx
// src/main.tsx
import "@serayu/ui/styles.css";
```

OPTION B - BUNDLE VIA TAILWIND

If your project already has its own Tailwind config and you want to extend it, add the path `node_modules/@serayu/ui/dist/**/*.css` to your content sources, or use PostCSS `@import`.

STEP 3: ANTI-FOWT SETUP (FLASH OF WRONG THEME)

To prevent the theme from "flashing" on page load, add this inline script to `<head>` before React mounts. Place it before `<script type="module">`.

VITE + PLAIN HTML

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Serayu App</title>
    <script>
      (function () {
        try {
          var pref = localStorage.getItem("sd-theme") || "system";
          var resolved =
            pref === "system" || !pref
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : pref;
          document.documentElement.setAttribute("data-theme", resolved);
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

NEXT.JS (APP ROUTER)

`app/layout.tsx`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("sd-theme")||"system";var r=(p==="system"||!p)?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):p;document.documentElement.setAttribute("data-theme",r);}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

STEP 4: MOUNT THEMETOGGLE (OPTIONAL)

To let users override the OS preference:

```tsx
import { ThemeToggle } from "@serayu/ui";

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle ariaLabel="Toggle theme" />
    </header>
  );
}
```

STEP 5: THEME COLOR (MOBILE ADDRESS BAR)

For Safari iOS and Chrome Android, set the address bar color to match the brand. Use media queries to automatically swap between light and dark:

```html
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0b0b10" media="(prefers-color-scheme: dark)" />
```

VERIFICATION

After setup, your application should:
- Not flash when switching themes.
- Follow the OS theme by default, with override via the toggle.
- Render Serayu UI components with solid styling.

Next, read:
- [Theming](https://github.com/serayudigital/serayu-ui/blob/main/docs/theming.md)
- [Design Tokens](https://github.com/serayudigital/serayu-ui/blob/main/docs/tokens.md)
- [UI Components](https://github.com/serayudigital/serayu-ui/blob/main/docs/components.md)
- [Patterns](https://github.com/serayudigital/serayu-ui/blob/main/docs/patterns.md)
- [PWA](https://github.com/serayudigital/serayu-ui/blob/main/docs/pwa.md)
