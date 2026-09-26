import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Progress - linear or circular indicator (0-100).
 *
 * - Linear: track bg-muted, bar bg-brand (solid, NOT gradient).
 * - Circular: SVG with stroke-dashoffset animation.
 * - Indeterminate: solid bar that traverses (linear) or stroke
 *   animation (circular).
 *
 * Example:
 *   <Progress value={60} />
 *   <Progress variant="circular" value={75} />
 *   <Progress indeterminate />
 */

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof progressVariants> {
  /** 0 - 100. */
  value?: number;
  /** Mode indeterminate (animation loop, ignore value). */
  indeterminate?: boolean;
  /** Hidden label for screen reader. */
  label?: string;
  /** Display value as text (default false). */
  showValue?: boolean;
}

const progressVariants = cva("relative", {
  variants: {
    variant: {
      linear: "",
      circular: "inline-flex items-center justify-center",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  compoundVariants: [
    { variant: "linear", size: "sm", className: "h-1.5" },
    { variant: "linear", size: "md", className: "h-2" },
    { variant: "linear", size: "lg", className: "h-3" },
    { variant: "circular", size: "sm", className: "h-8 w-8" },
    { variant: "circular", size: "md", className: "h-12 w-12" },
    { variant: "circular", size: "lg", className: "h-16 w-16" },
  ],
  defaultVariants: {
    variant: "linear",
    size: "md",
  },
});

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      variant,
      size,
      value = 0,
      indeterminate,
      label = "Progress",
      showValue = false,
      ...props
    },
    ref
  ) => {
    const safeValue = Math.max(0, Math.min(100, value));
    const ariaProps = indeterminate
      ? { "aria-busy": true, "aria-valuetext": "Loading" }
      : {
          role: "progressbar" as const,
          "aria-valuenow": safeValue,
          "aria-valuemin": 0,
          "aria-valuemax": 100,
        };

    if (variant === "circular") {
      return (
        <div
          ref={ref}
          className={cn(progressVariants({ variant, size }), className)}
          aria-label={label}
          {...ariaProps}
          {...props}
        >
          <CircularProgress
            size={size ?? "md"}
            value={safeValue}
            indeterminate={indeterminate}
          />
          {showValue && !indeterminate && (
            <span className="absolute text-[10px] font-semibold tabular-nums text-foreground">
              {safeValue}%
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          progressVariants({ variant, size }),
          className
        )}
        aria-label={label}
        {...ariaProps}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full bg-brand",
            indeterminate &&
              "w-1/3 animate-[sd-progress-indeterminate_1.4s_ease-in-out_infinite]"
          )}
          style={
            indeterminate
              ? undefined
              : { width: `${safeValue}%`, transition: "width 200ms cubic-bezier(0.2,0,0,1)" }
          }
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

const CIRCULAR_SIZES = { sm: 32, md: 48, lg: 64 } as const;
const CIRCULAR_STROKE = { sm: 3, md: 4, lg: 5 } as const;

function CircularProgress({
  size,
  value,
  indeterminate,
}: {
  size: "sm" | "md" | "lg";
  value: number;
  indeterminate?: boolean;
}) {
  const dim = CIRCULAR_SIZES[size];
  const stroke = CIRCULAR_STROKE[size];
  const r = (dim - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      className={indeterminate ? "animate-spin" : undefined}
      aria-hidden
    >
      <circle
        cx={dim / 2}
        cy={dim / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-muted"
      />
      <circle
        cx={dim / 2}
        cy={dim / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={indeterminate ? undefined : offset}
        transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
        className={cn(
          "text-brand transition-[stroke-dashoffset]",
          indeterminate &&
            "[stroke-dasharray:1,200] animate-[sd-progress-circular_1.4s_ease-in-out_infinite]"
        )}
      />
    </svg>
  );
}

export { Progress };
