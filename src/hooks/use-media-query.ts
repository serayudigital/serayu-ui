import { useEffect, useState } from "react";

/**
 * useMediaQuery - reactive matchMedia hook.
 * SSR-safe: defaults to false when window is not available.
 *
 * Example:
 *   const isDesktop = useMediaQuery("(min-width: 768px)");
 *   const isMobile  = useMediaQuery("(max-width: 767px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Serayu UI breakpoint preset (mobile-first).
 * Mobile  : < 768px
 * Tablet  : 768px - 1023px
 * Desktop : >= 1024px
 */
export const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
} as const;

/**
 * Convenience hook: true when width is >= 768px (tablet and up).
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/**
 * Convenience hook: true when width is < 768px.
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
