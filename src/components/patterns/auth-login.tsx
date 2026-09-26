import * as React from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/cn";
import { isValidEmail, isValidIndonesianPhone } from "@/lib/utils";

/**
 * LoginScreen - UI shell for the login page. Callback adapter for
 * each backend action. Does NOT include authentication logic.
 *
 * Common adapters:
 *   - auth.js / NextAuth: handled on the server via route handler.
 *   - Supabase: signInWithPassword in onSubmit.
 *   - Custom: fetch to endpoint.
 *
 * Example:
 *   <LoginScreen
 *     onSubmit={async ({ identifier, secret, remember }) => {
 *       await signIn(identifier, secret);
 *     }}
 *     socialProviders={[
 *       { id: "google", label: "Google", onClick: () => signInWithGoogle() },
 *     ]}
 *   />
 */

export type IdentifierType = "email" | "phone" | "both";
export type SecretType = "password" | "pin";

export interface SocialProvider {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export interface LoginScreenProps {
  /** Large title (default "Log in"). */
  title?: string;
  /** Subtitle / short description. */
  subtitle?: string;
  /** Identifier (email/phone) or both. Default "both". */
  identifierType?: IdentifierType;
  /** "password" (default) or "pin" (numeric). */
  secretType?: SecretType;
  /** Identifier placeholder. */
  identifierLabel?: string;
  /** Secret placeholder. */
  secretLabel?: string;
  /** Submit handler. Throw or return {error} to show an error. */
  onSubmit?: (data: {
    identifier: string;
    secret: string;
    remember: boolean;
  }) => Promise<void | { error?: string }>;
  /** Social providers (Google, Apple, Facebook, etc). */
  socialProviders?: SocialProvider[];
  /** External loading state. */
  loading?: boolean;
  /** External error (overrides internal). */
  error?: string;
  /** Footer slot (link "Don't have an account? Sign up" etc). */
  footer?: React.ReactNode;
  /** ClassName for the wrapper. */
  className?: string;
}

const phoneHint = "Example: 081234567890";

export function LoginScreen({
  title = "Log in",
  subtitle = "Continue to your account.",
  identifierType = "both",
  secretType = "password",
  identifierLabel,
  secretLabel,
  onSubmit,
  socialProviders,
  loading: externalLoading,
  error: externalError,
  footer,
  className,
}: LoginScreenProps) {
  const [identifier, setIdentifier] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const [showSecret, setShowSecret] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [internalLoading, setInternalLoading] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | undefined>(
    undefined
  );

  const loading = externalLoading ?? internalLoading;
  const error = externalError ?? internalError;

  const identifierInputType =
    identifierType === "email"
      ? "email"
      : identifierType === "phone"
        ? "tel"
        : "text";

  const autoLabel =
    identifierLabel ??
    (identifierType === "email"
      ? "Email"
      : identifierType === "phone"
        ? "Phone number"
        : "Email or phone number");

  const autoSecretLabel =
    secretLabel ?? (secretType === "pin" ? "PIN" : "Password");

  const validateIdentifier = (): string | undefined => {
    const v = identifier.trim();
    if (!v) return "Required.";
    if (identifierType === "email") {
      return isValidEmail(v) ? undefined : "Invalid email format.";
    }
    if (identifierType === "phone") {
      return isValidIndonesianPhone(v)
        ? undefined
        : "Invalid phone number.";
    }
    // both
    if (v.includes("@")) {
      return isValidEmail(v) ? undefined : "Invalid email format.";
    }
    return isValidIndonesianPhone(v)
      ? undefined
      : "Invalid email or phone number.";
  };

  const validateSecret = (): string | undefined => {
    if (!secret) return "Required.";
    if (secretType === "pin" && !/^\d{4,8}$/.test(secret)) {
      return "PIN must be 4-8 digits.";
    }
    return undefined;
  };

  const handleSubmit = async (): Promise<void> => {
    if (loading) return;
    setInternalError(undefined);
    if (externalLoading === undefined) {
      setInternalLoading(true);
      try {
        if (onSubmit) {
          const res = await onSubmit({ identifier, secret, remember });
          if (res && "error" in res && res.error) {
            setInternalError(res.error);
          }
        }
      } catch (err) {
        setInternalError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setInternalLoading(false);
      }
    } else if (onSubmit) {
      try {
        const res = await onSubmit({ identifier, secret, remember });
        if (res && "error" in res && res.error) setInternalError(res.error);
      } catch (err) {
        setInternalError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      }
    }
  };

  const Icon =
    identifierInputType === "email"
      ? Mail
      : identifierInputType === "tel"
        ? Phone
        : Mail;
  const LockIcon = Lock;

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-md flex-col gap-6 rounded-lg border border-border bg-surface p-6 shadow-sm",
        className
      )}
    >
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </header>

      <Form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-danger bg-danger/10 p-2.5 text-xs text-danger"
          >
            {error}
          </div>
        )}

        <FormField
          name="identifier"
          label={autoLabel}
          helper={
            identifierType !== "email" && identifierType !== "phone"
              ? phoneHint
              : undefined
          }
          required
          validate={validateIdentifier}
        >
          {(ctx) => (
            <div className="relative">
              <Icon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id={ctx.id}
                aria-describedby={ctx.describedBy}
                invalid={ctx.invalid}
                type={identifierInputType}
                inputMode={
                  identifierInputType === "tel" ? "tel" : "email"
                }
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  identifierType === "email"
                    ? "name@example.com"
                    : identifierType === "phone"
                      ? "081234567890"
                      : "name@example.com or 081234567890"
                }
                className="pl-10"
                disabled={loading}
              />
            </div>
          )}
        </FormField>

        <FormField
          name="secret"
          label={autoSecretLabel}
          required
          validate={validateSecret}
        >
          {(ctx) => (
            <div className="relative">
              <LockIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id={ctx.id}
                aria-describedby={ctx.describedBy}
                invalid={ctx.invalid}
                type={
                  secretType === "pin"
                    ? "tel"
                    : showSecret
                      ? "text"
                      : "password"
                }
                inputMode={secretType === "pin" ? "numeric" : undefined}
                autoComplete={
                  secretType === "pin" ? "one-time-code" : "current-password"
                }
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="••••••••"
                className="px-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                aria-label={showSecret ? "Hide" : "Show"}
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground sd-tap hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4" aria-hidden />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden />
                )}
              </button>
            </div>
          )}
        </FormField>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-border text-brand focus:ring-ring"
          />
          Remember me
        </label>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
          {loading ? "Processing..." : "Log in"}
        </Button>
      </Form>

      {socialProviders && socialProviders.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 gap-2">
            {socialProviders.map((p) => (
              <Button
                key={p.id}
                type="button"
                variant="outline"
                onClick={p.onClick}
                disabled={loading}
              >
                {p.icon}
                <span>Continue with {p.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {footer && <div className="text-center text-sm">{footer}</div>}
    </div>
  );
}
