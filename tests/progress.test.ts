import { describe, expect, it } from "vitest";
import { emptyProgress, loadProgress, saveProgress, toggleFavorite, toggleRecord } from "../src/lib/progress";

describe("progress helpers", () => {
  it("loads empty progress when storage is empty", () => {
    window.localStorage.clear();

    expect(loadProgress()).toEqual(emptyProgress);
  });

  it("saves and reloads progress", () => {
    window.localStorage.clear();
    saveProgress({
      ...emptyProgress,
      completedModules: { basics: true },
      lastOpenedArticleId: "project"
    });

    expect(loadProgress().completedModules.basics).toBe(true);
    expect(loadProgress().lastOpenedArticleId).toBe("project");
  });

  it("toggles records and favorites", () => {
    expect(toggleRecord({}, "item")).toEqual({ item: true });
    expect(toggleRecord({ item: true }, "item")).toEqual({ item: false });
    expect(toggleFavorite([], "a")).toEqual(["a"]);
    expect(toggleFavorite(["a"], "a")).toEqual([]);
  });
});
