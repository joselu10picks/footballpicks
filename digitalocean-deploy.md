# Deploy NewtonianWay to DigitalOcean App Platform

## Step 1: Create DigitalOcean Account
Sign up at https://cloud.digitalocean.com

## Step 2: Connect GitHub
- Link your GitHub account
- Select your NewtonianWay repository

## Step 3: Configure App
- **Source**: GitHub repository
- **Type**: Web Service
- **Build Command**: `npm install`
- **Run Command**: `npm start`
- **Port**: 3000

## Step 4: Environment Variables
Add in DigitalOcean dashboard:
```
NODE_ENV=production
PORT=3000
```

## Step 5: Database
- Add managed PostgreSQL database
- Or use external database service

## Step 6: Deploy
- Click "Create Resources"
- DigitalOcean handles the rest

## Cost: $5/month for basic app + database

