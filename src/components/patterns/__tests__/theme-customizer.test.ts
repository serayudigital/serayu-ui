import { describe, expect, it } from "vitest";
import {
  THEME_PRESETS,
  DEFAULT_THEME,
  overridesKey,
  overridesToInlineStyle,
} from "../../../lib/theme-presets";
import { ThemeCustomizer } from "../theme-customizer";
import { OVERRIDE_TO_VAR, type ThemeOverrides } from "../../../lib/theme-overrides";

describe("Theme presets", () => {
  it("DEFAULT_THEME contains all keys", () => {
    expect(DEFAULT_THEME.brand).toBeDefined();
    expect(DEFAULT_THEME["brand-foreground"]).toBeDefined();
    expect(DEFAULT_THEME.radius).toBeDefined();
    expect(DEFAULT_THEME["font-size-base"]).toBeDefined();
    expect(DEFAULT_THEME["theme-mode"]).toBe("system");
  });

  it("THEME_PRESETS contains 7 presets per plan", () => {
    expect(THEME_PRESETS.length).toBe(7);
    const ids = THEME_PRESETS.map((p) => p.id);
    expect(ids).toContain("serayu-original");
    expect(ids).toContain("garuda");
    expect(ids).toContain("tropical");
    expect(ids).toContain("midnight");
    expect(ids).toContain("monochrome");
    expect(ids).toContain("high-contrast");
    expect(ids).toContain("pastel");
  });

  it("monochrome: neutral gray, small radius, light mode", () => {
    const preset = THEME_PRESETS.find((p) => p.id === "monochrome");
    expect(preset).toBeDefined();
    expect(preset?.overrides.brand).toBe("#27272a");
    expect(preset?.overrides["brand-foreground"]).toBe("#fafafa");
    expect(preset?.overrides["theme-mode"]).toBe("light");
  });

  it("high-contrast: pure black + white for WCAG AAA", () => {
    const preset = THEME_PRESETS.find((p) => p.id === "high-contrast");
    expect(preset).toBeDefined();
    expect(preset?.overrides.brand).toBe("#000000");
    expect(preset?.overrides["brand-foreground"]).toBe("#ffffff");
    expect(preset?.overrides["font-size-base"]).toBe("17");
    expect(preset?.overrides["theme-mode"]).toBe("light");
  });

  it("pastel: soft sky tone, large radius", () => {
    const preset = THEME_PRESETS.find((p) => p.id === "pastel");
    expect(preset).toBeDefined();
    expect(preset?.overrides.brand).toBe("#0284c7");
    expect(preset?.overrides.radius).toBe("20");
    expect(preset?.overrides["theme-mode"]).toBe("light");
  });

  it("overridesKey deterministic for same obj", () => {
    const a: ThemeOverrides = { brand: "#abc", radius: "8" };
    const b: ThemeOverrides = { radius: "8", brand: "#abc" };
    expect(overridesKey(a)).toBe(overridesKey(b));
  });

  it("overridesKey different for different values", () => {
    const a: ThemeOverrides = { brand: "#abc" };
    const b: ThemeOverrides = { brand: "#def" };
    expect(overridesKey(a)).not.toBe(overridesKey(b));
  });

  it("overridesToInlineStyle maps radius to sm/md/lg/xl", () => {
    const style = overridesToInlineStyle({ radius: "10" });
    const v = style as Record<string, string>;
    expect(v["--sd-radius-sm"]).toBe("7px");
    expect(v["--sd-radius-md"]).toBe("10px");
    expect(v["--sd-radius-lg"]).toBe("13px");
    expect(v["--sd-radius-xl"]).toBe("17px");
  });

  it("overridesToInlineStyle maps brand to brand var", () => {
    const style = overridesToInlineStyle({ brand: "#0d9488" });
    const v = style as Record<string, string>;
    expect(v["--sd-brand"]).toBe("#0d9488");
  });

  it("OVERRIDE_TO_VAR contains all ThemeOverrides keys", () => {
    const keys = Object.keys(OVERRIDE_TO_VAR) as (keyof ThemeOverrides)[];
    expect(keys).toContain("brand");
    expect(keys).toContain("brand-foreground");
    expect(keys).toContain("radius");
    expect(keys).toContain("font-size-base");
    expect(keys).toContain("theme-mode");
  });
});

describe("ThemeCustomizer exports", () => {
  it("is defined as a function", () => {
    expect(typeof ThemeCustomizer).toBe("function");
  });

  it("component name matches", () => {
    expect(ThemeCustomizer.name).toBe("ThemeCustomizer");
  });
});
