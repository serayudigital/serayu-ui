import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * SwipeableRow - list row that supports horizontal swipe to reveal
 * actions on the left or right.
 *
 * - Uses touch + mouse events. Only horizontal gestures are honored
 *   (vertical scroll is preserved via a dy > dx guard).
 * - Default threshold is 64 px: gestures below the threshold spring
 *   back, gestures above the threshold snap to the open action.
 * - Optional haptic via navigator.vibrate on snap.
 *
 * Example:
 *   <SwipeableRow
 *     rightActions={[
 *       { label: "Archive", onSelect: handleArchive, tone: "warning" },
 *       { label: "Delete", onSelect: handleDelete, tone: "danger" },
 *     ]}
 *   >
 *     <ItemRow />
 *   </SwipeableRow>
 */

export interface SwipeAction {
  label: React.ReactNode;
  onSelect: () => void;
  /** Action tone (default "danger"). */
  tone?: "danger" | "warning" | "success" | "brand";
  /** Action width in px (default 88). */
  width?: number;
  /** Disable this action (default false). */
  disabled?: boolean;
}

export interface SwipeableRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Actions on the left (revealed by swiping right). */
  leftActions?: SwipeAction[];
  /** Actions on the right (revealed by swiping left). */
  rightActions?: SwipeAction[];
  /** Approximate distance required to snap the action open (px, default 64). */
  threshold?: number;
  /** Default width of each action when not set on SwipeAction (px, default 88). */
  actionWidth?: number;
  /** Disable all swipe interaction (default false). */
  disabled?: boolean;
  children: React.ReactNode;
}

const TONE_BG: Record<NonNullable<SwipeAction["tone"]>, string> = {
  danger: "bg-danger text-danger-foreground",
  warning: "bg-warning text-warning-foreground",
  success: "bg-success text-success-foreground",
  brand: "bg-brand text-brand-foreground",
};

type Direction = "left" | "right" | null;

export function SwipeableRow({
  className,
  leftActions = [],
  rightActions = [],
  threshold = 64,
  actionWidth = 88,
  disabled = false,
  children,
  ...props
}: SwipeableRowProps) {
  const [offset, setOffset] = React.useState(0);
  const [revealed, setRevealed] = React.useState<Direction>(null);
  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const startOffset = React.useRef(0);
  const direction = React.useRef<"h" | "v" | null>(null);
  const isDragging = React.useRef(false);

  const maxLeft = React.useMemo(
    () => leftActions.reduce((sum, a) => sum + (a.width ?? actionWidth), 0),
    [leftActions, actionWidth]
  );
  const maxRight = React.useMemo(
    () => rightActions.reduce((sum, a) => sum + (a.width ?? actionWidth), 0),
    [rightActions, actionWidth]
  );

  const clampOffset = React.useCallback(
    (n: number) => Math.max(-maxRight, Math.min(maxLeft, n)),
    [maxLeft, maxRight]
  );

  const close = () => {
    setOffset(0);
    setRevealed(null);
  };

  // Close when clicking outside / pressing Escape.
  React.useEffect(() => {
    if (!revealed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed]);

  const onStart = (clientX: number, clientY: number) => {
    if (disabled) return;
    startX.current = clientX;
    startY.current = clientY;
    startOffset.current = offset;
    direction.current = null;
    isDragging.current = true;
  };

  const onMove = (clientX: number, clientY: number) => {
    if (!isDragging.current || disabled) return;
    const dx = clientX - startX.current;
    const dy = clientY - startY.current;
    if (direction.current === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        direction.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      } else {
        return;
      }
    }
    if (direction.current === "v") return; // let the page scroll vertically
    const next = clampOffset(startOffset.current + dx);
    setOffset(next);
    setRevealed(next > 0 ? "right" : next < 0 ? "left" : null);
  };

  const onEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    direction.current = null;
    const abs = Math.abs(offset);
    if (abs < threshold) {
      close();
      return;
    }
    const directionFinal: Direction = offset > 0 ? "right" : "left";
    const target =
      directionFinal === "right"
        ? maxLeft
        : -maxRight;
    setOffset(target);
    setRevealed(directionFinal);
    // Haptic on snap (best-effort, no-op in unsupported browsers).
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch {
        // ignore
      }
    }
  };

  const handleAction = (action: SwipeAction) => {
    close();
    action.onSelect();
  };

  const transition = isDragging.current
    ? "none"
    : "transform 200ms cubic-bezier(0.2,0,0,1)";

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {/* Left actions (rendered behind, revealed by swipe right) */}
      {leftActions.length > 0 && (
        <div className="absolute inset-y-0 left-0 flex">
          {leftActions.map((a, i) => (
            <button
              key={i}
              type="button"
              disabled={a.disabled}
              onClick={() => handleAction(a)}
              className={cn(
                "flex items-center justify-center font-medium sd-tap transition-opacity hover:opacity-90 disabled:opacity-50",
                TONE_BG[a.tone ?? "danger"]
              )}
              style={{ width: a.width ?? actionWidth }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
      {/* Right actions (rendered behind, revealed by swipe left) */}
      {rightActions.length > 0 && (
        <div className="absolute inset-y-0 right-0 flex">
          {rightActions.map((a, i) => (
            <button
              key={i}
              type="button"
              disabled={a.disabled}
              onClick={() => handleAction(a)}
              className={cn(
                "flex items-center justify-center font-medium sd-tap transition-opacity hover:opacity-90 disabled:opacity-50",
                TONE_BG[a.tone ?? "danger"]
              )}
              style={{ width: a.width ?? actionWidth }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
      {/* Content */}
      <div
        className="relative bg-background sd-pan-y"
        style={{ transform: `translateX(${offset}px)`, transition }}
        onTouchStart={(e) => onStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => onMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={onEnd}
        onTouchCancel={onEnd}
        onMouseDown={(e) => onStart(e.clientX, e.clientY)}
        onMouseMove={(e) => {
          if (isDragging.current) onMove(e.clientX, e.clientY);
        }}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      >
        {children}
      </div>
    </div>
  );
}
