import type {
  ConceptModule,
  ProjectPath,
  QualityAudit,
  QualityIssue,
  ResourceLink,
  ResourceQualityAudit,
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
  const conceptResourceSets = concepts.map((concept) => uniqueByUrl(concept.resources ?? []));
  const allConceptResources = conceptResourceSets.flat();
  const conceptResourceUrlCounts = countBy(allConceptResources, (resource) => resource.url.toLowerCase());
  const conceptProviderCount = new Set(allConceptResources.map((resource) => resource.provider.toLowerCase())).size;
  const averageConceptResourceCount =
    concepts.length === 0
      ? 0
      : conceptResourceSets.reduce((total, resources) => total + resources.length, 0) / concepts.length;
  const weakConceptResources = concepts.flatMap((concept) =>
    uniqueByUrl(concept.resources ?? []).filter((resource) => !isConceptResourceRelevant(article, concept, resource))
  );
  const overusedConceptSources = Array.from(conceptResourceUrlCounts.entries()).filter(([, count]) =>
    concepts.length >= 4 && count > Math.max(2, Math.ceil(concepts.length * 0.55))
  );

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

  if (concepts.length >= 2 && averageConceptResourceCount < 2.75) {
    issues.push(
      issue(
        "concept-resource-depth",
        "medium",
        "concepts",
        "Concept cards average fewer than three distinct learning resources."
      )
    );
  }

  if (conceptProviderCount < Math.min(3, Math.max(1, concepts.length)) && allConceptResources.length >= 6) {
    issues.push(
      issue(
        "concept-resource-provider-diversity",
        "medium",
        "concepts",
        "Concept resources lean on too few providers for a high-quality learning path."
      )
    );
  }

  if (overusedConceptSources.length > 0) {
    issues.push(
      issue(
        "concept-resource-overlap",
        "medium",
        "concepts",
        "The same learning source appears across many concept cards; review whether each concept has distinct support."
      )
    );
  }

  if (weakConceptResources.length / Math.max(1, allConceptResources.length) > 0.3) {
    issues.push(
      issue(
        "concept-resource-relevance",
        "high",
        "concepts",
        "Too many concept resources look weakly tied to the specific concept or tutorial."
      )
    );
  } else if (weakConceptResources.length / Math.max(1, allConceptResources.length) > 0.18) {
    issues.push(
      issue(
        "concept-resource-relevance-some",
        "medium",
        "concepts",
        "Some concept resources look weakly tied to the specific concept or tutorial."
      )
    );
  }

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

export function auditResourceUse(
  article: TutorialArticle,
  path: ProjectPath,
  guide: TutorialSpecificGuide
): ResourceQualityAudit {
  const issues: QualityIssue[] = [];
  const repairs: string[] = [];
  const allResources = collectResources(path, guide);
  const urlCounts = countBy(allResources, (resource) => resource.url.toLowerCase());
  const providerCount = new Set(allResources.map((resource) => resource.provider.toLowerCase())).size;
  const uniqueLinks = urlCounts.size;
  const duplicateRatio = allResources.length === 0 ? 0 : 1 - uniqueLinks / allResources.length;
  const repeatedUrls = Array.from(urlCounts.entries())
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([url, count]) => ({ url, count }));
  const maxRepeat = repeatedUrls[0]?.count ?? 0;
  const uniqueResources = uniqueByUrl(allResources);
  const weaklyRelevant = uniqueResources.filter((resource) => !isResourceRelevant(article, resource));
  const genericFallbackHits = uniqueResources.filter((resource) => isGenericFallback(resource)).length;
  const curationLevel = article.curation?.level ?? path.curation?.level ?? guide.curation?.level ?? "generated";
  const missingCuratedSourceAudits =
    curationLevel === "curated"
      ? uniqueByUrl(collectCuratedLearningResources(path, guide)).filter(
          (resource) =>
            !resource.audit || resource.audit.status !== "read-in-full" || resource.audit.verdict === "rejected"
        )
      : [];

  if (allResources.length < 10) {
    issues.push(issue("resource-count", "medium", "resources", "Resource stack is too thin for a full beginner bridge."));
  }

  if (providerCount < 3) {
    issues.push(issue("resource-provider-diversity", "high", "resources", "Resource stack needs at least three distinct providers."));
  } else if (providerCount < 5 && allResources.length >= 25) {
    issues.push(issue("resource-provider-range", "medium", "resources", "Resource stack is leaning on too few providers for this tutorial."));
  }

  if (allResources.length >= 20 && duplicateRatio > 0.84) {
    issues.push(issue("resource-duplication-high", "medium", "resources", `Resource links are highly repetitive: ${Math.round(duplicateRatio * 100)}% duplicate placements.`));
  } else if (allResources.length >= 20 && duplicateRatio > 0.7) {
    issues.push(issue("resource-duplication-medium", "medium", "resources", `Resource links repeat often: ${Math.round(duplicateRatio * 100)}% duplicate placements.`));
  }

  if (maxRepeat >= 18) {
    issues.push(issue("resource-single-source-overused", "medium", "resources", `One source is reused ${maxRepeat} times inside this path.`));
  } else if (maxRepeat >= 10) {
    issues.push(issue("resource-source-repeated", "medium", "resources", `One source is reused ${maxRepeat} times inside this path.`));
  }

  if (weaklyRelevant.length / Math.max(1, uniqueResources.length) > 0.35) {
    issues.push(issue("resource-relevance", "high", "resources", "Too many resources look generic or weakly tied to this tutorial's category/title."));
  } else if (weaklyRelevant.length / Math.max(1, uniqueResources.length) > 0.2) {
    issues.push(issue("resource-relevance-some", "medium", "resources", "Some resources look generic or weakly tied to this tutorial's category/title."));
  }

  if (article.category === "Uncategorized" && genericFallbackHits >= 3 && !isFirstPrinciplesSystemsProject(article)) {
    issues.push(issue("resource-uncategorized-fallback", "high", "resources", "Uncategorized tutorial is leaning on generic systems resources instead of a specific resource pack."));
  }

  if (missingCuratedSourceAudits.length > 0) {
    issues.push(
      issue(
        "resource-source-audit-missing",
        "high",
        "resources",
        `${missingCuratedSourceAudits.length} curated concept/build sources are missing read-in-full audit metadata.`
      )
    );
  }

  if (issues.length > 0) {
    repairs.push("Prioritize fewer repeated links, more role-specific sources, and tutorial/domain-specific resource packs.");
  }

  const score = Math.max(0, Math.min(100, 100 - penalty(issues)));
  const audit = buildAudit(score, issues, repairs);

  return {
    ...audit,
    totalLinks: allResources.length,
    uniqueLinks,
    duplicateRatio: Number(duplicateRatio.toFixed(2)),
    providerCount,
    repeatedUrls
  };
}

export function combineTutorialAudit(
  build: QualityAudit,
  concepts: QualityAudit,
  resources: ResourceQualityAudit
): TutorialQualityAudit {
  const issues = [
    ...build.issues.map((item) => ({ ...item })),
    ...concepts.issues.map((item) => ({ ...item })),
    ...resources.issues.map((item) => ({ ...item }))
  ];
  const repairs = Array.from(new Set([...build.repairs, ...concepts.repairs, ...resources.repairs]));
  const score = Math.round(build.score * 0.5 + concepts.score * 0.35 + resources.score * 0.15);

  return {
    build,
    concepts,
    resources,
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

function collectResources(path: ProjectPath, guide: TutorialSpecificGuide): ResourceLink[] {
  return [
    ...path.prerequisites.flatMap((module) => [module.resource, ...(module.resources ?? [])]),
    ...path.concepts.flatMap((concept) => concept.resources ?? []),
    ...(guide.resourceLinks ?? []),
    ...guide.checkpoints.flatMap((checkpoint) => checkpoint.resourceLinks ?? [])
  ];
}

function collectCuratedLearningResources(path: ProjectPath, guide: TutorialSpecificGuide): ResourceLink[] {
  return [
    ...path.concepts.flatMap((concept) => concept.resources ?? []),
    ...(guide.resourceLinks ?? []),
    ...guide.checkpoints.flatMap((checkpoint) => checkpoint.resourceLinks ?? [])
  ];
}

function countBy<T>(items: T[], keyFor: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    const key = keyFor(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return counts;
}

function uniqueByUrl(resources: ResourceLink[]): ResourceLink[] {
  const seen = new Set<string>();

  return resources.filter((resource) => {
    const key = resource.url.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function isResourceRelevant(article: TutorialArticle, resource: ResourceLink): boolean {
  const articleSignals = `${article.title} ${article.category} ${article.languages.join(" ")} ${(article.extraction?.keyTerms ?? []).join(" ")} ${(article.extraction?.sections.map((section) => section.title) ?? []).join(" ")}`;
  const resourceSignals = `${resource.provider} ${resource.label} ${resource.url}`;

  return (
    includesAny(resourceSignals, [articleSignals]) ||
    includesAny(resourceSignals, domainKeywords(article)) ||
    isTrustedGeneralBeginnerResource(resource)
  );
}

function isConceptResourceRelevant(
  article: TutorialArticle,
  concept: ConceptModule,
  resource: ResourceLink
): boolean {
  const conceptSignals = `${concept.title} ${concept.plainEnglish} ${concept.whyItMatters} ${concept.signsYouUnderstand.join(" ")}`;
  const resourceSignals = `${resource.provider} ${resource.label} ${resource.url}`;

  return (
    includesAny(resourceSignals, [conceptSignals]) ||
    includesAny(resourceSignals, domainKeywords(article)) ||
    isResourceRelevant(article, resource)
  );
}

function domainKeywords(article: TutorialArticle): string[] {
  const value = `${article.title} ${article.category}`.toLowerCase();

  if (/redis|resp|protocol parser/.test(value)) return ["redis", "resp", "protocol", "socket", "parser", "network"];
  if (/compiler|interpreter|parser combinator|wasm|webassembly|jvm|scheme|lisp|garbage collector|lexer|scanner|programming language/.test(value)) return ["compiler", "interpreter", "parser", "lexer", "scanner", "grammar", "ast", "llvm", "webassembly", "runtime", "garbage collector"];
  if (/unix shell|own shell|simple shell|shell in/.test(value)) return ["shell", "posix", "bash", "process", "fork", "exec", "pipe", "redirection", "exit status"];
  if (/bootloader|system call|kernel|operating system|os from scratch|malloc tutorial/.test(value)) return ["osdev", "kernel", "boot", "bootloader", "system call", "memory", "process", "operating system", "linux"];
  if (/container|docker|namespace|cgroup|linux containers/.test(value)) return ["container", "docker", "namespace", "cgroup", "oci", "runtime", "isolation", "linux"];
  if (/git clone|gitlet|rebuilding git|write yourself a git|build git/.test(value)) return ["git", "object", "commit", "tree", "ref", "packfile", "repository", "hash"];
  if (/stow|dotfile|symlink/.test(value)) return ["stow", "dotfile", "symlink", "link", "xdg", "configuration", "git"];
  if (/json decoding|json parser|ini parser|markdown compiler/.test(value)) return ["json", "ini", "parser", "config", "grammar", "scanner", "markdown", "rfc"];
  if (/dns server|dns/.test(value)) return ["dns", "rfc", "udp", "datagram", "record", "resolver", "query"];
  if (/load balancer|load balancing/.test(value)) return ["load", "balancer", "proxy", "backend", "upstream", "health", "network"];
  if (/linux debugger|debugger/.test(value)) return ["debugger", "ptrace", "gdb", "register", "breakpoint", "process", "linux"];
  if (/window manager|x window/.test(value)) return ["xlib", "x11", "window", "manager", "ewmh", "freedesktop", "root window"];
  if (/video player|media player/.test(value)) return ["video", "media", "codec", "container", "buffer", "playback", "ffmpeg"];
  if (/synchronization engine|y\.js|crdt|collaborative/.test(value)) return ["sync", "synchronization", "crdt", "yjs", "automerge", "replica", "merge"];
  if (/game engine|vr headset|roguelike|snake|space invaders|game/.test(value)) return ["game", "engine", "loop", "render", "input", "collision", "entity", "component", "vr", "webxr"];
  if (/regex|regexp|regular expression/.test(value)) return ["regex", "regexp", "regular expression", "automata", "backtracking", "nfa"];
  if (/chip-?8|emulator|virtual machine|vm/.test(value)) return ["chip-8", "emulator", "instruction", "opcode", "virtual machine", "state"];
  if (/static site|site generator|template/.test(value)) return ["static", "site", "html", "template", "filesystem", "markdown"];
  if (/spell|spelling|search|recommend/.test(value)) return ["spell", "edit distance", "language model", "search", "ranking", "recommendation"];
  if (/database|sqlite|storage|index|btree|b-tree/.test(value)) return ["database", "sqlite", "postgres", "btree", "b-tree", "index", "storage"];
  if (/kafka|distributed|queue|log|replication/.test(value)) return ["kafka", "distributed", "log", "replication", "consensus", "raft"];
  if (/raycast|renderer|3d|wolfenstein/.test(value)) return ["raycast", "render", "3d", "graphics", "vector", "opengl"];
  if (/neural|machine learning|deep learning|classifier|recognition/.test(value)) return ["neural", "machine learning", "gradient", "classification", "training", "image"];
  if (/blockchain|bitcoin|cryptocurrency/.test(value)) return ["bitcoin", "blockchain", "cryptocurrency", "hash", "consensus"];
  if (/test|testing|mini.?test/.test(value)) return ["test", "assert", "runner", "javascript", "node"];

  return [article.category, article.title];
}

function isTrustedGeneralBeginnerResource(resource: ResourceLink): boolean {
  return /mdn|github skills|khan academy|software carpentry|missing semester|freecodecamp|gnu|posix|ietf|w3c|man7|osdev|pro git|git-scm|node\.js|python docs|cloudflare|x\.org|freedesktop|ffmpeg|game programming patterns|docker docs|oci|automerge|yjs/i.test(`${resource.provider} ${resource.label} ${resource.url}`);
}

function isGenericFallback(resource: ResourceLink): boolean {
  return /nand2tetris|elements of computing systems/i.test(`${resource.provider} ${resource.label} ${resource.url}`);
}

function isFirstPrinciplesSystemsProject(article: TutorialArticle): boolean {
  return /nand|tetris|processor|operating system|emulator|virtual machine|compiler|hardware|cpu/i.test(article.title);
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
