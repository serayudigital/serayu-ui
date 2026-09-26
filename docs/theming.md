# Theming

Serayu UI uses a battle-tested dual-theme strategy: the `data-theme` attribute on `<html>` for manual override, with `prefers-color-scheme` fallback to auto-follow the OS.

PREFERENCE & RESOLVED THEME

There are 3 user preferences:

| `preference` | Source | `resolved` |
| ------------ | ------ | ---------- |
| `"light"` | User selects light | `light` |
| `"dark"` | User selects dark | `dark` |
| `"system"` | Default, or user selects "Auto" | OS match |

The preference is stored in `localStorage` key `sd-theme`. Resolved theme is what is actually used for rendering.

API `useTheme`

```tsx
import { useTheme } from "@serayu/ui";

function Settings() {
  const { preference, resolved, setPreference, toggle } = useTheme();

  return (
    <div>
      <p>Preference: {preference}</p>
      <p>Resolved: {resolved}</p>
      <button onClick={() => setPreference("light")}>Light</button>
      <button onClick={() => setPreference("dark")}>Dark</button>
      <button onClick={() => setPreference("system")}>Auto</button>
      <button onClick={toggle}>Quick toggle</button>
    </div>
  );
}
```

SYNCHRONIZATION ACROSS TABS

`useTheme` listens to the `storage` event on `window`. If the user opens 2 tabs and changes the theme in tab A, tab B follows immediately.

There is no backend, no cookies - everything is client-side and deterministic.

ANTI-FOWT (FLASH OF WRONG THEME)

The inline script in `<head>` sets `data-theme` before React mounts, so there is no flash of wrong color when reloading the page. See details at [Installation](https://github.com/serayudigital/serayu-ui/blob/main/docs/installation.md#3-setup-anti-fowt-flash-of-wrong-theme).

OVERRIDE TOKEN

Applications can still override CSS tokens without forking the library:

```css
/* globals.css */
:root {
  --sd-brand: #ff5722;          /* change brand to orange */
  --sd-radius-md: 6px;          /* more square */
  --sd-duration-standard: 150ms; /* faster */
}

:root[data-theme="dark"] {
  --sd-surface: #000000;        /* deeper */
}
```

Complete available tokens are at [Design Tokens](https://github.com/serayudigital/serayu-ui/blob/main/docs/tokens.md).

OVERRIDE RUNTIME VIA THEMECUSTOMIZER

In addition to overriding via static CSS, you can tweak `sd-*` tokens at runtime through the `ThemeCustomizer` pattern. Suitable for "Settings > Appearance" pages in your application:

```tsx
import { ThemeCustomizer } from "@serayu/ui";
import type { ThemeOverrides } from "@serayu/ui";

const [overrides, setOverrides] = useState<ThemeOverrides>({});

<ThemeCustomizer
  scope="container"
  overrides={overrides}
  onChange={setOverrides}
/>
```

- `scope="container"` (default) limits the override to the parent element - does not change the document globally.
- `scope="document"` writes directly to `:root` via `applyDocumentOverrides()`.

Built-in theme presets are available via `THEME_PRESETS` from `theme-presets.ts`: `serayu-original` (default), `garuda` (red-yellow), `tropical` (green-blue), `midnight` (dark purple). Use `overridesToInlineStyle(overrides)` to convert the override object into inline `style`.

Complete available tokens to override are at [Design Tokens](https://github.com/serayudigital/serayu-ui/blob/main/docs/tokens.md).

CUSTOM TAILWIND COLORS

The default Tailwind config already maps tokens to utility classes. If you need to override or add:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import preset from "@serayu/ui/tailwind-preset";

const config: Config = {
  presets: [preset],
  theme: {
    extend: {
      colors: {
        // add your custom color here
      },
    },
  },
};

export default config;
```

Or just extend manually:

```ts
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: "var(--sd-brand)",
        foreground: "var(--sd-brand-foreground)",
      },
    },
  },
},
```

REDUCED MOTION

`@media (prefers-reduced-motion: reduce)` automatically sets `--sd-duration-*` to `0ms`. Users with low motion preference will see instant transitions - no additional configuration needed.

LIGHT VS DARK CONTRAST

All main color combinations have passed WCAG AA contrast ratio:

| Background | Text | Ratio |
| ----- | ---- | ----- |
| `--sd-background` (#fff) | `--sd-foreground` (#0a0a0a) | 19.7:1 |
| `--sd-brand` (#0064f0) | `--sd-brand-foreground` (#fff) | 4.6:1 |
| `--sd-surface` (#f7f7f8) | `--sd-surface-foreground` (#0a0a0a) | 18.5:1 |
| `--sd-muted` (#f1f1f3) | `--sd-muted-foreground` (#52525b) | 6.1:1 |

Dark mode also meets AA for main text.
