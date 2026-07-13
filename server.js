const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'aurabible_super_secret_key_12345';

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.options('*', cors());

// Serve static files from current directory
app.use(express.static(__dirname));

// Initialize Database
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
    db.run("PRAGMA journal_mode = WAL");
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    // 1. Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        name TEXT,
        email TEXT,
        avatar TEXT,
        streak INTEGER DEFAULT 0,
        joined_date TEXT,
        last_check_in_date TEXT,
        is_admin INTEGER DEFAULT 0
      )
    `);

    db.run("ALTER TABLE users ADD COLUMN last_check_in_date TEXT", (err) => {
      // Ignore column already exists error
    });
    db.run("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0", (err) => {
      // Ignore column already exists error
    });

    // 2. Saved Items Table
    db.run(`
      CREATE TABLE IF NOT EXISTS saved_items (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        type TEXT,
        book_id TEXT,
        chapter INTEGER,
        verse_num INTEGER,
        text TEXT,
        note_text TEXT,
        color TEXT,
        translation TEXT,
        created_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 3. Prayers Table
    db.run(`
      CREATE TABLE IF NOT EXISTS prayers (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        text TEXT,
        is_public INTEGER DEFAULT 1,
        is_answered INTEGER DEFAULT 0,
        created_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 4. Community Feed Table
    db.run(`
      CREATE TABLE IF NOT EXISTS community_feed (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        action_text TEXT,
        target_text TEXT,
        created_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 5. Feed Likes Table
    db.run(`
      CREATE TABLE IF NOT EXISTS feed_likes (
        feed_item_id TEXT,
        user_id INTEGER,
        PRIMARY KEY(feed_item_id, user_id),
        FOREIGN KEY(feed_item_id) REFERENCES community_feed(id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 6. Feed Comments Table
    db.run(`
      CREATE TABLE IF NOT EXISTS feed_comments (
        id TEXT PRIMARY KEY,
        feed_item_id TEXT,
        user_id INTEGER,
        comment_text TEXT,
        created_at TEXT,
        FOREIGN KEY(feed_item_id) REFERENCES community_feed(id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 7. Settings Table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id INTEGER PRIMARY KEY,
        dark_mode INTEGER DEFAULT 0,
        notifications INTEGER DEFAULT 1,
        offline INTEGER DEFAULT 1,
        system_language TEXT DEFAULT 'en',
        font_size INTEGER DEFAULT 24,
        line_height REAL DEFAULT 1.6,
        verse_layout TEXT DEFAULT 'paragraph',
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Seed mock data if database is empty
    seedMockData();
  });
}

function seedMockData() {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('password123', salt);

  // Guarantee Admin user exists in all databases
  db.run(`
    INSERT OR IGNORE INTO users (id, username, password_hash, name, email, avatar, streak, joined_date, is_admin)
    VALUES (102, 'admin_holder', '${hash}', 'System Administrator', 'admin@gratia.com', 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', 0, 'July 2026', 1)
  `);

  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row && row.count <= 1) { // seed if empty or only admin exists
      console.log('Seeding mock users and feed...');
      
      // Create Seed Users
      db.run(`
        INSERT INTO users (id, username, password_hash, name, email, avatar, streak, joined_date, is_admin)
        VALUES 
        (100, 'sarah_jenkins', '${hash}', 'Sarah Jenkins', 'sarah@example.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', 12, 'June 2026', 0),
        (101, 'marcus_brody', '${hash}', 'Marcus Brody', 'marcus@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', 5, 'May 2026', 0)
      `, () => {
        
        // Seed Community Feed items
        db.run(`
          INSERT INTO community_feed (id, user_id, action_text, target_text, created_at)
          VALUES 
          ('feed-1', 100, 'đã tô màu Thi-thiên 23:4 bằng bản dịch AMD', '“Even when I must walk through the darkest, most terrifying valleys, I won''t fear, because you are walking right beside me.”', '45 phút trước'),
          ('feed-2', 101, 'đã hoàn thành Ngày 1 của "Hy vọng sống"', 'Really loved the devotion on how God creates order out of chaos in Genesis 1. Highly recommend this plan!', '4 giờ trước')
        `, () => {

          // Seed Comment
          db.run(`
            INSERT INTO feed_comments (id, feed_item_id, user_id, comment_text, created_at)
            VALUES 
            ('comm-1', 'feed-2', 100, 'I need to check that one out next!', '3 giờ trước')
          `);

          // Seed Likes
          db.run(`
            INSERT INTO feed_likes (feed_item_id, user_id)
            VALUES 
            ('feed-1', 101),
            ('feed-2', 100)
          `);
          console.log('Seeding complete.');
        });
      });
    }
  });
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token expired or invalid' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTERS ---

// Register User
app.post('/api/auth/register', (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !name || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
  const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date().toISOString().split('T')[0];

  db.run(
    `INSERT INTO users (username, password_hash, name, email, avatar, streak, joined_date, last_check_in_date)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
    [username, passwordHash, name, email, avatar, joinedDate, today],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      
      const userId = this.lastID;
      // Initialize settings
      db.run(`INSERT INTO user_settings (user_id) VALUES (?)`, [userId]);

       const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: userId, username, name, email, avatar, streak: 1, joinedDate, isAdmin: false } });
    }
  );
});

// Login User
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const passwordCorrect = bcrypt.compareSync(password, user.password_hash);
    if (!passwordCorrect) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.is_admin === 1 }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        streak: user.streak,
        joinedDate: user.joined_date,
        isAdmin: user.is_admin === 1
      }
    });
  });
});

// --- PROFILE & STATE SYNC ---

// Fetch User profile state
app.get('/api/user/state', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.get("SELECT * FROM users WHERE id = ?", [userId], (err, profile) => {
    if (err || !profile) {
      console.error('Database user lookup error:', err);
      return res.status(500).json({ error: 'User profile not found' });
    }

    db.all("SELECT * FROM saved_items WHERE user_id = ?", [userId], (err, savedList) => {
      let activeSavedList = savedList || [];
      if (err) {
        console.error('Database saved_items lookup error:', err);
        activeSavedList = [];
      }

      db.all("SELECT * FROM prayers WHERE user_id = ?", [userId], (err, prayersList) => {
        let activePrayersList = prayersList || [];
        if (err) {
          console.error('Database prayers lookup error:', err);
          activePrayersList = [];
        }

        db.get("SELECT * FROM user_settings WHERE user_id = ?", [userId], (err, settings) => {
          let activeSettings = settings;
          if (err || !activeSettings) {
            db.run("INSERT OR IGNORE INTO user_settings (user_id) VALUES (?)", [userId]);
            activeSettings = {
              dark_mode: 0,
              notifications: 1,
              offline: 1,
              system_language: 'en',
              font_size: 24,
              line_height: 1.6,
              verse_layout: 'paragraph'
            };
          }
          
          try {
            const responseState = {
              profile: {
                name: profile.name,
                email: profile.email,
                avatar: profile.avatar,
                streak: profile.streak,
                joinedDate: profile.joined_date,
                isAdmin: profile.is_admin === 1
              },
              saved: {
                highlights: activeSavedList.filter(i => i && i.type === 'highlight').map(i => ({
                  id: i.id, bookId: i.book_id, chapter: i.chapter, verseNum: i.verse_num, text: i.text, color: i.color, translation: i.translation, time: i.created_at
                })),
                bookmarks: activeSavedList.filter(i => i && i.type === 'bookmark').map(i => ({
                  id: i.id, bookId: i.book_id, chapter: i.chapter, verseNum: i.verse_num, text: i.text, translation: i.translation, time: i.created_at
                })),
                notes: activeSavedList.filter(i => i && i.type === 'note').map(i => ({
                  id: i.id, bookId: i.book_id, chapter: i.chapter, verseNum: i.verse_num, text: i.text, noteText: i.note_text, translation: i.translation, time: i.created_at
                }))
              },
              prayers: activePrayersList.map(p => ({
                id: p.id, text: p.text, isPublic: !!p.is_public, isAnswered: !!p.is_answered, date: p.created_at
              })),
              settings: {
                darkMode: !!activeSettings.dark_mode,
                notifications: !!activeSettings.notifications,
                offline: !!activeSettings.offline,
                systemLanguage: activeSettings.system_language,
                reader: {
                  fontSize: activeSettings.font_size,
                  lineHeight: activeSettings.line_height,
                  verseLayout: activeSettings.verse_layout
                }
              }
            };
            res.json(responseState);
          } catch(compilationError) {
            console.error('Error compiling user state response:', compilationError);
            res.status(500).json({ error: 'Internal processing error' });
          }
        });
      });
    });
  });
});

// Update Profile
app.post('/api/user/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;

  db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Database update failed' });
    res.json({ message: 'Profile updated' });
  });
});

// Sync Full Client State (Saves lists, prayers, settings, etc.)
app.post('/api/user/sync', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { saved, prayers, settings, streak } = req.body;

  db.serialize(() => {
    // Update streak if provided
    if (streak !== undefined) {
      db.run("UPDATE users SET streak = ? WHERE id = ?", [streak, userId]);
    }

    // Delete old saved_items & prayers
    db.run("DELETE FROM saved_items WHERE user_id = ?", [userId]);
    db.run("DELETE FROM prayers WHERE user_id = ?", [userId]);

    // Insert new saved highlights
    if (saved && saved.highlights) {
      const stmt = db.prepare(`
        INSERT INTO saved_items (id, user_id, type, book_id, chapter, verse_num, text, color, translation, created_at)
        VALUES (?, ?, 'highlight', ?, ?, ?, ?, ?, ?, ?)
      `);
      saved.highlights.forEach(h => {
        stmt.run([h.id, userId, h.bookId, h.chapter, h.verseNum, h.text, h.color, h.translation, h.time]);
      });
      stmt.finalize();
    }

    // Insert new saved bookmarks
    if (saved && saved.bookmarks) {
      const stmt = db.prepare(`
        INSERT INTO saved_items (id, user_id, type, book_id, chapter, verse_num, text, translation, created_at)
        VALUES (?, ?, 'bookmark', ?, ?, ?, ?, ?, ?)
      `);
      saved.bookmarks.forEach(b => {
        stmt.run([b.id, userId, b.bookId, b.chapter, b.verseNum, b.text, b.translation, b.time]);
      });
      stmt.finalize();
    }

    // Insert new saved notes
    if (saved && saved.notes) {
      const stmt = db.prepare(`
        INSERT INTO saved_items (id, user_id, type, book_id, chapter, verse_num, text, note_text, translation, created_at)
        VALUES (?, ?, 'note', ?, ?, ?, ?, ?, ?, ?)
      `);
      saved.notes.forEach(n => {
        stmt.run([n.id, userId, n.bookId, n.chapter, n.verseNum, n.text, n.noteText, n.translation, n.time]);
      });
      stmt.finalize();
    }

    // Insert new prayers
    if (prayers) {
      const stmt = db.prepare(`
        INSERT INTO prayers (id, user_id, text, is_public, is_answered, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      prayers.forEach(p => {
        stmt.run([p.id, userId, p.text, p.isPublic ? 1 : 0, p.isAnswered ? 1 : 0, p.date || 'Just now']);
      });
      stmt.finalize();
    }

    // Update settings
    if (settings) {
      db.run(
        `UPDATE user_settings 
         SET dark_mode = ?, notifications = ?, offline = ?, system_language = ?, font_size = ?, line_height = ?, verse_layout = ?
         WHERE user_id = ?`,
        [
          settings.darkMode ? 1 : 0,
          settings.notifications ? 1 : 0,
          settings.offline ? 1 : 0,
          settings.systemLanguage || 'en',
          settings.reader?.fontSize || 24,
          settings.reader?.lineHeight || 1.6,
          settings.reader?.verseLayout || 'paragraph',
          userId
        ]
      );
    }

    res.json({ message: 'State synced successfully' });
  });
});

// Fetch all public prayers across the community
app.get('/api/prayers/public', (req, res) => {
  const query = `
    SELECT p.*, u.name as author_name, u.avatar as author_avatar,
      (SELECT COUNT(*) FROM feed_likes WHERE feed_item_id = p.id) as pray_count
    FROM prayers p
    JOIN users u ON p.user_id = u.id
    WHERE p.is_public = 1
    ORDER BY p.id DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch public prayers' });
    res.json(rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      author: r.author_name,
      avatar: r.author_avatar,
      text: r.text,
      isPublic: true,
      answered: !!r.is_answered,
      prayCount: r.pray_count,
      time: r.created_at
    })));
  });
});

// Pray for a request (like action on the prayer table)
app.post('/api/prayers/pray', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { prayerId } = req.body;
  if (!prayerId) return res.status(400).json({ error: 'Missing prayerId' });

  // Check if already prayed by looking up in feed_likes
  db.get("SELECT * FROM feed_likes WHERE user_id = ? AND feed_item_id = ?", [userId, prayerId], (err, like) => {
    if (like) {
      // Undo prayer (un-pray)
      db.run("DELETE FROM feed_likes WHERE user_id = ? AND feed_item_id = ?", [userId, prayerId], (err) => {
        res.json({ prayed: false });
      });
    } else {
      // Add prayer (pray)
      db.run("INSERT INTO feed_likes (user_id, feed_item_id) VALUES (?, ?)", [userId, prayerId], (err) => {
        res.json({ prayed: true });
      });
    }
  });
});

// --- COMMUNITY FEED APIs ---

// Fetch shared feed activities
app.get('/api/community/feed', (req, res) => {
  // Return all items merged with creator usernames & avatars
  const query = `
    SELECT f.*, u.name as user_name, u.avatar as user_avatar,
      (SELECT COUNT(*) FROM feed_likes WHERE feed_item_id = f.id) as likes_count
    FROM community_feed f
    LEFT JOIN users u ON f.user_id = u.id
    ORDER BY f.rowid DESC
  `;

  db.all(query, [], (err, feedItems) => {
    if (err) return res.status(500).json({ error: 'Error fetching feed' });

    // Fetch comments for all items
    db.all(`
      SELECT c.*, u.name as user_name, u.avatar as user_avatar
      FROM feed_comments c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.rowid ASC
    `, [], (err, comments) => {
      
      // Fetch likes relationships
      db.all("SELECT * FROM feed_likes", [], (err, likes) => {
        
        const feedWithDetails = feedItems.map(item => {
          const itemComments = comments.filter(c => c.feed_item_id === item.id).map(c => ({
            id: c.id,
            userName: c.user_name,
            userAvatar: c.user_avatar,
            text: c.comment_text,
            time: c.created_at
          }));

          const likedUsers = likes.filter(l => l.feed_item_id === item.id).map(l => l.user_id);

          return {
            id: item.id,
            userName: item.user_name,
            userAvatar: item.user_avatar,
            actionText: item.action_text,
            targetText: item.target_text,
            likes: item.likes_count,
            time: item.created_at,
            comments: itemComments,
            likedUsers: likedUsers
          };
        });

        res.json(feedWithDetails);
      });
    });
  });
});

// Publish a custom post to the community feed
app.post('/api/community/post', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { actionText, targetText } = req.body;

  if (!actionText) return res.status(400).json({ error: 'Action text required' });

  const id = `feed-${Date.now()}`;
  const createdAt = 'Just now';

  db.run(
    "INSERT INTO community_feed (id, user_id, action_text, target_text, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, userId, actionText, targetText || '', createdAt],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to publish post' });
      res.status(201).json({ message: 'Post shared in community feed' });
    }
  );
});

// Like/Unlike a feed item
app.post('/api/community/like', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { feedItemId } = req.body;

  if (!feedItemId) return res.status(400).json({ error: 'Feed item ID required' });

  db.get("SELECT 1 FROM feed_likes WHERE feed_item_id = ? AND user_id = ?", [feedItemId, userId], (err, exists) => {
    if (exists) {
      db.run("DELETE FROM feed_likes WHERE feed_item_id = ? AND user_id = ?", [feedItemId, userId], (err) => {
        if (err) return res.status(500).json({ error: 'Like update failed' });
        res.json({ liked: false });
      });
    } else {
      db.run("INSERT INTO feed_likes (feed_item_id, user_id) VALUES (?, ?)", [feedItemId, userId], (err) => {
        if (err) return res.status(500).json({ error: 'Like update failed' });
        res.json({ liked: true });
      });
    }
  });
});

// Add comment to feed item
app.post('/api/community/comment', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { feedItemId, text } = req.body;

  if (!feedItemId || !text) {
    return res.status(400).json({ error: 'Feed item ID and comment text required' });
  }

  const id = `comm-${Date.now()}`;
  const createdAt = 'Just now';

  db.run(
    "INSERT INTO feed_comments (id, feed_item_id, user_id, comment_text, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, feedItemId, userId, text, createdAt],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to add comment' });
      res.status(201).json({ message: 'Comment posted' });
    }
  );
});

// --- ADMIN MODERATION ENDPOINTS ---

const requireAdmin = (req, res, next) => {
  const userId = req.user.id;
  db.get("SELECT is_admin FROM users WHERE id = ?", [userId], (err, row) => {
    if (err || !row || row.is_admin !== 1) {
      return res.status(403).json({ error: 'Access denied: Admin role required' });
    }
    next();
  });
};

// Delete Community Feed Post
app.delete('/api/admin/feed/:id', authenticateToken, requireAdmin, (req, res) => {
  const feedId = req.params.id;
  db.serialize(() => {
    db.run("DELETE FROM feed_likes WHERE feed_item_id = ?", [feedId]);
    db.run("DELETE FROM feed_comments WHERE feed_item_id = ?", [feedId]);
    db.run("DELETE FROM community_feed WHERE id = ?", [feedId], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete post' });
      res.json({ message: 'Post successfully deleted' });
    });
  });
});

// Delete Feed Comment
app.delete('/api/admin/comment/:id', authenticateToken, requireAdmin, (req, res) => {
  const commentId = req.params.id;
  db.run("DELETE FROM feed_comments WHERE id = ?", [commentId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete comment' });
    res.json({ message: 'Comment successfully deleted' });
  });
});

// Delete Public Prayer request
app.delete('/api/admin/prayer/:id', authenticateToken, requireAdmin, (req, res) => {
  const prayerId = req.params.id;
  db.run("DELETE FROM prayers WHERE id = ?", [prayerId], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete prayer request' });
    res.json({ message: 'Prayer request successfully deleted' });
  });
});

// Get Admin System Stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  db.get("SELECT COUNT(*) as usersCount FROM users", [], (err, uRow) => {
    if (err) return res.status(500).json({ error: 'Database statistics query failed' });
    db.get("SELECT COUNT(*) as prayersCount FROM prayers", [], (err, pRow) => {
      if (err) return res.status(500).json({ error: 'Database statistics query failed' });
      db.get("SELECT COUNT(*) as feedCount FROM community_feed", [], (err, fRow) => {
        if (err) return res.status(500).json({ error: 'Database statistics query failed' });
        res.json({
          totalUsers: uRow.usersCount,
          totalPrayers: pRow.prayersCount,
          totalFeedPosts: fRow.feedCount
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`AuraBible backend listening at http://localhost:${PORT}`);
});
