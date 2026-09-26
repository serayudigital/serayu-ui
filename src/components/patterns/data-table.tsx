import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { EmptyState } from "./empty-state";
import { LoadingState } from "./loading-state";
import { Inbox } from "lucide-react";

export interface Column<T> {
  /** Unique column identifier. */
  key: string;
  /** Header label. */
  header: string;
  /** Custom render per row. */
  render?: (row: T, index: number) => React.ReactNode;
  /** Resolve string value for fallback default render. */
  accessor?: (row: T) => React.ReactNode;
  /** ClassName for cell (mobile card). */
  cellClassName?: string;
  /** Minimum cell width (desktop table only). */
  width?: string;
  /** Hide on mobile card view. */
  mobileHide?: boolean;
  /** Data type used for default sort. */
  sortAccessor?: (row: T) => string | number | Date;
  /** Whether this column is sortable (click header to toggle). Default: false. */
  sortable?: boolean;
  /** Header className. */
  headerClassName?: string;
}

export type SortDirection = "asc" | "desc";

export interface DataTableProps<T>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: Column<T>[];
  data: T[];
  /** Extract key from row. */
  keyExtractor: (row: T) => string;
  /** Mobile card content: function returning ReactNode from row. If omitted, falls back to default layout. */
  renderMobileCard?: (row: T, index: number) => React.ReactNode;
  /** Show loading state. Default: false. */
  loading?: boolean;
  /** Display when data is empty. */
  emptyState?: React.ReactNode;
  /** Click handler per row. */
  onRowClick?: (row: T) => void;
  /** Default sort when mount. */
  defaultSort?: { key: string; direction: SortDirection };
  /** Controlled sort state. */
  sort?: { key: string; direction: SortDirection } | null;
  /** Sort change callback. */
  onSortChange?: (next: { key: string; direction: SortDirection } | null) => void;
  /** Pagination: number of rows per page (default 0 = off). */
  pageSize?: number;
  /** Pagination: controlled page state. */
  page?: number;
  /** Pagination: callback when page changes. */
  onPageChange?: (page: number) => void;
  /** Pagination: label text for the row range. */
  pageLabel?: (current: number, total: number) => string;
}

/**
 * DataTable - mobile-first table rendered as one card per row on small
 * screens, and as a traditional table at >= 768 px.
 *
 * v1.3.0: add optional sort (click header) + pagination (pageSize).
 * - Sort: toggle asc/desc via header click; controlled or uncontrolled.
 * - Pagination: client-side slice via pageSize; default pageSize = 0 (off).
 * - Header click area is at least 44px (sd-tap + h-11).
 * - Reduced-motion: animations disabled.
 */
function DataTable<T>({
  columns,
  data,
  keyExtractor,
  renderMobileCard,
  loading,
  emptyState,
  onRowClick,
  defaultSort,
  sort: sortProp,
  onSortChange,
  pageSize = 0,
  page: pageProp,
  onPageChange,
  pageLabel = (c, t) => `${c} - ${t} of ${t}`,
  className,
  ...props
}: DataTableProps<T>) {
  // ===== Sort (controlled or uncontrolled) =====
  const [internalSort, setInternalSort] = React.useState<
    { key: string; direction: SortDirection } | null
  >(defaultSort ?? null);
  const sort = sortProp !== undefined ? sortProp : internalSort;
  const setSort = (next: { key: string; direction: SortDirection } | null) => {
    if (sortProp === undefined) setInternalSort(next);
    onSortChange?.(next);
  };

  const toggleSort = (key: string) => {
    if (!sort || sort.key !== key) {
      setSort({ key, direction: "asc" });
    } else if (sort.direction === "asc") {
      setSort({ key, direction: "desc" });
    } else {
      setSort(null);
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    const fn = col.sortAccessor;
    if (!fn) return data;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = fn(a);
      const vb = fn(b);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [data, sort, columns]);

  // ===== Pagination =====
  const totalItems = sortedData.length;
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;
  const [internalPage, setInternalPage] = React.useState(1);
  const currentPage = pageProp !== undefined ? pageProp : internalPage;
  const safePage = Math.max(1, Math.min(currentPage, totalPages));

  const setPage = (n: number) => {
    const clamped = Math.max(1, Math.min(n, totalPages));
    if (pageProp === undefined) setInternalPage(clamped);
    onPageChange?.(clamped);
  };

  // Reset to page 1 when data/sort changes and the current page is out of bounds.
  React.useEffect(() => {
    if (safePage !== currentPage) {
      if (pageProp === undefined) setInternalPage(safePage);
      onPageChange?.(safePage);
    }
  }, [safePage, currentPage, pageProp, onPageChange]);

  const paginatedData =
    pageSize > 0
      ? sortedData.slice((safePage - 1) * pageSize, safePage * pageSize)
      : sortedData;

  // ===== Render =====
  if (loading) {
    return (
      <div className={cn("w-full", className)} {...props}>
        <LoadingState />
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className={cn("w-full", className)} {...props}>
        {emptyState ?? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No data"
            description="No items match the current filter."
          />
        )}
      </div>
    );
  }

  const defaultRenderCell = (
    row: T,
    col: Column<T>,
    index: number
  ): React.ReactNode => {
    if (col.render) return col.render(row, index);
    if (col.accessor) return col.accessor(row);
    return String((row as Record<string, unknown>)[col.key] ?? "");
  };

  const defaultMobileCard = (row: T, index: number) => {
    const visibleCols = columns.filter((c) => !c.mobileHide);
    return (
      <div className="flex flex-col gap-1.5">
        {visibleCols.map((col) => (
          <div key={col.key} className="flex items-baseline gap-2">
            <span className="w-24 shrink-0 text-xs text-muted-foreground">
              {col.header}
            </span>
            <span className="text-sm text-foreground">
              {defaultRenderCell(row, col, index)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable) return null;
    const active = sort?.key === col.key;
    const dir = active ? sort!.direction : null;
    const Icon = dir === "desc" ? ChevronDown : ChevronUp;
    return (
      <span
        className={cn(
          "ml-1 inline-flex h-3 w-3 items-center justify-center transition-opacity",
          active ? "opacity-100" : "opacity-30"
        )}
        aria-hidden
      >
        <Icon className="h-3 w-3" />
      </span>
    );
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Mobile: one card per row */}
      <ul className="flex flex-col gap-2 md:hidden">
        {paginatedData.map((row, idx) => (
          <li key={keyExtractor(row)}>
            <button
              type="button"
              onClick={() => onRowClick?.(row)}
              className={cn(
                "flex w-full flex-col gap-2 rounded-lg border border-border bg-surface p-4 text-left sd-tap transition-colors",
                "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                onRowClick && "cursor-pointer"
              )}
            >
              {renderMobileCard
                ? renderMobileCard(row, idx)
                : defaultMobileCard(row, idx)}
            </button>
          </li>
        ))}
      </ul>

      {/* Desktop: traditional table */}
      <div className="hidden w-full overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b border-border bg-muted">
            <tr>
              {columns.map((col) => {
                const sortable = !!col.sortable;
                const isActive = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={col.width ? { width: col.width } : undefined}
                    aria-sort={
                      sortable && isActive
                        ? sort!.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : sortable
                          ? "none"
                          : undefined
                    }
                    className={cn(
                      "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                      col.headerClassName
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex h-11 min-w-[44px] items-center gap-1 rounded-sm uppercase sd-tap hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {col.header}
                        {renderSortIcon(col)}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((row, idx) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "transition-colors hover:bg-muted",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 align-middle text-sm text-foreground",
                      col.cellClassName
                    )}
                  >
                    {defaultRenderCell(row, col, idx)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {pageSize > 0 && totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {pageLabel(
              Math.min((safePage - 1) * pageSize + 1, totalItems),
              Math.min(safePage * pageSize, totalItems)
            )}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={safePage === 1}
              aria-label="First page"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronsLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <span className="px-2 text-xs text-muted-foreground">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
              aria-label="Last page"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronsRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };
