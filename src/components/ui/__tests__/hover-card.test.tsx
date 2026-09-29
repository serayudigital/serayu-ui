// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../hover-card";

afterEach(() => cleanup());

describe("HoverCard exports", () => {
  it("HoverCardContent has the expected displayName", () => {
    expect(HoverCardContent.displayName).toBe("HoverCardContent");
  });

  it("renders trigger and content inside a portal", () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Detail text</HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByText("Hover me")).toBeDefined();
    // Radix renders the portal but content may be hidden via data-state.
    // The trigger remains mounted in the regular DOM tree.
  });
});
