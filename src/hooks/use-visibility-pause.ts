import { useEffect, useState } from "react";

/**
 * useVisibilityPause - detect when the tab/browser window is inactive.
 *
 * Returns `true` when `document.visibilityState === "hidden"`.
 * Used for auto-pausing animations, videos, timers, or fetches when
 * the user switches tabs - to save resources and prevent timer drift.
 *
 * SSR-safe: on the server (window undefined) always returns `false`.
 *
 * Example use in a component with a requestAnimationFrame loop:
 *   function Stats() {
 *     const hidden = useVisibilityPause();
 *     useEffect(() => {
 *       if (hidden) return;
 *       let raf = requestAnimationFrame(tick);
 *       return () => cancelAnimationFrame(raf);
 *     }, [hidden]);
 *     // ...
 *   }
 *
 * Example use as a pause condition in a handler:
 *   const hidden = useVisibilityPause();
 *   function onTick() {
 *     if (hidden) return;
 *     advanceSlide();
 *   }
 */
export function useVisibilityPause(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Initial sync at mount (state may be stale if mount happens
    // after the tab is already hidden).
    setHidden(document.visibilityState === "hidden");

    const handler = () => {
      setHidden(document.visibilityState === "hidden");
    };

    document.addEventListener("visibilitychange", handler);
    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);

  return hidden;
}
