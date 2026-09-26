import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";

export interface BottomSheetProps {
  /** Controlled open state. */
  open?: boolean;
  /** Handler when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Trigger element. If provided, the sheet is controlled by the internal trigger. */
  trigger?: React.ReactNode;
  /** Sheet title. */
  title?: string;
  /** Optional description below the title. */
  description?: string;
  /** Sheet body (main content). */
  body?: React.ReactNode;
  /** Sheet footer (e.g. action buttons). */
  footer?: React.ReactNode;
  /** Add snap behavior with adjustable height. */
  snapPoints?: ("small" | "medium" | "full")[];
  /** ClassName for content. */
  className?: string;
}

const heightMap: Record<"small" | "medium" | "full", string> = {
  small: "max-h-[40vh]",
  medium: "max-h-[70vh]",
  full: "max-h-[90vh]",
};

/**
 * BottomSheet - sheet wrapper with snap points like an Android app.
 * Default opens from below with 50% screen height.
 */
function BottomSheet({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  body,
  footer,
  snapPoints,
  className,
}: BottomSheetProps) {
  const maxH =
    snapPoints && snapPoints.length > 0
      ? heightMap[snapPoints[snapPoints.length - 1]]
      : "max-h-[50vh]";
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="bottom"
        className={cn("flex flex-col px-4 pb-6 pt-2", maxH, className)}
      >
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && (
              <SheetDescription>{description}</SheetDescription>
            )}
          </SheetHeader>
        )}
        {body && <div className="flex-1 overflow-y-auto py-3">{body}</div>}
        {footer && (
          <div className="mt-3 flex flex-col-reverse gap-2 border-t border-border pt-3 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { BottomSheet };
