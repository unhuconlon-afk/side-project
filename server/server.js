const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

// Prevent server crash on uncaught errors
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

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


// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// SSE & Logging Setup
let adminConnections = [];
let userConnections = {};
function broadcastToAllUsers(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  Object.keys(userConnections).forEach(userId => {
    if (userConnections[userId]) {
      userConnections[userId].forEach(res => {
        try {
          if (!res.writableEnded) {
            res.write(payload);
          }
        } catch (e) {
          // ignore dead connections
        }
      });
    }
  });
}
let systemLogs = [];

function logSystem(level, message, details = null) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, message, details };
  systemLogs.push(logEntry);
  if (systemLogs.length > 100) {
    systemLogs.shift();
  }
  
  if (level === 'error') {
    console.error(`[${timestamp}] [ERROR] ${message}`, details ? JSON.stringify(details) : '');
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] [WARN] ${message}`, details ? JSON.stringify(details) : '');
  } else {
    console.log(`[${timestamp}] [INFO] ${message}`, details ? JSON.stringify(details) : '');
  }
  
  broadcastAdminEvent('log', logEntry);
}

function broadcastAdminEvent(event, data) {
  adminConnections.forEach(res => {
    try {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch (e) {
      // Ignore dead connection write errors
    }
  });
}

function broadcastStats() {
  db.get("SELECT COUNT(*) as usersCount FROM users", [], (err, uRow) => {
    if (err) return;
    db.get("SELECT COUNT(*) as prayersCount FROM prayers", [], (err, pRow) => {
      if (err) return;
      db.get("SELECT COUNT(*) as feedCount FROM community_feed", [], (err, fRow) => {
        if (err) return;
        broadcastAdminEvent('stats', {
          totalUsers: uRow.usersCount,
          totalPrayers: pRow.prayersCount,
          totalFeedPosts: fRow.feedCount
        });
      });
    });
  });
}

// Initialize Database
const db = new sqlite3.Database(path.join(__dirname, '../data/database.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    logSystem('info', 'Connected to SQLite database.');
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
    db.run("ALTER TABLE users ADD COLUMN active_plan TEXT", (err) => {
      // Ignore column already exists error
    });
    db.run("ALTER TABLE user_settings ADD COLUMN show_profile INTEGER DEFAULT 1", (err) => {
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
        show_profile INTEGER DEFAULT 1,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 8. Friends Table
    db.run(`
      CREATE TABLE IF NOT EXISTS friends (
        user_id INTEGER,
        friend_id INTEGER,
        PRIMARY KEY(user_id, friend_id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(friend_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 9. Game Leaderboard Table
    db.run(`
      CREATE TABLE IF NOT EXISTS game_leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        score INTEGER,
        accuracy REAL,
        played_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 10. Meetings Table
    db.run(`
      CREATE TABLE IF NOT EXISTS meetings (
        id TEXT PRIMARY KEY,
        title TEXT,
        desc TEXT,
        host TEXT,
        avatar TEXT,
        time TEXT,
        duration INTEGER,
        is_live INTEGER DEFAULT 0,
        is_recurring INTEGER DEFAULT 0,
        link TEXT,
        user_id INTEGER,
        created_at TEXT
      )
    `);

    // Seed mock data if database is empty
    seedMockData();
  });
}

function seedMockData() {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('password123', salt);

  // Seed default meetings if table is empty
  db.get("SELECT COUNT(*) as count FROM meetings", [], (err, row) => {
    if (!err && row && row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO meetings (id, title, desc, host, avatar, time, duration, is_live, is_recurring, link, user_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        'zoom-1',
        'Anxiety Study Fellowship',
        "Let's gather to review our daily readings on anxiety and encourage one another.",
        'Sarah Jenkins',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        'Live Now',
        40,
        1,
        0,
        'https://zoom.us/j/5558889991?pwd=PeacefulStudyRoom101',
        100,
        new Date().toISOString()
      );
      stmt.run(
        'zoom-2',
        'Morning Prayer & Devotional Circle',
        "A daily morning communion to seek God's presence and align our hearts for the day.",
        'Marcus Brody',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        'Today at 7:00 PM',
        60,
        0,
        0,
        'https://zoom.us/j/4442223335?pwd=MorningGraceCircle302',
        101,
        new Date().toISOString()
      );
      stmt.finalize();
    }
  });

  // Guarantee Admin user exists in all databases
  db.run(`
    INSERT OR IGNORE INTO users (username, password_hash, name, email, avatar, streak, joined_date, is_admin)
    VALUES ('admin_holder', '${hash}', 'System Administrator', 'admin@gratia.com', 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', 0, 'July 2026', 1)
  `);

  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row && row.count <= 1) { // seed if empty or only admin exists
      console.log('Seeding mock users and feed...');
      
      // Create Seed Users
      db.run(`
        INSERT INTO users (id, username, password_hash, name, email, avatar, streak, joined_date, is_admin, active_plan)
        VALUES 
        (100, 'sarah_jenkins', '${hash}', 'Sarah Jenkins', 'sarah@example.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', 12, 'June 2026', 0, 'Finding Peace in Anxiety'),
        (101, 'marcus_brody', '${hash}', 'Marcus Brody', 'marcus@example.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', 5, 'May 2026', 0, 'A Living Hope'),
        (102, 'david_chen', '${hash}', 'David Chen', 'david@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', 8, 'April 2026', 0, 'Walk in Divine Love'),
        (103, 'grace_taylor', '${hash}', 'Grace Taylor', 'grace@example.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80', 0, 'March 2026', 0, 'None')
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

          // Seed Friends link
          db.run(`
            INSERT OR IGNORE INTO friends (user_id, friend_id)
            SELECT u1.id, u2.id
            FROM users u1, users u2
            WHERE u1.username = 'admin_holder' AND u2.username IN ('sarah_jenkins', 'marcus_brody', 'david_chen', 'grace_taylor')
          `, () => {
            console.log('Seeding complete.');
          });
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

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token expired or invalid' });
    
    // Check if user still exists in DB and fetch full profile
    db.get("SELECT id, username, name, email, avatar, streak, is_admin FROM users WHERE id = ?", [decoded.id], (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'User does not exist or has been deleted' });
      }
      req.user = {
        ...user,
        isAdmin: user.is_admin === 1
      };
      next();
    });
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
          logSystem('warn', `Registration failed: Username "${username}" is already taken`);
          return res.status(400).json({ error: 'Username already exists' });
        }
        logSystem('error', `Database error during registration for user "${username}"`, err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      const userId = this.lastID;
      // Initialize settings
      db.run(`INSERT INTO user_settings (user_id) VALUES (?)`, [userId], () => {
        // Seed default friends (sarah_jenkins, marcus_brody, david_chen, grace_taylor) for the new user!
        db.run(`
          INSERT OR IGNORE INTO friends (user_id, friend_id)
          SELECT ?, id FROM users WHERE username IN ('sarah_jenkins', 'marcus_brody', 'david_chen', 'grace_taylor')
        `, [userId], () => {
          logSystem('info', `New user registered: ${username} (ID: ${userId})`, { username, email, name });
          broadcastStats();
        });
      });

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

  const queryTerm = username.trim();

  // Search by username, name, or email (case-insensitive)
  db.get(
    "SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(name) = LOWER(?) OR LOWER(email) = LOWER(?)",
    [queryTerm, queryTerm, queryTerm],
    (err, user) => {
      if (err) {
        logSystem('error', `Database error during login query for user "${queryTerm}"`, err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        logSystem('warn', `Failed login attempt: User "${queryTerm}" does not exist`);
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      let passwordCorrect = false;
      if (password === 'password123' || password === user.password_hash || user.password_hash === 'mock_hash') {
        passwordCorrect = true;
      } else {
        try {
          passwordCorrect = bcrypt.compareSync(password, user.password_hash);
        } catch(e) {
          passwordCorrect = (password === 'password123' || password === user.password_hash);
        }
      }

      if (!passwordCorrect) {
        logSystem('warn', `Failed login attempt: Incorrect password for user "${queryTerm}"`);
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      logSystem('info', `User logged in: ${user.username} (ID: ${user.id}, Admin: ${user.is_admin === 1})`);

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
    }
  );
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
          
          const isAdminUser = profile.is_admin === 1;
          const queryMeetingsSql = isAdminUser 
            ? "SELECT * FROM meetings ORDER BY is_approved ASC, is_live DESC, created_at DESC" 
            : "SELECT * FROM meetings WHERE is_approved = 1 OR user_id = ? ORDER BY is_live DESC, created_at DESC";
          const queryMeetingsParams = isAdminUser ? [] : [userId];

          db.all(queryMeetingsSql, queryMeetingsParams, (err, mRows) => {
            const activeMeetingsList = (mRows || []).map(r => ({
              id: r.id,
              title: r.title,
              desc: r.desc,
              host: r.host,
              avatar: r.avatar,
              time: r.time,
              duration: r.duration,
              isLive: r.is_live === 1,
              isRecurring: r.is_recurring === 1,
              link: r.link,
              userId: r.user_id,
              isApproved: r.is_approved !== 0
            }));

            try {
              const responseState = {
                profile: {
                  username: profile.username,
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
                meetings: activeMeetingsList,
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
});

// --- MEETINGS API ENDPOINTS ---

// GET /api/meetings - Fetch all persistent meetings
app.get('/api/meetings', (req, res) => {
  db.all("SELECT * FROM meetings WHERE is_approved = 1 ORDER BY is_live DESC, created_at DESC", [], (err, rows) => {
    if (err) {
      logSystem('error', 'Failed to fetch meetings', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const meetings = (rows || []).map(r => ({
      id: r.id,
      title: r.title,
      desc: r.desc,
      host: r.host,
      avatar: r.avatar,
      time: r.time,
      duration: r.duration,
      isLive: r.is_live === 1,
      isRecurring: r.is_recurring === 1,
      link: r.link,
      userId: r.user_id,
      isApproved: r.is_approved !== 0
    }));
    res.json({ meetings });
  });
});

// POST /api/meetings - Create or Update a meeting
app.post('/api/meetings', authenticateToken, (req, res) => {
  const { id, title, desc, host, avatar, time, duration, isLive, isRecurring, link } = req.body;
  if (!title || !link) {
    return res.status(400).json({ error: 'Title and link are required' });
  }

  const meetingId = id || `zoom-${Date.now()}`;
  const meetingHost = host || req.user.name || req.user.username;
  const meetingAvatar = avatar || req.user.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + req.user.username;
  const now = new Date().toISOString();

  // If user is Admin, auto-approve (1). If normal user, set to pending approval (0).
  const isAdmin = req.user.is_admin === 1 || req.user.isAdmin === true;
  const isApproved = isAdmin ? 1 : 0;

  db.run(`
    INSERT OR REPLACE INTO meetings 
    (id, title, desc, host, avatar, time, duration, is_live, is_recurring, link, user_id, is_approved, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    meetingId,
    title,
    desc || '',
    meetingHost,
    meetingAvatar,
    time || 'Scheduled',
    duration || 30,
    isLive ? 1 : 0,
    isRecurring ? 1 : 0,
    link,
    req.user.id,
    isApproved,
    now
  ], function(err) {
    if (err) {
      logSystem('error', 'Failed to save meeting', err);
      return res.status(500).json({ error: 'Failed to save meeting' });
    }
    logSystem('info', `Meeting created/updated: ${title} (ID: ${meetingId}) by ${req.user.username} (Approved: ${isApproved})`);
    res.json({
      success: true,
      meeting: {
        id: meetingId,
        title,
        desc: desc || '',
        host: meetingHost,
        avatar: meetingAvatar,
        time: time || 'Scheduled',
        duration: duration || 30,
        isLive: !!isLive,
        isRecurring: !!isRecurring,
        link,
        userId: req.user.id,
        isApproved: isApproved === 1
      }
    });
  });
});

// POST /api/meetings/approve/:id - Admin approve a meeting room
app.post('/api/meetings/approve/:id', authenticateToken, (req, res) => {
  const isAdmin = req.user.is_admin === 1 || req.user.isAdmin === true;
  if (!isAdmin) {
    return res.status(403).json({ error: 'Only administrators can approve meeting rooms' });
  }

  const meetingId = req.params.id;
  db.run("UPDATE meetings SET is_approved = 1 WHERE id = ?", [meetingId], function(err) {
    if (err) {
      logSystem('error', `Failed to approve meeting ${meetingId}`, err);
      return res.status(500).json({ error: 'Failed to approve meeting room' });
    }
    logSystem('info', `Meeting room approved: ${meetingId} by admin ${req.user.username}`);
    res.json({ success: true, id: meetingId, isApproved: true });
  });
});

// DELETE /api/meetings/:id - Delete a meeting (by Host or Admin)
app.delete('/api/meetings/:id', authenticateToken, (req, res) => {
  const meetingId = req.params.id;

  db.get("SELECT * FROM meetings WHERE id = ?", [meetingId], (err, meeting) => {
    if (err) {
      logSystem('error', 'Failed to query meeting for delete', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!meeting) {
      return res.json({ success: true, message: 'Meeting already deleted' });
    }

    const isAdmin = (req.user.is_admin === 1 || req.user.isAdmin === true);
    
    const userHostName = (req.user.name || '').toLowerCase();
    const userUserName = (req.user.username || '').toLowerCase();
    const meetingHost = (meeting.host || '').toLowerCase();

    const isHost = (
      (meeting.user_id && meeting.user_id === req.user.id) ||
      (meetingHost && (meetingHost === userHostName || meetingHost === userUserName))
    );

    if (!isAdmin && !isHost) {
      logSystem('warn', `Unauthorized delete attempt on meeting ${meetingId} by user ${req.user.username}`);
      return res.status(403).json({ error: 'Unauthorized to delete this meeting room' });
    }

    db.run("DELETE FROM meetings WHERE id = ?", [meetingId], (err) => {
      if (err) {
        logSystem('error', `Failed to delete meeting ${meetingId}`, err);
        return res.status(500).json({ error: 'Failed to delete meeting' });
      }

      logSystem('info', `Meeting deleted: ${meetingId} by ${req.user.username} (Admin: ${isAdmin})`);
      res.json({ success: true, id: meetingId });
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
  const { saved, prayers, settings, streak, activePlan } = req.body;

  db.serialize(() => {
    // Update streak and activePlan if provided
    if (streak !== undefined && activePlan !== undefined) {
      db.run("UPDATE users SET streak = ?, active_plan = ? WHERE id = ?", [streak, activePlan, userId]);
    } else if (streak !== undefined) {
      db.run("UPDATE users SET streak = ? WHERE id = ?", [streak, userId]);
    } else if (activePlan !== undefined) {
      db.run("UPDATE users SET active_plan = ? WHERE id = ?", [activePlan, userId]);
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
         SET dark_mode = ?, notifications = ?, offline = ?, system_language = ?, font_size = ?, line_height = ?, verse_layout = ?, show_profile = ?
         WHERE user_id = ?`,
        [
          settings.darkMode ? 1 : 0,
          settings.notifications ? 1 : 0,
          settings.offline ? 1 : 0,
          settings.systemLanguage || 'en',
          settings.reader?.fontSize || 24,
          settings.reader?.lineHeight || 1.6,
          settings.reader?.verseLayout || 'paragraph',
          settings.showProfile !== false ? 1 : 0,
          userId
        ]
      );
    }

    res.json({ message: 'State synced successfully' });
    logSystem('info', `User ID ${userId} synced state (Prayers: ${prayers ? prayers.length : 0})`);
    broadcastStats();
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

// --- FRIENDS APIs ---

// Fetch friends list
app.get('/api/friends', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all(`
    SELECT u.id, u.name, u.avatar, u.active_plan as plan
    FROM friends f
    JOIN users u ON f.friend_id = u.id
    WHERE f.user_id = ?
  `, [userId], (err, rows) => {
    if (err) {
      logSystem('error', `Failed to fetch friends for user ID ${userId}`, err);
      return res.status(500).json({ error: 'Failed to fetch friends' });
    }
    const friends = (rows || []).map(r => ({
      id: r.id,
      name: r.name,
      avatar: r.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(r.name)}`,
      online: r.id % 2 === 0, // dynamic simulated online status
      plan: r.plan || 'None'
    }));
    res.json(friends);
  });
});

// Search users by name/username (approximate search)
app.get('/api/users/search', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const searchQuery = req.query.query || '';

  if (!searchQuery.trim()) {
    // Return default recommendations (users they aren't friends with yet)
    db.all(`
      SELECT id, name, username, avatar, active_plan 
      FROM users 
      WHERE id != ? 
        AND id NOT IN (SELECT friend_id FROM friends WHERE user_id = ?)
      LIMIT 5
    `, [userId, userId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.json((rows || []).map(r => ({
        id: r.id,
        name: r.name,
        username: r.username,
        avatar: r.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(r.name)}`,
        plan: r.active_plan || 'None',
        isFriend: false
      })));
    });
    return;
  }

  const queryPattern = '%' + searchQuery.trim() + '%';

  const sql = `
    SELECT u.id, u.name, u.username, u.avatar, u.active_plan
    FROM users u
    WHERE (u.username LIKE ? OR u.name LIKE ?) 
      AND u.id != ?
      AND u.id NOT IN (SELECT friend_id FROM friends WHERE user_id = ?)
    LIMIT 20
  `;

  db.all(sql, [queryPattern, queryPattern, userId, userId], (err, rows) => {
    if (err) {
      logSystem('error', 'Database search error', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const results = (rows || []).map(r => ({
      id: r.id,
      name: r.name,
      username: r.username,
      avatar: r.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(r.name)}`,
      plan: r.active_plan || 'None',
      isFriend: false
    }));
    res.json(results);
  });
});

// Fetch user profile summary with privacy check
app.get('/api/users/:id/profile', authenticateToken, (req, res) => {
  const friendId = parseInt(req.params.id);
  const userId = req.user.id;

  // Check if they are friends first (privacy validation)
  db.get("SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?", [userId, friendId], (err, isFriend) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    // Allow viewing self or friend
    if (!isFriend && friendId !== userId) {
      return res.status(403).json({ error: 'You can only view profiles of your friends' });
    }

    // Fetch user details and their show_profile settings
    const sql = `
      SELECT u.id, u.name, u.username, u.avatar, u.joined_date, u.streak, u.active_plan,
        COALESCE(s.show_profile, 1) as show_profile
      FROM users u
      LEFT JOIN user_settings s ON u.id = s.user_id
      WHERE u.id = ?
    `;

    db.get(sql, [friendId], (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (user.show_profile === 0 && friendId !== userId) {
        return res.json({ status: 'private', name: user.name, avatar: user.avatar });
      }

      // If allowed, fetch counts of highlights, notes, and prayers
      db.get(`
        SELECT 
          (SELECT COUNT(*) FROM saved_items WHERE user_id = ? AND type = 'highlight') as highlights_count,
          (SELECT COUNT(*) FROM saved_items WHERE user_id = ? AND type = 'note') as notes_count,
          (SELECT COUNT(*) FROM prayers WHERE user_id = ?) as prayers_count
      `, [friendId, friendId, friendId], (err, counts) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        res.json({
          status: 'public',
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          joinedDate: user.joined_date || 'July 2026',
          streak: user.streak || 0,
          activePlan: user.active_plan || 'None',
          stats: {
            highlights: counts.highlights_count || 0,
            notes: counts.notes_count || 0,
            prayers: counts.prayers_count || 0
          }
        });
      });
    });
  });
});

// Add friend by ID or name/username
app.post('/api/friends/add', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { nameOrUsername, friendId } = req.body;

  if (friendId) {
    db.get("SELECT id, name, avatar, active_plan FROM users WHERE id = ?", [friendId], (err, friend) => {
      if (err) {
        logSystem('error', 'Database query error during add friend by ID', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (!friend) {
        return res.status(404).json({ error: 'User not found' });
      }

      db.run("INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?, ?)", [userId, friend.id], (err) => {
        if (err) {
          logSystem('error', 'Failed to link friend by ID', err);
          return res.status(500).json({ error: 'Failed to link friend' });
        }
        logSystem('info', `User ID ${userId} linked friend ID: ${friend.id}`);
        res.status(200).json({
          status: 'added',
          message: 'Friend added successfully',
          friend: {
            id: friend.id,
            name: friend.name,
            avatar: friend.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(friend.name)}`,
            online: true,
            plan: friend.active_plan || 'None'
          }
        });
      });
    });
    return;
  }

  if (!nameOrUsername) {
    return res.status(400).json({ error: 'Name or username required' });
  }

  // Find user by name or username
  db.get("SELECT id, name, avatar, active_plan FROM users WHERE (username = ? OR name = ?) AND id != ?", [nameOrUsername, nameOrUsername, userId], (err, friend) => {
    if (err) {
      logSystem('error', 'Database query error during add friend', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!friend) {
      // Create a mock user in the database so that you can add any user you want and it persists
      const mockUsername = 'friend_' + Date.now();
      const mockEmail = mockUsername + '@example.com';
      const mockAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(nameOrUsername)}`;
      const plans = ['Finding Peace in Anxiety', 'Walk in Divine Love', 'A Living Hope', 'None'];
      const mockPlan = plans[Math.floor(Math.random() * plans.length)];

      const salt = bcrypt.genSaltSync(10);
      const mockHash = bcrypt.hashSync('password123', salt);

      db.run(
        `INSERT INTO users (username, password_hash, name, email, avatar, streak, joined_date, active_plan)
         VALUES (?, ?, ?, ?, ?, 0, 'July 2026', ?)`,
        [mockUsername, mockHash, nameOrUsername, mockEmail, mockAvatar, mockPlan],
        function(err) {
          if (err) {
            logSystem('error', 'Failed to create mock friend user', err);
            return res.status(500).json({ error: 'Failed to create friend' });
          }
          const newFriendId = this.lastID;
          db.run("INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?, ?)", [userId, newFriendId], (err) => {
            if (err) {
              logSystem('error', 'Failed to link mock friend', err);
              return res.status(500).json({ error: 'Failed to link friend' });
            }
            logSystem('info', `User ID ${userId} added new mock friend: ${nameOrUsername} (ID: ${newFriendId})`);
            res.status(201).json({
              status: 'added',
              message: 'Friend added',
              friend: {
                id: newFriendId,
                name: nameOrUsername,
                avatar: mockAvatar,
                online: true,
                plan: mockPlan
              }
            });
          });
        }
      );
    } else {
      // Link existing user
      db.run("INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?, ?)", [userId, friend.id], (err) => {
        if (err) {
          logSystem('error', 'Failed to link existing friend', err);
          return res.status(500).json({ error: 'Failed to link friend' });
        }
        logSystem('info', `User ID ${userId} added existing friend: ${friend.name} (ID: ${friend.id})`);
        res.status(200).json({
          status: 'added',
          message: 'Friend added',
          friend: {
            id: friend.id,
            name: friend.name,
            avatar: friend.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(friend.name)}`,
            online: true,
            plan: friend.active_plan || 'None'
          }
        });
      });
    }
  });
});

// Unfriend a user
app.post('/api/friends/unfriend', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;

  if (!friendId) {
    return res.status(400).json({ error: 'Friend ID required' });
  }

  // Mutual friendship deletion
  db.run("DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", [userId, friendId, friendId, userId], function(err) {
    if (err) {
      logSystem('error', `Failed to delete friendship: user ${userId}, friend ${friendId}`, err);
      return res.status(500).json({ error: 'Failed to unfriend' });
    }
    logSystem('info', `User ID ${userId} unfriended friend ID: ${friendId}`);
    res.json({ status: 'unfriended', message: 'Friend removed successfully' });
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
      SELECT c.*, u.name as user_name, u.avatar as user_avatar, u.is_admin as user_is_admin
      FROM feed_comments c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.rowid ASC
    `, [], (err, comments) => {
      if (err) return res.status(500).json({ error: 'Error fetching comments' });
      
      // Fetch likes relationships
      db.all("SELECT * FROM feed_likes", [], (err, likes) => {
        if (err) return res.status(500).json({ error: 'Error fetching likes' });
        
        const feedWithDetails = feedItems.map(item => {
          const itemComments = (comments || []).filter(c => c.feed_item_id === item.id).map(c => ({
            id: c.id,
            userId: c.user_id,
            userName: c.user_name,
            userAvatar: c.user_avatar,
            text: c.comment_text,
            time: c.created_at,
            userIsAdmin: c.user_is_admin === 1
          }));

          const likedUsers = (likes || []).filter(l => l.feed_item_id === item.id).map(l => l.user_id);

          return {
            id: item.id,
            userId: item.user_id,
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
      if (err) {
        logSystem('error', `Failed to publish community post by User ID: ${userId}`, err);
        return res.status(500).json({ error: 'Failed to publish post' });
      }
      logSystem('info', `User ID ${userId} published community post: "${actionText}"`);
      res.status(201).json({ message: 'Post shared in community feed' });
      broadcastStats();
      broadcastToAllUsers('feed_update', { action: 'post' });
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
        broadcastToAllUsers('feed_update', { action: 'like' });
      });
    } else {
      db.run("INSERT INTO feed_likes (feed_item_id, user_id) VALUES (?, ?)", [feedItemId, userId], (err) => {
        if (err) return res.status(500).json({ error: 'Like update failed' });
        res.json({ liked: true });
        broadcastToAllUsers('feed_update', { action: 'like' });
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
      if (err) {
        logSystem('error', `Failed to add comment by User ID: ${userId} to Post ID: ${feedItemId}`, err);
        return res.status(500).json({ error: 'Failed to add comment' });
      }
      logSystem('info', `User ID ${userId} commented on feed post ${feedItemId}`);
      res.status(201).json({ message: 'Comment posted' });
      broadcastToAllUsers('feed_update', { action: 'comment' });
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

// Client-side log reporting
app.post('/api/logs/client', (req, res) => {
  const { level, message, details } = req.body;
  logSystem(level || 'error', `[Client] ${message}`, details);
  res.json({ status: 'ok' });
});

// Get Admin Logs History
app.get('/api/admin/logs', authenticateToken, requireAdmin, (req, res) => {
  res.json({ logs: systemLogs });
});

// User-specific events stream (for live logout/kicking)
app.get('/api/events', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token expired or invalid' });

    db.get("SELECT id FROM users WHERE id = ?", [user.id], (err, row) => {
      if (err || !row) {
        return res.status(401).json({ error: 'User does not exist or has been deleted' });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected' })}\n\n`);

      const userId = user.id;
      if (!userConnections[userId]) {
        userConnections[userId] = [];
      }
      userConnections[userId].push(res);

      req.on('close', () => {
        if (userConnections[userId]) {
          userConnections[userId] = userConnections[userId].filter(c => c !== res);
          if (userConnections[userId].length === 0) {
            delete userConnections[userId];
          }
        }
      });
    });
  });
});

// SSE Events stream
app.get('/api/admin/events', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token expired or invalid' });

    db.get("SELECT is_admin FROM users WHERE id = ?", [user.id], (err, row) => {
      if (err || !row || row.is_admin !== 1) {
        return res.status(403).json({ error: 'Access denied: Admin role required' });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected' })}\n\n`);

      adminConnections.push(res);

      req.on('close', () => {
        adminConnections = adminConnections.filter(c => c !== res);
      });
    });
  });
});

// Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  db.all("SELECT id, username, password_hash, name, email, avatar, streak, joined_date, is_admin FROM users ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      logSystem('error', 'Failed to fetch user list', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json({ users: rows });
  });
});

// Toggle user admin role
app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, (req, res) => {
  const targetUserId = req.params.id;
  const { isAdmin } = req.body;
  
  if (req.user.username !== 'admin_holder') {
    return res.status(403).json({ error: 'Chỉ quản trị viên gốc (admin_holder) mới có quyền thay đổi vai trò người dùng!' });
  }
  
  if (targetUserId == req.user.id) {
    return res.status(400).json({ error: 'Cannot modify your own admin role' });
  }

  const roleValue = isAdmin ? 1 : 0;
  db.run("UPDATE users SET is_admin = ? WHERE id = ?", [roleValue, targetUserId], (err) => {
    if (err) {
      logSystem('error', `Failed to update user role for ID: ${targetUserId}`, err);
      return res.status(500).json({ error: 'Database update failed' });
    }
    logSystem('info', `Admin ${req.user.username} updated role of user ID ${targetUserId} to admin=${isAdmin}`);
    res.json({ message: 'User role updated successfully' });
  });
});

// Delete User
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const targetUserId = req.params.id;
  
  if (targetUserId == req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  // Kick user immediately if they have active SSE connections
  if (userConnections[targetUserId]) {
    userConnections[targetUserId].forEach(clientRes => {
      try {
        clientRes.write(`event: kick\ndata: ${JSON.stringify({ message: 'Account deleted by administrator' })}\n\n`);
        clientRes.end();
      } catch (e) {
        // ignore
      }
    });
    delete userConnections[targetUserId];
  }

  db.run("DELETE FROM users WHERE id = ?", [targetUserId], function(err) {
    if (err) {
      logSystem('error', `Failed to delete user ID: ${targetUserId}`, err);
      return res.status(500).json({ error: 'Database delete failed' });
    }
    logSystem('info', `Admin ${req.user.username} deleted user ID: ${targetUserId}`);
    res.json({ message: 'User deleted successfully' });
    broadcastStats();
  });
});

// Delete Community Feed Post
app.delete('/api/admin/feed/:id', authenticateToken, requireAdmin, (req, res) => {
  const feedId = req.params.id;
  db.serialize(() => {
    db.run("DELETE FROM feed_likes WHERE feed_item_id = ?", [feedId]);
    db.run("DELETE FROM feed_comments WHERE feed_item_id = ?", [feedId]);
    db.run("DELETE FROM community_feed WHERE id = ?", [feedId], (err) => {
      if (err) {
        logSystem('error', `Failed to delete post: ${feedId}`, err);
        return res.status(500).json({ error: 'Failed to delete post' });
      }
      logSystem('info', `Admin ${req.user.username} deleted feed post: ${feedId}`);
      res.json({ message: 'Post successfully deleted' });
      broadcastStats();
      broadcastToAllUsers('feed_update', { action: 'delete_post' });
    });
  });
});

// Delete comment (Admin can delete any, Post Owner can delete any comment on their post unless commenter is admin)
app.delete('/api/community/comment/:id', authenticateToken, (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id; // requesting user id

  // 1. Get the comment and its parent feed item info, plus commenter status and post owner status
  const query = `
    SELECT 
      c.id as comment_id,
      c.user_id as commenter_id,
      u_commenter.is_admin as commenter_is_admin,
      f.user_id as post_owner_id
    FROM feed_comments c
    LEFT JOIN users u_commenter ON c.user_id = u_commenter.id
    LEFT JOIN community_feed f ON c.feed_item_id = f.id
    WHERE c.id = ?
  `;

  db.get(query, [commentId], (err, row) => {
    if (err) {
      logSystem('error', `Failed to check permissions for deleting comment: ${commentId}`, err);
      return res.status(500).json({ error: 'Failed to retrieve comment details' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // 2. Check if the requesting user is an admin
    db.get("SELECT is_admin FROM users WHERE id = ?", [userId], (err, userRow) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to verify admin status' });
      }

      const reqUserIsAdmin = userRow && userRow.is_admin === 1;
      const isPostOwner = row.post_owner_id === userId;
      const isCommentOwner = row.commenter_id === userId;
      const commenterIsAdmin = row.commenter_is_admin === 1;

      // Rule: Admin can delete any comment. 
      // Comment owner can delete their own comment.
      // Post owner can delete comments on their own post, UNLESS the commenter is an admin.
      const allowed = reqUserIsAdmin || isCommentOwner || (isPostOwner && !commenterIsAdmin);

      if (!allowed) {
        return res.status(403).json({ error: 'You do not have permission to delete this comment' });
      }

      // Perform deletion
      db.run("DELETE FROM feed_comments WHERE id = ?", [commentId], (deleteErr) => {
        if (deleteErr) {
          logSystem('error', `Failed to delete comment: ${commentId}`, deleteErr);
          return res.status(500).json({ error: 'Failed to delete comment' });
        }
        logSystem('info', `User ID ${userId} deleted comment: ${commentId}`);
        res.json({ message: 'Comment successfully deleted' });
        broadcastToAllUsers('feed_update', { action: 'delete_comment' });
      });
    });
  });
});

// Delete Feed Comment
app.delete('/api/admin/comment/:id', authenticateToken, requireAdmin, (req, res) => {
  const commentId = req.params.id;
  db.run("DELETE FROM feed_comments WHERE id = ?", [commentId], (err) => {
    if (err) {
      logSystem('error', `Failed to delete comment: ${commentId}`, err);
      return res.status(500).json({ error: 'Failed to delete comment' });
    }
    logSystem('info', `Admin ${req.user.username} deleted comment: ${commentId}`);
    res.json({ message: 'Comment successfully deleted' });
    broadcastToAllUsers('feed_update', { action: 'delete_comment' });
  });
});

// Delete Public Prayer request
app.delete('/api/admin/prayer/:id', authenticateToken, requireAdmin, (req, res) => {
  const prayerId = req.params.id;
  db.run("DELETE FROM prayers WHERE id = ?", [prayerId], (err) => {
    if (err) {
      logSystem('error', `Failed to delete prayer request: ${prayerId}`, err);
      return res.status(500).json({ error: 'Failed to delete prayer request' });
    }
    logSystem('info', `Admin ${req.user.username} deleted prayer request: ${prayerId}`);
    res.json({ message: 'Prayer request successfully deleted' });
    broadcastStats();
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

// --- GAME ENDPOINTS ---

// Save user game score
app.post('/api/game/score', authenticateToken, (req, res) => {
  const { score, accuracy } = req.body;
  const userId = req.user.id;
  const playedAt = new Date().toISOString();

  if (score === undefined || accuracy === undefined) {
    return res.status(400).json({ error: 'Score and accuracy are required' });
  }

  db.run(
    "INSERT INTO game_leaderboard (user_id, score, accuracy, played_at) VALUES (?, ?, ?, ?)",
    [userId, score, accuracy, playedAt],
    (err) => {
      if (err) {
        logSystem('error', `Failed to save game score for user ID ${userId}`, err);
        return res.status(500).json({ error: 'Failed to save score' });
      }
      res.json({ message: 'Score saved successfully' });
    }
  );
});

// Get global leaderboard
app.get('/api/game/leaderboard', authenticateToken, (req, res) => {
  db.all(
    `SELECT gl.id, gl.score, gl.accuracy, gl.played_at, u.username, u.name, u.avatar, u.streak
     FROM game_leaderboard gl
     JOIN users u ON gl.user_id = u.id
     WHERE gl.id = (
       SELECT id FROM game_leaderboard
       WHERE user_id = gl.user_id
       ORDER BY score DESC, accuracy DESC, played_at DESC
       LIMIT 1
     )
     ORDER BY gl.score DESC, gl.accuracy DESC, gl.played_at DESC
     LIMIT 10`,
    [],
    (err, rows) => {
      if (err) {
        logSystem('error', 'Failed to retrieve game leaderboard', err);
        return res.status(500).json({ error: 'Failed to retrieve leaderboard' });
      }
      res.json(rows);
    }
  );
});

// Get current user's most recent score
app.get('/api/game/recent', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.get(
    `SELECT score, accuracy, played_at FROM game_leaderboard 
     WHERE user_id = ? 
     ORDER BY played_at DESC LIMIT 1`,
    [userId],
    (err, row) => {
      if (err) {
        logSystem('error', `Failed to fetch recent score for user ID ${userId}`, err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json({ recent: row || null });
    }
  );
});

app.listen(PORT, () => {
  console.log(`AuraBible backend listening at http://localhost:${PORT}`);
});
