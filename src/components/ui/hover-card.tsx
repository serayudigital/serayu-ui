import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/cn";

/**
 * HoverCard - rich tooltip on hover. Renders a portal so it can
 * escape overflow:hidden parents. Useful for user profile previews,
 * link previews, and inline detail reveals.
 *
 * Open delay is 200ms by default (Radix default). Close delay 150ms.
 * Keyboard: focus on Trigger opens the card.
 */

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardPortal = HoverCardPrimitive.Portal;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 6, ...props }, ref) => (
  <HoverCardPortal>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[var(--sd-z-popover)] w-72 rounded-md border border-border bg-surface p-4 text-sm text-foreground shadow-md",
        className
      )}
      {...props}
    />
  </HoverCardPortal>
));
HoverCardContent.displayName = "HoverCardContent";

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardContent,
};
