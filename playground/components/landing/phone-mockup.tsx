import * as React from "react";
import { cn } from "@/lib/cn";

interface PhoneMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content displayed inside the screen. */
  children: React.ReactNode;
  /** Mockup size. */
  size?: "sm" | "md" | "lg";
  /** Bezel color. Default dark titanium, swaps automatically in dark mode. */
  bezelTone?: "default" | "dark" | "light";
}

/**
 * PhoneMockup - modern iPhone-style frame with Dynamic Island, side buttons,
 * titanium bezel, and inner screen shadow. Strictly decorative for showcasing
 * mobile patterns on the landing page playground / App marketing.
 *
 * NOTE: this file was moved from src/components/landing/ to
 * playground/components/landing/ because it is not a public library component -
 * it is only decoration for the landing page. Library consumers do not need this.
 *
 * NOTE for content: the `children` area is already padded top by ~44px (Dynamic
 * Island + status bar). Your content can be used directly as the screen content.
 */
function PhoneMockup({
  children,
  size = "md",
  className,
  bezelTone = "default",
  ...rest
}: PhoneMockupProps) {
  const sizeMap = {
    sm: {
      width: 220,
      frameHeight: 460,
      frameRadius: 42,
      screenRadius: 32,
      bezel: 8,
      islandW: 78,
      islandH: 22,
      contentPadTop: 38,
      btnGap: 6,
    },
    md: {
      width: 280,
      frameHeight: 580,
      frameRadius: 52,
      screenRadius: 40,
      bezel: 10,
      islandW: 96,
      islandH: 28,
      contentPadTop: 48,
      btnGap: 8,
    },
    lg: {
      width: 320,
      frameHeight: 660,
      frameRadius: 58,
      screenRadius: 46,
      bezel: 10,
      islandW: 108,
      islandH: 30,
      contentPadTop: 52,
      btnGap: 8,
    },
  } as const;
  const s = sizeMap[size];

  // Bezel: dark titanium. Light mode uses neutral-900, dark mode uses
  // neutral-800. Use raw color (not semantic token) because the bezel is
  // a decorative element, not part of the application theme.
  const bezelClass =
    bezelTone === "dark"
      ? "bg-neutral-900 dark:bg-neutral-950"
      : bezelTone === "light"
        ? "bg-neutral-300 dark:bg-neutral-700"
        : "bg-neutral-900 dark:bg-neutral-950";

  // Position the physical iPhone-style buttons (offset from top, relative to the frame).
  const buttonLeft = -(s.bezel * 0.4);
  const buttonRight = -(s.bezel * 0.4);
  // Action button (top left), volume up (left), volume down (left),
  // power button (right).
  const btnAction = { top: 90, height: 18 };
  const btnVolUp = { top: 132, height: 44 };
  const btnVolDown = { top: 184, height: 44 };
  const btnPower = { top: 150, height: 64 };

  return (
    <div
      className={cn("relative shrink-0 select-none", className)}
      style={{ width: s.width, height: s.frameHeight }}
      aria-hidden="true"
      {...rest}
    >
      {/* Outer frame - titanium bezel */}
      <div
        className={cn(
          "relative h-full w-full shadow-2xl",
          bezelClass
        )}
        style={{
          borderRadius: s.frameRadius,
          padding: s.bezel,
        }}
      >
        {/* Inner screen with subtle inset shadow */}
        <div
          className="relative h-full w-full overflow-hidden bg-background shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          style={{ borderRadius: s.screenRadius }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute left-1/2 z-20 -translate-x-1/2 bg-black"
            style={{
              top: s.bezel + 4,
              width: s.islandW,
              height: s.islandH,
              borderRadius: s.islandH / 2,
            }}
          />

          {/* Content area - padded top for Dynamic Island */}
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ paddingTop: s.contentPadTop }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Side buttons - rendered above the frame */}
      {/* Action button (top left) */}
      <div
        className={cn("absolute w-[3px] rounded-l-full", bezelClass)}
        style={{
          left: buttonLeft,
          top: btnAction.top,
          height: btnAction.height,
        }}
      />
      {/* Volume up (left) */}
      <div
        className={cn("absolute w-[3px] rounded-l-full", bezelClass)}
        style={{
          left: buttonLeft,
          top: btnVolUp.top,
          height: btnVolUp.height,
        }}
      />
      {/* Volume down (left) */}
      <div
        className={cn("absolute w-[3px] rounded-l-full", bezelClass)}
        style={{
          left: buttonLeft,
          top: btnVolDown.top,
          height: btnVolDown.height,
        }}
      />
      {/* Power button (right) */}
      <div
        className={cn("absolute w-[3px] rounded-r-full", bezelClass)}
        style={{
          right: buttonRight,
          top: btnPower.top,
          height: btnPower.height,
        }}
      />

      {/* Home indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-foreground/40"
        style={{
          bottom: -10,
          width: s.width * 0.35,
          height: 4,
        }}
      />
    </div>
  );
}

export { PhoneMockup };
