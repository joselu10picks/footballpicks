const express = require('express');
const path = require('path');
const cors = require('cors');
const { initializeDatabase, getAllPicks, getPicksCount, getUserStats, addPick } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Add production-specific configurations here
  console.log('Running in production mode');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database on startup
initializeDatabase();

// API Routes

// GET /api/picks - Retrieve picks with pagination
app.get('/api/picks', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const [picks, totalCount] = await Promise.all([
      getAllPicks(limit, offset),
      getPicksCount()
    ]);
    
    res.json({
      picks,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching picks:', error);
    res.status(500).json({ error: 'Failed to fetch picks' });
  }
});

// GET /api/stats - Get user statistics
app.get('/api/stats', async (req, res) => {
  try {
    const [userStats, totalPicks] = await Promise.all([
      getUserStats(),
      getPicksCount()
    ]);
    
    res.json({
      totalPicks,
      totalUsers: userStats.length,
      topUsers: userStats.slice(0, 10),
      recentActivity: userStats.filter(user => {
        const lastPick = new Date(user.last_pick);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastPick > oneDayAgo;
      }).length
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// POST /api/picks - Add a new pick
app.post('/api/picks', async (req, res) => {
  try {
    const { username, match, prediction, betting_code } = req.body;
    
    // Basic validation
    if (!username || !match || !prediction) {
      return res.status(400).json({ 
        error: 'Username, match, and prediction are required' 
      });
    }

    const newPick = await addPick({
      username: username.trim(),
      match: match.trim(),
      prediction: prediction.trim(),
      betting_code: betting_code ? betting_code.trim() : null
    });

    res.status(201).json(newPick);
  } catch (error) {
    console.error('Error adding pick:', error);
    res.status(500).json({ error: 'Failed to add pick' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`NewtonianWay server running on http://localhost:${PORT}`);
});

