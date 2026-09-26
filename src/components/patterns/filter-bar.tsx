import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FilterBarItem {
  key: string;
  label: string;
  active?: boolean;
  /** Small badge next to the label (e.g. result count). */
  count?: number;
}

export interface FilterBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: FilterBarItem[];
  /** Called when a chip is pressed. */
  onItemClick?: (key: string) => void;
  /** Label for the "More" button at the end of the bar. */
  moreLabel?: string;
  /** Handler for the "More" button. */
  onMoreClick?: () => void;
  /** Show the "More" button. Default: true. */
  showMore?: boolean;
}

/**
 * FilterBar - horizontal scrollable row of filter chips.
 */
function FilterBar({
  className,
  items,
  onItemClick,
  moreLabel = "More",
  onMoreClick,
  showMore = true,
  ...props
}: FilterBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Filter"
      className={cn(
        "sd-snap-x flex w-full snap-x snap-mandatory gap-2 overflow-x-auto sd-hide-scrollbar",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const handle = () => {
          onItemClick?.(item.key);
        };
        return (
          <button
            key={item.key}
            type="button"
            onClick={handle}
            aria-pressed={item.active || undefined}
            className={cn(
              "inline-flex h-9 shrink-0 snap-start items-center gap-1.5 rounded-full border px-3 text-sm font-medium sd-tap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              item.active
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-transparent text-foreground hover:bg-muted"
            )}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  item.active
                    ? "bg-brand-foreground/20 text-brand-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
      {showMore && (
        <button
          type="button"
          onClick={onMoreClick}
          className="inline-flex h-9 shrink-0 snap-start items-center gap-1 rounded-full border border-border bg-transparent px-3 text-sm font-medium text-foreground sd-tap transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {moreLabel}
          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}

export { FilterBar };
