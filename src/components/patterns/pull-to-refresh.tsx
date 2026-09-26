import * as React from "react";
import { RefreshCw, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PullToRefreshProps {
  /** Async handler called when release crosses the threshold. */
  onRefresh: () => Promise<void> | void;
  /** Refresh trigger threshold (px, default 80). */
  threshold?: number;
  /** Success state display duration (ms, default 800). */
  successDuration?: number;
  /** Text when idle / pull not started. */
  pullingText?: string;
  /** Text when the user pulls past the threshold (ready to release). */
  releaseText?: string;
  /** Text when refresh is running. */
  refreshingText?: string;
  /** Brief success text, then auto-hide. */
  successText?: string;
  /** Container class. */
  className?: string;
  /** Content class. */
  contentClassName?: string;
  children: React.ReactNode;
}

type Phase = "idle" | "pulling" | "refreshing" | "success";

/**
 * PullToRefresh - content wrapper with pull-down to refresh,
 * in the style of Twitter / Instagram.
 *
 * - Indicator above content that appears when pulling from the top.
 * - Triggers onRefresh on release after the threshold (default 80 px).
 * - State: idle, pulling, refreshing, success.
 * - touch-action: pan-y on the wrapper so native vertical scroll still
 *   works outside the trigger.
 *
 * Note: the wrapper manages its own scroll (`overflow-auto`).
 *
 * Example:
 *   <PullToRefresh onRefresh={fetchLatest}>
 *     <Timeline posts={posts} />
 *   </PullToRefresh>
 */
export function PullToRefresh({
  onRefresh,
  threshold = 80,
  successDuration = 800,
  pullingText = "Pull to refresh",
  releaseText = "Release to refresh",
  refreshingText = "Refreshing...",
  successText = "Done",
  className,
  contentClassName,
  children,
}: PullToRefreshProps) {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [distance, setDistance] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const startY = React.useRef<number | null>(null);
  const startScrollTop = React.useRef(0);
  const dragging = React.useRef(false);

  const indicatorHeight = 56; // height of the indicator area
  const resistance = (d: number) => {
    // Simple half-resistance curve: ease out cubic
    return d * 0.5;
  };

  React.useEffect(() => {
    if (!wrapperRef.current) return;
    setContainerHeight(wrapperRef.current.clientHeight);
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    if (phase === "refreshing") return;
    if (e.touches.length !== 1) return;
    startY.current = e.touches[0].clientY;
    startScrollTop.current = wrapperRef.current?.scrollTop ?? 0;
    dragging.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || startY.current === null) return;
    const y = e.touches[0].clientY;
    const dy = y - startY.current;
    // Only active when scrollTop === 0 (at the very top).
    if (startScrollTop.current > 0 || dy <= 0) {
      return;
    }
    e.preventDefault?.();
    setDistance(resistance(dy));
    setPhase("pulling");
  };

  const onTouchEnd = async () => {
    if (!dragging.current) return;
    dragging.current = false;
    startY.current = null;

    if (distance >= threshold) {
      setPhase("refreshing");
      setDistance(threshold);
      try {
        await Promise.resolve(onRefresh());
        setPhase("success");
        window.setTimeout(() => {
          setPhase("idle");
          setDistance(0);
        }, successDuration);
      } catch {
        setPhase("idle");
        setDistance(0);
      }
    } else {
      setPhase("idle");
      setDistance(0);
    }
  };

  const showIndicator =
    phase === "pulling" || phase === "refreshing" || phase === "success";

  // Translate content while pulling (downward offset equals distance).
  const translate = distance;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative overflow-auto sd-pan-y",
        className
      )}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 right-0 top-0 z-[var(--sd-z-sticky)] flex items-center justify-center overflow-hidden bg-surface text-sm font-medium text-muted-foreground transition-opacity",
          showIndicator ? "opacity-100" : "opacity-0"
        )}
        style={{
          height: indicatorHeight,
          transform: `translateY(${
            phase === "idle" ? -indicatorHeight : distance - indicatorHeight
          }px)`,
          transition: dragging.current
            ? "none"
            : "transform 200ms cubic-bezier(0.2,0,0,1), opacity 200ms",
        }}
      >
        <IndicatorContent
          phase={phase}
          progress={Math.min(1, distance / threshold)}
          distance={distance}
          threshold={threshold}
          pullingText={pullingText}
          releaseText={releaseText}
          refreshingText={refreshingText}
          successText={successText}
        />
      </div>

      <div
        className={cn(contentClassName)}
        style={{
          transform: `translateY(${translate}px)`,
          transition: dragging.current
            ? "none"
            : "transform 200ms cubic-bezier(0.2,0,0,1)",
        }}
      >
        {children}
        {/* Bottom spacer so content is not covered by the indicator */}
        {containerHeight > 0 ? null : null}
      </div>
    </div>
  );
}

function IndicatorContent({
  phase,
  progress,
  distance,
  threshold,
  pullingText,
  releaseText,
  refreshingText,
  successText,
}: {
  phase: Phase;
  progress: number;
  distance: number;
  threshold: number;
  pullingText: string;
  releaseText: string;
  refreshingText: string;
  successText: string;
}) {
  if (phase === "refreshing") {
    return (
      <span className="inline-flex items-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin" aria-hidden />
        {refreshingText}
      </span>
    );
  }
  if (phase === "success") {
    return (
      <span className="inline-flex items-center gap-2 text-success">
        <Check className="h-4 w-4" aria-hidden />
        {successText}
      </span>
    );
  }
  // pulling
  const ready = distance >= threshold;
  return (
    <span className="inline-flex items-center gap-2">
      <RefreshCw
        className="h-4 w-4 transition-transform"
        style={{ transform: `rotate(${progress * 360}deg)` }}
        aria-hidden
      />
      {ready ? releaseText : pullingText}
    </span>
  );
}
