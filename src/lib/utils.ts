/**
 * Serayu UI - generic utility helpers (not React-specific).
 * Used by components and consumer apps alike.
 */

/**
 * Promise-based sleep. Useful for simulating loading, async debounce,
 * or UI transitions.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check whether code runs in the browser (not SSR / Node).
 */
export function isClient(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Format a number with the id-ID locale (dot thousands separator, comma decimal).
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("id-ID", options).format(value);
}

/**
 * Format Rupiah currency.
 */
export function formatCurrency(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

/**
 * Format a date with the id-ID locale.
 * Default: long date (example: 24 September 2026).
 */
export function formatDate(
  value: Date | number | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(date);
}

/**
 * Format a relative date (example: "2 hours ago", "yesterday").
 */
export function formatRelative(value: Date | number | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
  const diffDay = Math.round(diffHour / 24);
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, "day");
  const diffMonth = Math.round(diffDay / 30);
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, "month");
  const diffYear = Math.round(diffMonth / 12);
  return rtf.format(diffYear, "year");
}

/**
 * Truncate a string with an ellipsis when it exceeds the limit.
 */
export function truncate(str: string, max: number, suffix = "..."): string {
  if (str.length <= max) return str;
  return str.slice(0, Math.max(0, max - suffix.length)) + suffix;
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a short random id for component needs (label-for, aria).
 */
export function uid(prefix = "sd"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Compose multiple event handlers into a single onX prop.
 * Local handler is called before the external handler (if any).
 */
export function composeEventHandlers<E extends React.SyntheticEvent>(
  local: ((event: E) => void) | undefined,
  external: ((event: E) => void) | undefined
) {
  return (event: E) => {
    local?.(event);
    if (event.defaultPrevented) return;
    external?.(event);
  };
}

/**
 * Merge a ref callback and ref object into a single ref prop.
 * Useful for forwarding refs to wrapper components.
 */
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/**
 * Type-safe noop function.
 */
export function noop(): void {}

/* ============================================================
 * Indonesian locale (aliases and special formatters)
 * ============================================================ */

/**
 * Format Rupiah (alias of formatCurrency). Default has no decimals.
 *
 * Example:
 *   formatRupiah(15000) => "Rp 15.000"
 */
export function formatRupiah(value: number, options?: Intl.NumberFormatOptions): string {
  return formatCurrency(value, options);
}

/**
 * Format a long Indonesian-style date. Alias of formatDate.
 *
 * Example:
 *   formatTanggal(new Date(2026, 8, 24)) => "24 September 2026"
 */
export function formatTanggal(value: Date | number | string, options?: Intl.DateTimeFormatOptions): string {
  return formatDate(value, options);
}

/* ============================================================
 * Indonesian formatters and validators
 * ============================================================ */

/**
 * Format the display of an Indonesian phone number from raw input.
 *
 * Delegates to formatNomorHP for normalization, then groups the digits
 * with a separator (default hyphen). Two modes:
 *   - 'international' (default): "+62 812-3456-7890"
 *   - 'local':                   "0812-3456-7890"
 *
 * Grouping starts from the right: each group has at most 4 digits,
 * the first group holds the remainder. For typical phone numbers
 * (10-13 total digits) the result is consistently "X-XXXX-XXXX"
 * or "8XX-XXXX-XXXX".
 *
 * Returns null when the input does not match the Indonesian phone pattern.
 *
 * Example:
 *   formatPhoneNumber("081234567890")                       => "+62 812-3456-7890"
 *   formatPhoneNumber("0812-3456-7890")                     => "+62 812-3456-7890"
 *   formatPhoneNumber("081234567890", { format: "local" })  => "0812-3456-7890"
 *   formatPhoneNumber("081234567890", { separator: " " })   => "+62 812 3456 7890"
 *   formatPhoneNumber("abc")                                => null
 */
export function formatPhoneNumber(
  raw: string,
  options?: {
    format?: "local" | "international";
    separator?: string;
  }
): string | null {
  const { format = "international", separator = "-" } = options ?? {};

  const normalized = formatNomorHP(raw);
  if (!normalized) return null;

  const digits = normalized.slice(3); // drop "+62"

  // Group from the right: each group has at most 4 digits.
  const groups: string[] = [];
  let remaining = digits;
  while (remaining.length > 4) {
    groups.unshift(remaining.slice(-4));
    remaining = remaining.slice(0, -4);
  }
  groups.unshift(remaining);

  const body = groups.join(separator);
  return format === "local" ? "0" + body : "+62 " + body;
}

/**
 * Normalize an Indonesian phone number to the +62xxxxxxxxx format.
 *
 * Accepts input:
 *   - "08xxxxxxxxx"        (local)
 *   - "+62xxxxxxxxx"       (already international)
 *   - "62xxxxxxxxx"        (international without +)
 *   - With spaces or hyphens, e.g. "0812-3456-7890".
 *
 * Returns null when the input does not match the Indonesian phone pattern.
 */
export function formatNomorHP(raw: string): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.replace(/[\s-]/g, "");

  let digits: string;
  if (cleaned.startsWith("+62")) {
    digits = cleaned.slice(3);
  } else if (cleaned.startsWith("62")) {
    digits = cleaned.slice(2);
  } else if (cleaned.startsWith("0")) {
    digits = cleaned.slice(1);
  } else {
    return null;
  }

  if (!/^\d{9,13}$/.test(digits)) return null;

  return "+62" + digits;
}

/**
 * Validate the format of an Indonesian phone number.
 * See formatNomorHP for the supported patterns.
 */
export function isValidIndonesianPhone(value: string): boolean {
  return formatNomorHP(value) !== null;
}

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validate an email format (RFC 5322 simplified). Caps the length at 254
 * characters per the RFC 5321 limit.
 */
export function isValidEmail(value: string): boolean {
  if (typeof value !== "string") return false;
  if (value.length === 0 || value.length > 254) return false;
  return EMAIL_RE.test(value);
}

/**
 * Validate an Indonesian KTP NIK (16 digits).
 *
 * Checks:
 *   - 16 numeric digits.
 *   - The 6 middle digits encode the date of birth (DDMMYY). For women, the
 *     day is encoded as +40 (e.g. day 5 is written as 45). The date is validated
 *     using Date rollover (Feb 30 and similar are rejected automatically).
 *   - The year is decoded to the range 1945-present.
 *
 * NOTE: this does not validate the regional code (PPKKCC) or the final
 * 4-digit checksum, whose algorithm is not officially published. For form
 * input needs, this validation is sufficient to catch typos.
 */
export function isValidNIK(value: string): boolean {
  if (typeof value !== "string") return false;
  if (!/^\d{16}$/.test(value)) return false;

  let day = parseInt(value.slice(6, 8), 10);
  const month = parseInt(value.slice(8, 10), 10);
  const year2 = parseInt(value.slice(10, 12), 10);

  // Women: the day is encoded as +40 (1-31 becomes 41-71).
  if (day > 40) day -= 40;

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Decode the 2-digit year. Assumption: 00-((current year % 100)) is 20xx,
  // everything else is 19xx.
  const currentYearTwo = new Date().getFullYear() % 100;
  const fullYear = year2 <= currentYearTwo ? 2000 + year2 : 1900 + year2;
  if (fullYear < 1945) return false;

  // Validate the actual date (using Date rollover to catch cases like Feb 30).
  const date = new Date(fullYear, month - 1, day);
  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  return true;
}
