import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/cn";

/**
 * Combobox - input with searchable suggestion list.
 *
 * - Wraps Popover + Input + custom List (without the cmdk library).
 * - Filter can be a substring string (default) or a custom function.
 * - Highlights matching substring with <mark>.
 * - Keyboard: Arrow up/down to navigate, Enter to pick, Esc to close.
 *
 * Example:
 *   <Combobox
 *     items={cities}
 *     value={city}
 *     onValueChange={setCity}
 *     placeholder="Select city..."
 *     emptyMessage="City not found"
 *   />
 */

export interface ComboboxItem {
  value: string;
  label: React.ReactNode;
  /** Text for filter and display (default: value). */
  textValue?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  items: ComboboxItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  /** Default: case-insensitive substring. Can custom (item, query) => boolean. */
  filter?: (item: ComboboxItem, query: string) => boolean;
  /** Custom render item (default: shows label). */
  renderItem?: (item: ComboboxItem) => React.ReactNode;
  /** Disabled input (default false). */
  disabled?: boolean;
  /** ID for label/aria. */
  id?: string;
  className?: string;
  /** Popover width (default "w-[var(--radix-popover-trigger-width)]"). */
  popoverClassName?: string;
}

const defaultFilter = (item: ComboboxItem, query: string) => {
  const text = (item.textValue ?? item.value).toLowerCase();
  return text.includes(query.toLowerCase());
};

function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Search...",
  emptyMessage = "No results",
  filter = defaultFilter,
  renderItem,
  disabled = false,
  id,
  className,
  popoverClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);

  const selected = items.find((it) => it.value === value);
  const selectedText = selected
    ? selected.textValue ?? (typeof selected.label === "string" ? selected.label : selected.value)
    : undefined;

  const filtered = React.useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((it) => filter(it, query.trim()));
  }, [items, query, filter]);

  // Reset active index when filter results change.
  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = (item: ComboboxItem) => {
    if (item.disabled) return;
    onValueChange?.(item.value);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[activeIndex];
      if (target) handleSelect(target);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm sd-tap transition-colors",
            "hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate text-left">
            {selectedText ?? placeholder}
          </span>
          <ChevronsUpDown
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        </button>
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
          className="max-h-64 overflow-y-auto py-1"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </li>
          ) : (
            filtered.map((item, idx) => {
              const isActive = idx === activeIndex;
              const isSelected = item.value === value;
              return (
                <li
                  key={item.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={item.disabled || undefined}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm",
                    item.disabled && "cursor-not-allowed opacity-50",
                    isActive && "bg-muted",
                    isSelected && "font-medium text-foreground"
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {renderItem ? (
                      renderItem(item)
                    ) : query.trim() ? (
                      <HighlightedText
                        text={item.textValue ?? item.value}
                        query={query.trim()}
                      />
                    ) : (
                      item.label
                    )}
                  </span>
                  {isSelected && (
                    <Check
                      className="h-4 w-4 shrink-0 text-brand"
                      aria-hidden
                    />
                  )}
                </li>
              );
            })
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

export { Combobox };
