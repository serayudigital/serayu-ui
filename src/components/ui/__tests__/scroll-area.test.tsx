// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { ScrollArea } from "../scroll-area";

afterEach(() => cleanup());

describe("ScrollArea", () => {
  it("renders children inside the viewport", () => {
    render(
      <ScrollArea className="h-32 w-48">
        <p>Item one</p>
        <p>Item two</p>
        <p>Item three</p>
      </ScrollArea>
    );
    expect(screen.getByText("Item one")).toBeDefined();
    expect(screen.getByText("Item three")).toBeDefined();
  });

  it("exposes ScrollArea as a forwardRef object", () => {
    expect(typeof ScrollArea).toBe("object");
    expect(ScrollArea.displayName).toBe("ScrollArea");
  });
});
