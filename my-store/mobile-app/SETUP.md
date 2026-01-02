# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd mobile-app
npm install
```

## Step 2: Configure API Endpoint

Edit `src/config/api.ts` and update the `API_BASE_URL`:

**For local development:**
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://YOUR_LOCAL_IP:3000'  // Replace with your computer's IP
  : 'https://your-production-domain.com';
```

**To find your local IP:**
- **Mac/Linux**: Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: Run `ipconfig` and look for IPv4 Address

**Important**: Make sure your Next.js backend is running on port 3000.

## Step 3: Start Development Server

```bash
npm start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## Step 4: Create App Assets (Before Building)

See `ASSETS_GUIDE.md` for details. You need:
- `assets/icon.png` (1024x1024)
- `assets/splash.png` (1242x2436)
- `assets/adaptive-icon.png` (1024x1024)
- `assets/favicon.png` (48x48)

## Step 5: Update App Configuration

Edit `app.json`:
- Change `bundleIdentifier` (iOS) and `package` (Android) to your unique identifiers
- Update app name, version, etc.

## Step 6: Build for Production

### Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Build
```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

### Submit to Stores
```bash
# Android (Google Play)
eas submit --platform android

# iOS (App Store)
eas submit --platform ios
```

## Troubleshooting

### Can't connect to API
- Make sure Next.js backend is running
- Check firewall settings
- For physical device testing, ensure phone and computer are on same WiFi network
- Use your computer's IP address, not `localhost` or `127.0.0.1`

### Build errors
- Run `npm install` again
- Clear cache: `expo start -c`
- Check `app.json` configuration
- Verify all assets are in place

### iOS build requires
- Apple Developer account ($99/year)
- Xcode installed (Mac only)
- Valid certificates and provisioning profiles

### Android build requires
- Google Play Console account ($25 one-time)
- Valid keystore for signing

## Next Steps

1. Test all features thoroughly
2. Add app icons and splash screens
3. Configure app store listings
4. Set up analytics (optional)
5. Test on real devices
6. Submit to app stores

For detailed information, see `README.md`.

