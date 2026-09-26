import { useEffect } from "react";

/**
 * useScrollLock - lock body scroll (or a target element) while active.
 *
 * Important for full-screen overlays like Sheet, Dialog,
 * CommandBarMobile, and StoryReelsViewer. Without the lock, the body
 * behind the overlay can still be scrolled when the user touches an
 * empty area.
 *
 * Features:
 *  - Global ref-count: supports nested body locks (Sheet inside Dialog
 *    inside Sheet). The body style is restored only when all locks
 *    are released.
 *  - Restores the original overflow/padding-right (anti-FOUC on unlock).
 *  - Computes scrollbar width to prevent layout shift.
 *  - SSR-safe: no-op when `document` is undefined.
 *  - Optional `target` element - lock a specific element, defaults to body.
 *
 * Example:
 *   function Modal({ open }) {
 *     useScrollLock(open);
 *     return open ? <DialogContent /> : null;
 *   }
 *
 *   // Lock a specific section (not body):
 *   const ref = useRef<HTMLDivElement>(null);
 *   useScrollLock(active, ref.current);
 */
let bodyLockCount = 0;
let savedBodyOverflow: string | null = null;
let savedBodyPaddingRight: string | null = null;

function acquireBodyLock(): void {
  if (bodyLockCount > 0) {
    bodyLockCount += 1;
    return;
  }
  const body = document.body;
  savedBodyOverflow = body.style.overflow;
  savedBodyPaddingRight = body.style.paddingRight;
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
  bodyLockCount = 1;
}

function releaseBodyLock(): void {
  if (bodyLockCount === 0) return;
  bodyLockCount -= 1;
  if (bodyLockCount > 0) return;
  const body = document.body;
  if (savedBodyOverflow !== null) body.style.overflow = savedBodyOverflow;
  if (savedBodyPaddingRight !== null) {
    body.style.paddingRight = savedBodyPaddingRight;
  }
  savedBodyOverflow = null;
  savedBodyPaddingRight = null;
}

function acquireTargetLock(target: HTMLElement): void {
  target.dataset["sdScrollLocked"] = "true";
  target.style.overflow = "hidden";
}

function releaseTargetLock(target: HTMLElement): void {
  if (!target.dataset["sdScrollLocked"]) return;
  delete target.dataset["sdScrollLocked"];
  target.style.overflow = "";
}

export function useScrollLock(
  active: boolean,
  target?: HTMLElement | null
): void {
  useEffect(() => {
    if (!active) return;
    if (typeof document === "undefined") return;

    const isBody = !target || target === document.body;
    if (isBody) {
      acquireBodyLock();
      return () => releaseBodyLock();
    }
    acquireTargetLock(target);
    return () => releaseTargetLock(target);
    // target is not in deps - usually from a ref and rarely changes
    // identity; the effect re-runs via active only.
  }, [active]);
}

/* Test-only export. Not for public consumers. */
export const __testHooks = {
  get bodyLockCount() {
    return bodyLockCount;
  },
  resetForTest() {
    bodyLockCount = 0;
    savedBodyOverflow = null;
    savedBodyPaddingRight = null;
  },
};
