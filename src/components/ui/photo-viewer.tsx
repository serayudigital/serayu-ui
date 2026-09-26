import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * PhotoViewer - swipeable lightbox modal with pinch-zoom and
 * double-tap zoom.
 *
 * - Wraps Radix Dialog (ESC + focus trap + scroll lock built in).
 * - Horizontal swipe switches photos (touch + mouse drag).
 * - Pinch-zoom via two-finger touch, or Ctrl + wheel on desktop.
 * - Double-tap (touch) or double-click (mouse) toggles zoom.
 * - Vertical swipe down dismisses.
 * - Loop mode wraps the index from end to start.
 *
 * NOTE: body scroll is locked automatically by DialogPrimitive; the
 * gesture handler sets `touch-action: none` on the container so it does
 * not conflict with native scroll.
 *
 * Example:
 *   <PhotoViewer
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     images={[
 *       { src: "/photo-1.jpg", alt: "Photo 1" },
 *       { src: "/photo-2.jpg", alt: "Photo 2" },
 *     ]}
 *     startIndex={0}
 *   />
 */

export interface PhotoViewerImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface PhotoViewerProps {
  /** Open/closed status. */
  open: boolean;
  /** Called when open/close changes. */
  onOpenChange: (open: boolean) => void;
  /** Image list (minimum 1 item). */
  images: PhotoViewerImage[];
  /** Initial index when opened (default 0). */
  startIndex?: number;
  /** Wrap from end to start (default true). */
  loop?: boolean;
  /** Called when the active index changes. */
  onIndexChange?: (index: number) => void;
  /** Show prev/next buttons on desktop. Default true. */
  showNavigation?: boolean;
  className?: string;
}

const SWIPE_THRESHOLD = 50;
const DISMISS_THRESHOLD = 120;
const DOUBLE_TAP_DELAY = 280;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function PhotoViewer({
  open,
  onOpenChange,
  images,
  startIndex = 0,
  loop = true,
  onIndexChange,
  showNavigation = true,
  className,
}: PhotoViewerProps) {
  const [index, setIndex] = React.useState(
    Math.max(0, Math.min(startIndex, images.length - 1))
  );
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });

  // Reset the index when the viewer opens.
  React.useEffect(() => {
    if (open) {
      setIndex(Math.max(0, Math.min(startIndex, images.length - 1)));
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [open, startIndex, images.length]);

  // Notify index change.
  React.useEffect(() => {
    if (open) onIndexChange?.(index);
  }, [index, open, onIndexChange]);

  const goPrev = React.useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (index > 0) {
      setIndex(index - 1);
    } else if (loop) {
      setIndex(images.length - 1);
    }
  }, [index, images.length, loop]);

  const goNext = React.useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (index < images.length - 1) {
      setIndex(index + 1);
    } else if (loop) {
      setIndex(0);
    }
  }, [index, images.length, loop]);

  // Keyboard navigation.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext, onOpenChange]);

  const resetZoom = React.useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const setZoomClamped = React.useCallback((z: number) => {
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
    setZoom(next);
    if (next === 1) setPan({ x: 0, y: 0 });
  }, []);

  // Touch + mouse gesture handling.
  const containerRef = React.useRef<HTMLDivElement>(null);
  const touchStartRef = React.useRef<{
    x: number;
    y: number;
    time: number;
    pinchDist: number | null;
  } | null>(null);
  const panRef = React.useRef<{ x: number; y: number } | null>(null);
  const lastTapRef = React.useRef(0);

  const distance = (a: React.Touch, b: React.Touch) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const d = distance(e.touches[0], e.touches[1]);
      touchStartRef.current = {
        x: 0,
        y: 0,
        time: Date.now(),
        pinchDist: d,
      };
      return;
    }
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartRef.current = {
        x: t.clientX,
        y: t.clientY,
        time: Date.now(),
        pinchDist: null,
      };
      panRef.current = { x: pan.x, y: pan.y };
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    if (e.touches.length === 2 && touchStartRef.current.pinchDist) {
      e.preventDefault();
      const d = distance(e.touches[0], e.touches[1]);
      const scale = d / touchStartRef.current.pinchDist;
      setZoomClamped(zoom * scale);
      touchStartRef.current.pinchDist = d;
      return;
    }
    if (e.touches.length === 1 && zoom === 1) {
      const t = e.touches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      // Only track for swipe-dismiss detection at the end.
      touchStartRef.current.x = t.clientX;
      touchStartRef.current.y = t.clientY;
      // Prevent scroll while zoomed out (vertical scroll is handled by Radix).
      if (Math.abs(dy) > Math.abs(dx)) {
        e.preventDefault();
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    if (touchStartRef.current.pinchDist) {
      touchStartRef.current = null;
      return;
    }
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const elapsed = Date.now() - touchStartRef.current.time;

    // Double tap detection (zoom toggle).
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && elapsed < DOUBLE_TAP_DELAY) {
      const now = Date.now();
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        if (zoom > 1) resetZoom();
        else setZoomClamped(2);
        lastTapRef.current = 0;
        touchStartRef.current = null;
        return;
      }
      lastTapRef.current = now;
    }

    // Swipe dismiss (vertical down with a large threshold).
    if (Math.abs(dy) > DISMISS_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
      onOpenChange(false);
      touchStartRef.current = null;
      return;
    }

    // Swipe navigation (horizontal).
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) goPrev();
      else goNext();
    }
    touchStartRef.current = null;
  };

  // Mouse double-click zoom (desktop).
  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (zoom > 1) resetZoom();
    else setZoomClamped(2);
  };

  // Ctrl + wheel zoom (desktop).
  React.useEffect(() => {
    if (!open) return;
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = -e.deltaY / 100;
      setZoomClamped(zoom + delta * 0.5);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, zoom, setZoomClamped]);

  const currentImage = images[index];
  const totalCount = images.length;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[var(--sd-z-overlay)] bg-black/90"
          forceMount
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-[var(--sd-z-modal)] flex items-center justify-center p-0 bg-transparent",
            "border-0 outline-none",
            className
          )}
          aria-label="Photo viewer"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">
            {currentImage?.alt ?? `Photo ${index + 1} of ${totalCount}`}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Swipe horizontally to switch photo, pinch to zoom,
            double-tap to zoom in, swipe down to close.
          </DialogPrimitive.Description>

          <div
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onDoubleClick={onDoubleClick}
            className="relative flex h-full w-full items-center justify-center overflow-hidden select-none"
            style={{ touchAction: "none" }}
          >
            {currentImage && (
              <img
                key={`${index}-${currentImage.src}`}
                src={currentImage.src}
                alt={currentImage.alt ?? ""}
                draggable={false}
                className={cn(
                  "max-h-full max-w-full object-contain transition-transform duration-200",
                  zoom === 1
                    ? "ease-[cubic-bezier(0.2,0,0,1)]"
                    : "duration-100"
                )}
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${
                    pan.y / zoom
                  }px)`,
                  transformOrigin: "center center",
                }}
              />
            )}

            {/* Counter */}
            {totalCount > 1 && (
              <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white tabular-nums">
                {index + 1} / {totalCount}
              </div>
            )}

            {/* Close button */}
            <DialogPrimitive.Close
              aria-label="Close"
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white sd-tap transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>

            {/* Zoom controls (always visible for accessibility) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/60 p-1">
              <button
                type="button"
                onClick={() => setZoomClamped(zoom - 0.5)}
                disabled={zoom <= MIN_ZOOM}
                aria-label="Zoom out"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white sd-tap transition-colors hover:bg-white/20 disabled:opacity-40"
              >
                <span className="text-lg font-bold leading-none">-</span>
              </button>
              <button
                type="button"
                onClick={resetZoom}
                aria-label="Reset zoom"
                className="inline-flex h-9 min-w-[3rem] items-center justify-center rounded-full px-2 text-xs font-medium text-white tabular-nums sd-tap transition-colors hover:bg-white/20"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoomClamped(zoom + 0.5)}
                disabled={zoom >= MAX_ZOOM}
                aria-label="Zoom in"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white sd-tap transition-colors hover:bg-white/20 disabled:opacity-40"
              >
                <span className="text-lg font-bold leading-none">+</span>
              </button>
            </div>

            {/* Navigation arrows (desktop) */}
            {showNavigation && totalCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!loop && index === 0}
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-4 -translate-y-1/2 hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white sd-tap transition-colors hover:bg-black/80 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!loop && index === totalCount - 1}
                  aria-label="Next photo"
                  className="absolute top-1/2 right-4 -translate-y-1/2 hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white sd-tap transition-colors hover:bg-black/80 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { PhotoViewer };
