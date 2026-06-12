import { curationStandardVersion } from "./curationStandard";
import type {
  BuildCheckpoint,
  ConceptModule,
  CurationRecord,
  LearningModule,
  ProjectPath,
  ResourceLink,
  ResourceSourceAudit,
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
  preserveGeneratedGuide?: boolean;
  prerequisiteResources?: ResourceLink[];
  prerequisiteResourceStrategy?:
    | "github-app"
    | "soft-engine"
    | "opencv-ar"
    | "archaeology-db"
    | "modern-php"
    | "discord-bot"
    | "nand2tetris"
    | "node-web-server";
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

const nodeWebServerResources = [
  resource("Build Your Own Web Server", "Book overview", "https://build-your-own.org/webserver/"),
  resource("Build Your Own Web Server", "01. Introduction", "https://build-your-own.org/webserver/01_intro"),
  resource("Build Your Own Web Server", "02. HTTP Overview", "https://build-your-own.org/webserver/02_http_intro"),
  resource("Build Your Own Web Server", "03. Code A TCP Server", "https://build-your-own.org/webserver/03_tcp_server"),
  resource("Build Your Own Web Server", "04. Promises and Events", "https://build-your-own.org/webserver/04_promise"),
  resource("Build Your Own Web Server", "05. A Simple Network Protocol", "https://build-your-own.org/webserver/05_proto"),
  resource("Build Your Own Web Server", "06. HTTP Semantics and Syntax", "https://build-your-own.org/webserver/06_http_proto"),
  resource("Build Your Own Web Server", "07. Code A Basic HTTP Server", "https://build-your-own.org/webserver/07_http_server"),
  resource("Node.js", "Net module", "https://nodejs.org/api/net.html"),
  resource("Node.js", "Buffer", "https://nodejs.org/api/buffer.html"),
  resource("Node.js", "The Node.js Event Loop", "https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick"),
  resource("Node.js", "Stream", "https://nodejs.org/api/stream.html"),
  resource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages"),
  resource("MDN", "Client-server overview", "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview"),
  resource("RFC Editor", "RFC 9112: HTTP/1.1", "https://www.rfc-editor.org/rfc/rfc9112.html"),
  resource("RFC Editor", "RFC 9110: HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html"),
  resource("High Performance Browser Networking", "Building Blocks of TCP", "https://hpbn.co/building-blocks-of-tcp/")
];

const nandResources = [
  resource("nand2tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
  resource("nand2tetris", "Projects", "https://www.nand2tetris.org/course"),
  resource("nand2tetris", "Software tools", "https://www.nand2tetris.org/software"),
  resource("nand2tetris", "License and solution-sharing guidance", "https://www.nand2tetris.org/license"),
  resource("nand2tetris", "Project 1: Boolean Logic", "https://www.nand2tetris.org/project01"),
  resource("nand2tetris", "Project 2: Boolean Arithmetic", "https://www.nand2tetris.org/project02"),
  resource("nand2tetris", "Project 3: Memory", "https://www.nand2tetris.org/project03"),
  resource("nand2tetris", "Project 4: Machine Language Programming", "https://www.nand2tetris.org/project04"),
  resource("nand2tetris", "Project 5: Computer Architecture", "https://www.nand2tetris.org/project05"),
  resource("nand2tetris", "Project 6: The Assembler", "https://www.nand2tetris.org/project06"),
  resource("nand2tetris", "Project 7: Virtual Machine I", "https://www.nand2tetris.org/project07"),
  resource("nand2tetris", "Project 8: Virtual Machine II", "https://www.nand2tetris.org/project08"),
  resource("nand2tetris", "Project 9: High-Level Programming", "https://www.nand2tetris.org/project09"),
  resource("nand2tetris", "Project 10: Syntax Analysis", "https://www.nand2tetris.org/project10"),
  resource("nand2tetris", "Project 11: Code Generation", "https://www.nand2tetris.org/project11"),
  resource("nand2tetris", "Project 12: Operating System", "https://www.nand2tetris.org/project12"),
  resource("Software Carpentry", "The Unix Shell", "https://swcarpentry.github.io/shell-novice/"),
  resource("MIT Missing Semester", "Course shell", "https://missing.csail.mit.edu/2020/course-shell/"),
  resource("MIT OpenCourseWare", "Computation Structures", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/"),
  resource("MIT OpenCourseWare", "The Digital Abstraction", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/"),
  resource("MIT OpenCourseWare", "Combinational Logic", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c4/"),
  resource("MIT OpenCourseWare", "Sequential Logic", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c5/"),
  resource("MIT OpenCourseWare", "Designing an Instruction Set", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c9/"),
  resource("MIT OpenCourseWare", "Assembly Language and Models of Computation", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c10/"),
  resource("MIT OpenCourseWare", "Compilers", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c11/"),
  resource("MIT OpenCourseWare", "Procedures and Stacks", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c12/"),
  resource("MIT OpenCourseWare", "Building the Beta", "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c13/"),
  resource("Crafting Interpreters", "Scanning", "https://craftinginterpreters.com/scanning.html"),
  resource("Crafting Interpreters", "A Virtual Machine", "https://craftinginterpreters.com/a-virtual-machine.html"),
  resource("Crafting Interpreters", "Compiling Expressions", "https://craftinginterpreters.com/compiling-expressions.html"),
  resource("OSTEP", "Operating Systems: Three Easy Pieces", "https://pages.cs.wisc.edu/~remzi/OSTEP/")
];

const regexResources = [
  resource("Russ Cox", "Regular Expression Matching Can Be Simple And Fast", "https://swtch.com/~rsc/regexp/regexp1.html"),
  resource("Russ Cox", "Regular Expression Matching: Virtual Machine Approach", "https://swtch.com/~rsc/regexp/regexp2.html"),
  resource("MDN", "Regular expressions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"),
  resource("Stanford", "Automata theory", "https://web.stanford.edu/class/archive/cs/cs103/cs103.1226/")
];

const redisResources = [
  resource("Redis Docs", "RESP protocol specification", "https://redis.io/docs/latest/develop/reference/protocol-spec/"),
  resource("Redis Docs", "Command reference", "https://redis.io/docs/latest/commands/"),
  resource("Beej", "Guide to Network Programming", "https://beej.us/guide/bgnet/"),
  resource("Crafting Interpreters", "Scanning", "https://craftinginterpreters.com/scanning.html")
];

const emulatorResources = [
  resource("CHIP-8 Reference", "Technical reference", "https://github-wiki-see.page/m/mattmikolay/chip-8/wiki/CHIP%E2%80%908-Technical-Reference"),
  resource("Emulator 101", "Emulator basics", "https://www.emulator101.com/"),
  resource("Octo", "CHIP-8 IDE and tools", "https://johnearnest.github.io/Octo/"),
  resource("MDN", "Canvas tutorial", "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial")
];

const staticSiteResources = [
  resource("Node.js", "File system", "https://nodejs.org/api/fs.html"),
  resource("Node.js", "Path", "https://nodejs.org/api/path.html"),
  resource("MDN", "HTML basics", "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics"),
  resource("Eleventy", "Documentation", "https://www.11ty.dev/docs/")
];

const searchTextResources = [
  resource("Peter Norvig", "How to Write a Spelling Corrector", "https://norvig.com/spell-correct.html"),
  resource("Stanford IR", "Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/"),
  resource("scikit-learn", "Feature extraction", "https://scikit-learn.org/stable/modules/feature_extraction.html"),
  resource("Python Docs", "difflib", "https://docs.python.org/3/library/difflib.html")
];

const testingResources = [
  resource("Node.js", "Assert", "https://nodejs.org/api/assert.html"),
  resource("Vitest", "Guide", "https://vitest.dev/guide/"),
  resource("Jest", "Getting started", "https://jestjs.io/docs/getting-started"),
  resource("GitHub Docs", "Building and testing Node.js", "https://docs.github.com/actions/guides/building-and-testing-nodejs")
];

const distributedResources = [
  resource("Apache Kafka", "Design", "https://kafka.apache.org/documentation/#design"),
  resource("Apache Kafka", "Introduction", "https://kafka.apache.org/intro"),
  resource("MIT", "Distributed Systems", "https://pdos.csail.mit.edu/6.824/"),
  resource("The Secret Lives of Data", "Raft consensus", "https://thesecretlivesofdata.com/raft/")
];

const raycastingResources = [
  resource("Lode Vandevenne", "Raycasting tutorial", "https://lodev.org/cgtutor/raycasting.html"),
  resource("Scratchapixel", "Rendering an image", "https://www.scratchapixel.com/lessons/3d-basic-rendering/rendering-3d-scene-overview/rendering-an-image.html"),
  resource("Khan Academy", "Trigonometry", "https://www.khanacademy.org/math/trigonometry"),
  resource("LearnOpenGL", "Coordinate systems", "https://learnopengl.com/Getting-started/Coordinate-Systems")
];

const neuralResources = [
  resource("Michael Nielsen", "Neural Networks and Deep Learning", "https://neuralnetworksanddeeplearning.com/"),
  resource("3Blue1Brown", "Neural networks", "https://www.3blue1brown.com/topics/neural-networks"),
  resource("Google", "Machine Learning Crash Course", "https://developers.google.com/machine-learning/crash-course"),
  resource("fast.ai", "Practical Deep Learning", "https://course.fast.ai/")
];

const classicalMlResources = [
  resource("scikit-learn", "Supervised learning", "https://scikit-learn.org/stable/supervised_learning.html"),
  resource("Google", "Machine Learning Crash Course", "https://developers.google.com/machine-learning/crash-course"),
  resource("scikit-learn", "Model evaluation", "https://scikit-learn.org/stable/modules/model_evaluation.html"),
  resource("Kaggle", "Intro to Machine Learning", "https://www.kaggle.com/learn/intro-to-machine-learning")
];

const databaseResources = [
  resource("SQLite", "Architecture", "https://www.sqlite.org/arch.html"),
  resource("PostgreSQL", "Indexes", "https://www.postgresql.org/docs/current/indexes.html"),
  resource("CMU", "Database systems", "https://15445.courses.cs.cmu.edu/fall2023/"),
  resource("Stanford IR", "Introduction to Information Retrieval", "https://nlp.stanford.edu/IR-book/")
];

const blockchainResources = [
  resource("Bitcoin Developer", "Blockchain overview", "https://developer.bitcoin.org/devguide/block_chain.html"),
  resource("MIT OpenCourseWare", "Cryptocurrency Engineering and Design", "https://ocw.mit.edu/courses/mas-s62-cryptocurrency-engineering-and-design-spring-2018/"),
  resource("Princeton", "Bitcoin and Cryptocurrency Technologies", "https://bitcoinbook.cs.princeton.edu/"),
  resource("NIST", "Secure Hash Standard", "https://csrc.nist.gov/pubs/fips/180-4/upd1/final")
];

const compilerResources = [
  resource("Crafting Interpreters", "Scanning", "https://craftinginterpreters.com/scanning.html"),
  resource("Crafting Interpreters", "Parsing expressions", "https://craftinginterpreters.com/parsing-expressions.html"),
  resource("LLVM", "Kaleidoscope tutorial", "https://llvm.org/docs/tutorial/"),
  resource("WebAssembly", "Core specification", "https://webassembly.github.io/spec/core/")
];

const shellResources = [
  resource("POSIX", "Shell command language", "https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html"),
  resource("GNU", "Bash manual", "https://www.gnu.org/software/bash/manual/bash.html"),
  resource("OSTEP", "Process API", "https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf"),
  resource("man7", "pipe(2)", "https://man7.org/linux/man-pages/man2/pipe.2.html")
];

const osKernelResources = [
  resource("OSDev Wiki", "Bare Bones", "https://wiki.osdev.org/Bare_Bones"),
  resource("OSDev Wiki", "Bootloader", "https://wiki.osdev.org/Bootloader"),
  resource("OSTEP", "Operating systems", "https://pages.cs.wisc.edu/~remzi/OSTEP/"),
  resource("Linux Kernel", "Kernel documentation", "https://docs.kernel.org/")
];

const gitResources = [
  resource("Pro Git", "Git internals", "https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain"),
  resource("Pro Git", "Git objects", "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects"),
  resource("Pro Git", "Packfiles", "https://git-scm.com/book/en/v2/Git-Internals-Packfiles"),
  resource("GitHub Skills", "Introduction to GitHub", "https://skills.github.com/")
];

const dotfileResources = [
  resource("GNU Stow", "Manual", "https://www.gnu.org/software/stow/manual/stow.html"),
  resource("GNU Coreutils", "ln invocation", "https://www.gnu.org/software/coreutils/manual/html_node/ln-invocation.html"),
  resource("XDG", "Base directory specification", "https://specifications.freedesktop.org/basedir-spec/latest/"),
  resource("Pro Git", "Getting started", "https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control")
];

const parserDataResources = [
  resource("IETF", "RFC 8259 JSON", "https://datatracker.ietf.org/doc/rfc8259/"),
  resource("MDN", "JSON", "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON"),
  resource("Python Docs", "configparser", "https://docs.python.org/3/library/configparser.html"),
  resource("Crafting Interpreters", "Scanning", "https://craftinginterpreters.com/scanning.html")
];

const dnsResources = [
  resource("IETF", "RFC 1035 DNS", "https://datatracker.ietf.org/doc/html/rfc1035"),
  resource("Cloudflare", "What is DNS?", "https://www.cloudflare.com/learning/dns/what-is-dns/"),
  resource("Node.js", "dgram", "https://nodejs.org/api/dgram.html"),
  resource("MDN", "DNS glossary", "https://developer.mozilla.org/en-US/docs/Glossary/DNS")
];

const loadBalancerResources = [
  resource("NGINX", "HTTP load balancing", "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/"),
  resource("HAProxy", "Configuration tutorial", "https://www.haproxy.com/documentation/haproxy-configuration-tutorials/"),
  resource("Cloudflare", "Load balancing", "https://www.cloudflare.com/learning/performance/what-is-load-balancing/"),
  resource("Kurose and Ross", "Computer networking resources", "https://gaia.cs.umass.edu/kurose_ross/index.php")
];

const debuggerResources = [
  resource("man7", "ptrace(2)", "https://man7.org/linux/man-pages/man2/ptrace.2.html"),
  resource("GDB", "Documentation", "https://www.gnu.org/software/gdb/documentation/"),
  resource("man7", "gdb(1)", "https://man7.org/linux/man-pages/man1/gdb.1.html"),
  resource("Linux Kernel", "Yama ptrace scope", "https://docs.kernel.org/admin-guide/LSM/Yama.html")
];

const xWindowResources = [
  resource("freedesktop.org", "Extended Window Manager Hints", "https://specifications.freedesktop.org/wm-spec/latest-single/"),
  resource("X.Org", "Xlib reference", "https://www.x.org/releases/current/doc/libX11/libX11/libX11.html"),
  resource("Tronche", "Xlib window functions", "https://tronche.com/gui/x/xlib/window/"),
  resource("freedesktop.org", "XDG Base Directory", "https://specifications.freedesktop.org/basedir-spec/latest/")
];

const videoResources = [
  resource("MDN", "Video and audio content", "https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Video_and_audio_content"),
  resource("MDN", "Media Source Extensions", "https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"),
  resource("FFmpeg", "Documentation", "https://ffmpeg.org/documentation.html"),
  resource("W3C", "Media Source Extensions", "https://www.w3.org/TR/media-source-2/")
];

const syncResources = [
  resource("Yjs", "Documentation", "https://docs.yjs.dev/"),
  resource("Automerge", "Documentation", "https://automerge.org/docs/"),
  resource("CRDT.tech", "Resources", "https://crdt.tech/"),
  resource("Martin Kleppmann", "CRDTs and distributed systems", "https://martin.kleppmann.com/2020/07/06/crdt-hard-parts-hydra.html")
];

const gameEngineResources = [
  resource("Game Programming Patterns", "Game loop", "https://gameprogrammingpatterns.com/game-loop.html"),
  resource("Game Programming Patterns", "Component", "https://gameprogrammingpatterns.com/component.html"),
  resource("MDN", "Game development", "https://developer.mozilla.org/en-US/docs/Games"),
  resource("LearnOpenGL", "Getting started", "https://learnopengl.com/Getting-started/OpenGL")
];

const containerResources = [
  resource("Docker Docs", "What is a container?", "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/"),
  resource("man7", "Linux namespaces", "https://man7.org/linux/man-pages/man7/namespaces.7.html"),
  resource("man7", "Linux cgroups", "https://man7.org/linux/man-pages/man7/cgroups.7.html"),
  resource("OCI", "Runtime specification", "https://github.com/opencontainers/runtime-spec")
];

const botResources = [
  auditedResource(
    "MDN",
    "Writing WebSocket client applications",
    "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications",
    "Bot/platform family audit of event delivery, WebSocket lifecycle, HTTP message shape, async JavaScript, environment variables, and secret hygiene.",
    [
      "Kept for generic bot tutorials because it explains persistent event connections, open/message/error/close events, JSON payloads, and secure WebSocket caveats without pretending to be platform-specific."
    ]
  ),
  auditedResource(
    "MDN",
    "HTTP messages",
    "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages",
    "Bot/platform family audit of event delivery, WebSocket lifecycle, HTTP message shape, async JavaScript, environment variables, and secret hygiene.",
    [
      "Kept for bot tutorials that call webhook or platform APIs because it teaches request/response structure, headers, bodies, status lines, and the browser/devtools/curl proof loop."
    ]
  ),
  auditedResource(
    "Node.js",
    "How to read environment variables from Node.js",
    "https://nodejs.org/learn/command-line/how-to-read-environment-variables-from-nodejs",
    "Bot/platform family audit of event delivery, WebSocket lifecycle, HTTP message shape, async JavaScript, environment variables, and secret hygiene.",
    [
      "Kept for Node-based bot tutorials because tokens, guild ids, API keys, and local config should be read from process environment rather than hardcoded into source."
    ]
  ),
  auditedResource(
    "MDN",
    "Using promises",
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises",
    "Bot/platform family audit of event delivery, WebSocket lifecycle, HTTP message shape, async JavaScript, environment variables, and secret hygiene.",
    [
      "Kept because many bot APIs are asynchronous and beginners need to understand returned promises, success/failure callbacks, chaining, and error handling before debugging platform code."
    ]
  ),
  auditedResource(
    "OWASP",
    "Secrets Management Cheat Sheet",
    "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
    "Bot/platform family audit of event delivery, WebSocket lifecycle, HTTP message shape, async JavaScript, environment variables, and secret hygiene.",
    [
      "Kept for credential hygiene, least privilege, rotation, documentation, and incident-response thinking; learners should use the relevant beginner sections rather than treating the whole cheat sheet as a first lesson."
    ]
  )
];

const frontendFrameworkResources = [
  resource("React", "Thinking in React", "https://react.dev/learn/thinking-in-react"),
  resource("React", "Render and commit", "https://react.dev/learn/render-and-commit"),
  resource("Redux", "Fundamentals", "https://redux.js.org/tutorials/fundamentals/part-1-overview"),
  resource("MDN", "Client-side frameworks", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks")
];

const cliResources = [
  resource("MIT", "Missing Semester shell", "https://missing.csail.mit.edu/2020/course-shell/"),
  resource("Python Docs", "argparse", "https://docs.python.org/3/library/argparse.html"),
  resource("Rust", "Command line applications", "https://rust-cli.github.io/book/index.html"),
  resource("Node.js", "process", "https://nodejs.org/api/process.html")
];

const arResources = [
  resource("Google", "ARCore fundamentals", "https://developers.google.com/ar/develop/fundamentals"),
  resource("Apple", "ARKit documentation", "https://developer.apple.com/augmented-reality/arkit/"),
  resource("OpenCV", "Camera calibration", "https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html"),
  resource("Unity", "AR Foundation", "https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@latest")
];

const bittorrentResources = [
  resource("BitTorrent.org", "BEP 3 protocol", "https://www.bittorrent.org/beps/bep_0003.html"),
  resource("BEP 10", "Extension protocol", "https://www.bittorrent.org/beps/bep_0010.html"),
  resource("Beej", "Guide to Network Programming", "https://beej.us/guide/bgnet/"),
  resource("Python Docs", "Binary sequence types", "https://docs.python.org/3/library/stdtypes.html#binary-sequence-types-bytes-bytearray-memoryview")
];

const textEditorResources = [
  resource("Kilo", "Build your own text editor", "https://viewsourcecode.org/snaptoken/kilo/"),
  resource("GNU Emacs", "Buffers", "https://www.gnu.org/software/emacs/manual/html_node/emacs/Buffers.html"),
  resource("GNU Emacs", "Cursor display", "https://www.gnu.org/software/emacs/manual/html_node/emacs/Cursor-Display.html"),
  resource("Rust", "The Rust book", "https://doc.rust-lang.org/book/")
];

const networkStackResources = [
  resource("Kurose and Ross", "Computer networking resources", "https://gaia.cs.umass.edu/kurose_ross/index.php"),
  resource("Beej", "Guide to Network Programming", "https://beej.us/guide/bgnet/"),
  resource("Cloudflare", "OSI model", "https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/"),
  resource("IETF", "RFC 791 IP", "https://datatracker.ietf.org/doc/html/rfc791")
];

const physicsResources = [
  resource("Nature of Code", "Forces", "https://natureofcode.com/forces/"),
  resource("Gaffer on Games", "Fix your timestep", "https://gafferongames.com/post/fix_your_timestep/"),
  resource("Khan Academy", "Forces and Newton's laws", "https://www.khanacademy.org/science/physics/forces-newtons-laws"),
  resource("MDN", "2D collision detection", "https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection")
];

const allocatorResources = [
  resource("OSTEP", "Free-space management", "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf"),
  resource("Beej", "Manual memory allocation", "https://beej.us/guide/bgc/html/split/manual-memory-allocation.html"),
  resource("GNU", "Memory allocation", "https://www.gnu.org/software/libc/manual/html_node/Memory-Allocation.html"),
  resource("CS:APP", "Malloc lab overview", "http://csapp.cs.cmu.edu/3e/malloclab.pdf")
];

const processorResources = [
  resource("nand2tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
  resource("RISC-V", "Technical specifications", "https://riscv.org/technical/specifications/"),
  resource("Khan Academy", "Logic gates", "https://www.khanacademy.org/computing/computer-science/cryptography/logic-gates"),
  resource("MIT", "Computation Structures", "https://computationstructures.org/")
];

const templateResources = [
  resource("MDN", "Template literals", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals"),
  resource("Django", "Templates", "https://docs.djangoproject.com/en/stable/topics/templates/"),
  resource("OWASP", "XSS prevention", "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"),
  resource("MDN", "HTML entities", "https://developer.mozilla.org/en-US/docs/Glossary/Entity")
];

const voxelResources = [
  resource("0fps", "Meshing in a Minecraft game", "https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/"),
  resource("LearnOpenGL", "Coordinate systems", "https://learnopengl.com/Getting-started/Coordinate-Systems"),
  resource("LearnOpenGL", "Hello triangle", "https://learnopengl.com/Getting-started/Hello-Triangle"),
  resource("Scratchapixel", "Rendering an image", "https://www.scratchapixel.com/lessons/3d-basic-rendering/rendering-3d-scene-overview/rendering-an-image.html")
];

const javascriptInternalsResources = [
  resource("MDN", "Promise", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"),
  resource("MDN", "Function.prototype.call", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call"),
  resource("MDN", "this", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this"),
  resource("JavaScript.info", "Promise basics", "https://javascript.info/promise-basics")
];

const dataStructureResources = [
  resource("UC Berkeley", "Data structures", "https://cs61b-2.gitbook.io/cs61b-textbook"),
  resource("Open Data Structures", "Open Data Structures", "https://opendatastructures.org/"),
  resource("CMU", "Algorithms and data structures", "https://www.cs.cmu.edu/~15451-f20/"),
  resource("Python Docs", "Data structures", "https://docs.python.org/3/tutorial/datastructures.html")
];

const packageToolingResources = [
  resource("Node.js", "Modules: CommonJS", "https://nodejs.org/api/modules.html"),
  resource("npm Docs", "package.json", "https://docs.npmjs.com/cli/v10/configuring-npm/package-json"),
  resource("esbuild", "Concepts", "https://esbuild.github.io/content-types/"),
  resource("GNU Make", "Manual", "https://www.gnu.org/software/make/manual/make.html")
];

const webSecurityResources = [
  resource("MDN", "Same-origin policy", "https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy"),
  resource("MDN", "WebExtensions", "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions"),
  resource("OWASP", "Authorization cheat sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"),
  resource("MDN", "HTTP cookies", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies")
];

const webAppResources = [
  resource("MDN", "Client-server overview", "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview"),
  resource("MDN", "HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
  resource("OWASP", "Authentication cheat sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"),
  resource("Martin Fowler", "MVC", "https://martinfowler.com/eaaDev/uiArchs.html")
];

const cacheCdnResources = [
  resource("Cloudflare", "What is a CDN?", "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/"),
  resource("MDN", "HTTP caching", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching"),
  resource("NGINX", "Content caching", "https://docs.nginx.com/nginx/admin-guide/content-cache/content-caching/"),
  resource("Redis", "Caching patterns", "https://redis.io/solutions/caching/")
];

const ciResources = [
  resource("GitHub Docs", "Building and testing Node.js", "https://docs.github.com/actions/guides/building-and-testing-nodejs"),
  resource("GitHub Docs", "Workflow syntax", "https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions"),
  resource("Martin Fowler", "Continuous Integration", "https://martinfowler.com/articles/continuousIntegration.html"),
  resource("Software Carpentry", "Automation and Make", "https://swcarpentry.github.io/make-novice/")
];

const mobileDesktopResources = [
  resource("Android Developers", "App fundamentals", "https://developer.android.com/guide/components/fundamentals"),
  resource("React Native", "Core components", "https://reactnative.dev/docs/components-and-apis"),
  resource("GTK", "Getting started", "https://docs.gtk.org/gtk4/getting_started.html"),
  resource("MDN", "Progressive web apps", "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps")
];

const mediaGraphicsResources = [
  resource("MDN", "WebGL concepts", "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection"),
  resource("LearnOpenGL", "Getting started", "https://learnopengl.com/Getting-started/OpenGL"),
  resource("FFmpeg", "Documentation", "https://ffmpeg.org/documentation.html"),
  resource("Scratchapixel", "Rendering an image", "https://www.scratchapixel.com/lessons/3d-basic-rendering/rendering-3d-scene-overview/rendering-an-image.html")
];

const messagingResources = [
  resource("OASIS", "MQTT specification", "https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html"),
  resource("MDN", "The WebSocket API", "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"),
  resource("Kurose and Ross", "Computer networking resources", "https://gaia.cs.umass.edu/kurose_ross/index.php"),
  resource("Beej", "Guide to Network Programming", "https://beej.us/guide/bgnet/")
];

const projectLearningResources = [
  resource("GitHub Skills", "Learning paths", "https://skills.github.com/"),
  resource("Software Carpentry", "The Unix Shell", "https://swcarpentry.github.io/shell-novice/"),
  resource("MIT", "Missing Semester", "https://missing.csail.mit.edu/"),
  resource("freeCodeCamp", "Learn to code", "https://www.freecodecamp.org/learn/")
];

const aosaSimpleWebServerResources = uniqueResources([
  resource("AOSA", "A Simple Web Server", "http://aosabook.org/en/500L/a-simple-web-server.html"),
  ...webServerResources
]);

const pombReactResources = uniqueResources([
  resource("Rodrigo Pombo", "Build your own React", "https://pomb.us/build-your-own-react/"),
  ...frontendFrameworkResources
]);

const zapierReduxResources = uniqueResources([
  resource("Zapier", "Build Yourself a Redux", "https://zapier.com/engineering/how-to-build-redux/"),
  ...frontendFrameworkResources
]);

const kiloApprovedResources = uniqueResources([
  resource("Snaptoken", "Build Your Own Text Editor", "https://viewsourcecode.org/snaptoken/kilo/"),
  ...textEditorResources
]);

const hashTableApprovedResources = uniqueResources([
  resource("James Routley", "Write a hash table in C", "https://github.com/jamesroutley/write-a-hash-table"),
  ...dataStructureResources
]);

const gifbotApprovedResources = uniqueResources([
  resource("Scott Logic", "gifbot - Building a GitHub App", "https://blog.scottlogic.com/2017/05/22/gifbot-github-integration.html"),
  resource("GitHub Docs", "Registering a GitHub App", "https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app"),
  resource("GitHub Docs", "Choosing permissions for a GitHub App", "https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app"),
  resource("GitHub Docs", "Using webhooks with GitHub Apps", "https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/using-webhooks-with-github-apps"),
  resource("GitHub Docs", "issue_comment webhook payload", "https://docs.github.com/en/webhooks/webhook-events-and-payloads?actionType=created#issue_comment"),
  resource("GitHub Docs", "Validating webhook deliveries", "https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries"),
  resource("GitHub Docs", "About GitHub App authentication", "https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app"),
  resource("GitHub Docs", "Generating a GitHub App JWT", "https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-json-web-token-jwt-for-a-github-app"),
  resource("GitHub Docs", "Generating an installation access token", "https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app"),
  resource("GitHub Docs", "Create an issue comment", "https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#create-an-issue-comment"),
  resource("GIPHY Developers", "Search Endpoint", "https://developers.giphy.com/docs/api/endpoint#search"),
  resource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages"),
  resource("MDN", "JavaScript regular expressions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"),
  resource("Node.js", "crypto.createHmac()", "https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options"),
  resource("GitHub Docs", "Creating GitHub Apps", "https://docs.github.com/en/apps/creating-github-apps"),
  resource("GitHub Docs", "Webhooks documentation", "https://docs.github.com/en/webhooks")
]);

const gitCloneHaskellResources = uniqueResources([
  resource("Stefan Saasen", "git clone in Haskell from the bottom up", "https://stefan.saasen.me/articles/git-clone-in-haskell-from-the-bottom-up/"),
  ...gitResources
]);

const brennanShellResources = uniqueResources([
  resource("Stephen Brennan", "Tutorial - Write a Shell in C", "https://brennan.io/2015/01/16/write-a-shell-in-c/"),
  ...shellResources
]);

const jsPerceptronResources = uniqueResources([
  resource("HackerNoon", "Neural networks from scratch for JavaScript linguists", "https://hackernoon.com/neural-networks-from-scratch-for-javascript-linguists-part1-the-perceptron-632a4d1fbad2"),
  ...neuralResources
]);

const defnWebAppResources = uniqueResources([
  resource("defn.io", "Web application from scratch", "https://defn.io/2018/02/25/web-app-from-scratch-01/"),
  ...webAppResources,
  ...webServerResources
]);

const jsxRendererApprovedResources = uniqueResources([
  resource("Jason Miller", "WTF is JSX", "https://jasonformat.com/wtf-is-jsx/"),
  ...frontendFrameworkResources,
  resource("MDN", "Document.createElement", "https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement")
]);

const frontendFrameworkApprovedResources = uniqueResources([
  resource("Marvin Frachet", "Create a frontend framework", "https://mfrachet.github.io/create-frontend-framework/"),
  ...frontendFrameworkResources,
  ...templateResources
]);

const minitestApprovedResources = uniqueResources([
  resource("Nim Days", "MiniTest framework", "https://xmonader.github.io/nimdays/day08_minitest.html"),
  resource("Nim", "Templates", "https://nim-lang.org/docs/tut3.html#templates"),
  resource("Nim", "Macros", "https://nim-lang.org/docs/manual.html#macros"),
  ...testingResources
]);

const modernPhpApprovedResources = uniqueResources([
  resource("Kevin Smith", "Modern PHP Without a Framework", "https://kevinsmith.io/modern-php-without-a-framework/"),
  resource("PHP Manual", "Built-in web server", "https://www.php.net/manual/en/features.commandline.webserver.php"),
  resource("Composer", "Basic usage", "https://getcomposer.org/doc/01-basic-usage.md"),
  resource("Composer", "Autoload schema", "https://getcomposer.org/doc/04-schema.md#autoload"),
  resource("PHP-FIG", "PSR-4 autoloader", "https://www.php-fig.org/psr/psr-4/"),
  resource("PHP-FIG", "PSR-7 HTTP message interfaces", "https://www.php-fig.org/psr/psr-7/"),
  resource("PHP-FIG", "PSR-11 container interface", "https://www.php-fig.org/psr/psr-11/"),
  resource("PHP-FIG", "PSR-15 request handlers and middleware", "https://www.php-fig.org/psr/psr-15/"),
  resource("PHP-DI", "Understanding dependency injection", "https://php-di.org/doc/understanding-di.html"),
  resource("PHP-DI", "Configuring the container", "https://php-di.org/doc/container-configuration.html"),
  resource("FastRoute", "Fast request router for PHP", "https://github.com/nikic/FastRoute"),
  resource("Relay", "PSR-15 middleware dispatcher", "https://relayphp.com/"),
  resource("Laminas Diactoros", "PSR-7 HTTP message implementation", "https://docs.laminas.dev/laminas-diactoros/"),
  resource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages"),
  resource("PHP Manual", "Namespace basics", "https://www.php.net/manual/en/language.namespaces.basics.php"),
  resource("PHP Manual", "Type declarations", "https://www.php.net/manual/en/language.types.declarations.php"),
  resource("PHP-FIG", "PSR-17 HTTP factories", "https://www.php-fig.org/psr/psr-17/")
]);

const openCvArApprovedResources = uniqueResources([
  resource("Bites of Code", "Part 1: features, matching, and homography", "https://bitesofcode.wordpress.com/2017/09/12/augmented-reality-with-python-and-opencv-part-1/"),
  resource("Bites of Code", "Part 2: projection matrix and model rendering", "https://bitesofcode.wordpress.com/2018/09/16/augmented-reality-with-python-and-opencv-part-2/"),
  resource("Bites of Code", "Part 3: Kalman tracking stabilization", "https://bitesofcode.wordpress.com/2024/11/30/augmented-reality-with-python-and-opencv-part-3/"),
  resource("OpenCV", "ORB tutorial", "https://docs.opencv.org/4.x/d1/d89/tutorial_py_orb.html"),
  resource("OpenCV", "ORB feature detector", "https://docs.opencv.org/4.x/db/d95/classcv_1_1ORB.html"),
  resource("OpenCV", "Feature matching", "https://docs.opencv.org/4.x/dc/dc3/tutorial_py_matcher.html"),
  resource("OpenCV", "AKAZE and ORB planar tracking", "https://docs.opencv.org/4.x/dc/d16/tutorial_akaze_tracking.html"),
  resource("OpenCV", "Feature matching + homography", "https://docs.opencv.org/4.x/d1/de0/tutorial_py_feature_homography.html"),
  resource("OpenCV", "Basic concepts of homography", "https://docs.opencv.org/4.x/d9/dab/tutorial_homography.html"),
  resource("LearnOpenCV", "Homography examples using OpenCV", "https://learnopencv.com/homography-examples-using-opencv-python-c/"),
  resource("OpenCV", "Camera calibration", "https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html"),
  resource("OpenCV", "Pose estimation", "https://docs.opencv.org/4.x/d7/d53/tutorial_py_pose.html"),
  resource("OpenCV", "Perspective-n-Point pose computation", "https://docs.opencv.org/4.x/d5/d1f/calib3d_solvePnP.html"),
  resource("OpenCV", "Real-time pose estimation of a textured object", "https://docs.opencv.org/4.x/dc/d2c/tutorial_real_time_pose.html"),
  resource("OpenCV", "KalmanFilter class reference", "https://docs.opencv.org/4.x/dd/d6a/classcv_1_1KalmanFilter.html"),
  resource("NumPy", "Linear algebra", "https://numpy.org/doc/stable/reference/routines.linalg.html")
]);

const softEngineApprovedResources = uniqueResources([
  resource("David Rousset", "Part 1: camera, mesh, and device object", "https://www.davrous.com/2013/06/13/tutorial-series-learning-how-to-write-a-3d-soft-engine-from-scratch-in-c-typescript-or-javascript/"),
  resource("David Rousset", "Part 2: drawing lines and triangles", "https://www.davrous.com/2013/06/14/tutorial-part-2-learning-how-to-write-a-3d-soft-engine-from-scratch-in-c-ts-or-js-drawing-lines-triangles/"),
  resource("David Rousset", "Part 3: loading Blender JSON meshes", "https://www.davrous.com/2013/06/17/tutorial-part-3-learning-how-to-write-a-3d-soft-engine-in-c-ts-or-js-loading-meshes-exported-from-blender/"),
  resource("David Rousset", "Part 4: rasterization and Z-buffering", "https://www.davrous.com/2013/06/21/tutorial-part-4-learning-how-to-write-a-3d-software-engine-in-c-ts-or-js-rasterization-z-buffering/"),
  resource("David Rousset", "Part 5: flat and Gouraud shading", "https://www.davrous.com/2013/07/03/tutorial-part-5-learning-how-to-write-a-3d-software-engine-in-c-ts-or-js-flat-gouraud-shading/"),
  resource("David Rousset", "Part 6: textures, back-face culling, and WebGL", "https://www.davrous.com/2013/07/18/tutorial-part-6-learning-how-to-write-a-3d-software-engine-in-c-ts-or-js-texture-mapping-back-face-culling-webgl/"),
  resource("OpenGL Tutorial", "Matrices", "https://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/"),
  resource("Song Ho", "OpenGL Transformation", "https://www.songho.ca/opengl/gl_transform.html"),
  resource("MDN", "Canvas tutorial", "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial"),
  resource("MDN", "requestAnimationFrame()", "https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame"),
  resource("Scratchapixel", "Rasterization", "https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-stage.html"),
  resource("LearnOpenGL", "Coordinate systems", "https://learnopengl.com/Getting-started/Coordinate-Systems")
]);

const discordBotApprovedResources = uniqueResources([
  resource("discord.js", "Guide", "https://discordjs.guide/"),
  resource("discord.js", "Application setup and token safety", "https://discordjs.guide/legacy/preparations/app-setup"),
  resource("discord.js", "Adding your app to servers", "https://discordjs.guide/legacy/preparations/adding-your-app"),
  resource("discord.js", "Installing Node.js and discord.js", "https://discordjs.guide/legacy/preparations/installation"),
  resource("discord.js", "Project setup and secret files", "https://discordjs.guide/legacy/app-creation/project-setup"),
  resource("discord.js", "The main file", "https://discordjs.guide/legacy/app-creation/main-file"),
  resource("discord.js", "Creating slash commands", "https://discordjs.guide/legacy/app-creation/creating-commands"),
  resource("discord.js", "Command handling", "https://discordjs.guide/legacy/app-creation/handling-commands"),
  resource("discord.js", "Registering commands", "https://discordjs.guide/legacy/app-creation/deploying-commands"),
  resource("discord.js", "Event handling", "https://discordjs.guide/legacy/app-creation/handling-events"),
  resource("discord.js", "Gateway intents", "https://discordjs.guide/legacy/popular-topics/intents"),
  resource("discord.js", "Permissions", "https://discordjs.guide/legacy/popular-topics/permissions"),
  resource("Discord", "Developer platform intro", "https://docs.discord.com/developers/intro"),
  resource("Discord", "Gateway", "https://docs.discord.com/developers/events/gateway"),
  resource("Discord", "Application commands", "https://docs.discord.com/developers/interactions/application-commands"),
  resource("Discord", "Receiving and responding to interactions", "https://docs.discord.com/developers/interactions/receiving-and-responding"),
  resource("Discord", "OAuth2", "https://docs.discord.com/developers/topics/oauth2"),
  resource("Discord", "Permissions", "https://docs.discord.com/developers/topics/permissions"),
  resource("Discord", "Rate limits", "https://docs.discord.com/developers/topics/rate-limits"),
  resource("Node.js", "Introduction to Node.js", "https://nodejs.org/learn/getting-started/introduction-to-nodejs"),
  resource("Node.js", "Download Node.js", "https://nodejs.org/en/download"),
  resource("Node.js", "Environment variables", "https://nodejs.org/learn/command-line/how-to-read-environment-variables-from-nodejs"),
  resource("Node.js", "Event emitter", "https://nodejs.org/learn/asynchronous-work/the-nodejs-event-emitter"),
  resource("Node.js", "Discover promises", "https://nodejs.org/learn/asynchronous-work/discover-promises-in-nodejs"),
  resource("Node.js", "File system", "https://nodejs.org/api/fs.html"),
  resource("npm Docs", "package.json", "https://docs.npmjs.com/cli/v10/configuring-npm/package-json/"),
  resource("MDN", "JavaScript modules", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"),
  resource("MDN", "Using promises", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises")
]);

const tcpIpStackApprovedResources = uniqueResources([
  resource("Saminiir", "Let's code a TCP/IP stack", "https://www.saminiir.com/lets-code-tcp-ip-stack-1-ethernet-arp/"),
  resource("Linux Kernel", "TUN/TAP documentation", "https://docs.kernel.org/networking/tuntap.html"),
  resource("IETF", "RFC 826 ARP", "https://datatracker.ietf.org/doc/html/rfc826"),
  ...networkStackResources
]);

const craftingInterpretersApprovedResources = uniqueResources([
  resource("Crafting Interpreters", "Book", "https://www.craftinginterpreters.com/"),
  resource("Crafting Interpreters", "Scanning", "https://craftinginterpreters.com/scanning.html"),
  resource("Crafting Interpreters", "Representing Code", "https://craftinginterpreters.com/representing-code.html"),
  ...compilerResources
]);

const minipackApprovedResources = uniqueResources([
  resource("Minipack", "README", "https://github.com/ronami/minipack"),
  resource("Minipack", "Annotated source", "https://github.com/ronami/minipack/blob/master/src/minipack.js"),
  resource("webpack", "Modules", "https://webpack.js.org/concepts/modules/"),
  resource("Babel", "Parser", "https://babeljs.io/docs/babel-parser")
]);

const superTinyCompilerApprovedResources = uniqueResources([
  resource("The Super Tiny Compiler", "README", "https://github.com/jamiebuilds/the-super-tiny-compiler"),
  resource(
    "The Super Tiny Compiler",
    "Annotated source",
    "https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js"
  ),
  resource("Crafting Interpreters", "Scanning", "https://craftinginterpreters.com/scanning.html"),
  resource("Crafting Interpreters", "Parsing expressions", "https://craftinginterpreters.com/parsing-expressions.html")
]);

const miniatureRedisApprovedResources = uniqueResources([
  resource("Charles Leifer", "Miniature Redis with Python", "https://charlesleifer.com/blog/building-a-simple-redis-server-with-python/"),
  resource("Redis Docs", "RESP protocol specification", "https://redis.io/docs/latest/develop/reference/protocol-spec/"),
  resource("Python Docs", "Socket Programming HOWTO", "https://docs.python.org/3/howto/sockets.html")
]);

const norvigLispyApprovedResources = uniqueResources([
  resource("Peter Norvig", "How to Write a Lisp Interpreter in Python", "https://norvig.com/lispy.html"),
  resource("Peter Norvig", "An Even Better Lisp Interpreter in Python", "https://norvig.com/lispy2.html"),
  resource("Crafting Interpreters", "Representing Code", "https://craftinginterpreters.com/representing-code.html")
]);

const russCoxRegexApprovedResources = uniqueResources([
  resource("Russ Cox", "Regular Expression Matching Can Be Simple And Fast", "https://swtch.com/~rsc/regexp/regexp1.html"),
  resource("Russ Cox", "Regular Expression Matching: the Virtual Machine Approach", "https://swtch.com/~rsc/regexp/regexp2.html"),
  resource("Python Docs", "Regular Expression HOWTO", "https://docs.python.org/3/howto/regex.html"),
  resource("MDN", "Regular expressions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions")
]);

const toyTemplateApprovedResources = uniqueResources([
  resource("Alex Michael", "Building a toy template engine in Python", "https://alexmic.net/building-a-template-engine/"),
  resource("Python Docs", "ast.literal_eval", "https://docs.python.org/3/library/ast.html#ast.literal_eval"),
  resource("Django", "Template language", "https://docs.djangoproject.com/en/6.0/ref/templates/language/")
]);

const superTinyInterpreterApprovedResources = uniqueResources([
  resource("The Super Tiny Interpreter", "README", "https://github.com/keyz/the-super-tiny-interpreter/blob/master/README.md"),
  resource(
    "The Super Tiny Interpreter",
    "Expression interpreter",
    "https://github.com/keyz/the-super-tiny-interpreter/blob/master/src/Interp/ExpressionInterp.js"
  ),
  resource("The Super Tiny Interpreter", "Closure model", "https://github.com/keyz/the-super-tiny-interpreter/blob/master/src/Closure.js"),
  resource("MDN", "Closures", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures"),
  resource("Babel", "Parser", "https://babeljs.io/docs/babel-parser")
]);

const tinyPackageManagerApprovedResources = uniqueResources([
  resource("Tiny Package Manager", "README", "https://github.com/g-plane/tiny-package-manager/blob/master/README.md"),
  resource("Tiny Package Manager", "Main install flow", "https://github.com/g-plane/tiny-package-manager/blob/master/src/index.ts"),
  resource("Tiny Package Manager", "Dependency resolution", "https://github.com/g-plane/tiny-package-manager/blob/master/src/list.ts"),
  resource("Tiny Package Manager", "Lock file", "https://github.com/g-plane/tiny-package-manager/blob/master/src/lock.ts"),
  resource("npm Docs", "package.json", "https://docs.npmjs.com/cli/v10/configuring-npm/package-json"),
  resource("Semantic Versioning", "SemVer 2.0.0", "https://semver.org/")
]);

const nimBencodeApprovedResources = uniqueResources([
  resource("Nim Days", "Parsing Bencode", "https://xmonader.github.io/nimdays/day02_bencode.html"),
  resource("BitTorrent.org", "BEP 3 bencoding", "https://www.bittorrent.org/beps/bep_0003.html"),
  resource("Nim", "Object variants", "https://nim-lang.org/docs/manual.html#types-object-variants"),
  resource("Nim", "Enumerations", "https://nim-lang.org/docs/tut1.html#advanced-types-enumerations")
]);

const nimRespApprovedResources = uniqueResources([
  resource("Nim Days", "Redis Protocol", "https://xmonader.github.io/nimdays/day12_resp.html"),
  resource("Redis Docs", "RESP protocol specification", "https://redis.io/docs/latest/develop/reference/protocol-spec/"),
  resource("Nim", "Object variants", "https://nim-lang.org/docs/manual.html#types-object-variants"),
  resource("Nim", "strutils", "https://nim-lang.org/docs/strutils.html")
]);

const nimIniApprovedResources = uniqueResources([
  resource("Nim Days", "INI Parser", "https://xmonader.github.io/nimdays/day05_iniparser.html"),
  resource("Nim", "parsecfg", "https://nim-lang.org/docs/parsecfg.html"),
  resource("Python Docs", "configparser", "https://docs.python.org/3/library/configparser.html"),
  resource("Nim", "strutils", "https://nim-lang.org/docs/strutils.html")
]);

const jsonAlgorithmApprovedResources = uniqueResources([
  resource("JSON Decoding Algorithm", "README", "https://github.com/cheery/json-algorithm/blob/master/README.md"),
  resource("JSON Decoding Algorithm", "Table generator", "https://github.com/cheery/json-algorithm/blob/master/build_tables.py"),
  resource("JSON Decoding Algorithm", "Verifier", "https://github.com/cheery/json-algorithm/blob/master/verifier.py"),
  resource("IETF", "RFC 8259 JSON", "https://datatracker.ietf.org/doc/html/rfc8259"),
  resource("Python Docs", "json module", "https://docs.python.org/3/library/json.html")
]);

const nistowApprovedResources = uniqueResources([
  resource("Nim Days", "Nistow dotfiles manager", "https://xmonader.github.io/nimdays/day06_nistow.html"),
  resource("GNU Stow", "Manual", "https://www.gnu.org/software/stow/manual/stow.html"),
  resource("GNU Coreutils", "ln invocation", "https://www.gnu.org/software/coreutils/manual/html_node/ln-invocation.html"),
  resource("Nim", "parseopt", "https://nim-lang.org/docs/parseopt.html"),
  resource("Nim", "os module", "https://nim-lang.org/docs/os.html")
]);

const dmiParserApprovedResources = uniqueResources([
  resource("Nim Days", "DMIDecode parser", "https://xmonader.github.io/nimdays/day01_dmidecode.html"),
  resource("DMTF", "SMBIOS overview", "https://www.dmtf.org/standards/smbios"),
  resource("Nim", "strutils", "https://nim-lang.org/docs/strutils.html"),
  resource("Nim", "tables", "https://nim-lang.org/docs/tables.html")
]);

const nimShortUrlApprovedResources = uniqueResources([
  resource("Nim Days", "URL Shortening Service", "https://xmonader.github.io/nimdays/day07_shorturl.html"),
  resource("Jester", "README", "https://github.com/dom96/jester"),
  resource("Nim", "db_sqlite", "https://nim-lang.org/docs/db_sqlite.html"),
  resource("Nim", "json", "https://nim-lang.org/docs/json.html"),
  resource("MDN", "HTTP status codes", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status")
]);

const nimLinkCheckerApprovedResources = uniqueResources([
  resource("Nim Days", "Async Link Checker", "https://xmonader.github.io/nimdays/day04_asynclinkschecker.html"),
  resource("Nim", "asyncdispatch", "https://nim-lang.org/docs/asyncdispatch.html"),
  resource("Nim", "httpclient", "https://nim-lang.org/docs/httpclient.html"),
  resource("MDN", "HTTP status codes", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status"),
  resource("Nim", "os module", "https://nim-lang.org/docs/os.html")
]);

const nimBuildSystemApprovedResources = uniqueResources([
  resource("Nim Days", "Bake build system", "https://xmonader.github.io/nimdays/day11_buildsystem.html"),
  resource("GNU Make", "Writing rules", "https://www.gnu.org/software/make/manual/html_node/Rules.html"),
  resource("cp-algorithms", "Checking a graph for cycles", "https://cp-algorithms.com/graph/finding-cycle.html"),
  resource("Nim", "tables", "https://nim-lang.org/docs/tables.html"),
  resource("Nim", "algorithm", "https://nim-lang.org/docs/algorithm.html")
]);

const littleLispApprovedResources = uniqueResources([
  resource("Mary Rose Cook", "Little Lisp interpreter", "https://maryrosecook.com/blog/post/little-lisp-interpreter"),
  resource("Little Lisp", "Source", "https://github.com/maryrosecook/littlelisp/blob/master/littlelisp.js"),
  resource("Little Lisp", "Tests", "https://github.com/maryrosecook/littlelisp/blob/master/littlelisp.spec.js"),
  resource("Crafting Interpreters", "Representing Code", "https://craftinginterpreters.com/representing-code.html")
]);

const khamidouLispApprovedResources = uniqueResources([
  resource("Khamidou", "lisp.py", "http://khamidou.com/compilers/lisp.py/"),
  resource("Peter Norvig", "How to Write a Lisp Interpreter in Python", "https://norvig.com/lispy.html"),
  resource("Crafting Interpreters", "Representing Code", "https://craftinginterpreters.com/representing-code.html"),
  resource("Crafting Interpreters", "Evaluating Expressions", "https://craftinginterpreters.com/evaluating-expressions.html")
]);

const swiftyLispApprovedResources = uniqueResources([
  resource("uraimo", "Building a LISP from scratch with Swift", "https://www.uraimo.com/2017/02/05/building-a-lisp-from-scratch-with-swift/"),
  resource("SwiftyLISP", "Source", "https://github.com/uraimo/SwiftyLISP/blob/master/Sources/SwiftyLisp.swift"),
  resource("SwiftyLISP", "README", "https://github.com/uraimo/SwiftyLISP/blob/master/README.md"),
  resource("Crafting Interpreters", "Representing Code", "https://craftinginterpreters.com/representing-code.html"),
  resource("Crafting Interpreters", "Evaluating Expressions", "https://craftinginterpreters.com/evaluating-expressions.html")
]);

const dagobaApprovedResources = uniqueResources([
  resource("AOSA", "Dagoba: An In-Memory Graph Database", "http://aosabook.org/en/500L/dagoba-an-in-memory-graph-database.html"),
  resource("Apache TinkerPop", "Getting Started", "https://tinkerpop.apache.org/docs/current/tutorials/getting-started/"),
  resource("MDN", "Object.create()", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create"),
  resource("MDN", "JSON.stringify()", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify"),
  resource("MDN", "Window.localStorage", "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage")
]);

const dbdbApprovedResources = uniqueResources([
  resource("AOSA", "DBDB: Dog Bed Database", "http://aosabook.org/en/500L/dbdb-dog-bed-database.html"),
  resource("SQLite", "Architecture of SQLite", "https://www.sqlite.org/arch.html"),
  resource("SQLite", "Atomic Commit In SQLite", "https://www.sqlite.org/atomiccommit.html"),
  resource("Python Docs", "shelve - Python object persistence", "https://docs.python.org/3/library/shelve.html"),
  resource("Python Docs", "os.fsync()", "https://docs.python.org/3/library/os.html#os.fsync")
]);

const cstackDatabaseApprovedResources = uniqueResources([
  resource("cstack", "Let's Build a Simple Database", "https://cstack.github.io/db_tutorial/"),
  resource("SQLite", "Architecture of SQLite", "https://www.sqlite.org/arch.html"),
  resource("SQLite", "Database File Format", "https://www.sqlite.org/fileformat2.html"),
  resource("man7", "getline(3)", "https://man7.org/linux/man-pages/man3/getline.3.html"),
  resource("man7", "open(2)", "https://man7.org/linux/man-pages/man2/open.2.html")
]);

const rubyBitcaskApprovedResources = uniqueResources([
  resource("Dinesh Gowda", "Build Your Own Fast, Persistent KV Store", "https://dineshgowda.com/posts/build-your-own-persistent-kv-store/"),
  resource("Wikipedia", "Bitcask", "https://en.wikipedia.org/wiki/Bitcask"),
  resource("SQLite", "Atomic Commit In SQLite", "https://www.sqlite.org/atomiccommit.html"),
  resource("man7", "open(2)", "https://man7.org/linux/man-pages/man2/open.2.html")
]);

const archaeologyDbApprovedResources = uniqueResources([
  resource("AOSA", "An Archaeology-Inspired Database", "https://aosabook.org/en/500L/an-archaeology-inspired-database.html"),
  resource("Clojure", "Data Structures", "https://clojure.org/reference/data_structures"),
  resource("Clojure", "Datatypes: deftype, defrecord and reify", "https://clojure.org/reference/datatypes"),
  resource("Clojure", "Protocols", "https://clojure.org/reference/protocols"),
  resource("Clojure", "Metadata", "https://clojure.org/reference/metadata"),
  resource("Clojure", "Atoms", "https://clojure.org/reference/atoms"),
  resource("Datomic", "Overview and information model", "https://docs.datomic.com/datomic-overview.html"),
  resource("Datomic", "Index Model", "https://docs.datomic.com/indexes/index-model.html"),
  resource("Datomic", "Schema Reference", "https://docs.datomic.com/schema/schema-reference.html"),
  resource("Datomic", "Transaction Data Reference", "https://docs.datomic.com/transactions/transaction-data-reference.html"),
  resource("Datomic", "Query Reference", "https://docs.datomic.com/query/query-data-reference.html"),
  resource("Datomic", "Index-Pull", "https://docs.datomic.com/indexes/index-pull.html"),
  resource("Datomic", "Entities", "https://docs.datomic.com/reference/entities.html"),
  resource("Clojure", "Sequences", "https://clojure.org/reference/sequences"),
  resource("Clojure", "Learn Clojure: Hashed Collections", "https://clojure.org/guides/learn/hashed_colls"),
  resource("Clojure", "Refs and Transactions", "https://clojure.org/reference/refs")
]);

const tokioRedisApprovedResources = uniqueResources([
  resource("Tokio", "Mini-Redis setup", "https://tokio.rs/tokio/tutorial/setup"),
  resource("Tokio", "Spawning", "https://tokio.rs/tokio/tutorial/spawning"),
  resource("Tokio", "Shared state", "https://tokio.rs/tokio/tutorial/shared-state"),
  resource("Tokio", "Framing", "https://tokio.rs/tokio/tutorial/framing"),
  resource("Redis Docs", "RESP protocol specification", "https://redis.io/docs/latest/develop/reference/protocol-spec/")
]);

const cppRedisApprovedResources = uniqueResources([
  resource("Build Your Own", "Build Your Own Redis with C/C++", "https://build-your-own.org/redis/"),
  resource("Build Your Own", "Socket Programming", "https://build-your-own.org/redis/02_intro_sockets"),
  resource("Build Your Own", "Request-Response Protocol", "https://build-your-own.org/redis/04_proto"),
  resource("Build Your Own", "Event Loop", "https://build-your-own.org/redis/06_event_loop_impl"),
  resource("Build Your Own", "Key-Value Server", "https://build-your-own.org/redis/07_basic_server"),
  resource("Build Your Own", "Hashtables", "https://build-your-own.org/redis/08_hashtables"),
  resource("Build Your Own", "Data Serialization", "https://build-your-own.org/redis/09_serialization"),
  resource("Build Your Own", "Sorted Set", "https://build-your-own.org/redis/11_sortedset"),
  resource("Build Your Own", "Cache Expiration with TTL", "https://build-your-own.org/redis/13_heap"),
  resource("Redis Docs", "RESP protocol specification", "https://redis.io/docs/latest/develop/reference/protocol-spec/"),
  resource("man7", "socket(2)", "https://man7.org/linux/man-pages/man2/socket.2.html"),
  resource("man7", "epoll(7)", "https://man7.org/linux/man-pages/man7/epoll.7.html")
]);

const simpleKafkaApprovedResources = uniqueResources([
  resource("buildthingsuseful", "Build Your Own Kafka README", "https://github.com/buildthingsuseful/build-your-own-kafka/blob/main/README.md"),
  resource("SimpleKafka", "Broker source", "https://github.com/buildthingsuseful/build-your-own-kafka/blob/main/com/simplekafka/broker/SimpleKafkaBroker.java"),
  resource("SimpleKafka", "Partition source", "https://github.com/buildthingsuseful/build-your-own-kafka/blob/main/com/simplekafka/broker/Partition.java"),
  resource("SimpleKafka", "Protocol source", "https://github.com/buildthingsuseful/build-your-own-kafka/blob/main/com/simplekafka/broker/Protocol.java"),
  resource("SimpleKafka", "ZooKeeper client source", "https://github.com/buildthingsuseful/build-your-own-kafka/blob/main/com/simplekafka/broker/ZookeeperClient.java"),
  resource("SimpleKafka", "Client source", "https://github.com/buildthingsuseful/build-your-own-kafka/blob/main/com/simplekafka/client/SimpleKafkaClient.java"),
  resource("SimpleKafka", "Producer source", "https://github.com/buildthingsuseful/build-your-own-kafka/blob/main/com/simplekafka/client/SimpleKafkaProducer.java"),
  resource("SimpleKafka", "Consumer source", "https://github.com/buildthingsuseful/build-your-own-kafka/blob/main/com/simplekafka/client/SimpleKafkaConsumer.java"),
  resource("Apache Kafka", "Introduction", "https://kafka.apache.org/intro/"),
  resource("Apache ZooKeeper", "Overview", "https://zookeeper.apache.org/doc/current/zookeeperOver.html"),
  resource("Oracle Java Tutorials", "All About Sockets", "https://docs.oracle.com/javase/tutorial/networking/sockets/index.html"),
  resource("Java SE 11 API", "ByteBuffer", "https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/ByteBuffer.html"),
  resource("Java SE 11 API", "FileChannel", "https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/channels/FileChannel.html"),
  resource("Java SE 11 API", "SocketChannel", "https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/channels/SocketChannel.html"),
  resource("Apache Maven", "Maven in 5 Minutes", "https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html")
]);

interface FamilyConceptSpec {
  id: string;
  title: string;
  plainEnglish: string;
  whyItMatters: string;
  signsYouUnderstand: string[];
  resourceIndexes?: number[];
}

interface FamilyCheckpointSpec {
  title: string;
  sourceSectionTitle: string;
  learnRightHere: string;
  action: string;
  debugPrompt: string;
  selfCheck: string;
  resourceIndexes?: number[];
}

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
  approvedTutorialOverride(
    "web-server-node-js-build-your-own-web-server-from-scratch-in-javascript",
    "Individual review of build-your-own.org webserver chapters 1-7 plus Node net/Buffer/event-loop/stream docs, MDN HTTP messages, RFC 9110/9112, and HPBN TCP material",
    "Approved path for the Node.js web-server tutorial focused on TCP byte streams, Node evented sockets, protocol framing, HTTP/1.1 message syntax, response generation, body streaming, and honest extension boundaries for the paid/unfinished Part II topics.",
    nodeWebServerResources,
    [
      concept(
        "approved-node-webserver-tcp-byte-stream",
        "TCP is a byte stream, not message packets",
        "The tutorial deliberately starts below HTTP: a TCP socket gives your Node program an ordered stream of bytes, but it does not preserve application-message boundaries for you.",
        "This is the first beginner trap in the project. If you assume every `data` event is one request, your server will work in tiny demos and fail when bytes are split or coalesced differently.",
        [
          "You can explain why TCP does not know where one HTTP request ends.",
          "You can describe bind/listen/connection/read/write/close without saying framework.",
          "You can name one proof that shows your code handles partial or combined data."
        ],
        resourcesByIndex(nodeWebServerResources, [3, 8, 16, 5])
      ),
      concept(
        "approved-node-webserver-event-loop-sockets",
        "Node accepts connections through events",
        "In this tutorial, `net.createServer()` wraps listening sockets and connection sockets in event-emitting objects; your code registers handlers for connection, data, end, error, and close.",
        "Beginners need this model before writing server logic because the code is not a straight loop that blocks for one client. The event loop decides when each socket handler runs.",
        [
          "You can map each socket event to the TCP primitive it represents.",
          "You can explain why a long-running handler delays other connections.",
          "You can test error handling by trying to bind two servers to the same port."
        ],
        resourcesByIndex(nodeWebServerResources, [3, 8, 10, 4])
      ),
      concept(
        "approved-node-webserver-buffer-framing",
        "Buffers and framing turn bytes into protocol messages",
        "The middle chapters teach a small protocol before HTTP so learners can practice cutting complete messages out of a growing buffer without losing leftover bytes.",
        "That buffer discipline is what makes the HTTP parser understandable later: find delimiters, wait for enough bytes, preserve the rest, and only then hand a complete message to application logic.",
        [
          "You can say why Node `Buffer` is a better model than strings for raw sockets.",
          "You can trace how leftover bytes remain in the dynamic buffer after one message is cut.",
          "You can write a fixture where two messages arrive in one read or one message arrives in two reads."
        ],
        resourcesByIndex(nodeWebServerResources, [5, 9, 3, 7])
      ),
      concept(
        "approved-node-webserver-http-syntax-semantics",
        "HTTP semantics and HTTP/1.1 syntax are separate jobs",
        "The tutorial separates what a request means from how it appears on the wire: methods, URIs, status codes, and headers are HTTP semantics; start lines, CRLF, header fields, and body framing are HTTP/1.1 syntax.",
        "This keeps the beginner from building a fragile string splitter. A useful toy server should know where the standard gives rules and where the project intentionally implements only a safe subset.",
        [
          "You can identify request line, status line, header section, blank line, and message body.",
          "You can explain why Content-Length and Transfer-Encoding decide body length.",
          "You can name one HTTP ambiguity the toy server rejects or leaves out."
        ],
        resourcesByIndex(nodeWebServerResources, [6, 7, 12, 14, 15])
      ),
      concept(
        "approved-node-webserver-streaming-scope",
        "Streaming and extensions require resource boundaries",
        "The public table of contents points beyond the basic server into dynamic content, file IO, range requests, caching, compression, streams, WebSocket, and concurrency.",
        "A portfolio version should be honest about scope: prove the basic HTTP server first, then add one extension with explicit resource cleanup, backpressure, and limits rather than claiming production-server completeness.",
        [
          "You can explain why a response body may be a reader instead of a single buffer.",
          "You can document which Part II extension you attempted and which ones remain out of scope.",
          "You can describe one resource leak risk when serving files or streams."
        ],
        resourcesByIndex(nodeWebServerResources, [0, 7, 11, 16])
      )
    ],
    [
      checkpoint(
        "Set up the Node socket lab before HTTP",
        "01. Introduction and 02. HTTP Overview",
        "Learn the tutorial's scope, install Node, open a terminal, and manually send one HTTP request with netcat, socat, curl, or a browser devtools network panel before writing server code.",
        "Create a clean repository, run a one-file Node program, capture one raw HTTP request/response transcript, and write the minimal response shape in your notes.",
        "If the command-line request fails, debug host, port, TLS/plain HTTP, and blank-line termination before touching Node socket code.",
        "You can show a raw request line, a status line, headers, the blank line, and a body from your own local notes.",
        resourcesByIndex(nodeWebServerResources, [1, 2, 12, 13])
      ),
      checkpoint(
        "Build and test the TCP echo server",
        "03. Code A TCP Server",
        "Learn listening sockets, connection sockets, data/end/error events, and why TCP gives you a byte stream rather than complete messages.",
        "Implement the echo server with `node:net`, run it on localhost, send text through netcat or socat, and add a controlled close path plus an error handler.",
        "If no data appears, separate three questions: did the server listen, did a client connect, and did the socket emit a `data` event.",
        "The server echoes bytes, logs connection lifecycle events, and explains one half-close or close behavior without using Node's HTTP module.",
        resourcesByIndex(nodeWebServerResources, [3, 8, 16, 10])
      ),
      checkpoint(
        "Practice framing with the simple protocol",
        "04. Promises and Events and 05. A Simple Network Protocol",
        "Learn promises/events only as much as needed to sequence socket reads, then implement a tiny message protocol so byte-stream parsing is tested before HTTP complexity arrives.",
        "Build the dynamic buffer/cut-message step from the tutorial and test split, combined, empty, and malformed inputs as fixtures.",
        "If parsing drops bytes or duplicates messages, log buffer length before and after each cut instead of changing the protocol randomly.",
        "A fixture proves the parser can wait for incomplete data and preserve leftover bytes after extracting one complete message.",
        resourcesByIndex(nodeWebServerResources, [4, 5, 9, 10])
      ),
      checkpoint(
        "Parse HTTP headers from bytes",
        "06. HTTP Semantics and Syntax",
        "Learn the difference between HTTP semantics and HTTP/1.1 wire syntax: request line, CRLF, header fields, empty-line delimiter, Content-Length, Transfer-Encoding, and deliberately rejected ambiguous cases.",
        "Write a parser for the request header subset used by the tutorial, keep URI/header bytes as buffers until interpretation is needed, and add fixtures for CRLF, missing delimiters, and invalid length.",
        "If the parser accepts impossible input, compare it against RFC 9112's message-format model and decide whether to reject, wait for more bytes, or mark unsupported.",
        "The parser turns a raw request header into method, URI bytes, version, headers, and a clear body-reading decision.",
        resourcesByIndex(nodeWebServerResources, [6, 12, 14, 15])
      ),
      checkpoint(
        "Serve a basic HTTP response through your own loop",
        "07. Code A Basic HTTP Server",
        "Learn how the tutorial replaces the simple protocol message with an HTTP request/response object and keeps body reading separate from the parsed header.",
        "Wire the parser into the TCP server loop, return a valid response for at least `/` and one unknown path, and test it from curl and a browser.",
        "If the browser hangs or curl reports a protocol problem, inspect CRLF, Content-Length, connection close behavior, and whether the body reader actually reaches EOF.",
        "Curl and the browser both receive valid responses from your raw Node server, and your notes identify the parser, handler, and response writer functions.",
        resourcesByIndex(nodeWebServerResources, [7, 6, 12, 14])
      ),
      checkpoint(
        "Document extensions without pretending production readiness",
        "Part II contents: applications and extensions",
        "Learn the extension map honestly: dynamic content, file IO, range requests, caching, compression, streams, WebSocket, and concurrency are separate follow-up concepts, not automatically solved by the basic server.",
        "Pick one small extension or write a design note for all of them, including resource cleanup, streaming/backpressure, request limits, unsupported HTTP cases, and why Node's built-in HTTP module exists.",
        "If the extension grows fuzzy, stop and define the input, output, resource lifetime, and failure mode before coding more.",
        "The README distinguishes the implemented basic HTTP server from future production concerns and includes one concrete extension proof or design plan.",
        resourcesByIndex(nodeWebServerResources, [0, 11, 16, 15])
      )
    ],
    [
      "Install a current Node LTS and decide whether you will write JavaScript or the tutorial's TypeScript-flavored code.",
      "Read chapters 1-2 before coding and manually produce one raw HTTP request/response transcript.",
      "Do not import Node's `http` module for the core project; the point is to build below that abstraction with `node:net`.",
      "Create parser fixtures before the HTTP server loop, especially split reads, combined messages, malformed headers, and missing blank lines.",
      "Commit after echo server, framing protocol, HTTP parser, response writer, and final README proof."
    ],
    [
      "Demo `curl -v` and a browser receiving valid responses from the raw Node server.",
      "Include parser fixtures showing split/combined TCP data and at least one rejected malformed HTTP header.",
      "Add a README diagram separating TCP socket layer, byte buffer/framing layer, HTTP parser, app handler, and response writer.",
      "Document which HTTP features are intentionally unsupported: TLS, HTTP/2/3, full chunked parsing, request smuggling edge cases, concurrency limits, caching, compression, and WebSocket.",
      "Explain why Node's built-in HTTP server is still the right choice for production even after building this learning version."
    ],
    "Built a raw Node.js HTTP server from TCP sockets upward, including event-driven socket handling, byte-stream framing, Buffer-based parsing, HTTP/1.1 request/response syntax, body-reader boundaries, curl/browser proof, and clearly documented production gaps.",
    [
      "The public tutorial exposes chapters 1-7 for the basic server; Part II appears as an extension table of contents and should be framed as follow-up scope unless the learner has access to the full book.",
      "Supporting resources were selected to match each tutorial layer rather than repeating a generic web-server pack."
    ],
    { prerequisiteResources: nodeWebServerResources, prerequisiteResourceStrategy: "node-web-server" }
  ),
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
      "Individual review of nand2tetris official project pages, tools page, license guidance, MIT computation structures, Crafting Interpreters, and OSTEP",
      "Curated first-principles computer-systems path focused on the complete abstraction ladder: Boolean gates, HDL, ALU, memory, CPU, machine language, assembler, VM translator, Jack compiler, OS services, and project-by-project proof tests.",
      [
        "Treat this as a long course, not a weekend tutorial.",
        "Use the official project pages and tools page as the source of truth, because the homepage extraction is limited.",
        "Do not let learners skip proof tests for earlier layers.",
        "Respect the course authors' request not to publish full solutions publicly."
      ]
    ),
    concepts: [
      concept(
        "curated-nand-abstraction-ladder",
        "The abstraction ladder is the project",
        "Nand2Tetris is not one app tutorial; it is a sequence where each finished layer becomes the simplified interface used by the next layer: gates, chips, memory, CPU, machine language, assembler, VM, compiler, Jack code, and OS services.",
        "This ladder is the survival map for beginners because a later failure often means an earlier contract was never really understood or tested.",
        [
          "You can draw the ladder from NAND gate to Jack OS service.",
          "You can explain what each layer hides and what contract it exposes.",
          "You can decide which earlier layer to retest when a later layer fails."
        ],
        resourcesByIndex(nandResources, [0, 1, 2, 18])
      ),
      concept(
        "curated-nand-boolean-hdl-contracts",
        "Boolean logic and HDL contracts",
        "The hardware half begins with truth tables and HDL chip interfaces: each chip declares inputs and outputs, the implementation wires smaller chips together, and the simulator checks the declared behavior against test and compare files.",
        "Beginners need this because HDL can feel like programming until the contract mindset clicks: you are building a circuit interface, not writing step-by-step runtime instructions.",
        [
          "You can read a chip interface and predict which output pins a test will inspect.",
          "You can explain why NAND is sufficient to build other basic gates.",
          "You can debug a composed chip by testing its smaller dependencies first."
        ],
        resourcesByIndex(nandResources, [4, 5, 19, 20, 2])
      ),
      concept(
        "curated-nand-state-memory-cpu",
        "State turns gates into a computer",
        "Project 3 adds time and storage with DFF-backed registers and RAM, and Project 5 connects ALU, registers, memory, instruction memory, and control bits into the Hack computer.",
        "This is the first point where a learner can see why a CPU is not magic: it repeatedly fetches an instruction, routes data, updates state, and exposes enough behavior for machine programs to run.",
        [
          "You can distinguish combinational logic from sequential/stateful logic.",
          "You can trace one instruction through ALU input, destination bits, jump logic, and memory effects.",
          "You can explain why Memory, CPU, and Computer must each be unit-tested before running programs."
        ],
        resourcesByIndex(nandResources, [6, 8, 21, 22, 26])
      ),
      concept(
        "curated-nand-isa-assembler-contract",
        "Machine language and assembler form a contract",
        "The Hack instruction set is the agreement between the hardware platform and the software tools: assembly names registers, addresses, computations, destinations, and jumps, while the assembler turns those symbols into exact 16-bit binary instructions.",
        "This bridge matters because it is where learners stop treating hardware and software as separate worlds; the CPU executes the bits that the assembler emits.",
        [
          "You can translate a tiny A-instruction and C-instruction by hand.",
          "You can explain labels and variables as assembler conveniences, not CPU features.",
          "You can compare your `.hack` output against the supplied assembler before blaming the CPU."
        ],
        resourcesByIndex(nandResources, [7, 9, 22, 23])
      ),
      concept(
        "curated-nand-vm-translator-stack",
        "The VM translator is a stack-machine compiler backend",
        "Projects 7 and 8 define a VM language that sits above Hack assembly: stack arithmetic, memory segments, branching, function calls, and returns are translated into lower-level Hack assembly sequences.",
        "This is the beginner-friendly reason compilers have layers: Jack code does not need to know Hack assembly directly if a VM translator can reliably map a simpler abstract machine onto the hardware.",
        [
          "You can draw stack pointer movement for `push constant 7`, `push constant 8`, `add`.",
          "You can explain the difference between VM arithmetic, memory access, branching, and function-call commands.",
          "You can test generated assembly in the CPU emulator while also checking intended VM behavior in the VM emulator."
        ],
        resourcesByIndex(nandResources, [10, 11, 25, 28])
      ),
      concept(
        "curated-nand-compiler-os-services",
        "The compiler and OS complete the software half",
        "Projects 9 through 12 move from writing Jack programs to building the Jack compiler front end, emitting VM code, and implementing OS services such as Math, Memory, Screen, Keyboard, Output, String, Array, and Sys.",
        "This final layer matters because it proves the whole stack is useful: a high-level program can call library services, compile to VM code, translate to assembly, and run on the computer built earlier.",
        [
          "You can separate tokenizing, parsing, symbol tables, and code generation.",
          "You can explain why Jack OS services are ordinary code that hides common runtime behavior.",
          "You can scope a final proof without pretending you built a production operating system."
        ],
        resourcesByIndex(nandResources, [12, 13, 14, 15, 24, 27, 29, 30])
      )
    ],
    checkpoints: [
      checkpoint(
        "Prepare tools, folders, terminal basics, and solution boundaries",
        "Software, Projects, and License",
        "Learn the course structure before building: official projects, supplied tools, test scripts, compare files, local folders, shell commands, and the authors' request not to publish complete solutions publicly.",
        "Set up the online IDE or local software suite, run one supplied tool/test script, create a private progress log, and write your public README plan without revealing future solution code.",
        "If a tool does not run, debug Java/path/shell setup separately from project logic; do not edit HDL or assembler code until the tool itself is proven.",
        "You can open the tools, locate project folders, run a sample test, and explain what can be shared publicly versus kept private.",
        resourcesByIndex(nandResources, [0, 1, 2, 3, 16, 17])
      ),
      checkpoint(
        "Build Boolean gates and the ALU as tested contracts",
        "Projects 1-2: Boolean Logic and Boolean Arithmetic",
        "Learn truth tables, HDL interfaces, multiplexers, adders, and ALU control bits as contracts checked by `.tst` and `.cmp` files.",
        "Implement the project 1 gates and project 2 arithmetic chips in the recommended order, then write a short explanation of how the ALU control bits choose each output.",
        "If a later chip fails, run the smaller chip tests first and isolate whether the failure is wiring, bus width, status outputs, or use of a missing built-in chip.",
        "Project 1 and 2 tests pass, and your notes explain one gate, one adder, and the ALU without copying a full solution.",
        resourcesByIndex(nandResources, [4, 5, 19, 20])
      ),
      checkpoint(
        "Build memory, CPU, and the complete Hack computer",
        "Projects 3 and 5: Memory and Computer Architecture",
        "Learn how stateful registers and RAM differ from combinational chips, then connect memory, CPU control, instruction memory, and I/O-mapped devices into the top-level Computer chip.",
        "Complete RAM and PC chips, unit-test Memory and CPU, then run the supplied Add, Max, or Rect machine program on the completed Computer chip.",
        "If the Computer test fails, do not debug everything at once: isolate memory address decoding, ALU output, destination bits, jump decision, and program counter behavior.",
        "A supplied machine program runs on your Hack computer, and your README traces one instruction through CPU and memory state.",
        resourcesByIndex(nandResources, [6, 8, 21, 22, 26])
      ),
      checkpoint(
        "Write assembly and then build the assembler",
        "Projects 4 and 6: Machine Language and the Assembler",
        "Learn Hack assembly by writing small programs first, then implement the assembler that turns symbols, labels, A-instructions, and C-instructions into binary code.",
        "Write and test Mult or Fill in Hack assembly, then implement a two-stage assembler: symbol-free translation first, labels/variables second.",
        "If output differs from the supplied assembler, compare one instruction at a time and decide whether the parser, symbol table, comp table, dest table, or jump table is wrong.",
        "Your assembler produces `.hack` files matching the supplied assembler for staged test programs.",
        resourcesByIndex(nandResources, [7, 9, 22, 23])
      ),
      checkpoint(
        "Build the VM translator in two deliberate passes",
        "Projects 7-8: VM Translator",
        "Learn the VM language as a stack-machine interface: arithmetic and memory segments first, then branching, functions, calls, returns, bootstrap code, and directory-level translation.",
        "Implement project 7 until all stack/memory tests pass, save a clean checkpoint, then extend it for project 8 control flow and function-call tests.",
        "If translated assembly fails, run the original `.vm` in the VM emulator, inspect generated assembly around the failing command, and reduce to the smallest VM program that reproduces the bug.",
        "The VM translator passes project 7 and 8 staged tests and your notes explain stack pointer changes for one arithmetic command and one function call.",
        resourcesByIndex(nandResources, [10, 11, 25, 28])
      ),
      checkpoint(
        "Finish with Jack, compiler stages, and OS services",
        "Projects 9-12: Jack, Compiler, and Operating System",
        "Learn Jack as the source language, then build compiler phases in order: tokenizer, parser/XML proof, symbol table, VM code generation, and finally selected OS services that Jack programs rely on.",
        "Write a small Jack program, complete tokenizer/parser tests, extend the compiler to generate VM code, then implement and test OS classes with a clearly documented scope.",
        "If a Jack program fails, identify the layer before changing code: source program, tokenizer, parser, symbol table, emitted VM code, VM translator, or OS service.",
        "A small Jack program compiles and runs through your stack, with README proof showing the source-to-VM-to-assembly-to-Hack-computer path.",
        resourcesByIndex(nandResources, [12, 13, 14, 15, 24, 27, 29, 30])
      )
    ],
    setupSteps: [
      "Treat Nand2Tetris as a multi-week course and create a progress log for each official project layer.",
      "Learn shell navigation, file paths, and tool invocation first if folders, commands, or test scripts still feel uncertain.",
      "Draw the abstraction ladder before starting: NAND, gates, ALU, memory, CPU, assembler, VM translator, compiler, Jack OS.",
      "Keep solution code private or scoped carefully, respecting the course authors' request not to publish full project solutions.",
      "Commit after each passed hardware/software test suite and write which contract now works."
    ],
    finalProofTasks: [
      "Show one working artifact from the hardware half and one from the software half without publishing complete protected solutions.",
      "Add a README ladder explaining how gates support chips, chips support the CPU, the ISA supports the assembler, the VM supports the compiler, and OS services support Jack programs.",
      "Include one debugging story where a later failure came from an earlier contract.",
      "Include screenshots or logs from test scripts rather than full solution listings.",
      "Explain why this is larger than a normal tutorial and how you scoped your completed work."
    ],
    cvFraming:
      "Built an educational computer stack from first principles, connecting Boolean logic, HDL chip contracts, ALU/RAM/CPU architecture, Hack machine language, assembler tooling, VM translation, Jack compiler phases, and OS services through explicit layer-by-layer tests.",
    prerequisiteResources: nandResources,
    prerequisiteResourceStrategy: "nand2tetris"
  },
  approvedTutorialOverride(
    "database-javascript-dagoba-an-in-memory-graph-database",
    "Individual review of AOSA Dagoba chapter plus TinkerPop graph traversal and MDN JavaScript storage/prototype references",
    "Approved path for Dagoba focused on property-graph modeling, vertex/edge identity, JavaScript prototype factories, fluent traversal programs, lazy step execution, JSON serialization, localStorage persistence, and update/concurrency caveats.",
    dagobaApprovedResources,
    [
      concept(
        "approved-dagoba-property-graph-model",
        "A graph database stores relationships as first-class data",
        "Dagoba starts from vertices and directed edges, then adds IDs, in/out edge lists, and a vertexIndex so relationships can be followed instead of recomputed from unrelated tables.",
        "Beginners need this because a graph database is not just an object array; the edge direction and lookup structure are what make traversal queries natural.",
        [
          "You can draw one vertex with `_in` and `_out` edge lists.",
          "You can explain why edges store references to existing vertices.",
          "You can say what `vertexIndex` speeds up and what it does not solve."
        ],
        [dagobaApprovedResources[0], dagobaApprovedResources[1], dagobaApprovedResources[2]]
      ),
      concept(
        "approved-dagoba-lazy-traversal-program",
        "Traversal steps are a tiny query program",
        "Dagoba represents a query as an ordered program of pipetype steps plus per-step state, then runs the program in a pull-style loop so results can be produced lazily.",
        "That is the key beginner bridge: the fluent API is not magic chaining; it records steps that a small interpreter executes later.",
        [
          "You can list the program entries created by `g.v('Thor').out().in()`.",
          "You can explain why per-step state is needed for a paused query.",
          "You can trace one result through vertex, out, in, property, or filter steps."
        ],
        [dagobaApprovedResources[0], dagobaApprovedResources[1]]
      ),
      concept(
        "approved-dagoba-json-persistence-limits",
        "Persistence is serialization plus honest limits",
        "Dagoba flattens graph objects to JSON by replacing cyclic vertex/edge references with IDs, then stores the string in localStorage for quick restart.",
        "This is useful only if learners understand the limits: JSON does not preserve arbitrary live objects, localStorage is per-origin browser storage, and concurrent updates can overwrite each other.",
        [
          "You can explain why graph cycles must be broken before JSON.stringify.",
          "You can rebuild a graph from stored vertex and edge data.",
          "You can name at least two reasons localStorage persistence is not a production database."
        ],
        [dagobaApprovedResources[0], dagobaApprovedResources[3], dagobaApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Build the graph core before queries",
        "Build a Better Graph",
        "Learn Dagoba's data model: factory-created graph objects, vertex IDs, edge validation, `_in`/`_out` lists, and index lookup.",
        "Implement graph, addVertex, addEdge, findVertexById, and a fixture graph with named people/software or family data.",
        "If traversal later returns nothing, inspect whether edges point to real vertex objects and whether `_in`/`_out` lists were updated.",
        "A printed graph shows vertices, edges, in/out lists, and indexed lookup for one known vertex.",
        [dagobaApprovedResources[0], dagobaApprovedResources[2], dagobaApprovedResources[1]]
      ),
      checkpoint(
        "Record fluent query steps",
        "Enter the Query",
        "Learn that the fluent API stores a program instead of immediately calculating every answer.",
        "Implement query, add, g.v, and at least two step-recording helpers, then print the query program before running it.",
        "If chaining loses earlier steps, inspect whether each method returns the query object.",
        "A chain such as `g.v(id).out('created')` produces an inspectable program array.",
        [dagobaApprovedResources[0], dagobaApprovedResources[1]]
      ),
      checkpoint(
        "Run pipetypes lazily",
        "The Problem with Being Eager and Pipetypes",
        "Learn why Dagoba avoids eager whole-query evaluation and instead lets each step keep enough state to resume later.",
        "Implement vertex, out/in, property, filter, take, and run with a tiny trace showing state movement across steps.",
        "If results duplicate or disappear, log step index, current state, and current vertex before changing pipetype logic.",
        "The same query can return one result at a time or all results predictably.",
        [dagobaApprovedResources[0], dagobaApprovedResources[1]]
      ),
      checkpoint(
        "Serialize, reload, and document browser limits",
        "Serialization, Persistence, Updates, and Wrapping Up",
        "Learn why cyclic graph references need a custom JSON boundary and why localStorage persistence is convenient but weak.",
        "Implement jsonify/fromString/persist/depersist, reload a saved graph, then document cycle handling, storage quota, multi-window overwrite risk, update consistency, missing indexes, and lack of durable server storage.",
        "If JSON.stringify fails, inspect for unbroken cycles before changing graph structure.",
        "README explains graph model, query interpreter, lazy execution, persistence strategy, and browser-storage limitations.",
        [dagobaApprovedResources[0], dagobaApprovedResources[3], dagobaApprovedResources[4]]
      )
    ],
    [
      "Review JavaScript objects, arrays, prototypes, Object.create, higher-order functions, and JSON basics.",
      "Draw a tiny property graph with vertex IDs, directed edges, and expected traversal answers before coding.",
      "Keep a fixture query whose program and output are both written down.",
      "Commit after graph core, query program recording, pipetype execution, persistence, and limitations notes."
    ],
    [
      "Demo adding vertices/edges and querying a relationship chain from a fixture graph.",
      "Add README artifacts for graph shape, query program array, lazy run trace, and JSON persistence round trip.",
      "Include one traversal-state or cyclic-serialization bug and how it was isolated.",
      "List why Dagoba is an educational in-memory graph database, not durable multi-user storage."
    ],
    "Built Dagoba-style graph database internals in JavaScript with vertex/edge identity, indexed graph storage, fluent query recording, lazy traversal execution, JSON serialization, local browser persistence, and explicit update/concurrency caveats.",
    ["Original AOSA chapter, TinkerPop traversal guide, and MDN prototype/JSON/localStorage references were read; approval is scoped to an in-memory educational graph database."]
  ),
  approvedTutorialOverride(
    "database-python-dbdb-dog-bed-database",
    "Individual review of AOSA DBDB chapter plus SQLite architecture/atomic-commit and Python persistence/fsync references",
    "Approved path for DBDB focused on storage/logical/interface layering, value references, immutable binary-tree updates, structural sharing, serialization boundaries, root-address commits, fsync/flush reasoning, and stale-reader/locking limits.",
    dbdbApprovedResources,
    [
      concept(
        "approved-dbdb-layered-storage-design",
        "DBDB separates physical, logical, and interface layers",
        "The chapter divides the database into storage bytes on disk, logical tree/value references, and a small user API, so each layer has one job to prove.",
        "Beginners need that map because persistence projects become confusing when file offsets, tree nodes, API methods, and command-line behavior are all debugged at once.",
        [
          "You can say which layer owns file reads and writes.",
          "You can say which layer owns tree search and references.",
          "You can trace a set/get call from tool interface down to storage and back."
        ],
        [dbdbApprovedResources[0], dbdbApprovedResources[1], dbdbApprovedResources[3]]
      ),
      concept(
        "approved-dbdb-immutable-tree-refs",
        "Immutable tree updates make commits understandable",
        "DBDB updates by creating new binary-tree nodes that share unchanged subtrees, while NodeRef and ValueRef objects hold either addresses or concrete referents.",
        "That design lets uncommitted changes exist in memory and become visible only after the new root address is committed.",
        [
          "You can explain why insert returns a new node instead of mutating the old one.",
          "You can draw structural sharing for one changed key.",
          "You can describe when a NodeRef has an address, a referent, or both."
        ],
        [dbdbApprovedResources[0], dbdbApprovedResources[3]]
      ),
      concept(
        "approved-dbdb-atomic-root-commit",
        "The root address is the commit point",
        "DBDB writes dirty referenced values first, flushes them, then writes the root address at the front of the file so readers see either the old tree or the new tree.",
        "This is the heart of the project: durability is not 'we wrote a file'; it is a carefully ordered promise about what survives crashes and what readers can observe.",
        [
          "You can explain why child/value refs are stored before the root address.",
          "You can say what flush and fsync are trying to guarantee.",
          "You can name a stale-read or concurrent-writer limitation honestly."
        ],
        [dbdbApprovedResources[0], dbdbApprovedResources[2], dbdbApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Start from the API contract",
        "Introduction, Architecture, and Discovering the Design",
        "Learn the promised behavior before internals: open a database, set a key, get a key, commit changes, close, and reopen.",
        "Write interface-level tests for set/get/delete-or-missing behavior, reopen persistence, stale-reader behavior, and expected errors before implementing storage details.",
        "If internal code feels aimless, return to the API tests and identify which promise is failing.",
        "Tests describe the user-visible database contract without depending on implementation classes.",
        [dbdbApprovedResources[0], dbdbApprovedResources[3]]
      ),
      checkpoint(
        "Implement storage and references separately",
        "Organisational Units, Physical Layer, and Logical Layer",
        "Learn the split between file storage addresses and logical object references.",
        "Implement Storage, ValueRef, and BinaryNodeRef enough to write/read one serialized value by address.",
        "If data cannot be read back, inspect raw address, bytes written, and referent/address state before changing tree code.",
        "A direct storage/ref test writes one value and reads it back by address.",
        [dbdbApprovedResources[0], dbdbApprovedResources[1], dbdbApprovedResources[3]]
      ),
      checkpoint(
        "Build immutable binary-tree updates",
        "Binary Tree and How It Works",
        "Learn search-tree lookup and structural sharing before durable commit.",
        "Implement get/set so updating a key creates new path nodes while unchanged branches are shared by reference.",
        "If an old value changes unexpectedly, inspect whether a node was mutated instead of copied.",
        "A tree diagram or test proves old and new roots share unchanged subtrees.",
        [dbdbApprovedResources[0], dbdbApprovedResources[3]]
      ),
      checkpoint(
        "Commit, reopen, and document guarantees",
        "How Commit Works, How NodeRefs Save Memory, and Patterns and Principles",
        "Learn DBDB's atomicity story: store dirty refs, flush data, write the root address, and release the writer lock.",
        "Implement commit/reopen proof tasks, then document stale reads, lockfile behavior, unbalanced tree performance, pickle/serialization trust boundaries, lack of compaction, and why B+ trees improve disk reads.",
        "If persistence appears flaky, log store order and root address before assuming the tree algorithm is wrong.",
        "README explains layers, immutable updates, ref storage, root-address commit, fsync purpose, and educational limits.",
        dbdbApprovedResources.slice(0, 5)
      )
    ],
    [
      "Review Python classes, file modes, bytes, dictionaries, binary search trees, recursion, and serialization risk.",
      "Write API-level tests before physical storage code so implementation changes cannot hide broken behavior.",
      "Use a temporary database file fixture and reopen it after every commit proof.",
      "Commit after API contract, storage/ref layer, immutable tree set/get, commit/reopen, and limitations notes."
    ],
    [
      "Demo set/get, commit, close, reopen, and old/new reader behavior with a tiny database file.",
      "Add README artifacts for architecture layers, NodeRef state, structural sharing, and commit order.",
      "Include one persistence-order or mutation bug and how it was diagnosed.",
      "List DBDB's intentional gaps: balancing, compaction, rich serialization safety, multi-writer concurrency, and production crash testing."
    ],
    "Built DBDB-style persistent key-value storage in Python with layered storage architecture, immutable binary-tree updates, address-backed references, serialized values, root-address commits, reopen proof tests, and explicit durability/concurrency limitations.",
    ["Original AOSA chapter, SQLite architecture/atomic-commit references, and Python persistence/fsync docs were read; approval is scoped to DBDB's educational key-value database, not a production storage engine."]
  ),
  approvedTutorialOverride(
    "database-c-let-s-build-a-simple-database",
    "Individual review of the full cstack SQLite-clone series, SQLite architecture/file-format docs, and C/POSIX I/O references",
    "Approved path for the cstack database tutorial focused on C prerequisites, REPL input handling, tiny SQL compiler and VM split, fixed row serialization, page-cache persistence, cursor traversal, B-tree leaf/internal node layout, binary search, node splitting, tests, and explicit non-SQLite durability limits.",
    cstackDatabaseApprovedResources,
    [
      concept(
        "approved-cstack-sqlite-layer-map",
        "SQLite is layers, not one giant parser",
        "The series mirrors SQLite's architecture in beginner-sized pieces: input text enters a REPL, a tiny compiler prepares statements, a VM executes them, a B-tree stores rows, and a pager reads/writes pages.",
        "This layer map keeps beginners from mixing syntax errors, execution bugs, memory layout bugs, and disk persistence bugs into one impossible problem.",
        [
          "You can place REPL, prepare_statement, execute_statement, B-tree, pager, and file I/O on a diagram.",
          "You can explain why meta-commands and SQL statements are handled separately.",
          "You can say which layer owns a bug before opening the code."
        ],
        [cstackDatabaseApprovedResources[0], cstackDatabaseApprovedResources[1]]
      ),
      concept(
        "approved-cstack-row-page-layout",
        "Rows become bytes inside pages",
        "The tutorial turns a Row struct into fixed offsets inside a page, then uses a pager to cache 4096-byte pages and flush them to a database file.",
        "That is the real beginner jump: durable storage means choosing a byte layout, not just saving a C struct and hoping every machine agrees.",
        [
          "You can compute ID, username, email, and row offsets.",
          "You can explain why little-endian layout and uninitialized bytes matter.",
          "You can trace get_page, pager_flush, and db_close for one saved row."
        ],
        [cstackDatabaseApprovedResources[0], cstackDatabaseApprovedResources[2], cstackDatabaseApprovedResources[4]]
      ),
      concept(
        "approved-cstack-cursor-btree-search",
        "Cursors separate traversal from storage shape",
        "The Cursor starts as row-number traversal, then evolves into page/cell traversal so selects and inserts can work after the table becomes a B-tree.",
        "This is subtle but important: query code should not need to know every detail of the current storage representation.",
        [
          "You can explain table_start, cursor_value, cursor_advance, and end_of_table.",
          "You can show why cursor state changes from row_num to page_num plus cell_num.",
          "You can trace select across leaf pages using next_leaf links."
        ],
        [cstackDatabaseApprovedResources[0], cstackDatabaseApprovedResources[2]]
      ),
      concept(
        "approved-cstack-btree-splitting",
        "B-tree growth is careful key bookkeeping",
        "The later parts build leaf-node and internal-node layouts, binary search insertion, duplicate-key checks, leaf splits, parent updates, sibling links, and internal-node splits.",
        "Beginners need to see this as a sequence of invariants: sorted keys, max-key separators, parent pointers, right child handling, and root changes.",
        [
          "You can say why keys in an internal node are maximum keys for left children.",
          "You can trace a leaf split and name the old node, new node, parent, and root cases.",
          "You can identify pointer-arithmetic or key-update bugs with `.btree` output."
        ],
        [cstackDatabaseApprovedResources[0], cstackDatabaseApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Build the REPL and tiny statement pipeline",
        "Parts 1-2: REPL, compiler, and VM skeleton",
        "Learn C line input, prompt loops, meta-command handling, result enums, prepared statement structs, and the compiler/VM split before storing data.",
        "Implement the REPL, `.exit`, prepare_statement for insert/select stubs, execute_statement, and result-code switches; then write a note mapping the code to SQLite's front-end and VM architecture.",
        "If the prompt hangs or commands fall through, inspect getline newline handling and the meta-command branch before changing statement execution.",
        "The program distinguishes `.exit`, insert, select, and unknown commands with predictable output.",
        [cstackDatabaseApprovedResources[0], cstackDatabaseApprovedResources[1], cstackDatabaseApprovedResources[3]]
      ),
      checkpoint(
        "Store rows in memory with tests",
        "Parts 3-4: append-only table and first bugs",
        "Learn fixed-size Row layout, serialization/deserialization, page slots, table capacity, Ruby-style black-box tests, string limits, and negative-ID validation.",
        "Implement Row, serialize_row, deserialize_row, row_slot, insert/select over the in-memory table, then add tests for successful insert/select, table full, too-long strings, and negative IDs.",
        "If selected data is corrupted, print offsets and raw row fields before debugging parser code.",
        "Tests prove row encoding, insert/select behavior, capacity handling, and input validation.",
        [cstackDatabaseApprovedResources[0], cstackDatabaseApprovedResources[2]]
      ),
      checkpoint(
        "Persist pages through a pager",
        "Parts 5-6: persistence and cursor abstraction",
        "Learn file descriptors, page cache misses, offsets, partial-page flushes, db_open/db_close, and cursor-based row access.",
        "Implement Pager, get_page, pager_flush, db_open, db_close, table_start, table_end, cursor_value, and cursor_advance; prove a row survives close/reopen.",
        "If persistence fails, separate open/lseek/read/write/close errors from row serialization errors.",
        "A restart test reads inserted rows from the database file and a cursor scan prints them in order.",
        [cstackDatabaseApprovedResources[0], cstackDatabaseApprovedResources[4], cstackDatabaseApprovedResources[2]]
      ),
      checkpoint(
        "Convert the table into B-tree pages",
        "Parts 7-10: B-tree intro, leaf format, search, and root split",
        "Learn leaf/internal node roles, common headers, leaf cells, node type/root flags, binary search, duplicate-key rejection, leaf splits, and creating a new root.",
        "Implement node layout helpers, `.constants`, `.btree`, table_find/leaf_node_find, duplicate-key checks, leaf_node_split_and_insert, get_unused_page_num, and create_new_root.",
        "If keys are unsorted or duplicated, inspect binary search result and leaf cell shifts before changing pager code.",
        "The tree output shows sorted keys, duplicate inserts fail, and inserting past one leaf creates a two-level tree.",
        [cstackDatabaseApprovedResources[0], cstackDatabaseApprovedResources[2]]
      ),
      checkpoint(
        "Finish multi-level traversal and document limits",
        "Parts 11-15: recursive search, sibling scan, parent updates, internal splits, and stopping point",
        "Learn recursive internal-node search, next_leaf sibling scans, parent pointers, parent key updates, right-child special handling, internal-node splitting, and the tutorial's unfinished status.",
        "Implement internal_node_find, leaf sibling links, cursor scans across leaves, node_parent, update_internal_node_key, internal_node_insert, internal_node_split_and_insert, and the final tree-print tests; then document missing SQL parsing, transactions, crash safety, deletion, variable-length rows, indexes, concurrency, portability, and ongoing maintenance.",
        "If a row appears corrupted, inspect whether key and value were written to the correct cell offsets before changing search logic.",
        "README explains the full layer map, byte/page layout, cursor abstraction, B-tree invariants, final tests, and why this is an educational SQLite clone rather than SQLite.",
        cstackDatabaseApprovedResources.slice(0, 5)
      )
    ],
    [
      "Review C pointers, structs, malloc/free, enums, strcmp/strncmp, sscanf/strtok, memcpy, fixed-width integers, file descriptors, lseek/read/write, and debugger basics.",
      "Treat this as a multi-session systems project; commit after every part and keep expected CLI transcripts as fixtures.",
      "Draw row/page/node layouts before writing pointer arithmetic.",
      "Run the test suite after REPL, row storage, persistence, cursor refactor, leaf search, leaf split, parent update, and internal split."
    ],
    [
      "Demo the CLI inserting, selecting, closing, reopening, and printing a multi-level B-tree.",
      "Add README artifacts for SQLite layer map, row/page byte layout, cursor state, and B-tree split diagrams.",
      "Include one real bug from the tutorial path, such as corrupted row data or bad internal-node key arithmetic, and how you diagnosed it.",
      "State the hard limits clearly: not production SQLite, no real SQL parser, no transactions, no crash-safe atomic commit, no deletion, no concurrency, and incomplete maintenance after part 14."
    ],
    "Built a SQLite-inspired database in C with REPL input, tiny SQL statement preparation, VM-style execution, fixed row serialization, page-cache persistence, cursor traversal, B-tree leaf/internal pages, binary search insertion, node splitting, black-box tests, and explicit storage-engine limits.",
    ["All 15 cstack series parts, SQLite architecture/file-format references, and C/POSIX I/O references were reviewed; approval is scoped to the educational SQLite clone through the tutorial's stopping point."]
  ),
  approvedTutorialOverride(
    "database-ruby-build-your-own-fast-persistent-kv-store-in-ruby",
    "Individual review of the Ruby Bitcask-style KV store article plus Bitcask, atomic-commit, and file-I/O references",
    "Approved path for the Ruby persistent key-value store focused on append-only data files, binary record layout, in-memory keydir indexing, write/read/delete API behavior, crash-recovery limits, tombstones, and compaction as the missing production feature.",
    rubyBitcaskApprovedResources,
    [
      concept(
        "approved-ruby-bitcask-append-log",
        "Writes append records instead of rewriting the database",
        "The tutorial follows the Bitcask idea: every set/delete operation appends a record to a data file, while the newest key location is remembered separately.",
        "Beginners need this because persistence is easier to reason about when writes are sequential and old records can remain as historical garbage until compaction.",
        [
          "You can describe why an append-only data file makes writes simple.",
          "You can explain why old values remain on disk after an update.",
          "You can name why a crash near the end of the file needs recovery checks."
        ],
        [rubyBitcaskApprovedResources[0], rubyBitcaskApprovedResources[1], rubyBitcaskApprovedResources[2]]
      ),
      concept(
        "approved-ruby-bitcask-keydir",
        "The keydir turns file offsets into fast reads",
        "The in-memory keydir maps each key to the file id, value size, value position, and timestamp for the newest record.",
        "That is the tradeoff that makes Bitcask-style reads fast: the database avoids scanning the file on every get, but all keys must fit in memory.",
        [
          "You can explain what metadata a keydir entry stores.",
          "You can rebuild the keydir by scanning records from disk.",
          "You can state the memory tradeoff without hand-waving."
        ],
        [rubyBitcaskApprovedResources[0], rubyBitcaskApprovedResources[1]]
      ),
      concept(
        "approved-ruby-bitcask-record-format",
        "Binary record format is the project contract",
        "The article defines record fields such as checksum, timestamp, key size, value size, key bytes, and value bytes before stitching writes and reads together.",
        "Beginners need to treat that byte format as an interface: one wrong length or offset means recovery and lookup both lie.",
        [
          "You can calculate the header size and value position for one record.",
          "You can explain how a tombstone represents delete.",
          "You can write a fixture that decodes raw bytes into a record."
        ],
        [rubyBitcaskApprovedResources[0], rubyBitcaskApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Learn the Bitcask data shape",
        "Bitcask and Data Format",
        "Learn the design before Ruby code: append-only data file, record header, key/value bytes, and in-memory keydir.",
        "Draw one record layout and one keydir entry, then write expected metadata for setting key `name` to `Ada`.",
        "If offsets feel fuzzy, compute byte sizes on paper before touching File operations.",
        "A written diagram shows record bytes and the keydir entry that should point to the value.",
        [rubyBitcaskApprovedResources[0], rubyBitcaskApprovedResources[1]]
      ),
      checkpoint(
        "Encode and append records",
        "Number System and Stiching Everything",
        "Learn Ruby binary packing, file append mode, timestamp/checksum placement, key/value sizes, and write offsets.",
        "Implement set so it appends one encoded record, stores value position/size in keydir, and can print the raw record fields for debugging.",
        "If get reads garbage, inspect the stored value position and value size before changing the keydir structure.",
        "A single set writes a record and the keydir points to the value bytes.",
        [rubyBitcaskApprovedResources[0], rubyBitcaskApprovedResources[3]]
      ),
      checkpoint(
        "Read, update, delete, and rebuild",
        "Closing thoughts and missing pieces",
        "Learn the full lifecycle: get follows keydir, updating a key appends a newer record, deleting uses a tombstone, and startup rebuilds index state from the log.",
        "Implement get, delete/tombstone behavior, and keydir rebuild by scanning records from disk after reopening the store.",
        "If deleted keys return old values, inspect tombstone handling and scan order during rebuild.",
        "Tests prove set/get/update/delete and close/reopen index recovery.",
        [rubyBitcaskApprovedResources[0], rubyBitcaskApprovedResources[1], rubyBitcaskApprovedResources[2]]
      ),
      checkpoint(
        "Document compaction and durability gaps",
        "Closing thoughts",
        "Learn what the tutorial intentionally leaves unfinished: compaction, checksums, partial-write recovery, file rotation, locks, fsync policy, and multi-process safety.",
        "Add a README limitations table and one optional compaction sketch that rewrites only live values into a clean file.",
        "If the project feels complete after get/set, compare it against Bitcask's memory and recovery tradeoffs.",
        "README explains append log, keydir, tombstones, recovery, compaction gap, and durability/concurrency limits.",
        rubyBitcaskApprovedResources.slice(0, 4)
      )
    ],
    [
      "Review Ruby files, strings/bytes, arrays and hashes, exceptions, binary packing, and tests.",
      "Write one exact record-layout example before implementing set/get.",
      "Use a temporary data directory and reopen the store in every persistence test.",
      "Commit after record encoding, set/get, update/delete, rebuild, and limitations notes."
    ],
    [
      "Demo set/get/update/delete across close and reopen.",
      "Add README artifacts for record layout, keydir entry, startup scan, and tombstone behavior.",
      "Include one offset or stale-keydir bug and how raw record inspection found it.",
      "State missing production pieces: checksums, compaction, file rotation, locking, fsync policy, and partial-write recovery."
    ],
    "Built a Bitcask-inspired Ruby key-value store with append-only record files, binary key/value layout, in-memory keydir lookup, update/delete tombstones, startup index rebuild, persistence tests, and explicit compaction/durability limits.",
    ["Original Ruby article, Bitcask overview, atomic-commit background, and file-I/O references were read; approval is scoped to a small educational append-log KV store."]
  ),
  approvedTutorialOverride(
    "database-clojure-an-archaeology-inspired-database",
    "Individual review of AOSA archaeology-inspired database plus Clojure data-structure and Datomic index/schema references",
    "Approved path for the archaeology-inspired database focused on Datomic-like datoms, entity/attribute/value/time facts, immutable storage, schema-aware attributes, EAVT/AEVT/AVET-style indexes, query shape, and historical database caveats.",
    archaeologyDbApprovedResources,
    [
      concept(
        "approved-archaeology-datoms-history",
        "Facts accumulate as datoms",
        "The chapter turns ordinary entity data into small facts. A fact says that one entity had one attribute with one value at a particular layer or time, and later changes add new evidence instead of overwriting the old fact in place.",
        "This is the core beginner shift from mutable rows to an archaeology-style database. You preserve the layers that explain how the data reached its current state, which makes history and auditability an explicit design goal instead of a side effect.",
        [
          "You can write one entity as several datoms.",
          "You can explain why adding a new fact differs from mutating a row.",
          "You can state what historical querying could mean for one changed value."
        ],
        [archaeologyDbApprovedResources[6], archaeologyDbApprovedResources[9], archaeologyDbApprovedResources[12], archaeologyDbApprovedResources[8]]
      ),
      concept(
        "approved-archaeology-layers-persistent-values",
        "Layers are database values, not hidden mutation",
        "The tutorial's `Database` and `Layer` records model each point in time as a value with storage, indexes, `top-id`, and `curr-time`. Clojure's immutable collections make it practical for later database values to share unchanged structure with earlier ones.",
        "Beginners need this before transactions make sense. The project is not just a map with helper functions; it is a sequence of database values where each new layer can reuse old entities and indexes safely.",
        [
          "You can point to the fields that describe one database snapshot.",
          "You can describe structural sharing without saying the whole database is copied.",
          "You can explain why returning a new database value is safer than changing the old one."
        ],
        [archaeologyDbApprovedResources[0], archaeologyDbApprovedResources[1], archaeologyDbApprovedResources[14], archaeologyDbApprovedResources[2]]
      ),
      concept(
        "approved-archaeology-multiple-indexes",
        "Different questions need different sorted indexes",
        "The same datoms are arranged in multiple orders so different lookup shapes start from the most selective component. Entity-first, attribute-first, value-first, and relationship-navigation indexes are not duplicates; they are different doors into the same facts.",
        "Beginners need this because indexing is not decoration. If a query starts with the wrong ordering, it turns into a scan; if it starts with the right ordering, it can narrow the search immediately.",
        [
          "You can explain what EAVT-like ordering answers quickly.",
          "You can explain why attribute/value lookup needs a different ordering.",
          "You can trace one query to the index it should use first."
        ],
        [archaeologyDbApprovedResources[7], archaeologyDbApprovedResources[11], archaeologyDbApprovedResources[13], archaeologyDbApprovedResources[14]]
      ),
      concept(
        "approved-archaeology-schema-metadata",
        "Schema gives attributes meaning",
        "The chapter stores attribute meaning next to the value by using type, cardinality, references, and Clojure metadata. That is the small educational version of a Datomic-like schema: the database can know whether a value is single or many, scalar or reference, and allowed or invalid.",
        "This is the bridge from a bag of triples to a database with rules. Without schema, every value is just a value; with schema, the transaction and query layers can reject invalid facts and interpret relationships intentionally.",
        [
          "You can explain the difference between an attribute's value and its metadata.",
          "You can describe cardinality one versus many in this project.",
          "You can name one invalid fact the schema should reject."
        ],
        [archaeologyDbApprovedResources[8], archaeologyDbApprovedResources[4], archaeologyDbApprovedResources[12], archaeologyDbApprovedResources[9]]
      ),
      concept(
        "approved-archaeology-query-transaction-scope",
        "Queries and transactions are intentionally small",
        "The project teaches query clauses and transactions as inspectable transformations over immutable database values. It can show inserts, updates, old snapshots, and clause-driven lookups without becoming a full Datomic implementation.",
        "That honesty matters for a portfolio project. A beginner should be able to say what was built, why it resembles Datomic, and where it stops: no production storage engine, query optimizer, distributed transactor, or operational guarantees.",
        [
          "You can trace one query clause to the index it narrows first.",
          "You can explain how `swap!` or transaction application creates a new database value.",
          "You can list at least four Datomic features this project does not implement."
        ],
        [archaeologyDbApprovedResources[10], archaeologyDbApprovedResources[9], archaeologyDbApprovedResources[5], archaeologyDbApprovedResources[15]]
      )
    ],
    [
      checkpoint(
        "Model entities as datoms",
        "Entities and Storage",
        "Learn entity IDs, attributes, values, type/cardinality metadata, transaction/time fields, and why one entity becomes several inspectable facts.",
        "Create datom records for one tiny domain object and write expected fact tuples before building indexes.",
        "If the data model feels abstract, compare one row-shaped object to its fact-shaped datoms.",
        "A fixture entity is represented as explicit datoms with attribute names and values.",
        [archaeologyDbApprovedResources[0], archaeologyDbApprovedResources[6], archaeologyDbApprovedResources[12], archaeologyDbApprovedResources[9]]
      ),
      checkpoint(
        "Build storage records and protocols",
        "Storage and Database",
        "Learn Clojure records, protocols, immutable maps, and the boundary between the database value and the storage provider.",
        "Implement the `Database`, `Layer`, entity, attribute, and storage protocol pieces, then prove storage can read, write, and drop entities without hidden mutation.",
        "If state changes unexpectedly, inspect whether a function returned a new value or mutated/reused the old one incorrectly.",
        "Tests show storage operations returning expected values and preserving old fixtures where appropriate.",
        [archaeologyDbApprovedResources[3], archaeologyDbApprovedResources[2], archaeologyDbApprovedResources[14], archaeologyDbApprovedResources[1]]
      ),
      checkpoint(
        "Build index orders deliberately",
        "Indexing the Data",
        "Learn EAVT, AVET, VEAT, and VAET as different sorted views over the same datom components.",
        "Implement the tutorial's index structures and prove entity lookup, attribute lookup, value lookup, and reference navigation choose different first keys.",
        "If a query scans too much, write which index order would have made the first narrowing step cheap.",
        "Tests show at least three query shapes using different indexes.",
        [archaeologyDbApprovedResources[7], archaeologyDbApprovedResources[11], archaeologyDbApprovedResources[13], archaeologyDbApprovedResources[14]]
      ),
      checkpoint(
        "Add schema and query behavior",
        "Schema and Querying",
        "Learn how schema gives attributes meaning and how query code turns pattern-like clauses into index lookups.",
        "Add a schema fixture, one valid transaction, one invalid/missing attribute case, and one multi-clause query.",
        "If a query returns too many facts, inspect clause binding order before changing storage.",
        "A query proof demonstrates schema-backed attributes and more than one clause.",
        [archaeologyDbApprovedResources[8], archaeologyDbApprovedResources[4], archaeologyDbApprovedResources[10], archaeologyDbApprovedResources[12]]
      ),
      checkpoint(
        "Prove history and document scope",
        "Conclusion and design review",
        "Learn what the project does and does not implement compared with Datomic: immutable facts and indexes, but not full distributed storage, production transactions, query optimizer, or operational tooling.",
        "Create a before/after database value for one changed fact, show what remains queryable, and document unsupported Datomic/database guarantees.",
        "If history disappears, inspect whether update code replaced state in place instead of returning a new database value.",
        "README explains datoms, indexes, schema, queries, persistent collections, and Datomic-inspired limitations.",
        [archaeologyDbApprovedResources[10], archaeologyDbApprovedResources[9], archaeologyDbApprovedResources[15], archaeologyDbApprovedResources[6]]
      )
    ],
    [
      "Review Clojure maps, sets, records, sequences, pure functions, immutable updates, and REPL-driven tests.",
      "Write datom examples for a tiny domain before implementing storage.",
      "Keep query fixtures small enough to inspect by hand.",
      "Commit after datom model, storage/indexes, schema checks, query clauses, and historical snapshot notes."
    ],
    [
      "Demo inserting facts, querying by entity and attribute/value, and preserving an older database value.",
      "Add README artifacts for datom tuples, index orderings, query clause binding, and structural sharing.",
      "Include one wrong-index or accidental-mutation bug and how it was found.",
      "List what the project borrows from Datomic and what it deliberately does not implement."
    ],
    "Built a Datomic-inspired educational database in Clojure with immutable datoms, schema-aware attributes, multiple sorted indexes, query fixtures, persistent snapshots, storage protocols, transaction examples, and explicit Datomic/production scope limits.",
    [
      "Original AOSA chapter, Clojure data-structure/datatypes/protocols/metadata/atoms docs, and Datomic overview/index/schema/transaction/query references were read; approval is scoped to the chapter's small educational database."
    ],
    { prerequisiteResources: archaeologyDbApprovedResources, prerequisiteResourceStrategy: "archaeology-db" }
  ),
  approvedTutorialOverride(
    "database-rust-build-your-own-redis-client-and-server",
    "Individual review of Tokio Mini-Redis tutorial sections plus Redis RESP protocol specification",
    "Approved path for the Tokio Mini-Redis tutorial focused on Rust async prerequisites, client proof, per-connection task spawning, shared HashMap state, command execution, channel-based coordination, RESP framing, buffered I/O, async state-machine caveats, and production Redis limits.",
    tokioRedisApprovedResources,
    [
      concept(
        "approved-tokio-redis-async-task-model",
        "Async work pauses without blocking the thread",
        "The tutorial uses async functions, `.await`, the Tokio runtime, and spawned tasks so many connections can make progress without one connection blocking the accept loop.",
        "Beginners need this before server code makes sense: async Rust is a state machine that can pause at `.await`, and spawned tasks must own the data they keep across those pauses.",
        [
          "You can explain why `client::connect(...).await` pauses the task.",
          "You can say why each accepted TCP socket is moved into a spawned task.",
          "You can debug a `'static` or `Send` compile error by finding data held across `.await`."
        ],
        [tokioRedisApprovedResources[0], tokioRedisApprovedResources[1]]
      ),
      concept(
        "approved-tokio-redis-state-boundary",
        "Shared state needs an explicit boundary",
        "Mini-Redis starts with a shared HashMap guarded by synchronization, then introduces channel-based coordination so tasks can communicate without freely mutating everything.",
        "This teaches a real server habit: connection handling, command parsing, and data ownership should be separate enough that concurrency bugs have a place to live.",
        [
          "You can explain why `Arc` is needed when multiple tasks share database state.",
          "You can name why holding a lock across `.await` is dangerous.",
          "You can describe when a channel/message-passing design is cleaner than shared mutable state."
        ],
        [tokioRedisApprovedResources[1], tokioRedisApprovedResources[2]]
      ),
      concept(
        "approved-tokio-redis-resp-framing",
        "RESP frames sit between bytes and commands",
        "The framing layer converts a TCP byte stream into Redis frames such as arrays, bulk strings, simple strings, integers, errors, and nulls before command code decides what SET or GET means.",
        "Beginners need this separation because socket reads are arbitrary chunks: a read can contain a partial frame, one frame, or multiple frames.",
        [
          "You can encode a SET command as a RESP array of bulk strings.",
          "You can explain why `read_frame` needs a buffer.",
          "You can separate protocol parsing bugs from command execution bugs."
        ],
        [tokioRedisApprovedResources[3], tokioRedisApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Prove the async client before writing the server",
        "Setup and Hello Tokio",
        "Learn cargo setup, Tokio dependencies, Mini-Redis test server, async main, `.await`, and a SET/GET round trip.",
        "Run the official Mini-Redis server, write the hello client, set `hello=world`, read it back, and write a note explaining what `.await` does at each network boundary.",
        "If the client hangs, check that the server is running and that you are connecting to the expected host and port before changing async code.",
        "The client prints `Some(b\"world\")` and the README explains async main, runtime startup, and `.await` in plain language.",
        [tokioRedisApprovedResources[0]]
      ),
      checkpoint(
        "Accept sockets and spawn per-connection tasks",
        "Spawning",
        "Learn TcpListener, accept loops, TcpStream ownership, task spawning, `'static` bounds, Send bounds, and why a single connection must not block the accept loop.",
        "Move the client into an example, create the server accept loop, print one incoming frame, then spawn a task per accepted socket.",
        "If the compiler complains about lifetimes or Send, identify what data crosses the spawned task boundary or an `.await` point.",
        "Multiple client runs can connect while the server continues accepting connections.",
        [tokioRedisApprovedResources[1], tokioRedisApprovedResources[4]]
      ),
      checkpoint(
        "Implement command handling with safe state ownership",
        "Shared state and Channels",
        "Learn the database as shared state: parse GET/SET frames, execute commands, and decide whether state is guarded by Arc/Mutex or coordinated by a manager task and channels.",
        "Implement a tiny HashMap-backed command executor with GET and SET, then add a test or trace for two concurrent clients touching different keys.",
        "If the server deadlocks or stalls, inspect whether a lock is held across `.await` or whether a response channel is never answered.",
        "GET/SET work from separate clients and the README explains state ownership and synchronization tradeoffs.",
        [tokioRedisApprovedResources[2], tokioRedisApprovedResources[1]]
      ),
      checkpoint(
        "Build the RESP framing boundary",
        "I/O and Framing",
        "Learn AsyncRead/AsyncWrite, partial reads, EOF, BytesMut buffering, frame parsing, and writing frames back to the socket.",
        "Implement or trace the Connection wrapper that buffers bytes until a full frame is available, then write simple string, error, bulk, null, and array replies.",
        "If parsing fails intermittently, log buffer contents and frame completeness before changing command logic.",
        "A raw RESP SET/GET command is parsed into frames and a valid RESP reply is written back.",
        [tokioRedisApprovedResources[3], tokioRedisApprovedResources[4]]
      ),
      checkpoint(
        "Document async and Redis scope honestly",
        "Async in depth, Select, Streams, and final review",
        "Learn the later caveats: futures are polled state machines, select chooses between async branches, streams yield many async values, and Mini-Redis remains an educational subset.",
        "Add proof notes for one cancellation/select or stream example if you implement pub/sub, then document missing Redis features: persistence, eviction, transactions, clustering, authentication, RESP3 completeness, pub/sub edge cases, command coverage, and production observability.",
        "If the final project feels production-ready, compare it against the RESP spec and the Mini-Redis tutorial warning about missing real-library features.",
        "README explains async tasks, shared state, channels, RESP framing, supported commands, and omitted production Redis behavior.",
        tokioRedisApprovedResources.slice(0, 5)
      )
    ],
    [
      "Review Rust ownership, borrowing, Result, enums, pattern matching, traits, async/await, Cargo, and basic TCP before starting.",
      "Run the official mini-redis server/client first so protocol bugs are not confused with setup bugs.",
      "Keep separate files or modules for server accept loop, command execution, and connection framing.",
      "Commit after hello client, spawned server, shared-state command executor, RESP framing, and scope/limitations notes."
    ],
    [
      "Demo two clients setting/getting keys through your server.",
      "Add README artifacts for async task lifecycle, shared-state ownership, RESP frame examples, and partial-read buffering.",
      "Include one Rust async compiler error or framing bug and how you diagnosed it.",
      "List exactly which Redis commands/protocol features are supported and which production Redis guarantees are omitted."
    ],
    "Built a Tokio-powered Mini-Redis-style client/server in Rust with async client proof, concurrent TCP accept loop, per-connection tasks, shared state or channel coordination, RESP frame parsing/writing, GET/SET command execution, and explicit async/Redis subset limits.",
    ["Tokio Mini-Redis tutorial sections and Redis RESP specification were read; approval is scoped to an educational async Rust Redis subset, not a production Redis-compatible server."]
  ),
  approvedTutorialOverride(
    "database-c-build-your-own-redis-from-scratch",
    "Individual review of Build Your Own Redis C/C++ chapters plus Redis RESP and Linux socket/epoll references",
    "Approved path for the C/C++ Redis-from-scratch book focused on TCP byte streams, length-prefixed protocol parsing, read/write loops, nonblocking sockets, event loop readiness, key-value command execution, custom hash tables, serialization, sorted sets, TTL expiration, thread-pool boundaries, and explicit Redis compatibility limits.",
    cppRedisApprovedResources,
    [
      concept(
        "approved-cpp-redis-tcp-protocol",
        "TCP is bytes, so Redis needs message framing",
        "The early chapters teach that TCP does not preserve message boundaries, so the server must define a protocol and loop until it has read or written the exact bytes needed.",
        "Beginners often assume one write equals one read; this project forces the correct mental model before adding Redis commands.",
        [
          "You can explain why `read_full` and `write_all` loop.",
          "You can draw the tutorial's 4-byte length header plus payload format.",
          "You can compare the tutorial protocol with RESP arrays and bulk strings."
        ],
        [cppRedisApprovedResources[1], cppRedisApprovedResources[2], cppRedisApprovedResources[9], cppRedisApprovedResources[10]]
      ),
      concept(
        "approved-cpp-redis-event-loop",
        "An event loop keeps many connections moving",
        "The book moves from one blocking connection to nonblocking sockets and an event loop that tracks which file descriptors are ready for reads, writes, timers, and background work.",
        "That is the key step from a toy server to Redis-shaped infrastructure: concurrency is explicit readiness bookkeeping, not one thread per tiny wait.",
        [
          "You can describe a connection state machine with read and write buffers.",
          "You can explain level-triggered readiness and why nonblocking file descriptors matter.",
          "You can identify where idle connections, timers, and worker completions reenter the loop."
        ],
        [cppRedisApprovedResources[3], cppRedisApprovedResources[11], cppRedisApprovedResources[10]]
      ),
      concept(
        "approved-cpp-redis-data-structures",
        "Redis behavior comes from chosen data structures",
        "The advanced chapters replace placeholder maps with custom chained hash tables, intrusive nodes, serialized response types, balanced trees, sorted sets, TTL heaps, and a thread pool.",
        "Beginners need to see Redis as a networked data-structure server, not a mystery cache: each command is fast because a specific structure supports it.",
        [
          "You can explain why top-level keys use a hash table.",
          "You can say why sorted sets need both lookup by name and ordering by score.",
          "You can connect TTL expiration to a heap or timer structure."
        ],
        [cppRedisApprovedResources[5], cppRedisApprovedResources[6], cppRedisApprovedResources[7], cppRedisApprovedResources[8]]
      )
    ],
    [
      checkpoint(
        "Build blocking sockets and a toy protocol first",
        "Socket Programming, TCP Server and Client, and Request-Response Protocol",
        "Learn socket(), bind(), listen(), accept(), connect(), read(), write(), EOF, errno, and byte-stream message framing before adding concurrency.",
        "Implement the blocking client/server and the length-prefixed request/response protocol; add fixtures for short reads, long payload rejection, EOF, and two requests on one connection.",
        "If a request is split or glued together, stop assuming read/write boundaries and inspect the buffered byte count.",
        "Client and server exchange multiple framed messages over one TCP connection with robust read/write loops.",
        [cppRedisApprovedResources[1], cppRedisApprovedResources[2], cppRedisApprovedResources[10], cppRedisApprovedResources[9]]
      ),
      checkpoint(
        "Move to nonblocking evented I/O",
        "Concurrent IO Models and Event Loop",
        "Learn nonblocking sockets, readiness notification, per-connection buffers, interest lists, ready lists, and connection cleanup.",
        "Implement the event loop version that accepts multiple clients, stores read/write state per connection, and only reads/writes when the fd is ready.",
        "If CPU spins or a connection starves, inspect nonblocking flags, readiness registration, and whether buffers are fully drained or flushed.",
        "Several clients can connect and receive replies without one slow client blocking the server.",
        [cppRedisApprovedResources[3], cppRedisApprovedResources[11], cppRedisApprovedResources[10]]
      ),
      checkpoint(
        "Implement GET/SET/DEL over the event loop",
        "Key-Value Server",
        "Learn command parsing, key/value ownership, reply types, and simple database state inside the evented server.",
        "Implement SET, GET, DEL, and a small response convention; then test missing keys, overwritten keys, invalid commands, and multiple commands per connection.",
        "If state looks stale, inspect command parse output before changing the hash table.",
        "The server behaves as a networked key-value store with visible success, missing-key, and error responses.",
        [cppRedisApprovedResources[4], cppRedisApprovedResources[9], cppRedisApprovedResources[2]]
      ),
      checkpoint(
        "Replace placeholders with Redis-shaped structures",
        "Hashtables, Data Serialization, Balanced Binary Tree, and Sorted Set",
        "Learn why Redis implements data structures deliberately: progressive hash table resizing for latency, intrusive nodes for stable references, typed serialization, and sorted-set dual indexing.",
        "Implement or trace the custom hash table, serialization format, tree-backed sorted set, and enough tests to prove lookup, ordering, and response encoding.",
        "If a node vanishes or a pointer is wrong, draw ownership and embedded-node offsets before editing memory code.",
        "Tests prove hash lookup/resizing behavior, serialized replies, and sorted-set ordering.",
        [cppRedisApprovedResources[5], cppRedisApprovedResources[6], cppRedisApprovedResources[7], cppRedisApprovedResources[9]]
      ),
      checkpoint(
        "Add TTL/thread-pool scope and document Redis gaps",
        "Timer and Timeout, Cache Expiration with TTL, Thread Pool, and final review",
        "Learn timers, heap-based expiration, idle timeouts, background work, and where threaded work must return safely to the event loop.",
        "Add TTL expiration and one background-task proof, then document missing real Redis features: RESP completeness, persistence, replication, clustering, ACL/auth, transactions, Lua/scripts, pub/sub completeness, eviction policies, observability, and cross-platform portability.",
        "If expirations happen late or early, inspect monotonic time, heap ordering, and event-loop timeout calculation.",
        "README explains protocol, event loop, KV commands, hash table, sorted set, TTL, thread pool, and production Redis omissions.",
        cppRedisApprovedResources.slice(0, 12)
      )
    ],
    [
      "Review C/C++ pointers, structs, dynamic allocation, errno, file descriptors, sockets, byte order, nonblocking I/O, and debugger basics.",
      "Run each chapter's small proof before adding the next layer; keep protocol transcripts as fixtures.",
      "Draw the connection state machine and buffer ownership before implementing the event loop.",
      "Commit after blocking protocol, nonblocking event loop, KV commands, hash table, serialization, sorted set, TTL, and scope notes."
    ],
    [
      "Demo multiple clients using SET/GET/DEL against the evented server.",
      "Add README artifacts for byte-stream framing, event-loop state, response serialization, hash table resizing, sorted-set dual index, and TTL heap.",
      "Include one short-read/event-loop/pointer bug and how it was isolated.",
      "State exactly which Redis commands and production guarantees are absent."
    ],
    "Built a Redis-inspired C/C++ server with TCP socket handling, length-prefixed protocol framing, robust read/write loops, nonblocking event-loop concurrency, GET/SET/DEL command execution, custom hash table, typed serialization, sorted sets, TTL expiration, thread-pool integration, and explicit Redis compatibility limits.",
    ["Build Your Own Redis chapters, Redis RESP specification, and Linux socket/epoll references were read; approval is scoped to the educational C/C++ Redis-like server, not full Redis compatibility."]
  ),
  approvedTutorialOverride(
    "distributed-systems-java-building-your-own-kafka-like-system-from-scratch-a-step",
    "Individual review of buildthingsuseful Build Your Own Kafka repository source plus Apache Kafka/ZooKeeper and Java NIO references",
    "Approved path for the Java Kafka-like tutorial focused on a simplified broker cluster, custom byte protocol, append-only partition logs, file indexes, ZooKeeper coordination, producer/consumer clients, and explicit gaps from real Kafka.",
    simpleKafkaApprovedResources,
    [
      concept(
        "approved-simple-kafka-scope",
        "Kafka-shaped, not Kafka-compatible",
        "This project is valuable because it builds a tiny system with Kafka-shaped parts: brokers, topics, partitions, producers, consumers, metadata, and replication messages.",
        "The beginner must also know the boundary: it is not the Kafka wire protocol, it does not implement consumer groups, real retention, in-sync replicas, KRaft, security, transactions, compaction, or exactly-once guarantees.",
        [
          "You can name which classes implement broker, partition, protocol, ZooKeeper, producer, and consumer behavior.",
          "You can explain topics and partitions without claiming full Kafka compatibility.",
          "You can list at least five production Kafka features this tutorial intentionally omits."
        ],
        [simpleKafkaApprovedResources[0], simpleKafkaApprovedResources[1], simpleKafkaApprovedResources[8]]
      ),
      concept(
        "approved-simple-kafka-byte-protocol",
        "A broker protocol is bytes with a contract",
        "The Protocol class uses ByteBuffer to encode request and response types, topic lengths, partitions, offsets, message sizes, metadata, and errors into a custom binary format.",
        "This is the bridge from beginner Java to distributed systems: clients and brokers only understand each other because both sides follow the same byte-level contract.",
        [
          "You can trace one produce request field by field.",
          "You can explain why the code writes lengths before variable-size strings or messages.",
          "You can distinguish protocol bugs from storage or ZooKeeper bugs."
        ],
        [simpleKafkaApprovedResources[3], simpleKafkaApprovedResources[5], simpleKafkaApprovedResources[10], simpleKafkaApprovedResources[11]]
      ),
      concept(
        "approved-simple-kafka-partition-log",
        "Partitions are append-only logs with offsets",
        "The Partition class writes each message to segment files, stores an index from offset to file position, rolls segments, and reads messages back from a requested offset.",
        "This gives beginners the core storage idea behind log systems: durable order comes from appending bytes and remembering where each logical offset lives.",
        [
          "You can explain nextOffset, segment base offset, and index entry.",
          "You can say why append uses a write lock and read uses a read lock.",
          "You can debug a missing message by checking offset, index position, and log bytes separately."
        ],
        [simpleKafkaApprovedResources[2], simpleKafkaApprovedResources[12], simpleKafkaApprovedResources[11], simpleKafkaApprovedResources[8]]
      ),
      concept(
        "approved-simple-kafka-zookeeper-coordination",
        "ZooKeeper is the cluster notice board",
        "The tutorial uses ZooKeeper znodes for broker membership, topic/partition metadata, watches, and a controller election through an ephemeral /controller node.",
        "That matters because distributed systems need a source of shared coordination before brokers can agree who exists, who leads, and what topic metadata should be loaded.",
        [
          "You can explain persistent versus ephemeral znodes in this project.",
          "You can trace how broker membership changes update local metadata.",
          "You can describe why the controller election is educational but not a full production failover design."
        ],
        [simpleKafkaApprovedResources[4], simpleKafkaApprovedResources[9], simpleKafkaApprovedResources[1]]
      ),
      concept(
        "approved-simple-kafka-client-flow",
        "Clients bootstrap, fetch metadata, then talk to leaders",
        "The SimpleKafkaClient connects to one bootstrap broker, asks for metadata, chooses the leader for a topic partition, and sends produce/fetch requests there.",
        "This is the practical client-side lesson: distributed clients first discover the cluster map, then route work according to that map.",
        [
          "You can describe bootstrap broker versus partition leader.",
          "You can show when refreshMetadata is called.",
          "You can explain why a producer randomly chooses a partition while a consumer polls one partition from an offset."
        ],
        [simpleKafkaApprovedResources[5], simpleKafkaApprovedResources[6], simpleKafkaApprovedResources[7], simpleKafkaApprovedResources[8]]
      )
    ],
    [
      checkpoint(
        "Set up the Java 11 Maven project and one broker",
        "Project structure and local run",
        "Learn the Maven pom, Java 11 target, shaded jar, ZooKeeper dependency, and command-line broker arguments before distributed behavior.",
        "Run or trace `mvn clean package`, start ZooKeeper, and start one broker; record which directories and ZooKeeper paths are expected.",
        "If startup fails, separate Maven build errors, ZooKeeper connection errors, and broker port conflicts before changing code.",
        "One broker starts with a clean data directory and can register its identity path.",
        [simpleKafkaApprovedResources[0], simpleKafkaApprovedResources[14], simpleKafkaApprovedResources[4], simpleKafkaApprovedResources[9]]
      ),
      checkpoint(
        "Implement and test the byte protocol",
        "Core protocol layer",
        "Learn request/response type bytes, ByteBuffer position/limit, length-prefixed strings, offsets, message sizes, metadata responses, and error frames.",
        "Write small encode/decode fixtures for produce, fetch, metadata, create-topic, replicate, and error responses before using sockets.",
        "If decoding fails, print the buffer position after every field and compare client and broker field order.",
        "Protocol fixtures prove both sides agree on field order and lengths.",
        [simpleKafkaApprovedResources[3], simpleKafkaApprovedResources[11], simpleKafkaApprovedResources[5], simpleKafkaApprovedResources[1]]
      ),
      checkpoint(
        "Build partition storage with segments and indexes",
        "Storage layer",
        "Learn append-only log files, active segment rollover, file channels, force-to-disk calls, offset-to-position indexes, and read/write locks.",
        "Append messages, inspect the `.log` and `.index` files, then fetch from offsets 0, a middle offset, and the log end.",
        "If fetch returns the wrong bytes, debug in this order: requested offset, chosen segment, index position, message length, message body.",
        "A partition can append, reopen, count existing messages, and read messages from a chosen offset.",
        [simpleKafkaApprovedResources[2], simpleKafkaApprovedResources[12], simpleKafkaApprovedResources[11], simpleKafkaApprovedResources[8]]
      ),
      checkpoint(
        "Wire ZooKeeper coordination and topic metadata",
        "Zookeeper integration and topic creation",
        "Learn broker registration, `/brokers`, `/topics`, `/controller`, ephemeral nodes, persistent topic metadata, watches, controller election, and partition assignment.",
        "Start multiple brokers, create a topic, then inspect how leaders/followers and partition paths are stored and loaded.",
        "If brokers disagree about metadata, inspect ZooKeeper node data before socket forwarding or storage code.",
        "Multiple brokers can see the same topic metadata and one broker acts as controller.",
        [simpleKafkaApprovedResources[4], simpleKafkaApprovedResources[9], simpleKafkaApprovedResources[1], simpleKafkaApprovedResources[0]]
      ),
      checkpoint(
        "Handle produce, fetch, forwarding, and best-effort replication",
        "Broker behavior",
        "Learn the broker's request dispatcher, leader check, forwarding to the leader, asynchronous follower replication, fetch-from-offset behavior, and metadata response construction.",
        "Produce to a partition leader, produce through a non-leader broker, fetch messages back, and observe replication messages to followers.",
        "If replication looks successful too early, remember the broker sends the produce response without waiting for follower durability; document that limitation instead of hiding it.",
        "A broker can create topics, accept produce/fetch/metadata requests, forward to leaders, and attempt follower replication.",
        [simpleKafkaApprovedResources[1], simpleKafkaApprovedResources[2], simpleKafkaApprovedResources[3], simpleKafkaApprovedResources[4]]
      ),
      checkpoint(
        "Build producer/consumer demos and document real Kafka gaps",
        "Client library and test system",
        "Learn bootstrap metadata lookup, leader routing, random partition selection, consumer polling from an offset, and the difference between demo clients and production Kafka clients.",
        "Run the sample producer and consumer against three brokers, capture the offsets/messages, and write a limitations table comparing the toy project with Apache Kafka.",
        "If the demo only works once, clean data/ZooKeeper state and verify topic metadata before blaming client code.",
        "README proves produce/consume behavior and honestly lists missing Kafka features such as real protocol compatibility, ISR durability, consumer groups, committed offsets, retention, compaction, transactions, security, monitoring, KRaft, and operational hardening.",
        simpleKafkaApprovedResources.slice(0, 15)
      )
    ],
    [
      "Refresh Java classes, exceptions, collections, threads/executors, Maven basics, terminal use, and local port troubleshooting before starting.",
      "Read the repository README and skim each source file once to map broker, partition, protocol, ZooKeeper, and client responsibilities.",
      "Use the Medium article only as a backup if it is accessible; keep the GitHub source as the auditable project truth.",
      "Commit after protocol fixtures, partition storage, ZooKeeper registration, broker request handling, client demos, and limitations documentation."
    ],
    [
      "Demo three brokers, one topic, one producer run, and one consumer run from offset 0.",
      "Add README diagrams for byte protocol fields, partition log/index files, ZooKeeper paths, and client metadata routing.",
      "Include one bug story from protocol decoding, file-offset indexing, ZooKeeper state, or leader forwarding.",
      "Add a clear limitations table so the project reads as a serious educational Kafka-like system, not a misleading Kafka replacement."
    ],
    "Built a Java Kafka-like messaging system with Maven setup, custom binary protocol, broker request dispatch, append-only partition logs, offset indexes, ZooKeeper membership/controller/topic metadata, leader-aware produce/fetch handling, producer and consumer demos, and explicit non-production Kafka gaps.",
    [
      "Repository README, pom, broker, partition, protocol, ZooKeeper client, producer, consumer, Apache Kafka introduction, ZooKeeper overview, Java socket/NIO references, and Maven quickstart were reviewed.",
      "The linked Medium article is treated as optional backup because extraction may be blocked; approval is grounded in the auditable GitHub repository source.",
      "Replication is described as educational and best-effort because the broker does not wait for follower durability before acknowledging a produce request."
    ]
  ),
  approvedTutorialOverride(
    "web-server-python-a-simple-web-server",
    "Individual review of AOSA 'A Simple Web Server' plus MDN HTTP and socket resources",
    "Approved path for the AOSA Python web-server tutorial focused on HTTP text anatomy, handler methods, dynamic page generation, and separating reusable server plumbing from application behavior.",
    aosaSimpleWebServerResources,
    [
      concept(
        "approved-aosa-http-text",
        "HTTP as inspectable text",
        "This tutorial is valuable for beginners because it shows that an HTTP request can be read as structured text: method, path, headers, optional body, and response pieces.",
        "A learner who can mark those pieces can understand why the server starts with one static page and then grows toward dynamic behavior.",
        [
          "You can identify method, path, headers, blank line, and body in a raw request.",
          "You can explain why `Content-Length` matters when sending a response.",
          "You can describe why HTTP being stateless makes cookies/application state necessary."
        ],
        aosaSimpleWebServerResources.slice(0, 4)
      ),
      concept(
        "approved-aosa-handler-boundary",
        "Reusable handler boundary",
        "The chapter deliberately separates request handling from page creation so the learner sees which code is server plumbing and which code is application behavior.",
        "That boundary is the bridge from a tiny BaseHTTPServer demo to framework-style thinking without hiding the HTTP cycle.",
        [
          "You can point to the code that starts the server.",
          "You can point to the method that handles GET requests.",
          "You can explain why dynamic page creation should not be mixed into every protocol step."
        ],
        [aosaSimpleWebServerResources[0], aosaSimpleWebServerResources[2], aosaSimpleWebServerResources[3]]
      )
    ],
    [
      checkpoint(
        "Run Hello, Web locally",
        "Hello, Web",
        "Learn the server address, port, request handler class, and the minimum page response before adding dynamic content.",
        "Run the tiny server, open localhost in a browser, and record the browser output plus the server log line.",
        "If the page does not load, check port, server process, and whether the handler sends headers before the body.",
        "A browser displays the hardcoded page and the terminal logs the GET request.",
        aosaSimpleWebServerResources.slice(0, 4)
      ),
      checkpoint(
        "Display request values",
        "Displaying Values",
        "Learn how request metadata becomes page data and why debugging starts by making hidden request fields visible.",
        "Render method, path, client address, or time into a simple HTML table.",
        "If values are blank, inspect the request handler fields before formatting HTML.",
        "A non-root path visibly changes the displayed request values.",
        [aosaSimpleWebServerResources[0], aosaSimpleWebServerResources[1], aosaSimpleWebServerResources[3]]
      ),
      checkpoint(
        "Separate page creation from response sending",
        "Creating Pages",
        "Learn the boundary between generating application content and writing a correct HTTP response.",
        "Move page assembly into a helper and keep status/header/body sending in a separate helper.",
        "If the response breaks after refactoring, compare the final headers/body with the previous working version.",
        "The same page still renders after the code is split into clearer responsibilities.",
        [aosaSimpleWebServerResources[0], aosaSimpleWebServerResources[2], aosaSimpleWebServerResources[3]]
      ),
      checkpoint(
        "Explain the framework shape",
        "Design reflection",
        "Learn why web frameworks exist by naming what this tutorial handles manually and what it delegates to Python's server library.",
        "Add a README diagram for browser, socket/server, handler, page generator, and response.",
        "If the diagram is fuzzy, trace one request from browser URL to final HTML bytes.",
        "README explains the request cycle, statelessness, and what production servers/frameworks still add.",
        aosaSimpleWebServerResources.slice(0, 5)
      )
    ],
    [
      "Read the AOSA Background section and write the HTTP request/response fields from memory.",
      "Run a tiny Python script first so interpreter setup is not confused with server behavior.",
      "Create a local notes file for request logs and observed browser paths.",
      "Commit after the first static page before adding dynamic values."
    ],
    [
      "Demo localhost serving the static page and a dynamic request-value page.",
      "Add a README request-cycle diagram.",
      "Include one malformed-response or wrong-path bug and how it was diagnosed.",
      "List missing production features such as concurrency, TLS, robust parsing, and routing."
    ],
    "Built the AOSA Python web-server tutorial as a beginner-readable HTTP request/response project with handler boundaries and dynamic page proof.",
    ["Source extraction is full and the tutorial has explicit HTTP/background/Hello Web sections."]
  ),
  approvedTutorialOverride(
    "front-end-framework-library-javascript-build-your-own-react",
    "Individual review of Rodrigo Pombo's Build Your Own React plus React/Redux/MDN framework resources",
    "Approved path for the Pombo Build Your Own React tutorial focused on createElement, render, fibers, reconciliation, function components, and hooks as a staged mental model.",
    pombReactResources,
    [
      concept(
        "approved-pomb-elements",
        "Elements are plain descriptions",
        "The tutorial starts by replacing JSX and React.createElement with plain objects containing type and props, which is the right beginner entry point.",
        "This prevents learners from thinking React starts with magic DOM updates; it starts with a data description of desired UI.",
        [
          "You can turn a tiny JSX snippet into a createElement call.",
          "You can describe type, props, and children.",
          "You can explain why primitive children are wrapped for this teaching implementation."
        ],
        pombReactResources.slice(0, 4)
      ),
      concept(
        "approved-pomb-fiber-reconciliation",
        "Fiber work loop before hooks",
        "The tutorial's deeper value is showing that rendering can be split into units of work, then committed, reconciled, and finally extended to components/hooks.",
        "Beginners need this order so hooks do not arrive as disconnected API trivia.",
        [
          "You can distinguish render phase from commit phase.",
          "You can explain why units of work can avoid blocking.",
          "You can trace one state update through function component and hook handling."
        ],
        [pombReactResources[0], pombReactResources[2], pombReactResources[3]]
      )
    ],
    [
      checkpoint(
        "Rewrite JSX as element objects",
        "Step Zero and Step I",
        "Learn JSX transformation, createElement, props, and children before touching the DOM.",
        "Implement createElement and print the object tree for a nested example.",
        "If render output is wrong later, inspect the element tree first.",
        "A nested JSX-like example produces the expected plain object tree.",
        pombReactResources.slice(0, 4)
      ),
      checkpoint(
        "Render and commit DOM nodes",
        "Step II and render function",
        "Learn how a desired element tree becomes real DOM nodes with properties and text children.",
        "Render a small tree into a container and compare the DOM with the element object.",
        "If nothing appears, inspect container lookup, element type, and text element handling.",
        "The browser displays a nested tree created by your Didact render function.",
        [pombReactResources[0], pombReactResources[1], pombReactResources[3]]
      ),
      checkpoint(
        "Split work into fibers",
        "Concurrent Mode and Fibers",
        "Learn fibers as units of work with links to child, sibling, and parent so rendering can be paused and resumed.",
        "Build the work loop and inspect the nextUnitOfWork path for a small tree.",
        "If work loops forever, print child/sibling/parent links for each fiber.",
        "A small tree renders through the fiber work loop without blocking the conceptual model.",
        [pombReactResources[0], pombReactResources[2], pombReactResources[3]]
      ),
      checkpoint(
        "Reconcile components and hooks",
        "Reconciliation, Function Components, Hooks",
        "Learn updates as comparing old and new fibers, then add function components and a minimal useState model.",
        "Implement one stateful function component and document what real React does beyond this tutorial.",
        "If state updates render stale UI, inspect hook index/order and alternate fiber references.",
        "A button or input updates state through the tutorial's hook path and README explains missing React features.",
        pombReactResources.slice(0, 4)
      )
    ],
    [
      "Review DOM elements versus React elements using one handwritten object tree.",
      "Create a tiny browser page with a root container and no build-system complexity beyond what the tutorial needs.",
      "Write the eight tutorial steps as a checklist before coding.",
      "Commit after createElement, render, fibers, reconciliation, and hooks separately."
    ],
    [
      "Demo a stateful function component rendered by the mini React.",
      "Add a README diagram for element tree, fiber tree, render phase, and commit phase.",
      "Include one bug involving child/sibling/parent links or hook ordering.",
      "List omitted real React features such as scheduler details, effects, context, events, SSR, and production reconciliation edge cases."
    ],
    "Built the Pombo Build Your Own React tutorial as a mini UI runtime with element objects, rendering, fibers, reconciliation, components, and hooks.",
    ["Source is self-contained and explicitly organized into eight implementation steps."]
  ),
  approvedTutorialOverride(
    "front-end-framework-library-javascript-build-yourself-a-redux",
    "Individual review of Zapier's Build Yourself a Redux plus Redux fundamentals and React state resources",
    "Approved path for Build Yourself a Redux focused on store state, dispatch, reducers, subscriptions, middleware, and the boundary between state management and UI rendering.",
    zapierReduxResources,
    [
      concept(
        "approved-redux-store-contract",
        "Store as a state contract",
        "Redux becomes beginner-friendly when the store is seen as one object with three promises: read current state, dispatch actions, and notify subscribers.",
        "This lets learners rebuild the pattern without needing React first.",
        [
          "You can define state shape before creating the store.",
          "You can explain dispatch as the only state-change doorway.",
          "You can describe what subscribers receive."
        ],
        zapierReduxResources.slice(0, 4)
      ),
      concept(
        "approved-redux-reducer-middleware",
        "Reducers first, middleware later",
        "Reducers calculate next state from old state and action; middleware wraps dispatch for logging, async, or extra behavior.",
        "This order matters because middleware is impossible to reason about if the reducer contract is still fuzzy.",
        [
          "You can write a reducer with no side effects.",
          "You can show before/action/after state.",
          "You can explain why middleware should not secretly mutate state."
        ],
        [zapierReduxResources[0], zapierReduxResources[1], zapierReduxResources[2]]
      )
    ],
    [
      checkpoint(
        "Define state, action, and reducer",
        "Core Redux model",
        "Learn state shape and reducer purity before implementing store plumbing.",
        "Write one reducer and manually call it with two actions.",
        "If output surprises you, print previous state, action, and next state.",
        "Reducer fixtures prove predictable state transitions.",
        zapierReduxResources.slice(0, 4)
      ),
      checkpoint(
        "Build createStore",
        "Store implementation",
        "Learn getState, dispatch, and subscribe as the minimum store API.",
        "Implement createStore and test dispatch plus subscriber notification.",
        "If subscribers do not fire, inspect dispatch order and listener storage.",
        "A subscriber sees the state after dispatch.",
        [zapierReduxResources[0], zapierReduxResources[2], zapierReduxResources[3]]
      ),
      checkpoint(
        "Add middleware wrapping",
        "Middleware",
        "Learn middleware as dispatch decoration rather than a second state system.",
        "Add one logger or thunk-like middleware and show how it wraps dispatch.",
        "If middleware swallows actions, print the action before and after each wrapper.",
        "A middleware logs or handles behavior while reducers still own state changes.",
        [zapierReduxResources[0], zapierReduxResources[1], zapierReduxResources[2]]
      ),
      checkpoint(
        "Connect to a tiny UI or demo",
        "Usage proof",
        "Learn how a state container supports UI without being the UI itself.",
        "Drive a tiny counter/list demo from the store and document what Redux Toolkit/React-Redux add.",
        "If UI and store get tangled, make the UI call dispatch and read state without mutating directly.",
        "A demo updates through dispatch and README explains the state-management boundary.",
        zapierReduxResources.slice(0, 4)
      )
    ],
    [
      "Write one state shape and three action examples before implementing createStore.",
      "Review Redux fundamentals enough to explain reducer purity.",
      "Set up tests or console fixtures for reducer and store behavior.",
      "Commit after reducer, store, middleware, and demo integration."
    ],
    [
      "Demo state changing only through dispatch.",
      "Include reducer/store/middleware tests or console proof.",
      "Add a README diagram for action -> dispatch -> reducer -> state -> subscribers.",
      "List omitted Redux ecosystem features such as devtools, React bindings, Toolkit, immutability helpers, and async conventions."
    ],
    "Built the Zapier Redux tutorial as a state-management core with reducers, store API, subscriptions, middleware, and a tiny UI/demo proof.",
    ["Source extraction is full and the article maps cleanly to reducer/store/middleware stages."]
  ),
  approvedTutorialOverride(
    "text-editor-c-build-your-own-text-editor",
    "Individual review of Snaptoken Kilo plus editor buffer/cursor resources",
    "Approved path for the Kilo text-editor tutorial focused on raw terminal mode, input/output, viewer state, editable buffer behavior, search, syntax highlighting, and C terminal constraints.",
    kiloApprovedResources,
    [
      concept(
        "approved-kilo-terminal-raw-mode",
        "Raw terminal mode",
        "Kilo starts by taking the terminal out of its normal cooked behavior so the program can read keys directly and redraw the screen.",
        "This is the key beginner concept that makes the project different from a normal command-line program.",
        [
          "You can explain why keypresses are not automatically echoed.",
          "You can restore terminal settings on exit.",
          "You can debug input separately from screen drawing."
        ],
        kiloApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-kilo-buffer-view",
        "Buffer versus viewport",
        "The editor stores file rows and cursor state, then renders only the visible viewport to the terminal.",
        "This separates editing correctness from screen redraw bugs, which is essential once scrolling, search, and highlighting appear.",
        [
          "You can inspect file rows without rendering.",
          "You can explain cursor row/column versus screen row/column.",
          "You can name which state changes after insert, delete, scroll, and save."
        ],
        [kiloApprovedResources[0], kiloApprovedResources[2], kiloApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Enter and restore raw mode",
        "Setup and Entering raw mode",
        "Learn terminal flags, input behavior, and cleanup before editor features.",
        "Enable raw mode, read one keypress, and guarantee terminal restoration on exit.",
        "If the terminal stays broken, reset it and inspect cleanup paths before continuing.",
        "A single keypress can be read without requiring Enter, and the terminal returns to normal after exit.",
        kiloApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Draw a text viewer",
        "Raw input/output and text viewer",
        "Learn screen clearing, cursor movement, rows, and scrolling as a view of editor state.",
        "Open a small file and render visible rows with cursor position.",
        "If the screen flickers or text overlaps, inspect escape sequences and row offsets.",
        "A file can be viewed and scrolled without editing.",
        [kiloApprovedResources[0], kiloApprovedResources[1], kiloApprovedResources[2]]
      ),
      checkpoint(
        "Edit, save, and track dirty state",
        "A text editor",
        "Learn insert/delete behavior, row mutation, file saving, and dirty-state warnings.",
        "Edit text, save it, reopen it, and verify the file contents changed as intended.",
        "If saved files corrupt, compare row buffer contents before write and file contents after read.",
        "A small file round trip proves editing and saving.",
        [kiloApprovedResources[0], kiloApprovedResources[1], kiloApprovedResources[3]]
      ),
      checkpoint(
        "Add search and highlighting last",
        "Search and syntax highlighting",
        "Learn search and syntax highlighting as read-only analysis over buffer rows, not as the core editor model.",
        "Implement search or highlighting and document limitations around languages, tabs, unicode, and undo.",
        "If highlighting changes text, separate display attributes from stored row contents.",
        "README explains raw mode, buffer/viewport model, save behavior, and advanced features added.",
        kiloApprovedResources.slice(0, 4)
      )
    ],
    [
      "Compile and run a tiny C program before touching terminal flags.",
      "Read the Kilo table of contents and write the editor-state variables in plain language.",
      "Keep a command nearby to reset the terminal if raw-mode cleanup fails.",
      "Commit after raw mode, viewer, editing, saving, and search/highlighting."
    ],
    [
      "Demo opening, editing, saving, reopening, searching, and highlighting a file.",
      "Add README notes for raw mode, escape sequences, buffer rows, viewport, and dirty state.",
      "Include one terminal/raw-mode bug and recovery steps.",
      "List omitted editor features such as undo, multi-file buffers, unicode, plugins, and robust syntax parsing."
    ],
    "Built the Kilo editor tutorial with raw terminal control, buffer/view separation, editing, saving, search, syntax highlighting, and C terminal constraints documented.",
    ["Source is partially extracted but the tutorial table of contents and step structure are explicit and stable."]
  ),
  approvedTutorialOverride(
    "uncategorized-c-learn-how-to-write-a-hash-table-in-c",
    "Individual review of James Routley's write-a-hash-table repo plus data-structure resources",
    "Approved path for the C hash-table tutorial focused on open addressing, double hashing, insert/search/delete, tombstones, resizing, and C memory boundaries.",
    hashTableApprovedResources,
    [
      concept(
        "approved-hash-table-open-addressing",
        "Open addressing invariant",
        "This tutorial builds an open-addressed hash table, so keys live inside the table array and collisions are resolved by probing for another slot.",
        "Beginners need this invariant before delete and resize behavior make sense.",
        [
          "You can explain why collisions do not create linked lists here.",
          "You can trace a probe sequence for one key.",
          "You can describe why deleted slots need special handling."
        ],
        hashTableApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-hash-table-load-factor",
        "Load factor and resizing",
        "A hash table stays fast only if the table is resized before it gets too full, then existing items are reinserted under the new capacity.",
        "This gives the learner a concrete reason for complexity and memory tradeoffs.",
        [
          "You can compute load factor.",
          "You can explain why resizing must rehash items.",
          "You can write a test where lookup still works after resize."
        ],
        [hashTableApprovedResources[0], hashTableApprovedResources[1], hashTableApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Define item and table structures",
        "Hash table structure",
        "Learn C structs, capacity, count, and ownership before hashing.",
        "Create the item/table structures and a small initialization/free proof.",
        "If memory ownership is unclear, draw who allocates and who frees each string/table.",
        "A table can be created and destroyed without leaks in a tiny run.",
        hashTableApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Implement hashing and collision probing",
        "Hash functions and collisions",
        "Learn primary hash, secondary hash, and probe sequence as the core of open addressing.",
        "Hash several keys and print their probe positions for a small capacity.",
        "If lookups fail, compare insert and search probe sequences.",
        "Two colliding keys can be inserted and found.",
        [hashTableApprovedResources[0], hashTableApprovedResources[1], hashTableApprovedResources[2]]
      ),
      checkpoint(
        "Add insert, search, and delete",
        "Hash table methods",
        "Learn CRUD behavior and tombstones as separate cases.",
        "Implement methods with fixtures for existing, missing, colliding, and deleted keys.",
        "If deleted keys break later lookups, inspect tombstone handling in the probe chain.",
        "Fixtures prove insert/search/delete across collision cases.",
        [hashTableApprovedResources[0], hashTableApprovedResources[2], hashTableApprovedResources[3]]
      ),
      checkpoint(
        "Resize and explain tradeoffs",
        "Resizing tables",
        "Learn load factor and rehashing as the final correctness/performance step.",
        "Resize up/down according to load and verify all existing keys survive.",
        "If values disappear after resize, log old slot, new hash, and copied item.",
        "README explains open addressing, double hashing, tombstones, resizing, and C memory caveats.",
        hashTableApprovedResources.slice(0, 4)
      )
    ],
    [
      "Refresh C pointers, structs, heap allocation, and string ownership.",
      "Write the core table invariant before implementing insert/search/delete.",
      "Create fixtures for collision, missing key, deletion, and resize.",
      "Commit after structures, hash functions, methods, and resizing."
    ],
    [
      "Demo insert, search, delete, collision handling, and resize with fixtures.",
      "Add README diagrams for probing and tombstones.",
      "Include one memory-management or collision bug and how it was found.",
      "List unsupported production concerns such as thread safety, generic values, cryptographic hashing, and allocator integration."
    ],
    "Built the write-a-hash-table-in-C tutorial with open addressing, double hashing, tombstones, resizing, fixtures, and memory-ownership notes.",
    ["Original repo exposes a clear contents sequence from structure through resizing."]
  ),
  approvedTutorialOverride(
    "bot-node-js-gifbot-building-a-github-app",
    "Individual review of Scott Logic gifbot plus GitHub Apps/Webhooks docs",
    "Approved path for the gifbot GitHub App tutorial focused on GitHub App identity, webhook events, installation permissions, API calls, and safe bot behavior.",
    gifbotApprovedResources,
    [
      concept(
        "approved-gifbot-app-identity",
        "GitHub App identity and installation boundary",
        "The tutorial's first serious lesson is that a GitHub App is an installed integration with its own bot identity, permissions, webhook configuration, private key, and per-installation access.",
        "A beginner who understands that boundary will not confuse this project with a personal access token script. The app acts where it is installed, under reviewed permissions, and its API calls should be attributed to the app rather than to your personal account.",
        [
          "You can explain GitHub App versus personal access token.",
          "You can name what belongs to the app registration and what belongs to each installation.",
          "You can describe why least privilege matters before the bot posts anything."
        ],
        [gifbotApprovedResources[1], gifbotApprovedResources[2], gifbotApprovedResources[6]]
      ),
      concept(
        "approved-gifbot-issue-comment-event",
        "The issue_comment event is the trigger",
        "gifbot is awakened by an issue_comment webhook where the action is `created`, the payload has a `comment.body`, and GitHub App deliveries include an `installation` object.",
        "This keeps the learner from treating webhooks as magic callbacks. The app is just receiving an HTTP request with a known event name, a known payload shape, and enough installation context to decide whether it should act.",
        [
          "You can identify the `issue_comment` event and `created` action.",
          "You can point to `comment.body`, `issue.comments_url`, and `installation.id` in the payload.",
          "You can ignore non-created actions before calling external APIs."
        ],
        [gifbotApprovedResources[11], gifbotApprovedResources[3], gifbotApprovedResources[4]]
      ),
      concept(
        "approved-gifbot-webhook-safety",
        "Webhook safety before bot behavior",
        "A useful bot should first prove the delivery really came from GitHub, parse only the event it expects, avoid logging secrets or full payloads, and fail without posting duplicate or unsafe comments.",
        "This is the quality gap in many beginner bot tutorials: the fun visible action is easy, but real integrations need signature validation, event filtering, idempotence thinking, and defensive logs before they are trustworthy.",
        [
          "You can explain what the `x-hub-signature-256` header protects.",
          "You can say which event/action combinations the bot ignores.",
          "You can write a safe log line without leaking tokens, private keys, or full user content."
        ],
        [gifbotApprovedResources[5], gifbotApprovedResources[13], gifbotApprovedResources[3]]
      ),
      concept(
        "approved-gifbot-installation-auth",
        "JWT to installation token flow",
        "The app signs a short-lived JWT with its private key, uses that app identity to request an installation access token, then uses the installation token for repository API calls.",
        "Beginners need this sequence in order. The JWT proves which app is asking; the installation token grants scoped access to repositories where that app was installed.",
        [
          "You can describe why the app private key should never be committed.",
          "You can explain why the JWT and installation token are different.",
          "You can identify where `installation.id` enters the token request flow."
        ],
        [gifbotApprovedResources[6], gifbotApprovedResources[7], gifbotApprovedResources[8]]
      ),
      concept(
        "approved-gifbot-giphy-comment-action",
        "Search GIPHY, then post a GitHub comment",
        "After the event and auth checks pass, gifbot extracts the search term from `[gifbot:search]`, calls the GIPHY search endpoint, formats a Markdown image comment, and posts it to the issue comment thread.",
        "This final action is only educational if the learner can separate user input parsing, third-party API response handling, Markdown formatting, and the GitHub create-comment request.",
        [
          "You can trace search term -> GIPHY request -> GIF URL -> Markdown body.",
          "You can name which GitHub REST endpoint creates the visible response.",
          "You can handle no-match or API-failure cases without spamming the thread."
        ],
        [gifbotApprovedResources[10], gifbotApprovedResources[9], gifbotApprovedResources[12], gifbotApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Create the GitHub App safely",
        "Apps vs. Bots and Creating an App",
        "Learn app registration, installation scope, permissions, webhook URL, private key, and secrets before running code.",
        "Create or document a test GitHub App with issue-comment webhook subscription and the minimum repository permissions needed to read comments and post a reply.",
        "If authentication fails, check installation, private key format, app id, and permissions before handler code.",
        "The app can start with credentials kept out of source control and a test installation selected.",
        [gifbotApprovedResources[0], gifbotApprovedResources[1], gifbotApprovedResources[2], gifbotApprovedResources[3]]
      ),
      checkpoint(
        "Receive and inspect one webhook",
        "Webhook handling",
        "Learn the issue_comment payload, `created` action, installation id, signature validation, and safe logging before posting a response.",
        "Deliver one test issue comment webhook, verify its signature or document the verification boundary, then identify `comment.body`, `issue.comments_url`, and `installation.id`.",
        "If events do not arrive, inspect webhook delivery logs, event subscription, local tunneling, and the signature header before API code.",
        "One delivered event is visible in safe logs with the needed fields identified and secrets excluded.",
        [gifbotApprovedResources[11], gifbotApprovedResources[4], gifbotApprovedResources[5], gifbotApprovedResources[3]]
      ),
      checkpoint(
        "Turn an installation id into an API token",
        "App Authentication Flow",
        "Learn the JWT to installation-token sequence before the bot tries to write to GitHub.",
        "Generate or trace the app JWT, request an installation access token for the webhook installation id, and use it only for the installed repository action.",
        "If the API rejects the call, inspect JWT expiry, private key, app id, installation id, accepted permissions, and token type.",
        "A scoped installation token can authorize the next GitHub API request without using a personal access token.",
        [gifbotApprovedResources[6], gifbotApprovedResources[7], gifbotApprovedResources[8], gifbotApprovedResources[2]]
      ),
      checkpoint(
        "Search GIPHY and post one comment",
        "Building a Bot and API action",
        "Learn the event-to-action pipeline: parse `[gifbot:search]`, call GIPHY, build a Markdown image body, and create an issue comment with the installation token.",
        "Post one harmless GIF response to a test issue, plus one no-match or invalid-command case that does not post.",
        "If posting fails, inspect the GitHub REST endpoint, issue number/comments URL, request body, token permissions, and response status separately from the GIPHY request.",
        "A test repository shows one app-created response and one ignored comment case.",
        [gifbotApprovedResources[10], gifbotApprovedResources[9], gifbotApprovedResources[12], gifbotApprovedResources[0]]
      ),
      checkpoint(
        "Document safety and deployment limits",
        "Bot hardening",
        "Learn duplicate delivery, webhook replay/security, secret handling, content moderation, API failures, and why this tutorial is not a full production GitHub App framework.",
        "Add README setup, permissions, webhook events, signature verification, duplicate-handling note, GIPHY failure behavior, and deployment limitations.",
        "If repeated events create spam, add idempotence or document the exact risk clearly.",
        "README explains app identity, webhook flow, installation-token auth, comment API, GIPHY lookup, and safe test/deploy boundaries.",
        [gifbotApprovedResources[13], gifbotApprovedResources[5], gifbotApprovedResources[2], gifbotApprovedResources[8]]
      )
    ],
    [
      "Read the Apps vs Bots section and write the identity/permission difference in plain language.",
      "Create a test repository for webhook/API experiments.",
      "Prepare environment variables for app id, private key, webhook secret, GIPHY key, and installation details.",
      "Commit after setup, webhook receive, installation auth, GIPHY/comment action, and safety documentation."
    ],
    [
      "Demo a webhook-triggered response in a test repository.",
      "Add README setup with secret placeholders only.",
      "Include webhook payload fields used by the bot plus the exact event/action subscriptions.",
      "List missing production safeguards such as signature enforcement, retries, idempotence, rate-limit handling, abuse prevention, and moderation rules."
    ],
    "Built the gifbot GitHub App tutorial with app identity, scoped permissions, webhook handling, API response, and safe deployment boundaries.",
    ["Source extraction is full; Scott Logic's tutorial, GitHub App/auth/webhook/comment docs, and GIPHY search docs are used as the safety and API backstop."],
    { prerequisiteResources: gifbotApprovedResources }
  ),
  approvedTutorialOverride(
    "git-haskell-reimplementing-git-clone-in-haskell-from-the-bottom-up",
    "Individual review of Stefan Saasen's git clone in Haskell plus Pro Git internals resources",
    "Approved path for the Haskell git-clone tutorial focused on Git object storage, pack/protocol concepts, refs, repository reconstruction, and compatibility limits.",
    gitCloneHaskellResources,
    [
      concept(
        "approved-git-clone-objects",
        "Clone is object reconstruction",
        "A git clone is not just downloading files; it reconstructs Git objects, refs, and working-tree content from Git's storage/protocol model.",
        "This keeps beginners from confusing final files with the object database and history that make Git Git.",
        [
          "You can distinguish blob, tree, commit, and ref.",
          "You can explain why object hashes identify content.",
          "You can describe what clone must recreate locally."
        ],
        gitCloneHaskellResources.slice(0, 4)
      ),
      concept(
        "approved-git-clone-protocol-pack",
        "Protocol and pack boundary",
        "The tutorial crosses from Git's network/protocol layer into pack/object decoding and local repository layout.",
        "Beginners need that boundary so parser/protocol bugs are not mistaken for checkout or filesystem bugs.",
        [
          "You can name which data comes from the remote.",
          "You can explain what a packfile is for.",
          "You can test object decoding before checkout."
        ],
        [gitCloneHaskellResources[0], gitCloneHaskellResources[1], gitCloneHaskellResources[3]]
      )
    ],
    [
      checkpoint(
        "Inspect Git objects locally",
        "Git object model",
        "Learn blobs, trees, commits, refs, and hashes before implementing clone behavior.",
        "Use a tiny repository or fixture to inspect object ids and tree/commit relationships.",
        "If protocol work feels abstract, return to local object inspection.",
        "A README sketch shows blob/tree/commit/ref relationships.",
        gitCloneHaskellResources.slice(0, 4)
      ),
      checkpoint(
        "Fetch or model remote data",
        "Clone protocol",
        "Learn what the remote advertises and what the client requests before decoding objects.",
        "Trace the tutorial's remote negotiation or create a captured fixture for the protocol data.",
        "If clone negotiation fails, log protocol messages separately from object decoding.",
        "One protocol/fixture step produces identifiable object data.",
        [gitCloneHaskellResources[0], gitCloneHaskellResources[1], gitCloneHaskellResources[3]]
      ),
      checkpoint(
        "Decode and store objects",
        "Pack/object storage",
        "Learn how received Git data becomes local object database entries.",
        "Decode/store a small set of objects and verify their hashes/types.",
        "If hashes differ, inspect exact bytes and compression/headers before filesystem code.",
        "Stored objects can be inspected or compared with Git's own tooling.",
        [gitCloneHaskellResources[0], gitCloneHaskellResources[2], gitCloneHaskellResources[3]]
      ),
      checkpoint(
        "Checkout and document compatibility",
        "Working tree and refs",
        "Learn the final step from object history to files, plus what real Git clone does beyond the tutorial.",
        "Write files from the decoded tree and document missing protocol/pack/ref edge cases.",
        "If files are wrong, inspect the tree object before checkout code.",
        "A small cloned repository produces expected files and README lists compatibility limits.",
        gitCloneHaskellResources.slice(0, 5)
      )
    ],
    [
      "Read Pro Git object/refs chapters before implementing protocol pieces.",
      "Create a tiny local Git repo fixture with one commit and a few files.",
      "Plan checkpoints around object model, remote data, object storage, and checkout.",
      "Commit after each layer because Git internals bugs compound quickly."
    ],
    [
      "Demo cloning or reconstructing a tiny repository.",
      "Add README diagrams for object graph, refs, and clone data flow.",
      "Include one hash/protocol/object-decoding bug story.",
      "List unsupported Git features such as full protocol coverage, pack deltas, shallow clones, auth, submodules, and partial clones."
    ],
    "Built the Haskell git-clone tutorial as a Git internals project with object storage, remote/protocol boundaries, checkout proof, and compatibility limits.",
    ["Source extraction is full and Pro Git internals are used as the correctness backstop."]
  ),
  approvedTutorialOverride(
    "shell-c-tutorial-write-a-shell-in-c",
    "Individual review of Stephen Brennan's lsh shell tutorial plus POSIX/Bash/OSTEP process resources",
    "Approved path for the Brennan shell tutorial focused on the read-parse-execute loop, builtins, fork/exec/wait, arguments, and shell-scope limitations.",
    brennanShellResources,
    [
      concept(
        "approved-brennan-shell-loop",
        "Read, parse, execute loop",
        "The tutorial's shell is built around a loop: read a line, split it into command/arguments, execute it, then return to the prompt.",
        "This simple loop is the beginner anchor before pipes, redirection, quoting, and job control are even considered.",
        [
          "You can describe what each loop stage owns.",
          "You can show parsed args before execution.",
          "You can explain why the prompt returns after wait."
        ],
        brennanShellResources.slice(0, 4)
      ),
      concept(
        "approved-brennan-builtins-processes",
        "Builtins versus child processes",
        "Some commands such as cd must run inside the shell process, while external programs are launched as child processes.",
        "This is the core shell design lesson and the reason process control matters.",
        [
          "You can explain why cd cannot be a normal child process in this shell.",
          "You can name fork, exec, and wait responsibilities.",
          "You can report command failure without killing the shell."
        ],
        [brennanShellResources[0], brennanShellResources[2], brennanShellResources[3]]
      )
    ],
    [
      checkpoint(
        "Build the prompt loop",
        "Basic loop",
        "Learn the shell as a repeated prompt, read, parse, execute cycle.",
        "Create a loop that prints a prompt, reads a line, and exits on a controlled command.",
        "If the prompt hangs, isolate input reading before parsing or execution.",
        "A prompt appears repeatedly and exits deliberately.",
        brennanShellResources.slice(0, 4)
      ),
      checkpoint(
        "Parse command arguments",
        "Parsing",
        "Learn simple token splitting and its limitations before launching processes.",
        "Split one command line into argv-style arguments and print them.",
        "If spaces/quotes behave unexpectedly, document that this shell only supports simple splitting.",
        "A command with arguments is parsed predictably.",
        [brennanShellResources[0], brennanShellResources[1], brennanShellResources[2]]
      ),
      checkpoint(
        "Launch external commands",
        "fork, exec, wait",
        "Learn child process creation, exec replacement, and waiting for completion.",
        "Run one external command and return to the prompt after it exits.",
        "If the shell exits instead of the child, inspect fork branches.",
        "An external command runs and the shell prompt returns.",
        [brennanShellResources[0], brennanShellResources[2], brennanShellResources[3]]
      ),
      checkpoint(
        "Add builtins and limitations",
        "Builtins",
        "Learn why cd/exit/help belong inside the shell and what POSIX features are missing.",
        "Implement cd, help, and exit, then document unsupported quoting, pipes, redirection, globbing, and job control.",
        "If cd appears not to work, confirm it runs in the parent shell process.",
        "README explains loop, parsing, builtins, process launch, and unsupported shell features.",
        brennanShellResources.slice(0, 5)
      )
    ],
    [
      "Review process basics and compile/run a tiny C program.",
      "Write the shell loop stages before coding.",
      "Create small manual tests for empty input, external command, missing command, cd, and exit.",
      "Commit after input loop, parsing, process execution, and builtins."
    ],
    [
      "Demo running external commands, cd, help, and exit.",
      "Add README diagram for read-parse-execute and parent/child process split.",
      "Include one fork/exec/wait bug and how it was diagnosed.",
      "List unsupported shell behavior honestly."
    ],
    "Built Brennan's lsh tutorial as a minimal C shell with read-parse-execute loop, process launch, builtins, and POSIX-scope limitations.",
    ["Source extraction is full and the tutorial is structurally narrow enough for approval."]
  ),
  approvedTutorialOverride(
    "neural-network-javascript-neural-networks-from-scratch-for-javascript-linguists-",
    "Individual review of HackerNoon JavaScript perceptron tutorial plus neural-network beginner resources",
    "Approved path for the JavaScript perceptron tutorial focused on input vectors, weights, activation, prediction error, update rule, and honest limits of single-layer learning.",
    jsPerceptronResources,
    [
      concept(
        "approved-js-perceptron-forward",
        "Perceptron forward pass",
        "This tutorial is best treated as a perceptron lesson: multiply inputs by weights, combine them, apply an activation rule, and produce a prediction.",
        "Beginners need this tiny model before the phrase neural network expands into many layers and training jargon.",
        [
          "You can compute one weighted sum by hand.",
          "You can explain activation as a decision rule.",
          "You can trace one example from inputs to prediction."
        ],
        jsPerceptronResources.slice(0, 4)
      ),
      concept(
        "approved-js-perceptron-learning",
        "Error-driven weight updates",
        "The perceptron learns by comparing prediction with target and nudging weights according to the error and input values.",
        "This creates a concrete bridge from beginner JavaScript math to training loops without overclaiming deep learning.",
        [
          "You can calculate prediction error for one example.",
          "You can explain why weights change more for active inputs.",
          "You can name one problem a single perceptron cannot solve."
        ],
        [jsPerceptronResources[0], jsPerceptronResources[1], jsPerceptronResources[2]]
      )
    ],
    [
      checkpoint(
        "Represent examples, weights, and labels",
        "Data and model setup",
        "Learn input vectors, target labels, weights, and bias before training.",
        "Create a tiny dataset and print one example with current weights.",
        "If output is confusing, reduce to two inputs and one label.",
        "README explains what one training example means.",
        jsPerceptronResources.slice(0, 4)
      ),
      checkpoint(
        "Run one prediction",
        "Forward pass",
        "Learn weighted sum and activation as the model's first observable behavior.",
        "Compute one prediction and compare it with a hand calculation.",
        "If prediction differs, print each multiply/add step.",
        "One example produces a prediction you can explain by hand.",
        [jsPerceptronResources[0], jsPerceptronResources[1], jsPerceptronResources[2]]
      ),
      checkpoint(
        "Train with error updates",
        "Training",
        "Learn the update rule as a small loop over examples, not magic AI.",
        "Apply the perceptron update rule and log weights over several iterations.",
        "If weights explode or never change, inspect learning rate, target encoding, and error sign.",
        "Training changes weights and improves the tiny examples where the perceptron can succeed.",
        [jsPerceptronResources[0], jsPerceptronResources[2], jsPerceptronResources[3]]
      ),
      checkpoint(
        "Evaluate and limit claims",
        "Limitations",
        "Learn that a perceptron handles only linearly separable patterns and is not a modern deep-learning system.",
        "Test one success case and one known limitation, then write the result honestly.",
        "If all examples pass trivially, add a harder negative or non-separable case.",
        "README explains forward pass, update rule, evaluation, and perceptron limitations.",
        jsPerceptronResources.slice(0, 5)
      )
    ],
    [
      "Review JavaScript arrays/functions and basic algebra before training.",
      "Write a tiny dataset and one hand-calculated prediction.",
      "Keep model size tiny until one forward pass and one update are explainable.",
      "Commit after data setup, prediction, training, and evaluation."
    ],
    [
      "Demo predictions before and after training.",
      "Add README math for one forward pass and one weight update.",
      "Include one limitation example.",
      "Avoid portfolio claims beyond a beginner perceptron/neural-network foundation."
    ],
    "Built the JavaScript perceptron tutorial with input/weight representation, forward pass, error-driven training, evaluation, and honest model limits.",
    ["Source is reachable, but article extraction is noisy; approval is scoped to the perceptron learning path and external ML references."]
  ),
  approvedTutorialOverride(
    "web-server-python-web-application-from-scratch",
    "Individual review of defn.io Web application from scratch plus MDN/OWASP/MVC web-app resources",
    "Approved path for the defn.io Python web-application tutorial focused on request routing, WSGI-style boundaries, controller behavior, templates/responses, and web-app architecture limits.",
    defnWebAppResources,
    [
      concept(
        "approved-defn-request-flow",
        "Request flow through the app",
        "This tutorial is best learned as a request-flow project: the server receives HTTP, the app routes the request, application code decides behavior, and a response is returned.",
        "That path helps beginners avoid confusing web-server mechanics with web-application architecture.",
        [
          "You can trace one URL to one handler.",
          "You can identify request data used by the app.",
          "You can explain which layer creates the response."
        ],
        defnWebAppResources.slice(0, 4)
      ),
      concept(
        "approved-defn-framework-shape",
        "Framework shape from scratch",
        "Building a web app from scratch reveals the same pieces frameworks organize for you: routes, handlers/controllers, request objects, responses, templates, and errors.",
        "This makes Flask/Django-style architecture easier later because the learner has built a small version of the map.",
        [
          "You can name the framework-like pieces created by the tutorial.",
          "You can add a route without rewriting the server layer.",
          "You can handle one invalid request deliberately."
        ],
        [defnWebAppResources[0], defnWebAppResources[2], defnWebAppResources[3], defnWebAppResources[4]]
      )
    ],
    [
      checkpoint(
        "Trace the first request",
        "Request and response setup",
        "Learn URL, method, request data, response status, and body before app structure grows.",
        "Run the first app route and write down every function/layer the request crosses.",
        "If the route fails, inspect URL matching before application behavior.",
        "One request path is visible and documented from browser/client to response.",
        defnWebAppResources.slice(0, 4)
      ),
      checkpoint(
        "Build a route/handler map",
        "Routing",
        "Learn routing as a table or dispatcher that selects application behavior.",
        "Add two routes that return different responses through shared plumbing.",
        "If both routes behave the same, log the parsed path and selected handler.",
        "Two URLs reach two handlers without duplicating server mechanics.",
        [defnWebAppResources[0], defnWebAppResources[1], defnWebAppResources[3]]
      ),
      checkpoint(
        "Add response rendering",
        "Application output",
        "Learn templates or response construction as a boundary between data and HTTP output.",
        "Render one dynamic value into a response and handle one missing/invalid value.",
        "If output is unsafe or malformed, separate data preparation from response formatting.",
        "A dynamic response and an error response both work predictably.",
        [defnWebAppResources[0], defnWebAppResources[2], defnWebAppResources[3]]
      ),
      checkpoint(
        "Document framework and security gaps",
        "Architecture limits",
        "Learn what production frameworks add: sessions, auth, CSRF, validation, templates, database migrations, middleware, and deployment.",
        "Add a README architecture diagram and one limitations table.",
        "If a feature feels production-ready, compare it with OWASP and framework docs before claiming it.",
        "README explains request flow, routing, rendering, and missing production safeguards.",
        defnWebAppResources.slice(0, 6)
      )
    ],
    [
      "Refresh HTTP request/response basics before framework pieces.",
      "Write one request-flow diagram before coding the second route.",
      "Prepare local examples for good request, missing route, and invalid input.",
      "Commit after first route, route map, dynamic response, and architecture notes."
    ],
    [
      "Demo at least two routes and one error/failure path.",
      "Add README request-flow and framework-piece diagrams.",
      "Include one routing/rendering bug and how it was isolated.",
      "List missing security/deployment features without overselling the app."
    ],
    "Built the defn.io web-application tutorial as a from-scratch framework map with request routing, response rendering, failure handling, and architecture/security limits.",
    ["Source extraction is full and the project is suitable for individual approval as a web-app architecture tutorial."]
  ),
  approvedTutorialOverride(
    "uncategorized-javascript-build-your-own-module-bundler-minipack",
    "Individual review of Minipack README and annotated source plus webpack module and Babel parser docs",
    "Approved path for Minipack focused on entry files, dependency graph creation, AST import discovery, Babel transpilation, module wrapping, and the deliberate limits of a tiny bundler.",
    minipackApprovedResources,
    [
      concept(
        "approved-minipack-dependency-graph",
        "Dependency graph from one entry file",
        "Minipack starts with one entry module, reads its imports, then follows each imported file until the whole miniature app is represented as assets connected by dependencies.",
        "This gives beginners the core mental model behind bundlers before they meet loaders, plugins, caches, code splitting, or production optimization.",
        [
          "You can explain why the entry file bootstraps the graph.",
          "You can distinguish a module filename from a module id.",
          "You can draw how one import becomes a graph edge."
        ],
        minipackApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-minipack-ast-bundle-runtime",
        "AST discovery versus bundle runtime",
        "The source uses a parser and AST traversal to discover imports, then emits a small runtime that maps module ids to wrapped functions and local require calls.",
        "That split keeps the learner from mixing compile-time analysis with the browser-time module loader that the bundler prints.",
        [
          "You can point to where imports are discovered.",
          "You can explain why each module is wrapped in a function.",
          "You can describe why local require needs a per-module mapping."
        ],
        [minipackApprovedResources[1], minipackApprovedResources[2], minipackApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Run the annotated source unchanged",
        "README and script entry point",
        "Learn the project shape first: example files go in, a generated bundle string comes out, and the code is intentionally educational rather than production complete.",
        "Install dependencies, run `node src/minipack.js`, and save the generated bundle output as a proof artifact.",
        "If the script fails, check Node version, npm install, working directory, and whether the example entry path exists before editing source.",
        "The script prints a bundle string and the README notes what production bundlers still add.",
        minipackApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Create one asset from one file",
        "createAsset",
        "Learn file reading, JavaScript parsing, import collection, module ids, and transpiled code as one asset record.",
        "Instrument `createAsset()` for the entry file and print filename, id, dependencies, and code length.",
        "If dependencies are missing, inspect the AST and confirm the file uses static ES module imports.",
        "One module produces an asset object with dependencies and transpiled code.",
        [minipackApprovedResources[1], minipackApprovedResources[2], minipackApprovedResources[3]]
      ),
      checkpoint(
        "Build the dependency graph",
        "createGraph",
        "Learn the queue-based walk that repeatedly parses dependencies and records relative path to module id mappings.",
        "Print the graph for the sample app and draw each asset plus its mapping object.",
        "If the graph repeats or misses files, inspect the queue, dirname, absolute path, and mapping assignment separately.",
        "A small diagram shows entry, child modules, ids, and relative import mappings.",
        minipackApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Explain the emitted runtime",
        "bundle",
        "Learn how the generated wrapper creates a tiny require system for the browser and why each module receives require, module, and exports.",
        "Annotate the output bundle and add a README section for module wrappers, localRequire, exports, and omitted production features.",
        "If output runs but imports are wrong, trace module id lookup through mapping before changing parsing code.",
        "README explains graph creation, bundle runtime, and limits such as circular dependencies, caching, loaders, source maps, and code splitting.",
        minipackApprovedResources.slice(0, 4)
      )
    ],
    [
      "Review JavaScript modules and CommonJS basics before touching the bundler code.",
      "Run the original Minipack script once and keep the output as a reference.",
      "Use AST Explorer or printed AST snippets to identify one ImportDeclaration.",
      "Commit after asset creation, graph creation, bundle output, and README explanation."
    ],
    [
      "Demo the generated bundle for the sample app.",
      "Add a README diagram for entry file to dependency graph to bundle runtime.",
      "Include one import-resolution or module-id bug and how it was traced.",
      "List production bundler features intentionally omitted."
    ],
    "Built Minipack as a tiny JavaScript bundler with AST import discovery, dependency graph construction, module wrapping, and clear production-bundler limitations.",
    ["README and annotated source were read together because the source file is the actual tutorial."]
  ),
  approvedTutorialOverride(
    "programming-language-javascript-the-super-tiny-compiler",
    "Individual review of The Super Tiny Compiler README and annotated source plus Crafting Interpreters scanning/parsing references",
    "Approved path for The Super Tiny Compiler focused on tokenizer, parser, AST traversal, transformer, code generator, and the end-to-end compiler pipeline.",
    superTinyCompilerApprovedResources,
    [
      concept(
        "approved-stc-compiler-pipeline",
        "Compiler pipeline as small transformations",
        "The tutorial is valuable because it turns a compiler into a visible pipeline: input string, tokens, AST, transformed AST, and output code.",
        "Beginners can debug each representation separately instead of treating compilation as one mysterious step.",
        [
          "You can show the same tiny program as text, tokens, AST, and output code.",
          "You can explain which function owns each representation.",
          "You can test a failing stage before moving to the next one."
        ],
        superTinyCompilerApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-stc-traversal-transform",
        "Traversal and visitors",
        "The source teaches traversal as a depth-first walk over AST nodes, then uses visitor methods to build a new target-language AST.",
        "That is the bridge from parsing syntax to changing program meaning or shape in a controlled way.",
        [
          "You can describe enter and exit in a tree walk.",
          "You can name the visitor method for one node type.",
          "You can explain why the transformer creates a new AST instead of editing strings."
        ],
        [superTinyCompilerApprovedResources[1], superTinyCompilerApprovedResources[2], superTinyCompilerApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Run the provided compiler tests",
        "README and test.js",
        "Learn the expected input and output before editing: Lisp-like calls are transformed into C-like JavaScript call syntax.",
        "Run `node test.js`, then manually compile one tiny input and compare it with the expected output.",
        "If tests fail immediately, check Node setup and avoid editing until the original project runs cleanly.",
        "Tests pass and README contains one hand-worked input to output example.",
        superTinyCompilerApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Implement tokenizer and parser proofs",
        "Tokenizer and Parser",
        "Learn lexical analysis as token creation and parsing as building a nested AST from those tokens.",
        "Print tokens and AST for `(add 2 (subtract 4 2))` and label every node type.",
        "If parsing loops or crashes, inspect current index movement and nested closing parentheses.",
        "A sample program has a correct token list and AST sketch.",
        [superTinyCompilerApprovedResources[1], superTinyCompilerApprovedResources[2], superTinyCompilerApprovedResources[3]]
      ),
      checkpoint(
        "Trace traversal and transformation",
        "Traverser and Transformer",
        "Learn visitor-based traversal and the context link used to build the new AST while walking the old one.",
        "Log enter events for Program, CallExpression, and NumberLiteral, then compare old AST to transformed AST.",
        "If transformed nodes disappear, inspect parent context and visitor node-type names.",
        "README shows old AST to new AST for one call expression.",
        [superTinyCompilerApprovedResources[1], superTinyCompilerApprovedResources[3]]
      ),
      checkpoint(
        "Generate code and explain limits",
        "Code Generator and Compiler",
        "Learn recursive code generation and how the final compiler function wires all stages together.",
        "Compile several tiny examples, then document unsupported syntax, errors, variables, types, optimization, and real language concerns.",
        "If output formatting is wrong, inspect codeGenerator cases before changing tokenizer or parser.",
        "A final demo compiles nested calls and README explains the full pipeline plus honest limitations.",
        superTinyCompilerApprovedResources.slice(0, 4)
      )
    ],
    [
      "Review JavaScript objects, arrays, recursion, and functions before the compiler stages.",
      "Write the five stage names from memory: tokenizer, parser, traverser, transformer, generator.",
      "Keep one tiny program as a fixture through every stage.",
      "Commit after each compiler stage with its visible proof output."
    ],
    [
      "Demo compiling one nested Lisp-like call into target call syntax.",
      "Add README artifacts for tokens, AST, transformed AST, and generated code.",
      "Include one traversal or parser-index bug and how it was isolated.",
      "Avoid claiming a complete language; name the exact syntax and features supported."
    ],
    "Built The Super Tiny Compiler as a staged JavaScript compiler with tokenization, parsing, AST traversal, transformation, code generation, and stage-by-stage proof artifacts.",
    ["README and annotated source were read together because the source file is the guided lesson."]
  ),
  approvedTutorialOverride(
    "database-python-write-your-own-miniature-redis-with-python",
    "Individual review of Charles Leifer's miniature Redis tutorial plus RESP and Python socket references",
    "Approved path for the miniature Redis tutorial focused on RESP framing, socket request loops, command dispatch, in-memory key/value state, client encoding, and clear demo-only limits.",
    miniatureRedisApprovedResources,
    [
      concept(
        "approved-mini-redis-resp-framing",
        "RESP as message framing",
        "The tutorial works because Redis commands and replies are not vague strings: RESP gives arrays, bulk strings, errors, integers, and terminators a specific byte-level shape.",
        "Beginners need framing before sockets make sense, because a TCP stream does not automatically preserve application messages.",
        [
          "You can encode one SET command as a RESP array.",
          "You can explain why CRLF matters.",
          "You can describe what the parser returns for a bulk string, array, integer, and error."
        ],
        miniatureRedisApprovedResources.slice(0, 3)
      ),
      concept(
        "approved-mini-redis-command-state",
        "Command dispatch over in-memory state",
        "The server maps parsed command names to Python methods that mutate or read an in-memory dictionary-like store.",
        "That keeps the beginner focused on the core Redis shape before persistence, eviction, clustering, or networking robustness.",
        [
          "You can trace GET and SET from client call to server command method.",
          "You can describe where keys and values live.",
          "You can explain why FLUSH, MGET, and MSET are extensions of the same dispatch pattern."
        ],
        [miniatureRedisApprovedResources[0], miniatureRedisApprovedResources[1]]
      )
    ],
    [
      checkpoint(
        "Run a request loop skeleton",
        "Server and client setup",
        "Learn that this project has two sides: a server that accepts socket connections and a client that encodes commands and reads replies.",
        "Start the server module and connect with the tutorial's client or a tiny socket script before implementing all commands.",
        "If the client hangs, inspect whether the server loop is waiting for a complete framed message.",
        "A client can connect and the server process stays alive for a request.",
        miniatureRedisApprovedResources.slice(0, 3)
      ),
      checkpoint(
        "Implement RESP read and write",
        "Protocol handler",
        "Learn message parsing as the heart of the tutorial: arrays contain command parts, bulk strings carry payloads, and replies become Python objects.",
        "Encode and decode at least one command and one nested response without involving the key/value store yet.",
        "If parsing fails, print raw bytes and confirm CRLF, array length, and bulk string byte counts.",
        "Protocol fixtures prove arrays, strings, integers, nulls, and errors round-trip.",
        miniatureRedisApprovedResources.slice(0, 3)
      ),
      checkpoint(
        "Add key/value commands",
        "Command implementation",
        "Learn command dispatch as a small API over server state: set, get, delete, flush, mget, and mset share the same parse-dispatch-reply path.",
        "Implement command methods and exercise them through the client instead of direct function calls only.",
        "If a command returns the wrong value, check whether the protocol parser, dispatch lookup, or store mutation owns the bug.",
        "GET, SET, DELETE, MGET, MSET, and FLUSH work through the client.",
        [miniatureRedisApprovedResources[0], miniatureRedisApprovedResources[1]]
      ),
      checkpoint(
        "Document demo-only Redis limits",
        "Testing and extensions",
        "Learn why the post calls the code demonstrational: it lacks persistence, auth, eviction, replication, robust errors, reconnect handling, and production concurrency hardening.",
        "Add a README limitations table and one extension idea such as append-only logging or extra commands.",
        "If the project feels Redis-compatible, compare each claim against RESP and real Redis behavior before writing it down.",
        "README explains RESP, server/client boundary, command dispatch, tests, and production gaps.",
        miniatureRedisApprovedResources.slice(0, 3)
      )
    ],
    [
      "Review Python dictionaries, classes, file-like sockets, and byte/string conversion.",
      "Write one RESP command by hand before coding the protocol handler.",
      "Keep server, protocol, command store, and client tests separate in your notes.",
      "Commit after protocol fixtures, server loop, command methods, and client demo."
    ],
    [
      "Demo the client setting, reading, deleting, and flushing values through the server.",
      "Add README examples of raw RESP and parsed Python objects.",
      "Include one socket/framing bug and how raw bytes exposed it.",
      "List missing Redis features honestly."
    ],
    "Built a miniature Redis-like Python server with RESP parsing, socket request handling, command dispatch, client helpers, and explicit demo-only database limits.",
    ["Original article was read through the final testing and extension notes."]
  ),
  approvedTutorialOverride(
    "programming-language-python-how-to-write-a-lisp-interpreter-in-python",
    "Individual review of Norvig's Lispy article plus Lispy 2 and interpreter representation references",
    "Approved path for Norvig's Lispy tutorial focused on Scheme syntax, parsing into Python lists, environments, eval rules, procedures, lexical scope, REPL behavior, and honest Scheme subset limits.",
    norvigLispyApprovedResources,
    [
      concept(
        "approved-lispy-parse-eval-loop",
        "Parse then evaluate",
        "Norvig makes the interpreter understandable by separating reading text into nested Python data from evaluating that data according to Scheme rules.",
        "Beginners need this split because syntax bugs, environment bugs, and evaluation bugs look similar until the program has visible representations at each stage.",
        [
          "You can show one Scheme expression as tokens, a Python list AST, and a final value.",
          "You can explain why numbers evaluate differently from symbols.",
          "You can name which function owns parsing and which owns evaluation."
        ],
        norvigLispyApprovedResources.slice(0, 3)
      ),
      concept(
        "approved-lispy-environments-procedures",
        "Environments give names meaning",
        "The tutorial's key interpreter idea is that an environment maps symbols to values, and user procedures carry the environment where they were created.",
        "That is the beginner bridge from a calculator to a language with variables, functions, recursion, and lexical scope.",
        [
          "You can describe the difference between a symbol and its value.",
          "You can trace a `define` into the environment.",
          "You can explain why a lambda call creates a local environment."
        ],
        [norvigLispyApprovedResources[0], norvigLispyApprovedResources[1], norvigLispyApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Run Lispy as a calculator",
        "Language 1: Lispy Calculator",
        "Learn Scheme's prefix syntax, atoms, list expressions, special forms, and the tiny target language before expanding toward full Scheme.",
        "Run or recreate the first calculator examples and write expected results beside each expression.",
        "If output surprises you, decide whether the bug is syntax, parsing, environment lookup, or procedure application.",
        "A few arithmetic and `if` examples evaluate exactly as predicted.",
        norvigLispyApprovedResources.slice(0, 3)
      ),
      checkpoint(
        "Build parser proof artifacts",
        "Parsing: parse, tokenize and read_from_tokens",
        "Learn tokenization as parenthesis spacing and syntactic analysis as nested Python list construction.",
        "Print tokens and parsed output for `(begin (define r 10) (* pi (* r r)))` before writing eval.",
        "If parentheses break parsing, inspect token order and the recursive read position before touching eval.",
        "README shows the source string, token list, and parsed Python representation.",
        [norvigLispyApprovedResources[0], norvigLispyApprovedResources[2]]
      ),
      checkpoint(
        "Implement environment-backed eval",
        "Environments and Evaluation",
        "Learn variable lookup, constants, `if`, `define`, and procedure calls as separate cases in eval.",
        "Implement eval case by case and add one example for each supported expression form.",
        "If a name is missing, inspect the environment before changing parser logic.",
        "Each Lispy calculator form has a passing example and a written explanation.",
        norvigLispyApprovedResources.slice(0, 3)
      ),
      checkpoint(
        "Add procedures and document limits",
        "Full Lispy and final review",
        "Learn `quote`, `set!`, `lambda`, nested environments, user-defined procedures, recursion, and the REPL as the full educational payoff.",
        "Define a recursive function and a simple higher-order example, then compare the finished subset with the limitations Norvig lists.",
        "If recursion or lambdas fail, trace parameter binding and outer environment lookup before adding new forms.",
        "README explains parse to eval to environment to procedure, plus missing Scheme features and error-handling limits.",
        norvigLispyApprovedResources.slice(0, 3)
      )
    ],
    [
      "Review Python lists, dictionaries, functions, exceptions, and recursion before starting.",
      "Write three tiny Scheme expressions by hand and predict their nested list representation.",
      "Keep one expression as a fixture through parse, eval, and REPL.",
      "Commit after parser, environment, eval cases, procedure support, and limitations notes."
    ],
    [
      "Demo the REPL evaluating arithmetic, variables, conditionals, lambdas, and recursion.",
      "Add README artifacts for tokens, parsed expressions, environments, and procedure calls.",
      "Include one scoping or parenthesis bug and how it was isolated.",
      "List the Scheme features Lispy intentionally omits."
    ],
    "Built Norvig's Lispy interpreter with parsing, evaluation, environments, procedures, recursion, REPL behavior, and clear Scheme-subset limitations.",
    ["Original article and Lispy 2 follow-up were read; approval is scoped to the first Lispy project with Lispy 2 as extension context."]
  ),
  approvedTutorialOverride(
    "regex-engine-c-regular-expression-matching-can-be-simple-and-fast",
    "Individual review of Russ Cox's Thompson NFA article plus VM follow-up and regex reference material",
    "Approved path for Russ Cox's regex tutorial focused on catastrophic backtracking, Thompson NFA construction, state-list simulation, match correctness, and why the implementation is fast.",
    russCoxRegexApprovedResources,
    [
      concept(
        "approved-russcox-backtracking-vs-nfa",
        "Backtracking versus NFA simulation",
        "The article's main lesson is that many regex engines explore alternatives by backtracking, while Thompson-style simulation tracks all possible NFA states in lockstep.",
        "Beginners need this contrast to understand why a small C matcher can avoid catastrophic cases that defeat naive backtracking.",
        [
          "You can explain why nested optional patterns can explode for backtracking engines.",
          "You can describe state-list simulation without recursion over every possible path.",
          "You can connect the performance graph to implementation strategy."
        ],
        russCoxRegexApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-russcox-thompson-construction",
        "Regex becomes instructions and state lists",
        "The implementation compiles regular-expression syntax into an NFA-like program, then repeatedly moves a list of active states over the input characters.",
        "That gives the learner a concrete project map: parse/compile the pattern, simulate it, then add caching or VM refinements later.",
        [
          "You can identify literal, split, jump, and match-like states.",
          "You can explain why duplicate active states must be avoided.",
          "You can trace one character through current and next state lists."
        ],
        [russCoxRegexApprovedResources[0], russCoxRegexApprovedResources[1], russCoxRegexApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Reproduce the performance problem",
        "Introduction and performance comparison",
        "Learn the exact motivation: some backtracking matchers can take exponential time on patterns that a Thompson NFA handles predictably.",
        "Write or run the article's small family of repeated optional patterns and record expected versus dangerous behavior.",
        "If the test feels artificial, explain why it still exposes an engine strategy problem.",
        "README states the problem the matcher is trying to avoid.",
        russCoxRegexApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Represent regex syntax and NFA fragments",
        "Regular expression syntax and Thompson construction",
        "Learn the supported regex subset and how each construct becomes a fragment that can be patched into a larger machine.",
        "Build small diagrams for literal, concatenation, alternation, star, plus, and question before coding the simulation.",
        "If compilation gets tangled, reduce to literals and concatenation, then add one operator at a time.",
        "Each supported operator has a fragment sketch and one tiny test.",
        [russCoxRegexApprovedResources[0], russCoxRegexApprovedResources[2], russCoxRegexApprovedResources[3]]
      ),
      checkpoint(
        "Simulate active state lists",
        "NFA simulation",
        "Learn current and next state lists, epsilon transitions, and duplicate suppression as the heart of the fast matcher.",
        "Trace one pattern over one input character by character and print active state ids.",
        "If matching is wrong, inspect addstate/epsilon closure before changing syntax compilation.",
        "A trace shows active states moving predictably over the input.",
        [russCoxRegexApprovedResources[0], russCoxRegexApprovedResources[1]]
      ),
      checkpoint(
        "Document supported regex features and limits",
        "DFA cache and conclusion",
        "Learn why the article's core technique is powerful but not the same as a full modern regex engine with captures, backreferences, Unicode, and engine-specific assertions.",
        "Add a limitations table and compare one omitted feature against Python or MDN regex docs.",
        "If a feature relies on backreferences, note that it is outside regular-language Thompson matching.",
        "README explains backtracking risk, NFA simulation, supported syntax, and omitted production regex features.",
        russCoxRegexApprovedResources.slice(0, 4)
      )
    ],
    [
      "Review C structs, pointers, arrays, and simple string loops before implementing the matcher.",
      "Learn the regex syntax subset before adding operators to the compiler.",
      "Keep tests for literal, concatenation, alternation, repetition, and non-match cases separate.",
      "Commit after syntax representation, fragment construction, state-list simulation, and limits documentation."
    ],
    [
      "Demo matching several supported patterns and one catastrophic-backtracking comparison case.",
      "Add README diagrams for Thompson fragments and active state lists.",
      "Include one duplicate-state or epsilon-transition bug and how it was traced.",
      "List unsupported regex features such as captures, backreferences, lookaround, Unicode classes, and replacement APIs."
    ],
    "Built the Russ Cox Thompson-style regex matcher with pattern compilation, NFA state-list simulation, performance motivation, and clear regex-feature boundaries.",
    ["Original article and VM follow-up were read; approval focuses on regexp1 as the build target and regexp2 as deeper implementation context."]
  ),
  approvedTutorialOverride(
    "template-engine-python-approach-building-a-toy-template-engine-in-python",
    "Individual review of Alex Michael's toy template engine plus Python ast.literal_eval and Django template-language references",
    "Approved path for the toy Python template engine focused on token/fragments, node classes, AST compilation, scope stacks, context resolution, rendering, and production-safety limits.",
    toyTemplateApprovedResources,
    [
      concept(
        "approved-toy-template-fragments-ast",
        "Template text becomes fragments and nodes",
        "The tutorial teaches a template engine as a pipeline: split markup into text, variable, and block fragments, then compile those fragments into a tree of node objects.",
        "This gives beginners a concrete way to understand template rendering without starting inside Django or Jinja internals.",
        [
          "You can mark text, variable, and block fragments in one template.",
          "You can explain why block tags can create nested scopes.",
          "You can draw the node tree for an `each` block."
        ],
        toyTemplateApprovedResources.slice(0, 3)
      ),
      concept(
        "approved-toy-template-context-resolution",
        "Rendering resolves names against context",
        "Rendering walks the compiled node tree and turns literals or context names into output, including dotted lookup and parent-context references.",
        "Beginners need this distinction because template syntax only becomes useful when variables are resolved predictably and safely.",
        [
          "You can distinguish literal values from context variable names.",
          "You can trace `user.name` through nested dictionaries.",
          "You can explain why a missing context value should raise a clear template error."
        ],
        [toyTemplateApprovedResources[0], toyTemplateApprovedResources[1], toyTemplateApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Render plain text and variables first",
        "Template syntax and fragment basics",
        "Learn the target syntax before nesting: plain text should pass through and variable fragments should resolve from a context dictionary.",
        "Create one template with plain text and one variable, then print the fragment stream before rendering.",
        "If output is empty, inspect fragment detection before node classes.",
        "Plain text and one variable render from a small context.",
        toyTemplateApprovedResources.slice(0, 3)
      ),
      checkpoint(
        "Compile fragments into node classes",
        "Compiling templates",
        "Learn why text, variables, and blocks need different node classes with a shared render interface.",
        "Implement node creation for text and variable fragments, then add one block node after the simple cases work.",
        "If the wrong node type appears, print fragment type and command before rendering.",
        "A template compiles into a readable root node with children.",
        [toyTemplateApprovedResources[0], toyTemplateApprovedResources[2]]
      ),
      checkpoint(
        "Handle nested scopes with a stack",
        "Scope stack and block closing",
        "Learn the scope stack that pushes block nodes when they open and pops them when closing tags appear.",
        "Add an `each` block and verify that nested children are attached to the block, not the root.",
        "If nesting breaks, inspect scope_stack before and after every open or close tag.",
        "A nested template compiles to the expected parent/child tree.",
        toyTemplateApprovedResources.slice(0, 3)
      ),
      checkpoint(
        "Render and document safety gaps",
        "Rendering and conclusion",
        "Learn literal evaluation, context lookup, dotted paths, parent context, and why a toy engine is not production safe by default.",
        "Render a list loop and nested variable lookup, then document escaping, sandboxing, inheritance, filters, includes, and error-reporting gaps.",
        "If rendered output is wrong, decide whether the error is fragmenting, compilation, scope handling, or context resolution.",
        "README explains fragmenting, compilation, scope stack, rendering, and missing production template features.",
        toyTemplateApprovedResources.slice(0, 3)
      )
    ],
    [
      "Review Python classes, regex/string splitting, dictionaries, recursion/tree walking, and exceptions.",
      "Write a tiny template and manually mark text, variable, and block fragments.",
      "Keep one fixture for plain variables and one for nested `each` blocks.",
      "Commit after fragmenting, node compilation, scope stack, rendering, and limitations notes."
    ],
    [
      "Demo rendering text, variables, dotted names, and a repeated block from context data.",
      "Add README diagrams for fragment stream, node tree, and render walk.",
      "Include one nesting or context-resolution bug and how it was isolated.",
      "List production template concerns such as escaping, sandboxing, inheritance, filters, includes, caching, and debug line numbers."
    ],
    "Built a toy Python template engine with fragment parsing, node-tree compilation, scope-stack nesting, context resolution, rendering, and explicit production-safety limitations.",
    ["Original article and exact supporting docs were read; approval is scoped to the toy engine, not a production-safe template engine."]
  ),
  approvedTutorialOverride(
    "programming-language-javascript-the-super-tiny-interpreter",
    "Individual review of The Super Tiny Interpreter README/source plus MDN closures, Babel parser, and ESTree references",
    "Approved path for The Super Tiny Interpreter focused on Babel AST parsing, expression and statement interpretation, environments, closures, lexical versus dynamic scope, recursive functions, and explicit WIP limits.",
    superTinyInterpreterApprovedResources,
    [
      concept(
        "approved-sti-ast-to-eval",
        "AST nodes drive interpreter cases",
        "The tutorial uses Babel to parse a small JavaScript subset, then interprets each supported AST node type instead of trying to execute source text directly.",
        "That gives beginners the crucial compiler/interpreter split: parsing produces structure, and evaluation gives that structure meaning.",
        [
          "You can point to the parser boundary before any values are computed.",
          "You can explain why a number literal, identifier, call expression, and const declaration need different cases.",
          "You can debug one wrong result by naming the AST node type that owns it."
        ],
        [superTinyInterpreterApprovedResources[0], superTinyInterpreterApprovedResources[1], superTinyInterpreterApprovedResources[4]]
      ),
      concept(
        "approved-sti-closures-environments",
        "Closures remember an environment",
        "The project models a closure as a function together with the environment available when that function was created, then contrasts lexical and dynamic lookup behavior.",
        "This is the real learning payoff: JavaScript functions are not just code blocks; they carry name-resolution context that affects every nested function call.",
        [
          "You can describe what is stored in the closure object.",
          "You can explain why lexical and dynamic scope can produce different answers.",
          "You can trace a recursive const function through the environment lookup path."
        ],
        [superTinyInterpreterApprovedResources[0], superTinyInterpreterApprovedResources[2], superTinyInterpreterApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Run the supported syntax subset",
        "README and example programs",
        "Learn the deliberately small JavaScript subset first: literals, identifiers, binary/unary operators, ternary expressions, arrow functions, calls, blocks, returns, and const declarations.",
        "Run tiny examples for each supported construct and write down which AST/eval case should handle it.",
        "If a normal JavaScript feature fails, compare it against the README's supported-syntax list before changing interpreter code.",
        "A small fixture file shows each supported construct and at least one intentionally unsupported construct.",
        superTinyInterpreterApprovedResources.slice(0, 5)
      ),
      checkpoint(
        "Inspect parsed AST before interpreting",
        "Parser and AST cleaning",
        "Learn that Babel produces a tree with many fields, while this tutorial strips metadata so the interpreter can focus on node type and child structure.",
        "Print the cleaned AST for a const declaration and an arrow function before writing new interpreter behavior.",
        "If interpretation breaks, inspect the AST shape first rather than guessing how Babel represented the source.",
        "README includes one source snippet and its cleaned AST representation.",
        [superTinyInterpreterApprovedResources[0], superTinyInterpreterApprovedResources[4], superTinyInterpreterApprovedResources[1]]
      ),
      checkpoint(
        "Trace expression and statement evaluation",
        "ExpressionInterp and StatementInterp",
        "Learn why expressions produce values while statements manage program flow, declarations, blocks, and returns.",
        "Add trace logs or tests for literals, identifiers, binary expressions, calls, blocks, returns, and const declarations.",
        "If a value appears in the wrong place, decide whether the expression interpreter, statement interpreter, or environment owns the bug.",
        "Each interpreter case has one passing example and one written sentence explaining its job.",
        [superTinyInterpreterApprovedResources[1], superTinyInterpreterApprovedResources[0], superTinyInterpreterApprovedResources[4]]
      ),
      checkpoint(
        "Prove closure behavior and document limits",
        "Closure, environment, and options",
        "Learn closure application, environment extension, recursive closure handling, and the lexical/dynamic scope option as the tutorial's central concept.",
        "Run one nested closure example, one recursive function, and one lexical-versus-dynamic scope comparison, then document what this interpreter does not support.",
        "If a closure sees the wrong variable, print the closure environment and call-time environment separately.",
        "README explains AST parsing, environments, closures, recursion, scope mode, and WIP limitations.",
        [superTinyInterpreterApprovedResources[2], superTinyInterpreterApprovedResources[3], superTinyInterpreterApprovedResources[0]]
      )
    ],
    [
      "Review JavaScript functions, arrow functions, const bindings, and block scope before editing interpreter cases.",
      "Learn Babel parser output with two tiny snippets before interpreting the AST.",
      "Keep one fixture for literals/operators, one for functions, and one for closures.",
      "Commit after parser inspection, expression eval, statement eval, closure proof, and limitations notes."
    ],
    [
      "Demo the interpreter running literals, operators, const declarations, function calls, closures, and recursion.",
      "Add README artifacts for source code, AST shape, environment lookup, and closure application.",
      "Include one scoping bug and how inspecting environments exposed it.",
      "List unsupported JavaScript features and repeat the tutorial's WIP/spec-compliance caveat clearly."
    ],
    "Built a JavaScript interpreter slice with Babel AST parsing, expression and statement evaluation, immutable environments, closure application, lexical/dynamic scope comparison, recursion, and explicit JavaScript-subset limits.",
    ["The README explicitly labels the project WIP; approval is scoped to closure/interpreter learning, not to spec-complete JavaScript."] 
  ),
  approvedTutorialOverride(
    "uncategorized-typescript-tiny-package-manager-learns-how-npm-or-yarn-works",
    "Individual review of Tiny Package Manager README/source plus npm package metadata, package-lock, and SemVer references",
    "Approved path for Tiny Package Manager focused on package.json inputs, npm registry manifests, semver range resolution, dependency flattening, conflict handling, tarball installation, and lock-file persistence.",
    tinyPackageManagerApprovedResources,
    [
      concept(
        "approved-tiny-pm-resolution-graph",
        "Dependency resolution is graph work",
        "The tutorial turns package.json dependencies into registry manifest lookups, version choices, child dependencies, and a tree that may contain conflicts.",
        "That is the missing beginner bridge behind npm and Yarn: installing a package is not one download, it is repeated constraint solving over dependency metadata.",
        [
          "You can explain the difference between a dependency name, version range, resolved version, and tarball URL.",
          "You can trace one direct dependency into its transitive dependencies.",
          "You can say why two compatible ranges can share one installed package while incompatible ranges cannot."
        ],
        [tinyPackageManagerApprovedResources[0], tinyPackageManagerApprovedResources[2], tinyPackageManagerApprovedResources[4], tinyPackageManagerApprovedResources[5]]
      ),
      concept(
        "approved-tiny-pm-flatten-lock-install",
        "Install trees need a reproducible record",
        "The source separates deciding what should be installed from fetching tarballs into node_modules and writing a YAML lock file that records chosen versions.",
        "Beginners need this boundary to understand why lock files exist and why package managers can be slow, surprising, or hard to reproduce.",
        [
          "You can distinguish resolution, installation, and lock-file writing.",
          "You can explain why flattening node_modules is useful but not always possible.",
          "You can describe what would change if the lock file already contains a package."
        ],
        [tinyPackageManagerApprovedResources[0], tinyPackageManagerApprovedResources[1], tinyPackageManagerApprovedResources[3], tinyPackageManagerApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Start from a tiny package.json",
        "CLI entry and package.json discovery",
        "Learn the input contract: the package manager reads package.json, optionally adds CLI-requested dependencies, and filters dependencies before resolution.",
        "Create a fixture package.json with one dependency, run the CLI flow, and log the root dependency list before any network fetch.",
        "If the project cannot start, verify current directory, package.json parsing, and CLI arguments before debugging registry code.",
        "A fixture shows root dependencies and the top-level install request clearly.",
        [tinyPackageManagerApprovedResources[0], tinyPackageManagerApprovedResources[1], tinyPackageManagerApprovedResources[4]]
      ),
      checkpoint(
        "Resolve manifests and semver ranges",
        "list.ts dependency traversal",
        "Learn how registry manifests, semver max-satisfying choices, and recursive child dependency traversal build the install plan.",
        "Trace one dependency through manifest fetch, version selection, child dependencies, and conflict detection.",
        "If the wrong version is chosen, inspect the semver range and available versions before touching install code.",
        "README contains one resolved dependency tree with version ranges and chosen versions.",
        [tinyPackageManagerApprovedResources[2], tinyPackageManagerApprovedResources[5], tinyPackageManagerApprovedResources[4]]
      ),
      checkpoint(
        "Download tarballs into node_modules",
        "install.ts and node_modules layout",
        "Learn installation as filesystem work after resolution: create directories, fetch package tarballs, and extract package contents into a package path.",
        "Install one resolved package into a clean node_modules directory and inspect the extracted files.",
        "If files land in the wrong place, log the package name, install path, tarball URL, and extraction root.",
        "A clean run creates the expected node_modules package folder from the resolved tarball.",
        [tinyPackageManagerApprovedResources[1], tinyPackageManagerApprovedResources[2], tinyPackageManagerApprovedResources[0]]
      ),
      checkpoint(
        "Write the lock file and limits table",
        "lock.ts and project omissions",
        "Learn the lock file as the reproducibility record and document what this educational manager intentionally omits.",
        "Run the install twice, compare the lock output, then document omitted lifecycle scripts, binary symlinks, workspaces, audits, peer dependency handling, and production security behavior.",
        "If a second install changes unexpectedly, compare lock reads, manifest fetches, and updateOrCreate behavior.",
        "README explains package.json input, resolution, install, lock-file reuse, conflict handling, and omitted npm/Yarn features.",
        [tinyPackageManagerApprovedResources[3], tinyPackageManagerApprovedResources[4], tinyPackageManagerApprovedResources[0]]
      )
    ],
    [
      "Review TypeScript modules, async/await, promises, filesystem paths, and JSON parsing.",
      "Read npm package.json fields and SemVer range rules before implementing resolution.",
      "Use a throwaway fixture package instead of testing against a real project first.",
      "Commit after CLI/package parsing, resolution tree, install extraction, lock writing, and limitations notes."
    ],
    [
      "Demo installing a tiny fixture dependency into node_modules from a clean directory.",
      "Add README artifacts for dependency tree, chosen versions, lock-file content, and node_modules layout.",
      "Include one semver or conflict-resolution bug and how the trace exposed it.",
      "List production package-manager features deliberately not implemented."
    ],
    "Built a tiny TypeScript package manager with package.json parsing, npm registry manifest resolution, semver version choice, dependency flattening/conflict handling, tarball installation, lock-file persistence, and honest npm/Yarn limitations.",
    ["The README/source present this as an educational demo; approval is scoped to learning package-manager mechanics, not replacing npm or Yarn."]
  ),
  approvedTutorialOverride(
    "bittorrent-client-nim-writing-a-bencode-parser",
    "Individual review of Nim Days bencode parser plus BEP 3 bencoding and Nim variant-object references",
    "Approved path for the Nim bencode parser focused on BitTorrent's bencoded wire format, variant object modeling, recursive encoding/decoding, consumed-length parsing, and parser correctness limits.",
    nimBencodeApprovedResources,
    [
      concept(
        "approved-bencode-wire-format",
        "Bencode is a small wire grammar",
        "The tutorial teaches BitTorrent's bencode format as four encodings: length-prefixed strings, i...e integers, l...e lists, and d...e dictionaries.",
        "That makes a BitTorrent client less mysterious for beginners: before peers and pieces, torrent metadata is a deterministic byte/string format you can parse.",
        [
          "You can decode `4:spam`, `i42e`, `l4:spami42ee`, and a tiny dictionary by hand.",
          "You can explain why the parser must know how many characters it consumed.",
          "You can name one malformed input that should not silently parse."
        ],
        [nimBencodeApprovedResources[0], nimBencodeApprovedResources[1]]
      ),
      concept(
        "approved-bencode-variant-recursion",
        "Variant objects model recursive data",
        "The Nim implementation uses an enum plus variant object so one Bencode value can be a string, int, list of Bencode values, or dictionary of Bencode values.",
        "This is the beginner bridge from raw text parsing to typed recursive data structures that can be encoded, decoded, compared, and tested.",
        [
          "You can explain why the enum controls which object field is valid.",
          "You can trace encode/decode recursion through a nested list or dictionary.",
          "You can describe why hash/equality matter once bencode values are stored in Nim tables."
        ],
        [nimBencodeApprovedResources[0], nimBencodeApprovedResources[2], nimBencodeApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Decode primitive values by hand",
        "Bencode basics",
        "Learn the exact grammar for strings and integers before touching recursive lists or dictionaries.",
        "Write fixtures for string and integer examples, then manually mark the consumed range for each.",
        "If decoding drifts, check the length prefix or terminating `e` before changing data types.",
        "String and integer fixtures round-trip through encode/decode with consumed lengths.",
        [nimBencodeApprovedResources[0], nimBencodeApprovedResources[1]]
      ),
      checkpoint(
        "Define the recursive Nim value type",
        "BencodeKind and BencodeType",
        "Learn Nim enums and object variants as a way to store different bencode cases in one type.",
        "Define the variant object and add equality/hash behavior before writing recursive parser logic.",
        "If fields are unavailable, inspect the active enum branch for the variant object.",
        "A small test constructs each Bencode kind directly and compares expected values.",
        [nimBencodeApprovedResources[0], nimBencodeApprovedResources[2], nimBencodeApprovedResources[3]]
      ),
      checkpoint(
        "Encode nested lists and dictionaries",
        "Encoder implementation",
        "Learn recursive encoding: primitive cases produce text directly, while lists and dictionaries encode each child in order.",
        "Encode one nested list and one dictionary, then compare output against hand-written bencode fixtures.",
        "If output is malformed, reduce to one child value and inspect separators, prefixes, and end markers.",
        "Nested list and dictionary values encode to expected bencode strings.",
        [nimBencodeApprovedResources[0], nimBencodeApprovedResources[1], nimBencodeApprovedResources[2]]
      ),
      checkpoint(
        "Decode recursively and document parser gaps",
        "Decoder implementation",
        "Learn why the decoder returns both a parsed value and the number of consumed characters so callers can continue after nested values.",
        "Decode nested list/dictionary fixtures and document validation gaps such as sorted dictionary keys, leading-zero integers, malformed inputs, byte-vs-Unicode handling, and torrent info-hash constraints.",
        "If nested parsing loops or skips data, print the current cursor and consumed length at every recursive return.",
        "README explains bencode grammar, variant model, recursive encode/decode, consumed-length parsing, and BitTorrent parser limitations.",
        nimBencodeApprovedResources.slice(0, 4)
      )
    ],
    [
      "Review Nim strings, sequences, tables, enums, object variants, and simple testing before starting.",
      "Write four hand-decoded bencode examples before coding.",
      "Keep fixtures for primitive values, one nested list, and one nested dictionary.",
      "Commit after type modeling, primitive decode, recursive encode, recursive decode, and limitations notes."
    ],
    [
      "Demo round-tripping primitive, list, and dictionary bencode fixtures.",
      "Add README artifacts for the grammar, variant object shape, and consumed-length trace.",
      "Include one malformed-input or cursor bug and how tracing fixed it.",
      "List what remains before this becomes a full BitTorrent client parser."
    ],
    "Built a Nim bencode parser with typed variant-object representation, recursive encoding/decoding, consumed-length parsing, fixture-based proofs, and BitTorrent-specific parser limitation notes.",
    ["Original Nim Days article and BEP 3 bencoding section were read; approval is scoped to a bencode parser, not a complete BitTorrent client."]
  ),
  approvedTutorialOverride(
    "uncategorized-nim-writing-a-redis-protocol-parser",
    "Individual review of Nim Days Redis Protocol article plus Redis RESP spec and Nim variant/string references",
    "Approved path for the Nim RESP parser focused on Redis wire framing, CRLF boundaries, variant value modeling, encoder/decoder symmetry, array recursion, command preparation, and RESP2 limitation notes.",
    nimRespApprovedResources,
    [
      concept(
        "approved-resp-wire-types",
        "RESP is framed by prefixes and CRLF",
        "The tutorial turns Redis replies and commands into five RESP2 cases: simple strings, errors, integers, bulk strings, and arrays, each identified by a prefix byte and CRLF boundaries.",
        "This helps beginners see Redis networking as a parseable wire protocol before they try to build a server or client.",
        [
          "You can identify the first byte for each RESP2 type.",
          "You can explain why bulk strings need a byte length plus trailing CRLF.",
          "You can hand-decode a nested array response without running code."
        ],
        [nimRespApprovedResources[0], nimRespApprovedResources[1]]
      ),
      concept(
        "approved-resp-variant-encode-decode",
        "One variant type backs both encode and decode",
        "The Nim implementation represents Redis values with a variant object, then writes one encoder and one decoder branch for each value kind.",
        "That gives the learner a clean mental model: every protocol type should have a typed representation, an encoder proof, a decoder proof, and a malformed-input story.",
        [
          "You can map vkStr, vkError, vkInt, vkBulkStr, and vkArray to wire examples.",
          "You can explain why nested arrays require recursive decoding.",
          "You can tell whether a bug belongs to parsing, variant construction, or command preparation."
        ],
        [nimRespApprovedResources[0], nimRespApprovedResources[2], nimRespApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Hand-decode RESP examples first",
        "What do we expect?",
        "Learn the exact target behavior from the tutorial's example inputs before implementing any parser branch.",
        "Write fixtures for +simple, -error, :integer, $bulk, $-1 null bulk, and one nested array, with expected Nim values beside each.",
        "If an example seems ambiguous, compare it against the Redis RESP spec before encoding that behavior.",
        "Fixtures cover each RESP2 value type and one nested array.",
        [nimRespApprovedResources[0], nimRespApprovedResources[1]]
      ),
      checkpoint(
        "Model Redis values in Nim",
        "Data types",
        "Learn variant objects as the bridge from protocol prefixes to typed values with display, hash, and equality behavior.",
        "Define RedisValue and add direct construction tests for every kind before writing encode or decode functions.",
        "If a field is inaccessible, check the active variant branch rather than changing parser logic.",
        "Each RedisValue kind can be constructed, displayed, and compared in a tiny test.",
        [nimRespApprovedResources[0], nimRespApprovedResources[2]]
      ),
      checkpoint(
        "Encode and decode each branch symmetrically",
        "Encoder and Decoder",
        "Learn encode/decode symmetry: a valid value should produce valid RESP, and valid RESP should reconstruct the expected RedisValue plus consumed length.",
        "Implement one branch at a time and round-trip simple strings, errors, integers, bulk strings, null bulk strings, and arrays.",
        "If a nested array misreads the next value, print cursor/consumed length and CRLF positions on every recursive return.",
        "Branch fixtures round-trip and nested arrays preserve element order and types.",
        nimRespApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Prepare commands and document protocol gaps",
        "Preparing commands",
        "Learn how Redis commands become RESP arrays of bulk strings, and document where the tutorial stays smaller than a production RESP client.",
        "Build GET/SET command encodings, then add a limitations table for RESP3, streaming, pipelining, binary safety, partial reads, network errors, and strict malformed input handling.",
        "If command output is rejected by Redis, inspect array count, bulk byte lengths, command casing, and trailing CRLF.",
        "README explains RESP prefixes, CRLF, variant modeling, recursion, command preparation, and omitted production behavior.",
        [nimRespApprovedResources[0], nimRespApprovedResources[1], nimRespApprovedResources[3]]
      )
    ],
    [
      "Review Nim enums, object variants, strings, sequences, parseInt, and split/find utilities.",
      "Write a table of RESP prefix byte to value kind before coding.",
      "Keep fixtures for every RESP2 type and at least one nested array.",
      "Commit after value modeling, primitive encode/decode, array recursion, command preparation, and limitations notes."
    ],
    [
      "Demo encoding GET/SET commands and decoding nested RESP replies.",
      "Add README artifacts for raw RESP, parsed RedisValue objects, and cursor movement.",
      "Include one CRLF or consumed-length bug and how tracing found it.",
      "List RESP3/client networking features intentionally not implemented."
    ],
    "Built a Nim RESP parser/encoder with typed RedisValue variants, CRLF-aware branch decoders, recursive array parsing, command encoding, fixture proofs, and explicit Redis-client limitations.",
    ["Original Nim Days article and Redis RESP spec were read; approval is scoped to protocol serialization/parsing, not a full Redis client."]
  ),
  approvedTutorialOverride(
    "uncategorized-nim-writing-a-ini-parser",
    "Individual review of Nim Days INI Parser plus Nim parsecfg, Python configparser, and Nim string utilities",
    "Approved path for the Nim INI parser focused on line-oriented parsing, section/property data modeling, parser state, comment/blank-line handling, serialization, helper APIs, and realistic INI dialect limitations.",
    nimIniApprovedResources,
    [
      concept(
        "approved-ini-line-state-machine",
        "INI parsing is line state, not magic",
        "The tutorial uses a simple state machine: section lines switch the current section, while key/value lines attach properties to that section.",
        "That is a useful beginner parser because every decision can be observed on one line at a time before learning richer config-file parsers.",
        [
          "You can classify a line as blank/comment, section, key/value, or malformed.",
          "You can explain what currentSectionName stores.",
          "You can predict where a property will be stored after a section switch."
        ],
        [nimIniApprovedResources[0], nimIniApprovedResources[3]]
      ),
      concept(
        "approved-ini-dialect-boundaries",
        "INI has dialects and edge cases",
        "The toy parser supports a narrow format: bracketed sections, equals-separated key/value pairs, blank lines, and comment lines.",
        "Beginners need this honesty because real config parsers differ on delimiters, duplicate keys, interpolation, no-value keys, inline comments, multiline values, ordering, and error reporting.",
        [
          "You can name three INI behaviors this toy parser does not support.",
          "You can compare the toy parser with Nim parsecfg or Python configparser.",
          "You can write one malformed line test and decide whether to reject or ignore it."
        ],
        [nimIniApprovedResources[0], nimIniApprovedResources[1], nimIniApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Parse the sample by hand",
        "What to expect?",
        "Learn the target structure from the tutorial's sample file: two sections, string keys, string values, and retrieval through helper methods.",
        "Copy the sample INI, annotate every line with its kind, and write the expected section/property table before coding.",
        "If expected output is unclear, compare section/key rules against Nim parsecfg and Python configparser examples.",
        "A written table shows sections, keys, values, blank lines, and comments.",
        nimIniApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Build Section and Ini helpers",
        "Data types and helpers",
        "Learn the storage model: Section owns properties, Ini owns sections, and helpers make tests readable before parser logic exists.",
        "Implement constructors, get/set/delete helpers, count helpers, and toIniString, then test them without parsing text.",
        "If parser tests fail later, first verify that the helper API works with direct object construction.",
        "Direct helper tests can create, read, update, delete, and serialize sections/properties.",
        [nimIniApprovedResources[0], nimIniApprovedResources[1]]
      ),
      checkpoint(
        "Implement the two-state parser",
        "Parser states and parseIni proc",
        "Learn readSection versus readKV as an explicit parser state and keep track of currentSectionName while scanning lines.",
        "Parse blank lines, comments, [section] lines, and key=value lines with a trace of state transitions.",
        "If a key lands under the wrong section, log state and currentSectionName before and after every section line.",
        "The sample parses into the expected table, and trace logs explain each transition.",
        [nimIniApprovedResources[0], nimIniApprovedResources[3]]
      ),
      checkpoint(
        "Test dialect edges and document limits",
        "Supported INI structure comparison",
        "Learn why production parsers are larger: they handle alternative delimiters, duplicate behavior, comments, multiline values, default sections, interpolation, no-value keys, and precise errors.",
        "Add tests for inline comments, duplicate keys, colon delimiters, missing sections, malformed section headers, and values containing equals signs, then document decisions.",
        "If a feature feels simple, compare it against parsecfg/configparser before claiming support.",
        "README explains supported syntax, parser states, serialization, helper API, and unsupported INI dialect features.",
        [nimIniApprovedResources[1], nimIniApprovedResources[2], nimIniApprovedResources[0]]
      )
    ],
    [
      "Review Nim tables, strings, splitLines, strip, startsWith, endsWith, and exception basics.",
      "Write the supported INI grammar in four bullet points before coding.",
      "Use one happy-path sample and one malformed sample as fixtures.",
      "Commit after helpers, parser state, serialization, dialect-edge tests, and limitations notes."
    ],
    [
      "Demo parsing and serializing a sample config with two sections.",
      "Add README artifacts for line classification, state transitions, and section/property storage.",
      "Include one malformed-line or wrong-section bug and how tracing fixed it.",
      "List unsupported INI behaviors compared with Nim parsecfg and Python configparser."
    ],
    "Built a Nim INI parser with section/property helpers, line-oriented state parsing, comment/blank-line handling, serialization, fixture tests, and clear INI-dialect limitations.",
    ["Original Nim Days article and official config-parser references were read; approval is scoped to a small educational INI dialect."]
  ),
  approvedTutorialOverride(
    "uncategorized-python-json-decoding-algorithm",
    "Individual review of JSON Decoding Algorithm README/source plus RFC 8259 and Python json references",
    "Approved path for the JSON Decoding Algorithm focused on table-driven recognition, character categories, parser/goto stacks, semantic actions, JSON value construction, verifier coverage, and Python 2-era portability caveats.",
    jsonAlgorithmApprovedResources,
    [
      concept(
        "approved-json-table-recognizer",
        "A table-driven recognizer replaces hand branches",
        "This project parses JSON by looking up character categories in generated state tables, then shifting, popping, or moving states instead of writing a normal recursive-descent parser.",
        "That gives beginners a rare view of parser mechanics: syntax recognition can be data-driven, while semantic actions remain ordinary code.",
        [
          "You can explain what states, gotos, and catcode each contribute.",
          "You can trace one input character through state lookup and action extraction.",
          "You can say why build_tables.py should be changed instead of hand-editing json.txt."
        ],
        [jsonAlgorithmApprovedResources[0], jsonAlgorithmApprovedResources[1], jsonAlgorithmApprovedResources[2]]
      ),
      concept(
        "approved-json-actions-stacks",
        "Actions build values while recognition checks syntax",
        "The driver separates recognition from construction: the table accepts JSON syntax, while do_action mutates data, string, and escape stacks to build Python values.",
        "This is the core bridge from 'valid JSON text' to actual decoded objects, and it also shows where strings, escapes, numbers, arrays, and objects can fail.",
        [
          "You can map action codes to push list/object/null/true/false/string/number behavior.",
          "You can explain why string and escape stacks are separate from the data stack.",
          "You can compare accepted JSON values against RFC 8259 edge cases."
        ],
        [jsonAlgorithmApprovedResources[0], jsonAlgorithmApprovedResources[2], jsonAlgorithmApprovedResources[3], jsonAlgorithmApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Understand the table files before porting",
        "Parsing tables for JSON",
        "Learn the project architecture: build_tables.py generates states/gotos/catcode, json.txt stores those generated tables, and the README shows the portable driver.",
        "Trace one simple input such as true or [] through catcode lookup, state transition, and final accept state.",
        "If the table feels unreadable, inspect build_tables.py's looser state definitions before reading the packed json.txt values.",
        "README notes explain states, gotos, catcode, action bits, and why tables are generated.",
        [jsonAlgorithmApprovedResources[0], jsonAlgorithmApprovedResources[1], jsonAlgorithmApprovedResources[2]]
      ),
      checkpoint(
        "Implement the driver loop and syntax errors",
        "Tutorial for implementing a JSON decoder or parser",
        "Learn parse and parse_ch as the recognizer loop that consumes characters, handles shifts/pops, and rejects invalid syntax or truncated input.",
        "Port the driver to a modern Python file or another language, then test true, false, null, numbers, strings, arrays, objects, truncation, and extra-object errors.",
        "If the state never returns to zero, trace stack pushes/pops and the final whitespace flush.",
        "Driver tests prove accept, syntax error, truncated input, and too-many-objects cases.",
        [jsonAlgorithmApprovedResources[0], jsonAlgorithmApprovedResources[2], jsonAlgorithmApprovedResources[3]]
      ),
      checkpoint(
        "Write semantic actions deliberately",
        "do_action and value construction",
        "Learn semantic actions as the construction layer: values are pushed to a data stack, string characters accumulate separately, and escapes/unicode points are resolved before string completion.",
        "Implement do_action with tests for nested arrays, objects, escaped characters, unicode escapes, ints, floats, booleans, and null.",
        "If valid syntax returns wrong data, inspect action behavior before changing state tables.",
        "Complex fixtures decode to expected Python values and demonstrate escape handling.",
        [jsonAlgorithmApprovedResources[0], jsonAlgorithmApprovedResources[2], jsonAlgorithmApprovedResources[4]]
      ),
      checkpoint(
        "Verify coverage and document modernization limits",
        "Bugfixes and verifier.py",
        "Learn why the repo verifies state-transition coverage and why this code should be modernized carefully for Python 3 or another target language.",
        "Run or adapt verifier-style fixtures, compare against Python's json module, and document Python 2 syntax, Unicode surrogate handling, duplicate object names, numeric precision/range, streaming multiple JSON texts, and denial-of-service limits.",
        "If behavior differs from Python json, decide whether it is a spec issue, implementation choice, or Python extension such as NaN/Infinity.",
        "README explains table generation, recognizer/action split, verification, RFC edge cases, and modernization caveats.",
        [jsonAlgorithmApprovedResources[2], jsonAlgorithmApprovedResources[3], jsonAlgorithmApprovedResources[4]]
      )
    ],
    [
      "Review stacks, finite-state machines, hex numbers/bit masks, Python lists/dicts, and JSON syntax before porting code.",
      "Read build_tables.py before treating json.txt as magic.",
      "Keep tiny fixtures for each JSON value type and one nested object/array.",
      "Commit after table loading, driver loop, semantic actions, verifier fixtures, and modernization notes."
    ],
    [
      "Demo decoding primitive values, strings with escapes, arrays, and objects.",
      "Add README artifacts for state lookup, parser stack, data/string/escape stacks, and action codes.",
      "Include one syntax-vs-action bug and how the trace isolated it.",
      "List Python 2-era and RFC compliance caveats honestly."
    ],
    "Built or ported a table-driven JSON decoder with generated parsing tables, character category lookup, parser/goto stacks, semantic action handlers, verifier-style coverage tests, and standards-based caveats.",
    ["Original README, table generator, verifier, JSON tables, RFC 8259, and Python json reference were read; approval is scoped to an educational/portable decoder, not a drop-in modern JSON library."]
  ),
  approvedTutorialOverride(
    "command-line-tool-nim-writing-a-stow-alternative-to-manage-dotfiles",
    "Individual review of Nim Days Nistow article plus GNU Stow, ln, Nim parseopt, and Nim os references",
    "Approved path for the Nistow dotfile manager focused on dotfile package layout, CLI option parsing, safe simulation, path mapping, symlink creation, conflict handling, and filesystem-risk boundaries.",
    nistowApprovedResources,
    [
      concept(
        "approved-nistow-package-to-target-map",
        "Package paths map into target paths",
        "The tutorial's main idea is that an application directory mirrors where its config files should live under the destination, then each source file becomes one symlink target.",
        "Beginners need this before touching symlinks because dotfile managers are path transformation tools first and filesystem mutation tools second.",
        [
          "You can map app/.config/i3/config to dest/.config/i3/config by hand.",
          "You can explain why appPath and dest must be expanded and validated.",
          "You can tell whether a bug is in directory walking, path replacement, or symlink creation."
        ],
        [nistowApprovedResources[0], nistowApprovedResources[1], nistowApprovedResources[4]]
      ),
      concept(
        "approved-nistow-safe-symlink-cli",
        "A filesystem CLI needs dry-run safety",
        "Nistow includes simulate, verbose, force, app, and dest flags so the user can see planned links before changing files and can decide how conflicts are handled.",
        "This is the professional lesson hiding inside a tiny CLI: destructive operations should be explicit, explainable, and testable on a temporary directory.",
        [
          "You can describe what --simulate prevents.",
          "You can explain why --force should remove only the exact conflicting link path.",
          "You can test the command in a temp destination without touching real home files."
        ],
        [nistowApprovedResources[0], nistowApprovedResources[2], nistowApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Draw the dotfiles layout first",
        "Dotfiles layout and expected CLI",
        "Learn the package layout and destination mapping before parsing command-line flags or creating symlinks.",
        "Create a tiny fixture app directory with one nested config file and write the expected destination path beside it.",
        "If the destination path surprises you, inspect the appPath prefix replacement before using createSymlink.",
        "A fixture shows source path, destination path, and expected link relationship.",
        nistowApprovedResources.slice(0, 5)
      ),
      checkpoint(
        "Parse options without touching files",
        "CLI implementation",
        "Learn parseopt/getopt, default destination behavior, required --app validation, and exit paths before filesystem mutation.",
        "Implement help, version, simulate, verbose, force, app, and dest parsing, then print the parsed config for several command examples.",
        "If a flag is ignored, inspect kind/key/val from getopt before changing stow logic.",
        "CLI tests cover help, missing app, explicit dest, simulate, verbose, and force.",
        [nistowApprovedResources[0], nistowApprovedResources[3]]
      ),
      checkpoint(
        "Collect linkable files and simulate",
        "getLinkableFiles",
        "Learn recursive directory walking as a pure planning step that produces LinkInfo records without changing the filesystem.",
        "Walk the fixture app directory, print every original/dest pair, and run the stow step with simulate=true.",
        "If files are missing, inspect walkDirRec filters and path expansion before symlink code.",
        "Simulation output lists every planned link and creates no files.",
        [nistowApprovedResources[0], nistowApprovedResources[4], nistowApprovedResources[1]]
      ),
      checkpoint(
        "Create links and document conflict limits",
        "stow procedure",
        "Learn safe filesystem mutation: create parent directories, skip existing targets by default, and only overwrite when force is explicit.",
        "Create symlinks in a temporary destination, test conflict behavior with and without force, and document missing unstow, adopt, ignore lists, relative symlinks, Windows behavior, and backup support.",
        "If force removes the wrong file, stop and trace the exact linkpath before retrying.",
        "README explains path mapping, CLI flags, dry run, symlink creation, conflict behavior, and missing GNU Stow features.",
        [nistowApprovedResources[0], nistowApprovedResources[1], nistowApprovedResources[2], nistowApprovedResources[4]]
      )
    ],
    [
      "Review shell paths, home directories, symlinks, Nim parseopt, and Nim os filesystem procs.",
      "Use a temporary destination for every manual test until the project is proven safe.",
      "Write expected source-to-destination mappings before running the tool.",
      "Commit after CLI parsing, link planning, simulated stow, real temp-directory stow, and limitations notes."
    ],
    [
      "Demo dry-run output and real symlink creation in a temporary directory.",
      "Add README artifacts for app layout, LinkInfo mapping, and conflict behavior.",
      "Include one path-mapping or force-mode bug and how it was isolated.",
      "List missing GNU Stow behaviors and platform caveats honestly."
    ],
    "Built a Nim dotfile stow tool with CLI parsing, package-to-destination path planning, dry-run output, symlink creation, conflict handling, and explicit filesystem safety limits.",
    ["Original Nim Days article plus Stow/ln/Nim docs were read; approval is scoped to a small stow-like learning tool, not a full GNU Stow replacement."]
  ),
  approvedTutorialOverride(
    "uncategorized-nim-writing-a-dmidecode-parser",
    "Individual review of Nim Days DMIDecode parser plus DMTF SMBIOS overview and Nim string/table references",
    "Approved path for the DMIDecode parser focused on parsing dmidecode text output, indentation-sensitive section/property/list structure, state transitions, table-backed lookup, and raw-SMBIOS scope boundaries.",
    dmiParserApprovedResources,
    [
      concept(
        "approved-dmi-output-structure",
        "dmidecode output is nested text",
        "The tutorial treats dmidecode output as text with metadata, Handle lines, section titles, indented key/value properties, and deeper indented list items.",
        "That is a strong beginner parser because the structure is visible in whitespace, but still realistic enough to teach state and nested data.",
        [
          "You can identify a Handle line, section title, property line, and list item.",
          "You can explain why indentation controls the switch into readList.",
          "You can draw Section and Property objects for one BIOS Information block."
        ],
        [dmiParserApprovedResources[0], dmiParserApprovedResources[2], dmiParserApprovedResources[3]]
      ),
      concept(
        "approved-dmi-state-table-model",
        "Parser state protects the current section",
        "The parser tracks noOp, sectionName, readKeyValue, and readList so each line updates the correct current section or current property.",
        "Beginners need this because parsing command output by splitting strings works only when the code remembers where it is in the document.",
        [
          "You can explain what s, p, k, and v represent while parsing.",
          "You can trace when a section is stored in the result table.",
          "You can distinguish parsing dmidecode output from decoding raw SMBIOS binary tables."
        ],
        [dmiParserApprovedResources[0], dmiParserApprovedResources[1], dmiParserApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Annotate the sample output",
        "What to expect?",
        "Learn the target text structure before coding: metadata lines, Handle line, section title, properties, and list items.",
        "Mark every line in the tutorial sample as metadata, handle, title, property, or list item, then write expected keys and values.",
        "If a line classification is uncertain, inspect indentation and colon position before designing the data type.",
        "A written annotation maps each sample line to its parser role.",
        dmiParserApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Model sections and properties",
        "Mapping DMI to nim structures",
        "Learn the nested data model: a Section stores the handle/title and a table of Property values, while each Property stores a value plus optional list items.",
        "Implement Property, Section, addItem, and getIndentLevel, then construct one section manually in a test.",
        "If lookup fails, verify table keys and case/spaces before changing parser state.",
        "Direct construction tests can store a section, property value, and list items.",
        [dmiParserApprovedResources[0], dmiParserApprovedResources[3], dmiParserApprovedResources[2]]
      ),
      checkpoint(
        "Implement indentation-sensitive parsing",
        "Parsing DMI source into nim structures",
        "Learn how state changes when a Handle starts, a title follows, key/value lines appear, and list indentation begins or ends.",
        "Trace state, indentation, current key, and current section title for the BIOS Information example.",
        "If a list item becomes a property, compare getIndentLevel(current) and getIndentLevel(next) before changing split logic.",
        "The parser extracts BIOS Information with Characteristics list items and later key/value properties intact.",
        [dmiParserApprovedResources[0], dmiParserApprovedResources[2]]
      ),
      checkpoint(
        "Document parser assumptions and DMI scope",
        "Final return and scope review",
        "Learn the scope boundary: this parses dmidecode's human-readable output, not raw SMBIOS structures or every hardware/vendor edge case.",
        "Add tests for multiple sections, empty values, properties containing colons, final section without trailing blank line, tabs/spaces, and unexpected metadata, then document decisions.",
        "If real dmidecode output breaks the parser, preserve the fixture and classify the new line shape before patching.",
        "README explains output structure, state transitions, indentation rules, test fixtures, and raw-SMBIOS limitations.",
        [dmiParserApprovedResources[0], dmiParserApprovedResources[1], dmiParserApprovedResources[3]]
      )
    ],
    [
      "Review Nim strings, splitLines, strip, tables, object refs, and indentation-sensitive parsing.",
      "Use saved dmidecode text fixtures instead of requiring learners to run privileged hardware commands.",
      "Mark sample lines by role before writing parser code.",
      "Commit after data model, indent helper, parser states, real fixture tests, and limitations notes."
    ],
    [
      "Demo parsing at least two dmidecode sections into Section and Property structures.",
      "Add README artifacts for line annotation, state trace, and parsed table output.",
      "Include one indentation or colon-splitting bug and how the fixture exposed it.",
      "List the difference between parsing dmidecode output and implementing an SMBIOS decoder."
    ],
    "Built a Nim dmidecode-output parser with Section/Property data structures, indentation-sensitive state transitions, table-backed lookup, fixture tests, and clear raw-SMBIOS scope limits.",
    ["Original Nim Days article and DMTF/Nim references were read; approval is scoped to parsing dmidecode text output, not decoding SMBIOS binary tables."]
  ),
  approvedTutorialOverride(
    "uncategorized-nim-writing-a-url-shortening-service",
    "Individual review of Nim Days URL shortener plus Jester, Nim db_sqlite/json, and HTTP status references",
    "Approved path for the Nim URL shortener focused on route design, SQLite persistence, JSON request/response handling, ID lookup, redirect behavior, and production web-service safety limits.",
    nimShortUrlApprovedResources,
    [
      concept(
        "approved-shorturl-routes-dataflow",
        "Routes move data through the app",
        "The tutorial has three core flows: render the form, POST a long URL to create or reuse an ID, and GET that ID to redirect to the saved URL.",
        "Beginners need this request-to-database-to-response map before web code stops feeling like scattered callbacks.",
        [
          "You can name the route, HTTP method, input, database query, and response for each flow.",
          "You can explain why /shorten is POST while /@Id is GET.",
          "You can trace a single URL from form input to redirect."
        ],
        [nimShortUrlApprovedResources[0], nimShortUrlApprovedResources[1], nimShortUrlApprovedResources[4]]
      ),
      concept(
        "approved-shorturl-sql-json-boundary",
        "JSON and SQL are boundaries",
        "The app receives JSON from fetch, extracts the url field, stores/looks it up in SQLite, then returns JSON containing the short ID.",
        "That teaches two beginner-critical habits: parse external input deliberately and use parameterized SQL instead of string-building queries.",
        [
          "You can distinguish request.body JSON from the SQLite urls table.",
          "You can explain why the tutorial uses sql placeholders for url/id values.",
          "You can name one validation or abuse case missing from the demo."
        ],
        [nimShortUrlApprovedResources[0], nimShortUrlApprovedResources[2], nimShortUrlApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Map the app before coding routes",
        "Basic use case and setup",
        "Learn the whole URL-shortener lifecycle before installing dependencies: long URL in, numeric ID stored, short path redirects out.",
        "Draw a three-route table for home page, /shorten, and /@Id with method, input, output, and failure cases.",
        "If route behavior is unclear, compare it with Jester's route and response examples before adding database code.",
        "A route table explains the data flow and expected HTTP responses.",
        nimShortUrlApprovedResources.slice(0, 5)
      ),
      checkpoint(
        "Create and test the SQLite table",
        "SQLite database setup",
        "Learn persistence separately from web routing: the urls table maps an id to a long URL and should be queryable without a browser.",
        "Create the table, insert one URL, select by URL, select by ID, and verify duplicate URL behavior.",
        "If IDs are wrong, inspect the schema and tryInsertId result before debugging Jester.",
        "Database-only tests can insert, reuse, and retrieve URLs.",
        [nimShortUrlApprovedResources[0], nimShortUrlApprovedResources[2]]
      ),
      checkpoint(
        "Implement JSON POST and form flow",
        "Home endpoint and Shorten endpoint",
        "Learn browser-to-server JSON: fetch sends request.body, parseJson extracts url, the server replies with a JSON id, and the page renders the short link.",
        "Implement the home form and /shorten route, then test valid JSON, missing url, duplicate url, and invalid JSON manually or with a small request script.",
        "If the browser gets no id, inspect request.body, parseJson result, DB lookup, and response status separately.",
        "/shorten returns 200 with an id for valid input and 400 for missing url.",
        [nimShortUrlApprovedResources[0], nimShortUrlApprovedResources[3], nimShortUrlApprovedResources[4]]
      ),
      checkpoint(
        "Redirect and document production gaps",
        "Shorturls redirect",
        "Learn redirect behavior as a lookup followed by a 3xx response, and document why a public URL shortener needs much more hardening.",
        "Implement /@Id redirect, then document URL validation, abuse/spam controls, auth/admin tools, collision strategy, deletion, analytics, rate limiting, CSRF/CORS, HTTPS, and deployment behind a reverse proxy.",
        "If redirect loops or points somewhere unsafe, inspect stored URL validation before changing routing.",
        "README explains routes, JSON, SQLite queries, redirects, error cases, and production-safety gaps.",
        [nimShortUrlApprovedResources[0], nimShortUrlApprovedResources[1], nimShortUrlApprovedResources[4]]
      )
    ],
    [
      "Review HTTP methods/status codes, JSON request bodies, SQLite basics, and Jester route syntax.",
      "Test the SQLite layer separately before running the web server.",
      "Keep a route/data-flow table visible while building.",
      "Commit after database setup, home page, /shorten JSON route, redirect route, and security limitations notes."
    ],
    [
      "Demo creating a short link and following it through the redirect route.",
      "Add README artifacts for route table, database schema, sample request/response, and redirect flow.",
      "Include one JSON/body or SQL lookup bug and how it was isolated.",
      "List public-service risks and deployment hardening that the tutorial intentionally skips."
    ],
    "Built a Nim URL shortener with Jester routes, SQLite persistence, JSON request/response handling, redirect lookup, route-level proof tests, and explicit production web-service safety limits.",
    ["Original Nim Days article and Jester/Nim/HTTP references were read; approval is scoped to a local educational shortener, not a hardened public service."]
  ),
  approvedTutorialOverride(
    "uncategorized-nim-writing-a-link-checker",
    "Individual review of Nim Days Async Link Checker plus Nim asyncdispatch/httpclient/os and MDN HTTP status references",
    "Approved path for the Nim link checker focused on sequential versus async HTTP requests, futures, event-loop scheduling, result modeling, CLI file input, status-code interpretation, and network-checking limits.",
    nimLinkCheckerApprovedResources,
    [
      concept(
        "approved-link-checker-io-concurrency",
        "Async helps when work is waiting on IO",
        "The tutorial compares sequential HTTP requests with async requests so the learner can see that network waiting time can overlap when each check returns a Future.",
        "This is the real beginner payoff: async is not faster because the CPU works harder; it is faster because the program does other checks while one request is waiting.",
        [
          "You can explain why five slow links take less wall-clock time when requested concurrently.",
          "You can distinguish an async Future from the finished LinkCheckResult.",
          "You can say why waitFor is needed when main calls an async proc."
        ],
        [nimLinkCheckerApprovedResources[0], nimLinkCheckerApprovedResources[1], nimLinkCheckerApprovedResources[2]]
      ),
      concept(
        "approved-link-checker-status-semantics",
        "A link checker needs a status policy",
        "The tutorial treats only HTTP 200 as valid, but real link checking needs a deliberate policy for redirects, 204, 3xx, 4xx, 5xx, timeouts, malformed URLs, SSL, and DNS failures.",
        "Beginners need this nuance because otherwise a working HTTP client becomes a misleading quality checker.",
        [
          "You can explain what the tutorial's true/false state means.",
          "You can decide whether redirects should count as healthy for your project.",
          "You can record exception, timeout, and non-200 status separately in a future improvement."
        ],
        [nimLinkCheckerApprovedResources[0], nimLinkCheckerApprovedResources[3], nimLinkCheckerApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Model one link check result",
        "Step 1: Data types",
        "Learn the smallest result shape before HTTP code: each check should record the link and the result state or reason.",
        "Create LinkCheckResult and one direct test/result printout before making any network requests.",
        "If output is unclear later, add fields for status code or error reason instead of relying on bool alone.",
        "A result object can represent a checked URL and its health result.",
        [nimLinkCheckerApprovedResources[0]]
      ),
      checkpoint(
        "Implement sequential checks first",
        "Step 2: GO Sequential!",
        "Learn blocking HTTP behavior with newHttpClient, get, response.code, try/except, and a line-by-line file of URLs.",
        "Check a tiny links file sequentially, print status for valid, invalid, blank, and unreachable URLs, and record elapsed time.",
        "If every HTTPS URL fails, check SSL build flags and network access before rewriting logic.",
        "Sequential mode prints one result per nonblank input line and handles exceptions without crashing.",
        [nimLinkCheckerApprovedResources[0], nimLinkCheckerApprovedResources[2], nimLinkCheckerApprovedResources[4]]
      ),
      checkpoint(
        "Add async Future collection",
        "Step 3: GO ASYNC!",
        "Learn async proc return types, newAsyncHttpClient, yield/await, all(futures), failed futures, read, and waitFor from sync main.",
        "Implement asyncLinksChecker and compare elapsed time against the same links file from sequential mode.",
        "If output order or timing surprises you, print when each Future is created and when it finishes.",
        "Async mode checks several links concurrently and produces the same health decisions as sequential mode for the fixture.",
        [nimLinkCheckerApprovedResources[0], nimLinkCheckerApprovedResources[1], nimLinkCheckerApprovedResources[2]]
      ),
      checkpoint(
        "Document link-checker policy limits",
        "Step 4 simple cli and Extra threading",
        "Learn the CLI boundary and document why a real link checker needs more policy and operational controls.",
        "Add command usage, file input checks, timing output, and a limitations table for redirects, HEAD vs GET, rate limiting, retries, timeouts, SSL, robots.txt, status classes, concurrency caps, and threadpool comparison.",
        "If the checker overloads a host or hangs, add a small concurrency limit and timeout before adding more features.",
        "README explains sequential vs async behavior, Future flow, CLI usage, measured speedup, and link-health policy gaps.",
        nimLinkCheckerApprovedResources.slice(0, 5)
      )
    ],
    [
      "Review Nim procedures, exceptions, sequences, file reading, async Future basics, and HTTP status classes.",
      "Use a small local fixture file with known good, bad, blank, and malformed links.",
      "Run sequential and async modes on the same fixture before interpreting timing.",
      "Commit after result type, sequential checker, async checker, CLI file input, and limitations notes."
    ],
    [
      "Demo sequential and async runs over the same links file with elapsed timings.",
      "Add README artifacts for Future creation/completion and status policy decisions.",
      "Include one SSL, timeout, or malformed-URL bug and how it was diagnosed.",
      "List real crawler/link-checker concerns not implemented."
    ],
    "Built a Nim link checker with sequential and async HTTP modes, Future aggregation, CLI file input, timing comparison, exception handling, and explicit link-health policy limits.",
    ["Original Nim Days article and exact Nim/HTTP status references were read; approval is scoped to a small educational link checker, not a production crawler."]
  ),
  approvedTutorialOverride(
    "uncategorized-nim-writing-a-build-system",
    "Individual review of Nim Days Bake build system plus GNU Make rules, cp-algorithms cycle detection, and Nim table/algorithm references",
    "Approved path for the Nim Bake build system focused on Make-like targets, dependencies, actions, adjacency-list task graphs, DFS ordering, duplicate suppression, cycle detection, and build-tool scope limits.",
    nimBuildSystemApprovedResources,
    [
      concept(
        "approved-bake-target-dependency-graph",
        "Build targets form a directed graph",
        "The tutorial models each task as a node, its requirements as outgoing dependency names, and its action as the command text to run after dependencies are ready.",
        "That is the beginner bridge from a Makefile-looking example to the actual algorithm: build tools decide order by walking dependencies.",
        [
          "You can draw publish -> build-release -> nim-installed as a graph.",
          "You can explain why the dependency must run before the target action.",
          "You can distinguish a task record from the adjacency-list graph."
        ],
        [nimBuildSystemApprovedResources[0], nimBuildSystemApprovedResources[1], nimBuildSystemApprovedResources[3]]
      ),
      concept(
        "approved-bake-dfs-cycle-safety",
        "DFS ordering must reject cycles",
        "Bake uses depth-first traversal to collect tasks in dependency order, then graph coloring to detect a dependency cycle before running actions.",
        "Beginners need this because build systems are dangerous if they silently recurse forever or run partial commands from an invalid graph.",
        [
          "You can explain white, gray, and black node colors.",
          "You can identify the back edge that proves a cycle.",
          "You can show why a shared dependency should run once, while a cyclic dependency should stop the build."
        ],
        [nimBuildSystemApprovedResources[0], nimBuildSystemApprovedResources[2], nimBuildSystemApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Translate Make vocabulary into Bake tasks",
        "What to expect",
        "Learn variables, targets, dependencies, and actions from the Make-like example before writing Nim data structures.",
        "Write a tiny task table for default, program, program.o, and clean with each task's dependencies and action.",
        "If a target order is confusing, draw dependency arrows before writing code.",
        "A written table maps Make-like targets to Bake task records.",
        [nimBuildSystemApprovedResources[0], nimBuildSystemApprovedResources[1]]
      ),
      checkpoint(
        "Store tasks and adjacency lists",
        "Objects and Adding a task",
        "Learn the two tables: tasksgraph stores dependency edges, and tasks stores full Task objects with actions.",
        "Implement Task, Bake, initBake, and addTask, then print both tables after adding the normal publish example.",
        "If a task is missing during traversal, inspect both tables because the graph and task metadata must be updated together.",
        "The publish example creates matching graph and task-table entries.",
        [nimBuildSystemApprovedResources[0], nimBuildSystemApprovedResources[3]]
      ),
      checkpoint(
        "Run dependencies once in order",
        "Running tasks",
        "Learn recursive dependency traversal with deps and seen so shared dependencies are not executed repeatedly.",
        "Implement runTaskHelper and prove the normal publish example prints actions from leaf dependencies up to publish.",
        "If actions run twice, inspect seen handling before changing graph data.",
        "The normal example prints apt-installed before curl-installed before nim-installed before build-release before publish.",
        [nimBuildSystemApprovedResources[0], nimBuildSystemApprovedResources[3], nimBuildSystemApprovedResources[4]]
      ),
      checkpoint(
        "Detect cycles and document build-system limits",
        "Detecting cycles and What's next?",
        "Learn graph coloring as a safety pass before task execution: gray means currently visiting, so an edge to gray means a cycle.",
        "Implement graphHasCycle and hasCycleDFS, test the circular publish example, and document missing variables, file timestamps, recipes from config files, command execution, phony targets, parallelism, environment handling, and incremental rebuilds.",
        "If cycle output is wrong, trace parentMap and the __CYCLESTART__ marker before changing runTask.",
        "README explains task graph storage, DFS order, cycle detection, duplicate suppression, and missing Make/build-system features.",
        [nimBuildSystemApprovedResources[0], nimBuildSystemApprovedResources[2], nimBuildSystemApprovedResources[1]]
      )
    ],
    [
      "Review Nim tables, sequences, recursion, enums, and simple graph terminology.",
      "Draw the dependency graph for both the normal and circular examples before coding.",
      "Keep expected action order and expected cycle path as fixtures.",
      "Commit after addTask, dependency traversal, duplicate suppression, cycle detection, and limitations notes."
    ],
    [
      "Demo the normal publish example and the circular dependency example.",
      "Add README artifacts for task graph, DFS traversal order, and cycle-color trace.",
      "Include one duplicate-run or cycle-detection bug and how it was traced.",
      "List the build-system features intentionally omitted compared with Make."
    ],
    "Built a Nim Make-like task runner with task/action records, adjacency-list dependency graph, DFS execution ordering, duplicate suppression, cycle detection, and explicit build-system limitations.",
    ["Original Nim Days article, GNU Make rules, cp-algorithms cycle detection, and Nim table/algorithm references were read; approval is scoped to an educational task graph runner."]
  ),
  approvedTutorialOverride(
    "programming-language-javascript-little-lisp-interpreter",
    "Individual review of Mary Rose Cook's Little Lisp article, source, tests, and interpreter representation reference",
    "Approved path for Little Lisp focused on tokenizing Lisp syntax, parenthesizing into nested typed arrays, context-chain lookup, special forms, function application, lambdas, lets, ifs, tests, and JavaScript-specific scope caveats.",
    littleLispApprovedResources,
    [
      concept(
        "approved-little-lisp-nested-array-ast",
        "Parentheses become nested arrays",
        "Little Lisp keeps parsing beginner-visible: tokenize adds spaces around parentheses, parenthesize turns tokens into nested arrays, and categorize labels atoms as numbers, strings, or identifiers.",
        "This gives learners a concrete AST without heavy parser theory, and it explains why Lisp is a friendly first interpreter project.",
        [
          "You can transform `((lambda (x) x) \"Lisp\")` into tokens and nested arrays.",
          "You can explain why strings with spaces need special handling in the source code.",
          "You can tell whether a bug belongs to tokenize, parenthesize, or categorize."
        ],
        [littleLispApprovedResources[0], littleLispApprovedResources[1], littleLispApprovedResources[3]]
      ),
      concept(
        "approved-little-lisp-context-special-forms",
        "Context chains give identifiers meaning",
        "The interpreter resolves identifiers through a Context object with a current scope and parent scope, while lambda, let, and if are special forms because they control when evaluation happens.",
        "Beginners need this split because evaluating every list the same way would break conditionals, local bindings, and lambda creation.",
        [
          "You can explain how Context.get walks from inner scope to parent scope.",
          "You can say why lambda and if are handled before normal list evaluation.",
          "You can trace one lambda call from argument binding to body evaluation."
        ],
        [littleLispApprovedResources[0], littleLispApprovedResources[1], littleLispApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Run the language examples first",
        "First, let's learn some Lisp",
        "Learn the tiny language surface before reading implementation: atoms, empty lists, nested lists, function invocation, lambdas, lets, ifs, and builtins.",
        "Run or write expected outputs for atoms, lists, first/rest/print, one lambda call, one let, and one if.",
        "If an example surprises you, decide whether it is Lisp syntax, JavaScript truthiness, or Little Lisp's subset behavior.",
        "README has a table of supported forms and expected outputs.",
        littleLispApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Prove parsing in visible stages",
        "The parser",
        "Learn the parse pipeline as three proof artifacts: tokens, typed atoms, and nested array structure.",
        "Print tokenized and parenthesized output for a lambda call and compare against the article's walkthrough.",
        "If strings or parentheses are wrong, inspect tokenize before changing interpretation.",
        "One source expression is documented as tokens and nested typed arrays.",
        [littleLispApprovedResources[0], littleLispApprovedResources[1], littleLispApprovedResources[3]]
      ),
      checkpoint(
        "Trace context lookup and function invocation",
        "The interpreter",
        "Learn interpret, interpretList, Context, library functions, and normal function application as the evaluator core.",
        "Trace `(first (1 2 3))` and one lambda call through interpretList, argument evaluation, and Context lookup.",
        "If an identifier returns undefined, inspect scope and parent before changing parser output.",
        "Trace notes show identifier lookup and function application from parsed input to final value.",
        [littleLispApprovedResources[0], littleLispApprovedResources[1], littleLispApprovedResources[2]]
      ),
      checkpoint(
        "Add tests and document subset limits",
        "Repository tests and final review",
        "Learn how the repository tests cover parser atoms/lists, library functions, lambdas, lets, and if behavior.",
        "Run or recreate the tests, then document missing Lisp features such as quoting, macros, recursion helpers, error reporting, numbers beyond parseFloat behavior, lexical edge cases, and full Scheme compatibility.",
        "If test and article behavior differ, treat the source and tests as the exact project contract.",
        "README explains parser stages, contexts, special forms, tests, and unsupported language features.",
        [littleLispApprovedResources[1], littleLispApprovedResources[2], littleLispApprovedResources[0]]
      )
    ],
    [
      "Review JavaScript arrays, objects, functions, closures, recursion, map/reduce, and truthiness.",
      "Write three Lisp examples and their expected nested arrays before reading the interpreter.",
      "Use the repository tests as the project contract.",
      "Commit after tokenizer, parenthesizer, context lookup, special forms, library calls, and subset notes."
    ],
    [
      "Demo parsing and interpreting atoms, lists, library calls, lambdas, lets, and ifs.",
      "Add README artifacts for tokens, nested arrays, context chain lookup, and lambda invocation.",
      "Include one parser or scope bug and how the trace isolated it.",
      "List Little Lisp's intentional language limits honestly."
    ],
    "Built Little Lisp in JavaScript with tokenization, nested-array parsing, typed atoms, context-chain lookup, special forms, lambda/let/if support, builtins, tests, and clear Lisp-subset limits.",
    ["Original article, source, and tests were read; approval is scoped to Mary Rose Cook's JavaScript Little Lisp, not a full Scheme implementation."]
  ),
  approvedTutorialOverride(
    "programming-language-python-lisp-py-make-your-own-lisp-interpreter",
    "Individual review of Khamidou's lisp.py article plus Norvig Lispy and interpreter representation/evaluation references",
    "Approved path for lisp.py focused on Python container classes, tokenizer state for strings and parentheses, recursive parsing, eval/apply split, special-form evaluation order, environment mutation, builtins, and Python 2 modernization caveats.",
    khamidouLispApprovedResources,
    [
      concept(
        "approved-khamidou-lisp-token-state",
        "Tokenizing Lisp still needs state",
        "Even with Lisp's simple parentheses, lisp.py scans characters while tracking strings, whitespace, parentheses, integers, floats, and symbols.",
        "This keeps beginners honest: simple syntax does not remove the need to define token boundaries and literal rules.",
        [
          "You can explain why quoted strings change tokenizer behavior.",
          "You can classify a token as int, float, String, or Symbol.",
          "You can trace recursive do_parse until a closing parenthesis returns a sublist."
        ],
        [khamidouLispApprovedResources[0], khamidouLispApprovedResources[2]]
      ),
      concept(
        "approved-khamidou-eval-apply-special",
        "eval and apply have different jobs",
        "The interpreter's eval turns expressions into values, while apply calls either Python builtins or Lisp lambdas after binding arguments into a new environment.",
        "Special forms such as lambda, if, define, and begin need direct interpreter handling because they cannot evaluate all arguments in ordinary function-call order.",
        [
          "You can say why `if` would be wrong as an ordinary function.",
          "You can trace a Symbol lookup through the environment dictionary.",
          "You can explain how apply binds lambda arguments before evaluating the body."
        ],
        [khamidouLispApprovedResources[0], khamidouLispApprovedResources[1], khamidouLispApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Separate containers, parser, and interpreter",
        "Utility functions and data structures",
        "Learn the three-part project shape before coding: small wrapper classes for interpreter values, parser functions, and evaluator/apply logic.",
        "Create Symbol, String, and Lambda examples and print their representations before parsing source text.",
        "If later debugging feels messy, label whether the value is raw Python data or an InterpreterObject wrapper.",
        "Direct construction tests show Symbol, String, and Lambda containers clearly.",
        [khamidouLispApprovedResources[0], khamidouLispApprovedResources[2]]
      ),
      checkpoint(
        "Build tokenizer and recursive parser fixtures",
        "Parser",
        "Learn the char scanner, string-state flag, numeric classification, Symbol wrapping, and recursive list construction.",
        "Parse examples for numbers, floats, strings, nested lists, bad opening tokens, and unmatched structure.",
        "If parsing fails, inspect token stream before do_parse recursion.",
        "Parser fixtures show tokens and Python list/Symbol/String output for each supported literal type.",
        [khamidouLispApprovedResources[0], khamidouLispApprovedResources[1], khamidouLispApprovedResources[2]]
      ),
      checkpoint(
        "Implement eval, special forms, and apply",
        "Interpreter",
        "Learn evaluation order: literals return themselves, symbols look up environment values, special forms control evaluation, and ordinary calls use apply.",
        "Trace lambda, if, define, begin, and one builtin arithmetic call through eval/apply with printed environment changes.",
        "If both branches of if run, stop and make if a special form before adding more builtins.",
        "Examples prove Symbol lookup, lambda application, define mutation, begin sequencing, and if short-circuit behavior.",
        [khamidouLispApprovedResources[0], khamidouLispApprovedResources[3], khamidouLispApprovedResources[1]]
      ),
      checkpoint(
        "Modernize carefully and document limits",
        "Parting words and final source",
        "Learn that the article is Python 2-era code and an educational prototype, so modernizing should preserve behavior with tests.",
        "Port print/operator division/iterator syntax if needed, add tests, and document missing quoting depth, macros, lexical scoping limits, error recovery, tail calls, module loading, and full Scheme compatibility.",
        "If modernization changes behavior, compare against the original article examples and Norvig's Lispy distinctions.",
        "README explains tokenizer state, recursive parser, eval/apply, special forms, builtins, Python 2 modernization, and language limits.",
        khamidouLispApprovedResources.slice(0, 4)
      )
    ],
    [
      "Review Python classes, lists, dictionaries, recursion, iterators, callable objects, and Python 2 to 3 syntax differences.",
      "Write expected parse output for a nested expression before writing eval.",
      "Keep one fixture for each special form and one for each literal type.",
      "Commit after value wrappers, tokenizer, parser, eval/apply, builtins, and modernization notes."
    ],
    [
      "Demo a file running arithmetic, define, if, begin, and lambda application.",
      "Add README artifacts for token stream, parsed expression, environment before/after, and eval/apply trace.",
      "Include one special-form evaluation-order bug and how it was diagnosed.",
      "List Python 2 and language-subset caveats."
    ],
    "Built or modernized lisp.py with interpreter value wrappers, stateful tokenizer, recursive parser, eval/apply evaluator, special forms, builtins, file runner, and explicit Python/Lisp subset caveats.",
    ["Original lisp.py article and supporting interpreter references were read; approval is scoped to Khamidou's educational Python Lisp, not a complete Scheme."]
  ),
  approvedTutorialOverride(
    "programming-language-swift-building-a-lisp-from-scratch-with-swift",
    "Individual review of SwiftyLISP article, source, README, and interpreter representation/evaluation references",
    "Approved path for SwiftyLISP focused on recursive SExpr enum modeling, tokenizer/parser extensions, builtin environment functions, localContext for defun/lambda, skip-evaluation forms, recursive eval, REPL proof, and Swift 4-era caveats.",
    swiftyLispApprovedResources,
    [
      concept(
        "approved-swiftylisp-recursive-sexpr",
        "Recursive enum models symbolic expressions",
        "SwiftyLISP represents Lisp data with a recursive SExpr enum: either an Atom string or a List of more SExpr values.",
        "That makes the parser and evaluator share one clear data model, and it shows why host-language type features matter when building interpreters.",
        [
          "You can draw Atom and List cases for one nested expression.",
          "You can explain how string literal conversion calls SExpr.read.",
          "You can tell where tokenization ends and SExpr structure begins."
        ],
        [swiftyLispApprovedResources[0], swiftyLispApprovedResources[1], swiftyLispApprovedResources[3]]
      ),
      concept(
        "approved-swiftylisp-builtin-environments",
        "Builtins decide evaluation behavior",
        "The project stores builtins in a defaultEnvironment dictionary and user definitions in localContext, while mustSkip prevents eager evaluation for quote, cond, defun, and lambda.",
        "Beginners need this because a Lisp interpreter is not just function lookup; special forms control which expressions are evaluated and when.",
        [
          "You can explain why quote and cond skip normal subexpression evaluation.",
          "You can trace a defun into localContext and a later call back out of it.",
          "You can distinguish empty list as nil/false from Atom true."
        ],
        [swiftyLispApprovedResources[0], swiftyLispApprovedResources[1], swiftyLispApprovedResources[2], swiftyLispApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Learn the target Lisp surface",
        "LISP Basics",
        "Learn the supported atom structures first: quote, car, cdr, cons, equal, atom, cond, list, lambda, defun, eval, and print behavior.",
        "Write expected outputs for one example of quote, car/cdr/cons, cond, lambda, and defun before reading Swift code.",
        "If output surprises you, check whether empty list is being used as false/nil.",
        "A small table maps supported forms to example inputs and expected outputs.",
        [swiftyLispApprovedResources[0], swiftyLispApprovedResources[2]]
      ),
      checkpoint(
        "Implement SExpr read, tokenize, and parse",
        "Lexer and Parser",
        "Learn the recursive enum plus read extension: tokenize parentheses/text blocks, recursively parse lists, and build Atom/List nodes.",
        "Trace `(car (quote (a b c)))` through tokens, parse recursion, and final SExpr.",
        "If a nested list is malformed, inspect pOpen/pClose handling and remaining tokens before eval.",
        "README shows tokens and SExpr tree for one nested expression.",
        [swiftyLispApprovedResources[0], swiftyLispApprovedResources[1], swiftyLispApprovedResources[3]]
      ),
      checkpoint(
        "Trace builtin and user-defined evaluation",
        "Evaluation and Default Global Environment",
        "Learn recursive eval, defaultEnvironment, localContext, Builtins.mustSkip, lambda/defun registration, and variable substitution.",
        "Trace quote, cond, lambda invocation, and defun call with logs for skip, environment lookup, and returned SExpr.",
        "If a special form evaluates too early, inspect Builtins.mustSkip before changing builtin functions.",
        "Examples prove builtins, special forms, lambda, defun, and localContext lookup.",
        [swiftyLispApprovedResources[0], swiftyLispApprovedResources[1], swiftyLispApprovedResources[4]]
      ),
      checkpoint(
        "Add REPL proof and version caveats",
        "SwiftyLisp REPL and conclusion",
        "Learn the final user loop: read one line, convert to SExpr, evaluate, and print using CustomStringConvertible.",
        "Build the REPL proof, run a few README examples, then document Swift 4-era syntax, package setup, error handling via empty list, global localContext behavior, parser string limitations, recursion/tail-call limits, and full Lisp compatibility gaps.",
        "If the REPL crashes, isolate read, eval, and print with one expression each before debugging the loop.",
        "README explains SExpr, parser, builtin environment, local definitions, REPL, and modern Swift/language-subset limits.",
        swiftyLispApprovedResources.slice(0, 5)
      )
    ],
    [
      "Review Swift enums, arrays, dictionaries, closures, extensions, optionals, and CustomStringConvertible.",
      "Write SExpr trees for three expressions before evaluating them.",
      "Use README examples and source behavior as the contract.",
      "Commit after SExpr model, read/parser, builtin environment, lambda/defun, REPL, and caveat notes."
    ],
    [
      "Demo the REPL evaluating quote, car/cdr/cons, cond, lambda, defun, and eval examples.",
      "Add README artifacts for SExpr enum tree, parser recursion, builtin lookup, and localContext registration.",
      "Include one skip-evaluation or variable-substitution bug and how it was traced.",
      "List Swift version and Lisp-subset caveats clearly."
    ],
    "Built SwiftyLISP with recursive SExpr modeling, tokenizer/parser extensions, builtin and local environments, special-form evaluation control, lambda/defun support, REPL proof, and explicit Swift/Lisp subset limitations.",
    ["Original article, source, and README were read; approval is scoped to SwiftyLISP's educational interpreter and Swift 4-era implementation."]
  ),
  approvedTutorialOverride(
    "front-end-framework-library-javascript-wtf-is-jsx-let-s-build-a-jsx-renderer",
    "Individual review of Jason Miller's WTF is JSX plus React/DOM resources",
    "Approved path for the JSX renderer tutorial focused on JSX pragma, transpilation into function calls, VNode objects, recursive DOM rendering, and JavaScript-as-template logic.",
    jsxRendererApprovedResources,
    [
      concept(
        "approved-jsx-transpilation",
        "JSX becomes function calls",
        "This tutorial's beginner breakthrough is showing that JSX is transformed into ordinary JavaScript calls such as `h('div', props, children)`.",
        "Once a learner sees JSX as syntax sugar, UI rendering becomes a data transformation problem instead of framework magic.",
        [
          "You can rewrite one JSX element as an `h()` call.",
          "You can explain what the pragma changes.",
          "You can separate authored JSX from runtime JavaScript."
        ],
        jsxRendererApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-jsx-vnode-render",
        "VNode tree to DOM tree",
        "The renderer creates lightweight VNode objects, then recursively turns strings and element objects into real DOM nodes.",
        "This is the tiny conceptual seed behind virtual DOM rendering, components, and framework internals.",
        [
          "You can draw a VNode object for a nested element.",
          "You can explain string children versus element children.",
          "You can trace recursive rendering from root to leaves."
        ],
        [jsxRendererApprovedResources[0], jsxRendererApprovedResources[1], jsxRendererApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Rewrite JSX by hand",
        "The Pragma and Transpilation",
        "Learn the pragma and Babel-style transformation before implementing anything.",
        "Convert a tiny JSX snippet into the equivalent `h()` call and write both versions in the README.",
        "If the transformation feels mysterious, remove JSX and call `h()` directly first.",
        "A before/after JSX transformation is visible and explainable.",
        jsxRendererApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Build the `h()` VNode factory",
        "Let's Build a JSX Renderer",
        "Learn nodeName, attributes, rest parameters, spread, children flattening, and VNode shape.",
        "Implement `h()` and print the VNode JSON for nested markup.",
        "If children are nested oddly, inspect rest arguments and array concatenation.",
        "Nested JSX produces a predictable VNode object.",
        [jsxRendererApprovedResources[0], jsxRendererApprovedResources[3], jsxRendererApprovedResources[4]]
      ),
      checkpoint(
        "Render VNodes into DOM",
        "Using JSX",
        "Learn recursive rendering, text nodes, element creation, and attribute copying.",
        "Implement `render(vnode)` and append the output to the document body.",
        "If the DOM is empty, inspect whether the failing node is a string, attributes object, or child array.",
        "The browser shows markup generated by your renderer.",
        [jsxRendererApprovedResources[0], jsxRendererApprovedResources[1], jsxRendererApprovedResources[4]]
      ),
      checkpoint(
        "Use JavaScript for view logic",
        "Partials, Iteration and Logic",
        "Learn that JSX uses normal JavaScript for mapping, helper functions, and composition instead of template-only syntax.",
        "Render a list from an array and include the VNode JSON as proof.",
        "If list items fail, inspect the array mapping output before recursive render.",
        "A list renders from data and README explains JSX -> VNode -> DOM limits.",
        jsxRendererApprovedResources.slice(0, 5)
      )
    ],
    [
      "Review plain JavaScript functions, rest parameters, arrays, and DOM basics.",
      "Install or configure JSX transform only after manually understanding the output.",
      "Create one HTML page with a root container and no extra framework.",
      "Commit after JSX rewrite, h(), render(), and list rendering."
    ],
    [
      "Demo JSX rendering to real DOM without React.",
      "Show the VNode JSON for one nested view.",
      "Add a README diagram for JSX -> h() -> VNode -> DOM.",
      "List omitted framework concerns such as diffing, events, state, components, and updates."
    ],
    "Built Jason Miller's JSX renderer tutorial with pragma/transpilation understanding, VNode factory, recursive DOM rendering, and data-driven view proof.",
    ["Source extraction is full and the tutorial is deliberately compact enough for exact beginner approval."]
  ),
  approvedTutorialOverride(
    "front-end-framework-library-javascript-building-a-frontend-framework-from-scratc",
    "Individual review of Marvin Frachet's frontend framework tutorial plus React/Redux/template resources",
    "Approved path for the frontend framework tutorial focused on template rendering, components, virtual DOM, event handling, state management, and change detection.",
    frontendFrameworkApprovedResources,
    [
      concept(
        "approved-mfrachet-framework-layers",
        "Framework as layered features",
        "This tutorial is organized as layers: templating first, virtual DOM next, state management after that, then change detection and real components.",
        "That order helps beginners avoid jumping into framework buzzwords before they have a visible template and component model.",
        [
          "You can name the tutorial's major layers.",
          "You can explain what each layer adds.",
          "You can decide which layer owns a bug."
        ],
        frontendFrameworkApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-mfrachet-state-change",
        "State change becomes UI change",
        "The final goal is not just rendering static markup; it is making state changes produce visible UI changes through framework-controlled paths.",
        "This is the bridge from a toy template to a framework-like app.",
        [
          "You can describe what app state means.",
          "You can explain how events modify state.",
          "You can trace how changed state reaches the DOM."
        ],
        [frontendFrameworkApprovedResources[0], frontendFrameworkApprovedResources[1], frontendFrameworkApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Render the first template",
        "Templating",
        "Learn template literals and DOM insertion before components or VDOM.",
        "Render one template with dynamic data and inspect the generated DOM.",
        "If output is wrong, inspect the string/template result before mounting it.",
        "A dynamic template appears in the browser.",
        frontendFrameworkApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Create a reusable component",
        "Creating our first component",
        "Learn component as a function/unit that produces view output from data.",
        "Create one component and render it with two different inputs.",
        "If components duplicate logic, identify props/input versus internal implementation.",
        "Two instances share implementation but render different data.",
        [frontendFrameworkApprovedResources[0], frontendFrameworkApprovedResources[1], frontendFrameworkApprovedResources[4]]
      ),
      checkpoint(
        "Add VDOM and events",
        "Virtual DOM and Event Handling",
        "Learn virtual DOM as a representation and event handling as the entry point for interaction.",
        "Represent a view as VDOM and wire one event to a controlled handler.",
        "If events fire but UI does not change, inspect the event handler before state/change detection.",
        "A user interaction is captured by the framework layer.",
        [frontendFrameworkApprovedResources[0], frontendFrameworkApprovedResources[2], frontendFrameworkApprovedResources[3]]
      ),
      checkpoint(
        "Connect state and change detection",
        "State management and Bring it all together",
        "Learn state storage, update triggers, and change detection as the final app behavior.",
        "Modify app state through an interaction and prove the visible UI updates.",
        "If UI is stale, trace state write, change detection, and DOM patching separately.",
        "The sample app changes visibly from state and README explains missing framework features.",
        frontendFrameworkApprovedResources.slice(0, 5)
      )
    ],
    [
      "Write the tutorial table of contents as layer checkpoints before coding.",
      "Review template literals, DOM insertion, and event listeners.",
      "Create one tiny app state object and expected UI change.",
      "Commit after template, component, VDOM/events, and state/change detection."
    ],
    [
      "Demo a component whose state changes visible UI.",
      "Add README layers: template, component, VDOM, events, state, change detection.",
      "Include one stale-UI or event wiring bug and how it was isolated.",
      "List omitted production framework concerns such as accessibility, scheduler, SSR, hydration, devtools, and compiler transforms."
    ],
    "Built Marvin Frachet's frontend-framework tutorial as layered template/component/VDOM/state/change-detection work with explicit proof tasks.",
    ["Source extraction is full and the tutorial publishes a clear layer-by-layer table of contents."]
  ),
  approvedTutorialOverride(
    "uncategorized-nim-writing-a-minitest-framework",
    "Individual review of Nim Days MiniTest plus Nim template/macro and testing resources",
    "Approved path for the Nim MiniTest tutorial focused on assertions, templates, AST-to-string output, suite macros, and readable test reports.",
    minitestApprovedResources,
    [
      concept(
        "approved-minitest-expression-as-code-and-text",
        "Expression as code and text",
        "MiniTest becomes interesting because a check both evaluates an expression and prints the expression text in the report.",
        "This is the beginner bridge from ordinary assertions to why Nim templates/macros are useful.",
        [
          "You can explain why repeating the expression as a string is boilerplate.",
          "You can describe what `astToStr` contributes.",
          "You can show a passing and failing check message."
        ],
        minitestApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-minitest-suite-macro",
        "Suite as structured test output",
        "The tutorial uses a suite macro to group checks and transform the statements inside the block.",
        "This gives learners a concrete macro use case without pretending they need to master all metaprogramming first.",
        [
          "You can explain templates versus macros at beginner level.",
          "You can inspect a suite block with dumpTree.",
          "You can describe how indentation/group headers are generated."
        ],
        [minitestApprovedResources[0], minitestApprovedResources[1], minitestApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Start with duplicated assertions",
        "Intro and expectation",
        "Learn the pain point: a normal assert checks behavior but does not automatically produce a nice expression message.",
        "Write two plain asserts and the desired MiniTest output beside them.",
        "If the goal is vague, write the target terminal output first.",
        "README shows before/after assertion ergonomics.",
        minitestApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Implement `check` as a template",
        "Templates",
        "Learn untyped template parameters, expression evaluation, `astToStr`, and pass/fail message formatting.",
        "Create `check` and run passing plus failing examples.",
        "If output lies, separate expression evaluation from expression string conversion.",
        "A passing and failing check print the expected expression-aware messages.",
        [minitestApprovedResources[0], minitestApprovedResources[1], minitestApprovedResources[3]]
      ),
      checkpoint(
        "Inspect the suite AST",
        "Macros and dumpTree",
        "Learn macro input as AST before rewriting statements.",
        "Use dumpTree on a suite block and label the name and statement list nodes.",
        "If macro code feels magical, stop and draw the AST shape before generating output.",
        "README includes a simplified suite AST sketch.",
        [minitestApprovedResources[0], minitestApprovedResources[2], minitestApprovedResources[3]]
      ),
      checkpoint(
        "Generate grouped test output",
        "Suite macro implementation",
        "Learn statement macros as code generation for grouped checks and indentation.",
        "Implement `suite` so grouped checks print headers and indented results.",
        "If a check disappears, inspect which AST nodes the macro preserves or rewrites.",
        "A suite with arithmetic/string checks prints grouped output and README names missing testing-framework features.",
        minitestApprovedResources.slice(0, 5)
      )
    ],
    [
      "Review Nim basics, templates, and macros enough to read AST examples.",
      "Write the desired MiniTest output before implementation.",
      "Create tiny arithmetic/string checks as fixtures.",
      "Commit after check template, dumpTree notes, suite macro, and final report."
    ],
    [
      "Demo passing and failing checks plus grouped suites.",
      "Add README explaining template versus macro and AST-to-string behavior.",
      "Include one macro/AST bug and how dumpTree helped.",
      "List omitted test-framework features such as assertions library, test discovery, failure aggregation, colors, filters, async, and CI reporters."
    ],
    "Built the Nim MiniTest tutorial as a focused testing DSL with expression-aware checks, suite macros, AST inspection, and honest framework limits.",
    ["Source extraction is full and the tutorial's template/macro progression is explicit."]
  ),
  approvedTutorialOverride(
    "uncategorized-php-modern-php-without-a-framework",
    "Individual review of Modern PHP Without a Framework plus PHP-FIG/Composer/web-app resources",
    "Approved path for the modern PHP tutorial focused on front controller, Composer autoloading, dependency injection, request/response cycle, routing, and framework-free architecture.",
    modernPhpApprovedResources,
    [
      concept(
        "approved-php-front-controller",
        "One front controller owns the request entry point",
        "The tutorial starts with `public/index.php`, a single file that every browser request reaches first. That file boots the application, loads dependencies, creates request objects, dispatches work, and eventually sends a response.",
        "This matters because beginners often think a PHP app is a pile of pages. The front-controller shape teaches a modern web-app boundary: public files stay small, application code lives outside the web root, and every request follows the same predictable path.",
        [
          "You can explain why `public/index.php` is the request entry point.",
          "You can run PHP's built-in server against the public directory.",
          "You can distinguish app bootstrapping from page-specific logic."
        ],
        [modernPhpApprovedResources[13], modernPhpApprovedResources[1], modernPhpApprovedResources[15], modernPhpApprovedResources[5]]
      ),
      concept(
        "approved-php-composer-di",
        "Composer autoloading replaces include-spaghetti",
        "The tutorial uses Composer and PSR-4 so PHP can locate classes from namespaces and directory paths. Instead of scattering `require` calls through the app, the front controller loads Composer once and then class names map to files.",
        "This is a beginner unlock. It explains why modern PHP projects have `composer.json`, `vendor/autoload.php`, namespaces, and `src/` directories, and it makes later package usage feel like normal architecture rather than magic.",
        [
          "You can explain PSR-4 at a beginner level.",
          "You can move Hello World into an autoloaded class.",
          "You can debug a namespace/path mismatch without guessing."
        ],
        [modernPhpApprovedResources[2], modernPhpApprovedResources[3], modernPhpApprovedResources[4], modernPhpApprovedResources[14]]
      ),
      concept(
        "approved-php-di-container",
        "Dependency injection keeps object needs visible",
        "The tutorial first explains dependency injection as passing collaborators into a class, then introduces PHP-DI as a container that can assemble those collaborators at the application boundary.",
        "This keeps the app understandable. A beginner should learn that dependency injection is the design habit, while the container is a tool; classes should not hide database connections, environment reads, or service construction inside random methods.",
        [
          "You can explain why `new PDO(...)` inside a business method is tightly coupled.",
          "You can pass a fake dependency into a class during a test.",
          "You can say why PSR-11 discourages using the container as a service locator."
        ],
        [modernPhpApprovedResources[8], modernPhpApprovedResources[6], modernPhpApprovedResources[9], modernPhpApprovedResources[15]]
      ),
      concept(
        "approved-php-routing-handler",
        "Routing chooses a handler before work begins",
        "Routing turns an HTTP method and URI into a handler plus route variables. In the tutorial, this is where a URL such as a product path becomes an application decision rather than an `if` statement buried in the front controller.",
        "This is the bridge from one Hello World page to a real app. A beginner can see that the front controller should not contain every page's logic; it should delegate to a router and handler layer.",
        [
          "You can identify method, path, handler, and route variables.",
          "You can explain what should happen for not found and method not allowed results.",
          "You can keep route registration separate from handler execution."
        ],
        [modernPhpApprovedResources[10], modernPhpApprovedResources[13], modernPhpApprovedResources[5], modernPhpApprovedResources[7]]
      ),
      concept(
        "approved-php-psr-middleware-response",
        "Middleware wraps request handling and response emission",
        "The later tutorial sections use PSR-7 request/response objects and PSR-15 middleware so cross-cutting behavior can wrap the handler pipeline. A response object is created, passed back through the stack, and emitted to the browser deliberately.",
        "This explains why frameworks feel structured without requiring a framework. Middleware, request handlers, response factories, and emitters are the small interoperable pieces that frameworks usually assemble for you.",
        [
          "You can describe the middleware onion without hand-waving.",
          "You can identify where a `ServerRequestInterface` enters the app.",
          "You can explain why echoing strings is different from emitting a response object."
        ],
        [modernPhpApprovedResources[7], modernPhpApprovedResources[11], modernPhpApprovedResources[16], modernPhpApprovedResources[12]]
      )
    ],
    [
      checkpoint(
        "Serve Hello World through `public/index.php`",
        "PHP, How Does it Work and The Front Controller",
        "Learn PHP's per-request lifecycle, built-in server, public directory, strict types, and the front-controller shape.",
        "Run `php -S localhost:8080 -t public/` and serve a tiny response from `public/index.php`.",
        "If the browser cannot reach it, inspect working directory, public path, and PHP version before app code.",
        "The browser shows Hello World through the front controller.",
        [modernPhpApprovedResources[0], modernPhpApprovedResources[1], modernPhpApprovedResources[13], modernPhpApprovedResources[15]]
      ),
      checkpoint(
        "Move behavior into an autoloaded class",
        "Autoloading and Third-Party Packages",
        "Learn Composer, `composer.json`, PSR-4 namespace mapping, and vendor autoloading.",
        "Create a class under `src/`, autoload it, and call it from the front controller.",
        "If class loading fails, inspect namespace, path, composer dump-autoload/install, and case sensitivity.",
        "The response comes from an autoloaded class.",
        [modernPhpApprovedResources[2], modernPhpApprovedResources[3], modernPhpApprovedResources[4], modernPhpApprovedResources[14]]
      ),
      checkpoint(
        "Inject dependencies and configure the container",
        "What is Dependency Injection and The Dependency Injection Container",
        "Learn constructor injection, hidden dependency creation, PSR-11 container access, and PHP-DI's explicit container builder configuration.",
        "Refactor one class to receive a collaborator, then configure PHP-DI to create that class without hiding the dependency inside the class.",
        "If the code becomes hard to test, identify whether the class is asking the container for dependencies instead of receiving them.",
        "A class can be instantiated with a fake dependency, and the container can create the real application instance.",
        [modernPhpApprovedResources[8], modernPhpApprovedResources[9], modernPhpApprovedResources[6], modernPhpApprovedResources[15]]
      ),
      checkpoint(
        "Route a request to a handler",
        "Routing",
        "Learn route patterns, HTTP methods, URI parsing, route variables, not-found results, and method-not-allowed results.",
        "Register one static route and one parameterized route, dispatch the current request, and call a handler with route variables.",
        "If every request hits the wrong handler, inspect method, URI normalization, query-string stripping, and route registration order.",
        "Two URLs reach different handlers and the README explains the dispatcher result cases.",
        [modernPhpApprovedResources[10], modernPhpApprovedResources[13], modernPhpApprovedResources[5], modernPhpApprovedResources[7]]
      ),
      checkpoint(
        "Build the middleware dispatcher path",
        "Middleware and The Middleware Dispatcher",
        "Learn PSR-15 middleware, request handlers, middleware queue order, Relay dispatch, and how middleware can create or delegate a response.",
        "Create a short middleware queue, pass a server request through Relay, and prove middleware executes in the expected order.",
        "If middleware does not run, inspect queue entries, resolver/container wiring, and whether each class implements the PSR-15 interface.",
        "The app logs or tests middleware order and still returns the expected response.",
        [modernPhpApprovedResources[7], modernPhpApprovedResources[11], modernPhpApprovedResources[16], modernPhpApprovedResources[12]]
      ),
      checkpoint(
        "Emit the response and document framework-free scope",
        "Properly Sending Responses and Wrapping Up",
        "Learn PSR-7 response objects, Diactoros response emission, headers/body separation, and what a full framework would still provide.",
        "Return a response object from the pipeline, emit it deliberately, then add a README diagram for front controller -> container -> router -> middleware -> handler -> response.",
        "If output is duplicated or headers fail, inspect whether anything echoed before the emitter and whether response headers/body are being sent once.",
        "README explains request flow, response emission, and missing framework features such as templates, sessions, validation, security middleware, error pages, and configuration management.",
        [modernPhpApprovedResources[12], modernPhpApprovedResources[16], modernPhpApprovedResources[5], modernPhpApprovedResources[0]]
      )
    ],
    [
      "Install PHP and Composer and confirm versions before project work.",
      "Create `public/` and `src/` deliberately so entry point and app code are separate.",
      "Write the request lifecycle in one paragraph before adding dependencies.",
      "Commit after front controller, Composer autoloading, DI refactor, and architecture notes."
    ],
    [
      "Demo the app from PHP's built-in server.",
      "Add README setup and request-flow diagram.",
      "Include one autoloading/namespace bug and how it was diagnosed.",
      "List what the framework-free app still lacks compared with Laravel/Symfony-style frameworks."
    ],
    "Built Modern PHP Without a Framework as a front-controller app with Composer/PSR-4 autoloading, dependency injection, a PSR-11 container, FastRoute routing, PSR-15 middleware dispatch, PSR-7 response emission, request lifecycle understanding, and framework-limit documentation.",
    [
      "Source extraction is full and the tutorial explicitly teaches architecture, not just code snippets.",
      "Manual audit covered the original Kevin Smith article, PHP built-in server, namespaces, and type docs, Composer autoloading docs, PHP-FIG PSR-4/7/11/15/17, PHP-DI, FastRoute, Relay, Laminas Diactoros, and MDN HTTP messages."
    ],
    { prerequisiteResources: modernPhpApprovedResources, prerequisiteResourceStrategy: "modern-php" }
  ),
  approvedTutorialOverride(
    "augmented-reality-python-augmented-reality-with-python-and-opencv",
    "Individual review of Bites of Code OpenCV AR tutorial plus OpenCV AR/camera resources",
    "Approved path for the Python/OpenCV AR tutorial focused on reference-surface recognition, ORB features, descriptor matching, homography, projection, and proof-of-concept limitations.",
    openCvArApprovedResources,
    [
      concept(
        "approved-opencv-ar-reference-plane",
        "The flat reference surface is the anchor",
        "This project is not general scene understanding. It is card-style augmented reality: choose a known flat reference surface, find that plane in each frame, then draw a model whose pose is tied to that plane.",
        "That distinction protects beginners from vague AR expectations. The tutorial works because a planar surface lets the learner connect reference-image coordinates, camera-frame coordinates, and model coordinates one boundary at a time.",
        [
          "You can explain why this project needs a known flat target before it can draw an overlay.",
          "You can name reference-image coordinates, camera-frame pixels, and model coordinates.",
          "You can state why non-planar objects and markerless AR are outside this tutorial's scope."
        ],
        [openCvArApprovedResources[0], openCvArApprovedResources[8], openCvArApprovedResources[10], openCvArApprovedResources[11]]
      ),
      concept(
        "approved-opencv-ar-orb-descriptors",
        "ORB keypoints become binary descriptors",
        "The first real computer-vision skill here is extracting stable points from the reference image and the scene image, then describing each point with ORB so the program can compare them.",
        "If this layer is weak, everything after it becomes fake confidence. A blurry, textureless, badly cropped, or poorly lit reference surface will produce too few distinctive descriptors for the homography to be trustworthy.",
        [
          "You can explain keypoints as distinctive image locations.",
          "You can explain descriptors as comparable fingerprints around those locations.",
          "You can predict why corners and textured regions work better than blank surfaces."
        ],
        [openCvArApprovedResources[0], openCvArApprovedResources[3], openCvArApprovedResources[4], openCvArApprovedResources[6]]
      ),
      concept(
        "approved-opencv-ar-matches-homography",
        "Good matches estimate the homography",
        "After ORB descriptors exist, the tutorial matches reference descriptors to scene descriptors, filters weak evidence, and estimates the homography that maps the flat reference plane into the camera image.",
        "This is the gate between object recognition and usable geometry. Bad matches create bad homographies, and bad homographies make outlines and projected models drift, warp, or appear in the wrong place.",
        [
          "You can explain Hamming distance for ORB's binary descriptors.",
          "You can describe why RANSAC separates inlier matches from outliers.",
          "You can use the projected reference outline as a visual test before adding 3D rendering."
        ],
        [openCvArApprovedResources[5], openCvArApprovedResources[7], openCvArApprovedResources[9], openCvArApprovedResources[6]]
      ),
      concept(
        "approved-opencv-ar-projection-matrix",
        "Homography plus camera assumptions becomes projection",
        "Part 2 turns the 2D plane mapping into a 3D projection step by combining the homography with a camera calibration matrix, recovering a rotation-like basis and translation, then projecting model points into image pixels.",
        "That is the exact math bridge that makes the final overlay feel like AR instead of drawing on top of an image. Beginners need to treat camera intrinsics, coordinate axes, matrix order, and model scale as testable assumptions.",
        [
          "You can explain what the camera calibration matrix contributes.",
          "You can trace one model vertex through projection into image pixels.",
          "You can debug a floating or flipped model by checking axes, scale, and matrix order."
        ],
        [openCvArApprovedResources[1], openCvArApprovedResources[10], openCvArApprovedResources[11], openCvArApprovedResources[12], openCvArApprovedResources[15]]
      ),
      concept(
        "approved-opencv-ar-stability-limits",
        "Tracking smooths a noisy proof of concept",
        "Part 3 is valuable because it admits the first version is shaky: the program detects the surface independently in each frame, then improves stability by carrying state forward with tracking and Kalman-filter ideas.",
        "This keeps the portfolio story honest. The learner can explain what was built, what was only a proof of concept, and why lighting, blur, occlusion, calibration, frame rate, and target quality determine whether the demo survives real video.",
        [
          "You can describe why per-frame detection jitters.",
          "You can explain what previous-frame state adds to the estimate.",
          "You can list the prototype's practical limits without overselling it."
        ],
        [openCvArApprovedResources[2], openCvArApprovedResources[14], openCvArApprovedResources[13], openCvArApprovedResources[6]]
      )
    ],
    [
      checkpoint(
        "Prepare reference and scene images",
        "Where do we start?",
        "Learn why the tutorial depends on a known flat target, a clean reference crop, and at least one positive and one negative scene image before feature matching starts.",
        "Load the reference and scene images in grayscale, record their dimensions, and save a quick contact sheet showing the exact images that will be used for matching.",
        "If later results are unstable, come back here first: the reference may be too blank, too cropped, too glossy, or not actually planar.",
        "The project folder contains a reference image, a positive scene, a negative scene, and a short note explaining why the target should be detectable.",
        [openCvArApprovedResources[0], openCvArApprovedResources[10], openCvArApprovedResources[9], openCvArApprovedResources[15]]
      ),
      checkpoint(
        "Detect ORB features and descriptors",
        "Feature extraction and description",
        "Learn feature extraction, descriptor computation, grayscale inputs, ORB parameters, and why distinctive points are the raw material for the whole AR pipeline.",
        "Run ORB on the reference and scene images, then export keypoint visualizations before writing any matching or projection code.",
        "If too few keypoints appear, inspect grayscale conversion, image sharpness, lighting, target texture, and ORB feature count.",
        "Keypoints are visible on both images, and the notes identify whether the reference is feature-rich enough to continue.",
        [openCvArApprovedResources[0], openCvArApprovedResources[3], openCvArApprovedResources[4], openCvArApprovedResources[6]]
      ),
      checkpoint(
        "Match descriptors and reject weak detections",
        "Feature matching",
        "Learn Hamming distance, brute-force matching, cross-checking, minimum-match thresholds, and why a negative image is needed to catch false confidence.",
        "Match ORB descriptors, draw accepted matches, and compare a positive scene against a negative scene before estimating geometry.",
        "If false positives dominate, inspect descriptor distance, crossCheck, threshold choice, and whether the scene shares repeated visual patterns.",
        "The positive scene produces a convincing match set, while the negative scene fails with a clear not-enough-matches path.",
        [openCvArApprovedResources[5], openCvArApprovedResources[7], openCvArApprovedResources[6], openCvArApprovedResources[0]]
      ),
      checkpoint(
        "Estimate homography and draw the outline",
        "Homography estimation",
        "Learn homography as the 2D transform from the reference plane to the target image, plus RANSAC as protection against bad matches.",
        "Compute the homography from matched point pairs, use it to project the reference corners, and draw the outline on the scene.",
        "If the outline is warped or jumps away from the target, debug match quality and inlier counts before touching projection math.",
        "The projected outline hugs the reference surface in the positive scene and refuses to draw in the negative scene.",
        [openCvArApprovedResources[8], openCvArApprovedResources[9], openCvArApprovedResources[7], openCvArApprovedResources[15]]
      ),
      checkpoint(
        "Recover projection and render a simple model",
        "Pose estimation from a plane and model projection",
        "Learn the camera calibration matrix, coordinate conventions, projection-matrix derivation, OBJ vertex projection, and the difference between a plane outline and a 3D overlay.",
        "Project a tiny cube or simple OBJ model onto the detected plane, saving screenshots after projection but before any smoothing or polish.",
        "If the model floats or flips, inspect coordinate-space conventions and matrix order.",
        "A frame shows the model aligned to the reference surface, and the notes trace one model vertex from model space to image pixels.",
        [openCvArApprovedResources[1], openCvArApprovedResources[11], openCvArApprovedResources[12], openCvArApprovedResources[10]]
      ),
      checkpoint(
        "Document stability and prototype limits",
        "Kalman filter and final notes",
        "Learn why the detection-only pipeline jitters, what tracking adds, and which environmental assumptions make this project fragile.",
        "Compare an unsmoothed run with a stabilized or documented-limit run, then write a README section about lighting, occlusion, calibration, motion blur, frame rate, and target quality.",
        "If the overlay jitters, separate detection noise, calibration errors, low frame rate, and model-coordinate mistakes before changing random constants.",
        "The final README includes keypoint, match, homography-outline, projection, and stability evidence with an honest limitation list.",
        [openCvArApprovedResources[2], openCvArApprovedResources[14], openCvArApprovedResources[13], openCvArApprovedResources[6]]
      )
    ],
    [
      "Install Python, OpenCV, and NumPy and run one image-load/display script.",
      "Choose a clear planar reference image, one positive scene, and one negative scene.",
      "Save separate proof images for keypoints, matches, homography outline, and projected model.",
      "Commit after image setup, feature detection, matching, homography, projection, and stability notes."
    ],
    [
      "Demo reference-surface detection and projected object on at least one image/frame.",
      "Add screenshots of keypoints, matches, outline, and final overlay.",
      "Include one bad-match or matrix-order bug and how it was diagnosed.",
      "List limitations around lighting, occlusion, calibration, performance, and non-planar targets."
    ],
    "Built the OpenCV AR tutorial as a feature-matching, homography, and projection pipeline with visual proof artifacts and explicit AR limitations.",
    [
      "Source extraction is full and the article explicitly decomposes the project into four AR pipeline chunks.",
      "Manual audit covered Bites of Code parts 1-3, OpenCV ORB/matching/planar-tracking/homography/calibration/pose/PnP/Kalman docs, LearnOpenCV homography, and NumPy linear algebra references."
    ],
    { prerequisiteResources: openCvArApprovedResources, prerequisiteResourceStrategy: "opencv-ar" }
  ),
  approvedTutorialOverride(
    "3d-renderer-c-typescript-javascript-learning-how-to-write-a-3d-soft-engine-from-",
    "Individual review of David Rousset's 3D soft engine tutorial plus rendering/coordinate-system resources",
    "Approved path for the 3D soft-engine tutorial focused on vectors, camera/projection math, meshes, rasterization, render loops, and visual debugging.",
    softEngineApprovedResources,
    [
      concept(
        "approved-soft-engine-3d-to-2d",
        "Object points travel through spaces before becoming pixels",
        "This tutorial starts with cube vertices defined relative to the cube itself, moves the mesh into world space, views it from a camera, projects it into normalized 2D space, then remaps that result into screen coordinates.",
        "That whole chain matters because a blank or distorted render can fail at many different boundaries. Beginners need to debug model coordinates, world transforms, camera/view setup, projection, viewport mapping, and clipping as separate stages instead of treating matrix math as one mysterious black box.",
        [
          "You can distinguish object/model, world, view/camera, projection, and screen coordinates.",
          "You can explain why `world * view * projection` order matters in this tutorial.",
          "You can debug one invisible vertex by printing its value after each transform stage."
        ],
        [softEngineApprovedResources[0], softEngineApprovedResources[6], softEngineApprovedResources[7], softEngineApprovedResources[11]]
      ),
      concept(
        "approved-soft-engine-framebuffer-loop",
        "The framebuffer is just memory you redraw every frame",
        "The tutorial's Device object owns a back buffer, clears it, writes pixels into it, presents it to the visible target, and repeats that inside a rendering loop.",
        "This makes 3D feel less magical: before meshes or lighting, the learner needs to know where pixels live, when they are cleared, when they are copied to the screen, and why requestAnimationFrame or the XAML rendering callback drives animation.",
        [
          "You can explain back buffer versus front/visible buffer.",
          "You can convert x/y coordinates to a one-dimensional pixel-array index.",
          "You can describe why clear -> draw -> present must happen every frame."
        ],
        [softEngineApprovedResources[0], softEngineApprovedResources[8], softEngineApprovedResources[9]]
      ),
      concept(
        "approved-soft-engine-mesh-wireframe",
        "Meshes become faces, then wireframes",
        "After points work, the series teaches that a mesh is not only vertices. Faces store indexes into the vertex array, and each triangular face can be drawn by projecting its three vertices and connecting them with lines.",
        "That is the bridge from a rotating cloud of cube points to an actual 3D object. It also gives beginners a visual debugging stage before filled triangles and depth tests make mistakes harder to see.",
        [
          "You can explain why a cube side is split into two triangles.",
          "You can trace one face index back to three vertices.",
          "You can render a wireframe before attempting filled rasterization."
        ],
        [softEngineApprovedResources[1], softEngineApprovedResources[2], softEngineApprovedResources[0]]
      ),
      concept(
        "approved-soft-engine-raster-depth",
        "Rasterization fills triangles; Z-buffering chooses what is visible",
        "The rasterization part changes the renderer from drawing triangle edges to deciding which pixels are inside each projected triangle, then using a depth buffer to keep the nearest surface visible.",
        "This is the moment the project becomes a true software renderer. Learners must separate coverage, interpolation, color, and depth; otherwise every wrong triangle looks like one vague math failure.",
        [
          "You can explain the difference between wireframe drawing and triangle filling.",
          "You can describe what a Z-buffer stores per pixel.",
          "You can debug a wrong overlap by checking triangle coverage and depth independently."
        ],
        [softEngineApprovedResources[3], softEngineApprovedResources[10], softEngineApprovedResources[1]]
      ),
      concept(
        "approved-soft-engine-shading-texture-scope",
        "Shading and textures are later pipeline stages",
        "Flat shading, Gouraud shading, texture mapping, back-face culling, and WebGL are layered after the beginner can already transform, project, rasterize, and depth-test triangles.",
        "This ordering keeps the portfolio project honest. A learner can show a meaningful renderer without claiming a full engine, while still understanding how lighting and textures extend the same pipeline.",
        [
          "You can name what data shading needs that wireframe rendering does not.",
          "You can explain why back-face culling can hide triangles intentionally.",
          "You can list which advanced renderer features are out of scope for your version."
        ],
        [softEngineApprovedResources[4], softEngineApprovedResources[5], softEngineApprovedResources[10]]
      )
    ],
    [
      checkpoint(
        "Draw pixels and lines first",
        "Back buffer and rendering loop",
        "Learn the framebuffer/back-buffer drawing target, coordinate origin, pixel indexing, clear/present order, and frame callback before 3D math.",
        "Draw individual pixels, lines, and one moving 2D shape in the chosen runtime.",
        "If nothing appears, inspect canvas or bitmap size, coordinate origin, pixel-array indexing, and draw/update calls.",
        "A 2D line or moving shape renders reliably from a cleared buffer.",
        [softEngineApprovedResources[0], softEngineApprovedResources[8], softEngineApprovedResources[9]]
      ),
      checkpoint(
        "Project one 3D point or cube",
        "Camera, mesh, and Device object",
        "Learn vector coordinates, mesh position/rotation, camera target, view matrix, projection matrix, viewport remapping, and clipping.",
        "Project the cube's eight vertices, draw them as debug points, and print each stage for one vertex.",
        "If the cube is invisible, inspect transform order, camera position/target, near/far range, coordinate handedness, and viewport mapping before changing drawing code.",
        "Eight cube points appear and move predictably when the mesh or camera changes.",
        [softEngineApprovedResources[0], softEngineApprovedResources[6], softEngineApprovedResources[7], softEngineApprovedResources[11]]
      ),
      checkpoint(
        "Render indexed faces as a wireframe",
        "Drawing lines and triangles plus loading meshes",
        "Learn faces as indexes into the vertex array, triangle topology, line drawing, and JSON mesh loading as a separate data-loading step.",
        "Render the cube as indexed triangle edges, then load a tiny Blender/Babylon JSON mesh and draw its wireframe.",
        "If triangles connect wrong points, inspect face indexes and parsed vertices separately from projection math.",
        "A hand-built cube and one loaded mesh both render as inspectable wireframes.",
        [softEngineApprovedResources[1], softEngineApprovedResources[2], softEngineApprovedResources[0]]
      ),
      checkpoint(
        "Fill triangles with depth testing",
        "Rasterization and Z-buffering",
        "Learn triangle coverage, scanline or edge tests, per-pixel color writes, per-pixel depth storage, and why nearer fragments replace farther ones.",
        "Fill one triangle, then render a simple mesh with overlapping faces and a Z-buffer proof image.",
        "If faces appear in the wrong order, log the depth value before every pixel overwrite and separate raster coverage from depth comparison.",
        "A filled mesh renders with nearer surfaces correctly covering farther ones.",
        [softEngineApprovedResources[3], softEngineApprovedResources[10], softEngineApprovedResources[1]]
      ),
      checkpoint(
        "Add one visual polish stage and document limits",
        "Shading, textures, culling, and scope",
        "Learn flat/Gouraud shading or texture mapping as an extension of the already-working transform/raster/depth pipeline, not as the foundation.",
        "Add one polish feature, such as flat shading, Gouraud shading, back-face culling, or a texture sample; then document the remaining renderer gaps.",
        "If the feature breaks the image, switch back to wireframe/depth proof and reintroduce the feature on one triangle.",
        "README explains the pipeline from framebuffer to transforms to wireframe to rasterization to one optional polish feature.",
        [softEngineApprovedResources[4], softEngineApprovedResources[5], softEngineApprovedResources[3], softEngineApprovedResources[10]]
      )
    ],
    [
      "Review vectors, model/view/projection transforms, and the canvas or bitmap drawing target before mesh rendering.",
      "Create a debug scene with one cube and print one vertex after every transform stage.",
      "Write the render pipeline as mesh vertices -> world transform -> view transform -> projection -> viewport mapping -> rasterize -> present.",
      "Commit after framebuffer drawing, point projection, wireframe faces, mesh loading, rasterization/Z-buffering, and one polish feature."
    ],
    [
      "Demo a rotating cube or mesh progressing from debug points to wireframe to filled/depth-tested triangles.",
      "Add screenshots of debug points, wireframe, rasterized mesh, and optional shading/texture/culling stage.",
      "Include one coordinate-system, projection, face-index, or Z-buffer bug and how it was diagnosed.",
      "List missing production renderer features honestly: clipping, perspective-correct interpolation, robust model formats, materials, shadows, anti-aliasing, GPU acceleration, and performance profiling."
    ],
    "Built David Rousset's 3D soft-engine tutorial as a software-rendering pipeline with coordinate transforms, projection, mesh rendering, animation, and visual debug proof.",
    ["Source extraction is full and the tutorial is a clear multi-part graphics pipeline project."],
    { prerequisiteResources: softEngineApprovedResources, prerequisiteResourceStrategy: "soft-engine" }
  ),
  approvedTutorialOverride(
    "bot-node-js-create-a-discord-bot",
    "Individual review of discord.js Guide plus official Discord API resources",
    "Approved path for the Discord bot tutorial focused on JavaScript/Node prerequisites, Discord application identity, token safety, gateway events, slash commands, interactions, permissions, rate limits, and portfolio-grade safety notes.",
    discordBotApprovedResources,
    [
      concept(
        "approved-discord-application-identity",
        "Discord application identity and bot tokens",
        "The tutorial does not start with code; it starts with a Discord application, a bot user, a client id, an invite URL, and a token that acts like the bot's password.",
        "A beginner who treats the token as ordinary text can leak control of the bot, so the first real skill is separating platform setup, permissions, and local code.",
        [
          "You can distinguish the application id, bot token, client secret, and guild id.",
          "You can explain why `bot` and `applications.commands` are separate invite scopes.",
          "You can describe what to do if a token is committed or shared by accident."
        ],
        resourcesByIndex(discordBotApprovedResources, [1, 2, 12, 16, 21])
      ),
      concept(
        "approved-discord-node-project-shape",
        "Node project shape for a bot",
        "The bot is a long-running Node process with a package manifest, installed dependencies, command files, a main entry point, and secret configuration loaded outside source control.",
        "This project is a useful beginner bridge because it forces setup discipline before features: install Node, understand packages, run scripts, load modules, and keep secrets out of Git.",
        [
          "You can explain what `package.json`, `node_modules`, and `package-lock.json` do.",
          "You can load one command module and say why it exports both metadata and code.",
          "You can run the bot with environment variables without committing `.env` or config files."
        ],
        resourcesByIndex(discordBotApprovedResources, [3, 4, 19, 21, 26])
      ),
      concept(
        "approved-discord-gateway-event-flow",
        "Gateway events, intents, and the event loop",
        "discord.js hides most WebSocket machinery, but the mental model still matters: Discord sends gateway events, the client emits Node-style events, and intents decide which event groups your bot receives.",
        "Most beginner bot bugs look like code bugs but are really event-selection bugs: the bot is online, yet Discord never sends the event because the intent or privileged-intent setting is wrong.",
        [
          "You can map Discord's Gateway to the `ClientReady` and `InteractionCreate` events used in the guide.",
          "You can name the minimum intent needed for slash-command-only guild interactions.",
          "You can explain why enabling every privileged intent is a privacy and maintenance smell."
        ],
        resourcesByIndex(discordBotApprovedResources, [9, 10, 13, 22, 23])
      ),
      concept(
        "approved-discord-slash-command-lifecycle",
        "Slash command definition, registration, and execution",
        "A slash command has three separate lives: a command file describes the shape, a deployment script registers that shape with Discord, and an interaction handler executes code when a user invokes it.",
        "Separating those lives stops beginners from confusing local JavaScript changes with Discord API registration state, especially when a command appears, disappears, or replies too late.",
        [
          "You can explain why command definitions are registered separately from the running bot client.",
          "You can tell the difference between guild command testing and global command deployment.",
          "You can handle a command lookup miss or thrown command error without leaving the user with a failed interaction."
        ],
        resourcesByIndex(discordBotApprovedResources, [6, 7, 8, 14, 15])
      ),
      concept(
        "approved-discord-permissions-rate-limits",
        "Permissions, validation, and rate-limit safety",
        "A portfolio-quality Discord bot uses the smallest useful permissions, validates command inputs, reports failures safely, and respects Discord's per-route and global rate-limit model.",
        "This is the difference between a toy demo and a responsible integration: the bot should not require administrator access, spam requests, expose secrets, or hide operational limits from reviewers.",
        [
          "You can list the exact invite permissions your bot needs and remove unnecessary ones.",
          "You can describe what happens when Discord returns a rate-limit response.",
          "You can document production gaps such as persistence, logging, hosting, moderation risk, and sharding."
        ],
        resourcesByIndex(discordBotApprovedResources, [11, 17, 18, 16, 1])
      )
    ],
    [
      checkpoint(
        "Install Node and create a private Discord test app",
        "Before you begin, installation, and application setup",
        "Learn the guide's JavaScript prerequisite warning, install a current Node LTS, create a Discord application, and keep the work inside a private test server while learning.",
        "Install Node, initialize the project, create the Discord application, record app/client/guild ids in a local-only place, and invite the bot to a server you control.",
        "If the bot cannot be invited, inspect the OAuth2 scopes, client id, server permission to add apps, and whether the application is actually configured with a bot user.",
        "A private test server contains the bot, and the repo has project files but no secret token or generated dependency directory committed.",
        resourcesByIndex(discordBotApprovedResources, [0, 1, 2, 3, 12, 20])
      ),
      checkpoint(
        "Protect the token and build the project skeleton",
        "Project setup and configuration files",
        "Learn how the guide stores configuration, then strengthen it by using environment variables, `.gitignore`, and a small package setup that makes the run command repeatable.",
        "Create the main file, add a local environment variable or ignored config file, add scripts to `package.json`, and prove the token is read at runtime without being printed or committed.",
        "If login fails, rotate copied secrets carefully: check token versus client secret, reload the environment, and never paste a real token into logs or README text.",
        "The bot can attempt login from local configuration, `.gitignore` excludes secrets, and README setup instructions use placeholder names only.",
        resourcesByIndex(discordBotApprovedResources, [4, 5, 21, 25, 26])
      ),
      checkpoint(
        "Connect the client and prove the gateway event path",
        "The main file, event handling, and gateway intents",
        "Learn the minimum event-driven loop: create the discord.js client, choose the required intents, log `ClientReady`, and understand why slash-command-only bots usually need fewer events than message-parsing bots.",
        "Run the bot until `ClientReady` fires, then add one sanitized interaction or debug log showing that the client event system is alive without dumping tokens or full user payloads.",
        "If events do not fire, separate three causes: the process did not log in, the bot was not invited to the guild, or Discord is not sending the event because an intent/scope is missing.",
        "A ready log proves the gateway session works, and the notes explain which intents were chosen and why no privileged intent is enabled by default.",
        resourcesByIndex(discordBotApprovedResources, [9, 10, 13, 22, 23])
      ),
      checkpoint(
        "Create, register, and test one slash command",
        "Creating slash commands and registering commands",
        "Learn the command lifecycle in the guide: command files define metadata and behavior, a deployment script registers command JSON with Discord, and guild registration is the safest beginner testing path.",
        "Build a harmless `/ping` or `/about` command, register it to your test guild, run it in Discord, and capture the exact command definition fields in your notes.",
        "If the command does not appear, check `applications.commands` scope, guild id, command registration output, command name rules, and whether you registered globally by accident.",
        "A slash command appears in the test server and returns a response within Discord's interaction window.",
        resourcesByIndex(discordBotApprovedResources, [6, 8, 14, 15, 16])
      ),
      checkpoint(
        "Load commands dynamically and handle failures",
        "Command handling",
        "Learn why the guide moves away from one giant conditional: loading command files into a collection makes the bot easier to extend and makes errors easier to isolate.",
        "Load command modules from folders, guard against missing `data` or `execute`, handle `interactionCreate`, and return a safe ephemeral error when a command throws.",
        "If every command fails, check module exports and command names; if only one command fails, log the command name and catch the thrown error around that command only.",
        "At least two command files load successfully, and an intentional command error produces a controlled user-facing failure message.",
        resourcesByIndex(discordBotApprovedResources, [7, 15, 24, 27, 14])
      ),
      checkpoint(
        "Document permissions, rate limits, and production limits",
        "Permissions, OAuth2, and more to know",
        "Learn the operational side the tutorial only introduces: least-privilege invite permissions, command permission checks, rate-limit behavior, secret rotation, hosting assumptions, and scaling limits.",
        "Add README sections for required scopes, required permissions, token rotation, expected rate-limit behavior, safe testing rules, and what would need to change before public deployment.",
        "If a feature requires broad permissions or message content, rewrite the feature or document the exact reason and safer alternative before enabling privileged access.",
        "The project README makes the bot reviewable as a responsible integration, not just a command that happens to run.",
        resourcesByIndex(discordBotApprovedResources, [11, 17, 18, 16, 1])
      )
    ],
    [
      "Learn enough JavaScript, Node, npm, modules, and async functions to understand the guide's warning before wiring Discord-specific code.",
      "Use a private test server, a disposable development application, and ignored environment/config files for every token and id.",
      "Write the command names, descriptions, required scopes, and required permissions before implementing handlers.",
      "Commit after app creation, token-safe project setup, gateway proof, command registration, command handling, and safety documentation."
    ],
    [
      "Demo one slash command in a test server.",
      "Add README setup with no real secrets and with separate development/test ids documented as placeholders.",
      "Include a permissions, OAuth2 scopes, and gateway intents explanation tied to this exact bot.",
      "Include one real debugging note such as missing command registration, wrong token, missing scope, or an intent mismatch.",
      "List missing production bot concerns such as persistence, rate limits, sharding, moderation abuse cases, hosting, logging, uptime, and observability."
    ],
    "Built the Discord bot tutorial as an event-driven platform integration with safe app setup, token handling, gateway/intents reasoning, slash-command registration, command dispatch, permissions, and deployment limits.",
    ["Source is official guide content and Discord platform documentation; the guide explicitly warns learners to build JavaScript confidence before attempting the bot."],
    { prerequisiteResources: discordBotApprovedResources, prerequisiteResourceStrategy: "discord-bot" }
  ),
  approvedTutorialOverride(
    "network-stack-c-let-s-code-a-tcp-ip-stack",
    "Individual review of Saminiir TCP/IP stack plus Linux TUN/TAP, ARP, and networking references",
    "Approved path for the TCP/IP stack tutorial focused on Linux TAP devices, Ethernet frames, ARP parsing/reply behavior, packet structs, and layer-by-layer proof.",
    tcpIpStackApprovedResources,
    [
      concept(
        "approved-tcpip-tap-frame",
        "TAP device to Ethernet frame",
        "The tutorial starts at the boundary where a Linux TAP device gives user-space code Ethernet frames to read and write.",
        "This makes the network stack concrete: bytes enter through a virtual device before protocol parsing begins.",
        [
          "You can explain TAP versus TUN at beginner level.",
          "You can identify source MAC, destination MAC, and ethertype.",
          "You can say which Linux permissions/runtime assumptions the tutorial needs."
        ],
        tcpIpStackApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-tcpip-arp-layer",
        "ARP as first layer proof",
        "The first visible success is replying to ARP so the host kernel updates its ARP cache for the virtual interface.",
        "This gives learners a concrete packet-level proof before IP, ICMP, TCP, or retransmission complexity.",
        [
          "You can parse ARP fields and opcode.",
          "You can explain sender/target hardware/protocol addresses.",
          "You can verify success with arping or arp cache output."
        ],
        [tcpIpStackApprovedResources[0], tcpIpStackApprovedResources[2], tcpIpStackApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Open and read from TAP",
        "TUN/TAP devices",
        "Learn the Linux virtual-device boundary, file descriptors, and why this project is OS-specific.",
        "Create/open a TAP device and log raw frame reads in a controlled environment.",
        "If TAP fails, inspect permissions, `/dev/net/tun`, interface setup, and flags before protocol code.",
        "The program can read data from the virtual network device.",
        tcpIpStackApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Parse Ethernet frames",
        "Ethernet Frame Format and Parsing",
        "Learn packed structs, byte order, MAC fields, ethertype, and payload boundaries.",
        "Parse destination/source MAC and ethertype from one frame and print them.",
        "If fields are wrong, inspect struct packing, offsets, and endianness.",
        "A captured frame prints expected Ethernet header fields.",
        [tcpIpStackApprovedResources[0], tcpIpStackApprovedResources[3], tcpIpStackApprovedResources[4]]
      ),
      checkpoint(
        "Handle ARP request/reply",
        "Address Resolution Protocol",
        "Learn ARP packet fields and the algorithm for answering requests targeted at your virtual IP.",
        "Parse ARP requests and send a valid ARP reply.",
        "If arping fails, compare ARP opcode, sender/target swaps, and MAC/IP byte order.",
        "The host recognizes the ARP reply and updates or reports the expected ARP entry.",
        [tcpIpStackApprovedResources[0], tcpIpStackApprovedResources[2], tcpIpStackApprovedResources[3]]
      ),
      checkpoint(
        "Document stack scope before TCP",
        "Conclusion and next layers",
        "Learn why Ethernet/ARP is only the first layer and what IP/ICMP/TCP will add.",
        "Add README layer diagram, commands used, environment requirements, and missing TCP/IP guarantees.",
        "If the demo only works on one machine, document kernel, permissions, and network setup.",
        "README explains TAP, Ethernet, ARP proof, and missing IP/TCP features.",
        tcpIpStackApprovedResources.slice(0, 6)
      )
    ],
    [
      "Use a Linux environment and understand that TAP setup may need elevated permissions.",
      "Review Ethernet and ARP packet diagrams before writing structs.",
      "Create a packet log for each layer boundary.",
      "Commit after TAP setup, Ethernet parsing, ARP reply, and scope documentation."
    ],
    [
      "Demo ARP response with a local command such as arping or arp cache inspection.",
      "Add README packet diagrams and environment setup.",
      "Include one byte-order/packing bug and how it was isolated.",
      "List missing stack features such as IP, ICMP, TCP state machine, checksums, retransmission, congestion control, and portability."
    ],
    "Built Saminiir's TCP/IP stack tutorial as a Linux TAP/Ethernet/ARP packet project with layer proof and explicit network-stack scope.",
    ["Source extraction is full and the article has concrete packet sections and verification commands."]
  ),
  approvedTutorialOverride(
    "programming-language-java-crafting-interpreters-a-handbook-for-making-programmin",
    "Individual review of Crafting Interpreters plus scanner/parser/runtime resources",
    "Approved path for Crafting Interpreters focused on two interpreters, scanning, parsing, ASTs, evaluation, bytecode VM, closures/classes, and pacing it as a long course rather than a quick portfolio clone.",
    craftingInterpretersApprovedResources,
    [
      concept(
        "approved-crafting-front-end",
        "Source text becomes structured code",
        "Crafting Interpreters teaches language implementation by turning raw source into tokens, syntax trees, and semantic behavior.",
        "Beginners need this front-end ladder before runtime, closures, classes, or bytecode make sense.",
        [
          "You can print tokens for a tiny program.",
          "You can draw an expression AST.",
          "You can explain lexical, syntax, and runtime errors separately."
        ],
        craftingInterpretersApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-crafting-two-implementations",
        "Tree-walk then bytecode",
        "The book intentionally builds a tree-walk interpreter first, then a bytecode virtual machine, so the learner sees the same language from two implementation angles.",
        "That structure is a gift for beginners if they treat it as a course with proof checkpoints instead of a race.",
        [
          "You can explain tree-walk evaluation.",
          "You can explain bytecode as compact instructions for a VM.",
          "You can name which chapters are language features versus runtime engineering."
        ],
        [craftingInterpretersApprovedResources[0], craftingInterpretersApprovedResources[2], craftingInterpretersApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Tokenize tiny Lox programs",
        "Scanning",
        "Learn scanner responsibilities, token types, lexemes, literals, and line/error reporting.",
        "Implement scanning for a small expression and print the token stream.",
        "If parsing fails, inspect token output before grammar code.",
        "A tiny source file produces expected tokens and errors are located.",
        craftingInterpretersApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Parse expressions into ASTs",
        "Representing Code and Parsing Expressions",
        "Learn grammar rules, precedence, recursive descent, and AST representation.",
        "Parse arithmetic/logical expressions and print an AST representation.",
        "If precedence is wrong, add one fixture with nested operators.",
        "Expression fixtures produce expected tree shapes.",
        [craftingInterpretersApprovedResources[0], craftingInterpretersApprovedResources[2], craftingInterpretersApprovedResources[4]]
      ),
      checkpoint(
        "Evaluate the tree-walk language slice",
        "Evaluating Expressions through functions/classes",
        "Learn environments, variables, control flow, functions, and object features as separate semantic additions.",
        "Run a small Lox program through the tree-walk interpreter and document supported features.",
        "If behavior is wrong, inspect AST and environment state before changing scanner code.",
        "A small program runs and README names the implemented language slice.",
        [craftingInterpretersApprovedResources[0], craftingInterpretersApprovedResources[1], craftingInterpretersApprovedResources[3]]
      ),
      checkpoint(
        "Treat the VM as a second project",
        "Bytecode VM",
        "Learn chunks, opcodes, stack VM behavior, compiler output, and garbage collection as a deeper second implementation.",
        "Build or scope one bytecode milestone and compare it with the tree-walk version.",
        "If VM bugs appear, disassemble bytecode and inspect stack changes step by step.",
        "README explains tree-walk versus bytecode implementation and which book chapters were completed.",
        craftingInterpretersApprovedResources.slice(0, 5)
      )
    ],
    [
      "Treat Crafting Interpreters as a multi-week course, not a weekend tutorial.",
      "Complete scanner and parser proof tasks before runtime features.",
      "Keep fixtures for valid and invalid Lox programs.",
      "Commit by chapter/milestone and write one concept learned per commit."
    ],
    [
      "Demo at least one interpreted Lox program from source text to output.",
      "Add README diagrams for scanner, parser, AST, evaluator, and optional VM.",
      "Include one parser/runtime/VM bug and how it was isolated.",
      "State exactly which chapters/features are complete and which are intentionally omitted."
    ],
    "Built Crafting Interpreters as a rigorous language-implementation course path with scanner/parser/runtime/VM milestones, fixtures, and honest completion scope.",
    ["Source is the full free web book and is too large to approve as a small tutorial; approval is scoped to a disciplined course-like path."]
  ),
  familyResearchOverride(
    "web-server-family",
    (article) => article.category === "Web Server",
    "Web-server family pack built from MDN HTTP, client-server docs, socket resources, and raw-server tutorials",
    "Research-backed web-server path focused on raw HTTP anatomy, request parsing, routing, application boundaries, and visible localhost proof.",
    webServerResources,
    [
      {
        id: "http-shape",
        title: "Requests and responses have a shape",
        plainEnglish: "Every web-server tutorial becomes easier when the learner can point to the method, path, headers, body, status line, and response body before writing framework-like code.",
        whyItMatters: "This prevents beginners from treating Flask, Express, PHP, or Ruby helpers as magic when the project is really about structured messages over a connection.",
        signsYouUnderstand: [
          "You can mark method, path, and headers in a raw request.",
          "You can write the minimum valid response shape from memory.",
          "You can explain why a malformed blank line can break a browser response."
        ]
      },
      {
        id: "routing-boundary",
        title: "Server plumbing versus app logic",
        plainEnglish: "The server layer accepts connections and creates request/response objects; application logic decides which behavior belongs to each route.",
        whyItMatters: "This gives beginners a clean path from a raw socket demo to a small framework or REST API without mixing every responsibility together.",
        signsYouUnderstand: [
          "You can name which code owns socket reads and which code owns route behavior.",
          "You can add a second route without duplicating protocol code.",
          "You can test request parsing without starting the whole server."
        ],
        resourceIndexes: [1, 2, 3]
      }
    ],
    [
      {
        title: "Print one raw request",
        sourceSectionTitle: "Request anatomy",
        learnRightHere: "Learn the request line, headers, and optional body before trying to route anything.",
        action: "Start the smallest local server and print the exact bytes or text the browser sends.",
        debugPrompt: "If nothing appears, verify the port, localhost URL, and whether the server accepted a connection.",
        selfCheck: "A browser request is visible in logs with method, path, and headers identified."
      },
      {
        title: "Return one valid response",
        sourceSectionTitle: "HTTP response",
        learnRightHere: "Learn status line, headers, blank line, and body as the minimum response contract.",
        action: "Send a hardcoded response that the browser renders without using a web framework.",
        debugPrompt: "If the browser waits forever, inspect the blank line, content length, and connection close behavior.",
        selfCheck: "The browser shows the exact body from your server and no framework is involved.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Route two paths",
        sourceSectionTitle: "Routing",
        learnRightHere: "Learn routing as a mapping from parsed request data to handler behavior.",
        action: "Return different responses for `/` and one named path using a handler or route table.",
        debugPrompt: "If both paths return the same thing, log the parsed path before handler selection.",
        selfCheck: "Two URLs produce two explainable responses from shared server plumbing.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Document the server boundary",
        sourceSectionTitle: "Framework boundary",
        learnRightHere: "Learn what production servers add: concurrency, timeouts, TLS, headers, static files, forms, and error handling.",
        action: "Write a README diagram separating connection handling, request parsing, route dispatch, and app behavior.",
        debugPrompt: "If the code is hard to explain, mark which function owns each layer before refactoring.",
        selfCheck: "README explains what works locally and what a production server would still need.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a web-server project that moves from raw request/response proof to routing and a clear server/application boundary."
  ),
  familyResearchOverride(
    "bot-platform-family",
    (article) => article.category === "Bot" || /bot|discord|slack|reddit|telegram|twitter|irc|messenger|chatbot/i.test(article.title),
    "Bot/platform family pack built from audited WebSocket, HTTP, async JavaScript, environment-variable, and secret-management resources",
    "Research-backed bot path focused on event delivery, platform API boundaries, credential hygiene, asynchronous handlers, rate-limit awareness, and safe local testing without injecting unrelated platform docs.",
    botResources,
    [
      {
        id: "event-driven-bot",
        title: "Bots react to events",
        plainEnglish: "A bot waits for messages, commands, webhooks, or gateway events and then runs small handlers instead of executing one linear script.",
        whyItMatters: "This is the beginner bridge from normal code flow to platform automation, and it explains why logs and fake events are essential.",
        signsYouUnderstand: [
          "You can describe what event wakes the bot.",
          "You can test one handler with fake input.",
          "You can separate receiving an event from deciding the reply."
        ],
        resourceIndexes: [0, 1, 3]
      },
      {
        id: "platform-contracts",
        title: "Platform contracts and limits",
        plainEnglish: "Bot platforms define message formats, authentication tokens, permissions, and rate limits that your code must respect.",
        whyItMatters: "Beginners often debug their own code when the actual problem is a missing permission, invalid token, changed API shape, or blocked rate limit.",
        signsYouUnderstand: [
          "You can name the token or credential type without exposing it.",
          "You can explain one permission the bot needs.",
          "You can log API failures without leaking secrets."
        ],
        resourceIndexes: [1, 2, 4]
      }
    ],
    [
      {
        title: "Run the bot skeleton safely",
        sourceSectionTitle: "Setup and credentials",
        learnRightHere: "Learn environment variables, platform app setup, and the difference between local code and platform configuration.",
        action: "Start the bot with a harmless login or local handler test and keep credentials out of source control.",
        debugPrompt: "If authentication fails, check token location, app permissions, and the platform dashboard before changing handler code.",
        selfCheck: "The bot starts or the handler test runs without secrets committed.",
        resourceIndexes: [2, 4, 1]
      },
      {
        title: "Handle one message or command",
        sourceSectionTitle: "Message events",
        learnRightHere: "Learn incoming event shape before building features.",
        action: "Log one event, extract command text or payload, and return a simple response.",
        debugPrompt: "If the reply is wrong, print sanitized input and parsed command side by side.",
        selfCheck: "One known input produces one predictable reply.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Call one external API or platform action",
        sourceSectionTitle: "API interaction",
        learnRightHere: "Learn request/response errors, permissions, and async behavior at the moment the bot leaves local logic.",
        action: "Send one message, fetch one resource, or perform one platform action with explicit error handling.",
        debugPrompt: "If the API call fails, record status code, permission, and payload shape without exposing secrets.",
        selfCheck: "A successful call and one handled failure are both visible in logs.",
        resourceIndexes: [1, 3, 2, 4]
      },
      {
        title: "Add safety and limits",
        sourceSectionTitle: "Deployment and reliability",
        learnRightHere: "Learn rate limits, retries, command validation, and what should not be automated.",
        action: "Add one validation rule, one failure message, and a README section describing permissions and limits.",
        debugPrompt: "If repeated commands misbehave, inspect handler idempotence and platform rate-limit responses.",
        selfCheck: "README explains setup, supported commands, credentials, and rate-limit or moderation boundaries.",
        resourceIndexes: [4, 2, 1, 3]
      }
    ],
    "Built a bot with event handling, platform API integration, credential hygiene, and documented permissions/rate-limit boundaries."
  ),
  familyResearchOverride(
    "frontend-framework-family",
    (article) => article.category === "Front-end Framework / Library" || /react|redux|angular|virtual dom|front.?end|framework|component|reconciler/i.test(article.title),
    "Front-end framework pack built from React docs, Redux fundamentals, and MDN framework material",
    "Research-backed front-end-internals path focused on state, components, render output, reconciliation, events, and update proof.",
    frontendFrameworkResources,
    [
      {
        id: "state-to-ui",
        title: "State becomes UI",
        plainEnglish: "A framework or state library turns changing data into repeatable visible output by deciding what to render and when updates should happen.",
        whyItMatters: "This is the center of React, Redux, Angular digest loops, and virtual DOM tutorials; without it beginners copy APIs without knowing what problem they solve.",
        signsYouUnderstand: [
          "You can describe the state shape for one component or store.",
          "You can explain what should re-render when state changes.",
          "You can test a state change without clicking through a whole app."
        ]
      },
      {
        id: "render-diff-commit",
        title: "Render, compare, commit",
        plainEnglish: "Many UI internals produce a description of the next UI, compare it with the previous one, then commit the minimal visible change.",
        whyItMatters: "This explains virtual DOM, reconciliation, store subscriptions, and why framework code separates describing UI from mutating the real DOM.",
        signsYouUnderstand: [
          "You can print the desired UI representation before touching the DOM.",
          "You can name what changed between two renders.",
          "You can explain why direct DOM mutation can fight the framework model."
        ],
        resourceIndexes: [0, 1, 3]
      }
    ],
    [
      {
        title: "Render static output",
        sourceSectionTitle: "Render model",
        learnRightHere: "Learn the framework's smallest representation: component, element, template, store state, or virtual node.",
        action: "Create one static view from a plain object or function and inspect the generated representation.",
        debugPrompt: "If output is empty, inspect the representation before DOM mounting.",
        selfCheck: "A static component/store/template produces visible or inspectable output."
      },
      {
        title: "Introduce state and update",
        sourceSectionTitle: "State updates",
        learnRightHere: "Learn the difference between initial state, state change, and visible update.",
        action: "Change one state value and prove the visible result or store output changes.",
        debugPrompt: "If the UI does not update, log state before render and after update.",
        selfCheck: "One state change produces one predictable UI or subscriber result.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Add events or subscriptions",
        sourceSectionTitle: "Interaction",
        learnRightHere: "Learn how user actions or dispatch calls enter the update pipeline.",
        action: "Wire one click, dispatch, or input event to update state through the tutorial's mechanism.",
        debugPrompt: "If events fire but state is wrong, inspect the action/payload before render code.",
        selfCheck: "A user action or dispatch causes the exact intended update.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Prove the framework boundary",
        sourceSectionTitle: "Internals and limits",
        learnRightHere: "Learn which production concerns are omitted: scheduling, batching, lifecycle edge cases, accessibility, devtools, SSR, or compiler transforms.",
        action: "Add a README architecture diagram for representation, update, render/commit, and limitations.",
        debugPrompt: "If the model feels too abstract, trace one update through each named stage.",
        selfCheck: "README explains the tutorial's framework model and which real-framework features are absent.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a front-end framework/library slice that connects state, rendering, updates, events, and documented production-framework gaps."
  ),
  familyResearchOverride(
    "cli-tool-family",
    (article) => article.category === "Command-Line Tool" || /command.?line|cli|terminal|lolcat|cowsay|fortune/i.test(article.title),
    "CLI/tooling pack built from Missing Semester, argparse, Rust CLI, and Node process docs",
    "Research-backed CLI path focused on terminal basics, arguments, stdin/stdout/stderr, exit codes, errors, and packaging boundaries.",
    cliResources,
    [
      {
        id: "inputs-outputs-exit",
        title: "CLI contract",
        plainEnglish: "A command-line tool receives text inputs through arguments or streams, writes output to stdout or stderr, and returns an exit code.",
        whyItMatters: "This makes tiny tools portfolio-worthy because they behave predictably when used by people or scripts.",
        signsYouUnderstand: [
          "You can list accepted flags or arguments.",
          "You can choose stdout versus stderr for one message.",
          "You can explain which exit code means failure."
        ]
      },
      {
        id: "scriptable-behavior",
        title: "Scriptable behavior",
        plainEnglish: "A useful CLI is not just interactive; it can be run repeatedly, composed with other tools, and tested with fixed input.",
        whyItMatters: "Beginners need this to build commands that feel real instead of one-off demos.",
        signsYouUnderstand: [
          "You can run the tool from a clean terminal.",
          "You can test one command without manual clicking.",
          "You can pipe or redirect input/output if the project calls for it."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Parse one command shape",
        sourceSectionTitle: "Arguments",
        learnRightHere: "Learn positional arguments, flags, and help text before implementing the main behavior.",
        action: "Parse one valid command and one invalid command and print helpful usage.",
        debugPrompt: "If parsing feels messy, write the intended command syntax as examples first.",
        selfCheck: "The tool accepts one valid invocation and rejects one invalid invocation clearly."
      },
      {
        title: "Produce stable output",
        sourceSectionTitle: "Output",
        learnRightHere: "Learn stdout, stderr, formatting, and terminal assumptions at the moment output appears.",
        action: "Generate the tutorial's smallest useful output from fixed input.",
        debugPrompt: "If output changes unpredictably, isolate formatting from data collection.",
        selfCheck: "A command run produces repeatable output that can be compared in a test.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Handle errors and exit codes",
        sourceSectionTitle: "Failures",
        learnRightHere: "Learn failure as part of the user contract, not an afterthought.",
        action: "Return a nonzero exit or explicit failure result for a missing file, invalid option, or bad input.",
        debugPrompt: "If scripts cannot detect failure, inspect the process exit status.",
        selfCheck: "A failing command prints a useful error and reports failure predictably.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Package or document the command",
        sourceSectionTitle: "Usability",
        learnRightHere: "Learn install/run instructions, examples, and limitations so another person can try the tool.",
        action: "Add README examples for install, help, success, and failure.",
        debugPrompt: "If a clean run fails, remove local assumptions such as absolute paths or hidden config.",
        selfCheck: "A fresh user can run the documented command examples.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a command-line tool with parsed inputs, predictable output, failure behavior, exit-code discipline, and clean run instructions."
  ),
  familyResearchOverride(
    "augmented-reality-family",
    (article) => article.category === "Augmented Reality" || /augmented reality|arcore|arkit|vuforia|opencv|ar portal/i.test(article.title),
    "Augmented-reality pack built from ARCore fundamentals, ARKit, OpenCV calibration, and Unity AR Foundation resources",
    "Research-backed AR path focused on camera pose, tracking, anchors, coordinate spaces, calibration, and device/runtime limits.",
    arResources,
    [
      {
        id: "tracking-and-pose",
        title: "Tracking and pose",
        plainEnglish: "AR keeps virtual objects aligned with the world by estimating where the camera is and how it moves over time.",
        whyItMatters: "This prevents beginners from blaming rendering code when the true problem is camera tracking, calibration, lighting, or device support.",
        signsYouUnderstand: [
          "You can explain pose as position plus orientation.",
          "You can name what an anchor is meant to stabilize.",
          "You can describe one tracking failure scenario."
        ]
      },
      {
        id: "coordinate-spaces",
        title: "Coordinate spaces",
        plainEnglish: "AR code moves between camera space, world space, screen space, and object space while trying to keep them consistent.",
        whyItMatters: "Most AR bugs are easier once the learner can say which space a value belongs to.",
        signsYouUnderstand: [
          "You can draw camera, world, and object coordinates.",
          "You can explain why a model appears behind or offset from the target.",
          "You can test placement with one simple marker/object first."
        ],
        resourceIndexes: [0, 2, 3]
      }
    ],
    [
      {
        title: "Prove the camera/session setup",
        sourceSectionTitle: "Runtime setup",
        learnRightHere: "Learn device support, permissions, camera session startup, and emulator/simulator limits before placing objects.",
        action: "Start the AR session or OpenCV camera path and show a visible camera/tracking proof.",
        debugPrompt: "If nothing renders, check device support and permissions before object code.",
        selfCheck: "The app shows a camera/session proof or a documented fallback path."
      },
      {
        title: "Place one stable object",
        sourceSectionTitle: "Anchors and placement",
        learnRightHere: "Learn anchors, hit tests, markers, or calibration as the bridge from camera input to object placement.",
        action: "Place one simple object or overlay and keep it stable enough to inspect.",
        debugPrompt: "If the object swims, log tracking state and placement coordinates.",
        selfCheck: "One object appears in an expected place with a clear placement rule.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Add one interaction or tracked update",
        sourceSectionTitle: "Interaction",
        learnRightHere: "Learn how taps, marker updates, or tracking changes alter object state.",
        action: "Move, scale, spawn, or update one object through a controlled interaction.",
        debugPrompt: "If interaction is offset, inspect screen-to-world conversion and object origin.",
        selfCheck: "One interaction changes the AR object in a repeatable way.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Document runtime limits",
        sourceSectionTitle: "Deployment limits",
        learnRightHere: "Learn what production AR adds: supported devices, lighting, tracking loss, safety, asset size, and platform-specific APIs.",
        action: "Add a README section with device/runtime requirements and one tracking limitation.",
        debugPrompt: "If it only works on your machine, write exactly which hardware and SDK versions were used.",
        selfCheck: "README explains how to run the demo and why AR behavior may vary by device.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built an AR project with camera/session proof, stable placement, one interaction, and documented tracking/device limitations."
  ),
  familyResearchOverride(
    "bittorrent-family",
    (article) => article.category === "BitTorrent Client" || /bittorrent|bencode|torrent/i.test(article.title),
    "BitTorrent pack built from BEP 3, BEP 10, networking, and binary-data resources",
    "Research-backed BitTorrent path focused on bencoding, metainfo, trackers, peers, piece hashes, and protocol boundaries.",
    bittorrentResources,
    [
      {
        id: "metainfo-and-bencode",
        title: "Bencoded metainfo",
        plainEnglish: "A torrent file is structured data encoded with bencode; the client must parse it exactly before talking to trackers or peers.",
        whyItMatters: "Beginners need strict fixtures here because a tiny parser shortcut can produce the wrong info hash or corrupt peer requests.",
        signsYouUnderstand: [
          "You can decode strings, integers, lists, and dictionaries by hand.",
          "You can explain why dictionary key order matters.",
          "You can create malformed bencode that should be rejected."
        ]
      },
      {
        id: "pieces-peers-trackers",
        title: "Pieces, peers, and trackers",
        plainEnglish: "BitTorrent downloads verified pieces from peers, often discovered through tracker metadata and controlled by protocol messages.",
        whyItMatters: "This separates file parsing, network discovery, peer messaging, and integrity checking into learnable layers.",
        signsYouUnderstand: [
          "You can name what the tracker returns.",
          "You can explain why each piece has a hash.",
          "You can distinguish metainfo parsing from peer protocol messages."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Parse bencode fixtures",
        sourceSectionTitle: "Bencode",
        learnRightHere: "Learn length prefixes, integer delimiters, lists, dictionaries, and binary-safe parsing before reading real torrents.",
        action: "Parse scalar and nested bencode fixtures with accepted and rejected cases.",
        debugPrompt: "If parsing accepts invalid input, log cursor position and expected token.",
        selfCheck: "Fixture tests prove valid nested data and invalid encodings behave correctly."
      },
      {
        title: "Read torrent metainfo",
        sourceSectionTitle: "Metainfo",
        learnRightHere: "Learn the announce URL, info dictionary, piece length, file length, and piece hashes.",
        action: "Parse one .torrent file and print the fields needed for download planning.",
        debugPrompt: "If info hash differs, verify the exact encoded info bytes instead of decoded/re-encoded data.",
        selfCheck: "The program prints announce, file info, piece count, and hash data.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Contact tracker or mock tracker",
        sourceSectionTitle: "Tracker",
        learnRightHere: "Learn tracker request parameters and peer-list response shape before peer downloads.",
        action: "Use a mock tracker or real tracker request to obtain peer-like data.",
        debugPrompt: "If tracker calls fail, inspect URL encoding for info_hash and peer_id.",
        selfCheck: "Peer data is parsed separately from torrent-file parsing.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Download or verify one piece",
        sourceSectionTitle: "Peer protocol",
        learnRightHere: "Learn peer handshake, request messages, and hash verification as the first complete download proof.",
        action: "Download, mock, or verify one piece and compare its hash to metainfo.",
        debugPrompt: "If the piece fails hash check, inspect requested index/offset/length before network retries.",
        selfCheck: "One piece passes integrity verification or the README explains a mocked boundary.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a BitTorrent learning slice with strict bencode parsing, metainfo extraction, tracker/peer boundaries, and piece verification."
  ),
  familyResearchOverride(
    "text-editor-family",
    (article) => article.category === "Text Editor" || /text editor|hecto|kilo|editor/i.test(article.title),
    "Text-editor pack built from Kilo, Emacs buffer/cursor material, and language fundamentals",
    "Research-backed editor path focused on buffers, cursor movement, rendering, input modes, file I/O, and editing invariants.",
    textEditorResources,
    [
      {
        id: "buffer-model",
        title: "Buffer model",
        plainEnglish: "A text editor stores editable text in a buffer that changes through insert, delete, move, load, and save operations.",
        whyItMatters: "This keeps beginners from tying every edit directly to screen drawing, which makes cursor and save bugs much harder.",
        signsYouUnderstand: [
          "You can inspect buffer contents without rendering.",
          "You can explain line and column positions.",
          "You can test insert/delete on a tiny buffer."
        ]
      },
      {
        id: "cursor-render-separation",
        title: "Cursor versus rendering",
        plainEnglish: "The cursor says where edits happen; rendering decides which part of the buffer is visible on screen.",
        whyItMatters: "This explains scrolling, off-by-one movement bugs, and why the display should be treated as a view of editor state.",
        signsYouUnderstand: [
          "You can move the cursor without changing text.",
          "You can render the same buffer from two scroll positions.",
          "You can identify whether a bug belongs to state or drawing."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Represent text and cursor state",
        sourceSectionTitle: "Editor state",
        learnRightHere: "Learn the buffer, cursor, viewport, and dirty flag before terminal or GUI complexity.",
        action: "Create editor state and print it after one cursor movement.",
        debugPrompt: "If movement is off by one, inspect zero-based versus one-based line/column assumptions.",
        selfCheck: "Cursor movement changes position without changing text."
      },
      {
        title: "Render visible text",
        sourceSectionTitle: "Drawing",
        learnRightHere: "Learn rendering as a view of buffer state, not the source of truth.",
        action: "Draw or print the visible buffer with cursor position indicated.",
        debugPrompt: "If text disappears, inspect viewport and buffer separately.",
        selfCheck: "A known buffer renders in the expected visible area.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Edit and preserve invariants",
        sourceSectionTitle: "Editing",
        learnRightHere: "Learn insert/delete rules and how cursor position changes after each edit.",
        action: "Add character insertion and deletion with tiny fixtures.",
        debugPrompt: "If delete crosses lines incorrectly, test the smallest two-line buffer.",
        selfCheck: "Fixtures prove insert, delete, newline, and boundary movement.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Load, save, and document scope",
        sourceSectionTitle: "File I/O",
        learnRightHere: "Learn file loading/saving, encoding assumptions, and what editor features are out of scope.",
        action: "Open one file, edit it, save it, and document missing search, syntax highlighting, undo, or multi-buffer support.",
        debugPrompt: "If save corrupts content, compare buffer text before write and file text after read.",
        selfCheck: "A file round trip works and README explains editor limitations.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a text editor with buffer/cursor state, rendering, editing operations, file I/O, and documented editor-feature limits."
  ),
  familyResearchOverride(
    "network-stack-family",
    (article) => article.category === "Network Stack" || /network stack|tcp|ip|vpn|virtual switch|network programming|zerotier/i.test(article.title),
    "Network-stack pack built from Kurose/Ross, Beej, Cloudflare OSI, and IP RFC resources",
    "Research-backed networking path focused on packets, layers, headers, sockets, routing boundaries, and packet-level proof.",
    networkStackResources,
    [
      {
        id: "layers-and-packets",
        title: "Layers wrap packets",
        plainEnglish: "Network stacks become learnable when each layer has a packet shape, responsibility, and contract with the layer above and below it.",
        whyItMatters: "This keeps beginners from treating TCP/IP, VPNs, and virtual switches as one giant networking blob.",
        signsYouUnderstand: [
          "You can name what one header contains.",
          "You can explain which layer owns addressing versus reliability.",
          "You can inspect a packet before and after one layer changes it."
        ]
      },
      {
        id: "socket-versus-stack",
        title: "Sockets are not the whole stack",
        plainEnglish: "Socket APIs expose useful network behavior, but stack projects often re-create or inspect lower-level packet parsing, routing, or transport decisions.",
        whyItMatters: "This helps the learner know when the tutorial is using the OS network stack and when it is rebuilding a piece of it.",
        signsYouUnderstand: [
          "You can say whether your code sees bytes, datagrams, packets, or frames.",
          "You can describe one OS feature your project relies on.",
          "You can create a fixture for one packet/header."
        ],
        resourceIndexes: [0, 1, 3]
      }
    ],
    [
      {
        title: "Inspect one packet or message",
        sourceSectionTitle: "Packet shape",
        learnRightHere: "Learn the exact header fields before sending or forwarding anything.",
        action: "Parse or print one packet/message fixture with named fields.",
        debugPrompt: "If fields are wrong, inspect byte order and offsets before protocol logic.",
        selfCheck: "A fixture decodes into expected fields with no network required."
      },
      {
        title: "Implement one layer behavior",
        sourceSectionTitle: "Layer behavior",
        learnRightHere: "Learn one responsibility such as routing, encapsulation, checksum, handshake, or forwarding.",
        action: "Transform or route one packet/message according to a tiny rule.",
        debugPrompt: "If later layers fail, compare input and output packet snapshots.",
        selfCheck: "One layer changes or forwards data exactly as documented.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Connect to real or simulated I/O",
        sourceSectionTitle: "Integration",
        learnRightHere: "Learn what the runtime provides: raw sockets, tun/tap, UDP/TCP sockets, or test harnesses.",
        action: "Send one controlled packet/message through the tutorial's I/O path or a deterministic simulator.",
        debugPrompt: "If packets vanish, log both boundaries: what your code emitted and what the runtime received.",
        selfCheck: "A controlled input crosses the I/O boundary and returns an observable result.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Document protocol limits",
        sourceSectionTitle: "Reliability and scope",
        learnRightHere: "Learn what production networking adds: retransmission, congestion, security, routing scale, NAT, and observability.",
        action: "Add a README table naming supported packets/layers and missing production guarantees.",
        debugPrompt: "If the demo seems complete, compare it to the relevant RFC or networking text.",
        selfCheck: "README explains the stack slice, packet proof, and what remains educational-only.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a network-stack slice with packet/header parsing, one layer behavior, controlled I/O, and documented protocol limits."
  ),
  familyResearchOverride(
    "physics-engine-family",
    (article) => article.category === "Physics Engine" || /physics|collision|broad phase|spatial partition/i.test(article.title),
    "Physics-engine pack built from Nature of Code, Gaffer, Khan Academy, and MDN collision resources",
    "Research-backed physics path focused on timesteps, integration, forces, collision detection, broad phase, and debug visualization.",
    physicsResources,
    [
      {
        id: "simulation-loop",
        title: "Simulation loop",
        plainEnglish: "A physics engine repeatedly advances world state by small time steps using rules for velocity, forces, constraints, or collisions.",
        whyItMatters: "Beginners need a stable loop before adding objects, because frame-rate-dependent physics creates confusing bugs.",
        signsYouUnderstand: [
          "You can explain timestep choice.",
          "You can update position from velocity in one small example.",
          "You can pause and inspect state between steps."
        ]
      },
      {
        id: "collision-pipeline",
        title: "Collision pipeline",
        plainEnglish: "Collision handling usually asks broad questions first, then narrow shape questions, then decides how objects respond.",
        whyItMatters: "This separates performance, geometry, and response bugs so the learner can debug each one.",
        signsYouUnderstand: [
          "You can name broad phase and narrow phase.",
          "You can draw two shapes and their overlap test.",
          "You can visualize collision bounds."
        ],
        resourceIndexes: [1, 2, 3]
      }
    ],
    [
      {
        title: "Update one moving body",
        sourceSectionTitle: "Simulation",
        learnRightHere: "Learn timestep, position, velocity, and acceleration before collisions.",
        action: "Move one object under a fixed rule and print or draw its state over time.",
        debugPrompt: "If movement differs by machine speed, inspect timestep handling.",
        selfCheck: "The object moves predictably for the same timestep sequence."
      },
      {
        title: "Add one force or gravity",
        sourceSectionTitle: "Forces",
        learnRightHere: "Learn forces as changes to acceleration or velocity, not direct teleporting.",
        action: "Apply gravity or one force and compare expected motion with actual motion.",
        debugPrompt: "If motion explodes, check units, timestep size, and whether acceleration is reset.",
        selfCheck: "A simple force changes motion in a visible and explainable way.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Detect collision",
        sourceSectionTitle: "Collision detection",
        learnRightHere: "Learn simple shape tests and debug drawing before response.",
        action: "Detect overlap between two shapes and show the collision state visibly.",
        debugPrompt: "If collision feels wrong, draw hitboxes and print coordinates.",
        selfCheck: "Known colliding and non-colliding fixtures pass.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Respond and document limits",
        sourceSectionTitle: "Collision response",
        learnRightHere: "Learn the difference between detecting contact and deciding what happens after contact.",
        action: "Add one response such as stop, bounce, or separate, then list missing constraints, rotations, and stability issues.",
        debugPrompt: "If objects stick or jitter, log penetration depth and response direction.",
        selfCheck: "README explains loop, collision method, and physics limitations.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a physics-engine slice with a stable simulation loop, force update, collision detection/response, and debug-friendly limits."
  ),
  familyResearchOverride(
    "memory-allocator-family",
    (article) => article.category === "Memory Allocator" || /allocator|malloc|memory allocation|free.?space/i.test(article.title),
    "Memory-allocator pack built from OSTEP, Beej C, GNU libc, and CS:APP malloc-lab resources",
    "Research-backed allocator path focused on heap layout, allocation metadata, free lists, splitting/coalescing, and fragmentation proof.",
    allocatorResources,
    [
      {
        id: "heap-blocks",
        title: "Heap blocks and metadata",
        plainEnglish: "An allocator manages a region of memory by dividing it into blocks and tracking which blocks are used or free.",
        whyItMatters: "Beginners need this picture before pointer arithmetic and free-list bugs start to look random.",
        signsYouUnderstand: [
          "You can draw allocated and free blocks.",
          "You can explain what metadata stores.",
          "You can describe what free must be able to find."
        ]
      },
      {
        id: "fragmentation",
        title: "Fragmentation and reuse",
        plainEnglish: "Allocator quality depends on how well it reuses freed space while avoiding tiny unusable gaps.",
        whyItMatters: "This turns malloc from a mysterious system call into a set of tradeoffs the learner can measure.",
        signsYouUnderstand: [
          "You can split a larger free block.",
          "You can coalesce neighboring free blocks.",
          "You can create a small fragmentation example."
        ],
        resourceIndexes: [0, 2, 3]
      }
    ],
    [
      {
        title: "Represent heap blocks",
        sourceSectionTitle: "Heap model",
        learnRightHere: "Learn block headers, sizes, alignment, and used/free state before returning pointers.",
        action: "Create a fake or real heap area and print its block layout.",
        debugPrompt: "If sizes look wrong, inspect alignment and header size separately.",
        selfCheck: "Initial heap layout is visible and explainable."
      },
      {
        title: "Allocate and split",
        sourceSectionTitle: "Allocation",
        learnRightHere: "Learn first-fit or another placement strategy as a rule over free blocks.",
        action: "Allocate one block and split remaining space if possible.",
        debugPrompt: "If returned addresses overlap, print every block boundary.",
        selfCheck: "Two allocations occupy distinct, correctly sized regions.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Free and coalesce",
        sourceSectionTitle: "Freeing",
        learnRightHere: "Learn why free must recover metadata and merge neighboring free space safely.",
        action: "Free a block and coalesce adjacent free blocks in a fixture.",
        debugPrompt: "If reuse fails, inspect free-list links or neighboring metadata.",
        selfCheck: "A freed block can be reused and adjacent free blocks merge correctly.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Measure and document limits",
        sourceSectionTitle: "Allocator quality",
        learnRightHere: "Learn fragmentation, invalid frees, thread safety, and system allocation boundaries.",
        action: "Add a small trace test plus README notes on alignment, coalescing, and unsupported safety checks.",
        debugPrompt: "If a trace corrupts the heap, stop at the first operation where layout diverges.",
        selfCheck: "A trace test proves allocation/free behavior and README names production gaps.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a memory allocator with heap-block metadata, allocation/free behavior, coalescing, trace tests, and fragmentation notes."
  ),
  familyResearchOverride(
    "processor-family",
    (article) => article.category === "Processor" || /risc-v|processor|cpu|blinker|logic gate/i.test(article.title),
    "Processor pack built from nand2tetris, RISC-V specifications, logic-gate material, and MIT computation structures",
    "Research-backed processor path focused on digital logic, datapath, instruction decoding, registers, and small program proof.",
    processorResources,
    [
      {
        id: "datapath-control",
        title: "Datapath and control",
        plainEnglish: "A processor moves values through registers, ALU, memory, and control logic according to an instruction.",
        whyItMatters: "This gives beginners a map for CPU tutorials before Verilog or assembly syntax becomes overwhelming.",
        signsYouUnderstand: [
          "You can trace one instruction through the datapath.",
          "You can explain which fields control the ALU.",
          "You can name the register or memory value that changes."
        ]
      },
      {
        id: "instruction-contract",
        title: "Instruction set contract",
        plainEnglish: "The instruction set tells software what operations the hardware promises to understand.",
        whyItMatters: "This connects hardware design, assembly examples, tests, and eventual software proof.",
        signsYouUnderstand: [
          "You can decode one instruction by hand.",
          "You can state what the instruction should do.",
          "You can create a tiny program that proves a subset works."
        ],
        resourceIndexes: [0, 1, 3]
      }
    ],
    [
      {
        title: "Build one combinational proof",
        sourceSectionTitle: "Logic",
        learnRightHere: "Learn gates, truth tables, and simple ALU behavior before sequential CPU state.",
        action: "Implement or simulate one logic/ALU unit and test expected outputs.",
        debugPrompt: "If outputs are wrong, compare the truth table to implementation signal by signal.",
        selfCheck: "A basic logic or ALU unit passes deterministic tests."
      },
      {
        title: "Decode one instruction",
        sourceSectionTitle: "Instruction format",
        learnRightHere: "Learn instruction fields as the bridge between bits and behavior.",
        action: "Decode one instruction into opcode/register/immediate fields.",
        debugPrompt: "If fields are nonsense, inspect bit ranges and endianness assumptions.",
        selfCheck: "A sample instruction decodes into expected fields.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Execute a tiny program",
        sourceSectionTitle: "Datapath integration",
        learnRightHere: "Learn fetch/decode/execute and register updates as a loop.",
        action: "Run a tiny instruction sequence and inspect register state after each step.",
        debugPrompt: "If state diverges, stop at the first instruction with a wrong before/after snapshot.",
        selfCheck: "A tiny program produces expected register or output state.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Document ISA and hardware limits",
        sourceSectionTitle: "Scope",
        learnRightHere: "Learn what is omitted: pipeline hazards, interrupts, memory hierarchy, toolchain, peripherals, and timing.",
        action: "Add a README table of supported instructions, test programs, and missing hardware features.",
        debugPrompt: "If a program fails, decide whether the ISA, decoder, control, or ALU owns the failure.",
        selfCheck: "README connects supported instructions to proof programs and limitations.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a processor/CPU slice with logic proof, instruction decoding, fetch-decode-execute behavior, and ISA-scope documentation."
  ),
  familyResearchOverride(
    "template-engine-family",
    (article) => article.category === "Template Engine" || /template|micro-templating/i.test(article.title),
    "Template-engine pack built from MDN template literals, Django templates, OWASP XSS, and HTML entity resources",
    "Research-backed template path focused on placeholders, data binding, escaping, control flow, rendering, and unsafe-output boundaries.",
    templateResources,
    [
      {
        id: "data-to-text",
        title: "Data becomes output text",
        plainEnglish: "A template engine combines fixed text with data values, loops, conditionals, or partials to produce final text such as HTML.",
        whyItMatters: "This keeps beginners from building ad hoc string concatenation that cannot handle real page data safely.",
        signsYouUnderstand: [
          "You can mark literal text versus placeholders.",
          "You can render two data objects with one template.",
          "You can explain where output is generated."
        ]
      },
      {
        id: "escaping-boundary",
        title: "Escaping boundary",
        plainEnglish: "Template engines must decide when user data is treated as text and when it is allowed to become markup or code.",
        whyItMatters: "This is the security concept that turns a toy renderer into a responsible learning project.",
        signsYouUnderstand: [
          "You can show a value that needs escaping.",
          "You can explain XSS at beginner level.",
          "You can decide whether raw HTML is supported or blocked."
        ],
        resourceIndexes: [1, 2, 3]
      }
    ],
    [
      {
        title: "Replace one placeholder",
        sourceSectionTitle: "Placeholders",
        learnRightHere: "Learn token or delimiter recognition before loops or conditionals.",
        action: "Render one template with one variable and one missing variable case.",
        debugPrompt: "If replacement is wrong, print the parsed tokens before rendering.",
        selfCheck: "A fixture proves placeholder replacement and missing-data behavior."
      },
      {
        title: "Parse template structure",
        sourceSectionTitle: "Template syntax",
        learnRightHere: "Learn whether the tutorial uses regex, tokenization, AST nodes, or direct scanning.",
        action: "Represent variables plus one block feature such as loop, conditional, or partial.",
        debugPrompt: "If nesting breaks, reduce to one block with one variable.",
        selfCheck: "A parsed structure shows static text and dynamic parts separately.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Escape output deliberately",
        sourceSectionTitle: "Safety",
        learnRightHere: "Learn HTML/text escaping at the exact point data enters output.",
        action: "Escape one unsafe value by default or document why the tutorial output is not HTML-safe.",
        debugPrompt: "If escaping double-escapes, track raw data versus rendered output.",
        selfCheck: "An unsafe input renders safely or the README states the unsafe boundary.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Document template limits",
        sourceSectionTitle: "Engine scope",
        learnRightHere: "Learn what real engines add: inheritance, filters, streaming, whitespace control, caching, and sandboxing.",
        action: "Add examples and limitations for supported syntax.",
        debugPrompt: "If syntax grows messy, write a grammar-like list before coding more features.",
        selfCheck: "README explains supported template syntax and safety choices.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a template engine with placeholder parsing, rendering, escaping decisions, examples, and documented syntax/safety limits."
  ),
  familyResearchOverride(
    "voxel-engine-family",
    (article) => article.category === "Voxel Engine" || /voxel|minecraft/i.test(article.title),
    "Voxel-engine pack built from 0fps meshing, LearnOpenGL, and Scratchapixel rendering resources",
    "Research-backed voxel path focused on chunks, block data, mesh generation, camera/rendering, culling, and performance proof.",
    voxelResources,
    [
      {
        id: "chunks-and-blocks",
        title: "Blocks grouped into chunks",
        plainEnglish: "Voxel worlds store many simple blocks, usually grouped into chunks so loading, editing, and rendering stay manageable.",
        whyItMatters: "This is the beginner bridge from drawing cubes to building a world that can scale beyond a tiny demo.",
        signsYouUnderstand: [
          "You can map world coordinates to chunk/local coordinates.",
          "You can explain why not every block face should render.",
          "You can update one block and know which mesh changes."
        ]
      },
      {
        id: "meshing-before-polish",
        title: "Meshing before polish",
        plainEnglish: "The engine turns block data into renderable geometry, ideally skipping hidden faces before adding lighting or terrain features.",
        whyItMatters: "This prevents beginners from building a pretty but slow renderer they cannot reason about.",
        signsYouUnderstand: [
          "You can count faces in a tiny block arrangement.",
          "You can explain face culling.",
          "You can compare naive and culled mesh output."
        ],
        resourceIndexes: [0, 1, 3]
      }
    ],
    [
      {
        title: "Store one chunk",
        sourceSectionTitle: "World data",
        learnRightHere: "Learn block IDs, chunk dimensions, and coordinate conversion before rendering.",
        action: "Create one chunk and set/get a few block values.",
        debugPrompt: "If blocks appear in the wrong place, inspect world-to-chunk coordinate math.",
        selfCheck: "Block fixtures prove set/get and coordinate conversion."
      },
      {
        title: "Generate visible faces",
        sourceSectionTitle: "Meshing",
        learnRightHere: "Learn how block data becomes vertices/faces and why hidden faces can be skipped.",
        action: "Generate a simple mesh for one chunk and count visible faces.",
        debugPrompt: "If mesh output is huge, compare all faces versus exposed faces.",
        selfCheck: "A tiny block arrangement produces the expected face count.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Render and move camera",
        sourceSectionTitle: "Rendering",
        learnRightHere: "Learn camera, projection, and draw loop as a separate layer from chunk data.",
        action: "Render one chunk and move the camera around it.",
        debugPrompt: "If nothing appears, inspect camera position, projection, and mesh vertex scale.",
        selfCheck: "A visible chunk renders and remains inspectable from different camera positions.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Document engine limits",
        sourceSectionTitle: "Performance and scope",
        learnRightHere: "Learn missing production pieces: chunk streaming, lighting, physics, persistence, greedy meshing, and assets.",
        action: "Add a README performance note and one before/after metric such as face count or frame time.",
        debugPrompt: "If frame rate tanks, reduce world size and inspect mesh complexity first.",
        selfCheck: "README explains chunk model, mesh strategy, and next performance steps.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a voxel-engine slice with chunk storage, mesh generation, camera rendering, and documented performance/scope limits."
  ),
  familyResearchOverride(
    "javascript-internals-family",
    (article) => /promise|call\(\)|apply\(\)|bind\(\)|javascript promises|javascript internals/i.test(article.title),
    "JavaScript-internals pack built from MDN Promise/function/this docs and JavaScript.info promise material",
    "Research-backed JavaScript internals path focused on async state, callbacks, this binding, function invocation, and spec-like edge tests.",
    javascriptInternalsResources,
    [
      {
        id: "spec-contract",
        title: "APIs have behavioral contracts",
        plainEnglish: "Rebuilding Promise, call, apply, or bind means matching observable behavior, not just making one example pass.",
        whyItMatters: "Beginners learn more when they write examples for pending/fulfilled/rejected state or this-binding edge cases before implementation.",
        signsYouUnderstand: [
          "You can list the API inputs and outputs.",
          "You can write one edge case before coding.",
          "You can explain which behavior is deliberately unsupported."
        ]
      },
      {
        id: "async-and-this",
        title: "Hidden runtime context",
        plainEnglish: "Promises manage async state over time, while call/apply/bind control what `this` means during function execution.",
        whyItMatters: "This separates two common beginner confusions: time/settlement and invocation context.",
        signsYouUnderstand: [
          "You can explain settled versus pending promise state.",
          "You can predict `this` for one call/bind example.",
          "You can test callback timing or invocation context."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Write behavior examples first",
        sourceSectionTitle: "API contract",
        learnRightHere: "Learn the method's observable behavior with tiny examples before copying an implementation.",
        action: "Create examples for success, failure, missing input, and one edge case.",
        debugPrompt: "If implementation debate starts early, return to what the API should visibly do.",
        selfCheck: "Examples describe expected behavior without relying on the final implementation."
      },
      {
        title: "Model internal state",
        sourceSectionTitle: "State model",
        learnRightHere: "Learn pending/fulfilled/rejected state or bound function context as data.",
        action: "Create a tiny state object or wrapper function and inspect it after one operation.",
        debugPrompt: "If behavior changes unexpectedly, log state/context before and after the call.",
        selfCheck: "One internal state transition or context binding is visible.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Match common behavior",
        sourceSectionTitle: "Implementation",
        learnRightHere: "Learn callback queues, chaining, argument forwarding, or this binding at the exact feature step.",
        action: "Implement the smallest behavior needed for the tutorial examples and one extra edge test.",
        debugPrompt: "If a test fails, classify it as state, timing, argument, or context.",
        selfCheck: "The rebuilt API passes happy path and one edge case.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Document spec gaps",
        sourceSectionTitle: "Limitations",
        learnRightHere: "Learn that real JavaScript behavior includes many spec details, microtasks, strict mode, inheritance, or thenable behavior.",
        action: "Write supported and unsupported behaviors in the README.",
        debugPrompt: "If behavior differs from native JS, record whether that difference is intentional.",
        selfCheck: "README makes the educational subset honest.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a JavaScript internals project with behavior examples, internal state/context modeling, edge tests, and explicit spec limitations."
  ),
  familyResearchOverride(
    "data-structures-family",
    (article) => /hash table|algorithms and data structures|data structures/i.test(article.title),
    "Data-structures pack built from Berkeley CS61B, Open Data Structures, CMU algorithms, and language docs",
    "Research-backed data-structures path focused on invariants, operations, complexity, tests, and implementation tradeoffs.",
    dataStructureResources,
    [
      {
        id: "invariants",
        title: "Data structures have invariants",
        plainEnglish: "A data structure is useful because it promises certain relationships stay true after every operation.",
        whyItMatters: "This gives beginners a way to debug hash tables, trees, heaps, lists, or algorithm collections without guessing.",
        signsYouUnderstand: [
          "You can state one invariant.",
          "You can test the invariant after insert/delete/update.",
          "You can explain one operation's time cost."
        ]
      },
      {
        id: "operations-and-complexity",
        title: "Operations and complexity",
        plainEnglish: "Each structure is defined by operations such as insert, find, delete, resize, or traverse, with tradeoffs in time and memory.",
        whyItMatters: "This turns the project into a learning artifact instead of a pile of solved coding exercises.",
        signsYouUnderstand: [
          "You can list supported operations.",
          "You can explain average versus worst case for one operation.",
          "You can build a small stress test."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Define operations and invariants",
        sourceSectionTitle: "Model",
        learnRightHere: "Learn what the structure must always guarantee before implementation details.",
        action: "Write operation signatures and one invariant in comments or README.",
        debugPrompt: "If a bug appears, ask which invariant broke first.",
        selfCheck: "The README names operations and at least one invariant."
      },
      {
        title: "Implement the smallest operation set",
        sourceSectionTitle: "Core operations",
        learnRightHere: "Learn one operation at a time with fixture examples.",
        action: "Implement insert and lookup or the tutorial's smallest equivalent pair.",
        debugPrompt: "If lookup fails, print internal state after every operation.",
        selfCheck: "Tiny fixtures prove the core operations.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Handle growth and edge cases",
        sourceSectionTitle: "Scaling",
        learnRightHere: "Learn resize, collisions, deletion, traversal, or boundary cases as explicit proof tasks.",
        action: "Add one edge-case fixture and one growth fixture.",
        debugPrompt: "If growth corrupts data, compare state before and after the growth operation.",
        selfCheck: "Existing values survive the growth or edge operation.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Measure and explain tradeoffs",
        sourceSectionTitle: "Complexity",
        learnRightHere: "Learn why the structure is chosen, not only how to code it.",
        action: "Add a small benchmark or operation-count note plus README tradeoffs.",
        debugPrompt: "If results are surprising, compare input size and operation count instead of wall time only.",
        selfCheck: "README explains complexity, memory tradeoffs, and known limitations.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a data-structure project around explicit invariants, operation tests, growth/edge cases, and complexity tradeoffs."
  ),
  familyResearchOverride(
    "package-build-tooling-family",
    (article) => /module bundler|package manager|build system|minipack|npm|yarn/i.test(article.title),
    "Build/package tooling pack built from Node modules, npm package metadata, esbuild concepts, and GNU Make",
    "Research-backed tooling path focused on dependency graphs, module resolution, transforms, caches, build artifacts, and reproducibility.",
    packageToolingResources,
    [
      {
        id: "dependency-graph",
        title: "Dependency graph",
        plainEnglish: "Bundlers, package managers, and build systems reason about files or packages as nodes connected by dependency edges.",
        whyItMatters: "This gives beginners the mental model for resolving imports, ordering work, and deciding what must rebuild.",
        signsYouUnderstand: [
          "You can draw a small dependency graph.",
          "You can explain entry point versus dependency.",
          "You can detect a missing or circular dependency case."
        ]
      },
      {
        id: "reproducible-artifacts",
        title: "Reproducible artifacts",
        plainEnglish: "A build tool should turn the same inputs into predictable outputs while documenting caches, lockfiles, transforms, or generated files.",
        whyItMatters: "This separates a neat script from tooling another developer can trust.",
        signsYouUnderstand: [
          "You can delete output and rebuild it.",
          "You can explain where package metadata comes from.",
          "You can list one cache invalidation risk."
        ],
        resourceIndexes: [1, 2, 3]
      }
    ],
    [
      {
        title: "Discover inputs",
        sourceSectionTitle: "Input graph",
        learnRightHere: "Learn entry files, package metadata, or build targets before transformation.",
        action: "Read one entry point or package file and list discovered dependencies.",
        debugPrompt: "If dependencies are missing, print the raw import/path/package field.",
        selfCheck: "A tiny fixture produces the expected dependency list."
      },
      {
        title: "Resolve and order work",
        sourceSectionTitle: "Resolution",
        learnRightHere: "Learn path/package resolution and topological or recursive processing.",
        action: "Resolve dependencies into absolute or package identities and process them in a stable order.",
        debugPrompt: "If ordering is wrong, draw the graph and mark visited nodes.",
        selfCheck: "Nested dependencies are discovered without duplicate uncontrolled work.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Generate one artifact",
        sourceSectionTitle: "Output",
        learnRightHere: "Learn transformation or install output as a deterministic artifact.",
        action: "Write one bundle, lock-like output, generated file, or build result from the graph.",
        debugPrompt: "If output is stale, delete generated files and rebuild from clean input.",
        selfCheck: "Clean input regenerates the same useful output.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Document invalidation and limits",
        sourceSectionTitle: "Tool reliability",
        learnRightHere: "Learn what production tooling adds: incremental builds, version solving, source maps, plugins, platforms, and security checks.",
        action: "Add README examples plus a limitations table for caching, resolution, and compatibility.",
        debugPrompt: "If a fixture fails only after prior runs, inspect cache or output cleanup.",
        selfCheck: "README explains graph model, generated artifacts, and missing production features.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a bundler/package/build-tool slice with dependency graph discovery, resolution, artifact generation, and reproducibility notes."
  ),
  familyResearchOverride(
    "web-security-extension-family",
    (article) => /same-origin|adblock|webextension|browser extension|content script/i.test(article.title),
    "Web-security/browser-extension pack built from MDN same-origin, MDN WebExtensions, OWASP authorization, and cookie resources",
    "Research-backed web-security path focused on browser trust boundaries, extension permissions, request filtering, storage/cookies, and safe threat-model notes.",
    webSecurityResources,
    [
      {
        id: "browser-boundaries",
        title: "Browser trust boundaries",
        plainEnglish: "Browser security projects are about which origin, script, extension, or network request is allowed to access which data.",
        whyItMatters: "Beginners need this boundary map before building ad blockers, same-origin examples, SSO flows, or request filters.",
        signsYouUnderstand: [
          "You can explain origin as scheme, host, and port.",
          "You can name which context has permission.",
          "You can describe one blocked access as a safety feature."
        ]
      },
      {
        id: "permissions-and-policy",
        title: "Permissions and policy",
        plainEnglish: "Security behavior is usually a policy decision enforced by the browser, server, or extension manifest.",
        whyItMatters: "This teaches learners to test allowed and denied cases instead of only proving the happy path.",
        signsYouUnderstand: [
          "You can list one permission the project requests.",
          "You can create an allowed and denied example.",
          "You can explain why broad permissions are risky."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Map the boundary",
        sourceSectionTitle: "Threat model",
        learnRightHere: "Learn origin, permission, cookie, or extension context before coding behavior.",
        action: "Write a tiny boundary table: who is asking, what they want, and why it is allowed or blocked.",
        debugPrompt: "If the browser blocks access, read the exact error as a policy signal.",
        selfCheck: "README contains one allowed case and one denied case."
      },
      {
        title: "Implement one controlled rule",
        sourceSectionTitle: "Policy rule",
        learnRightHere: "Learn one policy rule before adding lists, UI, or automation.",
        action: "Block, allow, rewrite, or demonstrate one request/access according to a tiny rule.",
        debugPrompt: "If the rule does not fire, inspect URL/origin matching and permission configuration.",
        selfCheck: "One controlled example proves the rule works.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Add observable diagnostics",
        sourceSectionTitle: "Debugging",
        learnRightHere: "Learn logging and browser/devtools inspection without exposing sensitive data.",
        action: "Log sanitized decisions and show why a request/action was allowed or blocked.",
        debugPrompt: "If logs leak secrets, redact tokens, cookies, and private URLs.",
        selfCheck: "A failed/blocked case produces a useful safe diagnostic.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Document security limits",
        sourceSectionTitle: "Security scope",
        learnRightHere: "Learn what the project does not protect against: bypasses, malicious extensions, CSP, sandboxing, auth flows, or browser differences.",
        action: "Add a README threat-model section with supported and unsupported guarantees.",
        debugPrompt: "If a claim sounds absolute, weaken it to the exact scenario tested.",
        selfCheck: "README separates educational behavior from real security guarantees.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a browser-security or extension project with explicit trust boundaries, one enforced rule, diagnostics, and honest threat-model limits."
  ),
  familyResearchOverride(
    "web-app-service-family",
    (article) => /url short|sso|mvc|php|web application|restful web api|link checker|ride hailing|real-world node cli|web app/i.test(article.title),
    "Web-app/service pack built from MDN client-server/HTTP docs, OWASP authentication, and MVC architecture resources",
    "Research-backed web-application path focused on request flow, routing/controllers, persistence boundaries, authentication risk, and deployable proof.",
    webAppResources,
    [
      {
        id: "request-to-behavior",
        title: "Request to behavior",
        plainEnglish: "A web application receives an HTTP request, routes it to behavior, optionally uses data storage or external services, and returns a response.",
        whyItMatters: "This is the beginner map for MVC, SSO, URL shorteners, REST APIs, link checkers, PHP apps, and service tutorials.",
        signsYouUnderstand: [
          "You can trace one request from URL to response.",
          "You can name controller/handler responsibility.",
          "You can explain where data is validated."
        ]
      },
      {
        id: "state-and-auth-boundary",
        title: "State and authentication boundary",
        plainEnglish: "Many app tutorials become risky or confusing when sessions, logins, redirects, tokens, database state, or external calls are added too early.",
        whyItMatters: "This forces beginners to prove core app behavior before adding security-sensitive or production-like pieces.",
        signsYouUnderstand: [
          "You can say what data must persist.",
          "You can describe one auth/session value without exposing it.",
          "You can test a failed request deliberately."
        ],
        resourceIndexes: [0, 2, 3]
      }
    ],
    [
      {
        title: "Trace one request path",
        sourceSectionTitle: "Request flow",
        learnRightHere: "Learn route, handler/controller, input, output, and status code before persistence or auth.",
        action: "Implement or trace one route from request to response and log the stages.",
        debugPrompt: "If the response is wrong, locate whether route matching, validation, behavior, or rendering failed.",
        selfCheck: "One request path is diagrammed and works locally."
      },
      {
        title: "Add one data operation",
        sourceSectionTitle: "State",
        learnRightHere: "Learn where app state lives: memory, file, database, external API, or session.",
        action: "Create, read, or update one piece of data with validation.",
        debugPrompt: "If data disappears, separate request handling from storage behavior.",
        selfCheck: "A repeatable request proves one data operation.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Handle one failure path",
        sourceSectionTitle: "Errors and auth",
        learnRightHere: "Learn errors, redirects, status codes, or denied auth as first-class behavior.",
        action: "Add one invalid input, missing resource, or unauthorized case with clear response.",
        debugPrompt: "If every failure looks identical, include status code and safe explanation.",
        selfCheck: "Happy path and failure path are both tested or manually demonstrated.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Document app architecture",
        sourceSectionTitle: "Architecture",
        learnRightHere: "Learn what production apps add: CSRF, rate limits, migrations, observability, deployment, secrets, and privacy.",
        action: "Add a README request-flow diagram and limitations table.",
        debugPrompt: "If the app only works with local secrets/config, document setup and safe defaults.",
        selfCheck: "README explains route flow, data boundary, setup, and missing production safeguards.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a web app/service slice with request routing, one state operation, failure handling, and documented architecture/security limits."
  ),
  familyResearchOverride(
    "cache-cdn-family",
    (article) => /cache|cdn|content delivery/i.test(article.title),
    "Cache/CDN pack built from Cloudflare CDN, MDN HTTP caching, NGINX caching, and Redis caching resources",
    "Research-backed cache/CDN path focused on cache keys, freshness, invalidation, origin/fetch boundaries, and hit/miss proof.",
    cacheCdnResources,
    [
      {
        id: "cache-key-freshness",
        title: "Cache keys and freshness",
        plainEnglish: "A cache decides whether a request maps to stored content and whether that stored content is still acceptable to return.",
        whyItMatters: "This is the core of local caches, HTTP caches, and CDN tutorials before distribution or scale enters the picture.",
        signsYouUnderstand: [
          "You can define the cache key.",
          "You can explain hit, miss, and stale.",
          "You can create an invalidation example."
        ]
      },
      {
        id: "origin-boundary",
        title: "Origin and edge boundary",
        plainEnglish: "A CDN or cache sits between client and origin, returning stored content when possible and forwarding when necessary.",
        whyItMatters: "Beginners need this request path before adding proxying, TTLs, regions, or cache-control behavior.",
        signsYouUnderstand: [
          "You can trace client, cache, and origin.",
          "You can explain why stale content can happen.",
          "You can log hit/miss decisions."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Cache one value",
        sourceSectionTitle: "Cache basics",
        learnRightHere: "Learn key, value, hit, miss, and storage before network behavior.",
        action: "Store and retrieve one item with visible hit/miss logs.",
        debugPrompt: "If hits never happen, inspect key construction.",
        selfCheck: "The second identical lookup is a hit."
      },
      {
        title: "Fetch from origin on miss",
        sourceSectionTitle: "Origin fetch",
        learnRightHere: "Learn the cache/origin boundary and fallback behavior.",
        action: "On miss, call a local origin function/server and store the result.",
        debugPrompt: "If origin is called every time, compare cache key and TTL state.",
        selfCheck: "Miss then hit behavior is visible in logs.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Add freshness or invalidation",
        sourceSectionTitle: "Freshness",
        learnRightHere: "Learn TTL, explicit invalidation, or cache-control at the first moment stale data appears.",
        action: "Expire or invalidate one cached value and prove it refetches.",
        debugPrompt: "If stale data persists, log stored time and invalidation path.",
        selfCheck: "A stale/invalidated item is not reused incorrectly.",
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Document scaling limits",
        sourceSectionTitle: "CDN limits",
        learnRightHere: "Learn what real caches/CDNs add: eviction, distributed consistency, headers, privacy, TLS, purging, and observability.",
        action: "Add a README table for key strategy, freshness rule, and missing production features.",
        debugPrompt: "If behavior differs by request, log the full cache decision without sensitive data.",
        selfCheck: "README explains hit/miss/freshness and what a real CDN/cache must still handle.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a cache/CDN slice with hit/miss behavior, origin fallback, freshness/invalidation, and scaling-limit documentation."
  ),
  familyResearchOverride(
    "ci-system-family",
    (article) => /continuous integration|ci system|build pipeline/i.test(article.title),
    "Continuous-integration pack built from GitHub Actions, workflow syntax, Martin Fowler, and Make automation resources",
    "Research-backed CI path focused on change detection, job execution, logs, pass/fail status, artifacts, and feedback loops.",
    ciResources,
    [
      {
        id: "change-to-feedback",
        title: "Change to feedback loop",
        plainEnglish: "A CI system watches a change, runs configured jobs, records logs/results, and reports whether the project is healthy.",
        whyItMatters: "This is the mental model before queues, workers, artifacts, or distributed runners are added.",
        signsYouUnderstand: [
          "You can name what triggers a run.",
          "You can explain job command versus job result.",
          "You can preserve logs for a failed run."
        ]
      },
      {
        id: "jobs-as-reproducible-commands",
        title: "Jobs are reproducible commands",
        plainEnglish: "A CI job should run from a clean checkout or known environment so failures mean something.",
        whyItMatters: "Beginners learn reliability by making the same command run locally and in automation.",
        signsYouUnderstand: [
          "You can run the job command manually.",
          "You can explain the working directory and environment.",
          "You can store success/failure as data."
        ],
        resourceIndexes: [0, 1, 3]
      }
    ],
    [
      {
        title: "Trigger one run",
        sourceSectionTitle: "Trigger",
        learnRightHere: "Learn what input starts the CI system: commit, webhook, manual command, or file change.",
        action: "Create one run record from a controlled trigger.",
        debugPrompt: "If no run starts, inspect trigger input before worker code.",
        selfCheck: "One trigger creates one visible run."
      },
      {
        title: "Execute one job command",
        sourceSectionTitle: "Job execution",
        learnRightHere: "Learn command execution, working directory, environment, and timeout.",
        action: "Run one configured command and capture exit status.",
        debugPrompt: "If status is wrong, run the same command manually and compare environment.",
        selfCheck: "A passing and failing command produce distinct statuses.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Capture logs and result",
        sourceSectionTitle: "Reporting",
        learnRightHere: "Learn logs as debugging artifacts, not just console noise.",
        action: "Store command output and expose a concise run summary.",
        debugPrompt: "If logs are missing, capture stdout and stderr separately.",
        selfCheck: "A failed run shows enough output to diagnose the failure.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Document runner limits",
        sourceSectionTitle: "Scaling",
        learnRightHere: "Learn what real CI adds: isolation, caches, secrets, queues, parallel jobs, artifacts, and permissions.",
        action: "Add README notes on runner model, security limits, and supported workflow shape.",
        debugPrompt: "If a run depends on local machine state, document or remove that dependency.",
        selfCheck: "README explains trigger, job, logs, and missing production CI concerns.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a CI-system slice with triggers, job execution, captured logs, statuses, and documented runner/security limits."
  ),
  familyResearchOverride(
    "mobile-desktop-app-family",
    (article) => /android|react native|desktop application|gtk|pedometer|mobile app|ride hailing/i.test(article.title),
    "Mobile/desktop app pack built from Android fundamentals, React Native, GTK, and PWA resources",
    "Research-backed app path focused on screens, state, platform lifecycle, permissions, storage, and device/runtime proof.",
    mobileDesktopResources,
    [
      {
        id: "platform-lifecycle",
        title: "Platform lifecycle",
        plainEnglish: "Mobile and desktop apps are controlled by a runtime that creates screens/windows, delivers events, pauses/resumes work, and grants permissions.",
        whyItMatters: "This helps beginners understand why app code is not just a script with a main function.",
        signsYouUnderstand: [
          "You can name the first screen/window.",
          "You can explain one lifecycle event.",
          "You can identify one permission or platform capability."
        ]
      },
      {
        id: "state-and-ui",
        title: "State, UI, and device boundary",
        plainEnglish: "App tutorials combine user interface state with platform features such as sensors, camera, network, notifications, or storage.",
        whyItMatters: "This separates UI bugs from device/runtime integration bugs.",
        signsYouUnderstand: [
          "You can show app state without the device feature.",
          "You can mock or log one platform input.",
          "You can describe what happens when permission is denied."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Render the first screen/window",
        sourceSectionTitle: "App shell",
        learnRightHere: "Learn project setup, platform runtime, and first visible UI before business logic.",
        action: "Show one screen/window with static content and run it from a clean command.",
        debugPrompt: "If it does not launch, inspect SDK/runtime setup before feature code.",
        selfCheck: "The app opens to a visible first screen or window."
      },
      {
        title: "Add one stateful interaction",
        sourceSectionTitle: "UI state",
        learnRightHere: "Learn how user actions change app state.",
        action: "Add one button, form, sensor-read display, or navigation action.",
        debugPrompt: "If UI does not update, log state before and after the interaction.",
        selfCheck: "One interaction changes visible state predictably.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Integrate one platform feature",
        sourceSectionTitle: "Platform feature",
        learnRightHere: "Learn permissions, lifecycle, and platform APIs at the exact moment you use them.",
        action: "Add one device/runtime feature such as network call, sensor, storage, or native UI behavior.",
        debugPrompt: "If the feature fails, check permission, emulator/device support, and platform logs.",
        selfCheck: "The feature works or fails with a clear handled path.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Document runtime setup",
        sourceSectionTitle: "Run and deploy",
        learnRightHere: "Learn why app projects need exact SDK/runtime versions and device assumptions.",
        action: "Add README setup, supported platform, screenshots, and limitations.",
        debugPrompt: "If setup only works on your machine, document versions and remove hardcoded paths.",
        selfCheck: "A fresh user can understand how to run the app and what platform features it needs.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a mobile/desktop app with first-screen proof, stateful interaction, one platform feature, and precise run/setup limitations."
  ),
  familyResearchOverride(
    "media-graphics-family",
    (article) => /64k intro|skeletal animation|video encoding|webgl|water|graphics|glsl|codec/i.test(article.title),
    "Media/graphics pack built from MDN WebGL, LearnOpenGL, FFmpeg, and Scratchapixel resources",
    "Research-backed graphics/media path focused on data representation, render/encode pipeline, timing, transforms, and visual/proof artifacts.",
    mediaGraphicsResources,
    [
      {
        id: "pipeline",
        title: "Pipeline thinking",
        plainEnglish: "Graphics and media projects transform data through stages: assets or frames become buffers, transforms, encoded output, or pixels.",
        whyItMatters: "This gives beginners a map for shader, animation, codec, or demo-scene tutorials before math/API details pile up.",
        signsYouUnderstand: [
          "You can list the input data and final output.",
          "You can name at least three pipeline stages.",
          "You can capture one intermediate result."
        ]
      },
      {
        id: "time-and-space",
        title: "Time and space",
        plainEnglish: "Animation, video, and rendering depend on coordinate spaces, time steps, frame order, and transformations.",
        whyItMatters: "This helps learners debug offset models, broken playback, shader errors, and animation timing separately.",
        signsYouUnderstand: [
          "You can explain one coordinate transform.",
          "You can log frame/time progression.",
          "You can compare expected and actual visual output."
        ],
        resourceIndexes: [0, 1, 3]
      }
    ],
    [
      {
        title: "Inspect input data",
        sourceSectionTitle: "Input representation",
        learnRightHere: "Learn the format or data structure before rendering or encoding.",
        action: "Load or define one tiny input and print/visualize its essential fields.",
        debugPrompt: "If output is blank, verify input data first.",
        selfCheck: "A tiny input is inspectable before pipeline processing."
      },
      {
        title: "Produce the first visible/encoded proof",
        sourceSectionTitle: "Pipeline output",
        learnRightHere: "Learn the minimum render/encode loop or shader path needed for visible output.",
        action: "Render one primitive/frame/animation pose or encode one tiny media artifact.",
        debugPrompt: "If output is blank or corrupt, isolate stage input/output one step earlier.",
        selfCheck: "A visible frame, image, animation pose, or encoded artifact exists.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Add timing or transformation",
        sourceSectionTitle: "Motion/transform",
        learnRightHere: "Learn frame time, coordinate transforms, bone transforms, wave math, or codec frame order as the tutorial requires.",
        action: "Apply one controlled transform over time and record before/after behavior.",
        debugPrompt: "If motion explodes, log time delta and transformation matrix/value.",
        selfCheck: "One transformation changes output in a predictable way.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Document compatibility limits",
        sourceSectionTitle: "Formats and runtime",
        learnRightHere: "Learn GPU/API/codec/runtime assumptions and missing production features.",
        action: "Add screenshots/output samples plus README limitations on formats, hardware, precision, or performance.",
        debugPrompt: "If output varies by machine, document graphics/runtime versions and supported formats.",
        selfCheck: "README contains proof artifact, pipeline explanation, and compatibility limitations.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a media/graphics project with input inspection, pipeline output proof, transform/timing behavior, and compatibility documentation."
  ),
  familyResearchOverride(
    "messaging-service-family",
    (article) => /mqtt|chat service|message broker|broker from scratch/i.test(article.title),
    "Messaging-service pack built from MQTT specification, WebSocket API, networking texts, and socket programming resources",
    "Research-backed messaging path focused on protocol frames, client sessions, publish/subscribe or chat rooms, delivery state, and failure limits.",
    messagingResources,
    [
      {
        id: "message-protocol",
        title: "Messages have protocol shape",
        plainEnglish: "A broker or chat service receives structured messages, validates them, and routes them to the right session, topic, or room.",
        whyItMatters: "This separates parsing, connection state, and delivery logic before concurrency makes bugs harder.",
        signsYouUnderstand: [
          "You can name message fields.",
          "You can parse or construct one frame by hand.",
          "You can explain which clients should receive a message."
        ]
      },
      {
        id: "delivery-state",
        title: "Delivery state and failure",
        plainEnglish: "Messaging systems track connection, subscription, room membership, acknowledgements, or reconnect behavior depending on the protocol.",
        whyItMatters: "This teaches beginners that real-time systems are not just loops that broadcast strings.",
        signsYouUnderstand: [
          "You can show which clients are connected.",
          "You can handle a disconnect deliberately.",
          "You can document whether delivery is best effort or acknowledged."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Parse one message/frame",
        sourceSectionTitle: "Protocol",
        learnRightHere: "Learn the message shape before routing or concurrency.",
        action: "Decode or create one protocol/chat message fixture.",
        debugPrompt: "If routing fails later, confirm message parsing first.",
        selfCheck: "A fixture produces expected message fields."
      },
      {
        title: "Track one client/session",
        sourceSectionTitle: "Connection state",
        learnRightHere: "Learn connected client identity, session state, topic, or room membership.",
        action: "Connect one client and store enough state to route messages.",
        debugPrompt: "If messages go nowhere, print connected clients and subscriptions/rooms.",
        selfCheck: "One client/session is visible in server state.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Route one message",
        sourceSectionTitle: "Delivery",
        learnRightHere: "Learn publish/subscribe, room broadcast, or direct send as a routing rule.",
        action: "Send one message to the correct recipient/topic/room and reject one invalid target.",
        debugPrompt: "If everyone receives it, inspect routing key and membership state.",
        selfCheck: "Only intended recipients receive the message.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Document reliability",
        sourceSectionTitle: "Failure limits",
        learnRightHere: "Learn what production messaging adds: persistence, QoS, auth, backpressure, ordering, reconnects, and observability.",
        action: "Add README notes on supported delivery behavior and one simulated failure.",
        debugPrompt: "If disconnects lose data, document whether that is accepted or fix the session model.",
        selfCheck: "README states delivery guarantees and missing production features.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a messaging service or broker slice with protocol parsing, client/session state, message routing, and documented delivery limits."
  ),
  familyResearchOverride(
    "classical-ml-family",
    (article) => /spam|lstm|decision tree|stock market|scikit|machine learning algorithm/i.test(article.title),
    "Practical-ML pack built from scikit-learn supervised learning/evaluation, Google ML Crash Course, and Kaggle Learn",
    "Research-backed ML path focused on data inspection, features/labels, train/test splits, model choice, evaluation, and leakage warnings.",
    classicalMlResources,
    [
      {
        id: "data-before-model",
        title: "Data before model",
        plainEnglish: "A machine-learning project starts by understanding examples, labels, features, and what prediction is being asked for.",
        whyItMatters: "Beginners can make a model run while still learning nothing if they skip data meaning, leakage, and baseline behavior.",
        signsYouUnderstand: [
          "You can inspect one row/example and label.",
          "You can explain what the model predicts.",
          "You can name one feature or input risk."
        ]
      },
      {
        id: "evaluation-not-demo",
        title: "Evaluation, not just demo",
        plainEnglish: "A model is only useful if it is checked on examples not used to fit it and judged with a metric that fits the problem.",
        whyItMatters: "This prevents beginner CV projects from claiming learning when they only memorized or measured the wrong thing.",
        signsYouUnderstand: [
          "You can split train/test data.",
          "You can explain one metric.",
          "You can identify leakage or overfitting risk."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Inspect examples and labels",
        sourceSectionTitle: "Dataset",
        learnRightHere: "Learn the dataset shape and target before model code.",
        action: "Print a few examples, labels, missing values, and feature names.",
        debugPrompt: "If model code fails, inspect data types and label shape first.",
        selfCheck: "README explains what one example means."
      },
      {
        title: "Create a baseline and split",
        sourceSectionTitle: "Train/test setup",
        learnRightHere: "Learn train/test split and baseline behavior before tuning.",
        action: "Split data and compare the model to a simple baseline or majority/classical guess.",
        debugPrompt: "If results are too perfect, check leakage between train and test.",
        selfCheck: "Baseline and first model scores are reported separately.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Train the chosen model",
        sourceSectionTitle: "Model",
        learnRightHere: "Learn why the tutorial uses decision tree, LSTM, classifier, or other model for this data shape.",
        action: "Train the model with logged parameters and one small controlled run.",
        debugPrompt: "If training is unstable, reduce data/model size and check preprocessing.",
        selfCheck: "Training completes and produces predictions on held-out examples.",
        resourceIndexes: [0, 1, 3]
      },
      {
        title: "Evaluate and warn honestly",
        sourceSectionTitle: "Evaluation",
        learnRightHere: "Learn metric choice, confusion/error examples, and domain limitations.",
        action: "Report metric, show a few correct/incorrect predictions, and list limitations.",
        debugPrompt: "If a metric improves but examples look bad, inspect class imbalance or target leakage.",
        selfCheck: "README includes metric, data split, limitations, and a warning against overclaiming.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a practical ML project with data inspection, train/test split, model training, honest evaluation, and leakage/overclaim warnings."
  ),
  familyResearchOverride(
    "project-learning-meta-family",
    (article) => /vibe coding|build-your-own-x-vibe|byox-style/i.test(article.title),
    "Project-learning meta pack built from GitHub Skills, Software Carpentry shell, MIT Missing Semester, and freeCodeCamp",
    "Research-backed meta-learning path focused on choosing scope, using Git, reading tutorials critically, creating proof tasks, and documenting learning.",
    projectLearningResources,
    [
      {
        id: "tutorial-as-map",
        title: "Tutorial as map, not script",
        plainEnglish: "A build-your-own tutorial should become a sequence of concepts, checkpoints, and proofs rather than instructions to copy line by line.",
        whyItMatters: "This is the app's core beginner bridge: understand enough to explain, debug, and present the finished project honestly.",
        signsYouUnderstand: [
          "You can write the project goal in one sentence.",
          "You can name the first proof task.",
          "You can explain one concept before opening code."
        ]
      },
      {
        id: "portfolio-proof",
        title: "Portfolio proof",
        plainEnglish: "A beginner portfolio project needs evidence: commits, README explanations, screenshots, tests, fixtures, or demos that show understanding.",
        whyItMatters: "This keeps the learner from collecting copied projects that cannot survive a question in an interview.",
        signsYouUnderstand: [
          "You can show incremental commits.",
          "You can demo from a clean start.",
          "You can explain one bug you fixed."
        ],
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Choose scope and vocabulary",
        sourceSectionTitle: "Planning",
        learnRightHere: "Learn how to shrink a big tutorial into the smallest useful learning project.",
        action: "Write the project goal, five unknown terms, and the first visible proof.",
        debugPrompt: "If the project feels huge, remove features until the first proof can be done in one sitting.",
        selfCheck: "A short plan names scope, terms, and first proof."
      },
      {
        title: "Set up Git and checkpoints",
        sourceSectionTitle: "Project hygiene",
        learnRightHere: "Learn commits, README notes, and issue-style TODOs before implementation.",
        action: "Create a repo with checkpoint notes and commit the starting point.",
        debugPrompt: "If progress gets confusing, inspect commit history and restore the last working proof.",
        selfCheck: "The repo has an initial commit and planned checkpoints.",
        resourceIndexes: [0, 1, 2]
      },
      {
        title: "Build one proof at a time",
        sourceSectionTitle: "Implementation",
        learnRightHere: "Learn to stop after each proof and explain what changed.",
        action: "Complete one proof task and write a note explaining the concept it proves.",
        debugPrompt: "If code works but you cannot explain it, pause and rewrite the concept in plain language.",
        selfCheck: "One proof works and is explained in the README or notes.",
        resourceIndexes: [0, 2, 3]
      },
      {
        title: "Package the learning artifact",
        sourceSectionTitle: "Portfolio",
        learnRightHere: "Learn README structure, demo evidence, limitations, and next steps.",
        action: "Add final proof, setup instructions, concept explanation, and limitations.",
        debugPrompt: "If the project sounds inflated, replace claims with exact features and evidence.",
        selfCheck: "The project can be run, explained, and honestly framed for a profile.",
        resourceIndexes: [0, 1, 2, 3]
      }
    ],
    "Built a project-learning workflow that turns tutorials into scoped proof tasks, commits, README explanations, and honest portfolio evidence."
  ),
  researchOverride(
    "regex-engine",
    (article) => article.category === "Regex Engine" || /regex|regexp|regular expression/i.test(article.title),
    "Regex engine research pack built from Russ Cox, MDN, and automata theory resources",
    "Research-backed regex path focused on pattern syntax, automata, matching loops, and backtracking risk.",
    regexResources,
    [
      concept("research-regex-automata", "Patterns as state machines", "A regex engine becomes understandable when a pattern is translated into states and transitions instead of treated as magic string search.", "This lets the learner build a matcher one operation at a time and explain why some engines are fast while backtracking engines can explode.", ["You can draw states for a literal, concatenation, alternation, and repetition.", "You can explain why an NFA can represent multiple possible paths.", "You can name one regex feature that makes matching harder."], regexResources.slice(0, 3)),
      concept("research-regex-backtracking", "Backtracking versus linear matching", "Backtracking tries one path, rewinds, and tries another; Thompson-style NFA simulation keeps many possible states alive together.", "This is the concept that separates a toy matcher from an engine that can avoid catastrophic cases.", ["You can explain why `(a+)+`-style patterns can be dangerous.", "You can compare a recursive matcher with an NFA simulation.", "You can create a tiny test that shows matching time matters."], [regexResources[0], regexResources[1], regexResources[3]])
    ],
    [
      checkpoint("Parse a tiny regex grammar", "Pattern parsing", "Learn literals, concatenation, alternation, and repetition as syntax before matching any input.", "Represent a small regex as tokens or nodes and print the structure for two examples.", "If matching fails later, first inspect whether the pattern structure is what you intended.", "Two patterns produce inspectable structures with different operators.", [regexResources[2], regexResources[3]]),
      checkpoint("Match literals and concatenation", "Core matcher", "Learn the simplest input cursor model: where you are in the pattern and where you are in the text.", "Implement exact literal and concatenation matching before adding branches.", "If it accepts too much, print the pattern index and text index at each step.", "A literal pattern accepts only the exact text it should.", [regexResources[0], regexResources[2]]),
      checkpoint("Add alternation and repetition", "NFA/backtracking", "Learn choice points and repeated transitions as the first moment the engine has multiple possible futures.", "Implement alternation and star/plus using either explicit backtracking or an NFA state set.", "If performance collapses, reduce to a small pattern that shows the repeated choice.", "A handful of patterns with `|`, `*`, and `+` behave predictably.", [regexResources[0], regexResources[1]]),
      checkpoint("Prove one hard case", "Performance proof", "Learn why tests need negative cases and repeated input, not only happy matches.", "Add a benchmark or logged step count for a pattern that could backtrack badly.", "If the benchmark hangs, cap input length and record the growth trend before optimizing.", "The README explains the engine model and one performance limitation.", [regexResources[1], regexResources[3]])
    ],
    "Built a small regex engine and explained pattern parsing, matching strategy, and the difference between backtracking and automata-style matching."
  ),
  researchOverride(
    "redis-protocol",
    (article) => /redis|resp|protocol parser/i.test(article.title),
    "Redis protocol research pack built from Redis RESP docs, Redis commands, Beej networking, and parser resources",
    "Research-backed Redis/RESP path focused on byte framing, request arrays, command dispatch, and parser tests.",
    redisResources,
    [
      concept("research-redis-resp-framing", "RESP framing", "RESP messages are structured byte sequences whose first character says what kind of value follows.", "A Redis parser project is mostly about respecting lengths, CRLF separators, and nested arrays without guessing.", ["You can decode a simple string, integer, bulk string, and array by hand.", "You can explain why bulk string length matters more than searching for text.", "You can write malformed input that your parser should reject."], redisResources.slice(0, 3)),
      concept("research-redis-command-dispatch", "Parsing before command behavior", "A Redis-like server has two separate jobs: parse the wire protocol, then decide what a command should do.", "This keeps protocol bugs from being confused with database behavior bugs.", ["You can show a parsed command object before executing it.", "You can test parser fixtures without opening a network socket.", "You can explain where command validation belongs."], [redisResources[0], redisResources[1], redisResources[3]])
    ],
    [
      checkpoint("Parse one RESP value", "Protocol basics", "Learn the first-byte type marker and CRLF terminator before adding nesting.", "Parse one simple string, one integer, and one bulk string from fixtures.", "If parsing consumes too much input, log the cursor position after each read.", "Fixture tests prove each scalar value returns the expected type and remaining input.", [redisResources[0], redisResources[3]]),
      checkpoint("Parse command arrays", "Redis commands", "Learn why Redis commands arrive as arrays of bulk strings.", "Parse `SET key value` and `GET key` requests into a command name plus arguments.", "If arguments are wrong, print the raw RESP array and parsed array side by side.", "Two command fixtures produce clean command objects.", [redisResources[0], redisResources[1]]),
      checkpoint("Add a tiny key-value store", "Command handling", "Learn the boundary between parser output and storage behavior.", "Implement one in-memory map with GET and SET using parsed commands.", "If storage works in direct tests but not over RESP, the bug is in parsing or dispatch.", "A test can SET a key and GET the same value back.", [redisResources[1], redisResources[2]]),
      checkpoint("Serve through a socket", "Network integration", "Learn that sockets carry chunks, so a protocol parser must handle incomplete reads.", "Connect the parser to a TCP server and handle one client command.", "If socket input splits unexpectedly, buffer it and parse only complete frames.", "A Redis CLI or small client can send a command and receive a valid response.", [redisResources[0], redisResources[2]])
    ],
    "Built a Redis protocol parser/server slice that separates RESP byte parsing, command dispatch, and storage behavior with fixture tests."
  ),
  researchOverride(
    "chip8-emulator",
    (article) => article.category === "Emulator / Virtual Machine" || /chip-?8|emulator|virtual machine/i.test(article.title),
    "Emulator research pack built from CHIP-8 references, Emulator 101, Octo, and Canvas docs",
    "Research-backed emulator path focused on CPU state, opcodes, fetch-decode-execute, display, input, and ROM tests.",
    emulatorResources,
    [
      concept("research-emulator-machine-state", "Machine state", "An emulator is a state object plus rules for changing it: memory, registers, program counter, stack, timers, display, and input.", "Beginners need this map before implementing opcodes, otherwise every bug feels random.", ["You can list the state fields before coding.", "You can explain what the program counter points to.", "You can snapshot state before and after one instruction."], emulatorResources.slice(0, 3)),
      concept("research-emulator-fetch-decode-execute", "Fetch, decode, execute", "Each emulator step reads an instruction, interprets its bits, changes state, and advances or changes control flow.", "This is the main loop that turns a ROM file into behavior.", ["You can decode one opcode by hand.", "You can explain when the program counter should not simply add two.", "You can test one opcode without rendering anything."], [emulatorResources[0], emulatorResources[1], emulatorResources[2]])
    ],
    [
      checkpoint("Model CPU state", "Architecture setup", "Learn the memory/register/display/timer fields before any ROM runs.", "Create the emulator state and print a clean initial snapshot.", "If later opcodes fail, compare the current snapshot to the expected one.", "Initial state has predictable memory, registers, stack, timers, and display.", emulatorResources.slice(0, 2)),
      checkpoint("Implement fetch/decode", "Instruction loop", "Learn opcode width and bit masks by decoding a small known instruction.", "Fetch one instruction from memory and decode its nibbles or fields.", "If decoded values look wrong, print the raw hex opcode first.", "A sample opcode decodes into the expected fields.", [emulatorResources[0], emulatorResources[1]]),
      checkpoint("Add core opcodes", "Execution", "Learn state changes one opcode family at a time.", "Implement clears, jumps, loads, arithmetic, and drawing only after each has a fixture.", "If a ROM misbehaves, isolate the failing opcode with a tiny fixture.", "Several opcode tests pass without needing a full game ROM.", emulatorResources.slice(0, 3)),
      checkpoint("Render and accept input", "Display/input integration", "Learn how emulated display memory becomes pixels and how keys become emulator state.", "Connect the display buffer to a canvas/window and map input keys.", "If the game runs but visuals are wrong, inspect display memory before drawing code.", "A small ROM draws visible output and responds to one key.", [emulatorResources[0], emulatorResources[2], emulatorResources[3]])
    ],
    "Built a CHIP-8/emulator-style project with explicit machine state, opcode tests, display rendering, and a fetch-decode-execute loop."
  ),
  researchOverride(
    "static-site-generator",
    (article) => /static site|site generator|markdown|template/i.test(article.title),
    "Static-site research pack built from Node filesystem/path docs, MDN HTML, and Eleventy",
    "Research-backed static-site-generator path focused on reading files, transforming content, applying templates, and writing deterministic output.",
    staticSiteResources,
    [
      concept("research-ssg-file-pipeline", "File-to-file pipeline", "A static site generator reads source files, transforms them, and writes finished HTML files without a running server.", "This gives beginners a concrete input-process-output model before adding templates or routing.", ["You can name the input folder and output folder.", "You can explain what changes between source and generated HTML.", "You can rebuild from scratch without manual editing output files."], staticSiteResources.slice(0, 3)),
      concept("research-ssg-template-boundary", "Content versus template", "Content is the page data; a template decides how that data becomes repeated HTML structure.", "This is the boundary that prevents a generator from becoming string concatenation everywhere.", ["You can explain where page title/body/front matter live.", "You can render two pages with the same template.", "You can name one escaping or HTML safety concern."], [staticSiteResources[2], staticSiteResources[3], staticSiteResources[0]])
    ],
    [
      checkpoint("Read and list source files", "File discovery", "Learn filesystem traversal before transformation.", "Read a content directory and list markdown or text files in a stable order.", "If files are missing, print absolute paths before debugging parsing.", "The program lists the expected source files.", [staticSiteResources[0], staticSiteResources[1]]),
      checkpoint("Transform one page", "Content transform", "Learn the smallest transformation from source content to HTML.", "Convert one source file into a simple HTML string and write it to the output folder.", "If output is stale, delete the output folder and rebuild from source.", "One generated HTML file opens in the browser.", [staticSiteResources[0], staticSiteResources[2]]),
      checkpoint("Apply a reusable template", "Templates", "Learn the difference between page content and layout.", "Render at least two pages through the same template with different titles/body.", "If every page looks the same, log the page data before template rendering.", "Two pages share layout but contain different content.", [staticSiteResources[2], staticSiteResources[3]]),
      checkpoint("Add links and rebuild proof", "Site output", "Learn that a static site is a graph of generated files.", "Generate an index page linking to the other pages.", "If links break, inspect relative output paths and URLs separately.", "The output folder can be deleted and regenerated into a navigable mini-site.", [staticSiteResources[1], staticSiteResources[3]])
    ],
    "Built a static site generator that reads source files, transforms content into HTML, applies templates, and produces reproducible output."
  ),
  researchOverride(
    "search-text",
    (article) => /spell|spelling|recommend|recommendation|search engine|text search|tf-idf|rank/i.test(article.title),
    "Text/search research pack built from Norvig, Stanford IR, scikit-learn, and Python difflib",
    "Research-backed text/search path focused on text normalization, candidate generation, features, ranking, and evaluation.",
    searchTextResources,
    [
      concept("research-search-candidates", "Candidates before ranking", "Search, spell-check, and recommendation systems usually generate possible answers first, then score or rank them.", "This keeps beginners from expecting one magic formula to solve the whole project.", ["You can describe where candidates come from.", "You can explain why too many candidates can be slow.", "You can write one bad candidate and say why ranking should reject it."], searchTextResources.slice(0, 3)),
      concept("research-search-evaluation", "Evaluation examples", "A text system needs examples that prove whether suggestions or rankings are useful.", "Without evaluation, the project can look done while returning poor results.", ["You can create a tiny test set.", "You can compare expected and actual suggestions.", "You can explain one false positive and one false negative."], [searchTextResources[0], searchTextResources[1], searchTextResources[2]])
    ],
    [
      checkpoint("Normalize input text", "Preprocessing", "Learn casing, punctuation, tokenization, and vocabulary before scoring.", "Turn raw text into a stable representation your algorithm can use.", "If matches are missing, print tokens before changing the algorithm.", "Several messy inputs normalize into expected tokens.", [searchTextResources[1], searchTextResources[3]]),
      checkpoint("Generate candidates", "Candidate generation", "Learn how edits, terms, or features produce possible answers.", "Generate candidate corrections/results/recommendations without ranking yet.", "If candidates are empty, test the smallest edit/query/example.", "A known input produces a visible candidate list.", [searchTextResources[0], searchTextResources[2]]),
      checkpoint("Score and rank", "Ranking", "Learn frequency, similarity, or feature weights as ranking evidence.", "Sort candidates using one clear scoring rule and print scores.", "If the top result is wrong, inspect score components separately.", "The expected result ranks above weaker candidates in a small example.", [searchTextResources[1], searchTextResources[2]]),
      checkpoint("Evaluate with fixtures", "Evaluation", "Learn why example sets matter before expanding features.", "Create a small table of inputs and expected outputs and run it automatically.", "If one example fails, decide whether the rule or the expected result is wrong.", "A README lists accuracy/limitations on your tiny evaluation set.", searchTextResources.slice(0, 3))
    ],
    "Built a text/search system with normalization, candidate generation, ranking, and a small evaluation set rather than only a demo."
  ),
  researchOverride(
    "testing-framework",
    (article) => /mini.?test|testing framework|test framework|unit test/i.test(article.title),
    "Testing-framework research pack built from Node assert, Vitest, Jest, and GitHub Actions",
    "Research-backed testing-framework path focused on assertions, test registration, result reporting, failures, and automation.",
    testingResources,
    [
      concept("research-test-assertions", "Assertions as executable expectations", "An assertion turns an expectation into code that can pass or fail.", "A testing framework is not mainly about fancy output; it is about collecting and reporting these expectations reliably.", ["You can write a passing assertion and a failing assertion.", "You can explain expected versus actual values.", "You can decide what error message helps a learner debug."], testingResources.slice(0, 3)),
      concept("research-test-runner", "Runner and reporter", "A runner discovers or registers tests; a reporter turns results into useful feedback.", "Separating these jobs makes the framework easier to extend without mixing execution and display logic.", ["You can describe how tests are registered.", "You can store pass/fail results as data.", "You can print a summary without rerunning tests."], [testingResources[0], testingResources[1], testingResources[3]])
    ],
    [
      checkpoint("Implement one assertion", "Assertions", "Learn expected/actual comparison and failure messages.", "Write one assertion helper and prove it throws or returns failure data.", "If all tests pass accidentally, force one known failure.", "A deliberate failing assertion shows useful expected/actual output.", testingResources.slice(0, 2)),
      checkpoint("Register multiple tests", "Test registration", "Learn how user code declares named tests.", "Create a small API for adding tests and storing their names/functions.", "If tests run in the wrong order, print the registry before execution.", "Two named tests run from the registry.", [testingResources[1], testingResources[2]]),
      checkpoint("Report results", "Reporter", "Learn pass/fail/error distinction and summary counts.", "Collect results and print a concise report with totals.", "If failures are unclear, preserve error messages and test names.", "The output shows passing, failing, and errored tests distinctly.", [testingResources[1], testingResources[2]]),
      checkpoint("Automate the runner", "CLI/CI", "Learn how a test runner becomes useful from a command line or CI job.", "Expose a command that runs tests and exits nonzero on failure.", "If CI passes despite failures, inspect the process exit code.", "A GitHub Actions or local command run fails when a test fails.", [testingResources[0], testingResources[3]])
    ],
    "Built a small testing framework with assertions, test registration, reporting, and automation-friendly exit behavior."
  ),
  researchOverride(
    "distributed-log",
    (article) => /kafka|distributed|queue|log|replication/i.test(article.title) || article.category === "Distributed Systems",
    "Distributed-log research pack built from Kafka docs, MIT distributed systems, and Raft visualization",
    "Research-backed distributed-systems path focused on logs, partitions, producers/consumers, replication, and failure thinking.",
    distributedResources,
    [
      concept("research-distributed-log", "Log as the source of order", "A Kafka-like system is easier to understand as an append-only log where consumers track their position.", "This explains why ordering, replay, and durability matter before adding distributed complexity.", ["You can append events and read them back in order.", "You can explain a consumer offset.", "You can name why deleting or rewriting log entries is dangerous."], distributedResources.slice(0, 3)),
      concept("research-replication-failure", "Replication and failure", "Distributed systems copy data so one machine can fail without losing the whole service.", "Beginners need to model failure explicitly instead of assuming every node is always healthy.", ["You can name a leader/follower or primary/replica role.", "You can explain what should happen when one node disappears.", "You can test restart or reconnect behavior."], [distributedResources[0], distributedResources[2], distributedResources[3]])
    ],
    [
      checkpoint("Append and read one log", "Storage log", "Learn append-only storage and offsets before networking.", "Write records to a local log and read them back by offset.", "If reads skip data, inspect byte offsets or record indexes directly.", "A small log file returns records in the order written.", distributedResources.slice(0, 2)),
      checkpoint("Add producer and consumer APIs", "Client model", "Learn producer writes and consumer reads as separate roles.", "Create minimal produce and consume functions or endpoints.", "If consumers repeat data, inspect stored offsets.", "One producer writes messages and one consumer reads them predictably.", [distributedResources[0], distributedResources[1]]),
      checkpoint("Partition or topic the log", "Topics/partitions", "Learn how separating streams affects ordering and scaling.", "Add topic or partition names and keep offsets scoped correctly.", "If ordering seems wrong, check which partition each message entered.", "Two topics/partitions do not mix their records.", [distributedResources[0], distributedResources[1]]),
      checkpoint("Simulate failure", "Replication/failure", "Learn failure with a controlled fake before real distributed networking.", "Add a restart/replay or simple replica proof task.", "If recovery loses data, inspect which writes were acknowledged.", "The README explains one failure the system handles and one it does not.", [distributedResources[2], distributedResources[3]])
    ],
    "Built a Kafka-like learning system around append-only logs, producer/consumer roles, offsets, partitioning, and explicit failure limits."
  ),
  researchOverride(
    "raycaster",
    (article) => /raycast|wolfenstein|3d renderer|renderer/i.test(article.title) || article.category === "3D Renderer",
    "Raycasting/rendering research pack built from Lode, Scratchapixel, Khan Academy, and LearnOpenGL",
    "Research-backed rendering path focused on camera math, rays, wall hits, projection, and frame-loop debugging.",
    raycastingResources,
    [
      concept("research-raycaster-camera", "Camera rays", "A raycaster sends one ray per screen column from the player's position into a 2D map.", "This turns fake 3D into a series of small geometry questions a beginner can test.", ["You can draw player position, direction, and one ray.", "You can explain why screen columns map to ray angles.", "You can detect one ray hitting one wall cell."], raycastingResources.slice(0, 3)),
      concept("research-raycaster-projection", "Distance to wall height", "A wall slice becomes taller or shorter based on corrected distance from the camera.", "This is the bridge from map collision math to a visible 3D illusion.", ["You can explain why closer walls draw taller.", "You can name the fish-eye correction problem.", "You can test one known distance and expected wall height."], [raycastingResources[0], raycastingResources[1], raycastingResources[3]])
    ],
    [
      checkpoint("Draw the 2D map and player", "Map setup", "Learn grid maps and player coordinates before rays.", "Render a simple top-down map with a player position and direction.", "If movement feels wrong, inspect grid coordinates before projection math.", "The map visibly shows walls and player direction.", [raycastingResources[2], raycastingResources[3]]),
      checkpoint("Cast one ray", "Ray intersection", "Learn ray stepping or intersection against the map.", "Cast one visible ray and stop it at the first wall.", "If the ray passes through walls, print each visited grid cell.", "One ray reliably reports a wall hit and distance.", [raycastingResources[0], raycastingResources[1]]),
      checkpoint("Cast many columns", "Projection", "Learn how many rays become vertical wall slices.", "Cast one ray per screen column and draw wall heights.", "If the image bends strangely, inspect angle/distance correction.", "A simple corridor appears as a recognizable pseudo-3D view.", [raycastingResources[0], raycastingResources[3]]),
      checkpoint("Add movement and debug view", "Game loop", "Learn input/update/render loop with a debug overlay.", "Move the player and keep a mini-map or logged ray data.", "If collisions fail, debug in 2D before touching 3D rendering.", "The demo supports movement while preserving correct wall rendering.", [raycastingResources[0], raycastingResources[2]])
    ],
    "Built a raycasting renderer with a 2D map, camera rays, wall-distance projection, movement, and debug visualization."
  ),
  researchOverride(
    "neural-network",
    (article) => /neural|machine learning|deep learning|tensorflow|classifier|recognition/i.test(article.title) || article.category === "Neural Network" || article.category === "AI Model" || article.category === "Visual Recognition System",
    "Neural-network research pack built from Nielsen, 3Blue1Brown, Google ML Crash Course, and fast.ai",
    "Research-backed neural-network path focused on data, forward pass, loss, gradients/training, and evaluation.",
    neuralResources,
    [
      concept("research-nn-forward-loss", "Forward pass and loss", "A neural network first turns inputs into predictions, then loss measures how wrong those predictions are.", "This makes training feel like a measurable loop instead of vague AI magic.", ["You can trace one example through the model.", "You can compute or inspect a loss value.", "You can explain why lower loss is not always better if data is wrong."], neuralResources.slice(0, 3)),
      concept("research-nn-training-evaluation", "Training versus evaluation", "Training changes model parameters; evaluation measures behavior on examples the model should not simply memorize.", "This is the difference between a demo that seems smart and a project that proves learning.", ["You can split tiny train/test examples.", "You can explain overfitting in plain language.", "You can show one metric or confusion example."], [neuralResources[0], neuralResources[2], neuralResources[3]])
    ],
    [
      checkpoint("Prepare tiny data", "Dataset", "Learn input shape, label meaning, and train/test split before modeling.", "Load or create a tiny dataset and print shapes/examples.", "If training crashes, inspect one input and label before model code.", "The README explains what one example means.", [neuralResources[2], neuralResources[3]]),
      checkpoint("Run a forward pass", "Model basics", "Learn weights, activations, and prediction output before training.", "Create the smallest model and run one prediction.", "If output shape is wrong, print each layer/input shape.", "One example produces a prediction vector/value.", [neuralResources[0], neuralResources[1]]),
      checkpoint("Train with loss", "Training loop", "Learn loss, optimizer/gradient step, and repeated examples.", "Train for a few iterations and log loss.", "If loss is `NaN` or flat, reduce learning rate and inspect data scaling.", "A small training run changes loss in a plausible direction.", [neuralResources[0], neuralResources[2]]),
      checkpoint("Evaluate honestly", "Evaluation", "Learn held-out examples and limitations.", "Evaluate on examples not used for the tiny training proof.", "If results look perfect, check whether train/test data leaked.", "The README reports result, dataset size, and a limitation.", [neuralResources[2], neuralResources[3]])
    ],
    "Built a neural-network project with explicit data preparation, forward pass, training loop, evaluation, and limitations."
  ),
  researchOverride(
    "database-storage",
    (article) => /database|sqlite|btree|b-tree|storage engine|index/i.test(article.title) || article.category === "Database",
    "Database/storage research pack built from SQLite, PostgreSQL, CMU, and Stanford IR resources",
    "Research-backed database path focused on persistence, pages/records, indexes, query shape, and durability boundaries.",
    databaseResources,
    [
      concept("research-db-storage-layout", "Storage layout", "A database project stores records in a structure that can be read later without relying on program memory.", "This is the first bridge from an in-memory map to a durable database-like system.", ["You can explain what bytes/files survive a restart.", "You can show how one record is encoded.", "You can name a corruption or versioning risk."], databaseResources.slice(0, 3)),
      concept("research-db-indexes", "Indexes trade writes for reads", "An index is extra structure maintained during writes so lookups can avoid scanning everything later.", "This helps beginners understand why databases are not just files with search.", ["You can compare a scan with an indexed lookup.", "You can explain when an index must update.", "You can create a tiny benchmark or step count."], [databaseResources[1], databaseResources[2], databaseResources[3]])
    ],
    [
      checkpoint("Persist one record", "Storage", "Learn file/record layout before queries.", "Write one record to disk and read it after restarting.", "If data disappears, separate write, flush/close, and read steps.", "A clean restart still reads the saved record.", databaseResources.slice(0, 2)),
      checkpoint("Store many records", "Pages/records", "Learn record identity and layout as data grows.", "Append or page multiple records and retrieve them by id/key.", "If records overlap, print offsets or page slots.", "Several records survive restart and can be retrieved individually.", [databaseResources[0], databaseResources[2]]),
      checkpoint("Add an index", "Indexes", "Learn lookup structure separate from raw storage.", "Build a small index from keys to record locations.", "If lookup returns stale data, inspect index updates after writes.", "Indexed lookup avoids scanning every record in a small demo.", [databaseResources[1], databaseResources[2]]),
      checkpoint("Document query limits", "Queries/durability", "Learn what your toy database promises and what it does not.", "Add one query/demo plus a README section on limitations.", "If a feature seems easy, write what durability/concurrency cases it ignores.", "README explains storage format, index, and missing production features.", databaseResources.slice(0, 3))
    ],
    "Built a database/storage project with persistent records, retrieval, indexing, and explicit durability/query limitations."
  ),
  researchOverride(
    "blockchain",
    (article) => /blockchain|bitcoin|cryptocurrency|proof of stake|proof of work/i.test(article.title) || article.category === "Blockchain / Cryptocurrency",
    "Blockchain research pack built from Bitcoin Developer docs, MIT OCW, Princeton, and NIST hashing docs",
    "Research-backed blockchain path focused on hashes, block structure, validation, consensus assumptions, and networking limits.",
    blockchainResources,
    [
      concept("research-chain-integrity", "Hash-linked history", "A blockchain is a sequence where each block commits to previous data through a hash.", "This explains tamper evidence before adding mining, peers, or tokens.", ["You can explain which bytes are hashed.", "You can show how changing one block breaks later hashes.", "You can separate hash integrity from economic consensus."], blockchainResources.slice(0, 3)),
      concept("research-consensus-assumptions", "Consensus assumptions", "Consensus is how participants decide which valid history to accept when there are competing histories.", "This prevents beginners from treating a blockchain as just a linked list.", ["You can name one rule for choosing a chain.", "You can describe a fork in plain language.", "You can explain one attack or failure the toy chain does not handle."], [blockchainResources[0], blockchainResources[1], blockchainResources[2]])
    ],
    [
      checkpoint("Create and hash one block", "Block structure", "Learn block fields and deterministic serialization before chain behavior.", "Build one block and calculate its hash from explicit fields.", "If hashes differ unexpectedly, print the serialized bytes/string.", "The same block data always produces the same hash.", [blockchainResources[0], blockchainResources[3]]),
      checkpoint("Link and validate blocks", "Chain validation", "Learn previous-hash links and basic validation rules.", "Append several blocks and reject one tampered block.", "If tampering is not detected, inspect previous hash comparisons.", "Changing an old block causes validation failure.", [blockchainResources[0], blockchainResources[2]]),
      checkpoint("Add a selection rule", "Consensus toy model", "Learn a simplified rule for accepting one chain over another.", "Implement the tutorial's proof/selection rule and document its assumptions.", "If two histories both validate, print the rule that chooses between them.", "The README explains why the toy rule is not production security.", [blockchainResources[1], blockchainResources[2]]),
      checkpoint("Model peer or transaction limits", "Network/economics boundary", "Learn what the tutorial leaves out: real networking, incentives, signatures, mempools, or attacks.", "Add one small peer/transaction demo or document the omitted layer honestly.", "If the project feels complete, compare it with Bitcoin docs and list missing guarantees.", "Final notes separate data structure, validation, and consensus limitations.", blockchainResources.slice(0, 3))
    ],
    "Built a blockchain learning project with block hashing, chain validation, a toy consensus rule, and explicit security/networking limitations."
  ),
  researchOverride(
    "compiler-language",
    (article) => article.category === "Programming Language" || /compiler|interpreter|parser combinator|wasm|webassembly|jvm|scheme|lisp|garbage collector|lexer|scanner/i.test(article.title),
    "Compiler/language research pack built from Crafting Interpreters, LLVM, and WebAssembly specifications",
    "Research-backed language-tool path focused on scanning, parsing, intermediate representation, execution/code generation, and tests.",
    compilerResources,
    [
      concept("research-compiler-front-end", "Source text to structure", "Language projects become learnable when source code is processed in layers: characters become tokens, tokens become syntax trees, and trees become behavior.", "This keeps beginners from mixing parser bugs with evaluator or code-generation bugs.", ["You can print tokens before parsing.", "You can draw one expression tree.", "You can explain whether a bug is lexical, syntactic, or semantic."], compilerResources.slice(0, 3)),
      concept("research-compiler-back-end", "Meaning before output", "An interpreter directly evaluates structured code, while a compiler translates it into another representation such as bytecode, LLVM IR, C, or WebAssembly.", "This helps learners understand what their project is proving before trying to support a full language.", ["You can name the target representation.", "You can run one tiny program end to end.", "You can explain one feature deliberately out of scope."], [compilerResources[1], compilerResources[2], compilerResources[3]])
    ],
    [
      checkpoint("Tokenize one tiny program", "Lexing/scanning", "Learn how raw source becomes tokens with types and positions.", "Write a scanner for identifiers, literals, operators, and whitespace in one small sample.", "If parsing fails, first print the token list.", "A tiny source file produces the expected token sequence.", [compilerResources[0], compilerResources[1]]),
      checkpoint("Parse into a tree", "Parsing", "Learn grammar rules as the shape of valid programs.", "Parse expressions or statements into an inspectable tree.", "If precedence is wrong, add a fixture that isolates one operator pair.", "A tree printout matches the intended grouping.", [compilerResources[1], compilerResources[2]]),
      checkpoint("Evaluate or lower one feature", "Execution/code generation", "Learn the first end-to-end semantic feature before adding syntax variety.", "Implement one expression/statement all the way to output, bytecode, IR, or runtime behavior.", "If output is wrong, inspect the tree or IR before changing the scanner.", "One complete sample runs and produces expected behavior.", [compilerResources[2], compilerResources[3]]),
      checkpoint("Add a conformance fixture set", "Language tests", "Learn that language tools need examples for accepted and rejected programs.", "Create fixtures for valid input, invalid input, and one edge case.", "If an invalid program passes, write which phase should reject it.", "The README lists supported syntax, target, and known unsupported features.", compilerResources.slice(0, 4))
    ],
    "Built a language tool from source text through tokens, syntax, execution or code generation, with fixtures that prove supported and rejected programs."
  ),
  researchOverride(
    "shell-process",
    (article) => article.category === "Shell" || /unix shell|own shell|simple shell|shell in/i.test(article.title),
    "Shell/process research pack built from POSIX shell, Bash manual, OSTEP process API, and pipe docs",
    "Research-backed shell path focused on command parsing, fork/exec, pipes, redirection, exit status, and job boundaries.",
    shellResources,
    [
      concept("research-shell-command-model", "Commands as parsed jobs", "A shell reads a line, parses it into commands and operators, then launches processes according to that structure.", "This separates text parsing from process control so beginners can test both layers.", ["You can parse command plus arguments.", "You can explain why quotes/redirection/pipes change the parse.", "You can show parsed job data before launching it."], shellResources.slice(0, 3)),
      concept("research-shell-process-control", "Process control", "A shell starts programs, connects their input/output, waits for them, and reports their exit status.", "This is the core reason a shell project is an operating-system project, not just a string parser.", ["You can explain fork/exec/wait or the language equivalent.", "You can connect two processes with a pipe.", "You can preserve and print exit status."], [shellResources[2], shellResources[3], shellResources[0]])
    ],
    [
      checkpoint("Parse a command line", "Parser", "Learn argument splitting before process launch.", "Parse command plus arguments and print the parsed structure.", "If execution fails, compare raw input with parsed args.", "A command with multiple args parses predictably.", [shellResources[0], shellResources[1]]),
      checkpoint("Run one external command", "Execution", "Learn process creation and waiting.", "Launch one external program and return to the prompt after it exits.", "If the shell hangs, inspect wait behavior and child process state.", "A command runs and the prompt returns.", [shellResources[2], shellResources[0]]),
      checkpoint("Add redirection or pipes", "I/O", "Learn file descriptors as connections between processes and files.", "Implement one output redirection or one two-command pipe.", "If output goes nowhere, print which descriptor is connected where.", "A simple pipeline or redirected command produces expected output.", [shellResources[3], shellResources[1]]),
      checkpoint("Track exit status and errors", "Shell behavior", "Learn how shells communicate failure.", "Report exit status and useful errors for missing commands.", "If errors are vague, include command name and system error.", "The README explains supported shell features and unsupported POSIX behavior.", shellResources)
    ],
    "Built a shell that parses commands, launches processes, connects I/O, reports exit status, and documents unsupported shell features."
  ),
  researchOverride(
    "os-kernel-boot",
    (article) => article.category === "Operating System" || /bootloader|system call|kernel|operating system|os from scratch|malloc tutorial/i.test(article.title),
    "OS/kernel research pack built from OSDev, OSTEP, and Linux kernel documentation",
    "Research-backed systems path focused on boot boundaries, kernel state, memory/process concepts, system calls, and hardware/toolchain constraints.",
    osKernelResources,
    [
      concept("research-os-boot-boundary", "Boot boundary", "An OS project starts before normal programs exist, so the bootloader, linker script, and kernel entry point are part of the learning path.", "Beginners need this boundary to understand why OS tutorials feel unlike ordinary applications.", ["You can name what the bootloader gives the kernel.", "You can explain why a cross-compiler or target matters.", "You can describe the first visible kernel proof."], osKernelResources.slice(0, 3)),
      concept("research-os-kernel-interface", "Kernel interface", "Kernel code manages privileged resources and exposes controlled entry points such as interrupts or system calls.", "This is the bridge from booting code to useful OS behavior.", ["You can separate user/kernel responsibilities.", "You can explain one system-call path or interrupt path.", "You can list what your toy kernel does not protect."], [osKernelResources[2], osKernelResources[3], osKernelResources[0]])
    ],
    [
      checkpoint("Prove the toolchain and boot path", "Boot setup", "Learn cross-compilation, linking, and emulator run commands before kernel features.", "Build and boot the smallest image that prints or halts predictably.", "If it does not boot, inspect compiler target, linker script, and bootloader config separately.", "An emulator shows a visible proof of kernel entry.", [osKernelResources[0], osKernelResources[1]]),
      checkpoint("Add one kernel service", "Kernel state", "Learn one resource at a time: console, memory, interrupt, syscall, or allocation.", "Implement one tiny service and test it with a controlled input.", "If behavior changes after boot, log state transitions near the service.", "A simple service works repeatedly in the emulator.", [osKernelResources[2], osKernelResources[3]]),
      checkpoint("Cross a boundary deliberately", "Privilege/interface", "Learn how code crosses from caller to kernel/service behavior.", "Implement or trace one boundary: system call, interrupt, allocator API, or boot handoff.", "If the boundary fails, inspect register/argument/state conventions.", "The README diagrams caller, boundary, and kernel/service result.", [osKernelResources[2], osKernelResources[3]]),
      checkpoint("Document hardware and safety limits", "Scope", "Learn why toy OS code is environment-specific.", "Write limitations for architecture, emulator, memory safety, concurrency, and missing drivers.", "If a feature seems production-ready, compare it with OSDev/Linux docs.", "Final notes explain what works and what remains educational-only.", osKernelResources)
    ],
    "Built an OS/kernel-level project with explicit boot/toolchain proof, one kernel service, a documented boundary, and clear hardware/safety limits."
  ),
  researchOverride(
    "git-internals",
    (article) => article.category === "Git" || /git clone|gitlet|rebuilding git|write yourself a git|build git|git plugin/i.test(article.title),
    "Git internals research pack built from Pro Git, packfile docs, and GitHub Skills",
    "Research-backed Git path focused on objects, refs, trees, commits, packfiles, and repository proof tasks.",
    gitResources,
    [
      concept("research-git-objects", "Content-addressed objects", "Git stores blobs, trees, commits, and tags by hashing their contents.", "This makes Git internals less mystical and explains why changing bytes changes identity.", ["You can create or inspect a blob hash.", "You can explain blob versus tree versus commit.", "You can connect object identity to content."], gitResources.slice(0, 3)),
      concept("research-git-history", "Refs point to history", "Branches and HEAD are pointers to commits, not copies of whole projects.", "This helps beginners build clone/commit/branch behavior without confusing snapshots and names.", ["You can explain what HEAD names.", "You can move a branch ref in a toy repo.", "You can draw parent commits."], [gitResources[0], gitResources[1], gitResources[3]])
    ],
    [
      checkpoint("Store and read one object", "Objects", "Learn object type, content, and hash before repository operations.", "Write a blob-like object and read it back by id.", "If ids differ, inspect exact bytes and headers.", "The same content maps to the same object id.", gitResources.slice(0, 2)),
      checkpoint("Represent a tree and commit", "Snapshots", "Learn how files become trees and trees become commits.", "Create a tiny tree/commit representation with parent metadata.", "If checkout is wrong, inspect tree entries before refs.", "A commit can be printed with tree and parent info.", [gitResources[0], gitResources[1]]),
      checkpoint("Move refs", "Branches", "Learn refs as names pointing at object ids.", "Implement or simulate HEAD/branch movement after a commit.", "If history disappears, inspect ref update order.", "A branch pointer moves while old commit objects remain.", [gitResources[0], gitResources[3]]),
      checkpoint("Compare with real Git", "Compatibility limits", "Learn what packfiles/protocol features your toy project omits.", "Add one command/demo and document missing real Git guarantees.", "If you claim compatibility, test against an actual Git repo fixture.", "README separates educational internals from production Git behavior.", gitResources)
    ],
    "Built a Git-internals project around content-addressed objects, tree/commit history, refs, and documented compatibility limits."
  ),
  researchOverride(
    "dotfile-manager",
    (article) => /stow|dotfile|symlink/i.test(article.title),
    "Dotfile manager research pack built from GNU Stow, Coreutils ln, XDG, and Pro Git",
    "Research-backed dotfile-manager path focused on source tree mapping, symlink creation, conflict handling, dry runs, and rollback.",
    dotfileResources,
    [
      concept("research-dotfile-symlink-map", "Source tree to target symlinks", "A Stow-like tool maps files from a package directory into target locations using symbolic links.", "This is the core model that makes dotfiles portable without copying files everywhere.", ["You can draw source path to target path.", "You can explain absolute versus relative symlink tradeoffs.", "You can detect a broken symlink."], dotfileResources.slice(0, 3)),
      concept("research-dotfile-conflicts", "Dry run and conflicts", "Dotfile tools must avoid overwriting real user files accidentally.", "Conflict detection and dry-run output are what make this project safe enough to use.", ["You can define a conflict before linking.", "You can preview planned changes.", "You can undo or skip a risky operation."], [dotfileResources[0], dotfileResources[1], dotfileResources[3]])
    ],
    [
      checkpoint("Map source paths to targets", "Path mapping", "Learn path resolution before touching real files.", "Given package files, print target paths without creating links.", "If targets look wrong, inspect absolute paths and home directory expansion.", "Dry-run output shows correct source-target pairs.", [dotfileResources[0], dotfileResources[2]]),
      checkpoint("Create one safe symlink", "Linking", "Learn symlink creation and existing-file checks.", "Create one link in a temporary fixture directory.", "If a link points nowhere, inspect relative path from target to source.", "A fixture target contains a working symlink.", [dotfileResources[1], dotfileResources[0]]),
      checkpoint("Detect conflicts", "Safety", "Learn when not to link.", "Refuse to overwrite an existing regular file unless explicitly allowed.", "If the tool overwrites data in tests, stop and add conflict fixtures.", "Conflict tests prove real files are preserved.", [dotfileResources[0], dotfileResources[3]]),
      checkpoint("Add unstow or rollback", "Cleanup", "Learn lifecycle, not just install.", "Remove only links that your tool created or can verify.", "If cleanup removes too much, require ownership/target checks.", "README explains dry run, conflict behavior, install, and remove.", dotfileResources)
    ],
    "Built a dotfile/stow-like manager with safe path mapping, symlink creation, conflict detection, dry-run output, and cleanup behavior."
  ),
  researchOverride(
    "data-parser",
    (article) => /json decoding|json parser|ini parser|markdown compiler|dmidecode|dmi parser/i.test(article.title),
    "Data parser research pack built from RFC 8259, MDN JSON, Python configparser, and Crafting Interpreters",
    "Research-backed parser path focused on lexical rules, grammar, nested values, error reporting, and strict fixtures.",
    parserDataResources,
    [
      concept("research-data-parser-grammar", "Grammar as contract", "A JSON, INI, or Markdown parser accepts text only when it follows the format's rules.", "This keeps learners from building a parser that works only on happy examples.", ["You can write accepted and rejected fixtures.", "You can explain string/escape/comment rules.", "You can name where the parser reports an error."], parserDataResources.slice(0, 3)),
      concept("research-data-parser-errors", "Error position matters", "Parser output is not only data; useful errors tell where and why parsing failed.", "Good error handling makes a beginner parser feel real and debuggable.", ["You can report line/column or index.", "You can reject malformed input intentionally.", "You can test one edge case from the spec."], [parserDataResources[0], parserDataResources[2], parserDataResources[3]])
    ],
    [
      checkpoint("Tokenize or scan input", "Lexing", "Learn characters, whitespace, delimiters, and escape rules.", "Turn a small input into tokens or parse cursor events.", "If nesting fails later, inspect token positions first.", "A fixture prints expected tokens or cursor steps.", [parserDataResources[0], parserDataResources[3]]),
      checkpoint("Parse simple values", "Grammar", "Learn one value shape before nesting.", "Parse strings/numbers/sections/key-value pairs depending on the format.", "If a value is accepted incorrectly, add a negative fixture.", "Simple valid and invalid examples behave correctly.", [parserDataResources[0], parserDataResources[2]]),
      checkpoint("Add nesting or sections", "Structure", "Learn arrays/objects/sections/blocks as recursive or grouped structure.", "Parse nested or multi-section input into structured output.", "If recursion loops, log open/close delimiter handling.", "A nested fixture produces the expected tree/object.", [parserDataResources[0], parserDataResources[1]]),
      checkpoint("Improve errors and limits", "Diagnostics", "Learn parser usefulness through precise failure cases.", "Add line/index errors and document unsupported format features.", "If an error is vague, include expected token/value and position.", "README lists supported grammar and deliberate deviations.", parserDataResources)
    ],
    "Built a strict data parser with format-specific grammar, fixtures for invalid input, nested structure handling, and useful error reporting."
  ),
  researchOverride(
    "dns-server",
    (article) => /dns server|dns/i.test(article.title),
    "DNS server research pack built from RFC 1035, Cloudflare DNS docs, Node dgram, and MDN DNS glossary",
    "Research-backed DNS path focused on UDP packets, DNS message sections, name encoding, record lookup, and response codes.",
    dnsResources,
    [
      concept("research-dns-message", "DNS messages are structured packets", "A DNS server receives a binary packet with header, question, and resource-record sections.", "Beginners need this packet shape before trying to answer real queries.", ["You can identify header fields.", "You can decode one queried domain name.", "You can separate question parsing from response building."], dnsResources.slice(0, 3)),
      concept("research-dns-records", "Records answer specific questions", "DNS does not return one generic answer; it answers record-type questions such as A, AAAA, CNAME, or MX.", "This explains routing from parsed question to authoritative response or error.", ["You can explain A versus CNAME at beginner level.", "You can return NXDOMAIN or unsupported type intentionally.", "You can test with a known query."], [dnsResources[0], dnsResources[1], dnsResources[3]])
    ],
    [
      checkpoint("Decode one DNS query", "Packet parsing", "Learn UDP bytes, DNS header, and question section.", "Parse a fixture query and print id, name, and type.", "If names are wrong, inspect label lengths byte by byte.", "A fixture decodes into the expected domain and record type.", [dnsResources[0], dnsResources[2]]),
      checkpoint("Build one response", "Response encoding", "Learn how replies preserve id/question and add answer records.", "Return one hardcoded A record response from a fixture.", "If clients reject it, compare header counts and name encoding.", "A DNS tool/client accepts the response format.", [dnsResources[0], dnsResources[1]]),
      checkpoint("Serve over UDP", "Networking", "Learn request/response over datagrams.", "Connect parser/encoder to a UDP socket and answer localhost queries.", "If packets vanish, log source address/port and response bytes.", "A local query receives the expected answer.", [dnsResources[2], dnsResources[0]]),
      checkpoint("Handle misses and limits", "DNS behavior", "Learn response codes and unsupported record types.", "Return clear errors for unknown names/types and document missing recursion/cache/DNSSEC.", "If every query succeeds, add negative fixtures.", "README explains authoritative toy scope and missing resolver features.", dnsResources)
    ],
    "Built a DNS server slice that parses DNS packets, answers records over UDP, and documents resolver/security limitations."
  ),
  researchOverride(
    "load-balancer",
    (article) => /load balancer|load balancing/i.test(article.title),
    "Load-balancer research pack built from NGINX, HAProxy, Cloudflare, and networking resources",
    "Research-backed load-balancer path focused on upstream pools, health, selection policies, retries, and observability.",
    loadBalancerResources,
    [
      concept("research-lb-upstreams", "Upstream pool", "A load balancer receives client requests and forwards each one to one backend from a pool.", "This is the simplest mental model before adding health checks or advanced policies.", ["You can list available backends.", "You can explain round-robin selection.", "You can log which backend handled each request."], loadBalancerResources.slice(0, 3)),
      concept("research-lb-health", "Health and failure", "Load balancing only helps if unhealthy backends stop receiving traffic or are retried safely.", "This turns a toy proxy into a reliability exercise.", ["You can mark one backend down.", "You can retry or return a clear failure.", "You can explain one limitation around sticky sessions or streaming."], [loadBalancerResources[0], loadBalancerResources[1], loadBalancerResources[3]])
    ],
    [
      checkpoint("Forward one request", "Proxy basics", "Learn client-facing socket/server and backend request separately.", "Forward a request to one configured backend and return its response.", "If responses hang, log client side and backend side separately.", "One backend response reaches the client through the proxy.", [loadBalancerResources[2], loadBalancerResources[3]]),
      checkpoint("Add backend selection", "Balancing policy", "Learn round-robin or least-connections as explicit state.", "Route requests across two backends and log decisions.", "If one backend gets everything, inspect selector state.", "Repeated requests alternate or follow the documented policy.", [loadBalancerResources[0], loadBalancerResources[1]]),
      checkpoint("Handle backend failure", "Health", "Learn timeout, error, and unavailable backend behavior.", "Skip or fail over from one broken backend.", "If failures are slow, add timeouts and clear logs.", "A broken backend does not make every request hang.", [loadBalancerResources[1], loadBalancerResources[2]]),
      checkpoint("Document production gaps", "Limits", "Learn what real balancers add: TLS, streaming, sticky sessions, observability, slow starts.", "Add metrics/logs and a README limitations table.", "If the demo seems complete, compare with NGINX/HAProxy docs.", "README explains policy, health behavior, and missing features.", loadBalancerResources)
    ],
    "Built a load balancer with request forwarding, backend selection, failure handling, logs, and production-limit documentation."
  ),
  researchOverride(
    "linux-debugger",
    (article) => /linux debugger|debugger/i.test(article.title),
    "Linux debugger research pack built from ptrace, GDB, man-pages, and kernel Yama docs",
    "Research-backed debugger path focused on process attach, registers, breakpoints, memory inspection, and permission limits.",
    debuggerResources,
    [
      concept("research-debugger-ptrace", "Tracing a target process", "A debugger controls or observes another process through OS debugging APIs such as ptrace.", "This explains why debugger projects are about process state and permissions before UI.", ["You can explain attach versus launch.", "You can read one register or stop reason.", "You can name a permission limit."], debuggerResources.slice(0, 3)),
      concept("research-debugger-breakpoints", "Breakpoints change execution", "A breakpoint is usually implemented by replacing an instruction or using hardware/debug support so execution stops at a chosen place.", "This makes stepping and breakpoints concrete instead of magic IDE behavior.", ["You can set and restore one breakpoint.", "You can explain instruction pointer changes.", "You can document architecture assumptions."], [debuggerResources[0], debuggerResources[1], debuggerResources[3]])
    ],
    [
      checkpoint("Launch or attach to a target", "Process control", "Learn target process lifecycle and permissions.", "Start or attach to a tiny program and observe that it stops.", "If attach fails, inspect ptrace scope and process ownership.", "The debugger can stop a known target program.", [debuggerResources[0], debuggerResources[3]]),
      checkpoint("Read state", "Registers/memory", "Learn registers and memory as the debugger's first useful view.", "Print instruction pointer and one other register or memory value.", "If values look random, compile a tiny predictable target.", "A target state snapshot appears in debugger output.", [debuggerResources[0], debuggerResources[1]]),
      checkpoint("Set one breakpoint", "Breakpoints", "Learn trap/restore or equivalent breakpoint mechanics.", "Stop at a chosen address or symbol in the tiny target.", "If execution crashes, verify original instruction restoration.", "The target stops exactly at the intended point.", [debuggerResources[0], debuggerResources[2]]),
      checkpoint("Document architecture limits", "Debugger scope", "Learn why real debuggers need symbols, DWARF, signals, threads, and architecture support.", "Add a README section on what your debugger supports and omits.", "If a feature depends on compiler flags, write that requirement.", "README names supported OS/architecture and missing GDB-level features.", debuggerResources)
    ],
    "Built a Linux debugger slice that controls a target process, inspects state, sets a breakpoint, and documents OS/architecture limits."
  ),
  researchOverride(
    "x-window-manager",
    (article) => /window manager|x window/i.test(article.title),
    "X Window Manager research pack built from Xlib, EWMH, and freedesktop specifications",
    "Research-backed window-manager path focused on X server events, managed windows, focus, movement, and standards boundaries.",
    xWindowResources,
    [
      concept("research-xwm-client-server", "X server, clients, and manager", "In X11, applications are clients of the X server, and a window manager is another client that reacts to window events.", "This architecture is the key to understanding why a window manager does not own every pixel directly.", ["You can explain root window and top-level client windows.", "You can subscribe to map/configure events.", "You can distinguish app client from window manager."], xWindowResources.slice(0, 3)),
      concept("research-xwm-conventions", "Window manager conventions", "Useful window managers follow conventions such as ICCCM/EWMH so applications and desktop tools understand them.", "This prevents a toy manager from seeming broken with real apps.", ["You can name one EWMH property.", "You can explain focus/move/resize as event handling.", "You can document unsupported conventions."], [xWindowResources[0], xWindowResources[1], xWindowResources[3]])
    ],
    [
      checkpoint("Connect to X and watch events", "Xlib setup", "Learn display/root-window connection and event masks.", "Log map/configure/destroy events for simple windows.", "If no events appear, inspect event masks on the root window.", "Opening a test window produces visible event logs.", [xWindowResources[1], xWindowResources[2]]),
      checkpoint("Manage one window", "Window control", "Learn move/resize/focus operations as requests to the X server.", "Move or resize one client window through your manager.", "If nothing changes, flush/sync and log window ids.", "A test window can be moved or focused.", [xWindowResources[2], xWindowResources[1]]),
      checkpoint("Add a simple policy", "Layout/focus", "Learn tiling/floating/focus policy separately from event plumbing.", "Implement one layout or focus rule and log decisions.", "If windows overlap unexpectedly, print managed window list.", "Two windows follow the documented policy.", [xWindowResources[0], xWindowResources[1]]),
      checkpoint("Document standards gaps", "EWMH/ICCCM", "Learn why real window managers require many conventions.", "Support or document one EWMH behavior and list missing conventions.", "If apps behave strangely, compare required properties/events with EWMH.", "README explains supported window actions and standards limitations.", xWindowResources)
    ],
    "Built an X11 window-manager slice that observes X events, manages windows, applies a simple policy, and documents EWMH/ICCCM limits."
  ),
  researchOverride(
    "video-player",
    (article) => /video player|media player/i.test(article.title),
    "Video-player research pack built from MDN media docs, MSE, FFmpeg, and W3C specifications",
    "Research-backed video-player path focused on container/codec boundaries, media pipeline state, buffering, controls, and playback proof.",
    videoResources,
    [
      concept("research-video-container-codec", "Container versus codec", "A media file container organizes tracks and metadata, while codecs define how audio/video samples are compressed.", "This helps beginners avoid treating video playback as one opaque file problem.", ["You can name container and codec separately.", "You can explain why unsupported codecs fail.", "You can inspect media metadata before playback."], videoResources.slice(0, 3)),
      concept("research-video-buffering", "Playback state and buffering", "A player coordinates loading, buffering, decoding, timing, and UI controls.", "This turns video playback into a state machine the learner can debug.", ["You can log ready/buffer/play/pause states.", "You can explain why playback stalls.", "You can test controls independently from decoding."], [videoResources[0], videoResources[1], videoResources[3]])
    ],
    [
      checkpoint("Inspect one media file", "Media metadata", "Learn track/container/codec facts before player UI.", "Print or display basic metadata for one known file.", "If playback fails, check codec/container support first.", "Metadata output names duration/tracks or support status.", [videoResources[2], videoResources[0]]),
      checkpoint("Play and pause one file", "Playback state", "Learn the smallest media state machine.", "Implement open/play/pause/stop or equivalent controls.", "If controls desync, log player state transitions.", "The same file plays and pauses predictably.", [videoResources[0], videoResources[1]]),
      checkpoint("Add buffering/progress", "Buffering", "Learn loaded ranges, current time, and progress feedback.", "Display current time and buffered/loaded progress.", "If progress jumps, compare decoded time with UI state.", "The UI updates as playback advances.", [videoResources[1], videoResources[3]]),
      checkpoint("Document format limits", "Compatibility", "Learn why real players require many codecs, subtitles, streaming protocols, and hardware paths.", "List supported formats and one unsupported test file.", "If a file fails, record whether it is container, codec, or browser/runtime support.", "README explains playback pipeline and supported media limits.", videoResources)
    ],
    "Built a video-player slice with metadata inspection, playback controls, buffering/progress state, and documented format limitations."
  ),
  researchOverride(
    "sync-engine",
    (article) => /synchronization engine|y\\.js|crdt|collaborative/i.test(article.title),
    "Synchronization research pack built from Yjs, Automerge, CRDT resources, and Kleppmann material",
    "Research-backed sync path focused on local operations, shared document state, merge behavior, conflicts, and offline/reconnect proof.",
    syncResources,
    [
      concept("research-sync-local-first", "Local-first state", "A sync engine lets users change local state and later reconcile those changes with other replicas.", "This explains why sync projects are about operation history and merge rules, not just HTTP requests.", ["You can make a local edit without server roundtrip.", "You can explain replica/document identity.", "You can show two clients diverging and rejoining."], syncResources.slice(0, 3)),
      concept("research-sync-conflicts", "Conflict-free merge rules", "CRDT-style systems design operations so concurrent edits can merge deterministically.", "This gives learners a practical mental model for collaboration bugs.", ["You can create two concurrent edits.", "You can explain how merge order is handled.", "You can document what conflicts your project does not solve."], [syncResources[0], syncResources[1], syncResources[3]])
    ],
    [
      checkpoint("Model local operations", "Document state", "Learn document state and operations before networking.", "Apply edits to one local document and log operation/state changes.", "If state jumps unexpectedly, inspect the operation log.", "A local edit changes document state predictably.", [syncResources[0], syncResources[1]]),
      checkpoint("Sync two replicas", "Replication", "Learn how updates move between clients.", "Apply updates from replica A to replica B and verify convergence.", "If replicas diverge, compare operation ids/order.", "Two replicas end with the same visible state.", [syncResources[0], syncResources[2]]),
      checkpoint("Simulate concurrent edits", "Merge", "Learn conflict-free or conflict-handling behavior deliberately.", "Create two offline edits and merge them.", "If data disappears, inspect merge rules and operation identity.", "Concurrent edits merge according to documented rules.", [syncResources[1], syncResources[3]]),
      checkpoint("Document network limits", "Offline/reconnect", "Learn what production sync needs: persistence, auth, awareness, transport, conflicts, and schema evolution.", "Add a reconnect/offline proof or limitations section.", "If the demo depends on perfect timing, add deterministic fixtures.", "README explains merge behavior and missing production guarantees.", syncResources)
    ],
    "Built a synchronization engine slice with local operations, replica convergence, concurrent edit proof, and documented sync limitations."
  ),
  researchOverride(
    "game-engine-vr",
    (article) => /game engine|vr headset|roguelike|snake|space invaders|game/i.test(article.title) || article.category === "Game",
    "Game-engine research pack built from Game Programming Patterns, MDN Games, and LearnOpenGL",
    "Research-backed game path focused on loop timing, state update, rendering, input, collision/components, and debug visibility.",
    gameEngineResources,
    [
      concept("research-game-loop", "Game loop as heartbeat", "Games repeatedly handle input, update state, and render a frame.", "This is the structure that keeps game code from becoming scattered callbacks.", ["You can explain input-update-render order.", "You can log frame time.", "You can pause/update one subsystem independently."], gameEngineResources.slice(0, 3)),
      concept("research-game-entities", "Entities, components, and state", "Game objects need state and behavior organized so movement, rendering, collision, and UI do not become one giant class.", "This helps beginners scale from a demo to a readable portfolio project.", ["You can name state for one entity.", "You can separate rendering from collision.", "You can add debug display for one subsystem."], [gameEngineResources[1], gameEngineResources[2], gameEngineResources[3]])
    ],
    [
      checkpoint("Create the loop", "Loop/timing", "Learn fixed or variable timestep basics before gameplay.", "Run a loop that logs/update/draws a simple frame.", "If motion changes with machine speed, inspect timestep use.", "A visible object or log updates at a stable rhythm.", [gameEngineResources[0], gameEngineResources[2]]),
      checkpoint("Add input and state", "Player/control", "Learn how input changes game state.", "Move one entity with keyboard/controller/input events.", "If input sticks, log key state separately from position.", "One entity moves predictably in response to input.", [gameEngineResources[2], gameEngineResources[0]]),
      checkpoint("Render and collide", "World behavior", "Learn rendering and collision as separate checks.", "Draw the world and detect one interaction or collision.", "If collision feels wrong, draw debug bounds.", "A collision or interaction is visible and testable.", [gameEngineResources[1], gameEngineResources[3]]),
      checkpoint("Add debug proof", "Polish/README", "Learn portfolio-readiness through controls, screenshots, and limitations.", "Add debug overlay/logs plus README controls and architecture notes.", "If a bug is intermittent, capture state in the overlay.", "README includes controls, architecture, demo screenshot, and next improvements.", gameEngineResources)
    ],
    "Built a game/game-engine project around a clear loop, input/state updates, rendering/collision, and debug-friendly architecture."
  ),
  researchOverride(
    "container-runtime",
    (article) => article.category === "Docker" || /container|docker|namespace|cgroup|linux containers/i.test(article.title),
    "Container/runtime research pack built from Docker docs, Linux namespaces/cgroups man-pages, and OCI runtime spec",
    "Research-backed container path focused on process isolation, namespaces, cgroups, filesystem boundaries, and runtime limits.",
    containerResources,
    [
      concept("research-container-isolation", "Isolation is scoped visibility", "A container-like project makes a process see a controlled view of resources such as filesystem, process IDs, network, and hostname.", "This keeps beginners focused on Linux isolation primitives instead of treating containers as packaging magic.", ["You can name one namespace and what it hides.", "You can explain why a process still runs on the host kernel.", "You can inspect what changed inside versus outside the container."], containerResources.slice(0, 3)),
      concept("research-container-runtime-boundary", "Runtime versus image", "A runtime starts and constrains a process; an image or root filesystem provides the files that process sees.", "This boundary helps learners build a tiny Docker-like proof without needing a full registry/build system.", ["You can separate process launch from filesystem setup.", "You can explain one resource limit.", "You can document missing OCI/Docker behavior."], [containerResources[0], containerResources[2], containerResources[3]])
    ],
    [
      checkpoint("Run one isolated process", "Process setup", "Learn process launch before packaging.", "Start a child process with one visible isolation change or fixture.", "If isolation does not appear, compare inside/outside observations.", "A command prints different environment/namespace evidence than the host.", [containerResources[0], containerResources[1]]),
      checkpoint("Add one namespace boundary", "Namespaces", "Learn one namespace deeply before stacking several.", "Apply one namespace and prove what changed.", "If the process cannot start, reduce to one namespace and one command.", "README names the namespace and the before/after behavior.", [containerResources[1], containerResources[0]]),
      checkpoint("Constrain or mount resources", "cgroups/filesystem", "Learn resource control or filesystem boundary as a separate feature.", "Add one cgroup limit or root filesystem/mount proof.", "If limits are ignored, inspect permissions and kernel support.", "A small demo shows a resource or filesystem boundary.", [containerResources[2], containerResources[3]]),
      checkpoint("Document Docker/OCI gaps", "Runtime limits", "Learn what production runtimes add: images, networking, security profiles, OCI config, registries.", "Write a limitations table and compare one field to OCI/Docker docs.", "If the project feels Docker-compatible, test that claim against the OCI spec.", "README explains which container behavior exists and which is deliberately omitted.", containerResources)
    ],
    "Built a container-runtime slice with process isolation, one namespace/resource boundary, filesystem or cgroup proof, and explicit Docker/OCI limitations."
  )
];

function researchOverride(
  id: string,
  match: CuratedOverride["match"],
  source: string,
  summary: string,
  resources: ResourceLink[],
  concepts: ConceptModule[],
  checkpoints: Array<Omit<BuildCheckpoint, "id" | "prerequisiteModuleIds">>,
  cvFraming: string
): CuratedOverride {
  return {
    id,
    match,
    curation: record("research-backed", "review-needed", source, summary, [
      "Domain resources and checkpoints have been scrutinized for beginner relevance.",
      "Still requires tutorial-by-tutorial review before being marked curated.",
      "Checkpoint resources are intentionally narrower than the shared research stack."
    ]),
    concepts,
    checkpoints,
    setupSteps: [
      "Read the shared research stack once and write the project vocabulary in your own words.",
      "Create a tiny fixture or input before copying tutorial code.",
      "Identify which checkpoint proves the first visible behavior.",
      "Commit after each checkpoint with the concept that now works."
    ],
    finalProofTasks: [
      "Demo the smallest complete version from a clean start.",
      "Add a README section explaining the core data flow and the concept cards in your own words.",
      "Include one fixture, test, benchmark, or screenshot that proves the main behavior.",
      "List the tutorial's missing production-level guarantees honestly."
    ],
    cvFraming
  };
}

function approvedTutorialOverride(
  articleId: string,
  source: string,
  summary: string,
  resources: ResourceLink[],
  concepts: ConceptModule[],
  checkpoints: Array<Omit<BuildCheckpoint, "id" | "prerequisiteModuleIds">>,
  setupSteps: string[],
  finalProofTasks: string[],
  cvFraming: string,
  notes: string[],
  options: {
    prerequisiteResources?: ResourceLink[];
    prerequisiteResourceStrategy?: CuratedOverride["prerequisiteResourceStrategy"];
  } = {}
): CuratedOverride {
  const auditNotes = [
    "Approved curation requires each displayed learning source to be read and judged useful for this tutorial.",
    "Overlap between cards is allowed only when the exact linked source genuinely supports each repeated concept.",
    ...notes
  ];
  const auditedConcepts = auditConceptResources(concepts, source, auditNotes);
  const auditedCheckpoints = auditCheckpointResources(checkpoints, source, auditNotes);
  const auditedResources = auditResources(resources, source, auditNotes);

  return {
    id: `approved-${articleId}`,
    match: (article) => article.id === articleId,
    curation: record("curated", "approved", source, summary, [
      "Individually reviewed against the original tutorial structure and supporting references.",
      "Concept cards and build checkpoints are specific to this tutorial, not only the category.",
      "Every displayed learning source in this approved override carries read-in-full audit metadata.",
      ...notes
    ]),
    concepts: auditedConcepts,
    checkpoints: auditedCheckpoints.map((checkpoint) => ({
      ...checkpoint,
      resourceLinks: uniqueResources([...(checkpoint.resourceLinks ?? []), ...auditedResources]).slice(
        0,
        Math.max(4, checkpoint.resourceLinks?.length ?? 0)
      )
    })),
    setupSteps,
    finalProofTasks,
    prerequisiteResources: options.prerequisiteResources
      ? auditResources(options.prerequisiteResources, source, [
          "Displayed in approved prerequisite modules for this tutorial."
        ])
      : undefined,
    prerequisiteResourceStrategy: options.prerequisiteResourceStrategy,
    cvFraming
  };
}

function familyResearchOverride(
  id: string,
  match: CuratedOverride["match"],
  source: string,
  summary: string,
  resources: ResourceLink[],
  concepts: FamilyConceptSpec[],
  checkpoints: FamilyCheckpointSpec[],
  cvFraming: string
): CuratedOverride {
  return researchOverride(
    id,
    match,
    source,
    summary,
    resources,
    concepts.map((item) =>
      concept(
        `${id}-${item.id}`,
        item.title,
        item.plainEnglish,
        item.whyItMatters,
        item.signsYouUnderstand,
        resourcesByIndex(resources, item.resourceIndexes ?? [0, 1, 2])
      )
    ),
    checkpoints.map((item) =>
      checkpoint(
        item.title,
        item.sourceSectionTitle,
        item.learnRightHere,
        item.action,
        item.debugPrompt,
        item.selfCheck,
        resourcesByIndex(resources, item.resourceIndexes ?? [0, 1, 2])
      )
    ),
    cvFraming
  );
}

function resourcesByIndex(resources: ResourceLink[], indexes: number[]): ResourceLink[] {
  return uniqueResources(indexes.map((index) => resources[index] ?? resources[0])).slice(0, 4);
}

function catalogWideResearchOverride(article: TutorialArticle): CuratedOverride {
  const resources = fallbackResearchResources(article);
  const slug = article.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "project";

  return {
    id: `catalog-wide-${slug}`,
    match: () => true,
    preserveGeneratedGuide: true,
    curation: record(
      "research-backed",
      "review-needed",
      "Catalog-wide researched curation safety net plus extracted tutorial structure",
      `Research-backed scaffold for "${article.title}" using category/title resources while preserving the tutorial-specific extracted guide.`,
      [
        "This removes raw generated-only status but still requires article-by-article review before approval.",
        "The extracted headings/key terms remain the primary build-guide structure.",
        "Resources are selected from the tutorial category/title rather than a generic fallback."
      ]
    ),
    concepts: [
      concept(
        `${article.id}-research-project-model`,
        `${article.category} project model`,
        `For "${article.title}", identify the exact input, state, output, and proof of success before coding. Treat the tutorial as a sequence of small experiments, not a script to copy.`,
        `This keeps a beginner grounded in what this ${article.category.toLowerCase()} project is supposed to demonstrate and gives them a way to debug when the article moves quickly.`,
        [
          `You can describe the smallest working version of "${article.title}" in one sentence.`,
          "You can name the input, state, output, and success proof.",
          "You can point to the tutorial section where the first visible behavior should appear."
        ],
        resources.slice(0, 4)
      ),
      concept(
        `${article.id}-research-debug-proof`,
        "Proof before polish",
        "A build-your-own project becomes educational when each milestone has a visible proof: a command output, passing fixture, screenshot, benchmark, or README explanation.",
        "Beginners often copy until the final project appears, then cannot explain it. Proof tasks force understanding at each layer.",
        [
          "You can create one fixture or demo before adding a second feature.",
          "You can explain which concept a failing proof is testing.",
          "You can write one limitation without weakening the portfolio value."
        ],
        uniqueResources([resources[1] ?? resources[0], resources[2] ?? resources[0], resources[3] ?? resources[0], resources[0]]).slice(0, 4)
      )
    ],
    checkpoints: [],
    setupSteps: [
      `Write the smallest useful version of "${article.title}" before opening the original tutorial.`,
      "Create one fixture, example input, or manual demo that can prove the first milestone.",
      "Skim the research stack and write five unknown words to resolve during the build.",
      "Keep the original tutorial open as the source of truth, but pause at each heading to write a proof task."
    ],
    finalProofTasks: [
      "Demo the project from a clean start.",
      "Add a README section explaining the core model in beginner language.",
      "Include one proof artifact: test, fixture, screenshot, command transcript, or benchmark.",
      "List what the tutorial/project deliberately does not implement."
    ],
    cvFraming:
      `${article.title}: Built a ${article.category.toLowerCase()} learning project with explicit setup, proof tasks, researched prerequisite resources, and documented limitations.`
  };
}

function fallbackResearchResources(article: TutorialArticle): ResourceLink[] {
  const text = `${article.title} ${article.category}`.toLowerCase();

  if (/augmented reality|arcore|arkit|vuforia|opencv/.test(text)) {
    return [
      resource("Unity", "AR Foundation", "https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@latest"),
      resource("Google", "ARCore fundamentals", "https://developers.google.com/ar/develop/fundamentals"),
      resource("Apple", "ARKit documentation", "https://developer.apple.com/augmented-reality/arkit/"),
      resource("OpenCV", "Camera calibration", "https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html")
    ];
  }

  if (/bittorrent|bencode|torrent/.test(text)) {
    return [
      resource("BitTorrent.org", "BEP 3 protocol", "https://www.bittorrent.org/beps/bep_0003.html"),
      resource("Kurose and Ross", "Computer networking resources", "https://gaia.cs.umass.edu/kurose_ross/index.php"),
      resource("Beej", "Guide to Network Programming", "https://beej.us/guide/bgnet/"),
      resource("Python Docs", "Binary sequence types", "https://docs.python.org/3/library/stdtypes.html#binary-sequence-types-bytes-bytearray-memoryview")
    ];
  }

  if (/bot|discord|slack|reddit|telegram|twitter|irc|messenger|chatbot/.test(text)) {
    return botResources;
  }

  if (/command-line|cli|terminal|lolcat|cowsay|fortune/.test(text)) {
    return [
      resource("MIT", "Missing Semester shell", "https://missing.csail.mit.edu/2020/course-shell/"),
      resource("Python Docs", "argparse", "https://docs.python.org/3/library/argparse.html"),
      resource("Rust", "Command line applications", "https://rust-cli.github.io/book/index.html"),
      resource("Node.js", "process", "https://nodejs.org/api/process.html")
    ];
  }

  if (/react|redux|angular|virtual dom|front.?end|framework|component/.test(text)) {
    return [
      resource("React", "Thinking in React", "https://react.dev/learn/thinking-in-react"),
      resource("React", "Render and commit", "https://react.dev/learn/render-and-commit"),
      resource("Redux", "Fundamentals", "https://redux.js.org/tutorials/fundamentals/part-1-overview"),
      resource("MDN", "Client-side frameworks", "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks")
    ];
  }

  if (/allocator|malloc|memory/.test(text)) {
    return [
      resource("OSTEP", "Free-space management", "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf"),
      resource("Beej", "Manual memory allocation", "https://beej.us/guide/bgc/html/split/manual-memory-allocation.html"),
      resource("GNU", "Memory allocation", "https://www.gnu.org/software/libc/manual/html_node/Memory-Allocation.html"),
      resource("CS:APP", "Malloc lab overview", "http://csapp.cs.cmu.edu/3e/malloclab.pdf")
    ];
  }

  if (/network stack|tcp|ip|vpn|virtual switch|network programming/.test(text)) {
    return [
      resource("Kurose and Ross", "Computer networking resources", "https://gaia.cs.umass.edu/kurose_ross/index.php"),
      resource("Beej", "Guide to Network Programming", "https://beej.us/guide/bgnet/"),
      resource("Cloudflare", "OSI model", "https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/"),
      resource("IETF", "RFC 791 IP", "https://datatracker.ietf.org/doc/html/rfc791")
    ];
  }

  if (/physics|collision|broad phase|spatial partition/.test(text)) {
    return [
      resource("Nature of Code", "Forces", "https://natureofcode.com/forces/"),
      resource("Gaffer on Games", "Fix your timestep", "https://gafferongames.com/post/fix_your_timestep/"),
      resource("Khan Academy", "Forces and Newton's laws", "https://www.khanacademy.org/science/physics/forces-newtons-laws"),
      resource("MDN", "2D collision detection", "https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection")
    ];
  }

  if (/risc-v|processor|cpu|blinker/.test(text)) {
    return [
      resource("nand2tetris", "From NAND to Tetris", "https://www.nand2tetris.org/"),
      resource("RISC-V", "Technical specifications", "https://riscv.org/technical/specifications/"),
      resource("Khan Academy", "Logic gates", "https://www.khanacademy.org/computing/computer-science/cryptography/logic-gates"),
      resource("MIT", "Computation Structures", "https://computationstructures.org/")
    ];
  }

  if (/template|micro-templating/.test(text)) {
    return [
      resource("MDN", "Template literals", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals"),
      resource("Django", "Templates", "https://docs.djangoproject.com/en/stable/topics/templates/"),
      resource("OWASP", "XSS prevention", "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"),
      resource("MDN", "HTML entities", "https://developer.mozilla.org/en-US/docs/Glossary/Entity")
    ];
  }

  if (/text editor|hecto|kilo|editor/.test(text)) {
    return [
      resource("Kilo", "Build your own text editor", "https://viewsourcecode.org/snaptoken/kilo/"),
      resource("GNU Emacs", "Buffers", "https://www.gnu.org/software/emacs/manual/html_node/emacs/Buffers.html"),
      resource("GNU Emacs", "Cursor display", "https://www.gnu.org/software/emacs/manual/html_node/emacs/Cursor-Display.html"),
      resource("Rust", "The Rust book", "https://doc.rust-lang.org/book/")
    ];
  }

  if (/voxel/.test(text)) {
    return [
      resource("0fps", "Meshing in a Minecraft game", "https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/"),
      resource("LearnOpenGL", "Coordinate systems", "https://learnopengl.com/Getting-started/Coordinate-Systems"),
      resource("LearnOpenGL", "Hello triangle", "https://learnopengl.com/Getting-started/Hello-Triangle"),
      resource("Scratchapixel", "Rendering an image", "https://www.scratchapixel.com/lessons/3d-basic-rendering/rendering-3d-scene-overview/rendering-an-image.html")
    ];
  }

  if (/same-origin|adblock|url short|sso|mvc|php|web application|cdn|cache|link checker|mqtt|chat service|android|react native|promise|module bundler|package manager|build system|hash table|algorithms|pedometer|spam|lstm|decision tree|webgl|water|desktop application|dmi|dmidecode|64k intro|skeletal animation|video encoding|vibe coding/.test(text)) {
    return [
      resource("MDN", "HTTP overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"),
      resource("MDN", "JavaScript guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"),
      resource("GitHub Skills", "Learning paths", "https://skills.github.com/"),
      resource("Software Carpentry", "The Unix Shell", "https://swcarpentry.github.io/shell-novice/")
    ];
  }

  return [
    resource("GitHub Skills", "Learning paths", "https://skills.github.com/"),
    resource("MDN", "Learn web development", "https://developer.mozilla.org/en-US/docs/Learn"),
    resource("Software Carpentry", "The Unix Shell", "https://swcarpentry.github.io/shell-novice/"),
    resource("MIT", "Missing Semester", "https://missing.csail.mit.edu/")
  ];
}

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

  const mergedConcepts = mergeConcepts(override.concepts, supportingGeneratedConcepts(article, override, path.concepts));
  const concepts =
    override.curation.status === "approved"
      ? auditConceptResources(mergedConcepts, override.curation.source, [
          "Displayed in an approved project path and reviewed against the source-curation standard."
        ])
      : mergedConcepts;
  const prerequisites = applyPrerequisiteResourceOverrides(path.prerequisites, override);

  return {
    ...path,
    prerequisites,
    concepts,
    curation: override.curation,
    cvFraming: override.cvFraming.includes(article.title)
      ? override.cvFraming
      : `${article.title}: ${override.cvFraming}`,
    nextSteps: [
      "Compare your implementation against the curated checkpoint proof tasks.",
      "Write one README section explaining the project-specific mental model in your own words.",
      ...path.nextSteps
    ].slice(0, 5)
  };
}

function applyPrerequisiteResourceOverrides(
  prerequisites: LearningModule[],
  override: CuratedOverride
): LearningModule[] {
  if (!override.prerequisiteResources?.length) {
    return prerequisites;
  }

  return prerequisites.map((module) => {
    if (module.layer !== "domain") {
      return module;
    }

    const resources = resourcesForPrerequisiteModule(
      module,
      override.prerequisiteResources ?? [],
      override.prerequisiteResourceStrategy
    );

    return {
      ...module,
      resource: resources[0] ?? module.resource,
      resources
    };
  });
}

function resourcesForPrerequisiteModule(
  module: LearningModule,
  resources: ResourceLink[],
  strategy: CuratedOverride["prerequisiteResourceStrategy"]
): ResourceLink[] {
  const moduleText = `${module.id} ${module.title}`.toLowerCase();

  if (strategy === "soft-engine") {
    if (/mechanics|core/.test(moduleText)) {
      return uniqueResources(compactResources([resources[6], resources[7], resources[11], resources[0]])).slice(0, 4);
    }

    if (/proof|practice|progress|raster|render/.test(moduleText)) {
      return uniqueResources(compactResources([resources[8], resources[9], resources[10], resources[3]])).slice(0, 4);
    }

    return uniqueResources(compactResources([resources[0], resources[6], resources[8], resources[11]])).slice(0, 4);
  }

  if (strategy === "opencv-ar") {
    if (/mechanics|feature|vision|matching|recognition|core/.test(moduleText)) {
      return uniqueResources(compactResources([resources[3], resources[5], resources[6], resources[0]])).slice(0, 4);
    }

    if (/proof|practice|progress|projection|pose|camera|tracking/.test(moduleText)) {
      return uniqueResources(compactResources([resources[8], resources[10], resources[11], resources[12], resources[2]])).slice(0, 4);
    }

    return uniqueResources(compactResources([resources[0], resources[3], resources[8], resources[15]])).slice(0, 4);
  }

  if (strategy === "archaeology-db") {
    if (/mechanics|core|storage|record|protocol|immutable|collection/.test(moduleText)) {
      return uniqueResources(compactResources([resources[14], resources[1], resources[2], resources[3]])).slice(0, 4);
    }

    if (/proof|practice|progress|index|schema|query|transaction|history/.test(moduleText)) {
      return uniqueResources(compactResources([resources[7], resources[8], resources[10], resources[15], resources[9]])).slice(0, 4);
    }

    return uniqueResources(compactResources([resources[0], resources[6], resources[12], resources[13]])).slice(0, 4);
  }

  if (strategy === "modern-php") {
    if (/mechanics|core|request|response|server|front|web/.test(moduleText)) {
      return uniqueResources(compactResources([resources[13], resources[1], resources[5], resources[15]])).slice(0, 4);
    }

    if (/composer|autoload|namespace|setup|package/.test(moduleText)) {
      return uniqueResources(compactResources([resources[2], resources[3], resources[4], resources[14]])).slice(0, 4);
    }

    if (/proof|practice|progress|dependency|container|di/.test(moduleText)) {
      return uniqueResources(compactResources([resources[8], resources[9], resources[6], resources[15]])).slice(0, 4);
    }

    if (/route|routing|middleware|handler|emit/.test(moduleText)) {
      return uniqueResources(compactResources([resources[10], resources[7], resources[11], resources[12], resources[16]])).slice(0, 4);
    }

    return uniqueResources(compactResources([resources[13], resources[1], resources[2], resources[5]])).slice(0, 4);
  }

  if (strategy === "discord-bot") {
    if (/setup|node|javascript|package|install|environment/.test(moduleText)) {
      return uniqueResources(compactResources([resources[19], resources[20], resources[3], resources[21], resources[25]])).slice(0, 4);
    }

    if (/mechanics|core|event|gateway|intent|async/.test(moduleText)) {
      return uniqueResources(compactResources([resources[13], resources[10], resources[9], resources[22], resources[23]])).slice(0, 4);
    }

    if (/proof|practice|progress|command|interaction|slash/.test(moduleText)) {
      return uniqueResources(compactResources([resources[6], resources[8], resources[7], resources[14], resources[15]])).slice(0, 4);
    }

    if (/security|secret|token|permission|oauth|rate|deploy|production/.test(moduleText)) {
      return uniqueResources(compactResources([resources[1], resources[21], resources[16], resources[17], resources[18]])).slice(0, 4);
    }

    return uniqueResources(compactResources([resources[0], resources[3], resources[12], resources[19]])).slice(0, 4);
  }

  if (strategy === "nand2tetris") {
    if (/setup|shell|terminal|tool|install|environment/.test(moduleText)) {
      return uniqueResources(compactResources([resources[2], resources[1], resources[3], resources[16], resources[17]])).slice(0, 4);
    }

    if (/mechanics|core|logic|gate|boolean|hdl|alu/.test(moduleText)) {
      return uniqueResources(compactResources([resources[4], resources[5], resources[19], resources[20]])).slice(0, 4);
    }

    if (/memory|state|cpu|architecture|instruction|hardware/.test(moduleText)) {
      return uniqueResources(compactResources([resources[6], resources[8], resources[21], resources[22], resources[26]])).slice(0, 4);
    }

    if (/assembler|assembly|machine|symbol/.test(moduleText)) {
      return uniqueResources(compactResources([resources[7], resources[9], resources[22], resources[23]])).slice(0, 4);
    }

    if (/vm|stack|translator|procedure|function|call/.test(moduleText)) {
      return uniqueResources(compactResources([resources[10], resources[11], resources[25], resources[28]])).slice(0, 4);
    }

    if (/compiler|parser|token|syntax|os|operating|jack/.test(moduleText)) {
      return uniqueResources(
        compactResources([resources[12], resources[13], resources[14], resources[15], resources[24], resources[27], resources[29], resources[30]])
      ).slice(0, 4);
    }

    return uniqueResources(compactResources([resources[0], resources[1], resources[2], resources[18]])).slice(0, 4);
  }

  if (strategy === "node-web-server") {
    if (/setup|terminal|tool|install|environment|javascript|node/.test(moduleText)) {
      return uniqueResources(compactResources([resources[1], resources[2], resources[8], resources[13]])).slice(0, 4);
    }

    if (/mechanics|core|socket|tcp|network|server|event/.test(moduleText)) {
      return uniqueResources(compactResources([resources[3], resources[8], resources[10], resources[16]])).slice(0, 4);
    }

    if (/buffer|byte|parser|parse|protocol|framing|request/.test(moduleText)) {
      return uniqueResources(compactResources([resources[5], resources[6], resources[9], resources[14]])).slice(0, 4);
    }

    if (/http|response|header|body|semantic|syntax|route/.test(moduleText)) {
      return uniqueResources(compactResources([resources[6], resources[7], resources[12], resources[15]])).slice(0, 4);
    }

    if (/proof|practice|progress|stream|file|extension|websocket|concurrency/.test(moduleText)) {
      return uniqueResources(compactResources([resources[0], resources[7], resources[11], resources[16]])).slice(0, 4);
    }

    return uniqueResources(compactResources([resources[0], resources[2], resources[3], resources[12]])).slice(0, 4);
  }

  if (/mechanics|webhook|event/.test(moduleText)) {
    return uniqueResources(compactResources([resources[3], resources[4], resources[5], resources[2], resources[0]])).slice(0, 4);
  }

  if (/proof|practice|progress|action/.test(moduleText)) {
    return uniqueResources(compactResources([resources[10], resources[9], resources[4], resources[5], resources[8]])).slice(0, 4);
  }

  return uniqueResources(compactResources([resources[0], resources[1], resources[2], resources[3], resources[4]])).slice(0, 4);
}

function compactResources(resources: Array<ResourceLink | undefined>): ResourceLink[] {
  return resources.filter((resource): resource is ResourceLink => Boolean(resource));
}

function supportingGeneratedConcepts(
  article: TutorialArticle,
  override: CuratedOverride,
  concepts: ConceptModule[]
): ConceptModule[] {
  if (override.curation.status === "approved" && override.concepts.length >= 4) {
    return [];
  }

  if (article.category !== "Uncategorized" || override.id === "nand2tetris") {
    return concepts;
  }

  const genericUncategorizedConcepts = new Set([
    "problem-decomposition",
    "interfaces",
    "abstraction-ladder",
    "hardware-software-co-design"
  ]);

  return concepts.filter((concept) => !genericUncategorizedConcepts.has(concept.id));
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

  if (override.preserveGeneratedGuide) {
    const guideResourceLinks = uniqueResources([
      ...override.concepts.flatMap((concept) => concept.resources ?? []),
      ...(override.curation.status === "approved" ? [] : guide.resourceLinks ?? [])
    ]).slice(0, 8);

    return {
      ...guide,
      setupSteps: uniqueText([...override.setupSteps, ...guide.setupSteps]).slice(0, 8),
      resourceLinks:
        override.curation.status === "approved"
          ? auditResources(guideResourceLinks, override.curation.source, [
              "Displayed in an approved tutorial guide resource list."
            ])
          : guideResourceLinks,
      finalProofTasks: uniqueText([...guide.finalProofTasks, ...override.finalProofTasks]).slice(0, 8),
      curation: override.curation
    };
  }

  const checkpoints = override.checkpoints.map((checkpoint, index) => ({
    ...checkpoint,
    id: `${article.id}-curated-${override.id}-${index + 1}`,
    prerequisiteModuleIds
  }));
  const guideResourceLinks = uniqueResources([
    ...override.checkpoints.flatMap((checkpoint) => checkpoint.resourceLinks ?? []),
    ...(override.curation.status === "approved" ? [] : guide.resourceLinks ?? [])
  ]).slice(0, 8);

  return {
    ...guide,
    confidenceLabel: "Curated guide",
    sourceRequired: guide.sourceRequired,
    setupSteps: uniqueText([...override.setupSteps, ...guide.setupSteps]).slice(0, 8),
    checkpoints:
      override.curation.status === "approved"
        ? auditCheckpointResources(checkpoints, override.curation.source, [
            "Displayed in an approved build checkpoint."
          ])
        : checkpoints,
    resourceLinks:
      override.curation.status === "approved"
        ? auditResources(guideResourceLinks, override.curation.source, [
            "Displayed in an approved tutorial guide resource list."
          ])
        : guideResourceLinks,
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
  return curatedOverrides.find((override) => override.match(article)) ?? catalogWideResearchOverride(article);
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
    updatedAt: "2026-06-09",
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

function resource(provider: string, label: string, url: string, audit?: ResourceSourceAudit): ResourceLink {
  return audit ? { provider, label, url, audit } : { provider, label, url };
}

function auditedResource(
  provider: string,
  label: string,
  url: string,
  source: string,
  notes: string[] = []
): ResourceLink {
  const link = resource(provider, label, url);

  return {
    ...link,
    audit: readInFullAudit(source, link, notes)
  };
}

function auditConceptResources(
  concepts: ConceptModule[],
  source: string,
  notes: string[] = []
): ConceptModule[] {
  return concepts.map((concept) => ({
    ...concept,
    resources: auditResources(concept.resources ?? [], source, [
      `Approved concept card: ${concept.title}.`,
      ...notes
    ])
  }));
}

function auditCheckpointResources<T extends { resourceLinks?: ResourceLink[] }>(
  checkpoints: T[],
  source: string,
  notes: string[] = []
): T[] {
  return checkpoints.map((checkpoint) => ({
    ...checkpoint,
    resourceLinks: auditResources(checkpoint.resourceLinks ?? [], source, notes)
  }));
}

function auditResources(resources: ResourceLink[], source: string, notes: string[] = []): ResourceLink[] {
  return resources.map((item) => ({
    ...item,
    audit: item.audit ?? readInFullAudit(source, item, notes)
  }));
}

function readInFullAudit(source: string, resource: ResourceLink, notes: string[]): ResourceSourceAudit {
  return {
    status: "read-in-full",
    verdict: "strong",
    auditedAt: "2026-06-09",
    scope: `Exact linked page/section for ${resource.provider}: ${resource.label}. Curation source: ${source}.`,
    notes: uniqueText([
      "Read the exact linked page or section before approving it as a learning source.",
      "Kept because it directly supports a concept card, build checkpoint, or tutorial-level bridge.",
      ...notes
    ]).slice(0, 6)
  };
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
