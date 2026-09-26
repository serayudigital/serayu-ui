import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Rating - star value input (0 - max).
 *
 * - Default icon: lucide Star (can be replaced via children).
 * - Hover preview when interactive (mouse + keyboard focus).
 * - Keyboard: ArrowRight/Left to adjust value, Home/End for
 *   min/max. allowInInputs is not relevant (focus target is the button).
 *
 * Example:
 *   <Rating value={4} onValueChange={setValue} />
 *   <Rating value={3.5} allowHalf readOnly />
 */

export interface RatingProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue" | "children"
  > {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Maximum value (default 5). */
  max?: number;
  /** Allow half values (default false). */
  allowHalf?: boolean;
  /** Read-only mode (default false). */
  readOnly?: boolean;
  /** Visual size (default "md"). */
  size?: "sm" | "md" | "lg";
  /** Custom icon; receives (filled, half) for flexibility. */
  children?: (state: { filled: boolean; half: boolean }) => React.ReactNode;
}

const SIZE_PX: Record<NonNullable<RatingProps["size"]>, number> = {
  sm: 16,
  md: 20,
  lg: 28,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function Rating({
  className,
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  allowHalf = false,
  readOnly = false,
  size = "md",
  children,
  ...props
}: RatingProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const [hover, setHover] = React.useState<number | null>(null);
  const active = isControlled ? (value ?? 0) : internal;
  const display = hover ?? active;
  const px = SIZE_PX[size];

  const step = allowHalf ? 0.5 : 1;

  const handleClick = (n: number) => {
    if (readOnly) return;
    const next = clamp(n, 0, max);
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      handleClick(active + step);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      handleClick(active - step);
    } else if (e.key === "Home") {
      e.preventDefault();
      handleClick(0);
    } else if (e.key === "End") {
      e.preventDefault();
      handleClick(max);
    }
  };

  return (
    <div
      role="slider"
      tabIndex={readOnly ? -1 : 0}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={active}
      aria-valuetext={`${active} of ${max}`}
      aria-readonly={readOnly || undefined}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHover(null)}
      className={cn("inline-flex items-center gap-0.5", className)}
      {...props}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = display > i;
        const half = !filled && display > i + 0.5;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            tabIndex={-1}
            onMouseEnter={() => setHover(i + 1)}
            onClick={() => handleClick(i + 1)}
            className={cn(
              "inline-flex shrink-0 items-center justify-center sd-tap transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
              readOnly ? "cursor-default" : "cursor-pointer"
            )}
            aria-label={`${i + 1} of ${max} stars`}
          >
            {children ? (
              children({ filled, half })
            ) : (
              <Star
                width={px}
                height={px}
                className={cn(
                  "transition-colors",
                  filled
                    ? "fill-warning stroke-warning"
                    : half
                      ? "fill-warning/50 stroke-warning"
                      : "stroke-muted-foreground"
                )}
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { Rating };
