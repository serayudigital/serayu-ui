import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * VirtualList - windowing for long lists (10K+ items). Only the items
 * in the viewport plus a small overscan on each side are rendered.
 *
 * Supports:
 *   - Fixed-size items (faster, less memory).
 *   - Variable-size items (lazy measurement + offset cache).
 *
 * Example:
 *   <VirtualList
 *     items={rows}
 *     itemHeight={56}
 *     renderItem={(item, index) => (
 *       <Row key={item.id} title={item.title} />
 *     )}
 *     ariaLabel="Transaction list"
 *   />
 *
 * For variable-size items, use `itemSize`:
 *   <VirtualList
 *     items={posts}
 *     itemSize={(_, post) => (post.collapsed ? 56 : 132)}
 *     renderItem={(post, i) => <Post post={post} />}
 *   />
 */

export interface VirtualListProps<T> {
  /** List items. */
  items: T[];
  /** Fixed item height in px. Ignored when `itemSize` is provided. */
  itemHeight?: number;
  /** Variable height; returns px. */
  itemSize?: (index: number, item: T) => number;
  /** Viewport height in px. Default 400. */
  height?: number;
  /** Container width (px or "100%"). Default "100%". */
  width?: number | string;
  /** Render one item. Must include a key (use `item` itself or `index`). */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Extra items above and below the viewport (default 5). */
  overscan?: number;
  /** ClassName on the root. */
  className?: string;
  /** aria-label for the wrapper. */
  ariaLabel?: string;
  /** Scroll event (optional). */
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export function VirtualList<T>(props: VirtualListProps<T>): React.ReactElement {
  const {
    items,
    itemHeight,
    itemSize,
    height = 400,
    width = "100%",
    renderItem,
    overscan = 5,
    className,
    ariaLabel,
    onScroll,
  } = props;

  if (itemHeight === undefined && itemSize === undefined) {
    throw new Error(
      "VirtualList: provide either `itemHeight` (fixed) or `itemSize` (variable)."
    );
  }

  const useVariable = itemSize !== undefined;
  const fixed = itemHeight ?? 0;
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const measureRef = React.useRef<HTMLDivElement>(null);

  // Offset cache for the variable-size mode.
  const offsetsCache = React.useRef<number[] | null>(null);
  const sizesCache = React.useRef<number[] | null>(null);

  const getOffsets = React.useCallback((): number[] => {
    if (!useVariable) {
      // Fixed: offset[i] = i * fixed
      const arr = new Array(items.length + 1);
      for (let i = 0; i <= items.length; i++) arr[i] = i * fixed;
      return arr;
    }
    if (offsetsCache.current && offsetsCache.current.length === items.length + 1) {
      return offsetsCache.current;
    }
    const sizes: number[] = new Array(items.length);
    for (let i = 0; i < items.length; i++) sizes[i] = itemSize!(i, items[i]);
    const offsets = new Array(items.length + 1);
    offsets[0] = 0;
    for (let i = 0; i < items.length; i++) offsets[i + 1] = offsets[i] + sizes[i];
    sizesCache.current = sizes;
    offsetsCache.current = offsets;
    return offsets;
  }, [useVariable, items, fixed, itemSize]);

  // Invalidate the cache when items or sizes change.
  React.useEffect(() => {
    offsetsCache.current = null;
    sizesCache.current = null;
  }, [items, itemSize, fixed, useVariable]);

  // Lazy measurement for the variable mode: after render, read the
  // actual height via measureRef.
  React.useEffect(() => {
    if (!useVariable) return;
    if (!measureRef.current) return;
    const els = measureRef.current.querySelectorAll<HTMLElement>("[data-vl-measured]");
    if (els.length === 0) return;
    let changed = false;
    els.forEach((el) => {
      const idx = Number(el.dataset.index);
      if (Number.isNaN(idx) || idx < 0 || idx >= items.length) return;
      const rect = el.getBoundingClientRect();
      const h = Math.round(rect.height);
      const prev = sizesCache.current?.[idx];
      if (prev !== undefined && Math.abs(prev - h) > 1) {
        if (sizesCache.current) sizesCache.current[idx] = h;
        changed = true;
      } else if (prev === undefined) {
        if (!sizesCache.current) sizesCache.current = new Array(items.length);
        sizesCache.current[idx] = h;
        changed = true;
      }
    });
    if (changed) {
      const sizes = sizesCache.current!;
      const offsets = new Array(items.length + 1);
      offsets[0] = 0;
      for (let i = 0; i < items.length; i++) offsets[i + 1] = offsets[i] + sizes[i];
      offsetsCache.current = offsets;
    }
  });

  const offsets = React.useMemo(() => getOffsets(), [getOffsets]);
  const totalHeight = offsets[offsets.length - 1] ?? 0;

  // Binary search: find the largest offset index that is <= scrollTop.
  const findStart = (scroll: number): number => {
    let lo = 0;
    let hi = items.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (offsets[mid] <= scroll) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };

  const startIdx = Math.max(0, findStart(scrollTop) - overscan);
  const endIdx = Math.min(
    items.length,
    findStart(scrollTop + height) + overscan + 1
  );
  const offsetY = offsets[startIdx] ?? 0;

  const visible = items.slice(startIdx, endIdx);
  const numericWidth = typeof width === "number" ? width : undefined;

  return (
    <div
      ref={viewportRef}
      role="list"
      aria-label={ariaLabel}
      onScroll={(e) => {
        setScrollTop(e.currentTarget.scrollTop);
        onScroll?.(e);
      }}
      className={cn(
        "relative overflow-auto rounded-md border border-border bg-surface",
        className
      )}
      style={{ height, width: numericWidth ?? width }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          ref={useVariable ? measureRef : undefined}
          style={{
            position: "absolute",
            top: offsetY,
            left: 0,
            right: 0,
            transform: useVariable ? undefined : `translateY(0)`,
          }}
        >
          {visible.map((item, i) => {
            const realIdx = startIdx + i;
            return (
              <div
                key={realIdx}
                data-vl-measured={useVariable ? realIdx : undefined}
                style={useVariable ? undefined : { height: fixed }}
                role="listitem"
              >
                {renderItem(item, realIdx)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
