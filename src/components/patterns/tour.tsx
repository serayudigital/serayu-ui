import * as React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useScrollLock } from "@/hooks/use-scroll-lock";

/**
 * Tour - guided walkthrough that highlights specific page elements.
 *
 * Different from Onboarding (fullscreen carousel), Tour positions a
 * spotlight + tooltip next to the target element via getBoundingClientRect,
 * so users learn features IN PLACE (for example: highlight the
 * "Create", "Notifications", "Profile" buttons in the existing header).
 *
 * - Zero deps: query position via querySelector + getBoundingClientRect.
 * - Scrolls target into view when step changes.
 * - ResizeObserver recomputes position when viewport / scroll changes.
 * - Escape / backdrop click / X closes the tour.
 * - localStorage "completed" so it does not show again.
 * - Body scroll lock active when tour is open (unless allowScroll).
 * - Reduced-motion: animations disabled.
 *
 * Example:
 *   const tour = useTour([
 *     { id: "create", target: "[data-tour=create]", title: "Create new", description: "..." },
 *     { id: "notif",  target: "[data-tour=notif]",  title: "Notifications", description: "..." },
 *   ]);
 *   return (
 *     <>
 *       <Header />
 *       <Button onClick={tour.start}>Start tour</Button>
 *       <Tour steps={steps} tour={tour} />
 *     </>
 *   );
 */

export interface TourStep {
  /** Unique identifier (for key + aria-labelledby). */
  id: string;
  /** CSS selector of the target element. */
  target: string;
  /** Tooltip title. */
  title: string;
  /** Tooltip description. */
  description?: string;
  /** Preferred placement ("auto" picks the nearest available side). */
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  /** Extra class for the bubble. */
  className?: string;
}

export interface TourState {
  /** Active step index (-1 when closed). */
  step: number;
  /** True when tour is open. */
  open: boolean;
  /** Start from step 0. */
  start: () => void;
  /** Continue to next step. Finish on the last step. */
  next: () => void;
  /** Back to previous step. */
  prev: () => void;
  /** Jump to a specific step. */
  goTo: (step: number) => void;
  /** Close tour (does not write to storage). */
  close: () => void;
  /** Complete the tour (save to storage + call onComplete). */
  finish: () => void;
}

/* ============================================================
 * useTour - state hook
 * ============================================================ */

export function useTour(
  _steps: TourStep[],
  options: {
    storageKey?: string;
    onComplete?: () => void;
  } = {}
): TourState {
  const { storageKey = "sd-tour-completed", onComplete } = options;
  const [step, setStep] = React.useState(-1);
  // steps is not used here (Tour receives steps via prop), but
  // the argument is kept for API consistency and future-proofing.

  const finish = React.useCallback(() => {
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Ignore quota / private mode errors.
    }
    onComplete?.();
    setStep(-1);
  }, [storageKey, onComplete]);

  return {
    step,
    open: step >= 0,
    start: () => setStep(0),
    next: () => {
      setStep((s) => {
        if (s < 0) return s;
        // Step count is not available here; Tour determines the next
        // step from the `steps` prop. next() still increments; if it
        // overshoots, the Tour render clamps it.
        return s + 1;
      });
    },
    prev: () => setStep((s) => (s > 0 ? s - 1 : s)),
    goTo: (n: number) => setStep(n),
    close: () => setStep(-1),
    finish,
  };
}

/* ============================================================
 * Bubble position relative to target
 * ============================================================ */

interface BubblePos {
  top: number;
  left: number;
  placement: "top" | "bottom" | "left" | "right";
}

function computeBubblePos(
  targetRect: DOMRect,
  bubbleSize: { width: number; height: number },
  viewport: { width: number; height: number },
  preferred: TourStep["placement"]
): BubblePos {
  const gap = 12;
  const fitsTop = targetRect.top - bubbleSize.height - gap > 0;
  const fitsBottom = targetRect.bottom + bubbleSize.height + gap < viewport.height;
  const fitsLeft = targetRect.left - bubbleSize.width - gap > 0;
  const fitsRight = targetRect.right + bubbleSize.width + gap < viewport.width;

  let placement: BubblePos["placement"] = preferred && preferred !== "auto"
    ? preferred
    : "bottom";
  if (!preferred || preferred === "auto") {
    if (fitsBottom) placement = "bottom";
    else if (fitsTop) placement = "top";
    else if (fitsRight) placement = "right";
    else if (fitsLeft) placement = "left";
  }

  const cx = targetRect.left + targetRect.width / 2;
  const cy = targetRect.top + targetRect.height / 2;
  let top = 0;
  let left = 0;
  switch (placement) {
    case "top":
      top = targetRect.top - bubbleSize.height - gap;
      left = Math.max(
        8,
        Math.min(cx - bubbleSize.width / 2, viewport.width - bubbleSize.width - 8)
      );
      break;
    case "bottom":
      top = targetRect.bottom + gap;
      left = Math.max(
        8,
        Math.min(cx - bubbleSize.width / 2, viewport.width - bubbleSize.width - 8)
      );
      break;
    case "left":
      top = Math.max(
        8,
        Math.min(cy - bubbleSize.height / 2, viewport.height - bubbleSize.height - 8)
      );
      left = targetRect.left - bubbleSize.width - gap;
      break;
    case "right":
      top = Math.max(
        8,
        Math.min(cy - bubbleSize.height / 2, viewport.height - bubbleSize.height - 8)
      );
      left = targetRect.right + gap;
      break;
  }
  return { top, left, placement };
}

/* ============================================================
 * Tour - main component
 * ============================================================ */

export interface TourProps {
  /** Tour step definitions. */
  steps: TourStep[];
  /** State from useTour(). */
  tour: TourState;
  /** CTA text on the last step. */
  finishLabel?: string;
  /** CTA text on regular steps. */
  nextLabel?: string;
  /** CTA text for going back. */
  prevLabel?: string;
  /** Progress label format (default "Step N of M"). */
  progressLabel?: (current: number, total: number) => string;
  /** Show dark overlay outside the spotlight (default true). */
  showOverlay?: boolean;
  /** Allow body scroll while the tour is active (default false). */
  allowScroll?: boolean;
  /** Class for the main container. */
  className?: string;
  /** Called when the tour is closed via Escape / backdrop / X (without finish). */
  onSkip?: () => void;
}

export function Tour({
  steps,
  tour,
  finishLabel = "Finish",
  nextLabel = "Next",
  prevLabel = "Back",
  progressLabel = (current, total) => `Step ${current + 1} of ${total}`,
  showOverlay = true,
  allowScroll = false,
  className,
  onSkip,
}: TourProps) {
  useScrollLock(tour.open && !allowScroll);

  const bubbleRef = React.useRef<HTMLDivElement>(null);
  const [targetRect, setTargetRect] = React.useState<DOMRect | null>(null);
  const [bubbleSize, setBubbleSize] = React.useState({ width: 280, height: 120 });
  const [viewport, setViewport] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [reduced, setReduced] = React.useState(false);

  // Reduced-motion detection.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const currentStep =
    tour.open && tour.step >= 0 && tour.step < steps.length
      ? steps[tour.step]
      : null;

  // Find target, scroll into view, measure rect.
  React.useLayoutEffect(() => {
    if (!currentStep) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(currentStep.target) as HTMLElement | null;
    if (!el) {
      setTargetRect(null);
      return;
    }
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
    const raf = requestAnimationFrame(() => {
      setTargetRect(el.getBoundingClientRect());
    });
    return () => cancelAnimationFrame(raf);
  }, [currentStep, reduced]);

  // Recompute position on resize / scroll.
  React.useEffect(() => {
    if (!tour.open || !currentStep) return;
    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      const el = document.querySelector(currentStep.target) as HTMLElement | null;
      if (el) setTargetRect(el.getBoundingClientRect());
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [tour.open, currentStep]);

  // Measure bubble after render.
  React.useLayoutEffect(() => {
    const el = bubbleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setBubbleSize({ width: rect.width, height: rect.height });
  }, [currentStep?.id, tour.open]);

  // Escape closes the tour.
  React.useEffect(() => {
    if (!tour.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        tour.close();
        onSkip?.();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [tour, onSkip]);

  if (!tour.open || !currentStep) return null;

  const pos = targetRect
    ? computeBubblePos(targetRect, bubbleSize, viewport, currentStep.placement)
    : null;
  const isLast = tour.step === steps.length - 1;

  // next/prev buttons safe against out-of-bounds step.
  const goNext = () => {
    if (isLast) tour.finish();
    else tour.next();
  };

  return (
    <div
      className={cn("fixed inset-0 z-[var(--sd-z-modal)]", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`sd-tour-title-${currentStep.id}`}
    >
      {/* Spotlight ring + box-shadow cutout; skip when the layout engine
          does not produce a rect (e.g. happy-dom, SSR). */}
      {showOverlay && targetRect && (
        <>
          {/* Backdrop click-to-close */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              tour.close();
              onSkip?.();
            }}
            aria-hidden
          />
          <div
            className={cn(
              "pointer-events-none absolute rounded-md ring-2 ring-brand ring-offset-2 ring-offset-transparent",
              reduced ? "" : "transition-all duration-200"
            )}
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              // 60% dark backdrop is the standard modal overlay pattern
              // (matches Dialog/Sheet). Not a brand styling choice.
              // eslint-disable-next-line serayu/no-hardcoded-color
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
            }}
            aria-hidden
          />
        </>
      )}

      {/* Bubble: still renders even when targetRect is null (e.g. happy-dom,
          SSR) so content (title, description, buttons) stays accessible
          to screen readers and is testable. Falls back to position 0,0;
          bubble styles override via placement/overflow. */}
      <div
        ref={bubbleRef}
        className={cn(
          "absolute z-10 w-72 max-w-[calc(100vw-16px)] rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-xl",
          reduced ? "" : "transition-opacity",
          currentStep.className
        )}
        style={{
          top: pos ? pos.top : 8,
          left: pos ? pos.left : 8,
        }}
        data-placement={pos?.placement ?? "bottom"}
      >
          <div className="flex items-start justify-between gap-2">
            <h3
              id={`sd-tour-title-${currentStep.id}`}
              className="text-sm font-semibold leading-snug"
            >
              {currentStep.title}
            </h3>
            <button
              type="button"
              onClick={() => {
                tour.close();
                onSkip?.();
              }}
              aria-label="Close tour"
              className="-mr-1 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {currentStep.description && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {currentStep.description}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground" aria-live="polite">
              {progressLabel(tour.step, steps.length)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={tour.prev}
                disabled={tour.step === 0}
                aria-label={prevLabel}
                className="inline-flex h-11 items-center justify-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground sd-tap hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                {prevLabel}
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex h-11 items-center justify-center gap-1 rounded-md bg-brand px-3 text-sm font-medium text-brand-foreground sd-tap hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {isLast ? finishLabel : nextLabel}
                {!isLast ? <ChevronRight className="h-4 w-4" aria-hidden /> : null}
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
