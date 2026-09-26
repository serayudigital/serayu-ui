import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface OnboardingSlide {
  /** Unique slide identifier. */
  id: string;
  /** Illustration icon (lucide or another component). */
  icon: React.ReactNode;
  /** Slide title. */
  title: string;
  /** Slide description. */
  description: string;
}

export interface OnboardingProps {
  slides: OnboardingSlide[];
  /** LocalStorage key for the completed flag (default "sd-onboarding-completed"). */
  storageKey?: string;
  /** Called when the user passes the last slide or picks Skip. */
  onComplete?: () => void;
  /** Text for the skip button in the top-right corner. */
  skipLabel?: string;
  /** Text for the Next CTA to the next slide. */
  nextLabel?: string;
  /** Text for the CTA on the last slide. */
  finishLabel?: string;
  /** Main container class. */
  className?: string;
}

/**
 * Onboarding - 3-4 slide carousel for first-launch users.
 *
 * - Stores completed status to localStorage so it doesn't appear again.
 * - Horizontal swipe or dot indicator tap to navigate.
 * - "Skip" button in the top-right; "Next" or "Start" CTA at the bottom.
 * - Solid brand tone (NOT a gradient).
 *
 * Example:
 *   <Onboarding
 *     slides={[
 *       { id: "1", icon: <Rocket />, title: "Welcome", description: "..." },
 *       { id: "2", icon: <Shield />, title: "Safe", description: "..." },
 *       { id: "3", icon: <Bell />, title: "Notifications", description: "..." },
 *     ]}
 *     onComplete={() => router.replace("/home")}
 *   />
 */
export function Onboarding({
  slides,
  storageKey = "sd-onboarding-completed",
  onComplete,
  skipLabel = "Skip",
  nextLabel = "Next",
  finishLabel = "Start",
  className,
}: OnboardingProps) {
  const [index, setIndex] = React.useState(0);
  const [drag, setDrag] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [visible, setVisible] = React.useState<boolean | null>(null);
  const [width, setWidth] = React.useState(0);
  const startX = React.useRef<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const done = window.localStorage.getItem(storageKey);
      setVisible(!done);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  React.useEffect(() => {
    if (!containerRef.current) return;
    setWidth(containerRef.current.clientWidth);
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const finish = React.useCallback(() => {
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Ignore quota / private mode errors.
    }
    setVisible(false);
    onComplete?.();
  }, [storageKey, onComplete]);

  const go = React.useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(slides.length - 1, next)));
    },
    [slides.length]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    startX.current = e.touches[0].clientX;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging || startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    setDrag(dx);
  };
  const onTouchEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const w = width > 0 ? width : containerRef.current?.clientWidth ?? 0;
    const dx = drag;
    setDrag(0);
    startX.current = null;
    if (w > 0 && Math.abs(dx) > w * 0.2) {
      go(index + (dx < 0 ? 1 : -1));
    }
  };

  if (visible === null || !visible) return null;
  const count = slides.length;
  const dragOffset = width > 0 ? (drag / width) * 100 : 0;
  const offsetPct = -index * 100 + dragOffset;
  const isLast = index === count - 1;

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Onboarding"
      className={cn(
        "fixed inset-0 z-[var(--sd-z-modal)] flex flex-col bg-background",
        className
      )}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div className="flex items-center justify-end px-4 pt-3 sd-safe-pt">
        <button
          type="button"
          onClick={finish}
          className="h-11 rounded-md px-3 text-sm font-medium text-muted-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {skipLabel}
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 flex"
          style={{
            transform: `translateX(${offsetPct}%)`,
            transition: dragging ? "none" : "transform 300ms cubic-bezier(0.2,0,0,1)",
          }}
        >
          {slides.map((s) => (
            <div
              key={s.id}
              className="flex w-full shrink-0 flex-col items-center justify-center gap-6 px-8 text-center"
              aria-hidden={false}
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:h-12 [&_svg]:w-12">
                {s.icon}
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {s.title}
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index ? "step" : undefined}
            onClick={() => go(i)}
            className={cn(
              "h-2 rounded-full transition-all sd-tap",
              i === index
                ? "w-6 bg-brand"
                : "w-2 bg-muted-foreground/40"
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 p-4 sd-safe-pb">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => (isLast ? finish() : go(index + 1))}
          className="inline-flex h-11 flex-1 max-w-xs items-center justify-center gap-1 rounded-md bg-brand px-4 text-sm font-medium text-brand-foreground sd-tap hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {isLast ? finishLabel : nextLabel}
          {!isLast ? <ChevronRight className="h-4 w-4" aria-hidden /> : null}
        </button>
      </div>
    </div>
  );
}
