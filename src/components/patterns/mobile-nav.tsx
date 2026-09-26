import * as React from "react";
import { LogOut, Settings, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";

export interface MobileNavItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  badge?: React.ReactNode;
}

export interface MobileNavSection {
  title?: string;
  items: MobileNavItem[];
}

export interface MobileNavProps {
  sections: MobileNavSection[];
  /** Trigger element that opens the drawer. */
  trigger: React.ReactNode;
  /** Drawer title. */
  title?: string;
  /** Subtitle under the title (e.g. user name). */
  subtitle?: string;
  /** Drawer side. Default: left. */
  side?: "left" | "right";
  /** Show footer with account info. Default: true. */
  showAccountFooter?: boolean;
  /** Additional footer content. */
  footer?: React.ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Handler for open state changes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * MobileNav - left/right drawer with navigation list.
 * Trigger element is controlled by the caller.
 */
function MobileNav({
  sections,
  trigger,
  title,
  subtitle,
  side = "left",
  showAccountFooter = true,
  footer,
  open,
  onOpenChange,
}: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side={side} className="flex flex-col">
        {(title || subtitle) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {subtitle && (
              <SheetDescription className="text-sm">
                {subtitle}
              </SheetDescription>
            )}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-2">
              {section.title && (
                <h6 className="px-1 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h6>
              )}
              <ul className="flex flex-col">
                {section.items.map((item) => {
                  const content = (
                    <>
                      {item.icon && (
                        <span
                          className={cn(
                            "inline-flex h-5 w-5 items-center justify-center",
                            item.active
                              ? "text-brand"
                              : "text-muted-foreground"
                          )}
                          aria-hidden
                        >
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1 text-left text-sm font-medium">
                        {item.label}
                      </span>
                      {item.badge}
                    </>
                  );
                  const className = cn(
                    "flex w-full min-h-[44px] items-center gap-3 rounded-md px-3 py-2 sd-tap transition-colors",
                    "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    item.active && "bg-muted"
                  );

                  if (item.href) {
                    return (
                      <li key={item.key}>
                        <a href={item.href} className={className}>
                          {content}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={item.onClick}
                        className={className}
                      >
                        {content}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {sIdx < sections.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </div>
        {showAccountFooter && (
          <SheetFooter>
            <div className="flex w-full flex-col gap-2">
              <Button
                variant="ghost"
                leftIcon={<User className="h-4 w-4" />}
                className="w-full justify-start"
              >
                Account
              </Button>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  leftIcon={<LogOut className="h-4 w-4" />}
                  className="w-full justify-start"
                >
                  Log out
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
        {footer && (
          <div className="mt-2 border-t border-border pt-3">{footer}</div>
        )}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          <Settings className="h-3 w-3" />
          <span>Serayu UI - by Serayu Digital</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNav };
