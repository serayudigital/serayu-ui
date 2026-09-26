import * as React from "react";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * NotificationPermission - button / status for the Notification API.
 *
 * - Checks `Notification.permission` on mount.
 * - UI states: unsupported, default, requesting, granted, denied.
 * - Clicking the button calls `Notification.requestPermission()`.
 * - Solid tone (NOT a gradient).
 *
 * Example:
 *   <NotificationPermission
 *     onGranted={() => subscribeToPush()}
 *     onDenied={() => toast({ title: "Notifications disabled" })}
 *   />
 */

export type NotificationState =
  | "unsupported"
  | "default"
  | "requesting"
  | "granted"
  | "denied";

export interface NotificationPermissionProps {
  /** Button label (default "Enable notifications"). */
  label?: string;
  /** Label when requesting. */
  requestingLabel?: string;
  /** Additional label when granted. */
  grantedLabel?: string;
  /** Label when denied. */
  deniedLabel?: string;
  /** Handler when permission is granted. */
  onGranted?: () => void;
  /** Handler when permission is denied. */
  onDenied?: () => void;
  /** Handler for every state change. */
  onStateChange?: (state: NotificationState) => void;
  /** Additional class. */
  className?: string;
}

function readPermission(): NotificationState {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return "unsupported";
  }
  return Notification.permission as NotificationState;
}

export function NotificationPermission({
  label = "Enable notifications",
  requestingLabel = "Requesting permission...",
  grantedLabel = "Notifications enabled",
  deniedLabel = "Notifications disabled",
  onGranted,
  onDenied,
  onStateChange,
  className,
}: NotificationPermissionProps) {
  const [state, setState] = React.useState<NotificationState>(() =>
    readPermission()
  );

  // Sync state on mount.
  React.useEffect(() => {
    setState(readPermission());
  }, []);

  React.useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  const request = async () => {
    if (typeof Notification === "undefined") return;
    setState("requesting");
    try {
      const result = await Notification.requestPermission();
      setState(result as NotificationState);
      if (result === "granted") onGranted?.();
      else onDenied?.();
    } catch {
      setState("denied");
      onDenied?.();
    }
  };

  // State-driven render.
  const meta = (() => {
    if (state === "unsupported") {
      return {
        icon: <BellOff className="h-4 w-4" aria-hidden />,
        text: "Not supported",
        tone: "muted" as const,
        disabled: true,
        onClick: undefined,
      };
    }
    if (state === "requesting") {
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin" aria-hidden />,
        text: requestingLabel,
        tone: "muted" as const,
        disabled: true,
        onClick: undefined,
      };
    }
    if (state === "granted") {
      return {
        icon: <BellRing className="h-4 w-4" aria-hidden />,
        text: grantedLabel,
        tone: "success" as const,
        disabled: false,
        onClick: undefined,
      };
    }
    if (state === "denied") {
      return {
        icon: <BellOff className="h-4 w-4" aria-hidden />,
        text: deniedLabel,
        tone: "danger" as const,
        disabled: false,
        onClick: undefined,
      };
    }
    // default
    return {
      icon: <Bell className="h-4 w-4" aria-hidden />,
      text: label,
      tone: "brand" as const,
      disabled: false,
      onClick: request,
    };
  })();

  const toneClass = (() => {
    switch (meta.tone) {
      case "brand":
        return "bg-brand text-brand-foreground hover:bg-brand/90";
      case "success":
        return "border border-border bg-surface text-foreground";
      case "danger":
        return "border border-danger/30 bg-danger/10 text-danger";
      case "muted":
      default:
        return "border border-border bg-surface text-muted-foreground";
    }
  })();

  return (
    <button
      type="button"
      onClick={meta.onClick}
      disabled={meta.disabled}
      aria-live="polite"
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium sd-tap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-70",
        toneClass,
        className
      )}
    >
      {meta.icon}
      <span>{meta.text}</span>
    </button>
  );
}
