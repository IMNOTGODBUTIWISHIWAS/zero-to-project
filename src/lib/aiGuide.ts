import type { TutorialArticle, TutorialExtraction, TutorialSpecificGuide } from "./types";

export interface AiGuideOptions {
  apiKey?: string;
  model?: string;
  fetchImpl?: typeof fetch;
  enabled?: boolean;
}

export async function maybeEnhanceGuideWithAi(
  article: TutorialArticle,
  extraction: TutorialExtraction,
  guide: TutorialSpecificGuide,
  options: AiGuideOptions = {}
): Promise<TutorialSpecificGuide> {
  const env = (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env;
  const apiKey = options.apiKey ?? env?.OPENAI_API_KEY;

  if (!options.enabled || !apiKey || extraction.status === "dead" || extraction.status === "blocked") {
    return guide;
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const model = options.model ?? env?.OPENAI_MODEL ?? "gpt-5-mini";

  try {
    const response = await fetchImpl("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        instructions:
          "Create original beginner learning scaffolding from derived tutorial metadata. Do not reproduce article text. Return strict JSON only.",
        input: JSON.stringify({
          article: {
            id: article.id,
            title: article.title,
            category: article.category,
            languages: article.languages
          },
          extraction: {
            status: extraction.status,
            sourceKind: extraction.sourceKind,
            sections: extraction.sections.map((section) => ({
              title: section.title,
              summary: section.summary,
              keyTerms: section.keyTerms,
              setupHints: section.setupHints
            })),
            keyTerms: extraction.keyTerms,
            setupHints: extraction.setupHints
          },
          guide
        }),
        text: {
          format: {
            type: "json_schema",
            name: "tutorial_specific_guide_patch",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                setupSteps: {
                  type: "array",
                  items: { type: "string" }
                },
                checkpointNotes: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      id: { type: "string" },
                      learnRightHere: { type: "string" },
                      action: { type: "string" },
                      debugPrompt: { type: "string" }
                    },
                    required: ["id", "learnRightHere", "action", "debugPrompt"]
                  }
                },
                finalProofTasks: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["setupSteps", "checkpointNotes", "finalProofTasks"]
            }
          }
        },
        max_output_tokens: 1800
      })
    });

    if (!response.ok) {
      return guide;
    }

    const payload = await response.json();
    const text = extractResponseText(payload);
    const patch = JSON.parse(text) as {
      setupSteps?: string[];
      checkpointNotes?: Array<{
        id: string;
        learnRightHere: string;
        action: string;
        debugPrompt: string;
      }>;
      finalProofTasks?: string[];
    };

    return {
      ...guide,
      aiEnhanced: true,
      setupSteps: sanitizeList(patch.setupSteps, guide.setupSteps),
      checkpoints: guide.checkpoints.map((checkpoint) => {
        const note = patch.checkpointNotes?.find((item) => item.id === checkpoint.id);

        return note
          ? {
              ...checkpoint,
              learnRightHere: safeString(note.learnRightHere, checkpoint.learnRightHere),
              action: safeString(note.action, checkpoint.action),
              debugPrompt: safeString(note.debugPrompt, checkpoint.debugPrompt)
            }
          : checkpoint;
      }),
      finalProofTasks: sanitizeList(patch.finalProofTasks, guide.finalProofTasks)
    };
  } catch {
    return guide;
  }
}

function extractResponseText(payload: any): string {
  if (typeof payload.output_text === "string") {
    return payload.output_text;
  }

  const message = payload.output?.find((item: any) => item.type === "message");
  const textItem = message?.content?.find((item: any) => item.type === "output_text");

  return textItem?.text ?? "{}";
}

function sanitizeList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.length < 260)
    .slice(0, 8);

  return cleaned.length > 0 ? cleaned : fallback;
}

function safeString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 && value.length < 500
    ? value.trim()
    : fallback;
}
