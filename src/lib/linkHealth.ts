import type { ArticleHealth, TutorialArticle } from "./types";

export interface LinkValidationOptions {
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export async function validateLink(
  url: string,
  options: LinkValidationOptions = {}
): Promise<ArticleHealth> {
  const timeoutMs = options.timeoutMs ?? 4500;
  const fetchImpl = options.fetchImpl ?? fetch;
  const checkedAt = new Date().toISOString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "ZeroToProject/0.1 (+https://github.com/codecrafters-io/build-your-own-x)"
      }
    });
    const contentType = response.headers.get("content-type") ?? undefined;
    const text = contentType?.includes("text/html") ? await response.text() : "";

    return {
      status: response.ok ? "ok" : "dead",
      statusCode: response.status,
      finalUrl: response.url,
      contentType,
      title: extractPageTitle(text),
      checkedAt
    };
  } catch (error) {
    return {
      status: "unknown",
      checkedAt,
      error: error instanceof Error ? error.message : "Unable to validate link"
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function validateArticles(
  articles: TutorialArticle[],
  options: LinkValidationOptions & { concurrency?: number } = {}
): Promise<TutorialArticle[]> {
  const concurrency = options.concurrency ?? 8;
  const queue = [...articles];
  const validated: TutorialArticle[] = [];

  async function worker() {
    while (queue.length > 0) {
      const article = queue.shift();

      if (!article) {
        break;
      }

      const health = await validateLink(article.url, options);
      validated.push({ ...article, health });
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return articles.map((article) => validated.find((item) => item.id === article.id) ?? article);
}

export function extractPageTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
  return match?.[1]?.replace(/\s+/g, " ").trim();
}
