import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export interface MobileHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  /** Left slot (e.g. menu or back button). */
  left?: React.ReactNode;
  /** Right slot (e.g. actions / icon button). */
  right?: React.ReactNode;
  /** Show an automatic back button in the left slot. */
  back?: boolean;
  /** Back button handler (default: history.back). */
  onBack?: () => void;
  /** Solid bottom border. Default: true. */
  bordered?: boolean;
  /** Additional content under the title (e.g. subtitle). */
  subtitle?: React.ReactNode;
  /** Apply safe-area-top padding. Default: true. */
  safeTop?: boolean;
  /** Sticky to top. Default: true. */
  sticky?: boolean;
}

/**
 * MobileHeader - sticky header in the style of mobile apps.
 * 3-slot layout: left (44px) | center (flex-1) | right (44px).
 * Consistent 56 px height (above the safe area).
 */
const MobileHeader = React.forwardRef<HTMLElement, MobileHeaderProps>(
  (
    {
      className,
      title,
      left,
      right,
      back,
      onBack,
      bordered = true,
      subtitle,
      safeTop = true,
      sticky = true,
      children,
      ...props
    },
    ref
  ) => {
    const handleBack = () => {
      if (onBack) onBack();
      else if (typeof window !== "undefined") window.history.back();
    };
    return (
      <header
        ref={ref}
        className={cn(
          "z-[var(--sd-z-sticky)] bg-background/95 backdrop-blur",
          sticky && "sticky top-0",
          bordered && "border-b border-border",
          safeTop && "sd-safe-pt",
          className
        )}
        {...props}
      >
        <div className="flex h-14 items-center justify-between gap-2 px-2">
          <div className="flex min-w-[44px] items-center justify-start">
            {back ? (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Back"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground sd-tap transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              left
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center text-center">
            {title && (
              <span className="truncate text-base font-semibold text-foreground">
                {title}
              </span>
            )}
            {subtitle && (
              <span className="truncate text-xs text-muted-foreground">
                {subtitle}
              </span>
            )}
          </div>
          <div className="flex min-w-[44px] items-center justify-end gap-1">
            {right}
          </div>
        </div>
        {children}
      </header>
    );
  }
);
MobileHeader.displayName = "MobileHeader";

export { MobileHeader };
