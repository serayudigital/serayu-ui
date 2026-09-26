import * as React from "react";
import { Palette, RotateCcw, Save, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import {
  THEME_PRESETS,
  DEFAULT_THEME,
  applyDocumentOverrides,
  clearDocumentOverrides,
  overridesKey,
  type ThemePreset,
  type ThemeOverrides,
} from "@/lib/theme-presets";
import { overridesToInlineStyle } from "@/lib/theme-presets";

/**
 * ThemeCustomizer - UI panel to tweak sd- tokens (brand color,
 * radius, font-size) in real-time with live preview.
 *
 * Scope mode:
 *   - 'container' (default): override applied to the container scope
 *     via inline style. Safe to embed in another app, won't clobber
 *     the document.
 *   - 'document': inject into :root. Only for internal demos. Caller
 *     must confirm with the user.
 *
 * Presets are saved to localStorage key 'sd-theme-overrides' (JSON).
 *
 * Example:
 *   const [overrides, setOverrides] = React.useState<ThemeOverrides>(DEFAULT_THEME);
 *   <ThemeCustomizer value={overrides} onChange={setOverrides} />
 */

export type ThemeCustomizerScope = "document" | "container";

const STORAGE_KEY = "sd-theme-overrides";

export interface ThemeCustomizerProps {
  /** Override value (controlled). */
  value: ThemeOverrides;
  /** Handler when overrides change. */
  onChange: (next: ThemeOverrides) => void;
  /** Preset list. Default THEME_PRESETS. */
  presets?: ThemePreset[];
  /** Override scope. Default 'container' (safe). */
  scope?: ThemeCustomizerScope;
  /** ClassName for the preview container. */
  containerClassName?: string;
  /** ClassName for the panel wrapper. */
  className?: string;
  /** Show save button. Default true. */
  showSave?: boolean;
}

export function ThemeCustomizer({
  value,
  onChange,
  presets = THEME_PRESETS,
  scope = "container",
  containerClassName,
  className,
  showSave = true,
}: ThemeCustomizerProps) {
  const updateField = <K extends keyof ThemeOverrides>(
    key: K,
    val: ThemeOverrides[K]
  ) => {
    onChange({ ...value, [key]: val });
  };

  const resetAll = () => onChange({ ...DEFAULT_THEME });
  const applyPreset = (p: ThemePreset) => onChange({ ...p.overrides });

  // Document scope: sync to :root when value changes.
  React.useEffect(() => {
    if (scope !== "document") return;
    applyDocumentOverrides(value);
    return () => {
      // cleanup on unmount
      clearDocumentOverrides();
    };
  }, [scope, overridesKey(value)]);

  const handleSave = () => {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* storage full / off */
    }
  };

  const containerStyle =
    scope === "container" ? overridesToInlineStyle(value) : undefined;

  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[1fr_360px]",
        className
      )}
    >
      {/* Preview pane (left). */}
      <div
        className={cn(
          "rounded-lg border border-border p-6",
          scope === "container" && "bg-surface text-foreground",
          containerClassName
        )}
        style={containerStyle}
        data-theme={
          scope === "container" ? value["theme-mode"] : undefined
        }
      >
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold">Preview</h3>
        </div>
        <PreviewPane />
      </div>

      {/* Control panel (right). */}
      <div className="space-y-4 rounded-lg border border-border bg-surface p-4">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preset
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => {
              const isActive = overridesKey(value) === overridesKey(p.overrides);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-md border p-2 text-left text-xs sd-tap transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "border-brand bg-brand/10 text-foreground"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-3 w-3 rounded-full border border-border"
                      style={{ backgroundColor: p.overrides.brand }}
                      aria-hidden
                    />
                    <span className="font-medium">{p.label}</span>
                  </span>
                  {p.description && (
                    <span className="text-[10px] leading-tight text-muted-foreground">
                      {p.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Warna brand
          </h4>
          <ColorField
            label="Brand"
            value={value.brand ?? "#0064f0"}
            onChange={(v) => updateField("brand", v)}
          />
          <ColorField
            label="Foreground"
            value={value["brand-foreground"] ?? "#ffffff"}
            onChange={(v) => updateField("brand-foreground", v)}
          />
        </div>

        <RangeField
          label="Radius"
          unit="px"
          min={0}
          max={24}
          value={parseInt(value.radius ?? "12", 10)}
          onChange={(v) => updateField("radius", String(v))}
        />
        <RangeField
          label="Font size"
          unit="px"
          min={12}
          max={20}
          value={parseInt(value["font-size-base"] ?? "16", 10)}
          onChange={(v) => updateField("font-size-base", String(v))}
        />

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tema
          </h4>
          <div className="grid grid-cols-3 gap-1">
            <ThemeModeButton
              label="Light"
              icon={Sun}
              active={value["theme-mode"] === "light"}
              onClick={() => updateField("theme-mode", "light")}
            />
            <ThemeModeButton
              label="Dark"
              icon={Moon}
              active={value["theme-mode"] === "dark"}
              onClick={() => updateField("theme-mode", "dark")}
            />
            <ThemeModeButton
              label="System"
              icon={Monitor}
              active={value["theme-mode"] === "system" || !value["theme-mode"]}
              onClick={() => updateField("theme-mode", "system")}
            />
          </div>
        </div>

        <div className="flex gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetAll}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Reset
          </Button>
          {showSave && (
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              leftIcon={<Save className="h-3.5 w-3.5" />}
              className="ml-auto"
            >
              Save
            </Button>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Scope: <span className="font-mono">{scope}</span>. Disimpan di
          localStorage ({STORAGE_KEY}).
        </p>
      </div>
    </div>
  );
}

/* ============================================================
 * SUB-COMPONENTS
 * ============================================================ */

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="mb-2 flex items-center gap-2 text-xs">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-7 shrink-0 cursor-pointer rounded border border-border bg-background"
        aria-label={`Select ${label.toLowerCase()}`}
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputSize="sm"
        className="flex-1 font-mono text-xs"
        aria-label={`Hex ${label.toLowerCase()}`}
      />
    </label>
  );
}

function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit?: string;
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 flex items-center justify-between text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-foreground">
          {value}
          {unit ?? ""}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-brand"
        aria-label={label}
      />
    </label>
  );
}

function ThemeModeButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-md border text-xs sd-tap transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-border text-muted-foreground hover:bg-muted"
      )}
      aria-pressed={active}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function PreviewPane() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-background p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Button
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
        </div>
      </div>
      <div className="rounded-md border border-border bg-background p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Card + ring
        </p>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-brand" aria-hidden />
          <div className="flex-1">
            <p className="text-sm font-medium">Item preview</p>
            <p className="text-xs text-muted-foreground">Short subtitle</p>
          </div>
          <Button size="sm">Action</Button>
        </div>
      </div>
      <div className="rounded-md border border-border bg-background p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Text
        </p>
        <p className="text-sm">
          Example paragraph showing the active typography. Color, size,
          and radius change when you tweak a preset in the right panel.
        </p>
      </div>
    </div>
  );
}
