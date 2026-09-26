import * as React from "react";
import { Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";

export interface ShareButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Title for `navigator.share` (default: `document.title`). */
  title?: string;
  /** Additional text shared with the URL. */
  text?: string;
  /** URL to share (default: `window.location.href`). */
  url?: string;
  /** Toast message when the clipboard fallback succeeds (default "Link copied"). */
  successMessage?: string;
  /** Toast message when the clipboard fallback fails. */
  errorMessage?: string;
  /** Disable the button. */
  disabled?: boolean;
  /** Custom button content; default: Share2 icon + "Share" label. */
  children?: React.ReactNode;
}

interface ShareNavigator extends Navigator {}

/**
 * ShareButton - share button with a clipboard fallback.
 *
 * - Tries `navigator.share()` first (native share sheet, mobile-first).
 * - Falls back to copying the URL to the clipboard when the Web Share
 *   API is unavailable or the user cancels.
 * - Surfaces a confirmation toast via the global Toaster system.
 *
 * Example:
 *   <ShareButton title="Share" text="Check this article" url="https://..." />
 *   <ShareButton title="Share"><Mail className="h-4 w-4" /></ShareButton>
 */
export const ShareButton = React.forwardRef<HTMLButtonElement, ShareButtonProps>(
  (
    {
      title,
      text,
      url,
      successMessage = "Link copied to clipboard",
      errorMessage = "Failed to copy link",
      disabled,
      children,
      className,
      type,
      ...rest
    },
    ref
  ) => {
    const handleClick = async () => {
      const shareUrl =
        url ??
        (typeof window !== "undefined" ? window.location.href : "");
      const shareTitle =
        title ??
        (typeof document !== "undefined" ? document.title : "");
      const shareData: ShareData = {
        title: shareTitle,
        text,
        url: shareUrl,
      };

      const nav = (typeof navigator !== "undefined"
        ? navigator
        : undefined) as ShareNavigator | undefined;

      // Try the Web Share API first.
      if (typeof nav?.share === "function") {
        try {
          await nav.share(shareData);
          return;
        } catch (err) {
          // User cancelled (AbortError) - silent.
          if (
            err instanceof DOMException &&
            err.name === "AbortError"
          ) {
            return;
          }
          // Any other error: fall back to clipboard.
        }
      }

      // Fallback: copy the URL to the clipboard.
      try {
        if (
          typeof navigator !== "undefined" &&
          navigator.clipboard?.writeText
        ) {
          await navigator.clipboard.writeText(shareUrl);
        } else if (typeof document !== "undefined") {
          // Legacy fallback for browsers without the async clipboard API.
          const ta = document.createElement("textarea");
          ta.value = shareUrl;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          if (!ok) throw new Error("execCommand copy failed");
        } else {
          throw new Error("No clipboard API available");
        }
        toast({
          title: successMessage,
          variant: "success",
        });
      } catch {
        toast({
          title: errorMessage,
          variant: "danger",
        });
      }
    };

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium sd-tap transition-colors",
          "bg-surface text-surface-foreground border border-border hover:bg-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...rest}
      >
        {children ?? (
          <>
            <Share2 className="h-4 w-4" aria-hidden />
            <span>Share</span>
          </>
        )}
      </button>
    );
  }
);
ShareButton.displayName = "ShareButton";
