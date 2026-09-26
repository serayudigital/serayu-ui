import * as React from "react";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/cn";

const SNOOZE_KEY_PREFIX = "sd-install-prompt-snooze:";

/**
 * InstallPrompt - bottom-sheet that appears when the browser supports
 * PWA install and the app is not yet installed.
 *
 * - Listens to the `beforeinstallprompt` event.
 * - Snooze for N days (configurable) via localStorage when the user
 *   picks "Not now".
 * - Skipped when `display-mode: standalone` (already installed) or the
 *   snooze is still active.
 * - Brand tone, solid (no gradients).
 *
 * Example:
 *   <InstallPrompt
 *     appName="Serayu App"
 *     appIcon={<Smartphone className="h-5 w-5" />}
 *   />
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface InstallPromptProps {
  appName?: string;
  appIcon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  installLabel?: string;
  dismissLabel?: string;
  /** Snooze duration in days (default 7). */
  snoozeDays?: number;
  className?: string;
}

export function InstallPrompt({
  appName = "This app",
  appIcon,
  title = "Install app",
  description = "Get faster access from the home screen, even when offline.",
  installLabel = "Install",
  dismissLabel = "Not now",
  snoozeDays = 7,
  className,
}: InstallPromptProps) {
  const [visible, setVisible] = React.useState(false);
  const deferredRef = React.useRef<BeforeInstallPromptEvent | null>(null);
  const snoozeKey = `${SNOOZE_KEY_PREFIX}${appName}`;

  const isSnoozed = React.useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem(snoozeKey);
      if (!raw) return false;
      const until = parseInt(raw, 10);
      return Number.isFinite(until) && Date.now() < until;
    } catch {
      return false;
    }
  }, [snoozeKey]);

  const isStandalone = React.useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
    // iOS Safari uses `navigator.standalone`.
    return (
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;
    if (isSnoozed()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      deferredRef.current = event as BeforeInstallPromptEvent;
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      deferredRef.current = null;
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [isSnoozed, isStandalone]);

  const handleSnooze = () => {
    try {
      const until = Date.now() + snoozeDays * 24 * 60 * 60 * 1000;
      window.localStorage.setItem(snoozeKey, String(until));
    } catch {
      // Ignore quota errors / private mode.
    }
    setVisible(false);
    deferredRef.current = null;
  };

  const handleInstall = async () => {
    const prompt = deferredRef.current;
    if (!prompt) {
      setVisible(false);
      return;
    }
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "dismissed") {
        handleSnooze();
      } else {
        setVisible(false);
      }
    } catch {
      handleSnooze();
    } finally {
      deferredRef.current = null;
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={`Install ${appName}`}
      className={cn(
        "fixed bottom-4 left-4 right-4 z-[var(--sd-z-popover)] mx-auto max-w-md rounded-lg border border-border bg-surface p-4 shadow-lg",
        "animate-[sd-content-show_var(--sd-duration-enter)_var(--sd-easing-standard)]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {appIcon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
            {appIcon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <button
          type="button"
          onClick={handleSnooze}
          aria-label="Close"
          className="rounded-md p-1 text-muted-foreground sd-tap hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleSnooze}
          className="h-9 rounded-md px-3 text-sm font-medium text-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {dismissLabel}
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand px-3 text-sm font-medium text-brand-foreground sd-tap hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Download className="h-4 w-4" aria-hidden />
          {installLabel}
        </button>
      </div>
    </div>
  );
}
