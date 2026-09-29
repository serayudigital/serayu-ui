import { useEffect, useState } from "react";

export interface UseNetworkStatusReturn {
  /**
   * Current online state. True while `window.navigator.onLine` is true
   * and no offline event has fired. False after an offline event.
   */
  isOnline: boolean;
  /**
   * Sticky flag: true once an `offline` event has fired during this
   * component's lifetime. Resets on remount. Useful for showing a
   * "back online" toast without firing on every navigation.
   */
  wasOffline: boolean;
}

/**
 * useNetworkStatus - reactive online/offline state.
 *
 * Tracks `window.navigator.onLine` plus `online` and `offline` events.
 * The returned `wasOffline` flag is sticky for the component lifetime,
 * so consumers can show a single "back online" toast without firing on
 * every state change.
 *
 * SSR-safe: returns `isOnline: true, wasOffline: false` on the server.
 *
 * Pairs with the `NetworkStatus` and `OfflineIndicator` components,
 * which render UI based on the same browser signals.
 *
 * Example:
 *   const { isOnline, wasOffline } = useNetworkStatus();
 *   useEffect(() => {
 *     if (!isOnline) return;
 *     if (wasOffline) toast({ title: "Back online", variant: "success" });
 *   }, [isOnline, wasOffline]);
 */
export function useNetworkStatus(): UseNetworkStatusReturn {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.navigator.onLine;
  });
  const [wasOffline, setWasOffline] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !window.navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}
