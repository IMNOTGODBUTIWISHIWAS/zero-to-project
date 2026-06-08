import { describe, expect, it } from "vitest";
import { generateProjectPath } from "../src/lib/curriculum";
import { createTutorialGuide } from "../src/lib/tutorialGuide";
import type { TutorialArticle, TutorialExtraction } from "../src/lib/types";

const article: TutorialArticle = {
  id: "server",
  category: "Web Server",
  languages: ["Node.js"],
  title: "Build Your Own Web Server",
  url: "https://example.com/server",
  isVideo: false,
  source: "build-your-own-x",
  health: { status: "ok" }
};

describe("createTutorialGuide", () => {
  it("creates tutorial-specific checkpoints from extracted sections", () => {
    const path = generateProjectPath(article);
    const extraction: TutorialExtraction = {
      status: "full",
      sourceKind: "html",
      confidence: 0.9,
      title: article.title,
      finalUrl: article.url,
      sections: [
        {
          id: "01-setup",
          title: "Project setup",
          level: 2,
          order: 0,
          summary: "Install dependencies and run the server.",
          keyTerms: ["dependencies", "server"],
          setupHints: ["npm install"],
          codeSignals: ["node server.js"]
        }
      ],
      setupHints: ["npm install"],
      keyTerms: ["HTTP"],
      codeSignals: ["node server.js"],
      notes: []
    };

    const guide = createTutorialGuide(article, path, extraction);

    expect(guide.extractionStatus).toBe("full");
    expect(guide.sourceRequired).toBe(false);
    expect(guide.checkpoints).toHaveLength(1);
    expect(guide.checkpoints[0].sourceSectionTitle).toBe("Project setup");
    expect(guide.checkpoints[0].resourceLinks?.length).toBeGreaterThanOrEqual(2);
    expect(guide.resourceLinks?.length).toBeGreaterThanOrEqual(3);
    expect(guide.setupSteps.join(" ")).toContain("npm install");
  });

  it("falls back clearly when extraction is blocked", () => {
    const path = generateProjectPath(article);
    const guide = createTutorialGuide(article, path, {
      status: "blocked",
      sourceKind: "html",
      confidence: 0.1,
      sections: [],
      setupHints: [],
      keyTerms: [],
      codeSignals: [],
      notes: ["The source blocked extraction."]
    });

    expect(guide.sourceRequired).toBe(true);
    expect(guide.fallbackReason).toContain("blocked extraction");
    expect(guide.checkpoints.length).toBeGreaterThan(0);
    expect(guide.checkpoints[0].resourceLinks?.length).toBeGreaterThanOrEqual(2);
  });
});
