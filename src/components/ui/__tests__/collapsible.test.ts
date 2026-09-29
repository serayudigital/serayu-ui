// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../collapsible";

describe("Collapsible exports", () => {
  it("all three parts are defined", () => {
    expect(Collapsible).toBeDefined();
    expect(CollapsibleTrigger).toBeDefined();
    expect(CollapsibleContent).toBeDefined();
  });

  it("CollapsibleContent has the expected displayName", () => {
    expect(CollapsibleContent.displayName).toBe("CollapsibleContent");
  });
});
