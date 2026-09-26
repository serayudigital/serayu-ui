import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, type ThemePreference } from "@/hooks/use-theme";
import { cn } from "@/lib/cn";

export interface ThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Whether to show the third "system" option. Default: true. */
  showSystem?: boolean;
  /** Label for screen readers. */
  ariaLabel?: string;
}

/**
 * ThemeToggle - theme toggle with 2 or 3 states (light/dark/system).
 * Client-side only. Wrap with a mounting boundary if needed.
 */
const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, showSystem = true, ariaLabel, ...props }, ref) => {
    const { preference, resolved, setPreference } = useTheme();

    const cycle: ThemePreference[] = showSystem
      ? ["light", "dark", "system"]
      : ["light", "dark"];

    const getNext = (): ThemePreference => {
      const idx = cycle.indexOf(preference);
      return cycle[(idx + 1) % cycle.length];
    };

    const Icon =
      preference === "system" ? Monitor : resolved === "dark" ? Moon : Sun;

    const labelText =
      preference === "system"
        ? "Follow system"
        : resolved === "dark"
        ? "Dark mode"
        : "Light mode";

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel ?? `Theme: ${labelText}. Click to switch.`}
        title={`Current theme: ${labelText}`}
        onClick={() => setPreference(getNext())}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-transparent text-foreground sd-tap transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
        {...props}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </button>
    );
  }
);
ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
