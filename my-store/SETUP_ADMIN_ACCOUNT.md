# Setup Admin Account

## How Admin Works

When you register a new account, if the email matches `ADMIN_EMAIL` from your environment variables, you automatically become an **ADMIN**.

## Current Setup

Your admin email is configured as: `nascode.dev@gmail.com`

This means:
- ✅ Any user who registers with `nascode.dev@gmail.com` will be an ADMIN
- ❌ The existing account already has this email, but password is unknown

## Solution: Reset Admin Account

### Step 1: Delete Existing Admin User

**Option A: Using Prisma Studio (Easiest)**
```powershell
# In a NEW terminal (keep dev server running)
npx prisma studio
```

Then:
1. Browser opens at `http://localhost:5555`
2. Click on **"User"** table
3. Find user with email: `nascode.dev@gmail.com`
4. Click the **delete button** (trash icon)
5. Confirm deletion

**Option B: Using SQL (Advanced)**
Connect to Supabase and run:
```sql
DELETE FROM "User" WHERE email = 'nascode.dev@gmail.com';
```

### Step 2: Create New Admin Account

1. Go to your app: `http://localhost:3000/login`
2. Click **"Need an account?"** to switch to register mode
3. Enter:
   - **Email**: `nascode.dev@gmail.com` (must match ADMIN_EMAIL)
   - **Password**: (choose any password you want)
   - **Name**: (optional)
4. Click **"Create account"**

### Step 3: Verify Admin Status

After creating the account:
- You'll be automatically logged in
- You'll be redirected to `/admin/users` (admin dashboard)
- Your role will be **ADMIN**

## Important Notes

- ✅ The email **must match** `ADMIN_EMAIL` in `.env.local` to become admin
- ✅ Only the **first user** with that email gets admin (if multiple exist, only first one)
- ✅ You can check your role in the admin dashboard
- ✅ Admin users can access `/admin/*` routes

## Change Admin Email

If you want to use a different email as admin:

1. Edit `.env.local`:
   ```
   ADMIN_EMAIL="your-new-admin@email.com"
   ```

2. Restart your dev server

3. Register with the new email

## Troubleshooting

**Not getting admin role?**
- Check that `ADMIN_EMAIL` in `.env.local` matches the email you registered with
- Make sure you're the first user with that email
- Check server logs for any errors

**Can't access admin routes?**
- Make sure you're logged in
- Verify your role is ADMIN (check in Prisma Studio or admin dashboard)
- Check that admin routes exist: `/admin/users`, `/admin/risk-review`

