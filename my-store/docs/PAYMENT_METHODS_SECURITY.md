# Payment Methods - Security Implementation

## Overview

Secure payment method management with PCI DSS compliance best practices. Card numbers are never fully stored, and sensitive data is protected.

## ✅ Security Features

### 1. PCI DSS Compliance
- **Never stores full card numbers** - Only last 4 digits are stored
- **Never stores CVV** - CVV is only validated, never stored
- **Card validation** - Uses Luhn algorithm to validate card numbers
- **Secure storage** - Only safe, non-sensitive data is stored

### 2. Data Stored (Safe)
- ✅ Last 4 digits of card number
- ✅ Card brand (Visa, Mastercard, etc.)
- ✅ Expiry month and year
- ✅ Cardholder name (optional)
- ✅ Payment processor token (optional, encrypted)
- ✅ Default flag

### 3. Data Never Stored (Protected)
- ❌ Full card number
- ❌ CVV (Card Verification Value)
- ❌ PIN
- ❌ Full card details

### 4. Security Measures
- **Input Validation**: All inputs validated before processing
- **Input Sanitization**: All user inputs sanitized
- **Rate Limiting**: 5 requests per minute for payment operations
- **CSRF Protection**: All POST/PATCH/DELETE operations protected
- **Authentication**: All operations require user authentication
- **Authorization**: Users can only access their own payment methods
- **Error Handling**: User-friendly error messages (no sensitive data exposed)

### 5. Card Number Masking
- Display format: `**** **** **** 1234`
- Only last 4 digits visible
- Card brand automatically detected

## Database Schema

### PaymentMethod Model
```prisma
model PaymentMethod {
  id            String   @id @default(uuid())
  userId        String
  type          PaymentType
  cardLast4     String?  // Last 4 digits only
  cardBrand     String?  // Visa, Mastercard, etc.
  expiryMonth   Int?
  expiryYear    Int?
  holderName    String?
  isDefault     Boolean  @default(false)
  processorToken String? // Encrypted token from payment processor
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## API Routes

### GET /api/payment-methods
- Returns all payment methods for authenticated user
- Only returns safe data (never full card numbers)

### POST /api/payment-methods
- Creates a new payment method
- Validates card number using Luhn algorithm
- Validates CVV (but never stores it)
- Stores only last 4 digits
- Rate limited: 5 requests per minute

### PATCH /api/payment-methods/[id]
- Updates payment method (expiry, name, default status)
- Cannot change card number after creation
- Verifies ownership before update

### DELETE /api/payment-methods/[id]
- Deletes payment method
- Verifies ownership before deletion

## Security Utilities

### Card Validation
- `isValidCardNumber()` - Luhn algorithm validation
- `detectCardBrand()` - Automatic brand detection
- `isValidCVV()` - CVV format validation
- `isValidExpiryMonth()` - Month validation (1-12)
- `isValidExpiryYear()` - Year validation (current to +20 years)

### Card Masking
- `maskCardNumber()` - Masks card to show only last 4 digits
- `getLast4Digits()` - Extracts last 4 digits
- `formatCardNumber()` - Formats card number with spaces

## UI Features

### PaymentMethodForm
- Real-time card number formatting
- Automatic card brand detection
- CVV validation (never stored)
- Expiry date validation
- Cardholder name validation

### PaymentMethodList
- Displays masked card numbers
- Shows card brand and expiry
- Default payment method indicator
- Edit/Delete functionality
- Empty state with security message

## Best Practices

1. **Never log card numbers** - Even in development
2. **Never send full card numbers to client** - Only last 4 digits
3. **Validate on both client and server** - Defense in depth
4. **Use HTTPS only** - All payment operations over HTTPS
5. **Rate limit payment operations** - Prevent abuse
6. **Monitor for suspicious activity** - Log security events

## Compliance Notes

- **PCI DSS Level 1**: For full compliance, consider using a payment processor (Stripe, PayPal) that handles card storage
- **Tokenization**: The `processorToken` field can store tokens from payment processors
- **Encryption**: Consider encrypting `processorToken` at rest
- **Audit Logging**: Consider logging payment method operations for compliance

## Next Steps

1. **Update Database Schema**:
   ```bash
   npx prisma db push
   ```

2. **Or manually run SQL**:
   - Copy `add-payment-method-table.sql`
   - Run in Supabase SQL Editor

3. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Test the feature**:
   - Add a payment method
   - Verify only last 4 digits are stored
   - Verify CVV is not stored
   - Test card validation

## Security Checklist

- ✅ Never store full card numbers
- ✅ Never store CVV
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ Authentication required
- ✅ Authorization checks
- ✅ Secure error messages
- ✅ Card number masking in UI
- ✅ Next.js 15+ compliant
- ✅ TypeScript type safety

