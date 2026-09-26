import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Skeleton - loading placeholder.
 * Pulse animation via opacity (NOT a gradient).
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-hidden
      {...props}
    />
  );
}

export { Skeleton };
