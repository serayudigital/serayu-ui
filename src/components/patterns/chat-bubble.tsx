import * as React from "react";
import { Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";

export interface ChatBubbleProps {
  /** Message text (string or ReactNode for rich content). */
  children: React.ReactNode;
  /** incoming: bubble on the left, outgoing: bubble on the right. */
  variant: "incoming" | "outgoing";
  /** Avatar (for incoming). */
  avatarUrl?: string;
  /** Fallback text avatar (usually initials). */
  avatarFallback?: string;
  /** Message time. */
  timestamp?: React.ReactNode;
  /** Read status (for outgoing). */
  read?: boolean;
  /** Hide avatar and timestamp (for consecutive messages from
   *  the same sender). */
  grouped?: boolean;
  /** Additional class. */
  className?: string;
}

/**
 * ChatBubble - chat message bubble in the style of WhatsApp / Telegram.
 *
 * - Variant incoming (left, muted) and outgoing (right, brand).
 * - Avatar (incoming) + timestamp + read receipt (outgoing).
 * - grouped=true hides avatar and timestamp for consecutive
 *   messages from the same sender.
 * - Solid tone (NOT gradient).
 *
 * Example:
 *   <ChatBubble variant="incoming" avatarFallback="AS" timestamp="09:30">
 *     Hello, how are you?
 *   </ChatBubble>
 *   <ChatBubble variant="outgoing" timestamp="09:32" read>Good!</ChatBubble>
 */
export function ChatBubble({
  children,
  variant,
  avatarUrl,
  avatarFallback,
  timestamp,
  read,
  grouped = false,
  className,
}: ChatBubbleProps) {
  const isOutgoing = variant === "outgoing";
  const showAvatar = !isOutgoing && !grouped;
  const showTimestamp = !grouped;

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2",
        isOutgoing ? "flex-row-reverse" : "flex-row",
        grouped ? (isOutgoing ? "pr-2" : "pl-10") : "px-1",
        className
      )}
    >
      {showAvatar ? (
        <Avatar size="sm" className="shrink-0">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="" />
          ) : null}
          <AvatarFallback>
            {(avatarFallback ?? "?").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-8 w-8 shrink-0" aria-hidden />
      )}

      <div
        className={cn(
          "flex max-w-[78%] flex-col gap-0.5",
          isOutgoing ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-sm leading-relaxed break-words",
            isOutgoing
              ? "rounded-br-md bg-brand text-brand-foreground"
              : "rounded-bl-md bg-muted text-foreground"
          )}
        >
          {children}
        </div>

        {showTimestamp ? (
          <div
            className={cn(
              "flex items-center gap-1 px-1 text-[11px] text-muted-foreground",
              isOutgoing ? "flex-row-reverse" : "flex-row"
            )}
          >
            <time dateTime={typeof timestamp === "string" ? timestamp : undefined}>
              {timestamp}
            </time>
            {isOutgoing ? (
              read ? (
                <CheckCheck className="h-3 w-3 text-brand" aria-label="Read" />
              ) : (
                <Check className="h-3 w-3" aria-label="Sent" />
              )
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
