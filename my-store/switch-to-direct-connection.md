# Switch to Direct PostgreSQL Connection

## Why Switch?

- **Prisma Studio works better** with direct connections
- **No "prepared statement" errors**
- **Easier debugging**
- Connection Pooling is mainly for production serverless apps

## Get Your Direct Connection String

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**
3. Scroll to **Connection string** (NOT "Connection Pooling")
4. Select the **URI** tab
5. Copy the connection string

It should look like:
```
postgresql://postgres.tnpspjnxnsfsdllkkgbd:your-password@db.tnpspjnxnsfsdllkkgbd.supabase.co:5432/postgres
```

**Key differences:**
- Port: `5432` (not 6543)
- Hostname: `db.xxx.supabase.co` (not `pooler.supabase.com`)
- No `pgbouncer=true` parameter needed

## Update .env.local

1. Open `.env.local`
2. Find `DATABASE_URL`
3. Replace it with your direct connection string:

```
DATABASE_URL="postgresql://postgres.tnpspjnxnsfsdllkkgbd:your-password@db.tnpspjnxnsfsdllkkgbd.supabase.co:5432/postgres?sslmode=require"
```

**Important:** URL-encode special characters in your password:
- `|` → `%7C`
- `}` → `%7D`
- `$` → `%24`
- etc.

## After Updating

1. **Regenerate Prisma Client:**
   ```powershell
   npx prisma generate
   ```

2. **Test connection:**
   ```powershell
   node scripts/verify-tables.js
   ```

3. **Start Prisma Studio:**
   ```powershell
   npm run db:studio
   ```

## For Production (Vercel)

Keep Connection Pooling for production:
- In Vercel, set `DATABASE_URL` to the Connection Pooling string (port 6543)
- For local development, use direct connection (port 5432)

Or use two different variables:
- `DATABASE_URL` - Direct connection (local dev)
- `DATABASE_URL_POOLER` - Connection Pooling (production)

Then update your code to use the appropriate one based on environment.

## Troubleshooting

### Error: "Can't reach database server"

- Check if your IP is allowed in Supabase
- Go to **Settings** → **Database** → **Connection Pooling**
- Check **IPv4** or **IPv6** restrictions
- You might need to add your IP to the allowlist

### Error: "Connection timeout"

- Direct connections can timeout if your IP isn't whitelisted
- Check Supabase firewall settings
- Try Connection Pooling if direct doesn't work

### Still getting "table does not exist"

1. Verify you're using the correct project ID
2. Check table names in Supabase SQL Editor
3. Make sure tables are capitalized: `User`, `Category`, etc.

