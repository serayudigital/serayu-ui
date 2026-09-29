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
 * File sizes and compact numbers
 * ============================================================ */

/**
 * Format a byte count as a human-readable string ("1.5 MB", "256 KB").
 *
 * Auto-scales to the appropriate binary unit (B / KB / MB / GB / TB / PB,
 * 1024-based). The number portion is rendered via Intl.NumberFormat so the
 * decimal and grouping separators follow the active locale (id-ID by
 * default: "1,5 KB"; en-US: "1.5 KB").
 *
 * Example:
 *   formatBytes(0)                          => "0 B"
 *   formatBytes(1024)                       => "1 KB"
 *   formatBytes(1536)                       => "1,5 KB"   (id-ID default)
 *   formatBytes(1048576)                    => "1 MB"
 *   formatBytes(1073741824, { locale: "en-US" }) => "1.07 GB"
 *   formatBytes(1536, { decimals: 0 })      => "2 KB"
 */
export function formatBytes(
  bytes: number,
  options?: { decimals?: number; locale?: string }
): string {
  if (!Number.isFinite(bytes)) return "0 B";
  const locale = options?.locale ?? "id-ID";
  const decimals = options?.decimals ?? 1;

  const sign = bytes < 0 ? "-" : "";
  const abs = Math.abs(bytes);

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let value = abs;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  // For the bytes unit, never show decimals (e.g. "512 B", not "512,0 B").
  // For larger units, show up to `decimals` fractional digits.
  const fractionDigits = unitIndex === 0 ? 0 : decimals;
  const numberFormatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
  const formatted = numberFormatter.format(value);
  return `${sign}${formatted} ${units[unitIndex]}`;
}

/**
 * Format a number using compact notation ("1.2K", "3.4M", "1.5B").
 *
 * Wraps Intl.NumberFormat with `notation: "compact"`. Useful for chart
 * axes, large counts, and table cells where space is tight. Locale-aware:
 * en-US yields "1.2K", id-ID yields "1,2 rb".
 *
 * The optional `locale` field on `options` is honored (unlike a plain
 * Intl.NumberFormat options object, where locale must be the first
 * constructor argument).
 *
 * Example:
 *   formatCompactNumber(1200)             => "1,2 rb" (id-ID default)
 *   formatCompactNumber(3_400_000)        => "3,4 jt" (id-ID default)
 *   formatCompactNumber(1500000000, { locale: "en-US" }) => "1.5B"
 */
export function formatCompactNumber(
  value: number,
  options?: Intl.NumberFormatOptions & { locale?: string }
): string {
  const { locale, ...rest } = options ?? {};
  return new Intl.NumberFormat(locale ?? "id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
    ...rest,
  }).format(value);
}

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
 * Validate a URL and (optionally) restrict to a list of allowed protocols.
 *
 * Defaults to allowing `http` and `https` only. Pass a `protocols` array
 * to allow others (e.g. `["ftp"]` or `["ws", "wss"]`).
 *
 * Rejects empty strings, malformed URLs, and protocols not in the list.
 *
 * Example:
 *   isValidURL("https://example.com")                  => true
 *   isValidURL("example.com")                          => false (no protocol)
 *   isValidURL("ftp://files.example.com")              => false (default blocks ftp)
 *   isValidURL("ftp://files.example.com", { protocols: ["http", "https", "ftp"] }) => true
 *   isValidURL("")                                     => false
 */
export function isValidURL(
  value: string,
  options?: { protocols?: Array<"http" | "https" | string> }
): boolean {
  if (typeof value !== "string") return false;
  if (value.trim().length === 0) return false;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  const allowed = options?.protocols ?? ["http", "https"];
  // URL.protocol includes the trailing colon (e.g. "https:").
  const protocol = url.protocol.replace(/:$/, "");
  return allowed.includes(protocol);
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
