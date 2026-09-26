import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface FilterSheetProps {
  /** Controlled open state. */
  open?: boolean;
  /** Handler when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Trigger element. */
  trigger?: React.ReactNode;
  /** Sheet title. */
  title?: string;
  /** Filter content (e.g. checkbox, switch, radio group). */
  children?: React.ReactNode;
  /** Show the Reset button. Default: true. */
  showReset?: boolean;
  /** Label for the apply button. Default: "Apply". */
  applyLabel?: string;
  /** Label for the reset button. Default: "Reset". */
  resetLabel?: string;
  /** Apply handler. */
  onApply?: () => void;
  /** Reset handler. */
  onReset?: () => void;
}

/**
 * FilterSheet - sheet containing filters with Apply/Reset buttons in the footer.
 */
function FilterSheet({
  open,
  onOpenChange,
  trigger,
  title = "Filter",
  children,
  showReset = true,
  applyLabel = "Apply",
  resetLabel = "Reset",
  onApply,
  onReset,
}: FilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="bottom"
        className="flex max-h-[90vh] flex-col px-4 pb-6 pt-2"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Adjust filters to narrow down the results.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-3">{children}</div>
        <Separator />
        <div className="mt-3 flex items-center justify-between gap-2 pt-3">
          {showReset ? (
            <Button variant="ghost" onClick={onReset}>
              {resetLabel}
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={onApply}>{applyLabel}</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { FilterSheet };
