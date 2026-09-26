import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { SwipeableRow, type SwipeAction } from "@/components/ui/swipeable-row";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/cn";

export interface SwipeActionConfig {
  /** Action button label (shown on swipe). */
  label: React.ReactNode;
  /** Color tone. */
  tone?: SwipeAction["tone"];
  /** Show a confirmation before onSelect is called. */
  confirm?: boolean;
  /** Confirmation title. */
  confirmTitle?: string;
  /** Confirmation description. */
  confirmDescription?: string;
  /** Handler when confirmed. */
  onSelect?: () => void;
  /** Swipe area width (px). */
  width?: number;
  /** Disable action. */
  disabled?: boolean;
}

export interface SwipeActionsProps {
  children: React.ReactNode;
  /** Action when user swipes right (appears on left side). */
  leftActions?: SwipeActionConfig[];
  /** Action when user swipes left (appears on right side). */
  rightActions?: SwipeActionConfig[];
  /** Open snap threshold (px, default 64). */
  threshold?: number;
  /** Default width per action (px, default 88). */
  actionWidth?: number;
  className?: string;
}

/**
 * SwipeActions - list row with swipe gestures + destructive confirmation.
 *
 * - Wraps SwipeableRow with default "Archive" and "Delete" actions.
 * - Destructive actions (confirm=true) trigger an AlertDialog before
 *   onSelect is called.
 * - Solid tone (NOT a gradient).
 *
 * Example:
 *   <SwipeActions
 *     rightActions={[
 *       { label: "Archive", tone: "warning", onSelect: archive },
 *       { label: "Delete", tone: "danger", confirm: true,
 *         confirmTitle: "Delete message?", onSelect: handleDelete },
 *     ]}
 *   >
 *     <MessageRow message={msg} />
 *   </SwipeActions>
 */
export function SwipeActions({
  children,
  leftActions,
  rightActions,
  threshold,
  actionWidth,
  className,
}: SwipeActionsProps) {
  const [pending, setPending] = React.useState<SwipeActionConfig | null>(null);

  const map = (actions?: SwipeActionConfig[]): SwipeAction[] =>
    (actions ?? []).map((a) => ({
      label: a.label,
      tone: a.tone,
      width: a.width,
      disabled: a.disabled,
      onSelect: () => {
        if (a.confirm) {
          setPending(a);
          return;
        }
        a.onSelect?.();
      },
    }));

  const right = map(rightActions);
  const left = map(leftActions);

  return (
    <>
      <SwipeableRow
        className={className}
        leftActions={left}
        rightActions={right}
        threshold={threshold}
        actionWidth={actionWidth}
      >
        {children}
      </SwipeableRow>

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-danger/10 text-danger"
              >
                <AlertTriangle className="h-5 w-5" />
              </span>
              <AlertDialogTitle>
                {pending?.confirmTitle ?? "Confirm"}
              </AlertDialogTitle>
            </div>
            {pending?.confirmDescription ? (
              <AlertDialogDescription>
                {pending.confirmDescription}
              </AlertDialogDescription>
            ) : (
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                pending?.onSelect?.();
                setPending(null);
              }}
              className={cn(
                "bg-danger text-danger-foreground hover:bg-danger/90"
              )}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
