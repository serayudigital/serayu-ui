import * as React from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/cn";

/**
 * MultiSelectCombobox - multi-pick combobox with chips on the trigger.
 *
 * - Wraps Popover + custom list (no `cmdk` dependency).
 * - Trigger shows chips for the picked items plus a search input.
 * - Optional inline item creation via the Enter key (TagInput mode).
 * - Substring filtering is case-insensitive by default; a custom
 *   filter function is also supported.
 * - Keyboard: ArrowUp/Down to navigate, Enter to pick or create,
 *   Escape to close.
 *
 * Example:
 *   <MultiSelectCombobox
 *     items={tags}
 *     value={selected}
 *     onValueChange={setSelected}
 *     placeholder="Pick tags..."
 *     canCreate
 *     onCreate={(label) => addTag(label)}
 *   />
 */

export interface MultiSelectComboboxItem {
  value: string;
  label: React.ReactNode;
  /** Text used for filtering and chip display (default: `value`). */
  textValue?: string;
  disabled?: boolean;
}

export interface MultiSelectComboboxProps {
  items: MultiSelectComboboxItem[];
  /** Array of picked values. */
  value: string[];
  /** Called whenever the picked list changes. */
  onValueChange: (value: string[]) => void;
  /** Placeholder for the search input. */
  placeholder?: string;
  /** Message shown when there are no results. */
  emptyMessage?: React.ReactNode;
  /** Label for the "create new" option (default "Add"). */
  createLabel?: (query: string) => React.ReactNode;
  /** Substring filter or a custom `(item, query) => boolean`. */
  filter?: (
    item: MultiSelectComboboxItem,
    query: string
  ) => boolean;
  /** Maximum pickable items. 0 = unlimited. */
  maxItems?: number;
  /** Allow inline creation of new items. Default false. */
  canCreate?: boolean;
  /** Called when the user creates a new item. Only used when `canCreate` is true. */
  onCreate?: (label: string) => void;
  /** Disable the input (default false). */
  disabled?: boolean;
  /** ID used for label/aria wiring. */
  id?: string;
  className?: string;
  /** Popover width. */
  popoverClassName?: string;
}

const defaultFilter = (
  item: MultiSelectComboboxItem,
  query: string
) => {
  const text = (item.textValue ?? item.value).toLowerCase();
  return text.includes(query.toLowerCase());
};

function MultiSelectCombobox({
  items,
  value,
  onValueChange,
  placeholder = "Search...",
  emptyMessage = "No results",
  createLabel = (q) => `Add "${q}"`,
  filter = defaultFilter,
  maxItems = 0,
  canCreate = false,
  onCreate,
  disabled = false,
  id,
  className,
  popoverClassName,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedItems = React.useMemo(
    () => items.filter((it) => value.includes(it.value)),
    [items, value]
  );

  const filtered = React.useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    return items.filter((it) => filter(it, q));
  }, [items, query, filter]);

  // List of options shown: filter results + create option (if available).
  const canCreateNew =
    canCreate &&
    query.trim().length > 0 &&
    !items.some(
      (it) =>
        (it.textValue ?? it.value).toLowerCase() ===
        query.trim().toLowerCase()
    );

  const totalOptions = filtered.length + (canCreateNew ? 1 : 0);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleToggle = (itemValue: string) => {
    const item = items.find((it) => it.value === itemValue);
    if (item?.disabled) return;

    if (value.includes(itemValue)) {
      onValueChange(value.filter((v) => v !== itemValue));
    } else {
      if (maxItems > 0 && value.length >= maxItems) return;
      onValueChange([...value, itemValue]);
    }
    // Do not close the popover - multi-select stays open.
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleCreate = () => {
    const q = query.trim();
    if (!q || !canCreate || !onCreate) return;
    onCreate(q);
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleRemoveChip = (itemValue: string) => {
    onValueChange(value.filter((v) => v !== itemValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(totalOptions - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (canCreateNew && activeIndex === filtered.length) {
        handleCreate();
        return;
      }
      const target = filtered[activeIndex];
      if (target) handleToggle(target.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Backspace" && !query && value.length > 0) {
      // Remove the last chip when the input is empty.
      handleRemoveChip(value[value.length - 1]);
    }
  };

  const triggerTextValue = selectedItems
    .map((it) => it.textValue ?? (typeof it.label === "string" ? it.label : it.value))
    .join(", ");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setOpen(true)}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              requestAnimationFrame(() => inputRef.current?.focus());
            }
          }}
          className={cn(
            "flex h-auto min-h-[44px] w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm sd-tap transition-colors text-left",
            "hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            disabled && "cursor-not-allowed opacity-50",
            !triggerTextValue && "text-muted-foreground",
            className
          )}
        >
          {selectedItems.map((it) => {
            const text =
              it.textValue ??
              (typeof it.label === "string" ? it.label : it.value);
            return (
              <span
                key={it.value}
                className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-brand-foreground"
              >
                <span className="max-w-[120px] truncate">{text}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChip(it.value);
                  }}
                  aria-label={`Remove ${text}`}
                  className="-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            );
          })}
          <span className="flex-1 truncate">
            {triggerTextValue || placeholder}
          </span>
          {maxItems > 0 && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
              {value.length}/{maxItems}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          popoverClassName
        )}
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex h-8 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
        </div>
        <ul
          role="listbox"
          aria-multiselectable="true"
          className="max-h-64 overflow-y-auto py-1"
        >
          {filtered.length === 0 && !canCreateNew ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </li>
          ) : (
            <>
              {filtered.map((item, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = value.includes(item.value);
                const text =
                  item.textValue ?? (typeof item.label === "string"
                    ? item.label
                    : item.value);
                return (
                  <li
                    key={item.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={item.disabled || undefined}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleToggle(item.value)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                      item.disabled && "cursor-not-allowed opacity-50",
                      isActive && "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                        isSelected
                          ? "border-brand bg-brand text-brand-foreground"
                          : "border-border bg-background"
                      )}
                      aria-hidden
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {query.trim() ? (
                        <HighlightedText text={text} query={query.trim()} />
                      ) : (
                        item.label
                      )}
                    </span>
                  </li>
                );
              })}
              {canCreateNew && (
                <li
                  role="option"
                  aria-selected={false}
                  onMouseEnter={() => setActiveIndex(filtered.length)}
                  onClick={handleCreate}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 border-t border-border px-3 py-2 text-sm text-brand",
                    activeIndex === filtered.length && "bg-muted"
                  )}
                >
                  <Plus className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{createLabel(query.trim())}</span>
                </li>
              )}
            </>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent font-bold text-brand">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export { MultiSelectCombobox };
