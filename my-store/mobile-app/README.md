# Lily Atelier Mobile App

A React Native mobile application built with Expo for iOS and Android, connecting to your existing Next.js e-commerce backend.

## 📱 Features

- **Product Browsing**: Browse products by category (Men's, Women's, Abaya, Perfumes)
- **Shopping Cart**: Add items, manage quantities, and proceed to checkout
- **User Authentication**: Sign in/Sign up with email and password
- **Profile Management**: View and update user profile
- **Order Management**: Place orders and track order history
- **Delivery Addresses**: Manage multiple delivery addresses
- **Payment Integration**: Secure checkout flow
- **Multi-Currency Support**: Automatic currency conversion based on location
- **Responsive Design**: Optimized for both iOS and Android

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI installed globally: `npm install -g expo-cli`
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Physical device with Expo Go app (optional, for testing)

### Installation

1. **Navigate to the mobile app directory:**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   
   Open `src/config/api.ts` and update the `API_BASE_URL`:
   ```typescript
   export const API_BASE_URL = __DEV__
     ? 'http://YOUR_LOCAL_IP:3000' // For local development
     : 'https://your-production-domain.com'; // For production
   ```
   
   **Important for local testing:** Replace `YOUR_LOCAL_IP` with your computer's local IP address (e.g., `192.168.1.100`). You can find it by:
   - Mac/Linux: Run `ifconfig` or `ip addr`
   - Windows: Run `ipconfig`
   
   Make sure your Next.js backend is running and accessible from your device/emulator.

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Run on device/emulator:**
   - **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
   - **Android Emulator**: Press `a` in the terminal or run `npm run android`
   - **Physical Device**: Scan the QR code with Expo Go app (iOS) or Expo Go app (Android)

## 📦 Building for Production

### Prerequisites for Building

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Create an Expo account:**
   ```bash
   eas login
   ```

3. **Configure your project:**
   ```bash
   eas build:configure
   ```

### Building for Android

1. **Update `app.json`:**
   - Set your Android package name: `com.yourcompany.lilyatelier`
   - Update version code and version name

2. **Build APK (for testing):**
   ```bash
   eas build --platform android --profile preview
   ```

3. **Build AAB (for Google Play Store):**
   ```bash
   eas build --platform android --profile production
   ```

4. **Submit to Google Play Store:**
   ```bash
   eas submit --platform android
   ```

### Building for iOS

1. **Update `app.json`:**
   - Set your iOS bundle identifier: `com.yourcompany.lilyatelier`
   - Update build number and version

2. **Build for iOS:**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store:**
   ```bash
   eas submit --platform ios
   ```

## 🎨 App Icons and Splash Screens

Before building for production, you need to add app icons and splash screens:

1. **Create the following assets:**
   - `assets/icon.png` - 1024x1024px app icon
   - `assets/splash.png` - 1242x2436px splash screen
   - `assets/adaptive-icon.png` - 1024x1024px Android adaptive icon
   - `assets/favicon.png` - 48x48px web favicon

2. **Generate icons automatically (optional):**
   ```bash
   npx expo install @expo/vector-icons
   ```

   Or use an online tool like [AppIcon.co](https://www.appicon.co/) to generate all required sizes.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `mobile-app` directory (optional, for environment-specific configs):

```env
API_BASE_URL=https://your-api-domain.com
```

### App Configuration

Edit `app.json` to customize:
- App name and slug
- Bundle identifier / Package name
- Version numbers
- Permissions
- App icons and splash screens

## 📱 Testing

### Local Testing

1. **Start your Next.js backend:**
   ```bash
   cd .. # Go back to my-store directory
   npm run dev
   ```

2. **Start the mobile app:**
   ```bash
   cd mobile-app
   npm start
   ```

3. **Test on device/emulator:**
   - Make sure both devices are on the same network
   - Update `API_BASE_URL` in `src/config/api.ts` with your local IP

### Production Testing

1. Deploy your Next.js backend to production
2. Update `API_BASE_URL` in `src/config/api.ts` with production URL
3. Build and test the app using EAS Build

## 🚢 Publishing to App Stores

### Google Play Store

1. **Create a Google Play Console account** (one-time $25 fee)

2. **Prepare store listing:**
   - App name, description, screenshots
   - Privacy policy URL
   - App icon and feature graphic

3. **Build and submit:**
   ```bash
   eas build --platform android --profile production
   eas submit --platform android
   ```

4. **Complete store listing in Google Play Console**

### Apple App Store

1. **Create an Apple Developer account** ($99/year)

2. **Prepare store listing:**
   - App name, description, screenshots
   - Privacy policy URL
   - App icon

3. **Build and submit:**
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

4. **Complete store listing in App Store Connect**

## 📂 Project Structure

```
mobile-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx     # Home screen
│   │   ├── categories.tsx # Product categories
│   │   ├── cart.tsx      # Shopping cart
│   │   └── account.tsx   # User account
│   ├── login.tsx         # Login/Register
│   ├── product/[id].tsx  # Product detail
│   ├── checkout.tsx      # Checkout flow
│   └── _layout.tsx       # Root layout
├── src/
│   ├── config/           # Configuration files
│   │   └── api.ts        # API configuration
│   ├── services/         # API services
│   │   └── api.ts        # API client
│   ├── stores/           # State management
│   │   ├── authStore.ts # Authentication state
│   │   └── cartStore.ts # Cart state
│   └── types/            # TypeScript types
│       └── index.ts     # Type definitions
├── assets/               # Images, fonts, etc.
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## 🔐 Security Notes

- API authentication uses secure headers (`x-user-id`, `x-user-email`)
- User credentials are stored securely using `expo-secure-store`
- Cart data is persisted locally using AsyncStorage
- All API calls are made over HTTPS in production

## 🐛 Troubleshooting

### Common Issues

1. **API connection errors:**
   - Check that your Next.js backend is running
   - Verify `API_BASE_URL` is correct
   - For local testing, use your computer's IP address, not `localhost`

2. **Build errors:**
   - Make sure all dependencies are installed: `npm install`
   - Clear cache: `expo start -c`
   - Check that `app.json` is properly configured

3. **iOS build issues:**
   - Ensure you have an Apple Developer account
   - Check bundle identifier is unique
   - Verify certificates and provisioning profiles

4. **Android build issues:**
   - Check package name is unique
   - Verify keystore is properly configured
   - Check Google Play Console setup

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Expo and React Native documentation
3. Check your Next.js backend logs for API errors

## 📄 License

Same license as the main project.

---

**Built with ❤️ using React Native, Expo, and TypeScript**

