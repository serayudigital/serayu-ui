import * as React from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

/**
 * CommandPalette - Cmd+K-style modal for navigation and quick actions.
 *
 * - Trigger: keyboard shortcut "mod+k" (or Ctrl+K) + button click.
 * - Items grouped via `group` field. Filter by label + keywords
 *   (case-insensitive).
 * - Keyboard: ArrowUp/Down to navigate, Enter to execute, Esc to close.
 * - Solid tone (NOT gradient).
 *
 * Example:
 *   const items = [
 *     { id: "1", label: "Home", icon: <Home />, group: "Navigation",
 *       onSelect: () => router.push("/") },
 *     { id: "2", label: "Create order", icon: <Plus />, group: "Actions",
 *       keywords: ["order", "new"], onSelect: createOrder },
 *   ];
 *   <CommandPalette items={items} open={open} onOpenChange={setOpen} />
 */

export interface CommandItem {
  /** Unique identifier. */
  id: string;
  /** Primary label. */
  label: string;
  /** Additional description. */
  description?: string;
  /** Icon on the left. */
  icon?: React.ReactNode;
  /** Group id for grouping. */
  group?: string;
  /** Additional keywords for search. */
  keywords?: string[];
  /** Handler when picked. */
  onSelect?: () => void;
  /** URL for navigation. */
  href?: string;
  /** Keyboard shortcut (shown as hint). */
  shortcut?: string;
  /** Disable item. */
  disabled?: boolean;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Default open on mount. */
  defaultOpen?: boolean;
  /** Input placeholder. */
  placeholder?: string;
  /** Text when result is empty. */
  emptyText?: string;
  /** Keyboard shortcut (default "mod+k"). Set to `false` to disable. */
  shortcut?: string | false;
  /** Container class. */
  className?: string;
}

function defaultGroupLabel(id: string | undefined): string {
  return id ?? "Other";
}

export function CommandPalette({
  items,
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  placeholder = "Search commands...",
  emptyText = "No results",
  shortcut = "mod+k",
  className,
}: CommandPaletteProps) {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp! : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const [query, setQuery] = React.useState("");
  const [activeIdx, setActiveIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Keyboard shortcut (Cmd/Ctrl+K).
  React.useEffect(() => {
    if (shortcut === false) return;
    if (typeof window === "undefined") return;
    const chord = String(shortcut).toLowerCase();
    const handler = (e: KeyboardEvent) => {
      // e.key may be undefined for dead keys / IME composition.
      if (!e.key) return;
      const k = e.key.toLowerCase();
      const mod = e.metaKey || e.ctrlKey;
      const wantsMod = chord.includes("mod");
      const target = wantsMod ? k === chord.split("+").pop() : false;
      // Simple: only supports "mod+<letter>".
      if (mod && wantsMod && target) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcut, open, setOpen]);

  // Reset when opened.
  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      // Focus input after dialog mount.
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open]);

  // Filter items.
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.filter((i) => !i.disabled);
    return items.filter((item) => {
      if (item.disabled) return false;
      const label = item.label.toLowerCase().includes(q);
      const desc = item.description?.toLowerCase().includes(q) ?? false;
      const kw = item.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false;
      return label || desc || kw;
    });
  }, [items, query]);

  // Group filtered items.
  const grouped = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const g = item.group ?? "";
      const list = map.get(g) ?? [];
      list.push(item);
      map.set(g, list);
    }
    return Array.from(map.entries()).map(([id, list]) => ({
      id,
      label: defaultGroupLabel(id || undefined),
      items: list,
    }));
  }, [filtered]);

  // Flat list for keyboard navigation.
  const flat = React.useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  // Reset activeIdx when filter changes.
  React.useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const selectItem = (item: CommandItem) => {
    if (item.disabled) return;
    if (item.href && typeof window !== "undefined") {
      window.location.href = item.href;
    }
    item.onSelect?.();
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((idx) => Math.min(flat.length - 1, idx + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((idx) => Math.max(0, idx - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[activeIdx];
      if (item) selectItem(item);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIdx(Math.max(0, flat.length - 1));
    }
  };

  // Auto-scroll to active item.
  React.useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-idx="${activeIdx}"]`
    );
    if (!el) return;
    const parent = listRef.current;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < parent.scrollTop) {
      parent.scrollTop = top;
    } else if (bottom > parent.scrollTop + parent.clientHeight) {
      parent.scrollTop = bottom - parent.clientHeight;
    }
  }, [activeIdx]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "max-w-xl gap-0 p-0 sm:rounded-lg",
          className
        )}
        showCloseButton={false}
        onKeyDown={onKeyDown}
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Search commands"
            className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <kbd
            aria-hidden
            className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block"
          >
            Esc
          </kbd>
        </div>

        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-2"
          role="listbox"
          aria-label="Results"
        >
          {flat.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.id} className="mb-1">
                <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                <ul>
                  {group.items.map((item) => {
                    const idx = flat.indexOf(item);
                    const isActive = idx === activeIdx;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          data-idx={idx}
                          disabled={item.disabled}
                          onClick={() => selectItem(item)}
                          onMouseEnter={() => setActiveIdx(idx)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm sd-tap",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                            isActive
                              ? "bg-muted text-foreground"
                              : "text-foreground/90",
                            item.disabled && "cursor-not-allowed opacity-50"
                          )}
                          aria-selected={isActive}
                          role="option"
                        >
                          {item.icon ? (
                            <span
                              aria-hidden
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground [&_svg]:h-4 [&_svg]:w-4"
                            >
                              {item.icon}
                            </span>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {item.label}
                            </div>
                            {item.description ? (
                              <div className="truncate text-xs text-muted-foreground">
                                {item.description}
                              </div>
                            ) : null}
                          </div>
                          {item.shortcut ? (
                            <kbd
                              aria-hidden
                              className="shrink-0 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                            >
                              {item.shortcut}
                            </kbd>
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
