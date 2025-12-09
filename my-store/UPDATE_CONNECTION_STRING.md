# Update Connection String - Final Fix

## The Error

"Tenant or user not found" means the database credentials are incorrect.

## Solution

Get the **exact** connection string from Supabase:

### Step 1: Get Connection String from Supabase

1. Go to **Supabase Dashboard**
2. Select your project: **tnpspjnxnsfsdllkkgbd**
3. Click **Settings** → **Database**
4. Scroll to **Connection Pooling**
5. Select **Session** mode
6. Copy the **entire connection string**

It should look like:
```
postgresql://postgres.tnpspjnxnsfsdllkkgbd:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

### Step 2: Update .env.local

1. Open `.env.local` in your project
2. Find the `DATABASE_URL` line
3. Replace it with the connection string from Supabase
4. **Important:** Make sure to:
   - Keep the password exactly as shown (or URL-encode special characters)
   - Add `?sslmode=require&pgbouncer=true&connect_timeout=15` at the end

Final format:
```
DATABASE_URL="postgresql://postgres.tnpspjnxnsfsdllkkgbd:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=15"
```

### Step 3: URL Encode Password (if needed)

If your password has special characters, they need to be URL-encoded:
- `|` → `%7C`
- `}` → `%7D`
- `$` → `%24`
- `&` → `%26`
- `#` → `%23`
- `?` → `%3F`
- `/` → `%2F`
- `:` → `%3A`
- `@` → `%40`
- `=` → `%3D`
- `+` → `%2B`

### Step 4: Regenerate and Test

```powershell
npx prisma generate
node scripts/verify-tables.js
```

## Common Issues

### Issue: Password has special characters

**Solution:** URL-encode them or use the exact password from Supabase connection string.

### Issue: Wrong project ID

**Solution:** Make sure you're using project `tnpspjnxnsfsdllkkgbd` (not `cerclrsxxsrladrhwbme`).

### Issue: Wrong region

**Solution:** Make sure region is `eu-west-1` (not `us-east-1`).

## Quick Fix Script

If you have the correct password, run:
```powershell
.\fix-to-correct-project-final.ps1
```

This will update everything automatically.

