# Fix Connection Pool Timeout Error

## Problem

You're seeing this error:
```
Timed out fetching a new connection from the connection pool.
More info: http://pris.ly/d/connection-pool
(Current connection pool timeout: 10, connection limit: 5)
```

This happens when:
- Too many concurrent database requests
- Connections are not being released properly
- Connection pool size is too small
- Connection timeout is too short

## Solution

### 1. Updated Prisma Configuration

The `src/lib/prisma.ts` file has been updated to:
- Increase connection pool size to 20 (from default 5)
- Increase connection timeout to 30 seconds (from 10)
- Add `pool_timeout` parameter
- Properly configure `pgbouncer=true` for Supabase

### 2. Updated Login Route

The login route now includes:
- Query timeout wrapper (25 seconds)
- Better error handling for connection pool timeouts
- User-friendly error messages

### 3. Update Your DATABASE_URL

Your `DATABASE_URL` should include these parameters when using Supabase Connection Pooling:

```
postgresql://postgres.xxx:password@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=30&pool_timeout=30&connection_limit=20
```

**Note**: The code automatically adds these parameters if your URL contains "pooler", but you can also add them manually.

### 4. Supabase Connection Pool Limits

Supabase allows:
- **Transaction Pooler** (port 6543): Up to 200 connections
- **Session Pooler** (port 5432): Up to 200 connections

The code now requests 20 connections, which should be sufficient for most applications.

### 5. If Issues Persist

If you still see connection pool timeouts:

1. **Check Supabase Dashboard**:
   - Go to your Supabase project
   - Check Database → Connection Pooling
   - Verify your pooler is active

2. **Increase Pool Size**:
   - Edit `src/lib/prisma.ts`
   - Change `connection_limit` from `20` to `50` or higher
   - Note: Don't exceed 200 (Supabase limit)

3. **Check for Connection Leaks**:
   - Ensure all Prisma queries are properly awaited
   - Don't create multiple Prisma clients
   - Use the singleton pattern (already implemented)

4. **Use Direct Connection for Development**:
   - For local development, you can use direct connection (port 5432)
   - This bypasses the pooler and gives you more connections
   - **Warning**: Don't use direct connection in production (serverless)

### 6. Environment Variables

Make sure your `.env.local` has:
```env
DATABASE_URL=postgresql://postgres.xxx:password@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
```

The code will automatically add the necessary parameters.

## Testing

After updating, test the login:
1. Try logging in
2. If you see "Service is busy", wait a few seconds and try again
3. The connection pool should now handle more concurrent requests

## Monitoring

To monitor connection pool usage:
1. Check Supabase Dashboard → Database → Connection Pooling
2. Look for active connections
3. If you see many idle connections, you may have connection leaks

## Best Practices

1. **Use Connection Pooling in Production**: Always use the pooler (port 6543) in production
2. **Don't Create Multiple Clients**: Use the singleton pattern (already done)
3. **Release Connections**: Prisma automatically releases connections, but ensure queries complete
4. **Handle Errors Gracefully**: The code now handles connection pool errors with user-friendly messages
5. **Monitor Pool Usage**: Keep an eye on connection pool metrics in Supabase

