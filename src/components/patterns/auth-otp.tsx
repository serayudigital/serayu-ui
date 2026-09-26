import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTPInput, type OTPLength } from "./otp-input";
import { cn } from "@/lib/cn";

/**
 * OTPForm - UI shell for the OTP verification page. Callback adapter
 * for verify and resend.
 *
 * - Mounts a 4 or 6 digit OTPInput.
 * - "Resend" button with cooldown (default 30 seconds).
 * - Shows the target ("to 0812-3456-7890" or "to user@example.com").
 *
 * Example:
 *   <OTPForm
 *     length={6}
 *     target="phone"
 *     targetLabel="081234567890"
 *     onComplete={async (code) => {
 *       await verify(code);
 *     }}
 *     onResend={async () => {
 *       await sendNewOtp();
 *     }}
 *   />
 */

export interface OTPFormProps {
  /** Digit length (4 or 6). Default 6. */
  length?: OTPLength;
  /** OTP destination. */
  target: "phone" | "email";
  /** Target label to display (e.g. "0812-3456-7890" or "user@..."). */
  targetLabel?: string;
  /** Called when a complete OTP is entered. */
  onComplete?: (code: string) => Promise<void | { error?: string }>;
  /** Called when the user requests a resend. */
  onResend?: () => Promise<void>;
  /** Resend cooldown in seconds (default 30). */
  resendCooldown?: number;
  /** External loading state. */
  loading?: boolean;
  /** External error (overrides internal). */
  error?: string;
  /** Wrapper className. */
  className?: string;
  /** Page title (default "Verify OTP"). */
  title?: string;
  /** Subtitle / explanation. */
  subtitle?: string;
}

export function OTPForm({
  length = 6,
  target: _target,
  targetLabel,
  onComplete,
  onResend,
  resendCooldown = 30,
  loading: externalLoading,
  error: externalError,
  className,
  title = "Verify OTP",
  subtitle,
}: OTPFormProps) {
  const [code, setCode] = React.useState("");
  const [internalLoading, setInternalLoading] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | undefined>(
    undefined
  );
  const [resending, setResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  const loading = externalLoading ?? internalLoading;
  const error = externalError ?? internalError;

  // Cooldown timer.
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleComplete = async (val: string) => {
    setCode(val);
    if (externalLoading === undefined) {
      setInternalLoading(true);
      setInternalError(undefined);
      try {
        if (onComplete) {
          const res = await onComplete(val);
          if (res && "error" in res && res.error) setInternalError(res.error);
        }
      } catch (err) {
        setInternalError(
          err instanceof Error
            ? err.message
            : "Verification failed. Try again."
        );
      } finally {
        setInternalLoading(false);
      }
    } else if (onComplete) {
      try {
        const res = await onComplete(val);
        if (res && "error" in res && res.error) setInternalError(res.error);
      } catch (err) {
        setInternalError(
          err instanceof Error
            ? err.message
            : "Verification failed. Try again."
        );
      }
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setInternalError(undefined);
    try {
      if (onResend) await onResend();
      setCooldown(resendCooldown);
      setCode("");
    } catch (err) {
      setInternalError(
        err instanceof Error ? err.message : "Failed to resend."
      );
    } finally {
      setResending(false);
    }
  };

  const targetText = targetLabel
    ? `to ${targetLabel}`
    : "";

  const autoSubtitle =
    subtitle ?? `Enter the ${length}-digit code sent ${targetText}.`.trim();

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-md flex-col gap-6 rounded-lg border border-border bg-surface p-6 shadow-sm",
        className
      )}
    >
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{autoSubtitle}</p>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-danger bg-danger/10 p-2.5 text-xs text-danger"
        >
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <OTPInput
          length={length}
          value={code}
          onChange={setCode}
          onComplete={handleComplete}
          autoFocus
          disabled={loading}
          invalid={!!error}
          ariaLabel={`OTP ${length} digits`}
        />
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Didn't receive the code?</span>
        {cooldown > 0 ? (
          <span className="tabular-nums text-muted-foreground">
            Resend in {cooldown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || loading}
            className="font-medium text-brand underline-offset-2 hover:underline disabled:opacity-50 sd-tap"
          >
            {resending && (
              <Loader2 className="mr-1 inline h-3 w-3 animate-spin" aria-hidden />
            )}
            Resend
          </button>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        disabled={loading || code.length !== length}
        onClick={() => handleComplete(code)}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
        Verify
      </Button>
    </div>
  );
}
