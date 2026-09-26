import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * ColorPicker - color picker tool in the Photoshop style with a spectrum box,
 * hue slider, and manual hex input.
 *
 * - Internal state: HSL (hue 0-360, saturation 0-100, lightness 0-100)
 *   plus alpha 0-1. Auto-syncs with the value prop (controlled).
 * - Spectrum box: 2D gradient white-to-color-to-black (functional
 *   spectrum, not a brand styling gradient - this exception is documented).
 * - Hue slider: full hue range via an HSL linear gradient (also a
 *   documented functional exception).
 * - Output format 'hex' (default) or 'rgba'.
 * - Presets: list of quick swatches.
 *
 * A11y: spectrum box and hue slider are buttons with an explicit role
 * and aria-valuetext. Hex input is a standard textbox.
 *
 * Example:
 *   <ColorPicker
 *     value={color}
 *     onChange={setColor}
 *     presets={["#0064f0", "#16a34a", "#dc2626"]}
 *   />
 */

export interface ColorPickerProps {
  /** Color value (hex "#0064f0" or rgba "rgba(0,100,240,1)"). */
  value: string;
  /** Called when the color changes (format matches the 'format' prop). */
  onChange: (color: string) => void;
  /** Output format. Default 'hex'. */
  format?: "hex" | "rgba";
  /** List of preset colors (hex strings). */
  presets?: string[];
  /** Disabled. */
  disabled?: boolean;
  /** Additional className. */
  className?: string;
  /** Label for screen readers (default "Select color"). */
  label?: string;
}

/* ============================================================
 * Pure helpers (testable tanpa React)
 * ============================================================ */

interface HSL {
  h: number;
  s: number;
  l: number;
  a: number;
}

/** Parse "#0064f0" or "rgba(0,100,240,1)" into HSL. Returns null if invalid. */
function parseColor(input: string): HSL | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim().toLowerCase();

  // hex
  let hex = trimmed;
  let alpha = 1;
  if (hex.startsWith("#")) hex = hex.slice(1);

  // hex with alpha ("#0064f0ff")
  if (hex.length === 8) {
    const a = parseInt(hex.slice(6, 8), 16);
    if (!Number.isNaN(a)) alpha = a / 255;
    hex = hex.slice(0, 6);
  }

  if (/^[0-9a-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    return { ...rgbToHsl(r, g, b), a: alpha };
  }

  // rgba(r,g,b,a)
  const rgbaMatch = trimmed.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/
  );
  if (rgbaMatch) {
    const r = +rgbaMatch[1] / 255;
    const g = +rgbaMatch[2] / 255;
    const b = +rgbaMatch[3] / 255;
    const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
    return { ...rgbToHsl(r, g, b), a };
  }

  return null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      default:
        h = ((r - g) / d + 4) * 60;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = ln - c / 2;
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hslToHex({ h, s, l, a }: HSL, format: "hex" | "rgba"): string {
  const { r, g, b } = hslToRgb(h, s, l);
  if (format === "rgba") {
    // ColorPicker format output (rgba string) - functional, not styling.
    // eslint-disable-next-line serayu/no-hardcoded-color
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslToCssRgb({ h, s, l }: HSL): string {
  // ColorPicker internal: hsl string for color preview. Functional.
  // eslint-disable-next-line serayu/no-hardcoded-color
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/* ============================================================
 * Component
 * ============================================================ */

const SPECTRUM_SIZE = 180;

export function ColorPicker({
  value,
  onChange,
  format = "hex",
  presets,
  disabled = false,
  className,
  label = "Select color",
}: ColorPickerProps) {
  const parsed = parseColor(value);
  const initial: HSL = parsed ?? { h: 220, s: 90, l: 50, a: 1 };
  const [hsl, setHsl] = React.useState<HSL>(initial);

  // Sync external state to internal state when the controlled value changes.
  // Use a ref to skip the first mount (state already matches).
  const lastValueRef = React.useRef(value);
  React.useEffect(() => {
    if (value === lastValueRef.current) return;
    lastValueRef.current = value;
    const next = parseColor(value);
    if (next) setHsl(next);
  }, [value]);

  // Push changes to the parent.
  const pushChange = React.useCallback(
    (next: HSL) => {
      const out = hslToHex(next, format);
      lastValueRef.current = out;
      onChange(out);
    },
    [format, onChange]
  );

  const updateHsl = React.useCallback(
    (patch: Partial<HSL>) => {
      setHsl((prev) => {
        const next = { ...prev, ...patch };
        pushChange(next);
        return next;
      });
    },
    [pushChange]
  );

  // Spectrum box dragging.
  const spectrumRef = React.useRef<HTMLDivElement>(null);
  const handleSpectrumPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = spectrumRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(SPECTRUM_SIZE, clientX - rect.left));
      const y = Math.max(0, Math.min(SPECTRUM_SIZE, clientY - rect.top));
      const s = Math.round((x / SPECTRUM_SIZE) * 100);
      // y from top=0 to bottom=SPECTRUM_SIZE: lightness 100% (top) to 0% (bottom)
      const l = Math.round(100 - (y / SPECTRUM_SIZE) * 100);
      updateHsl({ s, l });
    },
    [updateHsl]
  );

  const onSpectrumDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    handleSpectrumPointer(e.clientX, e.clientY);
  };
  const onSpectrumMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.buttons !== 1) return;
    handleSpectrumPointer(e.clientX, e.clientY);
  };

  // Hue bar dragging.
  const hueRef = React.useRef<HTMLDivElement>(null);
  const handleHuePointer = React.useCallback(
    (clientX: number) => {
      const el = hueRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const h = Math.round((x / rect.width) * 360);
      updateHsl({ h });
    },
    [updateHsl]
  );
  const onHueDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    handleHuePointer(e.clientX);
  };
  const onHueMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.buttons !== 1) return;
    handleHuePointer(e.clientX);
  };

  // Hex input manual.
  const [hexInput, setHexInput] = React.useState(value);
  React.useEffect(() => {
    setHexInput(value);
  }, [value]);
  const onHexBlur = () => {
    const parsedHex = parseColor(hexInput);
    if (parsedHex) {
      setHsl(parsedHex);
      pushChange(parsedHex);
    } else {
      setHexInput(value); // revert if invalid
    }
  };

  const hueColor = hslToCssRgb({ h: hsl.h, s: 100, l: 50, a: hsl.a });

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border border-border bg-surface p-3",
        disabled && "opacity-50",
        className
      )}
      role="group"
      aria-label={label}
    >
      {/* Spectrum box */}
      <div
        ref={spectrumRef}
        onPointerDown={onSpectrumDown}
        onPointerMove={onSpectrumMove}
        className="relative h-[180px] w-[180px] cursor-crosshair touch-none rounded-md select-none"
        role="slider"
        aria-label="Saturation and lightness"
        aria-valuetext={`Saturation ${hsl.s}%, lightness ${hsl.l}%`}
        tabIndex={disabled ? -1 : 0}
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
        }}
      >
        <div
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
          style={{
            left: `${(hsl.s / 100) * SPECTRUM_SIZE}px`,
            top: `${((100 - hsl.l) / 100) * SPECTRUM_SIZE}px`,
            backgroundColor: value,
          }}
        />
      </div>

      {/* Hue bar */}
      <div
        ref={hueRef}
        onPointerDown={onHueDown}
        onPointerMove={onHueMove}
        className="relative h-[14px] w-full cursor-pointer touch-none rounded-full select-none"
        role="slider"
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={hsl.h}
        aria-valuetext={`Hue ${hsl.h} degrees`}
        tabIndex={disabled ? -1 : 0}
        // ColorPicker needs a spectrum gradient (RGB cycle) for the visual
        // picker. Documented functional exception - outside sd- token scope
        // because the color representation is a feature, not brand theming.
        /* eslint-disable serayu/no-gradient, serayu/no-hardcoded-color */
        style={{
          background:
            "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        }}
        /* eslint-enable serayu/no-gradient, serayu/no-hardcoded-color */
      >
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
          style={{ left: `${(hsl.h / 360) * 100}%`, backgroundColor: hueColor }}
        />
      </div>

      {/* Hex input */}
      <div className="flex items-center gap-2">
        <div
          className="h-9 w-9 shrink-0 rounded-md border border-border"
          style={{ backgroundColor: value }}
          aria-hidden
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={onHexBlur}
          disabled={disabled}
          aria-label="Hex color value"
          className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="#0064f0"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Presets */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                const parsedPreset = parseColor(preset);
                if (parsedPreset) {
                  setHsl(parsedPreset);
                  pushChange(parsedPreset);
                }
              }}
              disabled={disabled}
              aria-label={`Select ${preset}`}
              className="h-7 w-7 rounded-md border border-border sd-tap transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ backgroundColor: preset }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
