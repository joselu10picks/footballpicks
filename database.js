const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'football_picks.db');
const db = new sqlite3.Database(dbPath);

// Set timezone to West African Time (UTC+1)
db.run("PRAGMA timezone = '+01:00'");

// Initialize database and create picks table
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS picks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          match TEXT NOT NULL,
          prediction TEXT NOT NULL,
          betting_code TEXT,
          created_at DATETIME DEFAULT (datetime('now', '+01:00'))
        )
      `, (err) => {
        if (err) {
          console.error('Error creating picks table:', err);
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve();
        }
      });
    });
  });
}

// Get all picks ordered by creation date (newest first)
function getAllPicks(limit = 50, offset = 0) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT id, username, match, prediction, betting_code, created_at
      FROM picks
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get total count of picks
function getPicksCount() {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT COUNT(*) as count
      FROM picks
    `, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

// Get user statistics
function getUserStats() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        username,
        COUNT(*) as pick_count,
        MAX(created_at) as last_pick
      FROM picks
      GROUP BY username
      ORDER BY pick_count DESC
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Add a new pick
function addPick(pickData) {
  return new Promise((resolve, reject) => {
    const { username, match, prediction, betting_code } = pickData;
    
    db.run(`
      INSERT INTO picks (username, match, prediction, betting_code)
      VALUES (?, ?, ?, ?)
    `, [username, match, prediction, betting_code], function(err) {
      if (err) {
        reject(err);
      } else {
        // Return the newly created pick
        db.get(`
          SELECT id, username, match, prediction, betting_code, created_at
          FROM picks
          WHERE id = ?
        `, [this.lastID], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }
    });
  });
}

// Close database connection
function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
  });
}

module.exports = {
  initializeDatabase,
  getAllPicks,
  getPicksCount,
  getUserStats,
  addPick,
  closeDatabase
};

