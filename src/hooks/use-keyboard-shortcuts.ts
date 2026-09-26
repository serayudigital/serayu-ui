import { useEffect, useRef } from "react";

export interface KeyboardShortcut {
  /**
   * Key or chord. Can be a key name ("Escape", "Enter",
   * "ArrowUp") or a chord ("Mod+k", "Cmd+S"). Case-insensitive.
   *
   * Supported aliases: mod/cmd/ctrl (all treated as Cmd/Ctrl modifier),
   * shift, alt, esc, space, slash, arrowup/down/left/right.
   */
  key: string;
  /** true = matches Cmd (Mac) or Ctrl (Windows/Linux). */
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  /** Allow trigger when focus is on input/textarea/contenteditable. */
  allowInInputs?: boolean;
  handler: (event: KeyboardEvent) => void;
}

const KEY_ALIASES: Record<string, string> = {
  mod: "mod",
  cmd: "mod",
  ctrl: "mod",
  meta: "mod",
  shift: "shift",
  alt: "alt",
  esc: "Escape",
  escape: "Escape",
  enter: "Enter",
  space: " ",
  slash: "/",
  arrowup: "ArrowUp",
  arrowdown: "ArrowDown",
  arrowleft: "ArrowLeft",
  arrowright: "ArrowRight",
};

/**
 * useKeyboardShortcuts - attach a global keyboard listener for a list
 * of chords.
 *
 * - Auto-skips when the target is input/textarea/contenteditable,
 *   unless `allowInInputs: true`.
 * - `meta: true` matches Cmd or Ctrl for cross-OS consistency.
 * - The shortcut list is read via ref so the listener does not need to
 *   be reattached every render, but declare the array stably
 *   (const outside the component or useMemo) to keep hot reload clean.
 *
 * Example:
 *   useKeyboardShortcuts([
 *     { key: "Mod+k", meta: true, handler: () => openPalette() },
 *     { key: "Escape", handler: () => close() },
 *   ]);
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
  const ref = useRef(shortcuts);
  ref.current = shortcuts;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: KeyboardEvent) => {
      for (const sc of ref.current) {
        const parsed = parseShortcut(sc);
        if (!parsed) continue;
        if (!matchShortcut(event, parsed)) continue;
        if (!sc.allowInInputs && isEditableTarget(event.target)) continue;
        sc.handler(event);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}

interface ParsedShortcut {
  key: string;
  meta: boolean;
  shift: boolean;
  alt: boolean;
}

function parseShortcut(sc: KeyboardShortcut): ParsedShortcut | null {
  const parts = sc.key
    .toLowerCase()
    .split("+")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;

  let meta = sc.meta ?? false;
  let shift = sc.shift ?? false;
  let alt = sc.alt ?? false;
  let key = "";

  for (const part of parts) {
    const resolved = KEY_ALIASES[part];
    if (resolved === "mod") {
      meta = true;
    } else if (resolved === "shift") {
      shift = true;
    } else if (resolved === "alt") {
      alt = true;
    } else if (resolved) {
      key = resolved;
    } else {
      // Single letters go into lowercase; named keys stay as-is
      // (e.g. "ArrowUp"), then matched case-insensitively in the matcher.
      key = part.length === 1 ? part : capitalizeFirst(part);
    }
  }

  return { key, meta, shift, alt };
}

function matchShortcut(event: KeyboardEvent, parsed: ParsedShortcut): boolean {
  const metaPressed = event.metaKey || event.ctrlKey;
  if (parsed.meta !== metaPressed) return false;
  if (parsed.shift !== event.shiftKey) return false;
  if (parsed.alt !== event.altKey) return false;
  if (!parsed.key) return true;
  return event.key.toLowerCase() === parsed.key.toLowerCase();
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
