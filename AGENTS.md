# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# GRATIA Project Architecture & Agent Instructions

This section defines the project structure, component breakdown, data guidelines, and development conventions for any AI agent or developer working on the **GRATIA (AuraBible)** codebase.

## 1. Project Overview & Tech Stack

- **Name**: Gratia (AuraBible) — Premium Scripture & Devotional Web App
- **Architecture**: Single-Page Application (SPA) frontend powered by a Node.js + Express backend with SQLite persistence.
- **Frontend Stack**: Vanilla HTML5, Vanilla CSS3 (custom HSL variables, dark mode system), Vanilla JS (router, state management, audio engine, game engine). Zero build step required.
- **Backend Stack**: Node.js, Express framework, SQLite3 database (`sqlite3` driver with WAL journal mode), JWT (`jsonwebtoken`), and `bcryptjs`.

---

## 2. Directory Layout & File Responsibilities

| Path | Category | Purpose & Responsibilities |
|---|---|---|
| `index.html` | Frontend Shell | Single-Page Application HTML shell, main view views, modal dialog templates. |
| `styles-core.css` | CSS Stylesheet | HSL design tokens, color modes (light/dark), card layouts, responsive grid rules. |
| `app-core.js` | Frontend App Core | SPA client router, state store, audio scripture player, search controller, quiz game logic. |
| `bibleData.js` | Data Seed | Static scripture fallback tables, devotional plan definitions, community feed seed data. |
| `vietnameseBible.js` | Data Dataset | Full Vietnamese Bible scripture dataset (~6.9 MB JS file). |
| `biblegame.json` | Game Dataset | Trivia & memory quiz question dataset loaded by client via `fetch('/biblegame.json')`. |
| `server.js` | Backend Server | Express API server (Auth, User Stats, Prayer Journal, Community Feed, SSE live logs). |
| `database.db` | Database | Primary SQLite database storing accounts, prayers, feed posts, and activity logs. |
| `logo.png`, `peace_background_*.png` | Static Assets | App brand logo and background theme images. |
| `vi.doc` | Raw Source | Original MS Word source document for Vietnamese Bible text (archived, not needed at runtime). |

---

## 3. Target Organized Structure

When reorganizing or adding new files to this codebase, agents MUST follow the organized directory structure:

```text
GRATIA/
├── public/                       # Static web app files served to browser
│   ├── index.html                # Main entry HTML
│   ├── css/
│   │   └── styles-core.css       # Core design system & styles
│   ├── js/
│   │   ├── app-core.js           # Core SPA application router & controllers
│   │   ├── bibleData.js          # Scripture seed & community data
│   │   └── vietnameseBible.js    # Vietnamese Bible dataset
│   ├── data/
│   │   └── biblegame.json        # Quiz & trivia JSON dataset
│   └── assets/
│       ├── logo.png              # App logo icon
│       ├── peace_background_1.png
│       ├── peace_background_2.png
│       └── peace_background_3.png
├── server/                       # Backend API Server
│   └── server.js                 # Express server & API routes
├── data/                         # SQLite Database runtime directory (git-ignored)
│   └── database.db
├── docs/                         # Documentation & raw source archives
│   ├── README.md
│   ├── AGENTS.md
│   ├── CURSOR.md
│   └── raw/
│       └── vi.doc                # Raw source document
├── .cursor/
├── .gitignore
├── package.json
└── package-lock.json
```

---

## 4. Rules for AI Agents

When working on this repository, all AI agents MUST adhere to the following rules:

### A. Directory & Asset Placement
1. **No Root Clutter**: Do not drop temporary files, raw documents, or new image assets directly into the project root. Put assets in `assets/` (or `public/assets/`), datasets in `data/`, backend scripts in `server/`, and documentation in `docs/`.
2. **Database Isolation**: SQLite runtime files (`database.db`, `database.db-shm`, `database.db-wal`) must reside in `data/` and must never be committed to git.
3. **Asset Paths**: When modifying image or asset locations, ensure all references in `index.html`, `styles-core.css`, and `app-core.js` (e.g. `data-bg="url('...')"` in `app-core.js`) are updated consistently.

### B. Backend & API Conventions
1. **Server Entrypoint**: `server.js` serves static files and provides REST API endpoints.
2. **Database WAL Mode**: SQLite connection uses `PRAGMA journal_mode = WAL`. Ensure database connections cleanly handle WAL mode and async queries.
3. **Authentication**: Endpoints use JWT tokens in the `Authorization: Bearer <token>` header. Verify auth middleware on protected routes.

### C. Verification Checklist for Changes
1. **Syntax & Startup**: Verify node script execution (`node server.js` or `npm start`).
2. **Static Route Check**: Verify `index.html` loads correctly and all JS script files load without 404 errors.
3. **Asset Check**: Ensure logo and background theme images render cleanly in both light and dark modes.

