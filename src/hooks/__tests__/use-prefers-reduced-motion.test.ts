// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { usePrefersReducedMotion } from "../use-prefers-reduced-motion";

describe("usePrefersReducedMotion", () => {
  beforeEach(() => {
    // Default to "no preference" between tests so cases start clean.
    if (typeof window !== "undefined") {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }),
      });
    }
  });

  it("returns false when reduced motion is not requested", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when matchMedia reports the query matches", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates state when the media query changes", () => {
    let listener: ((event: MediaQueryListEvent) => void) | null = null;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: (_: string, l: (event: MediaQueryListEvent) => void) => {
          listener = l;
        },
        removeEventListener: () => {
          listener = null;
        },
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      listener?.({ matches: true, media: "(prefers-reduced-motion: reduce)" } as MediaQueryListEvent);
    });
    expect(result.current).toBe(true);

    act(() => {
      listener?.({ matches: false, media: "(prefers-reduced-motion: reduce)" } as MediaQueryListEvent);
    });
    expect(result.current).toBe(false);
  });
});
