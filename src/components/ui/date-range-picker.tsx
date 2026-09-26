import * as React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  startOfMonth,
  addMonths,
  isSameDay,
  isSameMonth,
  getDayOfWeekMonFirst,
  stripTime,
  sortRange,
  isInRange,
  MONTH_NAMES_ID,
  MONTH_NAMES_EN,
  DAY_NAMES_ID_MON_FIRST,
  DAY_NAMES_EN_MON_FIRST,
  pickLocale,
} from "@/lib/calendar-utils";

/**
 * DateRangePicker - pick a date range (start + end).
 *
 * - First tap = start, second tap = end. Third tap resets start.
 * - If the second tap is earlier than start, the dates are swapped so
 *   that the earlier one becomes the new start.
 * - The range is highlighted with a brand-tinted overlay on the cells
 *   between start and end.
 * - Default locale is `id-ID`; override via the `locale` prop or by
 *   passing a custom `monthNames` / `dayNames` array.
 * - Disabled dates: array or predicate.
 * - Horizontal swipe changes month; prev/next buttons provide a keyboard
 *   and screen-reader fallback.
 * - Zero dependencies. Solid tones only (no gradients).
 *
 * Example:
 *   const [range, setRange] = React.useState<DateRange>();
 *   <DateRangePicker
 *     value={range}
 *     onChange={setRange}
 *     presets={[
 *       { label: "Last 7 days", range: () => ({ start: ..., end: ... }) },
 *       { label: "This month", range: () => ({ start: ..., end: ... }) },
 *     ]}
 *   />
 */

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateRangePreset {
  /** Label shown on the preset button. */
  label: string;
  /** Function returning the range; called when the preset is clicked. */
  range: () => DateRange;
}

export interface DateRangePickerProps {
  /** Controlled value. */
  value?: DateRange;
  /** Default value for uncontrolled mode. */
  defaultValue?: DateRange;
  /** Called whenever the range changes (including after a swap or reset). */
  onChange?: (range: DateRange | undefined) => void;
  /** BCP-47 locale tag (default `id-ID`). */
  locale?: string;
  /** Override month names (12 entries). */
  monthNames?: string[];
  /** Override short day names (Monday-first, 7 entries). */
  dayNames?: string[];
  /** Minimum selectable date (inclusive). */
  minDate?: Date;
  /** Maximum selectable date (inclusive). */
  maxDate?: Date;
  /** Disabled dates: array or predicate. */
  disabledDates?: Date[] | ((date: Date) => boolean);
  /** Quick presets (e.g. "Last 7 days"). */
  presets?: DateRangePreset[];
  /** Container class. */
  className?: string;
  /** Show the clear button (default true). */
  clearable?: boolean;
  /** Text label of the clear button. */
  clearLabel?: string;
}

interface Cell {
  date: Date;
  inMonth: boolean;
}

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  locale = "id-ID",
  monthNames,
  dayNames,
  minDate,
  maxDate,
  disabledDates,
  presets,
  className,
  clearable = true,
  clearLabel = "Clear",
}: DateRangePickerProps) {
  const isControlled = value !== undefined;
  const [internalRange, setInternalRange] = React.useState<DateRange | undefined>(
    defaultValue
  );
  const range = isControlled ? value : internalRange;

  // Anchor month currently shown. Start from `start` if available,
  // otherwise the current month.
  const [viewMonth, setViewMonth] = React.useState<Date>(() =>
    startOfMonth(range?.start ?? new Date())
  );

  React.useEffect(() => {
    if (range?.start) setViewMonth(startOfMonth(range.start));
  }, [range?.start]);

  const months = monthNames ?? pickLocale(locale, MONTH_NAMES_ID, MONTH_NAMES_EN);
  const days = dayNames ?? pickLocale(locale, DAY_NAMES_ID_MON_FIRST, DAY_NAMES_EN_MON_FIRST);

  const minStripped = minDate ? stripTime(minDate) : null;
  const maxStripped = maxDate ? stripTime(maxDate) : null;
  const today = React.useMemo(() => stripTime(new Date()), []);

  const isDisabled = React.useCallback(
    (d: Date): boolean => {
      const s = stripTime(d);
      if (minStripped && s < minStripped) return true;
      if (maxStripped && s > maxStripped) return true;
      if (typeof disabledDates === "function") return disabledDates(d);
      if (Array.isArray(disabledDates)) {
        return disabledDates.some((x) => isSameDay(x, d));
      }
      return false;
    },
    [minStripped, maxStripped, disabledDates]
  );

  // Build the 6x7 grid (42 cells) for viewMonth.
  const cells = React.useMemo<Cell[]>(() => {
    const list: Cell[] = [];
    const firstOfMonth = startOfMonth(viewMonth);
    const offset = getDayOfWeekMonFirst(firstOfMonth);
    const start = new Date(
      firstOfMonth.getFullYear(),
      firstOfMonth.getMonth(),
      1 - offset
    );
    for (let i = 0; i < 42; i++) {
      const d = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + i
      );
      list.push({ date: d, inMonth: isSameMonth(d, viewMonth) });
    }
    return list;
  }, [viewMonth]);

  const commit = (next: DateRange | undefined) => {
    if (!isControlled) setInternalRange(next);
    onChange?.(next);
  };

  const handleSelect = (d: Date) => {
    if (isDisabled(d)) return;
    // No start yet - set start.
    if (!range || !range.start) {
      commit({ start: stripTime(d), end: stripTime(d) });
      return;
    }
    // Have a start but no real end yet (range.end === range.start) - set end.
    if (range.start && isSameDay(range.start, range.end)) {
      const [s, e] = sortRange(range.start, d);
      commit({ start: stripTime(s), end: stripTime(e) });
      return;
    }
    // Range already complete - reset, starting from d.
    commit({ start: stripTime(d), end: stripTime(d) });
  };

  const handleClear = () => {
    commit(undefined);
  };

  // ===== Horizontal swipe =====
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [dragX, setDragX] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const startX = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!wrapperRef.current) return;
    setWidth(wrapperRef.current.clientWidth);
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    startX.current = e.touches[0].clientX;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging || startX.current === null) return;
    setDragX(e.touches[0].clientX - startX.current);
  };
  const onTouchEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const w = width > 0 ? width : wrapperRef.current?.clientWidth ?? 0;
    const dx = dragX;
    setDragX(0);
    startX.current = null;
    if (w > 0 && Math.abs(dx) > w * 0.25) {
      setViewMonth((prev) => addMonths(prev, dx < 0 ? 1 : -1));
    }
  };

  const dragOffset = width > 0 ? (dragX / width) * 100 : 0;

  // Phase hint drives the UX affordance (which label to show).
  const phase: "idle" | "pickStart" | "pickEnd" =
    !range || !range.start
      ? "idle"
      : isSameDay(range.start, range.end)
        ? "pickEnd"
        : "idle";

  const rangeLabel = range
    ? `${range.start.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })} - ${range.end.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}`
    : "Select date range";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-md border border-border bg-surface p-3",
        className
      )}
    >
      {/* Header: active range info + clear button. */}
      <div
        role="status"
        aria-live="polite"
        className="flex items-center justify-between gap-2 px-1"
      >
        <div className="text-xs text-muted-foreground">
          {phase === "pickEnd" ? "Select end date" : rangeLabel}
        </div>
        {clearable && range && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={clearLabel}
            className="inline-flex h-11 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground sd-tap hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-3 w-3" aria-hidden />
            {clearLabel}
          </button>
        )}
      </div>

      {/* Preset chips */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                const r = p.range();
                commit(r);
                setViewMonth(startOfMonth(r.start));
              }}
              className="inline-flex h-11 items-center rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Calendar */}
      <div
        ref={wrapperRef}
        role="group"
        aria-label="Date range picker"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div className="flex items-center justify-between px-1 py-1">
          <button
            type="button"
            onClick={() => setViewMonth((p) => addMonths(p, -1))}
            aria-label="Previous month"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <h2 className="text-sm font-semibold text-foreground">
            {months[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </h2>
          <button
            type="button"
            onClick={() => setViewMonth((p) => addMonths(p, 1))}
            aria-label="Next month"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div
          className="grid grid-cols-7 gap-0.5"
          style={{
            transform: `translateX(${dragOffset}%)`,
            transition: dragging
              ? "none"
              : "transform 220ms cubic-bezier(0.2,0,0,1)",
          }}
        >
          <div className="col-span-7 grid grid-cols-7 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {days.map((d, i) => (
              <div key={i} className="py-1">
                {d}
              </div>
            ))}
          </div>
          {cells.map(({ date, inMonth }, i) => {
            const isStart = range?.start ? isSameDay(date, range.start) : false;
            const isEnd = range?.end ? isSameDay(date, range.end) : false;
            const inside = range?.start && range?.end && !isSameDay(range.start, range.end)
              ? isInRange(date, range.start, range.end)
              : false;
            const isToday = isSameDay(date, today);
            const disabled = isDisabled(date);

            const labelText = date.toLocaleDateString(locale, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => handleSelect(date)}
                aria-label={labelText}
                aria-pressed={isStart || isEnd}
                className={cn(
                  "relative aspect-square text-sm rounded-md sd-tap transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                  !inMonth && "text-muted-foreground/30",
                  inMonth && !isStart && !isEnd && !inside && !disabled && "hover:bg-muted",
                  disabled && "cursor-not-allowed opacity-30 line-through",
                  inside && "bg-brand/20 text-foreground",
                  (isStart || isEnd) &&
                    "bg-brand font-semibold text-brand-foreground hover:bg-brand/90",
                  phase === "pickEnd" && !disabled && inMonth && !isStart &&
                    "ring-1 ring-brand/40 ring-inset"
                )}
              >
                {date.getDate()}
                {isToday && !isStart && !isEnd && inMonth ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-1/4 bottom-1 h-0.5 rounded-full bg-brand"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
