import * as React from "react";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Stepper - progressive step visualization (horizontal or vertical).
 *
 * State per step:
 *   - "completed": brand color, checkmark icon.
 *   - "current":   brand color, optional pulse ring.
 *   - "upcoming":  muted color.
 *
 * - onStepClick(item, index) enables navigation to a completed step
 *   (default: no handler, so click has no effect).
 *
 * Example:
 *   <Stepper
 *     steps={[
 *       { title: "Account", description: "Create your account" },
 *       { title: "Profile", description: "Complete profile" },
 *       { title: "Done" },
 *     ]}
 *     currentStep={1}
 *   />
 */

export interface StepperItem {
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof stepperVariants> {
  steps: StepperItem[];
  /** Active step index (0-based). */
  currentStep?: number;
  /** Show connector line between steps (default true). */
  showConnector?: boolean;
  /** Click handler for a step. Steps with `upcoming` status are skipped. */
  onStepClick?: (index: number) => void;
}

const stepperVariants = cva("", {
  variants: {
    orientation: {
      horizontal: "flex flex-row items-start",
      vertical: "flex flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

function computeStatus(
  index: number,
  current: number
): "completed" | "current" | "upcoming" {
  if (index < current) return "completed";
  if (index === current) return "current";
  return "upcoming";
}

function Stepper({
  className,
  orientation,
  steps,
  currentStep = 0,
  showConnector = true,
  onStepClick,
  ...props
}: StepperProps) {
  return (
    <div
      className={cn(stepperVariants({ orientation }), className)}
      {...props}
    >
      {steps.map((step, i) => {
        const status = computeStatus(i, currentStep);
        const clickable = Boolean(onStepClick) && status !== "upcoming";
        const isLast = i === steps.length - 1;
        return (
          <React.Fragment key={i}>
            <StepItem
              step={step}
              status={status}
              index={i}
              clickable={clickable}
              orientation={orientation ?? "horizontal"}
              onClick={() => onStepClick?.(i)}
            />
            {showConnector && !isLast && (
              <Connector
                orientation={orientation ?? "horizontal"}
                status={status}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

interface StepItemProps {
  step: StepperItem;
  status: "completed" | "current" | "upcoming";
  index: number;
  orientation: "horizontal" | "vertical";
  clickable: boolean;
  onClick: () => void;
}

function StepItem({
  step,
  status,
  index,
  orientation,
  clickable,
  onClick,
}: StepItemProps) {
  const isHorizontal = orientation === "horizontal";
  const circleBase =
    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold sd-tap transition-colors";
  const circleStatus =
    status === "completed"
      ? "border-brand bg-brand text-brand-foreground"
      : status === "current"
        ? "border-brand bg-background text-brand"
        : "border-border bg-background text-muted-foreground";

  return (
    <div
      className={cn(
        "flex",
        isHorizontal ? "flex-col items-center text-center" : "flex-row items-start gap-3"
      )}
    >
      <button
        type="button"
        disabled={!clickable}
        onClick={onClick}
        aria-current={status === "current" ? "step" : undefined}
        aria-label={`Step ${index + 1}: ${typeof step.title === "string" ? step.title : ""}`}
        className={cn(circleBase, circleStatus, !clickable && "cursor-default")}
      >
        {status === "completed" ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          index + 1
        )}
      </button>
      <div className={cn(isHorizontal ? "mt-2" : "pt-1")}>
        <div
          className={cn(
            "text-sm font-medium",
            status === "upcoming" ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {step.title}
        </div>
        {step.description && (
          <div
            className={cn(
              "text-xs",
              status === "upcoming"
                ? "text-muted-foreground/70"
                : "text-muted-foreground"
            )}
          >
            {step.description}
          </div>
        )}
      </div>
    </div>
  );
}

function Connector({
  orientation,
  status,
}: {
  orientation: "horizontal" | "vertical";
  status: "completed" | "current" | "upcoming";
}) {
  const isCompleted = status === "completed";
  if (orientation === "horizontal") {
    return (
      <div
        className={cn(
          "mx-2 mt-4 h-0.5 flex-1 rounded-full",
          isCompleted ? "bg-brand" : "bg-border"
        )}
        aria-hidden
      />
    );
  }
  return (
    <div
      className={cn(
        "ml-4 h-8 w-0.5 rounded-full",
        isCompleted ? "bg-brand" : "bg-border"
      )}
      aria-hidden
    />
  );
}

export { Stepper };
