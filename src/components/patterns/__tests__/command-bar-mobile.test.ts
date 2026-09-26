import { describe, expect, it } from "vitest";
import { CommandBarMobile } from "../command-bar-mobile";

describe("CommandBarMobile exports", () => {
  it("is defined as a function", () => {
    expect(typeof CommandBarMobile).toBe("function");
  });

  it("component name matches", () => {
    expect(CommandBarMobile.name).toBe("CommandBarMobile");
  });
});
