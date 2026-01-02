# Publishing Guide for Google Play and App Store

This guide will walk you through publishing your Lily Atelier mobile app to both Google Play Store and Apple App Store.

## Prerequisites

### For Both Platforms
- ✅ Completed mobile app development
- ✅ App assets (icons, splash screens) created
- ✅ Production API endpoint configured
- ✅ App tested thoroughly on real devices

### For Google Play Store
- Google Play Console account ($25 one-time registration fee)
- Google account
- App signing key (EAS can generate this automatically)

### For Apple App Store
- Apple Developer Program membership ($99/year)
- Mac computer (for local builds, though EAS can build in cloud)
- Apple ID

## Step 1: Prepare Your App

### 1.1 Update App Configuration

Edit `app.json`:

```json
{
  "expo": {
    "name": "Lily Atelier",
    "slug": "lily-atelier",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.lilyatelier",  // Change this!
      "buildNumber": "1.0.0"
    },
    "android": {
      "package": "com.yourcompany.lilyatelier",  // Change this!
      "versionCode": 1
    }
  }
}
```

**Important**: 
- Bundle identifier (iOS) and package name (Android) must be unique
- Use reverse domain notation: `com.yourcompany.appname`
- These cannot be changed after publishing

### 1.2 Create App Assets

See `ASSETS_GUIDE.md` for detailed instructions. You need:
- App icon (1024x1024)
- Splash screen (1242x2436)
- Android adaptive icon (1024x1024)
- Favicon (48x48)

### 1.3 Configure Production API

Update `src/config/api.ts`:

```typescript
export const API_BASE_URL = 'https://your-production-domain.com';
```

## Step 2: Set Up EAS (Expo Application Services)

### 2.1 Install EAS CLI

```bash
npm install -g eas-cli
```

### 2.2 Login to Expo

```bash
eas login
```

### 2.3 Configure EAS

```bash
eas build:configure
```

This creates/updates `eas.json` with build profiles.

### 2.4 Link Your Project

```bash
eas build:configure
```

This will ask for your Expo account details and link the project.

## Step 3: Build Your App

### 3.1 Build for Android

**Preview Build (APK for testing):**
```bash
eas build --platform android --profile preview
```

**Production Build (AAB for Play Store):**
```bash
eas build --platform android --profile production
```

### 3.2 Build for iOS

**Production Build:**
```bash
eas build --platform ios --profile production
```

**Note**: First iOS build will require:
- Apple Developer account credentials
- App Store Connect API key (recommended) or App-Specific Password

## Step 4: Publish to Google Play Store

### 4.1 Create Google Play Console Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay the $25 registration fee (one-time)
3. Complete account setup

### 4.2 Create Your App

1. Click "Create app"
2. Fill in:
   - App name: "Lily Atelier"
   - Default language: English
   - App or game: App
   - Free or paid: Choose your model
   - Declarations: Accept terms

### 4.3 Complete Store Listing

**Required Information:**
- App name
- Short description (80 characters)
- Full description (4000 characters)
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots:
  - Phone: At least 2, up to 8 (16:9 or 9:16)
  - Tablet: Optional
- Category
- Contact details
- Privacy policy URL (required)

**Screenshots Tips:**
- Show key features
- Use real device screenshots
- Highlight unique features
- Show different screens (home, product, cart, etc.)

### 4.4 Set Up App Content

1. **Content Rating**: Complete questionnaire
2. **Target Audience**: Set age restrictions
3. **Data Safety**: Declare data collection practices
4. **Ads**: Declare if you show ads

### 4.5 Upload Your App

**Option 1: Using EAS Submit (Recommended)**
```bash
eas submit --platform android
```

This will:
- Upload your AAB file
- Guide you through Play Console setup
- Handle signing automatically

**Option 2: Manual Upload**
1. Download your AAB from EAS build page
2. Go to Play Console → Your App → Production → Create new release
3. Upload the AAB file
4. Add release notes
5. Review and roll out

### 4.6 Submit for Review

1. Complete all required sections (marked with ⚠️)
2. Review app information
3. Click "Start rollout to Production"
4. Wait for review (usually 1-3 days)

## Step 5: Publish to Apple App Store

### 5.1 Create Apple Developer Account

1. Go to [Apple Developer](https://developer.apple.com)
2. Enroll in Apple Developer Program ($99/year)
3. Complete enrollment process

### 5.2 Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: "Lily Atelier"
   - Primary Language: English
   - Bundle ID: Select or create (must match app.json)
   - SKU: Unique identifier (e.g., "lily-atelier-001")
   - User Access: Full Access

### 5.3 Complete App Information

**App Information:**
- Category: Shopping
- Subcategory: (optional)
- Privacy Policy URL (required)

**Pricing and Availability:**
- Price: Free or set price
- Availability: Select countries

### 5.4 Prepare Store Listing

**Required:**
- App name (30 characters)
- Subtitle (30 characters)
- Promotional text (170 characters, optional)
- Description (4000 characters)
- Keywords (100 characters)
- Support URL
- Marketing URL (optional)
- App icon (1024x1024)
- Screenshots:
  - iPhone 6.7" (1290x2796) - Required
  - iPhone 6.5" (1242x2688) - Required
  - iPhone 5.5" (1242x2208) - Optional
  - iPad Pro 12.9" (2048x2732) - Optional
- App Preview videos (optional but recommended)

**Screenshots Tips:**
- Use real device screenshots
- Show key features
- First screenshot is most important
- Use different screens for variety

### 5.4 Submit Your App

**Using EAS Submit:**
```bash
eas submit --platform ios
```

This will:
- Upload your IPA file
- Guide you through App Store Connect
- Handle certificates automatically

**Manual Submission:**
1. Download IPA from EAS build page
2. Use Transporter app or Xcode to upload
3. Go to App Store Connect → Your App → Version
4. Select build
5. Add version information
6. Submit for review

### 5.5 Submit for Review

1. Complete all required information
2. Answer export compliance questions
3. Add review notes (if needed)
4. Submit for review
5. Wait for review (usually 1-3 days, can be longer)

## Step 6: Post-Publishing

### 6.1 Monitor Reviews

- Respond to user reviews
- Address common issues
- Update app based on feedback

### 6.2 Update Your App

When you need to update:

1. **Update version numbers** in `app.json`:
   ```json
   {
     "version": "1.0.1",  // User-facing version
     "ios": { "buildNumber": "1.0.1" },
     "android": { "versionCode": 2 }
   }
   ```

2. **Build new version:**
   ```bash
   eas build --platform android --profile production
   eas build --platform ios --profile production
   ```

3. **Submit update:**
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

### 6.3 Analytics

Consider adding:
- Firebase Analytics
- App Store Connect Analytics
- Custom analytics solutions

## Common Issues and Solutions

### Android

**Issue**: "Package name already exists"
- Solution: Change package name in `app.json` to something unique

**Issue**: "Upload failed"
- Solution: Check file size (max 150MB for APK, 2GB for AAB expansion files)

**Issue**: "App rejected"
- Solution: Review rejection reason, fix issues, resubmit

### iOS

**Issue**: "Bundle ID not found"
- Solution: Create bundle ID in Apple Developer portal first

**Issue**: "Missing compliance"
- Solution: Answer export compliance questions in App Store Connect

**Issue**: "App rejected"
- Solution: Review App Review Guidelines, fix issues, appeal if needed

## Timeline Expectations

- **Google Play**: 1-3 days for review
- **Apple App Store**: 1-3 days (can be longer for first submission)
- **Updates**: Usually faster, 1-2 days

## Costs

- **Google Play**: $25 one-time registration
- **Apple App Store**: $99/year developer program
- **EAS Build**: Free tier available, paid plans for more builds

## Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)

## Checklist Before Publishing

- [ ] App tested on real devices
- [ ] All features working correctly
- [ ] API endpoints configured for production
- [ ] App icons and splash screens added
- [ ] App.json configured with unique identifiers
- [ ] Privacy policy URL ready
- [ ] Store listing content prepared
- [ ] Screenshots taken
- [ ] App description written
- [ ] Support email configured
- [ ] Terms of service (if applicable)
- [ ] Privacy policy published

Good luck with your app launch! 🚀

