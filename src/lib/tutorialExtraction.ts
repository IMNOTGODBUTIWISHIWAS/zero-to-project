import { slugify } from "./byoxParser";
import type {
  ExtractedSection,
  ExtractionSourceKind,
  TutorialArticle,
  TutorialExtraction
} from "./types";

export interface ExtractionOptions {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  maxBytes?: number;
}

const defaultTimeoutMs = 6500;
const defaultMaxBytes = 650_000;

const setupPattern =
  /\b(npm|pnpm|yarn|pip|python|python3|node|go|cargo|rustup|gem|bundle|dotnet|javac|java|gcc|g\+\+|make|cmake|docker|git)\b[^\n\r<]{0,140}/gi;

const termStopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "your",
  "into",
  "this",
  "that",
  "build",
  "using",
  "part",
  "tutorial",
  "introduction",
  "overview",
  "create",
  "write",
  "own"
]);

export async function extractTutorial(
  article: TutorialArticle,
  options: ExtractionOptions = {}
): Promise<TutorialExtraction> {
  const extractedAt = new Date().toISOString();

  if (article.health.status === "dead") {
    return fallbackExtraction(article, "dead", "unknown", [
      "The source link appears dead, so the app cannot derive tutorial-specific sections."
    ]);
  }

  if (article.isVideo || isVideoUrl(article.url)) {
    return videoExtraction(article, extractedAt);
  }

  const sourceKind = detectSourceKind(article.url, article.health.contentType);

  if (sourceKind === "pdf") {
    return fallbackExtraction(article, "partial", "pdf", [
      "PDF source detected. The MVP keeps the original PDF as the source of truth and derives a cautious guide from title/category metadata."
    ]);
  }

  const targetUrls = normalizeFetchUrls(article.url, sourceKind);
  const fetchImpl = options.fetchImpl ?? fetch;

  try {
    let lastExtraction: TutorialExtraction | null = null;

    for (const targetUrl of targetUrls) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? defaultTimeoutMs);

      try {
        const response = await fetchImpl(targetUrl, {
          method: "GET",
          redirect: "follow",
          signal: controller.signal,
          headers: {
            "User-Agent": "ZeroToProject/0.1 tutorial structure extractor"
          }
        });
    const contentType = response.headers.get("content-type") ?? article.health.contentType ?? "";

    if (response.status === 401 || response.status === 403 || response.status === 429) {
          return fallbackExtraction(article, "blocked", sourceKind, [
        `The source returned ${response.status}, so the app keeps the original tutorial link as required.`
      ]);
    }

    if (!response.ok) {
          lastExtraction = fallbackExtraction(article, response.status >= 500 ? "unknown" : "dead", sourceKind, [
        `The source returned HTTP ${response.status} during extraction.`
      ]);
          continue;
    }

    if (contentType.includes("pdf")) {
      return fallbackExtraction(article, "partial", "pdf", [
        "PDF source detected. The app does not store PDF body text in the generated catalog."
      ]);
    }

    const text = trimToBytes(await response.text(), options.maxBytes ?? defaultMaxBytes);
    const extraction = parseReadableText(article, text, sourceKind, response.url, contentType);

    return {
      ...extraction,
      extractedAt
    };
      } finally {
        clearTimeout(timeout);
      }
    }

    return (
      lastExtraction ??
      fallbackExtraction(article, "unknown", sourceKind, [
        "The source could not be fetched during extraction."
      ])
    );
  } catch (error) {
    return fallbackExtraction(article, "unknown", sourceKind, [
      "The source could not be fetched during extraction."
    ], error instanceof Error ? error.message : "Unknown extraction error");
  }
}

export function parseReadableText(
  article: TutorialArticle,
  raw: string,
  sourceKind: ExtractionSourceKind,
  finalUrl?: string,
  contentType = ""
): TutorialExtraction {
  const isHtml = contentType.includes("html") || /<html|<h1|<article|<main/i.test(raw);
  const title = isHtml ? extractHtmlTitle(raw) : firstMarkdownHeading(raw);
  const sections = isHtml ? extractHtmlSections(raw) : extractMarkdownSections(raw);
  const setupHints = uniqueStrings(extractSetupHints(raw)).slice(0, 10);
  const codeSignals = uniqueStrings(extractCodeSignals(raw)).slice(0, 10);
  const keyTerms = uniqueStrings([
    ...extractKeyTerms(article.title),
    ...sections.flatMap((section) => section.keyTerms)
  ]).slice(0, 18);
  const usefulSections = sections.slice(0, 12);
  const status = statusFromSignal(usefulSections, setupHints, raw, isHtml);

  return {
    status,
    sourceKind,
    confidence: confidenceFromSignal(status, usefulSections.length, setupHints.length),
    title: title || article.health.title || article.title,
    finalUrl,
    sections: usefulSections,
    setupHints,
    keyTerms,
    codeSignals,
    notes: notesForStatus(status, usefulSections.length)
  };
}

export function detectSourceKind(url: string, contentType = ""): ExtractionSourceKind {
  const lower = url.toLowerCase();

  if (isVideoUrl(url)) return "video";
  if (contentType.includes("pdf") || lower.endsWith(".pdf")) return "pdf";
  if (lower.includes("github.com")) return "github";
  if (lower.includes("raw.githubusercontent.com") || lower.match(/\.(md|markdown)(\?|$)/)) {
    return "markdown";
  }
  if (contentType.includes("text/plain")) return "text";
  if (contentType.includes("html") || lower.startsWith("http")) return "html";

  return "unknown";
}

export function normalizeFetchUrl(url: string, sourceKind: ExtractionSourceKind): string {
  return normalizeFetchUrls(url, sourceKind)[0] ?? url;
}

export function normalizeFetchUrls(url: string, sourceKind: ExtractionSourceKind): string[] {
  if (sourceKind !== "github") {
    return [url];
  }

  const parsed = parseGitHubUrl(url);

  if (!parsed) {
    return [url];
  }

  if (parsed.kind === "blob") {
    return [`https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${parsed.ref}/${parsed.path}`];
  }

  if (parsed.kind === "repo") {
    return [
      `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/main/README.md`,
      `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/master/README.md`,
      `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/main/readme.md`,
      `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/master/readme.md`
    ];
  }

  return [url];
}

function parseGitHubUrl(url: string):
  | { kind: "repo"; owner: string; repo: string }
  | { kind: "blob"; owner: string; repo: string; ref: string; path: string }
  | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);

    if (parsed.hostname !== "github.com" || parts.length < 2) {
      return null;
    }

    const [owner, repo, marker, ref, ...pathParts] = parts;

    if (marker === "blob" && ref && pathParts.length > 0) {
      return {
        kind: "blob",
        owner,
        repo,
        ref,
        path: pathParts.join("/")
      };
    }

    return {
      kind: "repo",
      owner,
      repo
    };
  } catch {
    return null;
  }
}

function extractHtmlSections(html: string): ExtractedSection[] {
  const headingPattern = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const sections: ExtractedSection[] = [];
  let match: RegExpExecArray | null;
  let order = 0;

  while ((match = headingPattern.exec(html)) !== null) {
    const title = cleanText(match[2]);

    if (!isUsefulHeading(title)) {
      continue;
    }

    const nextStart = headingPattern.lastIndex;
    const nextHeadingIndex = html.slice(nextStart).search(/<h[1-3][^>]*>/i);
    const sectionHtml =
      nextHeadingIndex === -1 ? html.slice(nextStart, nextStart + 2400) : html.slice(nextStart, nextStart + nextHeadingIndex);
    const sectionText = cleanText(sectionHtml);

    sections.push({
      id: sectionId(title, order),
      title,
      level: Number(match[1]),
      order,
      summary: summarizeSection(sectionText, title),
      keyTerms: extractKeyTerms(`${title} ${sectionText}`).slice(0, 8),
      setupHints: extractSetupHints(sectionHtml).slice(0, 4),
      codeSignals: extractCodeSignals(sectionHtml).slice(0, 4)
    });
    order += 1;
  }

  return sections;
}

function extractMarkdownSections(markdown: string): ExtractedSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: ExtractedSection[] = [];
  let current: { title: string; level: number; body: string[] } | null = null;

  function flush() {
    if (!current || !isUsefulHeading(current.title)) return;

    const body = current.body.join("\n");
    const order = sections.length;
    sections.push({
      id: sectionId(current.title, order),
      title: current.title,
      level: current.level,
      order,
      summary: summarizeSection(body, current.title),
      keyTerms: extractKeyTerms(`${current.title} ${body}`).slice(0, 8),
      setupHints: extractSetupHints(body).slice(0, 4),
      codeSignals: extractCodeSignals(body).slice(0, 4)
    });
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+?)\s*#*$/);

    if (headingMatch) {
      flush();
      current = {
        title: stripMarkdown(headingMatch[2]),
        level: headingMatch[1].length,
        body: []
      };
      continue;
    }

    current?.body.push(line);
  }

  flush();
  return sections;
}

function extractHtmlTitle(html: string): string | undefined {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  return cleanText(h1Match?.[1] ?? titleMatch?.[1] ?? "");
}

function firstMarkdownHeading(markdown: string): string | undefined {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? stripMarkdown(match[1]) : undefined;
}

function extractSetupHints(value: string): string[] {
  return Array.from(value.matchAll(setupPattern), (match) => cleanText(match[0]))
    .map((hint) => hint.replace(/\s+/g, " ").trim())
    .filter((hint) => hint.length >= 4 && hint.length <= 150);
}

function extractCodeSignals(value: string): string[] {
  const codeBlockPattern = /```([\s\S]*?)```|<pre[^>]*>([\s\S]*?)<\/pre>|<code[^>]*>([\s\S]*?)<\/code>/gi;
  const signals: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = codeBlockPattern.exec(value)) !== null && signals.length < 16) {
    const signal = cleanText(match[1] ?? match[2] ?? match[3] ?? "");
    const firstLine = signal.split(/\r?\n/).find((line) => line.trim().length > 0)?.trim() ?? "";

    if (firstLine.length >= 3 && firstLine.length <= 160) {
      signals.push(firstLine);
    }
  }

  return signals;
}

function extractKeyTerms(value: string): string[] {
  const matches = value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .match(/\b[A-Za-z][A-Za-z0-9+#.-]{3,}\b/g);

  if (!matches) return [];

  const counts = new Map<string, number>();

  for (const match of matches) {
    const normalized = match.toLowerCase();

    if (termStopWords.has(normalized)) continue;

    counts.set(match, (counts.get(match) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term)
    .slice(0, 18);
}

function statusFromSignal(
  sections: ExtractedSection[],
  setupHints: string[],
  raw: string,
  isHtml: boolean
): TutorialExtraction["status"] {
  if (/captcha|enable javascript|access denied|cloudflare|verify you are human/i.test(raw)) {
    return "blocked";
  }

  if (sections.length >= 4 || (sections.length >= 2 && setupHints.length > 0)) {
    return "full";
  }

  if (sections.length > 0 || setupHints.length > 0 || isHtml) {
    return "partial";
  }

  return "unknown";
}

function confidenceFromSignal(status: TutorialExtraction["status"], sectionCount: number, setupCount: number) {
  const base: Record<TutorialExtraction["status"], number> = {
    full: 0.86,
    partial: 0.58,
    video: 0.42,
    blocked: 0.18,
    dead: 0.05,
    unknown: 0.22
  };

  return Math.min(0.98, Number((base[status] + sectionCount * 0.015 + setupCount * 0.01).toFixed(2)));
}

function notesForStatus(status: TutorialExtraction["status"], sectionCount: number): string[] {
  if (status === "full") {
    return [`Extracted ${sectionCount} tutorial sections and derived a custom build guide.`];
  }

  if (status === "partial") {
    return [`Extracted limited structure from the source; the build guide uses cautious fallback steps where detail is missing.`];
  }

  if (status === "blocked") {
    return ["The source blocked extraction, so the original tutorial remains required."];
  }

  return ["The app could not confidently extract source structure."];
}

function videoExtraction(article: TutorialArticle, extractedAt: string): TutorialExtraction {
  return {
    status: "video",
    sourceKind: "video",
    confidence: 0.42,
    title: article.health.title ?? article.title,
    finalUrl: article.health.finalUrl ?? article.url,
    extractedAt,
    sections: [
      {
        id: `${article.id}-video-plan`,
        title: "Watch, pause, and convert the tutorial into checkpoints",
        level: 1,
        order: 0,
        summary:
          "The source is video-based, so the app creates a watch-and-build loop rather than storing transcript content.",
        keyTerms: extractKeyTerms(`${article.title} ${article.category}`),
        setupHints: [],
        codeSignals: []
      }
    ],
    setupHints: [],
    keyTerms: extractKeyTerms(`${article.title} ${article.category}`),
    codeSignals: [],
    notes: ["Video source detected. Use the original tutorial while following the app's pause-and-check workflow."]
  };
}

function fallbackExtraction(
  article: TutorialArticle,
  status: TutorialExtraction["status"],
  sourceKind: ExtractionSourceKind,
  notes: string[],
  error?: string
): TutorialExtraction {
  return {
    status,
    sourceKind,
    confidence: confidenceFromSignal(status, 0, 0),
    title: article.health.title ?? article.title,
    finalUrl: article.health.finalUrl ?? article.url,
    extractedAt: new Date().toISOString(),
    sections: [],
    setupHints: [],
    keyTerms: extractKeyTerms(`${article.title} ${article.category}`),
    codeSignals: [],
    notes,
    error
  };
}

function cleanText(value: string): string {
  return stripMarkdown(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function stripMarkdown(value: string): string {
  return value
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[`*_>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeSection(text: string, fallbackTitle: string): string {
  const terms = extractKeyTerms(`${fallbackTitle} ${text}`).slice(0, 5);
  const termText = terms.length > 0 ? ` Key signals: ${terms.join(", ")}.` : "";

  return `This checkpoint focuses on ${fallbackTitle.toLowerCase()} and should be turned into one small beginner-verifiable step.${termText}`;
}

function isUsefulHeading(title: string): boolean {
  return (
    title.length >= 3 &&
    title.length <= 120 &&
    !/^(table of contents|contents|license|contributing|comments|share|newsletter|footer)$/i.test(title)
  );
}

function sectionId(title: string, order: number): string {
  return `${String(order + 1).padStart(2, "0")}-${slugify(title) || "section"}`;
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    const key = normalized.toLowerCase();

    if (!normalized || seen.has(key)) continue;

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

function isVideoUrl(url: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

function trimToBytes(value: string, maxBytes: number): string {
  if (value.length <= maxBytes) {
    return value;
  }

  return value.slice(0, maxBytes);
}
