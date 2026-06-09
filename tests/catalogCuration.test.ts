import { describe, expect, it } from "vitest";
import catalog from "../src/data/catalog.generated.json";
import { articlePaths } from "../src/lib/catalog";
import type { ResourceLink } from "../src/lib/types";

describe("generated catalog curation coverage", () => {
  it("does not ship generated-only or catalog-wide fallback guidance for current tutorials", () => {
    const articles = catalog.articles;
    const generated = articles.filter((article) => article.curation?.level === "generated");
    const catalogWide = articles.filter((article) =>
      article.curation?.source.includes("Catalog-wide researched curation safety net")
    );

    expect(generated).toHaveLength(0);
    expect(catalogWide).toHaveLength(0);
  });

  it("ships resource audits without needs-review verdicts", () => {
    const weakResourceStacks = catalog.articles.filter(
      (article) => article.qualityAudit?.resources?.verdict === "needs-review"
    );

    expect(weakResourceStacks).toHaveLength(0);
  });

  it("requires read-in-full source audits for curated concept and build resources", () => {
    const curatedResourceGaps = articlePaths.flatMap(({ article, path }) => {
      const curationLevel = article.curation?.level ?? path.curation?.level;

      if (curationLevel !== "curated") return [];

      return uniqueResources([
        ...path.concepts.flatMap((concept) => concept.resources ?? []),
        ...(article.tutorialGuide?.resourceLinks ?? []),
        ...(article.tutorialGuide?.checkpoints.flatMap((checkpoint) => checkpoint.resourceLinks ?? []) ?? [])
      ])
        .filter((resource) => !resource.audit || resource.audit.status !== "read-in-full" || resource.audit.verdict === "rejected")
        .map((resource) => `${article.id}: ${resource.provider} - ${resource.label}`);
    });

    expect(curatedResourceGaps).toHaveLength(0);
  });
});

function uniqueResources(resources: ResourceLink[]): ResourceLink[] {
  const seen = new Set<string>();

  return resources.filter((resource) => {
    const key = resource.url.toLowerCase();

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}
