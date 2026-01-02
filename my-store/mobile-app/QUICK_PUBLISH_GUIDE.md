# 🚀 Quick Publishing Guide - Google Play & App Store

## ⚡ Quick Start Checklist

### ✅ Before You Start

1. **Update `app.json`** - Make sure bundle identifiers are unique:
   ```json
   {
     "ios": {
       "bundleIdentifier": "com.yourcompany.lilyatelier"  // Change this!
     },
     "android": {
       "package": "com.yourcompany.lilyatelier"  // Change this!
     }
   }
   ```

2. **Create App Assets** (if not done):
   - App icon: `assets/icon.png` (1024x1024px)
   - Splash screen: `assets/splash.png` (1242x2436px)
   - Android adaptive icon: `assets/Android-Adaptive-Icon.png` (1024x1024px)

3. **Update Production API URL**:
   - Edit `src/services/api.ts` or `src/config/api.ts`
   - Set to your production backend URL

---

## 📱 GOOGLE PLAY STORE

### Step 1: Create Google Play Console Account
1. Go to: https://play.google.com/console
2. Sign in with Google account
3. Pay $25 one-time registration fee
4. Complete account setup

### Step 2: Install EAS CLI & Build
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS (if not done)
cd mobile-app
eas build:configure

# Build for Android (Production)
eas build --platform android --profile production
```

**Wait for build to complete** (15-30 minutes). You'll get a download link.

### Step 3: Create App in Play Console
1. Go to [Play Console](https://play.google.com/console)
2. Click **"Create app"**
3. Fill in:
   - **App name**: "Lily Atelier"
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free (or your choice)
   - Accept declarations

### Step 4: Complete Store Listing

**Required Information:**
- **App name**: Lily Atelier
- **Short description** (80 chars): "Premium fashion e-commerce platform with AI-powered shopping assistant"
- **Full description** (4000 chars): Write detailed description
- **App icon**: 512x512px PNG
- **Feature graphic**: 1024x500px PNG
- **Screenshots**: 
  - Phone: At least 2 screenshots (16:9 or 9:16 ratio)
  - Recommended: 4-8 screenshots showing different screens
- **Category**: Shopping
- **Privacy policy URL**: Required! (e.g., https://yourdomain.com/privacy)
- **Contact email**: Your support email

**Screenshot Requirements:**
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- Format: PNG or JPEG
- Size: 16:9 or 9:16 aspect ratio
- Recommended sizes: 1080x1920 or 1920x1080

### Step 5: Set Up App Content
1. **Content Rating**: Complete questionnaire (usually takes 5 minutes)
2. **Target Audience**: Set age restrictions
3. **Data Safety**: Declare what data you collect
4. **Ads**: Declare if you show ads (probably "No" for this app)

### Step 6: Upload & Submit

**Option A: Using EAS Submit (Easiest)**
```bash
eas submit --platform android
```
Follow the prompts to connect your Google Play Console account.

**Option B: Manual Upload**
1. Download the AAB file from EAS build page
2. Go to Play Console → Your App → **Production** → **Create new release**
3. Upload the AAB file
4. Add **Release notes** (what's new in this version)
5. Click **Review** → **Start rollout to Production**

### Step 7: Submit for Review
1. Make sure all sections are complete (no ⚠️ warnings)
2. Click **"Start rollout to Production"**
3. Wait for review: **1-3 days**

---

## 🍎 APPLE APP STORE

### Step 1: Create Apple Developer Account
1. Go to: https://developer.apple.com
2. Click **"Enroll"** in Apple Developer Program
3. Pay **$99/year** subscription
4. Complete enrollment (may take 24-48 hours for approval)

### Step 2: Create App in App Store Connect
1. Go to: https://appstoreconnect.apple.com
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in:
   - **Platform**: iOS
   - **Name**: "Lily Atelier"
   - **Primary Language**: English
   - **Bundle ID**: Create new or select existing (must match `app.json`)
   - **SKU**: Unique identifier (e.g., "lily-atelier-ios-001")
   - **User Access**: Full Access

### Step 3: Build for iOS
```bash
# Build for iOS (Production)
eas build --platform ios --profile production
```

**First time setup:**
- EAS will ask for Apple Developer credentials
- You'll need to create an App Store Connect API key:
  1. Go to App Store Connect → Users and Access → Keys
  2. Create new API key
  3. Download the `.p8` file
  4. Provide key ID and issuer ID to EAS

**Wait for build** (20-40 minutes)

### Step 4: Complete App Information

**App Information:**
- **Category**: Shopping
- **Privacy Policy URL**: Required! (e.g., https://yourdomain.com/privacy)
- **Support URL**: Your support page
- **Marketing URL**: Optional

**Pricing and Availability:**
- **Price**: Free (or set price)
- **Availability**: Select countries (or all)

### Step 5: Prepare Store Listing

**Required Screenshots:**
- **iPhone 6.7"** (1290x2796px) - **REQUIRED** - At least 1
- **iPhone 6.5"** (1242x2688px) - **REQUIRED** - At least 1
- **iPhone 5.5"** (1242x2208px) - Optional
- **iPad Pro 12.9"** (2048x2732px) - Optional

**App Information:**
- **App name** (30 chars): "Lily Atelier"
- **Subtitle** (30 chars): "Premium Fashion Shopping"
- **Description** (4000 chars): Write detailed description
- **Keywords** (100 chars): "fashion, shopping, ecommerce, clothing"
- **Promotional text** (170 chars, optional): Marketing text
- **App icon**: 1024x1024px PNG (no transparency, no rounded corners)

**Screenshot Tips:**
- Use real device screenshots
- First screenshot is most important
- Show key features
- Use different screens for variety

### Step 6: Submit Your App

**Option A: Using EAS Submit (Easiest)**
```bash
eas submit --platform ios
```
Follow prompts to connect App Store Connect.

**Option B: Manual Submission**
1. Download IPA from EAS build page
2. Use **Transporter** app (Mac) or **Xcode** to upload
3. Go to App Store Connect → Your App → **Version**
4. Select the uploaded build
5. Complete version information
6. Submit for review

### Step 7: Submit for Review
1. Complete all required information
2. Answer **Export Compliance** questions:
   - Uses encryption? Usually "Yes" (HTTPS)
   - Select "App uses standard encryption"
3. Add **Review Notes** (if needed):
   - Test account credentials
   - Special instructions
4. Click **"Submit for Review"**
5. Wait for review: **1-3 days** (can be longer for first submission)

---

## 📋 Required Assets Checklist

### Google Play Store
- [ ] App icon: 512x512px
- [ ] Feature graphic: 1024x500px
- [ ] Phone screenshots: 2-8 images (16:9 or 9:16)
- [ ] Privacy policy URL (live website)
- [ ] Support email address

### Apple App Store
- [ ] App icon: 1024x1024px (PNG, no transparency)
- [ ] iPhone 6.7" screenshots: 1290x2796px (at least 1)
- [ ] iPhone 6.5" screenshots: 1242x2688px (at least 1)
- [ ] Privacy policy URL (live website)
- [ ] Support URL (live website)

---

## 🔧 Common Commands

### Build Commands
```bash
# Android Preview (APK for testing)
eas build --platform android --profile preview

# Android Production (AAB for Play Store)
eas build --platform android --profile production

# iOS Production
eas build --platform ios --profile production
```

### Submit Commands
```bash
# Submit to Google Play
eas submit --platform android

# Submit to App Store
eas submit --platform ios
```

### Check Build Status
```bash
# List all builds
eas build:list

# View specific build
eas build:view [BUILD_ID]
```

---

## ⚠️ Important Notes

### Bundle Identifiers
- **iOS Bundle ID**: `com.yourcompany.lilyatelier` (must be unique, cannot change)
- **Android Package**: `com.yourcompany.lilyatelier` (must be unique, cannot change)
- Use reverse domain notation: `com.yourcompany.appname`

### Version Numbers
- **Version** (user-facing): `1.0.0`, `1.0.1`, `1.1.0`, etc.
- **iOS buildNumber**: Must increment with each build
- **Android versionCode**: Must increment with each build

### Privacy Policy
- **Required for both stores**
- Must be publicly accessible URL
- Should cover: data collection, usage, storage, sharing

### Testing
- Test on real devices before submitting
- Test all major features
- Test checkout flow
- Test payment processing (use test mode)

---

## 💰 Costs

- **Google Play**: $25 one-time registration
- **Apple App Store**: $99/year developer program
- **EAS Build**: Free tier available (limited builds/month)
  - Paid: $29/month for more builds

---

## 📞 Support Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **EAS Submit Docs**: https://docs.expo.dev/submit/introduction/
- **Google Play Help**: https://support.google.com/googleplay/android-developer
- **App Store Connect Help**: https://help.apple.com/app-store-connect/

---

## 🎯 Timeline

- **Google Play Review**: 1-3 days
- **Apple App Store Review**: 1-3 days (first submission may take longer)
- **Updates**: Usually faster, 1-2 days

---

## ✅ Final Checklist Before Submitting

- [ ] App tested on real devices (iOS & Android)
- [ ] All features working correctly
- [ ] Production API configured
- [ ] App icons and splash screens added
- [ ] Unique bundle identifiers set
- [ ] Privacy policy URL ready and live
- [ ] Store listing content prepared
- [ ] Screenshots taken and optimized
- [ ] App description written
- [ ] Support email configured
- [ ] Version numbers set correctly

**Good luck with your app launch! 🚀**

