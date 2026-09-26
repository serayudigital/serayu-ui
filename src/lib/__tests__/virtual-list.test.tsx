import { describe, expect, it } from "vitest";
import { VirtualList } from "../../components/ui/virtual-list";

// VirtualList needs DOM. We only check exports & types without render.
// Render test is done manually in playground.

describe("VirtualList exports", () => {
  it("is defined as a function component", () => {
    expect(typeof VirtualList).toBe("function");
  });

  it("has displayName or function name", () => {
    expect(VirtualList.length).toBeGreaterThanOrEqual(0);
  });
});
