# Assets Directory

This directory contains all the visual assets for your mobile app.

## Required Files

Place the following files in this directory:

1. **icon.png** (1024x1024 pixels)
   - App icon for iOS and Android
   - PNG format with transparency

2. **splash.png** (1242x2436 pixels)
   - Splash screen shown when app launches
   - PNG format, portrait orientation

3. **adaptive-icon.png** (1024x1024 pixels)
   - Android adaptive icon
   - PNG format
   - Keep important content in center 66%

4. **favicon.png** (48x48 pixels or larger)
   - Web favicon (if building for web)
   - PNG format

## File Structure

```
assets/
├── icon.png           # 1024x1024 - App icon
├── splash.png         # 1242x2436 - Splash screen
├── adaptive-icon.png  # 1024x1024 - Android adaptive icon
└── favicon.png        # 48x48 - Web favicon
```

## Creating Assets

See `../ASSETS_GUIDE.md` for detailed instructions on creating these assets.

## Notes

- All images should be high quality
- Use PNG format for best results
- Test assets on real devices before publishing
- Expo will automatically generate required sizes from these base images

