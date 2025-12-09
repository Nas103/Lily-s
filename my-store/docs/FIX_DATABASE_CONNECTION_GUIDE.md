# Fix Database Connection - "Tenant or user not found"

## The Problem

You're seeing the error:
```
FATAL: Tenant or user not found
```

This means the database connection string is incorrect. Common causes:
1. **Wrong password** - The password in the connection string doesn't match
2. **Wrong project ID** - The project ID in the connection string is incorrect
3. **Password not URL-encoded** - Special characters in password need encoding
4. **Wrong connection type** - Using direct connection instead of Connection Pooling

## Quick Fix

### Option 1: Use the Fix Script (Recommended)

Run the PowerShell script:
```powershell
.\fix-database-connection.ps1
```

This script will:
- Guide you through getting the correct connection string
- Automatically URL-encode the password
- Add required parameters (`pgbouncer=true`)
- Test the connection

### Option 2: Manual Fix

1. **Get the Connection String from Supabase**:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to **Settings** → **Database**
   - Scroll to **"Connection Pooling"**
   - Select **"Transaction"** mode (port 6543)
   - Copy the connection string

2. **URL-Encode the Password**:
   If your password contains special characters, encode them:
   - `|` → `%7C`
   - `}` → `%7D`
   - `$` → `%24`
   - `#` → `%23`
   - `@` → `%40`
   - `&` → `%26`
   - `=` → `%3D`
   - `+` → `%2B`
   - ` ` (space) → `%20`

3. **Update .env.local**:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[ENCODED_PASSWORD]@aws-1-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=15"
   ```

4. **Test the Connection**:
   ```bash
   node scripts/test-db-connection.js
   ```

## Example

If your Supabase connection string is:
```
postgresql://postgres.zcsosspieuolzswujvpw:mashala1017nudy@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

And your password is `nas|1017}R$`, you need to encode it:
- `|` → `%7C`
- `}` → `%7D`
- `$` → `%24`

So the password becomes: `nas%7C1017%7DR%24`

Final connection string:
```
postgresql://postgres.zcsosspieuolzswujvpw:nas%7C1017%7DR%24@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=15
```

## Verify Your Connection String

Your connection string should:
- ✅ Have `.pooler` in the hostname
- ✅ Use port `6543` (Transaction pooler)
- ✅ Include `pgbouncer=true` parameter
- ✅ Have URL-encoded password if it contains special characters
- ✅ Match your Supabase project ID

## Common Issues

### Issue 1: Password Not Encoded
**Symptom**: Connection fails with "authentication failed" or "Tenant or user not found"

**Fix**: URL-encode special characters in the password

### Issue 2: Wrong Project ID
**Symptom**: "Tenant or user not found"

**Fix**: Verify the project ID in the connection string matches your Supabase project

### Issue 3: Using Direct Connection
**Symptom**: Connection works sometimes but fails randomly

**Fix**: Use Connection Pooling (Transaction pooler, port 6543) instead of direct connection (port 5432)

### Issue 4: Project Paused
**Symptom**: Connection fails immediately

**Fix**: Check if your Supabase project is paused and resume it

## After Fixing

1. **Restart your dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Test login/registration**:
   - Try creating a new account
   - Try logging in

3. **Verify in logs**:
   - You should see successful database queries
   - No more "Tenant or user not found" errors

## Still Having Issues?

1. **Reset Database Password**:
   - Go to Supabase → Settings → Database
   - Reset the database password
   - Get a new connection string

2. **Check Project Status**:
   - Make sure your Supabase project is active
   - Check if it's paused or deleted

3. **Verify Network**:
   - Make sure you can reach Supabase servers
   - Check firewall settings

4. **Contact Support**:
   - If nothing works, contact Supabase support with your project ID

