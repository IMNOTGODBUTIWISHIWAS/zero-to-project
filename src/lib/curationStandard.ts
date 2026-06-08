import type { ProjectPath, TutorialArticle } from "./types";

export const curationStandardVersion = "zero-to-project-curation-v1";

export const curationStandard = [
  "Beginner path starts from no coding background and names every prerequisite before the tutorial.",
  "Tutorial-specific guidance is curated or research-backed for high-value tutorials, not only inferred from headings.",
  "Every concept explains why it matters in this exact project or category.",
  "Every concept includes multiple high-quality free external resources.",
  "Every build checkpoint includes just-in-time learning, a small action, a debug prompt, proof of success, and checkpoint-specific resources.",
  "Blocked, dead, video-only, or weakly extracted sources remain honestly marked and are prioritized for review.",
  "Advanced projects keep a longer prerequisite ladder instead of pretending to be beginner-easy.",
  "Portfolio framing must describe demonstrated understanding, not just that a tutorial was followed."
];

export interface CurationSignal {
  id: string;
  severity: "low" | "medium" | "high";
  message: string;
}

export interface CurationReview {
  riskScore: number;
  priority: "low" | "medium" | "high" | "critical";
  signals: CurationSignal[];
}

export function reviewCuration(article: TutorialArticle, path: ProjectPath): CurationReview {
  const signals: CurationSignal[] = [];
  const extractionStatus = article.extraction?.status ?? "unknown";
  const curationLevel = article.curation?.level ?? path.curation?.level ?? "generated";
  const qualityScore = article.qualityAudit?.overall.score ?? path.conceptQualityAudit?.score ?? 0;
  const conceptIssues = path.conceptQualityAudit?.issues.length ?? 0;
  const buildIssues = article.tutorialGuide?.qualityAudit?.issues.length ?? 0;

  if (curationLevel === "generated") {
    signals.push(signal("generated-only", "high", "Only generated guidance exists; no curated or research-backed override has been applied."));
  }

  if (extractionStatus === "blocked" || extractionStatus === "dead" || extractionStatus === "unknown") {
    signals.push(signal("limited-extraction", "high", `Extraction is ${extractionStatus}, so the original tutorial is not fully represented.`));
  }

  if (extractionStatus === "partial" || extractionStatus === "video") {
    signals.push(signal("partial-extraction", "medium", `Extraction is ${extractionStatus}; section-by-section guidance needs review.`));
  }

  if (qualityScore < 78) {
    signals.push(signal("quality-low", "high", `Overall quality score is ${qualityScore}%.`));
  } else if (qualityScore < 90) {
    signals.push(signal("quality-medium", "medium", `Overall quality score is ${qualityScore}%, below excellent.`));
  }

  if (conceptIssues > 0) {
    signals.push(signal("concept-issues", conceptIssues > 3 ? "high" : "medium", `${conceptIssues} concept audit issues remain.`));
  }

  if (buildIssues > 0) {
    signals.push(signal("build-issues", buildIssues > 3 ? "high" : "medium", `${buildIssues} build audit issues remain.`));
  }

  if (path.difficulty === "expert" && curationLevel !== "curated") {
    signals.push(signal("expert-not-curated", "high", "Expert-level beginner path should have a curated prerequisite ladder."));
  }

  if (path.concepts.length < 6) {
    signals.push(signal("concept-coverage", "medium", "Concept coverage is thin for a full beginner bridge."));
  }

  const riskScore = Math.min(
    100,
    signals.reduce((total, item) => {
      if (item.severity === "high") return total + 24;
      if (item.severity === "medium") return total + 12;
      return total + 5;
    }, 0)
  );

  return {
    riskScore,
    priority:
      riskScore >= 72 ? "critical" : riskScore >= 48 ? "high" : riskScore >= 24 ? "medium" : "low",
    signals
  };
}

function signal(id: string, severity: CurationSignal["severity"], message: string): CurationSignal {
  return { id, severity, message };
}
