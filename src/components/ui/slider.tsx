import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Slider - numeric input with one or two thumbs.
 * Wraps Radix Slider.
 *
 * - Track solid bg-muted, range bg-brand (NOT gradient).
 * - Step integer or decimal; defaultValue can be a single [number] or
 *   range [number, number].
 * - Tap target minimum 44px via class `sd-tap-target` when needed.
 *
 * Example:
 *   <Slider defaultValue={[40]} max={100} step={1} />
 *   <Slider defaultValue={[20, 80]} max={100} step={1} />
 */

export interface SliderProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
      "value" | "defaultValue"
    >,
    VariantProps<typeof sliderVariants> {
  value?: number[];
  defaultValue?: number[];
}

const sliderVariants = cva("", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      size,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const thumbs = (value ?? defaultValue ?? [0]).length;
    const thumbSize =
      size === "sm" ? 18 : size === "lg" ? 26 : 22;
    const trackHeight =
      size === "sm" ? 4 : size === "lg" ? 8 : 6;

    return (
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className="relative grow overflow-hidden rounded-full bg-muted"
          style={{ height: trackHeight }}
        >
          <SliderPrimitive.Range className="absolute h-full bg-brand" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbs }).map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              "block rounded-full border-2 border-brand bg-background shadow-sm",
              "sd-tap transition-colors hover:border-brand/80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
            style={{
              width: thumbSize,
              height: thumbSize,
            }}
          />
        ))}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
