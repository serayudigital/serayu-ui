import { describe, expect, it } from "vitest";
import { StoryReelsViewer } from "../story-reels-viewer";

describe("StoryReelsViewer exports", () => {
  it("is defined as a function component", () => {
    expect(typeof StoryReelsViewer).toBe("function");
  });

  it("component name matches", () => {
    expect(StoryReelsViewer.name).toBe("StoryReelsViewer");
  });
});
