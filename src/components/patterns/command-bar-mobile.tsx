import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";

/**
 * CommandBarMobile - bottom sheet with a list of actions (commands) that
 * slides up from the bottom when a button is tapped or long-pressed.
 * Unlike CommandPalette (a modal), this slides in like the iOS share sheet.
 *
 * Each group is rendered as a labeled section. Items can include an icon,
 * a description, and destructive styling (danger tone).
 *
 * Example:
 *   <CommandBarMobile
 *     open={open}
 *     onOpenChange={setOpen}
 *     title="Quick actions"
 *     groups={[
 *       {
 *         label: "Share",
 *         items: [
 *           { id: "copy", label: "Copy link", icon: <Copy />, onSelect: copy },
 *           { id: "share-wa", label: "WhatsApp", icon: <MessageCircle />, onSelect: share },
 *         ],
 *       },
 *       {
 *         label: "More",
 *         items: [
 *           { id: "del", label: "Delete", destructive: true, onSelect: del },
 *         ],
 *       },
 *     ]}
 *   />
 */

export interface CommandBarMobileItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface CommandBarMobileGroup {
  label: string;
  items: CommandBarMobileItem[];
}

export type CommandBarSnap = "small" | "medium" | "full";

export interface CommandBarMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandBarMobileGroup[];
  title?: string;
  /**
   * Available snap points. Default ["medium"].
   *
   * - 'small':  60vh - for 2-3 compact items.
   * - 'medium': 75vh - for 4-7 items.
   * - 'full':   92vh - for long lists / multi-group.
   *
   * The effective sheet height equals the last snap point. The drag
   * handle appears when the array has more than 1 snap point (handled
   * by the Sheet component).
   */
  snapPoints?: CommandBarSnap[];
  /** Height of the last snap point = sheet height. */
  className?: string;
  /** Show the drag handle (default true). */
  showHandle?: boolean;
}

const snapHeight: Record<CommandBarSnap, string> = {
  small: "60vh",
  medium: "75vh",
  full: "92vh",
};

function CommandBarMobile({
  open,
  onOpenChange,
  groups,
  title,
  snapPoints = ["medium"],
  className,
  showHandle = true,
}: CommandBarMobileProps) {
  const handleSelect = (item: CommandBarMobileItem) => {
    if (item.disabled) return;
    // Close the sheet after pick, then run onSelect so the caller can
    // trigger navigation/etc.
    onOpenChange(false);
    // Defer briefly so the close animation starts first.
    window.setTimeout(() => {
      try {
        item.onSelect();
      } catch {
        /* swallow */
      }
    }, 50);
  };

  const lastSnap = snapPoints[snapPoints.length - 1] ?? "medium";
  const maxHeight = snapHeight[lastSnap];

  // Render once the opening animation finishes so focus stays on the
  // content (skipped for now; we rely on Radix's automatic focus from Sheet).
  void showHandle;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "flex flex-col gap-3 px-2 pb-6 pt-2",
          maxHeight,
          className
        )}
        showCloseButton={false}
      >
        {/* iOS-style drag handle. */}
        <div className="mx-auto h-1.5 w-12 shrink-0 rounded-full bg-muted" aria-hidden />
        {title && (
          <SheetHeader>
            <SheetTitle className="px-2 text-center">{title}</SheetTitle>
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="flex flex-col gap-5">
            {groups.map((group, gi) => (
              <section key={gi} aria-labelledby={`cmd-group-${gi}`}>
                <h3
                  id={`cmd-group-${gi}`}
                  className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {group.label}
                </h3>
                <ul role="list" className="flex flex-col">
                  {group.items.map((item) => {
                    const tone = item.destructive
                      ? "text-danger"
                      : "text-foreground";
                    return (
                      <li key={item.id} role="listitem">
                        <button
                          type="button"
                          disabled={item.disabled}
                          onClick={() => handleSelect(item)}
                          className={cn(
                            "flex w-full min-h-[44px] items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm sd-tap transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            item.disabled
                              ? "cursor-not-allowed opacity-50"
                              : "hover:bg-muted",
                            tone
                          )}
                        >
                          {item.icon && (
                            <span
                              className={cn(
                                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                                item.destructive
                                  ? "bg-danger/10 text-danger"
                                  : "bg-muted text-foreground"
                              )}
                              aria-hidden
                            >
                              {item.icon}
                            </span>
                          )}
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-medium">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="truncate text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { CommandBarMobile };
