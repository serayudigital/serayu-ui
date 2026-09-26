import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const cardVariants = cva(
  "rounded-lg text-card-foreground",
  {
    variants: {
      variant: {
        elevated:
          "border border-border bg-card shadow-md",
        outline:
          "border border-border bg-card",
        filled:
          "border border-transparent bg-muted",
        brand:
          "border border-transparent bg-brand text-brand-foreground shadow-md",
        accent:
          "border border-border bg-card border-l-4 border-l-brand shadow-sm",
      },
    },
    defaultVariants: {
      variant: "elevated",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Card - content container with 5 variants:
 *
 * - `elevated` (default): bg-card with shadow-md, clearly visible on any
 *   surface
 * - `outline`: bg-card, border only without shadow
 * - `filled`: bg-muted, no border (transparent)
 * - `brand`: solid bg-brand, for hero/CTA cards
 * - `accent`: bg-card with a 4px brand left border, for highlight
 */
function Card({ className, variant, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props} />
  );
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 p-5", className)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-semibold leading-tight tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-2 p-5 pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
