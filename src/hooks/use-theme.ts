import { useCallback, useEffect, useState } from "react";

/**
 * useTheme - Serayu UI theme hook (light/dark/system).
 *
 * - Preference state can be "light" | "dark" | "system".
 * - Resolved state is always "light" | "dark" (after system is resolved).
 * - localStorage key: "sd-theme".
 * - Theme is applied via the data-theme attribute on <html>.
 * - Cross-tab sync via the "storage" event.
 * - Falls back to OS preference when mode is "system".
 *
 * NOTE: The anti-FOIT inline script in index.html sets data-theme
 * BEFORE React mounts. This hook only keeps state in sync after that.
 */

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface UseThemeReturn {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
  toggle: () => void;
}

export const THEME_STORAGE_KEY = "sd-theme";
const THEME_ATTRIBUTE = "data-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "system";
}

function resolve(pref: ThemePreference): ResolvedTheme {
  return pref === "system" ? getSystemTheme() : pref;
}

function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(THEME_ATTRIBUTE, resolved);
}

export function useTheme(): UseThemeReturn {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredPreference()
  );
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolve(readStoredPreference())
  );

  // Subscribe to OS changes (when system mode) and storage events (cross-tab).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const current = readStoredPreference();
      if (current === "system") {
        const next = getSystemTheme();
        setResolved(next);
        applyTheme(next);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = readStoredPreference();
      setPreferenceState(next);
      const r = resolve(next);
      setResolved(r);
      applyTheme(r);
    };

    mql.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      mql.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    }
    setPreferenceState(next);
    const r = resolve(next);
    setResolved(r);
    applyTheme(r);
  }, []);

  const toggle = useCallback(() => {
    setPreference(resolved === "dark" ? "light" : "dark");
  }, [resolved, setPreference]);

  return { preference, resolved, setPreference, toggle };
}
