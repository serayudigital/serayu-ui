import * as React from "react";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useVisibilityPause } from "@/hooks/use-visibility-pause";
import { useScrollLock } from "@/hooks/use-scroll-lock";

/**
 * StoryReelsViewer - vertical pager in the style of Instagram/TikTok stories.
 * Slides auto-advance one by one via IntersectionObserver + scroll snap.
 *
 * Interactions:
 *   - Tap left zone (1/3 of screen) to go to previous slide.
 *   - Tap right zone (2/3 of screen) to go to next slide.
 *   - Long-press to pause; release to resume.
 *   - Horizontal swipe dismisses the modal.
 *   - Respects prefers-reduced-motion (animations pause/stop, taps still work).
 *   - Auto-pauses when the tab/browser is hidden (Page Visibility API) via
 *     the internal `useVisibilityPause` hook.
 *
 * Adaptive pattern: image or video, optional overlay (CTA sticker).
 * The caller is responsible for hosting video/image files (CDN, blob, etc.).
 *
 * Example:
 *   <StoryReelsViewer
 *     open={open}
 *     onOpenChange={setOpen}
 *     slides={[
 *       { id: "1", type: "image", src: "/a.jpg", durationMs: 5000,
 *         overlay: <CtaButton>View product</CtaButton> },
 *       { id: "2", type: "video", src: "/b.mp4" },
 *     ]}
 *     onComplete={() => setOpen(false)}
 *   />
 */

export interface StoryReelsSlide {
  id: string;
  type: "image" | "video";
  src: string;
  alt?: string;
  /** Auto-advance duration in ms (default 5000). */
  durationMs?: number;
  /** Overlay (CTA, sticker, text) shown on top of the slide. */
  overlay?: React.ReactNode;
}

export interface StoryReelsViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slides: StoryReelsSlide[];
  startIndex?: number;
  onIndexChange?: (index: number) => void;
  onComplete?: () => void;
  className?: string;
}

const SWIPE_THRESHOLD = 80;
const VISIBILITY_THRESHOLD = 0.6;

export function StoryReelsViewer({
  open,
  onOpenChange,
  slides,
  startIndex = 0,
  onIndexChange,
  onComplete,
  className,
}: StoryReelsViewerProps) {
  const [current, setCurrent] = React.useState(startIndex);
  const [progress, setProgress] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const hidden = useVisibilityPause();
  // Lock body scroll while the full-screen overlay is active.
  useScrollLock(open);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const slideRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = React.useRef<Array<HTMLVideoElement | null>>([]);
  const rafRef = React.useRef<number | null>(null);
  const startedAtRef = React.useRef<number>(0);
  const elapsedRef = React.useRef<number>(0);
  const currentDurationRef = React.useRef<number>(5000);
  const holdTimerRef = React.useRef<number | null>(null);
  const isHoldRef = React.useRef(false);
  const touchStartX = React.useRef<number | null>(null);

  // prefers-reduced-motion detection.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Reset state when open/slide changes.
  React.useEffect(() => {
    if (!open) return;
    setCurrent(startIndex);
    setProgress(0);
    setPaused(false);
    elapsedRef.current = 0;
  }, [open, startIndex]);

  // Pause all videos except the one currently active.
  React.useEffect(() => {
    if (!open) return;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i !== current) {
        v.pause();
        v.currentTime = 0;
      }
    });
    const active = videoRefs.current[current];
    if (active && slides[current]?.type === "video") {
      active.currentTime = 0;
      const playPromise = active.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          /* autoplay was blocked, ignore */
        });
      }
    }
  }, [open, current, slides]);

  // Set up IO to detect the active slide.
  React.useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number((visible[0].target as HTMLElement).dataset.index);
          if (!Number.isNaN(idx)) {
            setCurrent((prev) => {
              if (prev !== idx) {
                elapsedRef.current = 0;
                setProgress(0);
              }
              return idx;
            });
            onIndexChange?.(idx);
          }
        }
      },
      { root: container, threshold: [VISIBILITY_THRESHOLD] }
    );
    slideRefs.current.forEach((el) => {
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [open, slides.length, onIndexChange]);

  // Auto-advance loop.
  React.useEffect(() => {
    if (!open) return;
    const slide = slides[current];
    if (!slide) return;
    const isVideo = slide.type === "video";
    const dur = slide.durationMs ?? 5000;
    currentDurationRef.current = dur;

    if (paused || reduced || hidden) {
      cancelAnimationFrame(rafRef.current ?? 0);
      return;
    }

    // Video: wait for the ended event; image: use a timer.
    if (isVideo) {
      const v = videoRefs.current[current];
      if (!v) return;
      const handleEnded = () => advanceNext();
      v.addEventListener("ended", handleEnded);
      return () => v.removeEventListener("ended", handleEnded);
    }

    // Image: requestAnimationFrame loop update progress bar.
    startedAtRef.current = performance.now() - elapsedRef.current;
    const tick = (now: number) => {
      const elapsed = now - startedAtRef.current;
      elapsedRef.current = Math.min(elapsed, dur);
      const ratio = elapsedRef.current / dur;
      setProgress(ratio);
      if (elapsed >= dur) {
        advanceNext();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [open, current, paused, reduced, hidden, slides]);

  const advanceNext = React.useCallback(() => {
    setCurrent((prev) => {
      const next = prev + 1;
      if (next >= slides.length) {
        onComplete?.();
        // Reset state before close (the next render will unmount it).
        elapsedRef.current = 0;
        setProgress(1);
        return prev;
      }
      elapsedRef.current = 0;
      setProgress(0);
      return next;
    });
  }, [slides.length, onComplete]);

  const goPrev = () => {
    setCurrent((p) => {
      const next = Math.max(0, p - 1);
      elapsedRef.current = 0;
      setProgress(0);
      return next;
    });
  };
  const goNext = () => advanceNext();

  // Tap to pause: a 200ms hold counts as a long-press.
  const handlePointerDown = () => {
    isHoldRef.current = false;
    holdTimerRef.current = window.setTimeout(() => {
      isHoldRef.current = true;
      setPaused(true);
    }, 200);
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isHoldRef.current) {
      setPaused(false);
      isHoldRef.current = false;
      return;
    }
    // Tap that isn't a hold: split the tap zone into 3 columns on screen.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.3) goPrev();
    else if (x > rect.width * 0.7) goNext();
    else {
      // middle: toggle pause.
      setPaused((p) => !p);
    }
  };

  // Horizontal swipe dismisses.
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const end = e.changedTouches[0]?.clientX ?? 0;
    const dx = end - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs((e.changedTouches[0]?.clientY ?? 0) - (touchStartX.current ?? 0))) {
      onOpenChange(false);
    }
    touchStartX.current = null;
  };

  // Sync slide container scroll position when current changes programmatically.
  React.useEffect(() => {
    if (!open) return;
    const el = slideRefs.current[current];
    const container = containerRef.current;
    if (!el || !container) return;
    const top = el.offsetTop - container.offsetTop;
    if (Math.abs(container.scrollTop - top) > 1) {
      container.scrollTo({ top, behavior: "smooth" });
    }
  }, [current, open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Story viewer"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-[var(--sd-z-modal)] bg-black text-white",
        className
      )}
    >
      {/* Close button. */}
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        aria-label="Close story"
        className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white sd-tap transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Progress bars. */}
      <div className="absolute inset-x-0 top-2 z-10 flex gap-1.5 px-3">
        {slides.map((_, i) => {
          const ratio =
            i < current ? 1 : i === current ? progress : 0;
          return (
            <div
              key={i}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <div
                className="absolute inset-y-0 left-0 bg-white"
                style={{
                  width: `${Math.min(100, ratio * 100)}%`,
                  transition:
                    i === current && !paused
                      ? "none"
                      : "width 120ms linear",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Slide container. */}
      <div
        ref={containerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-scroll"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            data-index={i}
            className="relative flex h-full min-h-[100dvh] w-full snap-start items-center justify-center"
          >
            {slide.type === "image" ? (
              <img
                src={slide.src}
                alt={slide.alt ?? ""}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={slide.src}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                muted
                preload={i === current ? "auto" : "metadata"}
                aria-label={slide.alt ?? ""}
              />
            )}
            {slide.overlay && (
              <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center px-4">
                {slide.overlay}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pause indicator. */}
      {paused && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-white">
            <Pause className="h-7 w-7" />
          </div>
        </div>
      )}

      {/* Nav buttons (desktop). */}
      <div className="pointer-events-none absolute inset-y-0 left-2 z-10 hidden items-center md:flex">
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          disabled={current === 0}
          aria-label="Previous slide"
          className="pointer-events-auto h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-2 z-10 hidden items-center md:flex">
        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          disabled={current === slides.length - 1}
          aria-label="Next slide"
          className="pointer-events-auto h-10 w-10 rounded-full bg-black/40 text-white hover:bg-black/60"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Resume hint shown while paused. */}
      {paused && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white/80">
          <span className="inline-flex items-center gap-1">
            <Play className="h-3 w-3" />
            jeda
          </span>
        </div>
      )}
    </div>
  );
}
