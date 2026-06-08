import { curationStandardVersion } from "./curationStandard";
import type {
  BuildCheckpoint,
  ConceptModule,
  CurationRecord,
  ProjectPath,
  ResourceLink,
  TutorialArticle,
  TutorialSpecificGuide
} from "./types";

interface CuratedOverride {
  id: string;
  match: (article: TutorialArticle) => boolean;
  curation: CurationRecord;
  concepts: ConceptModule[];
  checkpoints: Array<Omit<BuildCheckpoint, "id" | "prerequisiteModuleIds">>;
  setupSteps: string[];
  finalProofTasks: string[];
  cvFraming: string;
}

const browserResources = [
  resource("Web Browser Engineering", "Build a browser engine", "https://browser.engineering/"),
  resource("MDN", "HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
  resource("MDN", "Document Object Model", "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction"),
  resource("MDN", "CSS layout", "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout")
];

const webServerResources = [
  resource("Ruslan Spivak", "Let's Build A Web Server", "https://ruslanspivak.com/lsbaws-part1/"),
  resource("Python Docs", "Socket Programming HOWTO", "https://docs.python.org/3/howto/sockets.html"),
  resource("MDN", "HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
  resource("MDN", "Client-server overview", "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview")
];

const nandResources = [
  resource("nand2tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
  resource("nand2tetris", "The Elements of Computing Systems", "https://www.nand2tetris.org/book"),
  resource("Software Carpentry", "The Unix Shell", "https://swcarpentry.github.io/shell-novice/"),
  resource("MIT", "Missing Semester", "https://missing.csail.mit.edu/")
];

const curatedOverrides: CuratedOverride[] = [
  {
    id: "browser-engine",
    match: (article) =>
      article.url.includes("browser.engineering") ||
      /browser engine|build a browser|toy browser/i.test(article.title),
    curation: record(
      "curated",
      "approved",
      "Deep Research PDF plus Web Browser Engineering/MDN resources",
      "Curated browser-engine path focused on fetch, parse, layout, render, navigation, and deliberate deferral of JavaScript/browser-chrome complexity.",
      [
        "Start with raw text fetching before HTML layout.",
        "Treat parsing, layout, rendering, and navigation as separate proof checkpoints.",
        "Defer JavaScript support until the learner can explain the browser engine stack."
      ]
    ),
    concepts: [
      concept(
        "curated-browser-fetch-parse-layout",
        "Fetch, parse, layout, render",
        "A toy browser becomes learnable when the learner separates four jobs: fetch bytes from a URL, parse text into structure, compute layout boxes, and draw pixels or text.",
        "This is the core spine of browser.engineering and prevents beginners from treating a browser as one giant mystery program.",
        [
          "You can explain why a successful HTTP response still needs parsing before it can be displayed.",
          "You can name one bug that belongs to fetching and a different bug that belongs to layout.",
          "You can build a proof task for each stage: response text, parsed tree, layout boxes, drawn output."
        ],
        browserResources
      ),
      concept(
        "curated-browser-engine-scope",
        "Engine scope before browser chrome",
        "A browser engine renders pages; browser chrome is the app shell around the engine: tabs, address bar, menus, downloads, and preferences.",
        "Beginners need permission to build the educational core first instead of trying to clone Chrome or Firefox as a product.",
        [
          "You can list two engine responsibilities and two chrome responsibilities.",
          "You can explain why tabs are not needed to prove HTML parsing or layout.",
          "You can describe the smallest browser demo worth committing."
        ],
        browserResources
      )
    ],
    checkpoints: [
      checkpoint(
        "Fetch and display raw text",
        "Networking and early rendering chapters",
        "Learn URLs, HTTP request/response basics, and the difference between a fetched byte stream and a visible page.",
        "Fetch one URL and display the raw response text in a window, canvas, or terminal output before adding HTML structure.",
        "If nothing appears, verify the HTTP response separately before debugging drawing code.",
        "A clean run shows fetched page text or simplified text output from a real URL.",
        browserResources
      ),
      checkpoint(
        "Parse simple HTML into a tree",
        "HTML parsing chapters",
        "Learn why a parser turns text into nodes and why malformed/simple HTML cases should be tested one at a time.",
        "Parse a tiny HTML string with nested tags and print or inspect the resulting tree before rendering it.",
        "If layout looks wrong, first prove the parse tree is correct before touching geometry.",
        "A tiny HTML fixture produces the expected parent/child node structure.",
        browserResources
      ),
      checkpoint(
        "Lay out and draw text blocks",
        "CSS and layout chapters",
        "Learn the difference between a DOM-like tree, style information, and layout boxes with coordinates.",
        "Compute positions for simple block text and draw it in a predictable order.",
        "If text overlaps, inspect box sizes and coordinates before changing parser code.",
        "Two simple pages render with visibly different but explainable layout.",
        browserResources
      ),
      checkpoint(
        "Navigate by clicking a link",
        "Links and forms chapters",
        "Learn event handling as a bridge between displayed content and a new network request.",
        "Click one parsed link, resolve its target, fetch the next page, and redraw.",
        "If clicking works but the wrong page loads, inspect URL resolution and link target parsing.",
        "The demo moves between two simple pages with visible layout changes.",
        browserResources
      )
    ],
    setupSteps: [
      "Read the first Web Browser Engineering chapter outline and write the six engine layers: fetch, parse, style, layout, render, navigate.",
      "Create a repository with fixtures for one plain-text response and one tiny HTML page.",
      "Install the language/tooling and run a smallest visible-output program before any network code.",
      "Write a note saying which features are deliberately out of scope: JavaScript, tabs, browser extensions, security sandboxing, and full CSS."
    ],
    finalProofTasks: [
      "Record a demo that fetches, parses, lays out, draws, and navigates between two simple pages.",
      "Add a README section explaining fetch versus parse versus layout versus render.",
      "Include one debugging note for a real parser/layout/network issue.",
      "List three browser features intentionally omitted and why they are outside the educational core."
    ],
    cvFraming:
      "Built a toy browser engine from first principles, including page fetching, HTML parsing, layout, rendering, and basic navigation, with clear boundaries between engine internals and browser UI."
  },
  {
    id: "web-server",
    match: (article) =>
      article.url.includes("ruslanspivak.com/lsbaws") ||
      /build a web server|web server from scratch|let.?s build a web server/i.test(article.title),
    curation: record(
      "curated",
      "approved",
      "Deep Research PDF plus Ruslan Spivak, Python sockets, and MDN HTTP resources",
      "Curated raw-web-server path focused on sockets, HTTP anatomy, routing, and the server/application boundary.",
      [
        "Start single-threaded.",
        "Use raw HTTP responses before framework abstractions.",
        "Make the server/application split explicit before adding more routes."
      ]
    ),
    concepts: [
      concept(
        "curated-http-bytes",
        "HTTP as structured bytes",
        "A web server starts by reading bytes from a socket and writing bytes back in a format the browser understands.",
        "This removes the illusion that a framework is required before a beginner can understand a web response.",
        [
          "You can write a minimal HTTP response with a status line, header, blank line, and body.",
          "You can explain why the browser may hang if the response is malformed.",
          "You can identify request line, headers, and body in a raw request."
        ],
        webServerResources
      ),
      concept(
        "curated-server-app-boundary",
        "Protocol plumbing versus app logic",
        "Protocol plumbing accepts connections, parses requests, and writes responses; app logic decides what content each path should return.",
        "This is the bridge from a toy socket server to framework-style architecture without hiding the protocol too early.",
        [
          "You can name one responsibility of the socket/server layer and one of the application layer.",
          "You can refactor one hardcoded response into a handler function.",
          "You can explain why routing belongs above raw socket accept/recv/send code."
        ],
        webServerResources
      )
    ],
    checkpoints: [
      checkpoint(
        "Serve raw Hello World over HTTP",
        "Part 1 and early socket server pieces",
        "Learn bind, listen, accept, recv, send, and the minimum valid HTTP response shape.",
        "Serve Hello World from a raw socket and open it from a browser at localhost.",
        "If the browser spins forever, confirm the blank line between headers and body and whether the connection closes.",
        "The browser displays the exact response text from your socket server.",
        webServerResources
      ),
      checkpoint(
        "Inspect and parse one request",
        "Request parsing sections",
        "Learn request line, method, path, headers, and how to print raw input before making decisions.",
        "Log one browser request and parse the method/path into variables.",
        "If routing fails, print the raw request line and parsed path side by side.",
        "Two paths can be distinguished from the request line.",
        webServerResources
      ),
      checkpoint(
        "Route two paths",
        "Routing/application sections",
        "Learn how routing maps paths to behavior while keeping protocol code small.",
        "Return different responses for `/` and one additional path using handler functions.",
        "If routes become messy, check whether socket/protocol work is leaking into handlers.",
        "The browser shows two different responses for two different URLs.",
        webServerResources
      ),
      checkpoint(
        "Separate server from app callback",
        "Later WSGI-style architecture pieces",
        "Learn why frameworks separate low-level protocol handling from application behavior.",
        "Move response generation into one callable or handler layer and keep socket handling separate.",
        "If a bug crosses layers, write which layer owns the failure before changing code.",
        "A README diagram shows socket/protocol layer feeding an app handler.",
        webServerResources
      )
    ],
    setupSteps: [
      "Read MDN's HTTP overview and write the minimum response shape from memory.",
      "Run a tiny Python script and confirm your browser can reach localhost.",
      "Create fixtures for one raw request and one raw response.",
      "Commit before adding sockets, before adding parsing, and before adding routing."
    ],
    finalProofTasks: [
      "Demo localhost serving at least two different routes from raw socket code.",
      "Add a README section explaining request line, headers, status line, and body.",
      "Include one real malformed-response bug and how you diagnosed it.",
      "Explain how the final app boundary resembles framework architecture without using a framework."
    ],
    cvFraming:
      "Built a web server from raw sockets upward, including HTTP response generation, request parsing, routing, and a clear boundary between protocol plumbing and application logic."
  },
  {
    id: "nand2tetris",
    match: (article) =>
      article.url.includes("nand2tetris.org") ||
      /nand.*tetris|modern computer from first principles/i.test(article.title),
    curation: record(
      "curated",
      "approved",
      "Deep Research PDF plus nand2tetris and beginner shell resources",
      "Curated first-principles computer-systems path focused on the abstraction ladder from gates to software tools.",
      [
        "Treat this as a long course, not a weekend tutorial.",
        "Keep the hardware half and software half connected.",
        "Do not let learners skip proof tests for earlier layers."
      ]
    ),
    concepts: [
      concept(
        "curated-abstraction-ladder",
        "The abstraction ladder",
        "Each project layer becomes a simpler interface for the next layer: gates become chips, chips become CPU/memory, machine code becomes a VM/compiler target.",
        "This is the central survival map for nand2tetris because every later failure can come from a misunderstood earlier layer.",
        [
          "You can draw the ladder from gates to OS services.",
          "You can explain what a layer hides and what contract it exposes.",
          "You can decide which earlier layer to test when a later layer fails."
        ],
        nandResources
      ),
      concept(
        "curated-hardware-software-contract",
        "Hardware/software contracts",
        "An instruction set is a contract between the hardware that executes instructions and the software tools that generate them.",
        "This is the bridge between CPU design, assembler, VM translator, compiler, and operating-system services.",
        [
          "You can explain why a compiler must know its target machine.",
          "You can name one CPU-level detail the assembler cares about.",
          "You can test a tiny program through one toolchain stage at a time."
        ],
        nandResources
      )
    ],
    checkpoints: [
      checkpoint(
        "Logic gates feel concrete",
        "Hardware half",
        "Learn truth tables, simple gates, and how tests prove a chip contract.",
        "Complete a small gate subset and write what each gate promises.",
        "If a composed chip fails, test the smaller gates before changing the larger chip.",
        "A chain of basic gates passes supplied tests and is explained in your own words.",
        nandResources
      ),
      checkpoint(
        "ALU and CPU contracts are visible",
        "ALU, registers, CPU",
        "Learn how arithmetic, memory, registers, and instruction decoding fit together.",
        "Draw the data path for one instruction before implementing or debugging CPU behavior.",
        "If CPU tests fail, isolate whether the instruction, register state, or ALU output is wrong.",
        "One tiny machine instruction can be traced from input state to output state.",
        nandResources
      ),
      checkpoint(
        "Assembler and VM translator are separate",
        "Assembler and VM translator stages",
        "Learn why symbolic assembly, VM commands, and machine code are different representations.",
        "Run a tiny known-good program through one translation stage at a time.",
        "If compiler output is wrong, verify assembler and VM translator with smaller examples first.",
        "A simple program produces expected output through the toolchain stage under test.",
        nandResources
      ),
      checkpoint(
        "Compiler and OS services connect upward",
        "Compiler and OS stages",
        "Learn how the compiler targets the VM/machine model and how OS services provide reusable behavior.",
        "Implement or trace one language feature through compiler output and runtime support.",
        "If runtime behavior fails, decide whether the compiler emitted wrong code or the OS/service layer misbehaved.",
        "A small Jack/program example runs through the stack with a written layer-by-layer explanation.",
        nandResources
      )
    ],
    setupSteps: [
      "Treat nand2tetris as a multi-week course and create a progress log for each layer.",
      "Learn shell navigation first if files, folders, and commands still feel uncertain.",
      "Draw the abstraction ladder before starting: gates, chips, ALU, CPU, assembler, VM, compiler, OS.",
      "Commit after each passed hardware/software test suite and write which contract now works."
    ],
    finalProofTasks: [
      "Show one working artifact from the hardware half and one from the software half.",
      "Add a README ladder explaining how each layer supports the next.",
      "Include one debugging story where a later failure came from an earlier contract.",
      "Explain why this is larger than a normal tutorial and how you scoped your completed work."
    ],
    cvFraming:
      "Built an educational computer stack from first principles, connecting logic gates, CPU architecture, assembler/VM tooling, compiler behavior, and simple OS services through explicit layer contracts."
  }
];

export function applyCuratedPathOverrides(article: TutorialArticle, path: ProjectPath): ProjectPath {
  const override = findOverride(article);

  if (!override) {
    return {
      ...path,
      curation: path.curation ?? record("generated", "review-needed", "Deterministic curriculum generator", "Generated path awaiting tutorial-specific curation.", [
        "Review concepts for tutorial specificity.",
        "Replace heading-derived guidance with researched checkpoints when this tutorial becomes a priority."
      ])
    };
  }

  return {
    ...path,
    concepts: mergeConcepts(override.concepts, path.concepts),
    curation: override.curation,
    cvFraming: override.cvFraming,
    nextSteps: [
      "Compare your implementation against the curated checkpoint proof tasks.",
      "Write one README section explaining the project-specific mental model in your own words.",
      ...path.nextSteps
    ].slice(0, 5)
  };
}

export function applyCuratedGuideOverrides(
  article: TutorialArticle,
  path: ProjectPath,
  guide: TutorialSpecificGuide
): TutorialSpecificGuide {
  const override = findOverride(article);

  if (!override) {
    return {
      ...guide,
      curation: guide.curation ?? path.curation
    };
  }

  const prerequisiteModuleIds = path.prerequisites.slice(0, 4).map((module) => module.id);

  return {
    ...guide,
    confidenceLabel: "Curated guide",
    sourceRequired: guide.sourceRequired,
    setupSteps: uniqueText([...override.setupSteps, ...guide.setupSteps]).slice(0, 8),
    checkpoints: override.checkpoints.map((checkpoint, index) => ({
      ...checkpoint,
      id: `${article.id}-curated-${override.id}-${index + 1}`,
      prerequisiteModuleIds
    })),
    resourceLinks: uniqueResources([
      ...override.checkpoints.flatMap((checkpoint) => checkpoint.resourceLinks ?? []),
      ...(guide.resourceLinks ?? [])
    ]).slice(0, 8),
    finalProofTasks: uniqueText([...override.finalProofTasks, ...guide.finalProofTasks]).slice(0, 8),
    fallbackReason: guide.fallbackReason,
    curation: override.curation
  };
}

export function curationLevelFor(article: TutorialArticle): CurationRecord {
  const override = findOverride(article);

  return override?.curation ?? record("generated", "review-needed", "Deterministic curriculum generator", "Generated path awaiting tutorial-specific curation.", [
    "Prioritize if extraction is blocked, source is dead, quality score is below excellent, or project is expert-level."
  ]);
}

function findOverride(article: TutorialArticle): CuratedOverride | undefined {
  return curatedOverrides.find((override) => override.match(article));
}

function record(
  level: CurationRecord["level"],
  status: CurationRecord["status"],
  source: string,
  summary: string,
  notes: string[]
): CurationRecord {
  return {
    level,
    status,
    source,
    summary,
    standardVersion: curationStandardVersion,
    updatedAt: "2026-06-08",
    notes
  };
}

function checkpoint(
  title: string,
  sourceSectionTitle: string,
  learnRightHere: string,
  action: string,
  debugPrompt: string,
  selfCheck: string,
  resourceLinks: ResourceLink[]
): Omit<BuildCheckpoint, "id" | "prerequisiteModuleIds"> {
  return {
    title,
    sourceSectionTitle,
    beginnerGoal: learnRightHere,
    learnRightHere,
    action,
    selfCheck,
    debugPrompt,
    resourceLinks
  };
}

function concept(
  id: string,
  title: string,
  plainEnglish: string,
  whyItMatters: string,
  signsYouUnderstand: string[],
  resources: ResourceLink[]
): ConceptModule {
  return {
    id,
    title,
    plainEnglish,
    whyItMatters,
    signsYouUnderstand,
    resources
  };
}

function resource(provider: string, label: string, url: string): ResourceLink {
  return { provider, label, url };
}

function mergeConcepts(curated: ConceptModule[], generated: ConceptModule[]): ConceptModule[] {
  const curatedKeys = new Set(curated.map((concept) => concept.title.toLowerCase()));

  return [
    ...curated,
    ...generated.filter((concept) => !curatedKeys.has(concept.title.toLowerCase()))
  ].slice(0, 12);
}

function uniqueResources(resources: ResourceLink[]): ResourceLink[] {
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
