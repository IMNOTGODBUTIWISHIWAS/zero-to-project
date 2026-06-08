import type { TutorialArticle } from "./types";

const CATEGORY_PATTERN = /^####\s+(?:Build your own\s+)?`?([^`\n]+?)`?\s*$/;
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

export function parseBuildYourOwnX(markdown: string): TutorialArticle[] {
  const articles: TutorialArticle[] = [];
  let currentCategory = "Uncategorized";
  let insideTutorials = false;
  const usedIds = new Map<string, number>();
  const lines = markdown.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (/^##\s+Tutorials\s*$/.test(line)) {
      insideTutorials = true;
      continue;
    }

    if (insideTutorials && /^##\s+/.test(line)) {
      break;
    }

    if (!insideTutorials) {
      continue;
    }

    const categoryMatch = line.match(CATEGORY_PATTERN);

    if (categoryMatch) {
      currentCategory = decodeEntities(categoryMatch[1].trim());
      continue;
    }

    if (!line.startsWith("* [")) {
      continue;
    }

    const combinedLine = `${line} ${lines[index + 1]?.trim() ?? ""}`;
    const entry = parseTutorialLine(combinedLine, currentCategory, usedIds);

    if (entry) {
      articles.push(entry);
    }
  }

  return articles;
}

export function parseTutorialLine(
  line: string,
  category: string,
  usedIds = new Map<string, number>()
): TutorialArticle | null {
  LINK_PATTERN.lastIndex = 0;
  const match = LINK_PATTERN.exec(line);

  if (!match) {
    return null;
  }

  const rawLabel = decodeEntities(stripMarkdown(match[1]).replace(/\s+/g, " ").trim());
  const url = match[2].trim();
  const isVideo = /\[video\]|\byoutube\.com\b|\byoutu\.be\b/i.test(line);
  const { languages, title } = splitLabel(rawLabel);
  const id = uniqueId(`${category}-${languages.join("-")}-${title}`, usedIds);

  return {
    id,
    category,
    languages,
    title,
    url,
    isVideo,
    source: "build-your-own-x",
    health: {
      status: "unknown"
    }
  };
}

function splitLabel(label: string): { languages: string[]; title: string } {
  const colonIndex = label.indexOf(":");

  if (colonIndex === -1) {
    return {
      languages: ["Any"],
      title: label
    };
  }

  const languageText = label.slice(0, colonIndex).trim();
  const title = label.slice(colonIndex + 1).trim();
  const languages = languageText
    .split(/\s*\/\s*|\s*,\s*/)
    .map((language) => language.replace(/[()]/g, "").trim())
    .filter(Boolean);

  return {
    languages: languages.length > 0 ? languages : ["Any"],
    title: title || label
  };
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\*\*/g, "")
    .replace(/_/g, "")
    .replace(/`/g, "")
    .replace(/<[^>]+>/g, "");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function uniqueId(seed: string, usedIds: Map<string, number>): string {
  const base = slugify(seed) || "tutorial";
  const seen = usedIds.get(base) ?? 0;
  usedIds.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen + 1}`;
}
