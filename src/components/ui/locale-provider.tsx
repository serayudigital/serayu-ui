import * as React from "react";

/**
 * LocaleProvider - context for overriding the default id-ID locale.
 *
 * - Default stays id-ID (additive, does not break existing formatters).
 * - Override is active only when the consumer wraps with the provider.
 * - Exposes `formatNumber`, `formatCurrency`, `formatDate`,
 *   `formatRelative` formatters that follow the active locale.
 * - Exposes `t(key, fallback)` helper for translation strings.
 *
 * Example:
 *   <LocaleProvider locale="en-US" translations={{ "en-US": { hello: "Hello" } }}>
 *     <App />
 *   </LocaleProvider>
 *
 *   function MyComp() {
 *     const { formatCurrency } = useLocaleFormatters();
 *     const t = useT();
 *     return <p>{t("hello", "Hi")} {formatCurrency(15000)}</p>;
 *   }
 */

export type Locale = string;
export type TranslationDictionary = Record<string, string>;
export type TranslationMap = Record<Locale, TranslationDictionary>;

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  formatRelative: (value: Date | number | string) => string;
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null);
LocaleContext.displayName = "LocaleContext";

/* ============================================================
 * Default formatter (`id-ID`) used as the fallback when no provider
 * wraps the tree.
 * ============================================================ */

function defaultFormatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("id-ID", options).format(value);
}

function defaultFormatCurrency(
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

function defaultFormatDate(
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

function defaultFormatRelative(value: Date | number | string): string {
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

/* ============================================================
 * Provider
 * ============================================================ */

export interface LocaleProviderProps {
  /** Initial locale (default "id-ID"). */
  locale?: Locale;
  /** Called when locale changes via setLocale. */
  onLocaleChange?: (locale: Locale) => void;
  /** Per-locale translation map. */
  translations?: TranslationMap;
  children: React.ReactNode;
}

export function LocaleProvider({
  locale: initial = "id-ID",
  onLocaleChange,
  translations,
  children,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = React.useState<Locale>(initial);

  React.useEffect(() => {
    setLocaleState(initial);
  }, [initial]);

  const setLocale = React.useCallback(
    (next: Locale) => {
      setLocaleState(next);
      onLocaleChange?.(next);
    },
    [onLocaleChange]
  );

  const t = React.useCallback(
    (key: string, fallback?: string) => {
      const dict = translations?.[locale];
      return dict?.[key] ?? fallback ?? key;
    },
    [locale, translations]
  );

  const formatNumber = React.useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value),
    [locale]
  );

  const formatCurrency = React.useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
        ...options,
      }).format(value),
    [locale]
  );

  const formatDate = React.useCallback(
    (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => {
      const date = value instanceof Date ? value : new Date(value);
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        ...options,
      }).format(date);
    },
    [locale]
  );

  const formatRelative = React.useCallback(
    (value: Date | number | string) => {
      const date = value instanceof Date ? value : new Date(value);
      const diffMs = date.getTime() - Date.now();
      const diffSec = Math.round(diffMs / 1000);
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
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
    },
    [locale]
  );

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      formatNumber,
      formatCurrency,
      formatDate,
      formatRelative,
    }),
    [locale, setLocale, t, formatNumber, formatCurrency, formatDate, formatRelative]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/* ============================================================
 * Hooks
 * ============================================================ */

const FALLBACK: LocaleContextValue = {
  locale: "id-ID",
  setLocale: () => {
    /* noop default */
  },
  t: (key, fb) => fb ?? key,
  formatNumber: defaultFormatNumber,
  formatCurrency: defaultFormatCurrency,
  formatDate: defaultFormatDate,
  formatRelative: defaultFormatRelative,
};

/** Get the full context value (or default fallback when not wrapped). */
export function useLocale(): LocaleContextValue {
  return React.useContext(LocaleContext) ?? FALLBACK;
}

/** Hook dedicated to translation keys. */
export function useT(): LocaleContextValue["t"] {
  return useLocale().t;
}

/** Hook dedicated to formatters (number, currency, date, relative). */
export function useLocaleFormatters(): Pick<
  LocaleContextValue,
  "formatNumber" | "formatCurrency" | "formatDate" | "formatRelative"
> {
  const ctx = useLocale();
  return {
    formatNumber: ctx.formatNumber,
    formatCurrency: ctx.formatCurrency,
    formatDate: ctx.formatDate,
    formatRelative: ctx.formatRelative,
  };
}
