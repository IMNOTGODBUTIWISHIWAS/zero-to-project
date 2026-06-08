import type { LearningModule } from "./types";

export const baseModules: LearningModule[] = [
  {
    id: "computer-map",
    title: "Understand what your computer is doing",
    layer: "computer-basics",
    summary:
      "Learn the difference between files, folders, programs, commands, inputs, and outputs before touching a project.",
    whyItMatters:
      "Build-your-own projects often assume you know where code lives and how programs run. This gives you that map first.",
    resource: {
      label: "MDN - Getting started with the web",
      url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web",
      provider: "MDN"
    },
    exercise: "Create a folder named practice, add a text file, rename it, and explain where it is on your machine.",
    selfCheck: "You can describe what a file path is and what it means to open a project folder.",
    estimatedMinutes: 35
  },
  {
    id: "terminal-first-steps",
    title: "Use the terminal without fear",
    layer: "tooling",
    summary:
      "Practice moving between folders, listing files, running a command, and reading command output.",
    whyItMatters:
      "Most project tutorials use terminal commands for setup, running tests, and installing packages.",
    resource: {
      label: "MDN - Command line crash course",
      url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line",
      provider: "MDN"
    },
    resources: [
      {
        label: "MDN - Command line crash course",
        url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line",
        provider: "MDN"
      },
      {
        label: "The Unix Shell",
        url: "https://swcarpentry.github.io/shell-novice/",
        provider: "Software Carpentry"
      },
      {
        label: "The Shell",
        url: "https://missing.csail.mit.edu/2020/course-shell/",
        provider: "MIT Missing Semester"
      }
    ],
    exercise: "Run commands to print your current folder, list its files, create a new folder, and move into it.",
    selfCheck: "You can run a command and tell whether it succeeded, failed, or needs a different folder.",
    estimatedMinutes: 45
  },
  {
    id: "git-github-basics",
    title: "Learn Git and GitHub enough to save your work",
    layer: "tooling",
    summary:
      "Learn commits, repositories, branches, and how GitHub differs from Git.",
    whyItMatters:
      "A portfolio project is only useful if you can save progress, show history, and publish it.",
    resource: {
      label: "GitHub Skills - Introduction to GitHub",
      url: "https://skills.github.com/",
      provider: "GitHub Skills"
    },
    exercise: "Create a repository, make one commit, push it to GitHub, and view the commit online.",
    selfCheck: "You can explain what changed in your last commit and where GitHub stores the copy.",
    estimatedMinutes: 60
  },
  {
    id: "debugging-loop",
    title: "Learn the beginner debugging loop",
    layer: "tooling",
    summary:
      "Practice reading errors, isolating one change, searching exact messages, and keeping notes.",
    whyItMatters:
      "The first serious project will break. Debugging is the skill that keeps you moving when a tutorial stops matching your screen.",
    resource: {
      label: "freeCodeCamp - How to debug coding problems",
      url: "https://www.freecodecamp.org/news/how-to-debug-coding-problems/",
      provider: "freeCodeCamp"
    },
    exercise: "Intentionally break a tiny program, read the error, undo the break, and write down what the message meant.",
    selfCheck: "You can separate the error message, the file/location, and your next experiment.",
    estimatedMinutes: 35
  }
];

export const languageModules: Record<string, LearningModule> = {
  python: {
    id: "language-python",
    title: "Python from zero to small programs",
    layer: "language",
    summary:
      "Learn variables, functions, lists, dictionaries, imports, virtual environments, and reading Python tracebacks.",
    whyItMatters:
      "Python projects move quickly once you understand data containers, functions, and package setup.",
    resource: {
      label: "Python Docs - The Python Tutorial",
      url: "https://docs.python.org/3/tutorial/",
      provider: "Python Software Foundation"
    },
    exercise: "Write a script that reads a small list of values, transforms them in a function, and prints the result.",
    selfCheck: "You can run a Python file, import a module, and explain a traceback line by line.",
    estimatedMinutes: 180
  },
  javascript: {
    id: "language-javascript",
    title: "JavaScript from zero to working scripts",
    layer: "language",
    summary:
      "Learn values, functions, arrays, objects, modules, async code, browser console basics, and Node basics.",
    whyItMatters:
      "JavaScript project tutorials often mix language concepts with browser or Node tooling.",
    resource: {
      label: "MDN - JavaScript first steps",
      url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps",
      provider: "MDN"
    },
    exercise: "Write a function that takes an array of objects and returns a filtered, transformed result.",
    selfCheck: "You can explain the difference between an object, an array, a function, and a Promise.",
    estimatedMinutes: 180
  },
  typescript: {
    id: "language-typescript",
    title: "TypeScript as clearer JavaScript",
    layer: "language",
    summary:
      "Learn type annotations, interfaces, unions, compiler errors, and how TypeScript helps before runtime.",
    whyItMatters:
      "TypeScript-heavy tutorials expect you to use types as documentation and guardrails.",
    resource: {
      label: "TypeScript Handbook - The Basics",
      url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html",
      provider: "TypeScript"
    },
    exercise: "Define a type for a project task, then write a function that marks it complete.",
    selfCheck: "You can tell the difference between a TypeScript error and a runtime error.",
    estimatedMinutes: 110
  },
  go: {
    id: "language-go",
    title: "Go from zero to command-line programs",
    layer: "language",
    summary:
      "Learn packages, functions, structs, slices, errors, modules, and running tests.",
    whyItMatters:
      "Go is common in systems projects where the language is simple but the concepts are serious.",
    resource: {
      label: "A Tour of Go",
      url: "https://go.dev/tour/",
      provider: "Go"
    },
    exercise: "Write a Go program that parses command-line input and returns a clear error for bad input.",
    selfCheck: "You can run a Go file, use a module, and explain why Go returns explicit errors.",
    estimatedMinutes: 160
  },
  rust: {
    id: "language-rust",
    title: "Rust from zero to safe systems code",
    layer: "language",
    summary:
      "Learn variables, ownership, borrowing, structs, enums, Result, Cargo, and compiler-guided fixes.",
    whyItMatters:
      "Rust projects are rewarding, but beginners need the ownership model before the tutorial feels fair.",
    resource: {
      label: "The Rust Book - Getting Started",
      url: "https://doc.rust-lang.org/book/ch01-00-getting-started.html",
      provider: "Rust"
    },
    exercise: "Create a Cargo project, define a struct, return a Result, and fix one compiler error deliberately.",
    selfCheck: "You can explain why the compiler rejected borrowed or moved data.",
    estimatedMinutes: 240
  },
  c: {
    id: "language-c",
    title: "C from zero to memory-aware programs",
    layer: "language",
    summary:
      "Learn compilation, pointers, arrays, strings, structs, manual memory, headers, and undefined behavior.",
    whyItMatters:
      "C tutorials assume you can reason about memory and compilation, which is a big beginner jump.",
    resource: {
      label: "Beej's Guide to C Programming",
      url: "https://beej.us/guide/bgc/",
      provider: "Beej"
    },
    exercise: "Compile a small C program, pass data into a function, and inspect a pointer in a simple example.",
    selfCheck: "You can describe what compiling does and why pointers are addresses.",
    estimatedMinutes: 260
  },
  cpp: {
    id: "language-cpp",
    title: "C++ from zero to project structure",
    layer: "language",
    summary:
      "Learn compilation, classes, references, standard library containers, headers, and build files.",
    whyItMatters:
      "C++ project tutorials usually combine language, build tooling, and domain complexity.",
    resource: {
      label: "LearnCpp - Introduction",
      url: "https://www.learncpp.com/",
      provider: "LearnCpp"
    },
    exercise: "Compile a program split across two files and use a vector of custom objects.",
    selfCheck: "You can explain what a header file is and how a class differs from an object.",
    estimatedMinutes: 280
  },
  java: {
    id: "language-java",
    title: "Java from zero to object-oriented programs",
    layer: "language",
    summary:
      "Learn classes, methods, collections, exceptions, packages, and running Java projects.",
    whyItMatters:
      "Java tutorials often assume comfort with classes and larger project organization.",
    resource: {
      label: "dev.java - Learn Java",
      url: "https://dev.java/learn/",
      provider: "Oracle Java"
    },
    exercise: "Create two classes, pass data between them, and handle one invalid input with an exception.",
    selfCheck: "You can explain the difference between a class, object, method, and package.",
    estimatedMinutes: 190
  },
  csharp: {
    id: "language-csharp",
    title: "C# from zero to app code",
    layer: "language",
    summary:
      "Learn classes, methods, lists, properties, exceptions, NuGet, and the .NET project layout.",
    whyItMatters:
      "C# tutorials often assume you know both the language and the .NET tooling around it.",
    resource: {
      label: "Microsoft Learn - C#",
      url: "https://learn.microsoft.com/en-us/dotnet/csharp/",
      provider: "Microsoft Learn"
    },
    exercise: "Create a .NET console app, define a class, store objects in a list, and print a formatted result.",
    selfCheck: "You can run a .NET app and explain where dependencies are declared.",
    estimatedMinutes: 180
  },
  ruby: {
    id: "language-ruby",
    title: "Ruby from zero to expressive scripts",
    layer: "language",
    summary:
      "Learn objects, blocks, hashes, arrays, gems, classes, and reading stack traces.",
    whyItMatters:
      "Ruby project tutorials use terse syntax that is pleasant once the basics click.",
    resource: {
      label: "Ruby in Twenty Minutes",
      url: "https://www.ruby-lang.org/en/documentation/quickstart/",
      provider: "Ruby"
    },
    exercise: "Write a script that transforms a list of hashes and packages the logic into a class.",
    selfCheck: "You can explain blocks, hashes, and how to run a Ruby file.",
    estimatedMinutes: 150
  },
  shell: {
    id: "language-shell",
    title: "Shell scripting from zero",
    layer: "language",
    summary:
      "Learn variables, exit codes, pipes, loops, permissions, and safe command composition.",
    whyItMatters:
      "Shell projects can affect your files directly, so beginners need cautious command habits.",
    resource: {
      label: "Shell Scripting Tutorial",
      url: "https://www.shellscript.sh/",
      provider: "ShellScript.sh"
    },
    exercise: "Write a script that accepts one argument, checks whether a file exists, and prints a useful message.",
    selfCheck: "You can explain an exit code and why quoting variables matters.",
    estimatedMinutes: 130
  },
  any: {
    id: "language-any",
    title: "Pick and prepare one language",
    layer: "language",
    summary:
      "Choose one language for the project and learn enough syntax to read, run, and change small programs.",
    whyItMatters:
      "Some projects can be implemented in many languages, but beginners need one concrete toolchain first.",
    resource: {
      label: "freeCodeCamp - Learn to code resources",
      url: "https://www.freecodecamp.org/learn/",
      provider: "freeCodeCamp"
    },
    exercise: "Choose one language, install it, run a hello-world program, and change it twice.",
    selfCheck: "You can explain why you chose the language and how to run a file in it.",
    estimatedMinutes: 140
  }
};

export const fallbackLanguageModule: LearningModule = {
  id: "language-general",
  title: "Learn enough of the project language",
  layer: "language",
  summary:
    "Build basic comfort with syntax, variables, functions, packages, errors, and running code in the language used by the tutorial.",
  whyItMatters:
    "Without a language base, every line in the project tutorial feels like two problems at once.",
  resource: {
    label: "GitHub Skills - Learning paths",
    url: "https://skills.github.com/",
    provider: "GitHub Skills"
  },
  exercise: "Run a hello-world file, then write one function and one small data structure in the project language.",
  selfCheck: "You can read a simple program in this language and predict what it prints.",
  estimatedMinutes: 160
};
