import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type SettingsItemType = "link" | "switch" | "info" | "destructive";

export interface SettingsItem {
  /** Unique item identifier. */
  id: string;
  /** Icon on the left. */
  icon?: React.ReactNode;
  /** Main label. */
  label: string;
  /** Additional description (small, below the label). */
  description?: string;
  /** Item type. */
  type: SettingsItemType;
  /** Info value on the right (for type="info"). */
  value?: React.ReactNode;
  /** URL for type="link" (renders as an anchor). */
  href?: string;
  /** Click handler (for type="link" or "destructive"). */
  onClick?: () => void;
  /** Switch state (for type="switch"). */
  checked?: boolean;
  /** Switch change handler. */
  onCheckedChange?: (next: boolean) => void;
  /** Disable item. */
  disabled?: boolean;
}

export interface SettingsSection {
  /** Section identifier. */
  id: string;
  /** Section title (small uppercase muted). */
  title?: string;
  /** Section description. */
  description?: string;
  items: SettingsItem[];
}

export interface SettingsListProps {
  sections: SettingsSection[];
  className?: string;
}

/**
 * SettingsList - list in the style of a Settings page with section headers
 * and items: link, switch, info, or destructive.
 *
 * - Sections separated by small uppercase muted titles.
 * - Destructive items use text-danger.
 * - Solid tone (NOT a gradient).
 *
 * Example:
 *   <SettingsList
 *     sections={[
 *       {
 *         id: "account",
 *         title: "Account",
 *         items: [
 *           { id: "profile", type: "link", label: "Profile", href: "/profile" },
 *           { id: "notif", type: "switch", label: "Notifications", checked: true,
 *             onCheckedChange: v => update(v) },
 *         ],
 *       },
 *       {
 *         id: "danger",
 *         title: "Danger zone",
 *         items: [
 *           { id: "delete", type: "destructive", label: "Delete account",
 *             onClick: handleDelete },
 *         ],
 *       },
 *     ]}
 *   />
 */
export function SettingsList({ sections, className }: SettingsListProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {sections.map((section) => (
        <section key={section.id} aria-label={section.title}>
          {section.title ? (
            <header className="px-1 pb-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
              {section.description ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {section.description}
                </p>
              ) : null}
            </header>
          ) : null}
          <ul className="overflow-hidden rounded-lg border border-border bg-surface">
            {section.items.map((item, idx) => (
              <SettingsRow
                key={item.id}
                item={item}
                isLast={idx === section.items.length - 1}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function SettingsRow({
  item,
  isLast,
}: {
  item: SettingsItem;
  isLast: boolean;
}) {
  const isDestructive = item.type === "destructive";
  const labelColor = isDestructive ? "text-danger" : "text-foreground";

  const base = cn(
    "flex w-full items-center gap-3 px-4 py-3 text-left sd-tap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
    item.disabled && "cursor-not-allowed opacity-50",
    !isLast && "border-b border-border"
  );

  const content = (
    <>
      {item.icon ? (
        <span
          aria-hidden
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md [&_svg]:h-4 [&_svg]:w-4",
            isDestructive
              ? "bg-danger/10 text-danger"
              : "bg-muted text-muted-foreground"
          )}
        >
          {item.icon}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className={cn("text-sm font-medium", labelColor)}>
          {item.label}
        </div>
        {item.description ? (
          <div className="mt-0.5 text-xs text-muted-foreground">
            {item.description}
          </div>
        ) : null}
      </div>

      <span className="shrink-0 text-sm text-muted-foreground">
        {renderRight(item)}
      </span>
    </>
  );

  if (item.type === "link" && item.href) {
    return (
      <li>
        <a
          href={item.href}
          className={cn(base, "hover:bg-muted")}
          aria-disabled={item.disabled || undefined}
          onClick={item.disabled ? (e) => e.preventDefault() : undefined}
        >
          {content}
        </a>
      </li>
    );
  }

  if (item.type === "switch") {
    return (
      <li>
        <label
          className={cn(
            base,
            "cursor-pointer hover:bg-muted",
            item.disabled && "pointer-events-none"
          )}
        >
          {content}
        </label>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(base, "hover:bg-muted")}
      >
        {content}
      </button>
    </li>
  );
}

function renderRight(item: SettingsItem): React.ReactNode {
  if (item.type === "link") {
    return (
      <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
    );
  }
  if (item.type === "switch") {
    return (
      <span
        role="switch"
        aria-checked={item.checked ?? false}
        aria-readonly
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors",
          item.checked ? "bg-brand" : "bg-muted"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-background shadow-sm transition-transform",
            item.checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </span>
    );
  }
  if (item.type === "info") {
    return <span className="text-muted-foreground">{item.value}</span>;
  }
  // destructive
  return (
    <ChevronRight className="h-4 w-4 text-danger" aria-hidden />
  );
}
