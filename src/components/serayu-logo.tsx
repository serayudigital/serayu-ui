import * as React from "react";
import { cn } from "@/lib/cn";

interface SerayuLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg";
  subtitle?: string;
  showWordmark?: boolean;
  /**
   * Path to the logo image file (e.g. "/serayu-ui.png"). When provided,
   * the component renders an `<img>` in the logo slot replacing the
   * letter box. When empty, a box containing the "S" initial is used
   * as fallback.
   */
  logoSrc?: string;
  /** Alt text for the `<img>`. Default: "Serayu UI logo". */
  logoAlt?: string;
}

const SIZE_MAP = {
  xs: { box: "h-6 w-6 text-xs", word: "text-xs", sub: "text-[10px]" },
  sm: { box: "h-7 w-7 text-sm", word: "text-sm", sub: "text-[11px]" },
  md: { box: "h-10 w-10 text-lg", word: "text-base", sub: "text-xs" },
  lg: { box: "h-12 w-12 text-xl", word: "text-lg", sub: "text-xs" },
} as const;

export function SerayuLogo({
  size = "md",
  subtitle,
  showWordmark = true,
  logoSrc,
  logoAlt = "Serayu UI logo",
  className,
  ...rest
}: SerayuLogoProps) {
  const s = SIZE_MAP[size];
  return (
    <div className={cn("flex items-center gap-3", className)} {...rest}>
      <div
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-brand font-bold text-brand-foreground",
          s.box
        )}
        aria-hidden={logoSrc ? undefined : "true"}
      >
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-full w-full object-contain"
            draggable={false}
          />
        ) : (
          "S"
        )}
      </div>
      {showWordmark && (
        <div className="min-w-0 leading-tight">
          <p className={cn("truncate font-semibold text-foreground", s.word)}>
            Serayu UI
          </p>
          {subtitle && (
            <p
              className={cn(
                "truncate text-muted-foreground",
                s.sub
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
