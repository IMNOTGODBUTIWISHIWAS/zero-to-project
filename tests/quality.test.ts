import { describe, expect, it } from "vitest";
import { generateProjectPath } from "../src/lib/curriculum";
import { auditBuildGuide, auditConceptCards, auditResourceUse } from "../src/lib/quality";
import { createTutorialGuide, repairGuideForQuality } from "../src/lib/tutorialGuide";
import type { ConceptModule, CurationRecord, TutorialArticle, TutorialExtraction } from "../src/lib/types";

const article: TutorialArticle = {
  id: "web-server-quality",
  category: "Web Server",
  languages: ["Node.js"],
  title: "Build Your Own Web Server",
  url: "https://example.com/server",
  isVideo: false,
  source: "build-your-own-x",
  health: { status: "ok" }
};

const extraction: TutorialExtraction = {
  status: "full",
  sourceKind: "html",
  confidence: 0.92,
  title: article.title,
  finalUrl: article.url,
  sections: [
    {
      id: "parse-request",
      title: "Parse the HTTP request",
      level: 2,
      order: 0,
      summary: "Read the raw request and split method, path, headers, and body.",
      keyTerms: ["request", "headers", "body"],
      setupHints: ["node server.js"],
      codeSignals: ["socket.on(\"data\")"]
    }
  ],
  setupHints: ["node server.js"],
  keyTerms: ["HTTP", "socket", "headers"],
  codeSignals: ["socket.on(\"data\")"],
  notes: []
};

describe("quality audits", () => {
  it("flags concept sections that are thin or generic", () => {
    const weakConcepts: ConceptModule[] = [
      {
        id: "weak",
        title: "Concept",
        plainEnglish: "This project uses a concept.",
        whyItMatters: "It matters.",
        signsYouUnderstand: ["You read it."],
        resources: []
      }
    ];

    const audit = auditConceptCards(article, weakConcepts);

    expect(audit.verdict).toBe("needs-review");
    expect(audit.issues.map((issue) => issue.id)).toEqual(
      expect.arrayContaining(["concept-count", "concept-context", "concept-1-thin-explanation"])
    );
    expect(audit.issues.map((issue) => issue.id)).toContain("concept-1-resources");
  });

  it("creates tutorial-specific concept cards from extracted sections and key terms", () => {
    const path = generateProjectPath({ ...article, extraction });
    const conceptText = path.concepts.map((concept) => concept.title).join(" ");

    expect(conceptText).toContain("Tutorial section: Parse the HTTP request");
    expect(conceptText).toContain("Key term: socket");
    expect(path.concepts.every((concept) => concept.resources.length >= 2)).toBe(true);
    expect(path.concepts.flatMap((concept) => concept.resources).every((resource) => resource.url.startsWith("https://"))).toBe(true);
    expect(path.conceptQualityAudit?.score).toBeGreaterThanOrEqual(90);
  });

  it("repairs generated build guides before auditing structural quality", () => {
    const path = generateProjectPath({ ...article, extraction });
    const initialGuide = createTutorialGuide(article, path, extraction);
    const repairedGuide = repairGuideForQuality(article, path, extraction, initialGuide);
    const audit = auditBuildGuide(article, path, extraction, repairedGuide);

    expect(initialGuide.checkpoints).toHaveLength(1);
    expect(repairedGuide.checkpoints.length).toBeGreaterThanOrEqual(4);
    expect(repairedGuide.setupSteps.length).toBeGreaterThanOrEqual(4);
    expect(repairedGuide.finalProofTasks.length).toBeGreaterThanOrEqual(4);
    expect(repairedGuide.resourceLinks?.length).toBeGreaterThanOrEqual(3);
    expect(repairedGuide.checkpoints.every((checkpoint) => (checkpoint.resourceLinks?.length ?? 0) >= 2)).toBe(true);
    expect(audit.issues.map((issue) => issue.id)).not.toContain("build-count");
    expect(audit.issues.map((issue) => issue.id)).not.toContain("build-setup");
    expect(audit.issues.map((issue) => issue.id)).not.toContain("build-proof");
    expect(audit.issues.map((issue) => issue.id)).not.toContain("build-resources");
  });

  it("audits resource repetition and provider diversity", () => {
    const path = generateProjectPath({ ...article, extraction });
    const guide = repairGuideForQuality(
      article,
      path,
      extraction,
      createTutorialGuide(article, path, extraction)
    );
    const audit = auditResourceUse(article, path, {
      ...guide,
      resourceLinks: [guide.resourceLinks?.[0] ?? path.prerequisites[0].resource],
      checkpoints: guide.checkpoints.map((checkpoint) => ({
        ...checkpoint,
        resourceLinks: [guide.resourceLinks?.[0] ?? path.prerequisites[0].resource]
      }))
    });

    expect(audit.totalLinks).toBeGreaterThan(audit.uniqueLinks);
    expect(audit.issues.map((issue) => issue.target)).toContain("resources");
  });

  it("flags concept resource overlap and weak depth", () => {
    const repeatedResource = {
      provider: "Generic Docs",
      label: "Generic overview",
      url: "https://example.com/generic"
    };
    const concepts: ConceptModule[] = Array.from({ length: 4 }, (_, index) => ({
      id: `concept-${index}`,
      title: `HTTP concept ${index}`,
      plainEnglish:
        "This concept explains a specific web server idea with enough detail for a beginner to connect it to the tutorial.",
      whyItMatters:
        "It matters because the learner needs distinct evidence and references for each part of the web server build.",
      signsYouUnderstand: [
        "You can explain the concept in your own words.",
        "You can connect it to one build checkpoint.",
        "You can debug one failure related to it."
      ],
      resources: [repeatedResource]
    }));

    const audit = auditConceptCards(article, concepts);

    expect(audit.issues.map((issue) => issue.id)).toEqual(
      expect.arrayContaining(["concept-resource-depth", "concept-resource-overlap"])
    );
  });

  it("flags curated resources that have not been read-audited", () => {
    const curation: CurationRecord = {
      level: "curated",
      status: "approved",
      source: "Unit-test approved curation",
      summary: "Approved but intentionally missing source audits.",
      standardVersion: "test",
      updatedAt: "2026-06-09",
      notes: []
    };
    const path = {
      ...generateProjectPath({ ...article, extraction }),
      curation
    };
    const guide = {
      ...repairGuideForQuality(
        article,
        path,
        extraction,
        createTutorialGuide(article, path, extraction)
      ),
      curation
    };
    const audit = auditResourceUse(article, path, guide);

    expect(audit.issues.map((issue) => issue.id)).toContain("resource-source-audit-missing");
  });

  it("caps quality when the original tutorial source is blocked", () => {
    const blockedExtraction: TutorialExtraction = {
      status: "blocked",
      sourceKind: "html",
      confidence: 0.1,
      sections: [],
      setupHints: [],
      keyTerms: [],
      codeSignals: [],
      notes: ["The source blocked extraction."]
    };
    const path = generateProjectPath({ ...article, extraction: blockedExtraction });
    const guide = repairGuideForQuality(
      article,
      path,
      blockedExtraction,
      createTutorialGuide(article, path, blockedExtraction)
    );
    const audit = auditBuildGuide(article, path, blockedExtraction, guide);

    expect(audit.score).toBeLessThanOrEqual(84);
    expect(audit.verdict).not.toBe("excellent");
    expect(audit.issues.map((issue) => issue.id)).toContain("extraction-limited");
    expect(path.conceptQualityAudit?.verdict).not.toBe("excellent");
  });
});
