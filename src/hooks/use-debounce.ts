import { useEffect, useState } from "react";

/**
 * useDebounce - delay value updates until input stops changing
 * for `delay` ms. Useful for search inputs, auto-save, or
 * filters that need throttling to the server.
 *
 * Example:
 *   const [query, setQuery] = useState("");
 *   const debounced = useDebounce(query, 300);
 *   useEffect(() => { fetchResults(debounced); }, [debounced]);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
