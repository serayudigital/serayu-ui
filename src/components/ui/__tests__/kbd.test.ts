// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { Kbd, kbdVariants } from "../kbd";

describe("Kbd exports", () => {
  it("Kbd is a forwardRef object", () => {
    expect(typeof Kbd).toBe("object");
    expect(Kbd).not.toBeNull();
  });

  it("Kbd has the expected displayName", () => {
    expect(Kbd.displayName).toBe("Kbd");
  });

  it("kbdVariants is callable", () => {
    expect(typeof kbdVariants).toBe("function");
  });
});
