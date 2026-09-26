import * as React from "react";
import { toast } from "@/hooks/use-toast";

export interface UpdateAvailableToastProps {
  /** Set true when the service worker signals an update is ready to activate. */
  available: boolean;
  /** Reload handler (default: window.location.reload). */
  onReload?: () => void;
  title?: string;
  description?: React.ReactNode;
  reloadLabel?: string;
  dismissLabel?: string;
}

/**
 * UpdateAvailableToast - persistent toast that appears when a new version
 * is ready to activate from the service worker.
 *
 * - Renders null; triggers the side effect via toast() to stay consistent
 *   with other toast surfaces (Toaster).
 * - `available: true` triggers a toast with a "Reload" action.
 * - This hook stays minimal; SW integration depends on the host app.
 *   Example with vite-plugin-pwa (in the app, not in the library):
 *
 *   import { useRegisterSW } from "virtual:pwa-register";
 *   const { needRefresh, updateServiceWorker } = useRegisterSW({
 *     onRegisteredSW(swUrl, r) { ... },
 *     onRegisterError() { ... }
 *   });
 *   <UpdateAvailableToast
 *     available={needRefresh}
 *     onReload={() => updateServiceWorker(true)}
 *   />
 */
export function UpdateAvailableToast({
  available,
  onReload,
  title = "New version available",
  description = "Reload to get the latest version.",
  reloadLabel = "Reload",
  dismissLabel = "Later",
}: UpdateAvailableToastProps) {
  const onReloadRef = React.useRef(onReload);
  onReloadRef.current = onReload;

  React.useEffect(() => {
    if (!available) return;

    const titleValue = title ?? "New version available";
    const handle = toast({
      title: titleValue,
      description,
      variant: "info",
      duration: Number.POSITIVE_INFINITY,
      action: (
        <button
          type="button"
          onClick={() => {
            onReloadRef.current?.();
          }}
          className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground hover:bg-brand/90"
        >
          {reloadLabel}
        </button>
      ),
    });
    return () => handle.dismiss();
  }, [available, title, description, reloadLabel]);

  if (available && dismissLabel) {
    // dismissLabel prop exists to allow consumers to localize the dismiss
    // affordance. The action above is the only persistent control.
  }

  return null;
}
