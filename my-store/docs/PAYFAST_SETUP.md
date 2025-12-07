# PayFast Setup Guide

## Environment Variables

Create or update your `.env.local` file with the following PayFast configuration:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID="29096901"
PAYFAST_MERCHANT_KEY="e5rwnchb6wocv"
PAYFAST_PASSPHRASE="Nascode103_GITHUB"
PAYFAST_SANDBOX="true"  # Set to "false" for production

# Site URL (update after hosting)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## After Hosting Your Web App

1. **Update Site URL:**
   - Change `NEXT_PUBLIC_SITE_URL` to your production URL (e.g., `https://yourdomain.com`)

2. **Configure PayFast Dashboard:**
   - Log in to your PayFast merchant dashboard
   - Go to **Settings > Integration**
   - Set **Notify URL** to: `https://yourdomain.com/api/payfast/notify`
   - Enable **Instant Transaction Notification (ITN)**

3. **Security Passphrase:**
   - ✅ Passphrase is already configured: `Nascode103_GITHUB`
   - Make sure this matches the passphrase in your PayFast dashboard

4. **Switch to Production:**
   - Set `PAYFAST_SANDBOX="false"` in your `.env.local`
   - Restart your application

## Testing

- Use `PAYFAST_SANDBOX="true"` for testing
- PayFast sandbox allows you to test payments without real transactions
- Test the complete flow: add items to cart → checkout → PayFast payment page

## Current Configuration

- **Merchant ID:** 29096901
- **Merchant Key:** e5rwnchb6wocv
- **Passphrase:** Nascode103_GITHUB
- **Web URL:** To be configured after hosting

> ⚠️ **Security Note:** Keep your passphrase secure. Never commit it to version control. The `.env.local` file should be in your `.gitignore`.

