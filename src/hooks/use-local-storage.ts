import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useLocalStorage - state synced with window.localStorage.
 *
 * - SSR-safe: initial value is read at mount, not at initial render.
 * - JSON.parse / JSON.stringify are wrapped in try/catch. On failure,
 *   falls back to the initial value.
 * - Cross-tab sync via the "storage" event.
 * - Avoids writing back the value just read on first mount.
 *
 * Returns a tuple: [value, setValue, reset].
 *
 * Example:
 *   const [name, setName, resetName] = useLocalStorage("sd-name", "");
 */
export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, (value: T) => void, () => void] {
  const [value, setValue] = useState<T>(() => readFromStorage(key, initial));
  const isFirstRender = useRef(true);

  // Re-write on every value change (except the first render).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota or serialization errors.
    }
  }, [key, value]);

  // Sync when another tab modifies the same key.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      if (event.newValue === null) {
        setValue(initial);
        return;
      }
      try {
        setValue(JSON.parse(event.newValue) as T);
      } catch {
        // Ignore JSON.parse errors.
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initial]);

  const reset = useCallback(() => {
    setValue(initial);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore.
      }
    }
  }, [key, initial]);

  return [value, setValue, reset];
}

function readFromStorage<T>(key: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? initial : (JSON.parse(raw) as T);
  } catch {
    return initial;
  }
}
