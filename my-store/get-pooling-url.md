# How to Get Connection Pooling URL from Supabase

## Quick Steps:

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Navigate to Database Settings**
   - Click **Settings** (gear icon) in the left sidebar
   - Click **Database** in the settings menu

3. **Find Connection Pooling**
   - Scroll down to the **"Connection Pooling"** section
   - You'll see different connection modes

4. **Copy Session Mode Connection String**
   - Under **"Session"** mode, you'll see a connection string
   - It should look like:
     ```
     postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```
   - **Click the copy button** or select and copy the entire string

5. **Important Details:**
   - ✅ Should have `.pooler` in the hostname
   - ✅ Should use port `6543` (not 5432)
   - ✅ Should have `postgres.[project-ref]` format (not just `postgres`)

## What to Look For:

**❌ Direct Connection (Current - Not Working):**
```
postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

**✅ Connection Pooling (What You Need):**
```
postgresql://postgres.project-ref:password@aws-0-region.pooler.supabase.com:6543/postgres
```

## After You Get It:

1. Run: `.\update-to-pooling.ps1`
2. Paste the Connection Pooling string when prompted
3. Restart your dev server

