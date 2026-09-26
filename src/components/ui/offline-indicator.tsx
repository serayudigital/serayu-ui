import * as React from "react";
import { WifiOff } from "lucide-react";
import { cn } from "@/lib/cn";

export interface OfflineIndicatorProps {
  /** Message displayed (default "You are offline"). */
  message?: React.ReactNode;
  /** Delay showing for N ms after the offline event (default 500). */
  delay?: number;
  /** Auto-hide when returning online (default true). */
  autoHide?: boolean;
  /** Force visible regardless (for demo). */
  forceVisible?: boolean;
  className?: string;
}

/**
 * OfflineIndicator - small badge that appears at the bottom center when
 * the connection is lost.
 *
 * - Listens to `online` and `offline` events on window.
 * - Delays showing by 500 ms to avoid flicker during brief transitions.
 * - Warning tone (offline is not an error).
 * - Tap target removed because it is read-only, but keeps a 44 px area for
 *   reading consistency.
 *
 * Example:
 *   <OfflineIndicator />
 *   <OfflineIndicator message="No connection" delay={1000} />
 */
export function OfflineIndicator({
  message = "You are offline",
  delay = 500,
  autoHide = true,
  forceVisible = false,
  className,
}: OfflineIndicatorProps) {
  const [online, setOnline] = React.useState<boolean>(
    () => (typeof navigator !== "undefined" ? navigator.onLine : true)
  );
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef<number | undefined>(undefined);

  const clearTimer = () => {
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const onOnline = () => {
      setOnline(true);
      clearTimer();
      if (autoHide) setVisible(false);
    };

    const onOffline = () => {
      setOnline(false);
      clearTimer();
      timeoutRef.current = window.setTimeout(() => setVisible(true), delay);
    };

    // Sync with initial state.
    if (!navigator.onLine) onOffline();
    else {
      setOnline(true);
      setVisible(false);
    }

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      clearTimer();
    };
  }, [delay, autoHide]);

  if ((online && !forceVisible) || (!visible && !forceVisible)) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "fixed bottom-4 left-1/2 z-[var(--sd-z-sticky)] flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-warning/30 bg-warning px-3.5 py-1.5 text-xs font-medium text-warning-foreground shadow-md",
        "animate-[sd-overlay-show_var(--sd-duration-enter)_var(--sd-easing-standard)]",
        className
      )}
    >
      <WifiOff className="h-3.5 w-3.5" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
