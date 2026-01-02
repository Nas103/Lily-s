# Database Setup for Mobile App

## Issue
The mobile app can't authenticate because `DATABASE_URL` is not set in the backend.

## Solution

You need to create a `.env.local` file in the `my-store/` directory with your database connection string.

### Steps:

1. **Create `.env.local` file:**
   ```bash
   cd my-store
   touch .env.local
   ```

2. **Add your DATABASE_URL:**
   ```bash
   # Edit .env.local and add:
   DATABASE_URL="your-database-connection-string"
   ```

3. **Example formats:**
   ```bash
   # PostgreSQL (local)
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   
   # PostgreSQL (Supabase)
   DATABASE_URL="postgresql://user:password@db.xxxxx.supabase.co:5432/postgres"
   
   # PostgreSQL with connection pooling (Supabase)
   DATABASE_URL="postgresql://user:password@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true"
   ```

4. **If you already have DATABASE_URL in another file:**
   - Check if you have `.env` file
   - Copy the DATABASE_URL from there to `.env.local`
   - Or create `.env.local` with the same DATABASE_URL

5. **Restart the backend:**
   ```bash
   # Stop current backend (Ctrl+C)
   # Then restart:
   cd my-store
   npm run dev
   ```

6. **Verify Prisma connection:**
   ```bash
   cd my-store
   npx prisma db push
   ```

## Why This Is Needed

- Next.js reads environment variables from `.env.local` in development
- Prisma needs `DATABASE_URL` to connect to the database
- Without it, `prisma` client is `undefined`, causing "Service temporarily unavailable" errors

## After Setup

Once `DATABASE_URL` is set:
- ✅ Authentication will work
- ✅ User registration will work
- ✅ All database operations will work
- ✅ Mobile app can sign in/sign up

## Security Note

- `.env.local` is in `.gitignore` (should not be committed)
- Never share your DATABASE_URL publicly
- Use different databases for development and production

