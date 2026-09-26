import * as React from "react";
import { Avatar, AvatarFallback } from "./avatar";
import { cn } from "@/lib/cn";

/**
 * AvatarGroup - group of avatars with overflow "+N" chip.
 *
 * - Variant "stack" (default) = overlap -space-x-2 with background
 *   border to separate avatars.
 * - Variant "inline" = grid with gap.
 * - max (default 4) limits the avatars shown; the rest goes into the
 *   +N chip.
 *
 * Example:
 *   <AvatarGroup
 *     avatars={[
 *       { name: "Alice", fallback: "A" },
 *       { name: "Bob", fallback: "B" },
 *       { name: "Carol", fallback: "C" },
 *     ]}
 *     max={2}
 *   />
 */

export interface AvatarGroupItem {
  name?: string;
  src?: string;
  fallback?: React.ReactNode;
}

export interface AvatarGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  avatars: AvatarGroupItem[];
  /** Maximum avatar count to display (default 4). */
  max?: number;
  /** Avatar size (match Avatar: xs, sm, md, lg, xl, 2xl). */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Stack (overlap) or inline. */
  variant?: "stack" | "inline";
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, max = 4, size = "md", variant = "stack", ...props }, ref) => {
    const visible = avatars.slice(0, max);
    const overflow = avatars.length - visible.length;
    const wrapperClass =
      variant === "stack" ? "flex -space-x-2" : "flex flex-wrap gap-2";

    return (
      <div
        ref={ref}
        className={cn(wrapperClass, className)}
        {...props}
      >
        {visible.map((item, idx) => (
          <Avatar
            key={`${item.name ?? idx}-${idx}`}
            size={size}
            className={cn(
              variant === "stack" &&
                "border-2 border-background ring-0"
            )}
            title={item.name}
          >
            {item.src ? (
              // Use a simple img to avoid depending on an Image primitive.
              <img
                src={item.src}
                alt={item.name ?? ""}
                className="aspect-square h-full w-full object-cover"
              />
            ) : null}
            <AvatarFallback>
              {item.fallback ??
                (item.name
                  ? item.name
                      .split(/\s+/)
                      .map((s) => s.charAt(0))
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "?")}
            </AvatarFallback>
          </Avatar>
        ))}
        {overflow > 0 && (
          <Avatar
            size={size}
            className={cn(
              variant === "stack" && "border-2 border-background"
            )}
            aria-label={`${overflow} more avatars`}
          >
            <AvatarFallback className="bg-muted text-muted-foreground">
              +{overflow}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
