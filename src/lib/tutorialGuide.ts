import type {
  BuildCheckpoint,
  ProjectPath,
  ResourceLink,
  TutorialArticle,
  TutorialExtraction,
  TutorialSpecificGuide
} from "./types";

const statusLabels: Record<TutorialExtraction["status"], string> = {
  full: "Custom guide generated",
  partial: "Partial guide",
  video: "Video guide",
  blocked: "Blocked source",
  dead: "Open tutorial required",
  unknown: "Open tutorial required"
};

export function createTutorialGuide(
  article: TutorialArticle,
  path: ProjectPath,
  extraction: TutorialExtraction
): TutorialSpecificGuide {
  const checkpoints = checkpointPlan(article, path, extraction);
  const sourceRequired = extraction.status !== "full";

  return {
    articleId: article.id,
    extractionStatus: extraction.status,
    confidenceLabel: statusLabels[extraction.status],
    sourceRequired,
    setupSteps: setupSteps(article, path, extraction),
    checkpoints,
    resourceLinks: guideResourceLinks(path, extraction),
    finalProofTasks: finalProofTasks(article, extraction),
    fallbackReason: fallbackReason(extraction),
    aiEnhanced: false
  };
}

export function repairGuideForQuality(
  article: TutorialArticle,
  path: ProjectPath,
  extraction: TutorialExtraction,
  guide: TutorialSpecificGuide
): TutorialSpecificGuide {
  const checkpoints = [...guide.checkpoints];

  while (checkpoints.length < 4) {
    const milestone = path.milestones[checkpoints.length % path.milestones.length];
    const index = checkpoints.length;
    checkpoints.push({
      id: `${article.id}-quality-repair-${index + 1}`,
      title: milestone.title,
      beginnerGoal: `${milestone.description} For "${article.title}", make this concrete by naming the input, output, and visible proof before coding.`,
      learnRightHere: `Pause and connect this checkpoint to ${article.category.toLowerCase()} fundamentals plus one tutorial-specific term: ${(extraction.keyTerms[index] ?? article.category)}. Write a one-sentence explanation before implementation.`,
      action: `${milestone.description} Commit the smallest working version and include a note explaining what changed specifically in "${article.title}".`,
      selfCheck: `${milestone.proof} Also confirm that you can explain why this step belongs in a ${article.category.toLowerCase()} project.`,
      debugPrompt: "If the checkpoint fails, reduce it to one command, one expected output, and one file or function to inspect.",
      prerequisiteModuleIds: path.prerequisites.slice(0, 3).map((module) => module.id),
      resourceLinks: checkpointResourceLinks(path, milestone.title, [extraction.keyTerms[index] ?? article.category], path.prerequisites.slice(0, 3).map((module) => module.id))
    });
  }

  return {
    ...guide,
    setupSteps: strengthenSetup(article, path, extraction, guide.setupSteps),
    checkpoints: checkpoints.map((checkpoint, index) =>
      strengthenCheckpoint(article, path, extraction, checkpoint, index)
    ),
    resourceLinks: guide.resourceLinks ?? guideResourceLinks(path, extraction),
    finalProofTasks: strengthenProofTasks(article, guide.finalProofTasks)
  };
}

function setupSteps(
  article: TutorialArticle,
  path: ProjectPath,
  extraction: TutorialExtraction
): string[] {
  const language = article.languages.join(" / ");
  const hints = extraction.setupHints.slice(0, 4);
  const steps = [
    `Create a fresh GitHub repository for "${article.title}" and commit an empty README before coding.`,
    `Install and verify the ${language} toolchain by running the smallest possible program.`,
    "Open the original tutorial in a separate tab and keep this guide beside it as your beginner checklist."
  ];

  if (hints.length > 0) {
    steps.push(`Source setup clues to verify: ${hints.join(" | ")}`);
  }

  steps.push(
    `Before the first implementation step, complete the "${path.prerequisites[0]?.title ?? "computer basics"}" prerequisite if it is not already checked off.`
  );

  return steps;
}

function checkpointPlan(
  article: TutorialArticle,
  path: ProjectPath,
  extraction: TutorialExtraction
): BuildCheckpoint[] {
  const extracted = extraction.sections.slice(0, 8);

  if (extracted.length > 0) {
    return extracted.map((section, index) => {
      const moduleIds = prerequisiteIdsForSection(section.title, path);

      return {
        id: `${article.id}-guide-${section.id}`,
        title: section.title,
        sourceSectionTitle: section.title,
        beginnerGoal: beginnerGoal(article, section.title, index),
        learnRightHere: learnRightHere(article, section.title, section.keyTerms, moduleIds, path),
        action: actionForSection(article, section.title, section.setupHints, index),
        selfCheck: selfCheckForSection(article, section.title, section.summary),
        debugPrompt: debugPromptForSection(section.title, section.codeSignals),
        prerequisiteModuleIds: moduleIds,
        resourceLinks: checkpointResourceLinks(path, section.title, section.keyTerms, moduleIds)
      };
    });
  }

  return path.milestones.map((milestone, index) => {
    const moduleIds = path.prerequisites.slice(0, Math.min(3, path.prerequisites.length)).map((module) => module.id);

    return {
      id: `${article.id}-guide-fallback-${index + 1}`,
      title: milestone.title,
      beginnerGoal: milestone.description,
      learnRightHere:
        "This source did not expose enough structure, so use the Learn First and Concepts tabs before following the original tutorial.",
      action: milestone.description,
      selfCheck: milestone.proof,
      debugPrompt: "If you get stuck, compare your current output with the proof expected by this checkpoint.",
      prerequisiteModuleIds: moduleIds,
      resourceLinks: checkpointResourceLinks(path, milestone.title, [], moduleIds)
    };
  });
}

function beginnerGoal(article: TutorialArticle, sectionTitle: string, index: number): string {
  if (index === 0) {
    return `Turn the tutorial's "${sectionTitle}" section into a tiny, runnable start for ${article.title}.`;
  }

  return `Understand what "${sectionTitle}" contributes to the finished ${article.category.toLowerCase()} project before copying implementation details.`;
}

function learnRightHere(
  article: TutorialArticle,
  sectionTitle: string,
  terms: string[],
  moduleIds: string[],
  path: ProjectPath
): string {
  const matchedModules = path.prerequisites
    .filter((module) => moduleIds.includes(module.id))
    .map((module) => module.title)
    .slice(0, 2);
  const termText = terms.length > 0 ? ` Key terms to define first: ${terms.slice(0, 4).join(", ")}.` : "";
  const moduleText =
    matchedModules.length > 0
      ? ` Review ${matchedModules.join(" and ")} before this checkpoint.`
      : ` Connect this section to the ${article.category.toLowerCase()} concept cards before coding.`;

  return `${moduleText}${termText} Your goal is to explain "${sectionTitle}" in your own words before implementing it.`;
}

function actionForSection(
  article: TutorialArticle,
  sectionTitle: string,
  setupHints: string[],
  index: number
): string {
  if (setupHints.length > 0) {
    return `Run the setup commands carefully, then commit once the project still runs. Source clues: ${setupHints.join(" | ")}`;
  }

  if (index === 0) {
    return `Create the smallest code version related to "${sectionTitle}" and commit it before adding more tutorial code.`;
  }

  return `Implement only the behavior described by "${sectionTitle}", then pause and write what changed in the README or notes.`;
}

function selfCheckForSection(article: TutorialArticle, sectionTitle: string, summary: string): string {
  return `You can demo the result of "${sectionTitle}" and explain how it moves "${article.title}" forward. Source clue: ${summary}`;
}

function debugPromptForSection(sectionTitle: string, codeSignals: string[]): string {
  if (codeSignals.length > 0) {
    return `If this fails, compare your file names, command output, and the first code clue from the source: ${codeSignals[0]}`;
  }

  return `If "${sectionTitle}" fails, isolate one input, one output, and the smallest code path between them.`;
}

function prerequisiteIdsForSection(sectionTitle: string, path: ProjectPath): string[] {
  const title = sectionTitle.toLowerCase();
  const ids = new Set<string>();

  for (const module of path.prerequisites) {
    const haystack = `${module.title} ${module.summary} ${module.whyItMatters}`.toLowerCase();

    if (
      title.split(/\s+/).some((word) => word.length > 4 && haystack.includes(word)) ||
      (title.includes("install") && module.layer === "tooling") ||
      (title.includes("setup") && module.layer === "tooling") ||
      (title.includes("test") && module.layer === "tooling") ||
      (title.includes("syntax") && module.layer === "language")
    ) {
      ids.add(module.id);
    }
  }

  if (ids.size === 0) {
    path.prerequisites.slice(0, 2).forEach((module) => ids.add(module.id));
  }

  return Array.from(ids).slice(0, 3);
}

function finalProofTasks(article: TutorialArticle, extraction: TutorialExtraction): string[] {
  return [
    `Record a short demo showing ${article.title} doing its main job from a clean start.`,
    "Update the README with setup commands, one example input/output, and known limitations.",
    `Write a paragraph explaining the ${article.category.toLowerCase()} concepts you understand now that you did not understand before.`,
    extraction.status === "full" || extraction.status === "partial"
      ? "Compare your checkpoints with the original tutorial sections and note one improvement you made independently."
      : "List which parts still depended on the original tutorial because extraction was limited."
  ];
}

function strengthenSetup(
  article: TutorialArticle,
  path: ProjectPath,
  extraction: TutorialExtraction,
  setupSteps: string[]
): string[] {
  const additions = [
    `Write a one-paragraph "what I am building" note for "${article.title}" before opening the first code section.`,
    `List the tutorial-specific terms you need to watch for: ${extraction.keyTerms.slice(0, 5).join(", ") || article.category}.`,
    `Choose the first proof of life for this ${article.category.toLowerCase()} project: a command, screenshot, test result, or visible output.`
  ];

  return uniqueText([
    ...setupSteps,
    `Review the top concept card and the "${path.prerequisites[0]?.title ?? "computer basics"}" prerequisite before setup.`,
    ...additions
  ]).slice(0, 7);
}

function strengthenCheckpoint(
  article: TutorialArticle,
  path: ProjectPath,
  extraction: TutorialExtraction,
  checkpoint: BuildCheckpoint,
  index: number
): BuildCheckpoint {
  const term = extraction.keyTerms[index % Math.max(1, extraction.keyTerms.length)] ?? article.category;
  const sourceAnchor = checkpoint.sourceSectionTitle ?? extraction.sections[index]?.title ?? checkpoint.title;

  return {
    ...checkpoint,
    beginnerGoal: ensureMinimumWords(
      checkpoint.beginnerGoal,
      `For "${article.title}", turn "${sourceAnchor}" into one observable improvement. Name the input, output, and state change before writing code.`
    ),
    learnRightHere: ensureMinimumWords(
      checkpoint.learnRightHere,
      `Study "${term}" just enough to explain how it appears in this ${article.category.toLowerCase()} project. Then connect it to one prerequisite and one concept card before coding.`
    ),
    action: ensureMinimumWords(
      checkpoint.action,
      `Implement only the smallest behavior connected to "${sourceAnchor}". Run it, capture the output, and commit before expanding the tutorial code.`
    ),
    selfCheck: ensureMinimumWords(
      checkpoint.selfCheck,
      `You can demonstrate the behavior, explain why it matters for "${article.title}", and identify one line or file responsible for the result.`
    ),
    debugPrompt: ensureMinimumWords(
      checkpoint.debugPrompt,
      "If it breaks, write the exact error, the command that produced it, the expected output, and the smallest experiment you will try next."
    ),
    prerequisiteModuleIds:
      checkpoint.prerequisiteModuleIds.length > 0
        ? checkpoint.prerequisiteModuleIds
        : path.prerequisites.slice(0, 3).map((module) => module.id),
    resourceLinks:
      checkpoint.resourceLinks && checkpoint.resourceLinks.length > 0
        ? checkpoint.resourceLinks
        : checkpointResourceLinks(path, sourceAnchor, [term], checkpoint.prerequisiteModuleIds)
  };
}

function strengthenProofTasks(article: TutorialArticle, proofTasks: string[]): string[] {
  return uniqueText([
    ...proofTasks,
    `Add a README section titled "What I learned" with three concepts from "${article.title}" explained in your own words.`,
    "Add one troubleshooting note showing a real error, what caused it, and how you fixed or worked around it.",
    "Create a final GitHub commit whose message states the project behavior that now works."
  ]).slice(0, 7);
}

function ensureMinimumWords(value: string, addition: string): string {
  return value.trim().split(/\s+/).length >= 18 ? value : `${value} ${addition}`;
}

function uniqueText(values: string[]): string[] {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = value.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function guideResourceLinks(path: ProjectPath, extraction: TutorialExtraction): ResourceLink[] {
  const tutorialSignals = [
    ...extraction.keyTerms,
    ...extraction.sections.map((section) => section.title)
  ].join(" ");

  return uniqueResourceLinks([
    ...path.prerequisites.filter((module) => module.layer === "domain").flatMap(moduleResources),
    ...path.prerequisites.filter((module) => module.layer === "language").flatMap(moduleResources),
    ...path.concepts
      .filter((concept) => matchesSignals(`${concept.title} ${concept.plainEnglish}`, tutorialSignals))
      .flatMap((concept) => concept.resources),
    ...path.concepts.slice(0, 3).flatMap((concept) => concept.resources)
  ]).slice(0, 6);
}

function checkpointResourceLinks(
  path: ProjectPath,
  title: string,
  terms: string[],
  moduleIds: string[]
): ResourceLink[] {
  const signalText = [title, ...terms].join(" ");
  const matchedConceptResources = path.concepts
    .filter((concept) => matchesSignals(`${concept.title} ${concept.plainEnglish} ${concept.whyItMatters}`, signalText))
    .flatMap((concept) => concept.resources);
  const matchedModuleResources = path.prerequisites
    .filter((module) => moduleIds.includes(module.id) || matchesSignals(`${module.title} ${module.summary}`, signalText))
    .flatMap(moduleResources);

  return uniqueResourceLinks([
    ...path.prerequisites.filter((module) => module.layer === "domain").slice(0, 1).flatMap(moduleResources),
    ...matchedConceptResources,
    ...matchedModuleResources,
    ...path.concepts.slice(0, 2).flatMap((concept) => concept.resources)
  ]).slice(0, 4);
}

function moduleResources(module: { resource: ResourceLink; resources?: ResourceLink[] }): ResourceLink[] {
  return uniqueResourceLinks([module.resource, ...(module.resources ?? [])]);
}

function uniqueResourceLinks(resources: ResourceLink[]): ResourceLink[] {
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

function matchesSignals(value: string, signals: string): boolean {
  const lower = value.toLowerCase();

  return signals
    .split(/\s+|\/|:|\(|\)|-|,|\./)
    .map((signal) => signal.trim().toLowerCase())
    .filter((signal) => signal.length >= 4)
    .some((signal) => lower.includes(signal));
}

function fallbackReason(extraction: TutorialExtraction): string | undefined {
  if (extraction.status === "full") {
    return undefined;
  }

  if (extraction.notes.length > 0) {
    return extraction.notes.join(" ");
  }

  return "The app could not derive a complete tutorial-specific guide from this source.";
}
