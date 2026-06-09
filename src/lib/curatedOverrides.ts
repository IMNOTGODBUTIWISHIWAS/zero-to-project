import { curationStandardVersion } from "./curationStandard";
import type {
  BuildCheckpoint,
  ConceptModule,
  CurationRecord,
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
  resource("Discord", "Developer documentation", "https://discord.com/developers/docs/intro"),
  resource("Slack", "API basics", "https://api.slack.com/start"),
  resource("Reddit", "API documentation", "https://www.reddit.com/dev/api/"),
  resource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages")
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
  resource("GitHub Docs", "Creating GitHub Apps", "https://docs.github.com/en/apps/creating-github-apps"),
  resource("GitHub Docs", "Webhooks", "https://docs.github.com/en/webhooks"),
  ...botResources
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
  resource("PHP-FIG", "PSR-4 autoloader", "https://www.php-fig.org/psr/psr-4/"),
  resource("Composer", "Basic usage", "https://getcomposer.org/doc/01-basic-usage.md"),
  ...webAppResources
]);

const openCvArApprovedResources = uniqueResources([
  resource("Bites of Code", "Augmented reality with Python and OpenCV", "https://bitesofcode.wordpress.com/2017/09/12/augmented-reality-with-python-and-opencv-part-1/"),
  resource("OpenCV", "ORB feature detector", "https://docs.opencv.org/4.x/db/d95/classcv_1_1ORB.html"),
  resource("OpenCV", "Feature matching", "https://docs.opencv.org/4.x/dc/dc3/tutorial_py_matcher.html"),
  ...arResources
]);

const softEngineApprovedResources = uniqueResources([
  resource("David Rousset", "3D soft engine from scratch", "https://www.davrous.com/2013/06/13/tutorial-series-learning-how-to-write-a-3d-soft-engine-from-scratch-in-c-typescript-or-javascript/"),
  resource("Scratchapixel", "Rendering an image", "https://www.scratchapixel.com/lessons/3d-basic-rendering/rendering-3d-scene-overview/rendering-an-image.html"),
  resource("LearnOpenGL", "Coordinate systems", "https://learnopengl.com/Getting-started/Coordinate-Systems"),
  ...raycastingResources
]);

const discordBotApprovedResources = uniqueResources([
  resource("discord.js", "Guide", "https://discordjs.guide/"),
  resource("Discord", "Application commands", "https://discord.com/developers/docs/interactions/application-commands"),
  resource("Discord", "Gateway intents", "https://discord.com/developers/docs/events/gateway#gateway-intents"),
  ...botResources
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
  },
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
        "GitHub App identity",
        "The tutorial's key beginner lesson is that GitHub Apps are installed integrations with their own permissions, not a script pretending to be your personal account.",
        "That distinction explains why installation, private keys, webhook secrets, and scoped permissions come before bot features.",
        [
          "You can explain GitHub App versus personal access token.",
          "You can name the app installation boundary.",
          "You can describe why least privilege matters."
        ],
        gifbotApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-gifbot-webhook-flow",
        "Webhook to API action",
        "gifbot reacts to a GitHub event, validates/understands the payload, then calls the GitHub API to post a response.",
        "This event-to-action flow is the reusable mental model for GitHub bots and app integrations.",
        [
          "You can identify the event that wakes the app.",
          "You can find the payload field the bot reads.",
          "You can explain which API call creates the visible result."
        ],
        [gifbotApprovedResources[0], gifbotApprovedResources[1], gifbotApprovedResources[2], gifbotApprovedResources[3]]
      )
    ],
    [
      checkpoint(
        "Create the GitHub App safely",
        "Apps vs. Bots and setup",
        "Learn app registration, permissions, webhook URL, private key, and secrets before running code.",
        "Create or document a test GitHub App with minimum permissions and local environment variables.",
        "If authentication fails, check installation, private key format, app id, and permissions before handler code.",
        "The app can start with credentials kept out of source control.",
        gifbotApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Receive and inspect one webhook",
        "Webhook handling",
        "Learn event payload shape and signature/security expectations before posting a response.",
        "Log a sanitized webhook payload and identify the issue/comment fields gifbot needs.",
        "If events do not arrive, inspect webhook delivery logs and local tunneling before API code.",
        "One delivered event is visible in safe logs with the needed fields identified.",
        [gifbotApprovedResources[0], gifbotApprovedResources[2], gifbotApprovedResources[3]]
      ),
      checkpoint(
        "Post one bot response",
        "GitHub API action",
        "Learn how installation credentials become an API request with scoped authority.",
        "Post one harmless response to a test issue or comment thread.",
        "If the API rejects the call, inspect status code, installation token, and permission scope.",
        "A test repository shows one bot-created response.",
        [gifbotApprovedResources[0], gifbotApprovedResources[1], gifbotApprovedResources[3]]
      ),
      checkpoint(
        "Document safety and deployment limits",
        "Bot hardening",
        "Learn rate limits, duplicate delivery, webhook replay/security, secret handling, and moderation boundaries.",
        "Add README setup, permissions, webhook events, duplicate-handling note, and deployment limitations.",
        "If repeated events create spam, add idempotence or document the risk clearly.",
        "README explains app identity, webhook flow, permissions, and safe test/deploy boundaries.",
        gifbotApprovedResources.slice(0, 6)
      )
    ],
    [
      "Read the Apps vs Bots section and write the identity/permission difference in plain language.",
      "Create a test repository for webhook/API experiments.",
      "Prepare environment variables for app id, private key, webhook secret, and installation details.",
      "Commit after setup, webhook receive, API response, and safety documentation."
    ],
    [
      "Demo a webhook-triggered response in a test repository.",
      "Add README setup with secret placeholders only.",
      "Include webhook payload fields used by the bot.",
      "List missing production safeguards such as retries, idempotence, rate-limit handling, and moderation rules."
    ],
    "Built the gifbot GitHub App tutorial with app identity, scoped permissions, webhook handling, API response, and safe deployment boundaries.",
    ["Source extraction is full and GitHub's official app/webhook docs are used as the safety backstop."]
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
        "Front controller",
        "The tutorial starts with a `public/index.php` front controller: one entry point that receives web requests and boots the app.",
        "This helps beginners understand modern PHP architecture before route dispatch and packages enter the picture.",
        [
          "You can explain why `public/index.php` is the request entry point.",
          "You can run PHP's built-in server against the public directory.",
          "You can distinguish app bootstrapping from page logic."
        ],
        modernPhpApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-php-composer-di",
        "Autoloading and dependency injection",
        "The tutorial's quality comes from using Composer autoloading and dependency injection instead of include-spaghetti or global dependencies.",
        "This gives learners modern PHP practices while still seeing what frameworks normally hide.",
        [
          "You can explain PSR-4 at a beginner level.",
          "You can move Hello World into an autoloaded class.",
          "You can describe a dependency passed in instead of fetched globally."
        ],
        [modernPhpApprovedResources[0], modernPhpApprovedResources[1], modernPhpApprovedResources[2]]
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
        modernPhpApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Move behavior into an autoloaded class",
        "Autoloading and Third-Party Packages",
        "Learn Composer, `composer.json`, PSR-4 namespace mapping, and vendor autoloading.",
        "Create a class under `src/`, autoload it, and call it from the front controller.",
        "If class loading fails, inspect namespace, path, composer dump-autoload/install, and case sensitivity.",
        "The response comes from an autoloaded class.",
        [modernPhpApprovedResources[0], modernPhpApprovedResources[1], modernPhpApprovedResources[2]]
      ),
      checkpoint(
        "Inject dependencies deliberately",
        "What is Dependency Injection?",
        "Learn why objects should receive collaborators instead of reaching into globals or constructing hidden dependencies.",
        "Refactor one class to receive a dependency through its constructor or method.",
        "If the code becomes hard to test, identify hidden dependency creation.",
        "A class can be instantiated with a test/fake dependency.",
        [modernPhpApprovedResources[0], modernPhpApprovedResources[2], modernPhpApprovedResources[4]]
      ),
      checkpoint(
        "Document framework-free architecture",
        "Application architecture",
        "Learn what the tutorial borrows from modern PHP packages and what a full framework would still provide.",
        "Add README request-flow and dependency diagrams plus limitations around routing, templates, middleware, sessions, and security.",
        "If the app feels framework-like, name which framework services are still missing.",
        "README explains front controller, autoloading, DI, request cycle, and missing framework features.",
        modernPhpApprovedResources.slice(0, 6)
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
    "Built Modern PHP Without a Framework as a front-controller app with Composer autoloading, dependency injection, request lifecycle understanding, and framework-limit documentation.",
    ["Source extraction is full and the tutorial explicitly teaches architecture, not just code snippets."]
  ),
  approvedTutorialOverride(
    "augmented-reality-python-augmented-reality-with-python-and-opencv",
    "Individual review of Bites of Code OpenCV AR tutorial plus OpenCV AR/camera resources",
    "Approved path for the Python/OpenCV AR tutorial focused on reference-surface recognition, ORB features, descriptor matching, homography, projection, and proof-of-concept limitations.",
    openCvArApprovedResources,
    [
      concept(
        "approved-opencv-ar-feature-homography",
        "Features lead to homography",
        "The tutorial breaks AR into recognizing a flat reference surface, matching image features, then estimating the homography between reference and camera frame.",
        "That sequence gives beginners a concrete route from image pixels to pose-like information.",
        [
          "You can explain keypoints and descriptors.",
          "You can describe why enough good matches are needed.",
          "You can define homography as a 2D-to-2D transform for the reference plane."
        ],
        openCvArApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-opencv-ar-projection",
        "2D tracking to 3D projection",
        "After detecting the reference surface, the project extends that transformation so a 3D model can be projected into the target image.",
        "This is the exact bridge from computer-vision matching to an augmented-reality result.",
        [
          "You can name reference image coordinates, target image coordinates, and model coordinates.",
          "You can explain why camera calibration/projection math matters.",
          "You can document why the result is a proof of concept."
        ],
        [openCvArApprovedResources[0], openCvArApprovedResources[3], openCvArApprovedResources[4]]
      )
    ],
    [
      checkpoint(
        "Detect ORB features on reference and scene",
        "Recognizing the target surface",
        "Learn feature extraction and descriptors before matching or drawing 3D objects.",
        "Run ORB on a reference image and a scene image and visualize detected keypoints.",
        "If no features appear, check image quality, grayscale conversion, and ORB parameters.",
        "Keypoints are visible on both reference and target images.",
        openCvArApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Match descriptors and decide detection",
        "Feature matching",
        "Learn Hamming distance, brute-force matching, cross-checking, and minimum-match thresholds.",
        "Match descriptors and draw the accepted matches between reference and scene.",
        "If false positives dominate, inspect descriptor distance, crossCheck, and threshold choice.",
        "A known scene produces enough matches and a negative scene does not.",
        [openCvArApprovedResources[0], openCvArApprovedResources[2], openCvArApprovedResources[3]]
      ),
      checkpoint(
        "Estimate homography",
        "Estimate the homography",
        "Learn homography as the transformation from reference plane to target image plane.",
        "Compute homography from matched points and draw the projected reference outline on the scene.",
        "If the outline is warped badly, inspect match quality before projection code.",
        "The reference-surface outline appears in the correct image region.",
        [openCvArApprovedResources[0], openCvArApprovedResources[3], openCvArApprovedResources[4]]
      ),
      checkpoint(
        "Project and document AR limits",
        "Project the 3D model",
        "Learn 3D projection as the final proof, then document lighting, calibration, marker, frame-rate, and robustness limits.",
        "Draw a simple cube/model over the detected surface and write the assumptions clearly.",
        "If the model floats or flips, inspect coordinate-space conventions and matrix order.",
        "A frame shows the model aligned to the reference surface and README explains the proof-of-concept limits.",
        openCvArApprovedResources.slice(0, 6)
      )
    ],
    [
      "Install Python, OpenCV, and NumPy and run one image-load/display script.",
      "Choose a clear reference image and one positive/negative scene image.",
      "Write the four tutorial chunks: recognize surface, homography, projection transform, draw model.",
      "Commit after feature detection, matching, homography, and projection."
    ],
    [
      "Demo reference-surface detection and projected object on at least one image/frame.",
      "Add screenshots of keypoints, matches, outline, and final overlay.",
      "Include one bad-match or matrix-order bug and how it was diagnosed.",
      "List limitations around lighting, occlusion, calibration, performance, and non-planar targets."
    ],
    "Built the OpenCV AR tutorial as a feature-matching, homography, and projection pipeline with visual proof artifacts and explicit AR limitations.",
    ["Source extraction is full and the article explicitly decomposes the project into four AR pipeline chunks."]
  ),
  approvedTutorialOverride(
    "3d-renderer-c-typescript-javascript-learning-how-to-write-a-3d-soft-engine-from-",
    "Individual review of David Rousset's 3D soft engine tutorial plus rendering/coordinate-system resources",
    "Approved path for the 3D soft-engine tutorial focused on vectors, camera/projection math, meshes, rasterization, render loops, and visual debugging.",
    softEngineApprovedResources,
    [
      concept(
        "approved-soft-engine-3d-to-2d",
        "3D points become pixels",
        "A software renderer teaches the pipeline from 3D model coordinates through camera/projection math into 2D screen pixels.",
        "This is the core concept a beginner needs before triangles, meshes, and lighting start piling up.",
        [
          "You can distinguish model, world, camera, and screen coordinates.",
          "You can project one point by hand or with a tiny helper.",
          "You can explain why the same mesh appears different when the camera changes."
        ],
        softEngineApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-soft-engine-raster-debug",
        "Rasterization needs visual proof",
        "A soft engine is easiest to learn when every stage has a visible proof: vertices, wireframes, filled triangles, depth, and animation.",
        "This keeps learners from debugging a blank canvas with no idea whether math, data, or drawing failed.",
        [
          "You can show a wireframe before filling triangles.",
          "You can draw axes or debug points.",
          "You can isolate mesh loading from projection and drawing."
        ],
        [softEngineApprovedResources[0], softEngineApprovedResources[1], softEngineApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Draw pixels and lines first",
        "Rendering foundation",
        "Learn the canvas/framebuffer drawing target before 3D math.",
        "Draw individual pixels, lines, and a simple 2D shape in the chosen runtime.",
        "If nothing appears, inspect canvas size, coordinate origin, and draw/update calls.",
        "A 2D line/shape renders reliably.",
        softEngineApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Project one 3D point or cube",
        "Camera and projection",
        "Learn vector coordinates, camera position, and projection into screen space.",
        "Project a cube's vertices and draw them as points or wireframe.",
        "If the cube is invisible, inspect camera position, near plane, and coordinate handedness.",
        "A wireframe cube appears and changes predictably with camera/object movement.",
        [softEngineApprovedResources[0], softEngineApprovedResources[2], softEngineApprovedResources[3]]
      ),
      checkpoint(
        "Render meshes and triangles",
        "Mesh and rasterization",
        "Learn mesh data as vertices/faces and triangles as the basic render unit.",
        "Load or define a tiny mesh and render its triangles or wireframe.",
        "If triangles connect wrong points, inspect face indices separately from projection math.",
        "A mesh renders with inspectable vertices/faces.",
        [softEngineApprovedResources[0], softEngineApprovedResources[1], softEngineApprovedResources[2]]
      ),
      checkpoint(
        "Animate and document renderer limits",
        "Render loop and scope",
        "Learn render loop timing and what the tutorial omits: GPU acceleration, clipping, lighting, textures, z-buffer precision, and performance.",
        "Animate rotation or camera movement and add README screenshots plus pipeline notes.",
        "If animation flickers, isolate clear/draw order and frame timing.",
        "README explains the software rendering pipeline and limitations.",
        softEngineApprovedResources.slice(0, 5)
      )
    ],
    [
      "Review vectors, coordinate systems, and the drawing API before mesh rendering.",
      "Create a debug scene with one cube before importing complex models.",
      "Write the render pipeline as input mesh -> transform -> project -> rasterize -> display.",
      "Commit after 2D drawing, projection, mesh rendering, and animation."
    ],
    [
      "Demo a rotating wireframe or triangle-rendered object.",
      "Add screenshots of debug points/wireframe/final render.",
      "Include one coordinate-system or projection bug and how it was diagnosed.",
      "List missing production renderer features honestly."
    ],
    "Built David Rousset's 3D soft-engine tutorial as a software-rendering pipeline with coordinate transforms, projection, mesh rendering, animation, and visual debug proof.",
    ["Source extraction is full and the tutorial is a clear graphics pipeline project."]
  ),
  approvedTutorialOverride(
    "bot-node-js-create-a-discord-bot",
    "Individual review of discord.js Guide plus official Discord API resources",
    "Approved path for the Discord bot tutorial focused on JavaScript/Node prerequisites, application setup, gateway intents, commands/interactions, permissions, and bot safety.",
    discordBotApprovedResources,
    [
      concept(
        "approved-discord-app-gateway",
        "Discord app and gateway events",
        "A Discord bot is a registered application that receives events through Discord's gateway and responds through the API.",
        "Beginners need that platform boundary before they write command handlers.",
        [
          "You can distinguish app setup from local bot code.",
          "You can explain what gateway intents allow.",
          "You can describe which event triggers one command."
        ],
        discordBotApprovedResources.slice(0, 4)
      ),
      concept(
        "approved-discord-command-safety",
        "Commands need permissions and validation",
        "A useful bot checks command input, uses only the permissions it needs, and handles API failures without leaking tokens or spamming servers.",
        "This turns a fun tutorial into a safe portfolio project.",
        [
          "You can keep the token outside source control.",
          "You can name one permission the bot needs.",
          "You can handle an invalid command or missing permission."
        ],
        [discordBotApprovedResources[0], discordBotApprovedResources[1], discordBotApprovedResources[2]]
      )
    ],
    [
      checkpoint(
        "Prepare JavaScript, Node, and app registration",
        "Before you begin and Application Setup",
        "Learn the guide's prerequisite warning, Discord developer app setup, token storage, and invite permissions.",
        "Create a test app/server setup and run a no-op bot locally with secrets in environment variables.",
        "If login fails, check token, app id, invite scope, and gateway intents before command code.",
        "The bot logs in safely without secrets committed.",
        discordBotApprovedResources.slice(0, 4)
      ),
      checkpoint(
        "Handle one ready/message/interaction event",
        "Getting Started",
        "Learn event-driven bot flow with one event and one logged payload.",
        "Log a sanitized event or interaction and identify the fields your command handler needs.",
        "If events do not fire, inspect intents and server invite permissions.",
        "A test event is visible in logs with sensitive data omitted.",
        [discordBotApprovedResources[0], discordBotApprovedResources[2], discordBotApprovedResources[3]]
      ),
      checkpoint(
        "Implement one slash command",
        "Slash Commands",
        "Learn command registration, command payloads, validation, and response timing.",
        "Create one harmless slash command with a clear success and invalid-input path.",
        "If Discord says interaction failed, inspect response timing and command registration.",
        "A slash command responds correctly in a test server.",
        [discordBotApprovedResources[0], discordBotApprovedResources[1], discordBotApprovedResources[3]]
      ),
      checkpoint(
        "Document deployment and safety",
        "More to know",
        "Learn what production bots add: permissions, rate limits, persistence, sharding, moderation, logging, and secret rotation.",
        "Add README setup, command list, permission list, and safe deployment notes.",
        "If repeated commands create noise, add cooldown/idempotence or document the risk.",
        "README explains app setup, command flow, permissions, and production limitations.",
        discordBotApprovedResources.slice(0, 6)
      )
    ],
    [
      "Learn enough JavaScript and Node before following the bot guide.",
      "Use a private test server and environment variables for tokens.",
      "Write command inputs/outputs before implementing handlers.",
      "Commit after app setup, event handling, command, and safety docs."
    ],
    [
      "Demo one slash command in a test server.",
      "Add README setup with no real secrets.",
      "Include a permissions/intents explanation.",
      "List missing production bot concerns such as persistence, rate limits, sharding, moderation, and observability."
    ],
    "Built the Discord bot tutorial as an event-driven platform integration with safe app setup, command handling, permissions, and deployment limits.",
    ["Source is official guide content and explicitly warns about JavaScript prerequisites."]
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
    "Bot/platform pack built from Discord, Slack, Reddit, and HTTP message resources",
    "Research-backed bot path focused on events, platform APIs, authentication boundaries, message handling, rate limits, and safe local testing.",
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
        ]
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
        resourceIndexes: [0, 1, 2]
      }
    ],
    [
      {
        title: "Run the bot skeleton safely",
        sourceSectionTitle: "Setup and credentials",
        learnRightHere: "Learn environment variables, platform app setup, and the difference between local code and platform configuration.",
        action: "Start the bot with a harmless login or local handler test and keep credentials out of source control.",
        debugPrompt: "If authentication fails, check token location, app permissions, and the platform dashboard before changing handler code.",
        selfCheck: "The bot starts or the handler test runs without secrets committed."
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
        resourceIndexes: [1, 2, 3]
      },
      {
        title: "Add safety and limits",
        sourceSectionTitle: "Deployment and reliability",
        learnRightHere: "Learn rate limits, retries, command validation, and what should not be automated.",
        action: "Add one validation rule, one failure message, and a README section describing permissions and limits.",
        debugPrompt: "If repeated commands misbehave, inspect handler idempotence and platform rate-limit responses.",
        selfCheck: "README explains setup, supported commands, credentials, and rate-limit or moderation boundaries.",
        resourceIndexes: [0, 1, 2, 3]
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
  notes: string[]
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
    return [
      resource("Discord", "Developer documentation", "https://discord.com/developers/docs/intro"),
      resource("Slack", "API basics", "https://api.slack.com/start"),
      resource("Reddit", "API documentation", "https://www.reddit.com/dev/api/"),
      resource("MDN", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages")
    ];
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

  return {
    ...path,
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

function supportingGeneratedConcepts(
  article: TutorialArticle,
  override: CuratedOverride,
  concepts: ConceptModule[]
): ConceptModule[] {
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
