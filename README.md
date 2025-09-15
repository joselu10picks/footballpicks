# NewtonianWay - Football Picks MVP

A minimalist, elegant MVP for a football picks website with a sophisticated dark theme and modern design.

## Features

- **Display Picks**: Clean, chronological list of all user-submitted picks
- **Submission Form**: Simple form for users to submit new picks
- **SQLite Database**: All data persisted in a local SQLite database
- **Dark Theme**: Premium design with animated particle background and glass effects
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Frontend**: Vanilla JavaScript + Tailwind CSS
- **Styling**: Custom CSS with glass morphism effects

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   Open your browser and go to `http://localhost:3000`

## Development

For development with auto-restart:
```bash
npm run dev
```

## File Structure

```
newtonianway-football-picks/
├── server.js              # Express server with API endpoints
├── database.js            # SQLite database setup and operations
├── package.json           # Dependencies and scripts
├── public/
│   ├── index.html         # Main page with dark theme
│   └── script.js          # Frontend JavaScript logic
└── README.md              # This file
```

## API Endpoints

- `GET /api/picks` - Retrieve all picks
- `POST /api/picks` - Submit a new pick

## Database Schema

The `picks` table contains:
- `id` (INTEGER, PRIMARY KEY)
- `username` (TEXT, NOT NULL)
- `match` (TEXT, NOT NULL)
- `prediction` (TEXT, NOT NULL)
- `betting_code` (TEXT, OPTIONAL)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

## Design Features

- **Animated Background**: Subtle particle effects with floating gradients
- **Glass Morphism**: Translucent cards with backdrop blur effects
- **Gradient Text**: "NewtonianWay" title with colorful gradient
- **Hover Effects**: Smooth transitions and interactive elements
- **Responsive Grid**: Adapts to different screen sizes
- **Form Validation**: Client and server-side validation
- **Error Handling**: User-friendly error and success messages

## Usage

1. Fill out the submission form with:
   - Username (required)
   - Match details (required)
   - Your prediction (required)
   - Betting code (optional)

2. Submit your pick to see it appear in the chronological list

3. View all submitted picks on the homepage

The application automatically saves all data to the SQLite database and displays picks in reverse chronological order (newest first).


