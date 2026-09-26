// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { Carousel } from "../carousel";

describe("Carousel exports", () => {
  it("is defined as a function", () => {
    expect(typeof Carousel).toBe("function");
  });

  it("component name matches", () => {
    expect(Carousel.name).toBe("Carousel");
  });
});
