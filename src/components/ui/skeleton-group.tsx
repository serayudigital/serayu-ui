import * as React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/cn";

/**
 * SkeletonGroup - preset skeleton layout for loading state.
 *
 * Supported patterns:
 *   - "profile": avatar + 2 lines of text.
 *   - "list":    1 main line + meta line (for list items).
 *   - "card":    block + title + description.
 *   - "feed":    small avatar + 2 lines (for comments / notifications).
 *
 * count = N renders N preset instances (for list loading).
 *
 * Example:
 *   <SkeletonGroup pattern="list" count={5} />
 *   <SkeletonGroup pattern="profile" />
 */

export interface SkeletonGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  pattern?: "profile" | "list" | "card" | "feed";
  /** Number of instances rendered (default 1). */
  count?: number;
  /** Show wrapper padding (default true). */
  padded?: boolean;
}

const SkeletonGroup = React.forwardRef<HTMLDivElement, SkeletonGroupProps>(
  (
    { className, pattern = "list", count = 1, padded = true, ...props },
    ref
  ) => {
    const instances = Array.from({ length: count }, (_, i) => i);
    return (
      <div
        ref={ref}
        className={cn(
          padded && "space-y-3",
          count > 1 && "flex flex-col gap-3",
          className
        )}
        {...props}
      >
        {instances.map((i) => (
          <PatternInstance key={i} pattern={pattern} />
        ))}
      </div>
    );
  }
);
SkeletonGroup.displayName = "SkeletonGroup";

function PatternInstance({ pattern }: { pattern: NonNullable<SkeletonGroupProps["pattern"]> }) {
  if (pattern === "profile") {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }
  if (pattern === "feed") {
    return (
      <div className="flex items-start gap-3">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    );
  }
  if (pattern === "card") {
    return (
      <div className="space-y-3 rounded-lg border border-border p-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    );
  }
  // list
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export { SkeletonGroup };
