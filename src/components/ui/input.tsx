import * as React from "react";
import { cn } from "@/lib/cn";

export type InputSize = "sm" | "md" | "lg";

const sizeMap: Record<InputSize, string> = {
  sm: "h-9 text-sm",
  md: "h-11 text-sm",
  lg: "h-12 text-base",
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: InputSize;
  invalid?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

/**
 * Input - text input field with left/right slots and invalid state.
 * Inline wrapper for slots. Use className on the child if more specific
 * layout is needed.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", inputSize = "md", invalid, leftSlot, rightSlot, ...props },
    ref
  ) => {
    if (leftSlot || rightSlot) {
      return (
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border bg-transparent px-3 transition-colors",
            "border-input focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
            invalid && "border-danger focus-within:border-danger focus-within:ring-danger",
            sizeMap[inputSize],
            className
          )}
        >
          {leftSlot && (
            <span className="shrink-0 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
              {leftSlot}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            aria-invalid={invalid || undefined}
            className="h-full w-full min-w-0 flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          />
          {rightSlot && (
            <span className="shrink-0 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
              {rightSlot}
            </span>
          )}
        </div>
      );
    }
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex w-full rounded-md border border-input bg-transparent px-3 text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          sizeMap[inputSize],
          invalid && "border-danger focus-visible:border-danger focus-visible:ring-danger",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
