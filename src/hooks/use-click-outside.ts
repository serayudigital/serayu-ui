import { useEffect, useRef, type RefObject } from "react";

export interface UseClickOutsideOptions {
  /**
   * Additional refs to ignore when detecting outside clicks.
   * Useful for trigger popovers rendered in a portal.
   */
  ignoreRefs?: Array<RefObject<HTMLElement | null>>;
  /** Only listen to mouse events (default: mouse + touch). */
  mouseOnly?: boolean;
}

/**
 * useClickOutside - call handler when a click or tap occurs outside
 * the ref element. Supports portal-rendered triggers via `ignoreRefs`.
 *
 * Example:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useClickOutside(ref, () => setOpen(false));
 *
 *   // With a portal-rendered trigger
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *   useClickOutside(ref, () => setOpen(false), { ignoreRefs: [triggerRef] });
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  options?: UseClickOutsideOptions
): void {
  const ignoreRefs = options?.ignoreRefs;
  const mouseOnly = options?.mouseOnly ?? false;

  // Store handler and ignoreRefs in refs so the listener stays stable.
  const handlerRef = useRef(handler);
  const ignoreRefsRef = useRef(ignoreRefs);
  handlerRef.current = handler;
  ignoreRefsRef.current = ignoreRefs;

  useEffect(() => {
    if (typeof document === "undefined") return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (ref.current?.contains(target)) return;
      for (const ignore of ignoreRefsRef.current ?? []) {
        if (ignore.current?.contains(target)) return;
      }
      handlerRef.current(event);
    };

    document.addEventListener("mousedown", listener);
    if (!mouseOnly) {
      document.addEventListener("touchstart", listener);
    }
    return () => {
      document.removeEventListener("mousedown", listener);
      if (!mouseOnly) {
        document.removeEventListener("touchstart", listener);
      }
    };
  }, [ref, mouseOnly]);
}
