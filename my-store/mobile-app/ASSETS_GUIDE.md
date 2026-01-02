# Assets Guide

Before building your app for production, you need to create the following assets:

## Required Assets

### 1. App Icon (`assets/icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Requirements**:
  - Square image
  - No rounded corners (Expo will add them)
  - High quality, scalable design
  - Should work well at small sizes

### 2. Splash Screen (`assets/splash.png`)
- **Size**: 1242x2436 pixels (iPhone X/11/12/13/14 Pro Max size)
- **Format**: PNG
- **Requirements**:
  - Portrait orientation
  - Should include your app logo/branding
  - Background color should match your app theme
  - **Note**: You only need ONE splash screen image. Expo automatically generates all required sizes for different iOS and Android devices from this single image.

### 3. Android Adaptive Icon (`assets/adaptive-icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Requirements**:
  - Square image
  - Safe zone: Keep important content within 66% of the center
  - Background color will show in the outer 33%

### 4. Web Favicon (`assets/favicon.png`)
- **Size**: 48x48 pixels (or larger, will be scaled)
- **Format**: PNG
- **Requirements**:
  - Simple, recognizable icon
  - Works well at small sizes

## Creating Assets

### Option 1: Manual Creation
1. Use design tools like Figma, Sketch, or Adobe Illustrator
2. Export at the required sizes
3. Place files in the `assets/` directory

### Option 2: Online Tools
- [AppIcon.co](https://www.appcon.co/) - Generate all icon sizes from one image
- [IconKitchen](https://icon.kitchen/) - Android adaptive icon generator
- [Favicon.io](https://favicon.io/) - Generate favicons

### Option 3: Expo Asset Generator
You can use Expo's built-in tools or third-party packages to generate assets automatically.

## Asset Guidelines

### App Icon Best Practices
- Use simple, recognizable designs
- Avoid text (it won't be readable at small sizes)
- Use high contrast colors
- Test how it looks at different sizes
- Consider both light and dark backgrounds

### Splash Screen Best Practices
- Keep it simple and fast-loading
- Include your app logo
- Use your brand colors
- Avoid too much detail
- Make it consistent with your app's design

## File Structure

After creating your assets, your `assets/` directory should look like:

```
assets/
├── icon.png           # 1024x1024
├── splash.png         # 1242x2436
├── adaptive-icon.png  # 1024x1024
└── favicon.png        # 48x48
```

## Testing Assets

After adding your assets:
1. Run `expo start` to see how they look
2. Test on both iOS and Android simulators/emulators
3. Verify icons look good at different sizes
4. Check splash screen displays correctly

## Updating Assets

If you need to update assets:
1. Replace the files in the `assets/` directory
2. Clear cache: `expo start -c`
3. Rebuild if you've already built the app

