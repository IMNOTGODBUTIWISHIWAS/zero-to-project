import type {
  ConceptModule,
  ProjectPath,
  QualityAudit,
  QualityIssue,
  TutorialArticle,
  TutorialExtraction,
  TutorialQualityAudit,
  TutorialSpecificGuide
} from "./types";

const checkedAt = () => new Date().toISOString();

export function auditConceptCards(
  article: TutorialArticle,
  concepts: ConceptModule[]
): QualityAudit {
  const issues: QualityIssue[] = [];
  const repairs: string[] = [];
  const extractionStatus = article.extraction?.status;
  const contextualCount = concepts.filter((concept) => isContextual(article, concept)).length;

  if (concepts.length < 4) {
    issues.push(issue("concept-count", "high", "concepts", "Concept section has fewer than four cards."));
  }

  if (contextualCount < 2) {
    issues.push(
      issue(
        "concept-context",
        "high",
        "concepts",
        "Concept section does not include enough cards tied to this exact tutorial."
      )
    );
  }

  concepts.forEach((concept, index) => {
    const prefix = `concept-${index + 1}`;

    if (wordCount(concept.plainEnglish) < 18) {
      issues.push(issue(`${prefix}-thin-explanation`, "medium", "concepts", `"${concept.title}" needs a fuller beginner explanation.`));
    }

    if (wordCount(concept.whyItMatters) < 16) {
      issues.push(issue(`${prefix}-thin-why`, "medium", "concepts", `"${concept.title}" needs a stronger why-it-matters section.`));
    }

    if (concept.signsYouUnderstand.length < 3) {
      issues.push(issue(`${prefix}-checks`, "medium", "concepts", `"${concept.title}" needs at least three understanding checks.`));
    }

    if ((concept.resources ?? []).length < 2) {
      issues.push(issue(`${prefix}-resources`, "high", "concepts", `"${concept.title}" needs multiple external learning resources.`));
    }

    if ((concept.resources ?? []).some((resource) => !/^https:\/\/\S+\.\S+/.test(resource.url))) {
      issues.push(issue(`${prefix}-resource-url`, "medium", "concepts", `"${concept.title}" has a malformed learning resource link.`));
    }

    if (looksGeneric(concept.plainEnglish) && !isContextual(article, concept)) {
      issues.push(issue(`${prefix}-generic`, "high", "concepts", `"${concept.title}" reads generic instead of tutorial-specific.`));
    }
  });

  if (!extractionStatus || extractionStatus === "blocked" || extractionStatus === "dead" || extractionStatus === "unknown") {
    issues.push(
      issue(
        "concept-extraction-limited",
        extractionStatus === "dead" ? "high" : "medium",
        "concepts",
        "Concept cards rely more heavily on category scaffolding because tutorial extraction was limited."
      )
    );
  }

  if (issues.some((item) => item.severity === "high")) {
    repairs.push("Added tutorial-specific concept cards from extracted section titles and key terms.");
  }

  return buildAudit(capByExtraction(100 - penalty(issues), extractionStatus, "concepts"), issues, repairs);
}

export function auditBuildGuide(
  article: TutorialArticle,
  path: ProjectPath,
  extraction: TutorialExtraction,
  guide: TutorialSpecificGuide
): QualityAudit {
  const issues: QualityIssue[] = [];
  const repairs: string[] = [];
  const contextualCount = guide.checkpoints.filter((checkpoint) =>
    includesAny(`${checkpoint.title} ${checkpoint.beginnerGoal} ${checkpoint.action}`, [
      article.title,
      article.category,
      ...article.languages,
      ...extraction.keyTerms.slice(0, 8),
      ...extraction.sections.map((section) => section.title)
    ])
  ).length;

  if (guide.checkpoints.length < Math.min(4, Math.max(2, path.milestones.length))) {
    issues.push(issue("build-count", "high", "build", "Build guide has too few checkpoints for a full beginner path."));
  }

  if (guide.setupSteps.length < 4) {
    issues.push(issue("build-setup", "medium", "build", "Build guide needs more setup-before-coding steps."));
  }

  if (guide.finalProofTasks.length < 4) {
    issues.push(issue("build-proof", "medium", "build", "Build guide needs stronger final proof tasks."));
  }

  if ((guide.resourceLinks ?? []).length < 3) {
    issues.push(issue("build-resources", "high", "build", "Build guide needs multiple tutorial-level learning resources."));
  }

  if (contextualCount < Math.min(2, guide.checkpoints.length)) {
    issues.push(issue("build-context", "high", "build", "Build checkpoints are not tied strongly enough to this tutorial."));
  }

  guide.checkpoints.forEach((checkpoint, index) => {
    const prefix = `checkpoint-${index + 1}`;

    if (wordCount(checkpoint.beginnerGoal) < 14) {
      issues.push(issue(`${prefix}-goal`, "medium", "build", `"${checkpoint.title}" needs a more concrete beginner goal.`));
    }

    if (wordCount(checkpoint.learnRightHere) < 18) {
      issues.push(issue(`${prefix}-learn`, "high", "build", `"${checkpoint.title}" needs stronger just-in-time learning guidance.`));
    }

    if (wordCount(checkpoint.action) < 14) {
      issues.push(issue(`${prefix}-action`, "medium", "build", `"${checkpoint.title}" needs a clearer build action.`));
    }

    if (wordCount(checkpoint.selfCheck) < 12) {
      issues.push(issue(`${prefix}-self-check`, "medium", "build", `"${checkpoint.title}" needs a more testable self-check.`));
    }

    if (wordCount(checkpoint.debugPrompt) < 12) {
      issues.push(issue(`${prefix}-debug`, "medium", "build", `"${checkpoint.title}" needs a stronger debug prompt.`));
    }

    if ((checkpoint.resourceLinks ?? []).length < 2) {
      issues.push(issue(`${prefix}-resources`, "medium", "build", `"${checkpoint.title}" needs learning links for this exact checkpoint.`));
    }
  });

  if (extraction.status === "blocked" || extraction.status === "dead" || extraction.status === "unknown") {
    issues.push(
      issue(
        "extraction-limited",
        extraction.status === "dead" ? "high" : "medium",
        "extraction",
        `Extraction status is ${extraction.status}; the original source remains necessary.`
      )
    );
  }

  if (issues.length > 0) {
    repairs.push("Applied deterministic guide repair and attached explicit quality issues for review.");
  }

  return buildAudit(capByExtraction(100 - penalty(issues), extraction.status, "build"), issues, repairs);
}

export function combineTutorialAudit(
  build: QualityAudit,
  concepts: QualityAudit
): TutorialQualityAudit {
  const issues = [
    ...build.issues.map((item) => ({ ...item })),
    ...concepts.issues.map((item) => ({ ...item }))
  ];
  const repairs = Array.from(new Set([...build.repairs, ...concepts.repairs]));
  const score = Math.round(build.score * 0.6 + concepts.score * 0.4);

  return {
    build,
    concepts,
    overall: buildAudit(score, issues, repairs)
  };
}

function buildAudit(score: number, issues: QualityIssue[], repairs: string[]): QualityAudit {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: normalized,
    verdict:
      normalized >= 90 ? "excellent" : normalized >= 78 ? "strong" : normalized >= 62 ? "usable" : "needs-review",
    checkedAt: checkedAt(),
    issues,
    repairs
  };
}

function issue(
  id: string,
  severity: QualityIssue["severity"],
  target: QualityIssue["target"],
  message: string
): QualityIssue {
  return {
    id,
    severity,
    target,
    message
  };
}

function penalty(issues: QualityIssue[]): number {
  return issues.reduce((total, item) => {
    if (item.severity === "high") return total + 16;
    if (item.severity === "medium") return total + 8;
    return total + 3;
  }, 0);
}

function capByExtraction(
  score: number,
  status: TutorialExtraction["status"] | undefined,
  target: QualityIssue["target"]
): number {
  if (target === "build") {
    if (status === "dead") return Math.min(score, 76);
    if (status === "blocked" || status === "unknown" || !status) return Math.min(score, 84);
    if (status === "partial" || status === "video") return Math.min(score, 92);
    return score;
  }

  if (status === "dead") return Math.min(score, 76);
  if (status === "blocked" || status === "unknown" || !status) return Math.min(score, 84);
  if (status === "partial" || status === "video") return Math.min(score, 92);
  return score;
}

function isContextual(article: TutorialArticle, concept: ConceptModule): boolean {
  return includesAny(`${concept.title} ${concept.plainEnglish} ${concept.whyItMatters}`, [
    article.title,
    article.category,
    ...article.languages,
    ...(article.extraction?.keyTerms ?? []),
    ...(article.extraction?.sections.map((section) => section.title) ?? [])
  ]);
}

function includesAny(value: string, candidates: string[]): boolean {
  const lower = value.toLowerCase();

  return candidates
    .flatMap((candidate) => candidate.split(/\s+|\/|:|\(|\)|-/))
    .map((candidate) => candidate.trim().toLowerCase())
    .filter((candidate) => candidate.length >= 4)
    .some((candidate) => lower.includes(candidate));
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function looksGeneric(value: string): boolean {
  return /this project|the project|the tutorial|things|stuff|concept|important/i.test(value);
}
