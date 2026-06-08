import { describe, expect, it } from "vitest";
import { generateProjectPath } from "../src/lib/curriculum";
import type { TutorialArticle } from "../src/lib/types";

describe("generateProjectPath", () => {
  it("creates a full zero-to-done path for any article", () => {
    const article: TutorialArticle = {
      id: "python-neural-network",
      category: "Neural Network",
      languages: ["Python"],
      title: "Implement a Neural Network from Scratch",
      url: "https://example.com/nn",
      isVideo: false,
      source: "build-your-own-x",
      health: { status: "ok" }
    };

    const path = generateProjectPath(article);

    expect(path.prerequisites.length).toBeGreaterThanOrEqual(6);
    expect(path.concepts.length).toBeGreaterThanOrEqual(2);
    expect(path.milestones.length).toBeGreaterThanOrEqual(5);
    expect(path.cvFraming).toContain(article.title);
  });

  it("adds stronger beginner warnings for expert projects", () => {
    const article: TutorialArticle = {
      id: "c-os",
      category: "Operating System",
      languages: ["C"],
      title: "Roll your own toy UNIX-clone OS",
      url: "https://example.com/os",
      isVideo: false,
      source: "build-your-own-x",
      health: { status: "unknown" }
    };

    const path = generateProjectPath(article);

    expect(path.difficulty).toBe("expert");
    expect(path.warnings.join(" ")).toContain("toy version");
    expect(path.warnings.join(" ")).toContain("not been verified");
  });

  it("includes deep-research-backed resources for major project families", () => {
    const browserPath = generateProjectPath({
      id: "browser-engine",
      category: "Web Browser",
      languages: ["Python"],
      title: "Build a toy browser",
      url: "https://browser.engineering/",
      isVideo: false,
      source: "build-your-own-x",
      health: { status: "ok" }
    });
    const serverPath = generateProjectPath({
      id: "web-server",
      category: "Web Server",
      languages: ["Python"],
      title: "Let's Build A Web Server",
      url: "https://ruslanspivak.com/lsbaws-part1/",
      isVideo: false,
      source: "build-your-own-x",
      health: { status: "ok" }
    });
    const systemsPath = generateProjectPath({
      id: "nand2tetris",
      category: "Uncategorized",
      languages: ["HDL"],
      title: "From NAND to Tetris",
      url: "https://www.nand2tetris.org/",
      isVideo: false,
      source: "build-your-own-x",
      health: { status: "ok" }
    });

    expect(browserPath.concepts.map((concept) => concept.title)).toContain("Parsing versus layout");
    expect(browserPath.curation?.level).toBe("curated");
    expect(browserPath.concepts.flatMap((concept) => concept.resources).some((resource) => resource.url === "https://browser.engineering/")).toBe(true);
    expect(serverPath.concepts.map((concept) => concept.title)).toContain("Request and response anatomy");
    expect(serverPath.curation?.level).toBe("curated");
    expect(serverPath.concepts.flatMap((concept) => concept.resources).some((resource) => resource.url === "https://ruslanspivak.com/lsbaws-part1/")).toBe(true);
    expect(systemsPath.concepts.map((concept) => concept.title)).toContain("Abstraction ladder");
    expect(systemsPath.curation?.level).toBe("curated");
    expect(systemsPath.concepts.flatMap((concept) => concept.resources).some((resource) => resource.url === "https://www.nand2tetris.org/")).toBe(true);
  });
});
