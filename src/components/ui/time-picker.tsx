import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * TimePicker - iOS-style spinner for picking hours and minutes.
 *
 * - Two columns (hours 00-23, minutes 00-59 step N) with scroll-snap.
 * - The middle item is automatically highlighted.
 * - Clicking inside a column focuses it; arrow keys navigate.
 * - Solid tones only (no gradients).
 *
 * Example:
 *   <TimePicker
 *     value={{ hours: 14, minutes: 30 }}
 *     onChange={(t) => console.log(t)}
 *     minuteStep={5}
 *   />
 */

const ITEM_HEIGHT = 36;
const VISIBLE = 5;
const PAD = Math.floor(VISIBLE / 2) * ITEM_HEIGHT;

export interface ScrollPickerProps<T extends string | number> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  format: (value: T) => string;
  ariaLabel: string;
  disabled?: boolean;
}

export function ScrollPicker<T extends string | number>({
  options,
  value,
  onChange,
  format,
  ariaLabel,
  disabled = false,
}: ScrollPickerProps<T>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const lastCommitted = React.useRef<T>(value);
  const suppressNextScroll = React.useRef(false);

  // Sync external value changes to the scroll position.
  React.useEffect(() => {
    if (!ref.current) return;
    const idx = options.indexOf(value);
    if (idx < 0) return;
    suppressNextScroll.current = true;
    ref.current.scrollTop = idx * ITEM_HEIGHT;
    lastCommitted.current = value;
  }, [value, options]);

  // Commit the scroll position when the user stops scrolling.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      if (suppressNextScroll.current) {
        suppressNextScroll.current = false;
        return;
      }
      const top = el.scrollTop;
      const idx = Math.round(top / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(options.length - 1, idx));
      const v = options[clamped];
      if (v !== lastCommitted.current) {
        lastCommitted.current = v;
        onChange(v);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [options, onChange]);

  // Keyboard navigation.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const idx = options.indexOf(value);
    if (idx < 0) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = options[Math.max(0, idx - 1)];
      if (next !== value) onChange(next);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = options[Math.min(options.length - 1, idx + 1)];
      if (next !== value) onChange(next);
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange(options[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange(options[options.length - 1]);
    }
  };

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-md bg-muted"
        style={{ height: ITEM_HEIGHT }}
      />
      <div
        ref={ref}
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={onKeyDown}
        className="h-full overflow-y-auto snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div style={{ height: PAD }} aria-hidden />
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <div
              key={String(opt)}
              role="option"
              aria-selected={selected}
              className={cn(
                "flex items-center justify-center snap-center transition-colors",
                selected
                  ? "text-base font-semibold text-foreground"
                  : "text-sm text-muted-foreground/40"
              )}
              style={{ height: ITEM_HEIGHT }}
            >
              {format(opt)}
            </div>
          );
        })}
        <div style={{ height: PAD }} aria-hidden />
      </div>
    </div>
  );
}

export interface TimePickerProps {
  /** Controlled value. */
  value?: { hours: number; minutes: number };
  /** Default value for uncontrolled mode. */
  defaultValue?: { hours: number; minutes: number };
  /** Called whenever the time changes. */
  onChange?: (time: { hours: number; minutes: number }) => void;
  /** Minute step (default 1; 5 or 15 are common for simpler UIs). */
  minuteStep?: number;
  /** Format hour (default 2 digit "HH"). */
  formatHour?: (h: number) => string;
  /** Format minute (default 2 digit "MM"). */
  formatMinute?: (m: number) => string;
  /** Disable picker. */
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  value,
  defaultValue,
  onChange,
  minuteStep = 1,
  formatHour,
  formatMinute,
  disabled = false,
  className,
}: TimePickerProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<{ hours: number; minutes: number }>(
    defaultValue ?? { hours: 12, minutes: 0 }
  );
  const current = isControlled ? value! : internal;

  const update = (next: { hours: number; minutes: number }) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const hours = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => i),
    []
  );
  const minutes = React.useMemo(() => {
    const out: number[] = [];
    for (let m = 0; m < 60; m += minuteStep) out.push(m);
    return out;
  }, [minuteStep]);

  // Snap the minute value to the step when defaultValue is given.
  React.useEffect(() => {
    if (isControlled) return;
    if (internal.minutes % minuteStep === 0) return;
    const snapped = Math.round(internal.minutes / minuteStep) * minuteStep;
    setInternal({ ...internal, minutes: snapped });
  }, [minuteStep]);

  const fmtH = formatHour ?? ((h: number) => h.toString().padStart(2, "0"));
  const fmtM = formatMinute ?? ((m: number) => m.toString().padStart(2, "0"));

  return (
    <div
      role="group"
      aria-label="Time picker"
      className={cn(
        "flex items-center justify-center gap-3 px-3",
        className
      )}
      style={{ height: ITEM_HEIGHT * VISIBLE }}
    >
      <div className="h-full w-16">
        <ScrollPicker
          options={hours}
          value={current.hours}
          onChange={(h) => update({ ...current, hours: h })}
          format={fmtH}
          ariaLabel="Hours"
          disabled={disabled}
        />
      </div>
      <span
        aria-hidden
        className="select-none text-2xl font-semibold text-foreground"
      >
        :
      </span>
      <div className="h-full w-16">
        <ScrollPicker
          options={minutes}
          value={current.minutes}
          onChange={(m) => update({ ...current, minutes: m })}
          format={fmtM}
          ariaLabel="Minutes"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
