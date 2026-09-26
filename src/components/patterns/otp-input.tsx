import * as React from "react";
import { cn } from "@/lib/cn";

export type OTPLength = 4 | 6;

export interface OTPInputProps {
  /** OTP length (default 6). */
  length?: OTPLength;
  /** Controlled value (digit string). */
  value?: string;
  /** Default value for uncontrolled mode. */
  defaultValue?: string;
  /** Called on every change. */
  onChange?: (value: string) => void;
  /** Called when the value reaches the configured length. */
  onComplete?: (value: string) => void;
  /** Disable input. */
  disabled?: boolean;
  /** Error state (red ring + aria-invalid). */
  invalid?: boolean;
  /** Auto-focus the first box on mount. */
  autoFocus?: boolean;
  /** aria-label for the group. */
  ariaLabel?: string;
  className?: string;
}

/**
 * OTPInput - row of 4 or 6 input boxes for an OTP code.
 *
 * - Auto-focus moves to the next box on input.
 * - Backspace moves to the previous box if the current box is empty.
 * - Paste automatically distributes digits across the remaining boxes.
 * - Tokens: brand ring on focus, danger ring when invalid.
 *
 * Example:
 *   <OTPInput
 *     length={6}
 *     autoFocus
 *     onComplete={(code) => verify(code)}
 *   />
 */
export function OTPInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  disabled = false,
  invalid = false,
  autoFocus = false,
  ariaLabel = "OTP code",
  className,
}: OTPInputProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = isControlled ? value! : internal;
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (!autoFocus) return;
    refs.current[0]?.focus();
  }, [autoFocus]);

  const sanitize = (s: string) => s.replace(/\D/g, "").slice(0, length);

  const update = (next: string) => {
    const clean = sanitize(next);
    if (!isControlled) setInternal(clean);
    onChange?.(clean);
    if (clean.length === length) {
      onComplete?.(clean);
    }
  };

  const focusIndex = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };

  const applyAt = (i: number, ch: string) => {
    const arr = current.padEnd(length, " ").split("");
    arr[i] = ch;
    return arr.join("").trimEnd();
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const onlyDigits = raw.replace(/\D/g, "");
    if (onlyDigits.length > 1) {
      // Multi-char: paste-like distribution from this index.
      const arr = current.padEnd(length, " ").split("");
      let consumed = 0;
      for (let j = 0; j < onlyDigits.length && i + j < length; j++) {
        arr[i + j] = onlyDigits[j];
        consumed++;
      }
      update(arr.join("").trimEnd());
      focusIndex(i + consumed);
      return;
    }
    const next = applyAt(i, onlyDigits);
    update(next);
    if (onlyDigits && i < length - 1) {
      focusIndex(i + 1);
    }
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Backspace") return;
    const cur = current[i] ?? "";
    if (cur === "" && i > 0) {
      // Move focus back and clear previous box.
      e.preventDefault();
      const arr = current.padEnd(length, " ").split("");
      arr[i - 1] = "";
      const next = arr.join("").trimEnd();
      update(next);
      focusIndex(i - 1);
    }
  };

  const handlePaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    const onlyDigits = pasted.replace(/\D/g, "");
    if (!onlyDigits) return;
    e.preventDefault();
    const arr = current.padEnd(length, " ").split("");
    let consumed = 0;
    for (let j = 0; j < onlyDigits.length && i + j < length; j++) {
      arr[i + j] = onlyDigits[j];
      consumed++;
    }
    update(arr.join("").trimEnd());
    focusIndex(i + consumed);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex justify-center gap-2", className)}
      onPaste={(e) => {
        // Catch paste anywhere in the group even if focus is missing.
        if (document.activeElement && refs.current.includes(document.activeElement as HTMLInputElement)) {
          return; // handled by per-input onPaste
        }
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!pasted) return;
        e.preventDefault();
        update(pasted);
        focusIndex(Math.min(pasted.length, length - 1));
      }}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={current[i] ?? ""}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(
            "h-12 w-10 rounded-md border border-input bg-transparent text-center text-lg font-semibold tabular-nums text-foreground sd-tap",
            "focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            invalid &&
              "border-danger focus-visible:border-danger focus-visible:ring-danger"
          )}
        />
      ))}
    </div>
  );
}
