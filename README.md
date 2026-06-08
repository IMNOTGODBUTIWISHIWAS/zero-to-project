Zero-To-Project

When thinking about the inspiration behind Zero-To-Project, there's a small frustration with many existing tutorials:

There are loads of “build this cool thing” tutorials out there. Most of them skip over the easier, beginner-friendly content. They show the finished path to building a project but not the content that comes before the project makes sense.

The Build-Your-Own-X repository is full of interesting projects. It's the perfect starting point for people who want to get their feet wet with building projects. The only downside is that the tutorials often assume that users know how to get unstuck from difficulties they encounter while building these projects.

Most beginners do not know how to get unstuck from difficulties. This is totally fine c:

Zero-To-Project aims to provide a more beginner-friendly alternative to the Build-Your-Own-X repository. It walks people through the content they need to learn before they dive into the project tutorials and how to complete each project.

What this app does

### 1. Reads the Build-Your-Own-X catalog

The sync script pulls in the catalog of projects from the main Build-Your-Own-X repository.

The script looks for the following information within the repository:

categories of projects

languages used in the projects

the titles of the projects

links to the project tutorials

links to fix any broken or unusual URLs

the JSON data needed by the frontend application

There’s nothing we ask users to do. Simply running the sync script will pull this data and make it available to the application :)

### 2. Builds a “start from zero” path for each project

Each project comes with a page that answers the following questions:

What should I know?

Where can I learn for free?

What does this mean?

What should I practice before starting the tutorial?

Can I assess my understanding before continuing?

What are the main build goals?

What should I try in case something breaks?

There is also space for notes, my attempts to build this into my CV, and progress on each project. Finishing a project is good, but being able to describe it is even better (◕‿◕).

The goal is to gain an understanding of the projects that allows me to describe them to others and create similar projects myself.

### 3. Creates tutorial-specific build guides

If the tutorial can be read automatically, it will try to extract information that will lead to a build guide for that specific tutorial. This includes headings, code, and steps.

If the tutorial cannot be read, the app will create a simple project scaffold with the tutorial link.

### 4. Runs locally

This app was deliberately created to be as simple as possible to run locally. There are no backends, no signups, no cloud - all of it happens in the browser and locally.

---

## Tech stack

React

Vite

TypeScript

Node script for syncing the Build-Your-Own-X catalog

localStorage for progress

Vitest for tests

## Commands

On Windows, use npm.cmd as PowerShell will block the npm shim.

## Start dev server

npm.cmd run dev

The application will open at the following address:

http://127.0.0.1:5173/

### sync BYOX catalog

npm.cmd run sync:byox

### test

npm.cmd test

### build for production

npm.cmd run build

### Project structure

src/
App.tsx
components/
lib/
curriculum.ts
extraction.ts
data/
catalog.json

scripts/
sync-byox.ts

public/

tests/

## Future ideas

Some ideas for features that would be fun to implement at a later date:

deepening the functionality of extracting information from the tutorials

creating learning paths that include multiple projects

enabling users to export their learning journals

curating beginner-friendly learning notes that the community can access

a “start here if you know literally nothing” mode c:

applying filters to the projects based on language, difficulty, and project type

adding elements that celebrate the user after completing certain project milestones :)

