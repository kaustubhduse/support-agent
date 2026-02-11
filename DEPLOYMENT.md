# Deployment Guide

## Prerequisites
- GitHub repository (already created)
- Database: Neon PostgreSQL (already configured)
- AI API Key: Together AI (already configured)

---

## Option 1: Vercel Deployment (Recommended)

### Why Vercel?
- Optimized for Next.js/fullstack apps
- Automatic HTTPS & CDN
- Free tier includes serverless functions
- Easy environment variable management

### Steps

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Create `vercel.json` in project root
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/backend/src/server.ts",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/backend/src/server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

#### 3. Deploy
```bash
cd c:\Users\Kaustubh Duse\OneDrive\Desktop\swades-ai\ai-support-system
vercel
```

Follow prompts:
- Link to existing project? **No**
- Project name? **support-agent**
- Directory? **./** (root)

#### 4. Set Environment Variables
```bash
vercel env add DATABASE_URL
vercel env add TOGETHER_API_KEY
```

Or via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `DATABASE_URL`
   - `TOGETHER_API_KEY`

#### 5. Redeploy with env vars
```bash
vercel --prod
```

---

## Option 2: Railway Deployment (Simpler)

### Why Railway?
- One-click PostgreSQL addon
- Simpler for Node.js backends
- Automatic deployments from GitHub

### Steps

#### 1. Sign up at https://railway.app

#### 2. Create New Project
- Choose "Deploy from GitHub repo"
- Select `kaustubhduse/support-agent`
- Railway auto-detects Node.js

#### 3. Add Environment Variables
In Railway dashboard:
- `DATABASE_URL` (from Neon, or use Railway's PostgreSQL addon)
- `TOGETHER_API_KEY`
- `PORT=3000`

#### 4. Deploy
Railway automatically builds and deploys on push to `main`.

---

## Post-Deployment Checklist

### 1. Database Migration
```bash
# Run migrations on production database
npx prisma migrate deploy
npx prisma db seed
```

### 2. Test Live API
```bash
curl https://your-deployed-url.vercel.app/api/health
```

Should return:
```json
{"status": "ok"}
```

### 3. Test Chat
Visit `https://your-deployed-url.vercel.app` and try:
- "Where is order ORD123?"
- "Check invoice INV123"

### 4. Monitor Logs
**Vercel:**
```bash
vercel logs
```

**Railway:**
Check Deployments → Logs in dashboard

---

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check Neon project is active
- Test connection: `npx prisma db push`

### API Errors
- Check environment variables are set in production
- Verify Together AI API key is valid
- Check rate limits (60 RPM on free tier)

### CORS Issues
If frontend can't reach backend:
- Ensure `CORS` is configured in `src/index.ts`
- Add allowed origins for production URL

---

## Custom Domain (Optional)

### Vercel
1. Buy domain (e.g., GoDaddy, Namecheap)
2. Vercel Dashboard → Settings → Domains
3. Add domain and follow DNS instructions

### Railway
1. Settings → Networking → Custom Domain
2. Add domain and configure DNS
