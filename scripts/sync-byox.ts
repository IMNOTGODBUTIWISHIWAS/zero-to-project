import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { maybeEnhanceGuideWithAi } from "../src/lib/aiGuide";
import { parseBuildYourOwnX } from "../src/lib/byoxParser";
import { applyCuratedGuideOverrides, curationLevelFor } from "../src/lib/curatedOverrides";
import { generateProjectPath } from "../src/lib/curriculum";
import { validateArticles } from "../src/lib/linkHealth";
import { auditBuildGuide, combineTutorialAudit } from "../src/lib/quality";
import { extractTutorial } from "../src/lib/tutorialExtraction";
import { createTutorialGuide, repairGuideForQuality } from "../src/lib/tutorialGuide";
import type { CatalogData, TutorialArticle, TutorialExtraction } from "../src/lib/types";

const readmeUrl =
  "https://raw.githubusercontent.com/codecrafters-io/build-your-own-x/master/README.md";
const outputPath = resolve("src/data/catalog.generated.json");

interface SyncOptions {
  skipHealth: boolean;
  skipExtraction: boolean;
  ai: boolean;
  noAi: boolean;
  concurrency: number;
  extractionConcurrency: number;
  timeoutMs: number;
  limitHealth?: number;
  limitExtraction?: number;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const readme = await fetchReadme();
  const parsed = parseBuildYourOwnX(readme);
  const healthChecked = options.skipHealth
    ? parsed
    : await validateWithOptionalLimit(parsed, options);
  const articles = await enrichWithExtractionAndGuides(healthChecked, options);
  const catalog: CatalogData = {
    generatedAt: new Date().toISOString(),
    sourceUrl: readmeUrl,
    articles
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  const statusCounts = articles.reduce<Record<string, number>>((counts, article) => {
    counts[article.health.status] = (counts[article.health.status] ?? 0) + 1;
    return counts;
  }, {});
  const extractionCounts = articles.reduce<Record<string, number>>((counts, article) => {
    const status = article.extraction?.status ?? "unknown";
    counts[status] = (counts[status] ?? 0) + 1;
    return counts;
  }, {});

  console.log(
    `Synced ${articles.length} tutorials to ${outputPath}. Health: ${JSON.stringify(statusCounts)} Extraction: ${JSON.stringify(extractionCounts)}`
  );
}

async function fetchReadme(): Promise<string> {
  const response = await fetch(readmeUrl);

  if (!response.ok) {
    throw new Error(`Could not fetch Build Your Own X README: ${response.status}`);
  }

  return response.text();
}

async function validateWithOptionalLimit(
  articles: TutorialArticle[],
  options: SyncOptions
): Promise<TutorialArticle[]> {
  if (options.limitHealth === undefined) {
    return validateArticles(articles, {
      concurrency: options.concurrency,
      timeoutMs: options.timeoutMs
    });
  }

  const toValidate = articles.slice(0, options.limitHealth);
  const untouched = articles.slice(options.limitHealth);
  const validated = await validateArticles(toValidate, {
    concurrency: options.concurrency,
    timeoutMs: options.timeoutMs
  });

  return [...validated, ...untouched];
}

async function enrichWithExtractionAndGuides(
  articles: TutorialArticle[],
  options: SyncOptions
): Promise<TutorialArticle[]> {
  const limit = options.limitExtraction ?? articles.length;
  const toExtract = articles.slice(0, limit);
  const untouched = articles.slice(limit);
  const enriched = options.skipExtraction
    ? await Promise.all(toExtract.map((article) => attachFallbackGuide(article, options)))
    : await runWithConcurrency(toExtract, options.extractionConcurrency, (article) =>
        attachExtractedGuide(article, options)
      );
  const untouchedWithFallback = await Promise.all(
    untouched.map((article) => attachFallbackGuide(article, options))
  );

  return [...enriched, ...untouchedWithFallback];
}

async function attachExtractedGuide(
  article: TutorialArticle,
  options: SyncOptions
): Promise<TutorialArticle> {
  const extraction = await extractTutorial(article, {
    timeoutMs: options.timeoutMs
  });

  return attachGuide(article, extraction, options);
}

async function attachFallbackGuide(
  article: TutorialArticle,
  options: SyncOptions
): Promise<TutorialArticle> {
  const extraction: TutorialExtraction = {
    status: article.health.status === "dead" ? "dead" : article.isVideo ? "video" : "unknown",
    sourceKind: article.isVideo ? "video" : "unknown",
    confidence: article.health.status === "dead" ? 0.05 : article.isVideo ? 0.42 : 0.2,
    title: article.health.title ?? article.title,
    finalUrl: article.health.finalUrl ?? article.url,
    extractedAt: new Date().toISOString(),
    sections: [],
    setupHints: [],
    keyTerms: [article.category, ...article.languages],
    codeSignals: [],
    notes: [
      options.skipExtraction
        ? "Extraction was skipped during sync, so this guide uses deterministic fallback scaffolding."
        : "Extraction was not run for this item because of the current sync limit."
    ]
  };

  return attachGuide(article, extraction, options);
}

async function attachGuide(
  article: TutorialArticle,
  extraction: TutorialExtraction,
  options: SyncOptions
): Promise<TutorialArticle> {
  const articleWithExtraction = {
    ...article,
    extraction
  };
  const path = generateProjectPath(articleWithExtraction);
  const baseGuide = applyCuratedGuideOverrides(
    articleWithExtraction,
    path,
    createTutorialGuide(articleWithExtraction, path, extraction)
  );
  const guide = repairGuideForQuality(articleWithExtraction, path, extraction, baseGuide);
  const aiEnabled = options.ai && !options.noAi && Boolean(process.env.OPENAI_API_KEY) && path.curation?.level !== "curated";
  const aiGuide = await maybeEnhanceGuideWithAi(articleWithExtraction, extraction, guide, {
    enabled: aiEnabled,
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL
  });
  const tutorialGuide = repairGuideForQuality(
    articleWithExtraction,
    path,
    extraction,
    applyCuratedGuideOverrides(articleWithExtraction, path, aiGuide)
  );
  const buildAudit = auditBuildGuide(articleWithExtraction, path, extraction, tutorialGuide);
  const conceptsAudit = path.conceptQualityAudit ?? {
    score: 0,
    verdict: "needs-review" as const,
    checkedAt: new Date().toISOString(),
    issues: [],
    repairs: ["Concept audit was unavailable during sync."]
  };
  const qualityAudit = combineTutorialAudit(buildAudit, conceptsAudit);

  return {
    ...article,
    extraction,
    curation: path.curation ?? curationLevelFor(articleWithExtraction),
    tutorialGuide: {
      ...tutorialGuide,
      qualityAudit: buildAudit
    },
    qualityAudit
  };
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  task: (item: T) => Promise<R>
): Promise<R[]> {
  const queue = items.map((item, index) => ({ item, index }));
  const results: R[] = new Array(items.length);

  async function worker() {
    while (queue.length > 0) {
      const next = queue.shift();

      if (!next) {
        return;
      }

      results[next.index] = await task(next.item);
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => worker()));
  return results;
}

function parseArgs(args: string[]): SyncOptions {
  const options: SyncOptions = {
    skipHealth: false,
    skipExtraction: false,
    ai: false,
    noAi: false,
    concurrency: 8,
    extractionConcurrency: 5,
    timeoutMs: 4500
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--skip-health") {
      options.skipHealth = true;
    }

    if (arg === "--skip-extraction") {
      options.skipExtraction = true;
    }

    if (arg === "--no-ai") {
      options.noAi = true;
    }

    if (arg === "--ai") {
      options.ai = true;
    }

    if (arg === "--concurrency" && next) {
      options.concurrency = Number(next);
      index += 1;
    }

    if (arg === "--extraction-concurrency" && next) {
      options.extractionConcurrency = Number(next);
      index += 1;
    }

    if (arg === "--timeout" && next) {
      options.timeoutMs = Number(next);
      index += 1;
    }

    if (arg === "--limit-health" && next) {
      options.limitHealth = Number(next);
      index += 1;
    }

    if (arg === "--limit-extraction" && next) {
      options.limitExtraction = Number(next);
      index += 1;
    }
  }

  return options;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
