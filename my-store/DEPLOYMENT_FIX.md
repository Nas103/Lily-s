# Deployment Fix - Old Version Showing

## If using Vercel:

### Option 1: Via Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click the three dots (⋯) on the latest deployment
5. Click "Redeploy"
6. **Uncheck "Use existing Build Cache"**
7. Click "Redeploy"

### Option 2: Via Vercel CLI
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Force redeploy without cache
vercel --prod --force
```

### Option 3: Trigger via Git
```bash
# Make a small change to trigger new deployment
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Clear Browser Cache
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or clear browser cache completely

## Check Deployment Status
1. Go to Vercel dashboard
2. Check the latest deployment commit hash matches: `6836ecd`
3. Check build logs for any errors

## Environment Variables
Make sure all environment variables are set in Vercel:
- Go to Project Settings → Environment Variables
- Verify all required vars are present (DATABASE_URL, OPENAI_API_KEY, etc.)

