import { useEffect, useState } from "react";

/**
 * usePrefersReducedMotion - true when the user has requested reduced
 * motion via OS-level accessibility settings.
 *
 * Reactive: the value updates if the user toggles the setting at the
 * OS level. SSR-safe (returns false on the server).
 *
 * Useful for charts, carousels, story-reels auto-advance, and tour
 * animations. Pair with the `--sd-duration-*` motion tokens, which
 * are already zeroed automatically by `src/styles/tokens.css` when
 * `(prefers-reduced-motion: reduce)` matches.
 *
 * Example:
 *   const reduceMotion = usePrefersReducedMotion();
 *   const duration = reduceMotion ? 0 : 200;
 *   return <div style={{ transitionDuration: `${duration}ms` }} />;
 */
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReduce(event.matches);
    setReduce(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduce;
}
