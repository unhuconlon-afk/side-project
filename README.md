# Gratia (AuraBible) — Premium Bible Study & Devotional App

A premium, responsive full-stack Bible study and devotional web application built with a vanilla HTML5/CSS/JS frontend and a Node.js + Express + SQLite backend. Inspired by modern scripture engagement platforms, it features a warm neutral design system, custom typography, light/dark themes, offline persistence, and personal study tools.

---

## Key Features

1. **Dashboard (Home)**: Daily streak widgets, "Verse of the Day", a daily devotional highlight, and recommended reading plans.
2. **Bible Reader**: Multi-translation selector (World English Bible, King James Version, Aura Devotional), text scaling, and interactive verse action menu (highlights, bookmarks, notes, card generator).
3. **Audio Scripture**: Persistent playback bar simulating scripture audio narration, seek bar, and speed controls.
4. **Reading Plans**: 3-day devotional plans complete with step-by-step sessions, reflection questions, and prayer focuses.
5. **Prayer Journal**: Private and shared prayer request logs with answered-prayer tracking.
6. **Community Feed**: User status sharing, notes, likes, and interactive comments.
7. **Saved Library**: Searchable database storing bookmarks, highlights, and study logs.
8. **Scripture Memory Game**: Built-in interactive trivia and memory quiz games.

---

## File Structure

The project follows a clean, organized directory architecture:

```text
GRATIA/
├── public/                       # Frontend static web app files
│   ├── index.html                # Single-Page App HTML shell
│   ├── css/
│   │   └── styles-core.css       # Core typography & HSL style rules
│   ├── js/
│   │   ├── app-core.js           # SPA client router, state store, & controller logic
│   │   ├── bibleData.js          # Fallback scriptures & data seed models
│   │   └── vietnameseBible.js    # Vietnamese Bible dataset
│   ├── data/
│   │   └── biblegame.json        # Game trivia question dataset
│   └── assets/
│       ├── logo.png              # App branding logo
│       └── peace_background_*.png # Background themes
├── server/                       # Backend service
│   └── server.js                 # Express server & REST API routes
├── data/                         # SQLite database storage directory (git-ignored)
│   └── database.db
└── docs/                         # Documentation & raw source files
    └── raw/
        └── vi.doc                # Raw source document for translation data
```

---

## How to Run

The application runs as a full-stack Node.js Express server that serves the static frontend assets from the `public/` directory.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- npm (Node Package Manager)

### Steps to Run Locally

1. **Install Dependencies**:
   Open a terminal in the project root folder and run:
   ```bash
   npm install
   ```

2. **Start the Server**:
   Start the Node.js backend server:
   ```bash
   npm start
   ```

3. **Access the App**:
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## Database Configuration

The application uses an SQLite database located at `data/database.db`. Upon first run, the server will automatically initialize the database schema (Users, Prayers, Feed posts, Study logs) using WAL (Write-Ahead Logging) mode.
