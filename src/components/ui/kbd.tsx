import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Kbd - keyboard shortcut badge. Decorative inline element meant to
 * render inside text or trigger copy ("Press Ctrl + K to open"). Not
 * interactive on its own.
 */

const kbdVariants = cva(
  "inline-flex h-6 min-w-[1.5rem] select-none items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        muted: "bg-transparent border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface KbdProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children">,
    VariantProps<typeof kbdVariants> {
  /**
   * Keyboard label. Use a single character for letter keys
   * ("K"), a symbol for special keys ("Enter", "Ctrl"), or an array
   * to render a chord such as ["Ctrl", "K"] with implicit separators.
   */
  children?: React.ReactNode;
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, children, ...props }, ref) => {
    const rendered = Array.isArray(children) ? (
      <span className="inline-flex items-center gap-1">
        {children.map((child, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span aria-hidden className="text-muted-foreground/60">
                +
              </span>
            )}
            {child}
          </React.Fragment>
        ))}
      </span>
    ) : (
      children
    );
    return (
      <kbd
        ref={ref}
        className={cn(kbdVariants({ variant }), className)}
        {...props}
      >
        {rendered}
      </kbd>
    );
  }
);
Kbd.displayName = "Kbd";

export { Kbd, kbdVariants };
