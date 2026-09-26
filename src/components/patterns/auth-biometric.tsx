import * as React from "react";
import { Fingerprint, Loader2, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * BiometricPrompt - UI shell for biometric confirmation (fingerprint
 * or face ID). Callback adapter for WebAuthn integration.
 *
 * - Feature-detects PublicKeyCredential on mount.
 * - Optional fallback button (PIN/password).
 *
 * NOTE: actually triggering WebAuthn is the caller's responsibility.
 * Common pattern:
 *   const credential = await navigator.credentials.get({ publicKey: ... });
 *
 * Example:
 *   <BiometricPrompt
 *     title="Confirm purchase"
 *     onConfirm={async () => {
 *       const cred = await navigator.credentials.get(...);
 *       if (cred) await submitPurchase();
 *     }}
 *     onFallback={() => goToPinScreen()}
 *   />
 */

export interface BiometricPromptProps {
  /** Large title. Default "Confirm identity". */
  title?: string;
  /** Subtitle / description. */
  description?: string;
  /** Called when the user taps the primary button. */
  onConfirm: () => Promise<void>;
  /** Fall back to another method (PIN/password). */
  onFallback?: () => void;
  /** Fallback button label. Default "Use PIN". */
  fallbackLabel?: string;
  /** Force available state (override feature-detect). */
  available?: boolean;
  /** Force unavailable state. */
  unavailable?: boolean;
  /** Loading override. */
  loading?: boolean;
  className?: string;
}

function detectBiometricAvailable(): Promise<boolean> | null {
  if (typeof window === "undefined") return null;
  if (typeof PublicKeyCredential === "undefined") return null;
  // getClientCapabilities when available (Chrome 95+).
  const pk = PublicKeyCredential as unknown as {
    isUserVerifyingPlatformAuthenticatorAvailable?: () => Promise<boolean>;
    getClientCapabilities?: () => Promise<{
      userVerifyingPlatformAuthenticator?: boolean;
    }>;
  };
  if (typeof pk.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
    return pk.isUserVerifyingPlatformAuthenticatorAvailable();
  }
  if (typeof pk.getClientCapabilities === "function") {
    return pk
      .getClientCapabilities()
      .then((caps) => caps.userVerifyingPlatformAuthenticator === true);
  }
  return null;
}

export function BiometricPrompt({
  title = "Confirm identity",
  description = "Use fingerprint or face ID to continue.",
  onConfirm,
  onFallback,
  fallbackLabel = "Use PIN",
  available: availableOverride,
  unavailable: unavailableOverride,
  loading: externalLoading,
  className,
}: BiometricPromptProps) {
  const [detected, setDetected] = React.useState<boolean | null>(null);
  const [internalLoading, setInternalLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const loading = externalLoading ?? internalLoading;
  const available =
    availableOverride ?? (unavailableOverride ? false : detected ?? false);

  React.useEffect(() => {
    if (availableOverride !== undefined || unavailableOverride) return;
    let cancelled = false;
    const detected = detectBiometricAvailable();
    if (detected === null) {
      setDetected(false);
      return;
    }
    detected.then((res) => {
      if (!cancelled) setDetected(res);
    });
    return () => {
      cancelled = true;
    };
  }, [availableOverride, unavailableOverride]);

  const handleConfirm = async () => {
    setError(undefined);
    if (externalLoading === undefined) {
      setInternalLoading(true);
      try {
        await onConfirm();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Biometric verification failed."
        );
      } finally {
        setInternalLoading(false);
      }
    } else {
      try {
        await onConfirm();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Biometric verification failed."
        );
      }
    }
  };

  const Icon = Fingerprint;

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-sm flex-col items-center gap-5 rounded-lg border border-border bg-surface p-6 text-center shadow-sm",
        className
      )}
      role="alertdialog"
      aria-label={title}
    >
      <div className="relative">
        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand",
            loading && "animate-pulse"
          )}
          aria-hidden
        >
          <Icon className="h-10 w-10" />
        </div>
        {available && (
          <span
            className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-success text-success-foreground"
            aria-hidden
          >
            <ScanFace className="h-3 w-3" />
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {available && (
        <Button
          type="button"
          className="w-full"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
          )}
          {loading ? "Verifying..." : "Verify with biometrics"}
        </Button>
      )}

      {!available && (
        <div className="w-full space-y-2">
          <p className="text-xs text-muted-foreground">
            Biometrics is not available on this device.
          </p>
          {onFallback && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onFallback}
              disabled={loading}
            >
              {fallbackLabel}
            </Button>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
