import * as React from "react";
import { cn } from "@/lib/cn";

export interface BottomNavItem {
  /** Unique item identifier. */
  key: string;
  /** Label below the icon. */
  label: string;
  /** Icon element (e.g. a lucide component). */
  icon: React.ReactNode;
  /** Click handler. If present, the item is rendered as a button. */
  onClick?: () => void;
  /** URL when used as a link. */
  href?: string;
  /** Small badge in the corner of the icon (e.g. notification). */
  badge?: React.ReactNode;
}

export interface BottomNavProps
  extends React.HTMLAttributes<HTMLElement> {
  items: BottomNavItem[];
  /** Currently active item key. */
  activeKey?: string;
  /** Called when an item is pressed. */
  onItemClick?: (key: string) => void;
  /** Show border-top. Default: true. */
  bordered?: boolean;
}

/**
 * BottomNav - mobile-app-style bottom navbar with 3-5 items.
 * Icon plus label, active state is solid (no gradient).
 */
const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>(
  (
    { className, items, activeKey, onItemClick, bordered = true, ...props },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        aria-label="Primary navigation"
        className={cn(
          "z-[var(--sd-z-sticky)] bg-background/95 backdrop-blur sd-safe-pb",
          bordered && "border-t border-border",
          className
        )}
        {...props}
      >
        <ul className="flex h-16 items-stretch justify-around">
          {items.map((item) => {
            const isActive = item.key === activeKey;
            const handle = () => {
              item.onClick?.();
              onItemClick?.(item.key);
            };
            const content = (
              <>
                <span className="relative">
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center transition-colors",
                      isActive ? "text-brand" : "text-muted-foreground"
                    )}
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                  {item.badge && (
                    <span className="absolute -right-1 -top-1">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "mt-1 truncate text-[10px] font-medium transition-colors",
                    isActive ? "text-brand" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </>
            );

            const className = cn(
              "flex min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 sd-tap transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            );

            if (item.href) {
              return (
                <li key={item.key} className="flex">
                  <a
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={className}
                  >
                    {content}
                  </a>
                </li>
              );
            }
            return (
              <li key={item.key} className="flex">
                <button
                  type="button"
                  onClick={handle}
                  aria-current={isActive ? "page" : undefined}
                  className={className}
                >
                  {content}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
);
BottomNav.displayName = "BottomNav";

export { BottomNav };
