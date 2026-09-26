import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Carousel - horizontal pager built on native CSS scroll-snap. Zero deps.
 *
 * - Responsive `itemsPerView` via the { sm, md, lg } object.
 * - Optional loop wrap-around (default false).
 * - Optional autoplay, paused on hover or focus inside the carousel.
 * - Optional dots indicator and prev/next arrow buttons.
 * - Reduced motion: autoplay is disabled; snap behavior stays on.
 *
 * CSS `scroll-snap-type: x mandatory` + `scroll-snap-align: start` for
 * smooth paging (GPU-accelerated, no animation library).
 *
 * Example:
 *   <Carousel
 *     items={photos}
 *     renderItem={(photo) => <img src={photo.url} alt={photo.alt} />}
 *     itemsPerView={{ sm: 1, md: 2, lg: 3 }}
 *     gap={16}
 *     showDots
 *     showArrows
 *   />
 */

export interface CarouselItem {
  /** Unique identifier (used for key + aria-label). */
  id: string | number;
}

export interface CarouselProps<T extends CarouselItem> {
  items: T[];
  /** Render each item. */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Items per viewport. Number (fixed) or responsive object. */
  itemsPerView?: number | { sm?: number; md?: number; lg?: number };
  /** Gap between items in px (default 16). */
  gap?: number;
  /** Wrap to the first item after the last. */
  loop?: boolean;
  /** Auto-advance with interval (ms). Pauses on hover or focus. */
  autoplay?: { intervalMs: number; pauseOnHover?: boolean };
  /** Show the dots indicator. */
  showDots?: boolean;
  /** Show the prev/next buttons. */
  showArrows?: boolean;
  /** Container width (default "100%"). */
  width?: number | string;
  /** Container height (default "auto"). Use a number for a fixed height. */
  height?: number | string;
  /** Aria label for the region. */
  ariaLabel?: string;
  /** Additional class for the outer container. */
  className?: string;
  /** Called when the active index changes. */
  onIndexChange?: (index: number) => void;
}

/** Resolve `itemsPerView` to a number on the client (use `md` as the SSR default). */
function resolveItemsPerView(
  spec: number | { sm?: number; md?: number; lg?: number } | undefined
): number {
  if (spec === undefined) return 1;
  if (typeof spec === "number") return spec;
  // Use the largest breakpoint that matches the client width.
  if (typeof window === "undefined") return spec.sm ?? 1;
  const width = window.innerWidth;
  if (width >= 1024 && spec.lg) return spec.lg;
  if (width >= 768 && spec.md) return spec.md;
  return spec.sm ?? 1;
}

export function Carousel<T extends CarouselItem>({
  items,
  renderItem,
  itemsPerView,
  gap = 16,
  loop = false,
  autoplay,
  showDots = true,
  showArrows = true,
  width = "100%",
  height = "auto",
  ariaLabel = "Carousel",
  className,
  onIndexChange,
}: CarouselProps<T>) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const perView = resolveItemsPerView(itemsPerView);
  const pageCount = Math.max(1, items.length - perView + 1);

  // Reduced-motion detection.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Scroll handler: derive activeIndex from the current scroll position.
  const handleScroll = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const itemWidth = (el.scrollWidth - gap * (perView - 1)) / items.length;
    const index = Math.round(el.scrollLeft / (itemWidth + gap));
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    if (clamped !== activeIndex) {
      setActiveIndex(clamped);
      onIndexChange?.(clamped);
    }
  }, [activeIndex, gap, items.length, onIndexChange, perView]);

  // Autoplay.
  React.useEffect(() => {
    if (!autoplay || reduced || paused) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1;
        if (next >= items.length) {
          return loop ? 0 : prev;
        }
        return next;
      });
    }, autoplay.intervalMs);
    return () => window.clearInterval(id);
  }, [autoplay, items.length, loop, paused, reduced]);

  // Sync scroll position when activeIndex changes via autoplay / programmatically.
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const itemWidth = (el.scrollWidth - gap * (perView - 1)) / items.length;
    const target = activeIndex * (itemWidth + gap);
    if (Math.abs(el.scrollLeft - target) > 1) {
      el.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
    }
  }, [activeIndex, gap, items.length, perView, reduced]);

  const goTo = (index: number) => {
    if (loop) {
      setActiveIndex(((index % items.length) + items.length) % items.length);
    } else {
      setActiveIndex(Math.max(0, Math.min(index, items.length - 1)));
    }
  };
  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cn("relative", className)}
      style={{ width, height }}
      onMouseEnter={
        autoplay?.pauseOnHover ? () => setPaused(true) : undefined
      }
      onMouseLeave={
        autoplay?.pauseOnHover ? () => setPaused(false) : undefined
      }
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Scroll-snap track. */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-2"
        style={{
          scrollbarWidth: "thin",
          gap: `${gap}px`,
        }}
        tabIndex={0}
        aria-live="polite"
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="shrink-0 snap-start"
            style={{
              flexBasis: `calc((100% - ${gap * (perView - 1)}px) / ${perView})`,
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {/* Prev/Next arrows. */}
      {showArrows && items.length > perView && (
        <>
          <button
            type="button"
            onClick={goPrev}
            disabled={!loop && activeIndex === 0}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:cursor-not-allowed sd-tap"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!loop && activeIndex >= items.length - 1}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:cursor-not-allowed sd-tap"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots indicator. */}
      {showDots && items.length > perView && (
        <div
          className="mt-3 flex justify-center gap-1.5"
          aria-hidden
        >
          {Array.from({ length: pageCount }).map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all sd-tap",
                  isActive
                    ? "w-6 bg-brand"
                    : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
