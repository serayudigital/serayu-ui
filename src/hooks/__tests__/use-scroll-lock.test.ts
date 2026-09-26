// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { useScrollLock, __testHooks } from "../use-scroll-lock";

describe("useScrollLock", () => {
  beforeEach(() => {
    __testHooks.resetForTest();
    // Reset body style between tests.
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  });

  afterEach(() => {
    __testHooks.resetForTest();
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  });

  it("no-op when active=false", () => {
    renderHook(() => useScrollLock(false));
    expect(document.body.style.overflow).toBe("");
  });

  it("locks body overflow when active=true", () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores overflow on unmount", () => {
    document.body.style.overflow = "scroll";
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("ref-count: nested lock does not clobber style", () => {
    document.body.style.overflow = "auto";
    const first = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    // Second lock (e.g. Sheet inside Dialog).
    const second = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    // Unlock inner first - body still locked.
    second.unmount();
    expect(document.body.style.overflow).toBe("hidden");

    // Unlock outer - body restored.
    first.unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("adds paddingRight when there is a scrollbar", () => {
    // Simulate 15px scrollbar.
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      get: () => window.innerWidth - 15,
    });
    act(() => {
      renderHook(() => useScrollLock(true));
    });
    expect(document.body.style.paddingRight).toBe("15px");

    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      get: () => window.innerWidth,
    });
  });

  it("does not lock body when target is a specific HTMLElement", () => {
    const target = document.createElement("div");
    document.body.appendChild(target);
    renderHook(() => useScrollLock(true, target));
    // Body is not locked.
    expect(document.body.style.overflow).toBe("");
    // Target is locked.
    expect(target.style.overflow).toBe("hidden");
    document.body.removeChild(target);
  });
});
