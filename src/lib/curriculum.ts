import { baseModules, fallbackLanguageModule, languageModules } from "./resources";
import { auditConceptCards } from "./quality";
import { applyCuratedPathOverrides } from "./curatedOverrides";
import type {
  ConceptModule,
  DifficultyLevel,
  LearningModule,
  Milestone,
  ProjectPath,
  ResourceLink,
  TutorialArticle
} from "./types";

const categoryConcepts: Record<string, ConceptModule[]> = {
  "3D Renderer": [
    concept("rays-and-pixels", "Rays and pixels", "A renderer decides what color each pixel should be by modeling how light travels.", "The project becomes less mysterious once you see rendering as many tiny color decisions."),
    concept("vectors", "Vectors", "Vectors are numbers that describe direction and distance in space.", "They are the math language used for cameras, movement, and surfaces.")
  ],
  "AI Model": [
    concept("training-data", "Training data", "Models learn patterns from examples rather than being given every rule by hand.", "You need this to judge whether the model is learning or just memorizing noise."),
    concept("loss", "Loss", "Loss is a number that says how wrong the model was on an example.", "Training is mostly the loop of measuring loss and nudging the model lower.")
  ],
  "Augmented Reality": [
    concept("tracking", "Tracking", "AR keeps virtual objects aligned with the real world by estimating camera position.", "Most AR bugs are really tracking, calibration, or coordinate-system bugs."),
    concept("coordinate-spaces", "Coordinate spaces", "A coordinate space is a frame of reference for where things are.", "AR uses several spaces at once, so naming them prevents confusion.")
  ],
  "BitTorrent Client": [
    concept("peers", "Peers", "A peer is another machine sharing pieces of the same file.", "The project is about cooperating with many peers instead of downloading from one server."),
    concept("protocols", "Protocols", "A protocol is an agreement about message formats and order.", "BitTorrent works only because every client follows the same rules.")
  ],
  "Blockchain / Cryptocurrency": [
    concept("hashing", "Hashing", "A hash turns data into a fixed-size fingerprint that changes when the data changes.", "Hashes let blocks point to prior blocks and reveal tampering."),
    concept("consensus", "Consensus", "Consensus is how a network agrees on shared history without one trusted owner.", "It explains why blockchain projects are network projects, not just database projects.")
  ],
  Bot: [
    concept("events", "Events", "Bots react to incoming messages or webhooks instead of running in one straight line.", "You need event thinking to avoid freezing or missing updates."),
    concept("apis", "APIs", "An API is a structured way for programs to ask another service to do something.", "Most bots are glue between your code and a platform API.")
  ],
  "Command-Line Tool": [
    concept("arguments", "Arguments and flags", "Command-line tools receive text inputs that change what they do.", "Parsing inputs cleanly makes your tool predictable."),
    concept("exit-codes", "Exit codes", "Programs report success or failure with small numbers after they finish.", "Exit codes matter when another tool or script runs your program.")
  ],
  Database: [
    concept("persistence", "Persistence", "Persistence means data survives after the program exits.", "This is the line between a toy data structure and a database."),
    concept("indexes", "Indexes", "Indexes are shortcuts that help find data without scanning everything.", "They explain how databases stay fast as data grows.")
  ],
  Docker: [
    concept("isolation", "Isolation", "Containers separate a process from parts of the host system.", "Docker-like projects are about controlled boundaries, not just packaging."),
    concept("namespaces", "Namespaces", "Namespaces make a process see a limited view of system resources.", "They are one of the key tricks behind containers.")
  ],
  "Emulator / Virtual Machine": [
    concept("instruction-set", "Instruction sets", "An instruction set is the list of operations a machine understands.", "An emulator is mostly a program that reads and performs those operations."),
    concept("state-machine", "State machines", "A state machine tracks the current state and how inputs change it.", "Emulators are easier when you see memory, registers, and instructions as state.")
  ],
  "Front-end Framework / Library": [
    concept("state-ui", "State to UI", "A UI framework turns changing data into what the user sees.", "The core question is how changes update the screen without chaos."),
    concept("rendering", "Rendering", "Rendering means producing the visible output from components or data.", "Framework internals are mainly rendering, scheduling, and event handling.")
  ],
  Game: [
    concept("game-loop", "Game loop", "A game loop repeatedly reads input, updates state, and draws a frame.", "Once you see the loop, game code becomes organized instead of magical."),
    concept("collision", "Collision", "Collision logic decides when objects touch or overlap.", "Games feel real only when collisions are predictable.")
  ],
  Git: [
    concept("snapshots", "Snapshots", "Git stores versions as snapshots connected by history.", "This helps explain commits, branches, and why Git can rewind."),
    concept("content-addressing", "Content addressing", "Git identifies objects by hashes of their contents.", "This makes Git internals less abstract and explains why changes affect IDs.")
  ],
  "Memory Allocator": [
    concept("heap", "The heap", "The heap is memory used for values whose lifetime is managed while the program runs.", "Allocators decide which heap chunks are free or used."),
    concept("fragmentation", "Fragmentation", "Fragmentation happens when free memory is split into awkward gaps.", "Allocator quality is partly about reducing wasted space.")
  ],
  "Network Stack": [
    concept("packets", "Packets", "Networks break data into smaller units that travel independently.", "A network stack project is about wrapping, routing, and interpreting packets."),
    concept("layers", "Network layers", "Each layer handles one kind of network responsibility.", "Layers keep physical transfer, addressing, transport, and application rules separate.")
  ],
  "Neural Network": [
    concept("neurons", "Neurons", "A neuron combines inputs into a number, then transforms it with an activation function.", "Understanding one neuron makes a whole network feel less intimidating."),
    concept("gradient-descent", "Gradient descent", "Gradient descent adjusts values in the direction that reduces error.", "It is the engine behind training most neural networks.")
  ],
  "Operating System": [
    concept("kernel", "Kernel", "The kernel is the core program that manages hardware and processes.", "OS projects are about the boundary between user programs and machine resources."),
    concept("boot", "Boot process", "Booting is the sequence that gets from powered-off hardware to running system code.", "Early OS tutorials often begin before a normal program even exists.")
  ],
  "Physics Engine": [
    concept("simulation", "Simulation", "Simulation updates a model of the world over small time steps.", "Physics engines are loops that approximate motion well enough to feel consistent."),
    concept("forces", "Forces", "Forces change velocity and movement over time.", "This connects equations to visible motion.")
  ],
  Processor: [
    concept("cpu-pipeline", "Processor pipeline", "A processor repeatedly fetches, decodes, and executes instructions.", "Processor projects are easier when you follow this rhythm."),
    concept("logic-gates", "Logic gates", "Logic gates combine simple signals into larger decisions.", "They are the building blocks under processor behavior.")
  ],
  "Programming Language": [
    concept("parsing", "Parsing", "Parsing turns source text into a structure the program can understand.", "Compilers and interpreters start by making code less like text and more like data."),
    concept("evaluation", "Evaluation", "Evaluation means executing or interpreting the structured program.", "It is where language rules turn into behavior.")
  ],
  "Regex Engine": [
    concept("automata", "Automata", "Automata are simple machines that move between states while reading input.", "Regex engines are less scary when you see patterns as state transitions."),
    concept("backtracking", "Backtracking", "Backtracking tries a path, then rewinds when it fails.", "Many regex surprises come from how backtracking explores choices.")
  ],
  "Search Engine": [
    concept("indexing", "Indexing", "Indexing builds a lookup structure before search happens.", "Search engines are fast because they prepare data ahead of time."),
    concept("ranking", "Ranking", "Ranking decides which matching result should appear first.", "Good search is not just finding matches; it is ordering useful matches.")
  ],
  Shell: [
    concept("processes", "Processes", "A process is a running program with its own execution state.", "Shells are mainly tools for starting, connecting, and controlling processes."),
    concept("pipes", "Pipes", "Pipes pass output from one process into another process.", "They explain why shell tools can be small but powerful together.")
  ],
  "Template Engine": [
    concept("templates", "Templates", "Templates combine fixed text with dynamic values.", "Template engines are about safely turning data into output."),
    concept("escaping", "Escaping", "Escaping changes special characters so they are treated as text.", "It prevents generated output from accidentally becoming code.")
  ],
  "Text Editor": [
    concept("buffer", "Buffer", "A buffer is the editable text stored in memory.", "Editor projects are mostly about changing and rendering buffers."),
    concept("cursor", "Cursor model", "The cursor model tracks where edits happen.", "A clear cursor model prevents off-by-one editing bugs.")
  ],
  "Visual Recognition System": [
    concept("features", "Features", "Features are useful signals extracted from raw image data.", "Recognition systems need a way to turn pixels into evidence."),
    concept("classification", "Classification", "Classification means choosing a label from possible categories.", "It is the final decision most recognition systems make.")
  ],
  "Voxel Engine": [
    concept("voxels", "Voxels", "Voxels are cube-like units of 3D space.", "Voxel engines trade smooth geometry for editable blocks."),
    concept("chunks", "Chunks", "Chunks group voxels so the engine can load, update, and render efficiently.", "Chunks are the difference between a demo and a world-sized system.")
  ],
  "Web Browser": [
    concept("html-css-layout", "HTML, CSS, and layout", "Browsers parse documents and calculate where things appear.", "A browser project is about turning text resources into a visual page."),
    concept("event-loop-browser", "Browser event loop", "The browser event loop schedules user input, scripts, and rendering.", "It explains why browser behavior is interactive rather than linear."),
    concept("parsing-vs-layout", "Parsing versus layout", "Parsing turns downloaded bytes into structured nodes, while layout computes where those nodes appear on screen.", "Browser-engine tutorials become much clearer when fetching, parsing, styling, layout, rendering, and navigation are treated as separate layers."),
    concept("browser-engine-scope", "Browser engine versus browser chrome", "The engine loads and renders pages; browser chrome is the surrounding app UI such as tabs, menus, and the address bar.", "This keeps a beginner focused on the teachable browser core instead of trying to recreate a full commercial browser first.")
  ],
  "Web Server": [
    concept("http", "HTTP", "HTTP is the request-response protocol browsers use to talk to servers.", "A web server project is mostly about reading requests and sending valid responses."),
    concept("routing", "Routing", "Routing maps a request path and method to code that handles it.", "Routing keeps a server from becoming one giant if statement."),
    concept("request-response-anatomy", "Request and response anatomy", "An HTTP request has a method, path, headers, and sometimes a body; an HTTP response has a status line, headers, and usually a body.", "Raw web-server tutorials are powerful because they reveal that a browser/server exchange is structured text and bytes before it is a framework."),
    concept("server-application-boundary", "Server and application boundary", "The server handles sockets and protocol details, while the application decides what content or behavior to return.", "This explains why toy servers can grow toward framework-style architecture without mixing network plumbing into every route.")
  ],
  Uncategorized: [
    concept("problem-decomposition", "Problem decomposition", "Decomposition means splitting a big project into smaller pieces.", "It is the beginner survival skill for unfamiliar projects."),
    concept("interfaces", "Interfaces", "Interfaces define how pieces communicate.", "When you know the inputs and outputs, implementation becomes less foggy."),
    concept("abstraction-ladder", "Abstraction ladder", "An abstraction ladder means each layer hides lower-level detail behind a simpler interface that the next layer can use.", "First-principles projects such as nand2tetris only become manageable when gates, chips, CPU, assembler, VM, compiler, and OS are learned as a ladder."),
    concept("hardware-software-co-design", "Hardware-software co-design", "Hardware and software are shaped around each other: machine code, compilers, memory, and operating systems all depend on the target machine.", "This keeps learners from treating compilers or operating systems as magic unrelated to the CPU and memory model underneath.")
  ]
};

const complexCategories = new Set([
  "3D Renderer",
  "AI Model",
  "Augmented Reality",
  "BitTorrent Client",
  "Blockchain / Cryptocurrency",
  "Database",
  "Docker",
  "Emulator / Virtual Machine",
  "Memory Allocator",
  "Network Stack",
  "Neural Network",
  "Operating System",
  "Physics Engine",
  "Processor",
  "Programming Language",
  "Regex Engine",
  "Search Engine",
  "Voxel Engine",
  "Web Browser"
]);

const approachableCategories = new Set([
  "Bot",
  "Command-Line Tool",
  "Game",
  "Template Engine",
  "Text Editor",
  "Web Server"
]);

const advancedLanguages = new Set(["c", "cpp", "rust", "assembly", "verilog", "haskell", "ocaml", "fsharp"]);

const beginnerLanguages = new Set(["python", "javascript", "typescript", "ruby"]);

const expertCategories = new Set([
  "Memory Allocator",
  "Operating System",
  "Processor",
  "Network Stack",
  "Emulator / Virtual Machine"
]);

export function generateProjectPath(article: TutorialArticle): ProjectPath {
  const normalizedLanguages = article.languages.map(normalizeLanguage);
  const difficulty = estimateDifficulty(article, normalizedLanguages);
  const beginnerScore = scoreArticle(article, normalizedLanguages, difficulty);
  const prerequisites = uniqueModules([
    ...baseModules,
    ...normalizedLanguages.map(languageToModule),
    ...domainPrepModules(article)
  ]);
  const concepts = conceptModulesFor(article);
  const milestones = milestonePlan(article, difficulty);
  const warnings = warningMessages(article, difficulty);
  const estimatedWeeks = estimateWeeks(prerequisites, difficulty);
  const generatedPath: ProjectPath = {
    articleId: article.id,
    difficulty,
    beginnerScore,
    estimatedWeeks,
    warnings,
    prerequisites,
    concepts,
    milestones,
    debuggingChecklist: [
      "Run the smallest possible version before adding the next feature.",
      "After each tutorial section, commit your code with a message that says what now works.",
      "When something breaks, copy the exact error, identify the file or command, and change only one thing.",
      "Keep a project journal: what you learned, what failed, and what finally fixed it.",
      "If the tutorial uses an unfamiliar term, pause and connect it to one concept card before continuing."
    ],
    cvFraming: cvFraming(article),
    nextSteps: nextSteps(article)
  };
  const curatedPath = applyCuratedPathOverrides(article, generatedPath);

  return {
    ...curatedPath,
    conceptQualityAudit: auditConceptCards(article, curatedPath.concepts)
  };
}

export function enrichArticles(articles: TutorialArticle[]) {
  return articles.map((article) => ({
    article,
    path: generateProjectPath(article)
  }));
}

export function normalizeLanguage(language: string): string {
  const value = language.toLowerCase().trim();

  if (value === "c++") return "cpp";
  if (value === "c#") return "csharp";
  if (value === "node.js" || value === "nodejs") return "javascript";
  if (value === "f#") return "fsharp";
  if (value === "common lisp") return "lisp";
  if (value === "pseudocode" || value === "alloy" || value === "any") return "any";

  return value;
}

function languageToModule(language: string): LearningModule {
  return languageModules[language] ?? fallbackLanguageModule;
}

function estimateDifficulty(article: TutorialArticle, languages: string[]): DifficultyLevel {
  let score = 0;

  if (complexCategories.has(article.category)) score += 2;
  if (expertCategories.has(article.category)) score += 1;
  if (approachableCategories.has(article.category)) score -= 1;
  if (languages.some((language) => advancedLanguages.has(language))) score += 2;
  if (languages.some((language) => beginnerLanguages.has(language))) score -= 1;
  if (/kernel|operating system|compiler|blockchain|neural|renderer|database|tcp|memory|allocator|processor|emulator/i.test(article.title)) {
    score += 1;
  }
  if (/beginner|simple|tiny|first|toy|miniature|less than|100 lines|20 lines|40 lines/i.test(article.title)) {
    score -= 1;
  }
  if (article.isVideo) score += 1;
  if (article.health.status === "dead") score += 1;

  if (score <= 0) return "starter";
  if (score <= 2) return "guided";
  if (score <= 3) return "advanced";
  return "expert";
}

function scoreArticle(
  article: TutorialArticle,
  languages: string[],
  difficulty: DifficultyLevel
): number {
  const difficultyBase: Record<DifficultyLevel, number> = {
    starter: 92,
    guided: 74,
    advanced: 52,
    expert: 34
  };
  let score = difficultyBase[difficulty];

  if (article.health.status === "ok") score += 6;
  if (article.health.status === "dead") score -= 22;
  if (languages.some((language) => beginnerLanguages.has(language))) score += 8;
  if (languages.some((language) => advancedLanguages.has(language))) score -= 8;
  if (/beginner|simple|tiny|first|toy|miniature/i.test(article.title)) score += 8;

  return Math.max(5, Math.min(100, score));
}

function domainPrepModules(article: TutorialArticle): LearningModule[] {
  const categorySlug = article.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const title = domainTitle(article.category);
  const resources = domainResourceSet(article.category);

  return [
    {
      id: `domain-${categorySlug}`,
      title,
      layer: "domain",
      summary: domainSummary(article.category),
      whyItMatters:
        "The original tutorial will move faster than a beginner course. This prep gives you the vocabulary before you need it.",
      resource: resources[0],
      resources,
      exercise: domainExercise(article.category, article.title),
      selfCheck: `You can explain what a ${article.category.toLowerCase()} project is trying to prove before following the tutorial.`,
      estimatedMinutes: complexCategories.has(article.category) ? 120 : 70
    },
    ...domainDeepDiveModules(article, categorySlug, resources)
  ];
}

function domainDeepDiveModules(
  article: TutorialArticle,
  categorySlug: string,
  resources: ResourceLink[]
): LearningModule[] {
  const category = article.category.toLowerCase();
  const minutes = complexCategories.has(article.category) ? 95 : 55;

  return [
    {
      id: `domain-${categorySlug}-mechanics`,
      title: `Study the core mechanics behind ${category}`,
      layer: "domain",
      summary: `Learn the moving parts, data flow, and failure modes that show up repeatedly in ${category} projects.`,
      whyItMatters:
        "This turns the original tutorial from a wall of instructions into a set of mechanisms you can name, test, and debug.",
      resource: resources[1] ?? resources[0],
      resources: resources.slice(0, 4),
      exercise: `Draw "${article.title}" as boxes and arrows: inputs, internal state, transformations, outputs, and one thing that can go wrong.`,
      selfCheck: `You can point to at least three moving parts in "${article.title}" and explain how data or control moves between them.`,
      estimatedMinutes: minutes
    },
    {
      id: `domain-${categorySlug}-proof`,
      title: `Practice proving progress in a ${category} project`,
      layer: "domain",
      summary:
        "Learn how to create tiny demos, tests, traces, screenshots, or terminal outputs that prove one project behavior at a time.",
      whyItMatters:
        "Beginners get lost when they cannot tell whether a step worked. Proof tasks make each tutorial section measurable.",
      resource: resources[2] ?? resources[0],
      resources: resources.slice(0, 4),
      exercise: `Define three proof tasks for "${article.title}": first run, core behavior, and final demo.`,
      selfCheck: "You can describe the command, input, output, or screen state that proves the next checkpoint is working.",
      estimatedMinutes: Math.max(45, minutes - 20)
    }
  ];
}

function domainTitle(category: string): string {
  if (category === "Uncategorized") return "Map the project domain before coding";
  return `Understand ${category.toLowerCase()} ideas before coding`;
}

function domainSummary(category: string): string {
  const summaries: Record<string, string> = {
    "3D Renderer": "Learn pixels, coordinates, vectors, cameras, rays, and why rendering is mostly repeated math.",
    "AI Model": "Learn data, model parameters, loss, training loops, and the difference between using a model and building one.",
    "Augmented Reality": "Learn tracking, camera input, coordinate spaces, and how virtual objects stay attached to the real world.",
    "BitTorrent Client": "Learn peers, pieces, trackers, sockets, and protocol messages.",
    "Blockchain / Cryptocurrency": "Learn hashes, blocks, signatures, consensus, and why distributed trust is hard.",
    Bot: "Learn APIs, events, tokens, webhooks, and how a bot receives and responds to messages.",
    "Command-Line Tool": "Learn arguments, flags, input/output, exit codes, and how users run command-line software.",
    Database: "Learn persistence, records, indexes, queries, and the difference between storage and search.",
    Docker: "Learn processes, images, containers, isolation, and why reproducible environments matter.",
    "Emulator / Virtual Machine": "Learn instructions, memory, registers, and how software can imitate a machine.",
    "Front-end Framework / Library": "Learn state, rendering, components, events, and why frameworks exist.",
    Game: "Learn loops, input, state, drawing, collisions, and scoring.",
    Git: "Learn snapshots, commits, branches, hashes, and how history is stored.",
    "Memory Allocator": "Learn stack versus heap, allocation, freeing, fragmentation, and memory safety.",
    "Network Stack": "Learn packets, layers, addresses, sockets, and protocols.",
    "Neural Network": "Learn neurons, weights, activations, loss, gradients, and training data.",
    "Operating System": "Learn booting, kernels, memory, processes, interrupts, and hardware boundaries.",
    "Physics Engine": "Learn time steps, forces, velocity, collision, and simulation loops.",
    Processor: "Learn gates, instructions, registers, fetch/decode/execute, and simple CPU organization.",
    "Programming Language": "Learn tokens, parsing, syntax trees, evaluation, and errors.",
    "Regex Engine": "Learn patterns, state machines, matching, backtracking, and edge cases.",
    "Search Engine": "Learn crawling, indexing, tokenization, ranking, and query matching.",
    Shell: "Learn processes, commands, pipes, redirection, and environment variables.",
    "Template Engine": "Learn placeholders, parsing, rendering, escaping, and data binding.",
    "Text Editor": "Learn buffers, cursor movement, keyboard input, rendering, and undo.",
    "Visual Recognition System": "Learn pixels, features, classification, datasets, and evaluation.",
    "Voxel Engine": "Learn voxel grids, chunks, rendering, storage, and world updates.",
    "Web Browser": "Learn HTTP, HTML parsing, CSS layout, rendering, and events.",
    "Web Server": "Learn HTTP requests, responses, routing, sockets, and status codes.",
    Uncategorized: "Learn how to map unknown projects into inputs, outputs, moving parts, and proof of completion."
  };

  return summaries[category] ?? summaries.Uncategorized;
}

function domainResource(category: string): ResourceLink {
  const resources: Record<string, { label: string; url: string; provider: string }> = {
    "Front-end Framework / Library": {
      label: "MDN - Client-side web development",
      url: "https://developer.mozilla.org/en-US/docs/Learn",
      provider: "MDN"
    },
    Game: {
      label: "MDN - Game development",
      url: "https://developer.mozilla.org/en-US/docs/Games",
      provider: "MDN"
    },
    "Web Server": {
      label: "MDN - HTTP",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
      provider: "MDN"
    },
    "Web Browser": {
      label: "MDN - How browsers work",
      url: "https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work",
      provider: "MDN"
    },
    "Command-Line Tool": {
      label: "Microsoft Learn - Command line shells",
      url: "https://learn.microsoft.com/en-us/windows/terminal/",
      provider: "Microsoft Learn"
    },
    Bot: {
      label: "MDN - HTTP messages",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages",
      provider: "MDN"
    },
    Database: {
      label: "CMU Database Group - Intro videos",
      url: "https://15445.courses.cs.cmu.edu/fall2023/",
      provider: "CMU"
    },
    "Neural Network": {
      label: "3Blue1Brown - Neural networks",
      url: "https://www.3blue1brown.com/topics/neural-networks",
      provider: "3Blue1Brown"
    },
    "AI Model": {
      label: "Google Machine Learning Crash Course",
      url: "https://developers.google.com/machine-learning/crash-course",
      provider: "Google"
    },
    "Programming Language": {
      label: "Crafting Interpreters - Introduction",
      url: "https://craftinginterpreters.com/introduction.html",
      provider: "Crafting Interpreters"
    },
    "Operating System": {
      label: "OSTEP - Operating Systems",
      url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
      provider: "OSTEP"
    },
    "Network Stack": {
      label: "Computer Networking: A Top-Down Approach resources",
      url: "https://gaia.cs.umass.edu/kurose_ross/index.php",
      provider: "Kurose and Ross"
    }
  };

  return (
    resources[category] ?? {
      label: "Khan Academy - Computer science",
      url: "https://www.khanacademy.org/computing/computer-science",
      provider: "Khan Academy"
    }
  );
}

function domainResourceSet(category: string): ResourceLink[] {
  const resources: Record<string, ResourceLink[]> = {
    "3D Renderer": [
      learningResource("Scratchapixel", "Rendering an image", "https://www.scratchapixel.com/lessons/3d-basic-rendering/rendering-3d-scene-overview/rendering-an-image.html"),
      learningResource("Scratchapixel", "Ray tracing foundations", "https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-overview.html"),
      learningResource("LearnOpenGL", "Getting started", "https://learnopengl.com/Getting-started/OpenGL")
    ],
    "AI Model": [
      learningResource("Google", "Machine Learning Crash Course", "https://developers.google.com/machine-learning/crash-course"),
      learningResource("fast.ai", "Practical Deep Learning", "https://course.fast.ai/"),
      learningResource("scikit-learn", "User guide", "https://scikit-learn.org/stable/user_guide.html")
    ],
    "Augmented Reality": [
      learningResource("MDN", "WebXR fundamentals", "https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Fundamentals"),
      learningResource("MDN", "WebXR spatial tracking", "https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Spatial_tracking"),
      learningResource("Google", "ARCore concepts", "https://developers.google.com/ar/develop/fundamentals")
    ],
    "BitTorrent Client": [
      learningResource("BitTorrent.org", "BEP 3 - BitTorrent protocol", "https://www.bittorrent.org/beps/bep_0003.html"),
      learningResource("Kurose and Ross", "Computer networking resources", "https://gaia.cs.umass.edu/kurose_ross/index.php"),
      learningResource("Beej", "Guide to Network Programming", "https://beej.us/guide/bgnet/")
    ],
    "Blockchain / Cryptocurrency": [
      learningResource("Bitcoin Developer", "Blockchain overview", "https://developer.bitcoin.org/devguide/block_chain.html"),
      learningResource("MIT OpenCourseWare", "Cryptocurrency Engineering and Design", "https://ocw.mit.edu/courses/mas-s62-cryptocurrency-engineering-and-design-spring-2018/"),
      learningResource("Princeton", "Bitcoin and Cryptocurrency Technologies", "https://bitcoinbook.cs.princeton.edu/")
    ],
    Bot: [
      learningResource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages"),
      learningResource("GitHub Docs", "Webhooks", "https://docs.github.com/en/webhooks"),
      learningResource("Slack", "API basics", "https://api.slack.com/start")
    ],
    "Command-Line Tool": [
      learningResource("MIT", "Missing Semester - Shell", "https://missing.csail.mit.edu/2020/course-shell/"),
      learningResource("Microsoft Learn", "Windows Terminal", "https://learn.microsoft.com/en-us/windows/terminal/"),
      learningResource("Python Docs", "argparse", "https://docs.python.org/3/library/argparse.html")
    ],
    Database: [
      learningResource("CMU", "Database systems course", "https://15445.courses.cs.cmu.edu/fall2023/"),
      learningResource("PostgreSQL", "Tutorial concepts", "https://www.postgresql.org/docs/current/tutorial-concepts.html"),
      learningResource("SQLite", "Architecture", "https://www.sqlite.org/arch.html")
    ],
    Docker: [
      learningResource("Docker Docs", "What is a container?", "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/"),
      learningResource("man7", "Linux namespaces", "https://man7.org/linux/man-pages/man7/namespaces.7.html"),
      learningResource("man7", "Linux cgroups", "https://man7.org/linux/man-pages/man7/cgroups.7.html")
    ],
    "Emulator / Virtual Machine": [
      learningResource("Nand2Tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
      learningResource("RISC-V", "Technical specifications", "https://riscv.org/technical/specifications/"),
      learningResource("Emulator 101", "Emulator basics", "http://www.emulator101.com/")
    ],
    "Front-end Framework / Library": [
      learningResource("React", "Thinking in React", "https://react.dev/learn/thinking-in-react"),
      learningResource("MDN", "Client-side frameworks", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks"),
      learningResource("MDN", "How browsers work", "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work")
    ],
    Game: [
      learningResource("MDN", "Game development", "https://developer.mozilla.org/en-US/docs/Games"),
      learningResource("Nature of Code", "Forces and simulation", "https://natureofcode.com/forces/"),
      learningResource("Game Programming Patterns", "Game loop", "https://gameprogrammingpatterns.com/game-loop.html")
    ],
    Git: [
      learningResource("Pro Git", "Git internals", "https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain"),
      learningResource("GitHub Skills", "Introduction to GitHub", "https://skills.github.com/"),
      learningResource("Pro Git", "Git objects", "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects")
    ],
    "Memory Allocator": [
      learningResource("OSTEP", "Free-space management", "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf"),
      learningResource("Beej", "C dynamic memory", "https://beej.us/guide/bgc/html/split/manual-memory-allocation.html"),
      learningResource("OSTEP", "Virtual memory", "https://pages.cs.wisc.edu/~remzi/OSTEP/")
    ],
    "Network Stack": [
      learningResource("Kurose and Ross", "Computer networking resources", "https://gaia.cs.umass.edu/kurose_ross/index.php"),
      learningResource("Beej", "Guide to Network Programming", "https://beej.us/guide/bgnet/"),
      learningResource("MDN", "HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview")
    ],
    "Neural Network": [
      learningResource("3Blue1Brown", "Neural networks", "https://www.3blue1brown.com/topics/neural-networks"),
      learningResource("Michael Nielsen", "Neural Networks and Deep Learning", "https://neuralnetworksanddeeplearning.com/"),
      learningResource("Google", "Neural networks", "https://developers.google.com/machine-learning/crash-course/neural-networks")
    ],
    "Operating System": [
      learningResource("OSTEP", "Operating systems", "https://pages.cs.wisc.edu/~remzi/OSTEP/"),
      learningResource("OSDev Wiki", "Getting started", "https://wiki.osdev.org/Getting_Started"),
      learningResource("Linux Kernel", "Kernel documentation", "https://docs.kernel.org/")
    ],
    "Physics Engine": [
      learningResource("Nature of Code", "Forces", "https://natureofcode.com/forces/"),
      learningResource("Gaffer on Games", "Fix your timestep", "https://gafferongames.com/post/fix_your_timestep/"),
      learningResource("Khan Academy", "Forces and Newton's laws", "https://www.khanacademy.org/science/physics/forces-newtons-laws")
    ],
    Processor: [
      learningResource("Nand2Tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
      learningResource("RISC-V", "Technical specifications", "https://riscv.org/technical/specifications/"),
      learningResource("Khan Academy", "Logic gates", "https://www.khanacademy.org/computing/computer-science/cryptography/logic-gates")
    ],
    "Programming Language": [
      learningResource("Crafting Interpreters", "Introduction", "https://craftinginterpreters.com/introduction.html"),
      learningResource("Crafting Interpreters", "Scanning", "https://craftinginterpreters.com/scanning.html"),
      learningResource("LLVM", "Kaleidoscope tutorial", "https://llvm.org/docs/tutorial/")
    ],
    "Regex Engine": [
      learningResource("MDN", "Regular expressions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"),
      learningResource("Stanford", "Automata theory course", "https://web.stanford.edu/class/archive/cs/cs103/cs103.1226/"),
      learningResource("JavaScript.info", "Catastrophic backtracking", "https://javascript.info/regexp-catastrophic-backtracking")
    ],
    "Search Engine": [
      learningResource("Stanford", "Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/"),
      learningResource("Elasticsearch", "Search your data", "https://www.elastic.co/guide/en/elasticsearch/reference/current/search-your-data.html"),
      learningResource("PostgreSQL", "Full text search", "https://www.postgresql.org/docs/current/textsearch.html")
    ],
    Shell: [
      learningResource("MIT", "Missing Semester - Shell", "https://missing.csail.mit.edu/2020/course-shell/"),
      learningResource("GNU", "Bash manual", "https://www.gnu.org/software/bash/manual/bash.html"),
      learningResource("OSTEP", "Process API", "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf")
    ],
    "Template Engine": [
      learningResource("Django", "Templates", "https://docs.djangoproject.com/en/stable/topics/templates/"),
      learningResource("OWASP", "Cross Site Scripting Prevention", "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"),
      learningResource("MDN", "Template literals", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals")
    ],
    "Text Editor": [
      learningResource("Kilo", "Build your own text editor", "https://viewsourcecode.org/snaptoken/kilo/"),
      learningResource("GNU Emacs", "Buffers", "https://www.gnu.org/software/emacs/manual/html_node/emacs/Buffers.html"),
      learningResource("GNU Emacs", "Cursor display", "https://www.gnu.org/software/emacs/manual/html_node/emacs/Cursor-Display.html")
    ],
    "Visual Recognition System": [
      learningResource("scikit-image", "Feature detection", "https://scikit-image.org/docs/stable/auto_examples/features_detection/index.html"),
      learningResource("scikit-learn", "Classification", "https://scikit-learn.org/stable/supervised_learning.html"),
      learningResource("Google", "Image classification", "https://developers.google.com/machine-learning/practica/image-classification")
    ],
    "Voxel Engine": [
      learningResource("0fps", "Meshing in a Minecraft game", "https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/"),
      learningResource("LearnOpenGL", "Coordinate systems", "https://learnopengl.com/Getting-started/Coordinate-Systems"),
      learningResource("LearnOpenGL", "Hello triangle", "https://learnopengl.com/Getting-started/Hello-Triangle")
    ],
    "Web Browser": [
      learningResource("Web Browser Engineering", "Build a browser engine", "https://browser.engineering/"),
      learningResource("MDN", "How browsers work", "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work"),
      learningResource("WHATWG", "HTML Living Standard", "https://html.spec.whatwg.org/"),
      learningResource("MDN", "CSS layout", "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout")
    ],
    "Web Server": [
      learningResource("Ruslan Spivak", "Let's Build A Web Server", "https://ruslanspivak.com/lsbaws-part1/"),
      learningResource("MDN", "HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
      learningResource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages"),
      learningResource("Python Docs", "Socket Programming HOWTO", "https://docs.python.org/3/howto/sockets.html"),
      learningResource("Beej", "Guide to Network Programming", "https://beej.us/guide/bgnet/")
    ],
    Uncategorized: [
      learningResource("nand2tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
      learningResource("MIT", "Missing Semester", "https://missing.csail.mit.edu/"),
      learningResource("Software Carpentry", "The Unix Shell", "https://swcarpentry.github.io/shell-novice/"),
      learningResource("GitHub Skills", "Learning paths", "https://skills.github.com/"),
      learningResource("Khan Academy", "Computer science", "https://www.khanacademy.org/computing/computer-science")
    ]
  };

  return uniqueResources([...(resources[category] ?? resources.Uncategorized), domainResource(category)]);
}

function domainExercise(category: string, title: string): string {
  return `Before opening the tutorial, write five plain-language facts about ${category.toLowerCase()} and sketch the smallest possible version of "${title}".`;
}

function conceptModulesFor(article: TutorialArticle): ConceptModule[] {
  return uniqueConcepts([
    ...tutorialSectionConcepts(article),
    ...tutorialTermConcepts(article),
    ...(categoryConcepts[article.category] ?? categoryConcepts.Uncategorized)
  ]).slice(0, 12);
}

function tutorialSectionConcepts(article: TutorialArticle): ConceptModule[] {
  const sections = article.extraction?.sections ?? [];
  const meaningfulSections = sections
    .filter((section) => isUsefulTutorialSignal(section.title))
    .slice(0, 6);

  if (meaningfulSections.length === 0) {
    return [
      {
        id: `${article.id}-concept-project-shape`,
        title: `How this ${article.category.toLowerCase()} project is shaped`,
        plainEnglish: `For "${article.title}", first identify the tutorial's concrete input, output, state, and proof of success. A beginner should not start by copying code; they should know what the smallest working version is supposed to demonstrate.`,
        whyItMatters: `This card is specific to "${article.title}" because every build-your-own tutorial hides a project shape. Once you can name the shape, you can turn confusing instructions into a sequence of small, testable steps.`,
        signsYouUnderstand: [
          `You can describe the smallest useful version of "${article.title}" in one sentence.`,
          `You can point to the data or user action that starts this ${article.category.toLowerCase()} project.`,
          "You can name the proof that tells you the first version works."
        ],
        resources: tutorialConceptResources(article, [])
      }
    ];
  }

  return meaningfulSections.map((section, index) => ({
    id: `${article.id}-concept-section-${section.id}`,
    title: `Tutorial section: ${section.title}`,
    plainEnglish: `In "${article.title}", the "${section.title}" section should become checkpoint ${index + 1}: one focused change that moves the project closer to a working ${article.category.toLowerCase()}. Read it as a job-to-be-done, not as text to copy.`,
    whyItMatters: `This section matters because it is where the tutorial reveals a concrete piece of the implementation. A beginner should connect it to the project state, the expected output, and the exact command or demo that proves it worked.`,
    signsYouUnderstand: [
      `You can explain what "${section.title}" changes in the project without reading the source aloud.`,
      "You can name one file, function, command, or output likely affected by this section.",
      "You can create a tiny test, screenshot, or terminal proof for this checkpoint."
    ],
    resources: tutorialConceptResources(article, section.keyTerms)
  }));
}

function tutorialTermConcepts(article: TutorialArticle): ConceptModule[] {
  const terms = (article.extraction?.keyTerms ?? [])
    .filter((term) => isUsefulTutorialSignal(term))
    .filter((term) => !article.title.toLowerCase().includes(term.toLowerCase()))
    .slice(0, 4);

  return terms.map((term) => ({
    id: `${article.id}-concept-term-${term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: `Key term: ${term}`,
    plainEnglish: `"${term}" appears as a tutorial-specific signal in "${article.title}". Before building, translate it into beginner language: what it receives, what it changes, and how it helps the ${article.category.toLowerCase()} project work.`,
    whyItMatters: `Terms like "${term}" are usually where beginners silently lose the plot. Treating the term as a card forces you to connect vocabulary to the exact implementation step and prevents shallow copy-paste progress.`,
    signsYouUnderstand: [
      `You can define "${term}" using an example from "${article.title}".`,
      `You can identify whether "${term}" is a tool, data structure, protocol, algorithm, or project behavior.`,
      `You can name one bug or misunderstanding that would happen if "${term}" were used incorrectly.`
    ],
    resources: tutorialConceptResources(article, [term])
  }));
}

function uniqueConcepts(concepts: ConceptModule[]): ConceptModule[] {
  const seen = new Set<string>();

  return concepts.filter((concept) => {
    const key = concept.title.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function isUsefulTutorialSignal(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return (
    normalized.length >= 4 &&
    normalized.length <= 90 &&
    !/^(introduction|overview|summary|conclusion|table of contents|contents|license|readme|part|chapter)$/i.test(normalized)
  );
}

function milestonePlan(article: TutorialArticle, difficulty: DifficultyLevel): Milestone[] {
  const base: Milestone[] = [
    {
      id: `${article.id}-setup`,
      title: "Set up the workspace",
      description:
        "Install the project language/tooling, create a repo, add a README, and run the smallest hello-world program.",
      proof: "A GitHub commit shows the initial project folder and a program that runs."
    },
    {
      id: `${article.id}-read`,
      title: "Translate the tutorial into your own checklist",
      description:
        "Read the first section of the original article and rewrite its steps as beginner-sized tasks.",
      proof: "Your notes include unknown words, setup commands, and the first feature target."
    },
    {
      id: `${article.id}-first-feature`,
      title: "Build the first visible behavior",
      description:
        "Implement the smallest behavior that proves the project is alive, even if it is incomplete.",
      proof: "A screenshot, terminal output, or test result demonstrates the first behavior."
    },
    {
      id: `${article.id}-core-loop`,
      title: "Complete the core loop",
      description:
        "Build the main input-process-output cycle that makes this project category work.",
      proof: "You can demo the project doing its central job with simple input."
    },
    {
      id: `${article.id}-polish`,
      title: "Make it portfolio-readable",
      description:
        "Add usage instructions, example output, known limitations, and what you learned.",
      proof: "The README explains why the project matters and how someone else can run it."
    }
  ];

  if (difficulty === "advanced" || difficulty === "expert") {
    base.splice(2, 0, {
      id: `${article.id}-mini-version`,
      title: "Build a toy version first",
      description:
        "Before following the full article, make a deliberately tiny version with fake or simplified data.",
      proof: "A commit demonstrates a toy version and explains which shortcuts it takes."
    });
  }

  return base;
}

function warningMessages(article: TutorialArticle, difficulty: DifficultyLevel): string[] {
  const warnings: string[] = [];

  if (difficulty === "advanced") {
    warnings.push("This is an advanced beginner path: expect a longer prerequisite ladder and slower progress.");
  }

  if (difficulty === "expert") {
    warnings.push("This is an expert-level project for a true beginner. Build the toy version before attempting the article.");
  }

  if (article.isVideo) {
    warnings.push("Video tutorials are harder to skim. Pause often and convert each section into written steps.");
  }

  if (article.health.status === "dead") {
    warnings.push("The original link appears dead. Use the path to learn the concepts, then look for a mirror or replacement tutorial.");
  }

  if (article.health.status === "unknown") {
    warnings.push("The link has not been verified yet. Run the catalog sync to check it before committing to this path.");
  }

  return warnings;
}

function estimateWeeks(prerequisites: LearningModule[], difficulty: DifficultyLevel): number {
  const minutes = prerequisites.reduce((total, module) => total + module.estimatedMinutes, 0);
  const projectWeeks: Record<DifficultyLevel, number> = {
    starter: 1,
    guided: 2,
    advanced: 4,
    expert: 7
  };

  return Math.max(1, Math.ceil(minutes / 300) + projectWeeks[difficulty]);
}

function cvFraming(article: TutorialArticle): string {
  return `Frame this as "${article.title}" built from first principles. In the README, explain the problem, the core concepts you learned, the tradeoffs in your implementation, and one improvement you would make next.`;
}

function nextSteps(article: TutorialArticle): string[] {
  return [
    "Add tests or demo examples that prove the main behavior works.",
    "Write a short architecture note explaining the moving parts in beginner language.",
    `Compare your result with one production tool in the ${article.category.toLowerCase()} space and list what is missing.`,
    "Ask for feedback on the README and the smallest demo before adding more features."
  ];
}

function uniqueModules(modules: LearningModule[]): LearningModule[] {
  const seen = new Set<string>();
  return modules.filter((module) => {
    if (seen.has(module.id)) return false;
    seen.add(module.id);
    return true;
  });
}

function tutorialConceptResources(article: TutorialArticle, signals: string[]): ResourceLink[] {
  const normalizedLanguage = normalizeLanguage(article.languages[0] ?? "any");
  const languageResource = languageModules[normalizedLanguage]?.resource ?? fallbackLanguageModule.resource;
  const signalResources = signals.flatMap(termResources);

  return uniqueResources([
    ...signalResources,
    ...domainResourceSet(article.category),
    languageResource,
    {
      label: "GitHub Skills - Learning paths",
      url: "https://skills.github.com/",
      provider: "GitHub Skills"
    }
  ]).slice(0, 3);
}

function conceptResources(id: string): ResourceLink[] {
  const resources: Record<string, ResourceLink[]> = {
    "rays-and-pixels": [
      learningResource("Scratchapixel", "Rendering an image", "https://www.scratchapixel.com/lessons/3d-basic-rendering/rendering-3d-scene-overview/rendering-an-image.html"),
      learningResource("Scratchapixel", "Ray tracing foundations", "https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-overview.html")
    ],
    vectors: [
      learningResource("Khan Academy", "Vectors", "https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces"),
      learningResource("Scratchapixel", "Geometry and vectors", "https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry.html")
    ],
    "training-data": [
      learningResource("Google", "Machine Learning Crash Course", "https://developers.google.com/machine-learning/crash-course"),
      learningResource("scikit-learn", "Dataset loading utilities", "https://scikit-learn.org/stable/datasets.html")
    ],
    loss: [
      learningResource("Google", "Loss reduction", "https://developers.google.com/machine-learning/crash-course/reducing-loss"),
      learningResource("3Blue1Brown", "Neural networks", "https://www.3blue1brown.com/topics/neural-networks")
    ],
    tracking: [
      learningResource("MDN", "WebXR fundamentals", "https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Fundamentals"),
      learningResource("MDN", "WebXR spatial tracking", "https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Spatial_tracking")
    ],
    "coordinate-spaces": [
      learningResource("MDN", "WebXR spatial tracking", "https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Spatial_tracking"),
      learningResource("Khan Academy", "Coordinate plane", "https://www.khanacademy.org/math/geometry/hs-geo-foundations/hs-geo-coordinate-plane")
    ],
    peers: [
      learningResource("BitTorrent.org", "BEP 3 - BitTorrent protocol", "https://www.bittorrent.org/beps/bep_0003.html"),
      learningResource("MDN", "Client-server overview", "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview")
    ],
    protocols: [
      learningResource("MDN", "HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
      learningResource("BitTorrent.org", "BEP 3 - BitTorrent protocol", "https://www.bittorrent.org/beps/bep_0003.html")
    ],
    hashing: [
      learningResource("NIST", "Secure Hash Standard", "https://csrc.nist.gov/pubs/fips/180-4/upd1/final"),
      learningResource("Git", "Git objects", "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects")
    ],
    consensus: [
      learningResource("Bitcoin Developer", "Blockchain overview", "https://developer.bitcoin.org/devguide/block_chain.html"),
      learningResource("MIT OpenCourseWare", "Cryptocurrency Engineering and Design", "https://ocw.mit.edu/courses/mas-s62-cryptocurrency-engineering-and-design-spring-2018/")
    ],
    events: [
      learningResource("MDN", "Introduction to events", "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events"),
      learningResource("Node.js", "Events API", "https://nodejs.org/api/events.html")
    ],
    apis: [
      learningResource("MDN", "Web APIs", "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction"),
      learningResource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages")
    ],
    arguments: [
      learningResource("GNU", "Bash shell parameters", "https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html"),
      learningResource("Python Docs", "argparse", "https://docs.python.org/3/library/argparse.html")
    ],
    "exit-codes": [
      learningResource("GNU", "Bash exit status", "https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html"),
      learningResource("Node.js", "Process exit codes", "https://nodejs.org/api/process.html#exit-codes")
    ],
    persistence: [
      learningResource("CMU", "Database systems course", "https://15445.courses.cs.cmu.edu/fall2023/"),
      learningResource("PostgreSQL", "Database concepts", "https://www.postgresql.org/docs/current/tutorial-concepts.html")
    ],
    indexes: [
      learningResource("PostgreSQL", "Indexes", "https://www.postgresql.org/docs/current/indexes.html"),
      learningResource("Stanford", "Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/")
    ],
    isolation: [
      learningResource("Docker Docs", "What is a container?", "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/"),
      learningResource("man7", "Linux namespaces", "https://man7.org/linux/man-pages/man7/namespaces.7.html")
    ],
    namespaces: [
      learningResource("man7", "Linux namespaces", "https://man7.org/linux/man-pages/man7/namespaces.7.html"),
      learningResource("Docker Docs", "Containers", "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/")
    ],
    "instruction-set": [
      learningResource("Nand2Tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
      learningResource("RISC-V", "Technical specifications", "https://riscv.org/technical/specifications/")
    ],
    "state-machine": [
      learningResource("Nand2Tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
      learningResource("MDN", "State machine glossary", "https://developer.mozilla.org/en-US/docs/Glossary/State_machine")
    ],
    "state-ui": [
      learningResource("React", "Thinking in React", "https://react.dev/learn/thinking-in-react"),
      learningResource("MDN", "Client-side frameworks", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks")
    ],
    rendering: [
      learningResource("MDN", "How browsers work", "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work"),
      learningResource("React", "Render and commit", "https://react.dev/learn/render-and-commit")
    ],
    "game-loop": [
      learningResource("MDN", "Anatomy of a video game", "https://developer.mozilla.org/en-US/docs/Games/Anatomy"),
      learningResource("MDN", "Game development", "https://developer.mozilla.org/en-US/docs/Games")
    ],
    collision: [
      learningResource("MDN", "2D collision detection", "https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection"),
      learningResource("Nature of Code", "Physics libraries", "https://natureofcode.com/")
    ],
    snapshots: [
      learningResource("Pro Git", "Git internals", "https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain"),
      learningResource("Pro Git", "Git objects", "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects")
    ],
    "content-addressing": [
      learningResource("Pro Git", "Git objects", "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects"),
      learningResource("IPFS Docs", "Content addressing", "https://docs.ipfs.tech/concepts/content-addressing/")
    ],
    heap: [
      learningResource("OSTEP", "Virtualization and memory", "https://pages.cs.wisc.edu/~remzi/OSTEP/"),
      learningResource("Beej", "C dynamic memory", "https://beej.us/guide/bgc/html/split/manual-memory-allocation.html")
    ],
    fragmentation: [
      learningResource("OSTEP", "Free-space management", "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf"),
      learningResource("Beej", "C dynamic memory", "https://beej.us/guide/bgc/html/split/manual-memory-allocation.html")
    ],
    packets: [
      learningResource("Kurose and Ross", "Computer networking resources", "https://gaia.cs.umass.edu/kurose_ross/index.php"),
      learningResource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages")
    ],
    layers: [
      learningResource("Kurose and Ross", "Computer networking resources", "https://gaia.cs.umass.edu/kurose_ross/index.php"),
      learningResource("Cloudflare Learning", "OSI model", "https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/")
    ],
    neurons: [
      learningResource("3Blue1Brown", "Neural networks", "https://www.3blue1brown.com/topics/neural-networks"),
      learningResource("Google", "Neural networks", "https://developers.google.com/machine-learning/crash-course/neural-networks")
    ],
    "gradient-descent": [
      learningResource("Google", "Gradient descent", "https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent"),
      learningResource("3Blue1Brown", "Gradient descent", "https://www.3blue1brown.com/lessons/gradient-descent")
    ],
    kernel: [
      learningResource("OSTEP", "Operating systems", "https://pages.cs.wisc.edu/~remzi/OSTEP/"),
      learningResource("Linux Kernel", "Kernel documentation", "https://docs.kernel.org/")
    ],
    boot: [
      learningResource("OSDev Wiki", "Boot sequence", "https://wiki.osdev.org/Boot_Sequence"),
      learningResource("OSTEP", "Operating systems", "https://pages.cs.wisc.edu/~remzi/OSTEP/")
    ],
    simulation: [
      learningResource("Nature of Code", "Forces", "https://natureofcode.com/forces/"),
      learningResource("Khan Academy", "Physics", "https://www.khanacademy.org/science/physics")
    ],
    forces: [
      learningResource("Nature of Code", "Forces", "https://natureofcode.com/forces/"),
      learningResource("Khan Academy", "Forces and Newton's laws", "https://www.khanacademy.org/science/physics/forces-newtons-laws")
    ],
    "cpu-pipeline": [
      learningResource("Nand2Tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
      learningResource("RISC-V", "Technical specifications", "https://riscv.org/technical/specifications/")
    ],
    "logic-gates": [
      learningResource("Nand2Tetris", "Boolean logic", "https://www.nand2tetris.org/"),
      learningResource("Khan Academy", "Logic gates", "https://www.khanacademy.org/computing/computer-science/cryptography/logic-gates")
    ],
    parsing: [
      learningResource("Crafting Interpreters", "Scanning", "https://craftinginterpreters.com/scanning.html"),
      learningResource("Crafting Interpreters", "Representing code", "https://craftinginterpreters.com/representing-code.html")
    ],
    evaluation: [
      learningResource("Crafting Interpreters", "Evaluating expressions", "https://craftinginterpreters.com/evaluating-expressions.html"),
      learningResource("Crafting Interpreters", "A tree-walk interpreter", "https://craftinginterpreters.com/a-tree-walk-interpreter.html")
    ],
    automata: [
      learningResource("Stanford", "Automata theory course", "https://web.stanford.edu/class/archive/cs/cs103/cs103.1226/"),
      learningResource("MDN", "Regular expressions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions")
    ],
    backtracking: [
      learningResource("MDN", "Regular expressions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"),
      learningResource("JavaScript.info", "Backtracking in regexps", "https://javascript.info/regexp-catastrophic-backtracking")
    ],
    indexing: [
      learningResource("Stanford", "Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/"),
      learningResource("PostgreSQL", "Indexes", "https://www.postgresql.org/docs/current/indexes.html")
    ],
    ranking: [
      learningResource("Stanford", "Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/"),
      learningResource("Google", "Machine Learning Crash Course", "https://developers.google.com/machine-learning/crash-course")
    ],
    processes: [
      learningResource("OSTEP", "Process API", "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf"),
      learningResource("Node.js", "Child process", "https://nodejs.org/api/child_process.html")
    ],
    pipes: [
      learningResource("GNU", "Bash pipelines", "https://www.gnu.org/software/bash/manual/html_node/Pipelines.html"),
      learningResource("OSTEP", "Process API", "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf")
    ],
    templates: [
      learningResource("MDN", "Template literals", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals"),
      learningResource("Django", "Templates", "https://docs.djangoproject.com/en/stable/topics/templates/")
    ],
    escaping: [
      learningResource("OWASP", "Cross Site Scripting Prevention", "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"),
      learningResource("MDN", "HTML entities glossary", "https://developer.mozilla.org/en-US/docs/Glossary/Entity")
    ],
    buffer: [
      learningResource("GNU Emacs", "Buffers", "https://www.gnu.org/software/emacs/manual/html_node/emacs/Buffers.html"),
      learningResource("Kilo", "Build your own text editor", "https://viewsourcecode.org/snaptoken/kilo/")
    ],
    cursor: [
      learningResource("GNU Emacs", "Cursor display", "https://www.gnu.org/software/emacs/manual/html_node/emacs/Cursor-Display.html"),
      learningResource("Kilo", "Build your own text editor", "https://viewsourcecode.org/snaptoken/kilo/")
    ],
    features: [
      learningResource("scikit-image", "Feature detection", "https://scikit-image.org/docs/stable/auto_examples/features_detection/index.html"),
      learningResource("scikit-learn", "Feature extraction", "https://scikit-learn.org/stable/modules/feature_extraction.html")
    ],
    classification: [
      learningResource("scikit-learn", "Classification", "https://scikit-learn.org/stable/supervised_learning.html"),
      learningResource("Google", "Classification", "https://developers.google.com/machine-learning/crash-course/classification")
    ],
    voxels: [
      learningResource("0fps", "Meshing in a Minecraft game", "https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/"),
      learningResource("LearnOpenGL", "Coordinate systems", "https://learnopengl.com/Getting-started/Coordinate-Systems")
    ],
    chunks: [
      learningResource("0fps", "Meshing in a Minecraft game", "https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/"),
      learningResource("LearnOpenGL", "Hello triangle", "https://learnopengl.com/Getting-started/Hello-Triangle")
    ],
    "html-css-layout": [
      learningResource("Web Browser Engineering", "Build a browser engine", "https://browser.engineering/"),
      learningResource("MDN", "How browsers work", "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work"),
      learningResource("MDN", "CSS layout", "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout")
    ],
    "event-loop-browser": [
      learningResource("MDN", "Event loop", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop"),
      learningResource("MDN", "How browsers work", "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work")
    ],
    "parsing-vs-layout": [
      learningResource("Web Browser Engineering", "Build a browser engine", "https://browser.engineering/"),
      learningResource("MDN", "Document Object Model", "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction"),
      learningResource("MDN", "CSS layout", "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout")
    ],
    "browser-engine-scope": [
      learningResource("Web Browser Engineering", "Build a browser engine", "https://browser.engineering/"),
      learningResource("MDN", "Client-server overview", "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview"),
      learningResource("MDN", "How browsers work", "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work")
    ],
    http: [
      learningResource("MDN", "HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
      learningResource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages")
    ],
    routing: [
      learningResource("MDN", "Server-side first steps", "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps"),
      learningResource("Express", "Routing", "https://expressjs.com/en/guide/routing.html")
    ],
    "request-response-anatomy": [
      learningResource("Ruslan Spivak", "Let's Build A Web Server", "https://ruslanspivak.com/lsbaws-part1/"),
      learningResource("MDN", "HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
      learningResource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages")
    ],
    "server-application-boundary": [
      learningResource("Ruslan Spivak", "Let's Build A Web Server", "https://ruslanspivak.com/lsbaws-part1/"),
      learningResource("Python Docs", "Socket Programming HOWTO", "https://docs.python.org/3/howto/sockets.html"),
      learningResource("MDN", "Client-server overview", "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview")
    ],
    "problem-decomposition": [
      learningResource("MIT", "Missing Semester", "https://missing.csail.mit.edu/"),
      learningResource("GitHub Skills", "Learning paths", "https://skills.github.com/")
    ],
    interfaces: [
      learningResource("MDN", "API glossary", "https://developer.mozilla.org/en-US/docs/Glossary/API"),
      learningResource("TypeScript", "Object types", "https://www.typescriptlang.org/docs/handbook/2/objects.html")
    ],
    "abstraction-ladder": [
      learningResource("nand2tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
      learningResource("MIT", "Missing Semester", "https://missing.csail.mit.edu/"),
      learningResource("Software Carpentry", "The Unix Shell", "https://swcarpentry.github.io/shell-novice/")
    ],
    "hardware-software-co-design": [
      learningResource("nand2tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
      learningResource("Nand2Tetris", "The Elements of Computing Systems", "https://www.nand2tetris.org/book"),
      learningResource("RISC-V", "Technical specifications", "https://riscv.org/technical/specifications/")
    ]
  };

  return resources[id] ?? [
    learningResource("Khan Academy", "Computer science", "https://www.khanacademy.org/computing/computer-science"),
    learningResource("GitHub Skills", "Learning paths", "https://skills.github.com/")
  ];
}

function termResources(term: string): ResourceLink[] {
  const normalized = term.toLowerCase();

  if (/http|request|response|header|route/.test(normalized)) return conceptResources("http");
  if (/socket|tcp|udp|packet|network|peer/.test(normalized)) return conceptResources("packets");
  if (/parse|parser|token|ast|syntax/.test(normalized)) return conceptResources("parsing");
  if (/regex|regexp|regular expression/.test(normalized)) return conceptResources("automata");
  if (/hash|digest|sha/.test(normalized)) return conceptResources("hashing");
  if (/database|index|query|sql|record/.test(normalized)) return conceptResources("indexes");
  if (/container|docker|namespace|isolation/.test(normalized)) return conceptResources("isolation");
  if (/process|pipe|shell|terminal|command/.test(normalized)) return conceptResources("processes");
  if (/memory|heap|malloc|pointer|alloc/.test(normalized)) return conceptResources("heap");
  if (/loss|gradient|neural|model|training|classification/.test(normalized)) return conceptResources("training-data");
  if (/render|pixel|vector|shader|canvas|webgl/.test(normalized)) return conceptResources("rays-and-pixels");
  if (/event|async|promise|callback/.test(normalized)) return conceptResources("events");
  if (/git|commit|branch|snapshot/.test(normalized)) return conceptResources("snapshots");

  return [];
}

function learningResource(provider: string, label: string, url: string): ResourceLink {
  return { provider, label, url };
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

function concept(
  id: string,
  title: string,
  plainEnglish: string,
  whyItMatters: string
): ConceptModule {
  return {
    id,
    title,
    plainEnglish: `${plainEnglish} In practice, look for the input it receives, the state it changes, and the output or behavior it should make easier to explain.`,
    whyItMatters: `${whyItMatters} A beginner should be able to connect it to one concrete implementation choice before moving to the next tutorial step.`,
    signsYouUnderstand: [
      `You can explain ${title.toLowerCase()} without copying a definition.`,
      "You can point to the file, function, command, or behavior where it appears.",
      "You can name one mistake a beginner might make with it and how you would detect that mistake."
    ],
    resources: conceptResources(id)
  };
}
