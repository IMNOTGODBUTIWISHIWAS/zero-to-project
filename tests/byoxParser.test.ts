import { describe, expect, it } from "vitest";
import { parseBuildYourOwnX, parseTutorialLine } from "../src/lib/byoxParser";

describe("parseBuildYourOwnX", () => {
  it("extracts category, language, title, url, and video flag", () => {
    const markdown = [
      "## Build your own <insert-technology-here>",
      "* [3D Renderer](#build-your-own-3d-renderer)",
      "## Tutorials",
      "#### Build your own `Game`",
      "* [**JavaScript**: _Think like a programmer: Snake_](https://example.com/snake)",
      "#### Build your own `3D Renderer`",
      "* [**C# / TypeScript / JavaScript**: _Learning how to write a 3D soft engine_](https://example.com/engine)",
      "* [**C**: _Learn Video Game Programming in C_](https://example.com/video)",
      "  [video]",
      "## Contribute",
      "* [create an issue](https://example.com/issue)"
    ].join("\n");

    const articles = parseBuildYourOwnX(markdown);

    expect(articles).toHaveLength(3);
    expect(articles[0]).toMatchObject({
      category: "Game",
      languages: ["JavaScript"],
      title: "Think like a programmer: Snake",
      url: "https://example.com/snake",
      isVideo: false
    });
    expect(articles[1].languages).toEqual(["C#", "TypeScript", "JavaScript"]);
    expect(articles[2].isVideo).toBe(true);
  });

  it("handles entries without italic title markdown", () => {
    const article = parseTutorialLine(
      "* [**(any)**:  build-your-own-x-vibe-coding: BYOX-style tutorials](https://example.com)",
      "Uncategorized"
    );

    expect(article).toMatchObject({
      languages: ["any"],
      title: "build-your-own-x-vibe-coding: BYOX-style tutorials"
    });
  });

  it("deduplicates generated ids", () => {
    const markdown = [
      "## Tutorials",
      "#### Build your own `Bot`",
      "* [**Python**: _Build a Telegram Bot_](https://example.com/a)",
      "* [**Python**: _Build a Telegram Bot_](https://example.com/b)"
    ].join("\n");

    const articles = parseBuildYourOwnX(markdown);

    expect(articles[0].id).toBe("bot-python-build-a-telegram-bot");
    expect(articles[1].id).toBe("bot-python-build-a-telegram-bot-2");
  });
});
