import * as React from "react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon (e.g. a lucide component). */
  icon?: React.ReactNode;
  /** Primary title. */
  title: string;
  /** Additional description. */
  description?: string;
  /** CTA or action (e.g. Button or link). */
  action?: React.ReactNode;
}

/**
 * EmptyState - informative empty state.
 * Content is centered, with safe padding for short content.
 */
function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground"
          aria-hidden
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { EmptyState };
