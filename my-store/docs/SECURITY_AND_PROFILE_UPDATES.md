# Security and Profile Updates

## Overview

This document outlines the comprehensive security enhancements and profile management features that have been implemented.

## ✅ Completed Features

### 1. Profile Address Management
- **Address Fields**: Users can now add and save complete address information:
  - Country/Region
  - City
  - Postcode
  - Address Line 1 (Street address)
  - Address Line 2 (Apartment, suite, etc.)
- **Persistence**: All address data is saved to the database and persists across page refreshes
- **Form Validation**: Client-side and server-side validation for all address fields

### 2. Profile Image Upload
- **Custom Profile Images**: Users can upload custom profile images via URL
- **Fallback to Gravatar**: If no custom image is set, the system automatically uses Gravatar
- **Database Storage**: Profile image URLs are stored in the `User` table (`profileImageUrl` field)
- **Display**: Custom images are shown in:
  - Profile page
  - Navigation header
  - All user-facing components

### 3. Advanced Security Protection

#### SQL Injection Protection
- **Prisma ORM**: All database queries use Prisma, which automatically uses parameterized queries
- **Input Validation**: All user inputs are validated before database operations
- **Type Safety**: TypeScript ensures type safety for all database operations

#### XSS (Cross-Site Scripting) Protection
- **Input Sanitization**: All user inputs are sanitized using `sanitizeInput()` function
- **HTML Escaping**: Removes `<`, `>`, `javascript:`, and event handlers from inputs
- **Content Security Policy**: CSP headers are set on all API responses

#### CSRF (Cross-Site Request Forgery) Protection
- **Origin Verification**: API routes verify request origin in production
- **Header Validation**: Custom headers (`x-user-id`, `x-user-email`) are validated
- **POST/PATCH Protection**: All state-changing operations require CSRF validation

#### Rate Limiting
- **Login**: 5 attempts per 15 minutes
- **Registration**: 3 registrations per hour
- **Profile Updates**: 10 updates per minute
- **Checkout**: 10 checkouts per minute
- **Profile Fetch**: 30 requests per minute
- **Image Upload**: 5 uploads per minute

#### Input Validation
- **Email**: Validates format and length (max 255 characters)
- **Password**: Validates length (8-128 characters)
- **Phone**: Validates international format
- **Date of Birth**: Validates age (13-120 years)
- **Country**: Validates ISO 3166-1 alpha-2 format
- **Postcode**: Validates format and length
- **Text Fields**: Validates length limits (name: 100, address: 200 characters)
- **URLs**: Validates profile image URLs (http, https, data protocols only)

#### Security Headers
All API responses include:
- **Content-Security-Policy**: Restricts resource loading
- **X-XSS-Protection**: Enables browser XSS filtering
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking (DENY)
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

## Database Schema Updates

### New Field Added to User Table
```prisma
profileImageUrl String?  // URL to user's profile image
```

### To Apply Schema Changes

1. **Update Database Schema**:
   ```bash
   npx prisma db push
   ```

2. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

**Note**: If you encounter database connection errors, ensure your `DATABASE_URL` in `.env.local` is correctly configured with the Connection Pooling string from Supabase.

## API Routes Enhanced with Security

### Protected Routes
- `/api/profile` (GET, PATCH)
- `/api/profile/upload` (POST)
- `/api/profile/password` (PATCH)
- `/api/auth/login` (POST)
- `/api/auth/register` (POST)
- `/api/checkout` (POST)

### Security Features Applied
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ Input validation and sanitization
- ✅ Security headers
- ✅ SQL injection protection (via Prisma)
- ✅ XSS protection

## Files Created/Modified

### New Files
- `src/lib/security.ts` - Security utilities (validation, sanitization, rate limiting)
- `src/lib/middleware.ts` - Security middleware for API routes
- `src/lib/getProfileImage.ts` - Profile image URL resolver
- `src/app/api/profile/upload/route.ts` - Profile image upload endpoint
- `src/app/profile/components/ProfileImage.tsx` - Profile image component

### Modified Files
- `prisma/schema.prisma` - Added `profileImageUrl` field
- `src/app/api/profile/route.ts` - Added security middleware and validation
- `src/app/api/auth/login/route.ts` - Added security middleware and validation
- `src/app/api/auth/register/route.ts` - Added security middleware and validation
- `src/app/api/checkout/route.ts` - Added security middleware and validation
- `src/app/profile/components/AccountDetailsForm.tsx` - Added profile image URL field
- `src/app/profile/page.tsx` - Updated to use custom profile images
- `src/components/layout/Header.tsx` - Updated to use custom profile images

## Testing Security

### Manual Testing Checklist

1. **SQL Injection**:
   - Try entering SQL in form fields (e.g., `'; DROP TABLE User; --`)
   - Verify no SQL is executed

2. **XSS Protection**:
   - Try entering `<script>alert('XSS')</script>` in form fields
   - Verify script tags are removed

3. **Rate Limiting**:
   - Try making multiple rapid requests to protected endpoints
   - Verify rate limit responses (429 status code)

4. **CSRF Protection**:
   - Try making requests from different origins
   - Verify origin validation works

5. **Input Validation**:
   - Try submitting invalid data (wrong email format, short passwords, etc.)
   - Verify validation errors are returned

## Production Recommendations

1. **Use Redis for Rate Limiting**: Replace in-memory rate limiting with Redis for production
2. **Add Request Logging**: Log all security events for monitoring
3. **Implement CAPTCHA**: Add CAPTCHA for login/registration after multiple failures
4. **Session Management**: Implement proper session tokens (JWT) instead of header-based auth
5. **HTTPS Only**: Ensure all production traffic uses HTTPS
6. **Security Headers**: Review and adjust CSP headers based on your needs
7. **Regular Security Audits**: Perform regular security audits and penetration testing

## Next Steps

1. Update database schema: `npx prisma db push`
2. Test profile image upload functionality
3. Verify address persistence after page refresh
4. Test all security features
5. Deploy to production

## Support

If you encounter any issues:
1. Check database connection (`DATABASE_URL` in `.env.local`)
2. Verify Prisma client is generated: `npx prisma generate`
3. Check browser console for client-side errors
4. Check server logs for API errors

