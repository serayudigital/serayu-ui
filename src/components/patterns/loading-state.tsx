import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export interface LoadingStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional label below the spinner. */
  label?: string;
  /** Spinner size. Default: md. */
  size?: "sm" | "md" | "lg";
  /** Fill the container with centered flex content. Default: true. */
  fullscreen?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

/**
 * LoadingState - spinner + label, in the style of a mobile app.
 */
function LoadingState({
  className,
  label = "Loading...",
  size = "md",
  fullscreen = true,
  ...props
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2 text-sm text-muted-foreground",
        fullscreen
          ? "min-h-[200px] flex-col"
          : "min-h-[80px]",
        className
      )}
      {...props}
    >
      <Loader2
        className={cn("animate-spin text-brand", sizeMap[size])}
        aria-hidden
      />
      {label && <span>{label}</span>}
    </div>
  );
}

export { LoadingState };
