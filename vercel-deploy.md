# Deploy NewtonianWay to Vercel

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Create vercel.json
Create this file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

## Step 3: Deploy
```bash
vercel
```

## Step 4: Database
- Vercel works with external databases
- Consider using PlanetScale (MySQL) or Supabase (PostgreSQL)
- Or keep SQLite with external storage

## Cost: FREE tier available

