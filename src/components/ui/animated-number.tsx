import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * AnimatedNumber - number with a count-up animation from the previous
 * value to the target.
 *
 * - requestAnimationFrame loop with easeOutCubic easing.
 * - Honors `prefers-reduced-motion` (snap immediately, skip animation).
 * - Skips the animation when the tab is hidden (Page Visibility API).
 * - Output is formatted with `Intl.NumberFormat` for locale `id-ID`:
 *     - "number"  -> "1.234.567"
 *     - "currency"/"rupiah" -> "Rp 1.234.567" (currency IDR)
 *     - "percent" -> "12,5%"
 *
 * Example:
 *   <AnimatedNumber value={15000} />
 *   <AnimatedNumber value={1250000} format="rupiah" />
 *   <AnimatedNumber value={42} format="percent" decimals={0} suffix=" users" />
 */
export interface AnimatedNumberProps {
  /** Target value. The animation counts up from the previous value. */
  value: number;
  /** Animation duration in milliseconds (default 1000). */
  duration?: number;
  /** Number of decimal digits (default 0). */
  decimals?: number;
  /** Prefix added before the number (e.g. "+" for positive deltas). */
  prefix?: string;
  /** Suffix added after the number (e.g. " users", " views"). */
  suffix?: string;
  /** Output format. Default "number". */
  format?: "number" | "currency" | "rupiah" | "percent";
  /** Additional className. */
  className?: string;
  /** Called once when the animation starts. */
  onStart?: () => void;
  /** Called when the animation ends (or when snapped for reduced motion). */
  onEnd?: () => void;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function formatValue(
  value: number,
  format: NonNullable<AnimatedNumberProps["format"]>,
  decimals: number
): string {
  switch (format) {
    case "currency":
    case "rupiah":
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
    case "percent":
      return new Intl.NumberFormat("id-ID", {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
    case "number":
    default:
      return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
  }
}

export function AnimatedNumber({
  value,
  duration = 1000,
  decimals = 0,
  prefix,
  suffix,
  format = "number",
  className,
  onStart,
  onEnd,
}: AnimatedNumberProps) {
  const [display, setDisplay] = React.useState(value);
  const reducedMotionRef = React.useRef(false);
  const startValueRef = React.useRef(value);
  const startTimeRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const triggeredStartRef = React.useRef(false);

  // Detect prefers-reduced-motion. Run once because the preference
  // rarely changes during a component's lifetime.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  React.useEffect(() => {
    // Reduced motion: snap immediately.
    if (reducedMotionRef.current) {
      setDisplay(value);
      onEnd?.();
      return;
    }

    // Hidden tab: skip the animation.
    if (typeof document !== "undefined" && document.hidden) {
      setDisplay(value);
      return;
    }

    if (!triggeredStartRef.current) {
      triggeredStartRef.current = true;
      onStart?.();
    }

    startValueRef.current = display;
    startTimeRef.current = null;

    const tick = (now: number) => {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const current =
        startValueRef.current + (value - startValueRef.current) * eased;
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
        rafRef.current = null;
        onEnd?.();
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    // Pause when the tab is hidden, resume when visible.
    const handleVisibility = () => {
      if (document.hidden) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else {
        // Resume from the current display value.
        startValueRef.current = display;
        startTimeRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // `display` is in deps so the visibility handler always reads the latest value.
  }, [value, duration, onStart, onEnd]);

  return (
    <span
      className={cn("tabular-nums", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      {prefix}
      {formatValue(display, format, decimals)}
      {suffix}
    </span>
  );
}
