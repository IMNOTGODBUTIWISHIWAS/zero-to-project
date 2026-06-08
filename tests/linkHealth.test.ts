import { describe, expect, it, vi } from "vitest";
import { extractPageTitle, validateLink } from "../src/lib/linkHealth";

describe("validateLink", () => {
  it("marks successful html links as ok and captures metadata", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response("<html><title>Example Tutorial</title></html>", {
        status: 200,
        headers: {
          "content-type": "text/html"
        }
      });
    }) as typeof fetch;

    const health = await validateLink("https://example.com", { fetchImpl });

    expect(health.status).toBe("ok");
    expect(health.statusCode).toBe(200);
    expect(health.title).toBe("Example Tutorial");
  });

  it("marks non-2xx responses as dead", async () => {
    const fetchImpl = vi.fn(async () => new Response("missing", { status: 404 })) as typeof fetch;

    const health = await validateLink("https://example.com/missing", { fetchImpl });

    expect(health.status).toBe("dead");
    expect(health.statusCode).toBe(404);
  });

  it("marks fetch failures as unknown", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("blocked");
    }) as typeof fetch;

    const health = await validateLink("https://example.com/blocked", { fetchImpl });

    expect(health.status).toBe("unknown");
    expect(health.error).toContain("blocked");
  });
});

describe("extractPageTitle", () => {
  it("normalizes whitespace in html titles", () => {
    expect(extractPageTitle("<title>\n  A   Good   Page \n</title>")).toBe("A Good Page");
  });
});
