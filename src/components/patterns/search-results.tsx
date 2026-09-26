import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/cn";
import { SkeletonGroup } from "@/components/ui/skeleton-group";
import { EmptyState } from "./empty-state";

export interface SearchResult {
  /** Unique identifier. */
  id: string;
  /** Small thumbnail on the left (img element or ReactNode). */
  thumbnail?: React.ReactNode;
  /** Primary title. */
  title: React.ReactNode;
  /** Additional description. */
  description?: React.ReactNode;
  /** Meta info (e.g. "Jakarta, 2 hours ago"). */
  meta?: React.ReactNode;
  /** URL (if the result is a link). */
  href?: string;
  /** Click handler. */
  onClick?: () => void;
}

export interface SearchResultsProps {
  results: SearchResult[];
  /** Show the loading skeleton. */
  loading?: boolean;
  /** Number of skeletons during loading (default 5). */
  skeletonCount?: number;
  /** Filter slot above the results (e.g. FilterBar). */
  filters?: React.ReactNode;
  /** Message when there are no results. */
  emptyTitle?: string;
  /** Extra message when empty. */
  emptyDescription?: string;
  /** Icon for the empty state. */
  emptyIcon?: React.ReactNode;
  className?: string;
}

/**
 * SearchResults - list of search results with filters, loading
 * skeleton, and an inline empty state.
 *
 * - Filter slot on top (compatible with the FilterBar pattern).
 * - Loading: preset skeleton list from SkeletonGroup.
 * - Item: thumbnail + title + description + meta (mobile-first layout).
 * - Tap/click fires onClick or navigates to href.
 * - Solid tone (NOT a gradient).
 *
 * Example:
 *   <SearchResults
 *     filters={<FilterBar ... />}
 *     loading={isLoading}
 *     results={items}
 *     emptyTitle="No results"
 *   />
 */
export function SearchResults({
  results,
  loading = false,
  skeletonCount = 5,
  filters,
  emptyTitle = "No results",
  emptyDescription,
  emptyIcon,
  className,
}: SearchResultsProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {filters ? <div>{filters}</div> : null}

      {loading ? (
        <SkeletonGroup pattern="list" count={skeletonCount} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={emptyIcon ?? <Inbox className="h-6 w-6" aria-hidden />}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <ul className="overflow-hidden rounded-lg border border-border bg-surface">
          {results.map((r, i) => (
            <ResultRow
              key={r.id}
              result={r}
              isLast={i === results.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ResultRow({
  result,
  isLast,
}: {
  result: SearchResult;
  isLast: boolean;
}) {
  const body = (
    <div className="flex items-center gap-3">
      {result.thumbnail ? (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
          {result.thumbnail}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">
          {result.title}
        </div>
        {result.description ? (
          <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {result.description}
          </div>
        ) : null}
        {result.meta ? (
          <div className="mt-1 text-[11px] text-muted-foreground">
            {result.meta}
          </div>
        ) : null}
      </div>
    </div>
  );

  const wrapperClass = cn(
    "block px-3 py-3 sd-tap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
    "hover:bg-muted",
    !isLast && "border-b border-border"
  );

  if (result.href) {
    return (
      <li>
        <a href={result.href} className={wrapperClass}>
          {body}
        </a>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        onClick={result.onClick}
        className={cn(wrapperClass, "w-full text-left")}
      >
        {body}
      </button>
    </li>
  );
}
