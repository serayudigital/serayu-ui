// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useVisibilityPause } from "../use-visibility-pause";

describe("useVisibilityPause", () => {
  it("returns false by default when tab is visible", () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });
    const { result } = renderHook(() => useVisibilityPause());
    expect(result.current).toBe(false);
  });

  it("returns true on mount with hidden tab", () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    const { result } = renderHook(() => useVisibilityPause());
    expect(result.current).toBe(true);
  });

  it("updates state when visibilitychange fires", () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });
    const { result } = renderHook(() => useVisibilityPause());
    expect(result.current).toBe(false);

    act(() => {
      // Simulate browser hiding the tab.
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(result.current).toBe(true);

    act(() => {
      // Simulate tab becoming active again.
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "visible",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(result.current).toBe(false);
  });

  it("cleans up listener on unmount", () => {
    const removeSpy = vi.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() => useVisibilityPause());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
  });
});
