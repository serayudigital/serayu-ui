import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * clsx + tailwind-merge wrapper.
 * Combines class names and lets the last Tailwind class win on conflict.
 *
 * Example:
 *   cn("px-2 py-1", condition && "bg-brand", "px-4")
 *   // => "py-1 bg-brand px-4"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
