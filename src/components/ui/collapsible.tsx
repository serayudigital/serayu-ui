import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@/lib/cn";

/**
 * Collapsible - single section show/hide with smooth height animation.
 *
 * Pairs with Accordion: Accordion is a multi-item Collapsible. Use this
 * for one-off expand sections where a full accordion is overkill.
 *
 * Data-state animations live in `src/styles/utilities.css` under
 * `sd-collapsible-down` / `sd-collapsible-up`. The animation is
 * disabled automatically when `(prefers-reduced-motion: reduce)`
 * matches.
 */

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      "overflow-hidden text-sm data-[state=closed]:animate-sd-collapsible-up data-[state=open]:animate-sd-collapsible-down",
      className
    )}
    {...props}
  >
    <div className="pt-2">{children}</div>
  </CollapsiblePrimitive.CollapsibleContent>
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
