/**
 * Calendar math helpers - used by DatePicker and DateRangePicker.
 * Zero deps. Gregorian calendar.
 */

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function isSameDay(
  a: Date | null | undefined,
  b: Date | null | undefined
): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Monday=0, Tuesday=1, ..., Sunday=6. */
export function getDayOfWeekMonFirst(d: Date): number {
  return (d.getDay() + 6) % 7;
}

export function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Sort two dates ascending (no mutation). */
export function sortRange(a: Date, b: Date): [Date, Date] {
  return a <= b ? [a, b] : [b, a];
}

/** Check if `d` is between `start` and `end` (inclusive). */
export function isInRange(d: Date, start: Date, end: Date): boolean {
  const s = stripTime(d).getTime();
  return s >= stripTime(start).getTime() && s <= stripTime(end).getTime();
}

export const MONTH_NAMES_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const MONTH_NAMES_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAY_NAMES_ID_MON_FIRST = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
export const DAY_NAMES_EN_MON_FIRST = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function pickLocale<T>(locale: string, idVal: T, enVal: T): T {
  return locale.toLowerCase().startsWith("id") ? idVal : enVal;
}
