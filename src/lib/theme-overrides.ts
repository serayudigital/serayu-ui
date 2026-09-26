/**
 * Subset of sd- tokens that can be overridden via ThemeCustomizer.
 *
 * - `brand`, `brand-foreground`: primary colors.
 * - `radius`: base in px (sm/md/lg/xl are derived automatically).
 * - `font-size-base`: base html font size in px.
 * - `theme-mode`: 'light' | 'dark' | 'system'.
 */
export interface ThemeOverrides {
  brand?: string;
  "brand-foreground"?: string;
  radius?: string;
  "font-size-base"?: string;
  "theme-mode"?: "light" | "dark" | "system";
}

/** Maps ThemeOverrides to CSS custom property names. */
export const OVERRIDE_TO_VAR: Record<keyof ThemeOverrides, string[]> = {
  brand: ["--sd-brand"],
  "brand-foreground": ["--sd-brand-foreground"],
  radius: [
    "--sd-radius-sm",
    "--sd-radius-md",
    "--sd-radius-lg",
    "--sd-radius-xl",
  ],
  "font-size-base": ["--sd-font-size-base"],
  "theme-mode": [], // handled separately via data-theme attr
};

export const VAR_TO_OVERRIDE: Record<string, keyof ThemeOverrides> = {
  "--sd-brand": "brand",
  "--sd-brand-foreground": "brand-foreground",
  "--sd-font-size-base": "font-size-base",
  "--sd-radius-sm": "radius",
};

/** Collects CSS variable declarations for the container scope (inline style). */
export function overridesToInlineStyle(
  overrides: ThemeOverrides
): React.CSSProperties {
  const style: Record<string, string> = {};
  (Object.keys(overrides) as (keyof ThemeOverrides)[]).forEach((key) => {
    if (key === "theme-mode") return;
    const vars = OVERRIDE_TO_VAR[key];
    const value = overrides[key];
    if (value === undefined || !vars) return;
    if (key === "radius") {
      // scale: sm = base*0.7, md=base, lg=base*1.3, xl=base*1.7
      const base = parseFloat(String(value));
      if (!Number.isFinite(base)) return;
      style["--sd-radius-sm"] = `${Math.max(2, Math.round(base * 0.7))}px`;
      style["--sd-radius-md"] = `${Math.max(2, base)}px`;
      style["--sd-radius-lg"] = `${Math.max(2, Math.round(base * 1.3))}px`;
      style["--sd-radius-xl"] = `${Math.max(2, Math.round(base * 1.7))}px`;
    } else {
      vars.forEach((v) => {
        style[v] = String(value);
      });
    }
  });
  return style as React.CSSProperties;
}
