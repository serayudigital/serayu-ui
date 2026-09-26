import * as React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/cn";

/**
 * NetworkInformation from the Network Information API.
 * https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */
interface NetworkInformation {
  readonly effectiveType?: "slow-2g" | "2g" | "3g" | "4g" | string;
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

function readConnection(): NetworkInformation | null {
  if (typeof navigator === "undefined") return null;
  const conn = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  return conn ?? null;
}

export interface NetworkStatusProps {
  /** Custom trigger. Default: Wifi icon button. */
  children?: React.ReactNode;
  /** Aria label on the default trigger. */
  triggerLabel?: string;
  className?: string;
}

/**
 * NetworkStatus - popover that shows online status, effective connection
 * type (4g/3g/etc), downlink, and RTT.
 *
 * - Uses the Network Information API (feature-detected; Safari/Chromium).
 * - Solid tone (NOT gradient).
 * - Clicking outside closes the popover (Radix Popover primitive).
 *
 * Example:
 *   <NetworkStatus />
 *   <NetworkStatus triggerLabel="Check connection">
 *     <Button variant="outline">Status</Button>
 *   </NetworkStatus>
 */
export function NetworkStatus({
  children,
  triggerLabel = "Network status",
  className,
}: NetworkStatusProps) {
  const [online, setOnline] = React.useState<boolean>(
    () => (typeof navigator !== "undefined" ? navigator.onLine : true)
  );
  const [conn, setConn] = React.useState<NetworkInformation | null>(() =>
    readConnection()
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const refresh = () => {
      setOnline(navigator.onLine);
      setConn(readConnection());
    };

    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    const netConn = readConnection();
    if (netConn?.addEventListener) {
      netConn.addEventListener("change", refresh);
    }

    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      if (netConn?.removeEventListener) {
        netConn.removeEventListener("change", refresh);
      }
    };
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children ?? (
          <button
            type="button"
            aria-label={triggerLabel}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground sd-tap transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              className
            )}
          >
            {online ? (
              <Wifi className="h-5 w-5" aria-hidden />
            ) : (
              <WifiOff
                className="h-5 w-5 text-warning"
                aria-hidden
              />
            )}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Network Status
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <span
              aria-hidden
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                online ? "bg-success" : "bg-danger"
              )}
            />
            {online ? "Online" : "Offline"}
          </p>
        </div>
        {conn ? (
          <div className="space-y-1.5">
            {conn.effectiveType ? (
              <Row
                label="Type"
                value={conn.effectiveType.toUpperCase()}
              />
            ) : null}
            {typeof conn.downlink === "number" ? (
              <Row
                label="Downlink"
                value={`${conn.downlink.toFixed(1)} Mbps`}
              />
            ) : null}
            {typeof conn.rtt === "number" ? (
              <Row label="RTT" value={`${conn.rtt} ms`} />
            ) : null}
            {typeof conn.saveData === "boolean" ? (
              <Row
                label="Data Saver"
                value={conn.saveData ? "Active" : "Inactive"}
              />
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Connection info is not available in this browser.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}
