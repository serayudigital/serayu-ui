import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * SegmentedControl - mutually exclusive button group (single select).
 * Wraps Radix ToggleGroup (type="single").
 *
 * - Solid indicator (bg-background) jumps via layout transition.
 * - Tokens: track bg-muted, indicator bg-background (solid, no gradient).
 * - Minimum 44px tap target at size md and up.
 *
 * Example:
 *   <SegmentedControl
 *     items={[
 *       { value: "week", label: "Week" },
 *       { value: "month", label: "Month" },
 *       { value: "year", label: "Year" },
 *     ]}
 *     value={period}
 *     onValueChange={setPeriod}
 *   />
 */

export interface SegmentedControlItem {
  value: string;
  label: React.ReactNode;
  /** Optional icon on the left of the label. */
  icon?: React.ReactNode;
  /** Disable one of the items. */
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
      "type" | "value" | "defaultValue" | "onValueChange"
    >,
    VariantProps<typeof segmentedControlVariants> {
  items: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Full width following parent (default false). */
  fullWidth?: boolean;
  /** Aria-label required for a11y when there is no visual label. */
  "aria-label": string;
}

const segmentedControlVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-md bg-muted p-1 text-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-9 text-xs",
        md: "h-11 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const itemVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 font-medium sd-tap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
  {
    variants: {
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const SegmentedControl = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  SegmentedControlProps
>(
  (
    {
      className,
      size,
      items,
      value,
      defaultValue,
      onValueChange,
      fullWidth,
      ...props
    },
    ref
  ) => {
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="single"
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => {
          if (v && onValueChange) onValueChange(v);
        }}
        className={cn(
          segmentedControlVariants({ size }),
          fullWidth && "flex w-full",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <ToggleGroupPrimitive.Item
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            aria-label={typeof item.label === "string" ? item.label : item.value}
            className={cn(
              itemVariants({ size }),
              fullWidth && "flex-1"
            )}
          >
            {item.icon}
            {item.label}
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl };
