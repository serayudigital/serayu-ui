import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Chip - interactive label similar to Badge with removable capability
 * and selected state (for multi-select / tag picker).
 *
 * - Variants follow Badge (default, secondary, brand, etc).
 * - Renders as a button (default) or span (readOnly).
 * - Right slot for custom icon, built-in remove slot (X) when removable.
 *
 * Example:
 *   <Chip selected onRemove={() => unset()}>React</Chip>
 *   <Chip tone="success" removable readOnly>Done</Chip>
 */

const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium sd-tap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand text-brand-foreground",
        secondary:
          "border-transparent bg-surface text-surface-foreground",
        outline: "border-border bg-transparent text-foreground",
        success:
          "border-transparent bg-success text-success-foreground",
        warning:
          "border-transparent bg-warning text-warning-foreground",
        danger:
          "border-transparent bg-danger text-danger-foreground",
        info:
          "border-transparent bg-info text-info-foreground",
      },
      size: {
        sm: "h-6 px-2 text-[10px]",
        md: "h-7 px-2.5 text-xs",
        lg: "h-8 px-3 text-sm",
      },
      interactive: {
        true: "cursor-pointer hover:opacity-90",
        false: "cursor-default",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
);

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof chipVariants> {
  /** Show remove button (X) on the right. Default false. */
  removable?: boolean;
  /** Click handler for the remove button. */
  onRemove?: () => void;
  /** Selected state (for multi-select). */
  selected?: boolean;
  /** Render as non-interactive span. Default false. */
  readOnly?: boolean;
  /** Icon on the left of the label. */
  leftIcon?: React.ReactNode;
  /** Icon on the right of the label (ignored when removable). */
  rightIcon?: React.ReactNode;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      removable = false,
      onRemove,
      selected = false,
      readOnly = false,
      interactive,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = !readOnly && (onClick !== undefined || removable || interactive);
    const content = (
      <>
        {leftIcon}
        <span className="truncate">{children}</span>
        {removable && onRemove ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            disabled={disabled}
            aria-label="Remove"
            className="-mr-1 ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50"
          >
            <X className="h-3 w-3" aria-hidden />
          </button>
        ) : (
          rightIcon
        )}
      </>
    );

    const classNames = cn(
      chipVariants({
        variant,
        size,
        interactive: isInteractive || undefined,
      }),
      selected && "ring-2 ring-brand ring-offset-1 ring-offset-background",
      className
    );

    if (readOnly) {
      return (
        <span ref={ref as never} className={classNames}>
          {content}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={classNames}
        {...props}
      >
        {content}
      </button>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
