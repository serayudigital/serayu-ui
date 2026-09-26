import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  startOfMonth,
  addMonths,
  isSameDay,
  isSameMonth,
  getDayOfWeekMonFirst,
  stripTime,
  MONTH_NAMES_ID,
  MONTH_NAMES_EN,
  DAY_NAMES_ID_MON_FIRST,
  DAY_NAMES_EN_MON_FIRST,
  pickLocale,
} from "@/lib/calendar-utils";

/**
 * DatePicker - iOS-style calendar for picking a single date.
 *
 * - 6 rows x 7 columns layout (Monday-first). Days from the previous or
 *   next month are rendered with reduced opacity.
 * - Single-date selection, controlled or uncontrolled.
 * - Disabled dates: array or `(date: Date) => boolean` predicate.
 * - Default locale is `id-ID` (Indonesian month/day names).
 * - Horizontal swipe changes the month; prev/next buttons are the
 *   keyboard / screen-reader fallback.
 * - Solid tones only (no gradients).
 *
 * Example:
 *   <DatePicker
 *     value={date}
 *     onChange={setDate}
 *     minDate={new Date()}
 *   />
 */

export interface DatePickerProps {
  /** Controlled value. */
  value?: Date;
  /** Default value for uncontrolled mode. */
  defaultValue?: Date;
  /** Called whenever a date is picked. */
  onChange?: (date: Date) => void;
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
  className?: string;
}

export function DatePicker({
  value,
  defaultValue,
  onChange,
  locale = "id-ID",
  monthNames,
  dayNames,
  minDate,
  maxDate,
  disabledDates,
  className,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(
    defaultValue
  );
  const current = isControlled ? value : internalValue;

  const [viewMonth, setViewMonth] = React.useState<Date>(() =>
    startOfMonth(current ?? new Date())
  );

  // Keep viewMonth in sync with the controlled value.
  React.useEffect(() => {
    if (current) setViewMonth(startOfMonth(current));
  }, [current]);

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

  // Build the 6x7 grid (42 cells) starting from the Monday of the week
  // that contains day-1.
  const cells = React.useMemo(() => {
    const list: { date: Date; inMonth: boolean }[] = [];
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

  const handleSelect = (d: Date) => {
    if (isDisabled(d)) return;
    if (!isControlled) setInternalValue(d);
    onChange?.(d);
  };

  // Horizontal swipe changes month.
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

  return (
    <div
      ref={wrapperRef}
      role="group"
      aria-label="Date picker"
      className={cn("flex flex-col gap-2 bg-surface p-3", className)}
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <h2
          aria-live="polite"
          className="text-sm font-semibold text-foreground"
        >
          {months[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </h2>
        <button
          type="button"
          onClick={() => setViewMonth((p) => addMonths(p, 1))}
          aria-label="Next month"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {days.map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
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
        {cells.map(({ date, inMonth }, i) => {
          const selected = isSameDay(date, current);
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
              aria-pressed={selected}
              className={cn(
                "relative aspect-square text-sm rounded-md sd-tap transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                !inMonth && "text-muted-foreground/30",
                inMonth && !selected && !disabled && "hover:bg-muted",
                disabled && "cursor-not-allowed opacity-30 line-through",
                selected &&
                  "bg-brand font-semibold text-brand-foreground hover:bg-brand/90"
              )}
            >
              {date.getDate()}
              {isToday && !selected && inMonth ? (
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
  );
}
