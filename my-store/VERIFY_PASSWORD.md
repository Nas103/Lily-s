# Fix "Tenant or user not found" Error

## The Problem

"Tenant or user not found" means the database credentials are incorrect. This is usually:
- Wrong password
- Wrong username format
- Wrong project ID

## Solution 1: Verify Password

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**
3. Scroll to **Database Password**
4. Verify or reset your password
5. Make sure it matches what you're using in the connection string

## Solution 2: Use Transaction Mode Connection String

Try the **Transaction** mode connection string instead of Session:

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **Connection Pooling**
3. Select **Transaction** mode (not Session)
4. Copy the connection string
5. It should have port **6543** (not 5432)

Transaction mode connection string format:
```
postgresql://postgres.tnpspjnxnsfsdllkkgbd:PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

## Solution 3: Use Direct Connection

If Connection Pooling doesn't work, try direct connection:

1. Go to **Settings** → **Database**
2. Under **Connection string** (NOT Connection Pooling)
3. Select **URI** tab
4. Copy the connection string
5. It should have port **5432** and hostname `db.xxx.supabase.co` (not `pooler.supabase.com`)

## Solution 4: Reset Database Password

If nothing works, reset the password:

1. Go to **Settings** → **Database**
2. Click **Reset Database Password**
3. Set a new password (preferably without special characters)
4. Update your connection string with the new password

## After Fixing

1. Update `.env.local` with the correct connection string
2. Run: `npx prisma generate`
3. Test: `node scripts/verify-tables.js`

## Quick Test

Try this connection string format (replace PASSWORD with your actual password):

```
DATABASE_URL="postgresql://postgres.tnpspjnxnsfsdllkkgbd:PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"
```

If your password has special characters, URL-encode them:
- `|` → `%7C`
- `}` → `%7D`
- `$` → `%24`

