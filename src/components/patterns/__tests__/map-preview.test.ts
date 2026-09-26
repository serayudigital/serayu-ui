import { describe, expect, it } from "vitest";
import { MapPreview } from "../map-preview";

describe("MapPreview exports", () => {
  it("is defined as a function component", () => {
    expect(typeof MapPreview).toBe("function");
  });

  it("component name matches", () => {
    expect(MapPreview.name).toBe("MapPreview");
  });
});
