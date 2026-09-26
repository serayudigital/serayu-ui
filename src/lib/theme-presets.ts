import type { ThemeOverrides } from "./theme-overrides";

export type { ThemeOverrides };
export {
  OVERRIDE_TO_VAR,
  VAR_TO_OVERRIDE,
  overridesToInlineStyle,
} from "./theme-overrides";

export interface ThemePreset {
  id: string;
  label: string;
  description?: string;
  overrides: ThemeOverrides;
}

export const DEFAULT_THEME: ThemeOverrides = {
  brand: "#0064f0",
  "brand-foreground": "#ffffff",
  radius: "12",
  "font-size-base": "16",
  "theme-mode": "system",
};

/**
 * Built-in preset bundle. Used by ThemeCustomizer for the dropdown.
 *
 * - Serayu Original: standard blue brand (default v1.0+).
 * - Garuda: red and white (Indonesian identity colors).
 * - Tropical: teal green + warm background.
 * - Midnight: deep blue with high contrast foreground.
 * - Monochrome: neutral gray, focused on typographic hierarchy.
 * - High Contrast: WCAG AAA contrast ratio for accessibility.
 * - Pastel: soft tones (sky/peach/mint), suitable for lifestyle
 *   apps or friendly onboarding.
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "serayu-original",
    label: "Serayu Original",
    description: "Standard Serayu UI blue.",
    overrides: {
      brand: "#0064f0",
      "brand-foreground": "#ffffff",
      radius: "12",
      "font-size-base": "16",
      "theme-mode": "system",
    },
  },
  {
    id: "garuda",
    label: "Garuda (Red-White)",
    description: "Indonesian red identity.",
    overrides: {
      brand: "#dc2626",
      "brand-foreground": "#ffffff",
      radius: "10",
      "font-size-base": "16",
      "theme-mode": "light",
    },
  },
  {
    id: "tropical",
    label: "Tropical (Green-Sand)",
    description: "Teal green + warm background.",
    overrides: {
      brand: "#0d9488",
      "brand-foreground": "#ffffff",
      radius: "16",
      "font-size-base": "16",
      "theme-mode": "light",
    },
  },
  {
    id: "midnight",
    label: "Midnight (Deep Blue)",
    description: "Deep blue with high contrast.",
    overrides: {
      brand: "#1e40af",
      "brand-foreground": "#f8fafc",
      radius: "8",
      "font-size-base": "15",
      "theme-mode": "dark",
    },
  },
  {
    id: "monochrome",
    label: "Monochrome (Neutral Gray)",
    description:
      "No brand color - typography hierarchy focus. Suitable for serious apps / admin dashboards.",
    overrides: {
      brand: "#27272a",
      "brand-foreground": "#fafafa",
      radius: "8",
      "font-size-base": "16",
      "theme-mode": "light",
    },
  },
  {
    id: "high-contrast",
    label: "High Contrast (WCAG AAA)",
    description:
      "Deep black + pure white for WCAG AAA contrast ratio (>= 7:1). For accessibility needs.",
    overrides: {
      brand: "#000000",
      "brand-foreground": "#ffffff",
      radius: "4",
      "font-size-base": "17",
      "theme-mode": "light",
    },
  },
  {
    id: "pastel",
    label: "Pastel (Sky-Peach-Mint)",
    description:
      "Soft tone for lifestyle apps or friendly onboarding. Sky brand, large radius.",
    overrides: {
      brand: "#0284c7",
      "brand-foreground": "#ffffff",
      radius: "20",
      "font-size-base": "16",
      "theme-mode": "light",
    },
  },
];

/** Serialize overrides into a string key for comparison (cache). */
export function overridesKey(overrides: ThemeOverrides): string {
  return (Object.keys(overrides) as (keyof ThemeOverrides)[])
    .sort()
    .map((k) => `${k}=${overrides[k]}`)
    .join("|");
}

/** Apply overrides to the root document (document scope). Only used
 * when the caller explicitly picks `scope="document"`. */
export function applyDocumentOverrides(overrides: ThemeOverrides): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (overrides.brand !== undefined) {
    root.style.setProperty("--sd-brand", overrides.brand);
  }
  if (overrides["brand-foreground"] !== undefined) {
    root.style.setProperty(
      "--sd-brand-foreground",
      overrides["brand-foreground"]
    );
  }
  if (overrides["font-size-base"] !== undefined) {
    root.style.setProperty("--sd-font-size-base", overrides["font-size-base"]);
  }
  if (overrides.radius !== undefined) {
    const base = parseFloat(String(overrides.radius));
    if (Number.isFinite(base)) {
      root.style.setProperty(
        "--sd-radius-sm",
        `${Math.max(2, Math.round(base * 0.7))}px`
      );
      root.style.setProperty("--sd-radius-md", `${Math.max(2, base)}px`);
      root.style.setProperty(
        "--sd-radius-lg",
        `${Math.max(2, Math.round(base * 1.3))}px`
      );
      root.style.setProperty(
        "--sd-radius-xl",
        `${Math.max(2, Math.round(base * 1.7))}px`
      );
    }
  }
  if (overrides["theme-mode"]) {
    const mode = overrides["theme-mode"];
    if (mode === "system") {
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", mode);
    }
  }
}

/** Reset overrides applied to the document. */
export function clearDocumentOverrides(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  [
    "--sd-brand",
    "--sd-brand-foreground",
    "--sd-font-size-base",
    "--sd-radius-sm",
    "--sd-radius-md",
    "--sd-radius-lg",
    "--sd-radius-xl",
  ].forEach((v) => root.style.removeProperty(v));
}
