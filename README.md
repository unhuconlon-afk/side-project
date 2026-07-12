# AuraBible — Premium Bible Study & Devotional App

A high-fidelity, responsive single-page Bible study web application built with vanilla HTML5, CSS3, and JavaScript. Inspired by modern scripture engagement platforms, it features a warm neutral design system, custom typography, light/dark themes, and offline state persistence using LocalStorage.

## Key Features

1. **Dashboard (Home)**: Daily streak widgets, the "Verse of the Day", a daily devotional highlight, and recommended plans.
2. **Bible Reader**: Multi-translation selector (World English Bible, King James Version, Aura Devotional), dynamic text scaling and spacing controls, interactive verse selector (highlights, bookmarks, notes, sharing).
3. **Audio Scripture**: Persistent playback bar simulating scripture audio narration, seek bar, speed controls, and seamless book/chapter navigation.
4. **Reading Plans**: 3-day plans covering Topics like Anxiety, Relationships, and Hope. Complete with step-by-step sessions containing devotional readings, scripture contexts, reflection questions, and prayer focuses.
5. **Prayer Journal**: Post private or shared prayer request entries, view friend prayers, and mark prayers as answered.
6. **Community Feed**: Keep up with mock friend statuses, share notes, likes, and post encouraging responses.
7. **Saved Library**: Searchable and filterable database storing bookmarks, customized highlights, and study logs.
8. **Global Search**: Search box finding matches across Bible books, scripture text databases, plans, and custom notes.

## File Structure

```text
├── index.html       # Single-Page App layout shell, modals, and templates
├── styles.css       # HSL typography tokens, light/dark color variables, grids
├── bibleData.js     # Mock Bible database, seeding plans, community feed, and user stats
└── app.js           # Core state router, controllers, audio player, search, and storage sync
```

## How to Run

Since the application is built entirely using vanilla JS and standard web technologies, there are **no build steps or package installations required**.

1. Simply double-click **`index.html`** to open it directly in your browser.
2. Alternatively, you can run a local server:
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve` or `npx browser-sync start --server --files "*.*"`

## Extending the App

- **Adding Books/Verses**: Inside `bibleData.js`, add new book entries to `BIBLE_BOOKS` and matching verses inside `STATIC_SCRIPTURES`. Any coordinates not explicitly covered in static scriptures will automatically fall back to the placeholder generator inside the `getVerseText()` function to keep the interface functional.
- **Connecting a Backend**: Replace `loadState()` and `saveState()` in `app.js` with `fetch` requests pointing to your API (e.g. Node/Express, Firebase, Supabase) for user authentication and relational database sync.
