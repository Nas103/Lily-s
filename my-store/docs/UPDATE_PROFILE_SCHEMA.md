# Update Database Schema for Profile Information

## Overview

The database schema has been updated to store additional user information including:
- Phone number
- Date of birth
- Address information (country, city, postcode, address lines)
- Profile visibility settings
- Communication preferences (email, SMS, marketing)

## Steps to Update Database

### 1. Push Schema Changes to Database

Run the following command to update your database schema:

```bash
npx prisma db push
```

This will:
- Add new columns to the `User` table
- Preserve existing user data
- Set default values for new fields

### 2. Generate Prisma Client

After pushing the schema, regenerate the Prisma client:

```bash
npx prisma generate
```

### 3. Verify Changes

You can verify the changes by:

1. **Using Prisma Studio:**
   ```bash
   npm run db:studio
   ```
   Then check the `User` table to see the new fields.

2. **Check the schema file:**
   Open `prisma/schema.prisma` and verify the `User` model has all the new fields.

## New Fields Added

### Personal Information
- `phone` (String?) - User's phone number
- `dateOfBirth` (DateTime?) - User's date of birth
- `name` (String?) - Already existed, now can be updated via profile

### Address Information
- `country` (String?) - User's country
- `city` (String?) - User's city
- `postcode` (String?) - User's postal code
- `addressLine1` (String?) - Primary address line
- `addressLine2` (String?) - Secondary address line (apartment, suite, etc.)

### Preferences
- `profileVisibility` (String?) - Profile visibility setting (PRIVATE, SOCIAL, PUBLIC)
- `locationSharing` (Boolean) - Whether to share location (default: false)
- `emailNotifications` (Boolean) - Email notification preference (default: true)
- `smsNotifications` (Boolean) - SMS notification preference (default: false)
- `marketingEmails` (Boolean) - Marketing email preference (default: false)

### Timestamps
- `updatedAt` (DateTime) - Automatically updated when user record changes

## API Endpoints

### GET /api/profile
Get user profile information.

**Headers:**
- `x-user-id`: User ID
- `x-user-email`: User email

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "country": "US",
  "city": "New York",
  "postcode": "10001",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "profileVisibility": "PRIVATE",
  "locationSharing": false,
  "emailNotifications": true,
  "smsNotifications": false,
  "marketingEmails": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PATCH /api/profile
Update user profile information.

**Headers:**
- `x-user-id`: User ID
- `x-user-email`: User email
- `Content-Type`: application/json

**Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "country": "US",
  "city": "New York",
  "postcode": "10001",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "profileVisibility": "PRIVATE",
  "locationSharing": false,
  "emailNotifications": true,
  "smsNotifications": false,
  "marketingEmails": false
}
```

**Note:** All fields are optional. Only include fields you want to update.

### PATCH /api/profile/password
Update user password.

**Headers:**
- `x-user-id`: User ID
- `x-user-email`: User email
- `Content-Type`: application/json

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Usage in Frontend

The profile page (`/profile`) now includes:
- **Profile Section**: View profile information with Gravatar picture
- **Account Details Section**: Form to update personal information and address
- **Other Sections**: Placeholders for future features (Payment Methods, Delivery Addresses, etc.)

Users can:
1. View their profile information
2. Update their name, phone, date of birth
3. Add/update their address
4. Change password (coming soon in Account Details)

## Troubleshooting

### Schema Push Fails

If `npx prisma db push` fails:

1. **Check database connection:**
   - Verify `DATABASE_URL` in `.env.local` is correct
   - Test connection with `npx prisma db execute --stdin`

2. **Check for migration conflicts:**
   - If you have existing migrations, you may need to create a migration instead:
     ```bash
     npx prisma migrate dev --name add_user_profile_fields
     ```

3. **Reset database (⚠️ WARNING: This deletes all data):**
   ```bash
   npx prisma migrate reset
   npx prisma db push
   ```

### API Returns 401 Unauthorized

Make sure you're sending the correct headers:
- `x-user-id`: Must match the logged-in user's ID
- `x-user-email`: Must match the logged-in user's email

These are automatically set by the frontend when using the `useAuth` hook.

## Next Steps

1. ✅ Update database schema
2. ✅ Create API routes
3. ✅ Update profile page with forms
4. 🔄 Add password change functionality to Account Details form
5. 🔄 Add payment methods management
6. 🔄 Add delivery addresses management
7. 🔄 Add communication preferences form

