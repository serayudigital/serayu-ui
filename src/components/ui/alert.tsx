import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

const alertVariants = cva(
  "relative flex w-full gap-3 rounded-lg border p-4",
  {
    variants: {
      variant: {
        info: "border-info/30 bg-info/10 text-foreground",
        success: "border-success/30 bg-success/10 text-foreground",
        warning: "border-warning/30 bg-warning/10 text-foreground",
        danger: "border-danger/30 bg-danger/10 text-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap: Record<string, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const iconColorMap: Record<string, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  showIcon?: boolean;
}

function Alert({
  className,
  variant = "info",
  title,
  showIcon = true,
  children,
  ...props
}: AlertProps) {
  const Icon = iconMap[variant ?? "info"];
  return (
    <div
      role={variant === "danger" || variant === "warning" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {showIcon && Icon && (
        <Icon
          className={cn("h-5 w-5 shrink-0", iconColorMap[variant ?? "info"])}
          aria-hidden
        />
      )}
      <div className="flex-1 space-y-1">
        {title && (
          <h5 className="text-sm font-semibold leading-none">{title}</h5>
        )}
        <div className="text-sm text-foreground/80">{children}</div>
      </div>
    </div>
  );
}

export { Alert, alertVariants };
