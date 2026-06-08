import { describe, expect, it, vi } from "vitest";
import { detectSourceKind, extractTutorial, normalizeFetchUrls, parseReadableText } from "../src/lib/tutorialExtraction";
import type { TutorialArticle } from "../src/lib/types";

const baseArticle: TutorialArticle = {
  id: "demo",
  category: "Web Server",
  languages: ["Node.js"],
  title: "Build a web server",
  url: "https://example.com/tutorial",
  isVideo: false,
  source: "build-your-own-x",
  health: { status: "ok", contentType: "text/html" }
};

describe("tutorial extraction", () => {
  it("extracts useful structure from static html without storing body text", () => {
    const html = `
      <html><title>Demo</title><body>
        <h1>Build a server</h1>
        <p>This section explains requests and responses in a compact tutorial body that should be summarized.</p>
        <pre>npm install express</pre>
        <h2>Parse HTTP requests</h2>
        <p>Learn how headers, methods, and paths become data for your program.</p>
        <h2>Send a response</h2>
        <p>Return a status code and body to prove the server works.</p>
        <h2>Add routing</h2>
        <p>Map paths to handlers so the project grows safely.</p>
      </body></html>
    `;

    const extraction = parseReadableText(baseArticle, html, "html", baseArticle.url, "text/html");

    expect(extraction.status).toBe("full");
    expect(extraction.sections.map((section) => section.title)).toContain("Parse HTTP requests");
    expect(extraction.setupHints.join(" ")).toContain("npm install express");
    expect(JSON.stringify(extraction)).not.toContain("compact tutorial body that should be summarized");
  });

  it("handles blocked pages", async () => {
    const fetchImpl = vi.fn(async () => new Response("Forbidden", { status: 403 })) as typeof fetch;
    const extraction = await extractTutorial(baseArticle, { fetchImpl });

    expect(extraction.status).toBe("blocked");
    expect(extraction.notes.join(" ")).toContain("keeps the original tutorial link");
  });

  it("handles video and pdf sources as constrained extraction states", async () => {
    const video = await extractTutorial({
      ...baseArticle,
      isVideo: true,
      url: "https://www.youtube.com/watch?v=abc"
    });
    const pdf = await extractTutorial({
      ...baseArticle,
      url: "https://example.com/book.pdf",
      health: { status: "ok", contentType: "application/pdf" }
    });

    expect(video.status).toBe("video");
    expect(pdf.status).toBe("partial");
    expect(pdf.sourceKind).toBe("pdf");
  });

  it("marks dead links without fetching again", async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    const extraction = await extractTutorial({
      ...baseArticle,
      health: { status: "dead" }
    }, { fetchImpl });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(extraction.status).toBe("dead");
  });

  it("normalizes GitHub repositories to candidate README urls", () => {
    expect(detectSourceKind("https://github.com/example/project")).toBe("github");
    expect(normalizeFetchUrls("https://github.com/example/project", "github")).toEqual([
      "https://raw.githubusercontent.com/example/project/main/README.md",
      "https://raw.githubusercontent.com/example/project/master/README.md",
      "https://raw.githubusercontent.com/example/project/main/readme.md",
      "https://raw.githubusercontent.com/example/project/master/readme.md"
    ]);
  });
});
