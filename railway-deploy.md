# Deploy NewtonianWay to Railway

## Step 1: Prepare for Deployment

1. **Create a Railway account** at https://railway.app
2. **Connect your GitHub** account (or create one if needed)

## Step 2: Add Environment Variables

Create a `.env` file in your project root:
```
PORT=3000
NODE_ENV=production
```

## Step 3: Update package.json

Add this to your package.json scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step needed'"
  }
}
```

## Step 4: Deploy

1. **Push your code to GitHub**
2. **Connect Railway to your GitHub repo**
3. **Railway will auto-detect Node.js and deploy**
4. **Your app will be live at a Railway URL**

## Step 5: Database

Railway provides PostgreSQL, but for simplicity, you can:
- Keep SQLite for now (files are persistent)
- Or upgrade to PostgreSQL later

## Cost: FREE tier available

