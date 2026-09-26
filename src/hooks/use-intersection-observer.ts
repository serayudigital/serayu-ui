import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Once the element becomes visible, stop observing and keep the entry.
   * Suitable for one-shot on-view animations (e.g. fade-in on scroll).
   */
  freezeOnceVisible?: boolean;
}

/**
 * useIntersectionObserver - observe when an element enters or leaves
 * the viewport.
 *
 * - SSR-safe: returns null when window is not available.
 * - `freezeOnceVisible: true` is suitable for one-shot on-view animations.
 * - Memoize `options` (root, rootMargin, threshold) at the caller so the
 *   observer is not recreated each render. Alternative: pass inline only
 *   when values are truly constant.
 *
 * Example:
 *   const ref = useRef<HTMLDivElement>(null);
 *   const entry = useIntersectionObserver(ref, { threshold: 0.5 });
 *   const visible = entry?.isIntersecting ?? false;
 */
export function useIntersectionObserver<T extends Element>(
  ref: RefObject<T | null>,
  options?: UseIntersectionObserverOptions
): IntersectionObserverEntry | null {
  const { freezeOnceVisible = false, ...init } = options ?? {};
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const frozenRef = useRef(false);

  // Stringify config so the observer is recreated only when values
  // change. threshold can be a number or a number[].
  const configKey = JSON.stringify(init);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;
    const node = ref.current;
    if (!node) return;
    if (frozenRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const next = entries[0];
        if (!next) return;
        setEntry(next);
        if (next.isIntersecting && freezeOnceVisible) {
          frozenRef.current = true;
          observer.disconnect();
        }
      },
      init
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, freezeOnceVisible, configKey, init]);

  return entry;
}
