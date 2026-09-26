import * as React from "react";
import { Play, ImageOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/cn";

export interface MediaItem {
  /** Unique identifier. */
  id: string;
  /** Media URL (image or video). */
  src: string;
  /** Alt text. */
  alt?: string;
  /** Media type. */
  type?: "image" | "video";
  /** Optional caption for the lightbox. */
  caption?: React.ReactNode;
}

export interface MediaGridProps {
  items: MediaItem[];
  /** Column count (default 3). */
  columns?: 2 | 3 | 4;
  /** Gap between cells as a Tailwind class (default "gap-1"). */
  gapClass?: string;
  className?: string;
}

/**
 * MediaGrid - thumbnail grid in the Instagram style with a Dialog lightbox.
 *
 * - 2, 3, or 4 columns (default 3) with aspect-square.
 * - Tap a cell to open the Dialog with full-size media.
 * - Native lazy-load (`loading="lazy"`); can be combined with
 *   useIntersectionObserver for extra optimization.
 * - Solid tone (NOT a gradient).
 *
 * Example:
 *   <MediaGrid items={photos} columns={3} />
 */
export function MediaGrid({
  items,
  columns = 3,
  gapClass = "gap-1",
  className,
}: MediaGridProps) {
  const colsClass: Record<2 | 3 | 4, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <ul
      className={cn(
        "grid",
        colsClass[columns],
        gapClass,
        className
      )}
      aria-label="Media gallery"
    >
      {items.map((item) => (
        <li key={item.id} className="relative">
          <MediaCell item={item} />
        </li>
      ))}
    </ul>
  );
}

function MediaCell({ item }: { item: MediaItem }) {
  const [error, setError] = React.useState(false);
  const isVideo = item.type === "video";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={item.alt ?? "Open media"}
          className="group relative block aspect-square w-full overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {error ? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageOff className="h-6 w-6" aria-hidden />
            </div>
          ) : (
            <img
              src={item.src}
              alt={item.alt ?? ""}
              loading="lazy"
              decoding="async"
              onError={() => setError(true)}
              className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
            />
          )}

          {isVideo ? (
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground">
                <Play className="h-4 w-4" />
              </span>
            </span>
          ) : null}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-transparent p-0 border-none shadow-none">
        <DialogTitle className="sr-only">{item.alt ?? "Media"}</DialogTitle>
        {isVideo ? (
          <video
            src={item.src}
            controls
            autoPlay
            className="max-h-[80vh] w-full rounded-md bg-black"
          />
        ) : (
          <img
            src={item.src}
            alt={item.alt ?? ""}
            className="max-h-[80vh] w-full rounded-md object-contain"
          />
        )}
        {item.caption ? (
          <div className="mt-2 text-center text-xs text-foreground/90">
            {item.caption}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
